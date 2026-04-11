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
        <USwitch :model-value="stateUnattendedEnabled" @update:model-value="handleUnattendedEnabledToggle" />
      </UFormField>
      <UFormField :label="t('pages.settings.unattended.form.startBehavior.label')" :description="t('pages.settings.unattended.form.startBehavior.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USelect v-model="stateStartBehaviors" :items="computedStartBehaviors" class="w-100" value-attribute="value" option-attribute="label" />
      </UFormField>
      <UFormField :label="t('pages.settings.unattended.form.machineName.label')" :description="t('pages.settings.unattended.form.machineName.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <UInput v-model="stateMachineName" :ui="{ trailing: 'pr-0.5' }" class="w-100" />
      </UFormField>
      <UFormField :label="t('pages.settings.unattended.form.machineCode.label')" :description="t('pages.settings.unattended.form.machineCode.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <UInput readonly :model-value="stateMachineCode" :ui="{ trailing: 'pr-0.5' }" class="w-100">
          <template #trailing>
            <UTooltip :text="t('pages.settings.unattended.tooltips.copyToClipboard')" :content="{ side: 'top' }">
              <UButton :color="stateMachineCodeCopied ? 'success' : 'neutral'" variant="link" size="sm" :icon="stateMachineCodeCopied ? 'i-lucide-copy-check' : 'i-lucide-copy'" @click="handleMachineCodeCopy" />
            </UTooltip>
          </template>
        </UInput>
      </UFormField>

      <UFormField :label="t('pages.settings.unattended.form.machineUuid.label')" :description="t('pages.settings.unattended.form.machineUuid.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <UInput readonly :model-value="stateMachineUuid" :ui="{ trailing: 'pr-0.5' }" class="w-100">
          <template #trailing>
            <UTooltip :text="t('pages.settings.unattended.tooltips.copyToClipboard')" :content="{ side: 'top' }">
              <UButton :color="stateMachineUuidCopied ? 'success' : 'neutral'" variant="link" size="sm" :icon="stateMachineUuidCopied ? 'i-lucide-copy-check' : 'i-lucide-copy'" @click="handleMachineUuidCopy" />
            </UTooltip>
          </template>
        </UInput>
      </UFormField>

      <UFormField
        :label="t('pages.settings.unattended.form.machineFingerprint.label')"
        :description="t('pages.settings.unattended.form.machineFingerprint.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <UInput readonly :model-value="stateMachineFingerprint" :ui="{ trailing: 'pr-0.5' }" class="w-100">
          <template #trailing>
            <UTooltip :text="t('pages.settings.unattended.tooltips.copyToClipboard')" :content="{ side: 'top' }">
              <UButton :color="stateMachineFingerprintCopied ? 'success' : 'neutral'" variant="link" size="sm" :icon="stateMachineFingerprintCopied ? 'i-lucide-copy-check' : 'i-lucide-copy'" @click="handleMachineFingerprintCopy" />
            </UTooltip>
          </template>
        </UInput>
      </UFormField>

      <UFormField
        :label="t('pages.settings.unattended.form.machineCodeConsistent.label')"
        :description="t('pages.settings.unattended.form.machineCodeConsistent.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <UCheckbox :model-value="computedMachineCodeConsistent" disabled />
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
        <UPopover :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'p-4 w-80' }">
          <UButton color="primary" variant="outline" icon="i-lucide:calculator">{{ t('pages.settings.unattended.analysis.button') }}</UButton>

          <template #content>
            <ReuseAnalysisDurationPopoverContent :analysis="computedSentinelAnalysis" />
          </template>
        </UPopover>
      </template>
    </UPageCard>
    <UPageCard variant="outline" :ui="{ root: 'mb-10', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.unattended.sections.sentinel.form.startup.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <span class="block">{{ t('pages.settings.unattended.sections.sentinel.form.startup.enableDescription') }}</span>
          <span class="block">
            {{ t('pages.settings.unattended.sections.sentinel.form.startup.disablePrefix') }}
            <UBadge variant="soft">{{ t('pages.settings.unattended.title') }}</UBadge>
            {{ t('pages.settings.unattended.sections.sentinel.form.startup.disableMiddle') }}
            <UBadge color="success" variant="soft">{{ t('pages.settings.unattended.sections.sentinel.title') }}</UBadge>
            {{ t('pages.settings.unattended.sections.sentinel.form.startup.disableSuffix') }}
          </span>
        </template>
        <USwitch v-model="stateSentinelStartUp" />
      </UFormField>
      <UFormField
        :label="t('pages.settings.unattended.sections.sentinel.form.requestUrl.label')"
        :description="t('pages.settings.unattended.sections.sentinel.form.requestUrl.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <UFieldGroup>
          <USelect v-model="stateRequestProtocol" :items="REQUEST_PROTOCOLS" />
          <UInput v-model="stateRequestHost" :placeholder="t('pages.settings.unattended.sections.sentinel.form.requestUrl.placeholder')" class="w-100" />
        </UFieldGroup>
      </UFormField>
      <SentinelConfig ref="refSentinelConfig" @analysis-change="handleSentinelConfigChanged" />
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.unattended.sections.guard.title') }}</div>
          <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.unattended.sections.guard.description') }}</div>
        </div>
        <UButton color="primary" variant="soft" icon="i-mdi:cloud-refresh-variant-outline" loading-auto @click="handleGuardSync">{{ t('pages.settings.unattended.sections.guard.actions.sync') }}</UButton>
        <UButton color="primary" variant="soft" icon="i-mdi:reload" loading-auto @click="handleGuardResetToDefaults">{{ t('pages.settings.unattended.sections.guard.actions.reset') }}</UButton>
        <UPopover :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'p-4 w-80' }">
          <UButton color="primary" variant="outline" icon="i-lucide:calculator">{{ t('pages.settings.unattended.analysis.button') }}</UButton>

          <template #content>
            <ReuseAnalysisDurationPopoverContent :analysis="computedGuardAnalysis" />
          </template>
        </UPopover>
      </template>
    </UPageCard>
    <UPageCard variant="outline" :ui="{ root: 'mb-10', header: 'mb-0 flex w-full items-center' }">
      <UFormField :label="t('pages.settings.unattended.sections.guard.form.enabled.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          {{ t('pages.settings.unattended.sections.guard.form.enabled.descriptionPrefix') }}
          <UBadge variant="soft">{{ t('pages.settings.unattended.sections.sentinel.title') }}</UBadge>
          {{ t('pages.settings.unattended.sections.guard.form.enabled.descriptionMiddle') }}
          <UBadge color="success" variant="soft">{{ t('pages.settings.unattended.sections.sentinel.title') }}</UBadge>
          {{ t('pages.settings.unattended.sections.guard.form.enabled.and') }}
          <UBadge color="secondary" variant="soft">{{ t('pages.settings.unattended.labels.thisApp') }}</UBadge>
          {{ t('pages.settings.unattended.sections.guard.form.enabled.descriptionSuffix') }}
        </template>
        <USwitch v-model="stateGuardEnabled" />
      </UFormField>
      <SentinelConfig ref="refGuardConfig" @analysis-change="handleGuardConfigChanged" />
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3', body: 'pb-15', footer: 'absolute bottom-0 w-full' }">
      <template #header>
        <div class="flex-1">
          <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.unattended.sections.scenes.title') }}</div>
          <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.unattended.sections.scenes.description') }}</div>
        </div>
      </template>
    </UPageCard>
    <div class="mb-10 flex w-full flex-col gap-3">
      <SettingsUnattendedScenesCards
        :machines="computedScenesMachines"
        :local-machine-code="stateMachineCode"
        :local-machine-fingerprint="stateMachineFingerprint"
        @add="handleScenesAddOpen"
        @toggle-enabled="(payload) => handleScenesItemToggleEnabled(payload.id, payload.enabled)"
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
            :machine-name="stateMachineName"
            :machine-uuid="stateMachineUuid"
            :local-machine-id="stateMachineCode"
            @execpath-pick="handleScenesPickExecPath"
            @submit="handleScenesSubmit"
            @validate="handleScenesValidate"
          />
        </UPageCard>
      </template>

      <template #footer>
        <div class="mx-auto flex h-15 w-5/6 items-center justify-end gap-2">
          <UButton type="button" color="neutral" variant="outline" @click="stateScenesDrawerOpen = false">{{ t('common.actions.cancel') }}</UButton>
          <UButton type="button" icon="i-lucide-save" color="primary" :disabled="!stateScenesFormValid" @click="handleScenesFooterSave">{{ t('common.actions.save') }}</UButton>
        </div>
      </template>
    </UDrawer>

    <UModal v-model:open="stateUnattendedRestartModalOpen" :title="t('pages.settings.unattended.dialogs.restart.title')" :description="t('pages.settings.unattended.dialogs.restart.description')" :close="false" :dismissible="false" :ui="{ footer: 'justify-end' }">
      <span class="hidden" />

      <template #footer>
        <UButton color="neutral" variant="outline" :disabled="stateUnattendedRestartModalLoading" @click="handleUnattendedRestartCancel">
          {{ t('pages.settings.unattended.dialogs.restart.actions.cancel') }}
        </UButton>
        <UButton color="neutral" variant="soft" :loading="stateUnattendedRestartModalLoading" @click="handleUnattendedRestartLater">
          {{ t('pages.settings.unattended.dialogs.restart.actions.later') }}
        </UButton>
        <UButton color="primary" :loading="stateUnattendedRestartModalLoading" @click="handleUnattendedRestartNow">
          {{ t('pages.settings.unattended.dialogs.restart.actions.now') }}
        </UButton>
      </template>
    </UModal>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { ISentinelConfigAnalysis, ISentinelConfigExpose } from '@/components/sentinel/config/index.types';
