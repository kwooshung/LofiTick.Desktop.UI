<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-calendar-clock" :title="t('components.crawler.blueprint.nodes.dateTime.now.title')" :description="t('components.crawler.blueprint.nodes.dateTime.now.description')" header-bg="bg-indigo-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.dateTime.now.fields.outputMode.label')">
        <div v-if="hasTargetPinConnection('input-output-mode-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateOutputMode" class="w-full" :items="stateOutputModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：日期时间输出模式。
 */
type TDateTimeOutputMode = 'isoUtc' | 'timestampMs';

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();

/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：输出模式。
 */
const stateOutputMode = ref<TDateTimeOutputMode>('isoUtc');

/**
 * 计算属性：输出模式选项。
 */
const stateOutputModeOptions = computed(() => [
  {
    value: 'isoUtc',
    label: t('components.crawler.blueprint.nodes.dateTime.now.fields.outputMode.options.isoUtc')
  },
  {
    value: 'timestampMs',
    label: t('components.crawler.blueprint.nodes.dateTime.now.fields.outputMode.options.timestampMs')
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

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-output-mode-string',
    label: t('components.crawler.blueprint.nodes.dateTime.now.fields.outputMode.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.dateTime.now.pinDescriptions.outputMode')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-iso-string',
    label: t('components.crawler.blueprint.nodes.dateTime.now.outputs.iso.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 22,
    description: t('components.crawler.blueprint.nodes.dateTime.now.outputs.iso.description')
  },
  {
    id: 'result-timestamp-number',
    label: t('components.crawler.blueprint.nodes.dateTime.now.outputs.timestamp.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 48,
    description: t('components.crawler.blueprint.nodes.dateTime.now.outputs.timestamp.description')
  },
  {
    id: 'result-mode-string',
    label: t('components.crawler.blueprint.nodes.dateTime.now.outputs.mode.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 72,
    description: t('components.crawler.blueprint.nodes.dateTime.now.outputs.mode.description')
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
  const outputMode = String(data.outputMode ?? 'isoUtc');
  stateOutputMode.value = outputMode === 'timestampMs' ? 'timestampMs' : 'isoUtc';
  stateInitialized.value = true;
});

watch(stateOutputMode, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    outputMode: stateOutputMode.value
  };
});
</script>
