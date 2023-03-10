import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupStore } from './store';

import '@/assets/main.css';
import '@/style/index.less';
import { userTokenStoreHook } from '@/store/modules/userToken';
import { useConfigStoreHook } from '@/store/modules/config';
import { provideGlobalHook, globalVariable } from '@/utils/global';
import 'element-plus/theme-chalk/index.css';

const configStoreHook = useConfigStoreHook();
// 引入组件库全局样式资源
const app = createApp(App);
app.use(globalVariable); //向js 提供global
configStoreHook.getServerConfig().then(() => {
  app.use(router);
  setupStore(app);
  provideGlobalHook(app); //向setup提供global
  userTokenStoreHook()
    .getAccessToken()
    .then(() => {});
  app.mount('#app');
});
