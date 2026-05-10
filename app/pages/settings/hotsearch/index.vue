<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.hotsearch.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.hotsearch.description') }}</p>
        </div>

        <UButton color="primary" variant="soft" size="sm" icon="i-lucide:rotate-ccw" :loading="stateSaving" class="shrink-0" @click="handleResetDefaults">
          {{ t('pages.settings.hotsearch.actions.reset') }}
        </UButton>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.hotsearch.fields.enabled.label')" :description="t('pages.settings.hotsearch.fields.enabled.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USwitch :model-value="stateHotsearchConfig.enabled" @update:model-value="handleEnabledUpdate" />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.podcastEnabled.label')"
        :description="t('pages.settings.hotsearch.fields.podcastEnabled.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <USwitch :model-value="stateHotsearchConfig.podcastEnabled" @update:model-value="handlePodcastEnabledUpdate" />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.monthlyBudget.label')"
        :description="t('pages.settings.hotsearch.fields.monthlyBudget.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <div class="flex flex-wrap items-center justify-end gap-2">
          <UInputNumber
            :model-value="stateHotsearchConfig.monthlyBudget"
            orientation="vertical"
            :min="1"
            :step="1"
            color="primary"
            variant="outline"
            class="w-36"
            :increment="{ color: 'neutral', variant: 'ghost' }"
            :decrement="{ color: 'neutral', variant: 'ghost' }"
            @update:model-value="handleMonthlyBudgetUpdate"
          />
          <UButton color="primary" variant="outline" icon="i-lucide:external-link" @click="handleUsageOpen">{{ t('pages.settings.hotsearch.actions.usage') }}</UButton>
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard :title="t('pages.settings.hotsearch.sections.schedule.title')" :description="t('pages.settings.hotsearch.sections.schedule.description')" variant="naked" />

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
      <UFormField
        :label="t('pages.settings.hotsearch.fields.morningStartAt.label')"
        :description="t('pages.settings.hotsearch.fields.morningStartAt.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputTime :model-value="computedMorningStartAtValue" granularity="minute" :hour-cycle="24" color="primary" variant="outline" class="w-36" @update:model-value="handleMorningStartAtUpdate">
          <template #leading>
            <UIcon name="i-lucide:clock-3" class="text-dimmed size-4" />
          </template>
        </UInputTime>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.eveningStartAt.label')"
        :description="t('pages.settings.hotsearch.fields.eveningStartAt.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputTime :model-value="computedEveningStartAtValue" granularity="minute" :hour-cycle="24" color="primary" variant="outline" class="w-36" @update:model-value="handleEveningStartAtUpdate">
          <template #leading>
            <UIcon name="i-lucide:clock-9" class="text-dimmed size-4" />
          </template>
        </UInputTime>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.platformIntervalSeconds.label')"
        :description="t('pages.settings.hotsearch.fields.platformIntervalSeconds.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputNumber
          :model-value="stateHotsearchConfig.platformIntervalSeconds"
          orientation="vertical"
          :min="1"
          :step="1"
          color="primary"
          variant="outline"
          class="w-36"
          :increment="{ color: 'neutral', variant: 'ghost' }"
          :decrement="{ color: 'neutral', variant: 'ghost' }"
          @update:model-value="handlePlatformIntervalSecondsUpdate"
        />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.scheduleJitterSeconds.label')"
        :description="t('pages.settings.hotsearch.fields.scheduleJitterSeconds.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputNumber
          :model-value="stateHotsearchConfig.scheduleJitterSeconds"
          orientation="vertical"
          :min="0"
          :step="60"
          color="primary"
          variant="outline"
          class="w-36"
          :increment="{ color: 'neutral', variant: 'ghost' }"
          :decrement="{ color: 'neutral', variant: 'ghost' }"
          @update:model-value="handleScheduleJitterSecondsUpdate"
        />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.podcastBufferMinutes.label')"
        :description="t('pages.settings.hotsearch.fields.podcastBufferMinutes.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputNumber
          :model-value="stateHotsearchConfig.podcastBufferMinutes"
          orientation="vertical"
          :min="0"
          :step="1"
          color="primary"
          variant="outline"
          class="w-36"
          :increment="{ color: 'neutral', variant: 'ghost' }"
          :decrement="{ color: 'neutral', variant: 'ghost' }"
          @update:model-value="handlePodcastBufferMinutesUpdate"
        />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.retryMaxAttempts.label')"
        :description="t('pages.settings.hotsearch.fields.retryMaxAttempts.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputNumber
          :model-value="stateHotsearchConfig.retryMaxAttempts"
          orientation="vertical"
          :min="0"
          :step="1"
          color="primary"
          variant="outline"
          class="w-36"
          :increment="{ color: 'neutral', variant: 'ghost' }"
          :decrement="{ color: 'neutral', variant: 'ghost' }"
          @update:model-value="handleRetryMaxAttemptsUpdate"
        />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.retryDelayMinutes.label')"
        :description="t('pages.settings.hotsearch.fields.retryDelayMinutes.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputNumber
          :model-value="stateHotsearchConfig.retryDelayMinutes"
          orientation="vertical"
          :min="1"
          :step="1"
          color="primary"
          variant="outline"
          class="w-36"
          :increment="{ color: 'neutral', variant: 'ghost' }"
          :decrement="{ color: 'neutral', variant: 'ghost' }"
          @update:model-value="handleRetryDelayMinutesUpdate"
        />
      </UFormField>
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-start gap-3' }">
      <template #header>
        <div class="flex w-full flex-col items-start gap-3 md:flex-row md:items-start">
          <div class="min-w-0 flex-1">
            <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.hotsearch.sections.platforms.title') }}</h3>
            <p class="text-muted text-sm">{{ t('pages.settings.hotsearch.sections.platforms.description') }}</p>
          </div>

          <div class="flex w-full items-center justify-end gap-2 self-end md:ml-auto md:w-auto md:shrink-0 md:self-start">
            <UBadge color="neutral" variant="soft">{{ computedSelectedPlatformCount }}/{{ computedPlatforms.length }}</UBadge>
            <div class="bg-elevated/60 border-default flex items-center gap-2 rounded-full border px-3 py-1.5">
              <span class="text-toned text-xs font-medium">{{ t('pages.settings.hotsearch.actions.selectAll') }}</span>
              <USwitch :model-value="computedAllPlatformsSelected" @update:model-value="handlePlatformsToggleAll" />
            </div>
          </div>
        </div>
      </template>
    </UPageCard>

    <div class="mb-6 grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-3">
      <div v-for="platform in computedPlatforms" :key="platform.id" class="bg-elevated/40 border-default/70 hover:border-primary/35 flex min-h-28 items-start justify-between gap-3 rounded-lg border p-4 transition-colors duration-200">
        <div class="min-w-0 space-y-2">
          <div class="text-highlighted text-sm leading-5 font-medium">{{ platform.label }}</div>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge color="neutral" variant="soft" size="sm">#{{ platform.id }}</UBadge>
            <UBadge v-if="platform.selected" color="primary" variant="soft" size="sm">
              {{ t('pages.settings.hotsearch.fields.enabled.label') }}
            </UBadge>
          </div>
        </div>

        <USwitch :model-value="platform.selected" @update:model-value="(value) => handlePlatformEnabledUpdate(platform.id, value)" />
      </div>
    </div>

    <UPageCard :title="t('pages.settings.hotsearch.sections.summary.title')" :description="t('pages.settings.hotsearch.sections.summary.description')" variant="naked" />

    <div class="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UPageCard icon="i-lucide:layers-2" :title="t('pages.settings.hotsearch.summary.selectedPlatforms')" :description="String(computedSelectedPlatformCount)" />
      <UPageCard icon="i-mdi:lightning-bolt-outline" :title="t('pages.settings.hotsearch.summary.perWindowCost')" :description="String(computedPerWindowCost)" />
      <UPageCard icon="i-mdi:calendar-today-outline" :title="t('pages.settings.hotsearch.summary.dailyCost')" :description="String(computedDailyCost)" />
      <UPageCard icon="i-mdi:calendar-month-outline" :title="t('pages.settings.hotsearch.summary.monthlyEstimate')" :description="String(computedMonthlyEstimate)" />
      <UPageCard icon="i-lucide:timer" :title="t('pages.settings.hotsearch.summary.windowDuration')" :description="t('pages.settings.hotsearch.summary.minutesValue', { value: computedWindowDurationMinutes })" />
      <UPageCard icon="i-lucide:clock-3" :title="t('pages.settings.hotsearch.summary.suggestedMorningPodcast')" :description="computedSuggestedMorningPodcastTime" />
      <UPageCard icon="i-lucide:clock-9" :title="t('pages.settings.hotsearch.summary.suggestedEveningPodcast')" :description="computedSuggestedEveningPodcastTime" />
      <UPageCard icon="i-lucide:shield-alert">
        <template #title>
          <div class="flex items-center gap-2">
            <span>{{ t('pages.settings.hotsearch.summary.budgetStatus') }}</span>
            <UBadge :color="computedBudgetStatusColor" variant="soft">{{ computedBudgetStatusLabel }}</UBadge>
          </div>
        </template>
        <div class="space-y-1.5">
          <p class="text-toned text-sm leading-6">{{ computedBudgetStatusMonthDescription }}</p>
          <p class="text-toned text-sm leading-6">{{ computedBudgetStatusYearDescription }}</p>
        </div>
      </UPageCard>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import { parseTime } from '@internationalized/date';
