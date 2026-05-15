<template>
  <Dashboard>
    <template #panel-left>
      <HotsearchDateSidebar :summaries="computedDateSummaries" :selected-date="computedSelectedDate" @change="handleDateChange" />
    </template>

    <template #toolbar-left>
      <UNavigationMenu :items="computedSectionLinks" highlight class="-translate-x-2.5" />
    </template>

    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div v-if="computedToolbarPanelVisible" :class="['border-default bg-elevated/15 flex min-w-0 shrink-0 flex-col px-4 sm:px-6', computedRouteIsPodcast ? '' : 'border-b']">
        <template v-if="computedRouteIsData">
          <div class="flex min-w-0 flex-col gap-3 py-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <div class="text-highlighted text-sm font-semibold">{{ computedToolbarPanelTitle }}</div>
                <span class="text-muted text-xs">{{ hotsearchDateLabelGet(computedSelectedDate) }}</span>
                <span v-if="computedSelectedPlatformLabel !== ''" class="text-muted text-xs">/ {{ computedSelectedPlatformLabel }}</span>
              </div>
              <p class="text-muted mt-1 text-xs leading-5">{{ computedToolbarPanelDescription }}</p>
            </div>

            <div class="flex min-w-0 flex-wrap items-center gap-2 xl:justify-end">
              <UInput v-model="stateToolbarKeyword" :placeholder="t('pages.hotsearch.data.searchPlaceholder')" class="w-full min-w-0 xl:w-80" @keyup.enter="handleKeywordApply">
                <template #leading>
                  <UIcon name="i-lucide:search" class="text-dimmed size-4" />
                </template>
              </UInput>
              <UButton color="primary" icon="i-lucide:search" @click="handleKeywordApply">{{ t('pages.hotsearch.data.searchAction') }}</UButton>
              <UButton color="neutral" variant="soft" icon="i-lucide:rotate-ccw" @click="handleFilterReset">{{ t('pages.hotsearch.actions.resetFilters') }}</UButton>
            </div>
          </div>
        </template>

        <template v-else-if="computedRouteIsPodcast">
          <div class="flex min-w-0 flex-col pt-3">
            <div class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-6 pb-3">
              <div class="min-w-0 space-y-2.5">
                <div class="flex min-w-0 flex-wrap items-center gap-2">
                  <span class="text-muted text-[11px] font-medium tracking-[0.16em] uppercase">{{ t('pages.hotsearch.sections.podcast.title') }}</span>
                  <span class="text-muted text-xs">{{ computedToolbarDateParts.year }}</span>
                </div>

                <div class="text-highlighted text-[1.625rem] leading-none font-semibold">{{ computedToolbarPanelTitle }}</div>
                <p class="text-muted max-w-2xl text-sm leading-6">{{ computedToolbarPanelDescription }}</p>
              </div>

              <div class="flex shrink-0 items-start gap-3">
                <div class="border-default bg-default flex w-18 shrink-0 flex-col overflow-hidden rounded-lg border shadow-sm">
                  <div class="bg-primary px-2 py-1.5 text-center text-sm font-semibold tracking-[0.08em] text-white">
                    {{ computedToolbarDateParts.month }}
                  </div>
                  <div class="flex min-h-15 flex-col items-center justify-center px-2 py-2.25">
                    <div class="text-highlighted text-[2.2rem] leading-none font-semibold tracking-[-0.04em]">{{ computedToolbarDateParts.day }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-default/75 border-default after:border-default relative -mx-4 flex h-12.25 shrink-0 items-center justify-between gap-1.5 overflow-hidden px-4 after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:block after:w-full after:border-b after:content-[''] sm:-mx-6 sm:px-6"
            >
              <div class="relative z-10 flex w-full items-center justify-between gap-1.5">
                <div class="flex items-center justify-start gap-1.5">
                  <UNavigationMenu v-if="computedPodcastVariantLinks.length > 0" :items="computedPodcastVariantLinks" highlight class="-translate-x-2.5" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div class="min-h-full">
          <NuxtPage />
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 路由：当前路由。
 */
const route = useRoute();

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 状态：工具栏关键词。
 */
const stateToolbarKeyword = ref('');

/**
 * 计算属性：日期摘要列表。
 */
const computedDateSummaries = computed(() => hotsearchArchiveDateSummariesGet());

/**
 * 计算属性：当前选中日期。
 */
const computedSelectedDate = computed(() => {
  const queryDate = hotsearchQueryStringGet(route.query.date as string | null | Array<string | null> | undefined);

  if (computedDateSummaries.value.some((item) => item.date === queryDate)) {
    return queryDate;
  }

  return computedDateSummaries.value[0]?.date ?? '';
});

/**
 * 计算属性：当前是否为数据页。
 */
const computedRouteIsData = computed(() => route.path === localePath('/hotsearch'));

/**
 * 计算属性：当前是否为播客页。
 */
const computedRouteIsPodcast = computed(() => route.path.startsWith(localePath('/hotsearch/podcast')));

/**
 * 计算属性：当前是否为背景音乐页。
 */
const computedRouteIsMusic = computed(() => route.path === localePath('/hotsearch/music'));

/**
 * 计算属性：主分区链接。
 */
const computedSectionLinks = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: t('pages.hotsearch.sections.data.title'),
      icon: 'i-lucide:table-properties',
      active: computedRouteIsData.value,
      to: {
        path: localePath('/hotsearch'),
        query: { date: computedSelectedDate.value }
      },
      exact: true
    },
    {
      label: t('pages.hotsearch.sections.podcast.title'),
      icon: 'i-lucide:mic-2',
      active: computedRouteIsPodcast.value,
      to: {
        path: localePath('/hotsearch/podcast'),
        query: { date: computedSelectedDate.value }
      }
    },
    {
      label: t('pages.hotsearch.sections.music.title'),
      icon: 'i-lucide:music-4',
      active: computedRouteIsMusic.value,
      to: {
        path: localePath('/hotsearch/music'),
        query: { date: computedSelectedDate.value }
      }
    }
  ]
]);

