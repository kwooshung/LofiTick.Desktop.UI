<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-loader-circle" :title="t('components.crawler.blueprint.nodes.wait.loadState.title')" :description="t('components.crawler.blueprint.nodes.wait.loadState.description')" header-bg="bg-amber-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.wait.loadState.fields.state.label')">
        <USelect v-model="stateLoadState" class="w-full" :items="stateLoadStateOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.wait.loadState.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerWaitLoadStateTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 常量：等待加载状态默认超时时间（毫秒）。
 */
const DEFAULT_TIMEOUT_MS = 10000;

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();

/**
 * 状态：是否已完成 node.data 的首次回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：目标加载状态。
 */
const stateLoadState = ref('networkidle');

/**
 * 计算属性：加载状态可选项。
 */
const stateLoadStateOptions = computed(() => {
  return [
    {
      value: 'load',
      label: t('components.crawler.blueprint.nodes.wait.loadState.fields.state.options.load')
    },
    {
      value: 'domcontentloaded',
      label: t('components.crawler.blueprint.nodes.wait.loadState.fields.state.options.domcontentloaded')
    },
    {
      value: 'networkidle',
      label: t('components.crawler.blueprint.nodes.wait.loadState.fields.state.options.networkidle')
    }
  ];
});

/**
 * 状态：超时时间（毫秒）。
 */
const stateTimeoutMs = ref(DEFAULT_TIMEOUT_MS);

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.wait.loadState.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.wait.loadState.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.wait.loadState.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.wait.loadState.outputs.messageDescription')
  }
];

/**
 * 监听：初始化阶段将 node.data 回填到本地状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  const state = String(data.state ?? 'networkidle');
  stateLoadState.value = ['load', 'domcontentloaded', 'networkidle'].includes(state) ? state : 'networkidle';
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : DEFAULT_TIMEOUT_MS;
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch([stateLoadState, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    state: stateLoadState.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