import type { ISentinelScenesConfigExpose, TSentinelScenesConfigValidateResult, TSentinelScenesConfigValues } from '@/components/sentinel/scenes/index.types';
import type { IPageSettingsUnattendedMachineNetworkSnapshot, IPageSettingsUnattendedScenesItem, ISettingsUnattended, ISettingsUnattendedGuard, ISettingsUnattendedSentinel, TUnattendedStartBehavior } from '@@/shared/types/pages/settings/unattended/index.types';

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
 * Hook：Tauri 设置
 */
const { get: settingsGet, update: settingsUpdate, machineNetworkGet } = useTauriSettings();

/**
 * Hook：Tauri 窗口能力
 */
const { restart, openFile } = useTauriWindow();

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
 * 常量：请求协议选项
 */
const REQUEST_PROTOCOLS: Array<'http' | 'https'> = ['http', 'https'];

/**
 * 状态：无人值守是否启用
 */
const stateUnattendedEnabled = ref(false);

/**
 * 状态：无人值守是否启用（弹窗前的旧值）
 */
const stateUnattendedEnabledBefore = ref(false);

/**
 * 状态：无人值守是否启用（弹窗待确认的新值）
 */
const stateUnattendedEnabledPending = ref<boolean | null>(null);

/**
 * 状态：切换无人值守后是否打开重启确认弹窗
 */
