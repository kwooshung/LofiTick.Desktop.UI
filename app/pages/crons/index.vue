<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-3">
      <div v-if="computedOnepanelConfigured" class="flex flex-wrap items-center gap-2">
        <UButton color="primary" size="sm" icon="i-lucide:plus" @click="handleOpenCreate">{{ t('pages.settings.cron.actions.create') }}</UButton>
        <UButton color="neutral" variant="outline" size="sm" :disabled="computedSelectedCount === 0" @click="handleBatchChangeStatus('Enable')">{{ t('pages.settings.cron.actions.enableSelected') }}</UButton>
        <UButton color="neutral" variant="outline" size="sm" :disabled="computedSelectedCount === 0" @click="handleBatchChangeStatus('Disable')">{{ t('pages.settings.cron.actions.disableSelected') }}</UButton>
        <UButton color="neutral" variant="outline" size="sm" :disabled="computedSelectedCount === 0" @click="handleBatchStop">{{ t('pages.settings.cron.actions.stopSelected') }}</UButton>
        <UButton color="error" variant="outline" size="sm" :disabled="computedSelectedCount === 0" @click="handleBatchDelete">{{ t('pages.settings.cron.actions.deleteSelected') }}</UButton>
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
      <div class="border-default mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div class="text-muted flex flex-wrap items-center gap-3 text-sm">
          <div>{{ t('components.pagination.total', { total: stateCronjobsTotal }) }}</div>
          <div>{{ t('pages.settings.cron.footer.selected', { total: computedSelectedCount }) }}</div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <USelect v-model="statePageSize" :items="pageSizeItems" class="w-24" />
          <component :is="UPagination" v-model:page="statePage" show-edges :items-per-page="computedItemsPerPage" :total="stateCronjobsTotal" />
        </div>
      </div>
    </div>

    <UModal v-model:open="stateRecordsOpen" :title="stateRecordsTitle" :ui="{ content: 'sm:max-w-5xl', body: 'overflow-auto' }">
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-end">
            <UButton color="neutral" variant="outline" size="sm" icon="i-lucide:eraser" @click="handleCleanRecords">{{ t('pages.settings.cron.records.actions.clean') }}</UButton>
          </div>
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

    <UModal v-model:open="stateOperateOpen" :title="computedOperateTitle" :description="t('pages.settings.cron.operate.description')" :ui="{ content: 'sm:max-w-4xl' }">
      <template #body>
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="text-muted text-sm">{{ t('pages.settings.cron.operate.payloadLabel') }}</div>
            <UButton color="neutral" variant="outline" size="sm" icon="i-lucide:calendar-clock" :loading="stateOperatePreviewing" @click="handlePreviewNextTimes">{{ t('pages.settings.cron.operate.previewNext') }}</UButton>
          </div>
          <UTextarea v-model="stateOperatePayload" :rows="18" autoresize class="w-full font-mono" />
          <div class="space-y-2">
            <div class="text-muted text-sm">{{ t('pages.settings.cron.operate.nextTimes') }}</div>
            <div v-if="stateOperateNextTimes.length > 0" class="flex flex-wrap gap-2">
              <UBadge v-for="item in stateOperateNextTimes" :key="item" color="neutral" variant="soft">{{ item }}</UBadge>
            </div>
            <div v-else class="text-muted text-sm">{{ t('pages.settings.cron.operate.nextEmpty') }}</div>
          </div>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="stateOperateOpen = false">{{ t('common.actions.cancel') }}</UButton>
            <UButton color="primary" :loading="stateOperateSaving" @click="handleSubmitOperate">{{ t('pages.settings.cron.operate.save') }}</UButton>
          </div>
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
 * 组件：复选框
 */
const UCheckbox = resolveComponent('UCheckbox');

/**
 * 组件：徽标
 */
const UBadge = resolveComponent('UBadge');

/**
 * 组件：分页
 */
