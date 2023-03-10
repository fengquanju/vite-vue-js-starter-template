import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupStore } from './store';

import '@/assets/main.css';
import '@/style/index.less';
import { userTokenStoreHook } from '@/store/modules/userToken';
import { useConfigStoreHook } from '@/store/modules/config';
import { provideGlobal } from '@/utils/global';
import 'element-plus/theme-chalk/index.css';

const configStoreHook = useConfigStoreHook();
// 引入组件库全局样式资源
const app = createApp(App);
configStoreHook.getServerConfig().then(() => {
  app.use(router);
  setupStore(app);
  provideGlobal(app); //向setup提供global
  userTokenStoreHook()
    .getAccessToken()
    .then(() => {});
  app.mount('#app');
});
