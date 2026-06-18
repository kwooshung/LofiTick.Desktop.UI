<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-braces" :title="t('components.crawler.blueprint.nodes.typeConvert.parseJson.title')" :description="t('components.crawler.blueprint.nodes.typeConvert.parseJson.description')" header-bg="bg-yellow-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.parseJson.fields.fallbackValue.label')">
        <UTextarea v-model="stateFallbackValue" placeholder="null" rows="2" class="w-full" />
      </UFormField>
      <div class="flex items-center justify-between rounded-sm border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <span>{{ t('components.crawler.blueprint.nodes.typeConvert.parseJson.hint') }}</span>
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
const stateFallbackValue = ref('null');

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.input'),
    direction: 'in',
    dataType: 'string',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.parseJson.inputs.input.description')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'any',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.typeConvert.parseJson.outputs.result.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 65,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateFallbackValue.value = String(data.fallbackValue ?? 'null');
  stateInitialized.value = true;
});

watch(stateFallbackValue, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    fallbackValue: stateFallbackValue.value
  };
});
</script>
