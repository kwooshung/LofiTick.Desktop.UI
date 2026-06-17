<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-link" :title="t('components.crawler.blueprint.nodes.string.concat.title')" :description="t('components.crawler.blueprint.nodes.string.concat.description')" header-color="" header-bg="bg-teal-500" :left-pins="computedLeftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField v-for="(segmentId, index) in stateSegmentIds" :key="segmentId" :label="`文本 ${labelFromIndex(index).toUpperCase()}`">
        <div v-if="hasTargetPinConnection(inputHandleIdFromSegmentId(segmentId))" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UTextarea v-else :id="`crawlerStringConcat-${segmentId}`" :model-value="segmentValueGet(segmentId)" class="w-full" :rows="2" autoresize :placeholder="`文本段 ${labelFromIndex(index).toUpperCase()}`" @update:model-value="(value) => handleSegmentValueUpdate(segmentId, String(value ?? ''))" />
      </UFormField>

      <div class="flex items-center justify-end gap-2">
        <span class="text-muted text-xs">{{ stateSegmentIds.length }}段</span>
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-minus" class="rounded-sm" :disabled="stateSegmentIds.length <= 2" @click="handleSegmentRemove" />
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" class="rounded-sm" @click="handleSegmentAdd" />
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IStringConcatNodeData {
  segmentIds?: string[];
  segmentValues?: Record<string, string>;
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateSegmentIds = ref<string[]>([]);
const stateSegmentValues = ref<Record<string, string>>({});

const createSegmentId = (): string => crypto.randomUUID().slice(0, 8);
const ensureMinSegmentIds = (ids: string[]): string[] => {
  const normalized = ids.filter((id) => String(id ?? '').trim() !== '').map((id) => String(id));
  if (normalized.length >= 2) return normalized;
  const nextIds = [...normalized];
  while (nextIds.length < 2) nextIds.push(createSegmentId());
  return nextIds;
};

const labelFromIndex = (index: number): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[index] ?? `v${index + 1}`;
};

const topPercentFromIndex = (index: number, total: number): number => {
  if (total <= 1) return 50;
  const start = 20,
    end = 80,
    step = (end - start) / (total - 1);
  return Math.round(start + index * step);
};

const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return stateSegmentIds.value.map((segmentId, index) => ({
    id: inputHandleIdFromSegmentId(segmentId),
    label: labelFromIndex(index),
    direction: 'in',
    dataType: 'string',
    topPercent: topPercentFromIndex(index, stateSegmentIds.value.length),
    description: `文本段 ${labelFromIndex(index).toUpperCase()}`
  }));
});

const inputHandleIdFromSegmentId = (segmentId: string): string => `input-${segmentId}-string`;
const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') return false;
  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const segmentValueGet = (segmentId: string): string => stateSegmentValues.value[segmentId] ?? '';
const handleSegmentValueUpdate = (segmentId: string, value: string): void => {
  stateSegmentValues.value = { ...stateSegmentValues.value, [segmentId]: value };
};

const handleSegmentAdd = (): void => {
  const nextId = createSegmentId();
  stateSegmentIds.value = [...stateSegmentIds.value, nextId];
  stateSegmentValues.value = { ...stateSegmentValues.value, [nextId]: '' };
};

const handleSegmentRemove = (): void => {
  if (stateSegmentIds.value.length <= 2) return;
  const removedId = stateSegmentIds.value[stateSegmentIds.value.length - 1];
  stateSegmentIds.value = stateSegmentIds.value.slice(0, -1);
  const nextValues = { ...stateSegmentValues.value };
  delete nextValues[removedId];
  stateSegmentValues.value = nextValues;
};

const syncSegmentValuesByIds = (): void => {
  const nextValues: Record<string, string> = {};
  stateSegmentIds.value.forEach((segmentId) => {
    nextValues[segmentId] = segmentValueGet(segmentId);
  });
  stateSegmentValues.value = nextValues;
};

const rightPins: IBasicSidePin[] = [
  { id: 'result-string', label: 'result', direction: 'out', dataType: 'string', topPercent: 35, description: '拼接结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) return;
  const rawSegmentIds = (stateNode.node.data as IStringConcatNodeData | undefined)?.segmentIds;
  const rawSegmentValues = (stateNode.node.data as IStringConcatNodeData | undefined)?.segmentValues;
  stateSegmentIds.value = ensureMinSegmentIds(Array.isArray(rawSegmentIds) ? rawSegmentIds : []);
  stateSegmentValues.value = rawSegmentValues && typeof rawSegmentValues === 'object' ? { ...rawSegmentValues } : {};
  syncSegmentValuesByIds();
  stateInitialized.value = true;
});

watch(
  [stateSegmentIds, stateSegmentValues],
  () => {
    if (!stateInitialized.value) return;
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
