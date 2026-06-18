<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-camera" :title="t('components.crawler.blueprint.nodes.output.screenshot.title')" :description="t('components.crawler.blueprint.nodes.output.screenshot.description')" header-color="" header-bg="bg-red-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.output.screenshot.fields.targetMode.label')">
        <div v-if="hasTargetPinConnection('input-target-mode-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USelect v-else v-model="stateTargetMode" class="w-full" :items="stateTargetModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.output.screenshot.fields.path.label')">
        <div v-if="hasTargetPinConnection('input-path-string')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInput v-else v-model="statePath" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.output.screenshot.fields.path.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.output.screenshot.fields.fullPage.label')">
        <div v-if="hasTargetPinConnection('input-full-page-boolean')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <USwitch v-else v-model="stateFullPage" :label="t('components.crawler.blueprint.nodes.output.screenshot.fields.fullPage.label')" :disabled="stateTargetMode !== 'page'" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：截图目标模式。
 */
type TScreenshotTargetMode = 'page' | 'element';

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
 * 状态：截图目标模式。
 */
const stateTargetMode = ref<TScreenshotTargetMode>('page');

/**
 * 状态：截图保存路径。
 */
const statePath = ref('');

/**
 * 状态：页面截图是否全页。
 */
const stateFullPage = ref(false);

/**
 * 计算属性：目标模式选项。
 */
const stateTargetModeOptions = computed(() => [
  {
    value: 'page',
    label: t('components.crawler.blueprint.nodes.output.screenshot.fields.targetMode.options.page')
  },
  {
    value: 'element',
    label: t('components.crawler.blueprint.nodes.output.screenshot.fields.targetMode.options.element')
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
    id: 'input-element-object',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 40,
    description: t('components.crawler.blueprint.nodes.output.screenshot.pinDescriptions.element')
  },
  {
    id: 'input-target-mode-string',
    label: t('components.crawler.blueprint.nodes.output.screenshot.fields.targetMode.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 18,
    description: t('components.crawler.blueprint.nodes.output.screenshot.pinDescriptions.targetMode')
  },
  {
    id: 'input-path-string',
    label: t('components.crawler.blueprint.nodes.output.screenshot.fields.path.label'),
    direction: 'in',
    dataType: 'string',
    topPercent: 62,
    description: t('components.crawler.blueprint.nodes.output.screenshot.pinDescriptions.path')
  },
  {
    id: 'input-full-page-boolean',
    label: t('components.crawler.blueprint.nodes.output.screenshot.fields.fullPage.label'),
    direction: 'in',
    dataType: 'boolean',
    topPercent: 88,
    description: t('components.crawler.blueprint.nodes.output.screenshot.pinDescriptions.fullPage')
  }
];

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-path-string',
    label: t('components.crawler.blueprint.nodes.output.screenshot.outputs.path.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 25,
    description: t('components.crawler.blueprint.nodes.output.screenshot.outputs.path.description')
  },
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 58,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 86,
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

  /**
   * 常量：targetMode。
   */
  const targetMode = String(data.targetMode ?? 'page');
  stateTargetMode.value = targetMode === 'element' ? 'element' : 'page';
  statePath.value = String(data.path ?? '');
  stateFullPage.value = Boolean(data.fullPage ?? false);
  stateInitialized.value = true;
});

watch([stateTargetMode, statePath, stateFullPage], () => {
  if (!stateInitialized.value) {
    return;
  }

  if (stateTargetMode.value !== 'page') {
    stateFullPage.value = false;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    targetMode: stateTargetMode.value,
    path: statePath.value,
    fullPage: stateFullPage.value
  };
});
</script>
