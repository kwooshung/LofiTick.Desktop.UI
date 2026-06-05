<template>
  <DashboardPage class="min-h-full">
    <div ref="refHotsearchPlatformPanelTop" class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedRows"
          :loading="loading"
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

    <div v-if="computedHasPagination" class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ t('components.pagination.total', { total: Number(datas?.total ?? 0) }) }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date';
import type { TableColumn } from '@nuxt/ui';

import type { IHotsearchPlatformSummaryPage, IHotsearchPlatformSummaryRow } from '@@/shared/types/index.types';

/**
 * 组件：时间。
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：链接。
 */
const ULink = resolveComponent('ULink');

/**
 * 组件：分页。
 */
const UPagination = resolveComponent('UPagination');

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 路由：当前路由。
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
 * 引用：热搜平台面板顶部锚点。
 */
const refHotsearchPlatformPanelTop = useTemplateRef('refHotsearchPlatformPanelTop');

/**
 * 函数：获取当前默认日期。
 * @returns {string} YYYY-MM-DD。
 */
const currentDateGet = (): string => {
  const value = today(getLocalTimeZone());

  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
};

/**
 * 函数：获取当前生效日期。
 * @returns {string} YYYY-MM-DD。
 */
const selectedDateGet = (): string => hotsearchQueryStringGet(route.query.date) || currentDateGet();

/**
 * 函数：获取当前查询时区。
 * @returns {string} IANA 时区名称。
 */
const currentTimezoneGet = (): string => hotsearchLocalTimezoneGet();

/**
 * 函数：获取当前生效分页大小。
 * @returns {string} 分页大小文本。
 */
const currentPageSizeGet = (): string => {
  const pagesize = hotsearchQueryStringGet(route.query.pagesize);

  if (pagesize !== '') {
    return pagesize;
  }

  return String(getPageSizeByCookieParsed(pagesizesCookie.value, 'hotsearch'));
};

/**
 * 函数：构建接口查询参数。
 * @returns {Record<string, string>} 查询参数。
 */
const buildApiQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {};
  query.date = selectedDateGet();
  query.timezone = currentTimezoneGet();

  const keyword = hotsearchQueryStringGet(route.query.keyword);
  if (keyword !== '') {
    query.keyword = keyword;
  }

  const categoryKey = hotsearchQueryStringGet(route.query.category_key);
  if (categoryKey !== '') {
    query.category_key = categoryKey;
  }

  const page = hotsearchQueryStringGet(route.query.page);
  if (page !== '') {
    query.page = page;
  }

  query.pagesize = currentPageSizeGet();

  const orderBy = hotsearchQueryStringGet(route.query.order_by);
  if (orderBy !== '') {
    query.order_by = orderBy;
  }

  const orderDir = hotsearchQueryStringGet(route.query.order_dir);
  if (orderDir !== '') {
    query.order_dir = orderDir;
  }

  return query;
};

/**
 * API：热搜平台统计分页。
 */
const { datas, loading, refreshDebounced } = await useApi<IHotsearchPlatformSummaryPage>('hotsearch/platforms', {
  datas: buildApiQueryFromRoute(),
  immediate: true
});

watch(
  () => route.query,
  async () => {
    await nextTick();
    refHotsearchPlatformPanelTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  }
);

/**
 * 函数：获取热搜统计展示编号。
 * @param {number} id 原始编号。
 * @returns {string} 补零后的展示编号。
 */
const hotsearchSummaryDisplayIdGet = (id: number): string => String(Math.abs(Number(id))).padStart(4, '0');

/**
 * 函数：将时间字符串归一为 Datetime 可消费值。
 * @param {string} value 原始时间字符串。
 * @returns {string} ISO 风格时间字符串。
 */
const hotsearchDatetimeValueGet = (value: string): string => {
  const text = String(value ?? '').trim();

  if (text === '') {
    return new Date(0).toISOString();
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(text)) {
    return text.replace(' ', 'T');
  }

  return text;
};

/**
 * 计算属性：平台行。
 */
const computedRows = computed(() => datas.value?.rows ?? []);

/**
 * 计算属性：当前是否需要显示分页栏。
 */
const computedHasPagination = computed(() => Number(datas.value?.total ?? 0) > 0);

/**
 * 计算属性：当前排序字段。
 */
