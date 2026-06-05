<template>
  <DashboardPage>
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedTableRows"
          :loading="loading"
          class="shrink-0"
          sticky
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default align-top',
            separator: 'h-0'
          }"
        />
      </div>
    </div>

    <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ `共 ${Number(datas?.total ?? 0)} 条` }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
      </div>
    </div>

    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="computedEditorModalTitle" :ui="{ content: 'w-[80vw] max-w-[1920px]', footer: 'justify-end' }">
      <template #body>
        <UForm id="hotsearchAdEditorForm" :schema="schema" :state="stateEditor" class="space-y-5">
          <div class="space-y-4">
            <div class="grid gap-4" :class="computedShowPreview && computedIsPortraitPreview ? 'lg:grid-cols-5' : 'lg:grid-cols-1'">
              <div class="border-default bg-elevated/20 min-h-64 rounded-(--ui-radius) border p-4" :class="computedIsPortraitPreview ? 'lg:col-span-3' : ''">
                <div class="space-y-4">
                  <UFormField required name="title" :label="t('pages.ads.hotsearch.form.title')">
                    <UInput v-model="stateEditor.title" :placeholder="t('pages.ads.hotsearch.form.titlePlaceholder')" class="w-full" />
                  </UFormField>

                  <UFormField required name="editionScopes" :label="t('pages.ads.hotsearch.form.editionScopes')">
                    <UCheckboxGroup v-model="stateEditor.editionScopes" :items="editorEditionScopeOptions" value-key="value" label-key="label" orientation="horizontal" variant="card" color="primary" indicator="end" size="sm" :ui="compactCheckboxCardGroupUi(2)" class="w-full" />
                  </UFormField>

                  <UFormField required name="placementType" :label="t('pages.ads.hotsearch.form.placementType')">
                    <URadioGroup v-model="stateEditor.placementType" :items="placementTypeOptions" value-key="value" label-key="label" orientation="horizontal" variant="card" color="primary" indicator="end" size="sm" :ui="compactRadioCardGroupUi(2)" class="w-full" />
                  </UFormField>

                  <UFormField required name="presentationType" :label="t('pages.ads.hotsearch.form.presentationType')">
                    <URadioGroup v-model="stateEditor.presentationType" :items="presentationTypeOptions" value-key="value" label-key="label" orientation="horizontal" variant="card" color="primary" indicator="end" size="sm" :ui="compactRadioCardGroupUi(3)" class="w-full" />
                  </UFormField>

                  <template v-if="stateEditor.presentationType !== 'voice'">
                    <UFormField required name="materialType" :label="t('pages.ads.hotsearch.form.materialType')">
                      <URadioGroup v-model="stateEditor.materialType" :items="materialTypeOptions" value-key="value" label-key="label" orientation="horizontal" variant="card" color="primary" indicator="end" size="sm" :ui="compactRadioCardGroupUi(2)" class="w-full" />
                    </UFormField>

                    <UFormField name="frameType" :label="t('pages.ads.hotsearch.form.frameType')">
                      <URadioGroup v-model="stateEditor.frameType" :items="frameTypeOptions" value-key="value" label-key="label" orientation="horizontal" variant="card" color="primary" indicator="end" size="sm" :ui="compactRadioCardGroupUi(2)" class="w-full" />
                    </UFormField>
                  </template>

                  <UFormField required name="platformIds" :label="t('pages.ads.hotsearch.form.platform')">
                    <USelect v-model="stateEditor.platformIds" multiple :items="editorPlatformOptions" value-key="value" label-key="label" :placeholder="t('pages.ads.hotsearch.form.platformPlaceholder')" size="sm" color="primary" variant="outline" :ui="{ content: 'min-w-fit' }" class="w-full" />
                  </UFormField>

                  <UFormField required name="price" :label="t('pages.ads.hotsearch.form.price')">
                    <UInput v-model="stateEditor.price" type="number" class="w-40" />
                  </UFormField>

                  <UFormField required name="priority" :label="t('pages.ads.hotsearch.form.priority')">
                    <UInputNumber v-model="stateEditor.priority" :step="1" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
                  </UFormField>

                  <UFormField required name="startAt" :label="t('pages.ads.hotsearch.form.startAt')">
                    <UFieldGroup class="w-full">
                      <UPopover>
                        <UInput :model-value="calendarButtonLabelGet(stateEditor.startAt)" readonly class="w-full" :ui="{ base: 'text-left' }" icon="i-lucide:calendar-days" />
                        <template #content>
                          <div class="p-2">
                            <UCalendar :model-value="computedStartDateValue" @update:model-value="handleStartDateUpdate" />
                          </div>
                        </template>
                      </UPopover>

                      <UInputTime :model-value="computedStartTimeValue" granularity="minute" :hour-cycle="24" class="w-44 shrink-0" @update:model-value="handleStartTimeUpdate">
                        <template #trailing>
                          <UIcon name="i-lucide:clock-3" class="text-dimmed size-4" />
                        </template>
                      </UInputTime>
                    </UFieldGroup>
                  </UFormField>
                  <UFormField required name="endAt" label="失效日期">
                    <UFieldGroup class="w-full">
                      <UPopover>
                        <UInput :model-value="calendarButtonLabelGet(stateEditor.endAt)" readonly class="w-full" :ui="{ base: 'text-left' }" icon="i-lucide:calendar-days" />

                        <template #content>
                          <div class="p-2">
                            <UCalendar :model-value="computedEndDateValue" @update:model-value="handleEndDateUpdate" />
                          </div>
                        </template>
                      </UPopover>

                      <UInputTime :model-value="computedEndTimeValue" granularity="minute" :hour-cycle="24" class="w-44 shrink-0" @update:model-value="handleEndTimeUpdate">
                        <template #trailing>
                          <UIcon name="i-lucide:clock-9" class="text-dimmed size-4" />
                        </template>
                      </UInputTime>
                    </UFieldGroup>
                  </UFormField>

                  <UFormField name="notes" label="备注">
                    <UTextarea v-model="stateEditor.notes" :rows="4" autoresize class="w-full" placeholder="记录合作说明、播客插入提示或排期备注。" />
                  </UFormField>
                </div>
              </div>

              <div v-if="computedShowPreview" class="border-default bg-elevated/15 rounded-(--ui-radius) border p-4" :class="computedIsPortraitPreview ? 'lg:col-span-2' : ''">
                <div class="space-y-4">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <div class="text-highlighted text-sm font-medium">主素材预览</div>
                      <div class="text-muted text-xs">{{ computedIsPortraitPreview ? '竖屏 9:16 预览区域' : '横屏 16:9 预览区域' }}</div>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <Spin
                      :loading="stateEditorAssetSelecting || stateEditorAssetLoading"
                      :tip="stateEditorAssetSelecting ? '正在读取所选素材...' : '正在加载素材...'"
                      icon="i-lucide:loader-circle"
                      icon-class="size-4 shrink-0 text-white/88"
                      content-class="flex-row gap-2 rounded-md border border-white/12 bg-black/72 px-3 py-2 text-sm text-white/88"
                      mask-class="rounded-(--ui-radius) bg-black/48"
                      tip-class="text-sm text-white/88"
                      :size="16"
                      :delay="0"
                      overlay
                    >
                      <div ref="previewCanvasContainerElement" class="w-full">
                        <div class="mx-auto" :class="computedPreviewCanvasClass" :style="computedPreviewCanvasStyle">
                          <div v-if="!stateEditor.asset" class="h-full w-full" :class="isTauriRuntime ? 'cursor-pointer' : ''" @click="handlePreviewUploadAreaClick">
                            <UFileUpload
                              v-model="stateEditorAssetFile"
                              :accept="computedAssetDropAccept"
                              :multiple="false"
                              variant="area"
                              layout="list"
                              position="inside"
                              :dropzone="!stateSaving && !stateEditorAssetSelecting"
                              :interactive="!stateSaving && !stateEditorAssetSelecting && !isTauriRuntime"
                              :disabled="stateSaving || stateEditorAssetSelecting"
                              :reset="true"
                              :label="computedAssetUploadLabel"
                              :description="computedAssetUploadDescription"
                              class="h-full w-full"
                            >
                              <template #actions="{ open }">
                                <div class="flex justify-center">
                                  <UButton type="button" color="primary" variant="soft" size="sm" :disabled="stateSaving || stateEditorAssetSelecting" @click.stop.prevent="handlePreviewUploadOpen(open)">选择素材</UButton>
                                </div>
                              </template>
                            </UFileUpload>
                          </div>

                          <UFileUpload
                            v-else
                            v-slot="{ open }"
                            v-model="stateEditorAssetFile"
                            :accept="computedAssetAccept"
                            :multiple="false"
                            :dropzone="false"
                            :interactive="!stateSaving && !stateEditorAssetSelecting"
                            :disabled="stateSaving || stateEditorAssetSelecting"
                            :reset="true"
                            class="h-full w-full"
                          >
                            <div
                              ref="previewStageElement"
                              class="border-default relative h-full w-full overflow-hidden rounded-(--ui-radius) border bg-black"
                              @pointerdown="handlePreviewPointerDown"
                              @pointermove="handlePreviewPointerMove"
                              @pointerup="handlePreviewPointerUp"
                              @pointercancel="handlePreviewPointerUp"
                              @wheel.prevent="handlePreviewWheel"
                            >
                              <div class="absolute inset-0 overflow-hidden bg-black">
                                <div class="absolute inset-0 flex items-center justify-center" :style="computedPreviewMediaTransformStyle">
                                  <img v-if="stateEditor.materialType === 'image'" :src="stateEditor.asset.previewUrl" :alt="stateEditor.asset.originalName" class="h-full w-full object-contain select-none" draggable="false" />
                                  <video v-else class="h-full w-full object-contain select-none" :src="stateEditor.asset.previewUrl" autoplay loop muted playsinline preload="metadata"></video>
                                </div>
                              </div>

                              <div data-preview-control="true" class="pointer-events-auto absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-2">
                                <div class="flex flex-wrap items-center gap-2 rounded-md border border-white/12 bg-black/72 px-2 py-1 text-[11px] text-white/82 backdrop-blur">
                                  <span>{{ fileSizeTextGet(stateEditor.asset.fileSizeBytes) }}</span>
                                  <span v-if="stateEditor.asset.width > 0 && stateEditor.asset.height > 0">{{ `${stateEditor.asset.width} × ${stateEditor.asset.height}` }}</span>
                                  <span v-if="stateEditor.asset.durationMs > 0">{{ durationTextGet(stateEditor.asset.durationMs) }}</span>
                                </div>

                                <div class="flex items-center gap-1">
                                  <UButton type="button" color="neutral" variant="solid" size="xs" icon="i-lucide:zoom-out" class="bg-black/72 text-white ring-1 ring-white/12 backdrop-blur hover:bg-black/82" :disabled="stateSaving" @click.stop.prevent="handlePreviewZoomOut" />
                                  <UButton type="button" color="neutral" variant="solid" size="xs" icon="i-lucide:rotate-ccw" class="bg-black/72 text-white ring-1 ring-white/12 backdrop-blur hover:bg-black/82" :disabled="stateSaving" @click.stop.prevent="handlePreviewTransformReset" />
                                  <UButton type="button" color="neutral" variant="solid" size="xs" icon="i-lucide:zoom-in" class="bg-black/72 text-white ring-1 ring-white/12 backdrop-blur hover:bg-black/82" :disabled="stateSaving" @click.stop.prevent="handlePreviewZoomIn" />
                                </div>
                              </div>

                              <div data-preview-control="true" class="pointer-events-auto absolute inset-x-3 bottom-3 z-10 flex items-center justify-end gap-2">
                                <div class="flex items-center gap-1">
                                  <UButton type="button" color="neutral" variant="solid" size="xs" class="bg-black/72 text-white ring-1 ring-white/12 backdrop-blur hover:bg-black/82" :disabled="stateSaving || stateEditorAssetSelecting" @click.stop.prevent="handlePreviewUploadOpen(open)">
                                    重新上传
                                  </UButton>
                                  <UButton type="button" color="error" variant="solid" size="xs" class="bg-red-950/82 text-white ring-1 ring-red-300/18 backdrop-blur hover:bg-red-900/90" :disabled="stateSaving || stateEditorAssetSelecting" @click.stop.prevent="handlePreviewAssetClear">
                                    删除素材
                                  </UButton>
                                </div>
                              </div>

                              <div v-if="stateEditor.asset.path" class="pointer-events-none absolute inset-x-3 bottom-14 z-10 text-[11px] break-all text-white/72">素材路径：{{ assetPathLabelGet(stateEditor.asset.path) }}</div>
                            </div>
                          </UFileUpload>
                        </div>
                      </div>
                    </Spin>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-default bg-elevated/20 min-h-24 rounded-(--ui-radius) border p-4">
              <section class="space-y-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-highlighted text-sm font-medium">{{ computedEditorAdvertisementTitle }}</div>
                    <div class="text-muted text-xs">{{ computedEditorAdvertisementDescription }}</div>
                  </div>

                  <UButton type="button" color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="stateSaving" @click="handleEditorAdvertisementItemAppend">添加片段</UButton>
                </div>

                <UEmpty v-if="stateEditorAdvertisementItems.length === 0" icon="i-lucide:audio-lines" :title="computedEditorAdvertisementEmptyTitle" :description="computedEditorAdvertisementEmptyDescription" />

                <VueDraggable
                  v-else
                  v-model="stateEditorAdvertisementItems"
                  tag="div"
                  class="podcast-template-draggable"
                  target=".podcast-ad-editor-list"
                  :animation="240"
                  easing="cubic-bezier(0.22, 1, 0.36, 1)"
                  :disabled="stateSaving"
                  direction="vertical"
                  draggable=".podcast-template-item"
                  chosen-class="podcast-template-item-chosen"
                  drag-class="podcast-template-item-drag"
                  ghost-class="podcast-template-item-ghost"
                  handle=".podcast-template-handle"
                  @start="handleEditorAdvertisementDragStart"
                  @end="handleEditorAdvertisementDragEnd"
                >
                  <TransitionGroup tag="div" class="podcast-ad-editor-list space-y-3" type="transition" :name="!stateEditorAdvertisementDragging ? 'podcast-template-sort' : undefined">
                    <div v-for="(item, index) in stateEditorAdvertisementItems" :key="item.renderKey" class="podcast-template-item flex items-center gap-2">
                      <SettingsHotsearchPodcastScriptListItem
                        :item="item"
                        :disabled="stateSaving"
                        editor-mode="advertisement"
                        :voice-options="computedEditorAdvertisementVoiceOptions"
                        :segment-options="[]"
                        :placeholder="computedEditorAdvertisementPlaceholder"
                        :ad-content-placeholder="computedEditorAdvertisementPlaceholder"
                        @update:voice-key="(value) => handleEditorAdvertisementVoiceUpdate(index, value)"
                        @update:content="(value) => handleEditorAdvertisementContentUpdate(index, value)"
                        @remove="handleEditorAdvertisementItemRemove(index)"
                      />
                    </div>
                  </TransitionGroup>
                </VueDraggable>
              </section>
            </div>
          </div>
        </UForm>
      </template>

      <template #footer="{ close }">
        <UButton type="button" color="neutral" variant="outline" @click="close">取消</UButton>
        <UButton type="button" color="neutral" variant="soft" :disabled="!computedCanSubmit || stateSaving" :loading="stateSaving" @click="onSubmit(false)">{{ computedEditorSecondaryActionLabel }}</UButton>
        <UButton type="button" color="primary" :disabled="!computedCanSubmit || stateSaving" :loading="stateSaving" @click="onSubmit(true)">{{ computedEditorPrimaryActionLabel }}</UButton>
      </template>
    </UModal>

    <USlideover
      v-model:open="stateDetailOpen"
      side="right"
      :title="stateDetailRow.title || '未命名广告'"
      description="热搜播客广告物料"
      :ui="{
        content: 'w-auto max-w-140',
        body: 'scrollbar space-y-5',
        title: 'text-highlighted text-lg font-semibold',
        description: 'text-muted'
      }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UBadge :color="stateDetailRow.isEnabled ? 'primary' : 'neutral'" variant="soft">{{ stateDetailRow.isEnabled ? '启用中' : '已停用' }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ presentationTypeLabelGet(stateDetailRow.presentationType) }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ placementTypeLabelGet(stateDetailRow.placementType) }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ materialTypeLabelGet(stateDetailRow.materialType) }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ frameTypeLabelGet(stateDetailRow.frameType) }}</UBadge>
          </div>

          <div v-if="stateDetailRow.asset" class="space-y-3">
            <div class="text-highlighted text-sm font-medium">主素材</div>

            <Spin
              :loading="stateDetailAssetPreviewLoading"
              tip="正在加载素材..."
              icon="i-lucide:loader-circle"
              icon-class="size-4 shrink-0 text-white/88"
              content-class="flex-row gap-2 rounded-md border border-white/12 bg-black/72 px-3 py-2 text-sm text-white/88"
              mask-class="rounded-(--ui-radius) bg-black/48"
              tip-class="text-sm text-white/88"
              :size="16"
              :delay="0"
              overlay
            >
              <div class="border-default overflow-hidden rounded-(--ui-radius) border bg-black" :class="stateDetailRow.frameType === 'portrait' ? 'mx-auto aspect-9/16 max-w-64' : 'aspect-video w-full'">
                <img v-if="stateDetailRow.materialType === 'image' && stateDetailAssetPreviewUrl" :src="stateDetailAssetPreviewUrl" :alt="stateDetailRow.asset.originalName" class="h-full w-full object-contain select-none" draggable="false" />
                <video v-else-if="stateDetailRow.materialType === 'video' && stateDetailAssetPreviewUrl" class="h-full w-full object-contain select-none" :src="stateDetailAssetPreviewUrl" controls playsinline preload="metadata"></video>
                <div v-else class="text-muted flex h-full items-center justify-center text-sm">暂无可预览素材</div>
              </div>
            </Spin>

            <div class="flex flex-wrap gap-2 text-xs">
              <UBadge color="neutral" variant="soft">{{ fileSizeTextGet(stateDetailRow.asset.fileSizeBytes) }}</UBadge>
              <UBadge v-if="stateDetailRow.asset.width > 0 && stateDetailRow.asset.height > 0" color="neutral" variant="soft">{{ `${stateDetailRow.asset.width} × ${stateDetailRow.asset.height}` }}</UBadge>
              <UBadge v-if="stateDetailRow.asset.durationMs > 0" color="neutral" variant="soft">{{ durationTextGet(stateDetailRow.asset.durationMs) }}</UBadge>
            </div>

            <div v-if="stateDetailRow.asset.path" class="text-muted text-xs leading-5 break-all">素材路径：{{ assetPathLabelGet(stateDetailRow.asset.path) }}</div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">适用栏目</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ editionScopeLabelGet(stateDetailRow.editionScope) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">素材类型</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ materialTypeLabelGet(stateDetailRow.materialType) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">价格</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ priceTextGet(stateDetailRow.price) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">优先级</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ stateDetailRow.priority }}</div>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">生效时间</span>
              <Datetime :datetime="stateDetailRow.startAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">失效时间</span>
              <Datetime :datetime="stateDetailRow.endAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">更新时间</span>
              <Datetime :datetime="stateDetailRow.updatedAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">创建时间</span>
              <Datetime :datetime="stateDetailRow.createdAt" mode="datetime" />
            </div>
          </div>
        </div>
      </template>
    </USlideover>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import { CalendarDate, parseTime } from '@internationalized/date';
