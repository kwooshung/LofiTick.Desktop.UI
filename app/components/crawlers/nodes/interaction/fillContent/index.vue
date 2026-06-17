<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-form-input" :title="t('components.crawler.blueprint.nodes.interaction.fillContent.title')" header-bg="bg-purple-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.content.label')">
        <UTextarea v-model="stateContent" :rows="3" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.interaction.common.fields.content.placeholder')" />
      </UFormField>

      <USwitch v-model="stateClearBefore" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.clearBefore.label')" />

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionFillContentTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <USwitch v-model="stateSimulateNativeInput" :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateInitialized = ref(false);
const stateContent = ref('');
const stateClearBefore = ref(true);
const stateTimeoutMs = ref(10000);
const stateSimulateNativeInput = ref(false);

const leftPins: IBasicSidePin[] = [
  {
    id: 'element-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 50,
    description: '由元素查询节点输出的目标元素'
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateContent.value = String(data.content ?? '');
  stateClearBefore.value = Boolean(data.clearBefore ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateContent, stateClearBefore, stateTimeoutMs, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    content: stateContent.value,
    clearBefore: stateClearBefore.value,
    timeoutMs: stateTimeoutMs.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
