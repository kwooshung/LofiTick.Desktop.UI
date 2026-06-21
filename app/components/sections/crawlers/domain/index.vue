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

    <div v-if="computedBlueprintRows.length === 0 && !stateLoading" class="flex flex-1 items-center justify-center py-10">
      <UEmpty icon="i-lucide:workflow" :title="t('pages.crawlers.blueprints.empty.title')" :description="t('pages.crawlers.blueprints.empty.description')" />
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
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 路由。
 */
const route = useRoute();

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
const { datas: stateDetailDatas } = await useApi<IQueryResultCrawlerTargetRow>(
  `crawlers/targets/${encodeURIComponent(computedDomain.value)}`,
  {
    immediate: true
  }
);

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
  const orderDir = String(route.query.order_dir ?? '').trim().toLowerCase();
  return orderDir === 'asc' ? 'asc' : 'desc';
};

/**
 * 函数：构建蓝图查询参数。
 */
const buildBlueprintQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {
    targetId: String(computedTargetId.value),
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
const { datas: stateDatas, loading: stateLoading, refreshDebounced: refreshListDebounced } = await useApi<IQueryResultCrawlerBlueprintSummaryPage>('crawlers/blueprints', {
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
    cell: ({ row }) => h('span', { class: 'text-muted' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'name',
    header: t('pages.crawlers.blueprints.table.name'),
    cell: ({ row }) =>
      h('div', { class: 'flex min-w-0 flex-col gap-1 py-1' }, [
        h('div', { class: 'truncate text-sm font-medium text-highlighted' }, row.original.name || '-'),
        h('div', { class: 'truncate text-xs text-muted' }, row.original.description || t('common.labels.none'))
      ])
  },
  {
    accessorKey: 'lastRunStatus',
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
    accessorKey: 'lastRunAt',
    header: t('pages.crawlers.blueprints.table.lastRunAt'),
    cell: ({ row }) => {
      const value = String(row.original.lastRunAt ?? '').trim();
      if (value === '') {
        return h('span', { class: 'text-muted' }, '-');
      }

      return h(Datetime, { value });
    }
  },
  {
    accessorKey: 'isEnabled',
    header: t('pages.crawlers.blueprints.table.enabled'),
    cell: ({ row }) => h(USwitch, { modelValue: row.original.isEnabled, disabled: true })
  },
  {
    accessorKey: 'updatedAt',
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
    cell: ({ row }) => h(Datetime, { value: row.original.updatedAt })
  },
  {
    accessorKey: 'createdAt',
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
    cell: ({ row }) => h(Datetime, { value: row.original.createdAt })
  }
];
</script>