/**
 * 计算属性：播客变体链接。
 */
const computedPodcastVariantLinks = computed<NavigationMenuItem[][]>(() => {
  if (!route.path.startsWith(localePath('/hotsearch/podcast'))) {
    return [];
  }

  return [
    [
      {
        label: t('pages.hotsearch.podcast.variants.morningShort.title'),
        icon: 'i-lucide:sun-medium',
        active: route.path === localePath('/hotsearch/podcast/morning-short'),
        to: {
          path: localePath('/hotsearch/podcast/morning-short'),
          query: { date: computedSelectedDate.value }
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.podcast.variants.morningLong.title'),
        icon: 'i-lucide:sun',
        active: route.path === localePath('/hotsearch/podcast/morning-long'),
        to: {
          path: localePath('/hotsearch/podcast/morning-long'),
          query: { date: computedSelectedDate.value }
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.podcast.variants.eveningShort.title'),
        icon: 'i-lucide:moon-star',
        active: route.path === localePath('/hotsearch/podcast/evening-short'),
        to: {
          path: localePath('/hotsearch/podcast/evening-short'),
          query: { date: computedSelectedDate.value }
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.podcast.variants.eveningLong.title'),
        icon: 'i-lucide:moon',
        active: route.path === localePath('/hotsearch/podcast/evening-long'),
        to: {
          path: localePath('/hotsearch/podcast/evening-long'),
          query: { date: computedSelectedDate.value }
        },
        exact: true
      }
    ]
  ];
});

/**
 * 计算属性：工具区面板是否显示。
 */
const computedToolbarPanelVisible = computed(() => computedRouteIsData.value || computedRouteIsPodcast.value);

/**
 * 计算属性：工具区面板标题。
 */
const computedToolbarPanelTitle = computed(() => {
  if (computedRouteIsData.value) {
    return t('pages.hotsearch.sections.data.title');
  }

  const variantOption = hotsearchPodcastVariantOptionsGet().find((item) => route.path === localePath(`/hotsearch/podcast/${item.key}`));

  if (variantOption) {
    return t(variantOption.labelKey);
  }

  return t('pages.hotsearch.sections.podcast.title');
});

/**
 * 计算属性：工具区面板描述。
 */
const computedToolbarPanelDescription = computed(() => {
  if (computedRouteIsData.value) {
    return t('pages.hotsearch.data.description');
  }

  const variantOption = hotsearchPodcastVariantOptionsGet().find((item) => route.path === localePath(`/hotsearch/podcast/${item.key}`));

  if (variantOption) {
    return t(variantOption.descriptionKey);
  }

  return t('pages.hotsearch.podcast.description');
});

/**
 * 计算属性：工具区日期块。
 */
const computedToolbarDateParts = computed(() => {
  const [year = '', month = '', day = ''] = computedSelectedDate.value.split('-');

  return {
    year,
    month,
    day,
    label: hotsearchDateLabelGet(computedSelectedDate.value)
  };
});

/**
 * 计算属性：当前选中平台标签。
 */
const computedSelectedPlatformLabel = computed(() => {
  const platformType = hotsearchQueryStringGet(route.query.platform as string | null | Array<string | null> | undefined);

  if (platformType === '') {
    return '';
  }

  const matchedPlatform = hotsearchPlatformsList().find((item) => item.type === platformType);

  return matchedPlatform ? t(matchedPlatform.key) : '';
});

watch(
  () => route.query.keyword,
  (value) => {
    stateToolbarKeyword.value = hotsearchQueryStringGet(value as string | null | Array<string | null> | undefined);
  },
  {
    immediate: true
  }
);

storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.hotsearch.title'),
    icon: 'i-material-symbols:bigtop-updates-rounded',
    to: localePath('/hotsearch'),
    exact: false
  }
];

/**
 * 函数：切换日期。
 *
 * @param {string} date 目标日期。
 * @return {void}
 */
const handleDateChange = (date: string): void => {
  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      date
    }
  });
};

/**
 * 函数：应用关键词筛选。
 *
 * @return {void}
 */
const handleKeywordApply = (): void => {
  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      keyword: stateToolbarKeyword.value.trim() || undefined
    }
  });
};

/**
 * 函数：重置顶部筛选。
 *
 * @return {void}
 */
const handleFilterReset = (): void => {
  navigateTo({
    path: route.path,
    query: {
      date: computedSelectedDate.value
    }
  });
};
</script>
