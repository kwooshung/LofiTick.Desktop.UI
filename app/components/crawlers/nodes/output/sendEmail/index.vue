<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-mail" :title="t('components.crawler.blueprint.nodes.output.sendEmail.title')" :description="t('components.crawler.blueprint.nodes.output.sendEmail.description')" header-color="" header-bg="bg-red-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.output.sendEmail.fields.to.label')">
        <div v-if="hasTargetPinConnection('input-to-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateTo" autoresize class="scrollbar w-full" :placeholder="t('components.crawler.blueprint.nodes.output.sendEmail.fields.to.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.output.sendEmail.fields.subject.label')">
        <div v-if="hasTargetPinConnection('input-subject-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="stateSubject" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.output.sendEmail.fields.subject.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.output.sendEmail.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateText" autoresize class="scrollbar w-full" :placeholder="t('components.crawler.blueprint.nodes.output.sendEmail.fields.text.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 常量：邮件发送节点。
 */
const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();

/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：收件人列表。
 */
const stateTo = ref('');

/**
 * 状态：邮件主题。
 */
const stateSubject = ref('');

/**
 * 状态：邮件正文。
 */
const stateText = ref('');

/**
 * 函数：判断目标引脚是否已连接。
 * @param {string} handleId 引脚 ID。
 * @returns {boolean} 是否已连接。
 */
const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

/**
 * 常量：左侧数据输入引脚配置。
 */
const leftPins: IBasicSidePin[] = [
  {
    id: 'input-to-string',
    label: t('components.crawler.blueprint.nodes.output.sendEmail.fields.to.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 28,
    description: t('components.crawler.blueprint.nodes.output.sendEmail.pinDescriptions.to')
  },
  {
    id: 'input-subject-string',
    label: t('components.crawler.blueprint.nodes.output.sendEmail.fields.subject.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 55,
    description: t('components.crawler.blueprint.nodes.output.sendEmail.pinDescriptions.subject')
  },
  {
    id: 'input-text-string',
    label: t('components.crawler.blueprint.nodes.output.sendEmail.fields.text.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 82,
    description: t('components.crawler.blueprint.nodes.output.sendEmail.pinDescriptions.text')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.output.sendEmail.outputs.count.label'),
    direction: 'out',
    dataType: 'number',
    topPercent: 43,
    description: t('components.crawler.blueprint.nodes.output.sendEmail.outputs.count.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 78,
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
  const recipientsValue = data.to ?? data.emails ?? data.recipients ?? '';
  stateTo.value = Array.isArray(recipientsValue)
    ? recipientsValue
        .map((item) => String(item ?? '').trim())
        .filter(Boolean)
        .join('\n')
    : String(recipientsValue);
  stateSubject.value = String(data.subject ?? data.title ?? '');
  stateText.value = String(data.text ?? data.content ?? data.body ?? '');
  stateInitialized.value = true;
});

watch([stateTo, stateSubject, stateText], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    to: stateTo.value,
    subject: stateSubject.value,
    text: stateText.value
  };
});
</script>
