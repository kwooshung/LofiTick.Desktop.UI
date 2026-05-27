<template>
  <UPageCard variant="outline">
    <template #header>
      <div class="space-y-2">
        <h1 class="text-highlighted text-xl font-semibold">{{ t('pages.hotsearch.sections.cover.title') }}</h1>
        <p class="text-muted text-sm leading-6">{{ t('pages.hotsearch.podcast.variants.cover.description') }}</p>
      </div>
    </template>

    <div class="text-muted text-sm leading-6">
      {{ t('pages.hotsearch.podcast.variants.cover.placeholder') }}
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();
</script>
