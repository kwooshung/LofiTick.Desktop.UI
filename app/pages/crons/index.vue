<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge :color="computedHotsearchStatusColor" variant="soft">{{ computedHotsearchStatusLabel }}</UBadge>
        <UBadge color="neutral" variant="soft">{{ t('pages.settings.cron.hotsearch.enabled', { value: stateHotsearchStatus?.hotsearchEnabled ? t('common.actions.enabled') : t('common.actions.disabled') }) }}</UBadge>
        <div class="text-muted min-w-0 text-sm break-all">{{ stateHotsearchStatus?.callbackUrl || t('pages.settings.cron.hotsearch.callbackUnset') }}</div>
      </div>

      <UEmpty v-if="!computedOnepanelConfigured" icon="i-lucide:cable" :title="t('pages.settings.cron.hotsearch.states.unconfigured')" :description="t('pages.settings.cron.hotsearch.description')" class="border-default rounded-xl border border-dashed py-10">
        <template #actions>
          <UButton color="primary" icon="i-lucide:settings-2" @click="navigateTo(localePath('/settings/connections'))">
            {{ t('pages.settings.connections.title') }}
          </UButton>
        </template>
      </UEmpty>

      <div v-else class="flex w-full flex-1 gap-1 overflow-auto">
        <div class="min-w-full flex-1">
          <UTable
            :columns="columns"
            :data="stateCronjobs"
            :loading="loading"
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
      </div>
      <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div class="muted text-sm">{{ t('pages.settings.cron.footer.total', { total: stateCronjobs.length }) }}</div>
      </div>
    </div>

    <UModal v-model:open="stateRecordsOpen" :title="stateRecordsTitle" :ui="{ content: 'sm:max-w-5xl', body: 'overflow-auto' }">
      <template #body>
        <div class="space-y-4">
          <UTable
            :columns="recordColumns"
            :data="stateRecords"
            :loading="stateRecordsLoading"
            sticky
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
              td: 'border-b border-default align-top',
              separator: 'h-0'
            }"
          />
          <UEmpty v-if="!stateRecordsLoading && stateRecords.length === 0" icon="i-lucide:history" :title="t('pages.settings.cron.records.empty.title')" :description="t('pages.settings.cron.records.empty.description')" />
        </div>
      </template>
    </UModal>

    <UModal v-model:open="stateLogOpen" :title="stateLogTitle" :ui="{ content: 'sm:max-w-4xl' }">
      <template #body>
        <div class="space-y-4">
          <UTextarea :model-value="stateLogContent" :rows="18" readonly autoresize class="w-full font-mono" />
          <UEmpty v-if="!stateLogLoading && !stateLogContent" icon="i-lucide:file-text" :title="t('pages.settings.cron.logs.empty.title')" :description="t('pages.settings.cron.logs.empty.description')" />
        </div>
      </template>
    </UModal>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

/**
 * 组件：按钮
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：徽标
 */
const UBadge = resolveComponent('UBadge');

/**
 * 组件：弹出层
 */
const UPopover = resolveComponent('UPopover');

/**
 * 组件：时间
 */
const Datetime = resolveComponent('Datetime');

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * API：cron 列表与操作
 */
const { datas, loading, refresh } = await useApi<IPageSettingsCronjobPage>('desktop/onepanel/cronjobs/search', { method: 'POST', immediate: false });
const { refresh: refreshCronjobStatus } = await useApi<Record<string, never>>('desktop/onepanel/cronjobs/status', { method: 'POST', immediate: false });
const { refresh: refreshCronjobHandle } = await useApi<Record<string, never>>('desktop/onepanel/cronjobs/handle', { method: 'POST', immediate: false });
const { refresh: refreshCronjobStop } = await useApi<Record<string, never>>('desktop/onepanel/cronjobs/stop', { method: 'POST', immediate: false });
const { refresh: refreshCronjobDelete } = await useApi<Record<string, never>>('desktop/onepanel/cronjobs/del', { method: 'POST', immediate: false });
const { datas: stateRecordDatas, refresh: refreshCronjobRecords } = await useApi<IPageSettingsCronjobRecordPage>('desktop/onepanel/cronjobs/search/records', { method: 'POST', immediate: false });
const { datas: stateLogDatas, refresh: refreshCronjobLog } = await useApi<IPageSettingsCronjobRecordLog>('desktop/onepanel/cronjobs/records/log', { method: 'POST', immediate: false });
const { datas: stateHotsearchStatusDatas, refresh: refreshHotsearchStatus } = await useApi<IPageSettingsHotsearchCronStatus>('desktop/onepanel/hotsearch/status', { immediate: false });
const { refresh: refreshHotsearchSync } = await useApi<IPageSettingsHotsearchCronStatus>('desktop/onepanel/hotsearch/sync', { method: 'POST', immediate: false });

