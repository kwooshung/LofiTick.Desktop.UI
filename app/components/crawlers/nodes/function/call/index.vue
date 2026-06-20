<template>
  <CrawlersNodesCommonBasic :icon-name="computedIconName" :title="computedFunctionName" :description="computedDescription" :header-bg="computedHeaderBg" :left-pins="computedLeftPins" :right-pins="computedRightPins">
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
import { functionNodeMetaParse } from '@/components/crawlers/nodes/common/function/index';
import type { IFunctionDetailLike, IFunctionGraphNodeLike, IFunctionPinsExtractResult } from '@/components/crawlers/nodes/function/call/index.types';
import { variableInputHandleIdGet, variableOutputHandleIdGet } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * Hook：国际化。
 */
const { functionRefreshNonce = 0 } = defineProps<{ functionRefreshNonce?: number }>();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：当前节点。
 */
const stateNode = useNode();

/**
 * 计算属性：函数 ID。
 */
const computedFunctionId = computed(() => {
  const value = Number((stateNode.node.data as Record<string, unknown> | undefined)?.functionId ?? 0);

  return Number.isFinite(value) && value > 0 ? value : 0;
});

/**
 * API：函数详情。
 */
const { datas: stateFunctionDetail, refresh: refreshFunctionDetail } = await useApi<IFunctionDetailLike>('crawlers/functions/detail', {
  immediate: false
});

/**
 * 函数：从函数图中提取参数与返回值定义。
 * @param {unknown} graph 函数图。
 * @returns {{ parameters: IVariableDefinitionData[]; returns: IVariableDefinitionData[] }} 提取结果。
 */
const functionPinsExtractFromGraph = (graph: unknown): IFunctionPinsExtractResult => {
  const normalizedGraph = (() => {
    if (typeof graph === 'string') {
      try {
        return JSON.parse(graph) as unknown;
      } catch {
        return null;
      }
    }

    return graph;
  })();

  if (!normalizedGraph || typeof normalizedGraph !== 'object') {
    return { parameters: [], returns: [] };
  }

  const nodesValue = (normalizedGraph as { nodes?: unknown }).nodes;

  if (!Array.isArray(nodesValue)) {
    return { parameters: [], returns: [] };
  }

  const graphNodes = nodesValue as IFunctionGraphNodeLike[];
  const startNode = graphNodes.find((node) => ['function-start', 'start'].includes(String(node.type ?? '').trim()));
  const returnNode = graphNodes.find((node) => ['function-return', 'end'].includes(String(node.type ?? '').trim()));

  const startMeta = functionNodeMetaParse(startNode?.data);
  const returnMeta = functionNodeMetaParse(returnNode?.data);

  return {
    parameters: startMeta.functionParameters,
    returns: returnMeta.functionReturns
  };
};

watch(
  [computedFunctionId, () => functionRefreshNonce],
  ([functionId]) => {
    if (functionId <= 0) {
      return;
    }

    refreshFunctionDetail({
      datas: { id: functionId },
      replace: true
    });
  },
  { immediate: true }
);

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
  const remoteName = String(stateFunctionDetail.value?.name ?? '').trim();

  if (remoteName !== '') {
    return remoteName;
  }

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

/**
 * 计算属性：函数调用节点输入引脚。
 */
const computedLeftPins = computed<IBasicSidePin[]>(() => {
  const extracted = functionPinsExtractFromGraph(stateFunctionDetail.value?.graph);
  const fallbackMeta = functionNodeMetaParse((stateNode.node.data as Record<string, unknown> | undefined) ?? {});
  const sourcePins = extracted.parameters.length > 0 ? extracted.parameters : fallbackMeta.functionParameters;

  return sourcePins.map((item) => ({
    id: variableInputHandleIdGet(item.id, item.dataType),
    label: item.name.trim() !== '' ? item.name.trim() : t('components.crawler.blueprint.nodes.common.function.start.fields.parameterLabel'),
    direction: 'in',
    dataType: item.dataType,
    description: t('components.crawler.blueprint.nodes.common.function.start.fields.parameterDescription')
  }));
});

/**
 * 计算属性：函数调用节点输出引脚。
 */
const computedRightPins = computed<IBasicSidePin[]>(() => {
  const extracted = functionPinsExtractFromGraph(stateFunctionDetail.value?.graph);
  const fallbackMeta = functionNodeMetaParse((stateNode.node.data as Record<string, unknown> | undefined) ?? {});
  const sourcePins = extracted.returns.length > 0 ? extracted.returns : fallbackMeta.functionReturns;

  return sourcePins.map((item) => ({
    id: variableOutputHandleIdGet(item.id, item.dataType),
    label: item.name.trim() !== '' ? item.name.trim() : t('components.crawler.blueprint.nodes.common.function.return.fields.returnLabel'),
    direction: 'out',
    dataType: item.dataType,
    description: t('components.crawler.blueprint.nodes.common.function.return.fields.returnDescription')
  }));
});
</script>
