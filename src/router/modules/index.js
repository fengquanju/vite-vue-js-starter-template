import Layout from '@/layout/index.vue';
export default [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/index',
    meta: {
      icon: 'homeFilled',
      title: '首页',
      rank: 0,
    },
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/HomeView.vue'),
        meta: {
          title: '首页',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      showLink: false,
      rank: 101,
    },
  },
];