const route = useRoute();

const stateRefreshNonce = useState('crons-refresh-nonce', () => 0);
const stateSyncNonce = useState('crons-sync-nonce', () => 0);

/**
 * 状态：1Panel 是否已完成配置
 */
const stateOnepanelConfigured = useState('crons-onepanel-configured', () => false);

/**
 * 状态：cron 列表
 */
const stateCronjobs = ref<IPageSettingsCronjobInfo[]>([]);

/**
 * 状态：热搜同步中
 */
const stateHotsearchSyncing = ref(false);

/**
 * 状态：记录弹窗开关
 */
const stateRecordsOpen = ref(false);

/**
 * 状态：记录加载中
 */
const stateRecordsLoading = ref(false);

/**
 * 状态：记录列表
 */
const stateRecords = ref<IPageSettingsCronjobRecord[]>([]);

/**
 * 状态：记录标题
 */
const stateRecordsTitle = ref('');

/**
 * 状态：日志弹窗开关
 */
const stateLogOpen = ref(false);

/**
 * 状态：日志加载中
 */
const stateLogLoading = ref(false);

/**
 * 状态：日志标题
 */
const stateLogTitle = ref('');

/**
 * 状态：日志内容
 */
const stateLogContent = ref('');

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
    label: t('pages.settings.cron.title'),
    icon: 'i-lucide:timer-reset',
    to: localePath('/crons')
  }
];

/**
 * 计算属性：热搜状态
 */
const stateHotsearchStatus = computed(() => stateHotsearchStatusDatas.value);

/**
 * 计算属性：1Panel 是否已完成配置
 */
const computedOnepanelConfigured = computed(() => stateOnepanelConfigured.value);

/**
 * 计算属性：热搜状态标签
 */
const computedHotsearchStatusLabel = computed(() => {
  if (!stateHotsearchStatus.value?.configured) {
    return t('pages.settings.cron.hotsearch.states.unconfigured');
  }

  if (!stateHotsearchStatus.value.synchronized) {
    return t('pages.settings.cron.hotsearch.states.outOfSync');
  }

  return t('pages.settings.cron.hotsearch.states.ready');
});

/**
 * 计算属性：热搜状态颜色
 */
const computedHotsearchStatusColor = computed(() => {
  if (!stateHotsearchStatus.value?.configured) {
    return 'warning';
  }

  if (!stateHotsearchStatus.value.synchronized) {
    return 'error';
  }

  return 'success';
});

/**
 * 函数：加载 cron 列表
 */
const loadCronjobs = async (): Promise<void> => {
  if (!computedOnepanelConfigured.value) {
    stateCronjobs.value = [];
    return;
  }

  const info = typeof route.query.info === 'string' ? route.query.info : '';

  await refresh({
    body: {
      info: String(info || '').trim(),
      page: 1,
      pageSize: 100,
      groupIds: [],
      orderBy: 'createdAt',
      order: 'descending'
    }
  });

  stateCronjobs.value = Array.isArray(datas.value?.items) ? datas.value.items : [];
};

/**
 * 函数：加载热搜状态
 */
const loadHotsearchStatus = async (): Promise<void> => {
  await refreshHotsearchStatus();
  stateOnepanelConfigured.value = Boolean(stateHotsearchStatusDatas.value?.configured);
};

/**
 * 事件：刷新 cron 列表
 */
const handleRefreshCronjobs = async (): Promise<void> => {
  await loadHotsearchStatus();
  await loadCronjobs();
};

/**
 * 事件：切换任务状态
 * @param {IPageSettingsCronjobInfo} item 任务信息
 * @param {boolean} enabled 是否启用
 */
const handleToggleStatus = async (item: IPageSettingsCronjobInfo, enabled: boolean): Promise<void> => {
  await refreshCronjobStatus({
    body: {
      id: item.id,
      status: enabled ? 'Enable' : 'Disable'
    }
  });

  await handleRefreshCronjobs();
};