import type { TableColumn } from '@nuxt/ui';
import type { InputTimeProps } from '@nuxt/ui/runtime/components/InputTime.vue';
import { convertFileSrc } from '@tauri-apps/api/core';
import { VueDraggable } from 'vue-draggable-plus';
import { z } from 'zod';

import type { THotsearchAdDeliveryPlatformKind } from '@@/shared/types/index.types';
import type { IHotsearchAdMaterialAsset, IHotsearchAdMaterialDetail, IHotsearchAdMaterialSummaryRow, IPageAdHotsearchEditorAsset } from '@@/shared/types/pages/ad/hotsearch/index.types';
import { hotsearchAdDeliveryPlatformOptionsGet, hotsearchAdEditionScopeOptionsGet, hotsearchPodcastAdAssetRemotePathCreate, hotsearchPodcastVoiceOptionsGet } from '@@/shared/utils';

type TAdInputTimeValue = InputTimeProps['modelValue'];
/**
 * 函数：判断是否为单个日期值。
 * @param {unknown} value 日历更新值。
 * @returns {value is DateValue} 是否为单个日期值。
 */
const isSingleCalendarDateValue = (value: unknown): value is DateValue => {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return false;
  }

  return 'year' in value && 'month' in value && 'day' in value;
};

/**
 * 组件：日期时间。
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：浮层提示。
 */
const UPopover = resolveComponent('UPopover');

/**
 * 组件：复选框。
 */
const UCheckbox = resolveComponent('UCheckbox');

/**
 * 组件：开关。
 */
const USwitch = resolveComponent('USwitch');

/**
 * 组件：分页。
 */
const UPagination = resolveComponent('UPagination');

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：提示消息。
 */
const toast = useToast();

/**
 * Hook：Tauri 运行时。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置能力。
 */
const { hotsearchAdAssetWrite, hotsearchAdAssetEnsureDownloaded } = useTauriSettings();

/**
 * Hook：Tauri 窗口能力。
 */
const { openFileContent } = useTauriWindow();

const props = withDefaults(defineProps<IPageAdHotsearchProps>(), {
  createNonce: 0
});

/**
 * 路由。
 */
const route = useRoute();

/**
 * 状态：编辑器开关。
 */
const stateEditorOpen = ref(false);

/**
 * 状态：删除确认浮层的目标行 ID。
 */
const stateDeletePopoverOpenId = ref<number | null>(null);

/**
 * 状态：保存中。
 */
const stateSaving = ref(false);

/**
 * 状态：详情面板是否打开。
 */
const stateDetailOpen = ref(false);

/**
 * 状态：详情素材预览地址。
 */
const stateDetailAssetPreviewUrl = ref('');

/**
 * 状态：详情素材预览加载中。
 */
const stateDetailAssetPreviewLoading = ref(false);

/**
 * 状态：编辑器素材文件。
 */
const stateEditorAssetFile = ref<File | null>(null);

/**
 * 状态：编辑器素材加载中。
 */
const stateEditorAssetLoading = ref(false);

/**
 * 状态：编辑器素材选择中。
 */
const stateEditorAssetSelecting = ref(false);

/**
 * 函数：创建默认广告内容片段。
 * @param {string} voiceKey 播报角色。
 * @param {string} content 文本内容。
 * @returns {object} 默认片段。
 */
const createEditorAdvertisementItem = (voiceKey: 'M' | 'F' | 'R' = 'M', content = '') => ({
  renderKey: generateIdBase36(10),
  voiceKey,
  content,
  segmentType: 'adContent' as const
});

/**
 * 状态：广告内容片段列表。
 */
const stateEditorAdvertisementItems = ref([createEditorAdvertisementItem()]);

/**
 * 状态：广告内容拖拽中。
 */
const stateEditorAdvertisementDragging = ref(false);

/**
 * 状态：预览画布容器元素。
 */
const previewCanvasContainerElement = ref<HTMLDivElement | null>(null);

/**
 * 状态：预览舞台元素。
 */
const previewStageElement = ref<HTMLDivElement | null>(null);

/**
 * 状态：预览画布可用宽度。
 */
const statePreviewCanvasAvailableWidth = ref(0);

/**
 * 状态：预览舞台尺寸。
 */
const statePreviewStageSize = reactive({ width: 0, height: 0 });

/**
 * 状态：预览缩放比例。
 */
const statePreviewScale = ref(1);

/**
 * 状态：预览位移。
 */
const statePreviewOffset = reactive({ x: 0, y: 0 });

/**
 * 状态：预览拖拽中。
 */
const statePreviewDragging = reactive({ active: false, pointerId: -1, startX: 0, startY: 0, originX: 0, originY: 0 });

/**
 * 变量：预览舞台尺寸观察器。
 */
let previewStageObserver: ResizeObserver | null = null;

/**
 * 状态：详情行。
 */
const stateDetailRow = ref<IHotsearchAdMaterialSummaryRow>({
  id: 0,
  title: '',
  presentationType: 'voice',
  materialType: 'none',
  frameType: 'none',
  editionScope: 'both',
  placementType: 'opening',
  price: 0,
  priority: 0,
  isEnabled: false,
  startAt: '',
  endAt: '',
  updatedAt: '',
  createdAt: '',
  asset: null
});

/**
 * 函数：格式化本地日期时间。
 * @param {Date} value 日期对象。
 * @returns {string} 本地日期时间。
 */
const localDateTimeValueCreate = (value: Date): string => {
  const pad = (input: number) => String(input).padStart(2, '0');

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

/**
 * 函数：生成默认适用平台列表。
 * @returns {number[]} 默认平台 ID 列表。
 */
const editorPlatformIdsDefaultCreate = (): number[] => [];

/**
 * 函数：规范化编辑器平台列表。
 * @param {unknown} value 平台列表。
 * @returns {number[]} 规范化后的平台 ID 列表。
 */
const editorPlatformIdsNormalize = (value: unknown): number[] => {
  const platformIds = new Set(adDeliveryPlatformOptions.map((item) => item.id));

  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = Array.from(new Set(value.map((item) => Number(item)).filter((item) => Number.isInteger(item) && platformIds.has(item))));

  return normalized;
};

/**
 * 函数：根据呈现方式与画幅解析投放平台类型。
 * @param {IPageAdHotsearchEditorForm['presentationType']} presentationType 呈现方式。
 * @param {IPageAdHotsearchEditorForm['frameType']} frameType 画幅类型。
 * @returns {THotsearchAdDeliveryPlatformKind} 投放平台类型。
 */
const editorRequiredPlatformKindResolve = (presentationType: IPageAdHotsearchEditorForm['presentationType'], frameType: IPageAdHotsearchEditorForm['frameType']): THotsearchAdDeliveryPlatformKind | null => {
  if (presentationType === 'voice') {
    return 'audio';
  }

  if (frameType === 'landscape' || frameType === 'portrait') {
    return frameType;
  }

  return null;
};

/**
 * 函数：按投放平台类型规范化平台列表。
 * @param {unknown} value 平台列表。
 * @param {THotsearchAdDeliveryPlatformKind} requiredKind 目标平台类型。
 * @returns {number[]} 规范化后的平台 ID 列表。
 */
const editorPlatformIdsByKindNormalize = (value: unknown, requiredKind: THotsearchAdDeliveryPlatformKind | null): number[] => {
  const normalized = editorPlatformIdsNormalize(value);

  if (!requiredKind) {
    return normalized;
  }

  return normalized.filter((id) => adDeliveryPlatformKindMap.value.get(id) === requiredKind);
};

/**
 * 函数：同步当前表单允许的投放平台。
 */
const editorPlatformIdsAllowedSync = (): void => {
  const requiredKind = editorRequiredPlatformKindResolve(stateEditor.value.presentationType, stateEditor.value.frameType);
  const normalized = editorPlatformIdsByKindNormalize(stateEditor.value.platformIds, requiredKind);

  if (normalized.length !== stateEditor.value.platformIds.length || normalized.some((id, index) => id !== stateEditor.value.platformIds[index])) {
    stateEditor.value.platformIds = normalized;
  }
};

/**
 * 函数：生成默认编辑器状态。
 * @returns {IPageAdHotsearchEditorForm} 默认状态。
 */
const editorDefaultStateCreate = (): IPageAdHotsearchEditorForm => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0);

  return {
    id: 0,
    title: '',
    presentationType: 'voice',
    materialType: 'none',
    frameType: 'none',
    editionScopes: ['morning', 'evening'],
    placementType: 'opening',
    platformIds: editorPlatformIdsDefaultCreate(),
    price: 0,
    priority: 0,
    asset: null,
    notes: '',
    isEnabled: false,
    startAt: localDateTimeValueCreate(todayStart),
    endAt: localDateTimeValueCreate(todayEnd)
  };
};

/**
 * 状态：编辑器表单。
 */
const stateEditor = ref<IPageAdHotsearchEditorForm>(editorDefaultStateCreate());

/**
 * 常量：广告类型选项。
 */
const presentationTypeBaseOptions = [
  { label: '口播', value: 'voice' },
  { label: '画中画', value: 'pip' },
  { label: '拼接', value: 'montage' }
];

const presentationTypeOptions = computed(() => presentationTypeBaseOptions);

/**
 * 常量：广告位置选项。
 */
