<template>
  <div :title="computedTitle" :class="computedRootClass">
    <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
    <span v-if="!compact" class="truncate">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersNodesCommonConnectedInputHintProps } from '@/components/crawlers/nodes/common/connected-input-hint/index.types';

/**
 * Props：组件入参。
 */
const { label, title, compact = false } = defineProps<ICrawlersNodesCommonConnectedInputHintProps>();

/**
 * 计算属性：悬浮标题。
 */
const computedTitle = computed(() => title ?? label);

/**
 * 计算属性：根元素样式。
 */
const computedRootClass = computed(() => {
  return [
    'text-muted flex items-center overflow-hidden text-[11px] whitespace-nowrap',
    compact ? 'size-5 justify-center rounded-sm' : 'border-default h-8 gap-1 border-l px-2'
  ];
});
</script>
