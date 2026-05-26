<template>
  <UPageCard variant="outline">
    <template #header>
      <div class="space-y-2">
        <h1 class="text-highlighted text-xl font-semibold">{{ t('pages.ads.title') }}</h1>
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();
</script>