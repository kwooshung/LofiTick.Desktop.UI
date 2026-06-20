<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-x" :title="t('components.crawler.blueprint.nodes.math.multiply.title')" :description="t('components.crawler.blueprint.nodes.math.multiply.description')" header-color="" header-bg="bg-lime-500" :left-pins="computedLeftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField v-for="(operandId, index) in stateOperandIds" :key="operandId" :label="t('components.crawler.blueprint.nodes.common.operandInputLabel', { label: labelFromIndex(index).toUpperCase() })">
        <div v-if="hasTargetPinConnection(inputHandleIdFromOperandId(operandId))" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UInputNumber
          v-else
          :id="`crawlerMathMultiply-${operandId}`"
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
import type { IMathMultiplyNodeData } from '@/components/crawlers/nodes/math/multiply/index.types';

const { t } = useI18n();
/**
 * 状态：stateNode。
 */
const stateNode = useNode();
/**
 * 状态：stateNodeId。
 */
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
/**
 * 状态：stateInitialized。
 */
const stateInitialized = ref(false);
/**
 * 状态：stateOperandIds。
 */
const stateOperandIds = ref<string[]>([]);
/**
 * 状态：stateOperandValues。
 */
const stateOperandValues = ref<Record<string, number>>({});

/**
 * 函数：createOperandId。
 */
const createOperandId = (): string => {
  return crypto.randomUUID().slice(0, 8);
};

/**
 * 常量：ensureMinOperandIds。
 */
const ensureMinOperandIds = (ids: string[]): string[] => {
  /**
   * 函数：normalizedIds。
   */
  const normalizedIds = ids.filter((id) => String(id ?? '').trim() !== '').map((id) => String(id));

  if (normalizedIds.length >= 2) {
    return normalizedIds;
  }

  /**
   * 常量：nextIds。
   */
  const nextIds = [...normalizedIds];
  while (nextIds.length < 2) {
    nextIds.push(createOperandId());
  }

  return nextIds;
};

/**
 * 常量：labelFromIndex。
 */
const labelFromIndex = (index: number): string => {
  /**
   * 常量：alphabet。
   */
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[index] ?? `v${index + 1}`;
};

/**
 * 函数：topPercentFromIndex。
 */
const topPercentFromIndex = (index: number, total: number): number => {
  if (total <= 1) {
    return 50;
  }

  /**
   * 常量：start。
   */
  const start = 20;
  /**
   * 常量：end。
   */
  const end = 80;
  /**
   * 常量：step。
   */
  const step = (end - start) / (total - 1);
  return Math.round(start + index * step);
};

/**
 * 计算属性：computedLeftPins。
 */
const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return stateOperandIds.value.map((operandId, index) => ({
    id: inputHandleIdFromOperandId(operandId),
    label: labelFromIndex(index).toUpperCase(),
    direction: 'in',
    dataType: 'number',
    topPercent: topPercentFromIndex(index, stateOperandIds.value.length),
    description: t('components.crawler.blueprint.nodes.math.multiply.pinDescriptions.operand', { label: labelFromIndex(index).toUpperCase() })
  }));
});

/**
 * 常量：inputHandleIdFromOperandId。
 */
const inputHandleIdFromOperandId = (operandId: string): string => {
  return `input-${operandId}-number`;
};

/**
 * 函数：hasTargetPinConnection。
 */
const hasTargetPinConnection = (handleId: string): boolean => {
  /**
   * 常量：nodeId。
   */
  const nodeId = String(stateNodeId ?? '').trim();

  if (nodeId === '') {
    return false;
  }

  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

/**
 * 常量：operandValueGet。
 */
const operandValueGet = (operandId: string): number => {
  /**
   * 常量：rawValue。
   */
  const rawValue = stateOperandValues.value[operandId];
  return Number.isFinite(Number(rawValue)) ? Number(rawValue) : 0;
};

/**
 * 事件：handleOperandValueUpdate。
 */
const handleOperandValueUpdate = (operandId: string, value: number): void => {
  stateOperandValues.value = {
    ...stateOperandValues.value,
    [operandId]: Number.isFinite(Number(value)) ? Number(value) : 0
  };
};

/**
 * 事件：handleOperandAdd。
 */
const handleOperandAdd = (): void => {
  /**
   * 常量：nextId。
   */
  const nextId = createOperandId();
  stateOperandIds.value = [...stateOperandIds.value, nextId];
  stateOperandValues.value = {
    ...stateOperandValues.value,
    [nextId]: 0
  };
};

/**
 * 事件：handleOperandRemove。
 */
const handleOperandRemove = (): void => {
  if (stateOperandIds.value.length <= 2) {
    return;
  }

  /**
   * 函数：removedId。
   */
  const removedId = stateOperandIds.value[stateOperandIds.value.length - 1];
  stateOperandIds.value = stateOperandIds.value.slice(0, -1);

  /**
   * 常量：nextOperandValues。
   */
  const nextOperandValues = { ...stateOperandValues.value };
  delete nextOperandValues[removedId];
  stateOperandValues.value = nextOperandValues;
};

/**
 * 函数：syncOperandValuesByIds。
 */
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
    description: t('components.crawler.blueprint.nodes.math.multiply.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：rawOperandIds。
   */
  const rawOperandIds = (stateNode.node.data as IMathMultiplyNodeData | undefined)?.operandIds;
  /**
   * 常量：rawOperandValues。
   */
  const rawOperandValues = (stateNode.node.data as IMathMultiplyNodeData | undefined)?.operandValues;
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
