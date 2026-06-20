<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-file-braces" :title="t('components.crawler.blueprint.nodes.typeConvert.json.title')" :description="t('components.crawler.blueprint.nodes.typeConvert.json.description')" header-bg="bg-yellow-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.json.fields.indent.label')">
        <CrawlersNodesCommonNumberInput id="crawlerTypeConvertJsonIndent" v-model="stateIndent" :min="0" :max="10" :step="1" :unit="t('components.crawler.blueprint.nodes.common.units.indent')" />
      </UFormField>
      <UFormField :label="t('components.crawler.blueprint.nodes.typeConvert.json.fields.handleCircular.label')">
        <USwitch v-model="stateHandleCircular" />
      </UFormField>
      <div class="flex items-center justify-between rounded-sm border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <span>{{ t('components.crawler.blueprint.nodes.typeConvert.json.hint') }}</span>
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

/**
 * 状态：stateNode。
 */
const stateNode = useNode();
/**
 * 状态：stateInitialized。
 */
const stateInitialized = ref(false);
/**
 * 状态：stateIndent。
 */
const stateIndent = ref(2);
/**
 * 状态：stateHandleCircular。
 */
const stateHandleCircular = ref(false);

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.input'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.typeConvert.json.inputs.input.description')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.typeConvert.json.outputs.result.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 65,
    description: t('components.crawler.blueprint.nodes.typeConvert.json.outputs.message.description')
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
  stateIndent.value = Number.isFinite(Number(data.indent)) ? Number(data.indent) : 2;
  stateHandleCircular.value = Boolean(data.handleCircular ?? false);
  stateInitialized.value = true;
});

watch([stateIndent, stateHandleCircular], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    indent: stateIndent.value,
    handleCircular: stateHandleCircular.value
  };
});
</script>
