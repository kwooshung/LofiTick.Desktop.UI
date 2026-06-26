<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-git-fork"
    :title="t('components.crawler.blueprint.nodes.controlFlow.switch.title')"
    :description="t('components.crawler.blueprint.nodes.controlFlow.switch.description')"
    header-color=""
    header-bg="bg-green-500"
    :left-pins="leftPins"
    :show-exec-out="false"
  >
    <div class="flex items-start gap-4">
      <div class="min-w-0 flex-1 space-y-3">
        <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.switch.fields.matchMode.label')">
          <div v-if="hasTargetPinConnection('input-match-mode-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
            <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
            <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
          </div>

          <USelect v-else v-model="stateMatchMode" class="w-full" :items="stateMatchModeOptions" value-attribute="value" option-attribute="label" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.switch.fields.cases.label')">
          <div v-if="hasTargetPinConnection('input-cases-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
            <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
            <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
          </div>

          <UTextarea v-else v-model="stateCasesText" autoresize class="scrollbar w-full" :placeholder="t('components.crawler.blueprint.nodes.controlFlow.switch.fields.cases.placeholder')" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.controlFlow.switch.fields.useDefaultBranch.label')">
          <div v-if="hasTargetPinConnection('input-use-default-branch-boolean')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
            <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
            <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
          </div>

          <USwitch v-else v-model="stateUseDefaultBranch" :label="t('components.crawler.blueprint.nodes.controlFlow.switch.fields.useDefaultBranch.label')" />
        </UFormField>
      </div>

      <div class="nodrag flex shrink-0 flex-col gap-3 pt-1">
        <div v-for="branch in computedBranchOutputs" :key="branch.id" class="flex h-5 items-center gap-2">
          <div class="min-w-0 flex-1 text-right leading-5">
            <UTooltip :text="branch.description" :content="{ side: 'top' }">
              <span class="block truncate text-right text-sm leading-5 font-medium">{{ branch.label }}</span>
            </UTooltip>
          </div>

          <span class="relative flex h-5 w-3 shrink-0 items-center justify-center">
            <span class="pointer-events-none block h-3.5 w-2.5 bg-green-500 shadow-sm [clip-path:polygon(0_0,100%_50%,0_100%)]" />
            <Handle :id="branch.id" type="source" :position="Position.Right" :is-valid-connection="isBranchOutputConnectionSource" class="absolute! right-0! top-3.25! h-2! w-2! translate-x-0! -translate-y-1/2! cursor-crosshair! rounded-none! border-0! bg-transparent! opacity-0!" />
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

/**
 * 类型：Switch 匹配模式。
 */
type TSwitchMatchMode = 'strict' | 'loose';

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
 * 状态：匹配模式。
 */
const stateMatchMode = ref<TSwitchMatchMode>('strict');

/**
 * 状态：分支文本（按行一项）。
 */
const stateCasesText = ref('case_1\ncase_2');

/**
 * 状态：是否启用默认分支。
 */
const stateUseDefaultBranch = ref(true);

/**
 * 计算属性：匹配模式选项。
 */
const stateMatchModeOptions = computed(() => [
  {
    value: 'strict',
    label: t('components.crawler.blueprint.nodes.controlFlow.switch.fields.matchMode.options.strict')
  },
  {
    value: 'loose',
    label: t('components.crawler.blueprint.nodes.controlFlow.switch.fields.matchMode.options.loose')
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
 * 计算属性：分支列表。
 */
const computedCaseList = computed(() => {
  const rows = stateCasesText.value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  return rows.length > 0 ? rows : ['case_1'];
});

/**
 * 常量：左侧数据输入引脚配置。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-value-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.controlFlow.switch.pinDescriptions.value')
  },
  {
    id: 'input-match-mode-string',
    label: t('components.crawler.blueprint.nodes.controlFlow.switch.fields.matchMode.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 16,
    description: t('components.crawler.blueprint.nodes.controlFlow.switch.pinDescriptions.matchMode')
  },
  {
    id: 'input-cases-string',
    label: t('components.crawler.blueprint.nodes.controlFlow.switch.fields.cases.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 72,
    description: t('components.crawler.blueprint.nodes.controlFlow.switch.pinDescriptions.cases')
  },
  {
    id: 'input-use-default-branch-boolean',
    label: t('components.crawler.blueprint.nodes.controlFlow.switch.fields.useDefaultBranch.label'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 88,
    description: t('components.crawler.blueprint.nodes.controlFlow.switch.pinDescriptions.useDefaultBranch')
  }
];

/**
 * 计算属性：右侧执行分支配置。
 */
const computedBranchOutputs = computed(() => {
  const branches = computedCaseList.value.map((item, index) => ({
    id: `result-case-${index + 1}-boolean`,
    label: item,
    description: t('components.crawler.blueprint.nodes.controlFlow.switch.outputs.case.description', {
      label: item
    })
  }));

  if (stateUseDefaultBranch.value) {
    branches.push({
      id: 'result-default-boolean',
      label: t('components.crawler.blueprint.nodes.controlFlow.switch.outputs.default.label'),
      description: t('components.crawler.blueprint.nodes.controlFlow.switch.outputs.default.description')
    });
  }

  return branches;
});

/**
 * 函数：判断 switch 执行分支是否可连接。
 * @param {Connection} connection 连接信息。
 * @returns {boolean} 是否可连接。
 */
const isBranchOutputConnectionSource = (connection: Connection): boolean => {
  if (!connection.target || connection.target === stateNodeId.value) {
    return false;
  }

  const sourceHandle = String(connection.sourceHandle ?? '').trim();
  return (sourceHandle.startsWith('result-case-') || sourceHandle.startsWith('result-default-')) && connection.targetHandle === 'exec-in';
};

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;

  const matchMode = String(data.matchMode ?? 'strict');
  stateMatchMode.value = matchMode === 'loose' ? 'loose' : 'strict';

  const cases = Array.isArray(data.cases) ? data.cases.map((item) => String(item ?? '').trim()).filter((item) => item !== '') : [];

  stateCasesText.value = cases.length > 0 ? cases.join('\n') : 'case_1\ncase_2';
  stateUseDefaultBranch.value = Boolean(data.useDefaultBranch ?? true);
  stateInitialized.value = true;
});

watch([stateMatchMode, stateCasesText, stateUseDefaultBranch], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    matchMode: stateMatchMode.value,
    cases: [...computedCaseList.value],
    useDefaultBranch: stateUseDefaultBranch.value
  };
});
</script>