const placementTypeOptions = [
  { label: '开头广告', value: 'opening' },
  { label: '结尾广告', value: 'closing' }
];

/**
 * 函数：构建紧凑单选卡片组样式。
 * @param {number} columns 列数。
 * @returns {{ fieldset: string; item: string; container: string; wrapper: string; label: string; base: string }} 组件样式。
 */
const compactRadioCardGroupUi = (columns: number): { fieldset: string; item: string; container: string; wrapper: string; label: string; base: string } => ({
  fieldset: `grid w-full gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`,
  item: 'border-default bg-default min-h-10 rounded-(--ui-radius) px-3 py-2 has-data-[state=checked]:border-default',
  container: 'flex h-full items-center',
  wrapper: 'flex min-h-full items-center',
  label: 'leading-none',
  base: 'self-center'
});

/**
 * 函数：构建紧凑复选卡片组样式。
 * @param {number} columns 列数。
 * @returns {{ fieldset: string; item: string; container: string; wrapper: string; label: string; base: string }} 组件样式。
 */
const compactCheckboxCardGroupUi = (columns: number): { fieldset: string; item: string; container: string; wrapper: string; label: string; base: string } => ({
  fieldset: `grid w-full gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`,
  item: 'border-default bg-default min-h-10 rounded-(--ui-radius) px-3 py-2 has-data-[state=checked]:border-default',
  container: 'flex h-full items-center',
  wrapper: 'flex min-h-full items-center',
  label: 'leading-none',
  base: 'self-center'
});

/**
 * 常量：素材类型选项。
 */
const materialTypeOptions = [
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' }
];

/**
 * 常量：画幅类型选项。
 */
const frameTypeOptions = [
  { label: '横版', value: 'landscape' },
  { label: '竖版', value: 'portrait' }
];

/**
 * 常量：编辑器栏目范围选项。
 */
const editorEditionScopeOptions = hotsearchAdEditionScopeOptionsGet();

const adDeliveryPlatformOptions = hotsearchAdDeliveryPlatformOptionsGet();

/**
 * 计算属性：当前表单需要的投放平台类型。
 */
const computedEditorRequiredPlatformKind = computed(() => editorRequiredPlatformKindResolve(stateEditor.value.presentationType, stateEditor.value.frameType));

/**
 * 计算属性：编辑器适用平台选项。
 */
const editorPlatformOptions = computed(() => {
  return adDeliveryPlatformOptions
    .filter((item) => !computedEditorRequiredPlatformKind.value || item.deliveryKind === computedEditorRequiredPlatformKind.value)
    .map((item) => ({
      label: t(item.labelKey),
      value: item.id
    }));
});

const adDeliveryPlatformKindMap = computed(() => {
  return new Map(adDeliveryPlatformOptions.map((item) => [item.id, item.deliveryKind]));
});

/**
 * 常量：表单校验。
 */
const schema = z
  .object({
    title: z.string().trim().min(1, '请填写广告标题').max(120, '广告标题不能超过 120 个字符'),
    presentationType: z.enum(['voice', 'pip', 'montage']),
    materialType: z.enum(['none', 'image', 'video']),
    frameType: z.enum(['none', 'landscape', 'portrait']),
    editionScopes: z.array(z.enum(['morning', 'evening'])).min(1, '请至少选择一个适用栏目'),
    placementType: z.enum(['opening', 'closing']),
    platformIds: z.array(z.number().int().positive()).min(1, '请至少选择一个投放平台'),
    price: z.number().min(0, '价格必须大于等于 0'),
    priority: z.number().int('优先级必须是整数'),
    asset: z
      .object({
        originalName: z.string().trim().min(1, '请选择素材文件'),
        mimeType: z.string().trim().min(1, '素材类型不正确'),
        fileExt: z.string().trim().min(1, '素材扩展名不能为空'),
        fileSizeBytes: z.number().positive('素材大小必须大于 0'),
        width: z.number().min(0),
        height: z.number().min(0),
        durationMs: z.number().min(0),
        previewUrl: z.string().trim().min(1)
      })
      .nullable(),
    notes: z.string().max(500, '备注不能超过 500 个字符'),
    startAt: z
      .string()
      .trim()
      .min(1, '请选择生效时间')
      .refine((value) => !Number.isNaN(new Date(value).getTime()), '生效时间格式不正确'),
    endAt: z
      .string()
      .trim()
      .min(1, '请选择失效时间')
      .refine((value) => !Number.isNaN(new Date(value).getTime()), '失效时间格式不正确')
  })
  .superRefine((value, ctx) => {
    if (value.presentationType === 'voice' && value.materialType !== 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['materialType'], message: '口播呈现方式的素材类型必须是无素材' });
    }

    if (value.presentationType !== 'voice' && value.materialType === 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['materialType'], message: '非口播呈现方式必须选择图片或视频素材' });
    }

    if (value.materialType === 'none' && value.frameType !== 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['frameType'], message: '无素材广告的画幅类型必须是不区分' });
    }

    if (value.materialType !== 'none' && value.frameType === 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['frameType'], message: '图片或视频素材必须指定画幅类型' });
    }

    if (value.materialType !== 'none' && !value.asset) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: '请选择对应的图片或视频素材' });
    }

    if (value.materialType === 'image' && value.asset?.mimeType && !value.asset.mimeType.startsWith('image/')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: '图片广告必须上传图片素材' });
    }

    if (value.materialType === 'video' && value.asset?.mimeType && !value.asset.mimeType.startsWith('video/')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: '视频广告必须上传视频素材' });
    }

    if (new Date(value.startAt).getTime() > new Date(value.endAt).getTime()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endAt'], message: '失效时间必须大于等于生效时间' });
    }

    const requiredPlatformKind = editorRequiredPlatformKindResolve(value.presentationType, value.frameType);

    if (requiredPlatformKind && value.platformIds.some((id) => adDeliveryPlatformKindMap.value.get(id) !== requiredPlatformKind)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['platformIds'], message: '投放平台必须匹配当前口播或画幅类型' });
    }
  });

/**
 * 计算属性：表单是否可提交。
 */
const computedCanSubmit = computed(() => schema.safeParse({ ...stateEditor.value }).success);

/**
 * 计算属性：编辑器弹窗标题。
 */
const computedEditorModalTitle = computed(() => (stateEditor.value.id > 0 ? '修改广告' : '添加广告'));

/**
 * 计算属性：编辑器次按钮文案。
 */
const computedEditorSecondaryActionLabel = computed(() => (stateEditor.value.id > 0 ? '修改但不启用' : '保存不启用'));

/**
 * 计算属性：编辑器主按钮文案。
 */
const computedEditorPrimaryActionLabel = computed(() => (stateEditor.value.id > 0 ? '修改并启用' : '保存并启用'));

/**
 * 状态：分页大小 cookie。
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow'
});

/**
 * API：上传策略快照。
 */
const {
  datas: stateUpyunDirectUploadPolicy,
  error: stateUpyunDirectUploadPolicyError,
  refresh: refreshUpyunDirectUploadPolicyPost
} = await useApi<Record<string, unknown>>('storages/upyun/files/direct-upload/policy', {
  method: 'POST',
  immediate: false
});

/**
 * API：又拍云对象签名地址。
 */
const { datas: stateUpyunObjectUrl, refresh: refreshUpyunObjectUrlGet } = await useApi<{ url: string }>('storages/upyun/files/objects/url', {
  immediate: false
});

/**
 * 函数：获取当前生效分页大小。
 * @returns {string} 分页大小文本。
 */
const currentPageSizeGet = (): string => {
  const routeValue = typeof route.query.pagesize === 'string' ? route.query.pagesize.trim() : '';

  if (routeValue !== '') {
    return routeValue;
  }

  return String(getPageSizeByCookieParsed(pagesizesCookie.value, 'ad-hotsearch'));
};

/**
 * 函数：从路由查询参数构建接口查询参数。
 * @returns {Record<string, string>} 查询参数。
 */
const buildApiQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {};
  const keyword = typeof route.query.keyword === 'string' ? route.query.keyword.trim() : '';
  const editionScope = typeof route.query.editionScope === 'string' ? route.query.editionScope.trim() : '';
  const enabled = typeof route.query.enabled === 'string' ? route.query.enabled.trim() : '';
  const orderBy = typeof route.query.order_by === 'string' ? route.query.order_by.trim() : typeof route.query.orderBy === 'string' ? route.query.orderBy.trim() : '';
  const orderDir = typeof route.query.order_dir === 'string' ? route.query.order_dir.trim() : typeof route.query.orderDir === 'string' ? route.query.orderDir.trim() : '';
  const page = typeof route.query.page === 'string' ? route.query.page.trim() : '';
  const pageSize = currentPageSizeGet();

  if (keyword !== '') {
    query.keyword = keyword;
  }

  if (editionScope !== '') {
    query.editionScope = editionScope;
  }

  if (enabled !== '') {
    query.enabled = enabled;
  }

  if (orderBy !== '') {
    query.orderBy = orderBy;
  }

  if (orderDir !== '') {
    query.orderDir = orderDir;
  }

  if (page !== '') {
    query.page = page;
  }

  if (pageSize !== '') {
    query.pageSize = pageSize;
  }

  return query;
};

/**
 * 函数：获取当前排序字段。
 * @returns {string} 排序字段。
 */
const hotsearchOrderByCurrentGet = (): 'id' | 'updated' | 'created' => {
  const by = typeof route.query.order_by === 'string' ? route.query.order_by.trim() : typeof route.query.orderBy === 'string' ? route.query.orderBy.trim() : '';

  if (by === 'id' || by === 'created') {
    return by;
  }

  return 'updated';
};

/**
 * 函数：获取当前排序方向。
 * @returns {string} 排序方向。
 */
const hotsearchOrderDirCurrentGet = (): 'asc' | 'desc' => {
  const dir = typeof route.query.order_dir === 'string' ? route.query.order_dir.trim().toLowerCase() : typeof route.query.orderDir === 'string' ? route.query.orderDir.trim().toLowerCase() : '';

  return dir === 'asc' ? 'asc' : 'desc';
};

/**
 * 事件：切换排序。
 * @param {string} field 排序字段。
 */
const _toggleSort = (field: 'id' | 'updated' | 'created') => {
  const currentBy = hotsearchOrderByCurrentGet();
  const currentDir = hotsearchOrderDirCurrentGet();
  const nextDir = currentBy === field && currentDir === 'asc' ? 'desc' : 'asc';
  const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;

  q.order_by = field;
  q.order_dir = nextDir;
  q.page = '1';

  navigateTo({ path: route.path, query: q });
};

/**
 * 函数：构建平台筛选跳转位置。
 * @param {string} platformType 平台类型。
 * @returns {object} 跳转位置。
 */
const buildPlatformLocation = (platformType: string): { path: string; query: Record<string, string | string[] | undefined> } => ({
  path: route.path,
  query: {
    ...route.query,
    platform: platformType || undefined,
    page: '1'
  } as Record<string, string | string[] | undefined>
});

/**
 * API：热搜广告物料列表。
 */
const { datas, loading, refreshDebounced } = await useApi<IHotsearchAdMaterialPage>('hotsearch/ads/materials', {
  datas: buildApiQueryFromRoute(),
  immediate: true
});

/**
 * API：新增热搜广告物料。
 */
const { refresh: refreshCreate } = await useApi<IHotsearchAdMaterialSaveResult>('hotsearch/ads/materials', {
  method: 'POST',
  immediate: false
});

/**
 * 函数：将时间文本转换为 UInputTime 可用值。
 * @param {string} value 时间文本。
 * @param {string} fallback 回退时间。
 * @returns {TAdInputTimeValue} 时间值。
 */
const timeValueFromText = (value: string, fallback: string): TAdInputTimeValue => {
  const normalized = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  try {
    return parseTime(normalized) as unknown as TAdInputTimeValue;
  } catch {
    return parseTime(fallback) as unknown as TAdInputTimeValue;
  }
};

/**
 * 函数：将 UInputTime 值格式化为 HH:mm。
 * @param {TAdInputTimeValue} value 时间值。
 * @param {string} fallback 回退时间。
 * @returns {string} 时间文本。
 */
const textFromTimeValue = (value: TAdInputTimeValue, fallback: string): string => {
  if (!value) {
    return fallback;
  }

  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
};

/**
 * 函数：提取日期部分。
 * @param {string} value 日期时间文本。
 * @returns {string} 日期文本。
 */
const datePartGet = (value: string): string => {
  const matched = /^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}$/.exec(String(value || '').trim());

  return matched?.[1] ?? '';
};

/**
 * 函数：提取时间部分。
 * @param {string} value 日期时间文本。
 * @param {string} fallback 回退时间。
 * @returns {string} 时间文本。
 */
const timePartGet = (value: string, fallback: string): string => {
  const matched = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})$/.exec(String(value || '').trim());

  return matched?.[1] ?? fallback;
};

/**
 * 函数：合并日期与时间为本地日期时间。
 * @param {string} dateText 日期文本。
 * @param {string} timeText 时间文本。
 * @returns {string} 本地日期时间。
 */
const localDateTimeMerge = (dateText: string, timeText: string): string => `${dateText}T${timeText}`;

/**
 * 函数：解析本地日期时间为日历日期。
 * @param {string} value 本地日期时间。
 * @returns {CalendarDate} 日历日期。
 */
const calendarDateFromDateTimeGet = (value: string): CalendarDate | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}$/.exec(String(value || '').trim());

  if (!matched) {
    return undefined;
  }

  return new CalendarDate(Number(matched[1]), Number(matched[2]), Number(matched[3]));
};

/**
 * 函数：格式化日历日期为 ISO 日期。
 * @param {DateValue} value 日历日期。
 * @returns {string} ISO 日期。
 */
const calendarIsoDateGet = (value: DateValue): string => {
  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
};

/**
 * 函数：获取日历按钮文案。
 * @param {string} value 本地日期时间。
 * @returns {string} 日期按钮文案。
 */
const calendarButtonLabelGet = (value: string): string => {
  const dateText = datePartGet(value);

  return dateText === '' ? '请选择日期' : dateText.replaceAll('-', '/');
};

/**
 * 函数：读取媒体元数据。
 * @param {string} materialType 素材类型。
 * @param {string} previewUrl 本地预览地址。
 * @returns {Promise<{ width: number; height: number; durationMs: number }>} 元数据。
 */
