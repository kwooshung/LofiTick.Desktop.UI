<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-split-square-horizontal" :title="t('components.crawler.blueprint.nodes.string.split.title')" :description="t('components.crawler.blueprint.nodes.string.split.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.split.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.split.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.split.fields.separator.label')">
        <div v-if="hasTargetPinConnection('input-separator')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInput v-else v-model="stateSeparator" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.split.fields.separator.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IStringSplitNodeData {
  text?: string;
  separator?: string;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateText = ref('');
const stateSeparator = ref(',');

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') return false;
  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const leftPins: IBasicSidePin[] = [
  { id: 'input-text', label: 'text', direction: 'in', dataType: 'string', topPercent: 35, description: '待分割的文本' },
  { id: 'input-separator', label: 'separator', direction: 'in', dataType: 'string', topPercent: 75, description: '分隔符' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-array', label: 'result', direction: 'out', dataType: 'array', topPercent: 35, description: '分割结果数组' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) return;
  const data = (stateNode.node.data ?? {}) as IStringSplitNodeData;
  stateText.value = String(data.text ?? '');
  stateSeparator.value = String(data.separator ?? ',');
  stateInitialized.value = true;
});

watch([stateText, stateSeparator], () => {
  if (!stateInitialized.value) return;
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    separator: stateSeparator.value
  };
});
</script>
