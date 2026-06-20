<template>
  <aside class="border-default bg-default flex h-full min-h-0 w-100 shrink-0 flex-col overflow-hidden border-r">
    <div class="border-default bg-default shrink-0 border-b px-3 pt-2">
      <UNavigationMenu :items="computedSidebarTabLinks" highlight class="[&_asor-pointer -mb-px -translate-x-2.5 [&_buttobutton]:cursor-pointer">
        <template #item-trailing="{ item }">
          <UBadge color="neutral" variant="soft" size="sm">{{ getTabCountByTabValue(String(item?.value ?? '')) }}</UBadge>
        </template>
      </UNavigationMenu>
    </div>

    <div class="scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4">
      <div class="space-y-4">
        <CrawlersList v-if="stateActiveTab === 'nodes'" :groups="groups" :selected-key="selectedKey" @click="handleClick" />

        <div v-else class="space-y-4">
          <template v-if="computedActiveFunctionLoading">
            <Spin
              :loading="true"
              :tip="t('pages.crawlers.editor.sidebar.loading')"
              icon="i-lucide:loader-circle"
              icon-class="size-4 text-primary"
              content-class="rounded-md border border-default bg-default/90 px-3 py-2"
              tip-class="text-xs text-muted"
              mask-class="bg-default/65"
              :size="16"
              :delay="0"
              overlay
            >
              <div class="h-24" />
            </Spin>
          </template>

          <template v-else-if="computedActiveFunctionRows.length === 0">
            <UEmpty :icon="computedActiveTabIcon" :title="computedActiveFunctionEmptyTitle" :description="computedActiveFunctionEmptyText" class="px-4 py-6">
              <template #actions>
                <UButton color="primary" variant="solid" :label="computedCreateFunctionButtonLabel" icon="i-lucide:plus" @click="handleCreateFunction" />
              </template>
            </UEmpty>
          </template>

          <template v-else>
            <ul class="space-y-2">
              <li v-for="row in computedActiveFunctionRows" :key="row.id" class="border-default bg-muted/15 hover:bg-muted/30 flex cursor-grab items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors" draggable="true" @dragstart="handleFunctionRowDragStart($event, row)">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <UIcon :name="resolveFunctionRowIcon(row.scope)" class="text-muted size-4 shrink-0" />
                    <div class="truncate text-sm font-medium">{{ row.name }}</div>
                  </div>
                  <div class="text-muted mt-1 flex items-center gap-2 text-xs">
                    <span>{{ t('pages.crawlers.editor.sidebar.row.id', { id: row.id }) }}</span>
                    <span class="text-default/20">•</span>
                    <span>{{ resolveFunctionRowScopeLabel(row.scope) }}</span>
                  </div>
                </div>

                <UBadge color="neutral" variant="soft" size="sm" class="shrink-0">{{ t('pages.crawlers.editor.sidebar.row.reference', { count: row.referenceCount }) }}</UBadge>
              </li>

              <li class="pt-1">
                <UButton class="w-full" color="primary" variant="soft" :label="computedCreateFunctionButtonLabel" icon="i-lucide:plus" @click="handleCreateFunction" />
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

import type { ICrawlersEditorSidebarClickRow, ICrawlersEditorSidebarEmits, ICrawlersEditorSidebarFunctionRow, ICrawlersEditorSidebarProps, ICrawlersEditorSidebarTabItem, TCrawlersEditorSidebarTab } from '@/components/crawlers/editor/sidebar/index.types';
import type { ICrawlerBlueprintDnDPayload } from '@/composables/hooks/useCrawlerBlueprintDnD/index.types';

/**
 * 常量：左侧三栏标签页配置。
 */
const EDITOR_SIDEBAR_TABS: Pick<ICrawlersEditorSidebarTabItem, 'value' | 'icon'>[] = [
  { value: 'nodes', icon: 'i-lucide:workflow' },
  { value: 'site-functions', icon: 'i-lucide:folder-code' },
  { value: 'global-functions', icon: 'i-lucide:globe-2' }
];

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：蓝图拖拽。
 */
const { onDragStart } = useCrawlerBlueprintDnD();

/**
 * 属性：左侧栏显示数据。
 */
const { groups, selectedKey, targetId = 0, functionRefreshNonce = 0 } = defineProps<ICrawlersEditorSidebarProps>();

/**
 * 事件：左侧栏操作。
 */
const emit = defineEmits<ICrawlersEditorSidebarEmits>();

