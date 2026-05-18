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
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { h } from 'vue';

import type { IHotsearchDataRow } from '@@/shared/types/index.types';

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

  return value === 'asc' ? 'asc' : 'desc';
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
 * 函数：渲染热搜标签内容。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回标签单元格内容。
 */
const hotsearchTagCellRender = (item: IHotsearchDataRow) =>
  h(
    'div',
    { class: 'py-2' },
    h(
      UBadge,
      {
        color: 'neutral',
        variant: 'soft',
        class: 'rounded-md'
      },
      () => t(item.categoryKey)
    )
  );

/**
 * 函数：渲染热搜平台内容。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回平台单元格内容。
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
      () => h('span', { class: 'block w-full whitespace-normal break-words' }, t(`components.hotsearch.platform.${item.platformType}`))
    )
  );

/**
 * 函数：渲染带摘要的热搜标题内容。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回带摘要的标题单元格内容。
 */
const hotsearchTitleWithSummaryCellRender = (item: IHotsearchDataRow) =>
  h('div', { class: 'min-w-0 flex flex-col gap-1.5' }, [
    h(
      UButton,
      {
        color: 'neutral',
        variant: 'link',
        class: 'p-0 self-start h-auto min-h-0 w-full max-w-full justify-start text-left text-default hover:text-primary hover:underline',
        onClick: () => handleSourceOpen(item.url)
      },
      () => h('span', { class: 'block w-full max-w-full whitespace-normal break-all' }, item.title)
    ),
    h('p', { class: 'w-full max-w-full text-sm text-dimmed whitespace-normal break-all' }, item.summary)
  ]);

/**
 * 函数：将时间字符串归一为 Datetime 可消费值。
 *
 * # Arguments
 *
 * * `value` - 原始时间字符串。
 *
 * # Returns
 *
 * 返回 ISO 风格时间字符串。
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
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回播客化状态内容。
 */
const hotsearchPodcastStatusCellRender = (item: IHotsearchDataRow) =>
  h(
    'div',
    { class: 'py-2' },
    [
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
 * 函数：渲染热搜合并元信息。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 * * `options` - 当前断点需要展示的元信息。
 *
 * # Returns
 *
 * 返回合并单元格中的元信息内容。
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
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回小屏合并单元格内容。
 */
const hotsearchCompactCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 space-y-2 py-2' }, [hotsearchTitleWithSummaryCellRender(item), hotsearchMergedMetaCellRender(item, { showTag: true, showPlatform: true, showPodcast: true })]);

/**
 * 函数：渲染热搜中屏布局内容。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回中屏合并单元格内容。
 */
const hotsearchLgCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 space-y-2 py-2' }, [hotsearchTitleWithSummaryCellRender(item), hotsearchMergedMetaCellRender(item, { showTag: true, showPlatform: false, showPodcast: true })]);

/**
 * 函数：渲染热搜 xl 合并布局内容。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回 xl 合并单元格内容。
 */
const hotsearchXlCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 space-y-2 py-2' }, [hotsearchTitleWithSummaryCellRender(item), hotsearchMergedMetaCellRender(item, { showTag: true, showPlatform: false, showPodcast: false })]);

/**
 * 函数：渲染热搜 2xl 合并布局内容。
 *
 * # Arguments
 *
 * * `item` - 热搜数据行。
 *
 * # Returns
 *
 * 返回 2xl 合并单元格内容。
 */
const hotsearch2xlCellRender = (item: IHotsearchDataRow) => h('div', { class: 'min-w-0 py-2' }, [hotsearchTitleWithSummaryCellRender(item)]);

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
    id: 'contentMd',
    header: '标题 / 摘要 / 标签 / 平台 / 播客化',
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
    header: '标题 / 摘要 / 标签 / 播客化',
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
    header: '标题 / 摘要 / 标签',
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
    header: '标题 / 摘要',
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
    header: '标签',
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
        th: 'hidden lg:table-cell w-24',
        td: 'hidden lg:table-cell w-24 align-baseline'
      }
    }
  },
  {
    accessorKey: 'popularity',
    header: t('pages.hotsearch.data.table.popularity'),
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
      const isSorted = computedSortBy.value === 'rank' ? false : computedSortDirection.value;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: '创建时间',
        icon,
        class: '-mx-2.5 font-semibold',
        disabled: true
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
