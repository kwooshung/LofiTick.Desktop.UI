<template>
  <div>
    <div class="mb-0 flex w-full items-center gap-3 pb-4">
      <div class="flex-1">
        <h3 class="text-highlighted text-base font-semibold">{{ computedSectionTitle }}</h3>
        <p class="text-muted mt-1 text-sm">{{ computedSectionDescription }}</p>
      </div>
    </div>

    <UPageCard variant="outline" :ui="{ root: 'mb-6 rounded-lg', container: 'divide-y divide-default' }">
      <div class="flex items-center justify-between gap-4 not-last:pb-4 max-sm:flex-col max-sm:items-start">
        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="flex min-w-0 flex-wrap items-start gap-2">
            <div class="text-highlighted mb-1 text-base">{{ hotsearchTextGet('pages.settings.hotsearch.fields.podcastGenerateEnabled.label', '本机生成播客') }}</div>
            <UBadge :color="generateOwnerBadgeGet().color" variant="soft">{{ generateOwnerBadgeGet().label }}</UBadge>
          </div>

          <p class="text-muted text-sm">{{ hotsearchTextGet('pages.settings.hotsearch.fields.podcastGenerateEnabled.description', '开启后，由这台机器生成播客。') }}</p>
          <p class="text-muted text-sm">{{ props.generateOwnerDescription }}</p>
        </div>

        <USwitch :model-value="props.generateEnabled" :disabled="props.disabled || props.generateDisabled" :loading="props.generateLoading" @update:model-value="handleGenerateEnabledUpdate" />
      </div>

      <div v-for="item in props.items" :key="item.kind" class="flex items-center justify-between gap-4 not-last:pb-4 max-sm:flex-col max-sm:items-start">
        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="flex min-w-0 flex-wrap items-start gap-2">
            <div class="text-highlighted mb-1 text-base">{{ item.title }}</div>
            <UBadge :color="headMusicRemoteStatusBadgeGet(item).color" variant="soft">{{ headMusicRemoteStatusBadgeGet(item).label }}</UBadge>
            <UBadge :color="headMusicLocalStatusBadgeGet(item).color" variant="soft">{{ headMusicLocalStatusBadgeGet(item).label }}</UBadge>
          </div>

          <p class="text-muted text-sm">{{ item.description }}</p>
          <p v-if="headMusicStatusDescriptionGet(item)" class="text-muted text-sm">{{ headMusicStatusDescriptionGet(item) }}</p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <UButton v-if="item.remoteExists" color="neutral" variant="outline" size="sm" icon="i-lucide:headphones" :disabled="props.disabled" :loading="statePreviewLoadingKind === item.kind" @click="openPreviewModal(item.kind)">
            {{ hotsearchTextGet('pages.settings.hotsearch.actions.previewHeadMusic', '试听') }}
          </UButton>

          <UButton color="primary" :variant="item.remoteExists ? 'soft' : 'solid'" size="sm" icon="i-lucide:upload" :disabled="props.disabled" :loading="item.uploadLoading" @click="openUploadModal(item.kind)">
            {{ item.remoteExists ? hotsearchTextGet('pages.settings.hotsearch.actions.reuploadHeadMusic', '重新上传') : hotsearchTextGet('pages.settings.hotsearch.actions.selectHeadMusic', '选择音乐') }}
          </UButton>
        </div>
      </div>
    </UPageCard>

    <UModal v-model:open="statePreviewModalOpen" :title="computedPreviewDialogTitle" :description="computedPreviewDialogDescription" :ui="{ content: 'sm:max-w-2xl' }">
      <template #body>
        <div v-if="computedPreviewPlaybackUrl" class="space-y-3">
          <div class="border-default bg-elevated/25 rounded-xl border p-3">
            <MediaPlayerPlyr
              type="audio"
              :sources="[
                {
                  src: computedPreviewPlaybackUrl,
                  type: 'audio/mpeg'
                }
              ]"
              :options="computedPlayerOptions"
            />
          </div>

          <div v-if="computedPreviewRemoteAddress" class="border-default bg-default/50 space-y-2 rounded-xl border px-4 py-3">
            <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicPreview.remoteAddress', '原始远程地址') }}</div>
            <ULink raw :to="computedPreviewRemoteAddress" target="_blank" external class="text-primary block text-sm leading-6 break-all no-underline hover:underline">
              {{ computedPreviewRemoteAddress }}
            </ULink>
          </div>
        </div>
        <div v-else-if="computedPreviewLoading" class="space-y-3">
          <div class="border-default bg-default/50 rounded-xl border border-dashed px-4 py-6">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide:loader-circle" class="text-primary size-5 shrink-0 animate-spin" />
              <div class="min-w-0">
                <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicPreview.loadingTitle', '正在获取线上地址') }}</div>
                <div class="text-muted mt-1 text-sm">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicPreview.loadingDescription', '拿到地址后会直接切到播放器。') }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="computedPreviewRemoteAddress" class="space-y-3">
          <div class="border-default bg-default/50 text-muted rounded-xl border border-dashed px-4 py-3 text-sm">
            {{ hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedPreview', '暂时还不能试听。') }}
          </div>

          <div class="border-default bg-default/50 space-y-2 rounded-xl border px-4 py-3">
            <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicPreview.remoteAddress', '原始远程地址') }}</div>
            <ULink raw :to="computedPreviewRemoteAddress" target="_blank" external class="text-primary block text-sm leading-6 break-all no-underline hover:underline">
              {{ computedPreviewRemoteAddress }}
            </ULink>
          </div>
        </div>
        <div v-else class="border-default bg-default/50 text-muted rounded-xl border border-dashed px-4 py-3 text-sm">
          {{ hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedPreview', '暂时还不能试听。') }}
        </div>
      </template>
    </UModal>

    <UModal v-model:open="stateUploadModalOpen" :dismissible="!computedActiveUploadBusy" :title="computedUploadDialogTitle" :description="computedUploadDialogDescription" :ui="{ content: 'sm:max-w-3xl', footer: 'justify-end' }">
      <template #body>
        <div class="space-y-5">
          <div class="rounded-xl transition-colors duration-200" :class="computedUploadDropzoneClass" @dragenter.prevent="handleUploadDragEnter" @dragover.prevent="handleUploadDragOver" @dragleave.prevent="handleUploadDragLeave" @drop.prevent="handleUploadDrop">
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
                  <UButton color="primary" variant="soft" size="sm" icon="i-lucide:folder-up" :disabled="computedActiveUploadBusy" @click.stop.prevent="open()">
                    {{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.selectFile', '选择文件') }}
                  </UButton>

                  <UButton v-if="files" color="neutral" variant="ghost" size="sm" icon="i-lucide:x" :disabled="computedActiveUploadBusy" @click.stop.prevent="removeFile()">
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

            <div v-if="stateUploadDragActive" class="text-primary flex items-center gap-2 px-3 pb-3 text-sm font-medium">
              <UIcon name="i-lucide:arrow-down-to-line" class="size-4 shrink-0" />
              <span>{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.dropActive', '松手后上传这首 MP3') }}</span>
            </div>
          </div>

          <div v-if="stateUploadPreviewUrl" class="space-y-2">
            <div class="text-highlighted text-sm font-medium">{{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.pendingPreview', '待上传预览') }}</div>
            <div class="border-default bg-elevated/25 rounded-xl border p-3">
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
            <div class="border-default bg-elevated/25 rounded-xl border p-3">
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

          <div v-if="computedActiveUploadBusy" class="border-default bg-elevated/20 space-y-2 rounded-xl border px-4 py-3">
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
          <UButton color="primary" :disabled="!stateUploadFile || computedUploadSubmitBusy" :loading="computedUploadSubmitBusy" @click="handleUploadSubmit">
            {{ hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.confirmUpload', '开始上传') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { IMediaPlyrConfig } from '@/components/media/player/plyr/index.types';
import type { ISettingsHotsearchHeadMusicEmits, ISettingsHotsearchHeadMusicItem, ISettingsHotsearchHeadMusicPreviewResult, ISettingsHotsearchHeadMusicProps } from '@/components/settings/hotsearch/head-music/index.types.ts';

/**
 * 属性：热搜开头音乐。
 */
const props = withDefaults(defineProps<ISettingsHotsearchHeadMusicProps>(), {
  disabled: false
});

/**
 * 事件：热搜开头音乐。
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
 * 状态：试听弹窗开关。
 */
const statePreviewModalOpen = ref(false);

/**
 * 状态：当前试听的音乐类型。
 */
const statePreviewKind = ref<THotsearchPodcastHeadMusicKind | null>(null);

/**
 * 状态：当前正在拉取试听地址的音乐类型。
 */
const statePreviewLoadingKind = ref<THotsearchPodcastHeadMusicKind | null>(null);

/**
 * 状态：本次试听拿到的可播放地址。
 */
const statePreviewPlaybackUrl = ref('');

/**
 * 状态：本次试听拿到的原始远端地址。
 */
const statePreviewRemoteAddress = ref('');

/**
 * 状态：当前待上传文件。
 */
const stateUploadFile = ref<File | null>(null);

/**
 * 状态：当前待上传文件预览地址。
 */
const stateUploadPreviewUrl = ref('');

/**
 * 状态：上传区是否处于拖入态。
 */
const stateUploadDragActive = ref(false);

/**
 * 状态：上传区拖入层级计数。
 */
const stateUploadDragDepth = ref(0);

/**
 * 状态：上传提交是否正在执行。
 */
const stateUploadSubmitting = ref(false);

/**
 * 常量：播放器配置。
 */
const computedPlayerOptions: IMediaPlyrConfig = {
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
 * 计算属性：当前试听条目。
 */
const computedPreviewItem = computed<ISettingsHotsearchHeadMusicItem | null>(() => {
  return props.items.find((item) => item.kind === statePreviewKind.value) ?? null;
});

/**
 * 计算属性：当前试听播放地址。
 */
const computedPreviewPlaybackUrl = computed(() => {
  return String(statePreviewPlaybackUrl.value || computedPreviewItem.value?.previewUrl || computedPreviewItem.value?.remoteSourceUrl || '').trim();
});

/**
 * 计算属性：当前试听是否仍在拉取线上地址。
 */
const computedPreviewLoading = computed(() => {
  return statePreviewModalOpen.value && statePreviewLoadingKind.value === statePreviewKind.value;
});

/**
 * 计算属性：当前试听原始远端地址。
 */
const computedPreviewRemoteAddress = computed(() => {
  return String(statePreviewRemoteAddress.value || computedPreviewItem.value?.remoteSourceUrl || computedPreviewItem.value?.previewUrl || '').trim();
});

/**
 * 计算属性：上传区拖入态样式。
 */
const computedUploadDropzoneClass = computed(() => {
  if (!stateUploadDragActive.value) {
    return '';
  }

  return 'bg-primary/6 ring-primary/35 ring-2 ring-inset';
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
  return hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicUpload.description', '选一首开头音乐上传。', {
    title: computedActiveItem.value?.title || ''
  });
});

/**
 * 计算属性：当前试听对话框标题。
 */
const computedPreviewDialogTitle = computed(() => {
  return hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicPreview.title', '{title} 试听', {
    title: computedPreviewItem.value?.title || ''
  });
});

/**
 * 计算属性：当前试听对话框描述。
 */
const computedPreviewDialogDescription = computed(() => {
  return hotsearchTextGet('pages.settings.hotsearch.dialogs.headMusicPreview.description', '这里可以先试听。', {
    title: computedPreviewItem.value?.title || ''
  });
});

/**
 * 计算属性：开头音乐区块标题。
 */
const computedSectionTitle = computed(() => {
  return hotsearchTextGet('pages.settings.hotsearch.sections.headMusic.title', '开头音乐');
});

/**
 * 计算属性：开头音乐区块描述。
 */
const computedSectionDescription = computed(() => {
  return hotsearchTextGet('pages.settings.hotsearch.sections.headMusic.description', '管理生成播客和两种开头音乐。');
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

  return values ? fallback.replace(/\{(\w+)\}/g, (_, token: string) => String(values[token] ?? '')) : fallback;
};

/**
 * 计算属性：当前是否正在上传。
 */
const computedActiveUploadBusy = computed(() => Boolean(computedActiveItem.value?.uploadLoading));

/**
 * 计算属性：上传提交是否繁忙。
 */
const computedUploadSubmitBusy = computed(() => computedActiveUploadBusy.value || stateUploadSubmitting.value);

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
 * 函数：获取开头音乐状态描述。
 * @param {ISettingsHotsearchHeadMusicItem} item 条目
 * @returns {string} 描述
 */
const headMusicStatusDescriptionGet = (item: ISettingsHotsearchHeadMusicItem): string => {
  if (!props.attachmentsDirConfigured) {
    return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedAttachmentsDir', '还没设置附件目录。');
  }

  if (item.localExists && !item.remoteExists) {
    return hotsearchTextGet('pages.settings.hotsearch.status.headMusicCloudMissingAfterLocalReady', '这台机器能用，但云端还没有。');
  }

  if (!item.localExists) {
    if (item.remoteExists) {
      return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedSync', '本地还没有，开启生成时会自动补齐。');
    }

    return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedUpload', '还没有音乐，先选一首上传。');
  }

  if (!item.previewUrl) {
    return hotsearchTextGet('pages.settings.hotsearch.status.headMusicNeedPreview', '暂时还不能试听。');
  }

  return hotsearchTextGet('pages.settings.hotsearch.status.headMusicReady', '已经可以直接用了。');
};

/**
 * 函数：获取播客生成占用徽标。
 * @returns {{ color: 'primary' | 'warning' | 'neutral'; label: string }} 徽标配置
 */
const generateOwnerBadgeGet = (): { color: 'primary' | 'warning' | 'neutral'; label: string } => {
  if (props.generateOwnerExists && props.generateOwnedByCurrentMachine) {
    return {
      color: 'primary',
      label: hotsearchTextGet('pages.settings.hotsearch.status.podcastGenerateOwnedByCurrentMachine', '当前机器已占用')
    };
  }

  if (props.generateOwnerExists) {
    return {
      color: 'warning',
      label: hotsearchTextGet('pages.settings.hotsearch.status.podcastGenerateOwnedByOtherMachine', '其他机器已占用')
    };
  }

  return {
    color: 'neutral',
    label: hotsearchTextGet('pages.settings.hotsearch.status.podcastGenerateOwnerIdle', '当前无人占用')
  };
};

/**
 * 函数：获取列表行状态徽标。
 * @param {ISettingsHotsearchHeadMusicItem} item 条目
 * @returns {{ color: 'success' | 'warning' | 'neutral'; label: string }} 徽标配置
 */
const headMusicLocalStatusBadgeGet = (item: ISettingsHotsearchHeadMusicItem): { color: 'success' | 'warning' | 'neutral'; label: string } => {
  if (!props.attachmentsDirConfigured) {
    return {
      color: 'neutral',
      label: hotsearchTextGet('pages.settings.hotsearch.status.attachmentsDirUnsetShort', '未配置目录')
    };
  }

  if (item.localExists) {
    return {
      color: 'success',
      label: hotsearchTextGet('pages.settings.hotsearch.status.localReady', '本地已就绪')
    };
  }

  return {
    color: 'warning',
    label: hotsearchTextGet('pages.settings.hotsearch.status.localMissing', '本地缺失')
  };
};

/**
 * 函数：获取列表行云端状态徽标。
 * @param {ISettingsHotsearchHeadMusicItem} item 条目
 * @returns {{ color: 'success' | 'warning' | 'neutral'; label: string }} 徽标配置
 */
const headMusicRemoteStatusBadgeGet = (item: ISettingsHotsearchHeadMusicItem): { color: 'success' | 'warning' | 'neutral'; label: string } => {
  if (!props.attachmentsDirConfigured) {
    return {
      color: 'neutral',
      label: hotsearchTextGet('pages.settings.hotsearch.status.attachmentsDirUnsetShort', '未配置目录')
    };
  }

  if (item.remoteExists) {
    return {
      color: 'success',
      label: hotsearchTextGet('pages.settings.hotsearch.status.remoteReady', '云端已就绪')
    };
  }

  return {
    color: 'warning',
    label: hotsearchTextGet('pages.settings.hotsearch.status.remoteMissing', '云端缺失')
  };
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
 * 函数：打开试听弹窗。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 */
const openPreviewModal = async (kind: THotsearchPodcastHeadMusicKind): Promise<void> => {
  if (statePreviewLoadingKind.value) {
    return;
  }

  statePreviewKind.value = kind;
  statePreviewModalOpen.value = true;
  statePreviewPlaybackUrl.value = '';
  statePreviewRemoteAddress.value = '';

  try {
    statePreviewLoadingKind.value = kind;
    const result = await props.previewRequest(kind);
    const normalized = (result ?? {}) as Partial<ISettingsHotsearchHeadMusicPreviewResult>;

    statePreviewPlaybackUrl.value = String(normalized.previewUrl || '').trim();
    statePreviewRemoteAddress.value = String(normalized.remoteAddress || statePreviewPlaybackUrl.value || '').trim();
  } catch {
    // ignore
  } finally {
    statePreviewLoadingKind.value = null;
  }
};

/**
 * 函数：处理本机播客生成开关。
 * @param {boolean} value 最新值
 */
const handleGenerateEnabledUpdate = (value: boolean): void => {
  emit('update:generate-enabled', value);
};

/**
 * 函数：判断拖拽事件里是否包含文件。
 * @param {DragEvent} event 拖拽事件。
 * @returns {boolean} 是否包含文件。
 */
const uploadDragHasFiles = (event: DragEvent): boolean => {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
};

/**
 * 函数：进入上传拖入态。
 * @param {DragEvent} event 拖拽事件。
 * @returns {void} 无返回值。
 */
const handleUploadDragEnter = (event: DragEvent): void => {
  if (computedActiveUploadBusy.value || !uploadDragHasFiles(event)) {
    return;
  }

  stateUploadDragDepth.value += 1;
  stateUploadDragActive.value = true;
};

/**
 * 函数：维持上传拖入态。
 * @param {DragEvent} event 拖拽事件。
 * @returns {void} 无返回值。
 */
const handleUploadDragOver = (event: DragEvent): void => {
  if (computedActiveUploadBusy.value || !uploadDragHasFiles(event)) {
    return;
  }

  stateUploadDragActive.value = true;
};

/**
 * 函数：离开上传拖入态。
 * @param {DragEvent} event 拖拽事件。
 * @returns {void} 无返回值。
 */
const handleUploadDragLeave = (event: DragEvent): void => {
  if (computedActiveUploadBusy.value || !uploadDragHasFiles(event)) {
    return;
  }

  stateUploadDragDepth.value = Math.max(0, stateUploadDragDepth.value - 1);

  if (stateUploadDragDepth.value === 0) {
    stateUploadDragActive.value = false;
  }
};

/**
 * 函数：结束上传拖入态。
 * @returns {void} 无返回值。
 */
const handleUploadDrop = (): void => {
  stateUploadDragDepth.value = 0;
  stateUploadDragActive.value = false;
};

/**
 * 函数：提交上传。
 * @returns {Promise<void>} 无返回值
 */
const handleUploadSubmit = async (): Promise<void> => {
  if (!stateUploadFile.value || !stateUploadKind.value || computedUploadSubmitBusy.value) {
    return;
  }

  stateUploadSubmitting.value = true;

  try {
    await props.uploadRequest(stateUploadKind.value, stateUploadFile.value);
    stateUploadModalOpen.value = false;
  } finally {
    stateUploadSubmitting.value = false;
  }
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

  stateUploadDragActive.value = false;
  stateUploadDragDepth.value = 0;
  stateUploadSubmitting.value = false;
  stateUploadKind.value = null;
  stateUploadFile.value = null;

  if (stateUploadPreviewUrl.value) {
    URL.revokeObjectURL(stateUploadPreviewUrl.value);
    stateUploadPreviewUrl.value = '';
  }
});

/**
 * 侦听：关闭试听弹窗时清理选择状态。
 */
watch(statePreviewModalOpen, (open) => {
  if (open) {
    return;
  }

  statePreviewKind.value = null;
  statePreviewPlaybackUrl.value = '';
  statePreviewRemoteAddress.value = '';
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
