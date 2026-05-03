<template>
  <DashboardPage>
    <DefineAnalysisDurationPopoverContent v-slot="{ analysis }">
      <div class="space-y-3">
        <div class="text-highlighted text-sm font-semibold">{{ t('pages.settings.unattended.analysis.title') }}</div>
        <div v-if="analysis" class="space-y-2 text-sm">
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.crashDecision') }}</span>
            <span class="text-highlighted">{{ analysis.crashDecisionDuration }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.restartDelay') }}</span>
            <span class="text-highlighted">{{ analysis.restartDelayDuration }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.restartCooldown') }}</span>
            <span class="text-highlighted">{{ analysis.restartCooldownDuration }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.restartEpisodeWorst') }}</span>
            <span class="text-highlighted">{{ analysis.restartEpisodeWorstDuration }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.restartEpisodeWithCooldownWorst') }}</span>
            <span class="text-highlighted">{{ analysis.restartEpisodeWithCooldownWorstDuration }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.burstWorst') }}</span>
            <span class="text-highlighted">{{ analysis.burstWorstDuration }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.burstCooldown') }}</span>
            <span class="text-highlighted">{{ analysis.burstCooldownDuration }}</span>
          </div>
          <div class="border-default flex items-center justify-between gap-4 border-t pt-2">
            <span class="text-muted">{{ t('pages.settings.unattended.analysis.fields.worstTotal') }}</span>
            <span class="text-highlighted font-semibold">{{ analysis.worstTotalDuration }}</span>
          </div>
        </div>
        <UEmpty
          v-else
          :title="t('pages.settings.unattended.analysis.empty')"
          variant="naked"
          size="xs"
          :ui="{
            root: 'p-0 items-start justify-start',
            header: 'items-start text-left max-w-none',
            body: 'items-start max-w-none'
          }"
        />
      </div>
    </DefineAnalysisDurationPopoverContent>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center' }">
      <template #header>
        <div class="flex-1">
          <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.unattended.title') }}</div>
          <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.unattended.header.description') }}</div>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-10', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.unattended.form.enabled.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <span class="mb-1 block">
            {{ t('pages.settings.unattended.form.enabled.line1.prefix') }}
            <UBadge color="error" variant="soft" class="mr-1">{{ t('pages.settings.unattended.form.enabled.badges.force') }}</UBadge>
            <UBadge color="error" variant="soft" class="mr-1">{{ t('pages.settings.unattended.form.enabled.badges.preventSystemSleep') }}</UBadge>
            <UBadge color="error" variant="soft">{{ t('pages.settings.unattended.form.enabled.badges.enableStartup') }}</UBadge>
            {{ t('pages.settings.unattended.form.enabled.line1.middle') }}
            <UBadge variant="soft">{{ t('pages.settings.unattended.form.enabled.badges.restoreOnClose') }}</UBadge>
          </span>
          <span class="mb-1 block">
            {{ t('pages.settings.unattended.form.enabled.line2.prefix') }}
            <UBadge variant="soft">{{ t('pages.settings.unattended.title') }}</UBadge>
            {{ t('pages.settings.unattended.form.enabled.line2.middle') }}
            <UBadge variant="soft">{{ t('pages.settings.unattended.title') }}</UBadge>
            {{ t('pages.settings.unattended.form.enabled.line2.suffix') }}
          </span>
        </template>
        <USwitch :model-value="stateUnattendedEnabled" :loading="stateUnattendedEnabledSaving" @update:model-value="handleUnattendedEnabledToggle" />
      </UFormField>
      <UFormField :label="t('pages.settings.unattended.form.startBehavior.label')" :description="t('pages.settings.unattended.form.startBehavior.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USelect v-model="stateStartBehaviors" :items="computedStartBehaviors" class="w-100" value-attribute="value" option-attribute="label" />
      </UFormField>
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.unattended.sections.sentinel.title') }}</div>
          <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.unattended.sections.sentinel.description') }}</div>
        </div>
        <UButton color="primary" variant="soft" icon="i-mdi:cloud-refresh-variant-outline" loading-auto @click="handleSentinelSync">{{ t('pages.settings.unattended.sections.sentinel.actions.sync') }}</UButton>
        <UButton color="primary" variant="soft" icon="i-mdi:reload" loading-auto @click="handleSentinelResetToDefaults">{{ t('pages.settings.unattended.sections.sentinel.actions.reset') }}</UButton>
        <UPopover arrow :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'p-4 w-80' }">
          <UButton color="primary" variant="outline" icon="i-lucide:calculator">{{ t('pages.settings.unattended.analysis.button') }}</UButton>

          <template #content>
            <ReuseAnalysisDurationPopoverContent :analysis="computedSentinelAnalysis" />
          </template>
        </UPopover>
      </template>
    </UPageCard>
    <UPageCard variant="outline" :ui="{ root: 'mb-10', container: 'divide-y divide-default' }">
      <SentinelConfig ref="refSentinelConfig" @analysis-change="handleSentinelConfigChanged" />
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3', body: 'pb-15', footer: 'absolute bottom-0 w-full' }">
      <template #header>
        <div class="flex-1">
          <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.unattended.sections.scenes.title') }}</div>
          <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.unattended.sections.scenes.description') }}</div>
        </div>
        <div class="flex items-end gap-2">
          <div class="inline-flex shrink-0 items-center self-center">
            <label for="scenesOnlineWindowSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.unattended.sections.scenes.form.onlineWindow.short') }}</label>
            <div class="border-accented focus-within:border-primary relative flex h-8 w-28 items-center border transition-colors duration-300">
              <UInputNumber
                id="scenesOnlineWindowSeconds"
                v-model="stateOnlineWindowSeconds"
                class="h-8 w-full"
                orientation="vertical"
                :min="ONLINE_WINDOW_SECONDS_MIN"
                :max="ONLINE_WINDOW_SECONDS_MAX"
                variant="none"
                :increment="{ color: 'neutral', variant: 'soft' }"
                :decrement="{ color: 'neutral', variant: 'soft' }"
              />
            </div>
            <label for="scenesOnlineWindowSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.unattended.sections.scenes.form.onlineWindow.unit') }}</label>
          </div>
          <UButton color="primary" variant="soft" icon="i-mdi:compare-horizontal" loading-auto @click="handleScenesSyncOpen">{{ t('components.sentinel.scenes.sync.actions.open') }}</UButton>
        </div>
      </template>
    </UPageCard>
    <div class="mb-10 flex w-full flex-col gap-3">
      <SettingsUnattendedScenesCards
        :machines="computedScenesMachines"
        :local-machine-code="stateMachineCode"
        @add="handleScenesAddOpen"
        @toggle-enabled="(payload) => handleScenesItemToggleEnabled(payload.id, payload.enabled)"
        @update-machine-remark="handleScenesMachineRemarkUpdate"
        @delete-machine="handleScenesMachineDelete"
        @edit="handleScenesEditOpen"
        @delete="handleScenesItemDelete"
      />
    </div>

    <UDrawer v-model:open="stateScenesDrawerOpen" :ui="{ overlay: 'z-50', content: 'z-50', body: 'relative mx-auto w-5/6', footer: 'border-default border-t shadow-[0_-2px_4px_rgba(0,0,0,0.01)] bg-default' }">
      <template #body>
        <UPageCard variant="ghost" :ui="{ container: 'px-0!' }">
          <SentinelScenes
            ref="refScenes"
            form-id="sentinelScenesEditorForm"
            :machine-id="stateMachineCode"
            :machine-name="computedMachineName"
            :machine-remark="computedMachineRemark"
            :local-machine-id="stateMachineCode"
            @execpath-pick="handleScenesPickExecPath"
            @submit="handleScenesSubmit"
            @validate="handleScenesValidate"
          />
        </UPageCard>
      </template>

      <template #footer>
        <div class="mx-auto flex h-12 w-5/6 items-center justify-end gap-2">
          <UButton type="button" color="neutral" variant="outline" @click="stateScenesDrawerOpen = false">{{ t('common.actions.cancel') }}</UButton>
          <UButton type="button" icon="i-lucide-save" color="primary" :disabled="!stateScenesFormValid" @click="handleScenesFooterSave">{{ t('common.actions.save') }}</UButton>
        </div>
      </template>
    </UDrawer>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { UnlistenFn } from '@tauri-apps/api/event';

import type { ISentinelConfigAnalysis, ISentinelConfigExpose } from '@/components/sentinel/config/index.types';
import type { ISentinelScenesConfigExpose, TSentinelScenesConfigValidateResult, TSentinelScenesConfigValues } from '@/components/sentinel/scenes/index.types';
import type { ISentinelStatusPayload } from '@/composables/tauri/sentinel/index';
import type {
  IPageSettingsUnattendedMachineNetworkGroups,
  IPageSettingsUnattendedMachineNetworkSnapshot,
  IPageSettingsUnattendedScenesItem,
  IPageSettingsUnattendedScenesMachineBasic,
  IPageSettingsUnattendedScenesMachineRedisConfig,
  ISettingsUnattended,
  ISettingsUnattendedScenesLocal,
  ISettingsUnattendedSentinel,
  ISettingsUnattendedSentinelRequest,
  TPageSettingsUnattendedMachineNetwork,
  TUnattendedStartBehavior
} from '@@/shared/types/pages/settings/unattended/index.types';

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Toast：消息提示
 */
const toast = useToast();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 哨兵
 */
const { statusGet: sentinelStatusGet, onStatusChange: onSentinelStatusChange } = useTauriSentinel();

/**
 * Hook：Tauri 设置
 */
const { get: settingsGet, update: settingsUpdate, machineNetworkGet, machineHostnameGet, pathsExistGet } = useTauriSettings();

/**
 * Hook：场景同步弹窗
 */
const { request: unattendedScenesSyncRequest } = useUnattendedScenesSyncDialog();

/**
 * Hook：Tauri 窗口能力
 */
const { openFile } = useTauriWindow();
const { sceneManagedExeMaterialize, sceneManagedExeRemove } = useTauriSettings();

/**
 * 模板：分析时长 Popover 内容（可复用）
 */
const [DefineAnalysisDurationPopoverContent, ReuseAnalysisDurationPopoverContent] = createReusableTemplate<{ analysis: ISentinelConfigAnalysis | null }>();
/**
 * 计算属性：启动行为选项
 */
const computedStartBehaviors = computed((): Array<{ label: string; value: TUnattendedStartBehavior }> => {
  return [
    { label: t('pages.settings.unattended.form.startBehavior.options.normal'), value: 'normal' },
    { label: t('pages.settings.unattended.form.startBehavior.options.minimize'), value: 'minimize' },
    { label: t('pages.settings.unattended.form.startBehavior.options.minimizeToTray'), value: 'minimize-to-tray' }
  ];
});

/**
 * 状态：无人值守是否启用
 */
const stateUnattendedEnabled = ref(false);

/**
 * 状态：无人值守是否启用保存中
 */
const stateUnattendedEnabledSaving = ref(false);

/**
 * 状态：启动行为（unattended.start.behaviors）
 */
const stateStartBehaviors = ref<TUnattendedStartBehavior>('normal');

/**
 * 状态：机器名称默认值（用于空值回退）
 */
const stateMachineNameDefault = ref('');

/**
 * 计算属性：机器名称
 * 描述：用于场景列表与上报，来源为本机计算机名（不写入 settings）。
 */
const computedMachineName = computed((): string => String(stateMachineNameDefault.value || '').trim());

/**
 * 计算属性：本机机器备注
 */
const computedMachineRemark = computed((): string => String(stateScenesRemote.value?.machineRemark || '').trim());

/**
 * 状态：机器代码（settings.machine.code）
 */
const stateMachineCode = ref('');

/**
 * 状态：机器指纹（settings.machine.fingerprint）
 */
/**
 * 状态：本机网络快照（兜底，用于 Redis 中暂无本机记录时展示）
 */
const stateLocalNetworkSnapshot = ref<IPageSettingsUnattendedMachineNetworkSnapshot | null>(null);

/**
 * 状态：页面打开后是否已上报本机网络
 */
const stateLocalNetworkReportedOnce = ref(false);

/**
 * 工具：网络快照转为分组结构
 * @param {IPageSettingsUnattendedMachineNetworkSnapshot | null} snapshot 网络快照
 * @returns {IPageSettingsUnattendedMachineNetworkGroups} 分组结构
 */
const networkSnapshotToGroups = (snapshot: IPageSettingsUnattendedMachineNetworkSnapshot | null): IPageSettingsUnattendedMachineNetworkGroups => {
  const interfaces = Array.isArray(snapshot?.interfaces) ? snapshot!.interfaces : [];
  const groups = interfaces
    .map((iface) => {
      const name = String(iface?.name ?? '').trim() || '-';
      const ips = Array.isArray(iface?.ips) ? iface.ips : [];

      const cleaned = ips.map((i) => String(i ?? '').trim()).filter((i) => i !== '');

      const ipv4 = Array.from(new Set(cleaned.filter((i) => i.includes('.') && !i.includes(':'))));
      const ipv6 = Array.from(new Set(cleaned.filter((i) => i.includes(':'))));

      return { name, ipv4, ipv6 };
    })
    .filter((g) => g.ipv4.length > 0 || g.ipv6.length > 0);

  return { groups };
};

/**
 * 工具：任意 network 结构归一化为分组结构
 * @param {TPageSettingsUnattendedMachineNetwork | null | undefined} network network
 * @returns {IPageSettingsUnattendedMachineNetworkGroups} 分组结构
 */
const networkNormalizeToGroups = (network: TPageSettingsUnattendedMachineNetwork | null | undefined): IPageSettingsUnattendedMachineNetworkGroups => {
  const src = network && typeof network === 'object' && !Array.isArray(network) ? (network as unknown as Record<string, unknown>) : null;
  if (!src) {
    return { groups: [] };
  }

  const groups = src.groups;
  if (Array.isArray(groups)) {
    return { groups: groups as IPageSettingsUnattendedMachineNetworkGroups['groups'] };
  }

  const interfaces = src.interfaces;
  if (Array.isArray(interfaces)) {
    return networkSnapshotToGroups({ interfaces: interfaces as IPageSettingsUnattendedMachineNetworkSnapshot['interfaces'] });
  }

  return { groups: [] };
};

/**
 * 工具：构建 network 指纹（用于对比是否变化）
 * @param {IPageSettingsUnattendedMachineNetworkGroups} groups 分组
 * @returns {string} 指纹
 */
const networkGroupsFingerprint = (groups: IPageSettingsUnattendedMachineNetworkGroups): string => {
  const list = Array.isArray(groups?.groups) ? groups.groups : [];
  const normalized = list
    .map((g) => {
      const rec = toRecord(g) ?? {};
      const name = String(rec.name ?? '').trim();
      const rawIpv4 = Array.isArray(rec.ipv4) ? rec.ipv4 : [];
      const rawIpv6 = Array.isArray(rec.ipv6) ? rec.ipv6 : [];

      const ipv4 = rawIpv4.map((i) => String(i ?? '').trim()).filter((i) => i !== '');
      const ipv6 = rawIpv6.map((i) => String(i ?? '').trim()).filter((i) => i !== '');
      return {
        name,
        ipv4: Array.from(new Set(ipv4)).sort(),
        ipv6: Array.from(new Set(ipv6)).sort()
      };
    })
    .filter((g) => g.name !== '' && (g.ipv4.length > 0 || g.ipv6.length > 0))
    .sort((a, b) => a.name.localeCompare(b.name));

  return JSON.stringify(normalized);
};

/**
 * 计算属性：本机网络分组（来自本机快照）
 */
const computedLocalNetworkGroups = computed(() => networkSnapshotToGroups(stateLocalNetworkSnapshot.value));

/**
 * 状态：请求地址（协议 + 主体）
 */
const stateRequestProtocol = ref<'http' | 'https'>('https');
const stateRequestHost = ref('');

/**
 * 状态：在线窗口（秒）
 */
const stateOnlineWindowSeconds = ref(30);

/**
 * 常量：在线窗口最小值（秒）
 */
const ONLINE_WINDOW_SECONDS_MIN = 1;

/**
 * 常量：在线窗口最大值（秒）
 */
const ONLINE_WINDOW_SECONDS_MAX = 600;

/**
 * 计算属性：请求完整 URL
 */
const computedRequestUrl = computed(() => {
  const proto = stateRequestProtocol.value;
  const host = String(stateRequestHost.value || '').trim();
  if (!host) {
    return '';
  }
  return `${proto}://${host.replace(/^https?:\/\//, '')}`;
});

/**
 * 状态：页面配置是否已完成初始化
 */
const stateHydrated = ref(false);

/**
 * 组件：哨兵配置表单实例
 */
const refSentinelConfig = ref<ISentinelConfigExpose | null>(null);

/**
 * 计算属性：哨兵配置分析结果
 */
const computedSentinelAnalysis = computed(() => refSentinelConfig.value?.analysisGet() ?? null);

/**
 * 状态：桌面壳当前哨兵状态快照
 */
const stateSentinelRuntime = ref<ISentinelStatusPayload | null>(null);

/**
 * 变量：取消订阅哨兵状态事件句柄
 */
let unsubscribeSentinelStatus: null | UnlistenFn = null;

/**
 * 计算属性：哨兵状态值
 */
const computedSentinelRuntimeState = computed(() => String(stateSentinelRuntime.value?.status?.state || 'idle').trim());

/**
 * 计算属性：哨兵状态标签
 */
const computedSentinelRuntimeBadgeLabel = computed(() => {
  switch (computedSentinelRuntimeState.value) {
    case 'online':
      return t('pages.settings.unattended.sections.sentinel.runtime.states.online');
    case 'offline':
      return t('pages.settings.unattended.sections.sentinel.runtime.states.offline');
    case 'error':
      return t('pages.settings.unattended.sections.sentinel.runtime.states.error');
    default:
      return t('pages.settings.unattended.sections.sentinel.runtime.states.idle');
  }
});

/**
 * 计算属性：哨兵状态徽标颜色
 */
const computedSentinelRuntimeBadgeColor = computed(() => {
  switch (computedSentinelRuntimeState.value) {
    case 'online':
      return 'primary';
    case 'offline':
      return 'error';
    case 'error':
      return 'warning';
    default:
      return 'neutral';
  }
});

/**
 * 计算属性：哨兵状态徽标图标
 */
const computedSentinelRuntimeBadgeIcon = computed(() => {
  switch (computedSentinelRuntimeState.value) {
    case 'online':
      return 'i-lucide:shield-check';
    case 'offline':
      return 'i-lucide:shield-alert';
    case 'error':
      return 'i-lucide:triangle-alert';
    default:
      return 'i-lucide:shield';
  }
});

/**
 * 计算属性：哨兵状态原因
 */
const computedSentinelRuntimeReason = computed(() => {
  const payload = stateSentinelRuntime.value;
  const reason = String(payload?.status?.reason || '').trim();
  const message = String(payload?.status?.message || '').trim();

  if (message) {
    return message;
  }

  switch (reason) {
    case 'unattended-disabled':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.unattendedDisabled');
    case 'machine-code-missing':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.machineCodeMissing');
    case 'no-enabled-scenes':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.noEnabledScenes');
    case 'heartbeat-missing':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.heartbeatMissing');
    case 'heartbeat-timeout':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.heartbeatTimeout');
    case 'remote-fetch-failed':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.remoteFetchFailed');
    case 'last-seen-invalid':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.lastSeenInvalid');
    case 'settings-unavailable':
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.settingsUnavailable');
    default:
      return t('pages.settings.unattended.sections.sentinel.runtime.reasons.awaitingSnapshot');
  }
});

/**
 * 计算属性：哨兵已启用场景数
 */
const computedSentinelRuntimeEnabledSceneCount = computed(() => {
  const remoteCount = Number(stateSentinelRuntime.value?.attach?.enabledSceneCount ?? NaN);
  if (Number.isFinite(remoteCount)) {
    return remoteCount;
  }

  const items = Array.isArray(stateScenesLocal.value?.items) ? stateScenesLocal.value.items : [];
  return items.filter((item) => Boolean(item?.enabled)).length;
});

/**
 * 计算属性：哨兵在线窗口秒数
 */
const computedSentinelRuntimeOnlineWindowSeconds = computed(() => {
  return onlineWindowSecondsNormalize(stateOnlineWindowSeconds.value);
});

/**
 * 计算属性：最后心跳时间展示
 */
const computedSentinelRuntimeLastSeenAt = computed(() => {
  const raw = String(stateSentinelRuntime.value?.attach?.lastSeenAt || '').trim();
  if (!raw) {
    return '';
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  return parsed.toLocaleString();
});

/**
 * 计算属性：已超时秒数
 */
const computedSentinelRuntimeStaleForSeconds = computed(() => {
  const value = Number(stateSentinelRuntime.value?.attach?.staleForSeconds ?? NaN);
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.trunc(value);
});

/**
 * 计算属性：恢复状态标签
 */
const computedSentinelRecoveryStateLabel = computed(() => {
  const state = String(stateSentinelRuntime.value?.attach?.recoveryState || 'idle').trim();

  switch (state) {
    case 'pending':
      return t('pages.settings.unattended.sections.sentinel.runtime.fields.recoveryPending');
    case 'cooldown':
      return t('pages.settings.unattended.sections.sentinel.runtime.fields.recoveryCooldown');
    case 'stopped':
      return t('pages.settings.unattended.sections.sentinel.runtime.fields.recoveryStopped');
    default:
      return t('pages.settings.unattended.sections.sentinel.runtime.fields.recoveryIdle');
  }
});

/**
 * 计算属性：当前连续重启次数
 */
const computedSentinelRecoveryAttemptsInEpisode = computed(() => {
  const value = Number(stateSentinelRuntime.value?.attach?.recoveryAttemptsInEpisode ?? NaN);
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0;
});

/**
 * 计算属性：当前爆发窗口轮次
 */
const computedSentinelRecoveryEpisodesInBurst = computed(() => {
  const value = Number(stateSentinelRuntime.value?.attach?.recoveryEpisodesInBurst ?? NaN);
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0;
});

/**
 * 计算属性：累计爆发次数
 */
const computedSentinelRecoveryBurstCount = computed(() => {
  const value = Number(stateSentinelRuntime.value?.attach?.recoveryBurstCount ?? NaN);
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0;
});

/**
 * 计算属性：下一次允许尝试重启时间
 */
const computedSentinelRecoveryNextAttemptAt = computed(() => {
  const raw = String(stateSentinelRuntime.value?.attach?.recoveryNextAttemptAt || '').trim();
  if (!raw) {
    return '';
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  return parsed.toLocaleString();
});

/**
 * API：哨兵配置（GET / PATCH）
 * 描述：用于跨设备同步哨兵配置。
 */
const { datas: stateSentinelRemote, refresh: refreshSentinelRemoteGet } = await useApi<ISettingsUnattendedSentinel>('desktop/settings/unattended/sentinel');
const { refresh: refreshSentinelRemotePatch } = await useApi<ISettingsUnattendedSentinel>('desktop/settings/unattended/sentinel', { method: 'PATCH' });

/**
 * API：哨兵请求地址默认值（GET）
 */
const { datas: stateSentinelRequestUrlDefault, refresh: refreshSentinelRequestUrlDefaultGet } = await useApi<ISettingsUnattendedSentinelRequest>('desktop/settings/unattended/sentinel/request-url');

/**
 * API：场景配置（GET / PATCH）
 * 描述：按 machineCode 分组存储，可跨设备快速读取。
 */
const { datas: stateScenesRemoteFetched, refresh: refreshScenesRemoteGet } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { immediate: false });
const { refresh: refreshScenesRemotePatch } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { method: 'PATCH', immediate: false });
const { refresh: refreshScenesRemoteDelete } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { method: 'DELETE', immediate: false });

/**
 * 状态：当前机器的场景详情（本地可写镜像）
 * 描述：用于承接乐观更新与 PATCH 返回值，避免直接写只读 computed datas。
 */
const stateScenesRemote = ref<IPageSettingsUnattendedScenesMachineRedisConfig | undefined>(undefined);

/**
 * 常量：场景在线时间刷新间隔（ms）
 */
const SCENES_REMOTE_REFRESH_INTERVAL_MS = 5000;

/**
 * 状态：本地场景副本
 */
const stateScenesLocal = ref<ISettingsUnattendedScenesLocal>(unattendedScenesLocalStateCreate());

/**
 * 状态：场景同步流程是否进行中
 */
const stateScenesSyncing = ref(false);

/**
 * API：场景配置（GET）
 * 描述：读取所有机器的场景配置列表。
 */
const { datas: stateScenesMachinesRemote, refresh: refreshScenesMachinesRemoteGet } = await useApi<IPageSettingsUnattendedScenesMachineBasic[]>('desktop/settings/unattended/scenes/machines', { immediate: false });

/**
 * 状态：持久化写入是否静音
 * 描述：用于“同步配置 / 恢复默认”等批量更新 UI 时，避免回环触发自动写入。
 */
const statePersistMuted = ref(false);

/**
 * 工具：转为普通对象
 * @param {unknown} input 输入
 * @returns {Record<string,unknown>|null} 对象
 */
const toRecord = (input: unknown): Record<string, unknown> | null => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }
  return input as Record<string, unknown>;
};

/**
 * 监听：GET 场景详情变更时，同步本地可写镜像
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig | undefined} value 最新详情
 */
watch(
  stateScenesRemoteFetched,
  (value) => {
    stateScenesRemote.value = value;
  },
  { immediate: true }
);

/**
 * 工具：转为安全数字
 * @param {unknown} input 输入
 * @param {number} fallback 兜底
 * @returns {number} 数字
 */
const toSafeNumber = (input: unknown, fallback = 0): number => {
  const n = typeof input === 'number' ? input : Number(input);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * 工具：归一化在线窗口秒数
 * @param {unknown} input 输入
 * @returns {number} 在线窗口秒数
 */
const onlineWindowSecondsNormalize = (input: unknown): number => {
  const value = Math.trunc(toSafeNumber(input, 30));
  if (value < ONLINE_WINDOW_SECONDS_MIN) {
    return ONLINE_WINDOW_SECONDS_MIN;
  }
  if (value > ONLINE_WINDOW_SECONDS_MAX) {
    return ONLINE_WINDOW_SECONDS_MAX;
  }

  return value;
};

/**
 * 工具：转为无人值守启动行为
 * @param {unknown} input 输入
 * @returns {TUnattendedStartBehavior} 启动行为
 */
const toUnattendedStartBehavior = (input: unknown): TUnattendedStartBehavior => {
  if (input === 'normal' || input === 'minimize' || input === 'minimize-to-tray') {
    return input;
  }
  return 'normal';
};

/**
 * 工具：裁剪哨兵配置（写入设置前，确保不含任何额外字段）
 * @param {unknown} input 输入对象
 * @returns {ISettingsUnattendedSentinel|null} 裁剪后的配置
 */
const unattendedSentinelPickForPersist = (input: unknown): ISettingsUnattendedSentinel | null => {
  const src = toRecord(input);
  if (!src) {
    return null;
  }

  const request = toRecord(src.request);
  const heartbeat = toRecord(src.heartbeat);
  const restart = toRecord(src.restart);
  const burst = restart ? toRecord(restart.burst) : null;

  return {
    request: {
      url: String(request?.url ?? '')
    },
    onlineWindowSeconds: onlineWindowSecondsNormalize(src.onlineWindowSeconds),
    heartbeat: {
      interval: toSafeNumber(heartbeat?.interval),
      timeoutCount: toSafeNumber(heartbeat?.timeoutCount)
    },
    restart: {
      delay: toSafeNumber(restart?.delay),
      cooldown: toSafeNumber(restart?.cooldown),
      maxAttempts: toSafeNumber(restart?.maxAttempts),
      burst: {
        window: toSafeNumber(burst?.window),
        cooldown: toSafeNumber(burst?.cooldown),
        maxAttempts: toSafeNumber(burst?.maxAttempts)
      }
    }
  };
};

/**
 * 工具：裁剪无人值守配置（写入设置前，确保不含任何额外字段）
 * @param {unknown} input 输入对象
 * @returns {ISettingsUnattended|null} 裁剪后的配置
 */
const unattendedPickForPersist = (input: unknown): ISettingsUnattended | null => {
  const src = toRecord(input);
  if (!src) {
    return null;
  }

  const start = toRecord(src.start);

  const sentinel = unattendedSentinelPickForPersist(src.sentinel);
  if (!sentinel) {
    return null;
  }

  return {
    enabled: Boolean(src.enabled),
    start: {
      up: Boolean(start?.up),
      behaviors: toUnattendedStartBehavior(start?.behaviors)
    },
    sentinel
  };
};

/**
 * 工具：解析 URL 为协议与主体
 * @param {string} url 完整 URL
 * @returns {{protocol:'http'|'https',host:string}} 拆分结果
 */
const requestUrlSplit = (url: string) => {
  const raw = String(url || '').trim();
  if (!raw) {
    return { protocol: 'https' as const, host: '' };
  }

  if (raw.startsWith('http://')) {
    return { protocol: 'http' as const, host: raw.slice('http://'.length) };
  }
  if (raw.startsWith('https://')) {
    return { protocol: 'https' as const, host: raw.slice('https://'.length) };
  }

  return { protocol: 'https' as const, host: raw.replace(/^https?:\/\//, '') };
};

/**
 * 工具：把持久化配置映射为 SentinelConfig overrides
 * @param {ISettingsUnattendedSentinel} settingsConfig 持久化配置
 * @returns {Record<string,unknown>} overrides
 */
const sentinelOverridesFromSettings = (settingsConfig: ISettingsUnattendedSentinel): Record<string, unknown> => {
  return {
    heartbeatInterval: settingsConfig.heartbeat.interval,
    heartbeatTimeoutCount: settingsConfig.heartbeat.timeoutCount,
    restartDelay: settingsConfig.restart.delay,
    restartCooldown: settingsConfig.restart.cooldown,
    restartMaxAttempts: settingsConfig.restart.maxAttempts,
    restartBurstWindow: settingsConfig.restart.burst.window,
    restartBurstCooldown: settingsConfig.restart.burst.cooldown,
    restartBurstMaxAttempts: settingsConfig.restart.burst.maxAttempts
  };
};

/**
 * 工具：从 SentinelConfig 获取 heartbeat/restart patch
 * @param {ISentinelConfigExpose|null} refConfig SentinelConfig 组件实例的 ref
 * @returns {{heartbeat:{interval:number,timeoutCount:number},restart:{delay:number,cooldown:number,maxAttempts:number,burst:{window:number,cooldown:number,maxAttempts:number}}}|null}} heartbeat/restart 配置对象
 */
const heartbeatRestartFromRef = (refConfig: ISentinelConfigExpose | null) => {
  const config = refConfig?.configGet();
  if (!config) {
    return null;
  }

  return {
    heartbeat: {
      interval: config.heartbeatInterval,
      timeoutCount: config.heartbeatTimeoutCount
    },
    restart: {
      delay: config.restartDelay,
      cooldown: config.restartCooldown,
      maxAttempts: config.restartMaxAttempts,
      burst: {
        window: config.restartBurstWindow,
        cooldown: config.restartBurstCooldown,
        maxAttempts: config.restartBurstMaxAttempts
      }
    }
  };
};

/**
 * 生命周期：初始化页面配置
 */
onMounted(async () => {
  if (!import.meta.client) {
    return;
  }

  if (!isTauriRuntime.value) {
    return;
  }

  try {
    unsubscribeSentinelStatus = await onSentinelStatusChange((payload) => {
      stateSentinelRuntime.value = payload;
    });
  } catch (error) {
    console.error('[settings/unattended] sentinel listen failed', error);
  }

  try {
    stateSentinelRuntime.value = await sentinelStatusGet();
  } catch (error) {
    console.error('[settings/unattended] sentinel snapshot failed', error);
  }

  const settings = await settingsGet();

  try {
    stateMachineNameDefault.value = String(await machineHostnameGet()).trim();
  } catch {
    // ignore
  }

  try {
    stateLocalNetworkSnapshot.value = await machineNetworkGet();
  } catch {
    // ignore
  }

  const machine = toRecord(settings.machine) ?? {};
  const unattended = toRecord(settings.unattended) ?? {};
  const unattendedStart = toRecord(unattended.start) ?? {};
  const unattendedSentinel = toRecord(unattended.sentinel) ?? {};
  const unattendedSentinelRequest = toRecord(unattendedSentinel.request) ?? {};

  stateMachineCode.value = String(machine.code || '').trim();
  stateScenesLocal.value = unattendedScenesLocalNormalize(unattended.scenes);

  stateUnattendedEnabled.value = Boolean(unattended.enabled);

  stateStartBehaviors.value = toUnattendedStartBehavior(unattendedStart.behaviors) || stateStartBehaviors.value;
  stateOnlineWindowSeconds.value = onlineWindowSecondsNormalize(unattendedSentinel.onlineWindowSeconds);

  const url = String(unattendedSentinelRequest.url || '');
  const { protocol, host } = requestUrlSplit(url);
  stateRequestProtocol.value = protocol;
  stateRequestHost.value = host;

  let requestUrlFilled = false;

  if (String(host || '').trim() === '') {
    await refreshSentinelRequestUrlDefaultGet();
    const nextUrl = String(stateSentinelRequestUrlDefault.value?.url || '').trim();
    if (nextUrl) {
      const parsed = requestUrlSplit(nextUrl);
      stateRequestProtocol.value = parsed.protocol;
      stateRequestHost.value = parsed.host;
      requestUrlFilled = true;
    }
  }

  await nextTick();

  if (Object.keys(unattendedSentinel).length > 0) {
    refSentinelConfig.value?.resetToOverrides(sentinelOverridesFromSettings(unattendedSentinel as unknown as ISettingsUnattendedSentinel));
  }

  stateHydrated.value = true;

  const machineCode = String(stateMachineCode.value || '').trim();
  if (machineCode) {
    await refreshScenesRemoteGet({ query: { machineCode } });
  }

  await refreshScenesMachinesRemoteGet();

  // 页面打开后：对比本机网络与远端记录，不一致则仅上报一次
  if (!stateLocalNetworkReportedOnce.value) {
    const machineCode = String(stateMachineCode.value || '').trim();
    if (machineCode) {
      const localGroups = computedLocalNetworkGroups.value;
      const remoteGroups = networkNormalizeToGroups((stateScenesRemote.value?.network as TPageSettingsUnattendedMachineNetwork | null | undefined) ?? null);

      const needReport = !stateScenesRemote.value || networkGroupsFingerprint(localGroups) !== networkGroupsFingerprint(remoteGroups);

      if (needReport) {
        stateLocalNetworkReportedOnce.value = true;
        try {
          await refreshScenesRemotePatch({
            query: { machineCode },
            body: {
              datas: {
                machineName: String(computedMachineName.value || '').trim(),
                machineCode,
                network: localGroups
              }
            },
            ignoreResponseError: true
          });
        } catch {
          // ignore
        }

        try {
          await refreshScenesMachinesRemoteGet();
        } catch {
          // ignore
        }
      } else {
        stateLocalNetworkReportedOnce.value = true;
      }
    }
  }

  await handleScenesSyncOpen();
  resumeScenesRemotePolling();

  if (requestUrlFilled) {
    await persistToSettings();
    await persistSentinelToRedis();
  }
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  pauseScenesRemotePolling();

  if (!unsubscribeSentinelStatus) {
    return;
  }

  unsubscribeSentinelStatus();
  unsubscribeSentinelStatus = null;
});

/**
 * 事件：切换无人值守是否启用
 * @param {boolean} next 下一个值
 */
const handleUnattendedEnabledToggle = async (next: boolean): Promise<void> => {
  if (!stateHydrated.value) {
    stateUnattendedEnabled.value = next;
    return;
  }
  if (statePersistMuted.value) {
    stateUnattendedEnabled.value = next;
    return;
  }

  if (stateUnattendedEnabledSaving.value) {
    return;
  }

  const previous = stateUnattendedEnabled.value;
  stateUnattendedEnabled.value = next;

  stateUnattendedEnabledSaving.value = true;
  try {
    await persistToSettings();
  } catch (error) {
    stateUnattendedEnabled.value = previous;
    throw error;
  } finally {
    stateUnattendedEnabledSaving.value = false;
  }
};

/**
 * 工具：从 UI 构建哨兵配置
 * @returns {ISettingsUnattendedSentinel|null} 哨兵配置
 */
const buildSentinelConfigFromUi = (): ISettingsUnattendedSentinel | null => {
  const config = refSentinelConfig.value?.configGet();
  if (!config) {
    return null;
  }

  return {
    request: {
      url: computedRequestUrl.value
    },
    onlineWindowSeconds: onlineWindowSecondsNormalize(stateOnlineWindowSeconds.value),
    heartbeat: {
      interval: config.heartbeatInterval,
      timeoutCount: config.heartbeatTimeoutCount
    },
    restart: {
      delay: config.restartDelay,
      cooldown: config.restartCooldown,
      maxAttempts: config.restartMaxAttempts,
      burst: {
        window: config.restartBurstWindow,
        cooldown: config.restartBurstCooldown,
        maxAttempts: config.restartBurstMaxAttempts
      }
    }
  };
};

/**
 * 工具：从 UI 构建无人值守配置
 * @returns {ISettingsUnattended|null} 无人值守配置
 */
const buildUnattendedConfigFromUi = (): ISettingsUnattended | null => {
  const sentinel = buildSentinelConfigFromUi();
  if (!sentinel) {
    return null;
  }

  return {
    enabled: stateUnattendedEnabled.value,
    start: {
      up: stateUnattendedEnabled.value,
      behaviors: stateStartBehaviors.value
    },
    sentinel
  };
};

/**
 * 工具：从 UI 构建哨兵 Redis 配置（用于写回 Redis）
 * @returns {ISettingsUnattendedSentinel|null} 哨兵配置
 */
const buildSentinelRedisConfigFromUi = (): ISettingsUnattendedSentinel | null => {
  const config = refSentinelConfig.value?.configGet();
  if (!config) {
    return null;
  }

  return {
    request: {
      url: computedRequestUrl.value
    },
    onlineWindowSeconds: onlineWindowSecondsNormalize(stateOnlineWindowSeconds.value),
    heartbeat: {
      interval: config.heartbeatInterval,
      timeoutCount: config.heartbeatTimeoutCount
    },
    restart: {
      delay: config.restartDelay,
      cooldown: config.restartCooldown,
      maxAttempts: config.restartMaxAttempts,
      burst: {
        window: config.restartBurstWindow,
        cooldown: config.restartBurstCooldown,
        maxAttempts: config.restartBurstMaxAttempts
      }
    }
  };
};

/**
 * 函数：写回设置持久化
 */
const persistToSettings = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }

  const unattended = buildUnattendedConfigFromUi();
  const unattendedPersist = unattended ? unattendedPickForPersist(unattended) : null;

  await settingsUpdate({
    ...(unattendedPersist
      ? {
          unattended: {
            ...unattendedPersist
          }
        }
      : {})
  });
};

/**
 * 函数：写回设置持久化（防抖）
 */
const persistToSettingsDebounced = useDebounceFn(() => {
  void persistToSettings();
}, 300);

/**
 * 函数：写回 Redis（哨兵）
 * 描述：用于任意配置变化后动态同步到远程（UI -> Redis）。
 */
const persistSentinelToRedis = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }

  const sentinel = buildSentinelRedisConfigFromUi();
  if (!sentinel) {
    return;
  }

  await refreshSentinelRemotePatch({
    body: {
      datas: sentinel as unknown as Record<string, unknown>
    }
  });
};

