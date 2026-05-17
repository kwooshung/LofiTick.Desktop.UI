<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="computedSectionLinks" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <UPopover v-model:open="stateDatePickerOpen" :content="{ align: 'end', side: 'bottom', sideOffset: 10 }">
        <UButton color="neutral" variant="ghost" icon="i-lucide-calendar-days" class="shrink-0">
          {{ computedDatePickerButtonLabel }}
        </UButton>

        <template #content>
          <div class="w-88 space-y-3 p-3 sm:w-96">
            <UCalendar v-model="computedCalendarModelValue" color="neutral" variant="subtle" :min-value="computedCalendarMinValue" :max-value="computedCalendarMaxValue" :is-date-disabled="calendarDateDisabledGet" class="mx-auto" @mouseleave="handleDatePreviewReset">
              <template #day="{ day }">
                <span class="inline-flex" :class="calendarDateSummaryGet(day) ? 'cursor-pointer' : 'pointer-events-none cursor-default'" @mouseenter="handleDatePreview(day)">
                  <UChip :show="calendarDateSummaryGet(day) !== null" :color="calendarDateSummaryGet(day)?.mediaReady ? 'warning' : 'primary'" size="2xs" inset>
                    {{ day.day }}
                  </UChip>
                </span>
              </template>
            </UCalendar>

            <div class="border-default bg-default/80 space-y-3 rounded-xl border px-3 py-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-highlighted text-sm font-medium">{{ computedDatePickerDisplaySummary?.updatedAt || hotsearchDateLabelGet(computedDatePickerDisplayDate) }}</div>
                  <div class="text-muted mt-1 text-xs">{{ hotsearchDateLabelGet(computedDatePickerDisplayDate) }}</div>
                </div>

                <UBadge :color="computedDatePickerDisplaySummary?.mediaReady ? 'warning' : 'neutral'" variant="soft">
                  {{ computedDatePickerDisplaySummary?.mediaReady ? t('pages.hotsearch.data.status.podcastReady') : t('pages.hotsearch.data.status.pending') }}
                </UBadge>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <UBadge color="primary" variant="soft">{{ t('pages.hotsearch.layout.dates.total', { value: computedDatePickerDisplaySummary?.totalCount ?? 0 }) }}</UBadge>
                <UBadge color="warning" variant="soft">{{ t('pages.hotsearch.layout.dates.podcastCount', { value: computedDatePickerDisplaySummary?.podcastCount ?? 0 }) }}</UBadge>
              </div>
            </div>
          </div>
        </template>
      </UPopover>
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
          <div class="flex min-w-0 flex-col pt-5">
            <div class="relative min-w-0 pr-22 pb-2 sm:pr-24">
              <div class="max-w-2xl min-w-0 space-y-2.5">
                <div class="text-highlighted text-2xl leading-none font-semibold">{{ computedToolbarPanelTitle }}</div>
                <p class="text-muted max-w-2xl text-sm leading-6">{{ computedToolbarPanelDescription }}</p>
              </div>

              <div class="absolute top-1.5 right-0 z-1 flex shrink-0 items-start">
                <div class="border-default bg-default flex w-16 shrink-0 flex-col overflow-hidden rounded-lg border shadow-sm">
                  <div class="bg-primary px-2 py-1 text-center text-xs font-semibold tracking-[0.08em] text-white">
                    {{ computedToolbarDateParts.month }}
                  </div>
                  <div class="flex min-h-13 flex-col items-center justify-center px-2 py-2">
                    <div class="text-highlighted text-3xl leading-none font-semibold tracking-[-0.04em]">{{ computedToolbarDateParts.day }}</div>
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
import type { DateValue } from '@internationalized/date';
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
import type { NavigationMenuItem } from '@nuxt/ui';

/**
 * Hook：国际化。
 */
const { locale, locales, t } = useI18n();

/**
 * Hook：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 路由：当前路由。
 */
const route = useRoute();

/**
 * 常量：日历时区。
 */
const calendarTimeZone = getLocalTimeZone();

/**
 * 状态：日期选择器是否打开。
 */
const stateDatePickerOpen = ref(false);

/**
 * 状态：悬停预览日期。
 */
const stateDatePickerPreviewDate = ref('');

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 状态：工具栏关键词。
 */
const stateToolbarKeyword = ref('');

