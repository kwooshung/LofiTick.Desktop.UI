<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-search" :title="t('components.crawler.blueprint.nodes.extract.queryElement.title')" :description="t('components.crawler.blueprint.nodes.extract.queryElement.description')" header-bg="bg-emerald-500" :right-pins="rightPins">
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
    id: 'element-object',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'out',
    dataType: 'object',
    topPercent: 30,
    description: '查询到的单个元素对象'
  },
  {
    id: 'element-exists',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exists'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 55,
    description: '是否查询到元素'
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
