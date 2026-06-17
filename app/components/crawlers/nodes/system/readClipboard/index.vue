<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-clipboard-copy" :title="t('components.crawler.blueprint.nodes.system.readClipboard.title')" :description="t('components.crawler.blueprint.nodes.system.readClipboard.description')" header-bg="bg-slate-500" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const rightPins: IBasicSidePin[] = [
  {
    id: 'clipboard-text',
    label: t('components.crawler.blueprint.nodes.system.readClipboard.outputs.text.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.system.readClipboard.outputs.text.description')
  },
  {
    id: 'clipboard-length',
    label: t('components.crawler.blueprint.nodes.system.readClipboard.outputs.length.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 46,
    description: t('components.crawler.blueprint.nodes.system.readClipboard.outputs.length.description')
  },
  {
    id: 'clipboard-has-text',
    label: t('components.crawler.blueprint.nodes.system.readClipboard.outputs.hasText.label'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.system.readClipboard.outputs.hasText.description')
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
