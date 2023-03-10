<template>
  <div>框架2</div>
</template>
<script setup>
import { inject } from 'vue';
const global = inject('global');
global.message.error('我错了');
</script>
