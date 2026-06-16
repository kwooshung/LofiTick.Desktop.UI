<template>
  <div class="editor bg-default flex h-full min-h-0 overflow-hidden" :aria-label="computedDescription" @drop="onDrop">
    <CrawlersEditorSidebar :groups="computedGroups" :selected-key="selectedKey" @click="handleListClick" />

    <div class="bg-default relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div class="absolute top-2 right-3 z-20">
        <button
          type="button"
          :class="[
            'cursor-pointer rounded-md border px-3 py-1 text-xs font-medium shadow-sm transition-colors duration-200',
            computedAutoSaveStatusType === 'success' ? 'border-success/40 bg-success/10 text-success' : computedAutoSaveStatusType === 'error' ? 'border-error/40 bg-error/10 text-error' : 'border-default bg-default/90 text-toned'
          ]"
          @click="handleAutoSaveManual"
        >
          {{ computedAutoSaveStatusText }}
        </button>
      </div>

      <CrawlersEditorCanvas
        :nodes="nodes"
        :edges="edges"
        :helper-line-horizontal="stateHelperLineHorizontal"
        :helper-line-vertical="stateHelperLineVertical"
        :is-valid-connection="isValidConnection"
        :is-drag-over="isDragOver"
        :is-canvas-empty="isCanvasEmpty"
        :drag-title="t('pages.crawlers.editor.drag.title')"
        :drag-description="t('pages.crawlers.editor.drag.description')"
        :empty-title="t('pages.crawlers.editor.empty.title')"
        :empty-description="t('pages.crawlers.editor.empty.description')"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @connect="handleConnect"
        @connect-start="handleConnectStart"
        @connect-end="handleConnectEnd"
        @nodes-change="handleNodesChange"
      />

      <CrawlersEditorActions
        :restore-text="t('pages.crawlers.editor.actions.restore')"
        :zoom-in-text="t('pages.crawlers.editor.actions.zoomIn')"
        :zoom-out-text="t('pages.crawlers.editor.actions.zoomOut')"
        :auto-layout-text="t('pages.crawlers.editor.actions.autoLayout')"
        :redo-text="t('pages.crawlers.editor.actions.redo')"
        :undo-text="t('pages.crawlers.editor.actions.undo')"
        :cancel-text="t('common.actions.cancel')"
        :save-text="t('common.actions.save')"
        @restore="handleViewportRestore"
        @zoom-in="handleViewportZoomIn"
        @zoom-out="handleViewportZoomOut"
        @auto-layout="handleAutoLayout"
        @redo="handleRedo"
        @undo="handleUndo"
        @cancel="handelModalCancel"
        @save="handelModalSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core';
import { debounce } from 'es-toolkit';

import type { ICrawlersEditorEmits, ICrawlersEditorProps } from '@/components/crawlers/editor/index.types';
import type { ICrawlersListRow } from '@/components/crawlers/list/index.types';
import { useCrawlersEditorLogic } from '@/composables/hooks/useCrawlersEditorLogic/index';

/**
 * 属性：站点展示名称与基础 URL。
 */
const { siteName = '', baseUrl = '', groups = [], selectedKey = '' } = defineProps<ICrawlersEditorProps>();

/**
 * 事件：编辑器操作。
 */
const emit = defineEmits<ICrawlersEditorEmits>();

/**
 * 状态：辅助线位置。
 */
const stateHelperLineHorizontal = ref<number | undefined>(undefined);

/**
 * 状态：辅助线位置。
 */
const stateHelperLineVertical = ref<number | undefined>(undefined);

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：Vue Flow 实例方法。
 */
const { nodes, edges, toObject, fromObject, fitView, zoomIn, zoomOut, addEdges, addNodes, applyNodeChanges } = useVueFlow();

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
 * 计算属性：标准化域名。
 */
