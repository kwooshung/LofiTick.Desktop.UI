<template>
  <CrawlersNodesCommonBasic
    v-bind="stateNodeAttrs"
    icon-name="i-lucide-variable"
    :title="t('components.crawler.blueprint.nodes.variable.set.title')"
    :description="t('components.crawler.blueprint.nodes.variable.set.description')"
    header-bg="bg-fuchsia-500"
    :left-pins="computedLeftPins"
    :right-pins="computedRightPins"
  >
    <div class="space-y-2">
      <template v-if="stateVariables.length > 0">
        <div v-for="(item, index) in stateVariables" :key="item.id" class="space-y-1">
          <div class="flex items-center gap-2">
            <UFieldGroup class="min-w-0 flex-1">
              <USelect :model-value="item.dataType" class="w-24 shrink-0" :items="computedDataTypeOptions" value-key="value" label-key="label" @update:model-value="(value) => handleVariableTypeUpdate(item.id, value)" />

              <UInput v-model="item.name" class="min-w-0 flex-1" :placeholder="t('components.crawler.blueprint.nodes.variable.set.fields.name.placeholder')" />

              <div v-if="hasTargetPinConnection(item)" :title="t('components.crawler.blueprint.nodes.variable.set.fields.connectedHint.label')" class="border-default text-muted flex h-8 w-24 shrink-0 items-center gap-1 overflow-hidden border-l px-2 text-[11px] whitespace-nowrap">
                <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
                <span class="truncate">{{ t('components.crawler.blueprint.nodes.variable.set.fields.connectedHint.label') }}</span>
              </div>

              <UInput
                v-else-if="item.dataType === 'string'"
                :model-value="String(item.defaultValue ?? '')"
                class="min-w-0 flex-1"
                :placeholder="t('components.crawler.blueprint.nodes.variable.set.fields.defaultValue.stringPlaceholder')"
                @update:model-value="(value) => handleVariableStringValueUpdate(item.id, value)"
              />

              <UInputNumber
                v-else-if="item.dataType === 'number'"
                :model-value="Number(item.defaultValue ?? 0)"
                class="w-28 shrink-0"
                orientation="vertical"
                :increment="{ color: 'neutral', variant: 'soft' }"
                :decrement="{ color: 'neutral', variant: 'soft' }"
                @update:model-value="(value) => handleVariableNumberValueUpdate(item.id, Number(value ?? 0))"
              />

              <UInput v-else-if="item.dataType === 'boolean'" model-value="" readonly class="w-28 shrink-0 cursor-default">
                <template #trailing>
                  <USwitch :model-value="Boolean(item.defaultValue)" :label="Boolean(item.defaultValue) ? 'true' : 'false'" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" @update:model-value="(value) => handleVariableBooleanValueUpdate(item.id, value === true)" />
                </template>
              </UInput>

              <UInput v-else-if="item.dataType === 'array' || item.dataType === 'object'" model-value="JSON" readonly class="w-24 shrink-0 cursor-default text-xs">
                <template #trailing>
                  <UIcon name="i-lucide-chevron-down" class="text-muted size-3" />
                </template>
              </UInput>
            </UFieldGroup>

            <UButton color="error" variant="soft" icon="i-lucide-trash-2" size="xs" class="shrink-0" :disabled="stateVariables.length <= 1" @click="handleVariableRemove(index)" />
          </div>

          <UTextarea
            v-if="(item.dataType === 'array' || item.dataType === 'object') && !hasTargetPinConnection(item)"
            :model-value="item.jsonText"
            :rows="4"
            autoresize
            class="w-full"
            :placeholder="t('components.crawler.blueprint.nodes.variable.set.fields.defaultValue.jsonPlaceholder')"
            @update:model-value="(value) => handleVariableJsonValueUpdate(item.id, value)"
          />

          <p v-if="variableNameErrorGet(item)" class="text-error-500 text-xs">
            {{ variableNameErrorGet(item) }}
          </p>
          <p v-else-if="variableDefaultValueErrorGet(item)" class="text-error-500 text-xs">
            {{ variableDefaultValueErrorGet(item) }}
          </p>
        </div>
      </template>

      <UEmpty v-else icon="i-lucide-variable" :title="t('components.crawler.blueprint.nodes.variable.set.empty.title')" :description="t('components.crawler.blueprint.nodes.variable.set.empty.description')">
        <template #actions>
          <UButton color="primary" variant="soft" icon="i-lucide-plus" @click="handleVariableAdd">
            {{ t('components.crawler.blueprint.nodes.variable.set.empty.action') }}
          </UButton>
        </template>
      </UEmpty>

      <div v-if="stateVariables.length > 0" class="flex flex-wrap items-center gap-2">
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" :label="t('components.crawler.blueprint.nodes.variable.set.actions.add')" @click="handleVariableAdd" />
      </div>
    </div>
  </CrawlersNodesCommonBasic>

  <UModal v-model:open="stateTypeChangeModalOpen" :title="t('components.crawler.blueprint.nodes.variable.set.dialogs.changeType.title')" :dismissible="false" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-muted text-sm leading-6">
        {{ computedTypeChangeDialogDescription }}
      </p>
    </template>

    <template #footer>
      <UButton color="neutral" variant="ghost" @click="handleTypeChangeCancel">
        {{ t('components.crawler.blueprint.nodes.variable.set.dialogs.changeType.cancel') }}
      </UButton>
      <UButton color="error" variant="solid" @click="handleTypeChangeConfirm">
        {{ t('components.crawler.blueprint.nodes.variable.set.dialogs.changeType.confirm') }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IVariableSetEditorItem, IVariableSetTypeChangePendingState } from '@/components/crawlers/nodes/variable/set/index.types';
