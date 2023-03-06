import { defineStore } from 'pinia';
import { store } from '../index';
import axios from 'axios';
const env = import.meta.env;
export const useConfigStore = defineStore('config', {
  state: () => ({
    config: {},
    configJson: {},
  }),
  actions: {
    setConfig(config_json) {
      this.config = {
        pmCore: config_json.pmCore, //
        pmStorage: config_json.pmStorage,
        groupName: config_json.groupName,
        baseUrl: config_json.baseUrl, //接口主地址https://mbdev.pettyb.com/SecurityAdmin/Admin/menus/index
        baseClient: config_json.baseClient, //后台网址
        logo: config_json.logo, //hxd Logo
        storeName: config_json.storeName,

        //Config
        VLSAccessToken: config_json.groupName + 'access_token' /* export Var localStorage*/,
        VLSAuthToken: config_json.groupName + 'auth_token',
        VLSClient: config_json.groupName + 'mbcore_client' /* export Var localStorage*/, //【*】
        Mode: env.MODE /*默认是开发模式，如果是prodect即是产品模式*/,

        /*Api*/
        GrantTypeAccessToken: config_json.AppChannel, //grant_type
        AppAppid: config_json.AppAppid, //appid
        AppSecret: config_json.AppSecret, //secret
        AppChannel: config_json.AppChannel, //channel
        AppGroupId: config_json.AppGroupId, //group_id

        //AppUrl
        Index: config_json.baseClient + 'index.html',
        Login: config_json.baseClient + 'login.html',
      };
      console.log('this.config', this.config);
    },
    getServerConfig() {
      return axios({
        method: 'get',
        url: `/config.json`,
      })
        .then(({ data: config }) => {
          // 自动注入项目配置
          if (typeof config === 'object') {
            let $config = Object.assign(config);
            this.configJson = $config;
            // 设置全局配置
            // debugger;
            this.setConfig($config);
            return $config;
          } else {
            return {};
          }
        })
        .catch(() => {
          throw '请在public文件夹下添加serverConfig.json配置文件';
        });
    },
  },
  getters: {
    getConfig: (state) => {
      return (key) => (key ? state.config[key] : state.config);
    },
    getConfigJson: () => {
      return this.configJson;
    },
  },
});

export function useConfigStoreHook() {
  return useConfigStore(store);
}
