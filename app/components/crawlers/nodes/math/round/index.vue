<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-circle-equal" :title="t('components.crawler.blueprint.nodes.math.round.title')" :description="t('components.crawler.blueprint.nodes.math.round.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <UFormField :label="t('components.crawler.blueprint.nodes.math.round.fields.value.label')">
      <div v-if="hasTargetPinConnection('input-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
        <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
        <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
      </div>

      <UInputNumber v-else id="crawlerMathRoundValue" v-model="stateValue" class="w-full" orientation="vertical" :step="0.1" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
    </UFormField>

    <UFormField :label="t('components.crawler.blueprint.nodes.math.round.fields.mode.label')">
      <USelect v-model="stateRoundMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
    </UFormField>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

type TRoundMode = 'round' | 'ceil' | 'floor';

interface IMathRoundNodeData {
  roundMode?: TRoundMode;
  value?: number;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateRoundMode = ref<TRoundMode>('round');
const stateValue = ref(0);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'number',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.math.round.pinDescriptions.input')
  }
];

const stateModeOptions = computed(() => [
  { value: 'round', label: t('components.crawler.blueprint.nodes.math.round.fields.mode.options.round') },
  { value: 'ceil', label: t('components.crawler.blueprint.nodes.math.round.fields.mode.options.ceil') },
  { value: 'floor', label: t('components.crawler.blueprint.nodes.math.round.fields.mode.options.floor') }
]);

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.round.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
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

  const data = (stateNode.node.data ?? {}) as IMathRoundNodeData;
  const nextMode = String(data.roundMode ?? 'round');
  stateRoundMode.value = nextMode === 'ceil' || nextMode === 'floor' ? nextMode : 'round';
  stateValue.value = Number.isFinite(Number(data.value)) ? Number(data.value) : 0;
  stateInitialized.value = true;
});

watch([stateRoundMode, stateValue], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    roundMode: stateRoundMode.value,
    value: Number.isFinite(Number(stateValue.value)) ? Number(stateValue.value) : 0
  };
});
</script>
