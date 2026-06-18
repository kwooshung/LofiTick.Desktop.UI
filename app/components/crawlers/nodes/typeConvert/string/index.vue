<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-quote" :title="t('components.crawler.blueprint.nodes.typeConvert.string.title')" :description="t('components.crawler.blueprint.nodes.typeConvert.string.description')" header-bg="bg-yellow-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.string.fields.treatNullAsEmpty.label')">
        <USwitch v-model="stateTreatNullAsEmpty" />
      </UFormField>
      <div class="flex items-center justify-between rounded-sm border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <span>{{ t('components.crawler.blueprint.nodes.typeConvert.string.hint') }}</span>
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
const stateTreatNullAsEmpty = ref(false);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.input'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.string.inputs.input.description')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.string.outputs.result.description')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateTreatNullAsEmpty.value = Boolean(data.treatNullAsEmpty ?? false);
  stateInitialized.value = true;
});

watch(stateTreatNullAsEmpty, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    treatNullAsEmpty: stateTreatNullAsEmpty.value
  };
});
</script>
