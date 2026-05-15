<template>
  <DashboardPage class="gap-4">
    <div class="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(13rem,14rem)_minmax(0,1fr)]">
      <UPageCard variant="outline" class="min-h-0" :ui="{ body: 'flex h-full min-h-0 flex-col gap-4 p-3' }">
        <div class="space-y-3">
          <div>
            <div class="text-highlighted text-sm font-semibold">{{ t('pages.hotsearch.data.platformsTitle') }}</div>
            <div class="text-muted mt-1 text-xs leading-5">{{ t('pages.hotsearch.data.platformsDescription') }}</div>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="soft">{{ t('pages.hotsearch.layout.dates.total', { value: computedPlatformOptions.length }) }}</UBadge>
            <UBadge :color="computedSelectedPlatformType === '' ? 'primary' : 'warning'" variant="soft">
              {{ computedSelectedPlatformType === '' ? t('pages.hotsearch.data.allPlatforms') : computedSelectedPlatformLabel }}
            </UBadge>
          </div>
        </div>

        <div class="scrollbar flex-1 space-y-2 overflow-y-auto">
          <UButton block :color="computedSelectedPlatformType === '' ? 'primary' : 'neutral'" :variant="computedSelectedPlatformType === '' ? 'solid' : 'soft'" size="sm" class="justify-start" @click="handlePlatformSelect('')">
            {{ t('pages.hotsearch.data.allPlatforms') }}
          </UButton>
          <UButton
            v-for="item in computedPlatformOptions"
            :key="item.type"
            block
            :color="computedSelectedPlatformType === item.type ? 'primary' : 'neutral'"
            :variant="computedSelectedPlatformType === item.type ? 'solid' : 'soft'"
            size="sm"
            class="justify-start"
            @click="handlePlatformSelect(item.type)"
          >
            {{ t(item.key) }}
          </UButton>
        </div>
      </UPageCard>

      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <UPageCard icon="i-lucide:list-ordered" :title="t('pages.hotsearch.data.cards.totalRows')" :description="String(computedRows.length)" />
          <UPageCard icon="i-lucide:badge-plus" :title="t('pages.hotsearch.data.cards.newRows')" :description="String(computedRows.filter((item) => item.isNew).length)" />
          <UPageCard icon="i-lucide:mic-2" :title="t('pages.hotsearch.data.cards.podcastRows')" :description="String(computedRows.filter((item) => item.isPodcast).length)" />
        </div>

        <UPageCard variant="outline" class="min-h-0 flex-1" :ui="{ body: 'flex min-h-0 flex-1 flex-col p-0' }">
          <template #header>
            <div class="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div class="text-highlighted text-sm font-semibold">{{ t('pages.hotsearch.sections.data.title') }}</div>
                <div class="text-muted mt-1 text-xs leading-5">{{ t('pages.hotsearch.data.description') }}</div>
              </div>

              <div class="flex flex-wrap gap-2">
                <UBadge color="primary" variant="soft">{{ hotsearchDateLabelGet(computedSelectedDate) }}</UBadge>
                <UBadge color="neutral" variant="soft">{{ t('pages.hotsearch.layout.dates.total', { value: computedRows.length }) }}</UBadge>
              </div>
            </div>
          </template>

          <div v-if="computedRows.length === 0" class="flex min-h-0 flex-1 items-center justify-center px-4 py-8">
            <UEmpty icon="i-lucide:inbox" :title="t('pages.hotsearch.data.empty.title')" :description="t('pages.hotsearch.data.empty.description')" />
          </div>

          <div v-else class="min-h-0 flex-1 overflow-auto px-4 pb-4">
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
        </UPageCard>
      </div>
    </div>

    <USlideover v-model:open="stateDetailOpen" side="right" :title="stateDetailRow.title" :description="t(stateDetailRow.categoryKey || 'pages.hotsearch.categories.tech')" :ui="{ content: 'w-auto max-w-180', close: 'no-drag', body: 'scrollbar space-y-4' }">
      <template #body>
        <div class="space-y-3">
          <div class="flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft">#{{ stateDetailRow.rank }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ t(`components.hotsearch.platform.${stateDetailRow.platformType}`) }}</UBadge>
            <UBadge :color="stateDetailRow.isPodcast ? 'warning' : 'neutral'" variant="soft">{{ stateDetailRow.isPodcast ? t('pages.hotsearch.data.status.podcastReady') : t('pages.hotsearch.data.status.pending') }}</UBadge>
          </div>
          <p class="text-toned leading-7">{{ stateDetailRow.summary }}</p>
          <div class="grid gap-3 md:grid-cols-2">
            <UPageCard icon="i-lucide:flame" :title="t('pages.hotsearch.data.table.popularity')" :description="stateDetailRow.popularity.toLocaleString()" />
            <UPageCard icon="i-lucide:clock-3" :title="t('pages.hotsearch.data.table.publishedAt')" :description="stateDetailRow.publishedAt" />
          </div>
          <UButton color="primary" variant="outline" icon="i-lucide:external-link" @click="handleSourceOpen(stateDetailRow.url)">
            {{ t('pages.hotsearch.actions.openSource') }}
          </UButton>
        </div>
      </template>
    </USlideover>
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
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 路由：当前页面路由。
 */
