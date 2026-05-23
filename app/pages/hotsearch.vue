<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="computedSectionLinks" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <div class="flex items-center gap-2">
        <template v-if="computedRouteIsDataSection">
          <SelectsPagesizes cache-key="hotsearch" />

          <UInput v-model="stateToolbarKeyword" :placeholder="t('pages.hotsearch.data.searchPlaceholder')" :ui="{ trailing: 'pe-1' }" class="hidden md:flex md:w-72 xl:w-80" @keyup.enter="handleKeywordApply">
            <template #leading>
              <UIcon name="i-lucide:search" class="text-dimmed size-4" />
            </template>

            <template #trailing>
              <div class="flex items-center">
                <UButton v-if="stateToolbarKeyword !== ''" color="neutral" variant="ghost" icon="i-lucide:x" size="xs" class="rounded-md" @click="handleFilterReset" />
              </div>
            </template>
          </UInput>
        </template>

        <UPopover v-model:open="stateDatePickerOpen" :content="{ align: 'end', side: 'bottom', sideOffset: 10 }">
          <UButton color="neutral" variant="ghost" icon="i-lucide-calendar-days" class="shrink-0">
            {{ computedDatePickerButtonLabel }}
          </UButton>

          <template #content>
            <div class="w-88 space-y-3 p-3 sm:w-96">
              <UCalendar
                v-model="computedCalendarModelValue"
                color="neutral"
                variant="subtle"
                :min-value="computedCalendarMinValue"
                :max-value="computedCalendarMaxValue"
                :placeholder="stateCalendarPlaceholder"
                :prev-page="calendarPrevPageGet"
                :next-page="calendarNextPageGet"
                :prev-month="{ color: 'neutral', variant: 'ghost', disabled: computedCalendarAtFirstMonth }"
                :next-month="{ color: 'neutral', variant: 'ghost', disabled: computedCalendarAtLastMonth }"
                :year-controls="false"
                :disable-days-outside-current-view="true"
                :is-date-disabled="calendarDateDisabledGet"
                class="mx-auto"
                @update:placeholder="handleCalendarPlaceholderUpdate"
                @mouseleave="handleDatePreviewReset"
              >
                <template #day="{ day }">
                  <span class="inline-flex" :class="calendarDateSelectableGet(day) ? 'cursor-pointer' : 'pointer-events-none cursor-default'" @mouseenter="handleDatePreview(day)">
                    <UChip :show="calendarDateSummaryGet(day) !== null" :color="calendarDateSummaryColorGet(day)" size="2xs" inset>
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

        <UButton color="neutral" variant="ghost" icon="i-proicons:settings" class="shrink-0 rounded-lg" :to="localePath('/settings/hotsearch')">
          {{ t('pages.settings.title') }}
        </UButton>
      </div>
    </template>

    <div class="flex flex-1 flex-col overflow-hidden">
      <div v-if="computedToolbarPanelVisible" :class="['border-default bg-elevated/15 flex shrink-0 flex-col px-4 sm:px-6', computedRouteIsPodcast ? '' : 'border-b']">
        <template v-if="computedRouteIsDataSection">
          <div class="border-default relative -mx-4 flex h-12.25 shrink-0 items-center gap-1.5 overflow-hidden border-b px-4 sm:-mx-6 sm:px-6">
            <div class="relative z-10 min-w-0 flex-1">
              <UNavigationMenu :items="computedDataVariantLinks" highlight class="-translate-x-2.5" />
            </div>
          </div>
        </template>

        <template v-else-if="computedRouteIsPodcast">
          <div class="bg-default/75 border-default after:border-default relative -mx-4 flex shrink-0 flex-col gap-3 overflow-hidden px-4 after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:block after:w-full after:border-b after:content-[''] sm:-mx-6 sm:px-6">
            <div class="border-default after:border-default relative -mx-4 flex h-12.25 shrink-0 items-center justify-between gap-1.5 overflow-hidden px-4 after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:block after:w-full after:border-b after:content-[''] sm:-mx-6 sm:px-6">
              <div class="relative z-10 min-w-0 flex-1">
                <UNavigationMenu v-if="computedPodcastVariantLinks.length > 0" :items="computedPodcastVariantLinks" highlight class="-translate-x-2.5" />
              </div>

              <div class="relative z-10 flex shrink-0 flex-wrap items-center justify-end gap-2">
                <UButton color="neutral" variant="soft" icon="i-lucide:clapperboard" :disabled="!computedPodcastHeaderVideoAsset" @click="handlePodcastVideoModalOpen">
                  {{ t('pages.hotsearch.podcast.openVideoModal') }}
                </UButton>
                <UButton color="neutral" variant="soft" icon="i-lucide:audio-lines" :disabled="!computedPodcastHeaderAudioAsset" @click="handlePodcastAudioModalOpen">
                  {{ t('pages.hotsearch.podcast.openAudioModal') }}
                </UButton>
              </div>
            </div>

            <div class="relative z-10 flex w-full flex-wrap items-center gap-2">
              <UButton
                v-for="item in computedPodcastHeaderView.availablePlatforms"
                :key="item.key"
                :disabled="item.disabled"
                :color="computedPodcastHeaderView.selectedPlatformKey === item.key ? 'primary' : 'neutral'"
                :variant="computedPodcastHeaderView.selectedPlatformKey === item.key ? 'solid' : 'soft'"
                size="sm"
                @click="handlePodcastMediaPlatformSelect(item.key)"
              >
                {{ t(item.labelKey) }}
              </UButton>
            </div>

            <div id="hotsearch-podcast-player-header" class="relative z-10 -mx-4 sm:-mx-6"></div>
          </div>
        </template>
      </div>

      <div class="scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div class="flex min-h-full flex-col">
          <NuxtPage />
        </div>
      </div>

      <UModal
        :open="statePodcastVideoModalOpen"
        :title="computedPodcastHeaderVideoAsset?.title ?? t('pages.hotsearch.podcast.openVideoModal')"
        :description="computedPodcastHeaderVideoAsset?.description"
        :ui="{ content: 'z-50 max-w-5xl', body: 'space-y-4 overflow-hidden' }"
        @update:open="handlePodcastVideoModalUpdateOpen"
      >
        <template #body>
          <div v-if="computedPodcastHeaderVideoAsset" class="mx-auto w-full max-w-5xl space-y-4">
            <MediaPlayerPlyr v-if="statePodcastVideoModalPlayerVisible" ref="refPodcastVideoPlayer" :poster="computedPodcastHeaderVideoAsset.poster" :waveform-path="computedPodcastHeaderVideoAsset.waveformPath" :sources="computedPodcastHeaderVideoAsset.sources" autoplay />
          </div>
        </template>
      </UModal>

      <UModal
        :open="statePodcastAudioModalOpen"
        :title="computedPodcastHeaderAudioAsset?.title ?? t('pages.hotsearch.podcast.openAudioModal')"
        :description="computedPodcastHeaderAudioAsset?.description"
        :ui="{ content: 'z-50 max-w-4xl', body: 'space-y-4' }"
        @update:open="handlePodcastAudioModalUpdateOpen"
      >
        <template #body>
          <div v-if="computedPodcastHeaderAudioAsset" class="space-y-4">
            <MediaPlayerPlyr v-if="statePodcastAudioModalPlayerVisible" ref="refPodcastAudioPlayer" :poster="computedPodcastHeaderAudioAsset.poster" :waveform-path="computedPodcastHeaderAudioAsset.waveformPath" :sources="computedPodcastHeaderAudioAsset.sources" autoplay />
          </div>
        </template>
      </UModal>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
