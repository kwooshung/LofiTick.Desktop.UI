<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.hotsearch.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.hotsearch.description') }}</p>
        </div>
        <ULink raw :to="localePath('/hotsearch')" class="border-primary text-primary hover:bg-primary/8 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors">
          <UIcon name="i-material-symbols:bigtop-updates-rounded" class="size-4 shrink-0" />
          {{ t('pages.settings.hotsearch.header.enter') }}
        </ULink>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.hotsearch.fields.enabled.label')" :description="t('pages.settings.hotsearch.fields.enabled.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USwitch :model-value="stateHotsearchConfig.enabled" @update:model-value="handleEnabledUpdate" />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.podcastEnabled.label')"
        :description="t('pages.settings.hotsearch.fields.podcastEnabled.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <USwitch :model-value="stateHotsearchConfig.podcastEnabled" @update:model-value="handlePodcastEnabledUpdate" />
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.monthlyBudget.label')"
        :description="t('pages.settings.hotsearch.fields.monthlyBudget.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <div class="flex flex-wrap items-center justify-end gap-2">
          <UInputNumber :model-value="stateHotsearchConfig.monthlyBudget" orientation="vertical" :min="1" :step="1" color="primary" variant="outline" class="w-40" @update:model-value="handleMonthlyBudgetUpdate" />
        </div>
      </UFormField>
    </UPageCard>

    <SettingsHotsearchHeadMusic
      :disabled="stateSaving"
      :attachments-dir-configured="Boolean(stateHotsearchPodcastHeadMusicPaths?.attachmentsDir)"
      :generate-enabled="stateHotsearchConfig.podcastGenerateEnabled"
      :generate-loading="stateHotsearchPodcastGenerateLoading"
      :generate-disabled="computedHotsearchPodcastGenerateDisabled"
      :generate-owner-exists="Boolean(stateHotsearchPodcastGenerateOwner)"
      :generate-owned-by-current-machine="computedHotsearchPodcastGenerateOwnerIsCurrentMachine"
      :generate-owner-description="computedHotsearchPodcastGenerateOwnerDescription"
      :items="computedHotsearchPodcastHeadMusicItems"
      :preview-request="refreshHotsearchPodcastHeadMusicPreviewUrl"
      :upload-request="handlePodcastHeadMusicUploadSubmit"
      @update:generate-enabled="handlePodcastGenerateEnabledUpdate"
    />

    <SettingsHotsearchPodcastScriptList
      :male-speaker-name="stateHotsearchConfig.podcastMaleSpeakerName"
      :female-speaker-name="stateHotsearchConfig.podcastFemaleSpeakerName"
      :morning-program-name="stateHotsearchConfig.podcastMorningProgramName"
      :evening-program-name="stateHotsearchConfig.podcastEveningProgramName"
      :vip-morning-program-name="stateHotsearchConfig.podcastVipMorningProgramName"
      :vip-evening-program-name="stateHotsearchConfig.podcastVipEveningProgramName"
      :template-items="stateHotsearchConfig.podcastTemplateItems"
      @update:male-speaker-name="handlePodcastMaleSpeakerNameUpdate"
      @update:female-speaker-name="handlePodcastFemaleSpeakerNameUpdate"
      @update:morning-program-name="handlePodcastMorningProgramNameUpdate"
      @update:evening-program-name="handlePodcastEveningProgramNameUpdate"
      @update:vip-morning-program-name="handlePodcastVipMorningProgramNameUpdate"
      @update:vip-evening-program-name="handlePodcastVipEveningProgramNameUpdate"
      @update:template-items="handlePodcastTemplateItemsUpdate"
    />

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.hotsearch.sections.podcastRules.title') }}</h3>
          <p class="text-muted mt-1 text-sm">{{ t('pages.settings.hotsearch.sections.podcastRules.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'px-0!' }">
      <UFormField :label="t('pages.settings.hotsearch.fields.podcastAiRulesMarkdown.label')" :description="t('pages.settings.hotsearch.fields.podcastAiRulesMarkdown.description')" :ui="{ label: 'px-8 text-base text-highlighted mb-1', description: 'px-8 text-muted' }">
        <UEditor
          v-slot="{ editor }"
          v-model="statePodcastAiRulesMarkdownDraft"
          content-type="markdown"
          :placeholder="t('pages.settings.hotsearch.fields.podcastAiRulesMarkdown.placeholder')"
          :enable-input-rules="true"
          :enable-paste-rules="true"
          class="min-h-72 w-full"
          :ui="{ root: 'border-0 rounded-none', base: 'pt-5 pb-3 sm:pt-6 sm:pb-4' }"
        >
          <div class="border-default mt-6 border-y">
            <UEditorToolbar :editor="editor" :items="computedPodcastAiRulesToolbarItems" class="overflow-x px-6 py-2" />
          </div>
          <UEditorDragHandle :editor="editor" />
          <UEditorSuggestionMenu :editor="editor" :items="computedPodcastAiRulesSuggestionItems" :append-to="appendPodcastAiRulesMenuToBody" />
        </UEditor>

        <div class="bg-muted/35 border-default/80 border-t px-6 pt-6" aria-readonly="true">
          <p class="text-muted text-xs leading-5">{{ t('pages.settings.hotsearch.fields.podcastAiRulesMarkdown.systemLineLabel') }}</p>
          <p class="text-toned mt-1 text-sm leading-6 whitespace-pre-wrap">{{ computedPodcastAiRulesSystemLine }}</p>
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.hotsearch.sections.schedule.title') }}</h3>
          <p class="text-muted mt-1 text-sm">{{ t('pages.settings.hotsearch.sections.schedule.description') }}</p>
        </div>

        <UButton color="primary" variant="soft" size="sm" icon="i-lucide:rotate-ccw" :ui="{ leadingIcon: 'text-muted' }" :loading="stateSaving" class="shrink-0" @click="handleResetScheduleDefaults">
          {{ t('pages.settings.hotsearch.actions.reset') }}
        </UButton>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
      <UFormField
        :label="t('pages.settings.hotsearch.fields.morningStartAt.label')"
        :description="t('pages.settings.hotsearch.fields.morningStartAt.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputTime :model-value="computedMorningStartAtValue" granularity="minute" :hour-cycle="24" color="primary" variant="outline" class="w-36" @update:model-value="handleMorningStartAtUpdate">
          <template #leading>
            <UIcon name="i-lucide:clock-3" class="text-dimmed size-4" />
          </template>
        </UInputTime>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.eveningStartAt.label')"
        :description="t('pages.settings.hotsearch.fields.eveningStartAt.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <UInputTime :model-value="computedEveningStartAtValue" granularity="minute" :hour-cycle="24" color="primary" variant="outline" class="w-36" @update:model-value="handleEveningStartAtUpdate">
          <template #leading>
            <UIcon name="i-lucide:clock-9" class="text-dimmed size-4" />
          </template>
        </UInputTime>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.platformIntervalSeconds.label')"
        :description="t('pages.settings.hotsearch.fields.platformIntervalSeconds.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <div class="grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center">
          <label for="hotsearchPlatformIntervalSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.platformIntervalSeconds.input.prefix') }}</label>
          <div class="border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center border transition-colors duration-300">
            <UInputNumber
              id="hotsearchPlatformIntervalSeconds"
              :model-value="stateHotsearchConfig.platformIntervalSeconds"
              orientation="vertical"
              :min="1"
              :step="1"
              color="primary"
              variant="none"
              class="h-8 w-full"
              :increment="{ color: 'neutral', variant: 'soft' }"
              :decrement="{ color: 'neutral', variant: 'soft' }"
              @update:model-value="handlePlatformIntervalSecondsUpdate"
            />
          </div>
          <label for="hotsearchPlatformIntervalSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.platformIntervalSeconds.input.unit') }}</label>
        </div>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.scheduleJitterSeconds.label')"
        :description="t('pages.settings.hotsearch.fields.scheduleJitterSeconds.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <div class="grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center">
          <label for="hotsearchScheduleJitterSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.scheduleJitterSeconds.input.prefix') }}</label>
          <div class="border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center border transition-colors duration-300">
            <UInputNumber
              id="hotsearchScheduleJitterSeconds"
              :model-value="stateHotsearchConfig.scheduleJitterSeconds"
              orientation="vertical"
              :min="0"
              :step="60"
              color="primary"
              variant="none"
              class="h-8 w-full"
              :increment="{ color: 'neutral', variant: 'soft' }"
              :decrement="{ color: 'neutral', variant: 'soft' }"
              @update:model-value="handleScheduleJitterSecondsUpdate"
            />
          </div>
          <label for="hotsearchScheduleJitterSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.scheduleJitterSeconds.input.unit') }}</label>
        </div>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.podcastBufferSeconds.label')"
        :description="t('pages.settings.hotsearch.fields.podcastBufferSeconds.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <div class="grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center">
          <label for="hotsearchPodcastBufferSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.podcastBufferSeconds.input.prefix') }}</label>
          <div class="border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center border transition-colors duration-300">
            <UInputNumber
              id="hotsearchPodcastBufferSeconds"
              :model-value="stateHotsearchConfig.podcastBufferSeconds"
              orientation="vertical"
              :min="0"
              :step="60"
              color="primary"
              variant="none"
              class="h-8 w-full"
              :increment="{ color: 'neutral', variant: 'soft' }"
              :decrement="{ color: 'neutral', variant: 'soft' }"
              @update:model-value="handlePodcastBufferSecondsUpdate"
            />
          </div>
          <label for="hotsearchPodcastBufferSeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.podcastBufferSeconds.input.unit') }}</label>
        </div>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.retryMaxAttempts.label')"
        :description="t('pages.settings.hotsearch.fields.retryMaxAttempts.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <div class="grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center">
          <label for="hotsearchRetryMaxAttempts" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.retryMaxAttempts.input.prefix') }}</label>
          <div class="border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center border transition-colors duration-300">
            <UInputNumber
              id="hotsearchRetryMaxAttempts"
              :model-value="stateHotsearchConfig.retryMaxAttempts"
              orientation="vertical"
              :min="0"
              :step="1"
              color="primary"
              variant="none"
              class="h-8 w-full"
              :increment="{ color: 'neutral', variant: 'soft' }"
              :decrement="{ color: 'neutral', variant: 'soft' }"
              @update:model-value="handleRetryMaxAttemptsUpdate"
            />
          </div>
          <label for="hotsearchRetryMaxAttempts" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.retryMaxAttempts.input.unit') }}</label>
        </div>
      </UFormField>

      <UFormField
        :label="t('pages.settings.hotsearch.fields.retryDelaySeconds.label')"
        :description="t('pages.settings.hotsearch.fields.retryDelaySeconds.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-3 not-last:pb-4"
      >
        <div class="grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center">
          <label for="hotsearchRetryDelaySeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.retryDelaySeconds.input.prefix') }}</label>
          <div class="border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center border transition-colors duration-300">
            <UInputNumber
              id="hotsearchRetryDelaySeconds"
              :model-value="stateHotsearchConfig.retryDelaySeconds"
              orientation="vertical"
              :min="1"
              :step="60"
              color="primary"
              variant="none"
              class="h-8 w-full"
              :increment="{ color: 'neutral', variant: 'soft' }"
              :decrement="{ color: 'neutral', variant: 'soft' }"
              @update:model-value="handleRetryDelaySecondsUpdate"
            />
          </div>
          <label for="hotsearchRetryDelaySeconds" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ t('pages.settings.hotsearch.fields.retryDelaySeconds.input.unit') }}</label>
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-start gap-3' }">
      <template #header>
        <div class="flex w-full flex-col items-start gap-3 md:flex-row md:items-start">
          <div class="min-w-0 flex-1">
            <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.hotsearch.sections.platforms.title') }}</h3>
            <p class="text-muted text-sm">{{ t('pages.settings.hotsearch.sections.platforms.description') }}</p>
          </div>

          <div class="flex w-full items-center justify-end gap-2 self-end md:ml-auto md:w-auto md:shrink-0 md:self-start">
            <UBadge color="neutral" variant="soft">{{ computedSelectedPlatformCount }}/{{ computedPlatforms.length }}</UBadge>
            <div class="bg-elevated/60 border-default flex items-center gap-2 rounded-full border px-3 py-1.5">
              <span class="text-toned text-xs font-medium">{{ t('pages.settings.hotsearch.actions.selectAll') }}</span>
              <USwitch :model-value="computedAllPlatformsSelected" @update:model-value="handlePlatformsToggleAll" />
            </div>
          </div>
        </div>
      </template>
    </UPageCard>

    <div class="mb-6 grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-3">
      <div v-for="platform in computedPlatforms" :key="platform.id" class="bg-elevated/40 border-default/70 hover:border-primary/35 flex min-h-28 items-start justify-between gap-3 rounded-lg border p-4 transition-colors duration-200">
        <div class="min-w-0 space-y-2">
          <div class="text-highlighted text-sm leading-5 font-medium">{{ platform.label }}</div>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge color="neutral" variant="soft" size="sm">#{{ platform.id }}</UBadge>
            <UBadge v-if="platform.selected" color="primary" variant="soft" size="sm">
              {{ t('pages.settings.hotsearch.fields.enabled.label') }}
            </UBadge>
          </div>
        </div>

        <USwitch :model-value="platform.selected" @update:model-value="(value) => handlePlatformEnabledUpdate(platform.id, value)" />
      </div>
    </div>

    <UPageCard :title="t('pages.settings.hotsearch.sections.summary.title')" :description="t('pages.settings.hotsearch.sections.summary.description')" variant="naked" />

    <div class="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UPageCard icon="i-lucide:layers-2" :title="t('pages.settings.hotsearch.summary.selectedPlatforms')" :description="String(computedSelectedPlatformCount)" />
      <UPageCard icon="i-lucide:zap" :title="t('pages.settings.hotsearch.summary.perWindowCost')" :description="String(computedPerWindowCost)" />
      <UPageCard icon="i-lucide:calendar-days" :title="t('pages.settings.hotsearch.summary.dailyCost')" :description="String(computedDailyCost)" />
      <UPageCard icon="i-lucide:calendar-range" :title="t('pages.settings.hotsearch.summary.monthlyEstimate')" :description="String(computedMonthlyEstimate)" />
      <UPageCard icon="i-lucide:timer" :title="t('pages.settings.hotsearch.summary.windowDuration')" :description="t('pages.settings.hotsearch.summary.minutesValue', { value: computedWindowDurationMinutes })" />
      <UPageCard icon="i-lucide:clock-3" :title="t('pages.settings.hotsearch.summary.suggestedMorningPodcast')" :description="computedSuggestedMorningPodcastTime" />
      <UPageCard icon="i-lucide:clock-9" :title="t('pages.settings.hotsearch.summary.suggestedEveningPodcast')" :description="computedSuggestedEveningPodcastTime" />
      <UPageCard icon="i-lucide:shield-alert">
        <template #title>
          <div class="flex items-center gap-2">
            <span>{{ t('pages.settings.hotsearch.summary.budgetStatus') }}</span>
            <UBadge :color="computedBudgetStatusColor" variant="soft">{{ computedBudgetStatusLabel }}</UBadge>
          </div>
        </template>
        <div class="space-y-1.5">
          <p class="text-toned text-sm leading-6">{{ computedBudgetStatusMonthDescription }}</p>
          <p class="text-toned text-sm leading-6">{{ computedBudgetStatusYearDescription }}</p>
        </div>
      </UPageCard>
    </div>

    <SettingsHotsearchAttachmentsDirDialog v-model:open="stateHotsearchAttachmentsDirDialogOpen" :current-path="stateHotsearchPodcastHeadMusicPaths?.attachmentsDir || ''" @selected="handleHotsearchAttachmentsDirPick" />
  </DashboardPage>
</template>

<script setup lang="ts">
import { parseTime } from '@internationalized/date';
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui';
import type { InputTimeProps } from '@nuxt/ui/runtime/components/InputTime.vue';

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：运行时配置。
 */
const runtimeConfig = useRuntimeConfig();

/**
 * 函数：将编辑器浮层挂到 body。
 */
const appendPodcastAiRulesMenuToBody = import.meta.client ? () => document.body : undefined;

/**
 * Hook：提示消息。
 */
const toast = useToast();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置
 */
const tauriSettings = useTauriSettings();

/**
 * Hook：Tauri 直连 API 客户端。
 */
const tauriApiClient = useTauriApiClient();

/**
 * Hook：Tauri 任务
 */
const tauriTasks = useTauriTasks();

/**
 * API：热搜配置（GET / PATCH）
 * 描述：用于与服务端 Redis 同步热搜设置。
 */
const { datas: stateHotsearchRemoteConfig, refresh: refreshHotsearchRemoteGet } = await useApi<ISettingsHotsearch>('desktop/settings/hotsearch', { immediate: false });
const { refreshDebounced: refreshHotsearchRemotePatchDebounced } = await useApi<ISettingsHotsearch>('desktop/settings/hotsearch', {
  method: 'PATCH',
  immediate: false
});
const { datas: stateHotsearchPodcastGenerateOwnerRemote, error: stateHotsearchPodcastGenerateOwnerGetError, refresh: refreshHotsearchPodcastGenerateOwnerGet } = await useApi<ISettingsHotsearchPodcastGenerateOwner>('desktop/settings/hotsearch/podcast_generate_owner', { immediate: false });
const { error: stateHotsearchPodcastGenerateOwnerPatchError, refresh: refreshHotsearchPodcastGenerateOwnerPatch } = await useApi<ISettingsHotsearchPodcastGenerateOwner>('desktop/settings/hotsearch/podcast_generate_owner', {
  method: 'PATCH',
  immediate: false
});
const { datas: stateUpyunObjectUrl, error: stateUpyunObjectUrlError, refresh: refreshUpyunObjectUrlGet } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/url`, { immediate: false });
const { datas: stateUpyunObjectDownload, error: stateUpyunObjectDownloadError, refresh: refreshUpyunObjectDownloadGet } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/download`, { immediate: false });
const {
  datas: stateUpyunDirectUploadPolicy,
  error: stateUpyunDirectUploadPolicyError,
  refresh: refreshUpyunDirectUploadPolicyPost
} = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/direct-upload/policy`, {
  method: 'POST',
  immediate: false
});
const { refresh: refreshUpyunObjectDeletePost } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/delete`, {
  method: 'POST',
  immediate: false
});

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 状态：热搜设置
 */
