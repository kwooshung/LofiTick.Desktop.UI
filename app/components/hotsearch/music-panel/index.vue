<template>
  <UPageCard variant="outline">
    <template #header>
      <div>
        <h3 class="text-highlighted text-base font-semibold">{{ t('pages.hotsearch.sections.music.title') }}</h3>
        <p class="text-muted mt-1 text-sm leading-6">{{ t('pages.hotsearch.music.description') }}</p>
      </div>
    </template>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
      <UEmpty icon="i-lucide:disc-3" :title="t('pages.hotsearch.music.empty.title')" :description="t('pages.hotsearch.music.empty.description')" />

      <div class="space-y-4">
        <UPageCard v-for="item in computedReservedTracks" :key="item.id" variant="subtle" :title="item.title" :description="item.description">
          <template #footer>
            <div class="flex flex-wrap gap-2">
              <UBadge color="neutral" variant="soft">{{ item.mood }}</UBadge>
              <UBadge color="warning" variant="soft">{{ item.status }}</UBadge>
            </div>
          </template>
        </UPageCard>
      </div>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 计算属性：预留曲目列表。
 */
const computedReservedTracks = computed(() => [
  {
    id: 'ambient-piano',
    title: t('pages.hotsearch.music.reserved.ambientPiano.title'),
    description: t('pages.hotsearch.music.reserved.ambientPiano.description'),
    mood: t('pages.hotsearch.music.moods.calm'),
    status: t('pages.hotsearch.music.status.pending')
  },
  {
    id: 'news-pulse',
    title: t('pages.hotsearch.music.reserved.newsPulse.title'),
    description: t('pages.hotsearch.music.reserved.newsPulse.description'),
    mood: t('pages.hotsearch.music.moods.tense'),
    status: t('pages.hotsearch.music.status.pending')
  },
  {
    id: 'night-wrap',
    title: t('pages.hotsearch.music.reserved.nightWrap.title'),
    description: t('pages.hotsearch.music.reserved.nightWrap.description'),
    mood: t('pages.hotsearch.music.moods.warm'),
    status: t('pages.hotsearch.music.status.pending')
  }
]);
</script>
