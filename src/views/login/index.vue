<template>
  <div>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>
<script setup>
import { userTokenStoreHook } from '@/store/modules/userToken';
import { useRouter } from 'vue-router';
const router = useRouter();
const login = () => {
  userTokenStoreHook()
    .userLogin({
      username: 'admin',
      password: 'admin',
    })
    .then((res) => {
      console.log('res', res);
      if (res.code == 1) {
        router.replace({ name: 'Home' });
      }
    });
};
// export default {
//   setup() {
//     const login = () => {
//       userTokenStoreHook()
//         .userLogin({
//           username: 'admin',
//           password: 'admin',
//         })
//         .then((res) => {
//           console.log('res', res);
//         });
//     };
//   },
// };
</script>