/**
 * 函数：写回 Redis（哨兵，防抖）
 */
const persistSentinelToRedisDebounced = useDebounceFn(() => {
  void persistSentinelToRedis();
}, 300);

/**
 * 事件：哨兵表单内部配置变化
 */
const handleSentinelConfigChanged = (): void => {
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }
  persistToSettingsDebounced();
  persistSentinelToRedisDebounced();
};

/**
 * 监听：页面任意配置项变化即写回设置
 */
watch([stateStartBehaviors, stateRequestProtocol, stateRequestHost], () => {
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }
  persistToSettingsDebounced();
});

/**
 * 监听：在线窗口变化时同步写回设置与 Redis
 */
watch(stateOnlineWindowSeconds, (next) => {
  const normalized = onlineWindowSecondsNormalize(next);
  if (normalized !== next) {
    stateOnlineWindowSeconds.value = normalized;
    return;
  }
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }

  persistToSettingsDebounced();
  persistSentinelToRedisDebounced();
});

/**
 * 监听：请求地址变化时同步哨兵配置到 Redis
 */
watch([stateRequestProtocol, stateRequestHost], () => {
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }

  persistToSettingsDebounced();
  persistSentinelToRedisDebounced();
});

/**
 * 事件：同步哨兵配置（Redis -> UI）
 */