/**
 * 事件：手动执行任务
 * @param {IPageSettingsCronjobInfo} item 任务信息
 */
const handleRunCronjob = async (item: IPageSettingsCronjobInfo): Promise<void> => {
  await refreshCronjobHandle({ body: { id: item.id } });
  await handleRefreshCronjobs();
};

/**
 * 事件：停止任务
 * @param {IPageSettingsCronjobInfo} item 任务信息
 */
const handleStopCronjob = async (item: IPageSettingsCronjobInfo): Promise<void> => {
  await refreshCronjobStop({ body: { id: item.id } });
  await handleRefreshCronjobs();
};

/**
 * 事件：删除任务
 * @param {IPageSettingsCronjobInfo} item 任务信息
 */
const handleDeleteCronjob = async (item: IPageSettingsCronjobInfo): Promise<void> => {
  await refreshCronjobDelete({
    body: {
      ids: [item.id],
      cleanData: false,
      cleanRemoteData: false
    }
  });

  await handleRefreshCronjobs();
};

/**
 * 事件：打开执行记录
 * @param {IPageSettingsCronjobInfo} item 任务信息
 */
const handleOpenRecords = async (item: IPageSettingsCronjobInfo): Promise<void> => {
  stateRecordsTitle.value = t('pages.settings.cron.records.title', { name: item.name });
  stateRecordsOpen.value = true;
  stateRecordsLoading.value = true;

  try {
    await refreshCronjobRecords({
      body: {
        page: 1,
        pageSize: 50,
        cronjobId: item.id,
        status: ''
      }
    });

    stateRecords.value = Array.isArray(stateRecordDatas.value?.items) ? stateRecordDatas.value.items : [];
  } finally {
    stateRecordsLoading.value = false;
  }
};

/**
 * 事件：打开日志
 * @param {IPageSettingsCronjobRecord} item 记录信息
 */
const handleOpenLog = async (item: IPageSettingsCronjobRecord): Promise<void> => {
  stateLogTitle.value = t('pages.settings.cron.logs.title', { id: item.id });
  stateLogOpen.value = true;
  stateLogLoading.value = true;
  stateLogContent.value = '';

  try {
    await refreshCronjobLog({ body: { id: item.id } });
    stateLogContent.value = String(stateLogDatas.value?.content || '');
  } finally {
    stateLogLoading.value = false;
  }
};

/**
 * 事件：同步热搜 cron
 */
const handleHotsearchSync = async (): Promise<void> => {
  if (stateHotsearchSyncing.value) {
    return;
  }

  if (!computedOnepanelConfigured.value) {
    await navigateTo(localePath('/settings/connections'));
    return;
  }

  stateHotsearchSyncing.value = true;
  try {
    await refreshHotsearchSync();
    await handleRefreshCronjobs();
  } finally {
    stateHotsearchSyncing.value = false;
  }
};

/**
 * 表格：cron 列定义
 */