/**
 * 状态：当前标签页。
 */
const stateActiveTab = ref<TCrawlersEditorSidebarTab>('nodes');

/**
 * API：站点函数列表。
 */
const {
  datas: stateSiteFunctionRows,
  loading: stateSiteFunctionLoading,
  refresh: refreshSiteFunctionRows
} = await useApi<ICrawlersEditorSidebarFunctionRow[]>('crawlers/functions', {
  immediate: false,
  datas: {
    scope: 'site',
    targetId: String(Number(targetId ?? 0))
  }
});

/**
 * API：全局函数列表。
 */
const {
  datas: stateGlobalFunctionRows,
  loading: stateGlobalFunctionLoading,
  refresh: refreshGlobalFunctionRows
} = await useApi<ICrawlersEditorSidebarFunctionRow[]>('crawlers/functions', {
  immediate: true,
  datas: {
    scope: 'global'
  }
});

/**
 * 计算属性：当前标签页标题。
 */
const computedActiveTabIcon = computed(() => EDITOR_SIDEBAR_TABS.find((item) => item.value === stateActiveTab.value)?.icon ?? 'i-lucide:workflow');

/**
 * 计算属性：站点函数列表。
 */
const computedSiteFunctionRows = computed<ICrawlersEditorSidebarFunctionRow[]>(() => {
  return Array.isArray(stateSiteFunctionRows.value) ? stateSiteFunctionRows.value : [];
});

/**
 * 计算属性：全局函数列表。
 */
const computedGlobalFunctionRows = computed<ICrawlersEditorSidebarFunctionRow[]>(() => {
  return Array.isArray(stateGlobalFunctionRows.value) ? stateGlobalFunctionRows.value : [];
});

/**
 * 计算属性：当前标签页函数列表。
 */
const computedActiveFunctionRows = computed<ICrawlersEditorSidebarFunctionRow[]>(() => {
  if (stateActiveTab.value === 'site-functions') {
    return computedSiteFunctionRows.value;
  }

  if (stateActiveTab.value === 'global-functions') {
    return computedGlobalFunctionRows.value;
  }

  return [];
});

/**
 * 计算属性：节点数量。
 */
const computedNodeCount = computed<number>(() => groups.reduce((total, group) => total + group.crawlers.length, 0));

/**
 * 计算属性：站点函数数量。
 */
const computedSiteFunctionCount = computed<number>(() => computedSiteFunctionRows.value.length);

/**
 * 计算属性：全局函数数量。
 */
const computedGlobalFunctionCount = computed<number>(() => computedGlobalFunctionRows.value.length);

/**
 * 计算属性：当前标签页函数加载状态。
 */
const computedActiveFunctionLoading = computed<boolean>(() => {
  if (stateActiveTab.value === 'site-functions') {
    return stateSiteFunctionLoading.value;
  }

  if (stateActiveTab.value === 'global-functions') {
    return stateGlobalFunctionLoading.value;
  }

  return false;
});

/**
 * 计算属性：函数列表空态文案。
 */
const computedActiveFunctionEmptyText = computed(() => {
  if (stateActiveTab.value === 'site-functions') {
    if (Number(targetId ?? 0) <= 0) {
      return t('pages.crawlers.editor.sidebar.empty.siteMissingTarget');
    }

    return t('pages.crawlers.editor.sidebar.empty.siteNoData');
  }

  if (stateActiveTab.value === 'global-functions') {
    return t('pages.crawlers.editor.sidebar.empty.globalNoData');
  }

  return t('pages.crawlers.editor.sidebar.empty.defaultDescription');
});

/**
 * 计算属性：函数列表空态标题。
 */
const computedActiveFunctionEmptyTitle = computed(() => {
  if (stateActiveTab.value === 'site-functions') {
    return t('pages.crawlers.editor.sidebar.empty.siteTitle');
  }

  if (stateActiveTab.value === 'global-functions') {
    return t('pages.crawlers.editor.sidebar.empty.globalTitle');
  }

  return t('pages.crawlers.editor.sidebar.empty.defaultTitle');
});

/**
 * 计算属性：创建函数按钮文案。
 */
const computedCreateFunctionButtonLabel = computed(() => {
  if (stateActiveTab.value === 'site-functions') {
    return t('pages.crawlers.editor.sidebar.actions.createSiteFunction');
  }

  return t('pages.crawlers.editor.sidebar.actions.createGlobalFunction');
});

