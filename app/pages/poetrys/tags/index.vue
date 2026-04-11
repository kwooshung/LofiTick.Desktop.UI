<template>
  <DashboardPage>
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedProetryTagsDatas"
          :loading="loading"
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
      <div class="muted text-sm">{{ t('components.pagination.total', { total: Number(datas?.total ?? 0) }) }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

import type { IQueryResultPoetryTagsSummaryPage } from '@@/shared/types/pages/poetrys/index.types';

/**
 * 组件：Nuxt 时间显示组件
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：按钮
 */
const UButton = resolveComponent('UButton');
/**
 * 组件：分页
 */
const UPagination = resolveComponent('UPagination');

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 路由
 */
const route = useRoute();

/**
 * 函数：从路由查询参数构建接口查询参数
 * @returns {Record<string,string|string[]>} 查询参数
 */
const buildApiQueryFromRoute = (): Record<string, string | string[]> => {
  const query: Record<string, string | string[]> = {};

  // 工具：读取数组参数
  const asArray = (v: unknown): string[] => (Array.isArray(v) ? v.map((i) => String(i)) : v != null ? [String(v)] : []);

  // 多选 ID 参数
  const dynastyId = asArray(route.query.tag_ids);
  if (dynastyId.length > 0) {
    query.tag_ids = dynastyId;
  }

  if (typeof route.query.page !== 'undefined') {
    query.page = String(route.query.page);
  }
  if (typeof route.query.pagesize !== 'undefined') {
    query.pagesize = String(route.query.pagesize);
  }

  // 排序：orderBy（updated/created）与 order_dir（asc/desc）
  if (typeof route.query.order_by !== 'undefined') {
    const by = String(route.query.order_by);
    if (by === 'id' || by === 'count' || by === 'updated' || by === 'created') {
      query.order_by = by;
    }
  }
  if (typeof route.query.order_dir !== 'undefined') {
    const dir = String(route.query.order_dir).toLowerCase();
    if (dir === 'asc' || dir === 'desc') {
      query.order_dir = dir;
    }
  }

  return query;
};

/**
 * 函数：导航到单一筛选（保留 pagesize/enabled/isAnd/title/content），移除 page
 * @param {'tag_ids'} key 筛选键
 * @param {number | string} value 筛选值
 */
const navigateWithSingleFilter = (key: 'tag_ids', value: number | string) => {
  const q: Record<string, string | string[]> = {};
  // 保留必要参数
  if (typeof route.query.pagesize !== 'undefined') {
    q.pagesize = String(route.query.pagesize);
  }
  // 设置单选筛选
  q[key] = String(value);

  // 跳转（移除 page，使用 replace 以清爽历史栈）
  navigateTo({ path: '/poetrys', query: q });
};

/**
 * 排序：切换指定字段（互斥）
 * @param {'updated'|'created'} field 排序字段
 */
const toggleSort = (field: 'id' | 'count' | 'updated' | 'created') => {
  // 默认按照编号倒序
  const currentBy = String(route.query.order_by || 'id');
  const currentDir = String(route.query.order_dir || 'desc');
  const nextBy = field;
  const nextDir = currentBy === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'desc';
  const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
  q.order_by = nextBy;
  q.order_dir = nextDir;
  navigateTo({ path: '/poetrys/tags', query: q });
};

/**
 * API：诗词搜索
 */
const { datas, loading, refreshDebounced } = await useApi<IQueryResultPoetryTagsSummaryPage>('poetrys/tags', { datas: buildApiQueryFromRoute(), immediate: true });

/**
 * 计算属性：直接映射成表格需要的格式
 */
const computedProetryTagsDatas = computed<IPageTableColumnPoetryTags[]>(() => {
  if (!datas.value || !datas.value.rows || datas.value.rows.length === 0) {
    return [];
  }

  return datas.value.rows.map((item) => ({
    id: item.id ?? 0,
    name: String(item.name ?? 'unknown'),
    count: Number(item.count ?? 0),
    times: {
      updated: item.updated ? String(item.updated) : new Date().toISOString(),
      created: item.created ? String(item.created) : new Date().toISOString()
    }
  }));
});

/**
 * 计算属性：当前页（与路由同步）
 */
const computedPage = computed<number>({
  get: () => {
    const str = route.query.page as string | undefined;
    const num = parseInt(str ?? '', 10);
    return Number.isFinite(num) && num > 0 ? num : 1;
  },
  set: (value: number) => {
    const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
    q.page = String(Math.max(1, value));
    navigateTo({ path: route.path, query: q });
  }
});

/**
 * 计算属性：每页数量（Number，避免字符串警告）
 */
const computedItemsPerPage = computed<number>(() => {
  const str = route.query.pagesize as string | undefined;
  const parsed = parseInt(str ?? '', 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  const apiSize = Number(datas.value?.pageSize ?? 20);
  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 监听：查询参数变化时刷新列表（防抖）
 */
watch(
  () => route.query,
  () => {
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  }
);

/**
 * 常量：表格列定义
 */
const columns: TableColumn<IPageTableColumnPoetryTags>[] = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        td: 'w-15'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'id' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.poetrys.result.table.id'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('id') });
    },
    cell: ({ row }) => row.original.id.toString().padStart(5, '0')
  },
  {
    accessorKey: 'name',
    meta: {
      class: {
        th: 'w-50',
        td: 'w-50'
      }
    },
    header: t('pages.poetrys.result.table.tags'),
    cell: ({ row }) => h(UButton, { color: 'neutral', variant: 'link', label: row.original.name, class: 'p-0 text-default hover:text-primary hover:underline', onClick: () => navigateWithSingleFilter('tag_ids', row.original.id) })
  },
  {
    accessorKey: 'count',
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'count' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.poetrys.result.table.count'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('count') });
    }
  },
  {
    accessorKey: 'time',
    meta: {
      class: {
        th: 'text-right',
        td: 'w-30 text-right'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'updated' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.poetrys.result.table.updatedAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('updated') });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'self-end w-auto max-w-full text-sm',
        datetime: row.original.times.updated,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
  },
  {
    accessorKey: 'time',
    meta: {
      class: {
        th: 'text-right',
        td: 'w-30 text-right'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'created' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.poetrys.result.table.createdAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('created') });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'self-end w-auto max-w-full text-sm',
        datetime: row.original.times.created,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
  }
];
</script>