const columns: TableColumn<IPageSettingsCronjobInfo>[] = [
  {
    accessorKey: 'name',
    header: t('pages.settings.cron.table.name'),
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col gap-1.5' }, [
        h('div', { class: 'text-sm font-medium text-highlighted break-words' }, row.original.name),
        h('div', { class: 'flex flex-wrap items-center gap-2 text-xs text-muted' }, [
          h(UBadge, { color: 'neutral', variant: 'soft', size: 'sm' }, () => row.original.cronType),
          ...(row.original.isExecuting ? [h(UBadge, { color: 'warning', variant: 'soft', size: 'sm' }, () => t('pages.settings.cron.table.executing'))] : [])
        ])
      ])
  },
  {
    accessorKey: 'spec',
    header: t('pages.settings.cron.table.schedule'),
    meta: {
      class: {
        th: 'hidden xl:table-cell',
        td: 'hidden xl:table-cell'
      }
    },
    cell: ({ row }) => h('div', { class: 'space-y-1 text-sm' }, [h('div', { class: 'text-highlighted font-mono break-all' }, row.original.spec || '-'), h('div', { class: 'text-xs text-muted break-all' }, row.original.url || row.original.executor || row.original.script || '-')])
  },
  {
    accessorKey: 'createdAt',
    header: t('pages.settings.cron.table.createdAt'),
    meta: {
      class: {
        th: 'hidden 2xl:table-cell',
        td: 'hidden 2xl:table-cell'
      }
    },
    cell: ({ row }) => (row.original.createdAt ? h(Datetime, { date: row.original.createdAt }) : h('span', { class: 'text-muted text-sm' }, '-'))
  },
  {
    accessorKey: 'status',
    header: t('pages.settings.cron.table.status'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UBadge, { color: row.original.status === 'Enable' ? 'success' : 'neutral', variant: 'soft' }, () => row.original.status),
        h(resolveComponent('USwitch'), {
          modelValue: row.original.status === 'Enable',
          'onUpdate:modelValue': (value: boolean) => {
            void handleToggleStatus(row.original, value);
          }
        })
      ])
  },
  {
    id: 'actions',
    header: t('pages.settings.cron.table.actions'),
    cell: ({ row }) =>
      h('div', { class: 'flex flex-wrap items-center justify-end gap-1.5' }, [
        h(UButton, { color: 'neutral', variant: 'ghost', size: 'xs', icon: 'i-lucide:play', onClick: () => handleRunCronjob(row.original) }, () => t('pages.settings.cron.actions.run')),
        h(UButton, { color: 'neutral', variant: 'ghost', size: 'xs', icon: 'i-lucide:square', onClick: () => handleStopCronjob(row.original) }, () => t('pages.settings.cron.actions.stop')),
        h(UButton, { color: 'neutral', variant: 'ghost', size: 'xs', icon: 'i-lucide:history', onClick: () => handleOpenRecords(row.original) }, () => t('pages.settings.cron.actions.records')),
        h(
          UPopover,
          { arrow: true, content: { side: 'left', align: 'start' } },
          {
            default: () => h(UButton, { color: 'error', variant: 'ghost', size: 'xs', icon: 'i-lucide:trash-2' }, () => t('pages.settings.cron.actions.delete')),
            content: () =>
              h('div', { class: 'w-56 space-y-3 p-3' }, [
                h('div', { class: 'text-sm text-highlighted font-medium' }, t('pages.settings.cron.delete.title')),
                h('div', { class: 'text-xs text-muted' }, t('pages.settings.cron.delete.description', { name: row.original.name })),
                h('div', { class: 'flex justify-end' }, [h(UButton, { color: 'error', size: 'sm', onClick: () => handleDeleteCronjob(row.original) }, () => t('pages.settings.cron.delete.confirm'))])
              ])
          }
        )
      ])
  }
];

/**
 * 表格：记录列定义
 */
const recordColumns: TableColumn<IPageSettingsCronjobRecord>[] = [
  {
    accessorKey: 'startTime',
    header: t('pages.settings.cron.records.table.startedAt'),
    cell: ({ row }) => h(Datetime, { date: row.original.startTime })
  },
  {
    accessorKey: 'status',
    header: t('pages.settings.cron.records.table.status'),
    cell: ({ row }) => h(UBadge, { color: row.original.status === 'Success' ? 'success' : 'warning', variant: 'soft' }, () => row.original.status)
  },
  {
    accessorKey: 'message',
    header: t('pages.settings.cron.records.table.message'),
    meta: {
      class: {
        th: 'hidden xl:table-cell',
        td: 'hidden xl:table-cell'
      }
    },
    cell: ({ row }) => h('div', { class: 'text-sm text-muted break-all' }, row.original.message || '-')
  },
  {
    accessorKey: 'interval',
    header: t('pages.settings.cron.records.table.interval'),
    cell: ({ row }) => h('div', { class: 'text-sm text-highlighted' }, t('pages.settings.cron.records.table.intervalValue', { value: row.original.interval }))
  },
  {
    id: 'actions',
    header: t('pages.settings.cron.records.table.actions'),
    cell: ({ row }) => h(UButton, { color: 'neutral', variant: 'ghost', size: 'xs', icon: 'i-lucide:file-text', onClick: () => handleOpenLog(row.original) }, () => t('pages.settings.cron.actions.viewLog'))
  }
];

onMounted(async () => {
  await handleRefreshCronjobs();
});

watch(
  () => route.query,
  () => {
    void handleRefreshCronjobs();
  }
);

watch(stateRefreshNonce, () => {
  void handleRefreshCronjobs();
});

watch(stateSyncNonce, async () => {
  await handleHotsearchSync();
});
</script>