const computedNormalizedDomain = computed(() => {
  const raw = String(baseUrl ?? '').trim();

  if (raw === '') {
    return '';
  }

  const noProtocol = raw.replace(/^https?:\/\//i, '');
  const host = noProtocol.split('/')[0]?.trim().toLowerCase() ?? '';

  return host;
});

/**
 * 常量：草稿缓存键前缀。
 */
const DRAFT_ENTRY_PREFIX = 'crawler:blueprint:draft:';

/**
 * 常量：自动保存倒计时（秒）。
 */
const AUTO_SAVE_COUNTDOWN_SECONDS = 10;

/**
 * 常量：保存结果提示保留时长（秒）。
 */
const AUTO_SAVE_STATUS_SECONDS = 2;

/**
 * 常量：草稿最大存活时间（7 天，毫秒）。
 */
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * 计算属性：草稿缓存键。
 */
const computedDraftKey = computed(() => {
  const domain = computedNormalizedDomain.value;

  if (domain === '') {
    return '';
  }

  return `${DRAFT_ENTRY_PREFIX}${domain}`;
});

/**
 * 函数：同步开始节点域名到节点数据。
 * @returns {void} 无返回值。
 */
const syncStartNodeDomain = (): void => {
  const domain = computedNormalizedDomain.value;
  const startNode = nodes.value.find((node) => node.id === 'start');

  if (!startNode) {
    return;
  }

  const currentDomain = String((startNode.data as { domain?: string } | undefined)?.domain ?? '');
  if (currentDomain === domain) {
    return;
  }

  nodes.value = nodes.value.map((node) => {
    if (node.id !== 'start') {
      return node;
    }

    return {
      ...node,
      data: {
        ...(node.data as Record<string, unknown> | undefined),
        domain
      }
    };
  });
};

/**
 * Hook：编辑器画布交互逻辑。
 */
const { initializeDefaultNodes, handleNodesChange, handleConnectStart, handleConnect, handleConnectEnd, isValidConnection } = useCrawlersEditorLogic({
  nodes,
  edges,
  stateHelperLineHorizontal,
  stateHelperLineVertical,
  addEdges,
  applyNodeChanges,
  addNodes
});

/**
 * 状态：节点快照历史。
 */
const stateHistory = ref<string[]>([]);

/**
 * 状态：历史游标。
 */
const stateHistoryIndex = ref(-1);

/**
 * 状态：是否正在恢复快照。
 */
const stateRestoringSnapshot = ref(false);

/**
 * 状态：是否正在初始化默认节点。
 */
const stateInitializingDefault = ref(false);

/**
 * 状态：是否已尝试草稿恢复。
 */
const stateDraftRestored = ref(false);

/**
 * 状态：上次草稿快照。
 */
const stateLastDraftSnapshot = ref('');

/**
 * 状态：自动保存倒计时（秒）。
 */
const stateAutoSaveCountdown = ref<number>(AUTO_SAVE_COUNTDOWN_SECONDS);

/**
 * 状态：保存结果提示剩余时长（秒）。
 */
const stateAutoSaveStatusRemainSeconds = ref<number>(0);

/**
 * 状态：自动保存状态。
 */
const stateAutoSaveStatus = ref<'idle' | 'success' | 'error'>('idle');

/**
 * 状态：自动保存轮询定时器。
 */
const stateAutoSaveTimerId = ref<number | null>(null);

/**
 * 计算属性：自动保存状态文案。
 */
const computedAutoSaveStatusText = computed(() => {
  if (stateAutoSaveStatusRemainSeconds.value > 0 && stateAutoSaveStatus.value === 'success') {
    return t('common.actions.save') + t('pages.crawlers.executions.status.success');
  }

  if (stateAutoSaveStatusRemainSeconds.value > 0 && stateAutoSaveStatus.value === 'error') {
    return t('common.actions.save') + t('pages.crawlers.executions.status.failed');
  }

  return `${stateAutoSaveCountdown.value}s 后自动保存`;
});

/**
 * 计算属性：自动保存状态类型。
 */
const computedAutoSaveStatusType = computed<'idle' | 'success' | 'error'>(() => {
  if (stateAutoSaveStatusRemainSeconds.value > 0) {
    return stateAutoSaveStatus.value;
  }

  return 'idle';
});

/**
 * 函数：生成当前画布快照。
 * @returns {{ nodes: typeof nodes.value; edges: typeof edges.value }} 当前快照。
 */
const createSnapshot = (): string => JSON.stringify(toObject());

/**
 * 函数：同步历史快照。
 * @returns {void} 无返回值。
 */
const pushHistorySnapshot = (): void => {
  const snapshot = createSnapshot();
  const current = stateHistory.value[stateHistoryIndex.value] ?? '';

  if (current === snapshot) {
    return;
  }

  stateHistory.value = stateHistory.value.slice(0, stateHistoryIndex.value + 1);
  stateHistory.value.push(snapshot);
  stateHistoryIndex.value = stateHistory.value.length - 1;
};

/**
 * 函数：恢复历史快照。
 * @param {number} index 快照索引。
 * @returns {void} 无返回值。
 */
const restoreSnapshot = async (index: number): Promise<void> => {
  const snapshot = stateHistory.value[index];

  if (!snapshot) {
    return;
  }

  stateRestoringSnapshot.value = true;
  try {
    await fromObject(JSON.parse(snapshot) as Parameters<typeof fromObject>[0]);
    stateHistoryIndex.value = index;
  } finally {
    stateRestoringSnapshot.value = false;
  }
};

/**
 * 函数：撤销。
 * @returns {void} 无返回值。
 */
const handleUndo = (): void => {
  if (stateHistoryIndex.value <= 0) {
    return;
  }

  void restoreSnapshot(stateHistoryIndex.value - 1);
};

/**
 * 函数：恢复。
 * @returns {void} 无返回值。
 */
const handleRedo = (): void => {
  if (stateHistoryIndex.value >= stateHistory.value.length - 1) {
    return;
  }

  void restoreSnapshot(stateHistoryIndex.value + 1);
};

/**
 * 函数：还原视图。
 * @returns {void} 无返回值。
 */
const handleViewportRestore = (): void => {
  void fitView();
};

/**
 * 函数：放大视图。
 * @returns {void} 无返回值。
 */
const handleViewportZoomIn = (): void => {
  void zoomIn();
};

/**
 * 函数：缩小视图。
 * @returns {void} 无返回值。
 */
const handleViewportZoomOut = (): void => {
  void zoomOut();
};

/**
 * 函数：自动排版。
 * @returns {void} 无返回值。
 */
const handleAutoLayout = (): void => {
  void fitView();
};

/**
 * 函数：清理所有超过 7 天的草稿。
 * @returns {void} 无返回值。
 */
const clearExpiredDrafts = (): void => {
  if (!import.meta.client) {
    return;
  }

  const now = Date.now();
  const keysToDelete: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(DRAFT_ENTRY_PREFIX)) {
      continue;
    }

    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        keysToDelete.push(key);
        continue;
      }

      const entry = JSON.parse(raw) as { ts?: number };
      if (!entry.ts || now - entry.ts > DRAFT_MAX_AGE_MS) {
        keysToDelete.push(key);
      }
    } catch {
      keysToDelete.push(key);
    }
  }

  for (const key of keysToDelete) {
    localStorage.removeItem(key);
  }
};

