<template>
  <UEmpty icon="i-lucide:list-todo" :title="t('pages.crawlers.spider.websites.suno.page.tasks.empty.title')" :description="t('pages.crawlers.spider.websites.suno.page.tasks.empty.description')" />
</template>

<script setup lang="ts">
defineOptions({ name: 'CrawlersTaskSuno' });

/**
 * Hook：i18n。
 */
const { t } = useI18n();
</script>
