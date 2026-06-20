<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-square-function"
    :title="t('components.crawler.blueprint.nodes.function.start.title')"
    :description="t('components.crawler.blueprint.nodes.function.start.description')"
    header-bg="bg-rose-500"
    :show-exec-in="false"
  />
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();
</script>
