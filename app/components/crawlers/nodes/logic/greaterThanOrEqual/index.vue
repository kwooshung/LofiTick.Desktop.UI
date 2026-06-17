<template>
  <CrawlersNodesCommonBasic icon-name="i-mdi:greater-than-or-equal" :title="t('components.crawler.blueprint.nodes.logic.greaterThanOrEqual.title')" :description="t('components.crawler.blueprint.nodes.logic.greaterThanOrEqual.description')" header-bg="bg-rose-500" :left-pins="leftPins" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const leftPins: IBasicSidePin[] = [
  { id: 'input-a-number', label: 'a', direction: 'in', dataType: 'number', topPercent: 35, description: '数值 A' },
  { id: 'input-b-number', label: 'b', direction: 'in', dataType: 'number', topPercent: 75, description: '数值 B' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-boolean', label: 'result', direction: 'out', dataType: 'boolean', topPercent: 35, description: '比较结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];
</script>

