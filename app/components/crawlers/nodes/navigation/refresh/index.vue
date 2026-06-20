<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-refresh-cw" :title="t('components.crawler.blueprint.nodes.navigation.refresh.title')" :description="t('components.crawler.blueprint.nodes.navigation.refresh.description')" header-bg="bg-blue-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.refresh.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerNavigationRefreshTimeoutMs" v-model="stateTimeoutMs" :min="1000" :step="500" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <USwitch v-model="stateWaitReady" :label="t('components.crawler.blueprint.nodes.navigation.refresh.fields.waitReady.label')" />

      <USwitch v-model="stateHardReload" :label="t('components.crawler.blueprint.nodes.navigation.refresh.fields.hardReload.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersNodesNavigationRefreshData } from '@/components/crawlers/nodes/navigation/refresh/index.types';

/**
 * 常量：刷新节点默认超时时间（毫秒）。
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
 * 状态：是否等待页面就绪。
 */
const stateWaitReady = ref(true);

/**
 * 状态：超时时间（毫秒）。
 */
const stateTimeoutMs = ref(DEFAULT_TIMEOUT_MS);

/**
 * 状态：是否启用强制刷新。
 */
const stateHardReload = ref(false);

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.navigation.refresh.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.navigation.refresh.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.navigation.refresh.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.navigation.refresh.outputs.messageDescription')
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
  const data = (stateNode.node.data ?? {}) as ICrawlersNodesNavigationRefreshData;
  stateWaitReady.value = Boolean(data.waitReady ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(1000, Number(data.timeoutMs)) : DEFAULT_TIMEOUT_MS;
  stateHardReload.value = Boolean(data.hardReload ?? false);
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch([stateWaitReady, stateTimeoutMs, stateHardReload], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    waitReady: stateWaitReady.value,
    timeoutMs: stateTimeoutMs.value,
    hardReload: stateHardReload.value
  };
});
</script>