const handleSentinelSync = async () => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }

  statePersistMuted.value = true;
  try {
    await refreshSentinelRemoteGet();

    const remote = stateSentinelRemote.value;
    if (!remote) {
      return;
    }

    const currentOnlineWindowSeconds = onlineWindowSecondsNormalize(stateOnlineWindowSeconds.value);
    const { protocol, host } = requestUrlSplit(remote.request?.url || '');
    stateRequestProtocol.value = protocol;
    stateRequestHost.value = host;
    stateOnlineWindowSeconds.value = onlineWindowSecondsNormalize(remote.onlineWindowSeconds ?? currentOnlineWindowSeconds);

    refSentinelConfig.value?.resetToOverrides(sentinelOverridesFromSettings(remote as unknown as ISettingsUnattendedSentinel));

    await nextTick();

    const sentinelPersist = unattendedSentinelPickForPersist({
      ...(remote as unknown as ISettingsUnattendedSentinel),
      onlineWindowSeconds: stateOnlineWindowSeconds.value
    });
    if (!sentinelPersist) {
      return;
    }

    await settingsUpdate({
      unattended: {
        sentinel: sentinelPersist
      }
    });
  } finally {
    statePersistMuted.value = false;
  }

  await persistToSettings();
};

/**
 * 事件：哨兵配置恢复默认（仅 SentinelConfig）
 */
