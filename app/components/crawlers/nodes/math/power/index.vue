<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-superscript" :title="t('components.crawler.blueprint.nodes.math.power.title')" :description="t('components.crawler.blueprint.nodes.math.power.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.math.power.fields.base.label')">
        <div v-if="hasTargetPinConnection('input-base-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber v-else id="crawlerMathPowerBase" v-model="stateBase" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.math.power.fields.exp.label')">
        <div v-if="hasTargetPinConnection('input-exponent-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber v-else id="crawlerMathPowerExp" v-model="stateExp" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IMathPowerNodeData } from '@/components/crawlers/nodes/math/power/index.types';

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
 * 状态：底数值。
 */
const stateBase = ref(2);
/**
 * 状态：指数值。
 */
const stateExp = ref(2);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-base-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.base'),
    direction: 'in',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.power.pinDescriptions.base')
  },
  {
    id: 'input-exponent-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exp'),
    direction: 'in',
    dataType: 'number',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.math.power.pinDescriptions.exp')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.power.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

/**
 * 函数：判断目标引脚是否已连接。
 * @param {string} handleId 引脚 ID。
 * @returns {boolean} 是否已连接。
 */
const hasTargetPinConnection = (handleId: string): boolean => {
  /**
   * 常量：nodeId。
   */
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

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as IMathPowerNodeData;
  stateBase.value = Number.isFinite(Number(data.base)) ? Number(data.base) : 2;
  stateExp.value = Number.isFinite(Number(data.exp)) ? Number(data.exp) : 2;
  stateInitialized.value = true;
});

watch([stateBase, stateExp], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    base: Number.isFinite(Number(stateBase.value)) ? Number(stateBase.value) : 2,
    exp: Number.isFinite(Number(stateExp.value)) ? Number(stateExp.value) : 2
  };
});
</script>
