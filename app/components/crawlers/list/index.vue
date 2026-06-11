<template>
  <UAccordion
    type="multiple"
    :items="items"
    :default-value="defaultValue"
    :ui="{
      item: 'border-default/80 rounded-lg border bg-default/70 px-3 mb-3 overflow-hidden last:border-b last:mb-0',
      header: 'px-0',
      trigger: 'py-3',
      content: 'overflow-hidden',
      body: 'pb-0'
    }"
  >
    <template #body="{ item }">
      <div class="space-y-3 px-2 pb-4">
        <div class="text-muted border-default mb-4 border-b pb-4 text-xs font-medium tracking-wide uppercase">{{ item.description }}</div>
        <div class="grid grid-cols-2 gap-3">
          <CrawlersListItem v-for="crawler in item.crawlers" :key="crawler.key" :label="crawler.name" :description="crawler.description" :icon-name="item.icon" :selected="crawler.key === selectedKey" @click="handleItemClick(crawler, $event)" />
        </div>
      </div>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { ICrawlersListEmits, ICrawlersListProps, ICrawlersListRow } from '@/components/crawlers/list/index.types';

/**
 * 属性：爬虫列表分组数据。
 */
const { groups = [], selectedKey = '' } = defineProps<ICrawlersListProps>();

/**
 * 事件：爬虫条目点击。
 */
const emit = defineEmits<ICrawlersListEmits>();

/**
 * 计算属性：默认展开分组。
 */
const defaultValue = computed(() => groups.map((group) => group.label));

/**
 * 计算属性：Accordion 项目。
 */
const items = computed(() =>
  groups.map((group) => ({
    label: group.label,
    description: group.description,
    icon: group.iconName,
    crawlers: group.crawlers
  }))
);

/**
 * 函数：处理条目点击。
 * @param {ICrawlersListRow} row 条目。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleItemClick = (row: ICrawlersListRow, event: MouseEvent): void => {
  console.log(row);
  emit('click', row, event);
};
</script>
