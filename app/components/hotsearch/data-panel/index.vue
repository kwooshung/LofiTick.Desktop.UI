<template>
  <DashboardPage class="gap-4">
    <div class="flex min-h-0 flex-1 flex-col gap-4">
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <UButton :color="computedSelectedPlatformType === '' ? 'primary' : 'neutral'" :variant="computedSelectedPlatformType === '' ? 'solid' : 'soft'" size="sm" @click="handlePlatformSelect('')">
            {{ t('pages.hotsearch.data.allPlatforms') }}
          </UButton>
          <UButton
            v-for="item in computedPlatformRows"
            :key="item.platformType"
            :color="computedSelectedPlatformType === item.platformType ? 'primary' : 'neutral'"
            :variant="computedSelectedPlatformType === item.platformType ? 'solid' : 'soft'"
            size="sm"
            @click="handlePlatformSelect(item.platformType)"
          >
            {{ platformSummaryLabelGet(item) }}
          </UButton>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton :color="computedSelectedCategoryKey === '' ? 'primary' : 'neutral'" :variant="computedSelectedCategoryKey === '' ? 'solid' : 'soft'" size="sm" @click="handleCategorySelect('')">
            {{ t('pages.hotsearch.data.allTags') }}
          </UButton>
          <UButton v-for="item in computedTagRows" :key="item.categoryKey" :color="computedSelectedCategoryKey === item.categoryKey ? 'primary' : 'neutral'" :variant="computedSelectedCategoryKey === item.categoryKey ? 'solid' : 'soft'" size="sm" @click="handleCategorySelect(item.categoryKey)">
            {{ tagSummaryLabelGet(item) }}
          </UButton>
        </div>
      </div>

      <div v-if="computedRows.length === 0" class="flex min-h-0 flex-1 items-center justify-center py-8">
        <UEmpty icon="i-lucide:inbox" :title="t('pages.hotsearch.data.empty.title')" :description="t('pages.hotsearch.data.empty.description')" />
      </div>

      <div v-else class="flex min-h-0 w-full flex-1 gap-1">
        <div class="flex-1">
          <UTable
            :columns="columns"
            :data="computedRows"
            :loading="computedLoading"
            sticky
            class="w-full min-w-0"
            :ui="{
              base: 'w-full table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
              td: 'border-b border-default align-top',
              separator: 'h-0'
            }"
          />
        </div>
      </div>
    </div>

    <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ t('components.pagination.total', { total: Number(stateHotsearchRowsRemote?.total ?? 0) }) }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(stateHotsearchRowsRemote?.total ?? 0)" />
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { h } from 'vue';

import type { IHotsearchDataPage, IHotsearchDataRow, IHotsearchPlatformSummaryPage, IHotsearchPlatformSummaryRow, IHotsearchTagSummaryPage, IHotsearchTagSummaryRow } from '@@/shared/types/index.types';

/**
 * 组件：时间。
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：徽章。
 */
const UBadge = resolveComponent('UBadge');

/**
 * 组件：分页。
 */
const UPagination = resolveComponent('UPagination');

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 路由：当前页面路由。
 */
const route = useRoute();

/**
 * Hook：Tauri 运行环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 窗口能力。
 */
const { openExternalUrl } = useTauriWindow();

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
 * 函数：从路由构建热搜数据分页查询。
 * @returns {Record<string, string>} 接口查询参数。
 */
const buildRowsQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {};
  query.date = selectedDateGet();

  const keyword = hotsearchQueryStringGet(route.query.keyword);
  if (keyword !== '') {
    query.keyword = keyword;
  }

  const platform = hotsearchQueryStringGet(route.query.platform);
  if (platform !== '') {
    query.platform = platform;
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
 * 函数：从路由构建平台统计查询。
 * @returns {Record<string, string>} 接口查询参数。
 */
const buildPlatformsQueryFromRoute = (): Record<string, string> => {
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

  query.page = '1';
  query.pagesize = '100';

  return query;
};

/**
 * 函数：从路由构建标签统计查询。
 * @returns {Record<string, string>} 接口查询参数。
 */
const buildTagsQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {};
  query.date = selectedDateGet();

  const keyword = hotsearchQueryStringGet(route.query.keyword);
  if (keyword !== '') {
    query.keyword = keyword;
  }

  const platform = hotsearchQueryStringGet(route.query.platform);
  if (platform !== '') {
    query.platform = platform;
  }

  query.page = '1';
  query.pagesize = '100';

  return query;
};

/**
 * API：热搜数据分页。
 */
const {
  datas: stateHotsearchRowsRemote,
  loading: stateHotsearchRowsLoading,
  refreshDebounced: refreshHotsearchRowsGet
} = await useApi<IHotsearchDataPage>('hotsearch/rows', {
  datas: buildRowsQueryFromRoute(),
  immediate: true
});

/**
 * API：热搜平台统计。
 */
const {
  datas: stateHotsearchPlatformsRemote,
  loading: stateHotsearchPlatformsLoading,
  refreshDebounced: refreshHotsearchPlatformsGet
} = await useApi<IHotsearchPlatformSummaryPage>('hotsearch/platforms', {
  datas: buildPlatformsQueryFromRoute(),
  immediate: true
});

/**
 * API：热搜标签统计。
 */
const {
  datas: stateHotsearchTagsRemote,
  loading: stateHotsearchTagsLoading,
  refreshDebounced: refreshHotsearchTagsGet
} = await useApi<IHotsearchTagSummaryPage>('hotsearch/tags', {
  datas: buildTagsQueryFromRoute(),
  immediate: true
});

/**
 * 计算属性：当前日期。
 */
const computedSelectedDate = computed(() => selectedDateGet());

/**
 * 计算属性：当前平台类型。
 */
const computedSelectedPlatformType = computed(() => hotsearchQueryStringGet(route.query.platform));

/**
 * 计算属性：当前标签 key。
 */
const computedSelectedCategoryKey = computed(() => hotsearchQueryStringGet(route.query.category_key));

/**
 * 计算属性：当前排序字段。
 */
const computedSortBy = computed(() => {
  const value = hotsearchQueryStringGet(route.query.order_by);

  return value === 'popularity' || value === 'published_at' ? value : 'rank';
});

/**
 * 计算属性：当前排序方向。
 */
const computedSortDirection = computed(() => {
  const value = hotsearchQueryStringGet(route.query.order_dir).toLowerCase();

  return value === 'asc' ? 'asc' : 'desc';
});

/**
 * 计算属性：热搜数据行。
 */
const computedRows = computed(() => stateHotsearchRowsRemote.value?.rows ?? []);

/**
 * 计算属性：平台统计行。
 */
const computedPlatformRows = computed(() => stateHotsearchPlatformsRemote.value?.rows ?? []);

/**
 * 计算属性：标签统计行。
 */
const computedTagRows = computed(() => stateHotsearchTagsRemote.value?.rows ?? []);

/**
 * 计算属性：平台统计映射。
 */
const computedPlatformCountMap = computed(() => new Map(computedPlatformRows.value.map((item) => [item.platformType, item.count])));

/**
 * 计算属性：标签统计映射。
 */
const computedTagCountMap = computed(() => new Map(computedTagRows.value.map((item) => [item.categoryKey, item.count])));

/**
 * 计算属性：加载状态。
 */
const computedLoading = computed(() => stateHotsearchRowsLoading.value || stateHotsearchPlatformsLoading.value || stateHotsearchTagsLoading.value);

/**
 * 计算属性：当前页。
 */
