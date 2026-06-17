<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-axis-3d" :title="t('components.crawler.blueprint.nodes.math.absolute.title')" :description="t('components.crawler.blueprint.nodes.math.absolute.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <UFormField label="输入值">
      <div v-if="hasTargetPinConnection('input-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
        <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
        <span class="truncate">已连接输入，使用连线值</span>
      </div>

      <UInputNumber v-else id="crawlerMathAbsoluteValue" v-model="stateValue" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
    </UFormField>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IMathAbsoluteNodeData {
  value?: number;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateValue = ref(0);

const leftPins: IBasicSidePin[] = [{ id: 'input-number', label: 'value', direction: 'in', dataType: 'number', topPercent: 50, description: '待求绝对值数值' }];

const rightPins: IBasicSidePin[] = [
  { id: 'result-number', label: 'result', direction: 'out', dataType: 'number', topPercent: 35, description: '绝对值结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

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