/**
 * 函数：根据标签值返回标题。
 * @param {TCrawlersEditorSidebarTab} tab 标签值。
 * @returns {string} 标签标题。
 */
const getTabLabelByValue = (tab: TCrawlersEditorSidebarTab): string => {
  if (tab === 'nodes') {
    return t('pages.crawlers.editor.sidebar.tabs.nodes');
  }

  if (tab === 'site-functions') {
    return t('pages.crawlers.editor.sidebar.tabs.siteFunctions');
  }

  if (tab === 'global-functions') {
    return t('pages.crawlers.editor.sidebar.tabs.globalFunctions');
  }

  return '';
};

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
    value: tab.value,
    label: getTabLabelByValue(tab.value),
    icon: tab.icon,
    active: stateActiveTab.value === tab.value,
    onSelect: (event: Event) => handleSidebarTabSelect(tab.value, event)
  }))
]);

/**
 * 函数：根据标签值返回数量。
 * @param {string} value 标签值。
 * @returns {number} 对应数量。
 */
const getTabCountByTabValue = (value: string): number => {
  if (value === 'nodes') {
    return computedNodeCount.value;
  }

  if (value === 'site-functions') {
    return computedSiteFunctionCount.value;
  }

  if (value === 'global-functions') {
    return computedGlobalFunctionCount.value;
  }

  return 0;
};

watch(
  () => targetId,
  () => {
    /**
     * 常量：id。
     */
    const id = Number(targetId ?? 0);

    if (Number.isFinite(id) && id > 0) {
      refreshSiteFunctionRows({
        datas: {
          scope: 'site',
          targetId: String(id)
        },
        replace: true
      });
      return;
    }

    refreshSiteFunctionRows({
      datas: {
        scope: 'site',
        targetId: '0'
      },
      replace: true
    });
  },
  { immediate: true }
);

watch(
  () => stateActiveTab.value,
  (tab) => {
    if (tab === 'global-functions') {
      refreshGlobalFunctionRows();
    }
  }
);

watch(
  () => functionRefreshNonce,
  () => {
    const currentTargetId = Number(targetId ?? 0);

    refreshGlobalFunctionRows({
      datas: {
        scope: 'global'
      },
      replace: true
    });

    refreshSiteFunctionRows({
      datas: {
        scope: 'site',
        targetId: String(Number.isFinite(currentTargetId) && currentTargetId > 0 ? currentTargetId : 0)
      },
      replace: true
    });
  }
);

/**
 * 函数：转发列表点击事件。
 * @param {ICrawlersEditorSidebarClickRow} row 条目数据。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleClick = (row: ICrawlersEditorSidebarClickRow, event: MouseEvent): void => {
  emit('click', row, event);
};

/**
 * 函数：创建函数。
 * @returns {void} 无返回值。
 */
const handleCreateFunction = (): void => {
  emit('createFunction', stateActiveTab.value === 'site-functions' ? 'site' : 'global');
};

/**
 * 函数：解析函数行图标。
 * @param {'site' | 'global'} scope 作用域。
 * @returns {string} 图标名称。
 */
const resolveFunctionRowIcon = (scope: 'site' | 'global'): string => {
  return scope === 'global' ? 'i-lucide:globe-2' : 'i-lucide:folder-code';
};

/**
 * 函数：解析函数行作用域文案。
 * @param {'site' | 'global'} scope 作用域。
 * @returns {string} 作用域文案。
 */
const resolveFunctionRowScopeLabel = (scope: 'site' | 'global'): string => {
  return scope === 'global' ? t('pages.crawlers.editor.sidebar.tabs.globalFunctions') : t('pages.crawlers.editor.sidebar.tabs.siteFunctions');
};

/**
 * 函数：处理函数列表项拖拽开始。
 * @param {DragEvent} event 拖拽事件。
 * @param {ICrawlersEditorSidebarFunctionRow} row 函数行。
 * @returns {void} 无返回值。
 */
const handleFunctionRowDragStart = (event: DragEvent, row: ICrawlersEditorSidebarFunctionRow): void => {
  const nodeType = row.scope === 'global' ? 'function-global' : 'function-site';

  const payload: ICrawlerBlueprintDnDPayload = {
    functionId: Number(row.id ?? 0),
    functionName: String(row.name ?? '').trim(),
    functionScope: row.scope,
    targetId: Number(row.targetId ?? 0),
    referenceCount: Number(row.referenceCount ?? 0)
  };

  onDragStart(event, nodeType, payload);
};
</script>
