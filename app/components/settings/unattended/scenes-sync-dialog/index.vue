<template>
  <UModal v-model:open="stateOpen" :title="t('components.sentinel.scenes.sync.title')" :description="computedDescription" :ui="{ content: 'sm:max-w-5xl', body: 'space-y-4', footer: 'justify-between' }" @update:open="handleOpenUpdate">
    <template #body>
      <div v-if="statePayload" class="space-y-4">
        <div class="grid gap-3 md:grid-cols-4">
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.machine')" :description="statePayload.machineName || statePayload.machineCode" :ui="{ container: 'px-4 py-3' }" />
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.local')" :description="String(statePayload.local.items.length)" :ui="{ container: 'px-4 py-3' }" />
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.remote')" :description="String(computedRemoteCount)" :ui="{ container: 'px-4 py-3' }" />
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.conflict')" :description="String(computedConflictCount)" :ui="{ container: 'px-4 py-3' }" />
        </div>

        <div class="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          <div v-for="entry in statePayload.entries" :key="entry.sceneId" class="bg-elevated/40 border-default rounded-xl border p-4">
            <div class="mb-3 flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="text-highlighted truncate text-sm font-semibold">{{ entry.sceneName || t('components.sentinel.scenes.sync.unnamed') }}</div>
                <div class="text-muted text-xs break-all">{{ entry.sceneId }}</div>
              </div>
              <UBadge :color="statusColorGet(entry.status)" variant="soft">{{ statusLabelGet(entry.status) }}</UBadge>
            </div>

            <div class="grid gap-3 lg:grid-cols-2">
              <UPageCard variant="subtle" :title="t('components.sentinel.scenes.sync.sources.local')" :ui="{ container: 'px-4 py-3' }">
                <template #description>
                  <div v-if="entry.local" class="space-y-2 text-sm">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-muted">{{ t('components.sentinel.scenes.sync.fields.enabled') }}</span>
                      <UBadge :color="entry.local.enabled ? 'success' : 'neutral'" variant="soft">{{ entry.local.enabled ? t('components.sentinel.scenes.sync.values.enabled') : t('components.sentinel.scenes.sync.values.disabled') }}</UBadge>
                    </div>
                    <div class="space-y-1">
                      <div class="text-muted text-xs">{{ t('components.sentinel.scenes.sync.fields.execPath') }}</div>
                      <div class="text-sm break-all">{{ entry.local.execPath || '-' }}</div>
                    </div>
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-muted">{{ t('components.sentinel.scenes.sync.fields.execState') }}</span>
                      <UBadge :color="entry.localExecExists ? 'success' : 'warning'" variant="soft">{{ entry.localExecExists ? t('components.sentinel.scenes.sync.values.pathExists') : t('components.sentinel.scenes.sync.values.pathMissing') }}</UBadge>
                    </div>
                    <div class="space-y-1">
                      <div class="text-muted text-xs">{{ t('components.sentinel.scenes.sync.fields.args') }}</div>
                      <div class="text-sm break-all">{{ commandTextGet(entry.local.execPath, entry.local.args) || '-' }}</div>
                    </div>
                  </div>
                  <UEmpty
                    v-else
                    icon="i-lucide-monitor-down"
                    :title="t('components.sentinel.scenes.sync.empty.local.title')"
                    :description="t('components.sentinel.scenes.sync.empty.local.description')"
                    variant="naked"
                    size="xs"
                    :ui="{ root: 'p-0 items-start justify-start', header: 'items-start text-left max-w-none', body: 'items-start max-w-none' }"
                  />
                </template>
              </UPageCard>

              <UPageCard variant="subtle" :title="t('components.sentinel.scenes.sync.sources.remote')" :ui="{ container: 'px-4 py-3' }">
                <template #description>
                  <div v-if="entry.remote" class="space-y-2 text-sm">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-muted">{{ t('components.sentinel.scenes.sync.fields.enabled') }}</span>
                      <UBadge :color="entry.remote.enabled ? 'success' : 'neutral'" variant="soft">{{ entry.remote.enabled ? t('components.sentinel.scenes.sync.values.enabled') : t('components.sentinel.scenes.sync.values.disabled') }}</UBadge>
                    </div>
                    <div class="space-y-1">
                      <div class="text-muted text-xs">{{ t('components.sentinel.scenes.sync.fields.execPath') }}</div>
                      <div class="text-sm break-all">{{ entry.remote.execPath || '-' }}</div>
                    </div>
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-muted">{{ t('components.sentinel.scenes.sync.fields.execState') }}</span>
                      <UBadge :color="entry.remoteExecExists ? 'success' : 'warning'" variant="soft">{{ entry.remoteExecExists ? t('components.sentinel.scenes.sync.values.pathExists') : t('components.sentinel.scenes.sync.values.pathMissing') }}</UBadge>
                    </div>
                    <div class="space-y-1">
                      <div class="text-muted text-xs">{{ t('components.sentinel.scenes.sync.fields.args') }}</div>
                      <div class="text-sm break-all">{{ commandTextGet(entry.remote.execPath, entry.remote.args) || '-' }}</div>
                    </div>
                  </div>
                  <UEmpty
                    v-else
                    icon="i-lucide-cloud-off"
                    :title="t('components.sentinel.scenes.sync.empty.remote.title')"
                    :description="t('components.sentinel.scenes.sync.empty.remote.description')"
                    variant="naked"
                    size="xs"
                    :ui="{ root: 'p-0 items-start justify-start', header: 'items-start text-left max-w-none', body: 'items-start max-w-none' }"
                  />
                </template>
              </UPageCard>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton color="neutral" variant="outline" @click="close">{{ t('common.actions.cancel') }}</UButton>
      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="soft" :disabled="!computedHasRemote" @click="settle('remote')">{{ t('components.sentinel.scenes.sync.actions.useRemote') }}</UButton>
        <UButton color="primary" variant="soft" @click="settle('merge')">{{ t('components.sentinel.scenes.sync.actions.merge') }}</UButton>
        <UButton color="primary" @click="settle('local')">{{ t('components.sentinel.scenes.sync.actions.useLocal') }}</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TUnattendedScenesSyncStatus } from '@/composables/unattended/scenes-sync';

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：全局场景同步弹窗
 */
