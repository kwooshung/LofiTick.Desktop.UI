<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-clipboard-plus" :title="t('components.crawler.blueprint.nodes.system.writeClipboard.title')" :description="t('components.crawler.blueprint.nodes.system.writeClipboard.description')" header-bg="bg-slate-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField v-if="!computedHasTextInput" :label="t('components.crawler.blueprint.nodes.system.writeClipboard.fields.text.label')">
        <UTextarea v-model="stateText" :rows="4" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.system.writeClipboard.fields.text.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

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

const computedHasTextInput = computed(() => hasTargetPinConnection('clipboard-text-input'));

const leftPins: IBasicSidePin[] = [
  {
    id: 'clipboard-text-input',
    label: t('components.crawler.blueprint.nodes.system.writeClipboard.inputs.text.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 30,
    description: t('components.crawler.blueprint.nodes.system.writeClipboard.inputs.text.description')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 28,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'written-text',
    label: t('components.crawler.blueprint.nodes.system.writeClipboard.outputs.text.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 56,
    description: t('components.crawler.blueprint.nodes.system.writeClipboard.outputs.text.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 84,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateText.value = String(data.text ?? '');
  stateInitialized.value = true;
});

watch([stateText], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value
  };
});
</script>
