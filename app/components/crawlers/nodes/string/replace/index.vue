<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-eraser" :title="t('components.crawler.blueprint.nodes.string.replace.title')" :description="t('components.crawler.blueprint.nodes.string.replace.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.replace.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.replace.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.replace.fields.search.label')">
        <div v-if="hasTargetPinConnection('input-search')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="stateSearch" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.replace.fields.search.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.replace.fields.replacement.label')">
        <div v-if="hasTargetPinConnection('input-replacement')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="stateReplacement" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.replace.fields.replacement.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IStringReplaceNodeData } from '@/components/crawlers/nodes/string/replace/index.types';

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();
/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();
/**
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();
/**
 * Hook：Vue Flow 边集合。
 */
const { edges } = useVueFlow();
/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);
/**
 * 状态：输入文本。
 */
const stateText = ref('');
/**
 * 状态：搜索文本。
 */
const stateSearch = ref('');
/**
 * 状态：替换文本。
 */
const stateReplacement = ref('');

/**
 * 函数：判断目标引脚是否已连接。
 * @param {string} handleId 引脚 ID。
 * @returns {boolean} 是否已连接。
 */
const hasTargetPinConnection = (handleId: string): boolean => {
  /**
   * 常量：nodeId。
   */
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') {
    return false;
  }
  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-text',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.text'),
    direction: 'in',
    dataType: 'string',
    topPercent: 20,
    description: t('components.crawler.blueprint.nodes.string.replace.pinDescriptions.text')
  },
  {
    id: 'input-search',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.search'),
    direction: 'in',
    dataType: 'string',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.string.replace.pinDescriptions.search')
  },
  {
    id: 'input-replacement',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.replacement'),
    direction: 'in',
    dataType: 'string',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.string.replace.pinDescriptions.replacement')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.replace.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }
  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as IStringReplaceNodeData;
  stateText.value = String(data.text ?? '');
  stateSearch.value = String(data.search ?? '');
  stateReplacement.value = String(data.replacement ?? '');
  stateInitialized.value = true;
});

watch([stateText, stateSearch, stateReplacement], () => {
  if (!stateInitialized.value) {
    return;
  }
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    search: stateSearch.value,
    replacement: stateReplacement.value
  };
});
</script>
