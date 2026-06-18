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
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber v-else id="crawlerMathRandomMin" v-model="stateMin" class="w-full" orientation="vertical" :step="computedNumberStep" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.math.random.fields.max.label')">
        <div v-if="hasTargetPinConnection('input-max-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber v-else id="crawlerMathRandomMax" v-model="stateMax" class="w-full" orientation="vertical" :step="computedNumberStep" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IMathRandomNodeData, TRandomIntervalType, TRandomNumberType } from '@/components/crawlers/nodes/math/random/index.types';

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
 * 状态：最小值。
 */
const stateMin = ref(0);
/**
 * 状态：最大值。
 */
const stateMax = ref(1);
/**
 * 状态：区间类型。
 */
const stateIntervalType = ref<TRandomIntervalType>('leftClosedRightOpen');
/**
 * 状态：数值类型。
 */
const stateNumberType = ref<TRandomNumberType>('float');

/**
 * 计算属性：数值步长。
 */
const computedNumberStep = computed(() => (stateNumberType.value === 'integer' ? 1 : 0.1));

/**
 * 计算属性：当前区间说明。
 */
const computedSelectedIntervalDescription = computed(() => {
  const targetOption = stateIntervalTypeOptions.value.find((option) => option.value === stateIntervalType.value);
  return String(targetOption?.description ?? '');
});

/**
 * 计算属性：区间类型选项。
 */
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

/**
 * 计算属性：数值类型选项。
 */
const stateNumberTypeOptions = computed(() => [
  { value: 'float', label: t('components.crawler.blueprint.nodes.math.random.fields.numberType.options.float') },
  { value: 'integer', label: t('components.crawler.blueprint.nodes.math.random.fields.numberType.options.integer') }
]);

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
    id: 'input-min-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.min'),
    direction: 'in',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.random.pinDescriptions.min')
  },
  {
    id: 'input-max-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.max'),
    direction: 'in',
    dataType: 'number',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.math.random.pinDescriptions.max')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.random.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
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
  stateIntervalType.value = nextIntervalType === 'leftOpenRightClosed' || nextIntervalType === 'open' || nextIntervalType === 'closed' ? nextIntervalType : 'leftClosedRightOpen';

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