const route = useRoute();

/**
 * 状态：详情是否打开。
 */
const stateDetailOpen = ref(false);

/**
 * 状态：当前详情行。
 */
const stateDetailRow = ref<IHotsearchDataRow>({
  id: 0,
  date: '',
  rank: 0,
  title: '',
  summary: '',
  url: '',
  categoryKey: 'pages.hotsearch.categories.tech',
  platform: 0,
  platformType: 'baidu',
  popularity: 0,
  isPodcast: false,
  isNew: false,
  publishedAt: ''
});

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
 * 计算属性：当前平台标签。
 */
const computedSelectedPlatformLabel = computed(() => {
  const matchedPlatform = computedPlatformOptions.value.find((item) => item.type === computedSelectedPlatformType.value);

  return matchedPlatform ? t(matchedPlatform.key) : t('pages.hotsearch.data.allPlatforms');
});

/**
 * 计算属性：筛选后的数据行。
 */
const computedRows = computed(() => {
  const keyword = hotsearchQueryStringGet(route.query.keyword).toLowerCase();

  return hotsearchDataRowsGet(computedSelectedDate.value).filter((item) => {
    const keywordMatched = keyword === '' || item.title.toLowerCase().includes(keyword) || item.summary.toLowerCase().includes(keyword);
    const platformMatched = computedSelectedPlatformType.value === '' || item.platformType === computedSelectedPlatformType.value;

    return keywordMatched && platformMatched;
  });
});

/**
 * 表格：列定义。
 */
const columns: TableColumn<IHotsearchDataRow>[] = [
  {
    accessorKey: 'rank',
    header: '#'
  },
  {
    accessorKey: 'title',
    header: t('pages.hotsearch.data.table.title'),
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'space-y-2 py-2' }, [
        h('div', { class: 'text-highlighted text-sm font-semibold leading-6' }, item.title),
        h('div', { class: 'text-muted text-xs leading-5' }, item.summary),
        h(
          'div',
          { class: 'flex flex-wrap gap-2' },
          [
            h('span', { class: 'inline-flex items-center rounded-full bg-elevated px-2 py-1 text-[11px] text-toned' }, t(item.categoryKey)),
            item.isNew ? h('span', { class: 'inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-[11px] text-success' }, t('pages.hotsearch.data.status.new')) : null,
            item.isPodcast ? h('span', { class: 'inline-flex items-center rounded-full bg-warning/10 px-2 py-1 text-[11px] text-warning' }, t('pages.hotsearch.data.status.podcastReady')) : null
          ].filter(Boolean)
        )
      ]);
    }
  },
  {
    accessorKey: 'platformType',
    header: t('pages.hotsearch.data.table.platform'),
    cell: ({ row }) => t(`components.hotsearch.platform.${row.original.platformType}`)
  },
  {
    accessorKey: 'popularity',
    header: t('pages.hotsearch.data.table.popularity'),
    cell: ({ row }) => row.original.popularity.toLocaleString()
  },
  {
    accessorKey: 'publishedAt',
    header: t('pages.hotsearch.data.table.publishedAt')
  },
  {
    id: 'actions',
    header: t('pages.hotsearch.data.table.actions'),
    cell: ({ row }) =>
      h(
        UButton,
        {
          color: 'primary',
          variant: 'ghost',
          icon: 'i-lucide:panel-right-open',
          onClick: () => handleDetailOpen(row.original)
        },
        () => t('pages.hotsearch.data.table.detail')
      )
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
 * 函数：打开详情。
 *
 * # Arguments
 *
 * * `item` - 数据行。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleDetailOpen = (item: IHotsearchDataRow): void => {
  stateDetailRow.value = item;
  stateDetailOpen.value = true;
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
const handleSourceOpen = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
</script>