import type { InputTimeProps } from '@nuxt/ui/runtime/components/InputTime.vue';

type THotsearchInputTimeValue = InputTimeProps['modelValue'];

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置
 */
const tauriSettings = useTauriSettings();

/**
 * Hook：Tauri 任务
 */
const tauriTasks = useTauriTasks();

/**
 * Hook：Tauri 窗口
 */
const tauriWindow = useTauriWindow();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 状态：热搜设置
 */
const stateHotsearchConfig = ref<ISettingsHotsearch>(hotsearchSettingsDefaultCreate());

/**
 * 状态：壳侧热搜计划快照
 */
const stateRuntimeSchedule = ref<ITauriHotsearchScheduleSnapshot | null>(null);

/**
 * 状态：保存中
 */
const stateSaving = ref(false);

/**
 * 状态：页面数据已完成初始化
 */
const stateHydrated = ref(false);

/**
 * 状态：保存请求排队中
 */
const statePersistQueued = ref(false);

/**
 * 设置面包屑导航状态
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-proicons:settings',
    to: localePath('/settings'),
    exact: true
  },
  {
    label: t('pages.settings.hotsearch.title'),
    icon: 'i-material-symbols:bigtop-updates-rounded',
    to: localePath('/settings/hotsearch')
  }
];

/**
 * 计算属性：平台列表
 */
