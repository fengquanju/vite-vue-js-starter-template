import Axios from 'axios';
import { userTokenStoreHook } from '@/store/modules/userToken';
import { useConfigStoreHook } from '@/store/modules/config';
const configHook = useConfigStoreHook();
import router from '@/router';
const defaultConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    // serialize: CustomParamsSerializer,
  },
};

class PureHttp {
  constructor() {
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  static requests = [];

  /** 防止重复刷新token */
  static isRefreshing = false;

  /** 初始化配置对象 */
  static initConfig = {};

  /** 保存当前Axios实例对象 */
  static axiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  static retryOriginalRequest(config) {
    return new Promise((resolve) => {
      PureHttp.requests.push(() => {
        console.log(token);
        resolve(config);
      });
    });
  }

  /* 响应拦截 */
  httpInterceptorsResponse() {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response) => {
        // response.data.code
        const $config = response.config;
        // 关闭进度条动画
        // NProgress.done();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error) => {
        const currentRoute = router.currentRoute.value.fullPath;
        const Config = configHook.getConfig();
        var originalRequest = error.config;
        console.log('originalRequest', originalRequest);
        let url = originalRequest.url;
        console.log('当前路由', router.currentRoute);
        if (error.response.data.code === 403.12 || error.response.data.code === 403.14) {
          return new Promise((resolve) => {
            userTokenStoreHook()
              .refreshAccessToken()
              .then((res) => {
                let new_headers = {
                  ...originalRequest.headers,
                  'mbcore-access-token': res,
                };
                this.request(
                  'post',
                  url,
                  { data: originalRequest.data },
                  {
                    headers: {
                      ...originalRequest.headers,
                      'mbcore-access-token': res,
                    },
                  },
                ).then((res) => {
                  resolve(res);
                });
              });
          });
        } else if (error.response.data.code === 403.22 || error.response.data.code === 403.21) {
          console.error(error.response.data.msg);
          var auth_token = Config.VLSAuthToken;
          localStorage.removeItem(auth_token);
          console.log('router', router);
          if (currentRoute != '/login') {
            //防止在login 重复跳转
            router.redirect({ path: '/login' });
          }
        }
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        // NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      },
    );
  }

  /** 通用请求工具函数 */
  request(method, url, param, axiosConfig) {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
    };

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  post(url, params, config) {
    return this.request('post', url, params, config);
  }
  //需要登录的接口用这个
  async Ajax(options) {
    const Config = configHook.getConfig();
    const url = options.url || 'undefined';
    const params = options.data || {};
    let access_token = localStorage.getItem(Config.VLSAccessToken);
    if (!access_token) {
      access_token = await userTokenStoreHook().getAccessToken();
    }
    let headers = {
      appid: Config.AppAppid,
      'mbcore-access-token': access_token,
    };
    console.log(options.is_login === true || options.is_login === 'true');
    if (options.is_login === true || options.is_login === 'true') {
      const auth_token = localStorage.getItem(Config.VLSAuthToken);
      if (!auth_token) {
        //如果auth_token不存在，则去登录
        router.replace({ path: '/login' });
      }
      headers = {
        appid: Config.AppAppid,
        'mbcore-access-token': access_token,
        'mbcore-auth-token': auth_token,
      };
      this.post(url, params, { headers });
    } else {
      this.post(url, params, { headers });
    }
  }
  /** 单独抽离的get工具函数 */
  get(url, params, config) {
    return this.request('get', url, params, config);
  }
}

export const http = new PureHttp();
