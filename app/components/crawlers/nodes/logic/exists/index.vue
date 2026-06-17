<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-circle-check" :title="t('components.crawler.blueprint.nodes.logic.exists.title')" :description="t('components.crawler.blueprint.nodes.logic.exists.description')" header-bg="bg-rose-500" :left-pins="leftPins" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const leftPins: IBasicSidePin[] = [
  { id: 'input-any', label: 'value', direction: 'in', dataType: 'any', topPercent: 50, description: '待检测值' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-boolean', label: 'result', direction: 'out', dataType: 'boolean', topPercent: 35, description: '检测结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];
</script>

