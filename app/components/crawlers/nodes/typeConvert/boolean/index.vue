<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-toggle-left" :title="t('components.crawler.blueprint.nodes.typeConvert.boolean.title')" :description="t('components.crawler.blueprint.nodes.typeConvert.boolean.description')" header-bg="bg-yellow-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.boolean.fields.truthyValues.label')">
        <UTextarea v-model="stateTruthyValuesText" placeholder='true,1,"yes","on"' rows="3" class="w-full" />
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

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateTruthyValuesText.value = String(data.truthyValuesText ?? 'true,1,"yes","on"');
  stateInitialized.value = true;
});

watch(stateTruthyValuesText, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    truthyValuesText: stateTruthyValuesText.value
  };
});
</script>
