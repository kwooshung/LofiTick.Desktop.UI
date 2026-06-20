<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-mouse" :title="t('components.crawler.blueprint.nodes.interaction.hoverElement.title')" header-bg="bg-purple-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionHoverTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <USwitch v-model="stateRandomHoverDelay" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.randomHoverDelay.label')" />

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.hoverDelayMs.label')">
        <div class="space-y-2">
          <CrawlersNodesCommonNumberInput
            v-if="!stateRandomHoverDelay"
            id="crawlerInteractionHoverDelayMs"
            v-model="stateHoverDelayMs"
            :min="0"
            :step="50"
            :prefix="t('components.crawler.blueprint.nodes.interaction.common.fields.hoverDelayMs.input.prefix')"
            :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')"
          />

          <div v-else class="space-y-2">
            <CrawlersNodesCommonNumberInput
              id="crawlerInteractionHoverDelayMinMs"
              v-model="stateHoverDelayMinMs"
              :min="0"
              :step="50"
              :prefix="t('components.crawler.blueprint.nodes.interaction.common.fields.hoverDelayMinMs.input.prefix')"
              :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')"
            />
            <CrawlersNodesCommonNumberInput
              id="crawlerInteractionHoverDelayMaxMs"
              v-model="stateHoverDelayMaxMs"
              :min="0"
              :step="50"
              :prefix="t('components.crawler.blueprint.nodes.interaction.common.fields.hoverDelayMaxMs.input.prefix')"
              :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')"
            />
          </div>
        </div>
      </UFormField>

      <USwitch v-model="stateSimulateNativeInput" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')" />
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
 * 状态：stateTimeoutMs。
 */
const stateTimeoutMs = ref(10000);
/**
 * 状态：stateRandomHoverDelay。
 */
const stateRandomHoverDelay = ref(false);
/**
 * 状态：stateHoverDelayMs。
 */
const stateHoverDelayMs = ref(0);
/**
 * 状态：stateHoverDelayMinMs。
 */
const stateHoverDelayMinMs = ref(0);
/**
 * 状态：stateHoverDelayMaxMs。
 */
const stateHoverDelayMaxMs = ref(300);
/**
 * 状态：stateSimulateNativeInput。
 */
const stateSimulateNativeInput = ref(false);

const leftPins: IBasicSidePin[] = [
  {
    id: 'element-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.interaction.common.pinDescriptions.elementInput')
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

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateRandomHoverDelay.value = Boolean(data.randomHoverDelay ?? false);
  stateHoverDelayMs.value = Number.isFinite(Number(data.hoverDelayMs)) ? Math.max(0, Number(data.hoverDelayMs)) : 0;
  stateHoverDelayMinMs.value = Number.isFinite(Number(data.hoverDelayMinMs)) ? Math.max(0, Number(data.hoverDelayMinMs)) : 0;
  stateHoverDelayMaxMs.value = Number.isFinite(Number(data.hoverDelayMaxMs)) ? Math.max(0, Number(data.hoverDelayMaxMs)) : 300;
  stateHoverDelayMaxMs.value = Math.max(stateHoverDelayMinMs.value, stateHoverDelayMaxMs.value);
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateTimeoutMs, stateRandomHoverDelay, stateHoverDelayMs, stateHoverDelayMinMs, stateHoverDelayMaxMs, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  /**
   * 常量：hoverDelayMinMs。
   */
  const hoverDelayMinMs = Math.max(0, stateHoverDelayMinMs.value);
  /**
   * 常量：hoverDelayMaxMs。
   */
  const hoverDelayMaxMs = Math.max(hoverDelayMinMs, stateHoverDelayMaxMs.value);

  if (stateHoverDelayMinMs.value !== hoverDelayMinMs) {
    stateHoverDelayMinMs.value = hoverDelayMinMs;
  }

  if (stateHoverDelayMaxMs.value !== hoverDelayMaxMs) {
    stateHoverDelayMaxMs.value = hoverDelayMaxMs;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    timeoutMs: stateTimeoutMs.value,
    randomHoverDelay: stateRandomHoverDelay.value,
    hoverDelayMs: stateHoverDelayMs.value,
    hoverDelayMinMs,
    hoverDelayMaxMs,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
