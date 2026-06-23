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
 * 组件：链接
 */
const ULink = resolveComponent('ULink');

/**
 * 组件：开关
 */
const USwitch = resolveComponent('USwitch');

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
 * 状态：分页大小 cookie。
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow'
});

/**
 * 函数：获取当前生效分页大小。
 * @returns {string} 分页大小文本。
 */
const currentPageSizeGet = (): string => {
  /**
   * 常量：routeValue。
   */
  const routeValue = typeof route.query.pagesize !== 'undefined' ? String(route.query.pagesize).trim() : '';

  if (routeValue !== '') {
    return routeValue;
  }

  return String(getPageSizeByCookieParsed(pagesizesCookie.value, 'common'));
};

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
  /**
   * 常量：authorIds。
   */
  const authorIds = asArray(route.query.author_ids);
  /**
   * 常量：sourceIds。
   */
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
  query.pagesize = currentPageSizeGet();

  // 排序：orderBy（id/updated/created）与 order_dir（asc/desc）
  if (typeof route.query.order_by !== 'undefined') {
    /**
     * 常量：by。
     */
    const by = String(route.query.order_by);
    if (by === 'id' || by === 'updated' || by === 'created') {
      query.order_by = by;
    }
  }
  if (typeof route.query.order_dir !== 'undefined') {
    /**
     * 常量：dir。
     */
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
  /**
   * 常量：currentDir。
   */
  const currentDir = String(route.query.order_dir || 'desc');
  /**
   * 常量：nextBy。
   */
  const nextBy = field;
  /**
   * 常量：nextDir。
   */
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
    /**
     * 常量：str。
     */
    const str = route.query.page as string | undefined;
    /**
     * 常量：num。
     */
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
  /**
   * 常量：str。
   */
  const str = route.query.pagesize as string | undefined;
  /**
   * 函数：parsed。
   */
  const parsed = parseInt(str ?? '', 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  /**
   * 常量：cookieSize。
   */
  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'common');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }
  /**
   * 常量：apiSize。
   */
  const apiSize = Number(datas.value?.pageSize ?? 20);
  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 函数：切换启用状态并调用后端更新
 * - 若路由 query 中存在 enabled 键，则更新后刷新当前列表
 */
