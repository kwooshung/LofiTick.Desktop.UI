<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-bell" :title="t('components.crawler.blueprint.nodes.output.playSound.title')" :description="t('components.crawler.blueprint.nodes.output.playSound.description')" header-color="" header-bg="bg-red-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.output.playSound.fields.kind.label')">
        <div v-if="hasTargetPinConnection('input-kind-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateKind" class="w-full" :items="stateKindOptions" value-attribute="value" option-attribute="label" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { TTauriCrawlerBlueprintPlaySoundKind } from '@@/shared/types';

/**
 * 常量：提示音类型。
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
 * 状态：提示音类型。
 */
const stateKind = ref<TTauriCrawlerBlueprintPlaySoundKind>('info');

/**
 * 计算属性：提示音选项。
 */
const stateKindOptions = computed(() => [
  {
    value: 'info',
    label: t('components.crawler.blueprint.nodes.output.playSound.fields.kind.options.info')
  },
  {
    value: 'success',
    label: t('components.crawler.blueprint.nodes.output.playSound.fields.kind.options.success')
  },
  {
    value: 'warning',
    label: t('components.crawler.blueprint.nodes.output.playSound.fields.kind.options.warning')
  },
  {
    value: 'error',
    label: t('components.crawler.blueprint.nodes.output.playSound.fields.kind.options.error')
  }
]);

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
    id: 'input-kind-string',
    label: t('components.crawler.blueprint.nodes.output.playSound.fields.kind.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 48,
    description: t('components.crawler.blueprint.nodes.output.playSound.pinDescriptions.kind')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-kind-string',
    label: t('components.crawler.blueprint.nodes.output.playSound.outputs.kind.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 44,
    description: t('components.crawler.blueprint.nodes.output.playSound.outputs.kind.description')
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
  const kind = String(data.kind ?? data.soundKind ?? 'info');
  stateKind.value = kind === 'success' || kind === 'warning' || kind === 'error' ? kind : 'info';
  stateInitialized.value = true;
});

watch(stateKind, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    kind: stateKind.value
  };
});
</script>
