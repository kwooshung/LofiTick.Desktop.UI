<template>
  <DashboardPage>
    <UPageCard :title="t('pages.settings.cron.local.snapshot.title')" :description="t('pages.settings.cron.local.snapshot.description')" variant="naked" />

    <div v-if="isTauriRuntime && computedLocalTasks.length > 0" class="space-y-4">
      <div class="grid gap-4 2xl:grid-cols-2">
        <UPageCard v-for="item in computedLocalTasks" :key="item.key" variant="outline" class="h-full">
          <template #header>
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <UIcon :name="localTaskIconGet(item.key)" class="text-primary size-5" />
                  <div class="text-highlighted text-base font-semibold">{{ item.title }}</div>
                </div>
                <p class="text-muted text-sm leading-6">{{ item.description }}</p>
              </div>

              <UBadge :color="item.statusColor" variant="soft" class="shrink-0">{{ item.statusLabel }}</UBadge>
            </div>
          </template>

          <template #body>
            <div class="space-y-5">
              <div class="flex flex-wrap gap-2">
                <UBadge v-for="badge in item.badges" :key="`${item.key}-${badge.label}`" :color="badge.color" variant="soft">
                  {{ badge.label }}
                </UBadge>
              </div>

              <div class="border-default bg-elevated/45 rounded-xl border p-4">
                <div class="text-muted text-[11px] tracking-[0.16em] uppercase">{{ t('pages.settings.cron.table.schedule') }}</div>
                <div class="text-highlighted mt-2 text-sm leading-7">{{ item.schedulePrimary }}</div>
              </div>

              <div v-if="item.key !== 'local-sentinel'" class="border-default bg-default/70 rounded-xl border p-4">
                <div class="text-muted text-[11px] tracking-[0.16em] uppercase">{{ t('pages.settings.cron.local.card.activity') }}</div>
                <div class="text-muted mt-2 text-sm leading-7">{{ item.scheduleSecondary || t('common.labels.none') }}</div>
              </div>

              <div v-else class="border-default bg-default/70 rounded-xl border p-4">
                <div class="text-muted text-[11px] tracking-[0.16em] uppercase">{{ t('pages.settings.cron.local.card.activity') }}</div>

                <div v-if="computedSentinelLastSeenAt" class="mt-2 space-y-1.5">
                  <div class="text-highlighted text-sm">{{ t('pages.settings.cron.local.schedule.lastSeenLabel') }}</div>
                  <div class="text-sm leading-7">
                    <Datetime :datetime="computedSentinelLastSeenAt" />
                  </div>
                </div>

                <div v-else class="text-muted mt-2 text-sm leading-7">{{ t('common.labels.none') }}</div>
              </div>
            </div>
          </template>
        </UPageCard>
      </div>

      <div class="border-default flex items-center justify-between gap-3 border-t pt-4">
        <div class="text-muted text-sm">{{ t('pages.settings.cron.footer.total', { total: computedTaskTotal }) }}</div>
      </div>
    </div>

    <UEmpty v-else-if="!isTauriRuntime" icon="i-lucide:monitor-off" :title="t('pages.settings.cron.local.runtimeOnly.title')" :description="t('pages.settings.cron.local.runtimeOnly.description')" class="py-8" />
    <UEmpty v-else icon="i-lucide:clock-3" :title="t('pages.settings.cron.local.empty.title')" :description="t('pages.settings.cron.local.empty.description')" class="py-8" />
  </DashboardPage>
</template>

<script setup lang="ts">
import type { IPageSettingsLocalCronRow } from '@@/shared/types/pages/settings/cron/page/index.types';

/**
 * 组件：日期时间。
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 哨兵。
 */
const { statusGet: sentinelStatusGet } = useTauriSentinel();

/**
 * Hook：Tauri 任务。
 */
const tauriTasks = useTauriTasks();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 状态：本地任务计划快照。
 */
const stateSchedule = ref<ITauriHotsearchScheduleSnapshot | null>(null);

/**
 * 状态：本地哨兵状态。
 */
const stateSentinelStatus = ref<ISentinelStatusPayload | null>(null);

/**
 * 函数：格式化本地热搜窗口范围。
 *
 * @return {string} 返回窗口范围文本
 */
const localHotsearchWindowRangeTextGet = (): string => {
  const windows = stateSchedule.value?.windows ?? [];

  if (windows.length === 0) {
    return t('pages.settings.cron.local.schedule.pending');
  }

  return windows.map((window) => `${t(`pages.settings.cron.local.windowKeys.${window.key}`)} ${window.startAt}-${window.endAt}`).join(' / ');
};

/**
 * 函数：格式化建议播客时间。
 *
 * @return {string} 返回建议播客文本
 */
const localHotsearchPodcastTextGet = (): string => {
  const windows = stateSchedule.value?.windows ?? [];

  if (windows.length === 0) {
    return t('pages.settings.cron.local.schedule.pending');
  }

  return windows.map((window) => `${t(`pages.settings.cron.local.windowKeys.${window.key}`)} ${window.suggestedPodcastAt}`).join(' / ');
};

