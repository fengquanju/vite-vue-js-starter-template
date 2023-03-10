//这里定义的是全局变量，比如消息提示等，方便统一配置统一管理
import { ElMessage, ElMessageBox } from 'element-plus';
import { inject } from 'vue';
import { reactive } from 'vue';
const ElMessageCfg = { duration: 2000000, customClass: 'el-message-global', showClose: true };
const message = {
  success: (msg) => {
    return ElMessage.success({ message: msg, ...ElMessageCfg });
  },
  error: (msg) => {
    return ElMessage.error({ message: msg, ...ElMessageCfg });
  },
};
const variableList = {
  message,
};
//app.js 中注册全局变量
export const provideGlobalHook = (app) => {
  app.provide('global', {
    message,
  });
  app;
};
// setup中使用全局变量
export const injectGlobalHook = () => {
  const global = inject('global');
  return global;
};
let global = reactive({});
export const globalVariable = {
  install: function (app) {
    Object.keys(variableList).forEach((key) => {
      app.config.globalProperties[`${key}`] = variableList[key];
      global = app.config.globalProperties;
    });
  },
};

export const useGlobalHook = () => {
  return global;
};
