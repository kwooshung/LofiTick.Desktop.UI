<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-loader-circle" :title="t('components.crawler.blueprint.nodes.wait.loadState.title')" :description="t('components.crawler.blueprint.nodes.wait.loadState.description')" header-bg="bg-amber-500" />
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
