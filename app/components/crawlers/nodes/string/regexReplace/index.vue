<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-code" :title="t('components.crawler.blueprint.nodes.string.regexReplace.title')" :description="t('components.crawler.blueprint.nodes.string.regexReplace.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.pattern.label')">
        <div v-if="hasTargetPinConnection('input-pattern')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInput v-else v-model="statePattern" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.pattern.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.replacement.label')">
        <div v-if="hasTargetPinConnection('input-replacement')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInput v-else v-model="stateReplacement" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.replacement.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.flags.label')">
        <div v-if="hasTargetPinConnection('input-flags')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UInput v-else v-model="stateFlags" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.flags.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IStringRegexReplaceNodeData {
  text?: string;
  pattern?: string;
  replacement?: string;
  flags?: string;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateText = ref('');
const statePattern = ref('');
const stateReplacement = ref('');
const stateFlags = ref('g');

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') return false;
  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const leftPins: IBasicSidePin[] = [
  { id: 'input-text', label: 'text', direction: 'in', dataType: 'string', topPercent: 15, description: '源文本' },
  { id: 'input-pattern', label: 'pattern', direction: 'in', dataType: 'string', topPercent: 40, description: '正则表达式模式' },
  { id: 'input-replacement', label: 'replacement', direction: 'in', dataType: 'string', topPercent: 65, description: '替换为（可用捕获组）' },
  { id: 'input-flags', label: 'flags', direction: 'in', dataType: 'string', topPercent: 90, description: '标志(g/i/m等)' }
];

const rightPins: IBasicSidePin[] = [
  { id: 'result-string', label: 'result', direction: 'out', dataType: 'string', topPercent: 35, description: '替换结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) return;
  const data = (stateNode.node.data ?? {}) as IStringRegexReplaceNodeData;
  stateText.value = String(data.text ?? '');
  statePattern.value = String(data.pattern ?? '');
  stateReplacement.value = String(data.replacement ?? '');
  stateFlags.value = String(data.flags ?? 'g');
  stateInitialized.value = true;
});

watch([stateText, statePattern, stateReplacement, stateFlags], () => {
  if (!stateInitialized.value) return;
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    pattern: statePattern.value,
    replacement: stateReplacement.value,
    flags: stateFlags.value
  };
});
</script>
