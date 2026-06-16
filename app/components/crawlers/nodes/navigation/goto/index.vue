<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-external-link" :title="t('components.crawler.blueprint.nodes.navigation.goto.title')" :description="t('components.crawler.blueprint.nodes.navigation.goto.description')" header-bg="bg-blue-500" :show-exec-in="false" :show-exec-out="false">
    <div class="relative h-10">
      <Handle id="exec-in" type="target" :position="Position.Left" :is-valid-connection="isValidConnectionTarget" class="h-5! w-4! translate-x-4 rounded-none! border-0! [clip-path:polygon(0_0,100%_50%,0_100%)]" />

      <Handle id="exec-out-success" type="source" :position="Position.Right" :is-valid-connection="isValidConnectionSource" :style="{ top: '35%' }" class="h-5! w-4! -translate-x-4 rounded-none! border-0! [clip-path:polygon(0_0,100%_50%,0_100%)]" />
      <Handle id="exec-out-fail" type="source" :position="Position.Right" :is-valid-connection="isValidConnectionSource" :style="{ top: '75%' }" class="h-5! w-4! -translate-x-4 rounded-none! border-0! [clip-path:polygon(0_0,100%_50%,0_100%)]" />

      <span class="text-muted absolute top-[20%] right-3 text-[10px] leading-none">{{ t('components.crawler.blueprint.nodes.navigation.goto.outputs.success') }}</span>
      <span class="text-muted absolute top-[60%] right-3 text-[10px] leading-none">{{ t('components.crawler.blueprint.nodes.navigation.goto.outputs.fail') }}</span>
    </div>

    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.label')">
        <UInput v-model="statePath" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.waitReady.label')">
        <USwitch v-model="stateWaitReady" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.timeoutMs.label')">
        <UInputNumber v-model="stateTimeoutMs" :min="1000" :step="500" orientation="vertical" class="w-full" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import type { Connection } from '@vue-flow/core';
import { Handle, Position, useNode, useNodeId } from '@vue-flow/core';

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
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();

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
 * 函数：验证连接是否满足 exec-out* -> exec-in 规则。
 */
const isExecConnection = (connection: Connection): boolean => {
  const sourceHandle = String(connection.sourceHandle ?? '');
  return sourceHandle.startsWith('exec-out') && connection.targetHandle === 'exec-in';
};

/**
 * 函数：验证连接目标是否合法（仅允许其他节点的 exec-out* 连接到当前节点 exec-in）。
 */
const isValidConnectionTarget = (connection: Connection): boolean => {
  return isExecConnection(connection) && connection.source !== stateNodeId;
};

/**
 * 函数：验证连接源是否合法（仅允许当前节点 exec-out* 连接到其他节点 exec-in）。
 */
const isValidConnectionSource = (connection: Connection): boolean => {
  return isExecConnection(connection) && connection.target !== stateNodeId;
};

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
