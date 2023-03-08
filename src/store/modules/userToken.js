import { defineStore } from 'pinia';
import axios from 'axios';
import { store } from '../index';
import { useConfigStoreHook } from '@/store/modules/config';
import { useCoreUrlHook } from '@/api';
import { RandomString, createSign } from '@/utils/utils';
import { http } from '@/http';

const configHook = useConfigStoreHook();
export const userTokenStore = defineStore('userToken', {
  state: () => ({
    access_token: null,
    auth_token: null,
  }),
  actions: {
    getAccessToken() {
      const Config = configHook.getConfig();
      const local_access_token = localStorage.getItem(Config.VLSAccessToken);
      if (local_access_token) return Promise.resolve(local_access_token);
      const timestamp = new Date().getTime();
      const nonce_str = RandomString();
      // VLSClient
      const MBCoreClientKey = Config.VLSClient;
      let MBCoreClientValue = null;
      MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
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
      return http.request('post', useCoreUrlHook('getAccessToken'), { data }, { headers }).then((res) => {
        const access_token_key = Config.VLSAccessToken;
        // access_token缓存到本地
        localStorage.setItem(access_token_key, res.result.access_token);
        this.access_token = res.result.access_token;
        // 如果返回cuuid写入mac
        if (res.result.cuuid) {
          const MBCoreClientKey = Config.VLSClient;
          localStorage.setItem(MBCoreClientKey, res.result.cuuid);
        }
        return res.result.access_token;
      });
    },
    async userLogin(data) {
      const Config = configHook.getConfig();
      let access_token = localStorage.getItem(Config.VLSAccessToken);
      if (!access_token) {
        access_token = await this.getAccessToken();
      }
      const headers = {
        appid: Config.AppAppid,
        'mbcore-access-token': access_token,
      };
      return http.request('post', useCoreUrlHook('LoginApi'), { data }, { headers }).then((res) => {
        const auth_token_value = res.result.auth_token;
        const auth_token_key = Config.VLSAuthToken;
        localStorage.setItem(auth_token_key, auth_token_value);
        return res;
      });
    },
    async refreshAccessToken() {
      const Config = configHook.getConfig();
      let access_token = localStorage.getItem(Config.VLSAccessToken);
      if (!access_token) {
        access_token = await this.getAccessToken();
        return Promise.resolve(access_token);
      }
      const timestamp = new Date().getTime();
      const nonce_str = RandomString();
      const MBCoreClientKey = Config.VLSClient;
      let MBCoreClientValue = null;
      MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
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
      const auth_token = localStorage.getItem(Config.VLSAuthToken);
      const headers = {
        appid: Config.AppAppid,
        channel: Config.AppChannel,
        'mbcore-auth-token': auth_token,
      };
      return http.request('post', useCoreUrlHook('refreshAccessToken'), { data }, { headers }).then((res) => {
        const access_token_key = Config.VLSAccessToken;
        // access_token缓存到本地
        localStorage.setItem(access_token_key, res.result.access_token);

        // 是否移除autho_token
        if (res.result.removeAuthToken) {
          const auth_token_key = Config.VLSAuthToken;
          localStorage.removeItem(auth_token_key);
        }
        return res;
      });
    },
  },
});

export function userTokenStoreHook() {
  return userTokenStore(store);
}
