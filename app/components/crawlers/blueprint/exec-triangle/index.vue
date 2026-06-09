<template>
  <div class="pointer-events-none absolute right-0 left-0" :style="wrapperStyle">
    <div class="flex items-center" :class="containerClass">
      <span v-if="label" class="text-default/75 truncate text-[10px] font-medium" :class="labelClass">
        {{ label }}
      </span>

      <Handle :id="id" :type="type" :position="position" class="pointer-events-auto size-3.5! rounded-none! border-0! bg-white! shadow-none!" :style="handleStyle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { Position } from '@vue-flow/core';
import { Handle } from '@vue-flow/core';

import type { ICrawlerBlueprintExecTriangleProps } from '@/components/crawlers/blueprint/exec-triangle/index.types';

/**
 * Props：执行三角组件属性。
 */
const props = defineProps<ICrawlerBlueprintExecTriangleProps>();

/**
 * 常量：执行三角边缘内收距离（单位：px）。
 */
const EXEC_TRIANGLE_INSET = '6px';

/**
 * 计算属性：外层定位样式。
 */
const wrapperStyle = computed<CSSProperties>(() => ({
  top: props.top,
  left: props.side === 'left' ? EXEC_TRIANGLE_INSET : undefined,
  right: props.side === 'right' ? EXEC_TRIANGLE_INSET : undefined
}));

/**
 * 计算属性：容器样式。
 */
const containerClass = computed(() => {
  return props.side === 'left' ? 'justify-start gap-2' : 'justify-end gap-2';
});

/**
 * 计算属性：标签样式。
 */
const labelClass = computed(() => {
  return props.side === 'left' ? 'order-2' : 'order-1';
});

/**
 * 计算属性：执行三角样式。
 */
const handleStyle = computed<CSSProperties>(() => ({
  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
  width: '14px',
  height: '14px'
}));
</script>
