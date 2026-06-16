<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-list"
    :title="t('components.crawler.blueprint.nodes.arrayObject.length.title')"
    :description="t('components.crawler.blueprint.nodes.arrayObject.length.description')"
    header-color=""
    header-bg="bg-violet-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const leftPins: IBasicSidePin[] = [
  {
    id: 'array-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'in',
    dataType: 'array',
    topPercent: 50,
    description: '输入数组并输出长度'
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'length-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: '数组长度'
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
</script>
