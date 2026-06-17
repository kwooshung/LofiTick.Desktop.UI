<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-superscript" :title="t('components.crawler.blueprint.nodes.math.power.title')" :description="t('components.crawler.blueprint.nodes.math.power.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField label="底数 (base)">
        <div v-if="hasTargetPinConnection('input-base-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInputNumber
          v-else
          id="crawlerMathPowerBase"
          v-model="stateBase"
          class="w-full"
          orientation="vertical"
          :step="0.1"
          :increment="{ color: 'neutral', variant: 'soft' }"
          :decrement="{ color: 'neutral', variant: 'soft' }"
        />
      </UFormField>

      <UFormField label="指数 (exp)">
        <div v-if="hasTargetPinConnection('input-exponent-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInputNumber
          v-else
          id="crawlerMathPowerExp"
          v-model="stateExp"
          class="w-full"
          orientation="vertical"
          :step="0.1"
          :increment="{ color: 'neutral', variant: 'soft' }"
          :decrement="{ color: 'neutral', variant: 'soft' }"
        />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IMathPowerNodeData {
  base?: number;
  exp?: number;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateBase = ref(2);
const stateExp = ref(2);

const leftPins: IBasicSidePin[] = [
  { id: 'input-base-number', label: 'base', direction: 'in', dataType: 'number', topPercent: 35, description: '底数' },
  { id: 'input-exponent-number', label: 'exp', direction: 'in', dataType: 'number', topPercent: 75, description: '指数' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-number', label: 'result', direction: 'out', dataType: 'number', topPercent: 35, description: '幂运算结果' },
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
