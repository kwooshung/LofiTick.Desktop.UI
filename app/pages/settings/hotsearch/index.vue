<template>
  <DashboardPage>
    <UPageCard :title="t('pages.settings.hotsearch.title')" :description="t('pages.settings.hotsearch.description')" variant="naked" />

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.hotsearch.fields.enabled.label')" :description="t('pages.settings.hotsearch.fields.enabled.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USwitch :model-value="stateHotsearchConfig.enabled" @update:model-value="handleEnabledUpdate" />
      </UFormField>

      <UFormField :label="t('pages.settings.hotsearch.fields.podcastEnabled.label')" :description="t('pages.settings.hotsearch.fields.podcastEnabled.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USwitch :model-value="stateHotsearchConfig.podcastEnabled" @update:model-value="handlePodcastEnabledUpdate" />
      </UFormField>

      <UFormField :label="t('pages.settings.hotsearch.fields.monthlyBudget.label')" :description="t('pages.settings.hotsearch.fields.monthlyBudget.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <div class="flex items-center gap-2">
          <UInput :model-value="String(stateHotsearchConfig.monthlyBudget)" type="number" min="1" step="1" class="w-36" @update:model-value="handleMonthlyBudgetUpdate" />
          <UButton color="neutral" variant="outline" icon="i-lucide:external-link" @click="handleUsageOpen">{{ t('pages.settings.hotsearch.actions.usage') }}</UButton>
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.hotsearch.fields.morningStartAt.label')" :description="t('pages.settings.hotsearch.fields.morningStartAt.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput :model-value="stateHotsearchConfig.morningStartAt" type="time" class="w-36" @update:model-value="handleMorningStartAtUpdate" />
      </UFormField>

      <UFormField :label="t('pages.settings.hotsearch.fields.eveningStartAt.label')" :description="t('pages.settings.hotsearch.fields.eveningStartAt.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput :model-value="stateHotsearchConfig.eveningStartAt" type="time" class="w-36" @update:model-value="handleEveningStartAtUpdate" />
      </UFormField>

      <UFormField :label="t('pages.settings.hotsearch.fields.platformIntervalMinutes.label')" :description="t('pages.settings.hotsearch.fields.platformIntervalMinutes.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput :model-value="String(stateHotsearchConfig.platformIntervalMinutes)" type="number" min="1" step="1" class="w-36" @update:model-value="handlePlatformIntervalMinutesUpdate" />
      </UFormField>

      <UFormField :label="t('pages.settings.hotsearch.fields.podcastBufferMinutes.label')" :description="t('pages.settings.hotsearch.fields.podcastBufferMinutes.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput :model-value="String(stateHotsearchConfig.podcastBufferMinutes)" type="number" min="0" step="1" class="w-36" @update:model-value="handlePodcastBufferMinutesUpdate" />
      </UFormField>

      <UFormField :label="t('pages.settings.hotsearch.fields.retryMaxAttempts.label')" :description="t('pages.settings.hotsearch.fields.retryMaxAttempts.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput :model-value="String(stateHotsearchConfig.retryMaxAttempts)" type="number" min="0" step="1" class="w-36" @update:model-value="handleRetryMaxAttemptsUpdate" />
      </UFormField>

      <UFormField :label="t('pages.settings.hotsearch.fields.retryDelayMinutes.label')" :description="t('pages.settings.hotsearch.fields.retryDelayMinutes.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput :model-value="String(stateHotsearchConfig.retryDelayMinutes)" type="number" min="1" step="1" class="w-36" @update:model-value="handleRetryDelayMinutesUpdate" />
      </UFormField>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6' }">
      <template #header>
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-base font-medium text-highlighted">{{ t('pages.settings.hotsearch.sections.platforms.title') }}</h3>
            <p class="text-muted text-sm">{{ t('pages.settings.hotsearch.sections.platforms.description') }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UButton color="neutral" variant="outline" size="sm" @click="handleSelectAllPlatforms">{{ t('pages.settings.hotsearch.actions.selectAll') }}</UButton>
            <UButton color="neutral" variant="outline" size="sm" @click="handleClearPlatforms">{{ t('pages.settings.hotsearch.actions.clearAll') }}</UButton>
          </div>
        </div>
      </template>

      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <button
          v-for="platform in computedPlatforms"
          :key="platform.id"
          type="button"
          class="border-default hover:border-primary/40 hover:bg-elevated flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors"
          :class="platform.selected ? 'bg-primary/8 border-primary/40' : ''"
          @click="handlePlatformToggle(platform.id)"
        >
          <span class="text-sm text-highlighted">{{ platform.label }}</span>
          <UBadge :color="platform.selected ? 'primary' : 'neutral'" variant="soft">#{{ platform.id }}</UBadge>
        </button>
      </div>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6' }">
      <template #header>
        <div>
          <h3 class="text-base font-medium text-highlighted">{{ t('pages.settings.hotsearch.sections.summary.title') }}</h3>
          <p class="text-muted text-sm">{{ t('pages.settings.hotsearch.sections.summary.description') }}</p>
        </div>
      </template>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UPageCard icon="i-lucide:layers-2" :title="t('pages.settings.hotsearch.summary.selectedPlatforms')" :description="String(computedSelectedPlatformCount)" />
        <UPageCard icon="i-mdi:lightning-bolt-outline" :title="t('pages.settings.hotsearch.summary.perWindowCost')" :description="String(computedPerWindowCost)" />
        <UPageCard icon="i-mdi:calendar-today-outline" :title="t('pages.settings.hotsearch.summary.dailyCost')" :description="String(computedDailyCost)" />
        <UPageCard icon="i-mdi:calendar-month-outline" :title="t('pages.settings.hotsearch.summary.monthlyEstimate')" :description="String(computedMonthlyEstimate)" />
        <UPageCard icon="i-lucide:timer" :title="t('pages.settings.hotsearch.summary.windowDuration')" :description="t('pages.settings.hotsearch.summary.minutesValue', { value: computedWindowDurationMinutes })" />
        <UPageCard icon="i-lucide:clock-3" :title="t('pages.settings.hotsearch.summary.suggestedMorningPodcast')" :description="computedSuggestedMorningPodcastTime" />
        <UPageCard icon="i-lucide:clock-9" :title="t('pages.settings.hotsearch.summary.suggestedEveningPodcast')" :description="computedSuggestedEveningPodcastTime" />
        <UPageCard icon="i-lucide:shield-alert" :title="t('pages.settings.hotsearch.summary.budgetStatus')" :description="computedBudgetStatusLabel">
          <template #footer>
            <UBadge :color="computedBudgetStatusColor" variant="soft">{{ computedBudgetStatusLabel }}</UBadge>
          </template>
        </UPageCard>
      </div>
    </UPageCard>

    <div class="flex items-center justify-end gap-2">
      <UButton color="neutral" variant="outline" @click="handleResetDefaults">{{ t('pages.settings.hotsearch.actions.reset') }}</UButton>
      <UButton color="primary" :loading="stateSaving" @click="handleSave">{{ t('pages.settings.hotsearch.actions.save') }}</UButton>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
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
const computedPlatforms = computed(() => hotsearchPlatformsList().map((platform) => ({
  ...platform,
  label: t(platform.key),
  selected: stateHotsearchConfig.value.platformIds.includes(platform.id)
})));

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
 * 计算属性：壳侧早间窗口快照
 */
const computedRuntimeMorningWindow = computed(() => stateRuntimeSchedule.value?.windows.find((window) => window.key === 'morning') || null);

/**
 * 计算属性：壳侧晚间窗口快照
 */
const computedRuntimeEveningWindow = computed(() => stateRuntimeSchedule.value?.windows.find((window) => window.key === 'evening') || null);

/**
 * 计算属性：单窗口积分消耗
 */
const computedPerWindowCost = computed(() => computedRuntimeMorningWindow.value?.estimatedPoints ?? computedSelectedPlatformCount.value);

/**
 * 计算属性：每天积分消耗
 */
const computedDailyCost = computed(() => computedPerWindowCost.value * 2);

/**
 * 计算属性：月度预计积分消耗
 */
const computedMonthlyEstimate = computed(() => hotsearchEstimatedMonthPointsGet(computedSelectedPlatformCount.value, 2, computedDaysInCurrentMonth.value));

/**
 * 计算属性：窗口耗时
 */
const computedWindowDurationMinutes = computed(() => computedRuntimeMorningWindow.value?.windowDurationMinutes ?? hotsearchWindowDurationMinutesGet(computedSelectedPlatformCount.value, stateHotsearchConfig.value.platformIntervalMinutes));

/**
 * 计算属性：建议早间播客时间
 */
const computedSuggestedMorningPodcastTime = computed(() => computedRuntimeMorningWindow.value?.suggestedPodcastAt ?? hotsearchSuggestedPodcastTimeGet(stateHotsearchConfig.value, stateHotsearchConfig.value.morningStartAt));

/**
 * 计算属性：建议晚间播客时间
 */
const computedSuggestedEveningPodcastTime = computed(() => computedRuntimeEveningWindow.value?.suggestedPodcastAt ?? hotsearchSuggestedPodcastTimeGet(stateHotsearchConfig.value, stateHotsearchConfig.value.eveningStartAt));

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
 * 函数：从 Tauri 设置读取热搜配置
 * @returns {Promise<void>} 无返回值
 */
const loadHotsearchSettings = async (): Promise<void> => {
  const settings = await tauriSettings.get();
  stateHotsearchConfig.value = hotsearchSettingsNormalize((settings as Record<string, unknown>).hotsearch);
  await loadRuntimeSchedule();
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
 * @param {boolean | string} value 最新值
 */
const handleEnabledUpdate = (value: boolean | string): void => {
  stateHotsearchConfig.value.enabled = Boolean(value);
  markRuntimeScheduleDirty();
};

/**
 * 函数：切换播客自动生成开关
 * @param {boolean | string} value 最新值
 */
const handlePodcastEnabledUpdate = (value: boolean | string): void => {
  stateHotsearchConfig.value.podcastEnabled = Boolean(value);
  markRuntimeScheduleDirty();
};

/**
 * 函数：更新月度预算
 * @param {string | number} value 最新值
 */
const handleMonthlyBudgetUpdate = (value: string | number): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    monthlyBudget: value
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：更新早间时间
 * @param {string | number} value 最新值
 */
const handleMorningStartAtUpdate = (value: string | number): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    morningStartAt: value
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：更新晚间时间
 * @param {string | number} value 最新值
 */
const handleEveningStartAtUpdate = (value: string | number): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    eveningStartAt: value
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：更新平台抓取间隔
 * @param {string | number} value 最新值
 */
const handlePlatformIntervalMinutesUpdate = (value: string | number): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIntervalMinutes: value
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：更新播客缓冲时间
 * @param {string | number} value 最新值
 */
const handlePodcastBufferMinutesUpdate = (value: string | number): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastBufferMinutes: value
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：更新最大重试次数
 * @param {string | number} value 最新值
 */
const handleRetryMaxAttemptsUpdate = (value: string | number): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    retryMaxAttempts: value
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：更新重试间隔
 * @param {string | number} value 最新值
 */
const handleRetryDelayMinutesUpdate = (value: string | number): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    retryDelayMinutes: value
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：切换平台选择
 * @param {number} platformId 平台 ID
 */
const handlePlatformToggle = (platformId: number): void => {
  const nextIds = stateHotsearchConfig.value.platformIds.includes(platformId)
    ? stateHotsearchConfig.value.platformIds.filter((id) => id !== platformId)
    : [...stateHotsearchConfig.value.platformIds, platformId];

  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIds: nextIds
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：选择全部平台
 */
const handleSelectAllPlatforms = (): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIds: hotsearchPlatformsList().map((platform) => platform.id)
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：清空平台选择
 */
const handleClearPlatforms = (): void => {
  stateHotsearchConfig.value = hotsearchSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIds: []
  });
  markRuntimeScheduleDirty();
};

/**
 * 函数：恢复默认设置
 */
const handleResetDefaults = (): void => {
  stateHotsearchConfig.value = hotsearchSettingsDefaultCreate();
  markRuntimeScheduleDirty();
};

/**
 * 函数：保存热搜设置
 * @returns {Promise<void>} 无返回值
 */
const handleSave = async (): Promise<void> => {
  if (stateSaving.value) {
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
};

/**
 * 生命周期：页面挂载后读取配置
 */
onMounted(async () => {
  await loadHotsearchSettings();
});
</script>