<template>
  <div :title="computedTitle" class="border-default text-muted flex h-8 items-center gap-1 overflow-hidden rounded-sm border px-2 text-xs whitespace-nowrap">
    <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
    <span class="truncate">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersNodesCommonConnectedInputHintProps } from '@/components/crawlers/nodes/common/connected-input-hint/index.types';

/**
 * Props：组件入参。
 */
const { label, title } = defineProps<ICrawlersNodesCommonConnectedInputHintProps>();

/**
 * 计算属性：悬浮标题。
 */
const computedTitle = computed(() => title ?? label);
</script>
