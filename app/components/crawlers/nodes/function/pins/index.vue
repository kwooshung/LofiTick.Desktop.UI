<template>
  <div class="space-y-2">
    <template v-if="statePins.length > 0">
      <div v-for="item in statePins" :key="item.id" class="space-y-1">
        <div class="flex items-center gap-2">
          <UFieldGroup class="min-w-0 flex-1">
            <USelect :model-value="item.dataType" class="w-24 shrink-0" :items="computedDataTypeOptions" value-key="value" label-key="label" @update:model-value="(value) => handleTypeUpdate(item.id, value)" />

            <UInput v-model="item.name" class="min-w-0 flex-1" :placeholder="namePlaceholder" />

            <div v-if="hasConnectedPin(item)" :title="connectedHint" class="border-default text-muted flex h-8 min-w-0 flex-1 items-center gap-1 overflow-hidden border-l px-2 text-[11px] whitespace-nowrap">
              <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
              <span class="truncate">{{ connectedHint }}</span>
            </div>

            <UInput v-else-if="item.dataType === 'string'" :model-value="String(item.defaultValue ?? '')" class="min-w-0 flex-1" :placeholder="stringPlaceholder" @update:model-value="(value) => handleStringValueUpdate(item.id, value)" />

            <UInputNumber
              v-else-if="item.dataType === 'number'"
              :model-value="Number(item.defaultValue ?? 0)"
              class="w-28 shrink-0"
              orientation="vertical"
              :increment="{ color: 'neutral', variant: 'soft' }"
              :decrement="{ color: 'neutral', variant: 'soft' }"
              @update:model-value="(value) => handleNumberValueUpdate(item.id, Number(value ?? 0))"
            />

            <UInput v-else-if="item.dataType === 'boolean'" model-value="" readonly class="w-28 shrink-0 cursor-default">
              <template #trailing>
                <USwitch :model-value="Boolean(item.defaultValue)" :label="Boolean(item.defaultValue) ? 'true' : 'false'" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" @update:model-value="(value) => handleBooleanValueUpdate(item.id, value === true)" />
              </template>
            </UInput>

            <UInput v-else-if="item.dataType === 'array' || item.dataType === 'object'" model-value="JSON" readonly class="w-24 shrink-0 cursor-default text-xs">
              <template #trailing>
                <UIcon name="i-lucide-chevron-down" class="text-muted size-3" />
              </template>
            </UInput>
          </UFieldGroup>

          <UButton color="error" variant="soft" icon="i-lucide-trash-2" size="xs" class="shrink-0" :disabled="statePins.length <= 1" @click="handleRemove(item.id)" />
        </div>

        <UTextarea v-if="(item.dataType === 'array' || item.dataType === 'object') && !hasConnectedPin(item)" :model-value="item.jsonText" :rows="4" autoresize class="w-full" :placeholder="jsonPlaceholder" @update:model-value="(value) => handleJsonValueUpdate(item.id, value)" />
      </div>
    </template>

    <UEmpty v-else icon="i-lucide-variable" :title="emptyTitle" :description="emptyDescription">
      <template #actions>
        <UButton color="primary" variant="soft" icon="i-lucide-plus" @click="handleAdd">
          {{ emptyActionLabel }}
        </UButton>
      </template>
    </UEmpty>

    <div v-if="statePins.length > 0" class="flex flex-wrap items-center gap-2">
      <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" :label="addActionLabel" @click="handleAdd" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core';

import type { ICrawlersNodesFunctionPinsEditorItem, ICrawlersNodesFunctionPinsProps } from '@/components/crawlers/nodes/function/pins/index.types';
import { functionNodePinSignatureGet } from '@/components/crawlers/nodes/common/function/index';
import type { IVariableDefinitionData, TVariableValueDataType } from '@/components/crawlers/nodes/variable/shared/index';
import { variableDefaultValueCreate, variableDefinitionIdCreate, variableDefinitionNameNormalize, variableInputHandleIdGet, variableJsonTextGet, variableJsonTextParse, variableOutputHandleIdGet, variableValueDataTypesGet } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * Props：组件入参。
 */
const { modelValue, nodeId, direction, emptyTitle, emptyDescription, emptyActionLabel, addActionLabel, namePlaceholder, stringPlaceholder, jsonPlaceholder, connectedHint } = defineProps<ICrawlersNodesFunctionPinsProps>();

/**
 * 事件：函数节点引脚编辑器。
 */
const emit = defineEmits<{
  'update:modelValue': [value: IVariableDefinitionData[]];
  updateNodeInternals: [];
}>();

/**
 * 状态：statePins。
 */
const statePins = ref<ICrawlersNodesFunctionPinsEditorItem[]>([]);

/**
 * Hook：画布状态。
 */
const { edges } = useVueFlow();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 计算属性：数据类型选项。
 */