const computedPlatforms = computed(() =>
  hotsearchPlatformsList().map((platform) => ({
    ...platform,
    label: t(platform.key),
    selected: stateHotsearchConfig.value.platformIds.includes(platform.id)
  }))
);

/**
 * 计算属性：当月天数
 */
const computedDaysInCurrentMonth = computed(() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
});

/**
 * 计算属性：已选平台数量
 */
const computedSelectedPlatformCount = computed(() => stateHotsearchConfig.value.platformIds.length);

/**
 * 计算属性：平台是否已全部启用
 */
const computedAllPlatformsSelected = computed(() => computedPlatforms.value.length > 0 && computedSelectedPlatformCount.value === computedPlatforms.value.length);

/**
 * 计算属性：本地热搜计划窗口
 */
const computedLocalScheduleWindows = computed(() => {
  const platformCount = computedSelectedPlatformCount.value;
  const windowDurationMinutes = hotsearchWindowDurationMinutesGet(platformCount, stateHotsearchConfig.value.platformIntervalSeconds);

  return [
    {
      key: 'morning',
      estimatedPoints: platformCount,
      windowDurationMinutes,
      suggestedPodcastAt: hotsearchSuggestedPodcastTimeGet(stateHotsearchConfig.value, stateHotsearchConfig.value.morningStartAt)
    },
    {
      key: 'evening',
      estimatedPoints: platformCount,
      windowDurationMinutes,
      suggestedPodcastAt: hotsearchSuggestedPodcastTimeGet(stateHotsearchConfig.value, stateHotsearchConfig.value.eveningStartAt)
    }
  ];
});

/**
 * 函数：按秒偏移时间文本。
 * @param {string} value 时间文本
 * @param {string} fallback 回退时间
 * @param {number} deltaSeconds 偏移秒数
 * @returns {string} 偏移后的时间文本
 */