const mediaMetadataRead = async (materialType: 'image' | 'video', previewUrl: string): Promise<{ width: number; height: number; durationMs: number }> => {
  if (!import.meta.client) {
    return { width: 0, height: 0, durationMs: 0 };
  }

  if (materialType === 'image') {
    return await new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        resolve({
          width: image.naturalWidth || 0,
          height: image.naturalHeight || 0,
          durationMs: 0
        });
      };
      image.onerror = () => {
        resolve({ width: 0, height: 0, durationMs: 0 });
      };
      image.src = previewUrl;
    });
  }

  return await new Promise((resolve) => {
    const video = document.createElement('video');

    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        durationMs: Number.isFinite(video.duration) ? Math.max(0, Math.round(video.duration * 1000)) : 0
      });

      video.removeAttribute('src');
      video.load();
    };
    video.onerror = () => {
      resolve({ width: 0, height: 0, durationMs: 0 });
      video.removeAttribute('src');
      video.load();
    };
    video.src = previewUrl;
  });
};

/**
 * 函数：将服务端时间转换为编辑器本地时间。
 * @param {unknown} value 服务端时间。
 * @param {string} fallback 回退值。
 * @returns {string} 编辑器本地时间。
 */
const localDateTimeInputValueGet = (value: unknown, fallback: string): string => {
  const normalized = hotsearchDatetimeValueGet(value);

  if (normalized === '') {
    return fallback;
  }

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return localDateTimeValueCreate(date);
};

/**
 * 函数：构建素材扩展名。
 * @param {File} file 文件。
 * @returns {string} 扩展名。
 */
const fileExtGet = (file: File): string => {
  const matched = /\.([^.]+)$/.exec(file.name.trim());

  return matched?.[1]?.toLowerCase() ?? '';
};

/**
 * 常量：图片素材扩展名白名单。
 */
const IMAGE_FILE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif', 'svg']);

/**
 * 常量：视频素材扩展名白名单。
 */
const VIDEO_FILE_EXTENSIONS = new Set(['mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi', 'mpeg', 'mpg']);

/**
 * 常量：图片素材文件过滤器扩展名。
 */
const IMAGE_FILE_FILTER_EXTENSIONS = Array.from(IMAGE_FILE_EXTENSIONS);

/**
 * 常量：视频素材文件过滤器扩展名。
 */
const VIDEO_FILE_FILTER_EXTENSIONS = Array.from(VIDEO_FILE_EXTENSIONS);

/**
 * 函数：判断文件是否符合当前素材类型。
 * @param {string} materialType 素材类型。
 * @param {File} file 文件。
 * @returns {boolean} 是否符合素材类型。
 */
const materialTypeMatchesFile = (materialType: 'image' | 'video', file: File): boolean => {
  const mimeType = String(file.type || '').toLowerCase();
  const extension = fileExtGet(file);

  if (materialType === 'image') {
    return mimeType.startsWith('image/') || IMAGE_FILE_EXTENSIONS.has(extension);
  }

  return mimeType.startsWith('video/') || VIDEO_FILE_EXTENSIONS.has(extension);
};

/**
 * 函数：根据文件名推断素材 MIME。
 * @param {string} fileName 文件名。
 * @param {string} materialType 素材类型。
 * @returns {string} MIME。
 */
const fileMimeTypeGuess = (fileName: string, materialType: 'image' | 'video'): string => {
  const extension = String(fileName.split('.').pop() || '')
    .trim()
    .toLowerCase();

  if (materialType === 'image') {
    if (extension === 'jpg' || extension === 'jpeg') {
      return 'image/jpeg';
    }

    if (extension === 'svg') {
      return 'image/svg+xml';
    }

    return extension === '' ? 'image/*' : `image/${extension}`;
  }

  if (extension === 'mov') {
    return 'video/quicktime';
  }

  if (extension === 'm4v') {
    return 'video/x-m4v';
  }

  if (extension === 'mpg') {
    return 'video/mpeg';
  }

  return extension === '' ? 'video/*' : `video/${extension}`;
};

/**
 * 函数：将 Base64 文本转为字节数组。
 * @param {string} base64 Base64 文本。
 * @returns {Uint8Array} 字节数组。
 */
const base64BytesDecode = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

/**
 * 函数：构建素材选择对话框参数。
 * @param {string} materialType 素材类型。
 * @returns {IOpenFilePayload} 对话框参数。
 */
const assetOpenFilePayloadBuild = (materialType: 'image' | 'video'): IOpenFilePayload => {
  return {
    title: materialType === 'image' ? '选择图片素材' : '选择视频素材',
    filters: [
      {
        name: materialType === 'image' ? '图片文件' : '视频文件',
        extensions: materialType === 'image' ? IMAGE_FILE_FILTER_EXTENSIONS : VIDEO_FILE_FILTER_EXTENSIONS
      }
    ]
  };
};

/**
 * 函数：提示素材类型不匹配。
 * @param {string} materialType 素材类型。
 */
const assetTypeMismatchToastShow = (materialType: 'image' | 'video'): void => {
  toast.add({
    description: materialType === 'image' ? '当前仅支持图片素材' : '当前仅支持视频素材',
    color: 'error',
    icon: 'i-lucide:triangle-alert',
    duration: 2500,
    type: 'foreground',
    close: false
  });
};

/**
 * 函数：将原生文件选择结果转为浏览器 File。
 * @param {IOpenFileContentResult} result 原生选择结果。
 * @param {string} materialType 素材类型。
 * @returns {File} 文件对象。
 */
const tauriOpenFileResultToFile = (result: IOpenFileContentResult, materialType: 'image' | 'video'): File => {
  const bytes = base64BytesDecode(result.base64);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

  return new File([buffer], result.fileName, {
    type: fileMimeTypeGuess(result.fileName, materialType)
  });
};

/**
 * 函数：格式化文件大小。
 * @param {number} size 文件大小。
 * @returns {string} 文本。
 */
const fileSizeTextGet = (size: number): string => {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

/**
 * 函数：格式化时长。
 * @param {number} durationMs 时长毫秒。
 * @returns {string} 文本。
 */
const durationTextGet = (durationMs: number): string => {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * 函数：将未知值转为普通对象。
 * @param {unknown} input 输入值。
 * @returns {Record<string, unknown>} 普通对象。
 */
const toRecord = (input: unknown): Record<string, unknown> | null => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }

  return input as Record<string, unknown>;
};

/**
 * 函数：确保内部 useApi 请求成功。
 * @param {unknown} input useApi error。
 * @param {string} message 失败文案。
 */
const ensureInternalUseApiSucceeded = (input: unknown, message: string): void => {
  if (!input) {
    return;
  }

  throw new Error(message);
};

/**
 * 函数：请求直传策略快照。
 * @param {Record<string, unknown>} body 请求体。
 * @param {string} errorMessage 失败文案。
 * @returns {Promise<Record<string, unknown>>} 策略快照。
 */
const requestUpyunDirectUploadPolicySnapshot = async (body: Record<string, unknown>, errorMessage: string): Promise<Record<string, unknown>> => {
  await refreshUpyunDirectUploadPolicyPost({
    body,
    ignoreResponseError: true
  });

  ensureInternalUseApiSucceeded(stateUpyunDirectUploadPolicyError.value, errorMessage);
  return toRecord(stateUpyunDirectUploadPolicy.value) ?? {};
};

/**
 * 函数：构建素材公开地址。
 * @param {string} path 文件路径。
 * @returns {string} 公共地址。
 */
/**
 * 函数：创建素材保存路径。
 * @param {File} file 文件。
 * @returns {string} 保存路径。
 */
const editorAssetPathCreate = (file: File): string => {
  return hotsearchPodcastAdAssetRemotePathCreate(fileExtGet(file));
};

/**
 * 函数：上传当前主素材。
 * @param {File} file 待上传文件。
 * @param {IPageAdHotsearchEditorAsset} asset 本地素材元数据。
 * @returns {Promise<IHotsearchAdMaterialAsset>} 已上传素材。
 */
const uploadEditorAssetFile = async (file: File, asset: IPageAdHotsearchEditorAsset): Promise<IHotsearchAdMaterialAsset> => {
  const errorMessage = '素材上传失败';
  const draftPath = editorAssetPathCreate(file);

  if (!isTauriRuntime.value) {
    throw new Error('当前环境不支持写入附件目录');
  }

  const policy = await requestUpyunDirectUploadPolicySnapshot(
    {
      save_key: draftPath,
      expires_in_sec: 1800
    },
    errorMessage
  );
  const uploadUrl = String(policy.upload_url ?? '').trim();
  const uploadPolicy = String(policy.policy ?? '').trim();
  const authorization = String(policy.authorization ?? '').trim();
  const resolvedPath = String(policy.save_key ?? draftPath).trim();

  if (!uploadUrl || !uploadPolicy || !authorization || !resolvedPath) {
    throw new Error(errorMessage);
  }

  const localBytes = Array.from(new Uint8Array(await file.arrayBuffer()));
  await hotsearchAdAssetWrite(resolvedPath.replace(/^\//, ''), localBytes);

  const formData = new FormData();
  formData.set('policy', uploadPolicy);
  formData.set('authorization', authorization);
  formData.set('save-key', resolvedPath);
  formData.set('file', file);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', uploadUrl, true);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      reject(new Error(errorMessage));
    });
    xhr.addEventListener('error', () => reject(new Error(errorMessage)));
    xhr.addEventListener('abort', () => reject(new Error(errorMessage)));
    xhr.send(formData);
  });

  return {
    path: resolvedPath,
    originalName: asset.originalName,
    mimeType: asset.mimeType,
    fileExt: asset.fileExt,
    fileSizeBytes: asset.fileSizeBytes,
    width: asset.width,
    height: asset.height,
    durationMs: asset.durationMs,
    clipStartMs: asset.clipStartMs,
    clipEndMs: asset.clipEndMs,
    posXRatio: asset.posXRatio,
    posYRatio: asset.posYRatio,
    widthRatio: asset.widthRatio,
    heightRatio: asset.heightRatio,
    zIndex: asset.zIndex
  };
};

/**
 * 函数：将编辑器素材转换为保存素材。
 * @param {IPageAdHotsearchEditorAsset} asset 编辑器素材。
 * @returns {IHotsearchAdMaterialAsset} 可保存素材。
 */
const editorAssetPayloadBuild = (asset: IPageAdHotsearchEditorAsset): IHotsearchAdMaterialAsset => {
  return {
    path: String(asset.path ?? '').trim(),
    originalName: asset.originalName,
    mimeType: asset.mimeType,
    fileExt: asset.fileExt,
    fileSizeBytes: asset.fileSizeBytes,
    width: asset.width,
    height: asset.height,
    durationMs: asset.durationMs,
    clipStartMs: asset.clipStartMs,
    clipEndMs: asset.clipEndMs,
    posXRatio: asset.posXRatio,
    posYRatio: asset.posYRatio,
    widthRatio: asset.widthRatio,
    heightRatio: asset.heightRatio,
    zIndex: asset.zIndex
  };
};

/**
 * 函数：解析素材预览地址。
 * @param {IHotsearchAdMaterialAsset} asset 主素材。
 * @param {string} errorMessage 失败文案。
 * @returns {Promise<string>} 预览地址。
 */