const handleSentinelResetToDefaults = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }

  statePersistMuted.value = true;
  try {
    stateOnlineWindowSeconds.value = onlineWindowSecondsNormalize(30);
    refSentinelConfig.value?.resetToDefaults();
    await nextTick();
  } finally {
    statePersistMuted.value = false;
  }

  await persistToSettings();
  await persistSentinelToRedis();
};

/**
 * 状态：场景抽屉是否打开
 */
const stateScenesDrawerOpen = ref(false);

/**
 * 状态：当前编辑的场景 ID
 * 描述：为空表示新增。
 */
const stateScenesEditingId = ref<string | null>(null);

/**
 * 组件：场景表单组件实例
 */
const refScenes = ref<ISentinelScenesConfigExpose | null>(null);

/**
 * 状态：场景表单是否通过校验
 */
const stateScenesFormValid = ref(false);

/**
 * 计算属性：场景守护机器卡片列表
 * 描述：优先展示 Redis 返回的所有机器；若缺少本机记录，则补一个本机兜底卡片。
 */
const computedScenesMachines = computed<IPageSettingsUnattendedScenesMachineRedisConfig[]>(() => {
  const remoteList = (Array.isArray(stateScenesMachinesRemote.value) ? stateScenesMachinesRemote.value : []).map(
    (machine) =>
      ({
        machineName: String(machine?.machineName || '').trim(),
        machineRemark: String(machine?.machineRemark || '').trim(),
        machineCode: String(machine?.machineCode || '').trim(),
        lastSeenAt: String(machine?.lastSeenAt || '').trim() || undefined,
        machineLastSeenAt: String(machine?.machineLastSeenAt || '').trim() || undefined,
        network: undefined,
        items: []
      }) satisfies IPageSettingsUnattendedScenesMachineRedisConfig
  );

  const localMachineCode = String(stateMachineCode.value || '').trim();
  if (!localMachineCode) {
    return remoteList;
  }

  const localMachineName = String(computedMachineName.value || '').trim();
  const localItems = Array.isArray(stateScenesLocal.value?.items) ? stateScenesLocal.value.items : [];
  const localGroups = computedLocalNetworkGroups.value;
  const localNetwork = localGroups.groups.length > 0 ? localGroups : (stateScenesRemote.value?.network ?? undefined);

  const localMachine: IPageSettingsUnattendedScenesMachineRedisConfig = {
    machineName: localMachineName,
    machineRemark: String(stateScenesRemote.value?.machineRemark || '').trim(),
    machineCode: localMachineCode,
    lastSeenAt: String(stateScenesRemote.value?.lastSeenAt || '').trim() || undefined,
    machineLastSeenAt: String(stateScenesRemote.value?.machineLastSeenAt || '').trim() || undefined,
    network: localNetwork,
    items: localItems
  };

  const idx = remoteList.findIndex((i) => String(i?.machineCode || '').trim() === localMachineCode);
  if (idx < 0) {
    return [localMachine, ...remoteList];
  }

  const target = remoteList[idx];
  if (!target) {
    return [localMachine, ...remoteList];
  }

  const mergedLocal: IPageSettingsUnattendedScenesMachineRedisConfig = {
    ...target,
    machineCode: localMachineCode,
    machineName: localMachineName || String(target.machineName ?? ''),
    machineRemark: String(stateScenesRemote.value?.machineRemark || target.machineRemark || '').trim(),
    lastSeenAt: String(stateScenesRemote.value?.lastSeenAt || target.lastSeenAt || '').trim() || undefined,
    machineLastSeenAt: String(stateScenesRemote.value?.machineLastSeenAt || target.machineLastSeenAt || '').trim() || undefined,
    network: localNetwork,
    items: localItems
  };

  const rest = remoteList.filter((_, i) => i !== idx);
  return [mergedLocal, ...rest];
});