const computedDataTypeOptions = computed(() => {
  return variableValueDataTypesGet().map((dataType) => ({
    value: dataType,
    label: t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${dataType}`)
  }));
});

/**
 * 函数：创建编辑项。
 */
const createEditorItem = (pinDefinition?: Partial<IVariableDefinitionData>): ICrawlersNodesFunctionPinsEditorItem => {
  const dataType = variableValueDataTypesGet().includes(String(pinDefinition?.dataType ?? '') as TVariableValueDataType) ? (String(pinDefinition?.dataType ?? '') as TVariableValueDataType) : 'string';
  const defaultValue = pinDefinition?.defaultValue ?? variableDefaultValueCreate(dataType);

  return {
    id: String(pinDefinition?.id ?? variableDefinitionIdCreate()),
    name: variableDefinitionNameNormalize(String(pinDefinition?.name ?? '')),
    dataType,
    defaultValue,
    jsonText: variableJsonTextGet(dataType, defaultValue)
  };
};

/**
 * 函数：序列化引脚定义。
 */
const serializePins = (items: ICrawlersNodesFunctionPinsEditorItem[]): IVariableDefinitionData[] => {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    dataType: item.dataType,
    defaultValue: item.defaultValue
  }));
};

/**
 * 函数：立即同步当前引脚到父层。
 *
 * 说明：避免“新增后立刻保存”时仅依赖 watch 调度导致父层拿到旧值。
 */
const emitPinsNow = (): void => {
  emit('update:modelValue', serializePins(statePins.value));
};

/**
 * 函数：判断引脚是否已连接。
 */
const hasConnectedPin = (item: ICrawlersNodesFunctionPinsEditorItem): boolean => {
  const currentNodeId = String(nodeId ?? '').trim();
  const handleId = direction === 'output' ? variableOutputHandleIdGet(item.id, item.dataType) : variableInputHandleIdGet(item.id, item.dataType);

  if (currentNodeId === '') {
    return false;
  }

  if (direction === 'output') {
    return edges.value.some((edge) => edge.source === currentNodeId && edge.sourceHandle === handleId);
  }

  return edges.value.some((edge) => edge.target === currentNodeId && edge.targetHandle === handleId);
};

/**
 * 事件：新增引脚。
 */
const handleAdd = (): void => {
  statePins.value.push(createEditorItem());
  emitPinsNow();
};

/**
 * 事件：移除引脚。
 */
const handleRemove = (pinId: string): void => {
  statePins.value = statePins.value.filter((item) => item.id !== pinId);
  emitPinsNow();
};

/**
 * 事件：更新字符串默认值。
 */
const handleStringValueUpdate = (pinId: string, value: string | number): void => {
  const targetItem = statePins.value.find((item) => item.id === pinId);

  if (!targetItem) {
    return;
  }

  targetItem.defaultValue = String(value ?? '');
  emitPinsNow();
};

/**
 * 事件：更新数字默认值。
 */
const handleNumberValueUpdate = (pinId: string, value: number): void => {
  const targetItem = statePins.value.find((item) => item.id === pinId);

  if (!targetItem) {
    return;
  }

  targetItem.defaultValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  emitPinsNow();
};

/**
 * 事件：更新布尔默认值。
 */
const handleBooleanValueUpdate = (pinId: string, value: boolean): void => {
  const targetItem = statePins.value.find((item) => item.id === pinId);

  if (!targetItem) {
    return;
  }

  targetItem.defaultValue = Boolean(value);
  emitPinsNow();
};

/**
 * 事件：更新 JSON 默认值。
 */
const handleJsonValueUpdate = (pinId: string, value: string | number): void => {
  const targetItem = statePins.value.find((item) => item.id === pinId);

  if (!targetItem) {
    return;
  }

  targetItem.jsonText = String(value ?? '');

  const parsedValue = variableJsonTextParse(targetItem.dataType, targetItem.jsonText);

  if (parsedValue !== null) {
    targetItem.defaultValue = parsedValue;
    emitPinsNow();
  }
};

/**
 * 事件：更新数据类型。
 */
const handleTypeUpdate = (pinId: string, value: string | number): void => {
  const nextType = String(value ?? '') as TVariableValueDataType;
  const targetItem = statePins.value.find((item) => item.id === pinId);

  if (!targetItem || !variableValueDataTypesGet().includes(nextType) || nextType === targetItem.dataType) {
    return;
  }

  targetItem.dataType = nextType;
  targetItem.defaultValue = variableDefaultValueCreate(nextType);
  targetItem.jsonText = variableJsonTextGet(nextType, targetItem.defaultValue);
  emitPinsNow();
};

/**
 * 计算属性：本地引脚结构签名。
 */
const computedLocalSignature = computed(() => functionNodePinSignatureGet(serializePins(statePins.value)));

/**
 * 计算属性：外部引脚结构签名。
 */
const computedModelSignature = computed(() => functionNodePinSignatureGet((Array.isArray(modelValue) ? modelValue : []).map((item) => createEditorItem(item))));

watch(
  computedModelSignature,
  () => {
    if (computedModelSignature.value === computedLocalSignature.value) {
      return;
    }

    statePins.value = (Array.isArray(modelValue) ? modelValue : []).map((item) => createEditorItem(item));
  },
  { immediate: true }
);

watch(
  statePins,
  () => {
    const nextPins = serializePins(statePins.value);

    if (functionNodePinSignatureGet(nextPins) === computedModelSignature.value) {
      return;
    }

    emit('update:modelValue', nextPins);
  },
  { deep: true }
);

watch(
  computedLocalSignature,
  async () => {
    await nextTick();
    emit('updateNodeInternals');
  },
  { immediate: true }
);
</script>
