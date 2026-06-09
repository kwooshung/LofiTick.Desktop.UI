<template>
  <CrawlersBlueprintNode v-bind="props" />
</template>

<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core';

import type { ICrawlerBlueprintNodeData } from '@/components/crawlers/blueprint/node/index.types';

/**
 * Props：爬虫开始节点属性。
 */
const props = defineProps<NodeProps<ICrawlerBlueprintNodeData>>();
</script>