/**
 * 函数：写回本地场景副本
 * @param {IPageSettingsUnattendedScenesItem[]} items 最新场景列表
 * @param {ISettingsUnattendedScenesLocal} [rollbackState] 回滚副本
 */
const persistLocalScenes = async (items: IPageSettingsUnattendedScenesItem[], rollbackState?: ISettingsUnattendedScenesLocal): Promise<void> => {
  const next = {
    updatedAt: new Date().toISOString(),
    items: unattendedScenesItemsNormalize(items)
  } satisfies ISettingsUnattendedScenesLocal;

  stateScenesLocal.value = next;

  try {
    await settingsUpdate({
      unattended: {
        scenes: next
      }
    });
  } catch {
    stateScenesLocal.value = rollbackState ?? unattendedScenesLocalStateCreate();
    throw new Error('persist local scenes failed');
  }
};

/**
 * 函数：本地与远程同时写入场景副本
 * @param {IPageSettingsUnattendedScenesItem[]} items 最新场景列表
 * @param {ISettingsUnattendedScenesLocal} [rollbackState] 回滚副本
 */
const persistScenesLocalAndRemote = async (items: IPageSettingsUnattendedScenesItem[], rollbackState?: ISettingsUnattendedScenesLocal): Promise<void> => {
  const fallbackState = rollbackState ?? {
    updatedAt: String(stateScenesLocal.value?.updatedAt || '').trim(),
    items: Array.isArray(stateScenesLocal.value?.items) ? [...stateScenesLocal.value.items] : []
  };

  await persistLocalScenes(items, fallbackState);

  try {
    await applyLocalScenesToRemote(items);
  } catch (error) {
    stateScenesLocal.value = fallbackState;

    try {
      await settingsUpdate({
        unattended: {
          scenes: fallbackState
        }
      });
    } catch {
      // ignore rollback write errors
    }

    throw error;
  }
};

