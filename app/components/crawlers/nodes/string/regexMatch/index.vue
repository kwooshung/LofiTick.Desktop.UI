<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-search-code"
    :title="t('components.crawler.blueprint.nodes.string.regexMatch.title')"
    :description="t('components.crawler.blueprint.nodes.string.regexMatch.description')"
    header-color=""
    header-bg="bg-teal-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexMatch.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexMatch.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexMatch.fields.pattern.label')">
        <div v-if="hasTargetPinConnection('input-pattern')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="statePattern" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexMatch.fields.pattern.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.regexMatch.fields.flags.label')">
        <div v-if="hasTargetPinConnection('input-flags')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="stateFlags" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.regexMatch.fields.flags.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IStringRegexMatchNodeData } from '@/components/crawlers/nodes/string/regexMatch/index.types';

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
 * 状态：正则标志。
 */
const stateFlags = ref('g');

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
    description: t('components.crawler.blueprint.nodes.string.regexMatch.pinDescriptions.text')
  },
  {
    id: 'input-pattern',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.pattern'),
    direction: 'in',
    dataType: 'string',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.string.regexMatch.pinDescriptions.pattern')
  },
  {
    id: 'input-flags',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.flags'),
    direction: 'in',
    dataType: 'string',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.string.regexMatch.pinDescriptions.flags')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.matches'),
    direction: 'out',
    dataType: 'array',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.regexMatch.pinDescriptions.result')
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
  const data = (stateNode.node.data ?? {}) as IStringRegexMatchNodeData;
  stateText.value = String(data.text ?? '');
  statePattern.value = String(data.pattern ?? '');
  stateFlags.value = String(data.flags ?? 'g');
  stateInitialized.value = true;
});

watch([stateText, statePattern, stateFlags], () => {
  if (!stateInitialized.value) {
    return;
  }
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    text: stateText.value,
    pattern: statePattern.value,
    flags: stateFlags.value
  };
});
</script>
