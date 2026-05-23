<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.playback.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.playback.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.playback.fade.label')" :description="t('pages.settings.playback.fade.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <div class="flex gap-3">
          <div class="inline-flex">
            <label for="fadeInDuration" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('pages.settings.playback.fade.labels.in') }}</label>
            <div class="border-accented focus-within:border-primary relative mt-0 w-30 border transition-colors duration-300">
              <UInputNumber id="fadeInDuration" v-model="storePlayback.states.fade.start" orientation="vertical" :min="0" :max="10000" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
            </div>
            <label for="fadeInDuration" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('pages.settings.playback.fade.unit.ms') }}</label>
          </div>
          <div class="inline-flex">
            <label for="fadeOutDuration" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('pages.settings.playback.fade.labels.out') }}</label>
            <div class="border-accented focus-within:border-primary relative mt-0 w-30 border transition-colors duration-300">
              <UInputNumber id="fadeOutDuration" v-model="storePlayback.states.fade.end" orientation="vertical" :min="0" :max="10000" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
            </div>
            <label for="fadeOutDuration" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('pages.settings.playback.fade.unit.ms') }}</label>
          </div>
        </div>
      </UFormField>

      <UFormField v-if="stateIsMounted" :label="t('pages.settings.playback.normalization.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            {{ t('pages.settings.playback.normalization.description') }}
          </div>
        </template>
        <div class="grid grid-cols-3 gap-3">
          <UTooltip v-for="lufs in loudness" :key="lufs" arrow :text="t(`pages.settings.playback.normalization.lufs.${lufs}`)" :content="{ side: 'top' }">
            <UButton color="neutral" variant="outline" size="lg" :class="[storePlayback.states.lufs === lufs ? 'bg-elevated' : 'hover:bg-elevated/50']" @click="storePlayback.states.lufs = lufs">{{ lufs }} {{ t('pages.settings.playback.normalization.unit') }}</UButton>
          </UTooltip>
        </div>
      </UFormField>
    </UPageCard>
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Store：播放设置 Store
 */
const storePlayback = useStorePlayback();

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

/**
 * 状态：组件是否挂载完成
 */
const stateIsMounted = ref(false);

/**
 * 响度：可选值（单位：rem）
 */
const loudness = [-14, -16, -24];

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
    label: t('pages.settings.playback.title'),
    icon: 'i-lucide:play',
    to: localePath('/settings/playback')
  }
];

/**
 * 生命周期：组件挂载完成
 */
onMounted(() => {
  stateIsMounted.value = true;
});
</script>
