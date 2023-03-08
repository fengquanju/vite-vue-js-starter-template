import axios from 'axios';
import { useConfigStoreHook } from '@/store/modules/config';
import { ApiUrl } from '../api';
import { RandomString, createSign, isAccessTokenExist } from './index.bk.js';

const Config = useConfigStoreHook().getConfig();
console.log('Config', Config);
console.log('getAccessToken', Config);

export const getAccessToken = () => {
  // 判断access_token是否存在，存在则返回
  // if (isAccessTokenExist()) {
  //   return false;
  // }
  // 执行正常请求
  const is_ios_client = true;
  const timestamp = new Date().getTime();
  const nonce_str = RandomString();
  // VLSClient
  const MBCoreClientKey = Config.VLSClient;
  let MBCoreClientValue = null; // localStorage.getItem(MBCoreClientKey);
  if (is_ios_client) {
    MBCoreClientValue = sessionStorage.getItem(MBCoreClientKey);
  } else {
    MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
  }
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
  const headers = {
    appid: Config.AppAppid,
    channel: Config.AppChannel,
  };

  return axios({
    method: 'post',
    data,
    url: ApiUrl.getAccessToken,
    headers,
  }).then((res) => {
    res = res.data;
    const access_token_key = Config.VLSAccessToken;
    // access_token缓存到本地
    localStorage.setItem(access_token_key, res.result.access_token);

    // 如果返回cuuid写入mac
    if (res.result.cuuid) {
      const MBCoreClientKey = Config.VLSClient;
      localStorage.setItem(MBCoreClientKey, res.result.cuuid);
    }
    return res;
    // callback 回调
  });
};
