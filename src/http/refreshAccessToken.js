import axios from 'axios';
import {
  AjaxAuthToken,
  RandomString,
  createSign,
  isAccessTokenExist,
  localStorageAuthToken,
  // tempHeaders,
} from './index.bk';
import { ApiUrl } from '../api';
import { useConfigStoreHook } from '@/store/modules/config';

const Config = useConfigStoreHook().getConfig();
console.log('Config', Config);

export const refreshAccessToken = function (tempUrl, tempData) {
  // 判断access_token是否存在，不存在则返回
  // if (!isAccessTokenExist()) {
  //   return false;
  // }

  // 执行正常请求
  const timestamp = new Date().getTime();
  const nonce_str = RandomString();
  // VLSClient
  const MBCoreClientKey = Config.VLSClient;
  const MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
  // localStorage.getItem(MBCoreClientKey);

  const obj = {
    appid: Config.AppAppid,
    secret: Config.AppSecret,
    group_id: Config.AppGroupId,
    channel: Config.AppChannel,
    grant_type: Config.GrantTypeAccessToken,
    timestamp,
    nonce_str,
    mac: MBCoreClientValue,
  };

  const sign = createSign(obj);

  const data = {
    grant_type: Config.GrantTypeAccessToken,
    timestamp,
    nonce_str,
    sign,
    mac: MBCoreClientValue,
  };
  const auth_token = localStorageAuthToken();

  const headers = {
    appid: Config.AppAppid,
    channel: Config.AppChannel,
    'mbcore-auth-token': auth_token,
  };

  // 判断auth_token
  // if (isAuthTokenExist()) {
  // headers = { "mbcore-auth-token": auth_token, ...headers };
  // }
  axios({
    method: 'post',
    data,
    url: ApiUrl.getAccessToken,
    headers,
  })
    .then((res) => {
      const resData = res.data;
      const access_token_key = Config.VLSAccessToken;
      // access_token缓存到本地
      localStorage.setItem(access_token_key, resData.result.access_token);
      // tempHeaders["mbcore-access-token"] = resData.result.access_token;

      // 是否移除autho_token
      if (resData.result.removeAuthToken) {
        const auth_token_key = Config.VLSAuthToken;
        localStorage.removeItem(auth_token_key);
      }
      AjaxAuthToken({ url: tempUrl, data: tempData });
    })
    .catch((res) => {
      console.log(res);

      // res = res.data;
      // if (!res.responseText) {
      //   return;
      // }
      // let code = JSON.parse(res.responseText).code;
      // if (code == 403.5 || code == 403.6) {
      //   refreshAccessToken();
      // }
    });
};
