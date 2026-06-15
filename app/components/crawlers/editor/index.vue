<template>
  <div class="editor bg-default flex h-full min-h-0 overflow-hidden" :aria-label="computedDescription" @drop="onDrop">
    <aside class="border-default bg-elevated/30 scrollbar h-full min-h-0 w-100 shrink-0 overflow-y-auto border-r p-3">
      <CrawlersList :groups="computedGroups" :selected-key="selectedKey" @click="handleListClick" />
    </aside>

    <div class="bg-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <div class="bg-default relative flex min-h-0 min-w-full flex-1 items-center justify-center overflow-hidden">
        <VueFlow :nodes="nodes" :edges="edges" @dragover="onDragOver" @dragleave="onDragLeave">
          <template #node-start="props">
            <CrawlersNodesStart v-bind="props" />
          </template>
          <CrawlersBackgroundDropzone :class="[isDragOver ? 'bg-primary/10' : 'bg-transparent', 'transition-colors duration-200 ease-in-out']">
            <UEmpty
              v-if="isDragOver"
              icon="i-lucide:mouse-pointer-click"
              :title="t('pages.crawlers.editor.drag.title')"
              :description="t('pages.crawlers.editor.drag.description')"
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
              :title="t('pages.crawlers.editor.empty.title')"
              :description="t('pages.crawlers.editor.empty.description')"
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

      <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 py-3">
        <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" color="primary" icon="i-lucide:save" @click="emit('save')">{{ t('common.actions.save') }}</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVueFlow, VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';

import type { ICrawlersEditorEmits, ICrawlersEditorProps } from '@/components/crawlers/editor/index.types';
import type { ICrawlersListRow } from '@/components/crawlers/list/index.types';

/**
 * 属性：站点展示名称与基础 URL。
 */
const { siteName = '', baseUrl = '', groups = [], selectedKey = '' } = defineProps<ICrawlersEditorProps>();

/**
 * 事件：编辑器操作。
 */
const emit = defineEmits<ICrawlersEditorEmits>();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：Vue Flow 实例方法。
 */
const { nodes, edges, onConnect, addEdges, addNodes } = useVueFlow();

/**
 * Hook：爬虫蓝图拖放。
 */
const { isDragOver, onDragLeave, onDragOver, onDrop } = useCrawlerBlueprintDnD();

/**
 * Hook：爬虫蓝图。
 */
const { groups: blueprintGroups } = useCrawlerBlueprintNodesMenu();

/**
 * 计算属性：画布是否为空。
 */
const isCanvasEmpty = computed(() => nodes.value.length === 0);

/**
 * 计算属性：描述文本。
 */
const computedDescription = computed(() => {
  const siteNameText = String(siteName ?? '').trim();
  const baseUrlText = String(baseUrl ?? '').trim();

  return [siteNameText, baseUrlText].filter((value) => value !== '').join(' · ');
});

/**
 * 计算属性：分组数据。
 */
const computedGroups = computed(() => (groups.length > 0 ? groups : blueprintGroups.value));

/**
 * 函数：添加边。
 * @param {Edge} edges 边数据。
 */
onConnect(addEdges);

/**
 * 函数：处理列表点击。
 * @param {ICrawlersListRow} row 条目。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleListClick = (row: ICrawlersListRow, event: MouseEvent): void => {
  emit('click', row, event);
};

onMounted(() => {
  if (nodes.value.length === 0) {
    addNodes({
      id: '1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        title: '开始',
        description: '爬虫的入口节点，负责触发爬虫的执行',
        showExecIn: false,
        showExecOut: true
      }
    });
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- 需要覆盖第三方 Vue Flow 约定类名（如 vue-flow__*） */

$breakpoint-sm: 640px;
$breakpoint-xs-max: 639px;

@mixin cursor-grab {
  cursor: grab;
}

@mixin cursor-grabbing {
  cursor: grabbing;
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}

