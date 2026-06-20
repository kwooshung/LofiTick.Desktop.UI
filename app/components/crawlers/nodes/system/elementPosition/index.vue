<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-locate-fixed" :title="t('components.crawler.blueprint.nodes.system.elementPosition.title')" :description="t('components.crawler.blueprint.nodes.system.elementPosition.description')" header-bg="bg-slate-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.selector.label')">
        <CrawlersNodesCommonSelectorInput v-model="stateSelector" v-model:selector-type="stateSelectorType" :placeholder="t('components.crawler.blueprint.nodes.interaction.common.fields.selector.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.system.elementPosition.fields.anchorPoint.label')">
        <USelect v-model="stateAnchorPoint" class="w-full" :items="stateAnchorPointOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.system.elementPosition.fields.outputScope.label')">
        <USelect v-model="stateOutputScope" class="w-full" :items="stateOutputScopeOptions" value-attribute="value" option-attribute="label" />
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
 * 状态：stateSelector。
 */
const stateSelector = ref('');
/**
 * 状态：stateSelectorType。
 */
const stateSelectorType = ref<'xpath' | 'css'>('xpath');
/**
 * 状态：stateAnchorPoint。
 */
const stateAnchorPoint = ref('top-left');
/**
 * 状态：stateOutputScope。
 */
const stateOutputScope = ref('both');

/**
 * 状态：stateAnchorPointOptions。
 */
const stateAnchorPointOptions = computed(() => [
  {
    value: 'top-left',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.fields.anchorPoint.options.topLeft')
  },
  {
    value: 'center',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.fields.anchorPoint.options.center')
  }
]);

/**
 * 状态：stateOutputScopeOptions。
 */
const stateOutputScopeOptions = computed(() => [
  {
    value: 'both',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.fields.outputScope.options.both')
  },
  {
    value: 'webview',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.fields.outputScope.options.webview')
  },
  {
    value: 'screen',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.fields.outputScope.options.screen')
  }
]);

const rightPins: IBasicSidePin[] = [
  {
    id: 'element-exists',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.exists.label'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 12,
    description: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.exists.description')
  },
  {
    id: 'element-webview-x',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.webviewX.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 24,
    description: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.webviewX.description')
  },
  {
    id: 'element-webview-y',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.webviewY.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 36,
    description: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.webviewY.description')
  },
  {
    id: 'element-screen-x',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.screenX.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 48,
    description: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.screenX.description')
  },
  {
    id: 'element-screen-y',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.screenY.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 60,
    description: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.screenY.description')
  },
  {
    id: 'element-webview-rect',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.rectWebview.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 72,
    description: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.rectWebview.description')
  },
  {
    id: 'element-screen-rect',
    label: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.rectScreen.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 84,
    description: t('components.crawler.blueprint.nodes.system.elementPosition.outputs.rectScreen.description')
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

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateSelector.value = String(data.selector ?? '');
  stateSelectorType.value = ['xpath', 'css'].includes(String(data.selectorType)) ? (String(data.selectorType) as 'xpath' | 'css') : 'xpath';

  /**
   * 常量：anchorPoint。
   */
  const anchorPoint = String(data.anchorPoint ?? 'top-left');
  stateAnchorPoint.value = ['top-left', 'center'].includes(anchorPoint) ? anchorPoint : 'top-left';

  /**
   * 常量：outputScope。
   */
  const outputScope = String(data.outputScope ?? 'both');
  stateOutputScope.value = ['both', 'webview', 'screen'].includes(outputScope) ? outputScope : 'both';

  stateInitialized.value = true;
});

watch([stateSelector, stateSelectorType, stateAnchorPoint, stateOutputScope], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    selector: stateSelector.value,
    selectorType: stateSelectorType.value,
    anchorPoint: stateAnchorPoint.value,
    outputScope: stateOutputScope.value
  };
});
</script>
