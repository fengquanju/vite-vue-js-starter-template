//这里定义的是全局变量，比如消息提示等，方便统一配置统一管理
import { ElMessage, ElMessageBox } from 'element-plus';

const ElMessageCfg = { duration: 2000000, customClass: 'el-message-global', showClose: true };

const message = {
  success: (msg) => {
    return ElMessage.success({ message: msg, ...ElMessageCfg });
  },
  error: (msg) => {
    return ElMessage.error({ message: msg, ...ElMessageCfg });
  },
};
//app.js 中注册全局变量
export const provideGlobal = (app) => {
  app.provide('global', {
    message,
  });
  app;
};

// 导出一份可以在js文件中可以使用
export const global = {
  message,
};
