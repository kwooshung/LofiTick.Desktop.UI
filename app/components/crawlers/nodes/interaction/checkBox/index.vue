<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-check-square" :title="t('components.crawler.blueprint.nodes.interaction.checkBox.title')" :description="t('components.crawler.blueprint.nodes.interaction.checkBox.description')" header-bg="bg-purple-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.selector.label')">
        <UInput v-model="stateSelector" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.interaction.common.fields.selector.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionCheckBoxTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.skipIfAlreadyState.label')">
        <USwitch v-model="stateSkipIfAlreadyState" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')">
        <USwitch v-model="stateSimulateNativeInput" />
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
const stateSelector = ref('');
const stateTimeoutMs = ref(10000);
const stateSkipIfAlreadyState = ref(true);
const stateSimulateNativeInput = ref(false);

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
  stateSelector.value = String(data.selector ?? '');
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateSkipIfAlreadyState.value = Boolean(data.skipIfAlreadyState ?? true);
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateSelector, stateTimeoutMs, stateSkipIfAlreadyState, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    selector: stateSelector.value,
    timeoutMs: stateTimeoutMs.value,
    skipIfAlreadyState: stateSkipIfAlreadyState.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
