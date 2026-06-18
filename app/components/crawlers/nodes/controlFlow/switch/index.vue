<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-git-fork"
    :title="t('components.crawler.blueprint.nodes.controlFlow.switch.title')"
    :description="t('components.crawler.blueprint.nodes.controlFlow.switch.description')"
    header-color=""
    header-bg="bg-green-500"
    :left-pins="leftPins"
    :right-pins="computedRightPins"
  >
    <div class="space-y-3">
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
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

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
  /**
   * 常量：rows。
   */
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
 * 计算属性：右侧数据输出引脚配置。
 */
const computedRightPins = computed<IBasicSidePin[]>(() => {
  /**
   * 常量：pins。
   */
  const pins: IBasicSidePin[] = computedCaseList.value.map((item, index) => ({
    id: `result-case-${index + 1}-boolean`,
    label: item,
    direction: 'out',
    dataType: 'boolean',
    topPercent: 20 + Math.round((index / Math.max(1, computedCaseList.value.length)) * 55),
    description: t('components.crawler.blueprint.nodes.controlFlow.switch.outputs.case.description', {
      label: item
    })
  }));

  if (stateUseDefaultBranch.value) {
    pins.push({
      id: 'result-default-boolean',
      label: t('components.crawler.blueprint.nodes.controlFlow.switch.outputs.default.label'),
      direction: 'out',
      dataType: 'boolean',
      topPercent: 84,
      description: t('components.crawler.blueprint.nodes.controlFlow.switch.outputs.default.description')
    });
  }

  pins.push({
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 94,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  });

  return pins;
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;

  /**
   * 常量：matchMode。
   */
  const matchMode = String(data.matchMode ?? 'strict');
  stateMatchMode.value = matchMode === 'loose' ? 'loose' : 'strict';

  /**
   * 常量：cases。
   */
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