const computedPage = computed<number>({
  get: () => {
    const str = route.query.page as string | undefined;
    const parsed = parseInt(str ?? '', 10);

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
  const str = route.query.pagesize as string | undefined;
  const parsed = parseInt(str ?? '', 10);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  const apiSize = Number(stateHotsearchRowsRemote.value?.pageSize ?? 20);

  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 函数：刷新当前页相关接口。
 * @returns {void}
 */
const refreshCurrentPanels = (): void => {
  refreshHotsearchRowsGet({ datas: buildRowsQueryFromRoute(), replace: true });
  refreshHotsearchPlatformsGet({ datas: buildPlatformsQueryFromRoute(), replace: true });
  refreshHotsearchTagsGet({ datas: buildTagsQueryFromRoute(), replace: true });
};

watch(
  () => route.query,
  () => {
    refreshCurrentPanels();
  },
  {
    immediate: true
  }
);

/**
 * 函数：获取热搜展示 ID。
 * @param {number} id 原始记录 ID。
 * @returns {string} 自动补零后的展示编号。
 */
const hotsearchDisplayIdGet = (id: number): string => String(Math.abs(Number(id))).padStart(4, '0');

/**
 * 函数：获取平台统计按钮文案。
 * @param {IHotsearchPlatformSummaryRow} item 平台统计行。
 * @returns {string} 文案。
 */
const platformSummaryLabelGet = (item: IHotsearchPlatformSummaryRow): string => `${t(`components.hotsearch.platform.${item.platformType}`)} (${item.count})`;

/**
 * 函数：获取标签统计按钮文案。
 * @param {IHotsearchTagSummaryRow} item 标签统计行。
 * @returns {string} 文案。
 */
const tagSummaryLabelGet = (item: IHotsearchTagSummaryRow): string => `${t(item.categoryKey)} (${item.count})`;

/**
 * 函数：渲染热搜标签内容。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} 标签单元格内容。
 */
const hotsearchTagCellRender = (item: IHotsearchDataRow) =>
  h(
    'div',
    { class: 'py-2' },
    h(
      UBadge,
      {
        color: computedSelectedCategoryKey.value === item.categoryKey ? 'primary' : 'neutral',
        variant: computedSelectedCategoryKey.value === item.categoryKey ? 'solid' : 'soft',
        class: 'rounded-md cursor-pointer',
        onClick: () => handleCategorySelect(item.categoryKey)
      },
      () => `${t(item.categoryKey)} (${computedTagCountMap.value.get(item.categoryKey) ?? 0})`
    )
  );

/**
 * 函数：渲染热搜平台内容。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} 平台单元格内容。
 */
const hotsearchPlatformCellRender = (item: IHotsearchDataRow) =>
  h(
    'div',
    { class: 'py-2' },
    h(
      UButton,
      {
        color: 'neutral',
        variant: 'link',
        class:
          computedSelectedPlatformType.value === item.platformType
            ? 'p-0 self-start h-auto min-h-0 w-full max-w-full justify-start text-left text-primary hover:text-primary hover:underline'
            : 'p-0 self-start h-auto min-h-0 w-full max-w-full justify-start text-left text-muted hover:text-primary hover:underline',
        onClick: () => handlePlatformSelect(item.platformType)
      },
      () => h('span', { class: 'block w-full whitespace-normal break-words' }, `${t(`components.hotsearch.platform.${item.platformType}`)} (${computedPlatformCountMap.value.get(item.platformType) ?? 0})`)
    )
  );

/**
 * 函数：渲染带摘要的热搜标题内容。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} 标题单元格内容。
 */
const hotsearchTitleWithSummaryCellRender = (item: IHotsearchDataRow) =>
  h('div', { class: 'min-w-0 flex flex-col gap-1.5' }, [
    h(
      UButton,
      {
        color: 'neutral',
        variant: 'link',
        class: 'p-0 self-start h-auto min-h-0 w-full max-w-full justify-start text-left text-default hover:text-primary hover:underline',
        onClick: () => void handleSourceOpen(item.url)
      },
      () => h('span', { class: 'block w-full max-w-full whitespace-normal break-all' }, item.title)
    ),
    h('p', { class: 'w-full max-w-full text-sm text-dimmed whitespace-normal break-all' }, item.summary)
  ]);

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
 * 函数：渲染热搜播客化状态。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} 播客状态内容。
 */
const hotsearchPodcastStatusCellRender = (item: IHotsearchDataRow) =>
  h('div', { class: 'py-2' }, [
    item.isPodcast
      ? h(
          UBadge,
          {
            color: 'warning',
            variant: 'soft',
            class: 'rounded-md'
          },
          () => t('pages.hotsearch.data.status.podcastReady')
        )
      : h(
          UBadge,
          {
            color: 'neutral',
            variant: 'soft',
            class: 'rounded-md'
          },
          () => t('pages.hotsearch.data.status.pending')
        )
  ]);

/**
 * 函数：渲染热搜合并元信息。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @param {{ showTag: boolean; showPlatform: boolean; showPodcast: boolean }} options 展示选项。
 * @returns {ReturnType<typeof h> | null} 合并元信息内容。
 */
const hotsearchMergedMetaCellRender = (item: IHotsearchDataRow, options: { showTag: boolean; showPlatform: boolean; showPodcast: boolean }) => {
  const children = [options.showTag ? hotsearchTagCellRender(item) : null, options.showPlatform ? hotsearchPlatformCellRender(item) : null, options.showPodcast ? hotsearchPodcastStatusCellRender(item) : null].filter(Boolean);

  if (children.length === 0) {
    return null;
  }

  return h('div', { class: 'flex flex-wrap items-start gap-x-3 gap-y-1.5' }, children);
};

/**
 * 函数：渲染热搜紧凑布局内容。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} 小屏内容。
 */
const hotsearchCompactCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 space-y-2 py-2' }, [hotsearchTitleWithSummaryCellRender(item), hotsearchMergedMetaCellRender(item, { showTag: true, showPlatform: true, showPodcast: true })]);

/**
 * 函数：渲染热搜中屏布局内容。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} 中屏内容。
 */
const hotsearchLgCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 space-y-2 py-2' }, [hotsearchTitleWithSummaryCellRender(item), hotsearchMergedMetaCellRender(item, { showTag: true, showPlatform: false, showPodcast: true })]);

/**
 * 函数：渲染热搜 xl 合并布局内容。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} xl 内容。
 */
const hotsearchXlCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 space-y-2 py-2' }, [hotsearchTitleWithSummaryCellRender(item), hotsearchMergedMetaCellRender(item, { showTag: true, showPlatform: false, showPodcast: false })]);

/**
 * 函数：渲染热搜 2xl 合并布局内容。
 * @param {IHotsearchDataRow} item 热搜数据行。
 * @returns {ReturnType<typeof h>} 2xl 内容。
 */
const hotsearch2xlCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 py-2' }, [hotsearchTitleWithSummaryCellRender(item)]);

/**
 * 函数：切换平台筛选。
 * @param {string} platformType 平台类型。
 * @returns {void}
 */
const handlePlatformSelect = (platformType: string): void => {
  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      platform: platformType || undefined,
      page: undefined
    }
  });
};

