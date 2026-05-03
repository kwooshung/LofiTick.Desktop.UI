<template>
  <div>
    <UPageCard variant="naked" :ui="{ root: 'mb-4', header: 'mb-0 flex w-full items-start gap-3' }">
      <template #header>
        <div class="flex-1">
          <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.sentinel.logs.title') }}</div>
          <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.sentinel.logs.description') }}</div>
        </div>
        <div class="flex shrink-0 flex-col items-end gap-2">
          <UButton color="primary" variant="soft" icon="i-mdi:cloud-refresh-variant-outline" loading-auto @click="handleSentinelLogsRefresh">{{ t('pages.sentinel.logs.actions.refresh') }}</UButton>
          <div class="text-toned flex items-center gap-1.5 text-xs leading-4 whitespace-nowrap">
            <UIcon name="i-lucide:history" class="size-3.5 shrink-0" />
            <span>{{ computedLastRefreshText }}</span>
          </div>
        </div>
      </template>
    </UPageCard>

    <div class="mb-4 grid grid-cols-4 gap-4">
      <UPageCard icon="i-material-symbols:computer-outline-rounded" :title="t('pages.sentinel.logs.stats.machines')" :description="String(computedOverviewStats.machines)" />
      <UPageCard icon="i-lucide:wifi" :title="t('pages.sentinel.logs.stats.online')" :description="String(computedOverviewStats.online)" />
      <UPageCard icon="i-lucide:file-text" :title="t('pages.sentinel.logs.stats.logs')" :description="String(computedOverviewStats.logs)" />
      <UPageCard icon="i-tabler:layout-grid" :title="t('pages.sentinel.logs.stats.scenes')" :description="String(computedOverviewStats.scenes)" />
    </div>

    <div class="mb-10 flex w-full flex-col gap-3">
      <SettingsUnattendedSentinelLogsCards :machines="computedSentinelLogsMachines" :local-machine-code="stateMachineCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPageSettingsUnattendedScenesMachineRedisConfig, IPageSettingsUnattendedSentinelLogsMachineCard, IPageSettingsUnattendedSentinelLogsMachineGroup } from '@@/shared/types/pages/settings/unattended/index.types';

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：dayjs
 */
const dayjs = useDayjs();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置
 */
const { get: settingsGet } = useTauriSettings();

/**
 * 状态：本机机器码
 */
const stateMachineCode = ref('');

/**
 * 状态：页面是否已完成初始化
 */
const stateHydrated = ref(false);

/**
 * 状态：最近一次成功刷新时间
 */
const stateLastRefreshedAt = ref('');

/**
 * 常量：哨兵日志自动刷新间隔（ms）
 */
const SENTINEL_LOGS_REFRESH_INTERVAL_MS = 5000;

/**
 * 变量：哨兵日志刷新锁
 */
let sentinelLogsRefreshing = false;

/**
 * API：场景配置列表（GET）
 * 描述：读取所有机器的场景配置列表，用于补齐日志总览中的机器基础信息。
 */
const { datas: stateScenesMachinesRemote, refresh: refreshScenesMachinesRemoteGet } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig[]>('desktop/settings/unattended/scenes/machines', { immediate: false });

/**
 * API：哨兵日志列表（GET）
 * 描述：按机器分组读取仍有日志的机器列表。
 */
const { datas: stateSentinelLogsMachinesRemote, refresh: refreshSentinelLogsMachinesRemoteGet } = await useApi<IPageSettingsUnattendedSentinelLogsMachineGroup[]>('desktop/settings/unattended/sentinel/logs/machines', { immediate: false });

/**
 * 计算属性：机器日志卡片列表
 * 描述：将日志聚合结果和机器基础信息合并，供日志总览页面复用。
 */
