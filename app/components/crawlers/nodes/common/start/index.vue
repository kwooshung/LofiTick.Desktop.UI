<template>
  <CrawlersNodesCommonBasic icon-name="i-tdesign:play-circle-filled" :title="t('components.crawler.blueprint.nodes.common.start.title')" :description="t('components.crawler.blueprint.nodes.common.start.description')" header-bg="bg-rose-500" :show-exec-in="false" />
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();
</script>
