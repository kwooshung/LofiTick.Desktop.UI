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
            thead: '[&>tr]:bg-gradient-to-r [&>tr]:from-elevated/80 [&>tr]:to-elevated/40 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0 [&>tr]:hover:bg-elevated/25 [&>tr]:transition-colors [&>tr]:duration-150',
            th: 'py-3 px-3 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r font-semibold',
            td: 'border-b border-default align-top py-4 px-3',
            separator: 'h-0'
    <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ t('pages.ads.hotsearch.table.total', { total: Number(datas?.total ?? 0) }) }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
      </div>
    </div>

    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="computedEditorModalTitle" :ui="{ content: 'w-[80vw] max-w-[1920px]', footer: 'justify-end' }">
      <template #body>
        <UForm id="hotsearchAdEditorForm" :schema="schema" :state="stateEditor" class="space-y-5">
          <div class="space-y-4">
            <div class="grid gap-4" :class="computedShowPreview && computedIsPortraitPreview ? 'lg:grid-cols-5' : 'lg:grid-cols-1'">
              <div class="border-default bg-elevated/20 min-h-64 rounded-sm border p-4" :class="computedIsPortraitPreview ? 'lg:col-span-3' : ''">
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

                  <UFormField required name="platformIds" :label="t('pages.ads.hotsearch.form.platformIds')">
                    <USelect v-model="stateEditor.platformIds" multiple :items="editorPlatformOptions" value-key="value" label-key="label" :placeholder="t('pages.ads.hotsearch.form.platformPlaceholder')" size="sm" color="primary" variant="outline" :ui="{ content: 'min-w-fit' }" class="w-full" />
                  </UFormField>

                  <UFormField required name="price" :label="t('pages.ads.hotsearch.form.price')">
                    <UInput v-model="stateEditor.price" type="number" inputmode="decimal" min="0" step="0.01" class="w-full" />
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
                  <UFormField required name="endAt" :label="t('pages.ads.hotsearch.form.endAt')">
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

                  <UFormField name="notes" :label="t('pages.ads.hotsearch.form.notes')">
                    <UTextarea v-model="stateEditor.notes" :rows="4" autoresize class="w-full" :placeholder="t('pages.ads.hotsearch.form.notesPlaceholder')" />
                  </UFormField>
                </div>
              </div>

              <div v-if="computedShowPreview" class="border-default bg-elevated/15 rounded-sm border p-4" :class="computedIsPortraitPreview ? 'lg:col-span-2' : ''">
                <div class="space-y-4">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <div class="text-highlighted text-sm font-medium">{{ t('pages.ads.hotsearch.preview.mainAsset') }}</div>
                      <div class="text-muted text-xs">{{ computedIsPortraitPreview ? t('pages.ads.hotsearch.preview.portraitHint') : t('pages.ads.hotsearch.preview.landscapeHint') }}</div>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <Spin
                      :loading="stateEditorAssetSelecting || stateEditorAssetLoading"
                      :tip="stateEditorAssetSelecting ? t('pages.ads.hotsearch.preview.selecting') : t('pages.ads.hotsearch.preview.loading')"
                      icon="i-lucide:loader-circle"
                      icon-class="size-4 shrink-0 text-white/88"
                      content-class="flex-row gap-2 rounded-md border border-white/12 bg-black/72 px-3 py-2 text-sm text-white/88"
                      mask-class="rounded-sm bg-black/48"
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
                                  <UButton type="button" color="primary" variant="soft" size="sm" :disabled="stateSaving || stateEditorAssetSelecting" @click.stop.prevent="handlePreviewUploadOpen(open)">{{ t('pages.ads.hotsearch.actions.chooseAsset') }}</UButton>
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
                              class="border-default relative h-full w-full overflow-hidden rounded-sm border bg-black"
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
                                    {{ t('pages.ads.hotsearch.actions.reupload') }}
                                  </UButton>
                                  <UButton type="button" color="error" variant="solid" size="xs" class="bg-red-950/82 text-white ring-1 ring-red-300/18 backdrop-blur hover:bg-red-900/90" :disabled="stateSaving || stateEditorAssetSelecting" @click.stop.prevent="handlePreviewAssetClear">
                                    {{ t('pages.ads.hotsearch.actions.deleteAsset') }}
                                  </UButton>
                                </div>
                              </div>
                            </div>
                          </UFileUpload>
                        </div>
                      </div>
                    </Spin>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-default bg-elevated/20 min-h-24 rounded-sm border p-4">
              <section class="space-y-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-highlighted text-sm font-medium">{{ computedEditorAdvertisementTitle }}</div>
                    <div class="text-muted text-xs">{{ computedEditorAdvertisementDescription }}</div>
                  </div>

                  <UButton type="button" color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="stateSaving" @click="handleEditorAdvertisementItemAppend">{{ t('pages.ads.hotsearch.actions.addSegment') }}</UButton>
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
        <UButton type="button" color="neutral" variant="soft" @click="close">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" color="neutral" variant="outline" :disabled="!computedCanSubmit || stateSaving" :loading="stateSaving" @click="onSubmit(false)">{{ computedEditorSecondaryActionLabel }}</UButton>
        <UButton type="button" color="primary" :disabled="!computedCanSubmit || stateSaving" :loading="stateSaving" @click="onSubmit(true)">{{ computedEditorPrimaryActionLabel }}</UButton>
      </template>
    </UModal>

    <USlideover
      v-model:open="stateDetailOpen"
      side="right"
      :title="stateDetailRow.title || t('pages.ads.hotsearch.table.untitled')"
      :description="t('pages.ads.hotsearch.detail.description')"
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
            <UBadge :color="stateDetailRow.isEnabled ? 'primary' : 'neutral'" variant="soft">{{ stateDetailRow.isEnabled ? t('pages.ads.hotsearch.status.enabled') : t('pages.ads.hotsearch.status.disabled') }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ presentationTypeLabelGet(stateDetailRow.presentationType) }} </UBadge>
            <UBadge color="neutral" variant="soft">{{ placementTypeLabelGet(stateDetailRow.placementType) }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ materialTypeLabelGet(stateDetailRow.materialType) }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ frameTypeLabelGet(stateDetailRow.frameType) }}</UBadge>
          </div>

          <div class="space-y-3">
            <Spin
              :loading="stateDetailAssetPreviewLoading"
              :tip="t('pages.ads.hotsearch.preview.loading')"
              icon="i-lucide:loader-circle"
              icon-class="size-4 shrink-0 text-white/88"
              content-class="flex-row gap-2 rounded-md border border-white/12 bg-black/72 px-3 py-2 text-sm text-white/88"
              mask-class="rounded-sm bg-black/48"
              tip-class="text-sm text-white/88"
              :size="16"
              :delay="0"
              overlay
            >
              <div class="border-default bg-elevated/20 overflow-hidden rounded-sm border" :class="computedDetailPreviewFrameClass" :style="computedDetailPreviewFrameStyle">
                <img v-if="stateDetailRow.materialType === 'image' && stateDetailAssetPreviewUrl" :src="stateDetailAssetPreviewUrl" :alt="stateDetailRow.asset?.originalName ?? ''" class="h-full w-full object-contain select-none" draggable="false" />
                <MediaPlayerPlyr v-else-if="stateDetailRow.materialType === 'video' && stateDetailAssetPreviewUrl && stateDetailPlayerVisible" ref="refDetailPlayer" type="video" :sources="computedDetailVideoSources" class="h-full w-full" autoplay />
                <div v-else class="text-muted flex h-full items-center justify-center text-sm">{{ t('pages.ads.hotsearch.preview.emptyPreview') }}</div>
              </div>
            </Spin>

            <template v-if="stateDetailRow.asset">
              <div class="bg-elevated/35 border-default space-y-3 rounded-sm border px-3 py-3">
                <div class="flex flex-wrap gap-2 text-xs">
                  <UBadge color="neutral" variant="soft">{{ fileSizeTextGet(stateDetailRow.asset.fileSizeBytes) }} </UBadge>
                  <UBadge v-if="stateDetailRow.asset.width > 0 && stateDetailRow.asset.height > 0" color="neutral" variant="soft">{{ `${stateDetailRow.asset.width} × ${stateDetailRow.asset.height}` }}</UBadge>
                  <UBadge v-if="stateDetailRow.asset.durationMs > 0" color="neutral" variant="soft">{{ durationTextGet(stateDetailRow.asset.durationMs) }}</UBadge>
                </div>

                <div v-if="stateDetailRow.asset.path" class="text-muted text-xs leading-5 break-all">{{ t('pages.ads.hotsearch.preview.pathLabel', { path: assetPathLabelGet(stateDetailRow.asset.path) }) }}</div>
              </div>
            </template>
          </div>

          <div class="bg-elevated/35 border-default space-y-3 rounded-sm border px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 space-y-1">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.ads.hotsearch.detail.copyTitle') }}</div>
                <div class="text-muted text-xs leading-5">{{ t('pages.ads.hotsearch.detail.copyDescription') }}</div>
              </div>
              <UBadge v-if="stateDetailLines.length > 0" color="neutral" variant="soft">{{ t('pages.ads.hotsearch.detail.copyCount', { count: stateDetailLines.length }) }}</UBadge>
            </div>

            <template v-if="stateDetailLines.length > 0">
              <div class="space-y-2.5">
                <div v-for="(item, index) in stateDetailLines" :key="`${item.lineNo}-${index}`" class="grid grid-cols-[3rem_minmax(0,1fr)] gap-3">
                  <div :class="detailCopyIndexClassGet(item.voiceKey)" class="flex size-12 shrink-0 items-center justify-center rounded-full border shadow-xs">
                    <span class="text-lg leading-none font-semibold tabular-nums">{{ String(index + 1).padStart(2, '0') }}</span>
                  </div>
                  <div :class="detailCopyBubbleClassGet(item.voiceKey)" class="min-w-0 space-y-2 rounded-lg border px-3.5 py-3">
                    <div class="flex flex-wrap items-center gap-2">
                      <UBadge :class="detailCopyVoiceBadgeClassGet(item.voiceKey)" color="neutral" variant="soft">{{ detailVoiceLabelGet(item.voiceKey) }}</UBadge>
                    </div>
                    <div class="text-highlighted text-sm leading-5 wrap-break-word whitespace-pre-wrap">{{ item.content || t('pages.ads.hotsearch.detail.emptyLine') }}</div>
                  </div>
                </div>
              </div>
            </template>

            <UEmpty v-else icon="i-lucide:file-text" :title="t('pages.ads.hotsearch.detail.copyEmptyTitle')" :description="t('pages.ads.hotsearch.detail.copyEmptyDescription')" />

            <div v-if="stateDetailNotes !== ''" class="border-default bg-default/45 space-y-1.5 rounded-sm border border-dashed px-3 py-2.5">
              <div class="text-muted text-[11px]">{{ t('pages.ads.hotsearch.detail.notes') }}</div>
              <div class="text-toned text-sm leading-5 wrap-break-word whitespace-pre-wrap">{{ stateDetailNotes }}</div>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="bg-elevated/40 border-default rounded-sm border px-3 py-3">
              <div class="text-muted text-xs">{{ t('pages.ads.hotsearch.detail.platform') }}</div>
              <div class="mt-1 text-sm text-cyan-600">{{ platformLabelsGet(stateDetailRow.platformIds ?? [], stateDetailRow.frameType).join(' / ') }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-sm border px-3 py-3">
              <div class="text-muted text-xs">{{ t('pages.ads.hotsearch.detail.presentation') }}</div>
              <div class="mt-1 text-sm text-violet-600">{{ presentationTypeLabelGet(stateDetailRow.presentationType) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-sm border px-3 py-3">
              <div class="text-muted text-xs">{{ t('pages.ads.hotsearch.detail.editionScope') }}</div>
              <div class="text-primary mt-1 text-sm">{{ editionScopeLabelGet(stateDetailRow.editionScope) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-sm border px-3 py-3">
              <div class="text-muted text-xs">{{ t('pages.ads.hotsearch.detail.materialType') }}</div>
              <div class="mt-1 text-sm text-sky-600">{{ materialTypeLabelGet(stateDetailRow.materialType) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-sm border px-3 py-3">
              <div class="text-muted text-xs">{{ t('pages.ads.hotsearch.form.price') }}</div>
              <div class="mt-1 inline-flex items-baseline gap-1 text-sm font-medium text-amber-500">
                <span class="text-xs text-amber-400">￥</span>
                <span>{{ priceTextGet(stateDetailRow.price) }}</span>
              </div>
            </div>
            <div class="bg-elevated/40 border-default rounded-sm border px-3 py-3">
              <div class="text-muted text-xs">{{ t('pages.ads.hotsearch.form.priority') }}</div>
              <div class="mt-1 text-sm text-emerald-600">{{ stateDetailRow.priority }}</div>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">{{ t('pages.ads.hotsearch.detail.startAt') }}</span>
              <Datetime :datetime="stateDetailRow.startAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">{{ t('pages.ads.hotsearch.detail.endAt') }}</span>
              <Datetime :datetime="stateDetailRow.endAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">{{ t('pages.ads.hotsearch.detail.updatedAt') }}</span>
              <Datetime :datetime="stateDetailRow.updatedAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">{{ t('pages.ads.hotsearch.detail.createdAt') }}</span>
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
import { VueDraggable } from 'vue-draggable-plus';
import { z } from 'zod';

type TAdInputTimeValue = InputTimeProps['modelValue'];

/**
 * 属性：页面刷新标记。
 */
const { createNonce = 0 } = defineProps<IPageAdHotsearchProps>();

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

/**
 * 路由。
 */
const route = useRoute();

/**
 * 状态：列表行详情补全缓存。
 */
const stateRowDetailExtras = ref(new Map<number, { platformIds: number[]; asset: IHotsearchAdMaterialAsset | null }>());

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
 * 状态：详情视频播放器是否可见。
 */
const stateDetailPlayerVisible = ref(false);

/**
 * 引用：详情视频播放器实例。
 */
const stateRefDetailPlayer = ref<{ player: { play: () => Promise<void> } | null } | null>(null);

/**
 * 状态：详情广告文案行。
 */
const stateDetailLines = ref<IHotsearchAdMaterialLine[]>([]);

/**
 * 状态：详情备注。
 */
const stateDetailNotes = ref('');

/**
 * 计算属性：详情视频源。
 */
const computedDetailVideoSources = computed(() => {
  if (stateDetailAssetPreviewUrl.value === '') {
    return [];
  }

  return [
    {
      src: stateDetailAssetPreviewUrl.value,
      type: stateDetailRow.value.asset?.mimeType || 'video/mp4'
    }
  ];
});

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
const statePreviewCanvasContainerElement = ref<HTMLDivElement | null>(null);

/**
 * 状态：预览舞台元素。
 */
const statePreviewStageElement = ref<HTMLDivElement | null>(null);

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
  platformIds: [],
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
const presentationTypeOptions = computed(() => [
  { label: t('pages.ads.hotsearch.labels.presentation.voice'), value: 'voice' },
  { label: t('pages.ads.hotsearch.labels.presentation.pip'), value: 'pip' },
  { label: t('pages.ads.hotsearch.labels.presentation.montage'), value: 'montage' }
]);

/**
 * 常量：广告位置选项。
 */
const placementTypeOptions = [
  { label: t('pages.ads.hotsearch.labels.placement.openingAd'), value: 'opening' },
  { label: t('pages.ads.hotsearch.labels.placement.closingAd'), value: 'closing' }
];

/**
 * 函数：构建紧凑单选卡片组样式。
 * @param {number} columns 列数。
 * @returns {{ fieldset: string; item: string; container: string; wrapper: string; label: string; base: string }} 组件样式。
 */
const compactRadioCardGroupUi = (columns: number): { fieldset: string; item: string; container: string; wrapper: string; label: string; base: string } => ({
  fieldset: `grid w-full gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`,
  item: 'border-default bg-default min-h-10 rounded-sm px-3 py-2 has-data-[state=checked]:border-default',
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
  item: 'border-default bg-default min-h-10 rounded-sm px-3 py-2 has-data-[state=checked]:border-default',
  container: 'flex h-full items-center',
  wrapper: 'flex min-h-full items-center',
  label: 'leading-none',
  base: 'self-center'
});

/**
 * 常量：素材类型选项。
 */
const materialTypeOptions = [
  { label: t('pages.ads.hotsearch.labels.material.image'), value: 'image' },
  { label: t('pages.ads.hotsearch.labels.material.video'), value: 'video' }
];

/**
 * 常量：画幅类型选项。
 */
const frameTypeOptions = [
  { label: t('pages.ads.hotsearch.labels.frame.landscapeShort'), value: 'landscape' },
  { label: t('pages.ads.hotsearch.labels.frame.portraitShort'), value: 'portrait' }
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
 * 函数：获取投放平台选项列表。
 * @param {number[]} platformIds 平台 ID 列表。
 * @returns {typeof adDeliveryPlatformOptions} 平台选项列表。
 */
const platformOptionsByIdsGet = (platformIds: number[]) => {
  return adDeliveryPlatformOptions.filter((item) => platformIds.includes(item.id));
};

/**
 * 函数：读取当前路由平台筛选键。
 * @returns {string} 平台筛选键。
 */
const currentPlatformFilterGet = (): string => (typeof route.query.platform === 'string' ? route.query.platform.trim() : '');

/**
 * 函数：从列表行与缓存中解析平台 ID。
 * @param {number} id 广告 ID。
 * @param {unknown} input 原始平台列表。
 * @returns {number[]} 平台 ID 列表。
 */
const rowPlatformIdsResolve = (id: number, input: unknown): number[] => {
  if (Array.isArray(input) && input.length > 0) {
    return input.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0);
  }

  return stateRowDetailExtras.value.get(id)?.platformIds ?? [];
};

/**
 * 函数：从列表行与缓存中解析主素材。
 * @param {number} id 广告 ID。
 * @param {IHotsearchAdMaterialAsset | null | undefined} asset 原始主素材。
 * @returns {IHotsearchAdMaterialAsset | null} 主素材。
 */
const rowAssetResolve = (id: number, asset: IHotsearchAdMaterialAsset | null | undefined): IHotsearchAdMaterialAsset | null => {
  if (asset) {
    return asset;
  }

  return stateRowDetailExtras.value.get(id)?.asset ?? null;
};

/**
 * 函数：写入列表行详情补全缓存。
 * @param {number} id 广告 ID。
 * @param {number[]} platformIds 平台 ID 列表。
 * @param {IHotsearchAdMaterialAsset | null | undefined} asset 主素材。
 */
const rowDetailExtrasCacheSet = (id: number, platformIds: number[], asset: IHotsearchAdMaterialAsset | null | undefined): void => {
  const next = new Map(stateRowDetailExtras.value);

  next.set(id, {
    platformIds,
    asset: asset ?? null
  });

  stateRowDetailExtras.value = next;
};

/**
 * 函数：判断平台列表是否命中当前筛选。
 * @param {number[]} platformIds 平台 ID 列表。
 * @param {string} platformKey 平台筛选键。
 * @returns {boolean} 是否命中。
 */
const platformFilterMatches = (platformIds: number[], platformKey: string): boolean => {
  if (platformKey === '') {
    return true;
  }

  return platformOptionsByIdsGet(platformIds).some((option) => option.key === platformKey);
};

/**
 * 函数：获取平台文案列表。
 * @param {number[]} platformIds 平台 ID 列表。
 * @param {IHotsearchAdMaterialSummaryRow['frameType']} frameType 画幅类型。
 * @returns {string[]} 平台文案列表。
 */
const platformLabelsGet = (platformIds: number[], frameType: IHotsearchAdMaterialSummaryRow['frameType']): string[] => {
  const matchedLabels = platformOptionsByIdsGet(platformIds).map((option) => t(option.labelKey));

  if (matchedLabels.length > 0) {
    return matchedLabels;
  }

  if (frameType === 'landscape') {
    return [t('pages.ads.hotsearch.labels.platform.landscape')];
  }

  if (frameType === 'portrait') {
    return [t('pages.ads.hotsearch.labels.platform.portrait')];
  }

  return [t('pages.ads.hotsearch.labels.platform.audio')];
};

/**
 * 常量：表单校验。
 */
const schema = z
  .object({
    title: z.string().trim().min(1, t('pages.ads.hotsearch.validation.titleRequired')).max(120, t('pages.ads.hotsearch.validation.titleTooLong')),
    presentationType: z.enum(['voice', 'pip', 'montage']),
    materialType: z.enum(['none', 'image', 'video']),
    frameType: z.enum(['none', 'landscape', 'portrait']),
    editionScopes: z.array(z.enum(['morning', 'evening'])).min(1, t('pages.ads.hotsearch.validation.editionScopesRequired')),
    placementType: z.enum(['opening', 'closing']),
    platformIds: z.array(z.number().int().positive()).min(1, t('pages.ads.hotsearch.validation.platformIdsRequired')),
    price: z.number().min(0, t('pages.ads.hotsearch.validation.priceMin')),
    priority: z.number().int(t('pages.ads.hotsearch.validation.priorityInteger')),
    asset: z
      .object({
        originalName: z.string().trim().min(1, t('pages.ads.hotsearch.validation.assetOriginalNameRequired')),
        mimeType: z.string().trim().min(1, t('pages.ads.hotsearch.validation.assetMimeInvalid')),
        fileExt: z.string().trim().min(1, t('pages.ads.hotsearch.validation.assetFileExtRequired')),
        fileSizeBytes: z.number().positive(t('pages.ads.hotsearch.validation.assetFileSizePositive')),
        width: z.number().min(0),
        height: z.number().min(0),
        durationMs: z.number().min(0),
        previewUrl: z.string().trim().min(1)
      })
      .nullable(),
    notes: z.string().max(500, t('pages.ads.hotsearch.validation.notesTooLong')),
    startAt: z
      .string()
      .trim()
      .min(1, t('pages.ads.hotsearch.validation.startAtRequired'))
      .refine((value) => !Number.isNaN(new Date(value).getTime()), t('pages.ads.hotsearch.validation.startAtInvalid')),
    endAt: z
      .string()
      .trim()
      .min(1, t('pages.ads.hotsearch.validation.endAtRequired'))
      .refine((value) => !Number.isNaN(new Date(value).getTime()), t('pages.ads.hotsearch.validation.endAtInvalid'))
  })
  .superRefine((value, ctx) => {
    if (value.presentationType === 'voice' && value.materialType !== 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['materialType'], message: t('pages.ads.hotsearch.validation.voiceMaterialMustBeNone') });
    }

    if (value.presentationType !== 'voice' && value.materialType === 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['materialType'], message: t('pages.ads.hotsearch.validation.nonVoiceMaterialRequired') });
    }

    if (value.materialType === 'none' && value.frameType !== 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['frameType'], message: t('pages.ads.hotsearch.validation.noneMaterialFrameMustBeNone') });
    }

    if (value.materialType !== 'none' && value.frameType === 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['frameType'], message: t('pages.ads.hotsearch.validation.materialFrameRequired') });
    }

    if (value.materialType !== 'none' && !value.asset) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: t('pages.ads.hotsearch.validation.assetRequired') });
    }

    if (value.materialType === 'image' && value.asset?.mimeType && !value.asset.mimeType.startsWith('image/')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: t('pages.ads.hotsearch.validation.imageAssetRequired') });
    }

    if (value.materialType === 'video' && value.asset?.mimeType && !value.asset.mimeType.startsWith('video/')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: t('pages.ads.hotsearch.validation.videoAssetRequired') });
    }

    if (new Date(value.startAt).getTime() > new Date(value.endAt).getTime()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endAt'], message: t('pages.ads.hotsearch.validation.endAtAfterStartAt') });
    }

    const requiredPlatformKind = editorRequiredPlatformKindResolve(value.presentationType, value.frameType);

    if (requiredPlatformKind && value.platformIds.some((id) => adDeliveryPlatformKindMap.value.get(id) !== requiredPlatformKind)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['platformIds'], message: t('pages.ads.hotsearch.validation.platformKindMismatch') });
    }
  });

