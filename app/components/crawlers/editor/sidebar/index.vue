<template>
  <aside class="border-default bg-default flex h-full min-h-0 w-100 shrink-0 flex-col overflow-hidden border-r">
    <div class="border-default bg-default shrink-0 border-b px-3 pt-2">
      <UNavigationMenu :items="computedSidebarTabLinks" highlight class="-mb-px -translate-x-2.5 [&_a]:cursor-pointer [&_button]:cursor-pointer">
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
              <li
                v-for="row in computedActiveFunctionRows"
                :key="row.id"
                class="group/function-row border-default bg-muted/15 hover:bg-muted/30 flex cursor-grab items-center justify-between gap-2 rounded-md border px-3 py-2 transition-colors"
                draggable="true"
                @dragstart="handleFunctionRowDragStart($event, row)"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <UIcon :name="resolveFunctionRowIcon(row.scope)" class="text-muted size-4 shrink-0" />
                    <div class="truncate text-sm font-medium">{{ row.name }}</div>
                  </div>
                  <div v-if="String(row.description ?? '').trim() !== ''" class="text-muted mt-1 line-clamp-2 text-xs leading-5">
                    {{ String(row.description ?? '').trim() }}
                  </div>
                  <div class="text-muted mt-1 flex items-center gap-2 text-xs">
                    <span>{{ t('pages.crawlers.editor.sidebar.row.id', { id: row.id }) }}</span>
                    <span class="text-default/20">•</span>
                    <span>{{ resolveFunctionRowScopeLabel(row.scope) }}</span>
                  </div>
                </div>

                <div class="relative flex shrink-0 items-center justify-end gap-1.5 pr-0 pl-1 transition-[padding] duration-200 group-hover/function-row:pr-7">
                  <UBadge color="neutral" variant="soft" size="sm" class="transition-transform duration-200 group-hover/function-row:-translate-x-1">{{ t('pages.crawlers.editor.sidebar.row.reference', { count: row.referenceCount }) }}</UBadge>
                  <UDropdownMenu :items="resolveFunctionRowMenuItems(row)" :content="{ side: 'bottom', align: 'end' }">
                    <UButton icon="i-mdi-more-vert" color="neutral" variant="ghost" size="xs" class="nodrag absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer opacity-0 transition-[opacity,transform] duration-200 group-hover/function-row:opacity-100" @click.stop @dragstart.stop />
                  </UDropdownMenu>
                </div>
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

  <UModal v-model:open="stateEditOpen" :dismissible="false" :title="t('pages.crawlers.editor.sidebar.editModal.title')" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField required :label="t('pages.crawlers.editor.sidebar.editModal.nameLabel')">
          <UInput v-model="stateEditName" class="w-full" :placeholder="t('pages.crawlers.editor.sidebar.editModal.namePlaceholder')" @keyup.enter="handleEditSubmit" />
        </UFormField>

        <UFormField :label="t('pages.crawlers.editor.sidebar.editModal.descriptionLabel')">
          <UTextarea v-model="stateEditDescription" class="w-full" :rows="3" autoresize :placeholder="t('pages.crawlers.editor.sidebar.editModal.descriptionPlaceholder')" />
        </UFormField>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton type="button" color="neutral" variant="outline" :disabled="stateEditLoading" @click="close">{{ t('common.actions.cancel') }}</UButton>
      <UButton type="button" icon="i-lucide:save" color="primary" :loading="stateEditLoading" :disabled="!computedEditCanSubmit" @click="handleEditSubmit">{{ t('common.actions.save') }}</UButton>
    </template>
  </UModal>

  <UModal v-model:open="stateDeleteOpen" :dismissible="false" :title="t('pages.crawlers.editor.sidebar.deleteModal.title')" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-sm">{{ t('pages.crawlers.editor.sidebar.deleteModal.description', { name: stateDeleteTarget?.name ?? '' }) }}</p>
    </template>
    <template #footer="{ close }">
      <UButton type="button" color="neutral" variant="outline" :disabled="stateDeleteLoading" @click="close">{{ t('common.actions.cancel') }}</UButton>
      <UButton type="button" icon="i-lucide:trash-2" color="error" :loading="stateDeleteLoading" @click="handleDeleteConfirm">{{ t('common.actions.delete') }}</UButton>
    </template>
  </UModal>
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
 * API：编辑函数。
 */
const { loading: stateEditLoading, refresh: refreshFunctionUpdate } = await useApi('crawlers/functions/update', {
  method: 'POST',
  immediate: false
});

/**
 * API：删除函数。
 */
const { loading: stateDeleteLoading, refresh: refreshFunctionDelete } = await useApi('crawlers/functions/delete', {
  method: 'POST',
  immediate: false
});

/**
 * 状态：编辑弹窗是否打开。
 */
const stateEditOpen = ref(false);

/**
 * 状态：编辑目标行。
 */
const stateEditTarget = ref<ICrawlersEditorSidebarFunctionRow | null>(null);

