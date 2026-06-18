<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-repeat"
    :title="t('components.crawler.blueprint.nodes.controlFlow.loop.title')"
    :description="t('components.crawler.blueprint.nodes.controlFlow.loop.description')"
    header-color=""
    header-bg="bg-green-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.mode.label')">
        <USelect v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.maxIterations.label')">
        <CrawlersNodesCommonNumberInput id="crawlerControlFlowLoopMaxIterations" v-model="stateMaxIterations" :min="1" :step="1" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.count')" />
      </UFormField>

      <USwitch v-model="stateBreakOnError" :label="t('components.crawler.blueprint.nodes.controlFlow.loop.fields.breakOnError.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

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
  stateMaxIterations.value = Number.isFinite(Number(data.maxIterations)) ? Math.max(1, Math.round(Number(data.maxIterations))) : DEFAULT_MAX_ITERATIONS;
  stateBreakOnError.value = Boolean(data.breakOnError ?? true);
  stateInitialized.value = true;
});

watch([stateMode, stateMaxIterations, stateBreakOnError], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateMaxIterations.value = Number.isFinite(Number(stateMaxIterations.value)) ? Math.max(1, Math.round(Number(stateMaxIterations.value))) : DEFAULT_MAX_ITERATIONS;

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    mode: stateMode.value,
    maxIterations: stateMaxIterations.value,
    breakOnError: stateBreakOnError.value
  };
});
</script>
