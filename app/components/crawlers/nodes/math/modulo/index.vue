<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-percent" :title="t('components.crawler.blueprint.nodes.math.modulo.title')" :description="t('components.crawler.blueprint.nodes.math.modulo.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField label="输入 A">
        <div v-if="hasTargetPinConnection('input-a-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInputNumber v-else id="crawlerMathModuloA" v-model="stateValueA" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>

      <UFormField label="输入 B">
        <div v-if="hasTargetPinConnection('input-b-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInputNumber v-else id="crawlerMathModuloB" v-model="stateValueB" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IMathModuloNodeData {
  valueA?: number;
  valueB?: number;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateValueA = ref(0);
const stateValueB = ref(1);

const leftPins: IBasicSidePin[] = [
  { id: 'input-a-number', label: 'a', direction: 'in', dataType: 'number', topPercent: 35, description: '被取模数 A' },
  { id: 'input-b-number', label: 'b', direction: 'in', dataType: 'number', topPercent: 75, description: '模数 B' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-number', label: 'result', direction: 'out', dataType: 'number', topPercent: 35, description: '取模结果' },
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
