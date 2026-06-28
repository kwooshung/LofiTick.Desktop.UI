<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-key-round" :title="t('components.crawler.blueprint.nodes.parameter.get.title')" :description="t('components.crawler.blueprint.nodes.parameter.get.description')" header-bg="bg-violet-500" :right-pins="computedRightPins">
    <div class="space-y-3">
      <UEmpty v-if="computedParameterOptions.length === 0" icon="i-lucide-search-x" :title="t('components.crawler.blueprint.nodes.parameter.get.empty.title')" :description="t('components.crawler.blueprint.nodes.parameter.get.empty.description')" />

      <UFormField v-else :label="t('components.crawler.blueprint.nodes.parameter.get.fields.parameters.label')" :description="t('components.crawler.blueprint.nodes.parameter.get.fields.parameters.description')">
        <USelect v-model="stateSelectedParameterIds" multiple class="w-full" :items="computedParameterOptions" value-key="value" label-key="label" :placeholder="t('components.crawler.blueprint.nodes.parameter.get.fields.parameters.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import { functionNodePinDefinitionsParse } from '@/components/crawlers/nodes/common/function/index';
import type { IParameterGetSelectOption } from '@/components/crawlers/nodes/parameter/get/index.types';
import { variableGetOutputHandleIdGet } from '@/components/crawlers/nodes/variable/shared/index';

const { t } = useI18n();

/**
 * Hook：当前节点。
 */
const stateNode = useNode();

/**
 * Hook：Vue Flow。
 */
const { nodes } = useVueFlow();

/**
 * 状态：是否已完成首次回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：已选择的参数 ID。
 */
const stateSelectedParameterIds = ref<string[]>([]);

/**
 * 计算属性：当前画布入口参数目录。
 */
const computedParameterCatalog = computed(() => {
  return nodes.value
    .filter((node) => String(node.type ?? '') === 'start')
    .flatMap((node) => {
      const parameters = functionNodePinDefinitionsParse((node.data as { crawlerParameters?: unknown } | undefined)?.crawlerParameters);

      return parameters.map((parameter) => ({
        ...parameter,
        nodeId: String(node.id ?? '')
      }));
    });
});

/**
 * 计算属性：参数下拉选项。
 */
const computedParameterOptions = computed<IParameterGetSelectOption[]>(() => {
  return computedParameterCatalog.value.map((item) => ({
    value: item.id,
    label: `${item.name || t('components.crawler.blueprint.nodes.parameter.get.fields.parameters.placeholder')} · ${t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${item.dataType}`)}`
  }));
});

/**
 * 计算属性：已选择参数列表。
 */
const computedSelectedParameters = computed(() => {
  return stateSelectedParameterIds.value.flatMap((parameterId) => {
    const parameter = computedParameterCatalog.value.find((item) => item.id === parameterId);
    return parameter ? [parameter] : [];
  });
});

/**
 * 计算属性：右侧输出引脚。
 */
const computedRightPins = computed<IBasicSidePin[]>(() => {
  return computedSelectedParameters.value.map((item) => ({
    id: variableGetOutputHandleIdGet(item.id, item.dataType),
    label: item.name,
    direction: 'out' as const,
    dataType: item.dataType,
    description: t('components.crawler.blueprint.nodes.parameter.get.outputs.value.description', {
      type: t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${item.dataType}`)
    })
  }));
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const rawSelectedIds = (stateNode.node.data as Record<string, unknown> | undefined)?.selectedParameterIds;
  stateSelectedParameterIds.value = Array.isArray(rawSelectedIds) ? rawSelectedIds.map((item) => String(item)) : [];
  stateInitialized.value = true;
});

watch(
  computedParameterCatalog,
  () => {
    const availableIds = new Set(computedParameterCatalog.value.map((item) => item.id));
    stateSelectedParameterIds.value = stateSelectedParameterIds.value.filter((parameterId) => availableIds.has(parameterId));
  },
  { deep: true }
);

watch(
  stateSelectedParameterIds,
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      selectedParameterIds: [...stateSelectedParameterIds.value]
    };
  },
  { deep: true }
);
</script>