const stateUnattendedRestartModalOpen = ref(false);

/**
 * 状态：重启确认弹窗操作是否处理中
 */
const stateUnattendedRestartModalLoading = ref(false);

/**
 * 状态：启动行为（unattended.start.behaviors）
 */
const stateStartBehaviors = ref<TUnattendedStartBehavior>('normal');

/**
 * 状态：机器名称（settings.machine.name）
 */
const stateMachineName = ref('');

/**
 * 状态：机器名称默认值（用于空值回退）
 */
const stateMachineNameDefault = ref('');

/**
 * 状态：机器代码（settings.machine.code）
 */
const stateMachineCode = ref('');

/**
 * 状态：机器 UUID（settings.machine.uuid）
 */
const stateMachineUuid = ref('');

/**
 * 状态：机器指纹（settings.machine.fingerprint）
 */
const stateMachineFingerprint = ref('');

/**
 * 状态：上一次机器代码（settings.machine.codePrev）
 */
const stateMachineCodePrev = ref('');

/**
 * 状态：机器代码是否已复制
 */
const stateMachineCodeCopied = ref(false);

/**
 * 状态：机器 UUID 是否已复制
 */
const stateMachineUuidCopied = ref(false);

/**
 * 状态：机器指纹是否已复制
 */
const stateMachineFingerprintCopied = ref(false);

/**
 * 状态：本机网络快照（兜底，用于 Redis 中暂无本机记录时展示）
 */
const stateLocalNetworkSnapshot = ref<IPageSettingsUnattendedMachineNetworkSnapshot | null>(null);

/**
 * 计算属性：机器码是否一致（为空或一致表示一致）
 */
