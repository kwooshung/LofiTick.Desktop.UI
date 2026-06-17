<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-target" :title="t('components.crawler.blueprint.nodes.system.mousePosition.title')" :description="t('components.crawler.blueprint.nodes.system.mousePosition.description')" header-bg="bg-slate-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.system.mousePosition.fields.outputScope.label')">
        <USelect v-model="stateOutputScope" class="w-full" :items="stateOutputScopeOptions" value-attribute="value" option-attribute="label" />
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
const stateOutputScope = ref('both');

const stateOutputScopeOptions = computed(() => [
  {
    value: 'both',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.fields.outputScope.options.both')
  },
  {
    value: 'webview',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.fields.outputScope.options.webview')
  },
  {
    value: 'screen',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.fields.outputScope.options.screen')
  }
]);

const rightPins: IBasicSidePin[] = [
  {
    id: 'mouse-webview-x',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.webviewX.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 14,
    description: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.webviewX.description')
  },
  {
    id: 'mouse-webview-y',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.webviewY.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 27,
    description: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.webviewY.description')
  },
  {
    id: 'mouse-screen-x',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.screenX.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 41,
    description: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.screenX.description')
  },
  {
    id: 'mouse-screen-y',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.screenY.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 55,
    description: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.screenY.description')
  },
  {
    id: 'mouse-webview-point',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.webviewPoint.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 69,
    description: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.webviewPoint.description')
  },
  {
    id: 'mouse-screen-point',
    label: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.screenPoint.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 82,
    description: t('components.crawler.blueprint.nodes.system.mousePosition.outputs.screenPoint.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 94,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  const outputScope = String(data.outputScope ?? 'both');
  stateOutputScope.value = ['both', 'webview', 'screen'].includes(outputScope) ? outputScope : 'both';
  stateInitialized.value = true;
});

watch([stateOutputScope], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    outputScope: stateOutputScope.value
  };
});
</script>