/**
 * 计算属性：表单是否可提交。
 */
const computedCanSubmit = computed(() => schema.safeParse({ ...stateEditor.value }).success);

/**
 * 计算属性：编辑器弹窗标题。
 */
const computedEditorModalTitle = computed(() => (stateEditor.value.id > 0 ? t('pages.ads.hotsearch.editor.editTitle') : t('pages.ads.hotsearch.editor.createTitle')));

/**
 * 计算属性：编辑器次按钮文案。
 */
const computedEditorSecondaryActionLabel = computed(() => (stateEditor.value.id > 0 ? t('pages.ads.hotsearch.editor.editDisabled') : t('pages.ads.hotsearch.editor.createDisabled')));

/**
 * 计算属性：编辑器主按钮文案。
 */
const computedEditorPrimaryActionLabel = computed(() => (stateEditor.value.id > 0 ? t('pages.ads.hotsearch.editor.editEnabled') : t('pages.ads.hotsearch.editor.createEnabled')));

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
  const platform = typeof route.query.platform === 'string' ? route.query.platform.trim() : '';
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

  if (platform !== '') {
    query.platform = platform;
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

  return dateText === '' ? t('pages.ads.hotsearch.picker.selectDate') : dateText.replaceAll('-', '/');
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
    title: materialType === 'image' ? t('pages.ads.hotsearch.picker.selectImageTitle') : t('pages.ads.hotsearch.picker.selectVideoTitle'),
    filters: [
      {
        name: materialType === 'image' ? t('pages.ads.hotsearch.picker.imageFile') : t('pages.ads.hotsearch.picker.videoFile'),
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
    description: materialType === 'image' ? t('pages.ads.hotsearch.toast.imageOnly') : t('pages.ads.hotsearch.toast.videoOnly'),
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
  const errorMessage = t('pages.ads.hotsearch.toast.assetUploadFailed');
  const draftPath = editorAssetPathCreate(file);

  if (!isTauriRuntime.value) {
    throw new Error(t('pages.ads.hotsearch.toast.tauriWriteUnsupported'));
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

  const previewUrl = signedUrl;
  const localCachePath = path.replace(/^\//, '');

  if (isTauriRuntime.value && localCachePath !== '') {
    await hotsearchAdAssetEnsureDownloaded(localCachePath, signedUrl);
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
  const previewUrl = await assetPreviewUrlResolve(asset, t('pages.ads.hotsearch.toast.assetSignUrlFailed'));

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
 * 计算属性：详情素材原始宽高比。
 */
const computedDetailPreviewAspectRatio = computed(() => {
  const asset = stateDetailRow.value.asset;

  if (asset && asset.width > 0 && asset.height > 0) {
    return asset.width / asset.height;
  }

  if (stateDetailRow.value.materialType === 'image') {
    return 4 / 3;
  }

  return 16 / 9;
});

/**
 * 计算属性：详情素材预览容器类名。
 */
const computedDetailPreviewFrameClass = computed(() => (computedDetailPreviewAspectRatio.value < 1 ? 'mx-auto w-full max-w-72' : 'w-full'));

/**
 * 计算属性：详情素材预览容器样式。
 */
const computedDetailPreviewFrameStyle = computed(() => {
  const asset = stateDetailRow.value.asset;

  if (asset && asset.width > 0 && asset.height > 0) {
    return {
      aspectRatio: `${asset.width} / ${asset.height}`
    };
  }

  if (stateDetailRow.value.materialType === 'image') {
    return {
      aspectRatio: '4 / 3'
    };
  }

  return {
    aspectRatio: '16 / 9'
  };
});

/**
 * 计算属性：广告内容标题。
 */
const computedEditorAdvertisementTitle = computed(() => t('pages.ads.hotsearch.editor.adTitle'));

/**
 * 计算属性：广告内容说明。
 */
const computedEditorAdvertisementDescription = computed(() => t('pages.ads.hotsearch.editor.adDescription'));

/**
 * 计算属性：广告内容为空标题。
 */
const computedEditorAdvertisementEmptyTitle = computed(() => t('pages.ads.hotsearch.editor.emptyTitle'));

/**
 * 计算属性：广告内容为空说明。
 */
const computedEditorAdvertisementEmptyDescription = computed(() => t('pages.ads.hotsearch.editor.emptyDescription'));

/**
 * 计算属性：广告内容输入占位。
 */
const computedEditorAdvertisementPlaceholder = computed(() => t('pages.ads.hotsearch.editor.contentPlaceholder'));

/**
 * 计算属性：广告内容播报角色选项。
 */
const computedEditorAdvertisementVoiceOptions = computed(() => {
  const labels: Record<'M' | 'F' | 'R', string> = {
    M: t('pages.ads.hotsearch.labels.voice.male'),
    F: t('pages.ads.hotsearch.labels.voice.female'),
    R: t('pages.ads.hotsearch.labels.voice.random')
  };

  return hotsearchPodcastVoiceOptionsGet().map((item) => ({
    value: item.value,
    label: labels[item.value]
  }));
});

/**
 * 函数：获取查看详情中的播报角色文案。
 *
 * 详情侧滑只读展示广告文案时，需要把后端返回的角色值映射为稳定的界面文案。
 *
 * # Arguments
 *
 * * `voiceKey` - 后端返回的播报角色标记。
 *
 * # Returns
 *
 * 返回播报角色对应的界面文案。
 */
const detailVoiceLabelGet = (voiceKey: string): string => {
  if (voiceKey === 'F') {
    return t('pages.ads.hotsearch.labels.voice.female');
  }

  if (voiceKey === 'R') {
    return t('pages.ads.hotsearch.labels.voice.random');
  }

  return t('pages.ads.hotsearch.labels.voice.male');
};

/**
 * 函数：获取查看详情文案编号色调类名。
 *
 * 文案编号需要形成轻量但明显的图形锚点，并与不同播报角色保持一致的浅色区分。
 *
 * # Arguments
 *
 * * `voiceKey` - 播报角色标记。
 *
 * # Returns
 *
 * 返回编号圆点的样式类名。
 */
const detailCopyIndexClassGet = (voiceKey: string): string => {
  if (voiceKey === 'F') {
    return 'border-pink-400/22 bg-pink-400/10 text-pink-500';
  }

  if (voiceKey === 'R') {
    return 'border-amber-400/22 bg-amber-400/10 text-amber-500';
  }

  return 'border-primary/18 bg-primary/10 text-primary/85';
};

/**
 * 函数：获取查看详情文案气泡样式类名。
 *
 * 详情文案使用浅色消息气泡承载文本，减少阅读高度，同时让男女声具备直观区分。
 *
 * # Arguments
 *
 * * `voiceKey` - 播报角色标记。
 *
 * # Returns
 *
 * 返回文案气泡的样式类名。
 */
const detailCopyBubbleClassGet = (voiceKey: string): string => {
  if (voiceKey === 'F') {
    return 'border-pink-400/18 bg-pink-400/6';
  }

  if (voiceKey === 'R') {
    return 'border-amber-400/18 bg-amber-400/6';
  }

  return 'border-primary/16 bg-primary/6';
};

/**
 * 函数：获取查看详情播报角色标签样式类名。
 *
 * 角色标签与消息气泡使用同一色系，避免只靠文字区分播报角色。
 *
 * # Arguments
 *
 * * `voiceKey` - 播报角色标记。
 *
 * # Returns
 *
 * 返回角色标签的样式类名。
 */
const detailCopyVoiceBadgeClassGet = (voiceKey: string): string => {
  if (voiceKey === 'F') {
    return 'border-pink-400/16 bg-pink-400/10 text-pink-500';
  }

  if (voiceKey === 'R') {
    return 'border-amber-400/16 bg-amber-400/10 text-amber-500';
  }

  return 'border-primary/14 bg-primary/10 text-primary/80';
};

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
  const element = statePreviewCanvasContainerElement.value;

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
  const element = statePreviewStageElement.value;

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
const computedAssetUploadLabel = computed(() => (stateEditor.value.materialType === 'image' ? t('pages.ads.hotsearch.preview.imageDropLabel') : t('pages.ads.hotsearch.preview.videoDropLabel')));

/**
 * 计算属性：素材上传说明。
 */
const computedAssetUploadDescription = computed(() => (stateEditor.value.materialType === 'image' ? t('pages.ads.hotsearch.preview.imageDropDescription') : t('pages.ads.hotsearch.preview.videoDropDescription')));

watch(
  () => [statePreviewCanvasContainerElement.value, statePreviewStageElement.value, stateEditor.value.asset?.width ?? 0, stateEditor.value.asset?.height ?? 0, stateEditor.value.frameType] as const,
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
  () => [statePreviewCanvasContainerElement.value, statePreviewStageElement.value] as const,
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
    return t('pages.ads.hotsearch.labels.presentation.voice');
  }

  if (value === 'pip') {
    return t('pages.ads.hotsearch.labels.presentation.pip');
  }

  if (value === 'montage') {
    return t('pages.ads.hotsearch.labels.presentation.montage');
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
    return t('pages.ads.hotsearch.labels.placement.opening');
  }

  if (value === 'closing') {
    return t('pages.ads.hotsearch.labels.placement.closing');
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
    return t('pages.ads.hotsearch.labels.material.none');
  }

  if (value === 'image') {
    return t('pages.ads.hotsearch.labels.material.image');
  }

  if (value === 'video') {
    return t('pages.ads.hotsearch.labels.material.video');
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
    return t('pages.ads.hotsearch.labels.frame.none');
  }

  if (value === 'landscape') {
    return t('pages.ads.hotsearch.labels.frame.landscape');
  }

  if (value === 'portrait') {
    return t('pages.ads.hotsearch.labels.frame.portrait');
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
    return t('pages.ads.hotsearch.labels.edition.morning');
  }

  if (value === 'evening') {
    return t('pages.ads.hotsearch.labels.edition.evening');
  }

  if (value === 'both') {
    return t('pages.ads.hotsearch.labels.edition.both');
  }

  return value;
};

/**
 * 函数：获取价格金额文案。
 * @param {number} value 价格。
 * @returns {string} 文案。
 */
const priceTextGet = (value: number): string => Number(value ?? 0).toFixed(2);

/**
 * 函数：渲染广告信息摘要标签。
 *
 * 通过统一的轻量标签样式，压缩表格内的信息密度并提升扫读效率。
 *
 * # Arguments
 *
 * * `label` - 标签标题。
 * * `value` - 标签内容。
 * * `tone` - 标签视觉层级。
 *
 * # Returns
 *
 * 返回单个摘要标签节点。
 */
const adInfoChipRender = (label: string, value: string, tone: 'primary' | 'neutral' = 'neutral') =>
  h(
    'span',
    {
      class:
        tone === 'primary' ? 'inline-flex items-center rounded-md border border-primary/18 bg-primary/8 px-2 py-1 text-[11px] leading-none font-medium text-primary' : 'inline-flex items-center rounded-md border border-default bg-elevated/70 px-2 py-1 text-[11px] leading-none font-medium text-toned'
    },
    [h('span', { class: tone === 'primary' ? 'text-primary/70' : 'text-muted' }, `${label}：`), h('span', { class: 'ml-1' }, value)]
  );

/**
 * 函数：渲染广告信息摘要区。
 *
 * 将标题、投放摘要和素材摘要收敛为两排可换行的 chips，减少长句拼接造成的阅读压力。
 *
 * # Arguments
 *
 * * `item` - 当前表格行数据。
 * * `showAssetMeta` - 是否显示素材相关摘要标签。
 *
 * # Returns
 *
 * 返回广告信息单元格节点。
 */
const hotsearchAdInfoCellRender = (item: IPageTableColumnHotsearchAdMaterial, showAssetMeta = true) => {
  const title = item.title || t('pages.ads.hotsearch.table.untitled');
  const primaryChips = [
    adInfoChipRender(t('pages.ads.hotsearch.table.editionScope'), editionScopeLabelGet(item.editionScope), 'primary'),
    adInfoChipRender(t('pages.ads.hotsearch.table.platform'), platformLabelsGet(item.platformIds, item.frameType).join(' / '), 'primary'),
    adInfoChipRender(t('pages.ads.hotsearch.table.priority'), String(item.priority), 'primary')
  ];

  const assetChips = [
    adInfoChipRender(t('pages.ads.hotsearch.table.materialType'), materialTypeLabelGet(item.materialType)),
    adInfoChipRender(t('pages.ads.hotsearch.table.type'), presentationTypeLabelGet(item.presentationType)),
    adInfoChipRender(t('pages.ads.hotsearch.table.frameType'), frameTypeLabelGet(item.frameType)),
    adInfoChipRender(t('pages.ads.hotsearch.table.placementType'), placementTypeLabelGet(item.placementType))
  ];

  return h('div', { class: 'space-y-2 py-1' }, [h('div', { class: 'text-sm leading-6 text-highlighted whitespace-normal break-words' }, title), ...(showAssetMeta ? [h('div', { class: 'flex flex-wrap gap-1.5' }, assetChips)] : []), h('div', { class: 'flex flex-wrap gap-1.5' }, primaryChips)]);
};

/**
 * 函数：渲染投放平台链接。
 * @param {IPageTableColumnHotsearchAdMaterial} item 表格行。
 * @returns {VNode} 平台链接节点。
 */
const platformLinksRender = (item: IPageTableColumnHotsearchAdMaterial) => {
  const currentPlatform = typeof route.query.platform === 'string' ? route.query.platform : '';
  const options = platformOptionsByIdsGet(item.platformIds);

  if (options.length === 0) {
    return h('span', { class: 'text-sm text-muted whitespace-normal break-words' }, platformLabelsGet(item.platformIds, item.frameType).join(' / '));
  }

  const links = options.map((option) => {
    const to = buildPlatformLocation(option.key);
    const isActive = option.key === currentPlatform;

    return h(
      'a',
      {
        class: isActive ? 'text-primary hover:underline text-sm whitespace-nowrap' : 'text-muted hover:text-primary hover:underline text-sm whitespace-nowrap',
        onClick: (e: Event) => {
          e.preventDefault();
          navigateTo(to);
        },
        href: to.path + (to.query && Object.keys(to.query).length ? '?' + new URLSearchParams(to.query as Record<string, string>).toString() : '')
      },
      t(option.labelKey)
    );
  });

  return h('div', { class: 'flex flex-wrap justify-end gap-x-2 gap-y-1 text-right' }, links);
};

/**
 * 函数：渲染价格。
 * @param {string} amount 价格金额。
 * @returns {VNode} 价格节点。
 */
const priceCellRender = (amount: string) => {
  return h('span', { class: 'inline-flex items-baseline justify-end gap-1 text-sm text-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent px-3 py-1.5 rounded-full' }, [h('span', { class: 'text-xs text-amber-400' }, '￥'), h('span', amount)]);
};
/**
 * 计算属性：表格数据。
 */
const computedTableRows = computed<IPageTableColumnHotsearchAdMaterial[]>(() => {
  if (!datas.value?.rows || datas.value.rows.length === 0) {
    return [];
  }

  const platformFilter = currentPlatformFilterGet();

  const rows = datas.value.rows.map((item) => ({
    id: Number(item.id ?? 0),
    title: String(item.title ?? ''),
    presentationType: String(item.presentationType ?? ''),
    materialType: String(item.materialType ?? ''),
    frameType: String(item.frameType ?? ''),
    editionScope: String(item.editionScope ?? ''),
    editionMorning: String(item.editionScope ?? '') === 'morning' || String(item.editionScope ?? '') === 'both',
    editionEvening: String(item.editionScope ?? '') === 'evening' || String(item.editionScope ?? '') === 'both',
    platformIds: rowPlatformIdsResolve(Number(item.id ?? 0), item.platformIds),
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

  if (platformFilter !== '') {
    return rows.filter((row) => row.platformIds.length === 0 || platformFilterMatches(row.platformIds, platformFilter));
  }

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
  ensureInternalUseApiSucceeded(detailError.value, t('pages.ads.hotsearch.toast.detailLoadFailed'));

  if (!detailDatas.value) {
    throw new Error(t('pages.ads.hotsearch.toast.detailLoadFailed'));
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
  ensureInternalUseApiSucceeded(updateError.value, t('pages.ads.hotsearch.toast.updateFailed'));
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
  ensureInternalUseApiSucceeded(deleteError.value, t('pages.ads.hotsearch.toast.deleteFailed'));
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

  stateDetailLines.value = [];
  stateDetailNotes.value = '';
  stateDetailPlayerVisible.value = false;
  stateRefDetailPlayer.value = null;

  stateDetailRow.value = {
    id: Number(source.id ?? 0),
    title: String(source.title ?? ''),
    presentationType: String(source.presentationType ?? ''),
    materialType: String(source.materialType ?? ''),
    frameType: String(source.frameType ?? ''),
    editionScope: String(source.editionScope ?? ''),
    platformIds: rowPlatformIdsResolve(Number(source.id ?? 0), source.platformIds),
    placementType: String(source.placementType ?? 'opening'),
    price: Number(source.price ?? 0),
    priority: Number(source.priority ?? 0),
    isEnabled: Boolean(source.isEnabled),
    startAt: hotsearchDatetimeValueGet(source.startAt),
    endAt: hotsearchDatetimeValueGet(source.endAt),
    updatedAt: hotsearchDatetimeValueGet(source.updatedAt),
    createdAt: hotsearchDatetimeValueGet(source.createdAt),
    asset: rowAssetResolve(Number(source.id ?? 0), source.asset ?? null)
  };
  stateDetailOpen.value = true;
  stateDetailAssetPreviewLoading.value = true;

  void (async () => {
    try {
      const detail = await hotsearchAdMaterialDetailGet(row.id);
      const normalizedPlatformIds = editorPlatformIdsNormalize(detail.platformIds);

      rowDetailExtrasCacheSet(row.id, normalizedPlatformIds, detail.asset ?? null);
      stateDetailRow.value = {
        id: Number(detail.id ?? 0),
        title: String(detail.title ?? ''),
        presentationType: String(detail.presentationType ?? ''),
        materialType: String(detail.materialType ?? ''),
        frameType: String(detail.frameType ?? ''),
        editionScope: String(detail.editionScope ?? ''),
        platformIds: normalizedPlatformIds,
        placementType: String(detail.placementType ?? 'opening'),
        price: Number(detail.price ?? 0),
        priority: Number(detail.priority ?? 0),
        isEnabled: Boolean(detail.isEnabled),
        startAt: hotsearchDatetimeValueGet(detail.startAt),
        endAt: hotsearchDatetimeValueGet(detail.endAt),
        updatedAt: hotsearchDatetimeValueGet(detail.updatedAt),
        createdAt: hotsearchDatetimeValueGet(detail.createdAt),
        asset: detail.asset ?? null
      };
      stateDetailLines.value = [...detail.lines].sort((left, right) => Number(left.lineNo ?? 0) - Number(right.lineNo ?? 0));
      stateDetailNotes.value = String(detail.notes ?? '').trim();

      await detailAssetPreviewLoad(detail.asset ?? null);

      // 如果是视频，自动播放
      if (stateDetailRow.value.materialType === 'video' && stateDetailAssetPreviewUrl.value !== '') {
        await nextTick();
        stateDetailPlayerVisible.value = true;
        await nextTick();
        await stateRefDetailPlayer.value?.player?.play();
      }
    } catch (error) {
      stateDetailAssetPreviewLoading.value = false;
      toast.add({
        description: error instanceof Error ? error.message : t('pages.ads.hotsearch.toast.detailLoadFailed'),
        color: 'error',
        icon: 'i-lucide:triangle-alert',
        duration: 2500,
        type: 'foreground',
        close: false
      });
    }
  })();
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
      description: error instanceof Error ? error.message : t('pages.ads.hotsearch.toast.detailLoadFailed'),
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
      description: t('pages.ads.hotsearch.toast.deleteSuccess'),
      color: 'success',
      icon: 'i-lucide:check-circle-2',
      duration: 2200,
      type: 'foreground',
      close: false
    });
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : t('pages.ads.hotsearch.toast.deleteFailed'),
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
    return { icon: 'i-lucide:image', text: t('pages.ads.hotsearch.materialPreview.image') };
  }

  if (row.materialType === 'video') {
    return { icon: 'i-lucide:clapperboard', text: t('pages.ads.hotsearch.materialPreview.video') };
  }

  return { icon: 'i-lucide:audio-lines', text: t('pages.ads.hotsearch.materialPreview.voice') };
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
      throw new Error(t('pages.ads.hotsearch.validation.adLineRequired'));
    }

    if (stateEditor.value.materialType !== 'none') {
      if (!stateEditor.value.asset) {
        throw new Error(t('pages.ads.hotsearch.validation.uploadAssetRequired'));
      }

      if (stateEditorAssetFile.value) {
        uploadedAsset = await uploadEditorAssetFile(stateEditorAssetFile.value, stateEditor.value.asset);
      } else {
        uploadedAsset = editorAssetPayloadBuild(stateEditor.value.asset);

        if (uploadedAsset.path.trim() === '') {
          throw new Error(t('pages.ads.hotsearch.validation.uploadAssetRequired'));
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
      description: error instanceof Error ? error.message : t('pages.ads.hotsearch.toast.saveFailed'),
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
    header: t('pages.ads.hotsearch.table.id'),
    cell: ({ row }) => row.original.id.toString().padStart(5, '0'),
    meta: { class: { th: 'w-16 text-sm', td: 'w-16 text-sm align-middle' } }
  },
  {
    id: 'adInfoSm',
    header: t('pages.ads.hotsearch.table.summary'),
    meta: { class: { th: 'lg:hidden text-sm', td: 'lg:hidden align-middle' } },
    cell: ({ row }) => hotsearchAdInfoCellRender(row.original)
  },
  {
    id: 'adInfoMd',
    header: t('pages.ads.hotsearch.table.summary'),
    meta: { class: { th: 'hidden lg:table-cell xl:hidden min-w-58 text-sm', td: 'hidden lg:table-cell xl:hidden min-w-58 align-middle' } },
    cell: ({ row }) => hotsearchAdInfoCellRender(row.original)
  },
  {
    id: 'adInfoLg',
    header: t('pages.ads.hotsearch.table.summary'),
    meta: { class: { th: 'hidden xl:table-cell 2xl:hidden min-w-58 text-sm', td: 'hidden xl:table-cell 2xl:hidden min-w-58 align-middle' } },
    cell: ({ row }) => hotsearchAdInfoCellRender(row.original, false)
  },
  {
    id: 'titleXl',
    accessorKey: 'title',
    header: t('pages.ads.hotsearch.table.title'),
    meta: { class: { th: 'hidden 2xl:table-cell min-w-52 4xl:min-w-60 text-sm', td: 'hidden 2xl:table-cell min-w-52 4xl:min-w-60 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm leading-6 font-medium text-highlighted whitespace-normal break-words' }, row.original.title || t('pages.ads.hotsearch.table.untitled'))
  },
  {
    id: 'editionXl',
    accessorKey: 'editionScope',
    header: t('pages.ads.hotsearch.table.editionScope'),
    meta: { class: { th: 'hidden 2xl:table-cell 3xl:hidden w-18 text-sm text-left', td: 'hidden 2xl:table-cell 3xl:hidden w-18 align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-x-4 text-xs' }, [
        h('div', { class: 'flex items-center gap-1.5' }, [h(UCheckbox, { modelValue: Boolean(row.original.editionScope === 'morning' || row.original.editionScope === 'both'), disabled: true }), h('span', { class: 'text-muted' }, t('pages.ads.hotsearch.table.morning'))]),
        h('div', { class: 'flex items-center gap-1.5' }, [h(UCheckbox, { modelValue: Boolean(row.original.editionScope === 'evening' || row.original.editionScope === 'both'), disabled: true }), h('span', { class: 'text-muted' }, t('pages.ads.hotsearch.table.evening'))])
      ])
  },
  {
    id: 'editionMorning',
    header: t('pages.ads.hotsearch.table.morning'),
    accessorKey: 'editionMorning',
    meta: { class: { th: 'hidden 3xl:table-cell w-14 text-sm text-center', td: 'hidden 3xl:table-cell w-14 align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, [h(UCheckbox, { modelValue: Boolean(row.original.editionMorning), disabled: true })])
  },
  {
    id: 'editionEvening',
    header: t('pages.ads.hotsearch.table.evening'),
    accessorKey: 'editionEvening',
    meta: { class: { th: 'hidden 3xl:table-cell w-14 text-sm text-center', td: 'hidden 3xl:table-cell w-14 align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, [h(UCheckbox, { modelValue: Boolean(row.original.editionEvening), disabled: true })])
  },
  {
    id: 'platformXl',
    header: t('pages.ads.hotsearch.table.platform'),
    meta: { class: { th: 'hidden 2xl:table-cell min-w-40 w-40 4xl:min-w-52 4xl:w-52 text-sm', td: 'hidden 2xl:table-cell min-w-40 w-40 4xl:min-w-52 4xl:w-52 align-middle' } },
    cell: ({ row }) => platformLinksRender(row.original)
  },
  {
    id: 'priorityXl',
    accessorKey: 'priority',
    header: t('pages.ads.hotsearch.table.priority'),
    meta: { class: { th: 'hidden 2xl:table-cell w-14 text-sm', td: 'hidden 2xl:table-cell w-14 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, String(row.original.priority))
  },
  {
    id: 'placementCompact',
    header: t('pages.ads.hotsearch.table.delivery'),
    meta: { class: { th: 'hidden xl:table-cell 3xl:hidden min-w-30 w-30 text-sm', td: 'hidden xl:table-cell 3xl:hidden min-w-30 w-30 align-middle' } },
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'flex flex-col gap-1.5 text-xs' }, [
        h('span', { class: 'text-muted' }, `${t('pages.ads.hotsearch.table.materialType')}：${materialTypeLabelGet(item.materialType)}  ${t('pages.ads.hotsearch.table.type')}：${presentationTypeLabelGet(item.presentationType)}`),
        h('span', { class: 'text-muted' }, `${t('pages.ads.hotsearch.table.frameType')}：${frameTypeLabelGet(item.frameType)}  ${t('pages.ads.hotsearch.table.placementType')}：${placementTypeLabelGet(item.placementType)}`)
      ]);
    }
  },
  {
    id: 'typesCombined2xl',
    header: t('pages.ads.hotsearch.table.type'),
    meta: { class: { th: 'hidden 3xl:table-cell 5xl:hidden min-w-28 w-28 text-sm', td: 'hidden 3xl:table-cell 5xl:hidden min-w-28 w-28 align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col gap-1 text-xs whitespace-normal break-words' }, [
        h('span', { class: 'text-muted' }, `${t('pages.ads.hotsearch.table.materialType')}：${materialTypeLabelGet(row.original.materialType)}`),
        h('span', { class: 'text-muted' }, `${t('pages.ads.hotsearch.table.type')}：${presentationTypeLabelGet(row.original.presentationType)}`)
      ])
  },
  {
    id: 'material4xl',
    accessorKey: 'materialType',
    header: t('pages.ads.hotsearch.table.materialType'),
    meta: { class: { th: 'hidden 5xl:table-cell min-w-18 w-18 text-sm', td: 'hidden 5xl:table-cell min-w-18 w-18 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, materialTypeLabelGet(row.original.materialType))
  },
  {
    id: 'type4xl',
    accessorKey: 'presentationType',
    header: t('pages.ads.hotsearch.table.type'),
    meta: { class: { th: 'hidden 5xl:table-cell min-w-18 w-18 text-sm', td: 'hidden 5xl:table-cell min-w-18 w-18 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, presentationTypeLabelGet(row.original.presentationType))
  },
  {
    accessorKey: 'frameType',
    header: t('pages.ads.hotsearch.table.frameType'),
    meta: { class: { th: 'hidden 3xl:table-cell w-16 text-sm', td: 'hidden 3xl:table-cell w-16 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, frameTypeLabelGet(row.original.frameType))
  },
  {
    id: 'placement2xl',
    accessorKey: 'placementType',
    header: t('pages.ads.hotsearch.table.placementType'),
    meta: { class: { th: 'hidden 3xl:table-cell w-16 text-sm', td: 'hidden 3xl:table-cell w-16 align-middle' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, placementTypeLabelGet(row.original.placementType))
  },
  {
    accessorKey: 'priceText',
    header: t('pages.ads.hotsearch.table.price'),
    meta: { class: { th: 'w-22 text-left text-sm', td: 'w-22 text-right align-middle' } },
    cell: ({ row }) => priceCellRender(row.original.priceText)
  },
  {
    id: 'timeCompact',
    header: t('pages.ads.hotsearch.table.time'),
    meta: { class: { th: 'xl:hidden w-44 text-sm', td: 'xl:hidden w-44 align-middle' } },
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'flex flex-col gap-1.5 text-xs' }, [
        h('div', { class: 'text-muted' }, [h('span', `${t('pages.ads.hotsearch.table.startAt')}：`), h(Datetime, { datetime: item.startAt, mode: 'datetime' })]),
        h('div', { class: 'text-muted' }, [h('span', `${t('pages.ads.hotsearch.table.endAt')}：`), h(Datetime, { datetime: item.endAt, mode: 'datetime' })]),
        h('div', { class: 'text-muted' }, [h('span', `${t('pages.ads.hotsearch.table.updatedAt')}：`), h(Datetime, { datetime: item.updatedAt, mode: 'datetime' })]),
        h('div', { class: 'text-muted' }, [h('span', `${t('pages.ads.hotsearch.table.createdAt')}：`), h(Datetime, { datetime: item.createdAt, mode: 'datetime' })])
      ]);
    }
  },
  {
    id: 'timeRange',
    header: t('pages.ads.hotsearch.table.effectiveRange'),
    meta: { class: { th: 'hidden xl:table-cell 4xl:hidden w-30 text-right text-sm', td: 'hidden xl:table-cell 4xl:hidden w-30 text-right align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex flex-col gap-1 text-xs text-muted' }, [h(Datetime, { datetime: row.original.startAt, mode: 'datetime' }), h(Datetime, { datetime: row.original.endAt, mode: 'datetime' })])
  },
  {
    accessorKey: 'startAt',
    header: t('pages.ads.hotsearch.table.startAt'),
    meta: { class: { th: 'hidden 4xl:table-cell w-24 text-right text-sm', td: 'hidden 4xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.startAt, mode: 'datetime' })
  },
  {
    accessorKey: 'endAt',
    header: t('pages.ads.hotsearch.table.endAt'),
    meta: { class: { th: 'hidden 4xl:table-cell w-24 text-right text-sm', td: 'hidden 4xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.endAt, mode: 'datetime' })
  },
  {
    id: 'timePair',
    header: t('pages.ads.hotsearch.table.auditTime'),
    meta: { class: { th: 'hidden xl:table-cell 5xl:hidden w-30 text-right text-sm', td: 'hidden xl:table-cell 5xl:hidden w-30 text-right align-middle' } },
    cell: ({ row }) => h('div', { class: 'flex flex-col gap-1 text-xs text-muted' }, [h(Datetime, { datetime: row.original.updatedAt, mode: 'datetime' }), h(Datetime, { datetime: row.original.createdAt, mode: 'datetime' })])
  },
  {
    accessorKey: 'updatedAt',
    header: t('pages.ads.hotsearch.table.updatedAt'),
    meta: { class: { th: 'hidden 5xl:table-cell w-24 text-right text-sm', td: 'hidden 5xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.updatedAt, mode: 'datetime' })
  },
  {
    accessorKey: 'createdAt',
    header: t('pages.ads.hotsearch.table.createdAt'),
    meta: { class: { th: 'hidden 5xl:table-cell w-24 text-right text-sm', td: 'hidden 5xl:table-cell w-24 text-right align-middle' } },
    cell: ({ row }) => h(Datetime, { datetime: row.original.createdAt, mode: 'datetime' })
  },
  {
    accessorKey: 'isEnabled',
    header: t('pages.ads.hotsearch.table.enabled'),
    meta: { class: { th: 'w-16 text-center text-sm', td: 'w-16 text-center align-middle' } },
    cell: ({ row }) => h(USwitch, { modelValue: row.original.isEnabled, 'onUpdate:modelValue': (value: boolean) => handleToggleEnabled(row.original, value) })
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'w-full text-right' }, t('pages.ads.hotsearch.table.actions')),
    meta: { class: { th: 'w-34 text-right text-sm', td: 'w-34 text-right align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-end gap-2 text-sm' }, [
        h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.ads.hotsearch.actions.view'), onClick: () => handleViewDetail(row.original) }),
        h(UButton, { color: 'neutral', variant: 'ghost', label: t('common.actions.edit'), onClick: () => void handleEdit(row.original) }),
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
                label: t('common.actions.delete'),
                onClick: () => {
                  stateDeletePopoverOpenId.value = row.original.id;
                }
              }),
            content: () =>
              h('div', { class: 'space-y-3' }, [
                h('div', { class: 'text-sm leading-6 text-pretty text-default' }, t('pages.ads.hotsearch.actions.deleteConfirm')),
                h('div', { class: 'flex items-center justify-end gap-2' }, [
                  h(UButton, {
                    color: 'neutral',
                    variant: 'soft',
                    size: 'xs',
                    label: t('common.actions.cancel'),
                    onClick: () => {
                      stateDeletePopoverOpenId.value = null;
                    }
                  }),
                  h(UButton, {
                    color: 'error',
                    variant: 'solid',
                    size: 'xs',
                    label: t('pages.ads.hotsearch.actions.confirmDelete'),
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
    const previewUrl = await assetPreviewUrlResolve(asset, t('pages.ads.hotsearch.toast.assetSignUrlFailed'));

    if (currentToken !== detailAssetPreviewToken) {
      return;
    }

    stateDetailAssetPreviewUrl.value = previewUrl;
  } catch (error) {
    if (currentToken !== detailAssetPreviewToken) {
      return;
    }

    toast.add({
      description: error instanceof Error ? error.message : t('pages.ads.hotsearch.toast.previewLoadFailed'),
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
 * 函数：按需补全当前页列表的详情信息。
 * @returns {Promise<void>} 无返回值。
 */
const hydrateCurrentPageRowDetailExtras = async (): Promise<void> => {
  const platformFilter = currentPlatformFilterGet();
  const rows = datas.value?.rows ?? [];

  if (platformFilter === '' || rows.length === 0) {
    return;
  }

  const targets = rows.map((row) => Number(row.id ?? 0)).filter((id) => id > 0 && !stateRowDetailExtras.value.has(id));

  if (targets.length === 0) {
    return;
  }

  await Promise.all(
    targets.map(async (id) => {
      try {
        const detail = await hotsearchAdMaterialDetailGet(id);

        rowDetailExtrasCacheSet(id, editorPlatformIdsNormalize(detail.platformIds), detail.asset ?? null);
      } catch {
        // 当前页平台筛选缺少后端汇总字段时，静默跳过单行补全失败，避免影响列表主流程。
      }
    })
  );
};

/**
 * 监听：路由变化时刷新列表。
 */
watch(
  () => route.query,
  () => {
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
    void hydrateCurrentPageRowDetailExtras();
  }
);

/**
 * 监听：列表数据刷新后按需补全平台筛选所需详情。
 */
watch(
  () => datas.value?.rows,
  () => {
    void hydrateCurrentPageRowDetailExtras();
  }
);

watch(
  () => createNonce,
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
      stateDetailLines.value = [];
      stateDetailNotes.value = '';
      stateDetailPlayerVisible.value = false;
      stateRefDetailPlayer.value = null;
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

  if (statePreviewCanvasContainerElement.value) {
    previewStageObserver.observe(statePreviewCanvasContainerElement.value);
  }

  if (statePreviewStageElement.value) {
    previewStageObserver.observe(statePreviewStageElement.value);
  }
});
</script>
