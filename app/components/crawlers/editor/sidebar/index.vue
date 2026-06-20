<template>
  <aside class="border-default bg-default flex h-full min-h-0 w-100 shrink-0 flex-col overflow-hidden border-r">
    <div class="border-default bg-default shrink-0 border-b px-3 pt-2">
      <UNavigationMenu :items="computedSidebarTabLinks" highlight class="-mb-px -translate-x-2.5" />
    </div>

    <div class="scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4">
      <div class="space-y-4">
        <CrawlersList v-if="stateActiveTab === 'nodes'" :groups="groups" :selected-key="selectedKey" @click="handleClick" />

        <div v-else class="space-y-4">
          <div class="border-default border-b pb-3">
            <div class="flex items-center justify-between gap-3">
              <div class="bg-elevated text-muted flex size-8 shrink-0 items-center justify-center rounded-md">
                <UIcon :name="computedActiveTabIcon" class="size-4" />
              </div>
              <div class="min-w-0 flex-1 text-sm font-medium">{{ computedActiveTabLabel }}</div>
              <UBadge color="neutral" variant="soft" class="shrink-0">0</UBadge>
            </div>
          </div>

          <div class="border-default divide-default divide-y overflow-hidden rounded-lg border">
            <div class="text-muted px-3 py-2 text-sm">暂无条目</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

import type { ICrawlersEditorSidebarClickRow, ICrawlersEditorSidebarEmits, ICrawlersEditorSidebarProps, ICrawlersEditorSidebarTabItem, TCrawlersEditorSidebarTab } from '@/components/crawlers/editor/sidebar/index.types';

/**
 * 常量：左侧三栏标签页配置。
 */
const EDITOR_SIDEBAR_TABS: ICrawlersEditorSidebarTabItem[] = [
  { value: 'nodes', label: '节点', icon: 'i-lucide:workflow' },
  { value: 'site-functions', label: '站点函数', icon: 'i-lucide:folder-code' },
  { value: 'global-functions', label: '全局函数', icon: 'i-lucide:globe-2' }
];

/**
 * 属性：左侧栏显示数据。
 */
const { groups, selectedKey } = defineProps<ICrawlersEditorSidebarProps>();

/**
 * 事件：左侧栏操作。
 */
const emit = defineEmits<ICrawlersEditorSidebarEmits>();

/**
 * 状态：当前标签页。
 */
const stateActiveTab = ref<TCrawlersEditorSidebarTab>('nodes');

/**
 * 计算属性：当前标签页标题。
 */
const computedActiveTabLabel = computed(() => EDITOR_SIDEBAR_TABS.find((item) => item.value === stateActiveTab.value)?.label ?? '节点');

/**
 * 计算属性：当前标签页图标。
 */
const computedActiveTabIcon = computed(() => EDITOR_SIDEBAR_TABS.find((item) => item.value === stateActiveTab.value)?.icon ?? 'i-lucide:workflow');

/**
 * 事件：切换侧栏标签页。
 * @param {TCrawlersEditorSidebarTab} tab 标签页标识。
 * @param {Event} event 选择事件。
 * @returns {void} 无返回值。
 */
const handleSidebarTabSelect = (tab: TCrawlersEditorSidebarTab, event: Event): void => {
  event.preventDefault();
  stateActiveTab.value = tab;
};

/**
 * 计算属性：侧栏导航菜单链接。
 */
const computedSidebarTabLinks = computed<NavigationMenuItem[][]>(() => [
  EDITOR_SIDEBAR_TABS.map((tab) => ({
    label: tab.label,
    icon: tab.icon,
    active: stateActiveTab.value === tab.value,
    onSelect: (event: Event) => handleSidebarTabSelect(tab.value, event)
  }))
]);

/**
 * 函数：转发列表点击事件。
 * @param {ICrawlersEditorSidebarClickRow} row 条目数据。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleClick = (row: ICrawlersEditorSidebarClickRow, event: MouseEvent): void => {
  emit('click', row, event);
};
</script>