const computedSortBy = computed(() => {
  const value = hotsearchQueryStringGet(route.query.order_by);

  return value === 'id' || value === 'created_at' ? value : 'updated_at';
});

/**
 * 计算属性：当前排序方向。
 */
const computedSortDirection = computed(() => {
  const value = hotsearchQueryStringGet(route.query.order_dir).toLowerCase();

  return value === 'asc' ? 'asc' : 'desc';
});

/**
 * 计算属性：当前页。
 */
const computedPage = computed<number>({
  get: () => {
    const parsed = parseInt(String(route.query.page ?? ''), 10);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  },
  set: (value: number) => {
    navigateTo({
      path: route.path,
      query: {
        ...route.query,
        page: String(Math.max(1, value))
      }
    });
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

  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'hotsearch');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }

  const apiSize = Number(datas.value?.pageSize ?? 20);

  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 函数：构建跳回数据页的位置。
 * @param {string} platformType 平台类型。
 * @returns {{ path: string; query: Record<string, string | undefined> }} 跳转位置。
 */
const buildDataLocation = (platformType: string): { path: string; query: Record<string, string | undefined> } => ({
  path: localePath('/hotsearch'),
  query: {
    date: selectedDateGet(),
    keyword: hotsearchQueryStringGet(route.query.keyword) || undefined,
    category_key: hotsearchQueryStringGet(route.query.category_key) || undefined,
    pagesize: currentPageSizeGet(),
    platform: platformType || undefined
  }
});

/**
 * 函数：切换排序字段。
 * @param {'id' | 'updated_at' | 'created_at'} field 排序字段。
 * @returns {void}
 */
const toggleSort = (field: 'id' | 'updated_at' | 'created_at'): void => {
  const nextDirection = computedSortBy.value === field && computedSortDirection.value === 'asc' ? 'desc' : 'asc';

  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      order_by: field,
      order_dir: nextDirection,
      page: undefined
    }
  });
};

/**
 * 表格：列定义。
 */
const columns: TableColumn<IHotsearchPlatformSummaryRow>[] = [
  {
    accessorKey: 'platform',
    header: () => {
      const isSorted = computedSortBy.value === 'id' ? computedSortDirection.value : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('pages.hotsearch.platforms.table.no'),
        icon,
        class: '-mx-2.5 font-semibold',
        onClick: () => toggleSort('id')
      });
    },
    cell: ({ row }) => h('div', { class: 'text-sm text-toned' }, hotsearchSummaryDisplayIdGet(row.original.platform)),
    meta: {
      class: {
        th: 'w-22',
        td: 'w-22'
      }
    }
  },
  {
    accessorKey: 'platformType',
    header: t('pages.hotsearch.platforms.table.platform'),
    cell: ({ row }) =>
      h(
        ULink,
        {
          raw: true,
          class: 'p-0 whitespace-normal break-words no-underline hover:underline',
          to: buildDataLocation(row.original.platformType)
        },
        () => t(`components.hotsearch.platform.${row.original.platformType}`)
      )
  },
  {
    accessorKey: 'count',
    header: t('pages.hotsearch.platforms.table.count'),
    cell: ({ row }) => h('div', { class: 'text-sm text-default' }, row.original.count.toLocaleString()),
    meta: {
      class: {
        th: 'w-24 text-right',
        td: 'w-24 text-right'
      }
    }
  },
  {
    accessorKey: 'updatedAt',
    header: () => {
      const isSorted = computedSortBy.value === 'updated_at' ? computedSortDirection.value : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('pages.hotsearch.platforms.table.updatedAt'),
        icon,
        class: '-mx-2.5 font-semibold',
        onClick: () => toggleSort('updated_at')
      });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'w-auto max-w-full text-sm',
        datetime: hotsearchDatetimeValueGet(row.original.updatedAt)
      }),
    meta: {
      class: {
        th: 'w-40',
        td: 'w-40'
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: () => {
      const isSorted = computedSortBy.value === 'created_at' ? computedSortDirection.value : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('pages.hotsearch.platforms.table.createdAt'),
        icon,
        class: '-mx-2.5 font-semibold',
        onClick: () => toggleSort('created_at')
      });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'w-auto max-w-full text-sm',
        datetime: hotsearchDatetimeValueGet(row.original.createdAt)
      }),
    meta: {
      class: {
        th: 'w-40',
        td: 'w-40'
      }
    }
  }
];
</script>
