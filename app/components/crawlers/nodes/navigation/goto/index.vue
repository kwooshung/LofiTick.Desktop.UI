<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-external-link" :title="t('components.crawler.blueprint.nodes.navigation.goto.title')" :description="t('components.crawler.blueprint.nodes.navigation.goto.description')" header-bg="bg-blue-500" :right-pins="computedRightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.label')">
        <UInput v-model="statePath" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.timeoutMs.label')">
        <UInputNumber v-model="stateTimeoutMs" :min="1000" :step="500" orientation="vertical" class="w-full" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.waitReady.label')">
        <USwitch v-model="stateWaitReady" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersNodesNavigationGotoData } from '@/components/crawlers/nodes/navigation/goto/index.types';

/**
 * 常量：跳转节点默认超时时间（毫秒）。
 */
const DEFAULT_TIMEOUT_MS = 15000;

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
 * 状态：目标路径。
 */
const statePath = ref('');

/**
 * 状态：是否等待页面就绪。
 */
const stateWaitReady = ref(true);

/**
 * 状态：超时时间（毫秒）。
 */
const stateTimeoutMs = ref(DEFAULT_TIMEOUT_MS);

/**
 * 计算属性：右侧数据输出引脚配置。
 */
const computedRightPins = computed<IBasicSidePin[]>(() => {
  return [
    {
      id: 'result-boolean',
      label: t('components.crawler.blueprint.nodes.navigation.goto.outputs.boolean'),
      direction: 'out',
      dataType: 'boolean',
      topPercent: 35,
      description: t('components.crawler.blueprint.nodes.navigation.goto.outputs.booleanDescription')
    },
    {
      id: 'result-message',
      label: t('components.crawler.blueprint.nodes.navigation.goto.outputs.message'),
      direction: 'out',
      dataType: 'string',
      topPercent: 75,
      description: t('components.crawler.blueprint.nodes.navigation.goto.outputs.messageDescription')
    }
  ];
});

/**
 * 监听：初始化阶段将 node.data 回填到本地状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as ICrawlersNodesNavigationGotoData;
  statePath.value = String(data.path ?? data.url ?? '');
  stateWaitReady.value = Boolean(data.waitReady ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(1000, Number(data.timeoutMs)) : DEFAULT_TIMEOUT_MS;
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch([statePath, stateWaitReady, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    path: statePath.value,
    waitReady: stateWaitReady.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
