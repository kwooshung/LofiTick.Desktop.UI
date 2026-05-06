<template>
  <DashboardPage>
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedQuoteDatas"
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
      <div class="muted text-sm">{{ t('pages.quotes.result.footer.total', { total: Number(datas?.total ?? 0) }) }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

/**
 * 组件：Nuxt 时间显示组件
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：按钮
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：开关
 */
const USwitch = resolveComponent('USwitch');

/**
 * 组件：分页
 */
const UPagination = resolveComponent('UPagination');

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 窗口能力
 */
const { openExternalUrl } = useTauriWindow();

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

  /**
   * UUID
   */
  const uuid = typeof route.query.uuid !== 'undefined' ? String(route.query.uuid).trim() : '';
  if (uuid) {
    query.uuid = uuid;
  }

  /**
   * 内容
   */
  const content = typeof route.query.content !== 'undefined' ? String(route.query.content).trim() : '';
  if (content) {
    query.content = content;
  }

  /**
   * 翻译
   */
  const translate = typeof route.query.translate !== 'undefined' ? String(route.query.translate).trim() : '';
  if (translate) {
    query.translate = translate;
  }

  // 布尔匹配：isAnd（1=true，0=false），仅在为 1 时携带，保持与前端构造一致
  if (String(route.query.is_and) === '1') {
    query.is_and = '1';
  }

  /**
   * 辅助函数：将值转换为字符串数组
   * @param {unknown} v 输入值
   * @returns {string[]} 字符串数组
   */
  const asArray = (v: unknown): string[] => (Array.isArray(v) ? v.map((i) => String(i)) : v != null ? [String(v)] : []);

  // 多选 ID 参数
  const typeIds = asArray(route.query.type_ids);
  const authorIds = asArray(route.query.author_ids);
  const sourceIds = asArray(route.query.source_ids);
  if (typeIds.length > 0) {
    query.type_ids = typeIds;
  }
  if (authorIds.length > 0) {
    query.author_ids = authorIds;
  }
  if (sourceIds.length > 0) {
    query.source_ids = sourceIds;
  }

  // 启用状态与分页
  if (typeof route.query.enabled !== 'undefined') {
    query.enabled = String(route.query.enabled);
  }
  if (typeof route.query.page !== 'undefined') {
    query.page = String(route.query.page);
  }
  if (typeof route.query.pagesize !== 'undefined') {
    query.pagesize = String(route.query.pagesize);
  }

  // 排序：orderBy（id/updated/created）与 order_dir（asc/desc）
  if (typeof route.query.order_by !== 'undefined') {
    const by = String(route.query.order_by);
    if (by === 'id' || by === 'updated' || by === 'created') {
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
 * 排序：切换指定字段（互斥）
 * @param {'id'|'updated'|'created'} field 排序字段
 */
const toggleSort = (field: 'id' | 'updated' | 'created') => {
  // 默认按照编号倒序
  const currentBy = String(route.query.order_by || 'id');
  const currentDir = String(route.query.order_dir || 'desc');
  const nextBy = field;
  const nextDir = currentBy === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'desc';
  const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
  q.order_by = nextBy;
  q.order_dir = nextDir;
  navigateTo({ path: route.path, query: q });
};

/**
 * API：名句搜索
 */
const { datas, loading, refreshDebounced } = await useApi<IQueryResultQuotesSummaryPage>('quotes', { datas: buildApiQueryFromRoute(), immediate: true });

/**
 * API：更新启用状态（复用实例，避免 useFetch key 缓存导致后续不请求）
 */
const { refresh: refreshSetEnabled } = await useApi<IQueryResultQuotesSetEnabledResponse>('quotes/enabled', { method: 'POST', immediate: false });

/**
 * 计算属性：将接口返回映射为表格需要的格式
 */
const computedQuoteDatas = computed<IPageTableColumnQuotes[]>(() => {
  if (!datas.value || !datas.value.rows || datas.value.rows.length === 0) {
    return [];
  }

  return datas.value.rows.map((item) => ({
    id: item.id ?? 0,
    uuid: item.uuid ?? '',
    infos: {
      sentence: item.sentence ?? '',
      translate: item.translate ?? '',
      typeId: item.typeId ?? 0,
      source:
        item.source && typeof item.source === 'object'
          ? item.source
          : {
              id: 0,
              name: 'unknown',
              count: 0
            },
      author:
        item.author && typeof item.author === 'object'
          ? item.author
          : {
              id: 0,
              name: 'unknown',
              count: 0
            }
    },
    enabled: item.enabled ?? false,
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
 * 函数：切换启用状态并调用后端更新
 * - 若路由 query 中存在 enabled 键，则更新后刷新当前列表
 */
const handleToggleEnabled = async (row: IPageTableColumnQuotes, value: boolean) => {
  const prev = row.enabled;
  row.enabled = value;

  try {
    await refreshSetEnabled({ datas: { id: row.id, enabled: value }, replace: true });
    // 统一刷新列表，保证更新时间等字段同步
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  } catch {
    // 回滚 UI
    row.enabled = prev;
  }
};

/**
 * 事件：点击名句句子
 * @param {string} uuid 名句 UUID
 */
const handleClickSentence = async (uuid: string): Promise<void> => {
  const url = `https://hitokoto.cn?uuid=${uuid}`;

  if (isTauriRuntime.value) {
    await openExternalUrl(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * 函数：导航到单一筛选（保留 pagesize/enabled/isAnd/uuid/content/translate），移除 page
 * @param {'type_ids' | 'source_ids' | 'author_ids'} key 筛选键
 * @param {number | string} value 筛选值
 */
const navigateWithSingleFilter = (key: 'type_ids' | 'source_ids' | 'author_ids', value: number | string) => {
  const q: Record<string, string | string[]> = {};

  // 保留必要参数
  if (typeof route.query.pagesize !== 'undefined') {
    q.pagesize = String(route.query.pagesize);
  }
  if (typeof route.query.enabled !== 'undefined') {
    q.enabled = String(route.query.enabled);
  }
  if (typeof route.query.is_and !== 'undefined') {
    q.is_and = String(route.query.is_and);
  }
  if (typeof route.query.uuid !== 'undefined') {
    const uuid = String(route.query.uuid).trim();
    if (uuid) {
      q.uuid = uuid;
    }
  }
  if (typeof route.query.content !== 'undefined') {
    const content = String(route.query.content).trim();
    if (content) {
      q.content = content;
    }
  }
  if (typeof route.query.translate !== 'undefined') {
    const translate = String(route.query.translate).trim();
    if (translate) {
      q.translate = translate;
    }
  }

  // 设置单选筛选
  q[key] = String(value);

  // 跳转（移除 page，使用 replace 以清爽历史栈）
  navigateTo({ path: localePath('/quotes'), query: q });
};

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
const columns: TableColumn<IPageTableColumnQuotes>[] = [
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
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.quotes.result.table.id'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('id') });
    },
    cell: ({ row }) => row.original.id.toString().padStart(5, '0')
  },
  // 1级宽度：名句列，展示 内容 + 翻译 + 来源 · 作者
  {
    accessorKey: 'quote',
    meta: {
      class: {
        th: 'w-100 xl:hidden',
        td: 'w-100 whitespace-normal xl:hidden'
      }
    },
    header: t('pages.quotes.result.table.sentence'),
    cell: ({ row }) => {
      const { sentence, translate, source, author, typeId } = row.original.infos;
      const typeLabel = t(`components.quotes.search.types.${typeId}`);
      const bookTitlePrefix = t('common.content.bookTitle.prefix');
      const bookTitleSuffix = t('common.content.bookTitle.suffix');
      const nodes = [
        h(
          UButton,
          {
            color: 'neutral',
            variant: 'link',
            label: sentence,
            class: 'p-0 self-start w-auto max-w-full text-default text-left hover:text-primary hover:underline',
            onClick: () => handleClickSentence(row.original.uuid)
          },
          () => sentence
        )
      ];

      if (translate) {
        nodes.push(h('p', { class: 'text-sm text-dimmed mt-1' }, translate));
      }

      const sourceName = source?.name || 'unknown';
      const authorName = author?.name || 'unknown';
      nodes.push(
        h('div', { class: 'text-xs text-muted mt-1' }, [
          h(
            UButton,
            {
              color: 'neutral',
              variant: 'link',
              label: typeLabel,
              class: 'p-0 text-xs text-muted hover:text-primary hover:underline',
              onClick: () => navigateWithSingleFilter('type_ids', typeId)
            },
            () => typeLabel
          ),
          ' · ',
          h(
            UButton,
            {
              color: 'neutral',
              variant: 'link',
              label: `${bookTitlePrefix}${sourceName}${bookTitleSuffix}`,
              class: 'p-0 text-xs text-muted hover:text-primary hover:underline',
              onClick: () => navigateWithSingleFilter('source_ids', source?.id ?? 0)
            },
            () => `${bookTitlePrefix}${sourceName}${bookTitleSuffix}`
          ),
          ' · ',
          h(
            UButton,
            {
              color: 'neutral',
              variant: 'link',
              label: authorName,
              class: 'p-0 text-xs text-muted hover:text-primary hover:underline',
              onClick: () => navigateWithSingleFilter('author_ids', author?.id ?? 0)
            },
            () => authorName
          )
        ])
      );

      return h('div', { class: 'flex flex-col' }, nodes);
    }
  },
  // 2级宽度：名句（内容 + 翻译）+ 来源 · 作者
  {
    accessorKey: 'quote',
    meta: {
      class: {
        th: 'hidden xl:table-cell',
        td: 'hidden xl:table-cell'
      }
    },
    header: t('pages.quotes.result.table.sentence'),
    cell: ({ row }) => {
      const { sentence, translate } = row.original.infos;
      const nodes = [
        h(
          UButton,
          {
            color: 'neutral',
            variant: 'link',
            label: sentence,
            class: 'p-0 text-default break-words text-left hover:text-primary hover:underline',
            onClick: () => handleClickSentence(row.original.uuid)
          },
          () => sentence
        )
      ];

      if (translate) {
        nodes.push(h('p', { class: 'text-sm text-dimmed mt-1 break-words' }, translate));
      }

      return h('div', { class: 'flex flex-col' }, nodes);
    }
  },
  {
    accessorKey: 'quote',
    meta: {
      class: {
        th: 'w-30 hidden xl:table-cell 3xl:hidden',
        td: 'w-30 hidden xl:table-cell 3xl:hidden'
      }
    },
    header: t('pages.quotes.result.table.typeSourceAuthor'),
    cell: ({ row }) => {
      const { source, author, typeId } = row.original.infos;
      const typeLabel = t(`components.quotes.search.types.${typeId}`);
      const bookTitlePrefix = t('common.content.bookTitle.prefix');
      const bookTitleSuffix = t('common.content.bookTitle.suffix');
      const sourceName = source?.name || 'unknown';
      const authorName = author?.name || 'unknown';

      return h('div', { class: 'text-sm text-muted mt-1' }, [
        h(UButton, {
          color: 'neutral',
          variant: 'link',
          label: typeLabel,
          class: 'p-0 self-start w-auto max-w-full text-muted hover:text-primary hover:underline',
          onClick: () => navigateWithSingleFilter('type_ids', typeId)
        }),
        ' · ',
        h(UButton, {
          color: 'neutral',
          variant: 'link',
          label: `${bookTitlePrefix}${sourceName}${bookTitleSuffix}`,
          class: 'p-0 self-start w-auto max-w-full text-muted hover:text-primary hover:underline',
          onClick: () => navigateWithSingleFilter('source_ids', source?.id ?? 0)
        }),
        ' · ',
        h(UButton, {
          color: 'neutral',
          variant: 'link',
          label: authorName,
          class: 'p-0 self-start w-auto max-w-full text-muted hover:text-primary hover:underline',
          onClick: () => navigateWithSingleFilter('author_ids', author?.id ?? 0)
        })
      ]);
    }
  },
  // 4级宽度：名句（内容）+ 翻译 + 来源 + 作者
  {
    accessorKey: 'quoteTypeFull',
    meta: {
      class: {
        th: 'w-25 hidden 3xl:table-cell',
        td: 'w-25 hidden 3xl:table-cell'
      }
    },
    header: t('pages.quotes.result.table.type'),
    cell: ({ row }) => {
      const { typeId } = row.original.infos;
      const typeLabel = t(`components.quotes.search.types.${typeId}`);
      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: typeLabel,
        class: 'p-0 self-start w-auto max-w-full text-muted hover:text-primary hover:underline',
        onClick: () => navigateWithSingleFilter('type_ids', typeId)
      });
    }
  },
  {
    accessorKey: 'quoteSourceFull',
    meta: {
      class: {
        th: 'w-25 hidden 3xl:table-cell',
        td: 'w-25 hidden 3xl:table-cell'
      }
    },
    header: t('pages.quotes.result.table.source'),
    cell: ({ row }) => {
      const { source } = row.original.infos;
      const sourceName = source?.name || 'unknown';

      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: sourceName,
        class: 'p-0 self-start w-auto max-w-full text-muted hover:text-primary hover:underline',
        onClick: () => navigateWithSingleFilter('source_ids', source?.id ?? 0)
      });
    }
  },
  {
    accessorKey: 'quoteAuthorFull',
    meta: {
      class: {
        th: 'w-40 hidden 3xl:table-cell',
        td: 'w-40 hidden 3xl:table-cell'
      }
    },
    header: t('pages.quotes.result.table.author'),
    cell: ({ row }) => {
      const { author } = row.original.infos;
      const authorName = author?.name || 'unknown';

      return h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: authorName,
        class: 'p-0 self-start w-auto max-w-full text-muted hover:text-primary hover:underline',
        onClick: () => navigateWithSingleFilter('author_ids', author?.id ?? 0)
      });
    }
  },
  {
    id: 'times',
    accessorKey: 'times',
    meta: {
      class: {
        th: 'w-45 2xl:hidden',
        td: 'w-45 2xl:hidden text-default'
      }
    },
    header: t('common.labels.time'),
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col gap-1.5' }, [
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('pages.quotes.result.table.updatedAt')}：`),
          h(Datetime, {
            class: 'w-auto max-w-full',
            datetime: row.original.times.updated,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        ]),
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('pages.quotes.result.table.createdAt')}：`),
          h(Datetime, {
            class: 'w-auto max-w-full',
            datetime: row.original.times.created,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        ])
      ])
  },
  {
    accessorKey: 'timesUpdated',
    meta: {
      class: {
        th: 'hidden 2xl:table-cell text-right',
        td: 'hidden 2xl:table-cell w-30 text-right'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'updated' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.quotes.result.table.updatedAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('updated') });
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
    accessorKey: 'timesCreated',
    meta: {
      class: {
        th: 'hidden 2xl:table-cell text-right',
        td: 'hidden 2xl:table-cell w-30 text-right'
      }
    },
    header: () => {
      const by = String(route.query.order_by || 'id');
      const dir = String(route.query.order_dir || 'desc');
      const isSorted = by === 'created' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.quotes.result.table.createdAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('created') });
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
  },
  {
    accessorKey: 'enabled',
    meta: {
      class: {
        td: 'w-20'
      }
    },
    header: t('pages.quotes.result.table.enabled'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.enabled,
        'onUpdate:modelValue': (value: boolean) => handleToggleEnabled(row.original, value)
      })
  }
];
</script>
