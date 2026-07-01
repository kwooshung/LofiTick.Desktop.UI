<template>
  <div class="flex w-full flex-1 flex-col gap-4">
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedFilteredRows"
          class="shrink-0"
          sticky
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0 align-top',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r text-left',
            td: 'border-b border-default align-top',
            separator: 'h-0'
          }"
        />
      </div>
    </div>

    <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ t('pages.crawlers.task.footer.total', { total: computedFilteredRows.length }) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

import type { ICrawlerTaskRow, ICrawlerTaskTableProps, TCrawlerTaskFilter, TCrawlerTaskMediaKind, TCrawlerTaskStatus, TCrawlerTaskStatusColor } from '@/components/crawlers/task/table/index.types';

/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * 组件：图标。
 */
const UIcon = resolveComponent('UIcon');

/**
 * 组件：进度条。
 */
const UProgress = resolveComponent('UProgress');

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 属性：爬虫任务表配置。
 */
const { rows } = defineProps<ICrawlerTaskTableProps>();

/**
 * Hook：当前路由。
 */
const route = useRoute();

/**
 * Hook：i18n。
 */
const { t } = useI18n();

/**
 * 计算属性：当前任务过滤状态。
 */
const computedFilter = computed<TCrawlerTaskFilter>(() => {
  const filter = route.params.filter;
  const value = Array.isArray(filter) ? (filter[0] ?? '') : (filter ?? '');

  if (value === 'active' || value === 'paused' || value === 'completed' || value === 'failed') {
    return value;
  }

  return 'all';
});

/**
 * 函数：获取媒体默认图标。
 * @param {TCrawlerTaskMediaKind} mediaKind 媒体类型
 * @returns {string} 图标名称
 */
const crawlerTaskMediaIconGet = (mediaKind: TCrawlerTaskMediaKind): string => {
  if (mediaKind === 'image') {
    return 'i-lucide:image';
  }

  if (mediaKind === 'audio') {
    return 'i-lucide:music';
  }

  if (mediaKind === 'video') {
    return 'i-lucide:film';
  }

  if (mediaKind === 'document') {
    return 'i-lucide:file-text';
  }

  if (mediaKind === 'archive') {
    return 'i-lucide:archive';
  }

  if (mediaKind === 'model') {
    return 'i-lucide:box';
  }

  if (mediaKind === 'folder') {
    return 'i-lucide:folder';
  }

  return 'i-lucide:file-question';
};

/**
 * 函数：获取任务状态颜色。
 * @param {TCrawlerTaskStatus} status 任务状态
 * @returns {TCrawlerTaskStatusColor} 徽标颜色
 */
const crawlerTaskStatusColorGet = (status: TCrawlerTaskStatus): TCrawlerTaskStatusColor => {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'failed' || status === 'stopped') {
    return 'error';
  }

  if (status === 'paused') {
    return 'warning';
  }

  if (status === 'crawling' || status === 'downloading' || status === 'resolving') {
    return 'primary';
  }

  return 'neutral';
};

/**
 * 函数：获取任务状态文案。
 * @param {TCrawlerTaskStatus} status 任务状态
 * @returns {string} 状态文案
 */
const crawlerTaskStatusLabelGet = (status: TCrawlerTaskStatus): string => t(`pages.crawlers.task.status.${status}`);

/**
 * 函数：判断任务是否符合过滤状态。
 * @param {ICrawlerTaskRow} row 任务行
 * @returns {boolean} 是否展示
 */
const crawlerTaskFilterMatch = (row: ICrawlerTaskRow): boolean => {
  if (computedFilter.value === 'active') {
    return row.status === 'resolving' || row.status === 'crawling' || row.status === 'downloading' || row.status === 'pending';
  }

  if (computedFilter.value === 'paused') {
    return row.status === 'paused';
  }

  if (computedFilter.value === 'completed') {
    return row.status === 'completed';
  }

  if (computedFilter.value === 'failed') {
    return row.status === 'failed' || row.status === 'stopped';
  }

  return true;
};

/**
 * 函数：渲染媒体预览节点。
 * @param {ICrawlerTaskRow} row 任务行
 * @returns {ReturnType<typeof h>} 预览节点
 */
