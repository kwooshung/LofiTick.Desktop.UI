<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-merge"
    :title="t('components.crawler.blueprint.nodes.arrayObject.merge.title')"
    :description="t('components.crawler.blueprint.nodes.arrayObject.merge.description')"
    header-color=""
    header-bg="bg-violet-500"
    :left-pins="computedLeftPins"
    :right-pins="rightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.arrayObject.merge.fields.mode.label')">
        <USelect v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField v-for="(sourceId, index) in stateSourceIds" :key="sourceId" :label="t('components.crawler.blueprint.nodes.arrayObject.merge.fields.source.label', { label: labelFromIndex(index).toUpperCase() })">
        <div v-if="hasTargetPinConnection(inputHandleIdFromSourceId(sourceId))" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">{{ t('components.crawler.blueprint.nodes.common.connectedInputHint') }}</span>
        </div>

        <UTextarea
          v-else
          :id="`crawlerArrayObjectMerge-${sourceId}`"
          :model-value="sourceValueGet(sourceId)"
          class="w-full"
          :rows="2"
          autoresize
          :placeholder="t('components.crawler.blueprint.nodes.arrayObject.merge.fields.source.placeholder', { label: labelFromIndex(index).toUpperCase() })"
          @update:model-value="(value) => handleSourceValueUpdate(sourceId, String(value ?? ''))"
        />
      </UFormField>

      <div class="flex items-center justify-end gap-2">
        <span class="text-muted text-xs">{{ t('components.crawler.blueprint.nodes.arrayObject.merge.fields.source.count', { count: stateSourceIds.length }) }}</span>
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-minus" class="rounded-sm" :disabled="stateSourceIds.length <= 2" @click="handleSourceRemove" />
        <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-plus" class="rounded-sm" @click="handleSourceAdd" />
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { IArrayObjectMergeNodeData, TArrayObjectMergeMode } from '@/components/crawlers/nodes/arrayObject/merge/index.types';

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();
/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();
/**
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();
/**
 * Hook：Vue Flow 边集合。
 */
const { edges } = useVueFlow();
/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);
/**
 * 状态：合并模式。
 */
const stateMode = ref<TArrayObjectMergeMode>('smart');
/**
 * 状态：数据源 ID 列表。
 */
const stateSourceIds = ref<string[]>([]);
/**
 * 状态：数据源文本值映射。
 */
const stateSourceValues = ref<Record<string, string>>({});

/**
 * 计算属性：合并模式选项。
 */
const stateModeOptions = computed(() => [
  { value: 'smart', label: t('components.crawler.blueprint.nodes.arrayObject.merge.options.modeSmart') },
  { value: 'arrayConcat', label: t('components.crawler.blueprint.nodes.arrayObject.merge.options.modeArrayConcat') },
  { value: 'objectAssign', label: t('components.crawler.blueprint.nodes.arrayObject.merge.options.modeObjectAssign') }
]);

/**
 * 函数：创建数据源 ID。
 * @returns {string} 随机 ID。
 */
const createSourceId = (): string => crypto.randomUUID().slice(0, 8);

/**
 * 函数：保证最少两个数据源。
 * @param {string[]} ids 原始 ID 列表。
 * @returns {string[]} 归一化后的 ID 列表。
 */
const ensureMinSourceIds = (ids: string[]): string[] => {
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
    nextIds.push(createSourceId());
  }

  return nextIds;
};

/**
 * 函数：根据序号生成标签。
 * @param {number} index 序号。
 * @returns {string} 标签文本。
 */
const labelFromIndex = (index: number): string => {
  /**
   * 常量：alphabet。
   */
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[index] ?? `v${index + 1}`;
};

/**
 * 函数：根据序号计算引脚纵向位置。
 * @param {number} index 当前序号。
 * @param {number} total 总数。
 * @returns {number} 纵向百分比。
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
 * 函数：根据数据源 ID 生成输入引脚 ID。
 * @param {string} sourceId 数据源 ID。
 * @returns {string} 输入引脚 ID。
 */
const inputHandleIdFromSourceId = (sourceId: string): string => `input-${sourceId}-any`;