const stateHotsearchConfig = ref<ISettingsHotsearchLocal>(hotsearchLocalSettingsDefaultCreate());

/**
 * 状态：播客 AI 规则草稿。
 */
const statePodcastAiRulesMarkdownDraft = ref('');

/**
 * 计算属性：AI 规则固定尾注。
 */
const computedPodcastAiRulesSystemLine = computed((): string => {
  return hotsearchPodcastAiRulesSystemLineBuild(stateHotsearchConfig.value.podcastMaleSpeakerName, stateHotsearchConfig.value.podcastFemaleSpeakerName);
});

/**
 * 状态：播客生成占用机器。
 */
const stateHotsearchPodcastGenerateOwner = ref<ISettingsHotsearchPodcastGenerateOwner | null>(null);

/**
 * 状态：固定开头音乐本地路径。
 */
const stateHotsearchPodcastHeadMusicPaths = ref<Awaited<ReturnType<typeof tauriSettings.hotsearchPodcastHeadMusicPathsGet>> | null>(null);

/**
 * 状态：固定开头音乐本地存在情况。
 */
const stateHotsearchPodcastHeadMusicLocalExists = ref({ normal: false, vip: false });

/**
 * 状态：固定开头音乐远端存在情况。
 */
const stateHotsearchPodcastHeadMusicRemoteExists = ref({ normal: false, vip: false });

