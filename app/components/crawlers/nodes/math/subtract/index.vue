<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-minus" :title="t('components.crawler.blueprint.nodes.math.subtract.title')" :description="t('components.crawler.blueprint.nodes.math.subtract.description')" header-bg="bg-lime-500" :left-pins="computedLeftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField v-for="(operandId, index) in stateOperandIds" :key="operandId" :label="t('components.crawler.blueprint.nodes.common.operandInputLabel', { label: labelFromIndex(index).toUpperCase() })">
        <div v-if="hasTargetPinConnection(inputHandleIdFromOperandId(operandId))" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber
          v-else
          :id="`crawlerMathSubtract-${operandId}`"
          :model-value="operandValueGet(operandId)"
          class="w-full"
          orientation="vertical"
          :step="0.1"
          :increment="{ color: 'neutral', variant: 'soft' }"
          :decrement="{ color: 'neutral', variant: 'soft' }"
          @update:model-value="(value) => handleOperandValueUpdate(operandId, Number(value ?? 0))"
        />
      </UFormField>

      <div class="flex items-center justify-end gap-2">
        <span class="text-muted text-xs">{{ t('components.crawler.blueprint.nodes.common.operandCount', { count: stateOperandIds.length }) }}</span>
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-minus" class="rounded-sm" :disabled="stateOperandIds.length <= 2" @click="handleOperandRemove" />
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" class="rounded-sm" @click="handleOperandAdd" />
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IMathSubtractNodeData {
  operandIds?: string[];
  operandValues?: Record<string, number>;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateOperandIds = ref<string[]>([]);
const stateOperandValues = ref<Record<string, number>>({});

const createOperandId = (): string => {
  return crypto.randomUUID().slice(0, 8);
};

const ensureMinOperandIds = (ids: string[]): string[] => {
  const normalizedIds = ids.filter((id) => String(id ?? '').trim() !== '').map((id) => String(id));

  if (normalizedIds.length >= 2) {
    return normalizedIds;
  }

  const nextIds = [...normalizedIds];
  while (nextIds.length < 2) {
    nextIds.push(createOperandId());
  }

  return nextIds;
};

const labelFromIndex = (index: number): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[index] ?? `v${index + 1}`;
};

const topPercentFromIndex = (index: number, total: number): number => {
  if (total <= 1) {
    return 50;
  }

  const start = 20;
  const end = 80;
  const step = (end - start) / (total - 1);
  return Math.round(start + index * step);
};

const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return stateOperandIds.value.map((operandId, index) => ({
    id: inputHandleIdFromOperandId(operandId),
    label: labelFromIndex(index).toUpperCase(),
    direction: 'in',
    dataType: 'number',
    topPercent: topPercentFromIndex(index, stateOperandIds.value.length),
    description: t('components.crawler.blueprint.nodes.math.subtract.pinDescriptions.operand', { label: labelFromIndex(index).toUpperCase() })
  }));
});

const inputHandleIdFromOperandId = (operandId: string): string => {
  return `input-${operandId}-number`;
};

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const operandValueGet = (operandId: string): number => {
  const rawValue = stateOperandValues.value[operandId];
  return Number.isFinite(Number(rawValue)) ? Number(rawValue) : 0;
};

const handleOperandValueUpdate = (operandId: string, value: number): void => {
  stateOperandValues.value = {
    ...stateOperandValues.value,
    [operandId]: Number.isFinite(Number(value)) ? Number(value) : 0
  };
};

const handleOperandAdd = (): void => {
  const nextId = createOperandId();
  stateOperandIds.value = [...stateOperandIds.value, nextId];
  stateOperandValues.value = {
    ...stateOperandValues.value,
    [nextId]: 0
  };
};

const handleOperandRemove = (): void => {
  if (stateOperandIds.value.length <= 2) {
    return;
  }

  const removedId = stateOperandIds.value[stateOperandIds.value.length - 1];
  stateOperandIds.value = stateOperandIds.value.slice(0, -1);

  const nextOperandValues = { ...stateOperandValues.value };
  delete nextOperandValues[removedId];
  stateOperandValues.value = nextOperandValues;
};

const syncOperandValuesByIds = (): void => {
  const nextOperandValues: Record<string, number> = {};

  stateOperandIds.value.forEach((operandId) => {
    nextOperandValues[operandId] = operandValueGet(operandId);
  });

  stateOperandValues.value = nextOperandValues;
};

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-number',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'number',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.math.subtract.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const rawOperandIds = (stateNode.node.data as IMathSubtractNodeData | undefined)?.operandIds;
  const rawOperandValues = (stateNode.node.data as IMathSubtractNodeData | undefined)?.operandValues;
  stateOperandIds.value = ensureMinOperandIds(Array.isArray(rawOperandIds) ? rawOperandIds : []);
  stateOperandValues.value = rawOperandValues && typeof rawOperandValues === 'object' ? { ...rawOperandValues } : {};
  syncOperandValuesByIds();
  stateInitialized.value = true;
});

watch(
  [stateOperandIds, stateOperandValues],
  () => {
    if (!stateInitialized.value) {
      return;
    }

    syncOperandValuesByIds();

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      operandIds: [...stateOperandIds.value],
      operandValues: { ...stateOperandValues.value }
    };
  },
  { deep: true }
);
</script>