const hotsearchTimeShiftText = (value: string, fallback: string, deltaSeconds: number): string => {
  const normalized = typeof value === 'string' && /^\d{2}:\d{2}$/.test(value.trim()) ? value.trim() : fallback;
  const [hourText, minuteText] = normalized.split(':');
  const baseSeconds = Number(hourText) * 3600 + Number(minuteText) * 60;
  const nextSeconds = (((baseSeconds + Math.trunc(deltaSeconds)) % 86400) + 86400) % 86400;
  const nextHour = Math.floor(nextSeconds / 3600);
  const nextMinute = Math.floor((nextSeconds % 3600) / 60);
  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
};

/**
 * 函数：格式化随机时间范围。
 * @param {string} value 基准时间
 * @param {string} fallback 回退时间
 * @returns {string} 时间范围文本
 */
const hotsearchTimeRangeText = (value: string, fallback: string): string => {
  const jitterSeconds = stateHotsearchConfig.value.scheduleJitterSeconds;
  const normalized = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  if (jitterSeconds <= 0) {
    return normalized;
  }

  return t('pages.settings.hotsearch.summary.rangeValue', {
    start: hotsearchTimeShiftText(normalized, fallback, -jitterSeconds),
    end: hotsearchTimeShiftText(normalized, fallback, jitterSeconds)
  });
};

/**
 * 计算属性：早间时间输入值
 */
const computedMorningStartAtValue = computed(() => hotsearchTimeValueFromText(stateHotsearchConfig.value.morningStartAt, '06:00'));

/**
 * 计算属性：晚间时间输入值
 */
const computedEveningStartAtValue = computed(() => hotsearchTimeValueFromText(stateHotsearchConfig.value.eveningStartAt, '18:00'));

/**
 * 计算属性：单窗口积分消耗
 */
const computedPerWindowCost = computed(() => computedLocalScheduleWindows.value[0]?.estimatedPoints ?? 0);

/**
 * 计算属性：每天积分消耗
 */
const computedDailyCost = computed(() => hotsearchEstimatedDayPointsGet(computedSelectedPlatformCount.value, stateHotsearchConfig.value.platformIntervalSeconds));

/**
 * 计算属性：月度预计积分消耗
 */
const computedMonthlyEstimate = computed(() => hotsearchEstimatedMonthPointsGet(computedSelectedPlatformCount.value, stateHotsearchConfig.value.platformIntervalSeconds, computedDaysInCurrentMonth.value));

/**
 * 计算属性：当前年份天数
 */
const computedDaysInCurrentYear = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
});

/**
 * 计算属性：年度预计积分消耗
 */
const computedYearlyEstimate = computed(() => computedDailyCost.value * computedDaysInCurrentYear.value);

/**
 * 计算属性：窗口耗时
 */
const computedWindowDurationMinutes = computed(() => computedLocalScheduleWindows.value[0]?.windowDurationMinutes ?? 0);

/**
 * 计算属性：建议早间播客时间
 */
const computedSuggestedMorningPodcastTime = computed(() => {
  const baseTime = computedLocalScheduleWindows.value.find((window) => window.key === 'morning')?.suggestedPodcastAt ?? stateHotsearchConfig.value.morningStartAt;
  return hotsearchTimeRangeText(baseTime, stateHotsearchConfig.value.morningStartAt);
});

/**
 * 计算属性：建议晚间播客时间
 */
const computedSuggestedEveningPodcastTime = computed(() => {
  const baseTime = computedLocalScheduleWindows.value.find((window) => window.key === 'evening')?.suggestedPodcastAt ?? stateHotsearchConfig.value.eveningStartAt;
  return hotsearchTimeRangeText(baseTime, stateHotsearchConfig.value.eveningStartAt);
});

/**
 * 计算属性：预算剩余额度
 */
const computedBudgetRemaining = computed(() => stateHotsearchConfig.value.monthlyBudget - computedMonthlyEstimate.value);

/**
 * 计算属性：年度预算积分
 */
const computedYearlyBudget = computed(() => stateHotsearchConfig.value.monthlyBudget * 12);

/**
 * 计算属性：年度预算剩余额度
 */