import type { NavigationMenuItem } from '@nuxt/ui';

import type { THotsearchPodcastVariantKey } from '@@/shared/types/index.types';

type TMediaPlyrExposed = {
  play: () => Promise<void>;
};

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
 * 状态：是否已存在显式日期选择。
 */
const stateHasExplicitDateSelection = ref(hotsearchQueryStringGet(route.query.date as string | null | Array<string | null> | undefined) !== '');

/**
 * 常量：日历时区。
 */
const calendarTimeZone = getLocalTimeZone();

/**
 * 状态：日期选择器是否打开。
 */
const stateDatePickerOpen = ref(false);

/**
 * 状态：日历当前展示月份。
 */
const stateCalendarPlaceholder = ref<CalendarDate>(today(calendarTimeZone));

/**
 * 状态：悬停预览日期。
 */
const stateDatePickerPreviewDate = ref('');

/**
 * 状态：播客完整视频弹窗是否打开。
 */
const statePodcastVideoModalOpen = ref(false);

/**
 * 状态：播客完整视频播放器是否挂载。
 */
const statePodcastVideoModalPlayerVisible = ref(false);

/**
 * 状态：播客完整音频弹窗是否打开。
 */
const statePodcastAudioModalOpen = ref(false);

/**
 * 状态：播客完整音频播放器是否挂载。
 */
