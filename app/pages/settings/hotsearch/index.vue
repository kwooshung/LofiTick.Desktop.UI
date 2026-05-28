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
          <UInputNumber
            :model-value="stateHotsearchConfig.monthlyBudget"
            orientation="vertical"
            :min="1"
            :step="1"
            color="primary"
            variant="outline"
            class="w-36"
            :increment="{ color: 'neutral', variant: 'ghost' }"
            :decrement="{ color: 'neutral', variant: 'ghost' }"
            @update:model-value="handleMonthlyBudgetUpdate"
          />
          <ULink raw :href="HOTSEARCH_USAGE_URL" class="border-primary text-primary hover:bg-primary/8 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors" @click.prevent="handleUsageOpen">
            <UIcon name="i-lucide:external-link" class="size-4 shrink-0" />
            {{ t('pages.settings.hotsearch.actions.usage') }}
          </ULink>
        </div>
      </UFormField>
    </UPageCard>

    <SettingsHotsearchHeadMusic
      :attachments-dir-configured="Boolean(stateHotsearchPodcastHeadMusicPaths)"
      :generate-enabled="stateHotsearchConfig.podcastGenerateEnabled"
      :generate-loading="stateHotsearchPodcastGenerateLoading"
      :generate-disabled="computedHotsearchPodcastGenerateDisabled"
      :generate-owner-exists="Boolean(stateHotsearchPodcastGenerateOwner)"
      :generate-owned-by-current-machine="computedHotsearchPodcastGenerateOwnerIsCurrentMachine"
      :generate-owner-description="computedHotsearchPodcastGenerateOwnerDescription"
      :items="computedHotsearchPodcastHeadMusicItems"
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
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.hotsearch.sections.schedule.title') }}</h3>
          <p class="text-muted mt-1 text-sm">{{ t('pages.settings.hotsearch.sections.schedule.description') }}</p>
        </div>

        <UButton color="primary" variant="soft" size="sm" icon="i-lucide:rotate-ccw" :loading="stateSaving" class="shrink-0" @click="handleResetScheduleDefaults">
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
      <UPageCard icon="i-mdi:lightning-bolt-outline" :title="t('pages.settings.hotsearch.summary.perWindowCost')" :description="String(computedPerWindowCost)" />
      <UPageCard icon="i-mdi:calendar-today-outline" :title="t('pages.settings.hotsearch.summary.dailyCost')" :description="String(computedDailyCost)" />
      <UPageCard icon="i-mdi:calendar-month-outline" :title="t('pages.settings.hotsearch.summary.monthlyEstimate')" :description="String(computedMonthlyEstimate)" />
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
import type { InputTimeProps } from '@nuxt/ui/runtime/components/InputTime.vue';

import type { ISettingsHotsearchLocal, ISettingsHotsearchPodcastGenerateOwner, ISettingsHotsearchPodcastTemplateItem, THotsearchPodcastHeadMusicKind } from '@@/shared/types/index.types';
import { HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET, hotsearchPodcastHeadMusicRemoteDirectoryGet, hotsearchPodcastHeadMusicRemoteLatestPathGet, hotsearchPodcastHeadMusicRemotePathCreate, hotsearchPodcastHeadMusicRemotePathsGet } from '@@/shared/utils';

type THotsearchInputTimeValue = InputTimeProps['modelValue'];

/**
 * Hook：i18n
 */
const { t } = useI18n();

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
 * Hook：Tauri 任务
 */
const tauriTasks = useTauriTasks();

/**
 * Hook：Tauri 窗口
 */
const tauriWindow = useTauriWindow();

/**
 * API：热搜配置（GET / PATCH）
 * 描述：用于与服务端 Redis 同步热搜设置。
 */
