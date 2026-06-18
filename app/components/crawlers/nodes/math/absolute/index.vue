<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-axis-3d" :title="t('components.crawler.blueprint.nodes.math.absolute.title')" :description="t('components.crawler.blueprint.nodes.math.absolute.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <UFormField :label="t('components.crawler.blueprint.nodes.math.absolute.fields.value.label')">
      <div v-if="hasTargetPinConnection('input-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
        <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
        <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
      </div>

      <UInputNumber v-else id="crawlerMathAbsoluteValue" v-model="stateValue" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
    </UFormField>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IMathAbsoluteNodeData } from '@/components/crawlers/nodes/math/absolute/index.types';

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
 * 状态：输入数值。
 */
const stateValue = ref(0);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'number',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.math.absolute.pinDescriptions.input')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.absolute.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

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

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as IMathAbsoluteNodeData;
  stateValue.value = Number.isFinite(Number(data.value)) ? Number(data.value) : 0;
  stateInitialized.value = true;
});

watch(stateValue, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    value: Number.isFinite(Number(stateValue.value)) ? Number(stateValue.value) : 0
  };
});
</script>
