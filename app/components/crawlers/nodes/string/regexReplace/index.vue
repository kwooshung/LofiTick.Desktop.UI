<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-code"
    :title="t('components.crawler.blueprint.nodes.string.regexReplace.title')"
    :description="t('components.crawler.blueprint.nodes.string.regexReplace.description')"
    header-color=""
    header-bg="bg-teal-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.pattern.label')">
        <div v-if="hasTargetPinConnection('input-pattern')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="statePattern" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.pattern.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.replacement.label')">
        <div v-if="hasTargetPinConnection('input-replacement')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="stateReplacement" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.replacement.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexReplace.fields.flags.label')">
        <div v-if="hasTargetPinConnection('input-flags')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="stateFlags" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexReplace.fields.flags.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IStringRegexReplaceNodeData } from '@/components/crawlers/nodes/string/regexReplace/index.types';

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
 * 状态：正则表达式。
 */
const statePattern = ref('');
/**
 * 状态：替换文本。
 */
const stateReplacement = ref('');
/**
 * 状态：正则标志。
 */
const stateFlags = ref('g');

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
    topPercent: 15,
    description: t('components.crawler.blueprint.nodes.string.regexReplace.pinDescriptions.text')
  },
  {
    id: 'input-pattern',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.pattern'),
    direction: 'in',
    dataType: 'string',
    topPercent: 40,
    description: t('components.crawler.blueprint.nodes.string.regexReplace.pinDescriptions.pattern')
  },
  {
    id: 'input-replacement',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.replacement'),
    direction: 'in',
    dataType: 'string',
    topPercent: 65,
    description: t('components.crawler.blueprint.nodes.string.regexReplace.pinDescriptions.replacement')
  },
  {
    id: 'input-flags',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.flags'),
    direction: 'in',
    dataType: 'string',
    topPercent: 90,
    description: t('components.crawler.blueprint.nodes.string.regexReplace.pinDescriptions.flags')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.regexReplace.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }
  const data = (stateNode.node.data ?? {}) as IStringRegexReplaceNodeData;
  stateText.value = String(data.text ?? '');
  statePattern.value = String(data.pattern ?? '');
  stateReplacement.value = String(data.replacement ?? '');
  stateFlags.value = String(data.flags ?? 'g');
  stateInitialized.value = true;
});

watch([stateText, statePattern, stateReplacement, stateFlags], () => {
  if (!stateInitialized.value) {
    return;
  }
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    pattern: statePattern.value,
    replacement: stateReplacement.value,
    flags: stateFlags.value
  };
});
</script>
