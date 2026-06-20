<template>
  <CrawlersNodesCommonBasic :icon-name="computedIconName" :title="computedFunctionName" :description="computedFunctionDescription" header-bg="bg-rose-500" :show-exec-in="false" :right-pins="computedRightPins">
    <CrawlersNodesFunctionPins
      :node-id="stateNodeId"
      direction="output"
      :model-value="stateParameters"
      :empty-title="t('components.crawler.blueprint.nodes.common.function.start.empty.title')"
      :empty-description="t('components.crawler.blueprint.nodes.common.function.start.empty.description')"
      :empty-action-label="t('components.crawler.blueprint.nodes.common.function.start.empty.action')"
      :add-action-label="t('components.crawler.blueprint.nodes.common.function.start.actions.add')"
      :name-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.namePlaceholder')"
      :string-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.stringPlaceholder')"
      :json-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.jsonPlaceholder')"
      :connected-hint="t('components.crawler.blueprint.nodes.common.function.pins.connectedHint')"
      @update:model-value="handleParametersUpdate"
    />
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IFunctionNodePinDefinition } from '@/components/crawlers/nodes/function/shared/index';
import { functionNodeMetaParse, functionNodePinSignatureGet } from '@/components/crawlers/nodes/function/shared/index';
import type { IVariableDefinitionData } from '@/components/crawlers/nodes/variable/shared/index';
import { variableOutputHandleIdGet } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：当前节点。
 */
const stateNode = useNode();

/**
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();

/**
 * 事件：节点内部尺寸刷新。
 */
const emit = defineEmits<{
  updateNodeInternals: [];
}>();

/**
 * 状态：stateParameters。
 */
const stateParameters = ref<IFunctionNodePinDefinition[]>([]);

/**
 * 计算属性：函数节点元数据。
 */
const computedFunctionMeta = computed(() => functionNodeMetaParse(stateNode.node.data));

/**
 * 计算属性：函数名称。
 */
const computedFunctionName = computed(() => {
  const name = computedFunctionMeta.value.functionName.trim();

  if (name === '') {
    return t('components.crawler.blueprint.nodes.common.function.start.title');
  }

  return `${name}（${t('components.crawler.blueprint.nodes.common.function.start.suffix')}）`;
});

/**
 * 计算属性：函数描述。
 */
const computedFunctionDescription = computed(() => {
  const description = computedFunctionMeta.value.functionDescription.trim();

  return description !== '' ? description : t('components.crawler.blueprint.nodes.common.function.start.description');
});

/**
 * 计算属性：节点图标。
 */
const computedIconName = computed(() => 'i-mdi-function');

/**
 * 计算属性：右侧引脚。
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
 * 计算属性：引脚结构签名。
 */
const computedPinSignature = computed(() => functionNodePinSignatureGet(stateParameters.value));

/**
 * 计算属性：节点数据中的参数签名。
 */
const computedNodeParameterSignature = computed(() => {
  return functionNodePinSignatureGet(computedFunctionMeta.value.functionParameters);
});

/**
 * 事件：更新参数定义列表。
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
  computedNodeParameterSignature,
  () => {
    if (computedNodeParameterSignature.value === computedPinSignature.value) {
      return;
    }

    stateParameters.value = computedFunctionMeta.value.functionParameters.map((item) => ({ ...item }));
  },
  { immediate: true }
);

watch(
  stateParameters,
  () => {
    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      functionName: computedFunctionMeta.value.functionName,
      functionDescription: computedFunctionMeta.value.functionDescription,
      functionParameters: stateParameters.value.map((item) => ({
        id: item.id,
        name: item.name,
        dataType: item.dataType,
        defaultValue: item.defaultValue
      }))
    };
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
