<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-app-window" :title="t('components.crawler.blueprint.nodes.system.windowSize.title')" :description="t('components.crawler.blueprint.nodes.system.windowSize.description')" header-bg="bg-slate-500" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const rightPins: IBasicSidePin[] = [
  {
    id: 'window-width',
    label: t('components.crawler.blueprint.nodes.system.windowSize.outputs.width.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.system.windowSize.outputs.width.description')
  },
  {
    id: 'window-height',
    label: t('components.crawler.blueprint.nodes.system.windowSize.outputs.height.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 46,
    description: t('components.crawler.blueprint.nodes.system.windowSize.outputs.height.description')
  },
  {
    id: 'window-size',
    label: t('components.crawler.blueprint.nodes.system.windowSize.outputs.size.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.system.windowSize.outputs.size.description')
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
