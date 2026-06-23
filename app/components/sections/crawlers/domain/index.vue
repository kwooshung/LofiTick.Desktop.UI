<template>
  <DashboardPage>
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedBlueprintRows"
          :loading="stateLoading"
          class="shrink-0"
          sticky
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0'
          }"
        />
      </div>
    </div>

    <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ t('components.pagination.total', { total: computedTotal }) }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="computedTotal" />
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

/**
 * 组件：时间展示。
 */
const Datetime = resolveComponent('Datetime');

const USwitch = resolveComponent('USwitch');

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：气泡确认。
 */
const UPopover = resolveComponent('UPopover');

/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：提示。
 */
const toast = useToast();

/**
 * Hook：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 路由。
 */
const route = useRoute();

/**
 * 状态：删除确认气泡打开行 ID。
 */
const stateDeletePopoverOpenId = ref<number | null>(null);

/**
 * 状态：删除确认气泡来源列。
 */
const stateDeletePopoverSource = ref<'summaryMobile' | 'actions' | null>(null);

/**
 * 状态：蓝图启用切换中的行。
 */
const stateBlueprintEnabledSavingIds = ref<Record<number, boolean>>({});

/**
 * 状态：蓝图抽屉开关。
 */
const stateCodeSlideoverOpen = useState<boolean>('crawlers-blueprint-open', () => false);

/**
 * 状态：蓝图抽屉目标站点。
 */
const stateBlueprintDrawerTarget = useState<IQueryResultCrawlerTargetRow | null>('crawlers-blueprint-target', () => null);

/**
 * 状态：分页大小 cookie。
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow'
});

/**
 * 函数：读取当前目标站点域名。
 */
const currentDomainGet = (): string => {
  const value = route.params.domain;
  if (Array.isArray(value)) {
    return String(value[0] ?? '').trim();
  }

  return String(value ?? '').trim();
};

/**
 * 计算属性：目标站点域名。
 */
const computedDomain = computed<string>(() => currentDomainGet());

/**
 * API：读取当前站点详情。
 */
const { datas: stateDetailDatas } = await useApi<IQueryResultCrawlerTargetRow>(`crawlers/targets/${encodeURIComponent(computedDomain.value)}`, {
  immediate: true
});

/**
 * 计算属性：站点 ID。
 */
const computedTargetId = computed<number>(() => Number(stateDetailDatas.value?.id ?? 0));

/**
 * 函数：读取当前分页大小。
 */
const currentPageSizeGet = (): string => {
  const routeValue = typeof route.query.pagesize !== 'undefined' ? String(route.query.pagesize).trim() : '';
  if (routeValue !== '') {
    return routeValue;
  }

  return String(getPageSizeByCookieParsed(pagesizesCookie.value, 'crawlers-detail'));
};

/**
 * 函数：从路由读取排序字段。
 */
const currentOrderByGet = (): 'id' | 'updated' | 'created' => {
  const orderBy = String(route.query.order_by ?? '').trim();
  if (orderBy === 'updated' || orderBy === 'created') {
    return orderBy;
  }

  return 'id';
};

/**
 * 函数：从路由读取排序方向。
 */
const currentOrderDirGet = (): 'asc' | 'desc' => {
  const orderDir = String(route.query.order_dir ?? '')
    .trim()
    .toLowerCase();
  return orderDir === 'asc' ? 'asc' : 'desc';
};

/**
 * 函数：构建蓝图查询参数。
 */
const buildBlueprintQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {
    target_id: String(computedTargetId.value),
    pagesize: currentPageSizeGet()
  };

  const page = String(route.query.page ?? '').trim();
  if (page !== '') {
    query.page = page;
  }

  const keyword = String(route.query.keyword ?? '').trim();
  if (keyword !== '') {
    query.keyword = keyword;
  }

  const enabled = String(route.query.enabled ?? '').trim();
  if (enabled === '1' || enabled === '0') {
    query.enabled = enabled;
  }

  query.order_by = currentOrderByGet();
  query.order_dir = currentOrderDirGet();

  return query;
};

