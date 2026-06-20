<template>
  <CrawlersNodesCommonBasic :icon-name="computedIconName" :title="computedFunctionName" :description="computedDescription" :header-bg="computedHeaderBg" :right-pins="rightPins">
    <div class="space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="neutral" variant="soft" size="sm">{{ computedScopeLabel }}</UBadge>
        <UBadge v-if="computedReferenceCount > 0" color="neutral" variant="subtle" size="sm">{{ t('pages.crawlers.editor.sidebar.row.reference', { count: computedReferenceCount }) }}</UBadge>
      </div>
      <p v-if="computedHasTargetText" class="text-muted text-xs">{{ computedTargetText }}</p>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：当前节点。
 */
const stateNode = useNode();

/**
 * 计算属性：函数作用域。
 */
const computedScope = computed<'site' | 'global'>(() => {
  const scopeValue = String((stateNode.node.data as Record<string, unknown> | undefined)?.functionScope ?? '').trim();

  return scopeValue === 'global' ? 'global' : 'site';
});

/**
 * 计算属性：函数名称。
 */
const computedFunctionName = computed(() => {
  const nameValue = String((stateNode.node.data as Record<string, unknown> | undefined)?.functionName ?? '').trim();

  if (nameValue !== '') {
    return nameValue;
  }

  return computedScope.value === 'global' ? t('pages.crawlers.editor.sidebar.tabs.globalFunctions') : t('pages.crawlers.editor.sidebar.tabs.siteFunctions');
});

/**
 * 计算属性：函数描述。
 */
const computedDescription = computed(() => {
  const functionIdValue = Number((stateNode.node.data as Record<string, unknown> | undefined)?.functionId ?? 0);

  if (Number.isFinite(functionIdValue) && functionIdValue > 0) {
    return t('pages.crawlers.editor.sidebar.row.id', { id: functionIdValue });
  }

  return '';
});

/**
 * 计算属性：节点标题栏背景。
 */
const computedHeaderBg = computed(() => {
  return computedScope.value === 'global' ? 'bg-sky-600' : 'bg-emerald-600';
});

/**
 * 计算属性：节点图标。
 */
const computedIconName = computed(() => {
  return computedScope.value === 'global' ? 'i-lucide:globe-2' : 'i-lucide:folder-code';
});

/**
 * 计算属性：作用域文案。
 */
const computedScopeLabel = computed(() => {
  return computedScope.value === 'global' ? t('pages.crawlers.editor.sidebar.tabs.globalFunctions') : t('pages.crawlers.editor.sidebar.tabs.siteFunctions');
});

/**
 * 计算属性：引用次数。
 */
const computedReferenceCount = computed<number>(() => {
  const countValue = Number((stateNode.node.data as Record<string, unknown> | undefined)?.referenceCount ?? 0);

  if (Number.isFinite(countValue) && countValue > 0) {
    return countValue;
  }

  return 0;
});

/**
 * 计算属性：站点 ID 文案。
 */
const computedTargetText = computed(() => {
  const targetIdValue = Number((stateNode.node.data as Record<string, unknown> | undefined)?.targetId ?? 0);

  if (!(Number.isFinite(targetIdValue) && targetIdValue > 0)) {
    return '';
  }

  return t('pages.crawlers.editor.sidebar.row.target', { id: targetIdValue });
});

/**
 * 计算属性：是否显示站点文案。
 */
const computedHasTargetText = computed(() => computedTargetText.value !== '');

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 86,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];
</script>
