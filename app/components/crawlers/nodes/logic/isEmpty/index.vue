<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-circle-question-mark" :title="t('components.crawler.blueprint.nodes.logic.isEmpty.title')" :description="t('components.crawler.blueprint.nodes.logic.isEmpty.description')" header-bg="bg-rose-500" :left-pins="leftPins" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.logic.isEmpty.pinDescriptions.value')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.logic.isEmpty.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];
</script>
