<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-save" :title="t('components.crawler.blueprint.nodes.output.saveData.title')" :description="t('components.crawler.blueprint.nodes.output.saveData.description')" header-color="" header-bg="bg-red-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.output.saveData.fields.saveType.label')">
        <div v-if="hasTargetPinConnection('input-save-type-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateSaveType" class="w-full" :items="stateSaveTypeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：保存数据类型。
 */
type TSaveDataType = 'music' | 'image';

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
 * 状态：保存数据类型。
 */
const stateSaveType = ref<TSaveDataType>('music');

/**
 * 计算属性：保存类型选项。
 */
const stateSaveTypeOptions = computed(() => [
  {
    value: 'music',
    label: t('components.crawler.blueprint.nodes.output.saveData.fields.saveType.options.music')
  },
  {
    value: 'image',
    label: t('components.crawler.blueprint.nodes.output.saveData.fields.saveType.options.image')
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
    topPercent: 38,
    description: t('components.crawler.blueprint.nodes.output.saveData.pinDescriptions.value')
  },
  {
    id: 'input-save-type-string',
    label: t('components.crawler.blueprint.nodes.output.saveData.fields.saveType.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 78,
    description: t('components.crawler.blueprint.nodes.output.saveData.pinDescriptions.saveType')
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
    topPercent: 34,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-saved-type-string',
    label: t('components.crawler.blueprint.nodes.output.saveData.outputs.savedType.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 64,
    description: t('components.crawler.blueprint.nodes.output.saveData.outputs.savedType.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 88,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  const saveType = String(data.saveType ?? 'music');
  stateSaveType.value = saveType === 'image' ? 'image' : 'music';
  stateInitialized.value = true;
});

watch(stateSaveType, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    saveType: stateSaveType.value
  };
});
</script>