import type { IVariableDefinitionData, TVariableValueDataType } from '@/components/crawlers/nodes/variable/shared/index';
import {
  variableCatalogCollect,
  variableDefaultValueCreate,
  variableDefinitionIdCreate,
  variableDefinitionNameNormalize,
  variableDefinitionsParse,
  variableInputHandleIdGet,
  variableJsonTextGet,
  variableJsonTextParse,
  variableOutputHandleIdGet,
  variableTypeChangeAffectedEdgeIdsCollect,
  variableValueDataTypesGet
} from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 配置：关闭 fragment 下的自动 attrs 继承，改为手动透传。
 */
defineOptions({
  inheritAttrs: false
});

/**
 * 属性：Vue Flow 注入的节点上下文 attrs。
 */
const stateNodeAttrs = useAttrs();

/**
 * 事件：声明 Vue Flow 注入的节点内部刷新事件。
 */
const emit = defineEmits<{
  updateNodeInternals: [];
}>();

const { t } = useI18n();

const stateNode = useNode();
const stateNodeId = useNodeId();
const { nodes, edges } = useVueFlow();

const stateInitialized = ref(false);
const stateVariables = ref<IVariableSetEditorItem[]>([]);
const stateTypeChangeModalOpen = ref(false);
const statePendingTypeChange = ref<IVariableSetTypeChangePendingState | null>(null);

