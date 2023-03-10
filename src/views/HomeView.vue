<script setup>
import { inject } from 'vue';
import TheWelcome from '@/components/TheWelcome.vue';
import { http } from '@/http';
import { useBaseUrlHook } from '@/api';
const global = inject('global');
global.message.error('我错了');
http
  .Ajax({
    url: useBaseUrlHook('getProjectData') + '279',
    data: {},
    is_login: true,
  })
  .then((res) => {
    console.log(res);
  });
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
