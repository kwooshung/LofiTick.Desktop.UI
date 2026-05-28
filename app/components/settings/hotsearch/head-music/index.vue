<template>
  <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
    <template #header>
      <div class="flex-1">
        <h3 class="text-highlighted text-base font-semibold">{{ hotsearchTextGet('pages.settings.hotsearch.sections.headMusic.title', '固定开头音乐') }}</h3>
        <p class="text-muted mt-1 text-sm leading-6">{{ hotsearchTextGet('pages.settings.hotsearch.sections.headMusic.description', '这里统一管理播客生成占用、普通版开头音乐和 VIP 版开头音乐。') }}</p>
      </div>
    </template>
  </UPageCard>

  <UPageCard variant="outline" :ui="{ root: 'mb-6 rounded-lg', container: 'divide-y divide-default' }">
    <UFormField
      :label="hotsearchTextGet('pages.settings.hotsearch.fields.podcastGenerateEnabled.label', '本机生成播客')"
      :description="hotsearchTextGet('pages.settings.hotsearch.fields.podcastGenerateEnabled.description', '启用后，只有当前机器负责生成热搜播客；开启前会校验云端固定开头音乐和占用锁。')"
      :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
      class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] xl:items-start"
    >
      <div class="flex min-w-0 flex-col items-stretch gap-3 xl:items-end">
        <div class="flex flex-wrap items-center justify-end gap-2">
          <UBadge v-if="props.generateOwnerExists && props.generateOwnedByCurrentMachine" color="primary" variant="soft">
            {{ hotsearchTextGet('pages.settings.hotsearch.status.podcastGenerateOwnedByCurrentMachine', '当前机器已占用') }}
          </UBadge>
          <UBadge v-else-if="props.generateOwnerExists" color="warning" variant="soft">
            {{ hotsearchTextGet('pages.settings.hotsearch.status.podcastGenerateOwnedByOtherMachine', '其他机器已占用') }}
          </UBadge>
          <UBadge v-else color="neutral" variant="soft">
            {{ hotsearchTextGet('pages.settings.hotsearch.status.podcastGenerateOwnerIdle', '当前无人占用') }}
          </UBadge>

          <USwitch :model-value="props.generateEnabled" :disabled="props.disabled" :loading="props.generateLoading" @update:model-value="handleGenerateEnabledUpdate" />
        </div>

        <p class="text-muted max-w-xl text-right text-xs leading-5">{{ props.generateOwnerDescription }}</p>
      </div>
    </UFormField>

    <div class="space-y-3 not-last:pb-4">
      <UAlert v-if="props.generateError" color="warning" variant="soft" icon="i-lucide:triangle-alert" :title="hotsearchTextGet('pages.settings.hotsearch.messages.podcastGenerateErrorTitle', '播客生成不可用')" :description="props.generateError" />
      <UAlert v-if="props.headMusicError" color="warning" variant="soft" icon="i-lucide:audio-lines" :title="hotsearchTextGet('pages.settings.hotsearch.messages.podcastHeadMusicErrorTitle', '固定开头音乐处理失败')" :description="props.headMusicError" />

      <section v-for="item in props.items" :key="item.kind" class="space-y-4 rounded-xl border border-default bg-elevated/18 p-4">
        <div class="grid gap-4 xl:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] xl:gap-6">
          <div class="space-y-2">
            <div>
              <h4 class="text-highlighted text-sm font-semibold">{{ item.title }}</h4>
              <p class="text-muted mt-1 text-sm leading-6">{{ item.description }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2 xl:justify-end">
              <UBadge :color="item.localExists ? 'success' : 'neutral'" variant="soft">
                {{ item.localExists ? hotsearchTextGet('pages.settings.hotsearch.status.localReady', '本地已就绪') : hotsearchTextGet('pages.settings.hotsearch.status.localMissing', '本地缺失') }}
              </UBadge>
              <UBadge :color="item.remoteExists ? 'success' : 'warning'" variant="soft">
                {{ item.remoteExists ? hotsearchTextGet('pages.settings.hotsearch.status.remoteReady', '云端已就绪') : hotsearchTextGet('pages.settings.hotsearch.status.remoteMissing', '云端缺失') }}
              </UBadge>
            </div>

            <div class="rounded-lg border border-default bg-default/70 px-3 py-3">
              <div class="text-muted text-[11px] font-medium tracking-[0.18em] uppercase">{{ hotsearchTextGet('pages.settings.hotsearch.labels.headMusicPath', '固定路径') }}</div>
              <div class="text-highlighted mt-2 break-all text-sm leading-6">{{ item.path || hotsearchTextGet('pages.settings.hotsearch.status.attachmentsDirUnset', '当前还没有配置附件目录。') }}</div>
            </div>
          </div>
        </div>

        <div v-if="item.remoteExists && item.previewUrl" class="rounded-xl border border-default bg-default/65 p-3">
          <div class="mb-2 flex items-center justify-between gap-2">
            <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.currentPreview', '当前线上预览') }}</div>
            <div class="text-muted text-xs">{{ item.title }}</div>
          </div>

          <MediaPlayerPlyr
            type="audio"
            :sources="[
              {
                src: item.previewUrl,
                type: 'audio/mpeg'
              }
            ]"
            :options="computedPlayerOptions"
          />
        </div>

        <div v-else class="rounded-xl border border-dashed border-default bg-default/50 px-4 py-3">
          <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.status.headMusicWaitingTitle', '固定开头音乐还没准备好') }}</div>
          <p class="text-muted mt-1 text-sm leading-6">{{ headMusicWaitingDescriptionGet(item) }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2 xl:justify-end">
          <UButton v-if="!props.attachmentsDirConfigured" color="neutral" variant="outline" size="sm" icon="i-lucide:folder-open" :disabled="props.disabled" @click="props.chooseAttachmentsDirRequest()">
            {{ hotsearchTextGet('pages.settings.hotsearch.actions.chooseAttachmentsDir', '选择附件目录') }}
          </UButton>

          <UButton color="primary" :variant="item.remoteExists ? 'soft' : 'solid'" size="sm" icon="i-lucide:upload" :disabled="props.disabled || !props.attachmentsDirConfigured" :loading="item.uploadLoading" @click="openUploadModal(item.kind)">
            {{ item.remoteExists ? hotsearchTextGet('pages.settings.hotsearch.actions.reuploadHeadMusic', '重新上传') : hotsearchTextGet('pages.settings.hotsearch.actions.selectHeadMusic', '选择音乐') }}
          </UButton>

          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide:download" :disabled="props.disabled || !item.remoteExists || !props.attachmentsDirConfigured" :loading="item.syncLoading" @click="props.syncRequest(item.kind)">
            {{ hotsearchTextGet('pages.settings.hotsearch.actions.syncHeadMusic', '从云端同步') }}
          </UButton>
        </div>
      </section>
    </div>
  </UPageCard>

  <UModal v-model:open="stateUploadModalOpen" :dismissible="!computedActiveUploadBusy" :title="computedUploadDialogTitle" :description="computedUploadDialogDescription" :ui="{ content: 'sm:max-w-3xl', footer: 'justify-end' }">
    <template #body>
      <div class="space-y-5">
        <UFileUpload
          v-model="stateUploadFile"
          accept=".mp3,audio/mpeg"
          :multiple="false"
          variant="area"
          layout="list"
          position="inside"
          :dropzone="true"
          :interactive="!computedActiveUploadBusy"
          :disabled="computedActiveUploadBusy"
          :label="hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.dropLabel', '把 MP3 文件拖到这里')"
          :description="hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.dropDescription', '或者点击下面按钮选择文件。建议保持文件简短、响度稳定。')"
          class="w-full"
        >
          <template #actions="{ files, open, removeFile }">
            <div class="flex flex-wrap items-center gap-2">
              <UButton color="primary" variant="soft" size="sm" icon="i-lucide:folder-up" :disabled="computedActiveUploadBusy" @click="open()">
                {{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.selectFile', '选择文件') }}
              </UButton>

              <UButton v-if="files" color="neutral" variant="ghost" size="sm" icon="i-lucide:x" :disabled="computedActiveUploadBusy" @click="removeFile()">
                {{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.clearFile', '清空选择') }}
              </UButton>
            </div>
          </template>

          <template #file-name="{ file }">
            <div class="text-highlighted text-sm font-medium">{{ file.name }}</div>
          </template>

          <template #file-size="{ file }">
            <div class="text-muted text-xs">{{ fileSizeTextGet(file.size) }}</div>
          </template>
        </UFileUpload>

        <div v-if="stateUploadPreviewUrl" class="space-y-2">
          <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.pendingPreview', '待上传预览') }}</div>
          <div class="rounded-xl border border-default bg-elevated/25 p-3">
            <MediaPlayerPlyr
              type="audio"
              :sources="[
                {
                  src: stateUploadPreviewUrl,
                  type: stateUploadFile?.type || 'audio/mpeg'
                }
              ]"
              :options="computedPlayerOptions"
            />
          </div>
        </div>

        <div v-else-if="computedActiveItem?.previewUrl" class="space-y-2">
          <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.currentPreview', '当前线上预览') }}</div>
          <div class="rounded-xl border border-default bg-elevated/25 p-3">
            <MediaPlayerPlyr
              type="audio"
              :sources="[
                {
                  src: computedActiveItem.previewUrl,
                  type: 'audio/mpeg'
                }
              ]"
              :options="computedPlayerOptions"
            />
          </div>
        </div>

        <div v-if="computedActiveUploadBusy" class="space-y-2 rounded-xl border border-default bg-elevated/20 px-4 py-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.uploadProgress', '上传进度') }}</span>
            <span class="text-muted text-xs">{{ computedActiveUploadProgressText }}</span>
          </div>

          <UProgress :model-value="computedActiveUploadProgress" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap justify-end gap-2">
        <UButton color="neutral" variant="ghost" :disabled="computedActiveUploadBusy" @click="stateUploadModalOpen = false">
          {{ t('common.actions.cancel') }}
        </UButton>
        <UButton color="primary" :disabled="!stateUploadFile" :loading="computedActiveUploadBusy" @click="handleUploadSubmit">
          {{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.confirmUpload', '开始上传') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { THotsearchPodcastHeadMusicKind } from '@@/shared/types/index.types';

import type { ISettingsHotsearchHeadMusicEmits, ISettingsHotsearchHeadMusicItem, ISettingsHotsearchHeadMusicProps } from './index.types';

/**
 * 属性：热搜固定开头音乐。
 */
const props = withDefaults(defineProps<ISettingsHotsearchHeadMusicProps>(), {
  disabled: false,
  generateError: '',
  headMusicError: ''
});

/**
 * 事件：热搜固定开头音乐。
 */
const emit = defineEmits<ISettingsHotsearchHeadMusicEmits>();

/**
 * Hook：国际化。
 */
const { t, te } = useI18n();

/**
 * 状态：上传弹窗开关。
 */
const stateUploadModalOpen = ref(false);

/**
 * 状态：当前上传的音乐类型。
 */
const stateUploadKind = ref<THotsearchPodcastHeadMusicKind | null>(null);

/**
 * 状态：当前待上传文件。
 */
const stateUploadFile = ref<File | null>(null);

/**
 * 状态：当前待上传文件预览地址。
 */
const stateUploadPreviewUrl = ref('');

/**
 * 常量：播放器配置。
 */
const computedPlayerOptions = {
  settings: [],
  controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume']
};

/**
 * 计算属性：当前活动条目。
 */
const computedActiveItem = computed<ISettingsHotsearchHeadMusicItem | null>(() => {
  return props.items.find((item) => item.kind === stateUploadKind.value) ?? null;
});

/**
 * 计算属性：当前上传对话框标题。
 */
const computedUploadDialogTitle = computed(() => {
  return hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.title', '上传 {title}', {
    title: computedActiveItem.value?.title || ''
  });
});

/**
 * 计算属性：当前上传对话框描述。
 */
const computedUploadDialogDescription = computed(() => {
  return hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.description', '支持拖放和点击选择。上传会直接从前端直传到又拍云，并同步写入当前机器的固定路径。', {
    title: computedActiveItem.value?.title || ''
  });
});

/**
 * 函数：获取热搜文案。
 * @param {string} key 文案键
 * @param {string} fallback 回退文本
 * @param {Record<string, unknown>} values 插值参数
 * @returns {string} 文案
 */
const hotsearchTextGet = (key: string, fallback: string, values?: Record<string, unknown>): string => {
  if (te(key)) {
    return t(key, values || {});
  }

  return values
    ? fallback.replace(/\{(\w+)\}/g, (_, token: string) => String(values[token] ?? ''))
    : fallback;
};

/**
 * 计算属性：当前是否正在上传。
 */
const computedActiveUploadBusy = computed(() => Boolean(computedActiveItem.value?.uploadLoading));

/**
 * 计算属性：当前上传进度。
 */
const computedActiveUploadProgress = computed(() => {
  return Math.max(0, Math.min(100, Math.round(computedActiveItem.value?.uploadProgress || 0)));
});

/**
 * 计算属性：当前上传进度文本。
 */
const computedActiveUploadProgressText = computed(() => `${computedActiveUploadProgress.value}%`);

/**
 * 函数：格式化文件大小。
 * @param {number} size 文件大小
 * @returns {string} 文本
 */
const fileSizeTextGet = (size: number): string => {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let next = size;
  let unitIndex = 0;

  while (next >= 1024 && unitIndex < units.length - 1) {
    next /= 1024;
    unitIndex += 1;
  }

  const digits = next >= 100 || unitIndex === 0 ? 0 : 1;
  return `${next.toFixed(digits)} ${units[unitIndex]}`;
};

/**
 * 函数：获取等待描述。
 * @param {ISettingsHotsearchHeadMusicItem} item 条目
 * @returns {string} 描述
 */
const headMusicWaitingDescriptionGet = (item: ISettingsHotsearchHeadMusicItem): string => {
  if (!props.attachmentsDirConfigured) {
    return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedAttachmentsDir', '先设置附件目录，固定开头音乐才能按约定路径落盘并参与播客生成。');
  }

  if (!item.remoteExists) {
    return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedUpload', '云端还没有这份固定开头音乐。请先上传，之后其他机器才能直接同步使用。');
  }

  if (!item.localExists) {
    return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedSync', '云端已经有这份固定开头音乐，但当前机器本地还没落盘。可以直接从云端同步。');
  }

  return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedPreview', '当前音乐已经存在，但暂时还没有可用的预览地址。');
};

/**
 * 函数：打开上传弹窗。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 */
const openUploadModal = (kind: THotsearchPodcastHeadMusicKind): void => {
  stateUploadKind.value = kind;
  stateUploadFile.value = null;
  stateUploadModalOpen.value = true;
};

/**
 * 函数：处理本机播客生成开关。
 * @param {boolean} value 最新值
 */
const handleGenerateEnabledUpdate = (value: boolean): void => {
  emit('update:generateEnabled', value);
  emit('update:generate-enabled', value);
};

/**
 * 函数：提交上传。
 * @returns {Promise<void>} 无返回值
 */
const handleUploadSubmit = async (): Promise<void> => {
  if (!stateUploadFile.value || !stateUploadKind.value) {
    return;
  }

  await props.uploadRequest(stateUploadKind.value, stateUploadFile.value);
  stateUploadModalOpen.value = false;
};

/**
 * 侦听：待上传文件变化时刷新本地预览地址。
 */
watch(stateUploadFile, (file, previousFile) => {
  if (stateUploadPreviewUrl.value) {
    URL.revokeObjectURL(stateUploadPreviewUrl.value);
    stateUploadPreviewUrl.value = '';
  }

  if (!file || file === previousFile) {
    return;
  }

  stateUploadPreviewUrl.value = URL.createObjectURL(file);
});

/**
 * 侦听：关闭上传弹窗时清理选择状态。
 */
watch(stateUploadModalOpen, (open) => {
  if (open) {
    return;
  }

  stateUploadKind.value = null;
  stateUploadFile.value = null;

  if (stateUploadPreviewUrl.value) {
    URL.revokeObjectURL(stateUploadPreviewUrl.value);
    stateUploadPreviewUrl.value = '';
  }
});

/**
 * 生命周期：卸载时清理预览地址。
 */
onBeforeUnmount(() => {
  if (!stateUploadPreviewUrl.value) {
    return;
  }

  URL.revokeObjectURL(stateUploadPreviewUrl.value);
  stateUploadPreviewUrl.value = '';
});
</script>