<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-send"
    :title="t('components.crawler.blueprint.nodes.output.sendToApi.title')"
    :description="t('components.crawler.blueprint.nodes.output.sendToApi.description')"
    header-color=""
    header-bg="bg-red-500"
    :left-pins="leftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.output.sendToApi.fields.endpoint.label')">
        <UInput v-model="stateEndpoint" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.output.sendToApi.fields.endpoint.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.output.sendToApi.fields.method.label')">
        <USelect v-model="stateMethod" class="w-full" :items="stateMethodOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.output.sendToApi.fields.payload.label')">
        <UTextarea v-model="statePayload" autoresize class="scrollbar w-full" :placeholder="t('components.crawler.blueprint.nodes.output.sendToApi.fields.payload.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：发送方法。
 */
type TSendMethod = 'POST' | 'PUT' | 'PATCH';

const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();

/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：接口地址。
 */
const stateEndpoint = ref('');

/**
 * 状态：发送方法。
 */
const stateMethod = ref<TSendMethod>('POST');

/**
 * 状态：请求负载文本。
 */
const statePayload = ref('');

/**
 * 计算属性：方法选项。
 */
const stateMethodOptions = computed(() => [
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' }
]);

/**
 * 常量：左侧数据输入引脚配置。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-payload-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'in',
    dataType: 'any',
    topPercent: 40,
    description: t('components.crawler.blueprint.nodes.output.sendToApi.pinDescriptions.payload')
  },
  {
    id: 'input-context-object',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.context'),
    direction: 'in',
    dataType: 'object',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.output.sendToApi.pinDescriptions.context')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-response-object',
    label: t('components.crawler.blueprint.nodes.output.sendToApi.outputs.response.label'),
    direction: 'out',
    dataType: 'object',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.output.sendToApi.outputs.response.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 90,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateEndpoint.value = String(data.endpoint ?? '');

  /**
   * 常量：method。
   */
  const method = String(data.method ?? 'POST').toUpperCase();
  stateMethod.value = method === 'PUT' || method === 'PATCH' ? method : 'POST';
  statePayload.value = String(data.payload ?? '');
  stateInitialized.value = true;
});

watch([stateEndpoint, stateMethod, statePayload], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    endpoint: stateEndpoint.value,
    method: stateMethod.value,
    payload: statePayload.value
  };
});
</script>