const assetPreviewUrlResolve = async (asset: IHotsearchAdMaterialAsset | null | undefined, errorMessage: string): Promise<string> => {
  const path = String(asset?.path ?? '').trim();

  if (!asset || path === '') {
    return '';
  }

  await refreshUpyunObjectUrlGet({
    datas: {
      path,
      ttl_sec: 600
    },
    replace: true
  });

  const signedUrl = String(stateUpyunObjectUrl.value?.url ?? '').trim();
  if (signedUrl === '') {
    throw new Error(errorMessage);
  }

  let previewUrl = signedUrl;
  const localCachePath = path.replace(/^\//, '');

  if (isTauriRuntime.value && localCachePath !== '') {
    const result = await hotsearchAdAssetEnsureDownloaded(localCachePath, signedUrl);

    previewUrl = convertFileSrc(result.filePath);
  }

  return previewUrl;
};

/**
 * 函数：规范化素材路径展示文本。
 * @param {string} path 素材路径。
 * @returns {string} 展示文本。
 */
const assetPathLabelGet = (path: string): string => {
  return (
    String(path ?? '')
      .trim()
      .replace(/^\/?(?:assets|files)\//, '') || '-'
  );
};

/**
 * 函数：恢复编辑器预览布局。
 * @param {object} asset 主素材。
 */
const editorPreviewLayoutRestore = (asset: Pick<IPageAdHotsearchEditorAsset, 'widthRatio' | 'posXRatio' | 'posYRatio'>): void => {
  statePreviewScale.value = previewScaleClamp(asset.widthRatio);

  nextTick(() => {
    previewCanvasAvailableWidthSync();
    previewStageSizeSync();

    const clampedOffset = previewOffsetClamp(statePreviewStageSize.width > 0 ? statePreviewStageSize.width * asset.posXRatio : 0, statePreviewStageSize.height > 0 ? statePreviewStageSize.height * asset.posYRatio : 0, statePreviewScale.value);

    statePreviewOffset.x = clampedOffset.x;
    statePreviewOffset.y = clampedOffset.y;
  });
};

/**
 * 函数：构建编辑器素材状态。
 * @param {IHotsearchAdMaterialAsset} asset 主素材。
 * @returns {Promise<IPageAdHotsearchEditorAsset>} 编辑器素材。
 */
const editorAssetStateBuild = async (asset: IHotsearchAdMaterialAsset): Promise<IPageAdHotsearchEditorAsset> => {
  const previewUrl = await assetPreviewUrlResolve(asset, '获取广告素材签名地址失败');

  return {
    path: asset.path,
    originalName: asset.originalName,
    mimeType: asset.mimeType,
    fileExt: asset.fileExt,
    fileSizeBytes: asset.fileSizeBytes,
    width: asset.width,
    height: asset.height,
    durationMs: asset.durationMs,
    clipStartMs: asset.clipStartMs,
    clipEndMs: asset.clipEndMs,
    posXRatio: asset.posXRatio,
    posYRatio: asset.posYRatio,
    widthRatio: asset.widthRatio,
    heightRatio: asset.heightRatio,
    zIndex: asset.zIndex,
    previewUrl
  };
};

/**
 * 函数：清空编辑器素材。
 */
const editorAssetClear = (): void => {
  const previewUrl = String(stateEditor.value.asset?.previewUrl ?? '').trim();

  stateEditorAssetLoading.value = false;
  handlePreviewTransformReset();

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  stateEditor.value.asset = null;
};

/**
 * 函数：重置编辑器。
 */
const editorReset = (): void => {
  editorAssetClear();
  stateEditorAssetFile.value = null;
  stateEditorAdvertisementItems.value = [createEditorAdvertisementItem()];
  stateEditor.value = editorDefaultStateCreate();
};

/**
 * 函数：将详情栏目范围映射为编辑器字段。
 * @param {string} value 栏目范围。
 * @returns {Array<string>} 编辑器栏目范围。
 */
const editorEditionScopesBuild = (value: string): Array<'morning' | 'evening'> => {
  if (value === 'morning') {
    return ['morning'];
  }

  if (value === 'evening') {
    return ['evening'];
  }

  return ['morning', 'evening'];
};

/**
 * 计算属性：开始日期值。
 */
const computedStartDateValue = computed(() => calendarDateFromDateTimeGet(stateEditor.value.startAt));

/**
 * 计算属性：结束日期值。
 */
const computedEndDateValue = computed(() => calendarDateFromDateTimeGet(stateEditor.value.endAt));

/**
 * 计算属性：开始时间值。
 */
const computedStartTimeValue = computed(() => timeValueFromText(timePartGet(stateEditor.value.startAt, '00:00'), '00:00'));

/**
 * 计算属性：结束时间值。
 */
const computedEndTimeValue = computed(() => timeValueFromText(timePartGet(stateEditor.value.endAt, '23:59'), '23:59'));

/**
 * 计算属性：是否显示主素材预览区域。
 */
const computedShowPreview = computed(() => stateEditor.value.presentationType !== 'voice');

/**
 * 计算属性：是否为竖屏预览布局。
 */
const computedIsPortraitPreview = computed(() => stateEditor.value.presentationType !== 'voice' && stateEditor.value.frameType === 'portrait');

/**
 * 计算属性：广告内容标题。
 */
const computedEditorAdvertisementTitle = computed(() => {
  return '广告内容';
});

/**
 * 计算属性：广告内容说明。
 */
const computedEditorAdvertisementDescription = computed(() => {
  return '这部分用于编辑广告内容，支持逐句编辑和拖拽排序。';
});

/**
 * 计算属性：广告内容为空标题。
 */
const computedEditorAdvertisementEmptyTitle = computed(() => {
  return '还没有广告内容';
});

/**
 * 计算属性：广告内容为空说明。
 */
const computedEditorAdvertisementEmptyDescription = computed(() => {
  return '先添加一段广告文案，再按播报顺序拖拽调整。';
});

/**
 * 计算属性：广告内容输入占位。
 */
const computedEditorAdvertisementPlaceholder = computed(() => {
  return '输入广告播报内容';
});

/**
 * 计算属性：广告内容播报角色选项。
 */
const computedEditorAdvertisementVoiceOptions = computed(() => {
  const labels: Record<'M' | 'F' | 'R', string> = {
    M: '男声',
    F: '女声',
    R: '随机'
  };

  return hotsearchPodcastVoiceOptionsGet().map((item) => ({
    value: item.value,
    label: labels[item.value]
  }));
});

/**
 * 计算属性：预览画布尺寸类名。
 */
const computedPreviewCanvasClass = computed(() => 'w-full');

/**
 * 计算属性：预览画布自适应尺寸样式。
 * @returns {{ width: string; height: string } | { width: string; aspectRatio: string }} 样式对象。
 */
const computedPreviewCanvasStyle = computed(() => {
  const frameRatio = computedIsPortraitPreview.value ? 9 / 16 : 16 / 9;
  const availableWidth = statePreviewCanvasAvailableWidth.value;

  if (availableWidth > 0) {
    return {
      width: `${availableWidth}px`,
      height: `${availableWidth / frameRatio}px`
    };
  }

  if (computedIsPortraitPreview.value) {
    return {
      aspectRatio: '9 / 16',
      width: '100%'
    };
  }

  return {
    aspectRatio: '16 / 9',
    width: '100%'
  };
});

/**
 * 计算属性：素材原始宽高比。
 */
const computedPreviewAssetAspectRatio = computed(() => {
  const asset = stateEditor.value.asset;

  if (asset && asset.width > 0 && asset.height > 0) {
    return asset.width / asset.height;
  }

  return computedIsPortraitPreview.value ? 9 / 16 : 16 / 9;
});

/**
 * 计算属性：素材在舞台内 contain 后的基础尺寸。
 */
const computedPreviewBaseMediaSize = computed(() => {
  const stageWidth = statePreviewStageSize.width;
  const stageHeight = statePreviewStageSize.height;

  if (stageWidth <= 0 || stageHeight <= 0) {
    return { width: 0, height: 0 };
  }

  const stageAspectRatio = stageWidth / stageHeight;
  const assetAspectRatio = computedPreviewAssetAspectRatio.value;

  if (assetAspectRatio >= stageAspectRatio) {
    return {
      width: stageWidth,
      height: stageWidth / assetAspectRatio
    };
  }

  return {
    width: stageHeight * assetAspectRatio,
    height: stageHeight
  };
});

/**
 * 函数：同步预览画布可用宽度。
 */
const previewCanvasAvailableWidthSync = (): void => {
  const element = previewCanvasContainerElement.value;

  if (!element) {
    statePreviewCanvasAvailableWidth.value = 0;
    return;
  }

  statePreviewCanvasAvailableWidth.value = element.clientWidth;
};

/**
 * 函数：同步预览舞台尺寸。
 */
const previewStageSizeSync = (): void => {
  const element = previewStageElement.value;

  if (!element) {
    statePreviewStageSize.width = 0;
    statePreviewStageSize.height = 0;
    return;
  }

  statePreviewStageSize.width = element.clientWidth;
  statePreviewStageSize.height = element.clientHeight;
};

/**
 * 函数：限制预览偏移，确保素材边缘始终位于黑色舞台内。
 * @param {number} x 横向偏移。
 * @param {number} y 纵向偏移。
 * @param {number} scale 缩放值。
 * @returns {{ x: number; y: number }} 合法偏移。
 */
const previewOffsetClamp = (x: number, y: number, scale = statePreviewScale.value): { x: number; y: number } => {
  const stageWidth = statePreviewStageSize.width;
  const stageHeight = statePreviewStageSize.height;
  const baseWidth = computedPreviewBaseMediaSize.value.width;
  const baseHeight = computedPreviewBaseMediaSize.value.height;

  if (stageWidth <= 0 || stageHeight <= 0 || baseWidth <= 0 || baseHeight <= 0) {
    return { x: 0, y: 0 };
  }

  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;
  const maxOffsetX = scaledWidth <= stageWidth ? (stageWidth - scaledWidth) / 2 : 0;
  const maxOffsetY = scaledHeight <= stageHeight ? (stageHeight - scaledHeight) / 2 : 0;

  return {
    x: Math.min(maxOffsetX, Math.max(-maxOffsetX, x)),
    y: Math.min(maxOffsetY, Math.max(-maxOffsetY, y))
  };
};

/**
 * 计算属性：预览媒体位移缩放样式。
 * @returns {{ transform: string; transformOrigin: string; cursor: string }} 样式对象。
 */
const computedPreviewMediaTransformStyle = computed(() => ({
  transform: `translate3d(${statePreviewOffset.x}px, ${statePreviewOffset.y}px, 0) scale(${statePreviewScale.value})`,
  transformOrigin: 'center center',
  cursor: statePreviewDragging.active ? 'grabbing' : 'grab'
}));

/**
 * 函数：限制预览缩放比例。
 * @param {number} value 缩放值。
 * @returns {number} 合法缩放值。
 */
const previewScaleClamp = (value: number): number => Math.min(1, Math.max(0.15, Number.isFinite(value) ? value : 1));

/**
 * 事件：打开上传选择。
 * @param {() => void} open 文件上传打开函数。
 */
const handlePreviewUploadOpen = async (open: () => void): Promise<void> => {
  if (stateSaving.value || stateEditorAssetSelecting.value) {
    return;
  }

  const materialType = stateEditor.value.materialType;
  if (!isTauriRuntime.value || (materialType !== 'image' && materialType !== 'video')) {
    open();
    return;
  }

  stateEditorAssetSelecting.value = true;

  try {
    const result = await openFileContent(assetOpenFilePayloadBuild(materialType));
    if (!result) {
      return;
    }

    const nextFile = tauriOpenFileResultToFile(result, materialType);
    if (!materialTypeMatchesFile(materialType, nextFile)) {
      stateEditorAssetFile.value = null;
      editorAssetClear();
      assetTypeMismatchToastShow(materialType);
      return;
    }

    stateEditorAssetFile.value = nextFile;
  } finally {
    stateEditorAssetSelecting.value = false;
  }
};

/**
 * 事件：点击空素材上传区域。
 *
 * Tauri 环境下复用选择素材按钮的原生文件读取入口。
 */
const handlePreviewUploadAreaClick = (): void => {
  if (!isTauriRuntime.value) {
    return;
  }

  void handlePreviewUploadOpen(() => undefined);
};

/**
 * 事件：清空当前素材并回到上传空态。
 */
const handlePreviewAssetClear = (): void => {
  if (stateSaving.value) {
    return;
  }

  stateEditorAssetFile.value = null;
  editorAssetClear();
};

/**
 * 事件：重置预览位移与缩放。
 */
const handlePreviewTransformReset = (): void => {
  statePreviewScale.value = 1;
  statePreviewOffset.x = 0;
  statePreviewOffset.y = 0;
  statePreviewDragging.active = false;
  statePreviewDragging.pointerId = -1;
};

/**
 * 事件：预览放大。
 */
const handlePreviewZoomIn = (): void => {
  statePreviewScale.value = previewScaleClamp(statePreviewScale.value + 0.1);
  const clampedOffset = previewOffsetClamp(statePreviewOffset.x, statePreviewOffset.y);

  statePreviewOffset.x = clampedOffset.x;
  statePreviewOffset.y = clampedOffset.y;
};

/**
 * 事件：预览缩小。
 */
const handlePreviewZoomOut = (): void => {
  statePreviewScale.value = previewScaleClamp(statePreviewScale.value - 0.1);
  const clampedOffset = previewOffsetClamp(statePreviewOffset.x, statePreviewOffset.y);

  statePreviewOffset.x = clampedOffset.x;
  statePreviewOffset.y = clampedOffset.y;
};

/**
 * 事件：滚轮缩放预览。
 * @param {WheelEvent} event 滚轮事件。
 */
const handlePreviewWheel = (event: WheelEvent): void => {
  if (!stateEditor.value.asset) {
    return;
  }

  statePreviewScale.value = previewScaleClamp(statePreviewScale.value + (event.deltaY < 0 ? 0.1 : -0.1));
  const clampedOffset = previewOffsetClamp(statePreviewOffset.x, statePreviewOffset.y);

  statePreviewOffset.x = clampedOffset.x;
  statePreviewOffset.y = clampedOffset.y;
};

/**
 * 事件：开始拖拽预览。
 * @param {PointerEvent} event 指针事件。
 */
const handlePreviewPointerDown = (event: PointerEvent): void => {
  if (!stateEditor.value.asset) {
    return;
  }

  const eventTarget = event.target;

  if (eventTarget instanceof HTMLElement && eventTarget.closest('[data-preview-control="true"]')) {
    return;
  }

  const target = event.currentTarget as HTMLElement | null;

  statePreviewDragging.active = true;
  statePreviewDragging.pointerId = event.pointerId;
  statePreviewDragging.startX = event.clientX;
  statePreviewDragging.startY = event.clientY;
  statePreviewDragging.originX = statePreviewOffset.x;
  statePreviewDragging.originY = statePreviewOffset.y;

  target?.setPointerCapture(event.pointerId);
};

/**
 * 事件：拖拽移动预览。
 * @param {PointerEvent} event 指针事件。
 */
const handlePreviewPointerMove = (event: PointerEvent): void => {
  if (!statePreviewDragging.active || statePreviewDragging.pointerId !== event.pointerId) {
    return;
  }

  const clampedOffset = previewOffsetClamp(statePreviewDragging.originX + (event.clientX - statePreviewDragging.startX), statePreviewDragging.originY + (event.clientY - statePreviewDragging.startY));

  statePreviewOffset.x = clampedOffset.x;
  statePreviewOffset.y = clampedOffset.y;
};

/**
 * 事件：结束拖拽预览。
 * @param {PointerEvent} event 指针事件。
 */
const handlePreviewPointerUp = (event: PointerEvent): void => {
  if (statePreviewDragging.pointerId !== event.pointerId) {
    return;
  }

  const target = event.currentTarget as HTMLElement | null;

  statePreviewDragging.active = false;
  statePreviewDragging.pointerId = -1;
  target?.releasePointerCapture(event.pointerId);
};

/**
 * 计算属性：素材接收类型。
 */
const computedAssetAccept = computed(() => {
  if (stateEditor.value.materialType === 'image') {
    return 'image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif,.svg';
  }

  if (stateEditor.value.materialType === 'video') {
    return 'video/*,.mp4,.mov,.m4v,.webm,.mkv,.avi,.mpeg,.mpg';
  }

  return undefined;
});

/**
 * 计算属性：空态拖放接收类型。
 */
const computedAssetDropAccept = computed(() => {
  return isTauriRuntime.value ? '*' : computedAssetAccept.value;
});

/**
 * 计算属性：素材上传标题。
 */
const computedAssetUploadLabel = computed(() => {
  return stateEditor.value.materialType === 'image' ? '把图片拖到这里' : '把视频拖到这里';
});

/**
 * 计算属性：素材上传说明。
 */
const computedAssetUploadDescription = computed(() => {
  return stateEditor.value.materialType === 'image' ? '支持常见图片格式，建议提前准备清晰主视觉。' : '支持常见视频格式，建议先裁切到最终投放片段。';
});

watch(
  () => [previewCanvasContainerElement.value, previewStageElement.value, stateEditor.value.asset?.width ?? 0, stateEditor.value.asset?.height ?? 0, stateEditor.value.frameType] as const,
  () => {
    nextTick(() => {
      previewCanvasAvailableWidthSync();
      previewStageSizeSync();

      const clampedOffset = previewOffsetClamp(statePreviewOffset.x, statePreviewOffset.y);

      statePreviewOffset.x = clampedOffset.x;
      statePreviewOffset.y = clampedOffset.y;
    });
  }
);

watch(
  () => [previewCanvasContainerElement.value, previewStageElement.value] as const,
  ([canvasElement, stageElement]) => {
    previewStageObserver?.disconnect();

    previewCanvasAvailableWidthSync();

    if (!stageElement) {
      statePreviewStageSize.width = 0;
      statePreviewStageSize.height = 0;
    }

    previewStageSizeSync();

    if (!previewStageObserver) {
      previewStageObserver = new ResizeObserver(() => {
        previewCanvasAvailableWidthSync();
        previewStageSizeSync();

        const clampedOffset = previewOffsetClamp(statePreviewOffset.x, statePreviewOffset.y);

        statePreviewOffset.x = clampedOffset.x;
        statePreviewOffset.y = clampedOffset.y;
      });
    }

    if (canvasElement) {
      previewStageObserver.observe(canvasElement);
    }

    if (stageElement) {
      previewStageObserver.observe(stageElement);
    }
  }
);

watch(
  () => statePreviewScale.value,
  () => {
    const clampedOffset = previewOffsetClamp(statePreviewOffset.x, statePreviewOffset.y);

    statePreviewOffset.x = clampedOffset.x;
    statePreviewOffset.y = clampedOffset.y;
  }
);

/**
 * 函数：获取呈现方式文案。
 * @param {IHotsearchAdMaterialSummaryRow['presentationType']} value 呈现方式。
 * @returns {string} 文案。
 */
const presentationTypeLabelGet = (value: IHotsearchAdMaterialSummaryRow['presentationType']): string => {
  if (value === 'voice') {
    return '口播';
  }

  if (value === 'pip') {
    return '画中画';
  }

  if (value === 'montage') {
    return '拼接';
  }

  return value;
};

/**
 * 函数：获取广告位置文案。
 * @param {IHotsearchAdMaterialSummaryRow['placementType']} value 广告位置。
 * @returns {string} 文案。
 */
const placementTypeLabelGet = (value: IHotsearchAdMaterialSummaryRow['placementType']): string => {
  if (value === 'opening') {
    return '开头';
  }

  if (value === 'closing') {
    return '结尾';
  }

  return value;
};

/**
 * 函数：获取素材类型文案。
 * @param {IHotsearchAdMaterialSummaryRow['materialType']} value 素材类型。
 * @returns {string} 文案。
 */
const materialTypeLabelGet = (value: IHotsearchAdMaterialSummaryRow['materialType']): string => {
  if (value === 'none') {
    return '无';
  }

  if (value === 'image') {
    return '图片';
  }

  if (value === 'video') {
    return '视频';
  }

  return value;
};

/**
 * 函数：获取画幅文案。
 * @param {IHotsearchAdMaterialSummaryRow['frameType']} value 画幅类型。
 * @returns {string} 文案。
 */
const frameTypeLabelGet = (value: IHotsearchAdMaterialSummaryRow['frameType']): string => {
  if (value === 'none') {
    return '无';
  }

  if (value === 'landscape') {
    return '横屏';
  }

  if (value === 'portrait') {
    return '竖屏';
  }

  return value;
};

/**
 * 函数：获取栏目范围文案。
 * @param {IHotsearchAdMaterialSummaryRow['editionScope']} value 栏目范围。
 * @returns {string} 文案。
 */
const editionScopeLabelGet = (value: IHotsearchAdMaterialSummaryRow['editionScope']): string => {
  if (value === 'morning') {
    return '早报';
  }

  if (value === 'evening') {
    return '晚报';
  }

  if (value === 'both') {
    return '早报、晚报';
  }

  return value;
};

/**
 * 函数：获取价格文案。
 * @param {number} value 价格。
 * @returns {string} 文案。
 */
const priceTextGet = (value: number): string => `¥${Number(value ?? 0).toFixed(2)}`;

/**
 * 函数：根据画幅映射平台文案。
 * @param {IHotsearchAdMaterialSummaryRow['frameType']} frameType 画幅类型。
 * @returns {string} 平台文案。
 */
const platformLabelGet = (frameType: IHotsearchAdMaterialSummaryRow['frameType']): string => {
  if (frameType === 'landscape') {
    return 'B站/头条/西瓜视频/微博/皮皮虾/皮皮搞笑/YouTube';
  }

  if (frameType === 'portrait') {
    return '抖音/小红书/快手';
  }

  return '音频平台';
};

/**
 * 函数：渲染栏目复选框（只读）。
 * @param {IPageTableColumnHotsearchAdMaterial} item 表格行。
 * @returns {VNode} 栏目节点。
 */
const editionScopeReadonlyCheckboxesRender = (item: IPageTableColumnHotsearchAdMaterial) => {
  const morningChecked = item.editionScope === 'morning' || item.editionScope === 'both';
  const eveningChecked = item.editionScope === 'evening' || item.editionScope === 'both';

  return h('div', { class: 'flex flex-col gap-1 text-xs' }, [
    h('div', { class: 'flex items-center gap-1.5' }, [h(UCheckbox, { modelValue: morningChecked, disabled: true }), h('span', { class: 'text-muted' }, '早报')]),
    h('div', { class: 'flex items-center gap-1.5' }, [h(UCheckbox, { modelValue: eveningChecked, disabled: true }), h('span', { class: 'text-muted' }, '晚报')])
  ]);
};
/**
 * 计算属性：表格数据。
 */
const computedTableRows = computed<IPageTableColumnHotsearchAdMaterial[]>(() => {
  if (!datas.value?.rows || datas.value.rows.length === 0) {
    return [];
  }

  const rows = datas.value.rows.map((item) => ({
    id: Number(item.id ?? 0),
    title: String(item.title ?? ''),
    presentationType: String(item.presentationType ?? ''),
    materialType: String(item.materialType ?? ''),
    frameType: String(item.frameType ?? ''),
    editionScope: String(item.editionScope ?? ''),
    editionMorning: String(item.editionScope ?? '') === 'morning' || String(item.editionScope ?? '') === 'both',
    editionEvening: String(item.editionScope ?? '') === 'evening' || String(item.editionScope ?? '') === 'both',
    platformIds: Array.isArray(item.platformIds) ? item.platformIds.map((value) => Number(value)) : [],
    platformKeyFirst: (() => {
      const pids = Array.isArray(item.platformIds) ? item.platformIds : [];
      if (!pids || pids.length === 0) {
        return '';
      }
      const opt = adDeliveryPlatformOptions.find((o) => o.id === Number(pids[0]));
      return opt ? opt.key : '';
    })(),
    placementType: String(item.placementType ?? ''),
    priceText: priceTextGet(Number(item.price ?? 0)),
    priority: Number(item.priority ?? 0),
    isEnabled: Boolean(item.isEnabled),
    startAt: hotsearchDatetimeValueGet(item.startAt),
    endAt: hotsearchDatetimeValueGet(item.endAt),
    updatedAt: hotsearchDatetimeValueGet(item.updatedAt),
    createdAt: hotsearchDatetimeValueGet(item.createdAt)
  }));

  const by = hotsearchOrderByCurrentGet();
  const dir = hotsearchOrderDirCurrentGet();
  const factor = dir === 'asc' ? 1 : -1;

  rows.sort((left, right) => {
    if (by === 'id') {
      return (left.id - right.id) * factor;
    }

    if (by === 'created') {
      return (Date.parse(left.createdAt) - Date.parse(right.createdAt)) * factor;
    }

    return (Date.parse(left.updatedAt) - Date.parse(right.updatedAt)) * factor;
  });

  return rows;
});

/**
 * 函数：读取热搜广告详情。
 * @param {number} id 广告 ID。
 * @returns {Promise<IHotsearchAdMaterialDetail>} 广告详情。
 */
const hotsearchAdMaterialDetailGet = async (id: number): Promise<IHotsearchAdMaterialDetail> => {
  const {
    datas: detailDatas,
    error: detailError,
    refresh: refreshDetail
  } = await useApi<IHotsearchAdMaterialDetail>(`hotsearch/ads/materials/${id}`, {
    immediate: false
  });

  await refreshDetail({ replace: true });
  ensureInternalUseApiSucceeded(detailError.value, '读取广告详情失败');

  if (!detailDatas.value) {
    throw new Error('读取广告详情失败');
  }

  return detailDatas.value;
};

/**
 * 函数：更新热搜广告。
 * @param {number} id 广告 ID。
 * @param {Record<string, unknown>} payload 保存请求。
 * @returns {Promise<void>} 无返回值。
 */
const hotsearchAdMaterialUpdate = async (id: number, payload: Record<string, unknown>): Promise<void> => {
  const { error: updateError, refresh: refreshUpdate } = await useApi<IHotsearchAdMaterialSaveResult>(`hotsearch/ads/materials/${id}`, {
    method: 'PATCH',
    immediate: false
  });

  await refreshUpdate({ datas: payload, replace: true });
  ensureInternalUseApiSucceeded(updateError.value, '广告修改失败');
};

/**
 * 函数：删除热搜广告。
 * @param {number} id 广告 ID。
 * @returns {Promise<void>} 无返回值。
 */
const hotsearchAdMaterialDelete = async (id: number): Promise<void> => {
  const { error: deleteError, refresh: refreshDelete } = await useApi<Record<string, unknown>>(`hotsearch/ads/materials/${id}`, {
    method: 'DELETE',
    immediate: false
  });

  await refreshDelete({ replace: true });
  ensureInternalUseApiSucceeded(deleteError.value, '广告删除失败');
};

/**
 * 计算属性：当前页。
 */
const computedPage = computed<number>({
  get: () => {
    const str = typeof route.query.page === 'string' ? route.query.page : '';
    const num = Number.parseInt(str, 10);
    return Number.isFinite(num) && num > 0 ? num : 1;
  },
  set: (value: number) => {
    const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
    q.page = String(Math.max(1, value));
    navigateTo({ path: route.path, query: q });
  }
});

/**
 * 计算属性：每页数量。
 */
const computedItemsPerPage = computed<number>(() => {
  const routeValue = typeof route.query.pagesize === 'string' ? route.query.pagesize : '';
  const parsed = Number.parseInt(routeValue, 10);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'ad-hotsearch');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }

  const apiSize = Number(datas.value?.pageSize ?? 20);
  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 事件：开始日期变更。
 * @param {unknown} value 日期值。
 */
const handleStartDateUpdate = (value: unknown): void => {
  if (!isSingleCalendarDateValue(value)) {
    return;
  }

  stateEditor.value.startAt = localDateTimeMerge(calendarIsoDateGet(value), timePartGet(stateEditor.value.startAt, '00:00'));
};

/**
 * 事件：结束日期变更。
 * @param {unknown} value 日期值。
 */
const handleEndDateUpdate = (value: unknown): void => {
  if (!isSingleCalendarDateValue(value)) {
    return;
  }

  stateEditor.value.endAt = localDateTimeMerge(calendarIsoDateGet(value), timePartGet(stateEditor.value.endAt, '23:59'));
};

/**
 * 事件：开始时间变更。
 * @param {TAdInputTimeValue} value 时间值。
 */
const handleStartTimeUpdate = (value: TAdInputTimeValue): void => {
  stateEditor.value.startAt = localDateTimeMerge(datePartGet(stateEditor.value.startAt), textFromTimeValue(value, '00:00'));
};

/**
 * 事件：结束时间变更。
 * @param {TAdInputTimeValue} value 时间值。
 */
const handleEndTimeUpdate = (value: TAdInputTimeValue): void => {
  stateEditor.value.endAt = localDateTimeMerge(datePartGet(stateEditor.value.endAt), textFromTimeValue(value, '23:59'));
};

/**
 * 事件：添加广告内容片段。
 */
const handleEditorAdvertisementItemAppend = (): void => {
  stateEditorAdvertisementItems.value.push(createEditorAdvertisementItem());
};

/**
 * 事件：开始拖拽广告内容。
 */
const handleEditorAdvertisementDragStart = (): void => {
  stateEditorAdvertisementDragging.value = true;
};

/**
 * 事件：结束拖拽广告内容。
 */
const handleEditorAdvertisementDragEnd = (): void => {
  stateEditorAdvertisementDragging.value = false;
};

/**
 * 事件：更新广告内容播报角色。
 * @param {number} index 当前索引。
 * @param {string} value 最新值。
 */
const handleEditorAdvertisementVoiceUpdate = (index: number, value: string | number): void => {
  const item = stateEditorAdvertisementItems.value[index];

  if (!item) {
    return;
  }

  item.voiceKey = String(value || 'M') as 'M' | 'F' | 'R';
};

/**
 * 事件：更新广告内容文本。
 * @param {number} index 当前索引。
 * @param {string} value 最新值。
 */
const handleEditorAdvertisementContentUpdate = (index: number, value: string | number): void => {
  const item = stateEditorAdvertisementItems.value[index];

  if (!item) {
    return;
  }

  item.content = String(value ?? '');
};

/**
 * 事件：删除广告内容片段。
 * @param {number} index 当前索引。
 */
const handleEditorAdvertisementItemRemove = (index: number): void => {
  stateEditorAdvertisementItems.value.splice(index, 1);
};

/**
 * 事件：查看详情。
 * @param {IPageTableColumnHotsearchAdMaterial} row 表格行。
 */
const handleViewDetail = (row: IPageTableColumnHotsearchAdMaterial) => {
  const source = datas.value?.rows.find((item) => Number(item.id) === row.id);
  if (!source) {
    return;
  }

  stateDetailRow.value = {
    id: Number(source.id ?? 0),
    title: String(source.title ?? ''),
    presentationType: String(source.presentationType ?? ''),
    materialType: String(source.materialType ?? ''),
    frameType: String(source.frameType ?? ''),
    editionScope: String(source.editionScope ?? ''),
    placementType: String(source.placementType ?? 'opening'),
    price: Number(source.price ?? 0),
    priority: Number(source.priority ?? 0),
    isEnabled: Boolean(source.isEnabled),
    startAt: hotsearchDatetimeValueGet(source.startAt),
    endAt: hotsearchDatetimeValueGet(source.endAt),
    updatedAt: hotsearchDatetimeValueGet(source.updatedAt),
    createdAt: hotsearchDatetimeValueGet(source.createdAt),
    asset: source.asset ?? null
  };
  stateDetailOpen.value = true;
  void detailAssetPreviewLoad(source.asset ?? null);
};

/**
 * 事件：编辑广告。
 * @param {IPageTableColumnHotsearchAdMaterial} row 表格行。
 */
const handleEdit = async (row: IPageTableColumnHotsearchAdMaterial): Promise<void> => {
  if (stateSaving.value) {
    return;
  }

  stateSaving.value = true;
  stateDeletePopoverOpenId.value = null;

  try {
    const detail = await hotsearchAdMaterialDetailGet(row.id);
    const defaultState = editorDefaultStateCreate();

    editorReset();
    stateEditor.value = {
      id: Number(detail.id ?? 0),
      title: String(detail.title ?? ''),
      presentationType: String(detail.presentationType ?? 'voice') as IPageAdHotsearchEditorForm['presentationType'],
      materialType: String(detail.materialType ?? 'none') as IPageAdHotsearchEditorForm['materialType'],
      frameType: String(detail.frameType ?? 'none') as IPageAdHotsearchEditorForm['frameType'],
      editionScopes: editorEditionScopesBuild(String(detail.editionScope ?? 'both')),
      placementType: String(detail.placementType ?? 'opening') as IPageAdHotsearchEditorForm['placementType'],
      platformIds: editorPlatformIdsNormalize(detail.platformIds),
      price: Number(detail.price ?? 0),
      priority: Number(detail.priority ?? 0),
      asset: null,
      notes: String(detail.notes ?? ''),
      isEnabled: Boolean(detail.isEnabled),
      startAt: localDateTimeInputValueGet(detail.startAt, defaultState.startAt),
      endAt: localDateTimeInputValueGet(detail.endAt, defaultState.endAt)
    };
    stateEditorAdvertisementItems.value =
      detail.lines.length > 0 ? [...detail.lines].sort((left, right) => Number(left.lineNo ?? 0) - Number(right.lineNo ?? 0)).map((item) => createEditorAdvertisementItem(String(item.voiceKey ?? 'M') as 'M' | 'F' | 'R', String(item.content ?? ''))) : [createEditorAdvertisementItem()];
    stateEditorOpen.value = true;

    if (detail.asset) {
      stateEditorAssetLoading.value = true;

      try {
        const editorAsset = await editorAssetStateBuild(detail.asset);

        stateEditor.value.asset = editorAsset;
        editorPreviewLayoutRestore(editorAsset);
      } finally {
        stateEditorAssetLoading.value = false;
      }
    }
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : '读取广告详情失败',
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 2500,
      type: 'foreground',
      close: false
    });
  } finally {
    stateSaving.value = false;
  }
};