const computedMachineCodeConsistent = computed(() => {
  const prev = String(stateMachineCodePrev.value || '').trim();
  const cur = String(stateMachineCode.value || '').trim();
  if (prev === '') {
    return true;
  }
  return prev === cur;
});

/**
 * 状态：开机自启（unattended.start.up）
 * 描述：用于控制无人值守模式启动时是否自动运行。
 */
const stateSentinelStartUp = ref(false);

/**
 * 状态：警卫是否启用（unattended.guard.enabled）
 */
const stateGuardEnabled = ref(false);

/**
 * 状态：请求地址（协议 + 主体）
 */
const stateRequestProtocol = ref<'http' | 'https'>('https');
const stateRequestHost = ref('');

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
 * 组件：警卫配置表单实例
 */
const refGuardConfig = ref<ISentinelConfigExpose | null>(null);

/**
 * 计算属性：哨兵配置分析结果
 */
const computedSentinelAnalysis = computed(() => refSentinelConfig.value?.analysisGet() ?? null);

/**
 * 计算属性：警卫配置分析结果
 */
const computedGuardAnalysis = computed(() => refGuardConfig.value?.analysisGet() ?? null);

/**
 * API：哨兵配置（GET / PATCH）
 * 描述：用于跨设备同步哨兵配置。
 */
const { datas: stateSentinelRemote, refresh: refreshSentinelRemoteGet } = await useApi<IPageSettingsUnattendedSentinelRedisConfig>('desktop/settings/unattended/sentinel');
const { refresh: refreshSentinelRemotePatch } = await useApi<IPageSettingsUnattendedSentinelRedisConfig>('desktop/settings/unattended/sentinel', { method: 'PATCH' });

/**
 * API：哨兵请求地址默认值（GET）
 */
const { datas: stateSentinelRequestUrlDefault, refresh: refreshSentinelRequestUrlDefaultGet } = await useApi<IPageSettingsUnattendedSentinelRequestUrlApi>('desktop/settings/unattended/sentinel/request-url');

/**
 * API：警卫配置（GET / PATCH）
 * 描述：用于跨设备同步警卫配置。
 */
const { datas: stateGuardRemote, refresh: refreshGuardRemoteGet } = await useApi<IPageSettingsUnattendedGuardRedisConfig>('desktop/settings/unattended/guard');
const { refresh: refreshGuardRemotePatch } = await useApi<IPageSettingsUnattendedGuardRedisConfig>('desktop/settings/unattended/guard', { method: 'PATCH' });

/**
 * API：场景配置（GET / PATCH）
 * 描述：按 machineCode 分组存储，可跨设备快速读取。
 */
const { datas: stateScenesRemote, refresh: refreshScenesRemoteGet } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { immediate: false });
const { refresh: refreshScenesRemotePatch } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { method: 'PATCH', immediate: false });

/**
 * API：场景配置（GET）
 * 描述：读取所有机器的场景配置列表。
 */
const { datas: stateScenesMachinesRemote, refresh: refreshScenesMachinesRemoteGet } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig[]>('desktop/settings/unattended/scenes/machines', { immediate: false });

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
 * 工具：裁剪警卫配置（写入设置前，确保不含任何额外字段）
 * @param {unknown} input 输入对象
 * @returns {ISettingsUnattendedGuard|null} 裁剪后的配置
 */