/**
 * API：蓝图列表。
 */
const {
  datas: stateDatas,
  loading: stateLoading,
  refreshDebounced: refreshListDebounced
} = await useApi<IQueryResultCrawlerBlueprintSummaryPage>('crawlers/blueprints', {
  immediate: true,
  datas: buildBlueprintQueryFromRoute()
});

/**
 * API：手动执行蓝图。
 */
const {
  error: stateBlueprintRunError,
  datas: stateBlueprintRunDatas,
  refresh: refreshBlueprintRun
} = await useApi<{ affected: number; executionId: number }>('crawlers/executions/add', {
  method: 'POST',
  immediate: false
});

/**
 * API：删除蓝图。
 */
const { error: stateBlueprintDeleteError, refresh: refreshBlueprintDelete } = await useApi<{ affected: number }>('crawlers/blueprints/delete', {
  method: 'POST',
  immediate: false
});

/**
 * API：切换蓝图启用状态。
 */
const { refresh: refreshBlueprintSetEnabled } = await useApi<{ affected: number }>('crawlers/blueprints/enabled', { method: 'POST', immediate: false });

/**
 * 侦听：站点 ID 与路由变化时刷新列表。
 */
watch(
  [computedTargetId, () => route.query],
  () => {
    if (computedTargetId.value <= 0) {
      return;
    }

    refreshListDebounced({ datas: buildBlueprintQueryFromRoute(), replace: true });
  },
  { immediate: false }
);

/**
 * 计算属性：蓝图行数据。
 */
const computedBlueprintRows = computed<IQueryResultCrawlerBlueprintRow[]>(() => {
  const rows = stateDatas.value?.rows ?? [];
  return rows.map((item) => ({
    id: Number(item.id ?? 0),
    targetId: Number(item.targetId ?? 0),
    name: String(item.name ?? ''),
    description: String(item.description ?? ''),
    enabled: Boolean(Reflect.get(item as object, 'isEnabled')),
    lastRunStatus: String(item.lastRunStatus ?? 'pending'),
    lastRunAt: String(item.lastRunAt ?? ''),
    createdAt: String(item.createdAt ?? ''),
    updatedAt: String(item.updatedAt ?? '')
  }));
});

/**
 * 函数：判断最后执行时间是否应视为“无”。
 *
 * # Arguments
 *
 * * `value` - 最后执行时间原始值。
 *
 * # Returns
 *
 * 返回 true 表示该时间没有业务意义。
 */
const lastRunAtIsEmpty = (value: string): boolean => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  if (normalized === '') {
    return true;
  }

  return /^(1000|0001)[/-]0?1[/-]0?1(?:[ t]|$)/.test(normalized);
};

/**
 * 计算属性：总数。
 */
const computedTotal = computed<number>(() => Number(stateDatas.value?.total ?? 0));

/**
 * 计算属性：当前页。
 */
const computedPage = computed<number>({
  get: () => {
    const num = parseInt(String(route.query.page ?? ''), 10);
    return Number.isFinite(num) && num > 0 ? num : 1;
  },
  set: (value: number) => {
    const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
    q.page = String(Math.max(1, value));
    navigateTo({ path: route.path, query: q });
  }
});

/**
 * 计算属性：每页数量。
 */
