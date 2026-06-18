<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-equal" :title="t('components.crawler.blueprint.nodes.logic.equal.title')" :description="t('components.crawler.blueprint.nodes.logic.equal.description')" header-bg="bg-rose-500" :left-pins="computedLeftPins" :right-pins="rightPins">
    <div class="flex items-center justify-end gap-2">
      <span class="text-muted text-xs">{{ t('components.crawler.blueprint.nodes.common.operandCount', { count: stateOperandIds.length }) }}</span>
      <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-minus" :disabled="stateOperandIds.length <= 2" @click="handleOperandRemove" />
      <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" @click="handleOperandAdd" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ILogicEqualNodeData } from '@/components/crawlers/nodes/logic/equal/index.types';

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();
/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);
const stateOperandIds = ref<string[]>([]);

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
    id: `input-${operandId}-any`,
    label: labelFromIndex(index),
    direction: 'in',
    dataType: 'any',
    topPercent: topPercentFromIndex(index, stateOperandIds.value.length),
    description: t('components.crawler.blueprint.nodes.logic.equal.pinDescriptions.operand', { label: labelFromIndex(index).toUpperCase() })
  }));
});

const handleOperandAdd = (): void => {
  stateOperandIds.value = [...stateOperandIds.value, createOperandId()];
};

const handleOperandRemove = (): void => {
  if (stateOperandIds.value.length <= 2) {
    return;
  }

  stateOperandIds.value = stateOperandIds.value.slice(0, -1);
};

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.logic.equal.pinDescriptions.result')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const rawOperandIds = (stateNode.node.data as ILogicEqualNodeData | undefined)?.compareOperandIds;
  stateOperandIds.value = ensureMinOperandIds(Array.isArray(rawOperandIds) ? rawOperandIds : []);
  stateInitialized.value = true;
});

watch(
  stateOperandIds,
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      compareOperandIds: [...stateOperandIds.value]
    };
  },
  { deep: true }
);
</script>
