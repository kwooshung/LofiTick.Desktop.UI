<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-eraser" :title="t('components.crawler.blueprint.nodes.string.trim.title')" :description="t('components.crawler.blueprint.nodes.string.trim.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.trim.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.trim.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.trim.fields.direction.label')">
        <USelect v-model="stateDirection" class="w-full" :items="directionOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.trim.fields.whitespaceTypes.label')" help="">
        <div class="space-y-2">
          <label v-for="type in whitespaceTypeOptions" :key="type.value" class="flex items-center gap-2">
            <UCheckbox :model-value="stateWhitespaceTypes.includes(type.value)" @update:model-value="(checked) => handleWhitespaceTypeToggle(type.value, checked as boolean)" />
            <span class="text-sm">{{ type.label }}</span>
          </label>
        </div>
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IStringTrimNodeData } from '@/components/crawlers/nodes/string/trim/index.types';

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
 * 状态：输入文本。
 */
const stateText = ref('');
/**
 * 状态：裁剪方向。
 */
const stateDirection = ref<'both' | 'start' | 'end' | 'all'>('both');
/**
 * 常量：默认空白字符类型集合。
 */
const DEFAULT_WHITESPACE_TYPES = ['space', 'tab', 'newline', 'carriage-return', 'vertical-tab', 'form-feed'] as const;
/**
 * 状态：空白字符类型集合。
 */
const stateWhitespaceTypes = ref<string[]>([...DEFAULT_WHITESPACE_TYPES]);

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
 * 计算属性：裁剪方向选项。
 */
const directionOptions = computed(() => [
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionBoth'), value: 'both' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionStart'), value: 'start' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionEnd'), value: 'end' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionAll'), value: 'all' }
]);

/**
 * 计算属性：空白字符类型选项。
 */
const whitespaceTypeOptions = computed(() => [
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceSpace'), value: 'space' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceTab'), value: 'tab' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceNewline'), value: 'newline' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceCarriageReturn'), value: 'carriage-return' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceVerticalTab'), value: 'vertical-tab' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceFormFeed'), value: 'form-feed' }
]);

/**
 * 函数：切换空白字符类型。
 */
const handleWhitespaceTypeToggle = (type: string, checked: boolean): void => {
  if (checked) {
    stateWhitespaceTypes.value = [...stateWhitespaceTypes.value, type];
  } else {
    stateWhitespaceTypes.value = stateWhitespaceTypes.value.filter((t) => t !== type);
  }
};

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-text',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.text'),
    direction: 'in',
    dataType: 'string',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.string.trim.pinDescriptions.text')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.trim.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }
  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as IStringTrimNodeData;
  stateText.value = String(data.text ?? '');
  stateDirection.value = (data.direction ?? 'both') as 'both' | 'start' | 'end' | 'all';
  stateWhitespaceTypes.value = Array.isArray(data.whitespaceTypes) && data.whitespaceTypes.length > 0 ? [...data.whitespaceTypes] : [...DEFAULT_WHITESPACE_TYPES];
  stateInitialized.value = true;
});

watch(
  [stateText, stateDirection, stateWhitespaceTypes],
  () => {
    if (!stateInitialized.value) {
      return;
    }
    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      text: stateText.value,
      direction: stateDirection.value,
      whitespaceTypes: [...stateWhitespaceTypes.value]
    };
  },
  { deep: true }
);
</script>
