<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-text-cursor-input" :title="t('components.crawler.blueprint.nodes.extract.getText.title')" header-bg="bg-emerald-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.extract.getText.fields.textMode.label')">
        <USelect v-model="stateTextMode" class="w-full" :items="stateTextModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <USwitch v-model="stateTrim" :label="t('components.crawler.blueprint.nodes.extract.getText.fields.trim.label')" />
      <USwitch v-model="stateNormalizeWhitespace" :label="t('components.crawler.blueprint.nodes.extract.getText.fields.normalizeWhitespace.label')" />

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerExtractGetTextTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateInitialized = ref(false);

const stateTextMode = ref('innerText');
const stateTrim = ref(true);
const stateNormalizeWhitespace = ref(false);
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
    id: 'text-string',
    label: t('components.crawler.blueprint.nodes.extract.getText.outputs.text.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 25,
    description: t('components.crawler.blueprint.nodes.extract.getText.outputs.text.description')
  },
  {
    id: 'text-length',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 45,
    description: t('components.crawler.blueprint.nodes.extract.getText.outputs.lengthDescription')
  },
  {
    id: 'text-exists',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exists'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 65,
    description: t('components.crawler.blueprint.nodes.extract.getText.outputs.existsDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 84,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

const stateTextModeOptions = computed(() => {
  return [
    {
      value: 'innerText',
      label: t('components.crawler.blueprint.nodes.extract.getText.fields.textMode.options.innerText')
    },
    {
      value: 'textContent',
      label: t('components.crawler.blueprint.nodes.extract.getText.fields.textMode.options.textContent')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateTextMode.value = ['innerText', 'textContent'].includes(String(data.textMode)) ? String(data.textMode) : 'innerText';
  stateTrim.value = Boolean(data.trim ?? true);
  stateNormalizeWhitespace.value = Boolean(data.normalizeWhitespace ?? false);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateInitialized.value = true;
});

watch([stateTextMode, stateTrim, stateNormalizeWhitespace, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    textMode: stateTextMode.value,
    trim: stateTrim.value,
    normalizeWhitespace: stateNormalizeWhitespace.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
