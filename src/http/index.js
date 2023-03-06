import axios from 'axios';
import sha1 from 'js-sha1';
import md5 from 'js-md5';
import { useConfigStoreHook } from '@/store/modules/config';
const Config = useConfigStoreHook().getConfig();
console.log('Config', Config);
import { ApiUrl } from '../api';
import { refreshAccessToken } from './refreshAccessToken.js';
import { UserLogin } from './getAuthToken';
import { getAccessToken } from './getAccessToken';

// import { baseApiUrl } from "@/api/api.js";
let baseApiUrl = Config.baseUrl;

let auth_token = Config.VLSAuthToken;
let access_token = Config.VLSAccessToken;

export function localStorageAuthToken() {
  if (localStorage.getItem(auth_token)) {
    return localStorage.getItem(auth_token);
  } else {
    return false;
  }
}
export function localStorageAccessToken() {
  if (localStorage.getItem(access_token)) {
    return localStorage.getItem(access_token);
  } else {
    return false;
  }
}

export const isAccessTokenExist = () => {
  if (localStorage.getItem(access_token) && localStorage.getItem(access_token) != 'undefined') {
    return true;
  } else {
    return false;
  }
};
//登录相关处理
const env = import.meta.env;

export function goToLogin() {
  if (env.MODE == 'development') {
    window.location.href = 'http://localhost:8080';
  } else {
    //清除auth_token
    var auth_token_key = Config.VLSAuthToken;
    localStorage.removeItem(auth_token_key);
    // if (parent.window) {
    //   parent.window.location.href = AppUrl.Login;
    // } else {
    //   window.location.href = AppUrl.Login;
    // }
  }
}
// console.log(goToLogin);
export function RandomString(len) {
  len = typeof len !== 'undefined' ? len : 32;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var tmp = '';
  for (var i = 0; i < len; i++) {
    var index = Math.floor(Math.random() * maxPos);
    tmp += chars.charAt(index);
  }
  return tmp;
}
export function createSign(obj) {
  // 处理时间
  if (obj.timestamp) obj.timestamp = parseInt(obj.timestamp / 1000);

  var arr = [];
  for (var item in obj) {
    arr.push(obj[item]);
    arr.sort();
  }
  var arrString = arr.join('');
  var sha1Str = sha1(arrString);
  var md5Str = md5(sha1Str);
  var signStr = md5Str.toUpperCase();
  return signStr;
}

export function isAuthTokenExist() {
  var auth_token = Config.VLSAuthToken;
  if (localStorage.getItem(auth_token) && localStorage.getItem(auth_token) != 'undefined') {
    return true;
  } else {
    return false;
  }
}

export function MiddlewareErrorProcessor(code, url, data) {
  localStorage.removeItem(auth_token);
  localStorage.removeItem(access_token);
  getAccessToken().then(() => {
    UserLogin({
      username: 'admin',
      password: 'admin',
    }).catch((err) => {
      debugger;
    });
  });
}

const baseHttp = axios.create({ timeout: 1000 * 60 });

baseHttp.defaults.withCredentials = false;
baseHttp.defaults.baseURL = baseApiUrl;
baseHttp.interceptors.response.use(
  (res) => {
    if (res.status == 200) {
      let data = res.data;

      return { ...data.result, ...data };
    }
    return res.data;
  },
  (err) => {
    debugger;
    let code = err.response.data.code;
    let { url, data } = err.config;
    MiddlewareErrorProcessor(code, url, data);
  },
);

export const AjaxAuthToken = (url, data) => {
  // 如果auth_token不存在
  data ? data : {};

  //任何一个不存在，都踢出到登录
  if (!auth_token || !access_token) {
    // console.log("回到了最初的请求");
    goToLogin();
    return false; //终止处理
  }
  let headers = {
    appid: Config.AppAppid,
    'mbcore-access-token': localStorageAccessToken(),
    'mbcore-auth-token': localStorageAuthToken(),
  };
  baseHttp.defaults.headers = headers;
  // // 头文件
  // headers["mbcore-access-token"] = access_token;
  // headers["mbcore-auth-token"] = auth_token;

  // 请求ajax
  return baseHttp.post(url, data).then((res) => {
    let tempRes = res != undefined ? res : { result: {} };
    return tempRes;
  });
};