/**
 * 函数：刷新远程场景缓存
 */
const refreshScenesRemoteState = async (): Promise<void> => {
  const machineCode = String(stateMachineCode.value || '').trim();
  if (!machineCode) {
    return;
  }

  try {
    await refreshScenesRemoteGet({ query: { machineCode } });
  } catch {
    // ignore
  }

  try {
    await refreshScenesMachinesRemoteGet();
  } catch {
    // ignore
  }
};

/**
 * Hook：场景在线时间轮询
 * 描述：页面存活期间持续刷新远端场景状态，确保最后心跳时间不受无人值守开关影响。
 */
const { pause: pauseScenesRemotePolling, resume: resumeScenesRemotePolling } = useIntervalFn(
  () => {
    if (stateScenesSyncing.value) {
      return;
    }

    void refreshScenesRemoteState();
  },
  SCENES_REMOTE_REFRESH_INTERVAL_MS,
  { immediate: false, immediateCallback: false }
);

/**
 * 函数：构建路径存在性映射
 * @param {string[]} paths 路径列表
 * @returns {Promise<Record<string, boolean>>} 映射表
 */
const execExistsMapBuild = async (paths: string[]): Promise<Record<string, boolean>> => {
  const uniquePaths = Array.from(new Set(paths.map((item) => String(item || '').trim()).filter((item) => item !== '')));
  if (uniquePaths.length === 0) {
    return {};
  }

  const results = await pathsExistGet(uniquePaths);
  return results.reduce<Record<string, boolean>>((acc, item) => {
    acc[String(item.path || '').trim()] = Boolean(item.exists);
    return acc;
  }, {});
};

