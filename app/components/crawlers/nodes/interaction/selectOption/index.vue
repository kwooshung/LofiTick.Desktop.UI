<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-list-filter" :title="t('components.crawler.blueprint.nodes.interaction.selectOption.title')" header-bg="bg-purple-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.optionMode.label')">
        <USelect v-model="stateOptionMode" class="w-full" :items="stateOptionModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.optionValue.label')">
        <UInput v-model="stateOptionValue" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.interaction.common.fields.optionValue.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionSelectOptionTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <USwitch v-model="stateSimulateNativeInput" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateInitialized = ref(false);
const stateOptionMode = ref('text');
const stateOptionValue = ref('');
const stateTimeoutMs = ref(10000);
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

const stateOptionModeOptions = computed(() => {
  return [
    {
      value: 'text',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.optionMode.options.text')
    },
    {
      value: 'value',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.optionMode.options.value')
    },
    {
      value: 'index',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.optionMode.options.index')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateOptionMode.value = ['text', 'value', 'index'].includes(String(data.optionMode)) ? String(data.optionMode) : 'text';
  stateOptionValue.value = String(data.optionValue ?? '');
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateOptionMode, stateOptionValue, stateTimeoutMs, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    optionMode: stateOptionMode.value,
    optionValue: stateOptionValue.value,
    timeoutMs: stateTimeoutMs.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
