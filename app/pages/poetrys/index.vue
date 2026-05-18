<template>
  <DashboardPage>
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedProetryDatas"
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
    <USlideover
      v-model:open="stateDetailOpen"
      side="left"
      :title="stateDetailInfo.title"
      :description="`${stateDetailInfo.dynasty.name} · ${stateDetailInfo.author.name}`"
      :ui="{
        content: 'font-ma-shan-zheng w-auto max-w-225 light:border-10 light:border-neutral-500 dark:border-neutral-600 light:bg-yellow-50 select-none',
        header: 'text-5xl font-medium',
        title: 'mb-4 text-default font-medium',
        close: 'no-drag',
        description: 'text-lg text-muted',
        body: 'scrollbar'
      }"
    >
      <template #body>
        <div class="light:bg-amber-100 flex flex-col justify-center rounded-lg p-4 dark:bg-neutral-800">
          <div class="text-muted mb-4 flex flex-wrap items-center gap-2 text-sm">
            <span>{{ poetryKindLabelGet(stateDetailInfo.kind) }}</span>
            <span>·</span>
            <span>{{ poetryMetaValueGet(stateDetailInfo.rhythmic.name) }}</span>
          </div>
          <p v-for="(para, inx) in stateDetailInfo.content" :key="`content-paragraph-${inx}`" class="text-default text-2xl leading-relaxed">
            {{ para }}
          </p>
        </div>
      </template>
    </USlideover>
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
 * 组件：复选框
 */
// const UCheckbox = resolveComponent('UCheckbox');

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
 * 状态：当前诗词详情
 */
const stateDetailOpen = ref<boolean>(false);

/**
 * 状态：详情信息
 */
const stateDetailInfo = ref<IPagePoetrysDetailInfo>({
  id: 0,
  title: '',
  kind: 'unknown',
  rhythmic: {
    id: 0,
    name: ''
  },
  sentence: '',
  content: [],
  author: {
    id: 0,
    name: '',
    count: 0
  },
  dynasty: {
    id: 0,
    name: '',
    count: 0
  },
  enabled: false,
  updated: '',
  created: ''
});

/**
 * 事件：查看详情
 * @param {IPageTableColumnPoetrys} poetry 诗词
 */
const handleViewDetail = async (poetry: IPageTableColumnPoetrys) => {
  stateDetailOpen.value = true;
  stateDetailInfo.value = {
    id: poetry.id,
    title: poetry.infos.title,
    kind: poetry.infos.kind,
    rhythmic: poetry.infos.rhythmic,
    sentence: poetry.infos.sentence,
    content: [],
    author: poetry.infos.author,
    dynasty: poetry.infos.dynasty,
    enabled: poetry.enabled,
    updated: poetry.times.updated,
    created: poetry.times.created
  };

  await refreshDetail({ datas: { id: poetry.id }, replace: true });

  const detail = detailDatas.value?.detail;
  if (!detail || stateDetailInfo.value.id !== poetry.id) {
    return;
  }

  stateDetailInfo.value = {
    ...detail,
    content: Array.isArray(detail.content) ? detail.content : []
  };
};

/**
 * 函数：获取作品类型文案。
 * @param {IPageTableColumnPoetrys['infos']['kind']} kind 作品类型
 * @returns {string} 类型文案
 */
const poetryKindLabelGet = (kind: IPageTableColumnPoetrys['infos']['kind']): string => t(`pages.poetrys.kind.${kind}`);

/**
 * 函数：获取章节文案。
 * @param {string} value 原始值
 * @returns {string} 章节文案
 */
const poetryMetaValueGet = (value: string): string => {
  const text = String(value ?? '').trim();

  return text === '' ? t('common.labels.none') : text;
};

/**
 * 函数：获取关联实体展示名称。
 * @param {{ id: number; name: string }} item 关联实体
 * @returns {string} 展示名称
 */
const poetryLinkedNameGet = (item: { id: number; name: string }): string => {
  if (Number(item.id) === 1) {
    return '';
  }

  return String(item.name ?? '').trim();
};

