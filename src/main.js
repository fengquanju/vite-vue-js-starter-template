import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/main.css';
import '@/style/index.less';
import { getServerConfig } from './config';

// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';
import { getAccessToken } from './http/getAccessToken';
const app = createApp(App);
getServerConfig(app).then((config) => {
  console.log('config', config);
  getAccessToken().then((res) => {});
  app.use(router).use(store).mount('#app');
});
