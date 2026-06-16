<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-hash" :title="t('components.crawler.blueprint.nodes.arrayObject.item.title')" :description="t('components.crawler.blueprint.nodes.arrayObject.item.description')" header-color="" header-bg="bg-violet-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.arrayObject.item.fields.index.label')">
        <CrawlersNodesCommonNumberInput id="crawlerArrayObjectItemIndex" v-model="stateIndex" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
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
const stateIndex = ref(0);

const leftPins: IBasicSidePin[] = [
  {
    id: 'array-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'in',
    dataType: 'array',
    topPercent: 35,
    description: '输入数组'
  },
  {
    id: 'index-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.index'),
    direction: 'in',
    dataType: 'number',
    topPercent: 70,
    description: '输入索引（可覆盖面板中的默认索引）'
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'item-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.item'),
    direction: 'out',
    dataType: 'any',
    topPercent: 30,
    description: '索引对应的数据项'
  },
  {
    id: 'exists-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exists'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 55,
    description: '该索引是否存在'
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
  stateIndex.value = Number.isFinite(Number(data.index)) ? Math.max(0, Number(data.index)) : 0;
  stateInitialized.value = true;
});

watch(stateIndex, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    index: stateIndex.value
  };
});
</script>
