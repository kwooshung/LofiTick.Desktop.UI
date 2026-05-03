<template>
  <UModal v-model:open="stateOpen" :title="t('components.sentinel.scenes.card.fields.logs')" :ui="{ content: 'z-50 max-w-5xl', title: 'w-full font-normal' }">
    <template #title>
      <template v-if="props.machine">
        <div class="min-w-0">
          <div class="text-highlighted text-lg font-medium">{{ props.machine.machineName || t('components.sentinel.scenes.card.machine.unnamed') }}</div>
          <div class="text-muted mt-1 text-xs break-all">{{ props.machine.machineCode || '-' }}</div>
        </div>
      </template>
      <template v-else>
        <div class="text-lg font-medium">{{ t('components.sentinel.scenes.card.fields.logs') }}</div>
      </template>
    </template>
    <template #body>
      <div v-if="props.machine" class="space-y-4">
        <template v-if="props.machine.logs.length > 0">
          <article v-for="item in props.machine.logs" :key="item.id" class="bg-elevated/40 ring-default space-y-3 rounded-md p-4 ring-1">
            <div class="flex flex-wrap items-center gap-2">
              <UBadge :color="levelColorGet(item.level)" variant="soft">{{ item.level || '-' }}</UBadge>
              <UBadge color="neutral" variant="outline">{{ item.scope || '-' }}</UBadge>
              <UBadge v-if="String(item.sceneName || '').trim()" color="info" variant="outline">{{ item.sceneName }}</UBadge>
              <span class="text-muted ml-auto text-xs"><Datetime :datetime="String(item.ts || '').trim()" /></span>
            </div>
            <div class="text-highlighted text-sm leading-6 wrap-break-word">{{ item.message || '-' }}</div>
            <div class="text-muted flex flex-wrap items-center gap-2 text-xs break-all">
              <span>{{ item.stage || '-' }}</span>
              <span>/</span>
              <span>{{ item.step || '-' }}</span>
              <span>/</span>
              <span>{{ item.state || '-' }}</span>
            </div>
          </article>
        </template>
        <template v-else>
          <UEmpty icon="i-lucide:file-text" :title="t('components.sentinel.scenes.card.empty.logs.title')" :description="t('components.sentinel.scenes.card.empty.logs.description')" variant="naked" size="sm" :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }" />
        </template>
      </div>
      <div v-else class="py-6">
        <UEmpty icon="i-lucide:file-text" :title="t('components.sentinel.scenes.card.empty.data.title')" :description="t('components.sentinel.scenes.card.empty.data.description')" variant="naked" size="sm" :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { IPageSettingsUnattendedSentinelLogsMachineCard } from '@@/shared/types/pages/settings/unattended/index.types';

/**
 * 接口：机器日志弹窗 Props
 */
interface ISettingsUnattendedMachineLogsDialogProps {
  /**
   * 当前机器日志信息
   */
  machine: IPageSettingsUnattendedSentinelLogsMachineCard | null;
}

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Model：弹窗开关
 */
const stateOpen = defineModel<boolean>('open', { default: false });

/**
 * Props：组件属性
 */
const props = defineProps<ISettingsUnattendedMachineLogsDialogProps>();

/**
 * 函数：日志级别映射为徽标颜色
 * @param {string} level 日志级别
 * @returns {'error' | 'warning' | 'success' | 'info' | 'neutral'} 颜色
 */
const levelColorGet = (level: string): 'error' | 'warning' | 'success' | 'info' | 'neutral' => {
  const safeLevel = String(level || '')
    .trim()
    .toLowerCase();
  if (safeLevel === 'error') {
    return 'error';
  }
  if (safeLevel === 'warn' || safeLevel === 'warning') {
    return 'warning';
  }
  if (safeLevel === 'success') {
    return 'success';
  }
  if (safeLevel === 'info') {
    return 'info';
  }

  return 'neutral';
};
</script>
