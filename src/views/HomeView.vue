<script setup>
import TheWelcome from '@/components/TheWelcome.vue';
import { http } from '@/http';
import { useBaseUrlHook } from '@/api';

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
