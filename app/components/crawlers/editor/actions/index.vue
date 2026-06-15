<template>
  <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 py-3">
    <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ cancelText }}</UButton>
    <UButton type="button" color="primary" icon="i-lucide:save" @click="emit('save')">{{ saveText }}</UButton>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersEditorActionsEmits, ICrawlersEditorActionsProps } from '@/components/crawlers/editor/actions/index.types';

/**
 * 属性：底部操作栏文案。
 */
const { cancelText, saveText } = defineProps<ICrawlersEditorActionsProps>();

/**
 * 事件：底部操作栏操作。
 */
const emit = defineEmits<ICrawlersEditorActionsEmits>();
</script>
