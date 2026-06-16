<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-list" :title="t('components.crawler.blueprint.nodes.extract.queryAllElements.title')" :description="t('components.crawler.blueprint.nodes.extract.queryAllElements.description')" header-bg="bg-emerald-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.selector.label')">
        <CrawlersNodesCommonSelectorInput v-model="stateSelector" v-model:selector-type="stateSelectorType" :placeholder="t('components.crawler.blueprint.nodes.interaction.common.fields.selector.placeholder')" />
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
const stateSelector = ref('');
const stateSelectorType = ref<'xpath' | 'css'>('xpath');

const rightPins: IBasicSidePin[] = [
  {
    id: 'elements-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.elements'),
    direction: 'out',
    dataType: 'array',
    topPercent: 30,
    description: '匹配到的元素数组'
  },
  {
    id: 'elements-length',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 55,
    description: '匹配到的元素数量'
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateSelector.value = String(data.selector ?? '');
  stateSelectorType.value = ['xpath', 'css'].includes(String(data.selectorType)) ? (String(data.selectorType) as 'xpath' | 'css') : 'xpath';
  stateInitialized.value = true;
});

watch([stateSelector, stateSelectorType], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    selector: stateSelector.value,
    selectorType: stateSelectorType.value
  };
});
</script>
