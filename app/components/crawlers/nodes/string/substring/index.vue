<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-scissors" :title="t('components.crawler.blueprint.nodes.string.substring.title')" :description="t('components.crawler.blueprint.nodes.string.substring.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.substring.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.substring.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.substring.fields.start.label')">
        <div v-if="hasTargetPinConnection('input-start')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <CrawlersNodesCommonNumberInput v-else id="crawlerStringSubstringStart" v-model="stateStart" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.substring.fields.length.label')">
        <div v-if="hasTargetPinConnection('input-length')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <CrawlersNodesCommonNumberInput v-else id="crawlerStringSubstringLength" v-model="stateLength" :min="0" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IStringSubstringNodeData } from '@/components/crawlers/nodes/string/substring/index.types';

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
const stateText = ref('');
const stateStart = ref(0);
const stateLength = ref(10);

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
    topPercent: 25,
    description: t('components.crawler.blueprint.nodes.string.substring.pinDescriptions.text')
  },
  {
    id: 'input-start',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.start'),
    direction: 'in',
    dataType: 'number',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.string.substring.pinDescriptions.start')
  },
  {
    id: 'input-length',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'in',
    dataType: 'number',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.string.substring.pinDescriptions.length')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.substring.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }
  const data = (stateNode.node.data ?? {}) as IStringSubstringNodeData;
  stateText.value = String(data.text ?? '');
  stateStart.value = Number.isFinite(Number(data.start)) ? Math.max(0, Number(data.start)) : 0;
  stateLength.value = Number.isFinite(Number(data.length)) ? Math.max(0, Number(data.length)) : 10;
  stateInitialized.value = true;
});

watch([stateText, stateStart, stateLength], () => {
  if (!stateInitialized.value) {
    return;
  }
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    start: Number.isFinite(Number(stateStart.value)) ? Math.max(0, Number(stateStart.value)) : 0,
    length: Number.isFinite(Number(stateLength.value)) ? Math.max(0, Number(stateLength.value)) : 10
  };
});
</script>