const UPagination = resolveComponent('UPagination');

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
const { datas, loading, refresh } = await useApi<IPageSettingsCronjobPage>('desktop/crons/service/cronjobs/search', { method: 'POST', immediate: false });
const { refresh: refreshCronjobStatus } = await useApi<Record<string, never>>('desktop/crons/service/cronjobs/status', { method: 'POST', immediate: false });
const { refresh: refreshCronjobHandle } = await useApi<Record<string, never>>('desktop/crons/service/cronjobs/handle', { method: 'POST', immediate: false });
const { refresh: refreshCronjobStop } = await useApi<Record<string, never>>('desktop/crons/service/cronjobs/stop', { method: 'POST', immediate: false });
const { refresh: refreshCronjobDelete } = await useApi<Record<string, never>>('desktop/crons/service/cronjobs/del', { method: 'POST', immediate: false });
const { refresh: refreshCronjobCreate } = await useApi<Record<string, unknown>>('desktop/crons/service/cronjobs/create', { method: 'POST', immediate: false });
const { refresh: refreshCronjobUpdate } = await useApi<Record<string, unknown>>('desktop/crons/service/cronjobs/update', { method: 'POST', immediate: false });
const { datas: stateCronjobLoadInfoDatas, refresh: refreshCronjobLoadInfo } = await useApi<Record<string, unknown>>('desktop/crons/service/cronjobs/load/info', { method: 'POST', immediate: false });
const { datas: stateCronjobNextDatas, refresh: refreshCronjobNext } = await useApi<string[]>('desktop/crons/service/cronjobs/next', { method: 'POST', immediate: false });
const { datas: stateRecordDatas, refresh: refreshCronjobRecords } = await useApi<IPageSettingsCronjobRecordPage>('desktop/crons/service/cronjobs/search/records', { method: 'POST', immediate: false });
const { datas: stateLogDatas, refresh: refreshCronjobLog } = await useApi<IPageSettingsCronjobRecordLog>('desktop/crons/service/cronjobs/records/log', { method: 'POST', immediate: false });
const { refresh: refreshCronjobRecordsClean } = await useApi<Record<string, never>>('desktop/crons/service/cronjobs/records/clean', { method: 'POST', immediate: false });
const { datas: stateHotsearchStatusDatas, refresh: refreshHotsearchStatus } = await useApi<IPageSettingsHotsearchCronStatus>('desktop/crons/service/hotsearch/status', { immediate: false });
const { refresh: refreshHotsearchSync } = await useApi<IPageSettingsHotsearchCronStatus>('desktop/crons/service/hotsearch/sync', { method: 'POST', immediate: false });

/**
 * 状态：1Panel 是否已完成配置
 */
const stateOnepanelConfigured = useState('crons-onepanel-configured', () => false);

/**
 * 状态：cron 列表
 */
const stateCronjobs = ref<IPageSettingsCronjobInfo[]>([]);

/**
 * 状态：cron 总数
 */
const stateCronjobsTotal = ref(0);

/**
 * 状态：当前页码
 */
const statePage = ref(1);

/**
 * 状态：每页条数
 */
const statePageSize = ref('20');

/**
 * 状态：已选任务 ID 列表
 */
const stateSelectedCronjobIds = ref<number[]>([]);

/**
 * 状态：创建/编辑面板开关
 */
const stateOperateOpen = ref(false);

/**
 * 状态：创建/编辑模式
 */
const stateOperateMode = ref<'create' | 'edit'>('create');

/**
 * 状态：创建/编辑 JSON 载荷
 */
const stateOperatePayload = ref('');

/**
 * 状态：创建/编辑保存中
 */
const stateOperateSaving = ref(false);

/**
 * 状态：下一次执行时间预览中
 */
const stateOperatePreviewing = ref(false);

/**
 * 状态：下一次执行时间预览
 */
const stateOperateNextTimes = ref<string[]>([]);

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
 * 状态：当前记录所属任务 ID
 */
const stateRecordsCronjobId = ref<number | null>(null);

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
 * 常量：分页条数选项
 */
const pageSizeItems = ['10', '20', '50', '100'];

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
    to: localePath('/crons/service')
  }
];

/**
 * 计算属性：当前每页条数
 */
const computedItemsPerPage = computed(() => Number(statePageSize.value || '20'));

/**
 * 计算属性：是否已全选当前页
 */
const computedAllSelected = computed(() => stateCronjobs.value.length > 0 && stateCronjobs.value.every((item) => stateSelectedCronjobIds.value.includes(item.id)));

/**
 * 计算属性：已选任务数量
 */
const computedSelectedCount = computed(() => stateSelectedCronjobIds.value.length);

/**
 * 计算属性：创建/编辑标题
 */
