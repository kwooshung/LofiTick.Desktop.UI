<template>
  <KeepAlive>
    <SectionsCrawlersTask v-model:dialog-open="stateDialogOpen" v-model:task-executing="stateTaskExecuting" v-model:webview-task-id="stateWebviewTaskId" v-model:webview-visible="stateWebviewVisible" />
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
 * 状态：当前 Pixabay 爬虫 WebView 任务 ID。
 */
const stateWebviewTaskId = defineModel<string>('webviewTaskId', { default: '' });

/**
 * 状态：当前 Pixabay 爬虫 WebView 是否可见。
 */
const stateWebviewVisible = defineModel<boolean>('webviewVisible', { default: false });
</script>
