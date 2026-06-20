<template>
  <CrawlersNodesCommonBasic :icon-name="computedIconName" :title="computedFunctionName" :description="computedFunctionDescription" header-bg="bg-teal-600" :show-exec-out="false" :left-pins="computedLeftPins">
    <CrawlersNodesFunctionPins
      :node-id="stateNodeId"
      direction="input"
      :model-value="stateReturns"
      :empty-title="t('components.crawler.blueprint.nodes.common.function.return.empty.title')"
      :empty-description="t('components.crawler.blueprint.nodes.common.function.return.empty.description')"
      :empty-action-label="t('components.crawler.blueprint.nodes.common.function.return.empty.action')"
      :add-action-label="t('components.crawler.blueprint.nodes.common.function.return.actions.add')"
      :name-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.namePlaceholder')"
      :string-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.stringPlaceholder')"
      :json-placeholder="t('components.crawler.blueprint.nodes.common.function.pins.jsonPlaceholder')"
      :connected-hint="t('components.crawler.blueprint.nodes.common.function.pins.connectedHint')"
      @update:model-value="handleReturnsUpdate"
    />
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IFunctionNodePinDefinition } from '@/components/crawlers/nodes/function/shared/index';
import { functionNodeMetaParse, functionNodePinSignatureGet } from '@/components/crawlers/nodes/function/shared/index';
import type { IVariableDefinitionData } from '@/components/crawlers/nodes/variable/shared/index';
import { variableInputHandleIdGet } from '@/components/crawlers/nodes/variable/shared/index';

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
 * 状态：stateReturns。
 */
const stateReturns = ref<IFunctionNodePinDefinition[]>([]);

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
    return t('components.crawler.blueprint.nodes.common.function.return.title');
  }

  return `${name}（${t('components.crawler.blueprint.nodes.common.function.return.suffix')}）`;
});

/**
 * 计算属性：函数描述。
 */
const computedFunctionDescription = computed(() => {
  const description = computedFunctionMeta.value.functionDescription.trim();

  return description !== '' ? description : t('components.crawler.blueprint.nodes.common.function.return.description');
});

/**
 * 计算属性：节点图标。
 */
const computedIconName = computed(() => 'i-mdi-function-variant');

/**
 * 计算属性：左侧引脚。
 */
const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return stateReturns.value.map((item) => ({
    id: variableInputHandleIdGet(item.id, item.dataType),
    label: item.name.trim() !== '' ? item.name.trim() : t('components.crawler.blueprint.nodes.common.function.return.fields.returnLabel'),
    direction: 'in',
    dataType: item.dataType,
    description: t('components.crawler.blueprint.nodes.common.function.return.fields.returnDescription')
  }));
});

/**
 * 计算属性：引脚结构签名。
 */
const computedPinSignature = computed(() => functionNodePinSignatureGet(stateReturns.value));

/**
 * 计算属性：节点数据中的返回值签名。
 */
const computedNodeReturnSignature = computed(() => {
  return functionNodePinSignatureGet(computedFunctionMeta.value.functionReturns);
});

/**
 * 事件：更新返回值定义列表。
 */
const handleReturnsUpdate = (value: IVariableDefinitionData[]): void => {
  stateReturns.value = value.map((item) => ({
    id: item.id,
    name: item.name,
    dataType: item.dataType,
    defaultValue: item.defaultValue
  }));
};

watch(
  computedNodeReturnSignature,
  () => {
    if (computedNodeReturnSignature.value === computedPinSignature.value) {
      return;
    }

    stateReturns.value = computedFunctionMeta.value.functionReturns.map((item) => ({ ...item }));
  },
  { immediate: true }
);

watch(
  stateReturns,
  () => {
    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      functionName: computedFunctionMeta.value.functionName,
      functionDescription: computedFunctionMeta.value.functionDescription,
      functionReturns: stateReturns.value.map((item) => ({
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
