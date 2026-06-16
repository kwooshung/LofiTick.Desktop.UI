<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-arrow-left" :title="t('components.crawler.blueprint.nodes.navigation.back.title')" :description="t('components.crawler.blueprint.nodes.navigation.back.description')" header-bg="bg-blue-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.back.fields.steps.label')">
        <UInputNumber v-model="stateSteps" :min="1" :step="1" orientation="vertical" class="w-full" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.back.fields.timeoutMs.label')">
        <UInputNumber v-model="stateTimeoutMs" :min="1000" :step="500" orientation="vertical" class="w-full" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.back.fields.waitReady.label')">
        <USwitch v-model="stateWaitReady" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.back.fields.allowNoHistory.label')">
        <USwitch v-model="stateAllowNoHistory" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersNodesNavigationBackData } from '@/components/crawlers/nodes/navigation/back/index.types';

/**
 * 常量：后退节点默认超时时间（毫秒）。
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
 * 状态：后退步数。
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
    label: t('components.crawler.blueprint.nodes.navigation.back.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.navigation.back.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.navigation.back.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.navigation.back.outputs.messageDescription')
  }
];

/**
 * 监听：初始化阶段将 node.data 回填到本地状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as ICrawlersNodesNavigationBackData;
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
