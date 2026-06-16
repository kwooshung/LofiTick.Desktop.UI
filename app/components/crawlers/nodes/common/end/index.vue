<template>
  <CrawlersNodesCommonBasic icon-name="i-tdesign:stop-circle-filled" :title="t('components.crawler.blueprint.nodes.common.end.title')" :description="t('components.crawler.blueprint.nodes.common.end.description')" header-bg="bg-teal-600" :show-exec-out="false" />
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();
</script>
