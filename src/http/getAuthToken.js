import axios from 'axios';
import { ApiUrl } from '../api';
import { useConfigStoreHook } from '@/store/modules/config';
import { localStorageAccessToken, goToLogin } from './index.bk';
import { getAccessToken } from './getAccessToken.js';

const Config = useConfigStoreHook().getConfig();
console.log('Config', Config);
// import { refreshAccessToken } from "./refreshAccessToken";
export const UserLogin = async function (data) {
  // 如果access_token不存在
  const { code } = await getAccessToken();
  debugger;
  if (code == 1) {
    const access_token = localStorageAccessToken();

    const headers = {
      appid: Config.AppAppid,
      'mbcore-access-token': access_token,
    };

    const instance = axios.create({
      timeout: 1000,
      headers,
    });
    return instance
      .post(ApiUrl.LoginApi, data)
      .then((res) => {
        res = res.data;
        const auth_token_value = res.result.auth_token;
        const auth_token_key = Config.VLSAuthToken;
        localStorage.setItem(auth_token_key, auth_token_value);
        return res;
      })
      .catch((err) => {
        debugger;
        console.log(err);
      });
  }
  debugger;
};