const { datas: stateHotsearchRemoteConfig, refresh: refreshHotsearchRemoteGet } = await useApi<ISettingsHotsearch>('desktop/settings/hotsearch', { immediate: false });
const { refreshDebounced: refreshHotsearchRemotePatchDebounced } = await useApi<ISettingsHotsearch>('desktop/settings/hotsearch', {
  method: 'PATCH',
  immediate: false,
  rateLimit: {
    debounce: {
      wait: 300,
      leading: false,
      trailing: true
    }
  }
});
const { datas: stateHotsearchPodcastGenerateOwnerRemote, refresh: refreshHotsearchPodcastGenerateOwnerGet } = await useApi<ISettingsHotsearchPodcastGenerateOwner>('desktop/settings/hotsearch/podcast_generate_owner', { immediate: false });
const { refresh: refreshHotsearchPodcastGenerateOwnerPatch } = await useApi<ISettingsHotsearchPodcastGenerateOwner>('desktop/settings/hotsearch/podcast_generate_owner', {
  method: 'PATCH',
  immediate: false
});
const { datas: stateUpyunObjectList, refresh: refreshUpyunObjectListGet } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/list`, { immediate: false });
const { datas: stateUpyunObjectUrl, refresh: refreshUpyunObjectUrlGet } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/url`, { immediate: false });
const { refresh: refreshUpyunObjectDeletePost } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/delete`, {
  method: 'POST',
  immediate: false
});
const { datas: stateUpyunDirectUploadPolicy, refresh: refreshUpyunDirectUploadPolicyPost } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/direct-upload/policy`, {
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
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-proicons:settings',
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
  return HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS.map((kind) => ({
    kind,
    title: kind === 'normal' ? t('pages.settings.hotsearch.fields.podcastHeadMusicNormal.label') : t('pages.settings.hotsearch.fields.podcastHeadMusicVip.label'),
    description: kind === 'normal' ? t('pages.settings.hotsearch.fields.podcastHeadMusicNormal.description') : t('pages.settings.hotsearch.fields.podcastHeadMusicVip.description'),
    path: kind === 'normal' ? stateHotsearchPodcastHeadMusicPaths.value?.normalPath || '' : stateHotsearchPodcastHeadMusicPaths.value?.vipPath || '',
    localExists: stateHotsearchPodcastHeadMusicLocalExists.value[kind],
    remoteExists: stateHotsearchPodcastHeadMusicRemoteExists.value[kind],
    previewUrl: stateHotsearchPodcastHeadMusicPreviewUrls.value[kind],
    uploadLoading: stateHotsearchPodcastHeadMusicUploadingKind.value === kind,
    uploadProgress: stateHotsearchPodcastHeadMusicUploadProgress.value[kind]
  }));
});

/**
 * 计算属性：本地热搜计划窗口
 */
const computedLocalScheduleWindows = computed(() => {
  const platformCount = computedSelectedPlatformCount.value;
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
  const normalized = typeof value === 'string' && /^\d{2}:\d{2}$/.test(value.trim()) ? value.trim() : fallback;
  const [hourText, minuteText] = normalized.split(':');
  const baseSeconds = Number(hourText) * 3600 + Number(minuteText) * 60;
  const nextSeconds = (((baseSeconds + Math.trunc(deltaSeconds)) % 86400) + 86400) % 86400;
  const nextHour = Math.floor(nextSeconds / 3600);
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
  const jitterSeconds = stateHotsearchConfig.value.scheduleJitterSeconds;
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
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
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
  const baseTime = computedLocalScheduleWindows.value.find((window) => window.key === 'morning')?.suggestedPodcastAt ?? stateHotsearchConfig.value.morningStartAt;
  return hotsearchTimeRangeText(baseTime, stateHotsearchConfig.value.morningStartAt);
});

/**
 * 计算属性：建议晚间播客时间
 */