/**
 * 函数：判断目标引脚是否已连接。
 * @param {string} handleId 引脚 ID。
 * @returns {boolean} 是否已连接。
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
 * 计算属性：左侧输入引脚配置。
 */
const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return stateSourceIds.value.map((sourceId, index) => ({
    id: inputHandleIdFromSourceId(sourceId),
    label: labelFromIndex(index).toUpperCase(),
    direction: 'in',
    dataType: 'any',
    topPercent: topPercentFromIndex(index, stateSourceIds.value.length),
    description: t('components.crawler.blueprint.nodes.arrayObject.merge.pinDescriptions.source', { label: labelFromIndex(index).toUpperCase() })
  }));
});

/**
 * 函数：读取数据源文本值。
 * @param {string} sourceId 数据源 ID。
 * @returns {string} 数据源文本值。
 */
const sourceValueGet = (sourceId: string): string => {
  return stateSourceValues.value[sourceId] ?? '[]';
};

/**
 * 函数：更新数据源文本值。
 * @param {string} sourceId 数据源 ID。
 * @param {string} value 数据源文本值。
 */
const handleSourceValueUpdate = (sourceId: string, value: string): void => {
  stateSourceValues.value = {
    ...stateSourceValues.value,
    [sourceId]: value
  };
};

/**
 * 函数：新增数据源。
 */
const handleSourceAdd = (): void => {
  /**
   * 常量：nextId。
   */
  const nextId = createSourceId();
  stateSourceIds.value = [...stateSourceIds.value, nextId];
  stateSourceValues.value = {
    ...stateSourceValues.value,
    [nextId]: '[]'
  };
};

/**
 * 函数：移除数据源。
 */
const handleSourceRemove = (): void => {
  if (stateSourceIds.value.length <= 2) {
    return;
  }

  /**
   * 函数：removedId。
   */
  const removedId = stateSourceIds.value[stateSourceIds.value.length - 1];
  stateSourceIds.value = stateSourceIds.value.slice(0, -1);

  /**
   * 常量：nextValues。
   */
  const nextValues = { ...stateSourceValues.value };
  delete nextValues[removedId];
  stateSourceValues.value = nextValues;
};

/**
 * 函数：按 ID 列表同步数据源值。
 */
const syncSourceValuesByIds = (): void => {
  const nextValues: Record<string, string> = {};
  stateSourceIds.value.forEach((sourceId) => {
    nextValues[sourceId] = sourceValueGet(sourceId);
  });

  /**
   * 常量：currentValues。
   */
  const currentValues = stateSourceValues.value;
  /**
   * 常量：currentKeys。
   */
  const currentKeys = Object.keys(currentValues);
  /**
   * 常量：nextKeys。
   */
  const nextKeys = Object.keys(nextValues);
  /**
   * 常量：sameLength。
   */
  const sameLength = currentKeys.length === nextKeys.length;
  /**
   * 常量：sameValues。
   */
  const sameValues = sameLength && nextKeys.every((key) => currentValues[key] === nextValues[key]);

  if (!sameValues) {
    stateSourceValues.value = nextValues;
  }
};

/**
 * 常量：右侧输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-any',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.result'),
    direction: 'out',
    dataType: 'any',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.arrayObject.merge.pinDescriptions.result')
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

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as IArrayObjectMergeNodeData;
  /**
   * 常量：mode。
   */
  const mode = String(data.mode ?? 'smart') as TArrayObjectMergeMode;
  stateMode.value = ['smart', 'arrayConcat', 'objectAssign'].includes(mode) ? mode : 'smart';
  stateSourceIds.value = ensureMinSourceIds(Array.isArray(data.sourceIds) ? data.sourceIds : []);
  stateSourceValues.value = data.sourceValues && typeof data.sourceValues === 'object' ? { ...data.sourceValues } : {};
  syncSourceValuesByIds();
  stateInitialized.value = true;
});

watch([stateMode, stateSourceIds, stateSourceValues], () => {
  if (!stateInitialized.value) {
    return;
  }

  syncSourceValuesByIds();
  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    mode: stateMode.value,
    sourceIds: [...stateSourceIds.value],
    sourceValues: { ...stateSourceValues.value }
  };
});
</script>
