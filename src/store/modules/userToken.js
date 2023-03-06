import { defineStore } from 'pinia';
import { store } from '../index';
import { useConfigStoreHook } from '@/store/modules/config';
import { useCoreUrlHook } from '@/api';
import axios from 'axios';
const configHook = useConfigStoreHook();
import { RandomString, createSign } from '@/utils/utils';
const env = import.meta.env;
export const userTokenStore = defineStore('userToken', {
  state: () => ({
    access_token: null,
    auth_token: null,
  }),
  actions: {
    getAccessToken() {
      const Config = configHook.getConfig();
      console.log(JSON.parse(JSON.stringify(Config)));
      let local_access_token = localStorage.getItem(Config.VLSAccessToken);
      console.log('local_access_token', local_access_token);
      if (local_access_token) return false;
      const timestamp = new Date().getTime();
      const nonce_str = RandomString();
      // VLSClient
      const MBCoreClientKey = Config.VLSClient;
      let MBCoreClientValue = null; //localStorage.getItem(MBCoreClientKey);
      MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
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
        url: useCoreUrlHook('getAccessToken'),
        headers: headers,
      })
        .then((res) => {
          console.log('res', res);
          res = res.data;
          var access_token_key = Config.VLSAccessToken;
          //access_token缓存到本地
          localStorage.setItem(access_token_key, res.result.access_token);
          this.access_token = res.result.access_token;
          // 如果返回cuuid写入mac
          if (res.result.cuuid) {
            var MBCoreClientKey = Config.VLSClient;
            localStorage.setItem(MBCoreClientKey, res.result.cuuid);
          }
          return res.result.access_token;
          // callback 回调
        })
        .catch((error) => {
          console.error('getAccessToken-error', error);
        });
    },
    async userLogin() {
      const Config = configHook.getConfig();
      let access_token = localStorage.getItem(Config.VLSAccessToken);
      if (!access_token) {
        access_token = await this.getAccessToken();
      }
      var headers = {
        appid: Config.AppAppid,
        'mbcore-access-token': access_token,
      };

      const instance = axios.create({
        timeout: 1000,
        headers,
      });
      return instance
        .post(useCoreUrlHook('LoginApi'), data)
        .then((res) => {
          res = res.data;
          var auth_token_value = res.result.auth_token;
          var auth_token_key = Config.VLSAuthToken;
          localStorage.setItem(auth_token_key, auth_token_value);
          return res;
        })
        .catch((err) => {
          debugger;
          console.log(err);
        });
    },
    refreshAccessToken() {},
  },
});

export function userTokenStoreHook() {
  return userTokenStore(store);
}
