<template>
  <KeepAlive>
    <SectionsCrawlersTask v-model:dialog-open="stateDialogOpen" />
  </KeepAlive>
</template>

<script setup lang="ts">
/**
 * 状态：任务执行弹窗是否打开。
 */
const stateDialogOpen = defineModel<boolean>('dialogOpen', { default: false });
</script>
