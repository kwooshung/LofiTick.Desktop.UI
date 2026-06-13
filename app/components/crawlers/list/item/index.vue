<template>
  <UTooltip :text="description" :content="{ side: 'top' }">
    <UButton class="cursor-grab" color="neutral" variant="outline" :disabled="disabled" :icon="iconName" :label="label" :ui="{ leadingIcon: 'text-dimmed/75' }" :draggable="true" @dragstart="onDragStart($event, name)" />
  </UTooltip>
</template>

<script setup lang="ts">
import type { ICrawlersListItemProps } from '@/components/crawlers/list/item/index.types';

/**
 * 属性：爬虫列表项卡片。
 */
const { name, label, description, disabled = false, iconName = 'i-lucide-atom' } = defineProps<ICrawlersListItemProps>();

const { onDragStart } = useCrawlerBlueprintDnD();
</script>
