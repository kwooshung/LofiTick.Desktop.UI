<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-print" :title="t('components.crawler.blueprint.nodes.output.printLog.title')" :description="t('components.crawler.blueprint.nodes.output.printLog.description')" header-color="" header-bg="bg-red-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.output.printLog.fields.level.label')">
        <div v-if="hasTargetPinConnection('input-level-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateLevel" class="w-full" :items="stateLevelOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.output.printLog.fields.template.label')">
        <div v-if="hasTargetPinConnection('input-template-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateTemplate" autoresize class="scrollbar w-full" :placeholder="t('components.crawler.blueprint.nodes.output.printLog.fields.template.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：日志级别。
 */
type TLogLevel = 'debug' | 'info' | 'warn' | 'error';

const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();

/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：日志级别。
 */
const stateLevel = ref<TLogLevel>('info');

/**
 * 状态：日志模板。
 */
const stateTemplate = ref('');

/**
 * 计算属性：日志级别选项。
 */
const stateLevelOptions = computed(() => [
  {
    value: 'debug',
    label: t('components.crawler.blueprint.nodes.output.printLog.fields.level.options.debug')
  },
  {
    value: 'info',
    label: t('components.crawler.blueprint.nodes.output.printLog.fields.level.options.info')
  },
  {
    value: 'warn',
    label: t('components.crawler.blueprint.nodes.output.printLog.fields.level.options.warn')
  },
  {
    value: 'error',
    label: t('components.crawler.blueprint.nodes.output.printLog.fields.level.options.error')
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
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.output.printLog.pinDescriptions.value')
  },
  {
    id: 'input-level-string',
    label: t('components.crawler.blueprint.nodes.output.printLog.fields.level.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.output.printLog.pinDescriptions.level')
  },
  {
    id: 'input-template-string',
    label: t('components.crawler.blueprint.nodes.output.printLog.fields.template.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 88,
    description: t('components.crawler.blueprint.nodes.output.printLog.pinDescriptions.template')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;

  /**
   * 常量：level。
   */
  const level = String(data.level ?? 'info');
  stateLevel.value = level === 'debug' || level === 'warn' || level === 'error' ? level : 'info';
  stateTemplate.value = String(data.template ?? '');
  stateInitialized.value = true;
});

watch([stateLevel, stateTemplate], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    level: stateLevel.value,
    template: stateTemplate.value
  };
});
</script>