/**
 * 事件：删除广告。
 * @param {IPageTableColumnHotsearchAdMaterial} row 表格行。
 * @returns {Promise<void>} 无返回值。
 */
const handleDelete = async (row: IPageTableColumnHotsearchAdMaterial): Promise<void> => {
  if (stateSaving.value) {
    return;
  }

  stateSaving.value = true;
  stateDeletePopoverOpenId.value = null;

  try {
    await hotsearchAdMaterialDelete(row.id);
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
    toast.add({
      description: '广告已删除',
      color: 'success',
      icon: 'i-lucide:check-circle-2',
      duration: 2200,
      type: 'foreground',
      close: false
    });
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : '广告删除失败',
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 2500,
      type: 'foreground',
      close: false
    });
  } finally {
    stateSaving.value = false;
  }
};

/**
 * 函数：获取素材预览图标。
 * @param {IPageTableColumnHotsearchAdMaterial} row 表格行。
 * @returns {{ icon: string; text: string }} 图标和提示文案。
 */
const _materialPreviewMetaGet = (row: IPageTableColumnHotsearchAdMaterial): { icon: string; text: string } => {
  if (row.materialType === 'image') {
    return { icon: 'i-lucide:image', text: '图片素材' };
  }

  if (row.materialType === 'video') {
    return { icon: 'i-lucide:clapperboard', text: '视频素材' };
  }

  return { icon: 'i-lucide:audio-lines', text: '口播素材' };
};

