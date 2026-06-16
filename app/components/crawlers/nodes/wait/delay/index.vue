<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-hourglass" :title="t('components.crawler.blueprint.nodes.wait.delay.title')" :description="t('components.crawler.blueprint.nodes.wait.delay.description')" header-bg="bg-amber-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.wait.delay.fields.durationMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerWaitDelayDurationMs" v-model="stateDurationMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 常量：延迟默认时长（毫秒）。
 */
const DEFAULT_DURATION_MS = 500;

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
 * 状态：延迟时长（毫秒）。
 */
const stateDurationMs = ref(DEFAULT_DURATION_MS);

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.wait.delay.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.wait.delay.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.wait.delay.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.wait.delay.outputs.messageDescription')
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
  stateDurationMs.value = Number.isFinite(Number(data.durationMs)) ? Math.max(100, Number(data.durationMs)) : DEFAULT_DURATION_MS;
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch(stateDurationMs, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    durationMs: stateDurationMs.value
  };
});
</script>
