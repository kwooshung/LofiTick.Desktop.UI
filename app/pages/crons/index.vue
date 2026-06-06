<template>
  <DashboardPage>
    <div v-if="isTauriRuntime && computedLocalTasks.length > 0" class="flex w-full flex-1 flex-col gap-3">
      <div class="flex w-full flex-1 gap-1">
        <div class="min-w-0 flex-1">
          <UTable
            :columns="columns"
            :data="computedLocalTasks"
            class="w-full"
            :ui="{
              base: 'w-full table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0 align-top',
              th: 'px-3 py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r text-left',
              td: 'px-3 py-2.5 border-b border-default align-top',
              separator: 'h-0'
            }"
          />
        </div>
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
import type { TableColumn } from '@nuxt/ui';

/**
 * 组件：日期时间。
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * 组件：图标。
 */
const UIcon = resolveComponent('UIcon');

/**
 * 组件：链接。
 */
const ULink = resolveComponent('ULink');

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 哨兵。
 */
const { statusGet: sentinelStatusGet } = useTauriSentinel();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 函数：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 状态：本地哨兵状态。
 */
const stateSentinelStatus = ref<ISentinelStatusPayload | null>(null);

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
  return key === 'local-sentinel' ? 'i-lucide:shield-check' : 'i-lucide:podcast';
};

/**
 * 函数：获取任务设置页地址。
 *
 * 根据本地任务标识跳转到对应的设置页。
 *
 * # Arguments
 *
 * * `key` - 本地任务标识。
 *
 * # Returns
 *
 * 返回对应设置页的本地化路由地址。
 */
const localTaskSettingsPathGet = (key: string): string => {
  if (key === 'local-sentinel') {
    return localePath('/settings/unattended');
  }

  return localePath('/settings/hotsearch');
};

/**
 * 函数：渲染任务最近活动。
 *
 * 当最近活动为可展示的时间值时，统一使用 Datetime 组件输出。
 *
 * # Arguments
 *
 * * `row` - 当前本地任务行数据。
 * * `labelVisible` - 是否显示最近活动标签。
 *
 * # Returns
 *
 * 返回最近活动节点。
 */
const localTaskActivityNodeGet = (row: IPageSettingsLocalCronRow, labelVisible = false) => {
  if (row.key !== 'local-sentinel') {
    return h('div', { class: 'text-highlighted mt-1 text-sm leading-6 wrap-break-word' }, row.scheduleSecondary || t('common.labels.none'));
  }

  if (!computedSentinelLastSeenAt.value) {
    return h('div', { class: 'text-highlighted mt-1 text-sm leading-6' }, t('common.labels.none'));
  }

  return h('div', { class: labelVisible ? 'mt-1 space-y-1' : 'space-y-1' }, [
    labelVisible ? h('div', { class: 'text-muted text-xs' }, t('pages.settings.cron.local.schedule.lastSeenLabel')) : null,
    h(Datetime, {
      class: 'w-auto max-w-full',
      datetime: computedSentinelLastSeenAt.value,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  ]);
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

  const enabledSceneCount = stateSentinelStatus.value?.attach.enabledSceneCount ?? 0;
  const recoveryState = stateSentinelStatus.value?.attach.recoveryState ?? t('common.labels.none');

  return [
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
 * 表格：本地任务列定义。
 */
const columns: TableColumn<IPageSettingsLocalCronRow>[] = [
  {
    id: 'task',
    accessorKey: 'title',
    meta: {
      class: {
        th: 'w-[42%] xl:w-[40%]',
        td: 'w-[42%] xl:w-[40%]'
      }
    },
    header: t('pages.settings.cron.tabs.local'),
    cell: ({ row }) => {
      return h('div', { class: 'min-w-0 space-y-1.5' }, [
        h('div', { class: 'flex items-start gap-2' }, [
          h('div', { class: 'bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md' }, [h(UIcon, { name: localTaskIconGet(row.original.key), class: 'size-4' })]),
          h('div', { class: 'min-w-0 flex-1' }, [
            h('div', { class: 'flex flex-wrap items-center gap-1.5' }, [
              h('div', { class: 'text-highlighted text-sm font-semibold' }, row.original.title),
              h(UBadge, { color: row.original.statusColor, variant: 'soft' }, () => row.original.statusLabel),
              h(
                ULink,
                {
                  raw: true,
                  to: localTaskSettingsPathGet(row.original.key),
                  class: 'text-muted hover:bg-elevated hover:text-highlighted inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium no-underline transition-colors'
                },
                () => [h(UIcon, { name: 'i-lucide:arrow-up-right', class: 'size-3.5 shrink-0' }), t('pages.settings.cron.local.actions.openSettings')]
              )
            ]),
            h('p', { class: 'text-muted mt-1 text-xs leading-5 wrap-break-word' }, row.original.description)
          ])
        ]),
        h(
          'div',
          { class: 'flex flex-wrap items-center gap-1.5 pl-9' },
          row.original.badges.map((badge) => h(UBadge, { color: badge.color, variant: 'soft' }, () => badge.label))
        )
      ]);
    }
  },
  {
    id: 'details',
    accessorKey: 'schedulePrimary',
    meta: {
      class: {
        th: 'w-[58%] xl:hidden',
        td: 'w-[58%] xl:hidden'
      }
    },
    header: '详情',
    cell: ({ row }) => {
      return h('div', { class: 'min-w-0 space-y-2' }, [
        h('div', { class: 'min-w-0' }, [h('div', { class: 'text-muted text-[11px] leading-4' }, t('pages.settings.cron.table.schedule')), h('div', { class: 'text-highlighted mt-1 text-sm leading-6 wrap-break-word' }, row.original.schedulePrimary)]),
        h('div', { class: 'min-w-0' }, [h('div', { class: 'text-muted text-[11px] leading-4' }, t('pages.settings.cron.local.card.activity')), localTaskActivityNodeGet(row.original)])
      ]);
    }
  },
  {
    id: 'schedule',
    accessorKey: 'schedulePrimary',
    meta: {
      class: {
        th: 'hidden xl:table-cell xl:w-[32%]',
        td: 'hidden xl:table-cell xl:w-[32%]'
      }
    },
    header: t('pages.settings.cron.table.schedule'),
    cell: ({ row }) => h('div', { class: 'min-w-0 text-sm leading-6 wrap-break-word text-highlighted' }, row.original.schedulePrimary)
  },
  {
    id: 'activity',
    accessorKey: 'scheduleSecondary',
    meta: {
      class: {
        th: 'hidden xl:table-cell xl:w-[28%]',
        td: 'hidden xl:table-cell xl:w-[28%]'
      }
    },
    header: t('pages.settings.cron.local.card.activity'),
    cell: ({ row }) => {
      return h('div', { class: 'min-w-0' }, [localTaskActivityNodeGet(row.original, true)]);
    }
  }
];

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

  stateSentinelStatus.value = await sentinelStatusGet();
};

/**
 * 生命周期：页面挂载。
 */
onMounted(() => {
  void loadLocalTasks();
});
</script>