/**
 * 状态：播客生成开关处理中。
 */
const stateHotsearchPodcastGenerateLoading = ref(false);

/**
 * 状态：上传中的固定开头音乐类型。
 */
const stateHotsearchPodcastHeadMusicUploadingKind = ref<THotsearchPodcastHeadMusicKind | null>(null);

/**
 * 状态：固定开头音乐上传进度。
 */
const stateHotsearchPodcastHeadMusicUploadProgress = ref<Record<THotsearchPodcastHeadMusicKind, number>>({
  normal: 0,
  vip: 0
});

/**
 * 状态：固定开头音乐预览地址。
 */
const stateHotsearchPodcastHeadMusicPreviewUrls = ref<Record<THotsearchPodcastHeadMusicKind, string>>({
  normal: '',
  vip: ''
});

/**
 * 状态：播客生成错误提示。
 */
const stateHotsearchPodcastGenerateError = ref('');

/**
 * 函数：设置固定开头音乐试听地址。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @param {string} url 试听地址
 * @returns {void} 无返回值
 */
const hotsearchPodcastHeadMusicPreviewUrlSet = (kind: THotsearchPodcastHeadMusicKind, url: string): void => {
  stateHotsearchPodcastHeadMusicPreviewUrls.value[kind] = url;
};

/**
 * 状态：固定开头音乐错误提示。
 */
const stateHotsearchPodcastHeadMusicError = ref('');

/**
 * 状态：附件目录弹窗开关。
 */
const stateHotsearchAttachmentsDirDialogOpen = ref(false);

/**
 * 状态：当前机器码。
 */
const stateHotsearchMachineCode = ref('');

/**
 * 状态：当前机器名称。
 */
const stateHotsearchMachineName = ref('');

/**
 * 状态：壳侧热搜计划快照
 */
const stateRuntimeSchedule = ref<ITauriHotsearchScheduleSnapshot | null>(null);

/**
 * 状态：保存中
 */
const stateSaving = ref(false);

/**
 * 状态：页面数据已完成初始化
 */
const stateHydrated = ref(false);

/**
 * 设置面包屑导航状态
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-lucide:layout-dashboard',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-lucide:settings',
    to: localePath('/settings'),
    exact: true
  },
  {
    label: t('pages.settings.hotsearch.title'),
    icon: 'i-material-symbols:bigtop-updates-rounded',
    to: localePath('/settings/hotsearch')
  }
];

/**
 * 计算属性：播客 AI 规则工具栏项。
 */
const computedPodcastAiRulesToolbarItems = computed((): EditorToolbarItem[][] => [
  [
    {
      icon: 'i-lucide:heading',
      content: {
        align: 'start'
      },
      items: [
        {
          kind: 'heading',
          level: 1,
          icon: 'i-lucide:heading-1',
          label: t('pages.settings.hotsearch.editor.items.heading1')
        },
        {
          kind: 'heading',
          level: 2,
          icon: 'i-lucide:heading-2',
          label: t('pages.settings.hotsearch.editor.items.heading2')
        },
        {
          kind: 'heading',
          level: 3,
          icon: 'i-lucide:heading-3',
          label: t('pages.settings.hotsearch.editor.items.heading3')
        }
      ]
    }
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: 'i-lucide:bold',
      tooltip: { text: t('pages.settings.hotsearch.editor.items.bold') }
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide:italic',
      tooltip: { text: t('pages.settings.hotsearch.editor.items.italic') }
    },
    {
      kind: 'mark',
      mark: 'underline',
      icon: 'i-lucide:underline',
      tooltip: { text: t('pages.settings.hotsearch.editor.items.underline') }
    }
  ],
  [
    {
      kind: 'bulletList',
      icon: 'i-lucide:list',
      tooltip: { text: t('pages.settings.hotsearch.editor.items.bulletList') }
    },
    {
      kind: 'orderedList',
      icon: 'i-lucide:list-ordered',
      tooltip: { text: t('pages.settings.hotsearch.editor.items.orderedList') }
    },
    {
      kind: 'blockquote',
      icon: 'i-lucide:text-quote',
      tooltip: { text: t('pages.settings.hotsearch.editor.items.blockquote') }
    },
    {
      kind: 'codeBlock',
      icon: 'i-lucide:square-code',
      tooltip: { text: t('pages.settings.hotsearch.editor.items.codeBlock') }
    }
  ]
]);

/**
 * 计算属性：播客 AI 规则斜杠菜单项。
 */
const computedPodcastAiRulesSuggestionItems = computed((): EditorSuggestionMenuItem[][] => [
  [
    {
      type: 'label',
      label: t('pages.settings.hotsearch.editor.groups.text')
    },
    {
      kind: 'paragraph',
      label: t('pages.settings.hotsearch.editor.items.paragraph'),
      icon: 'i-lucide:type'
    },
    {
      kind: 'heading',
      level: 1,
      label: t('pages.settings.hotsearch.editor.items.heading1'),
      icon: 'i-lucide:heading-1'
    },
    {
      kind: 'heading',
      level: 2,
      label: t('pages.settings.hotsearch.editor.items.heading2'),
      icon: 'i-lucide:heading-2'
    },
    {
      kind: 'heading',
      level: 3,
      label: t('pages.settings.hotsearch.editor.items.heading3'),
      icon: 'i-lucide:heading-3'
    }
  ],
  [
    {
      type: 'label',
      label: t('pages.settings.hotsearch.editor.groups.lists')
    },
    {
      kind: 'bulletList',
      label: t('pages.settings.hotsearch.editor.items.bulletList'),
      icon: 'i-lucide:list'
    },
    {
      kind: 'orderedList',
      label: t('pages.settings.hotsearch.editor.items.orderedList'),
      icon: 'i-lucide:list-ordered'
    }
  ],
  [
    {
      type: 'label',
      label: t('pages.settings.hotsearch.editor.groups.insert')
    },
    {
      kind: 'blockquote',
      label: t('pages.settings.hotsearch.editor.items.blockquote'),
      icon: 'i-lucide:text-quote'
    },
    {
      kind: 'codeBlock',
      label: t('pages.settings.hotsearch.editor.items.codeBlock'),
      icon: 'i-lucide:square-code'
    },
    {
      kind: 'horizontalRule',
      label: t('pages.settings.hotsearch.editor.items.divider'),
      icon: 'i-lucide:separator-horizontal'
    }
  ]
]);

/**
 * 计算属性：平台列表
 */
const computedPlatforms = computed(() =>
  hotsearchPlatformsList().map((platform) => ({
    ...platform,
    label: t(platform.key),
    selected: stateHotsearchConfig.value.platformIds.includes(platform.id)
  }))
);

/**
 * 计算属性：当月天数
 */
const computedDaysInCurrentMonth = computed(() => {
  /**
   * 常量：now。
   */
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
});

/**
 * 计算属性：已选平台数量
 */
const computedSelectedPlatformCount = computed(() => stateHotsearchConfig.value.platformIds.length);

/**
 * 计算属性：平台是否已全部启用
 */
const computedAllPlatformsSelected = computed(() => computedPlatforms.value.length > 0 && computedSelectedPlatformCount.value === computedPlatforms.value.length);

/**
 * 计算属性：播客生成占用是否为本机。
 */
const computedHotsearchPodcastGenerateOwnerIsCurrentMachine = computed(() => {
  return Boolean(stateHotsearchPodcastGenerateOwner.value?.machineCode) && stateHotsearchPodcastGenerateOwner.value?.machineCode === stateHotsearchMachineCode.value;
});

/**
 * 计算属性：播客生成占用说明。
 */
const computedHotsearchPodcastGenerateOwnerDescription = computed(() => {
  if (!stateHotsearchPodcastGenerateOwner.value) {
    return t('pages.settings.hotsearch.status.podcastGenerateOwnerIdleDescription');
  }

  if (computedHotsearchPodcastGenerateOwnerIsCurrentMachine.value) {
    return t('pages.settings.hotsearch.status.podcastGenerateOwnedByCurrentMachineDescription', {
      machineName: stateHotsearchPodcastGenerateOwner.value.machineName || stateHotsearchMachineName.value,
      machineCode: stateHotsearchPodcastGenerateOwner.value.machineCode
    });
  }

  return t('pages.settings.hotsearch.status.podcastGenerateOwnedByOtherMachineDescription', {
    machineName: stateHotsearchPodcastGenerateOwner.value.machineName,
    machineCode: stateHotsearchPodcastGenerateOwner.value.machineCode
  });
});

/**
 * 计算属性：播客生成开关是否禁用。
 */
const computedHotsearchPodcastGenerateDisabled = computed(() => {
  return Boolean(stateHotsearchPodcastGenerateOwner.value) && !computedHotsearchPodcastGenerateOwnerIsCurrentMachine.value;
});

/**
 * 计算属性：固定开头音乐条目。
 */
const computedHotsearchPodcastHeadMusicItems = computed(() => {
  return HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS.map((kind) => {
    /**
     * 常量：remotePath。
     */
    const remotePath = hotsearchPodcastHeadMusicRemotePathGet(kind);

    return {
      kind,
      title: kind === 'normal' ? t('pages.settings.hotsearch.fields.podcastHeadMusicNormal.label') : t('pages.settings.hotsearch.fields.podcastHeadMusicVip.label'),
      description: kind === 'normal' ? t('pages.settings.hotsearch.fields.podcastHeadMusicNormal.description') : t('pages.settings.hotsearch.fields.podcastHeadMusicVip.description'),
      path: kind === 'normal' ? stateHotsearchPodcastHeadMusicPaths.value?.normalPath || '' : stateHotsearchPodcastHeadMusicPaths.value?.vipPath || '',
      localExists: stateHotsearchPodcastHeadMusicLocalExists.value[kind],
      remoteExists: stateHotsearchPodcastHeadMusicRemoteExists.value[kind],
      remotePath,
      remoteSourceUrl: hotsearchPodcastHeadMusicRemoteUrlBuild(remotePath),
      previewUrl: stateHotsearchPodcastHeadMusicPreviewUrls.value[kind],
      uploadLoading: stateHotsearchPodcastHeadMusicUploadingKind.value === kind,
      uploadProgress: stateHotsearchPodcastHeadMusicUploadProgress.value[kind]
    };
  });
});

