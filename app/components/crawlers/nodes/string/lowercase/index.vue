<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-text" :title="t('components.crawler.blueprint.nodes.string.lowercase.title')" :description="t('components.crawler.blueprint.nodes.string.lowercase.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <UFormField :label="t('components.crawler.blueprint.nodes.string.lowercase.fields.text.label')">
      <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
        <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
        <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
      </div>

      <UTextarea v-else v-model="stateText" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.lowercase.fields.text.placeholder')" />
    </UFormField>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IStringLowercaseNodeData } from '@/components/crawlers/nodes/string/lowercase/index.types';

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
 * 状态：输入文本值。
 */
const stateText = ref('');

/**
 * 函数：判断目标引脚是否已连接。
 * @param {string} handleId 引脚 ID。
 * @returns {boolean} 是否已连接。
 */
const hasTargetPinConnection = (handleId: string): boolean => {
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
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.string.lowercase.pinDescriptions.text')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.lowercase.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }
  const data = (stateNode.node.data ?? {}) as IStringLowercaseNodeData;
  stateText.value = String(data.text ?? '');
  stateInitialized.value = true;
});

watch(stateText, () => {
  if (!stateInitialized.value) {
    return;
  }
  stateNode.node.data = { ...(stateNode.node.data as Record<string, unknown> | undefined), text: stateText.value };
});
</script>