const unattendedGuardPickForPersist = (input: unknown): ISettingsUnattendedGuard | null => {
  const src = toRecord(input);
  if (!src) {
    return null;
  }

  const heartbeat = toRecord(src.heartbeat);
  const restart = toRecord(src.restart);
  const burst = restart ? toRecord(restart.burst) : null;

  return {
    enabled: Boolean(src.enabled),
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
  const guard = unattendedGuardPickForPersist(src.guard);
  if (!sentinel || !guard) {
    return null;
  }

  return {
    enabled: Boolean(src.enabled),
    start: {
      up: Boolean(start?.up),
      behaviors: toUnattendedStartBehavior(start?.behaviors)
    },
    sentinel,
    guard
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
 * @param {ISettingsUnattendedSentinel|ISettingsUnattendedGuard} settingsConfig 持久化配置
 * @returns {Record<string,unknown>} overrides
 */
const sentinelOverridesFromSettings = (settingsConfig: ISettingsUnattendedSentinel | ISettingsUnattendedGuard): Record<string, unknown> => {
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

  if (!isTauriRuntime) {
    return;
  }

  const settings = await settingsGet();

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
  const unattendedGuard = toRecord(unattended.guard) ?? {};

  const machineName = String(machine.name || '').trim();
  stateMachineName.value = machineName;
  stateMachineNameDefault.value = machineName;
  stateMachineCode.value = String(machine.code || '').trim();
  stateMachineUuid.value = String(machine.uuid || '').trim();
  stateMachineFingerprint.value = String(machine.fingerprint || '').trim();
  stateMachineCodePrev.value = String(machine.codePrev || '').trim();

  stateUnattendedEnabled.value = Boolean(unattended.enabled);
  stateUnattendedEnabledBefore.value = stateUnattendedEnabled.value;
  stateSentinelStartUp.value = Boolean(unattendedStart.up);
  stateGuardEnabled.value = Boolean(unattendedGuard.enabled);

  stateStartBehaviors.value = toUnattendedStartBehavior(unattendedStart.behaviors) || stateStartBehaviors.value;

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
  if (Object.keys(unattendedGuard).length > 0) {
    refGuardConfig.value?.resetToOverrides(sentinelOverridesFromSettings(unattendedGuard as unknown as ISettingsUnattendedGuard));
  }

  stateHydrated.value = true;

  const machineCode = String(stateMachineCode.value || '').trim();
  if (machineCode) {
    await refreshScenesRemoteGet({ query: { machineCode } });
  }

  await refreshScenesMachinesRemoteGet();

  if (requestUrlFilled) {
    await persistToSettings();
    await persistSentinelToRedis();
  }
});

/**
 * 事件：切换无人值守是否启用
 * @param {boolean} next 下一个值
 */
const handleUnattendedEnabledToggle = (next: boolean): void => {
  if (!stateHydrated.value) {
    stateUnattendedEnabled.value = next;
    return;
  }
  if (statePersistMuted.value) {
    stateUnattendedEnabled.value = next;
    return;
  }

  stateUnattendedEnabledBefore.value = stateUnattendedEnabled.value;
  stateUnattendedEnabledPending.value = next;
  stateUnattendedEnabled.value = next;
  stateUnattendedRestartModalOpen.value = true;
};

/**
 * 事件：取消切换（不落盘，并回滚 UI）
 */
const handleUnattendedRestartCancel = (): void => {
  stateUnattendedRestartModalOpen.value = false;
  stateUnattendedEnabled.value = stateUnattendedEnabledBefore.value;
  stateUnattendedEnabledPending.value = null;
};

/**
 * 事件：稍后自行重启（先保存，再提示）
 */
const handleUnattendedRestartLater = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime) {
    return;
  }
  if (stateUnattendedRestartModalLoading.value) {
    return;
  }

  stateUnattendedRestartModalLoading.value = true;
  try {
    await persistToSettings();

    toast.add({
      description: t('pages.settings.unattended.dialogs.restart.toast.later'),
      color: 'success',
      icon: 'i-lucide-save',
      duration: 1500,
      type: 'foreground',
      close: false
    });

    stateUnattendedRestartModalOpen.value = false;
    stateUnattendedEnabledPending.value = null;
    stateUnattendedEnabledBefore.value = stateUnattendedEnabled.value;
  } finally {
    stateUnattendedRestartModalLoading.value = false;
  }
};

/**
 * 事件：立即重启（先保存，再重启应用）
 */
const handleUnattendedRestartNow = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime) {
    return;
  }
  if (stateUnattendedRestartModalLoading.value) {
    return;
  }

  stateUnattendedRestartModalLoading.value = true;
  try {
    await persistToSettings();
    await restart();
  } finally {
    stateUnattendedRestartModalLoading.value = false;
  }
};

/**
 * 事件：复制机器代码
 */
const handleMachineCodeCopy = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  const code = String(stateMachineCode.value || '').trim();
  if (!code) {
    return;
  }

  try {
    await navigator.clipboard.writeText(code);
    stateMachineCodeCopied.value = true;
    window.setTimeout(() => {
      stateMachineCodeCopied.value = false;
    }, 1200);
  } catch {
    // ignore
  }
};

/**
 * 事件：复制机器 UUID
 */