/**
 * 计算属性：本地热搜计划窗口
 */
const computedLocalScheduleWindows = computed(() => {
  /**
   * 常量：platformCount。
   */
  const platformCount = computedSelectedPlatformCount.value;
  /**
   * 常量：windowDurationMinutes。
   */
  const windowDurationMinutes = hotsearchWindowDurationMinutesGet(platformCount, stateHotsearchConfig.value.platformIntervalSeconds);

  return [
    {
      key: 'morning',
      estimatedPoints: platformCount,
      windowDurationMinutes,
      suggestedPodcastAt: hotsearchSuggestedPodcastTimeGet(stateHotsearchConfig.value, stateHotsearchConfig.value.morningStartAt)
    },
    {
      key: 'evening',
      estimatedPoints: platformCount,
      windowDurationMinutes,
      suggestedPodcastAt: hotsearchSuggestedPodcastTimeGet(stateHotsearchConfig.value, stateHotsearchConfig.value.eveningStartAt)
    }
  ];
});

/**
 * 函数：按秒偏移时间文本。
 * @param {string} value 时间文本
 * @param {string} fallback 回退时间
 * @param {number} deltaSeconds 偏移秒数
 * @returns {string} 偏移后的时间文本
 */
const hotsearchTimeShiftText = (value: string, fallback: string, deltaSeconds: number): string => {
  /**
   * 函数：normalized。
   */
  const normalized = typeof value === 'string' && /^\d{2}:\d{2}$/.test(value.trim()) ? value.trim() : fallback;
  const [hourText, minuteText] = normalized.split(':');
  /**
   * 常量：baseSeconds。
   */
  const baseSeconds = Number(hourText) * 3600 + Number(minuteText) * 60;
  /**
   * 常量：nextSeconds。
   */
  const nextSeconds = (((baseSeconds + Math.trunc(deltaSeconds)) % 86400) + 86400) % 86400;
  /**
   * 常量：nextHour。
   */
  const nextHour = Math.floor(nextSeconds / 3600);
  /**
   * 常量：nextMinute。
   */
  const nextMinute = Math.floor((nextSeconds % 3600) / 60);
  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
};

/**
 * 函数：格式化随机时间范围。
 * @param {string} value 基准时间
 * @param {string} fallback 回退时间
 * @returns {string} 时间范围文本
 */
const hotsearchTimeRangeText = (value: string, fallback: string): string => {
  /**
   * 常量：jitterSeconds。
   */
  const jitterSeconds = stateHotsearchConfig.value.scheduleJitterSeconds;
  /**
   * 函数：normalized。
   */
  const normalized = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  if (jitterSeconds <= 0) {
    return normalized;
  }

  return t('pages.settings.hotsearch.summary.rangeValue', {
    start: hotsearchTimeShiftText(normalized, fallback, -jitterSeconds),
    end: hotsearchTimeShiftText(normalized, fallback, jitterSeconds)
  });
};

/**
 * 计算属性：早间时间输入值
 */
const computedMorningStartAtValue = computed(() => hotsearchTimeValueFromText(stateHotsearchConfig.value.morningStartAt, '06:00'));

/**
 * 计算属性：晚间时间输入值
 */
const computedEveningStartAtValue = computed(() => hotsearchTimeValueFromText(stateHotsearchConfig.value.eveningStartAt, '18:00'));

/**
 * 计算属性：单窗口积分消耗
 */
const computedPerWindowCost = computed(() => computedLocalScheduleWindows.value[0]?.estimatedPoints ?? 0);

/**
 * 计算属性：每天积分消耗
 */
const computedDailyCost = computed(() => hotsearchEstimatedDayPointsGet(computedSelectedPlatformCount.value, stateHotsearchConfig.value.platformIntervalSeconds));

/**
 * 计算属性：月度预计积分消耗
 */
const computedMonthlyEstimate = computed(() => hotsearchEstimatedMonthPointsGet(computedSelectedPlatformCount.value, stateHotsearchConfig.value.platformIntervalSeconds, computedDaysInCurrentMonth.value));

/**
 * 计算属性：当前年份天数
 */
const computedDaysInCurrentYear = computed(() => {
  /**
   * 常量：now。
   */
  const now = new Date();
  /**
   * 常量：year。
   */
  const year = now.getFullYear();
  /**
   * 常量：start。
   */
  const start = new Date(year, 0, 1);
  /**
   * 常量：end。
   */
  const end = new Date(year + 1, 0, 1);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
});

/**
 * 计算属性：年度预计积分消耗
 */
const computedYearlyEstimate = computed(() => computedDailyCost.value * computedDaysInCurrentYear.value);

/**
 * 计算属性：窗口耗时
 */
const computedWindowDurationMinutes = computed(() => computedLocalScheduleWindows.value[0]?.windowDurationMinutes ?? 0);

/**
 * 计算属性：建议早间播客时间
 */
const computedSuggestedMorningPodcastTime = computed(() => {
  /**
   * 常量：baseTime。
   */
  const baseTime = computedLocalScheduleWindows.value.find((window) => window.key === 'morning')?.suggestedPodcastAt ?? stateHotsearchConfig.value.morningStartAt;
  return hotsearchTimeRangeText(baseTime, stateHotsearchConfig.value.morningStartAt);
});

/**
 * 计算属性：建议晚间播客时间
 */
const computedSuggestedEveningPodcastTime = computed(() => {
  /**
   * 常量：baseTime。
   */
  const baseTime = computedLocalScheduleWindows.value.find((window) => window.key === 'evening')?.suggestedPodcastAt ?? stateHotsearchConfig.value.eveningStartAt;
  return hotsearchTimeRangeText(baseTime, stateHotsearchConfig.value.eveningStartAt);
});

/**
 * 计算属性：预算剩余额度
 */
const computedBudgetRemaining = computed(() => stateHotsearchConfig.value.monthlyBudget - computedMonthlyEstimate.value);

/**
 * 计算属性：年度预算积分
 */
const computedYearlyBudget = computed(() => stateHotsearchConfig.value.monthlyBudget * 12);

/**
 * 计算属性：年度预算剩余额度
 */
const computedYearlyBudgetRemaining = computed(() => computedYearlyBudget.value - computedYearlyEstimate.value);

/**
 * 计算属性：预算状态标签
 */
const computedBudgetStatusLabel = computed(() => {
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget) {
    return t('pages.settings.hotsearch.summary.budgetStatusExceeded');
  }
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget * 0.85) {
    return t('pages.settings.hotsearch.summary.budgetStatusWarning');
  }
  return t('pages.settings.hotsearch.summary.budgetStatusSafe');
});

/**
 * 计算属性：预算状态颜色
 */
const computedBudgetStatusColor = computed(() => {
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget) {
    return 'error';
  }
  if (computedMonthlyEstimate.value > stateHotsearchConfig.value.monthlyBudget * 0.85) {
    return 'warning';
  }
  return 'success';
});

/**
 * 计算属性：预算状态详情
 */
const computedBudgetStatusMonthDescription = computed(() => {
  if (computedBudgetRemaining.value < 0) {
    return t('pages.settings.hotsearch.summary.budgetStatusExceededDetail', {
      scope: t('pages.settings.hotsearch.summary.scopeMonth'),
      budget: stateHotsearchConfig.value.monthlyBudget,
      estimate: computedMonthlyEstimate.value,
      exceeded: Math.abs(computedBudgetRemaining.value)
    });
  }

  return t('pages.settings.hotsearch.summary.budgetStatusRemainingDetail', {
    scope: t('pages.settings.hotsearch.summary.scopeMonth'),
    budget: stateHotsearchConfig.value.monthlyBudget,
    estimate: computedMonthlyEstimate.value,
    remaining: computedBudgetRemaining.value
  });
});

/**
 * 计算属性：预算状态年详情
 */
const computedBudgetStatusYearDescription = computed(() => {
  if (computedYearlyBudgetRemaining.value < 0) {
    return t('pages.settings.hotsearch.summary.budgetStatusExceededDetail', {
      scope: t('pages.settings.hotsearch.summary.scopeYear'),
      budget: computedYearlyBudget.value,
      estimate: computedYearlyEstimate.value,
      exceeded: Math.abs(computedYearlyBudgetRemaining.value)
    });
  }

  return t('pages.settings.hotsearch.summary.budgetStatusRemainingDetail', {
    scope: t('pages.settings.hotsearch.summary.scopeYear'),
    budget: computedYearlyBudget.value,
    estimate: computedYearlyEstimate.value,
    remaining: computedYearlyBudgetRemaining.value
  });
});

/**
 * 函数：将时间文本转换为 UInputTime 可用值
 * @param {string} value 时间文本
 * @param {string} fallback 回退时间
 * @returns {InputTimeProps['modelValue']} 时间值
 */
const hotsearchTimeValueFromText = (value: string, fallback: string): InputTimeProps['modelValue'] => {
  /**
   * 函数：normalized。
   */
  const normalized = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  try {
    return parseTime(normalized) as unknown as InputTimeProps['modelValue'];
  } catch {
    return parseTime(fallback) as unknown as InputTimeProps['modelValue'];
  }
};

