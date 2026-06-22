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

/**
 * 组件：开关。
 */
const USwitch = resolveComponent('USwitch');

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 路由。
 */
const route = useRoute();

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
  immediate: false,
  datas: buildBlueprintQueryFromRoute()
});

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
  { immediate: true }
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
    isEnabled: Boolean(item.isEnabled),
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
  const normalized = String(value ?? '').trim().toLowerCase();
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
    isEnabled: Boolean(row.isEnabled)
  };
  stateCodeSlideoverOpen.value = true;
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
        td: 'w-18 align-top'
      }
    },
    header: () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        size: 'sm',
        class: '-ml-2',
        icon: currentOrderByGet() === 'id' && currentOrderDirGet() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow',
        label: 'ID',
        onClick: () => toggleSort('id')
      }),
    cell: ({ row }) => h('span', { class: 'text-muted text-xs sm:text-sm' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'summaryMobile',
    meta: {
      class: {
        th: 'sm:hidden',
        td: 'sm:hidden align-top whitespace-normal py-3'
      }
    },
    header: t('pages.crawlers.blueprints.table.name'),
    cell: ({ row }) => {
      const lastRunAt = String(row.original.lastRunAt ?? '').trim();
      const hasLastRunAt = !lastRunAtIsEmpty(lastRunAt);

      return h('div', { class: 'flex min-w-0 flex-col gap-2' }, [
        h('div', { class: 'space-y-1' }, [
          h('div', { class: 'text-default break-words text-sm font-medium' }, row.original.name || '-'),
          h('div', { class: 'text-muted break-words text-xs leading-5' }, row.original.description || t('common.labels.none'))
        ]),
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
              color: row.original.isEnabled ? 'success' : 'neutral'
            },
            () => (row.original.isEnabled ? t('common.labels.enabled') : t('common.labels.disabled'))
          )
        ]),
        h('div', { class: 'flex flex-col gap-1.5 text-xs' }, [
          h('div', { class: 'flex items-center gap-1 text-muted' }, [h('span', { class: 'shrink-0' }, `${t('pages.crawlers.blueprints.table.lastRunAt')}：`), hasLastRunAt ? h(Datetime, { value: lastRunAt, class: 'w-auto max-w-full' }) : h('span', t('common.labels.none'))]),
          h('div', { class: 'flex items-center gap-1 text-muted' }, [h('span', { class: 'shrink-0' }, `${t('common.datetimes.updatedAt')}：`), h(Datetime, { value: row.original.updatedAt, class: 'w-auto max-w-full' })]),
          h('div', { class: 'flex items-center gap-1 text-muted' }, [h('span', { class: 'shrink-0' }, `${t('common.datetimes.createdAt')}：`), h(Datetime, { value: row.original.createdAt, class: 'w-auto max-w-full' })])
        ]),
        h(
          UButton,
          {
            color: 'primary',
            variant: 'soft',
            size: 'xs',
            icon: 'i-lucide:edit',
            class: 'mt-1 self-start',
            onClick: () => handleOpenCrawlerEditor(row.original)
          },
          () => t('common.actions.edit')
        )
      ]);
    }
  },
  {
    accessorKey: 'nameCompact',
    meta: {
      class: {
        th: 'hidden sm:table-cell lg:hidden w-[20rem]',
        td: 'hidden sm:table-cell lg:hidden align-top py-3 w-[20rem]'
      }
    },
    header: t('pages.crawlers.blueprints.table.name'),
    cell: ({ row }) => {
      const lastRunAt = String(row.original.lastRunAt ?? '').trim();
      const hasLastRunAt = !lastRunAtIsEmpty(lastRunAt);

      return h('div', { class: 'flex min-w-0 flex-col gap-2 py-1' }, [
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'truncate text-sm font-medium text-highlighted' }, row.original.name || '-'),
          h('div', { class: 'text-muted mt-1 line-clamp-2 text-xs leading-5' }, row.original.description || t('common.labels.none'))
        ]),
        h('div', { class: 'flex flex-wrap items-center gap-2 text-xs text-muted' }, [
          h(
            UBadge,
            {
              variant: 'soft',
              color: blueprintStatusColorGet(row.original.lastRunStatus)
            },
            () => blueprintStatusLabelGet(row.original.lastRunStatus)
          ),
          h('span', row.original.isEnabled ? t('common.labels.enabled') : t('common.labels.disabled')),
          h('span', '·'),
          hasLastRunAt ? h(Datetime, { value: lastRunAt }) : h('span', t('common.labels.none'))
        ]),
        h(
          UButton,
          {
            color: 'primary',
            variant: 'ghost',
            size: 'xs',
            icon: 'i-lucide:edit',
            class: 'mt-1 self-start -ml-2',
            onClick: () => handleOpenCrawlerEditor(row.original)
          },
          () => t('common.actions.edit')
        )
      ]);
    }
  },
  {
    accessorKey: 'name',
    meta: {
      class: {
        th: 'hidden lg:table-cell w-[24rem] 4xl:w-[30rem]',
        td: 'hidden lg:table-cell w-[24rem] 4xl:w-[30rem] align-top py-3'
      }
    },
    header: t('pages.crawlers.blueprints.table.name'),
    cell: ({ row }) =>
      h('div', { class: 'flex min-w-0 flex-col gap-1 py-1' }, [
        h('div', { class: 'truncate text-sm font-medium text-highlighted' }, row.original.name || '-'),
        h('div', { class: 'text-muted line-clamp-2 text-xs leading-5' }, row.original.description || t('common.labels.none'))
      ])
  },
  {
    accessorKey: 'lastRunStatus',
    meta: {
      class: {
        th: 'hidden sm:table-cell w-28',
        td: 'hidden sm:table-cell align-top w-28'
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
    accessorKey: 'isEnabled',
    meta: {
      class: {
        th: 'hidden md:table-cell w-20',
        td: 'hidden md:table-cell align-top w-20'
      }
    },
    header: t('common.labels.enabled'),
    cell: ({ row }) => h(USwitch, { modelValue: row.original.isEnabled, disabled: true })
  },
  {
    accessorKey: 'times',
    meta: {
      class: {
        th: 'hidden lg:table-cell 3xl:hidden w-56',
        td: 'hidden lg:table-cell 3xl:hidden w-56 align-top text-default'
      }
    },
    header: t('common.labels.time'),
    cell: ({ row }) => {
      const value = String(row.original.lastRunAt ?? '').trim();
      const hasValue = !lastRunAtIsEmpty(value);

      return h('div', { class: 'flex flex-col gap-1.5' }, [
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('pages.crawlers.blueprints.table.lastRunAt')}：`),
          hasValue ? h(Datetime, { value, class: 'w-auto max-w-full' }) : h('span', { class: 'text-muted' }, t('common.labels.none'))
        ]),
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.updatedAt')}：`),
          h(Datetime, { value: row.original.updatedAt, class: 'w-auto max-w-full' })
        ]),
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.createdAt')}：`),
          h(Datetime, { value: row.original.createdAt, class: 'w-auto max-w-full' })
        ])
      ]);
    }
  },
  {
    accessorKey: 'lastRunAt',
    meta: {
      class: {
        th: 'hidden 3xl:table-cell w-36 text-right',
        td: 'hidden 3xl:table-cell w-36 align-top text-right'
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
        td: 'hidden 3xl:table-cell w-36 align-top text-right'
      }
    },
    header: () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        size: 'sm',
        class: '-ml-2',
        icon: currentOrderByGet() === 'updated' && currentOrderDirGet() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow',
        label: t('common.datetimes.updatedAt'),
        onClick: () => toggleSort('updated')
      }),
    cell: ({ row }) => h(Datetime, { class: 'w-auto max-w-full text-sm', value: row.original.updatedAt })
  },
  {
    accessorKey: 'createdAt',
    meta: {
      class: {
        th: 'hidden 4xl:table-cell w-36 text-right',
        td: 'hidden 4xl:table-cell w-36 align-top text-right'
      }
    },
    header: () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        size: 'sm',
        class: '-ml-2',
        icon: currentOrderByGet() === 'created' && currentOrderDirGet() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow',
        label: t('common.datetimes.createdAt'),
        onClick: () => toggleSort('created')
      }),
    cell: ({ row }) => h(Datetime, { class: 'w-auto max-w-full text-sm', value: row.original.createdAt })
  },
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-24 text-center',
        td: 'w-24 align-top'
      }
    },
    enableHiding: false,
    header: () => h('div', { class: 'w-full text-center' }, t('common.labels.actions')),
    cell: ({ row }) =>
      h('div', { class: 'flex w-full justify-center pt-1' }, [
        h(
          UButton,
          {
            color: 'primary',
            variant: 'ghost',
            size: 'sm',
            icon: 'i-lucide:edit',
            onClick: () => handleOpenCrawlerEditor(row.original)
          },
          () => t('common.actions.edit')
        )
      ])
  }
];
</script>
