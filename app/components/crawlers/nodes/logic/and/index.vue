<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-ampersand" :title="t('components.crawler.blueprint.nodes.logic.and.title')" :description="t('components.crawler.blueprint.nodes.logic.and.description')" header-bg="bg-rose-500" :left-pins="leftPins" :right-pins="rightPins" />
</template>

<script setup lang="ts">
import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const leftPins: IBasicSidePin[] = [
  { id: 'input-a-boolean', label: 'a', direction: 'in', dataType: 'boolean', topPercent: 35, description: '布尔值 A' },
  { id: 'input-b-boolean', label: 'b', direction: 'in', dataType: 'boolean', topPercent: 75, description: '布尔值 B' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-boolean', label: 'result', direction: 'out', dataType: 'boolean', topPercent: 35, description: '逻辑运算结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];
</script>
