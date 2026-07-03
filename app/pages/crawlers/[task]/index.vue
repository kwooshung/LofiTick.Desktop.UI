<template>
  <KeepAlive>
    <SectionsCrawlersTask v-model:dialog-open="stateDialogOpen" v-model:task-executing="stateTaskExecuting" v-model:browser-session-task-id="stateBrowserSessionTaskId" v-model:browser-session-visible="stateBrowserSessionVisible" />
  </KeepAlive>
</template>

<script setup lang="ts">
/**
 * 状态：任务执行弹窗是否打开。
 */
const stateDialogOpen = defineModel<boolean>('dialogOpen', { default: false });

/**
 * 状态：当前任务是否正在执行。
 */
const stateTaskExecuting = defineModel<boolean>('taskExecuting', { default: false });

/**
 * 状态：当前 Pixabay 爬虫浏览器会话任务 ID。
 */
const stateBrowserSessionTaskId = defineModel<string>('browserSessionTaskId', { default: '' });

/**
 * 状态：当前 Pixabay 爬虫浏览器会话是否可见。
 */
const stateBrowserSessionVisible = defineModel<boolean>('browserSessionVisible', { default: false });
</script>
