<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-eraser" :title="t('components.crawler.blueprint.nodes.string.trim.title')" :description="t('components.crawler.blueprint.nodes.string.trim.description')" header-color="" header-bg="bg-teal-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.string.trim.fields.text.label')">
        <div v-if="hasTargetPinConnection('input-text')" class="border-default text-muted flex h-8 items-center gap-1 rounded-sm border px-2 text-xs">
          <UIcon name="i-lucide-link-2" class="size-3 shrink-0" />
          <span class="truncate">已连接输入，使用连线值</span>
        </div>

        <UTextarea v-else v-model="stateText" :rows="2" autoresize class="w-full" :placeholder="t('components.crawler.blueprint.nodes.string.trim.fields.text.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.trim.fields.direction.label')">
        <USelect v-model="stateDirection" :options="directionOptions" option-attribute="value" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.string.trim.fields.whitespaceTypes.label')" help="">
        <div class="space-y-2">
          <label v-for="type in whitespaceTypeOptions" :key="type.value" class="flex items-center gap-2">
            <UCheckbox :model-value="stateWhitespaceTypes.includes(type.value)" @update:model-value="(checked) => handleWhitespaceTypeToggle(type.value, checked as boolean)" />
            <span class="text-sm">{{ type.label }}</span>
          </label>
        </div>
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

interface IStringTrimNodeData {
  text?: string;
  direction?: 'both' | 'start' | 'end' | 'all';
  whitespaceTypes?: string[];
}

const { t } = useI18n();
const stateNode = useNode();
const stateNodeId = useNodeId();
const { edges } = useVueFlow();
const stateInitialized = ref(false);
const stateText = ref('');
const stateDirection = ref<'both' | 'start' | 'end' | 'all'>('both');
const stateWhitespaceTypes = ref<string[]>(['space', 'tab', 'newline', 'carriage-return']);

const hasTargetPinConnection = (handleId: string): boolean => {
  const nodeId = String(stateNodeId ?? '').trim();
  if (nodeId === '') return false;
  return edges.value.some((edge) => edge.target === nodeId && edge.targetHandle === handleId);
};

const directionOptions = computed(() => [
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionBoth'), value: 'both' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionStart'), value: 'start' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionEnd'), value: 'end' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.directionAll'), value: 'all' }
]);

const whitespaceTypeOptions = computed(() => [
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceSpace'), value: 'space' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceTab'), value: 'tab' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceNewline'), value: 'newline' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceCarriageReturn'), value: 'carriage-return' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceVerticalTab'), value: 'vertical-tab' },
  { label: t('components.crawler.blueprint.nodes.string.trim.options.whitespaceFormFeed'), value: 'form-feed' }
]);

const handleWhitespaceTypeToggle = (type: string, checked: boolean): void => {
  if (checked) {
    stateWhitespaceTypes.value = [...stateWhitespaceTypes.value, type];
  } else {
    stateWhitespaceTypes.value = stateWhitespaceTypes.value.filter((t) => t !== type);
  }
};

const leftPins: IBasicSidePin[] = [{ id: 'input-text', label: 'text', direction: 'in', dataType: 'string', topPercent: 50, description: '待去空白的文本' }];

const rightPins: IBasicSidePin[] = [
  { id: 'result-string', label: 'result', direction: 'out', dataType: 'string', topPercent: 35, description: '去空白结果' },
  { id: 'result-message', label: 'message', direction: 'out', dataType: 'string', topPercent: 75, description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription') }
];

watchEffect(() => {
  if (stateInitialized.value) return;
  const data = (stateNode.node.data ?? {}) as IStringTrimNodeData;
  stateText.value = String(data.text ?? '');
  stateDirection.value = (data.direction ?? 'both') as 'both' | 'start' | 'end' | 'all';
  stateWhitespaceTypes.value = Array.isArray(data.whitespaceTypes) && data.whitespaceTypes.length > 0 ? [...data.whitespaceTypes] : ['space', 'tab', 'newline', 'carriage-return'];
  stateInitialized.value = true;
});

watch(
  [stateText, stateDirection, stateWhitespaceTypes],
  () => {
    if (!stateInitialized.value) return;
    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      text: stateText.value,
      direction: stateDirection.value,
      whitespaceTypes: [...stateWhitespaceTypes.value]
    };
  },
  { deep: true }
);
</script>
