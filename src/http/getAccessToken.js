import axios from 'axios';
// import { Config, ApiUrl } from "@/config/config.js";
import useConfig from '../config/useConfig';
const { getConfig } = useConfig();
import { ApiUrl } from '../api';
const Config = getConfig();
console.log('getAccessToken', Config);
import { RandomString, createSign, isAccessTokenExist } from './index.js';
export const getAccessToken = () => {
  // 判断access_token是否存在，存在则返回
  // if (isAccessTokenExist()) {
  //   return false;
  // }
  // 执行正常请求
  let is_ios_client = true;
  var timestamp = new Date().getTime();
  var nonce_str = RandomString();
  // VLSClient
  var MBCoreClientKey = Config.VLSClient;
  var MBCoreClientValue = null; //localStorage.getItem(MBCoreClientKey);
  if (is_ios_client) {
    MBCoreClientValue = sessionStorage.getItem(MBCoreClientKey);
  } else {
    MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
  }
  var obj = {
    appid: Config.AppAppid,
    secret: Config.AppSecret,
    group_id: Config.AppGroupId,
    channel: Config.AppChannel,
    grant_type: Config.GrantTypeAccessToken,
    timestamp: timestamp,
    nonce_str: nonce_str,
    mac: MBCoreClientValue,
  };
  var sign = createSign(obj);

  var data = {
    grant_type: Config.GrantTypeAccessToken,
    timestamp: timestamp,
    nonce_str: nonce_str,
    sign: sign,
    mac: MBCoreClientValue,
  };
  var headers = {
    appid: Config.AppAppid,
    channel: Config.AppChannel,
  };

  return axios({
    method: 'post',
    data: data,
    url: ApiUrl.getAccessToken,
    headers: headers,
  }).then((res) => {
    res = res.data;
    var access_token_key = Config.VLSAccessToken;
    //access_token缓存到本地
    localStorage.setItem(access_token_key, res.result.access_token);

    // 如果返回cuuid写入mac
    if (res.result.cuuid) {
      var MBCoreClientKey = Config.VLSClient;
      localStorage.setItem(MBCoreClientKey, res.result.cuuid);
    }
    return res;
    // callback 回调
  });
};
