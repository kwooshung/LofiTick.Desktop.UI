<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-shuffle" :title="t('components.crawler.blueprint.nodes.math.random.title')" :description="t('components.crawler.blueprint.nodes.math.random.description')" header-color="" header-bg="bg-lime-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.math.random.fields.numberType.label')">
        <USelect v-model="stateNumberType" class="w-full" :items="stateNumberTypeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.math.random.fields.intervalType.label')">
        <USelect v-model="stateIntervalType" class="w-full" :items="stateIntervalTypeOptions" value-attribute="value" option-attribute="label" />

        <p class="text-muted mt-1 text-xs">
          {{ computedSelectedIntervalDescription }}
        </p>
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.math.random.fields.min.label')">
        <div v-if="hasTargetPinConnection('input-min-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInputNumber
          v-else
          id="crawlerMathRandomMin"
          v-model="stateMin"
          class="w-full"
          orientation="vertical"
          :step="computedNumberStep"
          :increment="{ color: 'neutral', variant: 'soft' }"
          :decrement="{ color: 'neutral', variant: 'soft' }"
        />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.math.random.fields.max.label')">
        <div v-if="hasTargetPinConnection('input-max-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInputNumber
          v-else
          id="crawlerMathRandomMax"
          v-model="stateMax"
          class="w-full"
          orientation="vertical"
          :step="computedNumberStep"
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

type TRandomIntervalType = 'leftClosedRightOpen' | 'leftOpenRightClosed' | 'open' | 'closed';
type TRandomNumberType = 'float' | 'integer';

interface IMathRandomNodeData {
  min?: number;
  max?: number;
  intervalType?: TRandomIntervalType;
  numberType?: TRandomNumberType;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateMin = ref(0);
const stateMax = ref(1);
const stateIntervalType = ref<TRandomIntervalType>('leftClosedRightOpen');
const stateNumberType = ref<TRandomNumberType>('float');

const computedNumberStep = computed(() => (stateNumberType.value === 'integer' ? 1 : 0.1));

const computedSelectedIntervalDescription = computed(() => {
  const targetOption = stateIntervalTypeOptions.value.find((option) => option.value === stateIntervalType.value);
  return String(targetOption?.description ?? '');
});

const stateIntervalTypeOptions = computed(() => [
  {
    value: 'leftClosedRightOpen',
    label: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.options.leftClosedRightOpen'),
    description: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.descriptions.leftClosedRightOpen')
  },
  {
    value: 'leftOpenRightClosed',
    label: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.options.leftOpenRightClosed'),
    description: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.descriptions.leftOpenRightClosed')
  },
  {
    value: 'open',
    label: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.options.open'),
    description: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.descriptions.open')
  },
  {
    value: 'closed',
    label: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.options.closed'),
    description: t('components.crawler.blueprint.nodes.math.random.fields.intervalType.descriptions.closed')
  }
]);

const stateNumberTypeOptions = computed(() => [
  { value: 'float', label: t('components.crawler.blueprint.nodes.math.random.fields.numberType.options.float') },
  { value: 'integer', label: t('components.crawler.blueprint.nodes.math.random.fields.numberType.options.integer') }
]);

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const leftPins: IBasicSidePin[] = [
  { id: 'input-min-number', label: 'min', direction: 'in', dataType: 'number', topPercent: 35, description: '随机下限' },
  { id: 'input-max-number', label: 'max', direction: 'in', dataType: 'number', topPercent: 75, description: '随机上限' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-number', label: 'result', direction: 'out', dataType: 'number', topPercent: 35, description: '随机数结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as IMathRandomNodeData;
  stateMin.value = Number.isFinite(Number(data.min)) ? Number(data.min) : 0;
  stateMax.value = Number.isFinite(Number(data.max)) ? Number(data.max) : 1;
  if (stateMax.value < stateMin.value) {
    stateMax.value = stateMin.value;
  }

  const nextIntervalType = String(data.intervalType ?? 'leftClosedRightOpen');
  stateIntervalType.value =
    nextIntervalType === 'leftOpenRightClosed' || nextIntervalType === 'open' || nextIntervalType === 'closed' ? nextIntervalType : 'leftClosedRightOpen';

  const nextNumberType = String(data.numberType ?? 'float');
  stateNumberType.value = nextNumberType === 'integer' ? 'integer' : 'float';

  stateInitialized.value = true;
});

watch([stateMin, stateMax, stateIntervalType, stateNumberType], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateMin.value = Number.isFinite(Number(stateMin.value)) ? Number(stateMin.value) : 0;
  stateMax.value = Number.isFinite(Number(stateMax.value)) ? Number(stateMax.value) : stateMin.value;

  if (stateMax.value < stateMin.value) {
    stateMax.value = stateMin.value;
  }

  if (stateNumberType.value === 'integer') {
    stateMin.value = Math.round(stateMin.value);
    stateMax.value = Math.round(stateMax.value);
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    min: stateMin.value,
    max: stateMax.value,
    intervalType: stateIntervalType.value,
    numberType: stateNumberType.value
  };
});
</script>
