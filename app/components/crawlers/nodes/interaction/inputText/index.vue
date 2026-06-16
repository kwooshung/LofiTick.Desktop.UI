<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-text-cursor-input" :title="t('components.crawler.blueprint.nodes.interaction.inputText.title')" :description="t('components.crawler.blueprint.nodes.interaction.inputText.description')" header-bg="bg-purple-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.text.label')">
        <UTextarea v-model="stateText" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.interaction.common.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.typeMode.label')">
        <USelect v-model="stateTypeMode" class="w-full" :items="stateTypeModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.randomInputInterval.label')">
        <USwitch v-model="stateRandomInputInterval" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.inputIntervalMs.label')">
        <div v-if="!stateRandomInputInterval" class="grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center">
          <CrawlersNodesCommonNumberInput
            id="crawlerInputTextInputIntervalMs"
            v-model="stateInputIntervalMs"
            :min="0"
            :step="10"
            :prefix="t('components.crawler.blueprint.nodes.interaction.common.fields.inputIntervalMs.input.prefix')"
            :unit="t('components.crawler.blueprint.nodes.interaction.common.fields.inputIntervalMs.input.unit')"
          />
        </div>

        <div v-else class="space-y-2">
          <CrawlersNodesCommonNumberInput
            id="crawlerInputTextInputIntervalMinMs"
            v-model="stateInputIntervalMinMs"
            :min="0"
            :step="10"
            :prefix="t('components.crawler.blueprint.nodes.interaction.common.fields.inputIntervalMinMs.input.prefix')"
            :unit="t('components.crawler.blueprint.nodes.interaction.common.fields.inputIntervalMinMs.input.unit')"
          />

          <CrawlersNodesCommonNumberInput
            id="crawlerInputTextInputIntervalMaxMs"
            v-model="stateInputIntervalMaxMs"
            :min="0"
            :step="10"
            :prefix="t('components.crawler.blueprint.nodes.interaction.common.fields.inputIntervalMaxMs.input.prefix')"
            :unit="t('components.crawler.blueprint.nodes.interaction.common.fields.inputIntervalMaxMs.input.unit')"
          />
        </div>
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.clearBefore.label')">
        <USwitch v-model="stateClearBefore" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionInputTextTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
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
const stateText = ref('');
const stateTypeMode = ref('type');
const stateRandomInputInterval = ref(false);
const stateInputIntervalMs = ref(60);
const stateInputIntervalMinMs = ref(40);
const stateInputIntervalMaxMs = ref(120);
const stateClearBefore = ref(true);
const stateTimeoutMs = ref(10000);
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

const stateTypeModeOptions = computed(() => {
  return [
    {
      value: 'type',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.typeMode.options.type')
    },
    {
      value: 'fill',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.typeMode.options.fill')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateText.value = String(data.text ?? '');
  stateTypeMode.value = ['type', 'fill'].includes(String(data.typeMode)) ? String(data.typeMode) : 'type';
  stateRandomInputInterval.value = Boolean(data.randomInputInterval ?? false);
  stateInputIntervalMs.value = Number.isFinite(Number(data.inputIntervalMs)) ? Math.max(0, Number(data.inputIntervalMs)) : 60;
  stateInputIntervalMinMs.value = Number.isFinite(Number(data.inputIntervalMinMs)) ? Math.max(0, Number(data.inputIntervalMinMs)) : 40;
  stateInputIntervalMaxMs.value = Number.isFinite(Number(data.inputIntervalMaxMs)) ? Math.max(0, Number(data.inputIntervalMaxMs)) : 120;
  stateInputIntervalMaxMs.value = Math.max(stateInputIntervalMinMs.value, stateInputIntervalMaxMs.value);
  stateClearBefore.value = Boolean(data.clearBefore ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateText, stateTypeMode, stateRandomInputInterval, stateInputIntervalMs, stateInputIntervalMinMs, stateInputIntervalMaxMs, stateClearBefore, stateTimeoutMs, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  const inputIntervalMinMs = Math.max(0, stateInputIntervalMinMs.value);
  const inputIntervalMaxMs = Math.max(inputIntervalMinMs, stateInputIntervalMaxMs.value);

  if (stateInputIntervalMinMs.value !== inputIntervalMinMs) {
    stateInputIntervalMinMs.value = inputIntervalMinMs;
  }

  if (stateInputIntervalMaxMs.value !== inputIntervalMaxMs) {
    stateInputIntervalMaxMs.value = inputIntervalMaxMs;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    typeMode: stateTypeMode.value,
    randomInputInterval: stateRandomInputInterval.value,
    inputIntervalMs: stateInputIntervalMs.value,
    inputIntervalMinMs,
    inputIntervalMaxMs,
    clearBefore: stateClearBefore.value,
    timeoutMs: stateTimeoutMs.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
