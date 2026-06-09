<template>
  <div class="blueprint-node relative min-w-72 overflow-hidden rounded-xl border border-black/16 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] select-none">
    <div class="relative overflow-hidden">
      <slot name="header" :data="data" :header-class="data.headerClass">
        <div class="flex items-start justify-between gap-4 px-3.5 py-2.5" :class="headerClass">
          <div class="min-w-0 flex-1 pr-10">
            <p class="truncate text-sm leading-5 font-semibold text-white">
              {{ data.title }}
            </p>
            <p v-if="data.subtitle" class="mt-0.5 line-clamp-1 text-xs leading-4 text-white/80">
              {{ data.subtitle }}
            </p>
          </div>

          <span v-if="data.badge" class="shrink-0 rounded-sm border border-white/15 bg-black/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-white/88 uppercase">
            {{ data.badge }}
          </span>
        </div>
      </slot>

      <slot name="inputs" :data="data" :handles="inputHandles">
        <CrawlersBlueprintExecTriangle v-for="handle in inputHandles" :key="handle.id" :id="handle.id" :type="'target'" :position="Position.Left" side="left" :top="handle.top" />
      </slot>

      <slot name="outputs" :data="data" :handles="outputHandles">
        <CrawlersBlueprintExecTriangle v-for="handle in outputHandles" :key="handle.id" :id="handle.id" :type="'source'" :position="Position.Right" side="right" :top="handle.top" :label="handle.label" />
      </slot>
    </div>

    <div class="bg-default/96 text-default/78 border-t border-black/8 px-3.5 py-3 text-[12px] leading-5">
      <slot name="body" :data="data" :body-text="data.bodyText">
        {{ data.bodyText }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core';
import { Position } from '@vue-flow/core';

import type { ICrawlerBlueprintNodeData } from '@/components/crawlers/blueprint/node/index.types';

/**
 * Props：蓝图节点属性。
 */
const props = defineProps<NodeProps<ICrawlerBlueprintNodeData>>();

/**
 * 计算属性：节点标题栏样式。
 */
const headerClass = computed(() => props.data.headerClass);

/**
 * 计算属性：输入执行口。
 */
const inputHandles = computed(() => {
  const count = props.data.execInputs ?? 1;

  return Array.from({ length: count }, (_, index) => ({
    id: `${props.id}-in-${index}`,
    top: execHandleTopGet(index, count)
  }));
});

/**
 * 计算属性：输出执行口。
 */
const outputHandles = computed(() => {
  const count = props.data.execOutputs ?? 1;

  return Array.from({ length: count }, (_, index) => ({
    id: `${props.id}-out-${index}`,
    label: props.data.outputLabels?.[index] ?? '',
    top: execHandleTopGet(index, count)
  }));
});

/**
 * 函数：获取执行三角顶部位置。
 * @param {number} index 执行口序号。
 * @param {number} count 执行口总数。
 * @return {string} 顶部位置。
 */
const execHandleTopGet = (index: number, count: number): string => {
  if (count <= 1) {
    return '50%';
  }

  const offset = (index - (count - 1) / 2) * 24;

  return `calc(50% + ${offset.toFixed(0)}px)`;
};
</script>
