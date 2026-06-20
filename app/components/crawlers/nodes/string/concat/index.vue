<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-link" :title="t('components.crawler.blueprint.nodes.string.concat.title')" :description="t('components.crawler.blueprint.nodes.string.concat.description')" header-color="" header-bg="bg-teal-500" :left-pins="computedLeftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField v-for="(segmentId, index) in stateSegmentIds" :key="segmentId" :label="t('components.crawler.blueprint.nodes.string.concat.fields.segment.label', { label: labelFromIndex(index).toUpperCase() })">
        <div v-if="hasTargetPinConnection(inputHandleIdFromSegmentId(segmentId))" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.string.common.connectedInputHint') }}</span>
        </div>

        <UTextarea
          v-else
          :id="`crawlerStringConcat-${segmentId}`"
          :model-value="segmentValueGet(segmentId)"
          class="w-full"
          :rows="2"
          autoresize
          :placeholder="t('components.crawler.blueprint.nodes.string.concat.fields.segment.placeholder', { label: labelFromIndex(index).toUpperCase() })"
          @update:model-value="(value) => handleSegmentValueUpdate(segmentId, String(value ?? ''))"
        />
      </UFormField>

      <div class="flex items-center justify-end gap-2">
        <span class="text-muted text-xs">{{ t('components.crawler.blueprint.nodes.string.concat.fields.segment.count', { count: stateSegmentIds.length }) }}</span>
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-minus" class="rounded-sm" :disabled="stateSegmentIds.length <= 2" @click="handleSegmentRemove" />
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" class="rounded-sm" @click="handleSegmentAdd" />
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IStringConcatNodeData } from '@/components/crawlers/nodes/string/concat/index.types';

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
 * 状态：stateSegmentIds。
 */
const stateSegmentIds = ref<string[]>([]);
/**
 * 状态：stateSegmentValues。
 */
const stateSegmentValues = ref<Record<string, string>>({});

/**
 * 函数：createSegmentId。
 */
const createSegmentId = (): string => crypto.randomUUID().slice(0, 8);
/**
 * 常量：ensureMinSegmentIds。
 */
const ensureMinSegmentIds = (ids: string[]): string[] => {
  /**
   * 函数：normalized。
   */
  const normalized = ids.filter((id) => String(id ?? '').trim() !== '').map((id) => String(id));
  if (normalized.length >= 2) {
    return normalized;
  }
  /**
   * 常量：nextIds。
   */
  const nextIds = [...normalized];
  while (nextIds.length < 2) {
    nextIds.push(createSegmentId());
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
  const start = 20,
    end = 80,
    step = (end - start) / (total - 1);
  return Math.round(start + index * step);
};

/**
 * 计算属性：computedLeftPins。
 */
const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return stateSegmentIds.value.map((segmentId, index) => ({
    id: inputHandleIdFromSegmentId(segmentId),
    label: labelFromIndex(index),
    direction: 'in',
    dataType: 'string',
    topPercent: topPercentFromIndex(index, stateSegmentIds.value.length),
    description: t('components.crawler.blueprint.nodes.string.concat.pinDescriptions.segment', { label: labelFromIndex(index).toUpperCase() })
  }));
});

/**
 * 常量：inputHandleIdFromSegmentId。
 */
const inputHandleIdFromSegmentId = (segmentId: string): string => `input-${segmentId}-string`;
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
 * 常量：segmentValueGet。
 */
const segmentValueGet = (segmentId: string): string => stateSegmentValues.value[segmentId] ?? '';
/**
 * 事件：handleSegmentValueUpdate。
 */
const handleSegmentValueUpdate = (segmentId: string, value: string): void => {
  stateSegmentValues.value = { ...stateSegmentValues.value, [segmentId]: value };
};

/**
 * 事件：handleSegmentAdd。
 */
const handleSegmentAdd = (): void => {
  /**
   * 常量：nextId。
   */
  const nextId = createSegmentId();
  stateSegmentIds.value = [...stateSegmentIds.value, nextId];
  stateSegmentValues.value = { ...stateSegmentValues.value, [nextId]: '' };
};

/**
 * 事件：handleSegmentRemove。
 */
const handleSegmentRemove = (): void => {
  if (stateSegmentIds.value.length <= 2) {
    return;
  }
  /**
   * 函数：removedId。
   */
  const removedId = stateSegmentIds.value[stateSegmentIds.value.length - 1];
  stateSegmentIds.value = stateSegmentIds.value.slice(0, -1);
  /**
   * 常量：nextValues。
   */
  const nextValues = { ...stateSegmentValues.value };
  delete nextValues[removedId];
  stateSegmentValues.value = nextValues;
};

/**
 * 函数：syncSegmentValuesByIds。
 */
const syncSegmentValuesByIds = (): void => {
  const nextValues: Record<string, string> = {};
  stateSegmentIds.value.forEach((segmentId) => {
    nextValues[segmentId] = segmentValueGet(segmentId);
  });
  stateSegmentValues.value = nextValues;
};

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.string.concat.pinDescriptions.result')
  },
  { id: 'result-message', label: t('components.crawler.blueprint.nodes.common.pinLabels.message'), direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }
  /**
   * 常量：rawSegmentIds。
   */
  const rawSegmentIds = (stateNode.node.data as IStringConcatNodeData | undefined)?.segmentIds;
  /**
   * 常量：rawSegmentValues。
   */
  const rawSegmentValues = (stateNode.node.data as IStringConcatNodeData | undefined)?.segmentValues;
  stateSegmentIds.value = ensureMinSegmentIds(Array.isArray(rawSegmentIds) ? rawSegmentIds : []);
  stateSegmentValues.value = rawSegmentValues && typeof rawSegmentValues === 'object' ? { ...rawSegmentValues } : {};
  syncSegmentValuesByIds();
  stateInitialized.value = true;
});

watch(
  [stateSegmentIds, stateSegmentValues],
  () => {
    if (!stateInitialized.value) {
      return;
    }
    syncSegmentValuesByIds();
    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      segmentIds: [...stateSegmentIds.value],
      segmentValues: { ...stateSegmentValues.value }
    };
  },
  { deep: true }
);
</script>
