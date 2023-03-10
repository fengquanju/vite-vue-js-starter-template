<template>
  <div>框架2</div>
</template>
<script setup>
import { injectGlobalHook } from '@/utils/global';
const global = injectGlobalHook();
global.message.error('我错了');
</script>