/**
 * 函数：获取标题展示文案。
 * @param {IPageTableColumnPoetrys['infos']} infos 作品信息
 * @param {boolean} includeRhythmic 是否展示词牌/曲牌前缀
 * @returns {string} 标题文案
 */
const poetryTitleDisplayGet = (infos: IPageTableColumnPoetrys['infos'], includeRhythmic: boolean): string => {
  const title = String(infos.title ?? '').trim();
  const rhythmicName = includeRhythmic ? poetryLinkedNameGet(infos.rhythmic) : '';
  const wrappedTitle = title === '' ? '' : `《${title}》`;

  if (rhythmicName === '') {
    return wrappedTitle;
  }

  if (wrappedTitle === '') {
    return rhythmicName;
  }

  return `${rhythmicName} · ${wrappedTitle}`;
};

/**
 * 函数：截断核心句展示文案。
 * @param {string} sentence 原始核心句
 * @param {number} maxLength 最大长度
 * @returns {string} 截断后的文案
 */
const poetrySentencePreviewGet = (sentence: string, maxLength: number): string => {
  const text = String(sentence ?? '').trim();
  const limit = Math.max(1, Math.trunc(maxLength));

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trimEnd()}...`;
};

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
   * 标题
   */
  const title = typeof route.query.title !== 'undefined' ? String(route.query.title).trim() : '';
  if (title) {
    query.title = title;
  }

  /**
   * 内容
   */
  const content = typeof route.query.content !== 'undefined' ? String(route.query.content).trim() : '';
  if (content) {
    query.content = content;
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
  const dynastyId = asArray(route.query.dynasty_ids);
  const authorId = asArray(route.query.author_ids);
  if (dynastyId.length > 0) {
    query.dynasty_ids = dynastyId;
  }
  if (authorId.length > 0) {
    query.author_ids = authorId;
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

  // 排序：orderBy（updated/created）与 order_dir（asc/desc）
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
 * 函数：构建单一筛选跳转位置（保留 pagesize/enabled/isAnd/title/content），移除 page。
 * @param {'dynasty_ids' | 'author_ids'} key 筛选键
 * @param {number | string} value 筛选值
 * @returns {{ path: string; query: Record<string, string | string[]> }} 路由位置
 */
const buildSingleFilterLocation = (key: 'dynasty_ids' | 'author_ids', value: number | string): { path: string; query: Record<string, string | string[]> } => {
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
  if (typeof route.query.title !== 'undefined') {
    const title = String(route.query.title).trim();
    if (title) {
      q.title = title;
    }
  }
  if (typeof route.query.content !== 'undefined') {
    const content = String(route.query.content).trim();
    if (content) {
      q.content = content;
    }
  }
  // 设置单选筛选
  q[key] = String(value);

  return { path: '/poetrys', query: q };
};

/**
 * 排序：切换指定字段（互斥）
 * @param {'updated'|'created'} field 排序字段
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
 * API：诗词搜索
 */
const { datas, loading, refresh, refreshDebounced } = await useApi<IQueryResultPoetrysSummaryPage>('poetrys', { datas: buildApiQueryFromRoute(), immediate: true });

/**
 * API：诗词详情
 */
const { datas: detailDatas, refresh: refreshDetail } = await useApi<IQueryResultPoetryDetailResponse>('poetrys/detail', { immediate: false });

/**
 * API：更新启用状态（复用实例，避免 useFetch key 缓存导致后续不请求）
 */
const { refresh: refreshSetEnabled } = await useApi<IQueryResultPoetrySetEnabledResponse>('poetrys/enabled', { method: 'POST', immediate: false });

/**
 * 计算属性：直接映射成表格需要的格式
 */
const computedProetryDatas = computed<IPageTableColumnPoetrys[]>(() => {
  if (!datas.value || !datas.value.rows || datas.value.rows.length === 0) {
    return [];
  }

  return datas.value.rows.map((item) => ({
    id: item.id ?? 0,
    infos: {
      title: String(item.title ?? '').trim(),
      kind: item.kind ?? 'unknown',
      rhythmic:
        item.rhythmic && typeof item.rhythmic === 'object'
          ? item.rhythmic
          : {
              id: 0,
              name: ''
            },
      sentence: item.sentence ?? 'unknown',
      dynasty:
        item.dynasty && typeof item.dynasty === 'object'
          ? item.dynasty
          : {
              id: 1,
              name: '',
              count: 0
            },
      author:
        item.author && typeof item.author === 'object'
          ? item.author
          : {
              id: 1,
              name: '',
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
 * 监听：查询参数变化时刷新列表（防抖）
 */
watch(
  () => route.query,
  () => {
    refresh({ datas: buildApiQueryFromRoute(), replace: true });
  }
);

/**
 * 监听：当分页条数变化导致当前页越界时，自动跳回有效页。
 */
watch(
  () => ({
    total: Number(datas.value?.total ?? 0),
    rows: Array.isArray(datas.value?.rows) ? datas.value?.rows.length : 0,
    pageSize: computedItemsPerPage.value,
    page: computedPage.value
  }),
  ({ total, rows, pageSize, page }) => {
    if (total <= 0 || rows > 0 || page <= 1) {
      return;
    }

    const maxPage = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
    if (page <= maxPage) {
      return;
    }

    const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
    q.page = String(maxPage);
    navigateTo({ path: route.path, query: q }, { replace: true });
  },
  { immediate: true }
);

/**
 * 函数：切换启用状态并调用后端更新
 * - 若路由 query 中存在 enabled 键，则更新后刷新当前列表
 */
const handleToggleEnabled = async (row: IPageTableColumnPoetrys, value: boolean) => {
  const prev = row.enabled;
  row.enabled = value;

  try {
    await refreshSetEnabled({ datas: { id: row.id, enabled: value }, replace: true });
    // 统一刷新列表，保证更新时间等字段同步
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  } catch {
    row.enabled = prev;
  }
};

/**
 * 常量：表格列定义
 */
const columns: TableColumn<IPageTableColumnPoetrys>[] = [
  // {
  //   id: 'select',
  //   meta: {
  //     class: {
  //       td: 'w-10'
  //     }
  //   },
  //   header: ({ table }) =>
  //     h(UCheckbox, {
  //       modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
  //       'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
  //       ariaLabel: 'Select all'
  //     }),
  //   cell: ({ row }) =>
  //     h(UCheckbox, {
  //       modelValue: row.getIsSelected(),
  //       'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
  //       ariaLabel: 'Select row'
  //     })
  // },
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
  // 1级宽度：小屏（< xl），复杂列展示全部核心信息
  {
    accessorKey: 'poem',
    meta: {
      class: {
        th: 'xl:hidden',
        td: 'xl:hidden'
      }
    },
    header: t('pages.poetrys.result.table.poem'),
    cell: ({ row }) => {
      const { infos } = row.original;
      const title = poetryTitleDisplayGet(infos, true);
      const dynastyName = poetryLinkedNameGet(infos.dynasty);
      const authorName = poetryLinkedNameGet(infos.author);
      const titleLine = `${poetryKindLabelGet(infos.kind)}${title}`;

      return h('div', { class: 'flex flex-col gap-1.5' }, [
        h(UButton, { color: 'neutral', variant: 'link', label: titleLine, class: 'p-0 self-start w-auto max-w-full text-default hover:text-primary hover:underline', onClick: () => handleViewDetail(row.original) }),
        ...(dynastyName === '' && authorName === ''
          ? []
          : [
              h('div', { class: 'flex items-center gap-1 text-sm text-muted' }, [
                ...(dynastyName === ''
                  ? []
                  : [
                      h(
                        ULink,
                        {
                          raw: true,
                          class: 'p-0 h-auto min-h-0 no-underline text-muted hover:text-primary hover:underline',
                          to: buildSingleFilterLocation('dynasty_ids', infos.dynasty.id)
                        },
                        () => dynastyName
                      )
                    ]),
                ...(dynastyName !== '' && authorName !== '' ? ['·'] : []),
                ...(authorName === ''
                  ? []
                  : [
                      h(
                        ULink,
                        {
                          raw: true,
                          class: 'p-0 h-auto min-h-0 no-underline text-muted hover:text-primary hover:underline',
                          to: buildSingleFilterLocation('author_ids', infos.author.id)
                        },
                        () => authorName
                      )
                    ])
              ])
            ]),
        h('p', { class: 'text-sm text-dimmed break-words' }, poetrySentencePreviewGet(infos.sentence, 36))
      ]);
    }
  },
  // 2级宽度：中屏（xl ~ < 2xl），标题列保留标题、类型与章节信息
  {
    accessorKey: 'poemTitleMedium',
    meta: {
      class: {
        th: 'w-88 hidden xl:table-cell 2xl:hidden',
        td: 'w-88 hidden xl:table-cell 2xl:hidden'
      }
    },
    header: t('pages.poetrys.result.table.title'),
    cell: ({ row }) => {
      const { infos } = row.original;

      return h('div', { class: 'flex flex-col gap-1.5' }, [
        h(UButton, { color: 'neutral', variant: 'link', label: poetryTitleDisplayGet(infos, true), class: 'p-0 self-start w-auto max-w-full text-default hover:text-primary hover:underline', onClick: () => handleViewDetail(row.original) }),
        h('p', { class: 'text-xs text-muted' }, poetryKindLabelGet(infos.kind))
      ]);
    }
  },
  // 3级宽度：大屏（≥ 2xl ~ < 5xl），标题列仅保留标题
  {
    accessorKey: 'poemTitleFull',
    meta: {
      class: {
        th: 'w-88 hidden 2xl:table-cell 5xl:hidden',
        td: 'w-88 hidden 2xl:table-cell 5xl:hidden'
      }
    },
    header: t('pages.poetrys.result.table.title'),
    cell: ({ row }) => {
      return h(UButton, { color: 'neutral', variant: 'link', label: poetryTitleDisplayGet(row.original.infos, true), class: 'p-0 self-start w-auto max-w-full text-default hover:text-primary hover:underline', onClick: () => handleViewDetail(row.original) });
    }
  },
  // 4级宽度：超宽屏（≥ 5xl），标题独立列不再重复词牌/曲牌
  {
    accessorKey: 'poemTitleUltra',
    meta: {
      class: {
        th: 'w-80 hidden 5xl:table-cell',
        td: 'w-80 hidden 5xl:table-cell'
      }
    },
    header: t('pages.poetrys.result.table.title'),
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'link',
        label: poetryTitleDisplayGet(row.original.infos, false),
        class: 'p-0 text-default hover:text-primary hover:underline',
        onClick: () => handleViewDetail(row.original)
      })
  },
  // 类型：从 xl 起逐步拆出，2xl 以上始终保持独立列
  {
    accessorKey: 'poemKind',
    meta: {
      class: {
        th: 'w-16 hidden 2xl:table-cell whitespace-nowrap',
        td: 'w-16 hidden 2xl:table-cell'
      }
    },
    header: t('pages.poetrys.result.table.kind'),
    cell: ({ row }) => poetryKindLabelGet(row.original.infos.kind)
  },
  // 超宽屏：词牌/曲牌独立列
  {
    accessorKey: 'poemRhythmic',
    meta: {
      class: {
        th: 'w-28 hidden 5xl:table-cell whitespace-nowrap',
        td: 'w-28 hidden 5xl:table-cell'
      }
    },
    header: t('pages.poetrys.result.table.rhythmic'),
    cell: ({ row }) => poetryLinkedNameGet(row.original.infos.rhythmic)
  },
  {
    accessorKey: 'poemSentenceFull',
    meta: {
      class: {
        th: 'hidden xl:table-cell',
        td: 'hidden xl:table-cell'
      }
    },
    header: t('pages.poetrys.result.table.sentence'),
    cell: ({ row }) => h('p', { class: 'text-sm text-dimmed break-words' }, poetrySentencePreviewGet(row.original.infos.sentence, 72))
  },
  {
    accessorKey: 'poemDynastyAuthor',
    meta: {
      class: {
        th: 'w-30 hidden xl:table-cell 5xl:hidden whitespace-nowrap',
        td: 'w-30 hidden xl:table-cell 5xl:hidden'
      }
    },
    header: t('pages.poetrys.result.table.dynastyAuthor'),
    cell: ({ row }) => {
      const { dynasty, author } = row.original.infos;
      const dynastyName = poetryLinkedNameGet(dynasty);
      const authorName = poetryLinkedNameGet(author);

      if (dynastyName === '' && authorName === '') {
        return '';
      }

      return h('div', { class: 'text-sm text-muted mt-1' }, [
        ...(dynastyName === '' ? [] : [h(ULink, { raw: true, class: 'p-0 self-start w-auto max-w-full no-underline text-muted hover:text-primary hover:underline', to: buildSingleFilterLocation('dynasty_ids', dynasty.id) }, () => `${dynastyName}（${dynasty.count}）`)]),
        ...(dynastyName !== '' && authorName !== '' ? [' · '] : []),
        ...(authorName === '' ? [] : [h(ULink, { raw: true, class: 'p-0 self-start w-auto max-w-full no-underline text-muted hover:text-primary hover:underline', to: buildSingleFilterLocation('author_ids', author.id) }, () => `${authorName}（${author.count}）`)])
      ]);
    }
  },
  // 超宽屏：将 朝代 / 作者 拆成独立列
  {
    accessorKey: 'poemDynastyFull',
    meta: {
      class: {
        th: 'w-18 hidden 5xl:table-cell whitespace-nowrap',
        td: 'w-18 hidden 5xl:table-cell'
      }
    },
    header: t('pages.poetrys.result.table.dynasty'),
    cell: ({ row }) =>
      poetryLinkedNameGet(row.original.infos.dynasty) === ''
        ? ''
        : h(
            ULink,
            {
              raw: true,
              class: 'p-0 no-underline text-muted hover:text-primary hover:underline',
              to: buildSingleFilterLocation('dynasty_ids', row.original.infos.dynasty.id)
            },
            () => `${poetryLinkedNameGet(row.original.infos.dynasty)}（${row.original.infos.dynasty.count}）`
          )
  },
  {
    accessorKey: 'poemAuthorFull',
    header: t('pages.poetrys.result.table.author'),
    meta: {
      class: {
        th: 'w-18 hidden 5xl:table-cell whitespace-nowrap',
        td: 'w-18 hidden 5xl:table-cell'
      }
    },
    cell: ({ row }) =>
      poetryLinkedNameGet(row.original.infos.author) === ''
        ? ''
        : h(
            ULink,
            {
              raw: true,
              class: 'p-0 no-underline text-muted hover:text-primary hover:underline',
              to: buildSingleFilterLocation('author_ids', row.original.infos.author.id)
            },
            () => `${poetryLinkedNameGet(row.original.infos.author)}（${row.original.infos.author.count}）`
          )
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
          h('span', { class: 'shrink-0 text-muted' }, `${t('pages.poetrys.result.table.updatedAt')}：`),
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
          h('span', { class: 'shrink-0 text-muted' }, `${t('pages.poetrys.result.table.createdAt')}：`),
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
  },
  {
    accessorKey: 'enabled',
    meta: {
      class: {
        td: 'w-20'
      }
    },
    header: t('pages.poetrys.result.table.enabled'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.enabled,
        'onUpdate:modelValue': (value: boolean) => handleToggleEnabled(row.original, value)
      })
  },
  {
    id: 'actions',
    meta: {
      class: {
        td: 'w-20'
      }
    },
    enableHiding: false,
    header: t('pages.poetrys.result.table.actions'),
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('pages.poetrys.result.table.detail'),
        onClick: () => handleViewDetail(row.original)
      })
  }
];
</script>