const statePodcastAudioModalPlayerVisible = ref(false);

/**
 * 引用：播客完整视频播放器实例。
 */
const refPodcastVideoPlayer = ref<TMediaPlyrExposed | null>(null);

/**
 * 引用：播客完整音频播放器实例。
 */
const refPodcastAudioPlayer = ref<TMediaPlyrExposed | null>(null);

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 状态：工具栏关键词。
 */
const stateToolbarKeyword = ref('');

/**
 * API：热搜日期摘要。
 *
 * 该接口对应 Rust API 的 `GET /hotsearch/dates`。
 * 它只用于热搜页面日历的只读日期摘要，不是管理侧的日期重算接口。
 */
const { datas: stateHotsearchDateSummaries, refresh: refreshHotsearchDateSummariesGet } = await useApi<IHotsearchArchiveDateSummary[]>('hotsearch/dates', {
  immediate: true,
  server: false
});

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
const computedDateSummaries = computed(() => {
  return [...(stateHotsearchDateSummaries.value ?? [])].sort((left, right) => right.date.localeCompare(left.date));
});

/**
 * 计算属性：日期摘要映射。
 */
const computedDateSummaryMap = computed(() => new Map(computedDateSummaries.value.map((item) => [item.date, item])));

/**
 * 计算属性：可选月份列表。
 */
const computedAvailableCalendarMonths = computed<CalendarDate[]>(() => {
  const monthMap = new Map<string, CalendarDate>();

  for (const item of computedDateSummaries.value) {
    const dateValue = calendarDateFromIsoGet(item.date);

    if (!dateValue) {
      continue;
    }

    monthMap.set(calendarMonthKeyGet(dateValue), new CalendarDate(dateValue.year, dateValue.month, 1));
  }

  const todayValue = today(calendarTimeZone);

  monthMap.set(calendarMonthKeyGet(todayValue), new CalendarDate(todayValue.year, todayValue.month, 1));

  return Array.from(monthMap.values()).sort((left, right) => left.compare(right));
});

/**
 * 计算属性：最新可选日期。
 */
const computedLatestAvailableDate = computed(() => computedDateSummaries.value[0]?.date ?? '');

/**
 * 计算属性：当前日期字符串。
 */
const computedTodayDate = computed(() => {
  const value = today(calendarTimeZone);

  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
});

/**
 * 计算属性：当前选中日期。
 */
const computedSelectedDate = computed(() => {
  const queryDate = hotsearchQueryStringGet(route.query.date as string | null | Array<string | null> | undefined);

  if (queryDate === '') {
    return computedTodayDate.value;
  }

  if (calendarDateFromIsoGet(queryDate)) {
    return queryDate;
  }

  return computedTodayDate.value;
});

/**
 * 计算属性：当前选中日期对应的展示月份。
 */
const computedSelectedMonthValue = computed(() => {
  return calendarMonthValueFromIsoGet(computedSelectedDate.value) ?? computedAvailableCalendarMonths.value.at(-1) ?? calendarMonthValueGet(today(calendarTimeZone));
});

/**
 * 计算属性：默认打开月份。
 */
