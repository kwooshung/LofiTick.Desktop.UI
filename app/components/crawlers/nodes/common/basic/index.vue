<template>
  <div class="border-default bg-default rounded-lg border shadow-xs transition-shadow duration-300 ease-in-out">
    <div :class="['flex items-start rounded-t-lg p-4', headerBg]">
      <slot name="icon">
        <UIcon :name="iconName" :class="['mt-0.75 mr-3 shrink-0 text-xl', iconClass]" />
      </slot>
      <div class="flex min-w-0 flex-col">
        <h3 :class="['text-md m-0 truncate leading-snug font-bold', titleClass]">{{ title }}</h3>
        <p v-if="description" :class="['m-0 mt-0.5 truncate text-sm', descriptionClass]">{{ description }}</p>
      </div>
    </div>
    <div v-if="hasNodeContext && (showExecIn || showExecOut)" class="border-default relative h-8 border-t">
      <Handle v-if="showExecIn" id="exec-in" type="target" :position="Position.Left" class="h-4! w-4! -translate-y-1 rounded-none! border-none! bg-transparent!">
        <UIcon name="i-streamline-ultimate:arrow-down-2-bold" class="pointer-events-none rotate-270 text-inherit" />
      </Handle>
      <Handle v-if="showExecOut" id="exec-out" type="source" :position="Position.Right" class="h-4! w-4! -translate-y-1 rounded-none! border-none! bg-transparent!">
        <UIcon name="i-streamline-ultimate:arrow-down-2-bold" class="pointer-events-none rotate-270 text-inherit" />
      </Handle>
    </div>
    <div v-if="$slots.default" class="border-default border-t px-4 py-3">
      <slot />
    </div>
    <div class="h-4 rounded-b-lg pr-4 pb-4 pl-4"></div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position, useNodeId } from '@vue-flow/core';

import type { ICrawlersNodesCommonBasicProps } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 属性：基础节点配置。
 */
const { title, titleClass = 'text-white', iconName = 'i-lucide-monitor', iconClass = 'text-white/80', description, descriptionClass = 'text-white/70', headerBg, showExecIn = true, showExecOut = true } = defineProps<ICrawlersNodesCommonBasicProps>();

/**
 * 计算属性：当前组件是否运行在 Vue Flow 节点上下文中。
 */
const hasNodeContext = computed(() => String(useNodeId() ?? '').trim() !== '');
</script>
