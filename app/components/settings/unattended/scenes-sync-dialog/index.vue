<template>
  <UModal v-model:open="stateOpen" :title="t('components.sentinel.scenes.sync.title')" :description="computedDescription" :close="false" :dismissible="false" :ui="{ content: 'sm:max-w-5xl', body: 'space-y-4', footer: 'justify-end' }">
    <template #body>
      <div v-if="statePayload" class="space-y-4">
        <div class="grid gap-3 md:grid-cols-4">
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.machine')" :description="statePayload.machineName || statePayload.machineCode" :ui="{ container: 'px-4 py-3' }" />
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.local')" :description="String(statePayload.local.items.length)" :ui="{ container: 'px-4 py-3' }" />
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.remote')" :description="String(computedRemoteCount)" :ui="{ container: 'px-4 py-3' }" />
          <UPageCard :title="t('components.sentinel.scenes.sync.summary.conflict')" :description="String(computedConflictCount)" :ui="{ container: 'px-4 py-3' }" />
        </div>

        <div class="space-y-2">
          <div v-for="entry in statePayload.entries" :key="entry.sceneId" class="border-default bg-default/95 overflow-hidden rounded-lg border shadow-sm">
            <div class="border-default flex items-center justify-between gap-3 border-b px-4 py-2.5">
              <div class="min-w-0 space-y-1">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">Scene</span>
                  <div class="text-highlighted min-w-0 truncate text-base leading-6 font-semibold">{{ entry.sceneName || t('components.sentinel.scenes.sync.unnamed') }}</div>
                </div>
                <div class="text-muted font-mono text-[12px] leading-4 break-all">{{ entry.sceneId }}</div>
              </div>
              <UBadge :color="statusColorGet(entry.status)" variant="soft">{{ statusLabelGet(entry.status) }}</UBadge>
            </div>

            <div class="px-4 py-2">
              <div class="border-default bg-muted/30 overflow-hidden rounded-md border">
                <div class="text-muted border-default/70 bg-muted/45 hidden grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 border-b px-3 py-2 text-[12px] tracking-wide uppercase md:grid">
                  <div class="whitespace-nowrap">{{ shortFieldLabelGet('state') }}</div>
                  <div class="whitespace-nowrap">{{ shortSourceLabelGet('local') }}</div>
                  <div class="whitespace-nowrap">{{ shortSourceLabelGet('remote') }}</div>
                </div>

                <div class="divide-default/70 divide-y">
                  <div class="grid gap-2 px-3 py-2 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] md:items-center">
                    <div class="text-muted text-[12px] tracking-wide whitespace-nowrap uppercase">{{ shortFieldLabelGet('state') }}</div>
                    <div class="bg-default/95 min-w-0 rounded-sm px-2.5 py-2 md:bg-transparent md:px-0 md:py-0">
                      <div class="text-muted mb-1 text-[11px] tracking-wide whitespace-nowrap uppercase md:hidden">{{ shortSourceLabelGet('local') }}</div>
                      <template v-if="entry.local">
                        <div class="flex flex-wrap items-center gap-1.5">
                          <UBadge :color="entry.local.enabled ? 'success' : 'neutral'" variant="soft">{{ entry.local.enabled ? t('components.sentinel.scenes.sync.values.enabled') : t('components.sentinel.scenes.sync.values.disabled') }}</UBadge>
                          <UBadge :color="entry.localExecExists ? 'success' : 'warning'" variant="soft">{{ entry.localExecExists ? t('components.sentinel.scenes.sync.values.pathExists') : t('components.sentinel.scenes.sync.values.pathMissing') }}</UBadge>
                        </div>
                      </template>
                      <div v-else class="text-muted text-sm">-</div>
                    </div>
                    <div class="bg-default/95 min-w-0 rounded-sm px-2.5 py-2 md:bg-transparent md:px-0 md:py-0">
                      <div class="text-muted mb-1 text-[11px] tracking-wide whitespace-nowrap uppercase md:hidden">{{ shortSourceLabelGet('remote') }}</div>
                      <template v-if="entry.remote">
                        <div class="flex flex-wrap items-center gap-1.5">
                          <UBadge :color="entry.remote.enabled ? 'success' : 'neutral'" variant="soft">{{ entry.remote.enabled ? t('components.sentinel.scenes.sync.values.enabled') : t('components.sentinel.scenes.sync.values.disabled') }}</UBadge>
                          <UBadge :color="entry.remoteExecExists ? 'success' : 'warning'" variant="soft">{{ entry.remoteExecExists ? t('components.sentinel.scenes.sync.values.pathExists') : t('components.sentinel.scenes.sync.values.pathMissing') }}</UBadge>
                        </div>
                      </template>
                      <div v-else class="text-muted text-sm">-</div>
                    </div>
                  </div>

                  <div class="grid gap-2 px-3 py-2 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] md:items-center">
                    <div class="text-muted text-[12px] tracking-wide whitespace-nowrap uppercase">{{ shortFieldLabelGet('path') }}</div>
                    <div class="bg-default/95 min-w-0 rounded-sm px-2.5 py-2 md:bg-transparent md:px-0 md:py-0">
                      <div class="text-muted mb-1 text-[11px] tracking-wide whitespace-nowrap uppercase md:hidden">{{ shortSourceLabelGet('local') }}</div>
                      <div v-if="entry.local" :title="entry.local.execPath || '-'" class="font-mono text-[13px] leading-5 break-all">{{ entry.local.execPath || '-' }}</div>
                      <div v-else class="text-muted text-sm">-</div>
                    </div>
                    <div class="bg-default/95 min-w-0 rounded-sm px-2.5 py-2 md:bg-transparent md:px-0 md:py-0">
                      <div class="text-muted mb-1 text-[11px] tracking-wide whitespace-nowrap uppercase md:hidden">{{ shortSourceLabelGet('remote') }}</div>
                      <div v-if="entry.remote" :title="entry.remote.execPath || '-'" class="font-mono text-[13px] leading-5 break-all">{{ entry.remote.execPath || '-' }}</div>
                      <div v-else class="text-muted text-sm">-</div>
                    </div>
                  </div>

                  <div class="grid gap-2 px-3 py-2 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] md:items-stretch">
                    <div class="text-muted text-[12px] tracking-wide whitespace-nowrap uppercase">{{ shortFieldLabelGet('command') }}</div>
                    <div class="bg-ink-950 min-w-0 rounded-sm px-2.5 py-2 md:flex md:h-full md:flex-col md:justify-center md:px-2 md:py-1.5">
                      <div class="mb-1 text-[11px] tracking-wide whitespace-nowrap text-white/65 uppercase md:hidden">{{ shortSourceLabelGet('local') }}</div>
                      <div v-if="entry.local" :title="commandTextGet(entry.local.execPath, entry.local.args) || '-'" class="font-mono text-[13px] leading-5 break-all text-white">{{ commandTextGet(entry.local.execPath, entry.local.args) || '-' }}</div>
                      <div v-else class="text-sm text-white/70">-</div>
                    </div>
                    <div class="bg-ink-950 min-w-0 rounded-sm px-2.5 py-2 md:flex md:h-full md:flex-col md:justify-center md:px-2 md:py-1.5">
                      <div class="mb-1 text-[11px] tracking-wide whitespace-nowrap text-white/65 uppercase md:hidden">{{ shortSourceLabelGet('remote') }}</div>
                      <div v-if="entry.remote" :title="commandTextGet(entry.remote.execPath, entry.remote.args) || '-'" class="font-mono text-[13px] leading-5 break-all text-white">{{ commandTextGet(entry.remote.execPath, entry.remote.args) || '-' }}</div>
                      <div v-else class="text-sm text-white/70">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
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
const { t, locale } = useI18n();