/**
 * 函数：将 UInputTime 值格式化为 HH:mm
 * @param {InputTimeProps['modelValue']} value 时间值
 * @param {string} fallback 回退时间
 * @returns {string} 时间文本
 */
const hotsearchTextFromTimeValue = (value: InputTimeProps['modelValue'], fallback: string): string => {
  if (!value) {
    return fallback;
  }

  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
};

/**
 * 函数：将未知值转为普通对象。
 * @param {unknown} input 输入值
 * @returns {Record<string, unknown> | null} 普通对象
 */
const toRecord = (input: unknown): Record<string, unknown> | null => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }

  return input as Record<string, unknown>;
};

/**
 * 常量：开头音乐内部 UpYun 请求统一静默错误。
 */
const HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS = {
  ignoreResponseError: true
} as const;

/**
 * 函数：拼接 files 桶公开对象地址。
 * @param {string} path 对象路径。
 * @returns {string} 公开地址；未配置域名时返回空字符串。
 */
const hotsearchPodcastHeadMusicRemoteUrlBuild = (path: string): string => {
  /**
   * 常量：domain。
   */
  const domain = String(runtimeConfig.public.upyunFilesDomain ?? '')
    .trim()
    .replace(/\/+$/, '');
  /**
   * 函数：normalizedPath。
   */
  const normalizedPath = String(path ?? '').trim();

  if (!domain || !normalizedPath) {
    return '';
  }

  /**
   * 常量：uriPath。
   */
  const uriPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${domain}${uriPath}`;
};

/**
 * 函数：确保内部 useApi 请求成功。
 * @param {unknown} input useApi error。
 * @param {string} message 失败时抛出的业务文案。
 */
const ensureInternalUseApiSucceeded = (input: unknown, message: string): void => {
  if (!input) {
    return;
  }

  throw new Error(message);
};

/**
 * 函数：请求 Tauri 直连 API 并返回 datas。
 * @param {IApiClientRequestInput} input 请求输入。
 * @param {string} message 失败提示。
 * @returns {Promise<unknown>} 响应 datas。
 */
const requestTauriApiDatas = async (input: IApiClientRequestInput, message: string): Promise<unknown> => {
  /**
   * 常量：output。
   */
  const output = await tauriApiClient.request(input);
  /**
   * 常量：response。
   */
  const response = toRecord(output.json);
  /**
   * 常量：status。
   */
  const status = toRecord(response?.status);
  /**
   * 常量：errorMessage。
   */
  const errorMessage = String(status?.message ?? '').trim();

  if (output.http >= 400) {
    throw new Error(errorMessage || message);
  }

  return response?.datas;
};

/**
 * 函数：请求播客生成占用信息。
 * @param {string} errorMessage 失败提示。
 * @returns {Promise<unknown>} 响应 datas。
 */
const requestHotsearchPodcastGenerateOwnerDatas = async (errorMessage: string): Promise<unknown> => {
  if (isTauriRuntime.value) {
    try {
      return await requestTauriApiDatas(
        {
          method: 'GET',
          path: '/desktop/settings/hotsearch/podcast_generate_owner'
        },
        errorMessage
      );
    } catch {
      // fall through to useApi proxy
    }
  }

  await refreshHotsearchPodcastGenerateOwnerGet({ ignoreResponseError: true });
  /**
   * 常量：datas。
   */
  const datas = stateHotsearchPodcastGenerateOwnerRemote.value;

  if (datas) {
    return datas;
  }

  ensureInternalUseApiSucceeded(stateHotsearchPodcastGenerateOwnerGetError.value, errorMessage);
  throw new Error(errorMessage);
};

/**
 * 函数：构建播客生成占用请求体。
 * @param {boolean} enabled 是否启用。
 * @param {string} machineCode 机器码。
 * @param {string} machineName 机器名。
 * @returns {{ enabled: boolean; machineCode: string; machineName: string }} 请求体。
 */
const hotsearchPodcastGenerateOwnerPayloadBuild = (enabled: boolean, machineCode: string, machineName: string): { enabled: boolean; machineCode: string; machineName: string } => {
  return {
    enabled,
    machineCode,
    machineName
  };
};

/**
 * 函数：写入播客生成占用信息。
 * @param {boolean} enabled 是否启用。
 * @param {string} machineCode 机器码。
 * @param {string} machineName 机器名。
 * @param {boolean} ignoreError 是否忽略错误。
 * @returns {Promise<void>} 无返回值。
 */
const requestHotsearchPodcastGenerateOwnerSet = async (enabled: boolean, machineCode: string, machineName: string, ignoreError = false): Promise<void> => {
  /**
   * 常量：errorMessage。
   */
  const errorMessage = t('pages.settings.hotsearch.messages.podcastGenerateErrorTitle');
  /**
   * 常量：payload。
   */
  const payload = hotsearchPodcastGenerateOwnerPayloadBuild(enabled, machineCode, machineName);

  if (isTauriRuntime.value) {
    try {
      await requestTauriApiDatas(
        {
          method: 'PATCH',
          path: '/desktop/settings/hotsearch/podcast_generate_owner',
          datas: payload
        },
        errorMessage
      );

      return;
    } catch {
      // fall through to useApi proxy
    }
  }

  await refreshHotsearchPodcastGenerateOwnerPatch({
    body: {
      datas: payload
    },
    ignoreResponseError: ignoreError
  });

  if (!ignoreError) {
    ensureInternalUseApiSucceeded(stateHotsearchPodcastGenerateOwnerPatchError.value, errorMessage);
  }
};

/**
 * 函数：请求 UpYun 对象访问地址。
 * @param {Record<string, unknown>} query 查询参数。
 * @param {string} errorMessage 失败提示。
 * @returns {Promise<string>} 访问地址。
 */
const requestUpyunObjectUrl = async (query: Record<string, unknown>, errorMessage: string): Promise<string> => {
  if (isTauriRuntime.value) {
    try {
      /**
       * 常量：datas。
       */
      const datas = await requestTauriApiDatas(
        {
          method: 'GET',
          path: `/storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/url`,
          query
        },
        errorMessage
      );

      /**
       * 常量：url。
       */
      const url = String(toRecord(datas)?.url ?? '').trim();

      if (url) {
        return url;
      }
    } catch {
      // fall through to useApi proxy
    }
  }

  await refreshUpyunObjectUrlGet({
    query,
    ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
  });

  ensureInternalUseApiSucceeded(stateUpyunObjectUrlError.value, errorMessage);

  /**
   * 常量：url。
   */
  const url = String(toRecord(stateUpyunObjectUrl.value)?.url ?? '').trim();

  if (url) {
    return url;
  }

  throw new Error(errorMessage);
};

/**
 * 函数：请求 UpYun 对象下载内容。
 * @param {Record<string, unknown>} query 查询参数。
 * @param {string} errorMessage 失败提示。
 * @returns {Promise<string>} Base64 内容。
 */
const requestUpyunObjectDownloadBase64 = async (query: Record<string, unknown>, errorMessage: string): Promise<string> => {
  if (isTauriRuntime.value) {
    try {
      /**
       * 常量：datas。
       */
      const datas = await requestTauriApiDatas(
        {
          method: 'GET',
          path: `/storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/download`,
          query
        },
        errorMessage
      );

      /**
       * 常量：base64。
       */
      const base64 = String(toRecord(datas)?.base64 ?? '').trim();

      if (base64) {
        return base64;
      }
    } catch {
      // fall through to useApi proxy
    }
  }

  stateUpyunObjectDownload.value = undefined;
  await refreshUpyunObjectDownloadGet({
    query,
    ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
  });

  /**
   * 常量：base64。
   */
  const base64 = String(toRecord(stateUpyunObjectDownload.value)?.base64 ?? '').trim();

  if (base64) {
    return base64;
  }

  ensureInternalUseApiSucceeded(stateUpyunObjectDownloadError.value, errorMessage);
  throw new Error(errorMessage);
};

/**
 * 函数：请求 UpYun 直传策略快照。
 * @param {Record<string, unknown>} body 请求体。
 * @param {string} errorMessage 失败提示。
 * @returns {Promise<Record<string, unknown>>} 直传策略快照。
 */
const requestUpyunDirectUploadPolicySnapshot = async (body: Record<string, unknown>, errorMessage: string): Promise<Record<string, unknown>> => {
  await refreshUpyunDirectUploadPolicyPost({
    body,
    ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
  });

  ensureInternalUseApiSucceeded(stateUpyunDirectUploadPolicyError.value, errorMessage);
  return toRecord(stateUpyunDirectUploadPolicy.value) ?? {};
};

/**
 * 函数：确保当前机器信息可用。
 * @returns {Promise<{ machineCode: string; machineName: string }>} 机器信息
 */
const hotsearchMachineEnsure = async (): Promise<{ machineCode: string; machineName: string }> => {
  if (!isTauriRuntime.value) {
    return { machineCode: '', machineName: '' };
  }

  /**
   * 函数：settings。
   */
  const settings = await tauriSettings.get();
  /**
   * 常量：machine。
   */
  const machine = toRecord((settings as Record<string, unknown>).machine) ?? {};
  /**
   * 常量：machineCode。
   */
  const machineCode = String(machine.code ?? '').trim();
  /**
   * 常量：machineName。
   */
  let machineName = String(machine.name ?? '').trim();

  if (!machineName) {
    machineName = String(await tauriSettings.machineHostnameGet()).trim();
  }

  stateHotsearchMachineCode.value = machineCode;
  stateHotsearchMachineName.value = machineName;

  return { machineCode, machineName };
};

/**
 * 函数：确保附件目录已经配置。
 * @returns {Promise<boolean>} 是否已配置
 */
const hotsearchAttachmentsDirEnsure = async (): Promise<boolean> => {
  if (!isTauriRuntime.value) {
    return false;
  }

  try {
    stateHotsearchPodcastHeadMusicPaths.value = await tauriSettings.hotsearchPodcastHeadMusicPathsGet();
    return true;
  } catch {
    stateHotsearchPodcastHeadMusicPaths.value = null;
    stateHotsearchAttachmentsDirDialogOpen.value = true;
    return false;
  }
};

/**
 * 函数：读取指定类型的云端固定开头音乐对象路径。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型。
 * @returns {string} 已持久化的对象路径。
 */
const hotsearchPodcastHeadMusicRemotePathGet = (kind: THotsearchPodcastHeadMusicKind): string => {
  return String(stateHotsearchConfig.value.podcastHeadMusicRemotePaths?.[kind] ?? '').trim();
};

/**
 * 函数：更新指定类型的云端固定开头音乐对象路径。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型。
 * @param {string} path 最新对象路径。
 * @returns {void} 无返回值。
 */
const hotsearchPodcastHeadMusicRemotePathSet = (kind: THotsearchPodcastHeadMusicKind, path: string): void => {
  stateHotsearchConfig.value.podcastHeadMusicRemotePaths = {
    ...stateHotsearchConfig.value.podcastHeadMusicRemotePaths,
    [kind]: String(path).trim()
  };
};

/**
 * 函数：刷新本地固定开头音乐状态。
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastHeadMusicLocalExists = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  try {
    /**
     * 常量：paths。
     */
    const paths = await tauriSettings.hotsearchPodcastHeadMusicPathsGet();
    stateHotsearchPodcastHeadMusicPaths.value = paths;

    /**
     * 常量：existsResult。
     */
    const existsResult = await tauriSettings.pathsExistGet([paths.normalPath, paths.vipPath]);
    /**
     * 常量：existsMap。
     */
    const existsMap = new Map(existsResult.map((item) => [item.path, item.exists]));

    stateHotsearchPodcastHeadMusicLocalExists.value = {
      normal: existsMap.get(paths.normalPath) === true,
      vip: existsMap.get(paths.vipPath) === true
    };
  } catch {
    stateHotsearchPodcastHeadMusicPaths.value = null;
    stateHotsearchPodcastHeadMusicLocalExists.value = { normal: false, vip: false };
  }
};

/**
 * 函数：检查远端固定开头音乐是否存在。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @returns {Promise<boolean>} 是否存在
 */
const hotsearchPodcastHeadMusicRemoteExistsCheck = (kind: THotsearchPodcastHeadMusicKind): boolean => {
  return hotsearchPodcastHeadMusicRemotePathGet(kind) !== '';
};

/**
 * 函数：刷新远端固定开头音乐状态。
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastHeadMusicRemoteExists = async (): Promise<void> => {
  stateHotsearchPodcastHeadMusicRemoteExists.value = {
    normal: hotsearchPodcastHeadMusicRemoteExistsCheck('normal'),
    vip: hotsearchPodcastHeadMusicRemoteExistsCheck('vip')
  };

  for (const kind of HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS) {
    await refreshHotsearchPodcastHeadMusicPreviewUrlQuietly(kind);
  }
};

/**
 * 函数：刷新固定开头音乐预览地址。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastHeadMusicPreviewUrl = async (kind: THotsearchPodcastHeadMusicKind): Promise<{ previewUrl: string; remoteAddress: string }> => {
  /**
   * 常量：remotePath。
   */
  const remotePath = hotsearchPodcastHeadMusicRemotePathGet(kind);

  if (!remotePath) {
    stateHotsearchPodcastHeadMusicRemoteExists.value[kind] = false;
    hotsearchPodcastHeadMusicPreviewUrlSet(kind, '');
    throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing'));
  }

  try {
    stateHotsearchPodcastHeadMusicRemoteExists.value[kind] = true;
    /**
     * 常量：publicUrl。
     */
    const publicUrl = hotsearchPodcastHeadMusicRemoteUrlBuild(remotePath);

    if (publicUrl) {
      hotsearchPodcastHeadMusicPreviewUrlSet(kind, publicUrl);
      return {
        previewUrl: publicUrl,
        remoteAddress: publicUrl
      };
    }

    /**
     * 常量：previewUrl。
     */
    const previewUrl = await requestUpyunObjectUrl(
      {
        path: remotePath,
        ttl_sec: 1800
      },
      t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing')
    );

    hotsearchPodcastHeadMusicPreviewUrlSet(kind, previewUrl);

    return {
      previewUrl,
      remoteAddress: previewUrl
    };
  } catch {
    hotsearchPodcastHeadMusicPreviewUrlSet(kind, '');
    throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing'));
  }
};

/**
 * 函数：静默刷新固定开头音乐预览地址。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型。
 * @returns {Promise<void>} 无返回值。
 */
const refreshHotsearchPodcastHeadMusicPreviewUrlQuietly = async (kind: THotsearchPodcastHeadMusicKind): Promise<void> => {
  try {
    await refreshHotsearchPodcastHeadMusicPreviewUrl(kind);
  } catch {
    // ignore
  }
};

/**
 * 函数：刷新播客生成占用状态。
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastGenerateOwner = async (): Promise<void> => {
  try {
    /**
     * 常量：datas。
     */
    const datas = await requestHotsearchPodcastGenerateOwnerDatas(t('pages.settings.hotsearch.messages.podcastGenerateErrorTitle'));
    stateHotsearchPodcastGenerateOwner.value = hotsearchPodcastGenerateOwnerNormalize(datas);
  } catch {
    stateHotsearchPodcastGenerateOwner.value = null;
  }
};

/**
 * 函数：仅将播客生成开关持久化到本地 settings。
 * @param {boolean} value 最新值
 * @returns {Promise<void>} 无返回值
 */
const persistPodcastGenerateEnabledToLocal = async (value: boolean): Promise<void> => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastGenerateEnabled: value
  });

  stateSaving.value = true;
  try {
    await persistHotsearchSettingsToLocal(stateHotsearchConfig.value);
  } finally {
    stateSaving.value = false;
  }
};

/**
 * 函数：从云端同步固定开头音乐到本地。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @returns {Promise<void>} 无返回值
 */
const syncHotsearchPodcastHeadMusicFromRemote = async (kind: THotsearchPodcastHeadMusicKind): Promise<void> => {
  if (!(await hotsearchAttachmentsDirEnsure())) {
    return;
  }

  /**
   * 常量：remoteMissingMessage。
   */
  const remoteMissingMessage = t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing');
  /**
   * 常量：remotePath。
   */
  const remotePath = hotsearchPodcastHeadMusicRemotePathGet(kind);

  if (!remotePath) {
    throw new Error(remoteMissingMessage);
  }

  try {
    if (isTauriRuntime.value) {
      /**
       * 常量：url。
       */
      const url =
        hotsearchPodcastHeadMusicRemoteUrlBuild(remotePath) ||
        (await requestUpyunObjectUrl(
          {
            path: remotePath,
            ttl_sec: 600
          },
          remoteMissingMessage
        ));

      if (url) {
        try {
          await tauriSettings.hotsearchPodcastHeadMusicDownload(kind, url);
        } catch {
          /**
           * 常量：base64。
           */
          const base64 = await requestUpyunObjectDownloadBase64(
            {
              path: remotePath
            },
            t('pages.settings.hotsearch.messages.podcastHeadMusicDownloadFailed')
          );

          if (!base64) {
            throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicDownloadFailed'));
          }

          /**
           * 常量：binary。
           */
          const binary = atob(base64);
          /**
           * 常量：bytes。
           */
          const bytes = Array.from(binary, (char) => char.charCodeAt(0));
          await tauriSettings.hotsearchPodcastHeadMusicWrite(kind, bytes);
        }

        await refreshHotsearchPodcastHeadMusicLocalExists();
        await refreshHotsearchPodcastHeadMusicPreviewUrlQuietly(kind);
        return;
      }

      /**
       * 常量：base64。
       */
      const base64 = await requestUpyunObjectDownloadBase64(
        {
          path: remotePath
        },
        t('pages.settings.hotsearch.messages.podcastHeadMusicDownloadFailed')
      );

      if (!base64) {
        throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicDownloadFailed'));
      }

      /**
       * 常量：binary。
       */
      const binary = atob(base64);
      /**
       * 常量：bytes。
       */
      const bytes = Array.from(binary, (char) => char.charCodeAt(0));
      await tauriSettings.hotsearchPodcastHeadMusicWrite(kind, bytes);
    } else {
      /**
       * 常量：url。
       */
      const url =
        hotsearchPodcastHeadMusicRemoteUrlBuild(remotePath) ||
        (await requestUpyunObjectUrl(
          {
            path: remotePath,
            ttl_sec: 600
          },
          remoteMissingMessage
        ));

      if (!url) {
        throw new Error(remoteMissingMessage);
      }

      let response: Response;

      try {
        response = await fetch(url);
      } catch {
        throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicDownloadFailed'));
      }

      if (!response.ok) {
        throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicDownloadFailed'));
      }

      /**
       * 常量：bytes。
       */
      const bytes = new Uint8Array(await response.arrayBuffer());
      await tauriSettings.hotsearchPodcastHeadMusicWrite(kind, Array.from(bytes));
    }
  } catch (error) {
    /**
     * 常量：message。
     */
    const message = error instanceof Error ? error.message : String(error ?? '');

    if (message === remoteMissingMessage) {
      hotsearchPodcastHeadMusicRemotePathSet(kind, '');
      requestPersistHotsearchSettings();
      await refreshHotsearchPodcastHeadMusicRemoteExists();
    }

    throw error;
  }

  await refreshHotsearchPodcastHeadMusicLocalExists();
  await refreshHotsearchPodcastHeadMusicPreviewUrlQuietly(kind);
};

/**
 * 函数：上传固定开头音乐到云端并写入本地。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @param {File} file 选择的文件
 * @returns {Promise<void>} 无返回值
 */
const uploadHotsearchPodcastHeadMusic = async (kind: THotsearchPodcastHeadMusicKind, file: File): Promise<void> => {
  if (!(await hotsearchAttachmentsDirEnsure())) {
    return;
  }

  /**
   * 常量：staleRemotePath。
   */
  const staleRemotePath = hotsearchPodcastHeadMusicRemotePathGet(kind);

  if (staleRemotePath) {
    try {
      await refreshUpyunObjectDeletePost({
        body: {
          path: staleRemotePath
        },
        ignoreResponseError: true
      });
    } catch {
      // ignore
    }
  }

  stateHotsearchPodcastHeadMusicUploadProgress.value[kind] = 0;
  /**
   * 常量：policy。
   */
  const policy = await requestUpyunDirectUploadPolicySnapshot(
    {
      save_key: hotsearchPodcastHeadMusicRemotePathCreate(kind),
      expires_in_sec: 1800
    },
    t('pages.settings.hotsearch.messages.podcastHeadMusicUploadFailed')
  );

  /**
   * 常量：uploadUrl。
   */
  const uploadUrl = String(policy?.upload_url ?? '').trim();
  /**
   * 常量：uploadPolicy。
   */
  const uploadPolicy = String(policy?.policy ?? '').trim();
  /**
   * 常量：authorization。
   */
  const authorization = String(policy?.authorization ?? '').trim();
  /**
   * 常量：saveKey。
   */
  const saveKey = String(policy?.save_key ?? '').trim();

  if (!uploadUrl || !uploadPolicy || !authorization) {
    throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicUploadFailed'));
  }

  /**
   * 常量：formData。
   */
  const formData = new FormData();
  formData.set('policy', uploadPolicy);
  formData.set('authorization', authorization);
  if (saveKey) {
    formData.set('save-key', saveKey);
  }
  formData.set('file', file);

  await new Promise<void>((resolve, reject) => {
    /**
     * 常量：xhr。
     */
    const xhr = new XMLHttpRequest();

    xhr.open('POST', uploadUrl, true);
    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) {
        return;
      }

      stateHotsearchPodcastHeadMusicUploadProgress.value[kind] = Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100)));
    });
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        stateHotsearchPodcastHeadMusicUploadProgress.value[kind] = 100;
        resolve();
        return;
      }

      reject(new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicUploadFailed')));
    });
    xhr.addEventListener('error', () => {
      reject(new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicUploadFailed')));
    });
    xhr.addEventListener('abort', () => {
      reject(new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicUploadFailed')));
    });
    xhr.send(formData);
  });

  /**
   * 常量：bytes。
   */
  const bytes = new Uint8Array(await file.arrayBuffer());
  await tauriSettings.hotsearchPodcastHeadMusicWrite(kind, Array.from(bytes));

  await refreshHotsearchPodcastHeadMusicLocalExists();

  if (saveKey) {
    hotsearchPodcastHeadMusicRemotePathSet(kind, saveKey);
    requestPersistHotsearchSettings();
    stateHotsearchPodcastHeadMusicRemoteExists.value[kind] = true;

    try {
      /**
       * 常量：publicUrl。
       */
      const publicUrl = hotsearchPodcastHeadMusicRemoteUrlBuild(saveKey);

      if (publicUrl) {
        hotsearchPodcastHeadMusicPreviewUrlSet(kind, publicUrl);
        return;
      }

      hotsearchPodcastHeadMusicPreviewUrlSet(
        kind,
        await requestUpyunObjectUrl(
          {
            path: saveKey,
            ttl_sec: 1800
          },
          t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing')
        )
      );
    } catch {
      hotsearchPodcastHeadMusicPreviewUrlSet(kind, '');
    }

    return;
  }

  await refreshHotsearchPodcastHeadMusicRemoteExists();
  await refreshHotsearchPodcastHeadMusicPreviewUrlQuietly(kind);
};

/**
 * 函数：将壳侧计划标记为待刷新
 */
const markRuntimeScheduleDirty = (): void => {
  stateRuntimeSchedule.value = null;
};

/**
 * 函数：读取壳侧热搜计划快照
 * @returns {Promise<void>} 无返回值
 */
const loadRuntimeSchedule = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    stateRuntimeSchedule.value = null;
    return;
  }

  stateRuntimeSchedule.value = await tauriTasks.hotsearchScheduleGet();
};

/**
 * 函数：将热搜设置回写到本地 Tauri settings 镜像
 * @param {ISettingsHotsearchLocal} config 热搜设置
 * @returns {Promise<void>} 无返回值
 */
const persistHotsearchSettingsToLocal = async (config: ISettingsHotsearchLocal): Promise<void> => {
  /**
   * 函数：normalized。
   */
  const normalized = hotsearchLocalSettingsNormalize(config);

  if (!isTauriRuntime.value) {
    stateHotsearchConfig.value = normalized;
    stateRuntimeSchedule.value = null;
    return;
  }

  /**
   * 常量：result。
   */
  const result = await tauriSettings.update({
    hotsearch: normalized
  });
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize((result as Record<string, unknown>).hotsearch);
  await loadRuntimeSchedule();
};

/**
 * 函数：防抖写回热搜设置到本地镜像。
 */
const persistHotsearchSettingsLocalDebounced = useDebounceFn(async () => {
  stateSaving.value = true;
  try {
    await persistHotsearchSettingsToLocal(hotsearchLocalSettingsNormalize(stateHotsearchConfig.value));
  } finally {
    stateSaving.value = false;
  }
}, 300);

/**
 * 函数：防抖写回热搜设置到 Redis。
 */
const persistHotsearchSettingsRemoteDebounced = (): void => {
  refreshHotsearchRemotePatchDebounced({
    body: {
      datas: hotsearchSharedSettingsExtract(stateHotsearchConfig.value)
    }
  });
};

/**
 * 函数：请求写回热搜设置
 */
const requestPersistHotsearchSettings = (): void => {
  markRuntimeScheduleDirty();
  if (!stateHydrated.value) {
    return;
  }
  persistHotsearchSettingsLocalDebounced();
  persistHotsearchSettingsRemoteDebounced();
};

/**
 * 函数：提交播客 AI 规则到热搜设置。
 * @returns {void} 无返回值。
 */
const commitPodcastAiRulesMarkdown = (): void => {
  /**
   * 常量：nextMarkdown。
   */
  const nextMarkdown = hotsearchPodcastAiRulesMarkdownCompose(statePodcastAiRulesMarkdownDraft.value, stateHotsearchConfig.value.podcastMaleSpeakerName, stateHotsearchConfig.value.podcastFemaleSpeakerName);

  if (stateHotsearchConfig.value.podcastAiRulesMarkdown === nextMarkdown) {
    return;
  }

  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastAiRulesMarkdown: nextMarkdown
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：防抖提交播客 AI 规则。
 */
const commitPodcastAiRulesMarkdownDebounced = useDebounceFn(() => {
  commitPodcastAiRulesMarkdown();
}, 400);

/**
 * 函数：从 Tauri 设置读取热搜配置
 * @returns {Promise<void>} 无返回值
 */
const loadHotsearchSettings = async (): Promise<void> => {
  /**
   * 常量：nextConfig。
   */
  let nextConfig = hotsearchLocalSettingsDefaultCreate();

  if (isTauriRuntime.value) {
    /**
     * 函数：settings。
     */
    const settings = await tauriSettings.get();
    nextConfig = hotsearchLocalSettingsNormalize((settings as Record<string, unknown>).hotsearch);
  }

  stateHotsearchConfig.value = nextConfig;

  try {
    await refreshHotsearchRemoteGet();
    if (stateHotsearchRemoteConfig.value) {
      /**
       * 常量：remoteConfig。
       */
      const remoteConfig = hotsearchSettingsNormalize(stateHotsearchRemoteConfig.value);
      /**
       * 函数：mergedLocalConfig。
       */
      const mergedLocalConfig = hotsearchLocalSettingsNormalize({
        ...stateHotsearchConfig.value,
        ...remoteConfig
      });

      stateHotsearchConfig.value = mergedLocalConfig;
      await persistHotsearchSettingsToLocal(mergedLocalConfig);
    } else {
      await loadRuntimeSchedule();
    }
  } catch {
    await loadRuntimeSchedule();
  }

  await hotsearchMachineEnsure();
  await refreshHotsearchPodcastGenerateOwner();
  await refreshHotsearchPodcastHeadMusicLocalExists();
  await refreshHotsearchPodcastHeadMusicRemoteExists();

  stateHydrated.value = true;
};

/**
 * 函数：切换热搜自动抓取开关
 * @param {boolean} value 最新值
 */
const handleEnabledUpdate = (value: boolean): void => {
  stateHotsearchConfig.value.enabled = value;
  requestPersistHotsearchSettings();
};

/**
 * 函数：切换播客自动生成开关
 * @param {boolean} value 最新值
 */
const handlePodcastEnabledUpdate = (value: boolean): void => {
  stateHotsearchConfig.value.podcastEnabled = value;
  requestPersistHotsearchSettings();
};

/**
 * 函数：选择附件目录。
 * @param {string} _picked 已保存目录
 * @returns {Promise<void>} 无返回值
 */
const handleHotsearchAttachmentsDirPick = async (_picked: string): Promise<void> => {
  await refreshHotsearchPodcastHeadMusicLocalExists();
  for (const kind of HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS) {
    await refreshHotsearchPodcastHeadMusicPreviewUrlQuietly(kind);
  }
};

/**
 * 函数：提交固定开头音乐上传。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @param {File} file 上传文件
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastHeadMusicUploadSubmit = async (kind: THotsearchPodcastHeadMusicKind, file: File): Promise<void> => {
  stateHotsearchPodcastHeadMusicUploadingKind.value = kind;
  stateHotsearchPodcastHeadMusicError.value = '';

  try {
    await uploadHotsearchPodcastHeadMusic(kind, file);
  } catch (error) {
    stateHotsearchPodcastHeadMusicError.value = error instanceof Error ? error.message : String(error ?? '');
    toast.add({
      title: t('pages.settings.hotsearch.messages.podcastHeadMusicErrorTitle'),
      description: stateHotsearchPodcastHeadMusicError.value,
      color: 'warning'
    });
    throw error;
  } finally {
    stateHotsearchPodcastHeadMusicUploadingKind.value = null;
    stateHotsearchPodcastHeadMusicUploadProgress.value[kind] = 0;
  }
};

/**
 * 函数：切换本机播客生成开关。
 * @param {boolean} value 最新值
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastGenerateEnabledUpdate = async (value: boolean): Promise<void> => {
  stateHotsearchPodcastGenerateLoading.value = true;
  stateHotsearchPodcastGenerateError.value = '';

  try {
    const { machineCode, machineName } = await hotsearchMachineEnsure();

    if (!machineCode) {
      throw new Error(t('pages.settings.hotsearch.messages.machineCodeMissing'));
    }

    if (value) {
      if (!(await hotsearchAttachmentsDirEnsure())) {
        return;
      }

      await refreshHotsearchPodcastHeadMusicLocalExists();
      await refreshHotsearchPodcastGenerateOwner();

      if (stateHotsearchPodcastGenerateOwner.value && stateHotsearchPodcastGenerateOwner.value.machineCode !== machineCode) {
        stateHotsearchPodcastGenerateError.value = t('pages.settings.hotsearch.messages.podcastGenerateOwnerConflict', {
          machineName: stateHotsearchPodcastGenerateOwner.value.machineName,
          machineCode: stateHotsearchPodcastGenerateOwner.value.machineCode
        });
        toast.add({
          title: t('pages.settings.hotsearch.messages.podcastGenerateErrorTitle'),
          description: stateHotsearchPodcastGenerateError.value,
          color: 'warning'
        });
        return;
      }

      /**
       * 常量：missingLocalKinds。
       */
      const missingLocalKinds = HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS.filter((kind) => !stateHotsearchPodcastHeadMusicLocalExists.value[kind]);

      if (missingLocalKinds.length > 0) {
        const missingRemoteKinds: THotsearchPodcastHeadMusicKind[] = [];
        /**
         * 常量：remoteMissingMessage。
         */
        const remoteMissingMessage = t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing');

        for (const kind of missingLocalKinds) {
          try {
            await syncHotsearchPodcastHeadMusicFromRemote(kind);
          } catch (error) {
            /**
             * 常量：message。
             */
            const message = error instanceof Error ? error.message : String(error ?? '');

            if (message === remoteMissingMessage) {
              missingRemoteKinds.push(kind);
              continue;
            }

            throw error;
          }
        }

        if (missingRemoteKinds.length > 0) {
          await refreshHotsearchPodcastHeadMusicRemoteExists();

          /**
           * 常量：missingTitles。
           */
          const missingTitles = missingRemoteKinds.map((kind) => computedHotsearchPodcastHeadMusicItems.value.find((item) => item.kind === kind)?.title || kind).join('、');

          stateHotsearchPodcastGenerateError.value = t('pages.settings.hotsearch.messages.podcastGenerateHeadMusicMissing');
          toast.add({
            title: t('pages.settings.hotsearch.messages.podcastGenerateErrorTitle'),
            description: t('pages.settings.hotsearch.messages.podcastGenerateHeadMusicMissingToast', { titles: missingTitles }),
            color: 'warning'
          });
          return;
        }
      }

      await requestHotsearchPodcastGenerateOwnerSet(true, machineCode, machineName);

      await refreshHotsearchPodcastGenerateOwner();
      await persistPodcastGenerateEnabledToLocal(true);
      return;
    }

    try {
      await requestHotsearchPodcastGenerateOwnerSet(false, machineCode, machineName, true);
    } catch {
      // ignore
    }

    await refreshHotsearchPodcastGenerateOwner();
    await persistPodcastGenerateEnabledToLocal(false);
  } catch (error) {
    stateHotsearchPodcastGenerateError.value = error instanceof Error ? error.message : String(error ?? '');
    toast.add({
      title: t('pages.settings.hotsearch.messages.podcastGenerateErrorTitle'),
      description: stateHotsearchPodcastGenerateError.value,
      color: 'warning'
    });
  } finally {
    stateHotsearchPodcastGenerateLoading.value = false;
  }
};

/**
 * 函数：更新男生播报者名称
 * @param {string} value 最新值
 */
const handlePodcastMaleSpeakerNameUpdate = (value: string): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastMaleSpeakerName: value,
    podcastAiRulesMarkdown: hotsearchPodcastAiRulesMarkdownCompose(stateHotsearchConfig.value.podcastAiRulesMarkdown, value, stateHotsearchConfig.value.podcastFemaleSpeakerName)
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新女生播报者名称
 * @param {string} value 最新值
 */
const handlePodcastFemaleSpeakerNameUpdate = (value: string): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastFemaleSpeakerName: value,
    podcastAiRulesMarkdown: hotsearchPodcastAiRulesMarkdownCompose(stateHotsearchConfig.value.podcastAiRulesMarkdown, stateHotsearchConfig.value.podcastMaleSpeakerName, value)
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新早间节目名称
 * @param {string} value 最新值
 */
const handlePodcastMorningProgramNameUpdate = (value: string): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastMorningProgramName: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新晚间节目名称
 * @param {string} value 最新值
 */
const handlePodcastEveningProgramNameUpdate = (value: string): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastEveningProgramName: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新 VIP 专项版早间节目名称
 * @param {string} value 最新值
 */
const handlePodcastVipMorningProgramNameUpdate = (value: string): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastVipMorningProgramName: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新 VIP 专项版晚间节目名称
 * @param {string} value 最新值
 */
const handlePodcastVipEveningProgramNameUpdate = (value: string): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastVipEveningProgramName: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新播客模板片段
 * @param {ISettingsHotsearchPodcastTemplateItem[]} value 最新值
 */
const handlePodcastTemplateItemsUpdate = (value: ISettingsHotsearchPodcastTemplateItem[]): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastTemplateItems: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新月度预算
 * @param {number | undefined} value 最新值
 */
const handleMonthlyBudgetUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    monthlyBudget: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新早间时间
 * @param {string} value 最新值
 */
const handleMorningStartAtUpdate = (value: InputTimeProps['modelValue']): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    morningStartAt: hotsearchTextFromTimeValue(value, '06:00')
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新晚间时间
 * @param {string} value 最新值
 */
const handleEveningStartAtUpdate = (value: InputTimeProps['modelValue']): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    eveningStartAt: hotsearchTextFromTimeValue(value, '18:00')
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新平台抓取间隔
 * @param {number | undefined} value 最新值
 */
const handlePlatformIntervalSecondsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIntervalSeconds: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新计划随机偏移
 * @param {number | undefined} value 最新值
 */
const handleScheduleJitterSecondsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    scheduleJitterSeconds: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新播客缓冲时间
 * @param {number | undefined} value 最新值
 */
const handlePodcastBufferSecondsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    podcastBufferSeconds: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新最大重试次数
 * @param {number | undefined} value 最新值
 */
const handleRetryMaxAttemptsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    retryMaxAttempts: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：更新重试间隔
 * @param {number | undefined} value 最新值
 */
const handleRetryDelaySecondsUpdate = (value: number | undefined): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    retryDelaySeconds: value
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：切换单个平台开关
 * @param {number} platformId 平台 ID
 * @param {boolean} enabled 是否启用
 */
const handlePlatformEnabledUpdate = (platformId: number, enabled: boolean): void => {
  /**
   * 常量：nextIds。
   */
  const nextIds = enabled ? [...new Set([...stateHotsearchConfig.value.platformIds, platformId])] : stateHotsearchConfig.value.platformIds.filter((id) => id !== platformId);

  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIds: nextIds
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：切换全部平台开关
 * @param {boolean} enabled 是否全部启用
 */
const handlePlatformsToggleAll = (enabled: boolean): void => {
  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    platformIds: enabled ? computedPlatforms.value.map((platform) => platform.id) : []
  });
  requestPersistHotsearchSettings();
};

/**
 * 函数：恢复抓取计划默认设置
 */
const handleResetScheduleDefaults = (): void => {
  /**
   * 常量：defaults。
   */
  const defaults = hotsearchLocalSettingsDefaultCreate();

  stateHotsearchConfig.value = hotsearchLocalSettingsNormalize({
    ...stateHotsearchConfig.value,
    morningStartAt: defaults.morningStartAt,
    eveningStartAt: defaults.eveningStartAt,
    platformIntervalSeconds: defaults.platformIntervalSeconds,
    scheduleJitterSeconds: defaults.scheduleJitterSeconds,
    podcastBufferSeconds: defaults.podcastBufferSeconds,
    retryMaxAttempts: defaults.retryMaxAttempts,
    retryDelaySeconds: defaults.retryDelaySeconds
  });
  requestPersistHotsearchSettings();
};

/**
 * 生命周期：页面挂载后读取配置
 */
onMounted(async () => {
  await loadHotsearchSettings();
});

watch(
  () => stateHotsearchConfig.value.podcastAiRulesMarkdown,
  (value) => {
    /**
     * 常量：editableValue。
     */
    const editableValue = hotsearchPodcastAiRulesMarkdownEditableExtract(value);

    if (editableValue === statePodcastAiRulesMarkdownDraft.value) {
      return;
    }

    statePodcastAiRulesMarkdownDraft.value = editableValue;
  },
  {
    immediate: true
  }
);

watch(statePodcastAiRulesMarkdownDraft, () => {
  commitPodcastAiRulesMarkdownDebounced();
});
</script>
