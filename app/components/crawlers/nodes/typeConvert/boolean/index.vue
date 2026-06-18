<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-toggle-left" :title="t('components.crawler.blueprint.nodes.typeConvert.boolean.title')" :description="t('components.crawler.blueprint.nodes.typeConvert.boolean.description')" header-bg="bg-yellow-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.boolean.fields.truthyValues.label')">
        <div class="space-y-2">
          <USelect :model-value="stateSelectedTruthyValues" :items="truthyValueOptions" multiple class="w-full" :placeholder="t('components.crawler.blueprint.nodes.typeConvert.boolean.fields.truthyValues.placeholder')" @update:model-value="handleTruthySelectChange" />
          <UTextarea v-model="stateTruthyValuesText" :placeholder="t('components.crawler.blueprint.nodes.typeConvert.boolean.fields.truthyValues.placeholder')" :rows="3" class="w-full" />
        </div>
      </UFormField>
      <div class="flex items-center justify-between rounded-sm border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <span>{{ t('components.crawler.blueprint.nodes.typeConvert.boolean.hint') }}</span>
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();

/**
 * 状态：是否已完成首次初始化。
 */
const stateInitialized = ref(false);

/**
 * 状态：真值列表文本。
 */
const stateTruthyValuesText = ref('true,1,"yes","on"');

/**
 * 常量：预置真值选项。
 */
const truthyValueOptions: string[] = ['true', '1', '"yes"', '"on"', 'y', 'ok'];

/**
 * 状态：当前选中的真值项。
 */
const stateSelectedTruthyValues = ref<string[]>(['true', '1', '"yes"', '"on"']);

/**
 * 常量：输入端引脚。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.input'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.boolean.inputs.input.description')
  }
];

/**
 * 常量：输出端引脚。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.boolean.outputs.result.description')
  }
];

/**
 * 函数：解析逗号分隔的真值文本。
 * @param {string} text 原始文本。
 * @returns {string[]} 解析后的值数组。
 */
const parseTruthyValues = (text: string): string[] => {
  return String(text ?? '')
    .split(',')
    .map((value) => String(value ?? '').trim())
    .filter((value) => value !== '');
};

/**
 * 函数：根据文本反向同步下拉选中值。
 */
const updateSelectedValuesFromText = (): void => {
  /**
   * 常量：allValues。
   */
  const allValues = parseTruthyValues(stateTruthyValuesText.value);
  stateSelectedTruthyValues.value = allValues.filter((value) => truthyValueOptions.includes(value));
};

/**
 * 函数：处理下拉多选变更并归一化为字符串数组。
 * @param {unknown} val 组件回传值。
 */
const handleTruthySelectChange = (val: unknown): void => {
  stateSelectedTruthyValues.value = Array.isArray(val) ? val.map((v) => (typeof v === 'string' ? v : String((v as Record<string, unknown>)?.value ?? v))).filter((v) => truthyValueOptions.includes(v)) : [];
};

/**
 * 函数：将下拉选中值与自定义文本合并回文本框。
 * @param {string[]} selected 当前下拉选中值。
 */
const mergeSelectedValuesToText = (selected: string[]): void => {
  /**
   * 常量：customValues。
   */
  const customValues = parseTruthyValues(stateTruthyValuesText.value).filter((value) => !truthyValueOptions.includes(value));
  /**
   * 函数：merged。
   */
  const merged = [...new Set([...selected, ...customValues])];
  stateTruthyValuesText.value = merged.join(',');
};

/**
 * 状态：避免双向同步时的循环更新。
 */
const skipSync = ref(false);

/**
 * 生命周期：首次挂载时从节点数据回填表单状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateTruthyValuesText.value = String(data.truthyValuesText ?? 'true,1,"yes","on"');
  updateSelectedValuesFromText();
  stateInitialized.value = true;
});

/**
 * 监听：下拉选项变化时回写文本框。
 */
watch(
  stateSelectedTruthyValues,
  (selected) => {
    if (!stateInitialized.value) {
      return;
    }

    skipSync.value = true;
    mergeSelectedValuesToText(selected);
    skipSync.value = false;
  },
  { deep: true }
);

/**
 * 监听：文本框变化时同步下拉选项并更新节点数据。
 */
watch(stateTruthyValuesText, () => {
  if (!stateInitialized.value || skipSync.value) {
    return;
  }

  updateSelectedValuesFromText();

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    truthyValuesText: stateTruthyValuesText.value
  };
});
</script>
