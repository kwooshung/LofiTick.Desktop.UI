<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-rows-3"
    :title="t('components.crawler.blueprint.nodes.arrayObject.split.title')"
    :description="t('components.crawler.blueprint.nodes.arrayObject.split.description')"
    header-color=""
    header-bg="bg-violet-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.arrayObject.split.fields.size.label')">
        <div v-if="hasTargetPinConnection('input-size')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <CrawlersNodesCommonNumberInput v-else id="crawlerArrayObjectSplitSize" v-model="stateChunkSize" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.item')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IArrayObjectSplitNodeData } from '@/components/crawlers/nodes/arrayObject/split/index.types';

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
 * 状态：分块大小。
 */
const stateChunkSize = ref(2);

/**
 * 函数：约束分块大小。
 * @param {number} value 原始数值。
 * @returns {number} 归一化后的分块大小。
 */
const normalizeChunkSize = (value: number): number => {
  const nextValue = Number.isFinite(Number(value)) ? Math.round(Number(value)) : 2;
  return Math.max(1, nextValue);
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

/**
 * 常量：左侧输入引脚配置。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'in',
    dataType: 'array',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.arrayObject.split.pinDescriptions.array')
  },
  {
    id: 'input-size',
    label: t('components.crawler.blueprint.nodes.arrayObject.split.pinLabels.size'),
    direction: 'in',
    dataType: 'number',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.arrayObject.split.pinDescriptions.size')
  }
];

/**
 * 常量：右侧输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-chunks',
    label: t('components.crawler.blueprint.nodes.arrayObject.split.pinLabels.chunks'),
    direction: 'out',
    dataType: 'array',
    topPercent: 28,
    description: t('components.crawler.blueprint.nodes.arrayObject.split.pinDescriptions.chunks')
  },
  {
    id: 'result-first',
    label: t('components.crawler.blueprint.nodes.arrayObject.split.pinLabels.first'),
    direction: 'out',
    dataType: 'any',
    topPercent: 52,
    description: t('components.crawler.blueprint.nodes.arrayObject.split.pinDescriptions.first')
  },
  {
    id: 'result-rest',
    label: t('components.crawler.blueprint.nodes.arrayObject.split.pinLabels.rest'),
    direction: 'out',
    dataType: 'array',
    topPercent: 74,
    description: t('components.crawler.blueprint.nodes.arrayObject.split.pinDescriptions.rest')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 88,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as IArrayObjectSplitNodeData;
  stateChunkSize.value = normalizeChunkSize(Number(data.chunkSize ?? 2));
  stateInitialized.value = true;
});

watch(stateChunkSize, () => {
  if (!stateInitialized.value) {
    return;
  }

  const normalized = normalizeChunkSize(stateChunkSize.value);
  if (normalized !== stateChunkSize.value) {
    stateChunkSize.value = normalized;
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    chunkSize: normalized
  };
});
</script>
