<template>
  <DashboardPage direction="horizontal" :padded="false" class="p-4 sm:gap-3 sm:p-3">
    <Folder :label="t('pages.crawlers.spider.websites.pixabay.name')" icon-name="i-simple-icons:pixabay" cursor-pointer />
    <Folder :label="t('pages.crawlers.spider.websites.suno.name')" icon-name="i-simple-icons:suno" cursor-pointer />
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：i18n
 */
const { t } = useI18n();
</script>
