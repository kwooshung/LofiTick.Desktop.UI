<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-toggle-left" :title="t('components.crawler.blueprint.nodes.typeConvert.boolean.title')" :description="t('components.crawler.blueprint.nodes.typeConvert.boolean.description')" header-bg="bg-yellow-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.boolean.fields.truthyValues.label')">
        <div class="space-y-2">
          <USelect :model-value="stateSelectedTruthyValues" :items="truthyValueOptions" multiple class="w-full" :placeholder="t('components.crawler.blueprint.nodes.typeConvert.boolean.fields.truthyValues.placeholder')" @update:model-value="handleTruthySelectChange" />
          <UTextarea v-model="stateTruthyValuesText" :placeholder="t('components.crawler.blueprint.nodes.typeConvert.boolean.fields.truthyValues.placeholder')" :rows="3" class="w-full" />
        </div>
      </UFormField>
      <div class="flex items-center justify-between rounded-sm border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <span>{{ t('components.crawler.blueprint.nodes.typeConvert.boolean.hint') }}</span>
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateInitialized = ref(false);
const stateTruthyValuesText = ref('true,1,"yes","on"');
const truthyValueOptions: string[] = ['true', '1', '"yes"', '"on"', 'y', 'ok'];

const stateSelectedTruthyValues = ref<string[]>(['true', '1', '"yes"', '"on"']);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.input'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.boolean.inputs.input.description')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.boolean.outputs.result.description')
  }
];

const parseTruthyValues = (text: string): string[] => {
  return String(text ?? '')
    .split(',')
    .map((value) => String(value ?? '').trim())
    .filter((value) => value !== '');
};

const updateSelectedValuesFromText = (): void => {
  const allValues = parseTruthyValues(stateTruthyValuesText.value);
  stateSelectedTruthyValues.value = allValues.filter((value) => truthyValueOptions.includes(value));
};

const handleTruthySelectChange = (val: unknown): void => {
  stateSelectedTruthyValues.value = Array.isArray(val)
    ? val.map((v) => (typeof v === 'string' ? v : String((v as Record<string, unknown>)?.value ?? v))).filter((v) => truthyValueOptions.includes(v))
    : [];
};

const mergeSelectedValuesToText = (selected: string[]): void => {
  const customValues = parseTruthyValues(stateTruthyValuesText.value).filter((value) => !truthyValueOptions.includes(value));
  const merged = [...new Set([...selected, ...customValues])];
  stateTruthyValuesText.value = merged.join(',');
};

const skipSync = ref(false);

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateTruthyValuesText.value = String(data.truthyValuesText ?? 'true,1,"yes","on"');
  updateSelectedValuesFromText();
  stateInitialized.value = true;
});

watch(
  stateSelectedTruthyValues,
  (selected) => {
    if (!stateInitialized.value) {
      return;
    }

    skipSync.value = true;
    mergeSelectedValuesToText(selected);
    skipSync.value = false;
  },
  { deep: true }
);

watch(stateTruthyValuesText, () => {
  if (!stateInitialized.value || skipSync.value) {
    return;
  }

  updateSelectedValuesFromText();

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    truthyValuesText: stateTruthyValuesText.value
  };
});
</script>
