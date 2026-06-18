<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-percent" :title="t('components.crawler.blueprint.nodes.math.modulo.title')" :description="t('components.crawler.blueprint.nodes.math.modulo.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.math.modulo.fields.valueA.label')">
        <div v-if="hasTargetPinConnection('input-a-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber v-else id="crawlerMathModuloA" v-model="stateValueA" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.math.modulo.fields.valueB.label')">
        <div v-if="hasTargetPinConnection('input-b-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber v-else id="crawlerMathModuloB" v-model="stateValueB" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IMathModuloNodeData } from '@/components/crawlers/nodes/math/modulo/index.types';

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
 * 状态：被除数值。
 */
const stateValueA = ref(0);
/**
 * 状态：除数值。
 */
const stateValueB = ref(1);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-a-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.a'),
    direction: 'in',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.modulo.pinDescriptions.valueA')
  },
  {
    id: 'input-b-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.b'),
    direction: 'in',
    dataType: 'number',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.math.modulo.pinDescriptions.valueB')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.modulo.pinDescriptions.result')
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

  const data = (stateNode.node.data ?? {}) as IMathModuloNodeData;
  stateValueA.value = Number.isFinite(Number(data.valueA)) ? Number(data.valueA) : 0;
  stateValueB.value = Number.isFinite(Number(data.valueB)) ? Number(data.valueB) : 1;
  stateInitialized.value = true;
});

watch([stateValueA, stateValueB], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    valueA: Number.isFinite(Number(stateValueA.value)) ? Number(stateValueA.value) : 0,
    valueB: Number.isFinite(Number(stateValueB.value)) ? Number(stateValueB.value) : 1
  };
});
</script>
