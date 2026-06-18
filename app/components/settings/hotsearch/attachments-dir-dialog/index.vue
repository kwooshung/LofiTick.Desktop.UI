<template>
  <UModal :open="open" :title="t('pages.settings.hotsearch.dialogs.attachmentsDirRequired.title')" :description="t('pages.settings.hotsearch.dialogs.attachmentsDirRequired.description')" :ui="{ content: 'sm:max-w-lg', footer: 'justify-end' }" @update:open="eventUpdateOpen">
    <template #footer>
      <div class="flex flex-wrap justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="eventUpdateOpen(false)">
          {{ t('common.actions.cancel') }}
        </UButton>
        <UButton color="primary" :loading="stateSelecting" @click="eventSelectPath">
          {{ t('pages.settings.hotsearch.headMusicActions.chooseAttachmentsDir') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ISettingsHotsearchAttachmentsDirDialogEmits, ISettingsHotsearchAttachmentsDirDialogProps } from '@/components/settings/hotsearch/attachments-dir-dialog/index.types';
/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：Tauri 设置。
 */
const tauriSettings = useTauriSettings();

/**
 * 属性：附件目录确认弹窗属性。
 */
const { open, currentPath } = defineProps<ISettingsHotsearchAttachmentsDirDialogProps>();

/**
 * 事件：附件目录确认弹窗事件。
 */
const emit = defineEmits<ISettingsHotsearchAttachmentsDirDialogEmits>();

/**
 * 状态：是否正在选择附件目录。
 */
const stateSelecting = ref(false);

/**
 * 函数：更新弹窗开关。
 *
 * 统一透传弹窗开关，保持页面与启动期都能复用同一份确认弹窗。
 *
 * # Arguments
 *
 * * `value` - 最新弹窗开关状态。
 *
 * # Returns
 *
 * 无返回值。
 */
const eventUpdateOpen = (value: boolean): void => {
  emit('update:open', value);
};

/**
 * 函数：选择并保存附件目录。
 *
 * 这里直接复用设置页常规中的附件目录保存逻辑，热搜侧只负责在保存成功后继续后续流程。
 *
 * # Returns
 *
 * 无返回值。
 */
const eventSelectPath = async (): Promise<void> => {
  if (stateSelecting.value) {
    return;
  }

  stateSelecting.value = true;

  try {
    const picked = await tauriSettings.setAttachmentsDir(t('pages.settings.hotsearch.dialogs.attachmentsDirRequired.title'), String(currentPath || '').trim());

    if (!picked) {
      return;
    }

    emit('selected', picked);
    emit('update:open', false);
  } finally {
    stateSelecting.value = false;
  }
};
</script>
