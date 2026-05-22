<template>
  <DashboardPage>
    <div v-if="computedRows.length === 0" class="flex min-h-0 flex-1 items-center justify-center py-8">
      <UEmpty icon="i-lucide:inbox" :title="t('pages.hotsearch.data.empty.title')" :description="t('pages.hotsearch.data.empty.description')" />
    </div>

    <div v-else class="flex w-full flex-1 gap-1">
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

    <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ t('components.pagination.total', { total: Number(datas?.total ?? 0) }) }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { h } from 'vue';

import type { IHotsearchPlatformSummaryPage, IHotsearchPlatformSummaryRow } from '@@/shared/types/index.types';

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

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
 * 函数：获取当前默认日期。
 * @returns {string} YYYY-MM-DD。
 */
const currentDateGet = (): string => new Date().toISOString().slice(0, 10);

/**
 * 函数：获取当前生效日期。
 * @returns {string} YYYY-MM-DD。
 */
const selectedDateGet = (): string => hotsearchQueryStringGet(route.query.date) || currentDateGet();

/**
 * 函数：构建接口查询参数。
 * @returns {Record<string, string>} 查询参数。
 */
const buildApiQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {};
  query.date = selectedDateGet();

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

  const pagesize = hotsearchQueryStringGet(route.query.pagesize);
  if (pagesize !== '') {
    query.pagesize = pagesize;
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
  () => {
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  },
  {
    immediate: true
  }
);

/**
 * 计算属性：平台行。
 */
const computedRows = computed(() => datas.value?.rows ?? []);

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
    pagesize: hotsearchQueryStringGet(route.query.pagesize) || undefined,
    platform: platformType || undefined
  }
});

/**
 * 表格：列定义。
 */
const columns: TableColumn<IHotsearchPlatformSummaryRow>[] = [
  {
    accessorKey: 'platformType',
    header: t('pages.hotsearch.platforms.table.platform'),
    cell: ({ row }) =>
      h(
        UButton,
        {
          color: 'neutral',
          variant: 'link',
          class: 'p-0 h-auto min-h-0 justify-start text-left hover:underline',
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
        th: 'w-28 text-right',
        td: 'w-28 text-right'
      }
    }
  }
];
</script>
