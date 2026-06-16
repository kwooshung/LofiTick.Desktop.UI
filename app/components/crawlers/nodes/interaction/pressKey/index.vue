<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-key-round" :title="t('components.crawler.blueprint.nodes.interaction.pressKey.title')" :description="t('components.crawler.blueprint.nodes.interaction.pressKey.description')" header-bg="bg-purple-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.key.label')">
        <USelect v-model="stateKey" class="w-full" :items="stateKeyOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.repeatCount.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionPressKeyRepeatCount" v-model="stateRepeatCount" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.pressDurationMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionPressKeyDurationMs" v-model="statePressDurationMs" :min="0" :step="10" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionPressKeyTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
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
const stateKey = ref('Enter');
const stateRepeatCount = ref(1);
const statePressDurationMs = ref(0);
const stateTimeoutMs = ref(10000);
const stateSimulateNativeInput = ref(false);

const stateKeyOptionDefs = [
  { value: 'Enter', key: 'enter' },
  { value: 'Tab', key: 'tab' },
  { value: 'Shift+Tab', key: 'shiftTab' },
  { value: 'Escape', key: 'escape' },
  { value: 'Space', key: 'space' },
  { value: 'Backspace', key: 'backspace' },
  { value: 'Delete', key: 'delete' },
  { value: 'Insert', key: 'insert' },
  { value: 'Home', key: 'home' },
  { value: 'End', key: 'end' },
  { value: 'PageUp', key: 'pageUp' },
  { value: 'PageDown', key: 'pageDown' },
  { value: 'ArrowUp', key: 'arrowUp' },
  { value: 'ArrowDown', key: 'arrowDown' },
  { value: 'ArrowLeft', key: 'arrowLeft' },
  { value: 'ArrowRight', key: 'arrowRight' },
  { value: 'F1', key: 'f1' },
  { value: 'F2', key: 'f2' },
  { value: 'F3', key: 'f3' },
  { value: 'F4', key: 'f4' },
  { value: 'F5', key: 'f5' },
  { value: 'F6', key: 'f6' },
  { value: 'F7', key: 'f7' },
  { value: 'F8', key: 'f8' },
  { value: 'F9', key: 'f9' },
  { value: 'F10', key: 'f10' },
  { value: 'F11', key: 'f11' },
  { value: 'F12', key: 'f12' },
  { value: 'Ctrl+A', key: 'ctrlA' },
  { value: 'Ctrl+C', key: 'ctrlC' },
  { value: 'Ctrl+V', key: 'ctrlV' },
  { value: 'Ctrl+X', key: 'ctrlX' },
  { value: 'Ctrl+Z', key: 'ctrlZ' },
  { value: 'Ctrl+Y', key: 'ctrlY' },
  { value: 'Ctrl+S', key: 'ctrlS' },
  { value: 'Ctrl+P', key: 'ctrlP' },
  { value: 'Ctrl+F', key: 'ctrlF' },
  { value: 'Ctrl+R', key: 'ctrlR' },
  { value: 'Ctrl+L', key: 'ctrlL' },
  { value: 'Ctrl+T', key: 'ctrlT' },
  { value: 'Ctrl+W', key: 'ctrlW' },
  { value: 'Ctrl+Shift+T', key: 'ctrlShiftT' },
  { value: 'Ctrl+Shift+N', key: 'ctrlShiftN' },
  { value: 'Alt+Tab', key: 'altTab' },
  { value: 'Alt+F4', key: 'altF4' },
  { value: 'Shift+Enter', key: 'shiftEnter' },
  { value: 'Meta+C', key: 'metaC' },
  { value: 'Meta+V', key: 'metaV' },
  { value: 'Meta+S', key: 'metaS' },
  { value: 'Meta+Z', key: 'metaZ' }
] as const;

const stateAllowedKeyValues = stateKeyOptionDefs.map((item) => {
  return item.value;
});

const stateKeyOptions = computed(() => {
  return stateKeyOptionDefs.map((item) => {
    return {
      value: item.value,
      label: t(`components.crawler.blueprint.nodes.interaction.common.fields.key.options.${item.key}`)
    };
  });
});

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
  stateKey.value = stateAllowedKeyValues.includes(String(data.key)) ? String(data.key) : 'Enter';
  stateRepeatCount.value = Number.isFinite(Number(data.repeatCount)) ? Math.max(1, Number(data.repeatCount)) : 1;
  statePressDurationMs.value = Number.isFinite(Number(data.pressDurationMs)) ? Math.max(0, Number(data.pressDurationMs)) : 0;
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateKey, stateRepeatCount, statePressDurationMs, stateTimeoutMs, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    key: stateKey.value,
    repeatCount: stateRepeatCount.value,
    pressDurationMs: statePressDurationMs.value,
    timeoutMs: stateTimeoutMs.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
