<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="computedSectionLinks" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <div class="flex items-center gap-2">
        <template v-if="computedRouteIsData">
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
      </div>
    </template>

    <div class="flex flex-1 flex-col overflow-hidden">
      <div v-if="computedToolbarPanelVisible" :class="['border-default bg-elevated/15 flex shrink-0 flex-col px-4 sm:px-6', computedRouteIsPodcast ? '' : 'border-b']">
        <template v-if="computedRouteIsPodcast">
          <div class="bg-default/75 border-default after:border-default relative -mx-4 flex shrink-0 flex-col gap-3 overflow-hidden px-4 pb-3 after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:block after:w-full after:border-b after:content-[''] sm:-mx-6 sm:px-6">
            <div class="border-default after:border-default relative -mx-4 flex h-12.25 shrink-0 items-center justify-between gap-1.5 overflow-hidden px-4 after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:block after:w-full after:border-b after:content-[''] sm:-mx-6 sm:px-6">
              <div class="relative z-10 min-w-0 flex-1">
                <UNavigationMenu v-if="computedPodcastVariantLinks.length > 0" :items="computedPodcastVariantLinks" highlight class="-translate-x-2.5" />
              </div>

              <div class="relative z-10 flex shrink-0 flex-wrap items-center justify-end gap-2">
                <UButton color="primary" :variant="statePodcastPlaybackPrimaryLabel === t('pages.hotsearch.podcast.pause') ? 'solid' : 'soft'" :icon="statePodcastPlaybackPrimaryIcon" @click="handlePodcastPlaybackPrimaryCommand">
                  {{ statePodcastPlaybackPrimaryLabel || t('pages.hotsearch.podcast.playAll') }}
                </UButton>
                <UButton color="neutral" variant="soft" icon="i-lucide:square" :disabled="!statePodcastPlaybackStopEnabled" @click="handlePodcastPlaybackStopCommand">
                  {{ t('pages.hotsearch.podcast.stop') }}
                </UButton>
                <UButton color="neutral" variant="soft" icon="i-lucide:clapperboard" :disabled="!computedPodcastHeaderVideoAsset" @click="handlePodcastVideoModalOpen">
                  {{ t('pages.hotsearch.podcast.openVideoModal') }}
                </UButton>
                <UButton color="neutral" variant="soft" icon="i-lucide:audio-lines" :disabled="!computedPodcastHeaderAudioAsset" @click="handlePodcastAudioModalOpen">
                  {{ t('pages.hotsearch.podcast.openAudioModal') }}
                </UButton>
              </div>
            </div>

            <div class="relative z-10 flex w-full flex-wrap items-center gap-2">
              <div class="flex flex-wrap gap-2">
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
            </div>
          </div>
        </template>
      </div>

      <div class="scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div class="min-h-full">
          <NuxtPage />
        </div>
      </div>

      <UModal v-model:open="statePodcastVideoModalOpen" :title="computedPodcastHeaderVideoAsset?.title ?? t('pages.hotsearch.podcast.openVideoModal')" :description="computedPodcastHeaderVideoAsset?.description" :ui="{ content: 'z-50 max-w-6xl', body: 'space-y-4' }">
        <template #body>
          <div v-if="statePodcastVideoModalOpen && computedPodcastHeaderVideoAsset" ref="refPodcastVideoModalBody" class="space-y-4">
            <MediaPlayerPlyr :poster="computedPodcastHeaderVideoAsset.poster" :waveform-path="computedPodcastHeaderVideoAsset.waveformPath" :sources="computedPodcastHeaderVideoAsset.sources" autoplay />
          </div>
        </template>
      </UModal>

      <UModal v-model:open="statePodcastAudioModalOpen" :title="computedPodcastHeaderAudioAsset?.title ?? t('pages.hotsearch.podcast.openAudioModal')" :description="computedPodcastHeaderAudioAsset?.description" :ui="{ content: 'z-50 max-w-4xl', body: 'space-y-4' }">
        <template #body>
          <div v-if="statePodcastAudioModalOpen && computedPodcastHeaderAudioAsset" ref="refPodcastAudioModalBody" class="space-y-4">
            <MediaPlayerPlyr :poster="computedPodcastHeaderAudioAsset.poster" :waveform-path="computedPodcastHeaderAudioAsset.waveformPath" :sources="computedPodcastHeaderAudioAsset.sources" autoplay />
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
 * 状态：播客完整视频弹窗是否打开。
 */
const statePodcastVideoModalOpen = ref(false);

/**
 * 状态：播客完整音频弹窗是否打开。
 */
const statePodcastAudioModalOpen = ref(false);

/**
 * 引用：播客完整视频弹窗内容容器。
 */
const refPodcastVideoModalBody = ref<HTMLElement | null>(null);

/**
 * 引用：播客完整音频弹窗内容容器。
 */
const refPodcastAudioModalBody = ref<HTMLElement | null>(null);

/**
 * 状态：播客主播放按钮文案。
 */
const statePodcastPlaybackPrimaryLabel = useState('hotsearch-podcast-playback-primary-label', () => '');

/**
 * 状态：播客主播放按钮图标。
 */
const statePodcastPlaybackPrimaryIcon = useState('hotsearch-podcast-playback-primary-icon', () => 'i-lucide:play');

/**
 * 状态：播客停止按钮是否可用。
 */
const statePodcastPlaybackStopEnabled = useState('hotsearch-podcast-playback-stop-enabled', () => false);

/**
 * 状态：播客主播放命令版本号。
 */
const statePodcastPlaybackPrimaryCommand = useState('hotsearch-podcast-playback-primary-command', () => 0);

/**
 * 状态：播客停止命令版本号。
 */
const statePodcastPlaybackStopCommand = useState('hotsearch-podcast-playback-stop-command', () => 0);

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
const computedToolbarPanelVisible = computed(() => computedRouteIsPodcast.value);

/**
 * 函数：安全触发原生媒体播放。
 *
 * 在宿主环境拦截自动播放时吞掉 Promise rejection，避免污染控制台。
 *
 * # Arguments
 *
 * * `container` - 承载媒体元素的容器。
 *
 * # Returns
 *
 * 无返回值。
 */
const mediaElementPlaySafe = (container: HTMLElement | null): void => {
  const mediaElement = container?.querySelector('video, audio');

  if (!(mediaElement instanceof HTMLMediaElement)) {
    return;
  }

  try {
    const result = mediaElement.play();

    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        // ignore
      });
    }
  } catch {
    // ignore
  }
};

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
 * 函数：触发播客主播放命令。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastPlaybackPrimaryCommand = (): void => {
  statePodcastPlaybackPrimaryCommand.value += 1;
};

/**
 * 函数：触发播客停止命令。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastPlaybackStopCommand = (): void => {
  statePodcastPlaybackStopCommand.value += 1;
};

/**
 * 函数：打开播客完整视频弹窗并尝试自动播放。
 *
 * 借助当前点击的用户手势，在弹窗内容挂载后立即触发原生播放，降低宿主环境拦截概率。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastVideoModalOpen = async (): Promise<void> => {
  statePodcastVideoModalOpen.value = true;
  await nextTick();
  mediaElementPlaySafe(refPodcastVideoModalBody.value);
};

/**
 * 函数：打开播客完整音频弹窗并尝试自动播放。
 *
 * 借助当前点击的用户手势，在弹窗内容挂载后立即触发原生播放，降低宿主环境拦截概率。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePodcastAudioModalOpen = async (): Promise<void> => {
  statePodcastAudioModalOpen.value = true;
  await nextTick();
  mediaElementPlaySafe(refPodcastAudioModalBody.value);
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
