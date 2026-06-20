<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-repeat" :title="t('components.crawler.blueprint.nodes.scroll.infinite.title')" header-bg="bg-cyan-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.infinite.fields.maxIterations.label')">
        <CrawlersNodesCommonNumberInput id="crawlerScrollInfiniteMaxIterations" v-model="stateMaxIterations" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.infinite.fields.stepPx.label')">
        <CrawlersNodesCommonNumberInput id="crawlerScrollInfiniteStepPx" v-model="stateStepPx" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.pixel')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.infinite.fields.intervalMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerScrollInfiniteIntervalMs" v-model="stateIntervalMs" :min="50" :step="50" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.infinite.fields.behavior.label')">
        <USelect v-model="stateBehavior" class="w-full" :items="stateBehaviorOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <USwitch v-model="stateStopWhenNoChange" :label="t('components.crawler.blueprint.nodes.scroll.infinite.fields.stopWhenNoChange.label')" />

      <UFormField v-if="stateStopWhenNoChange" :label="t('components.crawler.blueprint.nodes.scroll.infinite.fields.maxNoChangeCount.label')">
        <CrawlersNodesCommonNumberInput id="crawlerScrollInfiniteMaxNoChangeCount" v-model="stateMaxNoChangeCount" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
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
 * 状态：stateMaxIterations。
 */
const stateMaxIterations = ref(20);
/**
 * 状态：stateStepPx。
 */
const stateStepPx = ref(800);
/**
 * 状态：stateIntervalMs。
 */
const stateIntervalMs = ref(500);
/**
 * 状态：stateBehavior。
 */
const stateBehavior = ref('smooth');
/**
 * 状态：stateStopWhenNoChange。
 */
const stateStopWhenNoChange = ref(true);
/**
 * 状态：stateMaxNoChangeCount。
 */
const stateMaxNoChangeCount = ref(3);

const rightPins: IBasicSidePin[] = [
  {
    id: 'iteration-count-number',
    label: t('components.crawler.blueprint.nodes.scroll.infinite.outputs.iterationCount.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 25,
    description: t('components.crawler.blueprint.nodes.scroll.infinite.outputs.iterationCount.description')
  },
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 55,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 82,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

/**
 * 状态：stateBehaviorOptions。
 */
const stateBehaviorOptions = computed(() => {
  return [
    {
      value: 'auto',
      label: t('components.crawler.blueprint.nodes.scroll.infinite.fields.behavior.options.auto')
    },
    {
      value: 'smooth',
      label: t('components.crawler.blueprint.nodes.scroll.infinite.fields.behavior.options.smooth')
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
  stateMaxIterations.value = Number.isFinite(Number(data.maxIterations)) ? Math.max(1, Number(data.maxIterations)) : 20;
  stateStepPx.value = Number.isFinite(Number(data.stepPx)) ? Math.max(1, Number(data.stepPx)) : 800;
  stateIntervalMs.value = Number.isFinite(Number(data.intervalMs)) ? Math.max(50, Number(data.intervalMs)) : 500;
  stateBehavior.value = ['auto', 'smooth'].includes(String(data.behavior)) ? String(data.behavior) : 'smooth';
  stateStopWhenNoChange.value = Boolean(data.stopWhenNoChange ?? true);
  stateMaxNoChangeCount.value = Number.isFinite(Number(data.maxNoChangeCount)) ? Math.max(1, Number(data.maxNoChangeCount)) : 3;
  stateInitialized.value = true;
});

watch([stateMaxIterations, stateStepPx, stateIntervalMs, stateBehavior, stateStopWhenNoChange, stateMaxNoChangeCount], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    maxIterations: stateMaxIterations.value,
    stepPx: stateStepPx.value,
    intervalMs: stateIntervalMs.value,
    behavior: stateBehavior.value,
    stopWhenNoChange: stateStopWhenNoChange.value,
    maxNoChangeCount: stateMaxNoChangeCount.value
  };
});
</script>