const computedItemsPerPage = computed<number>(() => {
  const parsed = parseInt(String(route.query.pagesize ?? ''), 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'crawlers-detail');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }

  const apiSize = Number(stateDatas.value?.pageSize ?? 20);
  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 函数：状态文案映射。
 */
const blueprintStatusLabelGet = (status: TCrawlerBlueprintLastRunStatus): string => {
  const value = String(status ?? '').trim();
  if (value === 'running' || value === 'success' || value === 'failed' || value === 'stopped') {
    return t(`pages.crawlers.executions.status.${value}`);
  }

  return t('pages.crawlers.executions.status.pending');
};

/**
 * 函数：状态颜色映射。
 */
const blueprintStatusColorGet = (status: TCrawlerBlueprintLastRunStatus): 'neutral' | 'warning' | 'success' | 'error' => {
  const value = String(status ?? '').trim();
  if (value === 'running') {
    return 'warning';
  }
  if (value === 'success') {
    return 'success';
  }
  if (value === 'failed') {
    return 'error';
  }

  return 'neutral';
};

/**
 * 函数：打开当前爬虫的编辑抽屉。
 *
 * @param {IQueryResultCrawlerBlueprintRow} row 当前爬虫行。
 * @returns {void} 无返回值。
 */
const handleOpenCrawlerEditor = (row: IQueryResultCrawlerBlueprintRow): void => {
  if (!stateDetailDatas.value || computedTargetId.value <= 0) {
    return;
  }

  stateBlueprintDrawerTarget.value = {
    ...stateDetailDatas.value,
    name: String(row.name ?? '').trim(),
    description: String(row.description ?? '').trim(),
    isEnabled: Boolean(row.enabled)
  };
  stateCodeSlideoverOpen.value = true;
};

/**
 * 函数：切换蓝图启用状态。
 *
 * @param {IQueryResultCrawlerBlueprintRow} row 当前爬虫行。
 * @param {boolean} value 新的启用状态。
 * @returns {Promise<void>} 无返回值。
 */
const handleToggleCrawlerEnabled = async (row: IQueryResultCrawlerBlueprintRow, value: boolean): Promise<void> => {
  const rowId = Number(row.id ?? 0);
  if (!Number.isFinite(rowId) || rowId <= 0) {
    return;
  }

  const prev = row.enabled;
  row.enabled = value;

  stateBlueprintEnabledSavingIds.value = {
    ...stateBlueprintEnabledSavingIds.value,
    [rowId]: true
  };

  try {
    await refreshBlueprintSetEnabled({
      datas: {
        id: rowId,
        enabled: value
      },
      replace: true
    });
    await refreshListDebounced({ datas: buildBlueprintQueryFromRoute(), replace: true });
  } catch {
    row.enabled = prev;
    toast.add({
      title: t('common.labels.enabled'),
      description: t('pages.crawlers.editor.loadSource.saveFailed'),
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 4200
    });
  } finally {
    stateBlueprintEnabledSavingIds.value = {};
  }
};

/**
 * 函数：跳转到执行记录页。
 *
 * @param {IQueryResultCrawlerBlueprintRow} row 当前爬虫行。
 * @returns {void} 无返回值。
 */
const handleOpenCrawlerExecution = async (row: IQueryResultCrawlerBlueprintRow): Promise<void> => {
  await refreshBlueprintRun({
    datas: {
      id: Number(row.id ?? 0)
    },
    replace: true
  });

  if (stateBlueprintRunError.value) {
    toast.add({
      color: 'error',
      title: row.name || `#${row.id}`,
      description: t('pages.crawlers.blueprints.actions.runFailed')
    });
    return;
  }

  toast.add({
    color: 'success',
    title: row.name || `#${row.id}`,
    description: t('pages.crawlers.blueprints.actions.runSuccess')
  });

  refreshListDebounced({ datas: buildBlueprintQueryFromRoute(), replace: true });

  navigateTo({
    path: localePath('/crawlers/executions'),
    query: {
      blueprint_id: String(row.id ?? 0),
      target_id: String(row.targetId ?? 0),
      execution_id: String(Number(stateBlueprintRunDatas.value?.executionId ?? 0))
    }
  });
};

/**
 * 函数：删除当前爬虫（预留）。
 *
 * @param {IQueryResultCrawlerBlueprintRow} _row 当前爬虫行。
 * @returns {void} 无返回值。
 */
const handleDeleteCrawler = async (row: IQueryResultCrawlerBlueprintRow): Promise<void> => {
  stateDeletePopoverOpenId.value = null;
  stateDeletePopoverSource.value = null;

  await refreshBlueprintDelete({
    datas: {
      id: Number(row.id ?? 0)
    },
    replace: true
  });

  if (stateBlueprintDeleteError.value) {
    toast.add({
      color: 'error',
      title: row.name || `#${row.id}`,
      description: t('pages.crawlers.blueprints.actions.deleteFailed')
    });
    return;
  }

  toast.add({
    color: 'success',
    title: row.name || `#${row.id}`,
    description: t('pages.crawlers.blueprints.actions.deleteSuccess')
  });

  refreshListDebounced({ datas: buildBlueprintQueryFromRoute(), replace: true });
};

/**
 * 排序：切换字段。
 */
const toggleSort = (field: 'id' | 'updated' | 'created') => {
  const currentBy = currentOrderByGet();
  const currentDir = currentOrderDirGet();
  const nextDir = currentBy === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'desc';
  const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
  q.order_by = field;
  q.order_dir = nextDir;
  q.page = '1';
  navigateTo({ path: route.path, query: q });
};

/**
 * 常量：表格列。
 */
const columns: TableColumn<IQueryResultCrawlerBlueprintRow>[] = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-18',
        td: 'w-18'
      }
    },
    header: () => {
      const isSorted = currentOrderByGet() === 'id' ? (currentOrderDirGet() === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: 'ID', icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('id') });
    },
    cell: ({ row }) => h('span', { class: 'text-muted' }, String(row.original.id ?? 0).padStart(5, '0'))
  },
  {
    accessorKey: 'summaryMobile',
    meta: {
      class: {
        th: 'sm:hidden',
        td: 'sm:hidden align-top whitespace-normal py-3'
      }
    },
    header: t('pages.crawlers.blueprints.table.status'),
    cell: ({ row }) => {
      const lastRunAt = String(row.original.lastRunAt ?? '').trim();
      const hasLastRunAt = !lastRunAtIsEmpty(lastRunAt);
      const lastRunNode = hasLastRunAt ? h(Datetime, { value: lastRunAt, class: 'w-auto max-w-full text-xs' }) : h('span', { class: 'text-muted' }, t('common.labels.none'));

      return h('div', { class: 'flex min-w-0 flex-col gap-2' }, [
        h('div', { class: 'space-y-1' }, [h('div', { class: 'break-words font-medium' }, row.original.name || '-'), h('div', { class: 'text-sm text-muted break-words leading-5' }, row.original.description || t('common.labels.none'))]),
        h('div', { class: 'flex flex-wrap items-center gap-2' }, [
          h(
            UBadge,
            {
              variant: 'soft',
              color: blueprintStatusColorGet(row.original.lastRunStatus)
            },
            () => blueprintStatusLabelGet(row.original.lastRunStatus)
          ),
          h(
            UBadge,
            {
              variant: 'subtle',
              color: row.original.enabled ? 'success' : 'neutral'
            },
            () => (row.original.enabled ? t('common.labels.enabled') : t('common.labels.disabled'))
          )
        ]),
        h('div', { class: 'flex flex-col gap-1.5 text-xs' }, [
          h('div', { class: 'flex items-center gap-1 text-xs' }, [h('span', { class: 'shrink-0 text-muted' }, `${t('pages.crawlers.blueprints.table.lastRunAt')}：`), lastRunNode]),
          h('div', { class: 'flex items-center gap-1 text-xs' }, [h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.updatedAt')}：`), h(Datetime, { value: row.original.updatedAt, class: 'w-auto max-w-full text-xs' })]),
          h('div', { class: 'flex items-center gap-1 text-xs' }, [h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.createdAt')}：`), h(Datetime, { value: row.original.createdAt, class: 'w-auto max-w-full text-xs' })])
        ]),
        h('div', { class: 'mt-1 flex flex-wrap items-center gap-2' }, [
          h(
            UButton,
            {
              color: 'neutral',
              variant: 'soft',
              icon: 'i-lucide:play',
              ui: { leadingIcon: 'text-dimmed group-hover:text-muted' },
              onClick: () => {
                void handleOpenCrawlerExecution(row.original);
              }
            },
            () => t('pages.crawlers.blueprints.actions.execute')
          ),
          h(
            UButton,
            {
              color: 'neutral',
              variant: 'ghost',
              icon: 'i-lucide:edit',
              ui: { leadingIcon: 'text-dimmed group-hover:text-muted' },
              onClick: () => handleOpenCrawlerEditor(row.original)
            },
            () => t('common.actions.edit')
          ),
          h(
            UPopover,
            {
              open: stateDeletePopoverOpenId.value === row.original.id && stateDeletePopoverSource.value === 'summaryMobile',
              'onUpdate:open': (value: boolean) => {
                if (!value && stateDeletePopoverOpenId.value === row.original.id && stateDeletePopoverSource.value === 'summaryMobile') {
                  stateDeletePopoverOpenId.value = null;
                  stateDeletePopoverSource.value = null;
                }
              },
              arrow: true,
              content: { side: 'top', align: 'start', sideOffset: 8 },
              ui: { content: 'p-3.5 w-70' }
            },
            {
              default: () =>
                h(
                  UButton,
                  {
                    color: 'neutral',
                    variant: 'ghost',
                    icon: 'i-lucide:trash-2',
                    class: 'hover:text-error',
                    ui: { leadingIcon: 'text-dimmed group-hover:text-error' },
                    onClick: () => {
                      stateDeletePopoverOpenId.value = row.original.id;
                      stateDeletePopoverSource.value = 'summaryMobile';
                    }
                  },
                  () => t('common.actions.delete')
                ),
              content: () =>
                h('div', { class: 'flex flex-col gap-2.5' }, [
                  h('div', { class: 'flex items-center gap-2 text-highlighted text-sm font-medium' }, [h('i', { class: 'i-lucide:trash-2 w-4 h-4 text-warning' }), h('span', {}, '删除爬虫')]),
                  h('div', { class: 'text-muted text-xs leading-5' }, t('pages.crawlers.blueprints.actions.deleteConfirm', { name: row.original.name || '-' })),
                  h('div', { class: 'flex items-center justify-end gap-2 pt-1' }, [
                    h(UButton, {
                      color: 'neutral',
                      variant: 'outline',
                      size: 'xs',
                      label: t('common.actions.cancel'),
                      onClick: () => {
                        stateDeletePopoverOpenId.value = null;
                        stateDeletePopoverSource.value = null;
                      }
                    }),
                    h(UButton, {
                      color: 'error',
                      variant: 'solid',
                      size: 'xs',
                      label: t('common.actions.confirm'),
                      onClick: () => {
                        void handleDeleteCrawler(row.original);
                      }
                    })
                  ])
                ])
            }
          )
        ])
      ]);
    }
  },
  {
    accessorKey: 'nameCompact',
    meta: {
      class: {
        th: 'hidden sm:table-cell xl:hidden w-[20rem]',
        td: 'hidden sm:table-cell xl:hidden py-3 w-[20rem]'
      }
    },
    header: `${t('pages.crawlers.blueprints.table.name')} / ${t('pages.crawlers.blueprints.table.description')}`,
    cell: ({ row }) => {
      return h('div', { class: 'flex min-w-0 flex-col gap-1 py-1' }, [h('div', { class: 'min-w-0' }, [h('div', { class: 'truncate font-medium' }, row.original.name || '-')]), h('div', { class: 'text-sm text-dimmed line-clamp-2 leading-5' }, row.original.description || t('common.labels.none'))]);
    }
  },
  {
    accessorKey: 'name',
    meta: {
      class: {
        th: 'hidden xl:table-cell w-[24rem]',
        td: 'hidden xl:table-cell w-[24rem] py-3'
      }
    },
    header: t('pages.crawlers.blueprints.table.name'),
    cell: ({ row }) => h('div', { class: 'min-w-0 py-1' }, [h('div', { class: 'truncate font-medium' }, row.original.name || '-')])
  },
  {
    accessorKey: 'description',
    meta: {
      class: {
        th: 'hidden xl:table-cell w-[18rem]',
        td: 'hidden xl:table-cell w-[18rem] py-3'
      }
    },
    header: t('pages.crawlers.blueprints.table.description'),
    cell: ({ row }) => h('div', { class: 'line-clamp-2 text-sm text-muted leading-5' }, row.original.description || t('common.labels.none'))
  },
  {
    accessorKey: 'lastRunStatus',
    meta: {
      class: {
        th: 'hidden sm:table-cell w-28',
        td: 'hidden sm:table-cell w-28'
      }
    },
    header: t('pages.crawlers.blueprints.table.status'),
    cell: ({ row }) =>
      h(
        resolveComponent('UBadge'),
        {
          variant: 'soft',
          color: blueprintStatusColorGet(row.original.lastRunStatus)
        },
        () => blueprintStatusLabelGet(row.original.lastRunStatus)
      )
  },
  {
    accessorKey: 'times',
    meta: {
      class: {
        th: 'hidden lg:table-cell 3xl:hidden w-56',
        td: 'hidden lg:table-cell 3xl:hidden w-56'
      }
    },
    header: t('common.labels.time'),
    cell: ({ row }) => {
      const value = String(row.original.lastRunAt ?? '').trim();
      const hasValue = !lastRunAtIsEmpty(value);

      return h('div', { class: 'flex flex-col gap-1.5 text-xs' }, [
        h('div', { class: 'flex items-center gap-1 text-xs' }, [h('span', { class: 'shrink-0 text-muted' }, `${t('pages.crawlers.blueprints.table.lastRunAt')}：`), hasValue ? h(Datetime, { value, class: 'w-auto max-w-full text-xs' }) : h('span', { class: 'text-muted' }, t('common.labels.none'))]),
        h('div', { class: 'flex items-center gap-1 text-xs' }, [h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.updatedAt')}：`), h(Datetime, { value: row.original.updatedAt, class: 'w-auto max-w-full text-xs' })]),
        h('div', { class: 'flex items-center gap-1 text-xs' }, [h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.createdAt')}：`), h(Datetime, { value: row.original.createdAt, class: 'w-auto max-w-full text-xs' })])
      ]);
    }
  },
  {
    accessorKey: 'lastRunAt',
    meta: {
      class: {
        th: 'hidden 3xl:table-cell w-36 text-right',
        td: 'hidden 3xl:table-cell w-36 text-right'
      }
    },
    header: t('pages.crawlers.blueprints.table.lastRunAt'),
    cell: ({ row }) => {
      const value = String(row.original.lastRunAt ?? '').trim();
      if (lastRunAtIsEmpty(value)) {
        return h('span', { class: 'text-muted' }, t('common.labels.none'));
      }

      return h(Datetime, { class: 'w-auto max-w-full text-sm', value });
    }
  },
  {
    accessorKey: 'updatedAt',
    meta: {
      class: {
        th: 'hidden 3xl:table-cell w-36 text-right',
        td: 'hidden 3xl:table-cell w-36 text-right'
      }
    },
    header: () => {
      const isSorted = currentOrderByGet() === 'updated' ? (currentOrderDirGet() === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('common.datetimes.updatedAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('updated') });
    },
    cell: ({ row }) => h(Datetime, { class: 'w-auto max-w-full text-sm', value: row.original.updatedAt })
  },
  {
    accessorKey: 'createdAt',
    meta: {
      class: {
        th: 'hidden 3xl:table-cell w-36 text-right',
        td: 'hidden 3xl:table-cell w-36 text-right'
      }
    },
    header: () => {
      const isSorted = currentOrderByGet() === 'created' ? (currentOrderDirGet() === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('common.datetimes.createdAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('created') });
    },
    cell: ({ row }) => h(Datetime, { class: 'w-auto max-w-full text-sm', value: row.original.createdAt })
  },
  {
    accessorKey: 'enabled',
    meta: {
      class: {
        td: 'w-16'
      }
    },
    header: t('common.labels.enabled'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.enabled,
        disabled: stateBlueprintEnabledSavingIds.value[row.original.id] === true,
        'onUpdate:modelValue': (value: boolean) => {
          void handleToggleCrawlerEnabled(row.original, value);
        }
      })
  },
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-[8.75rem] text-right',
        td: 'w-[8.75rem] text-right'
      }
    },
    enableHiding: false,
    header: () => h('div', { class: 'w-full text-right' }, t('common.labels.actions')),
    cell: ({ row }) =>
      h('div', { class: 'flex flex-nowrap items-center justify-end gap-1' }, [
        h(
          UButton,
          {
            color: 'neutral',
            variant: 'ghost',
            icon: 'i-lucide:play',
            ui: { leadingIcon: 'text-dimmed group-hover:text-muted' },
            onClick: () => {
              void handleOpenCrawlerExecution(row.original);
            }
          },
          () => t('pages.crawlers.blueprints.actions.execute')
        ),
        h(
          UButton,
          {
            color: 'neutral',
            variant: 'ghost',
            icon: 'i-lucide:edit',
            ui: { leadingIcon: 'text-dimmed group-hover:text-muted' },
            onClick: () => handleOpenCrawlerEditor(row.original)
          },
          () => t('common.actions.edit')
        ),
        h(
          UPopover,
          {
            open: stateDeletePopoverOpenId.value === row.original.id && stateDeletePopoverSource.value === 'actions',
            'onUpdate:open': (value: boolean) => {
              if (!value && stateDeletePopoverOpenId.value === row.original.id && stateDeletePopoverSource.value === 'actions') {
                stateDeletePopoverOpenId.value = null;
                stateDeletePopoverSource.value = null;
              }
            },
            arrow: true,
            content: { side: 'top', align: 'end', sideOffset: 8 },
            ui: { content: 'p-3.5 w-70' }
          },
          {
            default: () =>
              h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                icon: 'i-lucide:trash-2',
                class: 'hover:text-error',
                ui: { leadingIcon: 'text-dimmed group-hover:text-error' },
                onClick: () => {
                  stateDeletePopoverOpenId.value = row.original.id;
                  stateDeletePopoverSource.value = 'actions';
                }
              }),
            content: () =>
              h('div', { class: 'flex flex-col gap-2.5' }, [
                h('div', { class: 'flex items-center gap-2 text-highlighted text-sm font-medium' }, [h('i', { class: 'i-lucide:trash-2 w-4 h-4 text-warning' }), h('span', {}, '删除爬虫')]),
                h('div', { class: 'text-muted text-xs leading-5' }, t('pages.crawlers.blueprints.actions.deleteConfirm', { name: row.original.name || '-' })),
                h('div', { class: 'flex items-center justify-end gap-2 pt-1' }, [
                  h(UButton, {
                    color: 'neutral',
                    variant: 'outline',
                    size: 'xs',
                    label: t('common.actions.cancel'),
                    onClick: () => {
                      stateDeletePopoverOpenId.value = null;
                      stateDeletePopoverSource.value = null;
                    }
                  }),
                  h(UButton, {
                    color: 'error',
                    variant: 'solid',
                    size: 'xs',
                    label: t('common.actions.confirm'),
                    onClick: () => {
                      void handleDeleteCrawler(row.original);
                    }
                  })
                ])
              ])
          }
        )
      ])
  }
];
</script>
