<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-arrow-down-to-line" :title="t('components.crawler.blueprint.nodes.scroll.toPosition.title')" header-bg="bg-cyan-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.mode.label')">
        <USelect v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <div v-if="stateMode === 'position'" class="space-y-2">
        <UFormField :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.x.label')">
          <CrawlersNodesCommonNumberInput id="crawlerScrollToPositionX" v-model="stateX" :min="0" :step="0.1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.y.label')">
          <CrawlersNodesCommonNumberInput id="crawlerScrollToPositionY" v-model="stateY" :min="0" :step="0.1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>
      </div>

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.behavior.label')">
        <USelect v-model="stateBehavior" class="w-full" :items="stateBehaviorOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <USwitch v-model="stateRandomOffset" :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.randomOffset.label')" />

      <div v-if="stateRandomOffset" class="space-y-2">
        <UFormField :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.offsetMin.label')">
          <CrawlersNodesCommonNumberInput id="crawlerScrollToPositionOffsetMin" v-model="stateOffsetMin" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.offsetMax.label')">
          <CrawlersNodesCommonNumberInput id="crawlerScrollToPositionOffsetMax" v-model="stateOffsetMax" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
        </UFormField>
      </div>

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.toPosition.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerScrollToPositionTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

/**
 * 状态：stateNode。
 */
const stateNode = useNode();
/**
 * 状态：stateInitialized。
 */
const stateInitialized = ref(false);

/**
 * 状态：stateMode。
 */
const stateMode = ref('position');
/**
 * 状态：stateX。
 */
const stateX = ref(0);
/**
 * 状态：stateY。
 */
const stateY = ref(0);
/**
 * 状态：stateBehavior。
 */
const stateBehavior = ref('smooth');
/**
 * 状态：stateRandomOffset。
 */
const stateRandomOffset = ref(false);
/**
 * 状态：stateOffsetMin。
 */
const stateOffsetMin = ref(2);
/**
 * 状态：stateOffsetMax。
 */
const stateOffsetMax = ref(12);
/**
 * 状态：stateTimeoutMs。
 */
const stateTimeoutMs = ref(10000);

const leftPins: IBasicSidePin[] = [
  {
    id: 'element-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.common.pinLabels.element')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

/**
 * 状态：stateModeOptions。
 */
const stateModeOptions = computed(() => {
  return [
    {
      value: 'position',
      label: t('components.crawler.blueprint.nodes.scroll.toPosition.fields.mode.options.position')
    },
    {
      value: 'element',
      label: t('components.crawler.blueprint.nodes.scroll.toPosition.fields.mode.options.element')
    }
  ];
});

/**
 * 状态：stateBehaviorOptions。
 */
const stateBehaviorOptions = computed(() => {
  return [
    {
      value: 'auto',
      label: t('components.crawler.blueprint.nodes.scroll.toPosition.fields.behavior.options.auto')
    },
    {
      value: 'smooth',
      label: t('components.crawler.blueprint.nodes.scroll.toPosition.fields.behavior.options.smooth')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateMode.value = ['position', 'element'].includes(String(data.mode)) ? String(data.mode) : 'position';
  stateX.value = Number.isFinite(Number(data.x)) ? Math.max(0, Number(data.x)) : 0;
  stateY.value = Number.isFinite(Number(data.y)) ? Math.max(0, Number(data.y)) : 0;
  stateBehavior.value = ['auto', 'smooth'].includes(String(data.behavior)) ? String(data.behavior) : 'smooth';
  stateRandomOffset.value = Boolean(data.randomOffset ?? false);
  stateOffsetMin.value = Number.isFinite(Number(data.offsetMin)) ? Math.max(0, Number(data.offsetMin)) : 2;
  stateOffsetMax.value = Number.isFinite(Number(data.offsetMax)) ? Math.max(0, Number(data.offsetMax)) : 12;
  stateOffsetMax.value = Math.max(stateOffsetMin.value, stateOffsetMax.value);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateInitialized.value = true;
});

watch([stateMode, stateX, stateY, stateBehavior, stateRandomOffset, stateOffsetMin, stateOffsetMax, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  /**
   * 常量：offsetMin。
   */
  const offsetMin = Math.max(0, stateOffsetMin.value);
  /**
   * 常量：offsetMax。
   */
  const offsetMax = Math.max(offsetMin, stateOffsetMax.value);

  if (stateOffsetMin.value !== offsetMin) {
    stateOffsetMin.value = offsetMin;
  }

  if (stateOffsetMax.value !== offsetMax) {
    stateOffsetMax.value = offsetMax;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    mode: stateMode.value,
    x: stateX.value,
    y: stateY.value,
    behavior: stateBehavior.value,
    randomOffset: stateRandomOffset.value,
    offsetMin,
    offsetMax,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
