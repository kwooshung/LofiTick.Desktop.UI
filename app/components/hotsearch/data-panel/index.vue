<template>
  <DashboardPage class="gap-4">
    <div class="flex min-h-0 flex-1 flex-col gap-4">
      <div>
        <div class="flex flex-wrap gap-2">
          <UButton :color="computedSelectedPlatformType === '' ? 'primary' : 'neutral'" :variant="computedSelectedPlatformType === '' ? 'solid' : 'soft'" size="sm" @click="handlePlatformSelect('')">
            {{ t('pages.hotsearch.data.allPlatforms') }}
          </UButton>
          <UButton v-for="item in computedPlatformOptions" :key="item.type" :color="computedSelectedPlatformType === item.type ? 'primary' : 'neutral'" :variant="computedSelectedPlatformType === item.type ? 'solid' : 'soft'" size="sm" @click="handlePlatformSelect(item.type)">
            {{ t(item.key) }}
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
            sticky
            class="shrink-0"
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
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
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { h } from 'vue';

import type { IHotsearchDataRow } from '@@/shared/types/index.types';

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：徽章。
 */
const UBadge = resolveComponent('UBadge');

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
 * 计算属性：当前日期。
 */
const computedSelectedDate = computed(() => hotsearchQueryStringGet(route.query.date) || hotsearchArchiveDateSummariesGet()[0]?.date || '');

/**
 * 计算属性：当前平台类型。
 */
const computedSelectedPlatformType = computed(() => hotsearchQueryStringGet(route.query.platform));

/**
 * 计算属性：平台选项。
 */
const computedPlatformOptions = computed(() => hotsearchPlatformsList());

/**
 * 计算属性：当前排序字段。
 */
const computedSortBy = computed(() => {
  const value = hotsearchQueryStringGet(route.query.order_by);

  return value === 'rank' ? value : 'rank';
});

/**
 * 计算属性：当前排序方向。
 */
const computedSortDirection = computed(() => {
  const value = hotsearchQueryStringGet(route.query.order_dir).toLowerCase();

  return value === 'desc' ? 'desc' : 'asc';
});

/**
 * 计算属性：筛选后的数据行。
 */
const computedRows = computed(() => {
  const keyword = hotsearchQueryStringGet(route.query.keyword).toLowerCase();
  const rows = hotsearchDataRowsGet(computedSelectedDate.value).filter((item) => {
    const keywordMatched = keyword === '' || item.title.toLowerCase().includes(keyword) || item.summary.toLowerCase().includes(keyword);
    const platformMatched = computedSelectedPlatformType.value === '' || item.platformType === computedSelectedPlatformType.value;

    return keywordMatched && platformMatched;
  });

  return rows.toSorted((left, right) => {
    const result = left.rank - right.rank;

    return computedSortDirection.value === 'asc' ? result : -result;
  });
});

/**
 * 函数：获取热搜展示 ID。
 *
 * # Arguments
 *
 * * `id` - 原始记录 ID。
 *
 * # Returns
 *
 * 返回自动补零后的展示编号。
 */
const hotsearchDisplayIdGet = (id: number): string => String(Math.abs(Number(id))).padStart(4, '0');

/**
 * 函数：渲染热搜标题内容。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回标题单元格内容。
 */
const hotsearchTitleCellRender = (item: IHotsearchDataRow) =>
  h(
    'div',
    { class: 'flex items-center gap-1.5' },
    [
      h('div', { class: 'min-w-0 text-highlighted text-sm font-semibold leading-6' }, item.title),
      item.url
        ? h(UButton, {
            color: 'neutral',
            variant: 'link',
            size: 'xs',
            icon: 'i-lucide:external-link',
            class: 'h-auto shrink-0 px-0 py-0 text-muted transition-colors hover:text-primary',
            onClick: () => handleSourceOpen(item.url)
          })
        : null
    ].filter(Boolean)
  );

/**
 * 函数：渲染热搜 Badge 组。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回 Badge 容器。
 */
