<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-arrow-right" :title="t('components.crawler.blueprint.nodes.navigation.forward.title')" :description="t('components.crawler.blueprint.nodes.navigation.forward.description')" header-bg="bg-blue-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.forward.fields.steps.label')">
        <CrawlersNodesCommonNumberInput id="crawlerNavigationForwardSteps" v-model="stateSteps" :min="1" :step="1" prefix="#" unit="step" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.forward.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerNavigationForwardTimeoutMs" v-model="stateTimeoutMs" :min="1000" :step="500" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.forward.fields.waitReady.label')">
        <USwitch v-model="stateWaitReady" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.forward.fields.allowNoHistory.label')">
        <USwitch v-model="stateAllowNoHistory" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersNodesNavigationForwardData } from '@/components/crawlers/nodes/navigation/forward/index.types';

/**
 * 常量：前进节点默认超时时间（毫秒）。
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
 * 状态：前进步数。
 */
const stateSteps = ref(1);

/**
 * 状态：是否等待页面就绪。
 */
const stateWaitReady = ref(true);

/**
 * 状态：超时时间（毫秒）。
 */
const stateTimeoutMs = ref(DEFAULT_TIMEOUT_MS);

/**
 * 状态：无历史记录时是否忽略错误。
 */
const stateAllowNoHistory = ref(true);

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.navigation.forward.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.navigation.forward.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.navigation.forward.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.navigation.forward.outputs.messageDescription')
  }
];

/**
 * 监听：初始化阶段将 node.data 回填到本地状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as ICrawlersNodesNavigationForwardData;
  stateSteps.value = Number.isFinite(Number(data.steps)) ? Math.max(1, Number(data.steps)) : 1;
  stateWaitReady.value = Boolean(data.waitReady ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(1000, Number(data.timeoutMs)) : DEFAULT_TIMEOUT_MS;
  stateAllowNoHistory.value = Boolean(data.allowNoHistory ?? true);
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch([stateSteps, stateWaitReady, stateTimeoutMs, stateAllowNoHistory], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    steps: stateSteps.value,
    waitReady: stateWaitReady.value,
    timeoutMs: stateTimeoutMs.value,
    allowNoHistory: stateAllowNoHistory.value
  };
});
</script>
