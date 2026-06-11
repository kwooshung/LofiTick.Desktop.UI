<template>
  <div class="border-accented bg-elevated/30 focus-within:border-primary flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border transition-colors duration-300">
    <div v-if="showHandle" class="podcast-template-handle bg-elevated/30 text-dimmed border-default flex w-12 shrink-0 cursor-grab items-center justify-center border-r transition-colors duration-200 active:cursor-grabbing">
      <UIcon name="i-lucide:grip-vertical" class="size-4" />
    </div>

    <USelect v-if="!computedAdPlaceholder" :model-value="item.voiceKey" :items="voiceOptions" value-attribute="value" option-attribute="label" variant="none" class="border-default w-30 shrink-0 rounded-none border-r bg-transparent" :disabled="disabled" @update:model-value="handleVoiceUpdate" />

    <UInput
      :model-value="item.content"
      variant="none"
      class="bg-default min-w-0 flex-1"
      :disabled="disabled || computedAdPlaceholder"
      :placeholder="computedAdPlaceholder ? adContentPlaceholder : placeholder"
      @click="handleContentFocus"
      @focus="handleContentFocus"
      @keyup="handleContentFocus"
      @select="handleContentFocus"
      @update:model-value="handleContentUpdate"
    />

    <USelect
      v-if="editorMode !== 'advertisement'"
      :model-value="item.segmentType"
      :items="segmentOptions"
      value-attribute="value"
      option-attribute="label"
      variant="none"
      class="border-default w-32 shrink-0 rounded-none border-l bg-transparent"
      :disabled="disabled"
      @update:model-value="handleSegmentTypeUpdate"
    />

    <div v-if="showRemove" class="border-default flex w-10 shrink-0 items-center justify-center border-l">
      <UButton color="neutral" variant="ghost" icon="i-lucide:x" class="text-muted flex h-full w-full items-center justify-center rounded-none p-0" :disabled="disabled" @click="emit('remove')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISettingsHotsearchPodcastScriptListItemProps } from '@/components/settings/hotsearch/podcast-script-list-item/index.types';

/**
 * 属性：播客脚本列表行。
 */
const { item, disabled = false, showHandle = true, showRemove = true, placeholder, adContentPlaceholder = '', editorMode, voiceOptions, segmentOptions } = defineProps<ISettingsHotsearchPodcastScriptListItemProps>();

/**
 * 事件：播客脚本片段行更新。
 */
const emit = defineEmits<{
  'update:voiceKey': [value: THotsearchPodcastVoiceKey];
  'update:content': [value: string];
  'update:segmentType': [value: THotsearchPodcastSegmentType];
  'focus-content': [event: Event];
  remove: [];
}>();

/**
 * 计算属性：当前是否为广告占位模板。
 */
const computedAdPlaceholder = computed(() => editorMode === 'template' && hotsearchPodcastAdPlaceholderIs(item));

/**
 * 函数：更新播报角色。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleVoiceUpdate = (value: string | number): void => {
  emit('update:voiceKey', String(value || '') as THotsearchPodcastVoiceKey);
};

/**
 * 函数：更新文本内容。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleContentUpdate = (value: string | number): void => {
  emit('update:content', String(value ?? ''));
};

/**
 * 函数：更新片段类型。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleSegmentTypeUpdate = (value: string | number): void => {
  emit('update:segmentType', String(value || 'normal') as THotsearchPodcastSegmentType);
};

/**
 * 函数：转发文本框聚焦事件。
 * @param {Event} event 原始事件。
 * @returns {void} 无返回值。
 */
const handleContentFocus = (event: Event): void => {
  emit('focus-content', event);
};
</script>