const computedSentinelLogsMachines = computed<IPageSettingsUnattendedSentinelLogsMachineCard[]>(() => {
  const machineMap = new Map((Array.isArray(stateScenesMachinesRemote.value) ? stateScenesMachinesRemote.value : []).map((machine) => [String(machine.machineCode || '').trim(), machine] satisfies [string, IPageSettingsUnattendedScenesMachineRedisConfig]));

  const groups = Array.isArray(stateSentinelLogsMachinesRemote.value) ? stateSentinelLogsMachinesRemote.value : [];
  return groups.reduce<IPageSettingsUnattendedSentinelLogsMachineCard[]>((list, group) => {
    const machineCode = String(group?.machineCode || '').trim();
    if (!machineCode) {
      return list;
    }

    const current = machineMap.get(machineCode);
    const logs = Array.isArray(group?.logs) ? group.logs : [];
    if (logs.length === 0) {
      return list;
    }

    list.push({
      machineName: String(current?.machineName || '').trim(),
      machineRemark: String(current?.machineRemark || '').trim(),
      machineCode,
      online: Boolean(typeof current?.online === 'boolean' ? current.online : machineCode === String(stateMachineCode.value || '').trim()),
      lastSeenAt: String(current?.lastSeenAt || '').trim() || undefined,
      machineLastSeenAt: String(current?.machineLastSeenAt || '').trim() || undefined,
      network: current?.network,
      logs
    } satisfies IPageSettingsUnattendedSentinelLogsMachineCard);

    return list;
  }, []);
});

/**
 * 计算属性：日志总览统计
 * 描述：为总览页顶部提供机器数、在线数、日志数与场景数摘要。
 */
const computedOverviewStats = computed(() => {
  const machines = computedSentinelLogsMachines.value;
  const sceneIds = new Set<string>();

  const logs = machines.reduce((count, machine) => {
    const entries = Array.isArray(machine.logs) ? machine.logs : [];

    for (const entry of entries) {
      const sceneId = String(entry?.sceneId || '').trim();
      if (sceneId) {
        sceneIds.add(sceneId);
      }
    }

    return count + entries.length;
  }, 0);

  return {
    machines: machines.length,
    online: machines.filter((machine) => Boolean(machine.online)).length,
    logs,
    scenes: sceneIds.size
  };
});

/**
 * 计算属性：最近刷新提示文案
 * 描述：总览页在标题区显示最近一次成功拉取日志的时间。
 */
const computedLastRefreshText = computed(() => {
  const value = String(stateLastRefreshedAt.value || '').trim();
  if (!value) {
    return t('pages.sentinel.logs.lastRefreshEmpty');
  }

  const parsed = dayjs(value);
  if (!parsed.isValid()) {
    return t('pages.sentinel.logs.lastRefreshEmpty');
  }

  return t('pages.sentinel.logs.lastRefreshAt', {
    value: parsed.format('YYYY-MM-DD HH:mm:ss')
  });
});

/**
 * 函数：手动刷新哨兵日志总览
 */
const handleSentinelLogsRefresh = async (): Promise<void> => {
  if (sentinelLogsRefreshing) {
    return;
  }

  sentinelLogsRefreshing = true;
  try {
    await Promise.all([refreshScenesMachinesRemoteGet(), refreshSentinelLogsMachinesRemoteGet()]);
    stateLastRefreshedAt.value = new Date().toISOString();
  } catch {
    // ignore
  } finally {
    sentinelLogsRefreshing = false;
  }
};

/**
 * Hook：哨兵日志自动刷新
 * 描述：页面存活期间自动刷新日志总览，同时保留手动刷新入口。
 */
const { pause: pauseSentinelLogsPolling, resume: resumeSentinelLogsPolling } = useIntervalFn(
  () => {
    if (!stateHydrated.value || !isTauriRuntime.value) {
      return;
    }

    void handleSentinelLogsRefresh();
  },
  SENTINEL_LOGS_REFRESH_INTERVAL_MS,
  { immediate: false, immediateCallback: false }
);

/**
 * 生命周期：组件挂载
 */
onMounted(async () => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }

  try {
    const settings = await settingsGet();
    const machine = settings && typeof settings === 'object' && !Array.isArray(settings) && settings.machine && typeof settings.machine === 'object' && !Array.isArray(settings.machine) ? (settings.machine as Record<string, unknown>) : {};
    stateMachineCode.value = String(machine.code || '').trim();
  } catch {
    // ignore
  }

  stateHydrated.value = true;
  await handleSentinelLogsRefresh();
  resumeSentinelLogsPolling();
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  pauseSentinelLogsPolling();
});
</script>
