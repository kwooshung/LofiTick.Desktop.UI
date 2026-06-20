<template>
  <CrawlersNodesCommonBasic :icon-name="computedIconName" :title="computedFunctionName" :description="computedDescription" :header-bg="computedHeaderBg" :left-pins="computedLeftPins" :right-pins="computedRightPins">
    <template #title-prefix>
      <UBadge v-if="computedHasTitlePrefix" color="neutral" variant="soft" size="sm" class="shrink-0">
        {{ computedTitlePrefix }}
      </UBadge>
    </template>
    <template #header-extra>
      <div class="flex max-w-48 items-center justify-end text-right">
        <div class="flex flex-wrap justify-end gap-1.5">
          <UBadge v-if="computedReferenceCount > 0" color="neutral" variant="subtle" size="sm">{{ t('pages.crawlers.editor.sidebar.row.reference', { count: computedReferenceCount }) }}</UBadge>
        </div>
      </div>
    </template>
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
  const remoteDescription = String(stateFunctionDetail.value?.description ?? '').trim();
  const localDescription = String((stateNode.node.data as Record<string, unknown> | undefined)?.functionDescription ?? '').trim();
  return remoteDescription !== '' ? remoteDescription : localDescription;
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
  return 'i-mdi-function-variant';
});

/**
 * 计算属性：作用域文案。
 */
const computedTitlePrefix = computed(() => {
  if (computedScope.value === 'global') {
    return '全局';
  }

  const targetIdValue = Number((stateNode.node.data as Record<string, unknown> | undefined)?.targetId ?? 0);

  if (Number.isFinite(targetIdValue) && targetIdValue > 0) {
    return `站点 #${targetIdValue}`;
  }

  return '站点';
});

/**
 * 计算属性：是否显示标题前缀。
 */
const computedHasTitlePrefix = computed(() => computedTitlePrefix.value !== '');

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
