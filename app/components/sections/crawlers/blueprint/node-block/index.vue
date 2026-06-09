<template>
  <UContextMenu :items="computedContextMenuItems" :ui="{ content: 'w-56' }">
    <button type="button" class="group border-default hover:border-primary/60 hover:bg-primary/5 bg-default flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors" @click="emit('select', props.node)">
      <span class="border-default bg-elevated/40 flex size-9 shrink-0 items-center justify-center rounded-lg border" :class="toneClassGet(props.node.tone)">
        <UIcon :name="props.node.icon" class="size-4" />
      </span>

      <span class="min-w-0 flex-1">
        <span class="flex items-start justify-between gap-2">
          <span class="text-highlighted block text-sm font-semibold">{{ props.node.title }}</span>
          <UIcon name="i-lucide:chevron-right" class="text-muted size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        <span class="text-muted mt-1 block text-xs leading-5 text-pretty">{{ props.node.description }}</span>
      </span>
    </button>
  </UContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui';

import type { IBlueprintNodeBlockEmits, IBlueprintNodeBlockProps, IBlueprintNodeItem } from '../index.types';

/**
 * Props：蓝图节点。
 */
const props = defineProps<IBlueprintNodeBlockProps>();

/**
 * 事件：蓝图节点块。
 */
const emit = defineEmits<IBlueprintNodeBlockEmits>();

/**
/**
 * 常量：节点强调色样式映射。
 */
const toneClassMap = {
  primary: 'text-primary',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  neutral: 'text-muted'
} as const;

/**
 * 函数：获取节点强调色样式。
 * @param tone 节点强调色。
 * @returns 节点强调色样式。
 */
const toneClassGet = (tone: IBlueprintNodeItem['tone']): string => toneClassMap[tone];

/**
 * 计算属性：节点右键菜单。
 */
const computedContextMenuItems = computed<ContextMenuItem[][]>(() => {
  return [
    [
      {
        label: '设为当前节点',
        icon: 'i-lucide:cursor-pointer',
        onSelect: () => emit('select', props.node)
      },
      {
        label: '复制节点名称',
        icon: 'i-lucide:copy',
        onSelect: () => {
          if (!import.meta.client) {
            return;
          }

          void navigator.clipboard.writeText(props.node.title);
        }
      }
    ]
  ];
});
</script>
