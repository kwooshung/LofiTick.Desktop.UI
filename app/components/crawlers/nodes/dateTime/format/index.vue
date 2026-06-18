<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-calendar-range" :title="t('components.crawler.blueprint.nodes.dateTime.format.title')" :description="t('components.crawler.blueprint.nodes.dateTime.format.description')" header-bg="bg-indigo-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.dateTime.format.fields.sourceMode.label')">
        <div v-if="hasTargetPinConnection('input-source-mode-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateSourceMode" class="w-full" :items="stateSourceModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.dateTime.format.fields.formatPattern.label')">
        <div v-if="hasTargetPinConnection('input-format-pattern-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="stateFormatPattern" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.dateTime.format.fields.formatPattern.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：日期时间来源模式。
 */
type TDateTimeSourceMode = 'current' | 'input';

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();

/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：来源模式。
 */
const stateSourceMode = ref<TDateTimeSourceMode>('current');

/**
 * 状态：格式模板。
 */
const stateFormatPattern = ref('YYYY-MM-DD HH:mm:ss');

/**
 * 计算属性：来源模式选项。
 */
const stateSourceModeOptions = computed(() => [
  {
    value: 'current',
    label: t('components.crawler.blueprint.nodes.dateTime.format.fields.sourceMode.options.current')
  },
  {
    value: 'input',
    label: t('components.crawler.blueprint.nodes.dateTime.format.fields.sourceMode.options.input')
  }
]);

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

/**
 * 常量：左侧数据输入引脚配置。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-value-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'any',
    topPercent: 28,
    description: t('components.crawler.blueprint.nodes.dateTime.format.pinDescriptions.value')
  },
  {
    id: 'input-source-mode-string',
    label: t('components.crawler.blueprint.nodes.dateTime.format.fields.sourceMode.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 54,
    description: t('components.crawler.blueprint.nodes.dateTime.format.pinDescriptions.sourceMode')
  },
  {
    id: 'input-format-pattern-string',
    label: t('components.crawler.blueprint.nodes.dateTime.format.fields.formatPattern.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.dateTime.format.pinDescriptions.formatPattern')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-formatted-string',
    label: t('components.crawler.blueprint.nodes.dateTime.format.outputs.formatted.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.dateTime.format.outputs.formatted.description')
  },
  {
    id: 'result-source-mode-string',
    label: t('components.crawler.blueprint.nodes.dateTime.format.outputs.sourceMode.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.dateTime.format.outputs.sourceMode.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 90,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  const sourceMode = String(data.sourceMode ?? 'current');
  stateSourceMode.value = sourceMode === 'input' ? 'input' : 'current';
  stateFormatPattern.value = String(data.formatPattern ?? 'YYYY-MM-DD HH:mm:ss') || 'YYYY-MM-DD HH:mm:ss';
  stateInitialized.value = true;
});

watch([stateSourceMode, stateFormatPattern], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    sourceMode: stateSourceMode.value,
    formatPattern: stateFormatPattern.value.trim() || 'YYYY-MM-DD HH:mm:ss'
  };
});
</script>