const computedYearlyBudgetRemaining = computed(() => computedYearlyBudget.value - computedYearlyEstimate.value);

/**
 * 计算属性：预算状态标签
 */
const computedBudgetStatusLabel = computed(() => {
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget) {
    return t('pages.settings.hotsearch.summary.budgetStatusExceeded');
  }
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget * 0.85) {
    return t('pages.settings.hotsearch.summary.budgetStatusWarning');
  }
  return t('pages.settings.hotsearch.summary.budgetStatusSafe');
});

/**
 * 计算属性：预算状态颜色
 */
const computedBudgetStatusColor = computed(() => {
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget) {
    return 'error';
  }
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget * 0.85) {
    return 'warning';
  }
  return 'success';
});

/**
 * 计算属性：预算状态详情
 */
const computedBudgetStatusMonthDescription = computed(() => {
  if (computedBudgetRemaining.value < 0) {
    return t('pages.settings.hotsearch.summary.budgetStatusExceededDetail', {
      scope: t('pages.settings.hotsearch.summary.scopeMonth'),
      budget: stateHotsearchConfig.value.monthlyBudget,
      estimate: computedMonthlyEstimate.value,
      exceeded: Math.abs(computedBudgetRemaining.value)
    });
  }

  return t('pages.settings.hotsearch.summary.budgetStatusRemainingDetail', {
    scope: t('pages.settings.hotsearch.summary.scopeMonth'),
    budget: stateHotsearchConfig.value.monthlyBudget,
    estimate: computedMonthlyEstimate.value,
    remaining: computedBudgetRemaining.value
  });
});

/**
 * 计算属性：预算状态年详情
 */
const computedBudgetStatusYearDescription = computed(() => {
  if (computedYearlyBudgetRemaining.value < 0) {
    return t('pages.settings.hotsearch.summary.budgetStatusExceededDetail', {
      scope: t('pages.settings.hotsearch.summary.scopeYear'),
      budget: computedYearlyBudget.value,
      estimate: computedYearlyEstimate.value,
      exceeded: Math.abs(computedYearlyBudgetRemaining.value)
    });
  }

  return t('pages.settings.hotsearch.summary.budgetStatusRemainingDetail', {
    scope: t('pages.settings.hotsearch.summary.scopeYear'),
    budget: computedYearlyBudget.value,
    estimate: computedYearlyEstimate.value,
    remaining: computedYearlyBudgetRemaining.value
  });
});

/**
 * 函数：将时间文本转换为 UInputTime 可用值
 * @param {string} value 时间文本
 * @param {string} fallback 回退时间
 * @returns {THotsearchInputTimeValue} 时间值
 */
const hotsearchTimeValueFromText = (value: string, fallback: string): THotsearchInputTimeValue => {
  const normalized = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  try {
    return parseTime(normalized) as unknown as THotsearchInputTimeValue;
  } catch {
    return parseTime(fallback) as unknown as THotsearchInputTimeValue;
  }
};

/**
 * 函数：将 UInputTime 值格式化为 HH:mm
 * @param {THotsearchInputTimeValue} value 时间值
 * @param {string} fallback 回退时间
 * @returns {string} 时间文本
 */
const hotsearchTextFromTimeValue = (value: THotsearchInputTimeValue, fallback: string): string => {
  if (!value) {
    return fallback;
  }

  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
};

/**
 * 函数：将壳侧计划标记为待刷新
 */
const markRuntimeScheduleDirty = (): void => {
  stateRuntimeSchedule.value = null;
};

/**
 * 函数：读取壳侧热搜计划快照
 * @returns {Promise<void>} 无返回值
 */
const loadRuntimeSchedule = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    stateRuntimeSchedule.value = null;
    return;
  }

  stateRuntimeSchedule.value = await tauriTasks.hotsearchScheduleGet();
};

/**
 * 函数：持久化热搜设置
 * @returns {Promise<void>} 无返回值
 */
const persistHotsearchSettings = async (): Promise<void> => {
  if (!stateHydrated.value) {
    return;
  }

  if (stateSaving.value) {
    statePersistQueued.value = true;
    return;
  }

  stateSaving.value = true;
  try {
    const result = await tauriSettings.update({
      hotsearch: stateHotsearchConfig.value
    });
    stateHotsearchConfig.value = hotsearchSettingsNormalize((result as Record<string, unknown>).hotsearch);
    await loadRuntimeSchedule();
  } finally {
    stateSaving.value = false;
  }

  if (statePersistQueued.value) {
    statePersistQueued.value = false;
    persistHotsearchSettingsDebounced();
  }
};

