<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-corner-down-left"
    :title="t('components.crawler.blueprint.nodes.function.return.title')"
    :description="t('components.crawler.blueprint.nodes.function.return.description')"
    header-bg="bg-teal-600"
    :show-exec-out="false"
  />
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();
</script>
