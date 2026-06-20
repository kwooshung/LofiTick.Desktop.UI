<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-code" :title="t('components.crawler.blueprint.nodes.extract.getHtml.title')" header-bg="bg-emerald-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.extract.getHtml.fields.htmlType.label')">
        <USelect v-model="stateHtmlType" class="w-full" :items="stateHtmlTypeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <USwitch v-model="stateNormalizeWhitespace" :label="t('components.crawler.blueprint.nodes.extract.getHtml.fields.normalizeWhitespace.label')" />

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerExtractGetHtmlTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
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
 * 状态：stateHtmlType。
 */
const stateHtmlType = ref('outerHTML');
/**
 * 状态：stateNormalizeWhitespace。
 */
const stateNormalizeWhitespace = ref(false);
/**
 * 状态：stateTimeoutMs。
 */
const stateTimeoutMs = ref(10000);

const leftPins: IBasicSidePin[] = [
  {
    id: 'element-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.common.pinLabels.element')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'html-string',
    label: t('components.crawler.blueprint.nodes.extract.getHtml.outputs.html.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 25,
    description: t('components.crawler.blueprint.nodes.extract.getHtml.outputs.html.description')
  },
  {
    id: 'html-length',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 48,
    description: t('components.crawler.blueprint.nodes.extract.getHtml.outputs.lengthDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 80,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

/**
 * 状态：stateHtmlTypeOptions。
 */
const stateHtmlTypeOptions = computed(() => {
  return [
    {
      value: 'outerHTML',
      label: t('components.crawler.blueprint.nodes.extract.getHtml.fields.htmlType.options.outerHTML')
    },
    {
      value: 'innerHTML',
      label: t('components.crawler.blueprint.nodes.extract.getHtml.fields.htmlType.options.innerHTML')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateHtmlType.value = ['outerHTML', 'innerHTML'].includes(String(data.htmlType)) ? String(data.htmlType) : 'outerHTML';
  stateNormalizeWhitespace.value = Boolean(data.normalizeWhitespace ?? false);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateInitialized.value = true;
});

watch([stateHtmlType, stateNormalizeWhitespace, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    htmlType: stateHtmlType.value,
    normalizeWhitespace: stateNormalizeWhitespace.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