/**
 * 函数：延迟写回热搜设置
 */
const persistHotsearchSettingsDebounced = useDebounceFn(() => {
  void persistHotsearchSettings();
}, 300);

/**
 * 函数：请求写回热搜设置
 */
const requestPersistHotsearchSettings = (): void => {
  markRuntimeScheduleDirty();
  if (!stateHydrated.value) {
    return;
  }
  persistHotsearchSettingsDebounced();
};

/**
 * 函数：从 Tauri 设置读取热搜配置
 * @returns {Promise<void>} 无返回值
 */
const loadHotsearchSettings = async (): Promise<void> => {
  const settings = await tauriSettings.get();
  stateHotsearchConfig.value = hotsearchSettingsNormalize((settings as Record<string, unknown>).hotsearch);
  await loadRuntimeSchedule();
  stateHydrated.value = true;
};

/**
 * 函数：打开官网用量页面
 */
const handleUsageOpen = (): void => {
  if (isTauriRuntime.value) {
    void tauriWindow.openExternalUrl(HOTSEARCH_USAGE_URL);
    return;
  }

  window.open(HOTSEARCH_USAGE_URL, '_blank', 'noopener,noreferrer');
};

/**
 * 函数：切换热搜自动抓取开关
 * @param {boolean} value 最新值
 */
const handleEnabledUpdate = (value: boolean): void => {
  stateHotsearchConfig.value.enabled = value;
  requestPersistHotsearchSettings();
};

/**
 * 函数：切换播客自动生成开关
 * @param {boolean} value 最新值
 */
const handlePodcastEnabledUpdate = (value: boolean): void => {
  stateHotsearchConfig.value.podcastEnabled = value;
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新月度预算
 * @param {number | undefined} value 最新值
 */
const handleMonthlyBudgetUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    monthlyBudget: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新早间时间
 * @param {string} value 最新值
 */
const handleMorningStartAtUpdate = (value: THotsearchInputTimeValue): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    morningStartAt: hotsearchTextFromTimeValue(value, '06:00')
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新晚间时间
 * @param {string} value 最新值
 */
const handleEveningStartAtUpdate = (value: THotsearchInputTimeValue): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    eveningStartAt: hotsearchTextFromTimeValue(value, '18:00')
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新平台抓取间隔
 * @param {number | undefined} value 最新值
 */
const handlePlatformIntervalSecondsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIntervalSeconds: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新计划随机偏移
 * @param {number | undefined} value 最新值
 */
const handleScheduleJitterSecondsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    scheduleJitterSeconds: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新播客缓冲时间
 * @param {number | undefined} value 最新值
 */
const handlePodcastBufferMinutesUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastBufferMinutes: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新最大重试次数
 * @param {number | undefined} value 最新值
 */
const handleRetryMaxAttemptsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    retryMaxAttempts: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新重试间隔
 * @param {number | undefined} value 最新值
 */
const handleRetryDelayMinutesUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    retryDelayMinutes: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：切换单个平台开关
 * @param {number} platformId 平台 ID
 * @param {boolean} enabled 是否启用
 */
const handlePlatformEnabledUpdate = (platformId: number, enabled: boolean): void => {
  const nextIds = enabled ? [...new Set([...stateHotsearchConfig.value.platformIds, platformId])] : stateHotsearchConfig.value.platformIds.filter((id) => id !== platformId);

  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIds: nextIds
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：切换全部平台开关
 * @param {boolean} enabled 是否全部启用
 */
const handlePlatformsToggleAll = (enabled: boolean): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIds: enabled ? computedPlatforms.value.map((platform) => platform.id) : []
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：恢复默认设置
 */
const handleResetDefaults = (): void => {
  stateHotsearchConfig.value = hotsearchSettingsDefaultCreate();
  requestPersistHotsearchSettings();
};

/**
 * 生命周期：页面挂载后读取配置
 */
onMounted(async () => {
  await loadHotsearchSettings();
});
</script>