const handleMachineUuidCopy = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  const uuid = String(stateMachineUuid.value || '').trim();
  if (!uuid) {
    return;
  }

  try {
    await navigator.clipboard.writeText(uuid);
    stateMachineUuidCopied.value = true;
    window.setTimeout(() => {
      stateMachineUuidCopied.value = false;
    }, 1200);
  } catch {
    // ignore
  }
};

/**
 * 事件：复制机器指纹
 */
const handleMachineFingerprintCopy = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  const fingerprint = String(stateMachineFingerprint.value || '').trim();
  if (!fingerprint) {
    return;
  }

  try {
    await navigator.clipboard.writeText(fingerprint);
    stateMachineFingerprintCopied.value = true;
    window.setTimeout(() => {
      stateMachineFingerprintCopied.value = false;
    }, 1200);
  } catch {
    // ignore
  }
};

/**
 * 工具：从 UI 构建哨兵配置
 * @returns {ISettingsUnattendedSentinel|null} 哨兵配置
 */
const buildSentinelConfigFromUi = (): ISettingsUnattendedSentinel | null => {
  const heart = heartbeatRestartFromRef(refSentinelConfig.value);
  if (!heart) {
    return null;
  }

  return {
    request: {
      url: computedRequestUrl.value
    },
    ...heart
  };
};

/**
 * 工具：从 UI 构建警卫配置
 * @returns {ISettingsUnattendedGuard|null} 警卫配置
 */
const buildGuardConfigFromUi = (): ISettingsUnattendedGuard | null => {
  const heart = heartbeatRestartFromRef(refGuardConfig.value);
  if (!heart) {
    return null;
  }

  return {
    enabled: stateGuardEnabled.value,
    ...heart
  };
};

/**
 * 工具：从 UI 构建无人值守配置
 * @returns {ISettingsUnattended|null} 无人值守配置
 */
const buildUnattendedConfigFromUi = (): ISettingsUnattended | null => {
  const sentinel = buildSentinelConfigFromUi();
  const guard = buildGuardConfigFromUi();
  if (!sentinel || !guard) {
    return null;
  }

  return {
    enabled: stateUnattendedEnabled.value,
    start: {
      up: stateSentinelStartUp.value,
      behaviors: stateStartBehaviors.value
    },
    sentinel,
    guard
  };
};

/**
 * 工具：从 UI 构建哨兵 Redis 配置（用于写回 Redis）
 * @returns {IPageSettingsUnattendedSentinelRedisConfig|null} 哨兵配置
 */
const buildSentinelRedisConfigFromUi = (): IPageSettingsUnattendedSentinelRedisConfig | null => {
  const heart = heartbeatRestartFromRef(refSentinelConfig.value);
  if (!heart) {
    return null;
  }

  return {
    request: {
      url: computedRequestUrl.value
    },
    ...heart
  };
};

/**
 * 工具：从 UI 构建警卫 Redis 配置（用于写回 Redis）
 * @returns {IPageSettingsUnattendedGuardRedisConfig|null} 警卫配置
 */
const buildGuardRedisConfigFromUi = (): IPageSettingsUnattendedGuardRedisConfig | null => {
  const heart = heartbeatRestartFromRef(refGuardConfig.value);
  if (!heart) {
    return null;
  }

  return {
    enabled: stateGuardEnabled.value,
    ...heart
  };
};

/**
 * 函数：写回设置持久化
 */
const persistToSettings = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }

  const machineName = String(stateMachineName.value || '').trim();
  if (machineName === '') {
    stateMachineName.value = stateMachineNameDefault.value;
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
      : {}),
    machine: {
      name: String(stateMachineName.value || '').trim()
    }
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
 * 函数：写回 Redis（警卫）
 * 描述：用于任意配置变化后动态同步到远程（UI -> Redis）。
 */
