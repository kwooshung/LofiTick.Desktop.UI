<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-git-branch"
    :title="t('components.crawler.blueprint.nodes.controlFlow.condition.title')"
    :description="t('components.crawler.blueprint.nodes.controlFlow.condition.description')"
    header-color=""
    header-bg="bg-green-500"
    :left-pins="leftPins"
    :show-exec-out="false"
  >
    <div class="flex items-start gap-4">
      <div class="min-w-0 flex-1 space-y-3">
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

      <div class="nodrag flex shrink-0 flex-col gap-3 pt-1">
        <div v-for="branch in branchOutputs" :key="branch.id" class="flex h-5 items-center gap-2">
          <div class="min-w-0 flex-1 text-right leading-5">
            <UTooltip :text="branch.description" :content="{ side: 'top' }">
              <span class="block truncate text-right text-sm leading-5 font-medium">{{ branch.label }}</span>
            </UTooltip>
          </div>

          <span class="relative flex h-5 w-3 shrink-0 items-center justify-center">
            <span class="pointer-events-none block h-3.5 w-2.5 bg-green-500 shadow-sm [clip-path:polygon(0_0,100%_50%,0_100%)]" />
            <Handle :id="branch.id" type="source" :position="Position.Right" :is-valid-connection="isBranchOutputConnectionSource" class="absolute! top-3.25! right-0! h-2! w-2! translate-x-0! -translate-y-1/2! cursor-crosshair! rounded-none! border-0! bg-transparent! opacity-0!" />
          </span>
        </div>
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import type { Connection } from '@vue-flow/core';
import { Handle, Position, useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IControlFlowConditionBranch, TControlFlowConditionMode } from './index.types';

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
const stateMode = ref<TControlFlowConditionMode>('boolean');

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
 * 常量：执行分支配置。
 */
const branchOutputs: IControlFlowConditionBranch[] = [
  {
    id: 'true',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.true.label'),
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.true.description')
  },
  {
    id: 'false',
    label: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.false.label'),
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.outputs.false.description')
  }
];

/**
 * 函数：判断分支输出是否合法。
 * @param {Connection} connection 连接信息。
 * @returns {boolean} 是否可连接。
 */
const isBranchOutputConnectionSource = (connection: Connection): boolean => {
  if (!connection.target || connection.target === stateNodeId.value) {
    return false;
  }

  return (connection.sourceHandle === 'true' || connection.sourceHandle === 'false') && connection.targetHandle === 'exec-in';
};

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