const computedDataTypeOptions = computed(() => {
  return variableValueDataTypesGet().map((dataType) => ({
    value: dataType,
    label: t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${dataType}`)
  }));
});

const computedVariableCatalog = computed(() => variableCatalogCollect(nodes.value));

const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return stateVariables.value.map((item) => ({
    id: variableInputHandleIdGet(item.id, item.dataType),
    label: variableDefinitionNameNormalize(item.name) || t('components.crawler.blueprint.nodes.variable.set.fields.name.placeholder'),
    direction: 'in',
    dataType: item.dataType,
    description: t('components.crawler.blueprint.nodes.variable.set.inputs.value.description')
  }));
});

const computedRightPins = computed<IBasicSidePin[]>(() => {
  return [
    ...stateVariables.value.map((item) => ({
      id: variableOutputHandleIdGet(item.id, item.dataType),
      label: variableDefinitionNameNormalize(item.name) || t('components.crawler.blueprint.nodes.variable.set.outputs.value.label'),
      direction: 'out' as const,
      dataType: item.dataType,
      description: t('components.crawler.blueprint.nodes.variable.set.outputs.value.description')
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

/**
 * 计算属性：当前引脚结构签名。
 */
const computedPinSignature = computed(() => {
  const leftSignature = computedLeftPins.value.map((pin) => `${pin.id}:${pin.dataType}`).join('|');
  const rightSignature = computedRightPins.value.map((pin) => `${pin.id}:${pin.dataType}`).join('|');

  return `${leftSignature}#${rightSignature}`;
});

const computedTypeChangeDialogDescription = computed(() => {
  const pendingState = statePendingTypeChange.value;

  if (!pendingState) {
    return '';
  }

  const currentItem = stateVariables.value.find((item) => item.id === pendingState.variableId);
  const variableName = variableDefinitionNameNormalize(currentItem?.name ?? '') || t('components.crawler.blueprint.nodes.variable.set.outputs.value.label');

  return t('components.crawler.blueprint.nodes.variable.set.dialogs.changeType.description', {
    name: variableName,
    count: pendingState.affectedEdgeIds.length
  });
});

const createEditorItem = (variableDefinition?: Partial<IVariableDefinitionData>): IVariableSetEditorItem => {
  const dataType = variableDefinition?.dataType ?? 'string';
  const defaultValue = variableDefinition?.defaultValue ?? variableDefaultValueCreate(dataType);

  return {
    id: String(variableDefinition?.id ?? variableDefinitionIdCreate()),
    name: String(variableDefinition?.name ?? ''),
    dataType,
    defaultValue,
    jsonText: variableJsonTextGet(dataType, defaultValue)
  };
};

const hasTargetPinConnection = (item: IVariableSetEditorItem): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  const handleId = variableInputHandleIdGet(item.id, item.dataType);

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const variableNameErrorGet = (item: IVariableSetEditorItem): string => {
  const normalizedName = variableDefinitionNameNormalize(item.name);

  if (normalizedName === '') {
    return t('components.crawler.blueprint.nodes.variable.set.validations.nameRequired');
  }

  const duplicateCount = computedVariableCatalog.value.filter((catalogItem) => catalogItem.id !== item.id && variableDefinitionNameNormalize(catalogItem.name) === normalizedName).length;

  if (duplicateCount > 0) {
    return t('components.crawler.blueprint.nodes.variable.set.validations.nameDuplicate');
  }

  return '';
};

const variableDefaultValueErrorGet = (item: IVariableSetEditorItem): string => {
  if (hasTargetPinConnection(item)) {
    return '';
  }

  if (item.dataType === 'array' && variableJsonTextParse('array', item.jsonText) === null) {
    return t('components.crawler.blueprint.nodes.variable.set.validations.arrayInvalid');
  }

  if (item.dataType === 'object' && variableJsonTextParse('object', item.jsonText) === null) {
    return t('components.crawler.blueprint.nodes.variable.set.validations.objectInvalid');
  }

  return '';
};

const handleVariableAdd = (): void => {
  stateVariables.value.push(createEditorItem());
};

const handleVariableRemove = (index: number): void => {
  stateVariables.value.splice(index, 1);
};

const handleVariableStringValueUpdate = (variableId: string, value: string | number): void => {
  const targetItem = stateVariables.value.find((item) => item.id === variableId);

  if (!targetItem) {
    return;
  }

  targetItem.defaultValue = String(value ?? '');
};

const handleVariableNumberValueUpdate = (variableId: string, value: number): void => {
  const targetItem = stateVariables.value.find((item) => item.id === variableId);

  if (!targetItem) {
    return;
  }

  targetItem.defaultValue = Number.isFinite(Number(value)) ? Number(value) : 0;
};

const handleVariableBooleanValueUpdate = (variableId: string, value: boolean): void => {
  const targetItem = stateVariables.value.find((item) => item.id === variableId);

  if (!targetItem) {
    return;
  }

  targetItem.defaultValue = Boolean(value);
};

const handleVariableJsonValueUpdate = (variableId: string, value: string | number): void => {
  const targetItem = stateVariables.value.find((item) => item.id === variableId);

  if (!targetItem) {
    return;
  }

  targetItem.jsonText = String(value ?? '');

  const parsedValue = variableJsonTextParse(targetItem.dataType, targetItem.jsonText);

  if (parsedValue !== null) {
    targetItem.defaultValue = parsedValue;
  }
};

const applyVariableTypeChange = (variableId: string, nextType: TVariableValueDataType): void => {
  const targetItem = stateVariables.value.find((item) => item.id === variableId);

  if (!targetItem) {
    return;
  }

  targetItem.dataType = nextType;
  targetItem.defaultValue = variableDefaultValueCreate(nextType);
  targetItem.jsonText = variableJsonTextGet(nextType, targetItem.defaultValue);
};

const handleVariableTypeUpdate = (variableId: string, nextValue: string | number): void => {
  const nextType = String(nextValue ?? '') as TVariableValueDataType;
  const targetItem = stateVariables.value.find((item) => item.id === variableId);

  if (!targetItem || !variableValueDataTypesGet().includes(nextType) || nextType === targetItem.dataType) {
    return;
  }

  const nodeId = String(stateNodeId ?? '').trim();
  const affectedEdgeIds = variableTypeChangeAffectedEdgeIdsCollect(nodes.value, edges.value, nodeId, variableId, targetItem.dataType);

  if (affectedEdgeIds.length === 0) {
    applyVariableTypeChange(variableId, nextType);

    return;
  }

  statePendingTypeChange.value = {
    variableId,
    previousType: targetItem.dataType,
    nextType,
    affectedEdgeIds
  };
  stateTypeChangeModalOpen.value = true;
};

const handleTypeChangeCancel = (): void => {
  statePendingTypeChange.value = null;
  stateTypeChangeModalOpen.value = false;
};

const handleTypeChangeConfirm = (): void => {
  const pendingState = statePendingTypeChange.value;

  if (!pendingState) {
    return;
  }

  edges.value = edges.value.filter((edge) => !pendingState.affectedEdgeIds.includes(String(edge.id ?? '')));
  applyVariableTypeChange(pendingState.variableId, pendingState.nextType);
  statePendingTypeChange.value = null;
  stateTypeChangeModalOpen.value = false;
};

const serializeVariables = (): IVariableDefinitionData[] => {
  return stateVariables.value.map((item) => ({
    id: item.id,
    name: item.name,
    dataType: item.dataType,
    defaultValue: item.defaultValue
  }));
};

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const variables = variableDefinitionsParse((stateNode.node.data as Record<string, unknown> | undefined)?.variables);
  stateVariables.value = variables.length > 0 ? variables.map((item) => createEditorItem(item)) : [createEditorItem()];
  stateInitialized.value = true;
});

watch(
  stateVariables,
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      variables: serializeVariables()
    };
  },
  { deep: true }
);

/**
 * 监听：引脚结构变化时通知 Vue Flow 更新节点内部布局。
 */
watch(
  computedPinSignature,
  async () => {
    await nextTick();
    emit('updateNodeInternals');
  },
  { immediate: true }
);
</script>
