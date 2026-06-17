<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-text" :title="t('components.crawler.blueprint.nodes.string.lowercase.title')" :description="t('components.crawler.blueprint.nodes.string.lowercase.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <UFormField :label="t('components.crawler.blueprint.nodes.string.lowercase.fields.text.label')">
      <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
        <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
        <span class="truncate">已连接输入，使用连线值</span>
      </div>

      <UTextarea v-else v-model="stateText" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.lowercase.fields.text.placeholder')" />
    </UFormField>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IStringLowercaseNodeData {
  text?: string;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateText = ref('');

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') return false;
  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const leftPins: IBasicSidePin[] = [{ id: 'input-text', label: 'text', direction: 'in', dataType: 'string', topPercent: 50, description: '待转小写的文本' }];

const rightPins: IBasicSidePin[] = [
  { id: 'result-string', label: 'result', direction: 'out', dataType: 'string', topPercent: 35, description: '小写结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) return;
  const data = (stateNode.node.data ?? {}) as IStringLowercaseNodeData;
  stateText.value = String(data.text ?? '');
  stateInitialized.value = true;
});

watch(stateText, () => {
  if (!stateInitialized.value) return;
  stateNode.node.data = { ...(stateNode.node.data as Record<string, unknown> | undefined), text: stateText.value };
});
</script>