/**
 * 事件：打开新增模态框。
 */
const handleCreate = () => {
  editorReset();
  stateDeletePopoverOpenId.value = null;
  stateEditorOpen.value = true;
};

/**
 * 事件：切换启用状态。
 * @param {IPageTableColumnHotsearchAdMaterial} row 表格行。
 * @param {boolean} value 目标状态。
 * @returns {Promise<void>} 无返回值。
 */
const handleToggleEnabled = async (row: IPageTableColumnHotsearchAdMaterial, value: boolean): Promise<void> => {
  const previous = row.isEnabled;
  row.isEnabled = value;

  try {
    await hotsearchAdMaterialUpdate(row.id, { isEnabled: value });
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  } catch {
    row.isEnabled = previous;
  }
};

/**
 * 函数：将表单栏目范围映射为后端字段。
 * @param {Array<string>} values 表单栏目范围。
 * @returns {string} 后端栏目范围。
 */
const editionScopePayloadGet = (values: Array<'morning' | 'evening'>): 'morning' | 'evening' | 'both' => {
  const uniqueValues = Array.from(new Set(values));

  if (uniqueValues.includes('morning') && uniqueValues.includes('evening')) {
    return 'both';
  }

  if (uniqueValues.includes('evening')) {
    return 'evening';
  }

  return 'morning';
};

/**
 * 函数：构建当前预览布局参数。
 * @returns {{ clipStartMs: number; clipEndMs: number; posXRatio: number; posYRatio: number; widthRatio: number; heightRatio: number; zIndex: number }} 当前预览布局。
 */
const previewLayoutPayloadBuild = (): { clipStartMs: number; clipEndMs: number; posXRatio: number; posYRatio: number; widthRatio: number; heightRatio: number; zIndex: number } => {
  const stageWidth = statePreviewStageSize.width;
  const stageHeight = statePreviewStageSize.height;
  const scale = Number(statePreviewScale.value.toFixed(6));

  return {
    clipStartMs: 0,
    clipEndMs: 0,
    posXRatio: stageWidth > 0 ? Number((statePreviewOffset.x / stageWidth).toFixed(6)) : 0,
    posYRatio: stageHeight > 0 ? Number((statePreviewOffset.y / stageHeight).toFixed(6)) : 0,
    widthRatio: scale,
    heightRatio: scale,
    zIndex: 0
  };
};

/**
 * 函数：构建广告文案行请求。
 * @returns {Array<object>} 广告文案行。
 */
const advertisementLinesPayloadBuild = (): Array<{ voiceKey: 'M' | 'F' | 'R'; content: string }> => {
  return stateEditorAdvertisementItems.value
    .map((item) => ({
      voiceKey: item.voiceKey,
      content: String(item.content ?? '').trim()
    }))
    .filter((item) => item.content !== '');
};

/**
 * 函数：构建保存请求。
 * @param {IPageAdHotsearchEditorForm} source 表单状态。
 * @param {IHotsearchAdMaterialAsset} asset 已上传素材。
 * @param {boolean} isEnabled 是否启用。
 * @returns {Record<string, unknown>} 保存请求。
 */
const savePayloadBuild = (source: IPageAdHotsearchEditorForm, asset: IHotsearchAdMaterialAsset | null, isEnabled: boolean): Record<string, unknown> => {
  const presentationType = source.presentationType;
  const materialType = presentationType === 'voice' ? 'none' : source.materialType;
  const frameType = materialType === 'none' ? 'none' : source.frameType;
  const assetPayload = materialType === 'none' || !asset ? undefined : { ...asset, ...previewLayoutPayloadBuild() };
  const lines = advertisementLinesPayloadBuild();

  return {
    title: source.title.trim(),
    presentationType,
    materialType,
    frameType,
    editionScope: editionScopePayloadGet(source.editionScopes),
    placementType: source.placementType,
    platformIds: Array.from(new Set(source.platformIds)),
    price: source.price,
    priority: source.priority,
    lines,
    asset: assetPayload,
    notes: source.notes.trim() === '' ? undefined : source.notes.trim(),
    isEnabled,
    startAt: new Date(source.startAt).toISOString(),
    endAt: new Date(source.endAt).toISOString()
  };
};

/**
 * 事件：提交编辑器表单。
 * @param {boolean} isEnabled 是否启用。
 */
const onSubmit = async (isEnabled: boolean): Promise<void> => {
  if (!schema.safeParse({ ...stateEditor.value }).success || stateSaving.value) {
    return;
  }

  stateSaving.value = true;

  try {
    let uploadedAsset: IHotsearchAdMaterialAsset | null = null;
    const lines = advertisementLinesPayloadBuild();

    if (lines.length === 0) {
      throw new Error('请至少填写一句广告文案');
    }

    if (stateEditor.value.materialType !== 'none') {
      if (!stateEditor.value.asset) {
        throw new Error('请选择要上传的素材文件');
      }

      if (stateEditorAssetFile.value) {
        uploadedAsset = await uploadEditorAssetFile(stateEditorAssetFile.value, stateEditor.value.asset);
      } else {
        uploadedAsset = editorAssetPayloadBuild(stateEditor.value.asset);

        if (uploadedAsset.path.trim() === '') {
          throw new Error('请选择要上传的素材文件');
        }
      }
    }

    const payload = savePayloadBuild(stateEditor.value, uploadedAsset, isEnabled);

    if (stateEditor.value.id > 0) {
      await hotsearchAdMaterialUpdate(stateEditor.value.id, payload);
    } else {
      await refreshCreate({
        datas: payload,
        replace: true
      });
    }

    stateEditorOpen.value = false;
    editorReset();
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : '广告保存失败',
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 2500,
      type: 'foreground',
      close: false
    });
  } finally {
    stateSaving.value = false;
  }
};

/**
 * 表格：列定义。
 */
