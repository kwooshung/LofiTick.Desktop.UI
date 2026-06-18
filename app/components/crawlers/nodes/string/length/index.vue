<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-ruler" :title="t('components.crawler.blueprint.nodes.string.length.title')" :description="t('components.crawler.blueprint.nodes.string.length.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <UFormField :label="t('components.crawler.blueprint.nodes.string.length.fields.text.label')">
      <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
        <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
        <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
      </div>

      <UTextarea v-else v-model="stateText" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.length.fields.text.placeholder')" />
    </UFormField>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IStringLengthNodeData {
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
    description: t('components.crawler.blueprint.nodes.string.length.pinDescriptions.text')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.length.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }
  const data = (stateNode.node.data ?? {}) as IStringLengthNodeData;
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