const persistGuardToRedis = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }

  const guard = buildGuardRedisConfigFromUi();
  if (!guard) {
    return;
  }

  await refreshGuardRemotePatch({
    body: {
      datas: guard as unknown as Record<string, unknown>
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
 * 函数：写回 Redis（警卫，防抖）
 */
const persistGuardToRedisDebounced = useDebounceFn(() => {
  void persistGuardToRedis();
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
 * 事件：警卫表单内部配置变化
 */
const handleGuardConfigChanged = (): void => {
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }
  persistToSettingsDebounced();
  persistGuardToRedisDebounced();
};

/**
 * 监听：页面任意配置项变化即写回设置
 */
watch([stateStartBehaviors, stateSentinelStartUp, stateGuardEnabled, stateRequestProtocol, stateRequestHost], () => {
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }
  persistToSettingsDebounced();
});

/**
 * 监听：机器名称变化即写回设置
 */
watch(stateMachineName, () => {
  if (!stateHydrated.value) {
    return;
  }
  if (statePersistMuted.value) {
    return;
  }
  persistToSettingsDebounced();
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
  if (!isTauriRuntime) {
    return;
  }

  statePersistMuted.value = true;
  try {
    await refreshSentinelRemoteGet();

    const remote = stateSentinelRemote.value;
    if (!remote) {
      return;
    }

    const { protocol, host } = requestUrlSplit(remote.request?.url || '');
    stateRequestProtocol.value = protocol;
    stateRequestHost.value = host;

    refSentinelConfig.value?.resetToOverrides(sentinelOverridesFromSettings(remote as unknown as ISettingsUnattendedSentinel));

    await nextTick();

    const sentinelPersist = unattendedSentinelPickForPersist(remote);
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
 * 事件：同步警卫配置（Redis -> UI）
 */
const handleGuardSync = async () => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime) {
    return;
  }

  statePersistMuted.value = true;
  try {
    await refreshGuardRemoteGet();

    const remote = stateGuardRemote.value;
    if (!remote) {
      return;
    }

    stateGuardEnabled.value = Boolean((remote as unknown as IPageSettingsUnattendedGuardRedisConfig)?.enabled);
    refGuardConfig.value?.resetToOverrides(sentinelOverridesFromSettings(remote as unknown as ISettingsUnattendedSentinel));

    await nextTick();

    const guardPersist = unattendedGuardPickForPersist(remote);
    if (!guardPersist) {
      return;
    }

    await settingsUpdate({ unattended: { guard: guardPersist } });
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
    refSentinelConfig.value?.resetToDefaults();
    await nextTick();
  } finally {
    statePersistMuted.value = false;
  }

  await persistToSettings();
  await persistSentinelToRedis();
};

/**
 * 事件：警卫配置恢复默认（仅 SentinelConfig）
 */
const handleGuardResetToDefaults = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!stateHydrated.value) {
    return;
  }

  statePersistMuted.value = true;
  try {
    refGuardConfig.value?.resetToDefaults();
    await nextTick();
  } finally {
    statePersistMuted.value = false;
  }

  await persistToSettings();
  await persistGuardToRedis();
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
const computedScenesMachines = computed(() => {
  const remoteList = Array.isArray(stateScenesMachinesRemote.value) ? stateScenesMachinesRemote.value : [];

  const localMachineCode = String(stateMachineCode.value || '').trim();
  if (!localMachineCode) {
    return remoteList;
  }

  const localMachineName = String(stateMachineName.value || '').trim();
  const localMachineUuid = String(stateMachineUuid.value || '').trim();
  const localItems = Array.isArray(stateScenesRemote.value?.items) ? stateScenesRemote.value!.items : [];
  const localNetwork = stateScenesRemote.value?.network ?? stateLocalNetworkSnapshot.value ?? undefined;

  const localMachine: IPageSettingsUnattendedScenesMachineRedisConfig = {
    machineName: localMachineName,
    machineUuid: localMachineUuid,
    machineCode: localMachineCode,
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
    machineUuid: localMachineUuid || String(target.machineUuid ?? ''),
    network: target.network ?? localNetwork,
    items: localItems
  };

  const rest = remoteList.filter((_, i) => i !== idx);
  return [mergedLocal, ...rest];
});

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

  const current = stateScenesRemote.value;
  const snapshotItems = Array.isArray(current?.items) ? [...current.items] : [];

  const nextItems = snapshotItems.map((i) => (String(i?.id || '').trim() === String(id || '').trim() ? { ...i, enabled: Boolean(enabled) } : i));

  // 乐观更新
  if (current) {
    stateScenesRemote.value = { ...current, items: nextItems };
  }

  try {
    await refreshScenesRemotePatch({
      query: { machineCode },
      body: {
        datas: {
          machineName: String(stateMachineName.value || '').trim(),
          machineUuid: String(stateMachineUuid.value || '').trim(),
          machineCode,
          items: nextItems
        }
      }
    });
    await refreshScenesRemoteGet({ query: { machineCode } });

    try {
      await refreshScenesMachinesRemoteGet();
    } catch {
      // ignore
    }
  } catch {
    if (current) {
      stateScenesRemote.value = { ...current, items: snapshotItems };
    }
    await refreshScenesRemoteGet({ query: { machineCode } });

    try {
      await refreshScenesMachinesRemoteGet();
    } catch {
      // ignore
    }
  }
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

  const current = stateScenesRemote.value;
  const snapshotItems = Array.isArray(current?.items) ? [...current.items] : [];
  const nextItems = snapshotItems.filter((i) => String(i?.id || '').trim() !== String(id || '').trim());

  // 乐观更新
  if (current) {
    stateScenesRemote.value = { ...current, items: nextItems };
  }

  try {
    await refreshScenesRemotePatch({
      query: { machineCode },
      body: {
        datas: {
          machineName: String(stateMachineName.value || '').trim(),
          machineUuid: String(stateMachineUuid.value || '').trim(),
          machineCode,
          items: nextItems
        }
      }
    });
    await refreshScenesRemoteGet({ query: { machineCode } });

    try {
      await refreshScenesMachinesRemoteGet();
    } catch {
      // ignore
    }
  } catch {
    if (current) {
      stateScenesRemote.value = { ...current, items: snapshotItems };
    }
    await refreshScenesRemoteGet({ query: { machineCode } });

    try {
      await refreshScenesMachinesRemoteGet();
    } catch {
      // ignore
    }
  }
};

/**
 * 事件：场景表单提交
 * 描述：当前仅用于关闭抽屉，具体保存逻辑后续接入。
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

  let network: unknown = undefined;
  try {
    network = await machineNetworkGet();
  } catch {
    // ignore
  }

  const current = stateScenesRemote.value;
  const base: IPageSettingsUnattendedScenesMachineRedisConfig = {
    machineName: String(stateMachineName.value || '').trim(),
    machineUuid: String(stateMachineUuid.value || '').trim(),
    machineCode,
    network: network as IPageSettingsUnattendedScenesMachineRedisConfig['network'],
    items: Array.isArray(current?.items) ? [...current.items] : []
  };

  const editingId = String(stateScenesEditingId.value || '').trim();
  const nextId = editingId || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`);

  const idx = base.items.findIndex((i) => String(i?.id || '').trim() === nextId);
  const keepEnabled = idx >= 0 ? Boolean(base.items[idx]?.enabled) : true;

  const nextItem: IPageSettingsUnattendedScenesItem = {
    id: nextId,
    sceneName: String(values.sceneName || '').trim(),
    execPath: String(values.execPath || '').trim(),
    args: Array.isArray(values.args) ? values.args : [],
    enabled: keepEnabled
  };

  if (idx >= 0) {
    base.items.splice(idx, 1, nextItem);
  } else {
    base.items.push(nextItem);
  }

  await refreshScenesRemotePatch({
    query: { machineCode },
    body: {
      datas: base as unknown as Record<string, unknown>
    }
  });

  await refreshScenesRemoteGet({ query: { machineCode } });

  try {
    await refreshScenesMachinesRemoteGet();
  } catch {
    // ignore
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
  const machineName = String(stateMachineName.value || '').trim();

  refScenes.value?.valuesSet({
    machineId,
    machineName,
    sceneName: '',
    execPath: '',
    args: []
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

  const current = stateScenesRemote.value;
  const items = Array.isArray(current?.items) ? current.items : [];
  const target = items.find((i) => String(i?.id || '').trim() === String(id || '').trim());
  if (!target) {
    return;
  }

  stateScenesEditingId.value = String(target.id || '').trim();
  stateScenesDrawerOpen.value = true;

  await nextTick();

  const machineId = String(stateMachineCode.value || '').trim();
  const machineName = String(stateMachineName.value || '').trim();

  refScenes.value?.valuesSet({
    machineId,
    machineName,
    sceneName: String(target.sceneName || ''),
    execPath: String(target.execPath || ''),
    args: Array.isArray(target.args) ? target.args : []
  });
};

/**
 * 事件：选择程序（execPath）
 * @param {string} current 当前输入的路径
 */
const handleScenesPickExecPath = async (current: string): Promise<void> => {
  if (!isTauriRuntime) {
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
    execPath: next
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
