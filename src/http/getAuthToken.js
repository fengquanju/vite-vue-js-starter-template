import { ApiUrl } from '../api';
import { useConfigStoreHook } from '@/store/modules/config';
const Config = useConfigStoreHook().getConfig();
console.log('Config', Config);
import axios from 'axios';
import { localStorageAccessToken, goToLogin } from './index';
import { getAccessToken } from './getAccessToken.js';
// import { refreshAccessToken } from "./refreshAccessToken";
export let UserLogin = async function (data) {
  // 如果access_token不存在
  let { code } = await getAccessToken();
  debugger;
  if (code == 1) {
    var access_token = localStorageAccessToken();

    var headers = {
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
        var auth_token_value = res.result.auth_token;
        var auth_token_key = Config.VLSAuthToken;
        localStorage.setItem(auth_token_key, auth_token_value);
        return res;
      })
      .catch((err) => {
        debugger;
        console.log(err);
      });
  } else {
    debugger;
  }
};
