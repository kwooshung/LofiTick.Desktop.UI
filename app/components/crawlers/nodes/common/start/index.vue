<template>
  <CrawlersNodesCommonBasic icon-name="i-tdesign:play-circle-filled" :title="computedCrawlerTitle" :description="computedCrawlerDescription" header-bg="bg-rose-500" :show-exec-in="false">
    <div class="space-y-2">
      <FormUrlInput v-if="computedDomain !== ''" :model-value="computedDomain" readonly base-url-only class="w-full" />

      <div class="space-y-1">
        <label class="text-toned text-xs leading-none font-medium">{{ t('components.crawler.blueprint.nodes.common.start.form.crawlerTitle') }}</label>
        <UInput v-model="stateCrawlerTitle" :placeholder="t('components.crawler.blueprint.nodes.common.start.form.crawlerTitlePlaceholder')" class="w-full" maxlength="120" />
        <p v-if="computedCrawlerTitleRequiredInvalid" class="text-error text-xs">{{ t('components.crawler.blueprint.nodes.common.start.form.crawlerTitleRequired') }}</p>
      </div>

      <div class="space-y-1">
        <label class="text-toned text-xs leading-none font-medium">{{ t('components.crawler.blueprint.nodes.common.start.form.crawlerDescription') }}</label>
        <UTextarea v-model="stateCrawlerDescription" :placeholder="t('components.crawler.blueprint.nodes.common.start.form.crawlerDescriptionPlaceholder')" :rows="2" autoresize :maxrows="4" class="w-full" />
      </div>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { ICrawlersNodesCommonStartData } from '@/components/crawlers/nodes/common/start/index.types';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：Vue Flow。
 */
const { updateNodeData } = useVueFlow();

/**
 * Hook：当前节点实例。
 */
const stateNode = useNode();

/**
 * Hook：当前节点 ID。
 */
const stateNodeId = useNodeId();

/**
 * 状态：爬虫标题。
 */
const stateCrawlerTitle = ref('');

/**
 * 状态：爬虫描述。
 */
const stateCrawlerDescription = ref('');

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

/**
 * 计算属性：当前节点 ID（含兜底）。
 */
const computedNodeId = computed<string>(() => {
  const fromHook = String(stateNodeId.value ?? '').trim();

  if (fromHook !== '') {
    return fromHook;
  }

  return String(stateNode.node.id ?? '').trim();
});

/**
 * 计算属性：爬虫标题（展示值）。
 */
const computedCrawlerTitle = computed(() => {
  const customTitle = stateCrawlerTitle.value.trim();

  return customTitle !== '' ? customTitle : t('components.crawler.blueprint.nodes.common.start.title');
});

/**
 * 计算属性：爬虫描述（展示值）。
 */
const computedCrawlerDescription = computed(() => {
  const customDescription = stateCrawlerDescription.value.trim();

  return customDescription !== '' ? customDescription : t('components.crawler.blueprint.nodes.common.start.description');
});

/**
 * 计算属性：爬虫标题是否为空。
 */
const computedCrawlerTitleRequiredInvalid = computed(() => stateCrawlerTitle.value.trim() === '');

watch(
  () => stateNode.node.data,
  (data) => {
    const normalizedData = (data ?? {}) as ICrawlersNodesCommonStartData;
    stateCrawlerTitle.value = String(normalizedData.crawlerTitle ?? '');
    stateCrawlerDescription.value = String(normalizedData.crawlerDescription ?? '');
  },
  { immediate: true, deep: true }
);

watch(
  () => [stateCrawlerTitle.value, stateCrawlerDescription.value],
  () => {
    if (computedNodeId.value === '') {
      return;
    }

    void updateNodeData(computedNodeId.value, {
      crawlerTitle: stateCrawlerTitle.value,
      crawlerDescription: stateCrawlerDescription.value,
      domain: computedDomain.value
    });
  }
);
</script>
