<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-maximize" :title="t('components.crawler.blueprint.nodes.system.screenSize.title')" :description="t('components.crawler.blueprint.nodes.system.screenSize.description')" header-bg="bg-slate-500" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const rightPins: IBasicSidePin[] = [
  {
    id: 'screen-width',
    label: t('components.crawler.blueprint.nodes.system.screenSize.outputs.width.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.system.screenSize.outputs.width.description')
  },
  {
    id: 'screen-height',
    label: t('components.crawler.blueprint.nodes.system.screenSize.outputs.height.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 46,
    description: t('components.crawler.blueprint.nodes.system.screenSize.outputs.height.description')
  },
  {
    id: 'screen-size',
    label: t('components.crawler.blueprint.nodes.system.screenSize.outputs.size.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.system.screenSize.outputs.size.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 88,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];
</script>