/**
 * Hook：全局场景同步弹窗
 */
const { stateOpen, statePayload, settle } = useUnattendedScenesSyncDialog();

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
 * 函数：获取简短字段标签。
 *
 * 用于差异确认列表中的紧凑表格式展示，避免长文案挤压布局。
 *
 * # Arguments
 *
 * * `field` - 字段类型。
 *
 * # Returns
 *
 * 返回适合当前语言环境的短标签。
 */
const shortFieldLabelGet = (field: 'state' | 'path' | 'command'): string => {
  if (locale.value === 'en') {
    if (field === 'state') {
      return 'State';
    }
    if (field === 'path') {
      return 'Path';
    }

    return 'Command';
  }

  if (locale.value === 'ja') {
    if (field === 'state') {
      return '状態';
    }
    if (field === 'path') {
      return 'パス';
    }

    return 'コマンド';
  }

  if (locale.value === 'zh_tw') {
    if (field === 'state') {
      return '狀態';
    }
    if (field === 'path') {
      return '路徑';
    }

    return '命令';
  }

  if (field === 'state') {
    return '状态';
  }
  if (field === 'path') {
    return '路径';
  }

  return '命令';
};

/**
 * 函数：获取简短来源标签。
 *
 * 用于本地与远程两列的紧凑标题展示，确保标签长度稳定且不换行。
 *
 * # Arguments
 *
 * * `source` - 来源类型。
 *
 * # Returns
 *
 * 返回适合当前语言环境的短来源标签。
 */
const shortSourceLabelGet = (source: 'local' | 'remote'): string => {
  if (locale.value === 'en') {
    return source === 'local' ? 'Local' : 'Remote';
  }

  if (locale.value === 'ja') {
    return source === 'local' ? 'ローカル' : 'リモート';
  }

  if (locale.value === 'zh_tw') {
    return source === 'local' ? '本地' : '遠端';
  }

  return source === 'local' ? '本地' : '远端';
};

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
</script>