const computedOperateTitle = computed(() => (stateOperateMode.value === 'create' ? t('pages.settings.cron.operate.createTitle') : t('pages.settings.cron.operate.editTitle')));

/**
 * 计算属性：1Panel 是否已完成配置
 */
const computedOnepanelConfigured = computed(() => stateOnepanelConfigured.value);

/**
 * 函数：加载 cron 列表
 */
const loadCronjobs = async (): Promise<void> => {
  if (!computedOnepanelConfigured.value) {
    stateCronjobs.value = [];
    stateCronjobsTotal.value = 0;
    stateSelectedCronjobIds.value = [];
    return;
  }

  await refresh({
    body: {
      info: '',
      page: statePage.value,
      pageSize: computedItemsPerPage.value,
      groupIds: [],
      orderBy: 'createdAt',
      order: 'descending'
    }
  });

  stateCronjobs.value = Array.isArray(datas.value?.items) ? datas.value.items : [];
  stateCronjobsTotal.value = Number(datas.value?.total ?? 0);
  stateSelectedCronjobIds.value = [];
};

/**
 * 函数：加载热搜状态
 */
const loadHotsearchStatus = async (): Promise<void> => {
  await refreshHotsearchStatus();
  stateOnepanelConfigured.value = Boolean(stateHotsearchStatusDatas.value?.configured);
};

/**
 * 事件：自动同步热搜 cron
 */
const handleAutoSyncHotsearch = async (): Promise<void> => {
  if (stateHotsearchSyncing.value) {
    return;
  }

  if (!computedOnepanelConfigured.value) {
    return;
  }

  stateHotsearchSyncing.value = true;
  try {
    await refreshHotsearchSync();
    await loadHotsearchStatus();
  } finally {
    stateHotsearchSyncing.value = false;
  }
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
 * 事件：批量切换任务状态
 * @param {'Enable' | 'Disable'} status 目标状态
 */
const handleBatchChangeStatus = async (status: 'Enable' | 'Disable'): Promise<void> => {
  for (const id of stateSelectedCronjobIds.value) {
    await refreshCronjobStatus({ body: { id, status } });
  }

  await handleRefreshCronjobs();
};

/**
 * 事件：批量停止任务
 */
const handleBatchStop = async (): Promise<void> => {
  for (const id of stateSelectedCronjobIds.value) {
    await refreshCronjobStop({ body: { id } });
  }

  await handleRefreshCronjobs();
};

/**
 * 事件：批量删除任务
 */
const handleBatchDelete = async (): Promise<void> => {
  if (stateSelectedCronjobIds.value.length === 0) {
    return;
  }

  await refreshCronjobDelete({
    body: {
      ids: stateSelectedCronjobIds.value,
      cleanData: false,
      cleanRemoteData: false
    }
  });

  await handleRefreshCronjobs();
};

/**
 * 函数：生成默认任务 JSON
 */
const defaultCronjobPayload = (): Record<string, unknown> => ({
  name: '',
  type: 'shell',
  groupID: 0,
  specCustom: false,
  spec: '@every 60s',
  specs: ['@every 60s'],
  specObjs: [],
  executor: '/bin/bash',
  scriptMode: 'script',
  script: '',
  command: '',
  containerName: '',
  user: '',
  scriptID: 0,
  appID: '',
  website: '',
  exclusionRules: '',
  dbType: '',
  dbName: '',
  url: '',
  isDir: false,
  sourceDir: '',
  snapshotRule: {
    withImage: false,
    ignoreAppIDs: []
  },
  sourceAccountIDs: '',
  downloadAccountID: 0,
  retainCopies: 7,
  retryTimes: 3,
  timeout: 3600,
  ignoreErr: false,
  secret: '',
  alertCount: 0,
  alertTitle: '',
  alertMethod: '',
  scopes: [],
  args: ''
});

/**
 * 事件：打开新建面板
 */
const handleOpenCreate = (): void => {
  stateOperateMode.value = 'create';
  stateOperatePayload.value = JSON.stringify(defaultCronjobPayload(), null, 2);
  stateOperateNextTimes.value = [];
  stateOperateOpen.value = true;
};

/**
 * 事件：打开编辑面板
 * @param {IPageSettingsCronjobInfo} item 任务信息
 */
const handleOpenEdit = async (item: IPageSettingsCronjobInfo): Promise<void> => {
  stateOperateMode.value = 'edit';
  await refreshCronjobLoadInfo({ body: { id: item.id } });
  stateOperatePayload.value = JSON.stringify(stateCronjobLoadInfoDatas.value || {}, null, 2);
  stateOperateNextTimes.value = [];
  stateOperateOpen.value = true;
};

/**
 * 事件：预览下一次执行时间
 */
const handlePreviewNextTimes = async (): Promise<void> => {
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(stateOperatePayload.value) as Record<string, unknown>;
  } catch {
    return;
  }

  const spec = String(parsed.spec || '').trim();
  if (!spec) {
    stateOperateNextTimes.value = [];
    return;
  }

  stateOperatePreviewing.value = true;
  try {
    await refreshCronjobNext({ body: { spec } });
    stateOperateNextTimes.value = Array.isArray(stateCronjobNextDatas.value) ? stateCronjobNextDatas.value.map((item) => String(item)) : [];
  } finally {
    stateOperatePreviewing.value = false;
  }
};

