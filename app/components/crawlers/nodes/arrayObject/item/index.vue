<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-hash" :title="t('components.crawler.blueprint.nodes.arrayObject.item.title')" :description="t('components.crawler.blueprint.nodes.arrayObject.item.description')" header-color="" header-bg="bg-violet-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.arrayObject.item.fields.index.label')">
        <div v-if="hasTargetPinConnection('index-input')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <CrawlersNodesCommonNumberInput v-else id="crawlerArrayObjectItemIndex" v-model="stateIndex" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.item')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IArrayObjectItemNodeData } from '@/components/crawlers/nodes/arrayObject/item/index.types';

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();
/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();
/**
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();
/**
 * Hook：Vue Flow 边集合。
 */
const { edges } = useVueFlow();
/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);
/**
 * 状态：数组索引。
 */
const stateIndex = ref(0);

/**
 * 函数：归一化索引值。
 * @param {number} value 原始值。
 * @returns {number} 归一化后的索引值。
 */
const normalizeIndex = (value: number): number => {
  const nextValue = Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0;
  return Math.max(0, nextValue);
};

/**
 * 函数：判断目标引脚是否已连接。
 * @param {string} handleId 引脚 ID。
 * @returns {boolean} 是否已连接。
 */
const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const leftPins: IBasicSidePin[] = [
  {
    id: 'array-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'in',
    dataType: 'array',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.arrayObject.item.pinDescriptions.array')
  },
  {
    id: 'index-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.index'),
    direction: 'in',
    dataType: 'number',
    topPercent: 70,
    description: t('components.crawler.blueprint.nodes.arrayObject.item.pinDescriptions.index')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'item-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.item'),
    direction: 'out',
    dataType: 'any',
    topPercent: 30,
    description: t('components.crawler.blueprint.nodes.arrayObject.item.pinDescriptions.item')
  },
  {
    id: 'exists-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exists'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 55,
    description: t('components.crawler.blueprint.nodes.arrayObject.item.pinDescriptions.exists')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as IArrayObjectItemNodeData;
  stateIndex.value = normalizeIndex(Number(data.index ?? 0));
  stateInitialized.value = true;
});

watch(stateIndex, () => {
  if (!stateInitialized.value) {
    return;
  }

  const normalized = normalizeIndex(stateIndex.value);
  if (normalized !== stateIndex.value) {
    stateIndex.value = normalized;
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    index: normalized
  };
});
</script>
