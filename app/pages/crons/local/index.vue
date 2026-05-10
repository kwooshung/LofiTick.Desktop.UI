<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-3">
      <div class="flex w-full flex-1 gap-1 overflow-auto">
        <div class="min-w-full flex-1">
          <UTable
            v-if="isTauriRuntime"
            :columns="columns"
            :data="computedLocalTasks"
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
          <UEmpty v-else-if="!isTauriRuntime" icon="i-lucide:monitor-off" :title="t('pages.settings.cron.local.runtimeOnly.title')" :description="t('pages.settings.cron.local.runtimeOnly.description')" class="py-8" />
          <UEmpty v-else icon="i-lucide:clock-3" :title="t('pages.settings.cron.local.empty.title')" :description="t('pages.settings.cron.local.empty.description')" class="py-8" />
        </div>
      </div>
      <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div class="muted text-sm">{{ t('pages.settings.cron.footer.total', { total: computedTaskTotal }) }}</div>
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

/**
 * 组件：徽标
 */
const UBadge = resolveComponent('UBadge');

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 哨兵
 */
const { statusGet: sentinelStatusGet } = useTauriSentinel();

/**
 * Hook：Tauri 任务
 */
const tauriTasks = useTauriTasks();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 状态：本地任务计划快照
 */
const stateSchedule = ref<ITauriHotsearchScheduleSnapshot | null>(null);

/**
 * 状态：本地哨兵状态
 */
const stateSentinelStatus = ref<ISentinelStatusPayload | null>(null);

/**
 * 函数：格式化本地热搜窗口范围
 * @returns {string} 窗口范围文本
 */
const localHotsearchWindowRangeTextGet = (): string => {
  const windows = stateSchedule.value?.windows ?? [];

  if (windows.length === 0) {
    return t('pages.settings.cron.local.schedule.pending');
  }

  return windows.map((window) => `${t(`pages.settings.cron.local.windowKeys.${window.key}`)} ${window.startAt}-${window.endAt}`).join(' / ');
};

/**
 * 函数：格式化建议播客时间
 * @returns {string} 建议播客文本
 */
const localHotsearchPodcastTextGet = (): string => {
  const windows = stateSchedule.value?.windows ?? [];

  if (windows.length === 0) {
    return t('pages.settings.cron.local.schedule.pending');
  }

  return windows.map((window) => `${t(`pages.settings.cron.local.windowKeys.${window.key}`)} ${window.suggestedPodcastAt}`).join(' / ');
};

/**
 * 函数：获取哨兵状态文案
 * @returns {string} 状态文案
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
 * 函数：获取哨兵状态颜色
 * @returns {IPageSettingsLocalCronRow['statusColor']} 状态颜色
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
 * 计算属性：本地后台任务
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
  const lastSeenAt = stateSentinelStatus.value?.attach.lastSeenAt ?? t('common.labels.none');

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
      scheduleSecondary: `${t('pages.settings.cron.local.schedule.lastSeenLabel')} ${lastSeenAt}`,
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
 * 计算属性：本地任务总数
 */
const computedTaskTotal = computed(() => computedLocalTasks.value.length);

/**
 * 常量：本地任务表格列
 */
const columns: TableColumn<IPageSettingsLocalCronRow>[] = [
  {
    accessorKey: 'title',
    header: t('pages.settings.cron.table.name'),
    cell: ({ row }) => h('div', { class: 'space-y-1 min-w-0' }, [h('div', { class: 'text-highlighted font-medium' }, row.original.title), h('div', { class: 'text-sm text-dimmed whitespace-normal break-words' }, row.original.description)])
  },
  {
    accessorKey: 'schedulePrimary',
    header: t('pages.settings.cron.table.schedule'),
    cell: ({ row }) => h('div', { class: 'space-y-1' }, [h('div', { class: 'text-sm text-muted break-words' }, row.original.schedulePrimary), h('div', { class: 'text-sm text-dimmed break-words' }, row.original.scheduleSecondary ?? t('common.labels.none'))])
  },
  {
    accessorKey: 'statusLabel',
    header: t('pages.settings.cron.table.status'),
    cell: ({ row }) => h('div', { class: 'flex flex-wrap gap-2' }, [h(UBadge, { color: row.original.statusColor, variant: 'soft' }, () => row.original.statusLabel), ...row.original.badges.map((badge) => h(UBadge, { color: badge.color, variant: 'soft' }, () => badge.label))])
  }
];

/**
 * 函数：加载本地任务计划快照
 * @returns {Promise<void>} 无返回值
 */
const loadLocalTasks = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    stateSchedule.value = null;
    stateSentinelStatus.value = null;
    return;
  }

  const [scheduleResult, sentinelResult] = await Promise.allSettled([tauriTasks.hotsearchScheduleGet(), sentinelStatusGet()]);

  stateSchedule.value = scheduleResult.status === 'fulfilled' ? scheduleResult.value : null;
  stateSentinelStatus.value = sentinelResult.status === 'fulfilled' ? sentinelResult.value : null;
};

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  await loadLocalTasks();
});
</script>