/**
 * 函数：把本地场景推送到远程
 * @param {IPageSettingsUnattendedScenesItem[]} items 场景列表
 */
const applyLocalScenesToRemote = async (items: IPageSettingsUnattendedScenesItem[]): Promise<void> => {
  const machineCode = String(stateMachineCode.value || '').trim();
  if (!machineCode) {
    return;
  }

  await refreshScenesRemotePatch({
    query: { machineCode },
    body: {
      datas: {
        machineName: String(computedMachineName.value || '').trim(),
        machineCode,
        items: unattendedScenesItemsNormalize(items)
      }
    }
  });

  await refreshScenesRemoteState();
};

/**
 * 函数：打开场景同步对比弹窗
 */
const handleScenesSyncOpen = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }
  if (stateScenesSyncing.value) {
    return;
  }

  const machineCode = String(stateMachineCode.value || '').trim();
  if (!machineCode) {
    return;
  }

  stateScenesSyncing.value = true;

  try {
    await refreshScenesRemoteState();

    const local = unattendedScenesLocalNormalize(stateScenesLocal.value);
    const remote = stateScenesRemote.value ? { ...stateScenesRemote.value, items: unattendedScenesItemsNormalize(stateScenesRemote.value.items) } : null;
    if (local.items.length === 0 && (!remote || remote.items.length === 0)) {
      return;
    }

    const paths = [...local.items.map((item) => item.execPath), ...(Array.isArray(remote?.items) ? remote!.items.map((item) => item.execPath) : [])];
    const execExistsByPath = await execExistsMapBuild(paths);
    const entries = unattendedScenesSyncEntriesBuild({ local, remote, execExistsByPath });

    if (entries.every((entry) => entry.status === 'same')) {
      return;
    }

    const choice = await unattendedScenesSyncRequest({
      machineCode,
      machineName: String(computedMachineName.value || remote?.machineName || '').trim(),
      local,
      remote,
      entries
    });

    if (choice === 'remote') {
      await persistScenesLocalAndRemote(unattendedScenesItemsNormalize(remote?.items), local);
      return;
    }

    if (choice === 'local') {
      await persistScenesLocalAndRemote(local.items, local);
      return;
    }

    const mergedItems = unattendedScenesMergePreferLocal(local.items, unattendedScenesItemsNormalize(remote?.items));
    await persistScenesLocalAndRemote(mergedItems, local);
  } finally {
    stateScenesSyncing.value = false;
  }
};

/**
 * 事件：切换场景启用状态（仅列表开关）
 * @param {string} id 场景 ID
 * @param {boolean} enabled 是否启用
 */
const handleScenesItemToggleEnabled = async (id: string, enabled: boolean): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }

  const machineCode = String(stateMachineCode.value || '').trim();
  if (!machineCode) {
    return;
  }

  const snapshotState: ISettingsUnattendedScenesLocal = {
    updatedAt: String(stateScenesLocal.value?.updatedAt || '').trim(),
    items: Array.isArray(stateScenesLocal.value?.items) ? [...stateScenesLocal.value.items] : []
  };
  const snapshotItems = snapshotState.items;

  const nextItems = snapshotItems.map((i) => (String(i?.id || '').trim() === String(id || '').trim() ? { ...i, enabled: Boolean(enabled) } : i));

  await persistScenesLocalAndRemote(nextItems, snapshotState);
};

/**
 * 事件：更新机器备注
 * @param {{ machineName: string; machineCode: string; machineRemark: string }} payload 备注更新参数
 */
