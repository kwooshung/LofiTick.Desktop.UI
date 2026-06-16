<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-braces" :title="t('components.crawler.blueprint.nodes.wait.condition.title')" :description="t('components.crawler.blueprint.nodes.wait.condition.description')" header-bg="bg-amber-500" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.wait.condition.fields.expression.label')">
        <UTextarea v-model="stateExpression" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.wait.condition.fields.expression.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.wait.condition.fields.timeoutMs.label')">
        <UInputNumber v-model="stateTimeoutMs" :min="100" :step="100" orientation="vertical" class="w-full" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 常量：等待条件默认超时时间（毫秒）。
 */
const DEFAULT_TIMEOUT_MS = 5000;

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
 * 状态：条件表达式。
 */
const stateExpression = ref('');

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
    label: t('components.crawler.blueprint.nodes.wait.condition.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.wait.condition.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.wait.condition.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.wait.condition.outputs.messageDescription')
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
  stateExpression.value = String(data.expression ?? '');
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : DEFAULT_TIMEOUT_MS;
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch([stateExpression, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    expression: stateExpression.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