const handleToggleEnabled = async (row: IPageTableColumnQuotes, value: boolean) => {
  /**
   * 常量：prev。
   */
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
 * 函数：构建名句详情外链。
 * @param {string} uuid 名句 UUID
 * @returns {string} 外链地址
 */
const buildQuoteDetailUrl = (uuid: string): string => `https://hitokoto.cn?uuid=${uuid}`;

/**
 * 事件：点击名句句子链接。
 * @param {MouseEvent} event 点击事件
 * @param {string} uuid 名句 UUID
 */
const handleClickSentenceLink = async (event: MouseEvent, uuid: string): Promise<void> => {
  /**
   * 常量：url。
   */
  const url = buildQuoteDetailUrl(uuid);

  if (isTauriRuntime.value) {
    event.preventDefault();
    await openExternalUrl(url);
  }
};

/**
 * 函数：构建单一筛选跳转位置（保留 pagesize/enabled/isAnd/uuid/content/translate），移除 page。
 * @param {'type_ids' | 'source_ids' | 'author_ids'} key 筛选键
 * @param {number | string} value 筛选值
 * @returns {{ path: string; query: Record<string, string | string[]> }} 路由位置
 */
const buildSingleFilterLocation = (key: 'type_ids' | 'source_ids' | 'author_ids', value: number | string): { path: string; query: Record<string, string | string[]> } => {
  const q: Record<string, string | string[]> = {};

  // 保留必要参数
  q.pagesize = currentPageSizeGet();
  if (typeof route.query.enabled !== 'undefined') {
    q.enabled = String(route.query.enabled);
  }
  if (typeof route.query.is_and !== 'undefined') {
    q.is_and = String(route.query.is_and);
  }
  if (typeof route.query.uuid !== 'undefined') {
    /**
     * 常量：uuid。
     */
    const uuid = String(route.query.uuid).trim();
    if (uuid) {
      q.uuid = uuid;
    }
  }
  if (typeof route.query.content !== 'undefined') {
    /**
     * 常量：content。
     */
    const content = String(route.query.content).trim();
    if (content) {
      q.content = content;
    }
  }
  if (typeof route.query.translate !== 'undefined') {
    /**
     * 常量：translate。
     */
    const translate = String(route.query.translate).trim();
    if (translate) {
      q.translate = translate;
    }
  }

  // 设置单选筛选
  q[key] = String(value);

  return { path: localePath('/quotes'), query: q };
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
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'id' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
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
      /**
       * 常量：typeLabel。
       */
      const typeLabel = t(`components.quotes.search.types.${typeId}`);
      /**
       * 常量：bookTitlePrefix。
       */
      const bookTitlePrefix = t('common.content.bookTitle.prefix');
      /**
       * 常量：bookTitleSuffix。
       */
      const bookTitleSuffix = t('common.content.bookTitle.suffix');
      /**
       * 常量：nodes。
       */
      const nodes = [
        h('div', { class: 'min-w-0' }, [
          h(
            ULink,
            {
              raw: true,
              href: buildQuoteDetailUrl(row.original.uuid),
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'p-0 text-default no-underline hover:text-primary hover:underline',
              onClick: (event: MouseEvent) => void handleClickSentenceLink(event, row.original.uuid)
            },
            () => h('span', { class: 'whitespace-normal break-words' }, sentence)
          )
        ])
      ];

      if (translate) {
        nodes.push(h('p', { class: 'text-sm text-dimmed mt-1' }, translate));
      }

      /**
       * 常量：sourceName。
       */
      const sourceName = source?.name || 'unknown';
      /**
       * 常量：authorName。
       */
      const authorName = author?.name || 'unknown';
      nodes.push(
        h('div', { class: 'text-xs text-muted mt-1' }, [
          h(
            ULink,
            {
              raw: true,
              class: 'p-0 no-underline text-xs text-muted hover:text-primary hover:underline',
              to: buildSingleFilterLocation('type_ids', typeId)
            },
            () => typeLabel
          ),
          ' · ',
          h(
            ULink,
            {
              raw: true,
              class: 'p-0 no-underline text-xs text-muted hover:text-primary hover:underline',
              to: buildSingleFilterLocation('source_ids', source?.id ?? 0)
            },
            () => `${bookTitlePrefix}${sourceName}${bookTitleSuffix}`
          ),
          ' · ',
          h(
            ULink,
            {
              raw: true,
              class: 'p-0 no-underline text-xs text-muted hover:text-primary hover:underline',
              to: buildSingleFilterLocation('author_ids', author?.id ?? 0)
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
      /**
       * 常量：nodes。
       */
      const nodes = [
        h('div', { class: 'min-w-0' }, [
          h(
            ULink,
            {
              raw: true,
              href: buildQuoteDetailUrl(row.original.uuid),
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'p-0 text-default no-underline hover:text-primary hover:underline',
              onClick: (event: MouseEvent) => void handleClickSentenceLink(event, row.original.uuid)
            },
            () => h('span', { class: 'whitespace-normal break-words' }, sentence)
          )
        ])
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
        th: 'w-max min-w-max hidden xl:table-cell 3xl:hidden whitespace-nowrap',
        td: 'w-max min-w-max hidden xl:table-cell 3xl:hidden whitespace-nowrap'
      }
    },
    header: t('pages.quotes.result.table.typeSourceAuthor'),
    cell: ({ row }) => {
      const { source, author, typeId } = row.original.infos;
      /**
       * 常量：typeLabel。
       */
      const typeLabel = t(`components.quotes.search.types.${typeId}`);
      /**
       * 常量：bookTitlePrefix。
       */
      const bookTitlePrefix = t('common.content.bookTitle.prefix');
      /**
       * 常量：bookTitleSuffix。
       */
      const bookTitleSuffix = t('common.content.bookTitle.suffix');
      /**
       * 常量：sourceName。
       */
      const sourceName = source?.name || 'unknown';
      /**
       * 常量：authorName。
       */
      const authorName = author?.name || 'unknown';

      return h('div', { class: 'text-sm text-muted mt-1 whitespace-nowrap' }, [
        h(
          ULink,
          {
            raw: true,
            class: 'p-0 text-muted whitespace-nowrap no-underline hover:text-primary hover:underline',
            to: buildSingleFilterLocation('type_ids', typeId)
          },
          () => typeLabel
        ),
        ' · ',
        h(
          ULink,
          {
            raw: true,
            class: 'p-0 text-muted whitespace-nowrap no-underline hover:text-primary hover:underline',
            to: buildSingleFilterLocation('source_ids', source?.id ?? 0)
          },
          () => `${bookTitlePrefix}${sourceName}${bookTitleSuffix}`
        ),
        ' · ',
        h(
          ULink,
          {
            raw: true,
            class: 'p-0 text-muted whitespace-nowrap no-underline hover:text-primary hover:underline',
            to: buildSingleFilterLocation('author_ids', author?.id ?? 0)
          },
          () => authorName
        )
      ]);
    }
  },
  // 4级宽度：名句（内容）+ 翻译 + 来源 + 作者
  {
    accessorKey: 'quoteTypeFull',
    meta: {
      class: {
        th: 'w-max hidden 3xl:table-cell whitespace-nowrap',
        td: 'w-max hidden 3xl:table-cell whitespace-nowrap'
      }
    },
    header: t('pages.quotes.result.table.type'),
    cell: ({ row }) => {
      const { typeId } = row.original.infos;
      /**
       * 常量：typeLabel。
       */
      const typeLabel = t(`components.quotes.search.types.${typeId}`);
      return h(
        ULink,
        {
          raw: true,
          class: 'p-0 text-muted whitespace-normal break-words no-underline hover:text-primary hover:underline',
          to: buildSingleFilterLocation('type_ids', typeId)
        },
        () => typeLabel
      );
    }
  },
  // 5级宽度：名句（内容）+ 翻译 + 来源 + 作者
  {
    accessorKey: 'quoteSourceFull',
    meta: {
      class: {
        th: 'w-max hidden 3xl:table-cell whitespace-nowrap',
        td: 'w-max hidden 3xl:table-cell whitespace-nowrap'
      }
    },
    header: t('pages.quotes.result.table.source'),
    cell: ({ row }) => {
      const { source } = row.original.infos;
      /**
       * 常量：sourceName。
       */
      const sourceName = source?.name || 'unknown';

      return h(
        ULink,
        {
          raw: true,
          class: 'p-0 text-muted whitespace-normal break-words no-underline hover:text-primary hover:underline',
          to: buildSingleFilterLocation('source_ids', source?.id ?? 0)
        },
        () => sourceName
      );
    }
  },
  {
    accessorKey: 'quoteAuthorFull',
    meta: {
      class: {
        th: 'w-max hidden 3xl:table-cell whitespace-nowrap',
        td: 'w-max hidden 3xl:table-cell whitespace-nowrap'
      }
    },
    header: t('pages.quotes.result.table.author'),
    cell: ({ row }) => {
      const { author } = row.original.infos;
      /**
       * 常量：authorName。
       */
      const authorName = author?.name || 'unknown';

      return h(
        ULink,
        {
          raw: true,
          class: 'p-0 text-muted whitespace-normal break-words no-underline hover:text-primary hover:underline',
          to: buildSingleFilterLocation('author_ids', author?.id ?? 0)
        },
        () => authorName
      );
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
          h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.updatedAt')}：`),
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
          h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.createdAt')}：`),
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
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'updated' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('common.datetimes.updatedAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('updated') });
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
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'created' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('common.datetimes.createdAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('created') });
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
    header: t('common.labels.enabled'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.enabled,
        'onUpdate:modelValue': (value: boolean) => handleToggleEnabled(row.original, value)
      })
  }
];
</script>
