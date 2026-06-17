<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-form-input" :title="t('components.crawler.blueprint.nodes.extract.getValue.title')" header-bg="bg-emerald-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.extract.getValue.fields.valueType.label')">
        <USelect v-model="stateValueType" class="w-full" :items="stateValueTypeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <USwitch v-model="stateTrim" :label="t('components.crawler.blueprint.nodes.extract.getValue.fields.trim.label')" />
      <USwitch v-model="stateParseNumber" :label="t('components.crawler.blueprint.nodes.extract.getValue.fields.parseNumber.label')" />

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerExtractGetValueTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
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

const stateValueType = ref('value');
const stateTrim = ref(true);
const stateParseNumber = ref(false);
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
    id: 'value-any',
    label: t('components.crawler.blueprint.nodes.extract.getValue.outputs.value.label'),
    direction: 'out',
    dataType: 'any',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.extract.getValue.outputs.value.description')
  },
  {
    id: 'value-string',
    label: t('components.crawler.blueprint.nodes.extract.getValue.outputs.stringValue.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 42,
    description: t('components.crawler.blueprint.nodes.extract.getValue.outputs.stringValue.description')
  },
  {
    id: 'value-number',
    label: t('components.crawler.blueprint.nodes.extract.getValue.outputs.numberValue.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 60,
    description: t('components.crawler.blueprint.nodes.extract.getValue.outputs.numberValue.description')
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

const stateValueTypeOptions = computed(() => {
  return [
    {
      value: 'value',
      label: t('components.crawler.blueprint.nodes.extract.getValue.fields.valueType.options.value')
    },
    {
      value: 'checked',
      label: t('components.crawler.blueprint.nodes.extract.getValue.fields.valueType.options.checked')
    },
    {
      value: 'text',
      label: t('components.crawler.blueprint.nodes.extract.getValue.fields.valueType.options.text')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateValueType.value = ['value', 'checked', 'text'].includes(String(data.valueType)) ? String(data.valueType) : 'value';
  stateTrim.value = Boolean(data.trim ?? true);
  stateParseNumber.value = Boolean(data.parseNumber ?? false);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateInitialized.value = true;
});

watch([stateValueType, stateTrim, stateParseNumber, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    valueType: stateValueType.value,
    trim: stateTrim.value,
    parseNumber: stateParseNumber.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
