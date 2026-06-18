<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-hash" :title="t('components.crawler.blueprint.nodes.typeConvert.number.title')" :description="t('components.crawler.blueprint.nodes.typeConvert.number.description')" header-bg="bg-yellow-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.number.fields.defaultValue.label')">
        <CrawlersNodesCommonNumberInput id="crawlerTypeConvertNumberDefault" v-model="stateDefaultValue" :min="-999999" :max="999999" :step="1" />
      </UFormField>
      <div class="flex items-center justify-between rounded-sm border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <span>{{ t('components.crawler.blueprint.nodes.typeConvert.number.hint') }}</span>
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
const stateDefaultValue = ref(0);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.input'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.number.inputs.input.description')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'number',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.number.outputs.result.description')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateDefaultValue.value = Number.isFinite(Number(data.defaultValue)) ? Number(data.defaultValue) : 0;
  stateInitialized.value = true;
});

watch(stateDefaultValue, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    defaultValue: stateDefaultValue.value
  };
});
</script>
