<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-hash" :title="t('components.crawler.blueprint.nodes.variable.get.title')" :description="t('components.crawler.blueprint.nodes.variable.get.description')" header-bg="bg-fuchsia-500" :right-pins="computedRightPins">
    <div class="space-y-3">
      <UEmpty v-if="computedVariableOptions.length === 0" icon="i-lucide-search-x" :title="t('components.crawler.blueprint.nodes.variable.get.empty.title')" :description="t('components.crawler.blueprint.nodes.variable.get.empty.description')" />

      <UFormField v-else :label="t('components.crawler.blueprint.nodes.variable.get.fields.variables.label')" :description="t('components.crawler.blueprint.nodes.variable.get.fields.variables.description')">
        <USelect v-model="stateSelectedVariableIds" multiple class="w-full" :items="computedVariableOptions" value-key="value" label-key="label" :placeholder="t('components.crawler.blueprint.nodes.variable.get.fields.variables.placeholder')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IVariableGetSelectOption } from '@/components/crawlers/nodes/variable/get/index.types';
import { variableCatalogCollect, variableDefinitionsParse, variableGetOutputHandleIdGet } from '@/components/crawlers/nodes/variable/shared/index';

const { t } = useI18n();

const stateNode = useNode();
const { nodes } = useVueFlow();

const stateInitialized = ref(false);
const stateSelectedVariableIds = ref<string[]>([]);

const computedVariableCatalog = computed(() => {
  return variableCatalogCollect(nodes.value);
});

const computedVariableOptions = computed<IVariableGetSelectOption[]>(() => {
  return computedVariableCatalog.value.map((item) => ({
    value: item.id,
    label: `${item.name || t('components.crawler.blueprint.nodes.variable.get.fields.variables.placeholder')} · ${t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${item.dataType}`)}`
  }));
});

const computedSelectedVariables = computed(() => {
  return stateSelectedVariableIds.value.map((variableId) => computedVariableCatalog.value.find((item) => item.id === variableId) ?? null).filter((item) => item !== null);
});

const computedRightPins = computed<IBasicSidePin[]>(() => {
  return [
    ...computedSelectedVariables.value.map((item) => ({
      id: variableGetOutputHandleIdGet(item.id, item.dataType),
      label: item.name,
      direction: 'out' as const,
      dataType: item.dataType,
      description: t('components.crawler.blueprint.nodes.variable.get.outputs.value.description', {
        type: t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${item.dataType}`)
      })
    })),
    {
      id: 'result-message',
      label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
      direction: 'out' as const,
      dataType: 'string' as const,
      description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const rawSelectedIds = (stateNode.node.data as Record<string, unknown> | undefined)?.selectedVariableIds;
  stateSelectedVariableIds.value = Array.isArray(rawSelectedIds) ? rawSelectedIds.map((item) => String(item)) : [];
  stateInitialized.value = true;
});

watch(
  computedVariableCatalog,
  () => {
    const availableIds = new Set(computedVariableCatalog.value.map((item) => item.id));
    stateSelectedVariableIds.value = stateSelectedVariableIds.value.filter((variableId) => availableIds.has(variableId));
  },
  { deep: true }
);

watch(
  stateSelectedVariableIds,
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      selectedVariableIds: [...stateSelectedVariableIds.value]
    };
  },
  { deep: true }
);
</script>
