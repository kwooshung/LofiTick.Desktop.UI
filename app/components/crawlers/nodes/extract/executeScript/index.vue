<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-square-code" :title="t('components.crawler.blueprint.nodes.extract.executeScript.title')" :description="t('components.crawler.blueprint.nodes.extract.executeScript.description')" header-bg="bg-emerald-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.extract.executeScript.fields.script.label')">
        <UTextarea v-model="stateScript" :rows="6" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.extract.executeScript.fields.script.placeholder')" />
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
const stateScript = ref('return document.title;');

const leftPins: IBasicSidePin[] = [
  {
    id: 'context-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.context'),
    direction: 'in',
    dataType: 'any',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.context')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'any',
    topPercent: 20,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.result')
  },
  {
    id: 'result-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'out',
    dataType: 'array',
    topPercent: 40,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.resultArray')
  },
  {
    id: 'result-length',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 60,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.resultLength')
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

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateScript.value = String(data.script ?? 'return document.title;');
  stateInitialized.value = true;
});

watch(stateScript, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    script: stateScript.value
  };
});
</script>
