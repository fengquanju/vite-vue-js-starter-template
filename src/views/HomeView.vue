<script setup>
import TheWelcome from '@/components/TheWelcome.vue';
import { http } from '@/http';
import { useBaseUrlHook } from '@/api';

http.post(`${useBaseUrlHook('getProjectData')}279`).then((res) => {
  console.log(res);
});
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
