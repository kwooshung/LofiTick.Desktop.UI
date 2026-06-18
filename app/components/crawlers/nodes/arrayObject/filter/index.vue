<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-list-filter"
    :title="t('components.crawler.blueprint.nodes.arrayObject.filter.title')"
    :description="t('components.crawler.blueprint.nodes.arrayObject.filter.description')"
    header-color=""
    header-bg="bg-violet-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.arrayObject.filter.fields.mode.label')">
        <USelect v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.arrayObject.filter.fields.path.label')">
        <div v-if="hasTargetPinConnection('input-path')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="statePath" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.arrayObject.filter.fields.path.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IArrayObjectFilterNodeData, TArrayObjectFilterMode } from '@/components/crawlers/nodes/arrayObject/filter/index.types';

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();
/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();
/**
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();
/**
 * Hook：Vue Flow 边集合。
 */
const { edges } = useVueFlow();
/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);
/**
 * 状态：过滤模式。
 */
const stateMode = ref<TArrayObjectFilterMode>('truthy');
/**
 * 状态：过滤路径。
 */
const statePath = ref('');

/**
 * 计算属性：过滤模式选项。
 */
const stateModeOptions = computed(() => [
  { value: 'truthy', label: t('components.crawler.blueprint.nodes.arrayObject.filter.options.modeTruthy') },
  { value: 'nonEmpty', label: t('components.crawler.blueprint.nodes.arrayObject.filter.options.modeNonEmpty') },
  { value: 'distinct', label: t('components.crawler.blueprint.nodes.arrayObject.filter.options.modeDistinct') }
]);

/**
 * 函数：判断目标引脚是否已连接。
 * @param {string} handleId 引脚 ID。
 * @returns {boolean} 是否已连接。
 */
const hasTargetPinConnection = (handleId: string): boolean => {
  /**
   * 常量：nodeId。
   */
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

/**
 * 常量：左侧输入引脚配置。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'in',
    dataType: 'array',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.arrayObject.filter.pinDescriptions.array')
  },
  {
    id: 'input-path',
    label: t('components.crawler.blueprint.nodes.arrayObject.filter.fields.path.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.arrayObject.filter.pinDescriptions.path')
  }
];

/**
 * 常量：右侧输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'array',
    topPercent: 30,
    description: t('components.crawler.blueprint.nodes.arrayObject.filter.pinDescriptions.result')
  },
  {
    id: 'removed-number',
    label: t('components.crawler.blueprint.nodes.arrayObject.filter.pinLabels.removed'),
    direction: 'out',
    dataType: 'number',
    topPercent: 58,
    description: t('components.crawler.blueprint.nodes.arrayObject.filter.pinDescriptions.removed')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 82,
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
  const data = (stateNode.node.data ?? {}) as IArrayObjectFilterNodeData;
  /**
   * 常量：mode。
   */
  const mode = String(data.mode ?? 'truthy') as TArrayObjectFilterMode;
  stateMode.value = ['truthy', 'nonEmpty', 'distinct'].includes(mode) ? mode : 'truthy';
  statePath.value = String(data.path ?? '');
  stateInitialized.value = true;
});

watch([stateMode, statePath], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    mode: stateMode.value,
    path: statePath.value
  };
});
</script>