/**
 * 函数：恢复当前域名对应草稿。
 * @returns {Promise<boolean>} 是否已恢复草稿。
 */
const restoreDraft = async (): Promise<boolean> => {
  if (!import.meta.client) {
    return false;
  }

  const key = computedDraftKey.value;
  if (key === '') {
    return false;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return false;
  }

  try {
    const entry = JSON.parse(raw) as { ts?: number; data?: string };

    // 无时间戳或已过期，清除
    if (!entry.ts || Date.now() - entry.ts > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(key);
      return false;
    }

    const data = entry.data;
    if (!data) {
      localStorage.removeItem(key);
      return false;
    }

    await fromObject(JSON.parse(data) as Parameters<typeof fromObject>[0]);
    stateHistory.value = [];
    stateHistoryIndex.value = -1;
    pushHistorySnapshot();
    return true;
  } catch {
    localStorage.removeItem(key);
    return false;
  }
};

/**
 * 函数：删除当前域名草稿。
 * @returns {void} 无返回值。
 */
const clearDraft = (): void => {
  if (!import.meta.client) {
    return;
  }

  const key = computedDraftKey.value;
  if (key !== '') {
    localStorage.removeItem(key);
  }

  stateLastDraftSnapshot.value = '';
};

/**
 * 函数：将当前画布保存到草稿。
 * @returns {void} 无返回值。
 */
const saveDraft = (): boolean => {
  if (!import.meta.client) {
    return true;
  }

  const key = computedDraftKey.value;
  if (key === '') {
    return true;
  }

  try {
    const snapshot = createSnapshot();
    if (stateLastDraftSnapshot.value === snapshot) {
      return true;
    }

    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: snapshot }));
    stateLastDraftSnapshot.value = snapshot;
    return true;
  } catch {
    return false;
  }
};

/**
 * 函数：执行一次自动保存并更新状态提示。
 * @returns {void} 无返回值。
 */
const runAutoSave = (): void => {
  const success = saveDraft();
  stateAutoSaveStatus.value = success ? 'success' : 'error';
  stateAutoSaveStatusRemainSeconds.value = AUTO_SAVE_STATUS_SECONDS;
  stateAutoSaveCountdown.value = AUTO_SAVE_COUNTDOWN_SECONDS;
};

/**
 * 事件：手动触发自动保存。
 * @returns {void} 无返回值。
 */
const handleAutoSaveManual = (): void => {
  if (stateRestoringSnapshot.value || stateInitializingDefault.value) {
    return;
  }

  runAutoSave();
};

/**
 * 函数：防抖记录历史。
 */
