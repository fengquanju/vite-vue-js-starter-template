import axios from 'axios';
// import { reactive } from 'vue'
import useConfig from './useConfig';
const { getConfig, setConfig } = useConfig();
// let config = reactive({});

// const env = import.meta.env;
// console.log('env', env);

//将Json进行还原本来的结构处理并缓存
// const setConfig = (config_json) => {
//   let result = {
//     pmCore: config_json.pmCore, //
//     pmStorage: config_json.pmStorage,
//     groupName: config_json.groupName,
//     baseUrl: config_json.baseUrl, //接口主地址https://mbdev.pettyb.com/SecurityAdmin/Admin/menus/index
//     baseClient: config_json.baseClient, //后台网址
//     logo: config_json.logo, //hxd Logo
//     storeName: config_json.storeName,

//     //Config
//     VLSAccessToken: config_json.groupName + 'access_token' /* export Var localStorage*/,
//     VLSAuthToken: config_json.groupName + 'auth_token',
//     VLSClient: config_json.groupName + 'mbcore_client' /* export Var localStorage*/, //【*】
//     Mode: env.MODE /*默认是开发模式，如果是prodect即是产品模式*/,

//     /*Api*/
//     GrantTypeAccessToken: config_json.AppChannel, //grant_type
//     AppAppid: config_json.AppAppid, //appid
//     AppSecret: config_json.AppSecret, //secret
//     AppChannel: config_json.AppChannel, //channel
//     AppGroupId: config_json.AppGroupId, //group_id

//     //AppUrl
//     Index: config_json.baseClient + 'index.html',
//     Login: config_json.baseClient + 'login.html',
//   };
//   config = Object.assign(result);
//   console.log('reslut', result);
// };

// const getConfig = (key) => {
//   if (typeof key === 'string') {
//     const arr = key.split('.');
//     if (arr && arr.length) {
//       let data = config;
//       arr.forEach((v) => {
//         if (data && typeof data[v] !== 'undefined') {
//           data = data[v];
//         } else {
//           data = null;
//         }
//       });
//       return data;
//     }
//   }
//   return config;
// };

/** 获取项目动态全局配置 */
export const getServerConfig = async (app) => {
  return axios({
    method: 'get',
    url: `/config.json`,
  })
    .then(({ data: config }) => {
      console.log(typeof config === 'object');
      // 自动注入项目配置
      if (typeof config === 'object') {
        setConfig(config);
      }
      let $config = getConfig();
      console.log('getServerConfig', $config);
      app.config.globalProperties.$config = $config;
      return $config;
    })
    .catch(() => {
      throw '请在public文件夹下添加serverConfig.json配置文件';
    });
};

// export { getConfig, setConfig };