const computedCalendarDefaultMonthValue = computed(() => {
  return calendarNearestMonthGet(today(calendarTimeZone)) ?? computedAvailableCalendarMonths.value.at(-1) ?? calendarMonthValueGet(today(calendarTimeZone));
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
const computedCalendarMaxValue = computed(() => {
  const latestAvailableDate = calendarDateFromIsoGet(computedLatestAvailableDate.value);
  const todayValue = today(calendarTimeZone);

  if (!latestAvailableDate) {
    return todayValue;
  }

  return latestAvailableDate.compare(todayValue) >= 0 ? latestAvailableDate : todayValue;
});

/**
 * 计算属性：当前是否位于首个可选月份。
 */
const computedCalendarAtFirstMonth = computed(() => {
  const firstMonth = computedAvailableCalendarMonths.value[0];

  if (!firstMonth) {
    return true;
  }

  return calendarMonthKeyGet(stateCalendarPlaceholder.value) === calendarMonthKeyGet(firstMonth);
});

/**
 * 计算属性：当前是否位于最后一个可选月份。
 */
const computedCalendarAtLastMonth = computed(() => {
  const lastMonth = computedAvailableCalendarMonths.value.at(-1);

  if (!lastMonth) {
    return true;
  }

  return calendarMonthKeyGet(stateCalendarPlaceholder.value) === calendarMonthKeyGet(lastMonth);
});

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
 * 计算属性：当前是否位于数据分区。
 */
const computedRouteIsDataSection = computed(() => {
  const dataPath = localePath('/hotsearch');
  const platformsPath = localePath('/hotsearch/platforms');
  const tagsPath = localePath('/hotsearch/tags');

  return route.path === dataPath || route.path === platformsPath || route.path === tagsPath;
});

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
      active: computedRouteIsDataSection.value,
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
        path: localePath('/hotsearch/podcast/morning-short'),
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
 * 计算属性：数据分区子页链接。
 */
const computedDataVariantLinks = computed<NavigationMenuItem[][]>(() => {
  if (!computedRouteIsDataSection.value) {
    return [];
  }

  const sharedQuery = {
    date: computedSelectedDate.value,
    keyword: hotsearchQueryStringGet(route.query.keyword as string | null | Array<string | null> | undefined) || undefined,
    platform: hotsearchQueryStringGet(route.query.platform as string | null | Array<string | null> | undefined) || undefined,
    category_key: hotsearchQueryStringGet(route.query.category_key as string | null | Array<string | null> | undefined) || undefined,
    pagesize: hotsearchQueryStringGet(route.query.pagesize as string | null | Array<string | null> | undefined) || undefined
  };

  return [
    [
      {
        label: t('pages.hotsearch.data.variants.content'),
        icon: 'i-lucide:file-text',
        active: route.path === localePath('/hotsearch'),
        to: {
          path: localePath('/hotsearch'),
          query: {
            ...sharedQuery,
            order_by: hotsearchQueryStringGet(route.query.order_by as string | null | Array<string | null> | undefined) || undefined,
            order_dir: hotsearchQueryStringGet(route.query.order_dir as string | null | Array<string | null> | undefined) || undefined
          }
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.data.variants.tags'),
        icon: 'i-lucide:tags',
        active: route.path === localePath('/hotsearch/tags'),
        to: {
          path: localePath('/hotsearch/tags'),
          query: sharedQuery
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.data.variants.platforms'),
        icon: 'i-lucide:layout-grid',
        active: route.path === localePath('/hotsearch/platforms'),
        to: {
          path: localePath('/hotsearch/platforms'),
          query: sharedQuery
        },
        exact: true
      }
    ]
  ];
});

/**
 * 计算属性：播客变体链接。
 */
const computedPodcastVariantLinks = computed<NavigationMenuItem[][]>(() => {
  if (!route.path.startsWith(localePath('/hotsearch/podcast'))) {
    return [];
  }

  const mediaPlatform = hotsearchQueryStringGet(route.query.mediaPlatform as string | null | Array<string | null> | undefined) || undefined;

  return [
    [
      {
        label: t('pages.hotsearch.podcast.variants.morningShort.title'),
        icon: 'i-lucide:sun-medium',
        active: route.path === localePath('/hotsearch/podcast/morning-short'),
        to: {
          path: localePath('/hotsearch/podcast/morning-short'),
          query: { date: computedSelectedDate.value, mediaPlatform }
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.podcast.variants.morningLong.title'),
        icon: 'i-lucide:sun',
        active: route.path === localePath('/hotsearch/podcast/morning-long'),
        to: {
          path: localePath('/hotsearch/podcast/morning-long'),
          query: { date: computedSelectedDate.value, mediaPlatform }
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.podcast.variants.eveningShort.title'),
        icon: 'i-lucide:moon-star',
        active: route.path === localePath('/hotsearch/podcast/evening-short'),
        to: {
          path: localePath('/hotsearch/podcast/evening-short'),
          query: { date: computedSelectedDate.value, mediaPlatform }
        },
        exact: true
      },
      {
        label: t('pages.hotsearch.podcast.variants.eveningLong.title'),
        icon: 'i-lucide:moon',
        active: route.path === localePath('/hotsearch/podcast/evening-long'),
        to: {
          path: localePath('/hotsearch/podcast/evening-long'),
          query: { date: computedSelectedDate.value, mediaPlatform }
        },
        exact: true
      }
    ]
  ];
});

/**
 * 计算属性：当前播客变体。
 */
const computedPodcastVariant = computed<THotsearchPodcastVariantKey | null>(() => {
  if (route.path === localePath('/hotsearch/podcast/morning-short')) {
    return 'morning-short';
  }
  if (route.path === localePath('/hotsearch/podcast/morning-long')) {
    return 'morning-long';
  }
  if (route.path === localePath('/hotsearch/podcast/evening-short')) {
    return 'evening-short';
  }
  if (route.path === localePath('/hotsearch/podcast/evening-long')) {
    return 'evening-long';
  }

  return null;
});

/**
 * 计算属性：页头播客视图模型。
 */
const computedPodcastHeaderView = computed(() => {
  return hotsearchPodcastViewGet(computedSelectedDate.value, computedPodcastVariant.value ?? 'morning-short', hotsearchQueryStringGet(route.query.mediaPlatform as string | null | Array<string | null> | undefined));
});

/**
 * 计算属性：页头完整视频资源。
 */
const computedPodcastHeaderVideoAsset = computed(() => {
  return computedPodcastHeaderView.value.assets.find((item) => item.kind === 'video');
});

/**
 * 计算属性：页头完整音频资源。
 */
const computedPodcastHeaderAudioAsset = computed(() => {
  return computedPodcastHeaderView.value.assets.find((item) => item.kind === 'audio');
});

/**
 * 计算属性：工具区面板是否显示。
 */
const computedToolbarPanelVisible = computed(() => computedRouteIsDataSection.value || computedRouteIsPodcast.value);

/**
 * 函数：切换播客媒体平台。
 *
 * # Arguments
 *
 * * `platformKey` - 目标平台键。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastMediaPlatformSelect = (platformKey: string): void => {
  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      mediaPlatform: platformKey === 'general' ? undefined : platformKey
    }
  });
};

/**
 * 函数：更新播客完整视频弹窗开关。
 *
 * 关闭时同步卸载播放器，避免下次打开沿用旧实例状态。
 *
 * # Arguments
 *
 * * `open` - 弹窗开关状态。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastVideoModalUpdateOpen = (open: boolean): void => {
  statePodcastVideoModalOpen.value = open;

  if (open === false) {
    statePodcastVideoModalPlayerVisible.value = false;
    refPodcastVideoPlayer.value = null;
  }
};

/**
 * 函数：更新播客完整音频弹窗开关。
 *
 * 关闭时同步卸载播放器，避免下次打开沿用旧实例状态。
 *
 * # Arguments
 *
 * * `open` - 弹窗开关状态。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastAudioModalUpdateOpen = (open: boolean): void => {
  statePodcastAudioModalOpen.value = open;

  if (open === false) {
    statePodcastAudioModalPlayerVisible.value = false;
    refPodcastAudioPlayer.value = null;
  }
};

/**
 * 函数：打开播客完整视频弹窗并尝试自动播放。
 *
 * 先打开弹窗壳体，再延后一拍挂载播放器并显式触发播放。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastVideoModalOpen = async (): Promise<void> => {
  statePodcastVideoModalOpen.value = true;
  statePodcastVideoModalPlayerVisible.value = false;
  await nextTick();
  statePodcastVideoModalPlayerVisible.value = true;
  await nextTick();
  await refPodcastVideoPlayer.value?.play();
};

/**
 * 函数：打开播客完整音频弹窗并尝试自动播放。
 *
 * 先打开弹窗壳体，再延后一拍挂载播放器并显式触发播放。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastAudioModalOpen = async (): Promise<void> => {
  statePodcastAudioModalOpen.value = true;
  statePodcastAudioModalPlayerVisible.value = false;
  await nextTick();
  statePodcastAudioModalPlayerVisible.value = true;
  await nextTick();
  await refPodcastAudioPlayer.value?.play();
};

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
 * 函数：获取日期点位颜色。
 *
 * @param {DateValue} value 日历日期。
 * @return {'primary' | 'success'}
 */
const calendarDateSummaryColorGet = (value: DateValue): 'primary' | 'success' => {
  const summary = calendarDateSummaryGet(value);

  return summary && summary.podcastCount > 0 ? 'success' : 'primary';
};

/**
 * 函数：判断日期是否可选。
 *
 * 今天在当天结束前始终允许选择；历史日期仍必须真实存在热搜摘要数据。
 *
 * @param {DateValue} value 日历日期。
 * @return {boolean}
 */
const calendarDateSelectableGet = (value: DateValue): boolean => {
  const isoDate = calendarIsoDateGet(value);

  return isoDate === computedTodayDate.value || computedDateSummaryMap.value.has(isoDate);
};

/**
 * 函数：判断日期是否禁选。
 *
 * @param {DateValue} value 日历日期。
 * @return {boolean}
 */
const calendarDateDisabledGet = (value: DateValue): boolean => {
  return !calendarDateSelectableGet(value);
};

/**
 * 函数：获取月份键。
 *
 * @param {DateValue} value 日历日期。
 * @return {string}
 */
const calendarMonthKeyGet = (value: DateValue): string => {
  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}`;
};

/**
 * 函数：获取月份起始值。
 *
 * @param {DateValue} value 日历日期。
 * @return {CalendarDate}
 */
const calendarMonthValueGet = (value: DateValue): CalendarDate => {
  return new CalendarDate(value.year, value.month, 1);
};

/**
 * 函数：从 ISO 日期解析月份起始值。
 *
 * @param {string} value ISO 日期。
 * @return {CalendarDate | null}
 */
const calendarMonthValueFromIsoGet = (value: string): CalendarDate | null => {
  const dateValue = calendarDateFromIsoGet(value);

  if (!dateValue) {
    return null;
  }

  return calendarMonthValueGet(dateValue);
};

/**
 * 函数：查找最接近的可选月份。
 *
 * @param {DateValue} value 目标月份。
 * @return {CalendarDate | null}
 */
const calendarNearestMonthGet = (value: DateValue): CalendarDate | null => {
  const months = computedAvailableCalendarMonths.value;

  if (months.length <= 0) {
    return null;
  }

  const monthValue = calendarMonthValueGet(value);
  let fallback = months[0] ?? null;

  for (const item of months) {
    if (item.compare(monthValue) <= 0) {
      fallback = item;
      continue;
    }

    return fallback;
  }

  return months.at(-1) ?? fallback;
};

/**
 * 函数：获取相邻可选月份。
 *
 * @param {DateValue} value 当前月份。
 * @param {number} delta 偏移量。
 * @return {CalendarDate}
 */
const calendarAdjacentMonthGet = (value: DateValue, delta: number): CalendarDate => {
  const months = computedAvailableCalendarMonths.value;

  if (months.length <= 0) {
    return calendarMonthValueGet(value);
  }

  const monthKey = calendarMonthKeyGet(value);
  const currentIndex = months.findIndex((item) => calendarMonthKeyGet(item) === monthKey);

  if (currentIndex === -1) {
    return calendarNearestMonthGet(value) ?? months.at(-1) ?? calendarMonthValueGet(value);
  }

  const nextIndex = Math.min(Math.max(currentIndex + delta, 0), months.length - 1);

  return months[nextIndex] ?? months[currentIndex] ?? calendarMonthValueGet(value);
};

/**
 * 函数：获取上一可选月份。
 *
 * @param {DateValue} value 当前月份。
 * @return {CalendarDate}
 */
const calendarPrevPageGet = (value: DateValue): CalendarDate => {
  return calendarAdjacentMonthGet(value, -1);
};

/**
 * 函数：获取下一可选月份。
 *
 * @param {DateValue} value 当前月份。
 * @return {CalendarDate}
 */
const calendarNextPageGet = (value: DateValue): CalendarDate => {
  return calendarAdjacentMonthGet(value, 1);
};

/**
 * 函数：更新日历展示月份。
 *
 * @param {value} value 日历月份值。
 * @return {void}
 */
const handleCalendarPlaceholderUpdate = (value: DateValue): void => {
  stateCalendarPlaceholder.value = calendarNearestMonthGet(value) ?? computedSelectedMonthValue.value;
};

/**
 * 函数：设置日期悬停预览。
 *
 * @param {DateValue} value 日历日期。
 * @return {void}
 */
const handleDatePreview = (value: DateValue): void => {
  const nextDate = calendarIsoDateGet(value);

  if (!calendarDateSelectableGet(value)) {
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

watch(stateDatePickerOpen, (open) => {
  if (!open) {
    stateDatePickerPreviewDate.value = '';

    return;
  }

  stateCalendarPlaceholder.value = stateHasExplicitDateSelection.value ? computedSelectedMonthValue.value : computedCalendarDefaultMonthValue.value;
  void refreshHotsearchDateSummariesGet({ replace: true });
});

watch(
  () => ({
    open: stateDatePickerOpen.value,
    explicit: stateHasExplicitDateSelection.value,
    selectedMonthKey: calendarMonthKeyGet(computedSelectedMonthValue.value),
    summaryCount: computedDateSummaries.value.length
  }),
  ({ open, explicit, selectedMonthKey, summaryCount }) => {
    if (!open || summaryCount <= 0) {
      return;
    }

    if (explicit && selectedMonthKey !== '') {
      stateCalendarPlaceholder.value = computedSelectedMonthValue.value;

      return;
    }

    stateCalendarPlaceholder.value = computedCalendarDefaultMonthValue.value;
  }
);

watch(
  computedSelectedMonthValue,
  (value) => {
    if (stateDatePickerOpen.value) {
      return;
    }

    stateCalendarPlaceholder.value = value;
  },
  {
    immediate: true
  }
);

watch(
  () => ({
    routeDate: hotsearchQueryStringGet(route.query.date as string | null | Array<string | null> | undefined),
    selectedDate: computedSelectedDate.value,
    hasSelectedDateSummary: computedDateSummaryMap.value.has(computedSelectedDate.value)
  }),
  ({ routeDate, selectedDate, hasSelectedDateSummary }) => {
    if (routeDate !== '') {
      return;
    }

    const nextRouteDate = selectedDate !== '' && (hasSelectedDateSummary || selectedDate === computedTodayDate.value) ? selectedDate : undefined;
    const normalizedNextRouteDate = nextRouteDate ?? '';

    if (routeDate === normalizedNextRouteDate) {
      return;
    }

    navigateTo(
      {
        path: route.path,
        query: {
          ...route.query,
          date: nextRouteDate
        }
      },
      { replace: true }
    );
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
  stateHasExplicitDateSelection.value = true;

  const nextRouteDate = computedDateSummaryMap.value.has(date) || date === computedTodayDate.value ? date : undefined;

  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      date: nextRouteDate
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