const computedSuggestedEveningPodcastTime = computed(() => {
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
 * @returns {THotsearchInputTimeValue} 时间值
 */
const hotsearchTimeValueFromText = (value: string, fallback: string): THotsearchInputTimeValue => {
  const normalized = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  try {
    return parseTime(normalized) as unknown as THotsearchInputTimeValue;
  } catch {
    return parseTime(fallback) as unknown as THotsearchInputTimeValue;
  }
};

/**
 * 函数：将 UInputTime 值格式化为 HH:mm
 * @param {THotsearchInputTimeValue} value 时间值
 * @param {string} fallback 回退时间
 * @returns {string} 时间文本
 */
const hotsearchTextFromTimeValue = (value: THotsearchInputTimeValue, fallback: string): string => {
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
 * 函数：提取 UpYun list 的原始结果。
 * @param {unknown} input API datas。
 * @returns {Record<string, unknown> | null} UpYun 原始结果。
 */
const upyunObjectListPayloadGet = (input: unknown): Record<string, unknown> | null => {
  return toRecord(toRecord(input)?.upyun);
};

/**
 * 函数：提取 UpYun list 游标。
 * @param {unknown} input API datas。
 * @returns {string} 游标。
 */
const upyunObjectListIterGet = (input: unknown): string => {
  return String(upyunObjectListPayloadGet(input)?.iter ?? '').trim();
};

/**
 * 常量：开头音乐内部 UpYun 请求统一静默错误。
 */
const HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS = {
  ignoreResponseError: true
} as const;

/**
 * 函数：列出某类开头音乐的远端对象路径。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型。
 * @returns {Promise<string[]>} 路径列表。
 */
const hotsearchPodcastHeadMusicRemotePathsFetch = async (kind: THotsearchPodcastHeadMusicKind): Promise<string[]> => {
  const remotePaths: string[] = [];
  let iter = '';

  do {
    stateUpyunObjectList.value = undefined;
    await refreshUpyunObjectListGet({
      query: {
        path: hotsearchPodcastHeadMusicRemoteDirectoryGet(kind),
        limit: 100,
        order: 'desc',
        ...(iter ? { iter } : {})
      },
      ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
    });

    remotePaths.push(...hotsearchPodcastHeadMusicRemotePathsGet(kind, upyunObjectListPayloadGet(stateUpyunObjectList.value)));
    iter = upyunObjectListIterGet(stateUpyunObjectList.value);
  } while (iter);

  return [...new Set(remotePaths)].sort((left, right) => right.localeCompare(left));
};

/**
 * 函数：获取某类开头音乐当前最新的远端对象路径。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型。
 * @returns {Promise<string>} 最新对象路径。
 */
const hotsearchPodcastHeadMusicRemoteLatestPathFetch = async (kind: THotsearchPodcastHeadMusicKind): Promise<string> => {
  stateUpyunObjectList.value = undefined;
  await refreshUpyunObjectListGet({
    query: {
      path: hotsearchPodcastHeadMusicRemoteDirectoryGet(kind),
      limit: 1,
      order: 'desc'
    },
    ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
  });

  return hotsearchPodcastHeadMusicRemoteLatestPathGet(kind, upyunObjectListPayloadGet(stateUpyunObjectList.value));
};

/**
 * 函数：确保当前机器信息可用。
 * @returns {Promise<{ machineCode: string; machineName: string }>} 机器信息
 */
const hotsearchMachineEnsure = async (): Promise<{ machineCode: string; machineName: string }> => {
  if (!isTauriRuntime.value) {
    return { machineCode: '', machineName: '' };
  }

  const settings = await tauriSettings.get();
  const machine = toRecord((settings as Record<string, unknown>).machine) ?? {};
  const machineCode = String(machine.code ?? '').trim();
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
 * 函数：刷新本地固定开头音乐状态。
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastHeadMusicLocalExists = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  try {
    const paths = await tauriSettings.hotsearchPodcastHeadMusicPathsGet();
    stateHotsearchPodcastHeadMusicPaths.value = paths;

    const existsResult = await tauriSettings.pathsExistGet([paths.normalPath, paths.vipPath]);
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
const hotsearchPodcastHeadMusicRemoteExistsCheck = async (kind: THotsearchPodcastHeadMusicKind): Promise<boolean> => {
  try {
    return Boolean(await hotsearchPodcastHeadMusicRemoteLatestPathFetch(kind));
  } catch {
    return false;
  }
};

/**
 * 函数：刷新远端固定开头音乐状态。
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastHeadMusicRemoteExists = async (): Promise<void> => {
  stateHotsearchPodcastHeadMusicRemoteExists.value = {
    normal: await hotsearchPodcastHeadMusicRemoteExistsCheck('normal'),
    vip: await hotsearchPodcastHeadMusicRemoteExistsCheck('vip')
  };

  await Promise.all(HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS.map((kind) => refreshHotsearchPodcastHeadMusicPreviewUrl(kind)));
};

/**
 * 函数：刷新固定开头音乐预览地址。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastHeadMusicPreviewUrl = async (kind: THotsearchPodcastHeadMusicKind): Promise<void> => {
  const remotePath = await hotsearchPodcastHeadMusicRemoteLatestPathFetch(kind);

  if (!remotePath) {
    stateHotsearchPodcastHeadMusicRemoteExists.value[kind] = false;
    stateHotsearchPodcastHeadMusicPreviewUrls.value[kind] = '';
    return;
  }

  try {
    stateHotsearchPodcastHeadMusicRemoteExists.value[kind] = true;
    stateUpyunObjectUrl.value = undefined;
    await refreshUpyunObjectUrlGet({
      query: {
        path: remotePath,
        ttlSec: 1800
      },
      ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
    });

    stateHotsearchPodcastHeadMusicPreviewUrls.value[kind] = String(toRecord(stateUpyunObjectUrl.value)?.url ?? '').trim();
  } catch {
    stateHotsearchPodcastHeadMusicPreviewUrls.value[kind] = '';
  }
};

/**
 * 函数：刷新播客生成占用状态。
 * @returns {Promise<void>} 无返回值
 */
const refreshHotsearchPodcastGenerateOwner = async (): Promise<void> => {
  try {
    await refreshHotsearchPodcastGenerateOwnerGet({ ignoreResponseError: true });
    stateHotsearchPodcastGenerateOwner.value = hotsearchPodcastGenerateOwnerNormalize(stateHotsearchPodcastGenerateOwnerRemote.value);
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

  const remotePath = await hotsearchPodcastHeadMusicRemoteLatestPathFetch(kind);
  if (!remotePath) {
    throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing'));
  }

  stateUpyunObjectUrl.value = undefined;
  await refreshUpyunObjectUrlGet({
    query: {
      path: remotePath,
      ttlSec: 600
    },
    ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
  });

  const url = String(toRecord(stateUpyunObjectUrl.value)?.url ?? '').trim();
  if (!url) {
    throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicRemoteMissing'));
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicDownloadFailed'));
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  await tauriSettings.hotsearchPodcastHeadMusicWrite(kind, Array.from(bytes));
  await refreshHotsearchPodcastHeadMusicLocalExists();
  await refreshHotsearchPodcastHeadMusicPreviewUrl(kind);
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

  const staleRemotePaths = await hotsearchPodcastHeadMusicRemotePathsFetch(kind);
  for (const stalePath of staleRemotePaths) {
    await refreshUpyunObjectDeletePost({
      body: {
        path: stalePath
      },
      ignoreResponseError: true
    });
  }

  stateHotsearchPodcastHeadMusicUploadProgress.value[kind] = 0;
  stateUpyunDirectUploadPolicy.value = undefined;
  await refreshUpyunDirectUploadPolicyPost({
    body: {
      save_key: hotsearchPodcastHeadMusicRemotePathCreate(kind),
      expires_in_sec: 1800
    },
    ...HOTSEARCH_HEAD_MUSIC_UPYUN_SILENT_OPTIONS
  });

  const policy = toRecord(stateUpyunDirectUploadPolicy.value);
  const uploadUrl = String(policy?.upload_url ?? '').trim();
  const uploadPolicy = String(policy?.policy ?? '').trim();
  const authorization = String(policy?.authorization ?? '').trim();
  const saveKey = String(policy?.save_key ?? '').trim();

  if (!uploadUrl || !uploadPolicy || !authorization) {
    throw new Error(t('pages.settings.hotsearch.messages.podcastHeadMusicUploadFailed'));
  }

  const formData = new FormData();
  formData.set('policy', uploadPolicy);
  formData.set('authorization', authorization);
  if (saveKey) {
    formData.set('save-key', saveKey);
  }
  formData.set('file', file);

  await new Promise<void>((resolve, reject) => {
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

  const bytes = new Uint8Array(await file.arrayBuffer());
  await tauriSettings.hotsearchPodcastHeadMusicWrite(kind, Array.from(bytes));
  await refreshHotsearchPodcastHeadMusicLocalExists();
  await refreshHotsearchPodcastHeadMusicRemoteExists();
  await refreshHotsearchPodcastHeadMusicPreviewUrl(kind);
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
  const normalized = hotsearchLocalSettingsNormalize(config);

  if (!isTauriRuntime.value) {
    stateHotsearchConfig.value = normalized;
    stateRuntimeSchedule.value = null;
    return;
  }

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
 * 函数：从 Tauri 设置读取热搜配置
 * @returns {Promise<void>} 无返回值
 */
const loadHotsearchSettings = async (): Promise<void> => {
  let nextConfig = hotsearchLocalSettingsDefaultCreate();

  if (isTauriRuntime.value) {
    const settings = await tauriSettings.get();
    nextConfig = hotsearchLocalSettingsNormalize((settings as Record<string, unknown>).hotsearch);
  }

  stateHotsearchConfig.value = nextConfig;

  try {
    await refreshHotsearchRemoteGet();
    if (stateHotsearchRemoteConfig.value) {
      const remoteConfig = hotsearchSettingsNormalize(stateHotsearchRemoteConfig.value);
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
 * 函数：打开官网用量页面
 */
const handleUsageOpen = (): void => {
  if (isTauriRuntime.value) {
    void tauriWindow.openExternalUrl(HOTSEARCH_USAGE_URL);
    return;
  }

  window.open(HOTSEARCH_USAGE_URL, '_blank', 'noopener,noreferrer');
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
  await Promise.all(HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS.map((kind) => refreshHotsearchPodcastHeadMusicPreviewUrl(kind)));
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

      const missingLocalKinds = HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS.filter((kind) => !stateHotsearchPodcastHeadMusicLocalExists.value[kind]);

      if (missingLocalKinds.length > 0) {
        await refreshHotsearchPodcastHeadMusicRemoteExists();

        const missingRemoteKinds = missingLocalKinds.filter((kind) => !stateHotsearchPodcastHeadMusicRemoteExists.value[kind]);
        if (missingRemoteKinds.length > 0) {
          const missingTitles = missingRemoteKinds.map((kind) => computedHotsearchPodcastHeadMusicItems.value.find((item) => item.kind === kind)?.title || kind).join('、');

          stateHotsearchPodcastGenerateError.value = t('pages.settings.hotsearch.messages.podcastGenerateHeadMusicMissing');
          toast.add({
            title: t('pages.settings.hotsearch.messages.podcastGenerateErrorTitle'),
            description: t('pages.settings.hotsearch.messages.podcastGenerateHeadMusicMissingToast', { titles: missingTitles }),
            color: 'warning'
          });
          return;
        }

        for (const kind of missingLocalKinds) {
          await syncHotsearchPodcastHeadMusicFromRemote(kind);
        }
      }

      await refreshHotsearchPodcastGenerateOwnerPatch({
        body: {
          datas: {
            enabled: true,
            machineCode,
            machineName
          }
        }
      });

      await refreshHotsearchPodcastGenerateOwner();
      await persistPodcastGenerateEnabledToLocal(true);
      return;
    }

    try {
      await refreshHotsearchPodcastGenerateOwnerPatch({
        body: {
          datas: {
            enabled: false,
            machineCode,
            machineName
          }
        },
        ignoreResponseError: true
      });
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
    podcastMaleSpeakerName: value
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
    podcastFemaleSpeakerName: value
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
const handleMorningStartAtUpdate = (value: THotsearchInputTimeValue): void => {
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
const handleEveningStartAtUpdate = (value: THotsearchInputTimeValue): void => {
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
</script>
