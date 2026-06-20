<template>
  <CrawlersNodesCommonBasic
    icon-name="i-mdi:greater-than-or-equal"
    :title="t('components.crawler.blueprint.nodes.logic.greaterThanOrEqual.title')"
    :description="t('components.crawler.blueprint.nodes.logic.greaterThanOrEqual.description')"
    header-bg="bg-rose-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-a-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.a'),
    direction: 'in',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.logic.greaterThanOrEqual.pinDescriptions.valueA')
  },
  {
    id: 'input-b-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.b'),
    direction: 'in',
    dataType: 'number',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.logic.greaterThanOrEqual.pinDescriptions.valueB')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.logic.greaterThanOrEqual.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];
</script>
