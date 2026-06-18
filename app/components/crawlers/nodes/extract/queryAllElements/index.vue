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

/**
 * 状态：stateNode。
 */
const stateNode = useNode();
/**
 * 状态：stateInitialized。
 */
const stateInitialized = ref(false);
/**
 * 状态：stateSelector。
 */
const stateSelector = ref('');
/**
 * 状态：stateSelectorType。
 */
const stateSelectorType = ref<'xpath' | 'css'>('xpath');

const rightPins: IBasicSidePin[] = [
  {
    id: 'elements-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.elements'),
    direction: 'out',
    dataType: 'array',
    topPercent: 30,
    description: t('components.crawler.blueprint.nodes.extract.queryAllElements.pinDescriptions.elements')
  },
  {
    id: 'elements-length',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 55,
    description: t('components.crawler.blueprint.nodes.extract.queryAllElements.pinDescriptions.length')
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

  /**
   * 常量：data。
   */
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
