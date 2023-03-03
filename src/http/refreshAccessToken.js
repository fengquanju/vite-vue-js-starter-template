import axios from 'axios';
import { AjaxAuthToken } from './index';
// import { getConfig } from '../config';
import { ApiUrl } from '../api';
import useConfig from '../config/useConfig';
const { getConfig } = useConfig();
import {
  RandomString,
  createSign,
  isAccessTokenExist,
  localStorageAuthToken,
  // tempHeaders,
} from './index';

export const refreshAccessToken = function (tempUrl, tempData) {
  // 判断access_token是否存在，不存在则返回
  // if (!isAccessTokenExist()) {
  //   return false;
  // }

  // 执行正常请求
  let timestamp = new Date().getTime();
  let nonce_str = RandomString();
  // VLSClient
  let MBCoreClientKey = Config.VLSClient;
  let MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
  //localStorage.getItem(MBCoreClientKey);

  let obj = {
    appid: Config.AppAppid,
    secret: Config.AppSecret,
    group_id: Config.AppGroupId,
    channel: Config.AppChannel,
    grant_type: Config.GrantTypeAccessToken,
    timestamp: timestamp,
    nonce_str: nonce_str,
    mac: MBCoreClientValue,
  };

  let sign = createSign(obj);

  let data = {
    grant_type: Config.GrantTypeAccessToken,
    timestamp: timestamp,
    nonce_str: nonce_str,
    sign: sign,
    mac: MBCoreClientValue,
  };
  let auth_token = localStorageAuthToken();

  let headers = {
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
    data: data,
    url: ApiUrl.getAccessToken,
    headers: headers,
  })
    .then((res) => {
      let resData = res.data;
      let access_token_key = Config.VLSAccessToken;
      //access_token缓存到本地
      localStorage.setItem(access_token_key, resData.result.access_token);
      // tempHeaders["mbcore-access-token"] = resData.result.access_token;

      //是否移除autho_token
      if (resData.result.removeAuthToken) {
        let auth_token_key = Config.VLSAuthToken;
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