const crawlerTaskPreviewNodeRender = (row: ICrawlerTaskRow): ReturnType<typeof h> => {
  const iconName = row.preview.iconName || crawlerTaskMediaIconGet(row.preview.mediaKind);
  const fallbackNode = h(
    'div',
    {
      'data-preview-fallback': '',
      class: row.preview.kind === 'thumbnail' && row.preview.imageUrl ? 'hidden text-muted flex size-11 items-center justify-center rounded-md border border-default bg-elevated/50' : 'text-muted flex size-11 items-center justify-center rounded-md border border-default bg-elevated/50'
    },
    [h(UIcon, { name: iconName, class: 'size-5' })]
  );

  if (row.preview.kind !== 'thumbnail' || !row.preview.imageUrl) {
    return fallbackNode;
  }

  return h('div', { class: 'relative size-11 overflow-hidden rounded-md border border-default bg-elevated/50' }, [
    h('img', {
      src: row.preview.imageUrl,
      alt: row.preview.alt,
      class: 'size-full object-cover',
      onError: (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLImageElement)) {
          return;
        }

        target.classList.add('hidden');
        target.parentElement?.querySelector('[data-preview-fallback]')?.classList.remove('hidden');
      }
    }),
    fallbackNode
  ]);
};

/**
 * 函数：渲染进度节点。
 * @param {ICrawlerTaskRow} row 任务行
 * @param {boolean} compact 是否紧凑展示
 * @returns {ReturnType<typeof h>} 进度节点
 */
const crawlerTaskProgressNodeRender = (row: ICrawlerTaskRow, compact = false): ReturnType<typeof h> => {
  const progressValue = row.progress.value === null ? undefined : Math.max(0, Math.min(100, row.progress.value));
  const progressText = row.progress.value === null ? t('pages.crawlers.task.progress.indeterminate') : t('pages.crawlers.task.progress.percent', { value: Math.round(progressValue ?? 0) });

  return h('div', { class: compact ? 'min-w-0 space-y-1' : 'min-w-28 space-y-1.5' }, [
    h('div', { class: 'flex items-center justify-between gap-2 text-xs' }, [h('span', { class: 'text-muted' }, crawlerTaskStatusLabelGet(row.status)), h('span', { class: 'text-highlighted tabular-nums' }, progressText)]),
    h(UProgress, { modelValue: progressValue, animation: row.progress.indeterminate ? 'carousel' : undefined, color: crawlerTaskStatusColorGet(row.status), class: 'w-full' })
  ]);
};

/**
 * 计算属性：过滤后的任务行。
 */
const computedFilteredRows = computed(() => rows.filter(crawlerTaskFilterMatch));

/**
 * 表格：任务列定义。
 */