/**
 * 函数：切换标签筛选。
 * @param {string} categoryKey 标签 key。
 * @returns {void}
 */
const handleCategorySelect = (categoryKey: string): void => {
  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      category_key: categoryKey || undefined,
      page: undefined
    }
  });
};

/**
 * 函数：切换排序字段。
 * @param {'rank' | 'popularity' | 'published_at'} field 排序字段。
 * @returns {void}
 */
const toggleSort = (field: 'rank' | 'popularity' | 'published_at'): void => {
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
 * 函数：打开来源链接。
 * @param {string} url 来源地址。
 * @returns {Promise<void>}
 */
const handleSourceOpen = async (url: string): Promise<void> => {
  if (isTauriRuntime.value) {
    await openExternalUrl(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * 表格：列定义。
 */
const columns: TableColumn<IHotsearchDataRow>[] = [
  {
    accessorKey: 'rank',
    header: () => {
      const isSorted = computedSortBy.value === 'rank' ? computedSortDirection.value : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('pages.hotsearch.data.table.rank'),
        icon,
        class: '-mx-2.5 font-semibold',
        onClick: () => toggleSort('rank')
      });
    },
    cell: ({ row }) => h('div', { class: 'py-2 text-sm text-toned' }, hotsearchDisplayIdGet(row.original.rank)),
    meta: {
      class: {
        th: 'w-22',
        td: 'align-baseline'
      }
    }
  },
  {
    id: 'contentMd',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => hotsearchCompactCellRender(row.original),
    meta: {
      class: {
        th: 'lg:hidden',
        td: 'max-w-0 align-baseline lg:hidden'
      }
    }
  },
  {
    id: 'contentLg',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => hotsearchLgCellRender(row.original),
    meta: {
      class: {
        th: 'hidden lg:table-cell xl:hidden',
        td: 'hidden max-w-0 lg:table-cell align-baseline xl:hidden'
      }
    }
  },
  {
    id: 'contentXl',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => hotsearchXlCellRender(row.original),
    meta: {
      class: {
        th: 'hidden xl:table-cell 2xl:hidden',
        td: 'hidden max-w-0 xl:table-cell align-baseline 2xl:hidden'
      }
    }
  },
  {
    id: 'content2xl',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => hotsearch2xlCellRender(row.original),
    meta: {
      class: {
        th: 'hidden 2xl:table-cell',
        td: 'hidden max-w-0 2xl:table-cell align-baseline'
      }
    }
  },
  {
    id: 'tag',
    header: t('pages.hotsearch.data.table.tag'),
    cell: ({ row }) => hotsearchTagCellRender(row.original),
    meta: {
      class: {
        th: 'hidden 2xl:table-cell w-24',
        td: 'hidden 2xl:table-cell w-24 align-baseline'
      }
    }
  },
  {
    accessorKey: 'isPodcast',
    header: '播客化',
    cell: ({ row }) => hotsearchPodcastStatusCellRender(row.original),
    meta: {
      class: {
        th: 'hidden xl:table-cell w-24',
        td: 'hidden xl:table-cell w-24 align-baseline'
      }
    }
  },
  {
    accessorKey: 'platformType',
    header: t('pages.hotsearch.data.table.platform'),
    cell: ({ row }) => hotsearchPlatformCellRender(row.original),
    meta: {
      class: {
        th: 'hidden lg:table-cell w-36',
        td: 'hidden lg:table-cell w-36 align-baseline'
      }
    }
  },
  {
    accessorKey: 'popularity',
    header: () => {
      const isSorted = computedSortBy.value === 'popularity' ? computedSortDirection.value : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('pages.hotsearch.data.table.popularity'),
        icon,
        class: '-mx-2.5 font-semibold',
        onClick: () => toggleSort('popularity')
      });
    },
    cell: ({ row }) => h('div', { class: 'py-2 text-sm text-default' }, row.original.popularity.toLocaleString()),
    meta: {
      class: {
        th: 'w-24',
        td: 'w-24 align-baseline'
      }
    }
  },
  {
    accessorKey: 'publishedAt',
    header: () => {
      const isSorted = computedSortBy.value === 'published_at' ? computedSortDirection.value : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('pages.hotsearch.data.table.publishedAt'),
        icon,
        class: '-mx-2.5 font-semibold',
        onClick: () => toggleSort('published_at')
      });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'self-end w-auto max-w-full text-sm',
        datetime: hotsearchDatetimeValueGet(row.original.publishedAt),
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    meta: {
      class: {
        th: 'w-30 text-right',
        td: 'w-30 text-right align-baseline'
      }
    }
  }
];
</script>