/**
 * 计算属性：日期格式化器。
 */
const computedDateFormatterLocale = computed(() => String(locales.value.find((item) => item.code === locale.value)?.language || locale.value.replace(/_/g, '-')));

/**
 * 计算属性：日期格式化器。
 */
const computedDateFormatter = computed(() => new DateFormatter(computedDateFormatterLocale.value, { dateStyle: 'medium' }));

/**
 * 计算属性：日期摘要列表。
 */
const computedDateSummaries = computed(() => hotsearchArchiveDateSummariesGet());

/**
 * 计算属性：日期摘要映射。
 */
const computedDateSummaryMap = computed(() => new Map(computedDateSummaries.value.map((item) => [item.date, item])));

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
 * 计算属性：日期按钮标题。
 */
const computedDatePickerButtonLabel = computed(() => {
  const selectedCalendarDate = calendarDateFromIsoGet(computedSelectedDate.value);

  if (!selectedCalendarDate) {
    return hotsearchDateLabelGet(computedSelectedDate.value);
  }

  return computedDateFormatter.value.format(selectedCalendarDate.toDate(calendarTimeZone));
});

/**
 * 计算属性：日期选择器当前展示日期。
 */
const computedDatePickerDisplayDate = computed(() => stateDatePickerPreviewDate.value || computedSelectedDate.value);

/**
 * 计算属性：日期选择器当前展示摘要。
 */
const computedDatePickerDisplaySummary = computed(() => computedDateSummaryMap.value.get(computedDatePickerDisplayDate.value) ?? null);

/**
 * 计算属性：日历最小日期。
 */
const computedCalendarMinValue = computed(() => calendarDateFromIsoGet(computedDateSummaries.value.at(-1)?.date ?? computedSelectedDate.value) ?? today(calendarTimeZone));

/**
 * 计算属性：日历最大日期。
 */
const computedCalendarMaxValue = computed(() => today(calendarTimeZone));

/**
 * 计算属性：日历当前值。
 */
const computedCalendarModelValue = computed<CalendarDate>({
  get: () => calendarDateFromIsoGet(computedSelectedDate.value) ?? today(calendarTimeZone),
  set: (value) => {
    const nextDate = calendarIsoDateGet(value);

    if (!nextDate || calendarDateDisabledGet(value)) {
      return;
    }

    stateDatePickerPreviewDate.value = '';
    stateDatePickerOpen.value = false;
    handleDateChange(nextDate);
  }
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

/**
 * 函数：解析 ISO 日期为日历日期。
 *
 * @param {string} value ISO 日期。
 * @return {CalendarDate | null}
 */
const calendarDateFromIsoGet = (value: string): CalendarDate | null => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!matched) {
    return null;
  }

  return new CalendarDate(Number(matched[1]), Number(matched[2]), Number(matched[3]));
};

/**
 * 函数：格式化日历日期为 ISO 日期。
 *
 * @param {DateValue} value 日历日期。
 * @return {string}
 */
const calendarIsoDateGet = (value: DateValue): string => {
  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
};

/**
 * 函数：获取日历日期摘要。
 *
 * @param {DateValue} value 日历日期。
 * @return {IHotsearchArchiveDateSummary | null}
 */
const calendarDateSummaryGet = (value: DateValue): IHotsearchArchiveDateSummary | null => {
  return computedDateSummaryMap.value.get(calendarIsoDateGet(value)) ?? null;
};

/**
 * 函数：判断日期是否禁选。
 *
 * @param {DateValue} value 日历日期。
 * @return {boolean}
 */
const calendarDateDisabledGet = (value: DateValue): boolean => {
  return !computedDateSummaryMap.value.has(calendarIsoDateGet(value));
};

/**
 * 函数：设置日期悬停预览。
 *
 * @param {DateValue} value 日历日期。
 * @return {void}
 */
const handleDatePreview = (value: DateValue): void => {
  const nextDate = calendarIsoDateGet(value);

  if (!computedDateSummaryMap.value.has(nextDate)) {
    return;
  }

  stateDatePickerPreviewDate.value = nextDate;
};

/**
 * 函数：重置日期悬停预览。
 *
 * @return {void}
 */
const handleDatePreviewReset = (): void => {
  stateDatePickerPreviewDate.value = '';
};

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
