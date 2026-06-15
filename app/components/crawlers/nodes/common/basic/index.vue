<template>
  <div class="border-default bg-default/65 rounded-lg border shadow-xs transition-shadow duration-300 ease-in-out">
    <div :class="['flex items-start rounded-t-lg p-4', headerBg]">
      <slot name="icon">
        <UIcon :name="iconName" :class="['mt-0.5 mr-3 shrink-0 text-xl', iconClass]" />
      </slot>
      <div class="flex min-w-0 flex-col">
        <h3 :class="['text-md m-0 truncate leading-snug font-bold', titleClass]">{{ title }}</h3>
        <p v-if="description" :class="['m-0 mt-0.5 truncate text-sm', descriptionClass]">{{ description }}</p>
      </div>
    </div>
    <div v-if="hasNodeContext && (showExecIn || showExecOut)" class="relative h-8">
      <Handle v-if="showExecIn" id="exec-in" type="target" :position="Position.Left" class="h-5! w-4! translate-x-4 rounded-none! border-0! [clip-path:polygon(0_0,100%_50%,0_100%)]" />
      <Handle v-if="showExecOut" id="exec-out" type="source" :position="Position.Right" class="h-5! w-4! -translate-x-4 rounded-none! border-0! [clip-path:polygon(0_0,100%_50%,0_100%)]" />
    </div>
    <div v-if="$slots.default" class="px-4 py-3">
      <slot />
    </div>
    <div v-if="$slots.footer" class="h-4 pr-4 pb-4 pl-4">
      <slot />
    </div>
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