const handleScenesMachineRemarkUpdate = async (payload: { machineName: string; machineCode: string; machineRemark: string }): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }

  const machineCode = String(payload.machineCode || '').trim();
  if (!machineCode) {
    return;
  }

  await refreshScenesRemotePatch({
    query: { machineCode },
    body: {
      datas: {
        machineName: String(payload.machineName || '').trim(),
        machineCode,
        machineRemark: String(payload.machineRemark || '').trim()
      }
    }
  });

  if (machineCode === String(stateMachineCode.value || '').trim()) {
    await refreshScenesRemoteGet({ query: { machineCode } });
  }

  await refreshScenesMachinesRemoteGet();

  toast.add({
    description: t('components.sentinel.scenes.card.toast.machineRemarkSaved'),
    color: 'success',
    icon: 'i-lucide-save',
    duration: 1500,
    type: 'foreground',
    close: false
  });
};

/**
 * 事件：删除场景（Popover 二次确认）
 * @param {string} id 场景 ID
 */
const handleScenesItemDelete = async (id: string): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }

  const machineCode = String(stateMachineCode.value || '').trim();
  if (!machineCode) {
    return;
  }

  const snapshotState: ISettingsUnattendedScenesLocal = {
    updatedAt: String(stateScenesLocal.value?.updatedAt || '').trim(),
    items: Array.isArray(stateScenesLocal.value?.items) ? [...stateScenesLocal.value.items] : []
  };
  const snapshotItems = snapshotState.items;
  const nextItems = snapshotItems.filter((i) => String(i?.id || '').trim() !== String(id || '').trim());

  await persistScenesLocalAndRemote(nextItems, snapshotState);
};

/**
 * 事件：删除主机（Popover 二次确认）
 * @param {{ machineName: string; machineCode: string }} payload 主机参数
 */
const handleScenesMachineDelete = async (payload: { machineName: string; machineCode: string }): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }

  const machineCode = String(payload.machineCode || '').trim();
  if (!machineCode) {
    return;
  }
  if (machineCode === String(stateMachineCode.value || '').trim()) {
    return;
  }

  await refreshScenesRemoteDelete({ query: { machineCode } });
  await refreshScenesMachinesRemoteGet();

  toast.add({
    description: t('components.sentinel.scenes.card.toast.machineDeleted'),
    color: 'success',
    icon: 'i-lucide-trash-2',
    duration: 1500,
    type: 'foreground',
    close: false
  });
};

/**
 * 事件：场景表单提交
 * 描述：本机场景保存时同时写入本地副本与当前机器的远程配置。
 */
const handleScenesSubmit = async (values: TSentinelScenesConfigValues): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }

  const machineCode = String(stateMachineCode.value || '').trim();
  if (!machineCode) {
    return;
  }

  const current = stateScenesRemote.value;
  const base: IPageSettingsUnattendedScenesMachineRedisConfig = {
    machineName: String(computedMachineName.value || '').trim(),
    machineRemark: String(current?.machineRemark || '').trim(),
    machineCode,
    items: Array.isArray(stateScenesLocal.value?.items) ? [...stateScenesLocal.value.items] : []
  };

  const editingId = String(stateScenesEditingId.value || '').trim();
  const nextId = editingId || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`);

  const idx = base.items.findIndex((i) => String(i?.id || '').trim() === nextId);

  const nextItem: IPageSettingsUnattendedScenesItem = {
    id: nextId,
    sceneName: String(values.sceneName || '').trim(),
    sourceExecPath: String(values.sourceExecPath || '').trim(),
    execPath: String(values.execPath || '').trim(),
    args: Array.isArray(values.args) ? values.args : [],
    enabled: Boolean(values.enabled)
  };

  const previousExecPath = idx >= 0 ? String(base.items[idx]?.execPath || '').trim() : '';

  const materialized = await sceneManagedExeMaterialize(xtItem.nxtItem.execPath = Sif (idx >= 0) {
    base.items.splice(idx, 1, nextItem);
  } else {
    base.items.push(nextItem);
  }

  const rollbackState: ISettingsUnattendedScenesLocal = {
    updatedAt: String(stateScenesLocal.value?.updatedAt || '').trim(),
    items: Array.isArray(stateScenesLocal.value?.items) ? [...stateScenesLocal.value.items] : []
  };

  try {
    await persistScenesLocalAndRemote(base.items, rollbackState);
  } catch (error) {
    if (nextItem.execPath && nextItem.sourceExecPath && nextItem.execPath !== nextItem.sourceExecPath && nextItem.execPath !== previousExecPath) {
      try {
        await sceneManagedExeRemove(nextItem.execPath, nextItem.sourceExecPath);
      } catch {}
    }

    throw error;
  }

  stateScenesDrawerOpen.value = false;
};

/**
 * 事件：场景表单校验
 * @param {TSentinelScenesConfigValidateResult} result 校验结果
 */
const handleScenesValidate = (result: TSentinelScenesConfigValidateResult) => {
  stateScenesFormValid.value = Boolean(result?.valid);
};

/**
 * 事件：抽屉 footer 保存按钮
 */
const handleScenesFooterSave = () => {
  refScenes.value?.validateAndSubmit();
};

/**
 * 事件：打开“新增场景”抽屉
 */
const handleScenesAddOpen = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  stateScenesEditingId.value = null;
  stateScenesDrawerOpen.value = true;

  await nextTick();

  const machineId = String(stateMachineCode.value || '').trim();
  const machineName = String(computedMachineName.value || '').trim();
  const machineRemark = String(computedMachineRemark.value || '').trim();

  refScenes.value?.valuesSet({
    machineId,
    machineName,
    machineRemark,
    sceneName: '',
    sourceExecPath: '',
    execPath: '',
    args: [],
    enabled: true
  });
};

/**
 * 事件：打开“编辑场景”抽屉
 * @param {string} id 场景 ID
 */
const handleScenesEditOpen = async (id: string): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  const items = Array.isArray(stateScenesLocal.value?.items) ? stateScenesLocal.value.items : [];
  const target = items.find((i) => String(i?.id || '').trim() === String(id || '').trim());
  if (!target) {
    return;
  }

  stateScenesEditingId.value = String(target.id || '').trim();
  stateScenesDrawerOpen.value = true;

  await nextTick();

  const machineId = String(stateMachineCode.value || '').trim();
  const machineName = String(computedMachineName.value || '').trim();
  const machineRemark = String(computedMachineRemark.value || '').trim();

  refScenes.value?.valuesSet({
    machineId,
    machineName,
    machineRemark,
    sceneName: String(target.sceneName || ''),
    sourceExecPath: String(target.sourceExecPath || target.execPath || ''),
    execPath: String(target.execPath || ''),
    args: Array.isArray(target.args) ? target.args : [],
    enabled: Boolean(target.enabled)
  });
};

/**
 * 事件：选择程序（execPath）
 * @param {string} current 当前输入的路径
 */
const handleScenesPickExecPath = async (current: string): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }
  const payload: IOpenFilePayload = {
    title: t('components.sentinel.scenes.dialogs.pickProgramTitle'),
    defaultPath: String(current || '').trim() || undefined,
    filters: [
      {
        name: t('common.dialogs.fileFilters.executable'),
        extensions: ['exe']
      }
    ]
  };

  const next = await openFile(payload);
  if (!next) {
    return;
  }

  const values = refScenes.value?.valuesGet();
  if (!values) {
    return;
  }

  refScenes.value?.valuesSet({
    ...values,
    sourceExecPath: next,
    execPath: String(next || '').trim() === String(values.sourceExecPath || '').trim() ? String(values.execPath || '').trim() : ''
  });
};

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

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
    label: t('pages.settings.unattended.title'),
    icon: 'i-mdi:robot-outline',
    to: localePath('/settings/unattended')
  }
];
</script>