const { stateOpen, statePayload, settle, close } = useUnattendedScenesSyncDialog();

/**
 * 计算属性：远程条目数量
 */
const computedRemoteCount = computed(() => (Array.isArray(statePayload.value?.remote?.items) ? statePayload.value!.remote!.items.length : 0));

/**
 * 计算属性：冲突数量
 */
const computedConflictCount = computed(() => (Array.isArray(statePayload.value?.entries) ? statePayload.value!.entries.filter((entry) => entry.status === 'conflict').length : 0));

/**
 * 计算属性：是否存在远程数据
 */
const computedHasRemote = computed(() => Boolean(statePayload.value?.remote));

/**
 * 计算属性：描述文案
 */
const computedDescription = computed(() => {
  const machine = String(statePayload.value?.machineName || statePayload.value?.machineCode || '').trim();
  if (!machine) {
    return t('components.sentinel.scenes.sync.description');
  }

  return t('components.sentinel.scenes.sync.descriptionWithMachine', { machine });
});

/**
 * 函数：获取状态标签
 * @param {TUnattendedScenesSyncStatus} status 状态
 * @returns {string} 标签
 */
const statusLabelGet = (status: TUnattendedScenesSyncStatus): string => t(`components.sentinel.scenes.sync.status.${status}`);

/**
 * 函数：获取状态颜色
 * @param {TUnattendedScenesSyncStatus} status 状态
 * @returns {'primary'|'success'|'warning'|'error'} 颜色
 */
const statusColorGet = (status: TUnattendedScenesSyncStatus): 'primary' | 'success' | 'warning' | 'error' => {
  if (status === 'same') {
    return 'success';
  }
  if (status === 'conflict') {
    return 'error';
  }
  return 'warning';
};

/**
 * 函数：构建命令展示文本
 * @param {string} execPath 可执行文件路径
 * @param {string[]} args 参数列表
 * @returns {string} 命令文本
 */
const commandTextGet = (execPath: string, args: string[]): string => {
  const parts = [String(execPath || '').trim(), ...(Array.isArray(args) ? args.map((item) => String(item ?? '').trim()) : [])].filter((item) => item !== '');

  return parts
    .map((item) => (/\s/.test(item) ? `"${item.replaceAll('"', '\\"')}"` : item))
    .join(' ')
    .trim();
};

/**
 * 事件：外部关闭弹窗
 * @param {boolean} open 最新打开状态
 */
const handleOpenUpdate = (open: boolean): void => {
  if (!open) {
    close();
  }
};
</script>
