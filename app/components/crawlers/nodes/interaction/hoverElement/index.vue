<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-mouse" :title="t('components.crawler.blueprint.nodes.interaction.hoverElement.title')" :description="t('components.crawler.blueprint.nodes.interaction.hoverElement.description')" header-bg="bg-purple-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionHoverTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.hoverDelayMs.label')">
        <div class="space-y-2">
          <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.randomHoverDelay.label')">
            <USwitch v-model="stateRandomHoverDelay" />
          </UFormField>

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

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')">
        <USwitch v-model="stateSimulateNativeInput" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateInitialized = ref(false);
const stateTimeoutMs = ref(10000);
const stateRandomHoverDelay = ref(false);
const stateHoverDelayMs = ref(0);
const stateHoverDelayMinMs = ref(0);
const stateHoverDelayMaxMs = ref(300);
const stateSimulateNativeInput = ref(false);

const leftPins: IBasicSidePin[] = [
  {
    id: 'element-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 50,
    description: '由元素查询节点输出的目标元素'
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

  const hoverDelayMinMs = Math.max(0, stateHoverDelayMinMs.value);
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
