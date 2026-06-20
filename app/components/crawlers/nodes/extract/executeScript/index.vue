<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-square-code" :title="t('components.crawler.blueprint.nodes.extract.executeScript.title')" :description="t('components.crawler.blueprint.nodes.extract.executeScript.description')" header-bg="bg-emerald-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.extract.executeScript.fields.script.label')">
        <div v-if="hasTargetPinConnection('input-script-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UTextarea v-else v-model="stateScript" :rows="6" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.extract.executeScript.fields.script.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

/**
 * 状态：stateNode。
 */
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
/**
 * 状态：stateInitialized。
 */
const stateInitialized = ref(false);
/**
 * 状态：stateScript。
 */
const stateScript = ref('return document.title;');

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

const leftPins: IBasicSidePin[] = [
  {
    id: 'input-script-string',
    label: t('components.crawler.blueprint.nodes.extract.executeScript.fields.script.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.script')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'any',
    topPercent: 20,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.result')
  },
  {
    id: 'result-array',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.array'),
    direction: 'out',
    dataType: 'array',
    topPercent: 40,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.resultArray')
  },
  {
    id: 'result-length',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.length'),
    direction: 'out',
    dataType: 'number',
    topPercent: 60,
    description: t('components.crawler.blueprint.nodes.extract.executeScript.pinDescriptions.resultLength')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 80,
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
  stateScript.value = String(data.script ?? 'return document.title;');
  stateInitialized.value = true;
});

watch(stateScript, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    script: stateScript.value
  };
});
</script>
