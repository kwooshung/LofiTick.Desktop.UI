<template>
  <aside class="border-default bg-elevated/30 scrollbar h-full min-h-0 w-100 shrink-0 overflow-y-auto border-r p-3">
    <CrawlersList :groups="groups" :selected-key="selectedKey" @click="handleClick" />
  </aside>
</template>

<script setup lang="ts">
import type { ICrawlersListRow } from '@/components/crawlers/list/index.types';
import type { ICrawlersEditorSidebarEmits, ICrawlersEditorSidebarProps } from '@/components/crawlers/editor/sidebar/index.types';

/**
 * 属性：左侧栏显示数据。
 */
const { groups, selectedKey } = defineProps<ICrawlersEditorSidebarProps>();

/**
 * 事件：左侧栏操作。
 */
const emit = defineEmits<ICrawlersEditorSidebarEmits>();

/**
 * 函数：转发列表点击事件。
 * @param {ICrawlersListRow} row 条目数据。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleClick = (row: ICrawlersListRow, event: MouseEvent): void => {
  emit('click', row, event);
};
</script>