.editor {
  --vf-node-bg: var(--ui-bg);
  --vf-node-text: var(--ui-text);
  --vf-node-color: var(--ui-text);
  --vf-connection-path: color-mix(in oklab, var(--ui-border) 72%, var(--ui-text) 28%);
  --vf-handle: var(--ui-color-neutral-400);
  --vf-box-shadow: var(--vf-node-color);
  --vf-control-bg: var(--ui-bg);
  --vf-control-bg-hover: color-mix(in oklab, var(--ui-bg) 90%, var(--ui-text) 10%);
  --vf-control-border: var(--ui-border);
  --vf-minimap-bg: var(--ui-bg-elevated);
  --vf-resize-accent: var(--ui-primary);
  --dnd-shadow-soft: 0 5px 10px rgb(0 0 0 / 30%);
  --dnd-shadow-card: 5px 5px 10px 2px rgb(0 0 0 / 25%);

  :deep(.vue-flow-wrapper) {
    flex-grow: 1;
    height: 100%;
  }

  :deep(.vue-flow) {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    direction: ltr;

    .vue-flow__container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .vue-flow__pane {
      z-index: 1;

      &.draggable {
        @include cursor-grab;
      }

      &.selection {
        cursor: pointer;
      }

      &.dragging {
        @include cursor-grabbing;
      }
    }

    .vue-flow__transformationpane {
      z-index: 2;
      pointer-events: none;
      transform-origin: 0 0;
      transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform;
    }

    .vue-flow__viewport {
      z-index: 4;
      overflow: clip;
    }

    .vue-flow__selection {
      z-index: 6;
    }

    .vue-flow__edge-labels {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      user-select: none;
    }

    .vue-flow__edges {
      overflow: visible;
      pointer-events: none;
    }

    .vue-flow__edge-path,
    .vue-flow__connection-path {
      fill: none;
      stroke: var(--vf-connection-path);
      stroke-width: 3;
    }

    .vue-flow__edge {
      pointer-events: visibleStroke;
      cursor: pointer;

      &.animated path {
        stroke-dasharray: 5;
        animation: dashdraw 0.5s linear infinite;
      }

      &.animated path.vue-flow__edge-interaction {
        stroke-dasharray: none;
        animation: none;
      }

      &.inactive {
        pointer-events: none;
      }

      &.selected,
      &:focus,
      &:focus-visible {
        outline: none;
      }

      &.selected .vue-flow__edge-path,
      &:focus .vue-flow__edge-path,
      &:focus-visible .vue-flow__edge-path {
        stroke: color-mix(in oklab, var(--ui-text) 80%, var(--color-black) 20%);
      }

      &.updating .vue-flow__edge-path {
        stroke: color-mix(in oklab, var(--ui-text-muted) 85%, var(--color-black) 15%);
      }
    }

    .vue-flow__edge-textwrapper {
      pointer-events: all;
    }

    .vue-flow__edge-text {
      font-size: 10px;
      pointer-events: none;
      user-select: none;
    }

    .vue-flow__edge-textbg {
      fill: var(--ui-bg);
    }

    .vue-flow__connection {
      pointer-events: none;

      .animated {
        stroke-dasharray: 5;
        animation: dashdraw 0.5s linear infinite;
      }
    }

    .vue-flow__connectionline {
      z-index: 1001;
    }

    .vue-flow__nodes {
      pointer-events: none;
      transform-origin: 0 0;
    }

    .vue-flow__node {
      position: absolute;
      box-sizing: border-box;
      pointer-events: all;
      cursor: default;
      user-select: none;
      transform-origin: 0 0;

      &.draggable {
        @include cursor-grab;
      }

      &.draggable.dragging {
        @include cursor-grabbing;
      }

      &.selectable:focus,
      &.selectable:focus-visible {
        outline: none;
      }
    }

    .vue-flow__node-default,
    .vue-flow__node-input,
    .vue-flow__node-output {
      width: 150px;
      padding: 10px;
      font-size: 12px;
      color: var(--vf-node-text);
      text-align: center;
      background-color: var(--vf-node-bg);
      border-color: var(--vf-node-color);
      border-style: solid;
      border-width: 1px;
      border-radius: 3px;

      .vue-flow__handle {
        background: var(--vf-handle);
      }

      &.selectable:hover {
        box-shadow: 0 1px 4px 1px rgb(0 0 0 / 8%);
      }

      &.selected,
      &.selected:hover,
      &:focus,
      &:focus-visible {
        outline: none;
        border: 1px solid var(--vf-node-color);
        --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, #0000001a), 0 4px 6px -4px var(--tw-shadow-color, #0000001a);
        box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
      }
    }

    .vue-flow__node-input {
      --vf-node-color: color-mix(in oklab, var(--ui-primary) 85%, var(--color-black) 15%);
      --vf-box-shadow: var(--vf-node-color);
    }

    .vue-flow__node-default {
      --vf-node-color: var(--ui-text);
      --vf-box-shadow: var(--vf-node-color);
    }

    .vue-flow__node-output {
      --vf-node-color: color-mix(in oklab, var(--ui-primary) 78%, var(--color-white) 22%);
      --vf-box-shadow: var(--vf-node-color);
    }

    .vue-flow__nodesselection {
      z-index: 3;
      pointer-events: none;
      transform-origin: left top;
    }

    .vue-flow__nodesselection-rect,
    .vue-flow__selection {
      background: color-mix(in oklab, var(--ui-primary) 8%, transparent);
      border: 1px dotted color-mix(in oklab, var(--ui-primary) 80%, var(--color-black) 20%);
    }

    .vue-flow__nodesselection-rect {
      position: absolute;
      pointer-events: all;
      cursor: grab;

      &.dragging {
        @include cursor-grabbing;
      }

      &:focus,
      &:focus-visible {
        outline: none;
      }
    }

    .vue-flow__handle {
      position: absolute;
      width: 10px;
      min-width: 5px;
      height: 10px;
      min-height: 5px;
      color: var(--vf-handle);
      pointer-events: none;
      background: var(--vf-handle);
      border: 1px solid var(--ui-bg);
      border-radius: 100%;

      &.connectable {
        pointer-events: all;
        cursor: crosshair;
      }

      &.vue-flow__handle-bottom {
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
      }

      &.vue-flow__handle-top {
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &.vue-flow__handle-left {
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%);
      }

      &.vue-flow__handle-right {
        top: 50%;
        right: 0;
        transform: translate(50%, -50%);
      }
    }

    .vue-flow__edgeupdater {
      pointer-events: all;
      cursor: move;
    }

    .vue-flow__panel {
      position: absolute;
      z-index: 5;
      margin: 15px;

      &.top {
        top: 0;
      }

      &.bottom {
        bottom: 0;
      }

      &.left {
        left: 0;
      }

      &.right {
        right: 0;
      }

      &.center {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  :deep(.vue-flow__controls) {
    box-shadow: 0 0 2px 1px rgb(0 0 0 / 8%);

    .vue-flow__controls-button {
      box-sizing: content-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 5px;
      cursor: pointer;
      user-select: none;
      background: var(--vf-control-bg);
      border: none;
      border-bottom: 1px solid var(--vf-control-border);

      &:hover {
        background: var(--vf-control-bg-hover);
      }

      &:disabled {
        pointer-events: none;

        svg {
          fill-opacity: 0.4;
        }
      }

      svg {
        width: 100%;
        max-width: 12px;
        max-height: 12px;
      }
    }
  }

  :deep(.vue-flow__minimap) {
    background-color: var(--vf-minimap-bg);
    transform: scale(75%);
    transform-origin: bottom right;

    &.pannable {
      @include cursor-grab;
    }

    &.dragging {
      @include cursor-grabbing;
    }
  }

  :deep(.vue-flow__minimap-mask) {
    &.pannable {
      @include cursor-grab;
    }
  }

  :deep(.vue-flow__resize-control) {
    position: absolute;

    &.left,
    &.right {
      cursor: ew-resize;
    }

    &.top,
    &.bottom {
      cursor: ns-resize;
    }

    &.top.left,
    &.bottom.right {
      cursor: nwse-resize;
    }

    &.bottom.left,
    &.top.right {
      cursor: nesw-resize;
    }

    &.handle {
      width: 5px;
      height: 5px;
      background-color: var(--vf-resize-accent);
      border: 1px solid var(--ui-bg);
      border-radius: 1px;
      transform: translate(-50%, -50%);

      &.left {
        top: 50%;
        left: 0;
      }

      &.right {
        top: 50%;
        left: 100%;
      }

      &.top {
        top: 0;
        left: 50%;
      }

      &.bottom {
        top: 100%;
        left: 50%;
      }

      &.top.left,
      &.bottom.left {
        left: 0;
      }

      &.top.right,
      &.bottom.right {
        left: 100%;
      }
    }

    &.line {
      border-color: var(--vf-resize-accent);
      border-style: solid;
      border-width: 0;

      &.left,
      &.right {
        top: 0;
        width: 1px;
        height: 100%;
        transform: translate(-50%, 0);
      }

      &.left {
        left: 0;
        border-left-width: 1px;
      }

      &.right {
        left: 100%;
        border-right-width: 1px;
      }

      &.top,
      &.bottom {
        left: 0;
        width: 100%;
        height: 1px;
        transform: translate(0, -50%);
      }

      &.top {
        top: 0;
        border-top-width: 1px;
      }

      &.bottom {
        top: 100%;
        border-bottom-width: 1px;
      }
    }
  }
}
</style>
