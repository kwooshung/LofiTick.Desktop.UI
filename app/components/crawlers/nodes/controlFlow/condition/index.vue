<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-git-branch"
    :title="t('components.crawler.blueprint.nodes.controlFlow.condition.title')"
    :description="t('components.crawler.blueprint.nodes.controlFlow.condition.description')"
    header-color=""
    header-bg="bg-green-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.condition.fields.mode.label')">
        <div v-if="hasTargetPinConnection('input-mode-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.condition.fields.strictCompare.label')">
        <div v-if="hasTargetPinConnection('input-strict-compare-boolean')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USwitch v-else v-model="stateStrictCompare" :label="t('components.crawler.blueprint.nodes.controlFlow.condition.fields.strictCompare.label')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：条件输入模式。
 */
type TConditionMode = 'boolean' | 'compare';

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
 * 状态：条件输入模式。
 */
const stateMode = ref<TConditionMode>('boolean');

/**
 * 状态：比较时是否严格比较。
 */
const stateStrictCompare = ref(false);

/**
 * 计算属性：模式选项。
 */
const stateModeOptions = computed(() => [
  {
    value: 'boolean',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.fields.mode.options.boolean')
  },
  {
    value: 'compare',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.fields.mode.options.compare')
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
    id: 'input-condition-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exists'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 30,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.pinDescriptions.condition')
  },
  {
    id: 'input-a-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.a'),
    direction: 'in',
    dataType: 'any',
    topPercent: 55,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.pinDescriptions.valueA')
  },
  {
    id: 'input-b-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.b'),
    direction: 'in',
    dataType: 'any',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.pinDescriptions.valueB')
  },
  {
    id: 'input-mode-string',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.fields.mode.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 14,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.pinDescriptions.mode')
  },
  {
    id: 'input-strict-compare-boolean',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.fields.strictCompare.label'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 92,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.pinDescriptions.strictCompare')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-true-boolean',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.true.label'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 30,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.true.description')
  },
  {
    id: 'result-false-boolean',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.false.label'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 58,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.false.description')
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

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;

  /**
   * 常量：mode。
   */
  const mode = String(data.mode ?? 'boolean');
  stateMode.value = mode === 'compare' ? 'compare' : 'boolean';
  stateStrictCompare.value = Boolean(data.strictCompare ?? false);
  stateInitialized.value = true;
});

watch([stateMode, stateStrictCompare], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    mode: stateMode.value,
    strictCompare: stateStrictCompare.value
  };
});
</script>
