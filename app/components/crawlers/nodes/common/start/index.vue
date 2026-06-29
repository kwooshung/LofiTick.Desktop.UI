<template>
  <CrawlersNodesCommonBasic icon-name="i-tdesign:play-circle-filled" :title="computedCrawlerTitle" :description="computedCrawlerDescription" header-bg="bg-rose-500" :show-exec-in="false" :right-pins="computedRightPins">
    <div class="space-y-2">
      <FormUrlInput v-if="computedDomain !== ''" :model-value="computedDomain" readonly base-url-only class="w-full" />

      <div class="space-y-1">
        <label class="text-toned text-xs leading-none font-medium">{{ t('components.crawler.blueprint.nodes.common.start.form.crawlerTitle') }}</label>
        <UInput v-model="stateCrawlerTitle" :placeholder="t('components.crawler.blueprint.nodes.common.start.form.crawlerTitlePlaceholder')" class="w-full" maxlength="120" @blur="handleCrawlerTitleBlur" />
      </div>

      <div class="space-y-1">
        <label class="text-toned text-xs leading-none font-medium">{{ t('components.crawler.blueprint.nodes.common.start.form.crawlerDescription') }}</label>
        <UTextarea v-model="stateCrawlerDescription" :placeholder="t('components.crawler.blueprint.nodes.common.start.form.crawlerDescriptionPlaceholder')" :rows="2" autoresize :maxrows="4" class="w-full" />
      </div>

      <CrawlersNodesFunctionPins
        :node-id="computedNodeId"
        direction="output"
        :model-value="stateParameters"
        :empty-title="t('components.crawler.blueprint.nodes.common.start.empty.title')"
        :empty-description="t('components.crawler.blueprint.nodes.common.start.empty.description')"
        :empty-action-label="t('components.crawler.blueprint.nodes.common.start.empty.action')"
        :add-action-label="t('components.crawler.blueprint.nodes.common.start.actions.add')"
        :name-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.namePlaceholder')"
        :string-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.stringPlaceholder')"
        :json-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.jsonPlaceholder')"
        @update:model-value="handleParametersUpdate"
      />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IFunctionNodePinDefinition } from '@/components/crawlers/nodes/common/function/index';
import { functionNodePinDefinitionsParse, functionNodePinSignatureGet } from '@/components/crawlers/nodes/common/function/index';
import type { ICrawlersNodesCommonStartData } from '@/components/crawlers/nodes/common/start/index.types';
import type { IVariableDefinitionData } from '@/components/crawlers/nodes/variable/shared/index';
import { variableOutputHandleIdGet } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：提示。
 */
const toast = useToast();

/**
 * Hook：Vue Flow。
 */
const { updateNodeData } = useVueFlow();

/**
 * 事件：节点内部尺寸刷新。
 */
const emit = defineEmits<{
  updateNodeInternals: [];
}>();

/**
 * Hook：当前节点实例。
 */
const stateNode = useNode();

/**
 * Hook：当前节点 ID。
 */
const stateNodeId = useNodeId();

/**
 * 状态：爬虫标题。
 */
const stateCrawlerTitle = ref('');

/**
 * 状态：爬虫描述。
 */
const stateCrawlerDescription = ref('');

/**
 * 状态：爬虫入口参数定义列表。
 */
const stateParameters = ref<IFunctionNodePinDefinition[]>([]);

/**
 * 计算属性：开始节点域名。
 */
const computedDomain = computed(() => {
  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as ICrawlersNodesCommonStartData;
  return String(data.domain ?? '').trim();
});

/**
 * 计算属性：当前节点 ID（含兜底）。
 */
const computedNodeId = computed<string>(() => {
  const fromHook = String(stateNodeId.value ?? '').trim();

  if (fromHook !== '') {
    return fromHook;
  }

  return String(stateNode.node.id ?? '').trim();
});

/**
 * 计算属性：爬虫标题（展示值）。
 */
const computedCrawlerTitle = computed(() => {
  const customTitle = stateCrawlerTitle.value.trim();

  return customTitle !== '' ? customTitle : t('components.crawler.blueprint.nodes.common.start.title');
});

/**
 * 计算属性：爬虫描述（展示值）。
 */
const computedCrawlerDescription = computed(() => {
  const customDescription = stateCrawlerDescription.value.trim();

  return customDescription !== '' ? customDescription : t('components.crawler.blueprint.nodes.common.start.description');
});

/**
 * 计算属性：入口参数输出引脚。
 */
const computedRightPins = computed<IBasicSidePin[]>(() => {
  return stateParameters.value.map((item) => ({
    id: variableOutputHandleIdGet(item.id, item.dataType),
    label: item.name.trim() !== '' ? item.name.trim() : t('components.crawler.blueprint.nodes.common.function.start.fields.parameterLabel'),
    direction: 'out',
    dataType: item.dataType,
    description: t('components.crawler.blueprint.nodes.common.function.start.fields.parameterDescription')
  }));
});

/**
 * 计算属性：入口参数引脚结构签名。
 */
const computedPinSignature = computed(() => functionNodePinSignatureGet(stateParameters.value));

/**
 * 事件：爬虫标题失焦校验。
 */
const handleCrawlerTitleBlur = (): void => {
  if (stateCrawlerTitle.value.trim() !== '') {
    return;
  }

  toast.add({
    color: 'error',
    description: t('components.crawler.blueprint.nodes.common.start.form.crawlerTitleRequired')
  });
};

/**
 * 事件：更新爬虫入口参数定义列表。
 * @param {IVariableDefinitionData[]} value 参数定义列表。
 * @returns {void} 无返回值。
 */
const handleParametersUpdate = (value: IVariableDefinitionData[]): void => {
  stateParameters.value = value.map((item) => ({
    id: item.id,
    name: item.name,
    dataType: item.dataType,
    defaultValue: item.defaultValue
  }));
};

watch(
  () => stateNode.node.data,
  (data) => {
    const normalizedData = (data ?? {}) as ICrawlersNodesCommonStartData;
    const nextParameters = functionNodePinDefinitionsParse(normalizedData.crawlerParameters);
    stateCrawlerTitle.value = String(normalizedData.crawlerTitle ?? '');
    stateCrawlerDescription.value = String(normalizedData.crawlerDescription ?? '');
    if (functionNodePinSignatureGet(nextParameters) !== computedPinSignature.value) {
      stateParameters.value = nextParameters;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => [stateCrawlerTitle.value, stateCrawlerDescription.value, stateParameters.value],
  () => {
    if (computedNodeId.value === '') {
      return;
    }

    void updateNodeData(computedNodeId.value, {
      crawlerTitle: stateCrawlerTitle.value,
      crawlerDescription: stateCrawlerDescription.value,
      domain: computedDomain.value,
      crawlerParameters: stateParameters.value.map((item) => ({
        id: item.id,
        name: item.name,
        dataType: item.dataType,
        defaultValue: item.defaultValue
      }))
    });
  },
  { deep: true }
);

watch(
  computedPinSignature,
  async () => {
    await nextTick();
    emit('updateNodeInternals');
  },
  { immediate: true }
);
</script>
