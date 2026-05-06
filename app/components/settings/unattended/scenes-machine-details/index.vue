<template>
  <div class="space-y-5">
    <section class="space-y-4">
      <div class="border-default flex items-center justify-between gap-3 border-b pb-3">
        <div class="flex min-w-0 items-center gap-2">
          <div class="text-highlighted text-lg font-medium">{{ t('components.sentinel.scenes.card.fields.scenes') }}</div>
          <UBadge color="neutral" variant="outline">{{ props.machine.items.length }}</UBadge>
        </div>
        <UButton v-if="isLocalMachine(props.machine.machineCode)" icon="i-material-symbols:add-ad-outline-rounded" color="primary" size="sm" variant="soft" @click.stop="emit('add')">
          {{ t('components.sentinel.scenes.card.actions.addScene') }}
        </UButton>
      </div>

      <div v-if="props.machine.items.length > 0" class="space-y-3">
        <article v-for="item in props.machine.items" :key="item.id" class="bg-elevated/40 ring-default space-y-4 rounded-md p-4 ring-1">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1 space-y-2">
              <div class="flex min-w-0 flex-wrap items-center gap-2">
                <div class="text-highlighted min-w-0 text-lg font-medium break-all">{{ item.sceneName || t('components.sentinel.scenes.card.scene.unnamed') }}</div>
                <UBadge :color="item.enabled ? 'success' : 'neutral'" variant="outline">{{ item.enabled ? t('components.sentinel.scenes.card.scene.enabled') : t('components.sentinel.scenes.card.scene.disabled') }}</UBadge>
              </div>

              <div class="text-muted flex min-w-0 items-start gap-2 text-xs">
                <UIcon name="i-material-symbols:terminal-rounded" class="mt-0.5 shrink-0" />
                <span class="min-w-0 break-all">{{ scenesCommandTextGet(item.execPath, item.args) || '-' }}</span>
              </div>
            </div>

            <template v-if="isLocalMachine(props.machine.machineCode)">
              <USwitch :model-value="Boolean(item.enabled)" @update:model-value="(value: boolean) => emit('toggle-enabled', { id: String(item.id || ''), enabled: Boolean(value) })" />
            </template>
          </div>

          <div v-if="isLocalMachine(props.machine.machineCode)" class="border-default flex items-center justify-end gap-2 border-t pt-3">
            <UButton color="primary" variant="outline" icon="i-material-symbols:edit-outline" size="sm" @click="() => emit('edit', String(item.id || ''))">{{ t('components.sentinel.scenes.card.actions.edit') }}</UButton>

            <UPopover arrow :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-56 z-51' }">
              <UButton color="error" variant="soft" icon="i-lucide:trash-2" size="sm">{{ t('components.sentinel.scenes.card.actions.delete') }}</UButton>
              <template #content="{ close }">
                <div class="flex flex-col gap-2">
                  <div class="text-highlighted text-sm font-medium">{{ t('components.sentinel.scenes.card.dialogs.deleteSceneTitle') }}</div>
                  <div class="text-muted text-xs break-all">{{ String(item.sceneName || '') }}</div>
                  <div class="flex items-center justify-end gap-2 pt-1">
                    <UButton color="neutral" variant="outline" size="xs" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                    <UButton color="error" variant="solid" size="xs" @click="() => handleDeleteConfirm(String(item.id || ''), close)">{{ t('common.actions.confirm') }}</UButton>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </article>
      </div>

      <div v-else class="ring-default ring-dashed rounded-md px-4 py-5 ring-1">
        <UEmpty
          icon="i-tabler:layout-grid"
          :title="t('components.sentinel.scenes.card.empty.scenes.title')"
          :description="isLocalMachine(props.machine.machineCode) ? t('components.sentinel.scenes.card.empty.scenes.localDescription') : t('components.sentinel.scenes.card.empty.scenes.remoteDescription')"
          variant="naked"
          size="sm"
          :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }"
        >
          <template v-if="isLocalMachine(props.machine.machineCode)" #actions>
            <UButton icon="i-material-symbols:add-ad-outline-rounded" color="primary" variant="soft" @click.stop="emit('add')">{{ t('components.sentinel.scenes.card.actions.addScene') }}</UButton>
          </template>
        </UEmpty>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * 接口：场景守护详情 Props
 */
interface ISettingsUnattendedScenesMachineDetailsProps {
  /**
   * 当前机器场景信息
   */
  machine: IPageSettingsUnattendedScenesMachineRedisConfig;

  /**
   * 本机机器码
   */
  localMachineCode: string;
}

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Props：组件属性
 */
const props = defineProps<ISettingsUnattendedScenesMachineDetailsProps>();

/**
 * 事件：组件事件
 */
const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'toggle-enabled', payload: IPageSettingsUnattendedScenesToggleEnabledPayload): void;
  (e: 'edit' | 'delete', id: string): void;
}>();

/**
 * 函数：是否本机
 * @param {string} machineCode 机器码
 * @returns {boolean} 是否本机
 */
const isLocalMachine = (machineCode: string): boolean => String(machineCode || '').trim() === String(props.localMachineCode || '').trim();

/**
 * 函数：构建命令展示文本
 * @param {string} execPath 执行路径
 * @param {string[]} args 参数列表
 * @returns {string} 展示文本
 */
const scenesCommandTextGet = (execPath: string, args: string[]): string => {
  const safeExecPath = String(execPath || '').trim();
  const safeArgs = Array.isArray(args) ? args.map((item) => String(item)) : [];

  return [safeExecPath, ...safeArgs].filter((item) => String(item).trim() !== '').join(' ');
};

/**
 * 函数：确认删除场景
 * @param {string} id 场景 ID
 * @param {(() => void) | undefined} close 关闭函数
 */
const handleDeleteConfirm = (id: string, close?: () => void): void => {
  emit('delete', id);
  close?.();
};
</script>
