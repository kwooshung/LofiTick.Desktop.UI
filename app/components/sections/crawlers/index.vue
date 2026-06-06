<template>
  <DashboardPage direction="horizontal" :padded="false" class="p-4 sm:gap-3 sm:p-3">
    <Folder :label="t('pages.crawlers.spider.websites.dailyhot.title')" icon-name="i-material-symbols:bigtop-updates-rounded" :to="localePath('/crawlers/dailyhot')" />
    <Folder :label="t('pages.crawlers.spider.websites.pixabay.title')" icon-name="i-simple-icons:pixabay" :to="localePath('/crawlers/pixabay')" />
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();
</script>
