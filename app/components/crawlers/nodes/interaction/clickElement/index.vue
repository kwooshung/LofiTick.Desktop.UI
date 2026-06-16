<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-mouse-pointer-click" :title="t('components.crawler.blueprint.nodes.interaction.clickElement.title')" :description="t('components.crawler.blueprint.nodes.interaction.clickElement.description')" header-bg="bg-purple-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionClickTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.button.label')">
        <USelect v-model="stateButton" class="w-full" :items="stateButtonOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.clickCount.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionClickCount" v-model="stateClickCount" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
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
const stateButton = ref('left');
const stateClickCount = ref(1);
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

const stateButtonOptions = computed(() => {
  return [
    {
      value: 'left',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.button.options.left')
    },
    {
      value: 'middle',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.button.options.middle')
    },
    {
      value: 'right',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.button.options.right')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateButton.value = ['left', 'middle', 'right'].includes(String(data.button)) ? String(data.button) : 'left';
  stateClickCount.value = Number.isFinite(Number(data.clickCount)) ? Math.max(1, Number(data.clickCount)) : 1;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateTimeoutMs, stateButton, stateClickCount, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    timeoutMs: stateTimeoutMs.value,
    button: stateButton.value,
    clickCount: stateClickCount.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
