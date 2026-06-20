<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-repeat" :title="t('components.crawler.blueprint.nodes.controlFlow.loop.title')" :description="t('components.crawler.blueprint.nodes.controlFlow.loop.description')" header-color="" header-bg="bg-green-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.mode.label')">
        <div v-if="hasTargetPinConnection('input-mode-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.limitIterations.label')">
        <div v-if="hasTargetPinConnection('input-limit-iterations-boolean')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USwitch v-else v-model="stateLimitIterations" :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.limitIterations.switchLabel')" />
      </UFormField>

      <UFormField v-if="stateLimitIterations" :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.maxIterations.label')">
        <div v-if="hasTargetPinConnection('input-max-iterations-number')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <CrawlersNodesCommonNumberInput v-else id="crawlerControlFlowLoopMaxIterations" v-model="stateMaxIterations" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <UFormField v-else :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.maxIterations.label')">
        <div class="border-default text-muted flex h-8 items-center rounded-sm border px-2 text-xs">
          {{ t('components.crawler.blueprint.nodes.controlFlow.loop.fields.maxIterations.unlimited') }}
        </div>
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.breakOnError.label')">
        <div v-if="hasTargetPinConnection('input-break-on-error-boolean')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USwitch v-else v-model="stateBreakOnError" :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.breakOnError.label')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：循环模式。
 */
type TLoopMode = 'forEach' | 'while';

/**
 * 常量：默认最大循环次数。
 */
const DEFAULT_MAX_ITERATIONS = 50;

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
 * 状态：循环模式。
 */
const stateMode = ref<TLoopMode>('forEach');

/**
 * 状态：最大循环次数。
 */
const stateMaxIterations = ref(DEFAULT_MAX_ITERATIONS);

/**
 * 状态：是否限制最大循环次数。
 */
const stateLimitIterations = ref(true);

/**
 * 状态：发生错误时是否中断。
 */
const stateBreakOnError = ref(true);

/**
 * 计算属性：循环模式选项。
 */
const stateModeOptions = computed(() => [
  {
    value: 'forEach',
    label: t('components.crawler.blueprint.nodes.controlFlow.loop.fields.mode.options.forEach')
  },
  {
    value: 'while',
    label: t('components.crawler.blueprint.nodes.controlFlow.loop.fields.mode.options.while')
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
    id: 'input-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'in',
    dataType: 'array',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.pinDescriptions.array')
  },
  {
    id: 'input-condition-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exists'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.pinDescriptions.condition')
  },
  {
    id: 'input-mode-string',
    label: t('components.crawler.blueprint.nodes.controlFlow.loop.fields.mode.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 16,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.pinDescriptions.mode')
  },
  {
    id: 'input-limit-iterations-boolean',
    label: t('components.crawler.blueprint.nodes.controlFlow.loop.fields.limitIterations.label'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 48,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.pinDescriptions.limitIterations')
  },
  {
    id: 'input-max-iterations-number',
    label: t('components.crawler.blueprint.nodes.controlFlow.loop.fields.maxIterations.label'),
    direction: 'in',
    dataType: 'number',
    topPercent: 62,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.pinDescriptions.maxIterations')
  },
  {
    id: 'input-break-on-error-boolean',
    label: t('components.crawler.blueprint.nodes.controlFlow.loop.fields.breakOnError.label'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 90,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.pinDescriptions.breakOnError')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-item-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.item'),
    direction: 'out',
    dataType: 'any',
    topPercent: 22,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.outputs.item.description')
  },
  {
    id: 'result-index-number',
    label: t('components.crawler.blueprint.nodes.controlFlow.loop.outputs.index.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.controlFlow.loop.outputs.index.description')
  },
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 78,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 92,
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
  const mode = String(data.mode ?? 'forEach');
  stateMode.value = mode === 'while' ? 'while' : 'forEach';
  const rawMaxIterations = Number(data.maxIterations);
  const limitIterations = typeof data.limitIterations === 'boolean' ? data.limitIterations : Number.isFinite(rawMaxIterations) ? rawMaxIterations > 0 : true;
  stateLimitIterations.value = limitIterations;
  stateMaxIterations.value = Number.isFinite(rawMaxIterations) ? Math.max(1, Math.round(rawMaxIterations)) : DEFAULT_MAX_ITERATIONS;
  stateBreakOnError.value = Boolean(data.breakOnError ?? true);
  stateInitialized.value = true;
});

watch([stateMode, stateLimitIterations, stateMaxIterations, stateBreakOnError], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateMaxIterations.value = Number.isFinite(Number(stateMaxIterations.value)) ? Math.max(1, Math.round(Number(stateMaxIterations.value))) : DEFAULT_MAX_ITERATIONS;

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    mode: stateMode.value,
    limitIterations: stateLimitIterations.value,
    maxIterations: stateLimitIterations.value ? stateMaxIterations.value : 0,
    breakOnError: stateBreakOnError.value
  };
});
</script>