const pushHistorySnapshotDebounced = debounce(() => {
  if (stateRestoringSnapshot.value || stateInitializingDefault.value) {
    return;
  }

  pushHistorySnapshot();
}, 180);

/**
 * 生命周期：组件挂载后，初始化默认节点数据。
 */
onMounted(async () => {
  clearExpiredDrafts();

  if (!stateDraftRestored.value) {
    stateDraftRestored.value = true;
    const restored = await restoreDraft();
    if (!restored) {
      stateInitializingDefault.value = true;
      initializeDefaultNodes();
      syncStartNodeDomain();
      stateInitializingDefault.value = false;
    } else {
      syncStartNodeDomain();
    }
  }

  stateLastDraftSnapshot.value = createSnapshot();

  stateAutoSaveTimerId.value = window.setInterval(() => {
    if (stateRestoringSnapshot.value || stateInitializingDefault.value) {
      return;
    }

    if (stateAutoSaveStatusRemainSeconds.value > 0) {
      stateAutoSaveStatusRemainSeconds.value -= 1;
      if (stateAutoSaveStatusRemainSeconds.value === 0) {
        stateAutoSaveStatus.value = 'idle';
      }
      return;
    }

    stateAutoSaveCountdown.value = Math.max(0, stateAutoSaveCountdown.value - 1);

    if (stateAutoSaveCountdown.value === 0) {
      runAutoSave();
    }
  }, 1000);
});

/**
 * 监听：基础 URL 变化时，刷新开始节点域名。
 */
watch(computedNormalizedDomain, () => {
  syncStartNodeDomain();
});

/**
 * 监听：开始节点就绪后补同步域名，避免节点初始化时机导致丢值。
 */
watch(
  () => nodes.value.some((node) => node.id === 'start'),
  (hasStartNode) => {
    if (!hasStartNode) {
      return;
    }

    syncStartNodeDomain();
  }
);

/**
 * 生命周期：组件挂载后，记录初始快照。
 */
watchEffect(() => {
  if (nodes.value.length > 0 && stateHistory.value.length === 0) {
    pushHistorySnapshot();
    saveDraft();
  }
});

/**
 * 监听：节点与边变化，持续记录历史与草稿。
 */
watch(
  () => [nodes.value, edges.value],
  () => {
    if (stateHistory.value.length === 0) {
      return;
    }

    pushHistorySnapshotDebounced();
  },
  { deep: true }
);

/**
 * 事件：处理模态框保存
 */
const handelModalSave = () => {
  const flowData = toObject();
  emit('save', {
    flowData,
    draftKey: computedDraftKey.value
  });
};

/**
 * 函数：处理列表点击。
 * @param {ICrawlersListRow} row 条目。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleListClick = (row: ICrawlersListRow, event: MouseEvent): void => {
  emit('click', row, event);
};

/**
 * 事件：处理模态框取消
 */
const handelModalCancel = () => {
  emit('cancel');
};

/**
 * 生命周期：组件卸载前，取消防抖任务。
 */
onBeforeUnmount(() => {
  pushHistorySnapshotDebounced.cancel();
  if (stateAutoSaveTimerId.value !== null) {
    window.clearInterval(stateAutoSaveTimerId.value);
    stateAutoSaveTimerId.value = null;
  }
});

/**
 * 向外暴露：草稿清理。
 */
defineExpose({
  clearDraft
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
  --vf-handle: var(--color-white);
  --vf-connection-path: var(--ui-color-neutral-600);
  --vf-connection-valid: var(--ui-color-success-800);
  --vf-connection-invalid: var(--ui-error);
  --vf-edge-connected: var(--ui-primary);
  --vf-edge-selected: var(--ui-primary);
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
      cursor: default;

      &.draggable {
        cursor: default;
      }

      &.selection {
        cursor: default;
      }

      &.dragging {
        @include cursor-grabbing;
      }

      &.pan-on-drag {
        @include cursor-grab;
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
      transition: stroke 140ms ease;
    }

    .vue-flow__connection-path.valid {
      stroke: var(--vf-connection-valid);
    }

    .vue-flow__connection-path.invalid {
      stroke: var(--vf-connection-invalid);
    }

    .vue-flow__edge {
      pointer-events: visibleStroke;
      cursor: pointer;

      &.crawlers-edge-connected .vue-flow__edge-path {
        stroke: var(--vf-edge-connected);
      }

      &.animated path {
        stroke-dasharray: 5;
        animation: dashdraw 500ms linear infinite;
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
        stroke: var(--vf-edge-selected);
        stroke-width: 5;
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
        animation: dashdraw 500ms linear infinite;
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
    // background-color: var(--vf-minimap-bg);
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