const hotsearchBadgesCellRender = (item: IHotsearchDataRow) =>
  h(
    'div',
    { class: 'flex flex-wrap gap-2 py-2' },
    [
      h(
        UBadge,
        {
          color: 'neutral',
          variant: 'soft',
          class: 'rounded-md'
        },
        () => t(item.categoryKey)
      ),
      item.isNew
        ? h(
            UBadge,
            {
              color: 'success',
              variant: 'soft',
              class: 'rounded-md'
            },
            () => t('pages.hotsearch.data.status.new')
          )
        : null,
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
    ].filter(Boolean)
  );

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
        label: '编号',
        icon,
        class: '-mx-2.5 font-semibold',
        onClick: handleRankSortToggle
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
    id: 'titleCompact',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => h('div', { class: 'space-y-2 py-2' }, [hotsearchTitleCellRender(row.original), h('div', { class: 'text-muted text-xs leading-5' }, row.original.summary), hotsearchBadgesCellRender(row.original)]),
    meta: {
      class: {
        th: 'min-w-80 xl:hidden',
        td: 'align-baseline xl:hidden'
      }
    }
  },
  {
    id: 'titleMedium',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => h('div', { class: 'py-2' }, hotsearchTitleCellRender(row.original)),
    meta: {
      class: {
        th: 'hidden xl:table-cell w-72 2xl:hidden',
        td: 'hidden xl:table-cell align-baseline 2xl:hidden'
      }
    }
  },
  {
    id: 'summaryMedium',
    header: '摘要',
    cell: ({ row }) => h('div', { class: 'py-2 text-muted text-xs leading-5' }, row.original.summary),
    meta: {
      class: {
        th: 'hidden xl:table-cell 2xl:hidden',
        td: 'hidden xl:table-cell align-baseline 2xl:hidden'
      }
    }
  },
  {
    id: 'badgesMedium',
    header: '标签',
    cell: ({ row }) => hotsearchBadgesCellRender(row.original),
    meta: {
      class: {
        th: 'hidden xl:table-cell w-44 2xl:hidden',
        td: 'hidden xl:table-cell align-baseline 2xl:hidden'
      }
    }
  },
  {
    id: 'titleLarge',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => h('div', { class: 'py-2' }, hotsearchTitleCellRender(row.original)),
    meta: {
      class: {
        th: 'hidden 2xl:table-cell w-72',
        td: 'hidden 2xl:table-cell align-baseline'
      }
    }
  },
  {
    id: 'summaryLarge',
    header: '摘要',
    cell: ({ row }) => h('div', { class: 'py-2 text-muted text-xs leading-5' }, row.original.summary),
    meta: {
      class: {
        th: 'hidden 2xl:table-cell',
        td: 'hidden 2xl:table-cell align-baseline'
      }
    }
  },
  {
    id: 'badgesLarge',
    header: '标签',
    cell: ({ row }) => hotsearchBadgesCellRender(row.original),
    meta: {
      class: {
        th: 'hidden 2xl:table-cell w-52',
        td: 'hidden 2xl:table-cell align-baseline'
      }
    }
  },
  {
    accessorKey: 'platformType',
    header: t('pages.hotsearch.data.table.platform'),
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'link',
        size: 'sm',
        label: t(`components.hotsearch.platform.${row.original.platformType}`),
        class: computedSelectedPlatformType.value === row.original.platformType ? 'p-0 self-start w-auto max-w-full text-primary hover:text-primary hover:underline' : 'p-0 self-start w-auto max-w-full text-muted hover:text-primary hover:underline',
        onClick: () => handlePlatformSelect(row.original.platformType)
      }),
    meta: {
      class: {
        th: 'w-28',
        td: 'align-baseline'
      }
    }
  },
  {
    accessorKey: 'popularity',
    header: t('pages.hotsearch.data.table.popularity'),
    cell: ({ row }) => h('div', { class: 'py-2 text-sm text-toned' }, row.original.popularity.toLocaleString()),
    meta: {
      class: {
        th: 'hidden lg:table-cell w-28',
        td: 'hidden lg:table-cell align-baseline'
      }
    }
  },
  {
    accessorKey: 'publishedAt',
    header: t('pages.hotsearch.data.table.publishedAt'),
    cell: ({ row }) => h('div', { class: 'py-2 text-sm text-toned' }, row.original.publishedAt),
    meta: {
      class: {
        th: 'hidden md:table-cell w-36',
        td: 'hidden md:table-cell align-baseline'
      }
    }
  }
];

/**
 * 函数：切换平台筛选。
 *
 * # Arguments
 *
 * * `platformType` - 平台类型。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePlatformSelect = (platformType: string): void => {
  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      platform: platformType || undefined
    }
  });
};

/**
 * 函数：切换编号排序。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleRankSortToggle = (): void => {
  const nextDirection = computedSortBy.value === 'rank' && computedSortDirection.value === 'asc' ? 'desc' : 'asc';

  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      order_by: 'rank',
      order_dir: nextDirection
    }
  });
};

/**
 * 函数：打开来源链接。
 *
 * # Arguments
 *
 * * `url` - 来源地址。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleSourceOpen = async (url: string): Promise<void> => {
  if (isTauriRuntime.value) {
    await openExternalUrl(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};
</script>
