import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: {},
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
    },
  },
  getters: {
    getConfig: (state) => {
      return (key) => (key ? state.config[key] : state.config);
    },
  },
});
