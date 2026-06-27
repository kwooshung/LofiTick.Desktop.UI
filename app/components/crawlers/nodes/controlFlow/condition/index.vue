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
    <div class="flex w-full items-start justify-end gap-4">
        <div class="min-w-0 flex-1 space-y-3">
          <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.condition.fields.invert.label')">
            <USwitch v-model="stateInvert" :label="t('components.crawler.blueprint.nodes.controlFlow.condition.fields.invert.hint')" />
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
import type { IControlFlowConditionBranch } from './index.types';

const { t } = useI18n();

/**
 * Hook：当前节点上下文（用于持久化节点配置）。
 */
const stateNode = useNode();

/**
 * 状态：是否已完成首次数据回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：是否取反（invert）。
 */
const stateInvert = ref(false);

/**
 * Hook：当前节点标识。
 */
const stateNodeId = useNodeId();
const { edges } = useVueFlow();

/**
 * 常量：左侧数据输入引脚配置。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-condition-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.controlFlow.condition.pinDescriptions.condition')
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

// 回填与持久化节点数据（取反开关）
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateInvert.value = Boolean(data.invert ?? false);
  stateInitialized.value = true;
});

watch([stateInvert], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    invert: stateInvert.value
  };
});
</script>
