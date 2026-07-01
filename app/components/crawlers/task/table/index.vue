<template>
  <div class="flex w-full flex-1 flex-col gap-4">
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="rows"
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
      <div class="muted text-sm">{{ t('pages.crawlers.task.footer.total', { total: rows.length }) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

import type { ICrawlerTaskRow, ICrawlerTaskTableProps, TCrawlerTaskMediaKind, TCrawlerTaskStatus, TCrawlerTaskStatusColor } from '@/components/crawlers/task/table/index.types';

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
 * 属性：爬虫任务表配置。
 */
const { rows } = defineProps<ICrawlerTaskTableProps>();

/**
 * Hook：i18n。
 */
const { t } = useI18n();

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
 * 函数：渲染任务名称节点。
 * @param {ICrawlerTaskRow} row 任务行
 * @param {Array<keyof ICrawlerTaskRow | 'status' | 'progress'>} details 第二行展示项
 * @returns {ReturnType<typeof h>} 名称节点
 */
const crawlerTaskNameNodeRender = (row: ICrawlerTaskRow, details: Array<keyof ICrawlerTaskRow | 'status' | 'progress'> = []): ReturnType<typeof h> => {
  const detailNodes = details.map((detail) => {
    if (detail === 'status') {
      return h('span', crawlerTaskStatusLabelGet(row.status));
    }

    if (detail === 'progress') {
      const progressValue = row.progress.value === null ? t('pages.crawlers.task.progress.indeterminate') : t('pages.crawlers.task.progress.percent', { value: Math.round(Math.max(0, Math.min(100, row.progress.value))) });
      return h('span', progressValue);
    }

    if (detail === 'downloaded') {
      return h('span', `${t('pages.crawlers.task.table.downloaded')}：${row.downloaded}`);
    }

    if (detail === 'speed') {
      return h('span', `${t('pages.crawlers.task.table.speed')}：${row.speed}`);
    }

    if (detail === 'size') {
      return h('span', `${t('pages.crawlers.task.table.size')}：${row.size}`);
    }

    return h('span', String(row[detail] ?? ''));
  });

  return h('div', { class: 'min-w-0 space-y-1.5' }, [
    h('div', { class: 'min-w-0' }, [h('div', { class: 'text-highlighted text-sm font-semibold wrap-break-word' }, row.title), h('div', { class: 'text-muted mt-1 flex flex-wrap items-center gap-1.5 text-xs' }, [h('span', row.source), h('span', '·'), h('span', row.target)])]),
    ...(detailNodes.length > 0 ? [h('div', { class: 'text-muted flex flex-wrap gap-x-3 gap-y-1 text-xs' }, detailNodes)] : [])
  ]);
};

/**
 * 函数：渲染时间合并节点。
 * @param {ICrawlerTaskRow} row 任务行
 * @returns {ReturnType<typeof h>} 时间节点
 */
const crawlerTaskTimeNodeRender = (row: ICrawlerTaskRow): ReturnType<typeof h> =>
  h('div', { class: 'space-y-1 text-xs text-muted' }, [h('div', `${t('pages.crawlers.task.table.elapsed')}：${row.elapsed}`), h('div', `${t('pages.crawlers.task.table.remaining')}：${row.remaining}`), h('div', `${t('pages.crawlers.task.table.updatedAt')}：${row.updatedAt}`)]);

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
    id: 'taskCompact',
    accessorKey: 'title',
    meta: {
      class: {
        th: 'min-w-76 xl:hidden',
        td: 'min-w-76 xl:hidden'
      }
    },
    header: t('pages.crawlers.task.table.task'),
    cell: ({ row }) => crawlerTaskNameNodeRender(row.original, ['status', 'progress', 'downloaded', 'speed', 'size'])
  },
  {
    id: 'taskMedium',
    accessorKey: 'title',
    meta: {
      class: {
        th: 'min-w-72 hidden xl:table-cell 2xl:hidden',
        td: 'min-w-72 hidden xl:table-cell 2xl:hidden'
      }
    },
    header: t('pages.crawlers.task.table.task'),
    cell: ({ row }) => crawlerTaskNameNodeRender(row.original, ['progress', 'downloaded', 'speed', 'size'])
  },
  {
    id: 'taskLarge',
    accessorKey: 'title',
    meta: {
      class: {
        th: 'min-w-72 hidden 2xl:table-cell 5xl:hidden',
        td: 'min-w-72 hidden 2xl:table-cell 5xl:hidden'
      }
    },
    header: t('pages.crawlers.task.table.task'),
    cell: ({ row }) => crawlerTaskNameNodeRender(row.original, ['downloaded', 'speed'])
  },
  {
    id: 'taskFull',
    accessorKey: 'title',
    meta: {
      class: {
        th: 'min-w-80 hidden 5xl:table-cell',
        td: 'min-w-80 hidden 5xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.name'),
    cell: ({ row }) => crawlerTaskNameNodeRender(row.original)
  },
  {
    id: 'progress',
    accessorKey: 'progress',
    meta: {
      class: {
        th: 'hidden w-25 text-left 2xl:table-cell 3xl:w-37.5 4xl:w-50 5xl:w-62.5',
        td: 'hidden w-25 text-left 2xl:table-cell 3xl:w-37.5 4xl:w-50 5xl:w-62.5'
      }
    },
    header: t('pages.crawlers.task.table.progress'),
    cell: ({ row }) => crawlerTaskProgressNodeRender(row.original)
  },
  {
    id: 'downloaded',
    accessorKey: 'downloaded',
    meta: {
      class: {
        th: 'w-36 hidden 5xl:table-cell',
        td: 'w-36 hidden 5xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.downloaded'),
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.downloaded)
  },
  {
    id: 'speed',
    accessorKey: 'speed',
    meta: {
      class: {
        th: 'w-28 hidden 5xl:table-cell',
        td: 'w-28 hidden 5xl:table-cell'
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
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.size)
  },
  {
    id: 'status',
    accessorKey: 'status',
    meta: {
      class: {
        th: 'w-24',
        td: 'w-24'
      }
    },
    header: t('pages.crawlers.task.table.status'),
    cell: ({ row }) => h(UBadge, { color: crawlerTaskStatusColorGet(row.original.status), variant: 'soft' }, () => crawlerTaskStatusLabelGet(row.original.status))
  },
  {
    id: 'time',
    accessorKey: 'elapsed',
    meta: {
      class: {
        th: 'w-36 xl:hidden',
        td: 'w-36 xl:hidden'
      }
    },
    header: t('pages.crawlers.task.table.time'),
    cell: ({ row }) => crawlerTaskTimeNodeRender(row.original)
  },
  {
    id: 'elapsed',
    accessorKey: 'elapsed',
    meta: {
      class: {
        th: 'w-28 hidden xl:table-cell',
        td: 'w-28 hidden xl:table-cell'
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
        th: 'w-28 hidden xl:table-cell',
        td: 'w-28 hidden xl:table-cell'
      }
    },
    header: t('pages.crawlers.task.table.remaining'),
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.remaining)
  }
];
</script>
