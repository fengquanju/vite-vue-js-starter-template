import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupStore } from './store';

import '@/assets/main.css';
import '@/style/index.less';
import { userTokenStoreHook } from '@/store/modules/userToken';
import { useConfigStoreHook } from '@/store/modules/config';
const configStoreHook = useConfigStoreHook();
// 引入组件库全局样式资源
const app = createApp(App);
configStoreHook.getServerConfig().then(() => {
  app.use(router);
  setupStore(app);
  userTokenStoreHook().getAccessToken();
  app.mount('#app');
});
