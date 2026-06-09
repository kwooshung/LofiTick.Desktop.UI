<template>
  <div
    class="blueprint-node-shell relative min-w-72 select-none"
    :class="shellClass"
  >
    <div class="overflow-hidden rounded-lg border border-black/30 bg-muted shadow-[0_18px_42px_rgba(0,0,0,0.38)]">
      <div class="flex items-center justify-between gap-3 border-b border-black/20 px-4 py-2.5" :class="accentBarClass">
        <div class="min-w-0">
          <p class="truncate text-[15px] font-semibold leading-5 text-white">
            {{ data.title }}
          </p>
          <p
            v-if="data.subtitle"
            class="mt-0.5 line-clamp-1 text-[11px] leading-4 text-white/78"
          >
            {{ data.subtitle }}
          </p>
        </div>

        <span
          v-if="data.badge"
          class="shrink-0 rounded-sm border border-white/15 bg-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85"
        >
          {{ data.badge }}
        </span>
      </div>

      <div class="px-4 py-3 text-[12px] leading-5 text-default/75">
        <slot name="body">
          {{ defaultBodyText }}
        </slot>
      </div>
    </div>

    <Handle
      v-for="handle in inputHandles"
      :key="handle.id"
      :id="handle.id"
      :type="'target'"
      :position="Position.Left"
      class="size-[14px]! rounded-none! border-0! bg-white! shadow-none!"
      :style="handle.style"
    />

    <div
      v-for="(handle, index) in outputHandles"
      :key="handle.id"
      class="absolute flex -translate-y-1/2 items-center gap-2"
      :style="handle.style"
    >
      <span
        v-if="handle.label"
        class="rounded-sm border border-black/20 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/78 shadow-lg"
      >
        {{ handle.label }}
      </span>

      <Handle
        :id="handle.id"
        :type="'source'"
        :position="Position.Right"
        class="size-[14px]! rounded-none! border-0! bg-white! shadow-none!"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';

import type { ICrawlerBlueprintNodeShellData } from '@/components/sections/crawlers/blueprint/node-shell/index.types';

/**
 * Props：蓝图节点壳属性。
 */
const props = defineProps<NodeProps<ICrawlerBlueprintNodeShellData>>();

/**
 * 计算属性：节点壳样式。
 */
const shellClass = computed(() => {
  return {
    'opacity-95': true,
    'drop-shadow-[0_16px_28px_rgba(0,0,0,0.32)]': true,
    'ring-1 ring-black/10': true
  };
});

/**
 * 计算属性：节点顶部高亮条样式。
 */
const accentBarClass = computed(() => {
  switch (props.data.tone) {
    case 'start':
      return 'bg-gradient-to-r from-red-800 via-red-700 to-red-600';
    case 'end':
      return 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500';
    case 'branch':
      return 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500';
    case 'action':
    default:
      return 'bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500';
  }
});

/**
 * 计算属性：默认说明文案。
 */
const defaultBodyText = computed(() => {
  switch (props.data.tone) {
    case 'start':
      return '执行入口节点。';
    case 'end':
      return '流程结束节点。';
    case 'branch':
      return '条件分支节点。';
    case 'action':
    default:
      return '流程操作节点。';
  }
});

/**
 * 计算属性：输入执行口。
 */
const inputHandles = computed(() => {
  const count = props.data.execInputs ?? 1;

  return Array.from({ length: count }, (_, index) => ({
    id: `${props.data.tone}-in-${index}`,
    style: {
      left: '-9px',
      top: `${18 + index * 18}px`,
      clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
    }
  }));
});

/**
 * 计算属性：输出执行口。
 */
const outputHandles = computed(() => {
  const count = props.data.execOutputs ?? 1;

  return Array.from({ length: count }, (_, index) => ({
    id: `${props.data.tone}-out-${index}`,
    label: props.data.outputLabels?.[index],
    style: {
      right: '-9px',
      top: `${18 + index * 18}px`,
      clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
    }
  }));
});
</script>