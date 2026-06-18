<template>
  <CrawlersNodesCommonBasic icon-name="i-tdesign:play-circle-filled" :title="t('components.crawler.blueprint.nodes.common.start.title')" :description="t('components.crawler.blueprint.nodes.common.start.description')" header-bg="bg-rose-500" :show-exec-in="false">
    <FormUrlInput v-if="computedDomain !== ''" :model-value="computedDomain" readonly base-url-only class="w-full" />
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { ICrawlersNodesCommonStartData } from '@/components/crawlers/nodes/common/start/index.types';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：当前节点实例。
 */
const stateNode = useNode();

/**
 * 计算属性：开始节点域名。
 */
const computedDomain = computed(() => {
  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as ICrawlersNodesCommonStartData;
  return String(data.domain ?? '').trim();
});
</script>
