<template>
  <UTooltip :text="description" :content="{ side: 'top' }">
    <UButton color="neutral" variant="outline" :disabled="disabled" :icon="iconName" :label="label" @click="handleClick" />
  </UTooltip>
</template>

<script setup lang="ts">
import type { ICrawlersListItemEmits, ICrawlersListItemProps } from '@/components/crawlers/list/item/index.types';

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
