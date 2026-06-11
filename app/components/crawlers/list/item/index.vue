<template>
  <UTooltip :text="description" :content="{ side: 'top' }">
    <UButton
      color="neutral"
      variant="outline"
      :disabled="disabled"
      class="aspect-square h-full w-full min-w-0"
      :ui="{
        base: 'flex flex-col items-center justify-center gap-2 p-0',
        leadingIcon: 'text-dimmed size-7',
        label: 'text-center text-sm font-medium leading-5',
        trailingIcon: 'hidden'
      }"
      :icon="iconName"
      :label="label"
      @click="handleClick"
    />
  </UTooltip>
</template>

<script setup lang="ts">
import type { ICrawlersListItemEmits, ICrawlersListItemProps } from './index.types';

/**
 * 属性：爬虫列表项卡片。
 */
const { disabled = false, description, iconName = 'i-lucide:atom', label } = defineProps<ICrawlersListItemProps>();

/**
 * 事件：爬虫列表项卡片交互。
 */
const emit = defineEmits<ICrawlersListItemEmits>();

/**
 * 函数：处理点击。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleClick = (event: MouseEvent): void => {
  emit('click', event);
};
</script>
