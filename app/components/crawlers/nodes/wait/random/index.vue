<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-shuffle" :title="t('components.crawler.blueprint.nodes.wait.random.title')" :description="t('components.crawler.blueprint.nodes.wait.random.description')" header-bg="bg-amber-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.wait.random.fields.minMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerWaitRandomMinMs" v-model="stateMinMs" :min="100" :step="100" prefix="min" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.wait.random.fields.maxMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerWaitRandomMaxMs" v-model="stateMaxMs" :min="100" :step="100" prefix="max" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 常量：随机等待默认最小值（毫秒）。
 */
const DEFAULT_MIN_MS = 500;

/**
 * 常量：随机等待默认最大值（毫秒）。
 */
const DEFAULT_MAX_MS = 1500;

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
 * 状态：随机等待最小值（毫秒）。
 */
const stateMinMs = ref(DEFAULT_MIN_MS);

/**
 * 状态：随机等待最大值（毫秒）。
 */
const stateMaxMs = ref(DEFAULT_MAX_MS);

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.wait.random.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.wait.random.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.wait.random.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.wait.random.outputs.messageDescription')
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
  stateMinMs.value = Number.isFinite(Number(data.minMs)) ? Math.max(100, Number(data.minMs)) : DEFAULT_MIN_MS;
  stateMaxMs.value = Number.isFinite(Number(data.maxMs)) ? Math.max(100, Number(data.maxMs)) : DEFAULT_MAX_MS;

  if (stateMaxMs.value < stateMinMs.value) {
    stateMaxMs.value = stateMinMs.value;
  }

  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch([stateMinMs, stateMaxMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  if (stateMaxMs.value < stateMinMs.value) {
    stateMaxMs.value = stateMinMs.value;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    minMs: stateMinMs.value,
    maxMs: stateMaxMs.value
  };
});
</script>
