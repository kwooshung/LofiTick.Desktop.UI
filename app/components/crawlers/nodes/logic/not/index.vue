<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-ban" :title="t('components.crawler.blueprint.nodes.logic.not.title')" :description="t('components.crawler.blueprint.nodes.logic.not.description')" header-bg="bg-rose-500" :left-pins="leftPins" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.logic.not.pinDescriptions.value')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.logic.not.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];
</script>