/**
 * 函数：获取哨兵状态文案。
 *
 * @return {string} 返回状态文案
 */
const localSentinelStatusLabelGet = (): string => {
  const state = stateSentinelStatus.value?.status.state;

  if (state === 'online') {
    return t('pages.settings.cron.local.states.sentinelOnline');
  }

  if (state === 'offline') {
    return t('pages.settings.cron.local.states.sentinelOffline');
  }

  if (state === 'error') {
    return t('pages.settings.cron.local.states.sentinelError');
  }

  if (state === 'idle') {
    return t('pages.settings.cron.local.states.sentinelIdle');
  }

  return t('pages.settings.cron.local.states.sentinelUnknown');
};

/**
 * 函数：获取哨兵状态颜色。
 *
 * @return {IPageSettingsLocalCronRow['statusColor']} 返回状态颜色
 */
const localSentinelStatusColorGet = (): IPageSettingsLocalCronRow['statusColor'] => {
  const state = stateSentinelStatus.value?.status.state;

  if (state === 'online') {
    return 'success';
  }

  if (state === 'offline') {
    return 'warning';
  }

  if (state === 'error') {
    return 'error';
  }

  return 'neutral';
};

/**
 * 函数：获取本地任务图标。
 *
 * @param {string} key 任务标识
 * @return {string} 图标名称
 */
const localTaskIconGet = (key: string): string => {
  if (key === 'local-sentinel') {
    return 'i-lucide:shield-check';
  }

  return 'i-lucide:podcast';
};

/**
 * 计算属性：哨兵最后心跳时间。
 */
const computedSentinelLastSeenAt = computed(() => String(stateSentinelStatus.value?.attach.lastSeenAt || '').trim());

/**
 * 计算属性：本地后台任务。
 */
const computedLocalTasks = computed<IPageSettingsLocalCronRow[]>(() => {
  if (!isTauriRuntime.value) {
    return [];
  }

  const hotsearchEnabled = stateSchedule.value?.enabled ?? false;
  const podcastEnabled = stateSchedule.value?.podcastEnabled ?? false;
  const selectedPlatformCount = stateSchedule.value?.selectedPlatformCount ?? 0;
  const monthlyBudget = stateSchedule.value?.monthlyBudget ?? 0;
  const enabledSceneCount = stateSentinelStatus.value?.attach.enabledSceneCount ?? 0;
  const recoveryState = stateSentinelStatus.value?.attach.recoveryState ?? t('common.labels.none');

  return [
    {
      key: 'local-hotsearch',
      title: t('pages.settings.cron.local.items.hotsearch.title'),
      description: t('pages.settings.cron.local.items.hotsearch.description'),
      schedulePrimary: `${t('pages.settings.cron.local.schedule.windowsLabel')} ${localHotsearchWindowRangeTextGet()}`,
      scheduleSecondary: `${t('pages.settings.cron.local.schedule.podcastLabel')} ${localHotsearchPodcastTextGet()}`,
      statusLabel: hotsearchEnabled ? t('pages.settings.cron.local.states.hotsearchEnabled') : t('pages.settings.cron.local.states.hotsearchDisabled'),
      statusColor: hotsearchEnabled ? 'success' : 'neutral',
      badges: [
        {
          color: podcastEnabled ? 'success' : 'neutral',
          label: t('pages.settings.cron.local.summary.podcastEnabled', { value: podcastEnabled ? t('common.actions.enabled') : t('common.actions.disabled') })
        },
        {
          color: 'neutral',
          label: t('pages.settings.cron.local.summary.platformCount', { value: selectedPlatformCount })
        },
        {
          color: 'primary',
          label: t('pages.settings.cron.local.summary.monthlyBudget', { value: monthlyBudget })
        }
      ]
    },
    {
      key: 'local-sentinel',
      title: t('pages.settings.cron.local.items.sentinel.title'),
      description: t('pages.settings.cron.local.items.sentinel.description'),
      schedulePrimary: t('pages.settings.cron.local.schedule.sentinelPolling'),
      scheduleSecondary: computedSentinelLastSeenAt.value || t('common.labels.none'),
      statusLabel: localSentinelStatusLabelGet(),
      statusColor: localSentinelStatusColorGet(),
      badges: [
        {
          color: 'neutral',
          label: t('pages.settings.cron.local.summary.sceneCount', { value: enabledSceneCount })
        },
        {
          color: 'warning',
          label: t('pages.settings.cron.local.summary.recoveryState', { value: recoveryState })
        }
      ]
    }
  ];
});

/**
 * 计算属性：本地任务总数。
 */
const computedTaskTotal = computed(() => computedLocalTasks.value.length);

/**
 * 函数：加载本地任务。
 *
 * @return {Promise<void>} 无返回值
 */
const loadLocalTasks = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  const [schedule, sentinelStatus] = await Promise.all([tauriTasks.hotsearchScheduleGet(), sentinelStatusGet()]);
  stateSchedule.value = schedule;
  stateSentinelStatus.value = sentinelStatus;
};

/**
 * 生命周期：页面挂载。
 */
onMounted(() => {
  void loadLocalTasks();
});
</script>