const columns: TableColumn<IPageTableColumnHotsearchAdMaterial>[] = [
  {
    accessorKey: 'id',
    header: '编号',
    cell: ({ row }) => row.original.id.toString().padStart(5, '0'),
    meta: { class: { th: 'w-16 text-sm', td: 'w-16 text-sm align-middle' } }
  },
  {
    id: 'adInfoSm',
    header: '广告信息',
    meta: { class: { th: 'lg:hidden text-sm', td: 'lg:hidden align-middle' } },
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'space-y-2 py-0.5' }, [
        h('span', { class: 'text-sm leading-6 font-medium text-highlighted whitespace-normal break-words' }, item.title || '未命名广告'),
        h('div', { class: 'text-xs text-muted leading-5 whitespace-normal break-words' }, `栏目：${editionScopeLabelGet(item.editionScope)} · 平台：${platformLabelGet(item.frameType)} · 优先级：${item.priority}`),
        h(
          'div',
          { class: 'text-xs text-muted leading-5 whitespace-normal break-words' },
          `素材类型：${materialTypeLabelGet(item.materialType)} · 广告类型：${presentationTypeLabelGet(item.presentationType)} · 画幅：${frameTypeLabelGet(item.frameType)} · 位置：${placementTypeLabelGet(item.placementType)}`
        )
      ]);
    }
  },
  {
    id: 'adInfoMd',
    header: '广告信息',
    meta: { class: { th: 'hidden lg:table-cell xl:hidden min-w-58 text-sm', td: 'hidden lg:table-cell xl:hidden min-w-58 align-middle' } },
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'space-y-2 py-0.5' }, [
        h('span', { class: 'text-sm leading-6 font-medium text-highlighted whitespace-normal break-words' }, item.title || '未命名广告'),
        h('div', { class: 'text-xs text-muted leading-5 whitespace-normal break-words' }, `栏目：${editionScopeLabelGet(item.editionScope)} · 平台：${platformLabelGet(item.frameType)} · 优先级：${item.priority}`),
        h(
          'div',
          { class: 'text-xs text-muted leading-5 whitespace-normal break-words' },
          `素材类型：${materialTypeLabelGet(item.materialType)} · 广告类型：${presentationTypeLabelGet(item.presentationType)} · 画幅：${frameTypeLabelGet(item.frameType)} · 位置：${placementTypeLabelGet(item.placementType)}`
        )
      ]);
    }
  },
  {
    id: 'adInfoLg',
    header: '广告信息',
    meta: { class: { th: 'hidden xl:table-cell 2xl:hidden min-w-58 text-sm', td: 'hidden xl:table-cell 2xl:hidden min-w-58 align-middle' } },
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'space-y-2 py-0.5' }, [
        h('span', { class: 'text-sm leading-6 font-medium text-highlighted whitespace-normal break-words' }, item.title || '未命名广告'),
        h('div', { class: 'text-xs text-muted leading-5' }, `栏目：${editionScopeLabelGet(item.editionScope)} · 平台：${platformLabelGet(item.frameType)} · 优先级：${item.priority}`)
      ]);
    }
  },
  {
    id: 'titleXl',
    accessorKey: 'title',
    header: '标题',
    meta: { class: { th: 'hidden 2xl:table-cell min-w-44 text-sm', td: 'hidden 2xl:table-cell min-w-44 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm leading-6 font-medium text-highlighted whitespace-normal break-words' }, row.original.title || '未命名广告')
  },
  {
    id: 'editionXl',
    accessorKey: 'editionScope',
    header: '栏目',
    meta: { class: { th: 'hidden 3xl:table-cell w-18 text-sm', td: 'hidden 3xl:table-cell w-18 align-middle' } },
    cell: ({ row }) => editionScopeReadonlyCheckboxesRender(row.original)
  },
  {
    id: 'editionMorning',
    header: '早报',
    accessorKey: 'editionMorning',
    meta: { class: { th: 'hidden 3xl:table-cell w-14 text-sm', td: 'hidden 3xl:table-cell w-14 align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, [h(UCheckbox, { modelValue: Boolean(row.original.editionMorning), disabled: true })])
  },
  {
    id: 'editionEvening',
    header: '晚报',
    accessorKey: 'editionEvening',
    meta: { class: { th: 'hidden 3xl:table-cell w-14 text-sm', td: 'hidden 3xl:table-cell w-14 align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, [h(UCheckbox, { modelValue: Boolean(row.original.editionEvening), disabled: true })])
  },
  {
    id: 'platformXl',
    header: '平台',
    meta: { class: { th: 'hidden 2xl:table-cell w-32 text-sm', td: 'hidden 2xl:table-cell w-32 align-middle' } },
    cell: ({ row }) => {
      const platformKey = String(row.original.platformKeyFirst ?? '');
      const label = platformLabelGet(row.original.frameType);
      const to = buildPlatformLocation(platformKey);

      return h(
        'a',
        {
          class: platformKey === (typeof route.query.platform === 'string' ? route.query.platform : '') ? 'text-primary hover:underline text-sm' : 'text-muted hover:text-primary hover:underline text-sm',
          onClick: (e: Event) => {
            e.preventDefault();
            navigateTo(to);
          },
          href: to.path + (to.query && Object.keys(to.query).length ? '?' + new URLSearchParams(to.query as Record<string, string>).toString() : '')
        },
        label
      );
    }
  },
  {
    id: 'priorityXl',
    accessorKey: 'priority',
    header: '优先级',
    meta: { class: { th: 'hidden 2xl:table-cell w-14 text-sm', td: 'hidden 2xl:table-cell w-14 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, String(row.original.priority))
  },
  {
    id: 'placementCompact',
    header: '投放',
    meta: { class: { th: 'hidden xl:table-cell 3xl:hidden w-26 text-sm', td: 'hidden xl:table-cell 3xl:hidden w-26 align-middle' } },
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'flex flex-col gap-1.5 text-xs' }, [
        h('span', { class: 'text-muted' }, `素材类型：${materialTypeLabelGet(item.materialType)}`),
        h('span', { class: 'text-muted' }, `广告类型：${presentationTypeLabelGet(item.presentationType)}`),
        h('span', { class: 'text-muted' }, `画幅：${frameTypeLabelGet(item.frameType)}`),
        h('span', { class: 'text-muted' }, `位置：${placementTypeLabelGet(item.placementType)}`)
      ]);
    }
  },
  {
    id: 'typesCombined2xl',
    header: '类型',
    meta: { class: { th: 'hidden 3xl:table-cell 5xl:hidden w-22 text-sm', td: 'hidden 3xl:table-cell 5xl:hidden w-22 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm whitespace-normal break-words' }, `${materialTypeLabelGet(row.original.materialType)}、${presentationTypeLabelGet(row.original.presentationType)}`)
  },
  {
    id: 'material4xl',
    accessorKey: 'materialType',
    header: '素材',
    meta: { class: { th: 'hidden 5xl:table-cell w-16 text-sm', td: 'hidden 5xl:table-cell w-16 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, materialTypeLabelGet(row.original.materialType))
  },
  {
    id: 'type4xl',
    accessorKey: 'presentationType',
    header: '类型',
    meta: { class: { th: 'hidden 5xl:table-cell w-16 text-sm', td: 'hidden 5xl:table-cell w-16 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, presentationTypeLabelGet(row.original.presentationType))
  },
  {
    accessorKey: 'frameType',
    header: '画幅',
    meta: { class: { th: 'hidden 3xl:table-cell w-16 text-sm', td: 'hidden 3xl:table-cell w-16 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, frameTypeLabelGet(row.original.frameType))
  },
  {
    id: 'placement2xl',
    accessorKey: 'placementType',
    header: '位置',
    meta: { class: { th: 'hidden 3xl:table-cell w-16 text-sm', td: 'hidden 3xl:table-cell w-16 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, placementTypeLabelGet(row.original.placementType))
  },
  {
    accessorKey: 'priceText',
    header: '价格',
    meta: { class: { th: 'w-22 text-left text-sm', td: 'w-22 text-right align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm text-highlighted' }, row.original.priceText)
  },
  {
    id: 'timeCompact',
    header: '时间',
    meta: { class: { th: 'xl:hidden w-44 text-sm', td: 'xl:hidden w-44 align-middle' } },
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'flex flex-col gap-1.5 text-xs' }, [
        h('div', { class: 'text-muted' }, [h('span', '生效：'), h(Datetime, { datetime: item.startAt, mode: 'datetime' })]),
        h('div', { class: 'text-muted' }, [h('span', '失效：'), h(Datetime, { datetime: item.endAt, mode: 'datetime' })]),
        h('div', { class: 'text-muted' }, [h('span', '更新：'), h(Datetime, { datetime: item.updatedAt, mode: 'datetime' })]),
        h('div', { class: 'text-muted' }, [h('span', '创建：'), h(Datetime, { datetime: item.createdAt, mode: 'datetime' })])
      ]);
    }
  },
  {
    id: 'timeRange',
    header: '生效/失效',
    meta: { class: { th: 'hidden xl:table-cell 4xl:hidden w-30 text-right text-sm', td: 'hidden xl:table-cell 4xl:hidden w-30 text-right align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex flex-col gap-1 text-xs text-muted' }, [h(Datetime, { datetime: row.original.startAt, mode: 'datetime' }), h(Datetime, { datetime: row.original.endAt, mode: 'datetime' })])
  },
  {
    id: 'timePair',
    header: '更新/创建',
    meta: { class: { th: 'hidden xl:table-cell 5xl:hidden w-30 text-right text-sm', td: 'hidden xl:table-cell 5xl:hidden w-30 text-right align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex flex-col gap-1 text-xs text-muted' }, [h(Datetime, { datetime: row.original.updatedAt, mode: 'datetime' }), h(Datetime, { datetime: row.original.createdAt, mode: 'datetime' })])
  },
  {
    accessorKey: 'startAt',
    header: '生效时间',
    meta: { class: { th: 'hidden 4xl:table-cell w-24 text-right text-sm', td: 'hidden 4xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.startAt, mode: 'datetime' })
  },
  {
    accessorKey: 'endAt',
    header: '失效时间',
    meta: { class: { th: 'hidden 4xl:table-cell w-24 text-right text-sm', td: 'hidden 4xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.endAt, mode: 'datetime' })
  },
  {
    accessorKey: 'updatedAt',
    header: '更新时间',
    meta: { class: { th: 'hidden 5xl:table-cell w-24 text-right text-sm', td: 'hidden 5xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.updatedAt, mode: 'datetime' })
  },
  {
    accessorKey: 'createdAt',
    header: '创建时间',
    meta: { class: { th: 'hidden 5xl:table-cell w-24 text-right text-sm', td: 'hidden 5xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.createdAt, mode: 'datetime' })
  },
  {
    accessorKey: 'isEnabled',
    header: '启用',
    meta: { class: { th: 'w-16 text-center text-sm', td: 'w-16 text-center align-middle' } },
    cell: ({ row }) => h(USwitch, { modelValue: row.original.isEnabled, 'onUpdate:modelValue': (value: boolean) => handleToggleEnabled(row.original, value) })
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'w-full text-right' }, '操作'),
    meta: { class: { th: 'w-34 text-right text-sm', td: 'w-34 text-right align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-end gap-2 text-sm' }, [
        h(UButton, { color: 'neutral', variant: 'ghost', label: '查看', onClick: () => handleViewDetail(row.original) }),
        h(UButton, { color: 'neutral', variant: 'ghost', label: '编辑', onClick: () => void handleEdit(row.original) }),
        h(
          UPopover,
          {
            open: stateDeletePopoverOpenId.value === row.original.id,
            'onUpdate:open': (value: boolean) => {
              if (!value && stateDeletePopoverOpenId.value === row.original.id) {
                stateDeletePopoverOpenId.value = null;
              }
            },
            arrow: true,
            content: { side: 'top', align: 'end', sideOffset: 8 },
            ui: { content: 'p-3 w-64' }
          },
          {
            default: () =>
              h(UButton, {
                color: 'error',
                variant: 'ghost',
                label: '删除',
                onClick: () => {
                  stateDeletePopoverOpenId.value = row.original.id;
                }
              }),
            content: () =>
              h('div', { class: 'space-y-3' }, [
                h('div', { class: 'text-sm leading-6 text-pretty text-default' }, '确认删除这条广告？此操作无法撤销。'),
                h('div', { class: 'flex items-center justify-end gap-2' }, [
                  h(UButton, {
                    color: 'neutral',
                    variant: 'soft',
                    size: 'xs',
                    label: '取消',
                    onClick: () => {
                      stateDeletePopoverOpenId.value = null;
                    }
                  }),
                  h(UButton, {
                    color: 'error',
                    variant: 'solid',
                    size: 'xs',
                    label: '确认删除',
                    loading: stateSaving.value,
                    onClick: () => {
                      stateDeletePopoverOpenId.value = null;
                      void handleDelete(row.original);
                    }
                  })
                ])
              ])
          }
        )
      ])
  }
];

let assetSelectionToken = 0;
let detailAssetPreviewToken = 0;

/**
 * 函数：清空详情素材预览状态。
 */
const detailAssetPreviewClear = (): void => {
  detailAssetPreviewToken += 1;
  stateDetailAssetPreviewLoading.value = false;
  stateDetailAssetPreviewUrl.value = '';
};

/**
 * 函数：加载详情素材预览。
 * @param {IHotsearchAdMaterialAsset} asset 主素材。
 * @returns {Promise<void>} 无返回值。
 */
const detailAssetPreviewLoad = async (asset: IHotsearchAdMaterialAsset | null | undefined): Promise<void> => {
  detailAssetPreviewToken += 1;
  const currentToken = detailAssetPreviewToken;

  stateDetailAssetPreviewLoading.value = false;
  stateDetailAssetPreviewUrl.value = '';

  if (!asset || String(asset.path ?? '').trim() === '') {
    return;
  }

  stateDetailAssetPreviewLoading.value = true;

  try {
    const previewUrl = await assetPreviewUrlResolve(asset, '获取广告素材签名地址失败');

    if (currentToken !== detailAssetPreviewToken) {
      return;
    }

    stateDetailAssetPreviewUrl.value = previewUrl;
  } catch (error) {
    if (currentToken !== detailAssetPreviewToken) {
      return;
    }

    toast.add({
      description: error instanceof Error ? error.message : '加载广告素材预览失败',
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 2500,
      type: 'foreground',
      close: false
    });
  } finally {
    if (currentToken === detailAssetPreviewToken) {
      stateDetailAssetPreviewLoading.value = false;
    }
  }
};

/**
 * 监听：路由变化时刷新列表。
 */
watch(
  () => route.query,
  () => {
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  }
);

watch(
  () => props.createNonce,
  (value, oldValue) => {
    if (typeof value === 'number' && typeof oldValue === 'number' && value !== oldValue) {
      handleCreate();
    }
  }
);

watch(
  () => stateDetailOpen.value,
  (open) => {
    if (!open) {
      detailAssetPreviewClear();
    }
  }
);

watch(
  () => [...stateEditor.value.platformIds],
  (value) => {
    const normalized = editorPlatformIdsByKindNormalize(value, computedEditorRequiredPlatformKind.value);

    if (normalized.length !== stateEditor.value.platformIds.length || normalized.some((id, index) => id !== stateEditor.value.platformIds[index])) {
      stateEditor.value.platformIds = normalized;
    }
  }
);

watch(
  () => stateEditor.value.presentationType,
  (value) => {
    if (value === 'voice') {
      stateEditor.value.materialType = 'none';
      stateEditor.value.frameType = 'none';
      editorPlatformIdsAllowedSync();
      return;
    }

    if (stateEditor.value.materialType === 'none') {
      stateEditor.value.materialType = 'image';
    }

    if (stateEditor.value.frameType === 'none') {
      stateEditor.value.frameType = 'landscape';
    }

    editorPlatformIdsAllowedSync();
  }
);

watch(
  () => stateEditor.value.materialType,
  (value) => {
    if (value === 'none') {
      stateEditor.value.presentationType = 'voice';
      stateEditor.value.frameType = 'none';
      stateEditorAssetFile.value = null;
      editorAssetClear();
      editorPlatformIdsAllowedSync();
      return;
    }

    if (value === 'image' && stateEditorAssetFile.value && !materialTypeMatchesFile('image', stateEditorAssetFile.value)) {
      stateEditorAssetFile.value = null;
      editorAssetClear();
    }

    if (value === 'video' && stateEditorAssetFile.value && !materialTypeMatchesFile('video', stateEditorAssetFile.value)) {
      stateEditorAssetFile.value = null;
      editorAssetClear();
    }
  }
);

watch(
  () => stateEditor.value.frameType,
  (value) => {
    if (value === 'none') {
      stateEditor.value.materialType = 'none';
      stateEditor.value.presentationType = 'voice';
      editorPlatformIdsAllowedSync();
      return;
    }

    editorPlatformIdsAllowedSync();
  }
);

watch(
  () => stateEditorAssetFile.value,
  async (file) => {
    assetSelectionToken += 1;
    const currentToken = assetSelectionToken;

    stateEditorAssetLoading.value = false;
    editorAssetClear();

    if (!file || stateEditor.value.materialType === 'none') {
      return;
    }

    if (!materialTypeMatchesFile(stateEditor.value.materialType, file)) {
      stateEditorAssetFile.value = null;
      assetTypeMismatchToastShow(stateEditor.value.materialType);
      return;
    }

    stateEditorAssetLoading.value = true;
    const previewUrl = URL.createObjectURL(file);
    const materialType = stateEditor.value.materialType;
    try {
      const metadata = await mediaMetadataRead(materialType, previewUrl);

      if (currentToken !== assetSelectionToken) {
        URL.revokeObjectURL(previewUrl);
        return;
      }

      stateEditor.value.asset = {
        originalName: file.name,
        mimeType: file.type || (materialType === 'image' ? 'image/*' : 'video/*'),
        fileExt: fileExtGet(file),
        fileSizeBytes: file.size,
        width: metadata.width,
        height: metadata.height,
        durationMs: metadata.durationMs,
        clipStartMs: 0,
        clipEndMs: 0,
        posXRatio: 0,
        posYRatio: 0,
        widthRatio: 1,
        heightRatio: 1,
        zIndex: 0,
        previewUrl
      };
    } finally {
      if (currentToken === assetSelectionToken) {
        stateEditorAssetLoading.value = false;
      }
    }
  }
);

onBeforeUnmount(() => {
  previewStageObserver?.disconnect();
  previewStageObserver = null;
  editorAssetClear();
});

onMounted(() => {
  previewCanvasAvailableWidthSync();
  previewStageSizeSync();

  previewStageObserver = new ResizeObserver(() => {
    previewCanvasAvailableWidthSync();
    previewStageSizeSync();

    const clampedOffset = previewOffsetClamp(statePreviewOffset.x, statePreviewOffset.y);

    statePreviewOffset.x = clampedOffset.x;
    statePreviewOffset.y = clampedOffset.y;
  });

  if (previewCanvasContainerElement.value) {
    previewStageObserver.observe(previewCanvasContainerElement.value);
  }

  if (previewStageElement.value) {
    previewStageObserver.observe(previewStageElement.value);
  }
});
</script>
