<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-eraser" :title="t('components.crawler.blueprint.nodes.string.replace.title')" :description="t('components.crawler.blueprint.nodes.string.replace.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.replace.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.replace.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.replace.fields.search.label')">
        <div v-if="hasTargetPinConnection('input-search')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInput v-else v-model="stateSearch" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.replace.fields.search.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.replace.fields.replacement.label')">
        <div v-if="hasTargetPinConnection('input-replacement')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInput v-else v-model="stateReplacement" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.replace.fields.replacement.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IStringReplaceNodeData {
  text?: string;
  search?: string;
  replacement?: string;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateText = ref('');
const stateSearch = ref('');
const stateReplacement = ref('');

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') return false;
  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const leftPins: IBasicSidePin[] = [
  { id: 'input-text', label: 'text', direction: 'in', dataType: 'string', topPercent: 20, description: '源文本' },
  { id: 'input-search', label: 'search', direction: 'in', dataType: 'string', topPercent: 50, description: '查找字符串（全部替换）' },
  { id: 'input-replacement', label: 'replacement', direction: 'in', dataType: 'string', topPercent: 80, description: '替换为' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-string', label: 'result', direction: 'out', dataType: 'string', topPercent: 35, description: '替换结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) return;
  const data = (stateNode.node.data ?? {}) as IStringReplaceNodeData;
  stateText.value = String(data.text ?? '');
  stateSearch.value = String(data.search ?? '');
  stateReplacement.value = String(data.replacement ?? '');
  stateInitialized.value = true;
});

watch([stateText, stateSearch, stateReplacement], () => {
  if (!stateInitialized.value) return;
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    search: stateSearch.value,
    replacement: stateReplacement.value
  };
});
</script>