/**
 * 事件：提交创建/编辑
 */
const handleSubmitOperate = async (): Promise<void> => {
  if (stateOperateSaving.value) {
    return;
  }

  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(stateOperatePayload.value) as Record<string, unknown>;
  } catch {
    return;
  }

  stateOperateSaving.value = true;
  try {
    if (stateOperateMode.value === 'create') {
      await refreshCronjobCreate({ body: parsed });
    } else {
      await refreshCronjobUpdate({ body: parsed });
    }

    stateOperateOpen.value = false;
    await handleRefreshCronjobs();
  } finally {
    stateOperateSaving.value = false;
  }
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
  stateRecordsCronjobId.value = item.id;
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
 * 事件：清理当前任务的执行记录
 */
const handleCleanRecords = async (): Promise<void> => {
  if (stateRecordsCronjobId.value === null) {
    return;
  }

  await refreshCronjobRecordsClean({
    body: {
      cronjobID: stateRecordsCronjobId.value,
      cleanData: false,
      cleanRemoteData: false,
      isDelete: false
    }
  });

  await refreshCronjobRecords({
    body: {
      page: 1,
      pageSize: 50,
      cronjobId: stateRecordsCronjobId.value,
      status: ''
    }
  });

  stateRecords.value = Array.isArray(stateRecordDatas.value?.items) ? stateRecordDatas.value.items : [];
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
 * 事件：切换当前页全选
 * @param {boolean} value 是否全选
 */
const handleToggleSelectAll = (value: boolean): void => {
  stateSelectedCronjobIds.value = value ? stateCronjobs.value.map((item) => item.id) : [];
};

/**
 * 事件：切换单条任务选中状态
 * @param {number} id 任务 ID
 * @param {boolean} value 是否选中
 */
const handleToggleSelect = (id: number, value: boolean): void => {
  if (value) {
    if (!stateSelectedCronjobIds.value.includes(id)) {
      stateSelectedCronjobIds.value = [...stateSelectedCronjobIds.value, id];
    }

    return;
  }

  stateSelectedCronjobIds.value = stateSelectedCronjobIds.value.filter((item) => item !== id);
};

/**
 * 表格：cron 列定义
 */
const columns: TableColumn<IPageSettingsCronjobInfo>[] = [
  {
    id: 'select',
    header: () =>
      h(UCheckbox, {
        modelValue: computedAllSelected.value,
        'onUpdate:modelValue': (value: boolean) => {
          handleToggleSelectAll(value);
        }
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: stateSelectedCronjobIds.value.includes(row.original.id),
        'onUpdate:modelValue': (value: boolean) => {
          handleToggleSelect(row.original.id, value);
        }
      })
  },
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
        h(UButton, { color: 'neutral', variant: 'ghost', size: 'xs', icon: 'i-lucide:pencil', onClick: () => handleOpenEdit(row.original) }, () => t('pages.settings.cron.actions.edit')),
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
  await loadHotsearchStatus();
  await handleAutoSyncHotsearch();
  await loadCronjobs();
});

watch(statePage, () => {
  void loadCronjobs();
});

watch(statePageSize, () => {
  statePage.value = 1;
  void loadCronjobs();
});
</script>
