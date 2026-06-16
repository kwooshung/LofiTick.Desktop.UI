<template>
  <div class="bg-default relative flex min-h-0 min-w-full flex-1 items-center justify-center overflow-hidden">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :is-valid-connection="isValidConnection"
      fit-view-on-init
      @dragover="(event: DragEvent) => emit('dragover', event as DragEvent)"
      @dragleave="(event: DragEvent) => emit('dragleave', event as DragEvent)"
      @connect="(params) => emit('connect', params)"
      @connect-start="(params) => emit('connect-start', params as TCrawlersCanvasConnectStartEvent)"
      @connect-end="(event) => emit('connect-end', event as MouseEvent | undefined)"
      @nodes-change="(changes) => emit('nodes-change', changes)"
    >
      <CrawlersEditorLinesHelper :horizontal="helperLineHorizontal" :vertical="helperLineVertical" />
      <template #node-start="props">
        <CrawlersNodesCommonStart v-bind="props" />
      </template>
      <template #node-end="props">
        <CrawlersNodesCommonEnd v-bind="props" />
      </template>
      <template #node-navigation-goto="props">
        <CrawlersNodesNavigationGoto v-bind="props" />
      </template>
      <CrawlersBackgroundDropzone :class="[isDragOver ? 'bg-primary/10' : 'bg-transparent', 'transition-colors duration-200 ease-in-out']">
        <UEmpty
          v-if="isDragOver"
          icon="i-lucide:mouse-pointer-click"
          :title="dragTitle"
          :description="dragDescription"
          variant="naked"
          size="sm"
          :ui="{
            root: 'pointer-events-none rounded-lg border border-1 border-default bg-default px-4 py-3 shadow-sm',
            header: 'max-w-none',
            body: 'max-w-none'
          }"
        />
        <UEmpty
          v-else-if="isCanvasEmpty"
          icon="i-lucide:workflow"
          :title="emptyTitle"
          :description="emptyDescription"
          variant="naked"
          size="sm"
          :ui="{
            root: 'pointer-events-none rounded-lg border border-1 border-default bg-default px-4 py-3 shadow-sm',
            header: 'max-w-none',
            body: 'max-w-none'
          }"
        />
      </CrawlersBackgroundDropzone>
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';

import type { ICrawlersEditorCanvasEmits, ICrawlersEditorCanvasProps, TCrawlersCanvasConnectStartEvent } from '@/components/crawlers/editor/canvas/index.types';

/**
 * 属性：画布渲染与状态数据。
 */
const { nodes, edges, isValidConnection, helperLineHorizontal, helperLineVertical, isDragOver, isCanvasEmpty, dragTitle, dragDescription, emptyTitle, emptyDescription } = defineProps<ICrawlersEditorCanvasProps>();

/**
 * 事件：画布交互事件。
 */
const emit = defineEmits<ICrawlersEditorCanvasEmits>();
</script>
