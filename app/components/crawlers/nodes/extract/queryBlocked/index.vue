<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-shield-alert" :title="t('components.crawler.blueprint.nodes.extract.queryBlocked.title')" :description="t('components.crawler.blueprint.nodes.extract.queryBlocked.description')" header-bg="bg-red-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.extract.queryBlocked.fields.mode.label')">
        <USelect v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();

/**
 * 状态：stateInitialized。
 */
const stateInitialized = ref(false);

/**
 * 状态：stateMode。
 */
const stateMode = ref('auto');

/**
 * 状态：stateModeOptions。
 */
const stateModeOptions = computed(() => {
  return [
    {
      value: 'auto',
      label: t('components.crawler.blueprint.nodes.extract.queryBlocked.fields.mode.options.auto')
    },
    {
      value: 'cloudflare',
      label: t('components.crawler.blueprint.nodes.extract.queryBlocked.fields.mode.options.cloudflare')
    }
  ];
});

/**
 * 常量：右侧布尔输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.extract.queryBlocked.pinDescriptions.blocked')
  }
];

/**
 * 监听：初始化阶段将 node.data 回填到本地状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  const mode = String(data.mode ?? 'auto');
  stateMode.value = stateModeOptions.value.some((item) => item.value === mode) ? mode : 'auto';
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch(stateMode, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    mode: stateMode.value
  };
});
</script>