/**
 * 状态：编辑名称。
 */
const stateEditName = ref('');

/**
 * 状态：编辑描述。
 */
const stateEditDescription = ref('');

/**
 * 状态：删除弹窗是否打开。
 */
const stateDeleteOpen = ref(false);

/**
 * 状态：删除目标行。
 */
const stateDeleteTarget = ref<ICrawlersEditorSidebarFunctionRow | null>(null);

/**
 * 计算属性：当前标签页标题。
 */
/**
 * 计算属性：编辑是否可提交。
 */
const computedEditCanSubmit = computed(() => {
  const name = stateEditName.value.trim();
  const description = stateEditDescription.value.trim();

  if (name === '') {
    return false;
  }

  return name !== String(stateEditTarget.value?.name ?? '').trim() || description !== String(stateEditTarget.value?.description ?? '').trim();
});

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
  void scope;
  return 'i-mdi-function-variant';
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
    functionDescription: String(row.description ?? '').trim(),
    functionScope: row.scope,
    targetId: Number(row.targetId ?? 0),
    referenceCount: Number(row.referenceCount ?? 0)
  };

  onDragStart(event, nodeType, payload);
};
/**
 * 函数：解析函数行下拉菜单项。
 * @param {ICrawlersEditorSidebarFunctionRow} row 函数行。
 * @returns {object[][]} 菜单项分组。
 */
const resolveFunctionRowMenuItems = (row: ICrawlersEditorSidebarFunctionRow) => {
  return [
    [
      {
        label: t('pages.crawlers.editor.sidebar.actions.editLogic'),
        icon: 'i-lucide:workflow',
        onSelect: () => handleEditLogicClick(row)
      },
      {
        label: t('pages.crawlers.editor.sidebar.actions.edit'),
        icon: 'i-lucide:pencil',
        onSelect: () => handleEditClick(row)
      }
    ],
    [
      {
        label: t('pages.crawlers.editor.sidebar.actions.delete'),
        icon: 'i-lucide:trash-2',
        color: 'error' as const,
        onSelect: () => handleDeleteClick(row)
      }
    ]
  ];
};

/**
 * 函数：打开编辑弹窗。
 * @param {ICrawlersEditorSidebarFunctionRow} row 目标行。
 * @returns {void} 无返回值。
 */
const handleEditClick = (row: ICrawlersEditorSidebarFunctionRow): void => {
  stateEditTarget.value = row;
  stateEditName.value = String(row.name ?? '').trim();
  stateEditDescription.value = String(row.description ?? '').trim();
  stateEditOpen.value = true;
};

/**
 * 函数：编辑函数逻辑。
 * @param {ICrawlersEditorSidebarFunctionRow} row 函数行。
 * @returns {void} 无返回值。
 */
const handleEditLogicClick = (row: ICrawlersEditorSidebarFunctionRow): void => {
  emit('editFunctionLogic', row);
};

/**
 * 函数：提交编辑。
 * @returns {Promise<void>} Promise。
 */
const handleEditSubmit = async (): Promise<void> => {
  const name = stateEditName.value.trim();
  const description = stateEditDescription.value.trim();
  const id = Number(stateEditTarget.value?.id ?? 0);

  if (!computedEditCanSubmit.value || !Number.isFinite(id) || id <= 0) {
    return;
  }

  await refreshFunctionUpdate({
    datas: { id, name, description },
    replace: true
  });

  stateEditOpen.value = false;

  const currentTargetId = Number(targetId ?? 0);

  refreshGlobalFunctionRows({ datas: { scope: 'global' }, replace: true });
  refreshSiteFunctionRows({ datas: { scope: 'site', targetId: String(Number.isFinite(currentTargetId) && currentTargetId > 0 ? currentTargetId : 0) }, replace: true });
  emit('functionsChanged');
};

/**
 * 函数：打开删除确认弹窗。
 * @param {ICrawlersEditorSidebarFunctionRow} row 目标行。
 * @returns {void} 无返回值。
 */
const handleDeleteClick = (row: ICrawlersEditorSidebarFunctionRow): void => {
  stateDeleteTarget.value = row;
  stateDeleteOpen.value = true;
};

/**
 * 函数：确认删除函数。
 * @returns {Promise<void>} Promise。
 */
const handleDeleteConfirm = async (): Promise<void> => {
  const id = Number(stateDeleteTarget.value?.id ?? 0);

  if (!Number.isFinite(id) || id <= 0) {
    return;
  }

  await refreshFunctionDelete({
    datas: { id },
    replace: true
  });

  stateDeleteOpen.value = false;

  const currentTargetId = Number(targetId ?? 0);

  refreshGlobalFunctionRows({ datas: { scope: 'global' }, replace: true });
  refreshSiteFunctionRows({ datas: { scope: 'site', targetId: String(Number.isFinite(currentTargetId) && currentTargetId > 0 ? currentTargetId : 0) }, replace: true });
  emit('functionsChanged');
};
</script>