const columns: TableColumn<ICrawlerTaskRow>[] = [
  {
    id: 'preview',
    accessorKey: 'preview',
    meta: {
      class: {
        th: 'w-16',
        td: 'w-16'
      }
    },
    header: t('pages.crawlers.task.table.preview'),
    cell: ({ row }) => crawlerTaskPreviewNodeRender(row.original)
  },
  {
    id: 'task',
    accessorKey: 'title',
    meta: {
      class: {
        th: 'min-w-60',
        td: 'min-w-60'
      }
    },
    header: t('pages.crawlers.task.table.task'),
    cell: ({ row }) =>
      h('div', { class: 'min-w-0 space-y-2' }, [
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'text-highlighted text-sm font-semibold wrap-break-word' }, row.original.title),
          h('div', { class: 'text-muted mt-1 flex flex-wrap items-center gap-1.5 text-xs' }, [h('span', row.original.source), h('span', '·'), h('span', row.original.target)])
        ]),
        h('div', { class: 'xl:hidden' }, [crawlerTaskProgressNodeRender(row.original, true)]),
        h('div', { class: 'text-muted grid grid-cols-2 gap-x-3 gap-y-1 text-xs xl:hidden' }, [
          h('span', `${t('pages.crawlers.task.table.speed')}：${row.original.speed}`),
          h('span', `${t('pages.crawlers.task.table.size')}：${row.original.size}`),
          h('span', `${t('pages.crawlers.task.table.elapsed')}：${row.original.elapsed}`),
          h('span', `${t('pages.crawlers.task.table.remaining')}：${row.original.remaining}`)
        ])
      ])
  },
  {
    id: 'status',
    accessorKey: 'status',
    meta: {
      class: {
        th: 'w-24 hidden xl:table-cell',
        td: 'w-24 hidden xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.status'),
    cell: ({ row }) => h(UBadge, { color: crawlerTaskStatusColorGet(row.original.status), variant: 'soft' }, () => crawlerTaskStatusLabelGet(row.original.status))
  },
  {
    id: 'progress',
    accessorKey: 'progress',
    meta: {
      class: {
        th: 'w-40 hidden xl:table-cell',
        td: 'w-40 hidden xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.progress'),
    cell: ({ row }) => crawlerTaskProgressNodeRender(row.original)
  },
  {
    id: 'speedSize',
    accessorKey: 'speed',
    meta: {
      class: {
        th: 'w-40 hidden xl:table-cell 2xl:hidden',
        td: 'w-40 hidden xl:table-cell 2xl:hidden'
      }
    },
    header: t('pages.crawlers.task.table.transfer'),
    cell: ({ row }) => h('div', { class: 'space-y-1 text-sm' }, [h('div', { class: 'text-highlighted tabular-nums' }, row.original.speed), h('div', { class: 'text-muted text-xs tabular-nums' }, `${row.original.downloaded} / ${row.original.size}`)])
  },
  {
    id: 'speed',
    accessorKey: 'speed',
    meta: {
      class: {
        th: 'w-28 hidden 2xl:table-cell',
        td: 'w-28 hidden 2xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.speed'),
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.speed)
  },
  {
    id: 'size',
    accessorKey: 'size',
    meta: {
      class: {
        th: 'w-36 hidden 2xl:table-cell',
        td: 'w-36 hidden 2xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.size'),
    cell: ({ row }) => h('div', { class: 'space-y-1 text-sm' }, [h('div', { class: 'text-highlighted tabular-nums' }, row.original.size), h('div', { class: 'text-muted text-xs tabular-nums' }, row.original.downloaded)])
  },
  {
    id: 'time',
    accessorKey: 'elapsed',
    meta: {
      class: {
        th: 'w-36 hidden 2xl:table-cell 5xl:hidden',
        td: 'w-36 hidden 2xl:table-cell 5xl:hidden'
      }
    },
    header: t('pages.crawlers.task.table.time'),
    cell: ({ row }) => h('div', { class: 'space-y-1 text-sm' }, [h('div', { class: 'text-highlighted tabular-nums' }, row.original.elapsed), h('div', { class: 'text-muted text-xs tabular-nums' }, row.original.remaining)])
  },
  {
    id: 'elapsed',
    accessorKey: 'elapsed',
    meta: {
      class: {
        th: 'w-28 hidden 5xl:table-cell',
        td: 'w-28 hidden 5xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.elapsed'),
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.elapsed)
  },
  {
    id: 'remaining',
    accessorKey: 'remaining',
    meta: {
      class: {
        th: 'w-28 hidden 5xl:table-cell',
        td: 'w-28 hidden 5xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.remaining'),
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.remaining)
  },
  {
    id: 'items',
    accessorKey: 'items',
    meta: {
      class: {
        th: 'w-24 hidden 5xl:table-cell',
        td: 'w-24 hidden 5xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.items'),
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.items)
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    meta: {
      class: {
        th: 'w-36 hidden 5xl:table-cell',
        td: 'w-36 hidden 5xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.updatedAt'),
    cell: ({ row }) => h('span', { class: 'text-sm text-muted tabular-nums' }, row.original.updatedAt)
  },
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-20 text-center hidden 4xl:table-cell',
        td: 'w-20 hidden 4xl:table-cell'
      }
    },
    enableHiding: false,
    header: () => h('div', { class: 'w-full text-center' }, t('pages.crawlers.task.table.actions')),
    cell: () => h(UButton, { icon: 'i-lucide:ellipsis', color: 'neutral', variant: 'ghost', size: 'sm', class: 'mx-auto' })
  }
];
</script>
