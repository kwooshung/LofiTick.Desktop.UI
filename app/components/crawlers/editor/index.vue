<template>
  <div
    ref="refEditorRoot"
    tabindex="0"
    class="editor bg-default relative flex h-full min-h-0 overflow-hidden focus:outline-none"
    :aria-label="computedDescription"
    @drop="onDrop"
    @pointerdown.capture="handleEditorPointerDown"
    @pointermove.capture="handleEditorPointerMove"
    @pointerleave.capture="handleEditorPointerLeave"
    @keydown.capture="handleEditorKeydown"
  >
    <CrawlersEditorSidebar
      :groups="computedGroups"
      :selected-key="selectedKey"
      :target-id="targetId"
      :function-refresh-nonce="functionRefreshNonce"
      @click="handleListClick"
      @create-function="handleSidebarCreateFunction"
      @edit-function-logic="handleSidebarEditFunctionLogic"
      @functions-changed="handleSidebarFunctionsChanged"
    />

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
        :function-refresh-nonce="functionRefreshNonce"
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

      <div v-if="stateEditorInitializing" class="bg-default/70 absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-default/90 border-default flex flex-col items-center justify-center gap-3 rounded-md border px-3 py-2">
          <UIcon name="i-lucide:loader-circle" class="text-primary size-5 animate-spin" />
          <span class="text-muted text-xs">{{ t('pages.crawlers.editor.loadSource.loading') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Edge, Node, XYPosition } from '@vue-flow/core';
import { useVueFlow } from '@vue-flow/core';
import { debounce } from 'es-toolkit';

import type { ICrawlersEditorClipboardBounds, ICrawlersEditorClipboardData, ICrawlersEditorEmits, ICrawlersEditorProps } from '@/components/crawlers/editor/index.types';
import type { ICrawlersEditorSidebarFunctionRow } from '@/components/crawlers/editor/sidebar/index.types';
import type { ICrawlersListRow } from '@/components/crawlers/list/index.types';
import { resolveSystemNodeMeta, useCrawlersEditorLogic } from '@/composables/hooks/useCrawlersEditorLogic/index';

/**
 * Props：组件入参。
 */
const { flowKind = 'crawler', siteName = '', baseUrl = '', flowDescription = '', targetId = 0, groups = [], selectedKey = '', functionRefreshNonce = 0, initialFlowData = null, draftStorageKey = '' } = defineProps<ICrawlersEditorProps>();
const systemNodeMeta = resolveSystemNodeMeta(flowKind);

/**
 * 类型：导入图数据中的节点摘要。
 */
type TFlowDataNodeLike = {
  id?: string;
  type?: string;
  data?: unknown;
};

/**
 * 类型：导入图数据中的边摘要。
 */
type TFlowDataEdgeLike = {
  id?: string;
  source?: string | null;
  target?: string | null;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

/**
 * 类型：导入图数据中的快照摘要。
 */
type TFlowDataLike = {
  nodes?: TFlowDataNodeLike[];
  edges?: TFlowDataEdgeLike[];
};

/**
 * 函数：创建图数据 JSON 净化 replacer。
 * @returns {(key: string, value: unknown) => unknown} JSON replacer。
 */
const createFlowDataJsonReplacer = (): ((key: string, value: unknown) => unknown) => {
  const seen = new WeakSet<object>();

  return (_key: string, value: unknown): unknown => {
    if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
      return undefined;
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    if (typeof Window !== 'undefined' && value instanceof Window) {
      return undefined;
    }

    if (typeof Node !== 'undefined' && value instanceof Node) {
      return undefined;
    }

    if (seen.has(value)) {
      return undefined;
    }

    seen.add(value);
    return value;
  };
};

/**
 * 函数：安全克隆图数据。
 * @param {unknown} flowData 原始图数据。
 * @returns {unknown} 可安全恢复的图数据副本。
 */
const cloneFlowDataSafely = (flowData: unknown): unknown => {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(flowData);
    } catch {
      // 回退到 JSON 语义净化，兼容代理对象与不可克隆引用。
    }
  }

  try {
    const snapshot = JSON.stringify(flowData, createFlowDataJsonReplacer());

    return typeof snapshot === 'string' ? (JSON.parse(snapshot) as unknown) : null;
  } catch {
    return null;
  }
};

/**
 * 函数：克隆并标准化函数流数据。
 * @param {unknown} flowData 原始图数据。
 * @returns {unknown} 规范化后的图数据。
 */
const normalizeFunctionFlowData = (flowData: unknown): unknown => {
  if (flowKind !== 'function' || !flowData || typeof flowData !== 'object') {
    return flowData;
  }

  /**
   * 常量：snapshot。
   */
  const snapshot = cloneFlowDataSafely(flowData);

  if (!snapshot || typeof snapshot !== 'object') {
    return snapshot;
  }

  /**
   * 常量：data。
   */
  const data = snapshot as TFlowDataLike;

  if (!Array.isArray(data.nodes) || data.nodes.length === 0) {
    return snapshot;
  }

  /**
   * 常量：nodeIdMap。
   */
  const nodeIdMap = new Map<string, string>([
    ['start', systemNodeMeta.startNodeId],
    ['end', systemNodeMeta.endNodeId]
  ]);

  data.nodes = data.nodes.map((node) => {
    const currentId = String(node.id ?? '').trim();
    const currentType = String(node.type ?? '').trim();
    const nextId = nodeIdMap.get(currentId) ?? currentId;

    if (currentId === nextId && currentType !== 'start' && currentType !== 'end') {
      return node;
    }

    const nextType = currentType === 'start' ? systemNodeMeta.startNodeType : currentType === 'end' ? systemNodeMeta.endNodeType : currentType;

    return {
      ...node,
      id: nextId,
      type: nextType
    };
  });

  if (Array.isArray(data.edges) && data.edges.length > 0) {
    data.edges = data.edges.map((edge) => {
      const nextSource = nodeIdMap.get(String(edge.source ?? '').trim()) ?? edge.source ?? null;
      const nextTarget = nodeIdMap.get(String(edge.target ?? '').trim()) ?? edge.target ?? null;

      if (nextSource === edge.source && nextTarget === edge.target) {
        return edge;
      }

      return {
        ...edge,
        source: nextSource,
        target: nextTarget
      };
    });
  }

  return snapshot;
};

/**
 * 函数：解析图数据输入。
 * @param {unknown} flowData 原始图数据。
 * @returns {unknown} 解析后的图数据。
 */
const parseFlowDataInput = (flowData: unknown): unknown => {
  if (typeof flowData !== 'string') {
    return flowData;
  }

  try {
    return JSON.parse(flowData) as unknown;
  } catch {
    return null;
  }
};

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
 * Hook：提示。
 */
const toast = useToast();

/**
 * 引用：编辑器根元素。
 */
const refEditorRoot = ref<HTMLElement | null>(null);

/**
 * Hook：Vue Flow 实例方法。
 */
const { nodes, edges, toObject, fromObject, fitView, zoomIn, zoomOut, addEdges, addNodes, applyNodeChanges, screenToFlowCoordinate } = useVueFlow();

/**
 * 常量：编辑器剪贴板状态键。
 */
const CRAWLERS_EDITOR_CLIPBOARD_STATE_KEY = 'crawlers-editor-node-clipboard';

/**
 * 常量：编辑器剪贴板文本前缀。
 */
const CRAWLERS_EDITOR_CLIPBOARD_TEXT_PREFIX = '__LOFITICK_CRAWLERS_EDITOR_CLIPBOARD__:';

/**
 * 常量：编辑器剪贴板版本。
 */
const CRAWLERS_EDITOR_CLIPBOARD_VERSION = 1;

/**
 * 常量：同面板连续粘贴偏移。
 */
const CRAWLERS_EDITOR_PASTE_OFFSET = 48;

/**
 * 常量：初始化最短加载时长（毫秒）。
 */
const EDITOR_INIT_MIN_LOADING_MS = 260;

/**
 * 状态：跨面板共享的编辑器剪贴板。
 */
const stateClipboard = useState<ICrawlersEditorClipboardData | null>(CRAWLERS_EDITOR_CLIPBOARD_STATE_KEY, () => null);

/**
 * 状态：上次粘贴签名。
 */
const stateLastPasteSignature = ref('');

/**
 * 状态：连续粘贴次数。
 */
const statePasteCount = ref(0);

/**
 * 状态：编辑器内最近一次鼠标客户端坐标。
 */
const stateLastPointerClientPosition = ref<XYPosition | null>(null);

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
  /**
   * 常量：siteNameText。
   */
  const siteNameText = String(siteName ?? '').trim();
  /**
   * 常量：baseUrlText。
   */
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
  /**
   * 常量：raw。
   */
  const raw = String(baseUrl ?? '').trim();

  if (raw === '') {
    return '';
  }

  /**
   * 常量：noProtocol。
   */
  const noProtocol = raw.replace(/^https?:\/\//i, '');
  /**
   * 常量：host。
   */
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
  const customDraftKey = String(draftStorageKey ?? '').trim();

  if (customDraftKey !== '') {
    return customDraftKey;
  }

  /**
   * 常量：domain。
   */
  const domain = computedNormalizedDomain.value;

  if (domain === '') {
    return '';
  }

  return `${DRAFT_ENTRY_PREFIX}${domain}`;
});

/**
 * 函数：等待下一帧，确保 Vue Flow 画布完成一次渲染批处理。
 * @returns {Promise<void>} Promise。
 */
const waitVueFlowFrame = async (): Promise<void> => {
  await nextTick();

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
};

/**
 * 函数：判断图数据是否包含节点。
 * @param {unknown} flowData 图数据。
 * @returns {boolean} 是否包含节点。
 */
const flowDataHasNodes = (flowData: unknown): boolean => {
  return Array.isArray((flowData as TFlowDataLike | null | undefined)?.nodes) && ((flowData as TFlowDataLike).nodes?.length ?? 0) > 0;
};

/**
 * 函数：恢复图数据，并在画布未就绪时自动重试一次。
 * @param {unknown} flowData 图数据。
 * @returns {Promise<boolean>} 是否恢复成功。
 */
const restoreFlowData = async (flowData: unknown): Promise<boolean> => {
  const normalized = normalizeFunctionFlowData(flowData) as Parameters<typeof fromObject>[0];
  const expectedNodes = flowDataHasNodes(normalized);

  if (!expectedNodes) {
    return false;
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (attempt > 0) {
        await waitVueFlowFrame();
      }

      await fromObject(normalized);
      await waitVueFlowFrame();

      if (!expectedNodes || nodes.value.length > 0) {
        return true;
      }
    } catch {
      if (attempt === 1) {
        return false;
      }
    }
  }

  return nodes.value.length > 0;
};

/**
 * 函数：确保默认系统节点已初始化。
 * @returns {Promise<boolean>} 是否成功生成默认节点。
 */
const ensureDefaultNodesInitialized = async (): Promise<boolean> => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (attempt > 0) {
      await waitVueFlowFrame();
    }

    initializeDefaultNodes();
    await waitVueFlowFrame();

    if (nodes.value.length > 0) {
      return true;
    }
  }

  return nodes.value.length > 0;
};

/**
 * 函数：恢复初始导出图。
 * @returns {Promise<boolean>} 是否已恢复。
 */
const restoreInitialFlowData = async (): Promise<boolean> => {
  const parsedInitialFlowData = parseFlowDataInput(initialFlowData);

  if (!parsedInitialFlowData || typeof parsedInitialFlowData !== 'object') {
    return false;
  }

  return restoreFlowData(parsedInitialFlowData);
};

/**
 * 函数：判断事件目标是否为可编辑元素。
 * @param {EventTarget | null} target 事件目标。
 * @returns {boolean} 是否为可编辑元素。
 */
const isEditableEventTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();

  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

/**
 * 函数：判断事件目标是否应保留自身焦点。
 * @param {EventTarget | null} target 事件目标。
 * @returns {boolean} 是否应保留自身焦点。
 */
const shouldKeepTargetFocus = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (isEditableEventTarget(target)) {
    return true;
  }

  return target.closest('button, a[href], [role="button"], [tabindex]:not([tabindex="-1"])') !== null;
};

/**
 * 函数：生成复制粘贴节点唯一 ID。
 * @returns {string} 唯一节点 ID。
 */
const createClipboardNodeId = (): string => {
  const randomPart = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  return `copynode_${randomPart}`;
};

/**
 * 函数：生成复制粘贴边唯一 ID。
 * @returns {string} 唯一边 ID。
 */
const createClipboardEdgeId = (): string => {
  const randomPart = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  return `copyedge_${randomPart}`;
};

/**
 * 函数：获取节点宽度。
 * @param {Node} node 节点。
 * @returns {number} 节点宽度。
 */
const getNodeWidth = (node: Node): number => Number((node as Node & { dimensions?: { width?: number } }).dimensions?.width ?? node.width ?? 0);

/**
 * 函数：获取节点高度。
 * @param {Node} node 节点。
 * @returns {number} 节点高度。
 */
const getNodeHeight = (node: Node): number => Number((node as Node & { dimensions?: { height?: number } }).dimensions?.height ?? node.height ?? 0);

/**
 * 函数：根据节点集合计算边界盒。
 * @param {Node[]} selectionNodes 选中节点集合。
 * @returns {ICrawlersEditorClipboardBounds | null} 边界盒。
 */
const getSelectionBounds = (selectionNodes: Node[]): ICrawlersEditorClipboardBounds | null => {
  if (selectionNodes.length === 0) {
    return null;
  }

  const [firstNode, ...restNodes] = selectionNodes;

  if (!firstNode) {
    return null;
  }

  const firstLeft = Number(firstNode.position.x ?? 0);
  const firstTop = Number(firstNode.position.y ?? 0);
  const firstRight = firstLeft + getNodeWidth(firstNode);
  const firstBottom = firstTop + getNodeHeight(firstNode);

  const reduced = restNodes.reduce(
    (result, node) => {
      const left = Number(node.position.x ?? 0);
      const top = Number(node.position.y ?? 0);
      const right = left + getNodeWidth(node);
      const bottom = top + getNodeHeight(node);

      return {
        left: Math.min(result.left, left),
        top: Math.min(result.top, top),
        right: Math.max(result.right, right),
        bottom: Math.max(result.bottom, bottom)
      };
    },
    {
      left: firstLeft,
      top: firstTop,
      right: firstRight,
      bottom: firstBottom
    }
  );

  return {
    left: reduced.left,
    top: reduced.top,
    width: reduced.right - reduced.left,
    height: reduced.bottom - reduced.top
  };
};

/**
 * 函数：清洗复制节点，移除运行态字段。
 * @param {Node} node 原始节点。
 * @returns {Node} 可复制节点。
 */
const createClipboardNode = (node: Node): Node => {
  const nextNode = {
    ...node,
    position: {
      x: Number(node.position.x ?? 0),
      y: Number(node.position.y ?? 0)
    },
    selected: false,
    dragging: false
  } as Node & {
    positionAbsolute?: unknown;
    dimensions?: unknown;
    measured?: unknown;
    resizing?: unknown;
    events?: unknown;
  };

  delete nextNode.positionAbsolute;
  delete nextNode.dimensions;
  delete nextNode.measured;
  delete nextNode.resizing;
  delete nextNode.events;

  return nextNode;
};

/**
 * 函数：清洗复制边，移除运行态选中状态。
 * @param {Edge} edge 原始边。
 * @returns {Edge} 可复制边。
 */
const createClipboardEdge = (edge: Edge): Edge => {
  return { ...edge, selected: false } as unknown as Edge;
};

/**
 * 函数：构建当前选中节点的剪贴板数据。
 * @returns {ICrawlersEditorClipboardData | null} 剪贴板数据。
 */
const createClipboardDataFromSelection = (): ICrawlersEditorClipboardData | null => {
  const selectedNodes = nodes.value.filter((node) => node.selected && node.type !== systemNodeMeta.startNodeType && node.type !== systemNodeMeta.endNodeType && node.id !== systemNodeMeta.startNodeId && node.id !== systemNodeMeta.endNodeId);

  if (selectedNodes.length === 0) {
    return null;
  }

  const bounds = getSelectionBounds(selectedNodes);

  if (!bounds) {
    return null;
  }

  const selectedNodeIds = new Set(selectedNodes.map((node) => String(node.id ?? '')));
  const selectedEdges = edges.value.filter((edge) => selectedNodeIds.has(String(edge.source ?? '')) && selectedNodeIds.has(String(edge.target ?? '')));

  return {
    version: CRAWLERS_EDITOR_CLIPBOARD_VERSION,
    sourceDraftKey: computedDraftKey.value,
    copiedAt: Date.now(),
    nodes: selectedNodes.map((node) => createClipboardNode(node)),
    edges: selectedEdges.map((edge) => createClipboardEdge(edge)),
    bounds
  };
};

/**
 * 函数：序列化剪贴板数据为文本。
 * @param {ICrawlersEditorClipboardData} data 剪贴板数据。
 * @returns {string} 序列化文本。
 */
const serializeClipboardText = (data: ICrawlersEditorClipboardData): string => `${CRAWLERS_EDITOR_CLIPBOARD_TEXT_PREFIX}${JSON.stringify(data)}`;

/**
 * 函数：解析剪贴板文本。
 * @param {string} text 剪贴板文本。
 * @returns {ICrawlersEditorClipboardData | null} 解析结果。
 */
const parseClipboardText = (text: string): ICrawlersEditorClipboardData | null => {
  const normalized = String(text ?? '').trim();

  if (!normalized.startsWith(CRAWLERS_EDITOR_CLIPBOARD_TEXT_PREFIX)) {
    return null;
  }

  try {
    const parsed = JSON.parse(normalized.slice(CRAWLERS_EDITOR_CLIPBOARD_TEXT_PREFIX.length)) as ICrawlersEditorClipboardData;

    if (parsed?.version !== CRAWLERS_EDITOR_CLIPBOARD_VERSION || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges) || !parsed.bounds) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

/**
 * 函数：写入编辑器剪贴板。
 * @param {ICrawlersEditorClipboardData} data 剪贴板数据。
 * @returns {Promise<void>} 无返回值。
 */
const writeEditorClipboard = async (data: ICrawlersEditorClipboardData): Promise<void> => {
  stateClipboard.value = data;

  if (!import.meta.client || !navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
    return;
  }

  try {
    await navigator.clipboard.writeText(serializeClipboardText(data));
  } catch {
    return;
  }
};

/**
 * 函数：读取编辑器剪贴板。
 * @returns {Promise<ICrawlersEditorClipboardData | null>} 剪贴板数据。
 */
const readEditorClipboard = async (): Promise<ICrawlersEditorClipboardData | null> => {
  if (stateClipboard.value) {
    return stateClipboard.value;
  }

  if (!import.meta.client || !navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
    return null;
  }

  try {
    const parsed = parseClipboardText(await navigator.clipboard.readText());

    if (parsed) {
      stateClipboard.value = parsed;
    }

    return parsed;
  } catch {
    return null;
  }
};

/**
 * 函数：获取当前视口中心对应的流程坐标。
 * @returns {XYPosition} 视口中心坐标。
 */
const getViewportCenterFlowPosition = (): XYPosition => {
  const rect = refEditorRoot.value?.getBoundingClientRect();

  if (!rect) {
    return { x: 0, y: 0 };
  }

  return screenToFlowCoordinate({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  });
};

/**
 * 函数：获取编辑器内最近一次鼠标对应的流程坐标。
 * @returns {XYPosition | null} 鼠标流程坐标。
 */
const getLastPointerFlowPosition = (): XYPosition | null => {
  const rect = refEditorRoot.value?.getBoundingClientRect();
  const pointer = stateLastPointerClientPosition.value;

  if (!rect || !pointer) {
    return null;
  }

  if (pointer.x < rect.left || pointer.x > rect.right || pointer.y < rect.top || pointer.y > rect.bottom) {
    return null;
  }

  return screenToFlowCoordinate({
    x: pointer.x,
    y: pointer.y
  });
};

/**
 * 函数：计算两个边界盒的重叠面积。
 * @param {ICrawlersEditorClipboardBounds} a 边界盒 A。
 * @param {ICrawlersEditorClipboardBounds} b 边界盒 B。
 * @returns {number} 重叠面积。
 */
const getBoundsOverlapArea = (a: ICrawlersEditorClipboardBounds, b: ICrawlersEditorClipboardBounds): number => {
  const overlapWidth = Math.max(0, Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left));
  const overlapHeight = Math.max(0, Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top));

  return overlapWidth * overlapHeight;
};

/**
 * 函数：获取指定原点下的粘贴边界盒。
 * @param {ICrawlersEditorClipboardBounds} bounds 原始边界盒。
 * @param {XYPosition} origin 粘贴原点。
 * @returns {ICrawlersEditorClipboardBounds} 新边界盒。
 */
const createShiftedBounds = (bounds: ICrawlersEditorClipboardBounds, origin: XYPosition): ICrawlersEditorClipboardBounds => {
  return {
    left: origin.x,
    top: origin.y,
    width: bounds.width,
    height: bounds.height
  };
};

/**
 * 函数：为粘贴内容选择尽量不重叠的原点。
 * @param {ICrawlersEditorClipboardBounds} bounds 原始边界盒。
 * @param {XYPosition} preferredOrigin 首选原点。
 * @returns {XYPosition} 实际原点。
 */
const resolvePasteOrigin = (bounds: ICrawlersEditorClipboardBounds, preferredOrigin: XYPosition): XYPosition => {
  const existingBounds = nodes.value
    .filter((node) => node.id !== systemNodeMeta.startNodeId && node.id !== systemNodeMeta.endNodeId && node.type !== systemNodeMeta.startNodeType && node.type !== systemNodeMeta.endNodeType)
    .map(
      (node) =>
        ({
          left: Number(node.position.x ?? 0),
          top: Number(node.position.y ?? 0),
          width: getNodeWidth(node),
          height: getNodeHeight(node)
        }) satisfies ICrawlersEditorClipboardBounds
    )
    .filter((nodeBounds) => nodeBounds.width > 0 && nodeBounds.height > 0);

  if (existingBounds.length === 0) {
    return preferredOrigin;
  }

  const candidateOffsets: XYPosition[] = [
    { x: 0, y: 0 },
    { x: CRAWLERS_EDITOR_PASTE_OFFSET, y: 0 },
    { x: 0, y: CRAWLERS_EDITOR_PASTE_OFFSET },
    { x: CRAWLERS_EDITOR_PASTE_OFFSET, y: CRAWLERS_EDITOR_PASTE_OFFSET },
    { x: CRAWLERS_EDITOR_PASTE_OFFSET * 2, y: 0 },
    { x: 0, y: CRAWLERS_EDITOR_PASTE_OFFSET * 2 },
    { x: CRAWLERS_EDITOR_PASTE_OFFSET * 2, y: CRAWLERS_EDITOR_PASTE_OFFSET * 2 },
    { x: -CRAWLERS_EDITOR_PASTE_OFFSET, y: 0 },
    { x: 0, y: -CRAWLERS_EDITOR_PASTE_OFFSET },
    { x: -CRAWLERS_EDITOR_PASTE_OFFSET, y: -CRAWLERS_EDITOR_PASTE_OFFSET },
    { x: CRAWLERS_EDITOR_PASTE_OFFSET * 3, y: CRAWLERS_EDITOR_PASTE_OFFSET },
    { x: CRAWLERS_EDITOR_PASTE_OFFSET, y: CRAWLERS_EDITOR_PASTE_OFFSET * 3 }
  ];

  let bestOrigin = preferredOrigin;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const offset of candidateOffsets) {
    const nextOrigin = {
      x: preferredOrigin.x + offset.x,
      y: preferredOrigin.y + offset.y
    } satisfies XYPosition;
    const nextBounds = createShiftedBounds(bounds, nextOrigin);
    const overlapScore = existingBounds.reduce((sum, existing) => sum + getBoundsOverlapArea(nextBounds, existing), 0);

    if (overlapScore === 0) {
      return nextOrigin;
    }

    if (overlapScore < bestScore) {
      bestScore = overlapScore;
      bestOrigin = nextOrigin;
    }
  }

  return bestOrigin;
};

/**
 * 函数：复制当前选中节点。
 * @returns {Promise<void>} 无返回值。
 */
const handleSelectionCopy = async (): Promise<void> => {
  const clipboardData = createClipboardDataFromSelection();

  if (!clipboardData) {
    return;
  }

  await writeEditorClipboard(clipboardData);
};

/**
 * 函数：将剪贴板数据粘贴到当前画布。
 * @param {ICrawlersEditorClipboardData} clipboardData 剪贴板数据。
 * @returns {void} 无返回值。
 */
const pasteClipboardData = (clipboardData: ICrawlersEditorClipboardData): void => {
  if (clipboardData.nodes.length === 0) {
    return;
  }

  const clipboardSignature = JSON.stringify({
    sourceDraftKey: clipboardData.sourceDraftKey,
    copiedAt: clipboardData.copiedAt,
    nodeCount: clipboardData.nodes.length,
    edgeCount: clipboardData.edges.length
  });
  const isSamePayload = stateLastPasteSignature.value === clipboardSignature;

  statePasteCount.value = isSamePayload ? statePasteCount.value + 1 : 1;
  stateLastPasteSignature.value = clipboardSignature;

  const pointerFlowPosition = getLastPointerFlowPosition();
  const fallbackCenterPosition = getViewportCenterFlowPosition();
  const preferredOrigin = pointerFlowPosition
    ? {
        x: pointerFlowPosition.x,
        y: pointerFlowPosition.y
      }
    : {
        x: fallbackCenterPosition.x - clipboardData.bounds.width / 2,
        y: fallbackCenterPosition.y - clipboardData.bounds.height / 2
      };
  const samePanelBaseOrigin =
    clipboardData.sourceDraftKey === computedDraftKey.value && !pointerFlowPosition
      ? {
          x: preferredOrigin.x + CRAWLERS_EDITOR_PASTE_OFFSET * statePasteCount.value,
          y: preferredOrigin.y + CRAWLERS_EDITOR_PASTE_OFFSET * statePasteCount.value
        }
      : preferredOrigin;
  const resolvedOrigin = resolvePasteOrigin(clipboardData.bounds, samePanelBaseOrigin);
  const offsetX = resolvedOrigin.x - clipboardData.bounds.left;
  const offsetY = resolvedOrigin.y - clipboardData.bounds.top;

  const nodeIdMap = new Map<string, string>();
  const pastedNodes = clipboardData.nodes.map((node) => {
    const nextId = createClipboardNodeId();
    nodeIdMap.set(String(node.id ?? ''), nextId);

    return {
      ...node,
      id: nextId,
      selected: true,
      dragging: false,
      position: {
        x: Number(node.position.x ?? 0) + offsetX,
        y: Number(node.position.y ?? 0) + offsetY
      }
    } as Node;
  });

  const pastedEdges = clipboardData.edges
    .map((edge) => {
      const nextSource = nodeIdMap.get(String(edge.source ?? ''));
      const nextTarget = nodeIdMap.get(String(edge.target ?? ''));

      if (!nextSource || !nextTarget) {
        return undefined;
      }

      return {
        ...edge,
        id: createClipboardEdgeId(),
        source: nextSource,
        target: nextTarget,
        selected: false
      } as unknown as Edge;
    })
    .filter((edge): edge is Edge => Boolean(edge));

  const deselectNodeChanges = nodes.value
    .filter((node) => node.selected)
    .map((node) => ({
      id: String(node.id ?? ''),
      type: 'select' as const,
      selected: false
    }));

  if (deselectNodeChanges.length > 0) {
    nodes.value = applyNodeChanges(deselectNodeChanges);
  }

  addNodes(pastedNodes);

  for (const edge of pastedEdges) {
    addEdges(edge);
  }

  const selectPastedNodeChanges = pastedNodes.map((node) => ({
    id: String(node.id ?? ''),
    type: 'select' as const,
    selected: true
  }));

  if (selectPastedNodeChanges.length > 0) {
    nodes.value = applyNodeChanges(selectPastedNodeChanges);
  }
};

/**
 * 函数：读取并粘贴当前剪贴板。
 * @returns {Promise<void>} 无返回值。
 */
const handleClipboardPaste = async (): Promise<void> => {
  const clipboardData = await readEditorClipboard();

  if (!clipboardData) {
    return;
  }

  pasteClipboardData(clipboardData);
};

/**
 * 函数：处理编辑器根区域按下，确保快捷键有焦点承载。
 * @param {PointerEvent} event 指针事件。
 * @returns {void} 无返回值。
 */
const handleEditorPointerDown = (event: PointerEvent): void => {
  stateLastPointerClientPosition.value = {
    x: event.clientX,
    y: event.clientY
  };

  if (shouldKeepTargetFocus(event.target)) {
    return;
  }

  refEditorRoot.value?.focus({ preventScroll: true });
};

/**
 * 函数：记录编辑器内最近一次鼠标位置。
 * @param {PointerEvent} event 指针事件。
 * @returns {void} 无返回值。
 */
const handleEditorPointerMove = (event: PointerEvent): void => {
  stateLastPointerClientPosition.value = {
    x: event.clientX,
    y: event.clientY
  };
};

/**
 * 函数：鼠标离开编辑器时清理缓存位置。
 * @returns {void} 无返回值。
 */
const handleEditorPointerLeave = (): void => {
  stateLastPointerClientPosition.value = null;
};

/**
 * 函数：处理编辑器快捷键。
 * @param {KeyboardEvent} event 键盘事件。
 * @returns {void} 无返回值。
 */
const handleEditorKeydown = (event: KeyboardEvent): void => {
  if (event.defaultPrevented) {
    return;
  }

  if (!(event.ctrlKey || event.metaKey) || event.altKey || isEditableEventTarget(event.target)) {
    return;
  }

  const key = String(event.key ?? '').toLowerCase();

  if (key === 'z') {
    event.preventDefault();

    if (event.shiftKey) {
      handleRedo();
      return;
    }

    handleUndo();
    return;
  }

  if (key === 'y') {
    event.preventDefault();
    handleRedo();
    return;
  }

  if (key === 'c') {
    event.preventDefault();
    void handleSelectionCopy();
    return;
  }

  if (key === 'v') {
    event.preventDefault();
    void handleClipboardPaste();
  }
};

/**
 * 函数：同步开始节点域名到节点数据。
 * @returns {void} 无返回值。
 */
const syncStartNodeDomain = (): void => {
  if (flowKind === 'function') {
    return;
  }

  /**
   * 常量：domain。
   */
  const domain = computedNormalizedDomain.value;
  /**
   * 常量：startNode。
   */
  const startNode = nodes.value.find((node) => node.id === systemNodeMeta.startNodeId);

  if (!startNode) {
    return;
  }

  /**
   * 常量：currentDomain。
   */
  const currentDomain = String((startNode.data as { domain?: string } | undefined)?.domain ?? '');
  if (currentDomain === domain) {
    return;
  }

  nodes.value = nodes.value.map((node) => {
    if (node.id !== systemNodeMeta.startNodeId) {
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
 * 函数：同步函数开始与返回节点的元信息。
 * @returns {void} 无返回值。
 */
const syncFunctionNodeMeta = (): void => {
  if (flowKind !== 'function') {
    return;
  }

  /**
   * 常量：functionName。
   */
  const functionName = String(siteName ?? '').trim();
  /**
   * 常量：functionDescription。
   */
  const functionDescriptionText = String(flowDescription ?? '').trim();

  if (functionName === '' && functionDescriptionText === '') {
    return;
  }

  nodes.value = nodes.value.map((node) => {
    if (node.type !== systemNodeMeta.startNodeType && node.type !== systemNodeMeta.endNodeType) {
      return node;
    }

    /**
     * 常量：currentData。
     */
    const currentData = (node.data as Record<string, unknown> | undefined) ?? {};
    /**
     * 常量：nextData。
     */
    const nextData = { ...currentData };
    /**
     * 状态：stateChanged。
     */
    let stateChanged = false;

    if (node.type === systemNodeMeta.startNodeType) {
      if (String(nextData.functionName ?? '') !== functionName) {
        nextData.functionName = functionName;
        stateChanged = true;
      }

      if (String(nextData.functionDescription ?? '') !== functionDescriptionText) {
        nextData.functionDescription = functionDescriptionText;
        stateChanged = true;
      }
    }

    if (node.type === systemNodeMeta.endNodeType) {
      if (String(nextData.functionName ?? '') !== functionName) {
        nextData.functionName = functionName;
        stateChanged = true;
      }

      if (String(nextData.functionDescription ?? '') !== functionDescriptionText) {
        nextData.functionDescription = functionDescriptionText;
        stateChanged = true;
      }
    }

    if (!stateChanged) {
      return node;
    }

    return {
      ...node,
      data: nextData
    };
  });
};

/**
 * Hook：编辑器画布交互逻辑。
 */
const { initializeDefaultNodes, handleNodesChange, handleConnectStart, handleConnect, handleConnectEnd, isValidConnection } = useCrawlersEditorLogic({
  flowKind,
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
 * 状态：编辑器初始化加载中。
 */
const stateEditorInitializing = ref<boolean>(true);

/**
 * 状态：窗口级快捷键解绑函数。
 */
let offEditorWindowKeydown: null | (() => void) = null;

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
 * 函数：生成撤销历史快照。
 * @returns {string} 仅包含节点与边的历史快照。
 */
const createHistorySnapshot = (): string => {
  /**
   * 常量：snapshot。
   */
  const snapshot = toObject() as unknown as Record<string, unknown>;
  const { viewport, position, zoom, ...rest } = snapshot;

  void viewport;
  void position;
  void zoom;

  return JSON.stringify(rest);
};

/**
 * 函数：同步历史快照。
 * @returns {void} 无返回值。
 */
const pushHistorySnapshot = (): void => {
  /**
   * 常量：snapshot。
   */
  const snapshot = createHistorySnapshot();
  /**
   * 常量：current。
   */
  const current = stateHistory.value[stateHistoryIndex.value] ?? '';

  if (current === snapshot) {
    return;
  }

  stateHistory.value = stateHistory.value.slice(0, stateHistoryIndex.value + 1);
  stateHistory.value.push(snapshot);
  stateHistoryIndex.value = stateHistory.value.length - 1;
};

/**
 * 函数：在撤销前刷新待入栈快照，避免因防抖延迟导致当前改动尚未进入历史。
 * @returns {void} 无返回值。
 */
const flushPendingHistorySnapshot = (): void => {
  if (stateRestoringSnapshot.value || stateInitializingDefault.value || stateHistory.value.length === 0) {
    return;
  }

  pushHistorySnapshotDebounced.cancel();
  pushHistorySnapshot();
};

/**
 * 函数：恢复历史快照。
 * @param {number} index 快照索引。
 * @returns {void} 无返回值。
 */
const restoreSnapshot = async (index: number): Promise<void> => {
  /**
   * 常量：snapshot。
   */
  const snapshot = stateHistory.value[index];

  if (!snapshot) {
    return;
  }

  stateRestoringSnapshot.value = true;
  try {
    await restoreFlowData(JSON.parse(snapshot));
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
  flushPendingHistorySnapshot();

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
  pushHistorySnapshotDebounced.cancel();

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

  /**
   * 常量：now。
   */
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    /**
     * 常量：key。
     */
    const key = localStorage.key(i);
    if (!key?.startsWith(DRAFT_ENTRY_PREFIX)) {
      continue;
    }

    try {
      /**
       * 常量：raw。
       */
      const raw = localStorage.getItem(key);
      if (!raw) {
        keysToDelete.push(key);
        continue;
      }

      /**
       * 常量：entry。
       */
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

  /**
   * 常量：key。
   */
  const key = computedDraftKey.value;
  if (key === '') {
    return false;
  }

  /**
   * 常量：raw。
   */
  const raw = localStorage.getItem(key);
  if (!raw) {
    return false;
  }

  try {
    /**
     * 常量：entry。
     */
    const entry = JSON.parse(raw) as { ts?: number; data?: string };

    // 无时间戳或已过期，清除
    if (!entry.ts || Date.now() - entry.ts > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(key);
      return false;
    }

    /**
     * 常量：data。
     */
    const data = entry.data;
    if (!data) {
      localStorage.removeItem(key);
      return false;
    }

    const restored = await restoreFlowData(JSON.parse(data));

    if (!restored) {
      localStorage.removeItem(key);
      return false;
    }

    // 恢复后若节点为空，视为无效草稿，回退默认初始化流程。
    if (nodes.value.length === 0) {
      localStorage.removeItem(key);
      return false;
    }

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

  /**
   * 常量：key。
   */
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

  /**
   * 常量：key。
   */
  const key = computedDraftKey.value;
  if (key === '') {
    return true;
  }

  try {
    /**
     * 常量：snapshot。
     */
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
  /**
   * 常量：success。
   */
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
  const loadingStartedAt = Date.now();

  try {
    clearExpiredDrafts();

    /**
     * 状态：初始数据来源。
     */
    let stateInitialLoadSource: 'server' | 'draft' | 'default' = 'default';

    if (!stateDraftRestored.value) {
      stateDraftRestored.value = true;
      if (flowKind === 'function') {
        const restoredInitialFlow = await restoreInitialFlowData();

        if (restoredInitialFlow) {
          stateInitialLoadSource = 'server';
          syncStartNodeDomain();
          syncFunctionNodeMeta();
          stateLastDraftSnapshot.value = createSnapshot();

          if (saveDraft()) {
            stateLastDraftSnapshot.value = createSnapshot();
          }
        } else {
          const restored = await restoreDraft();

          if (restored) {
            stateInitialLoadSource = 'draft';
            syncStartNodeDomain();
            syncFunctionNodeMeta();
          } else {
            stateInitialLoadSource = 'default';
            stateInitializingDefault.value = true;
            await ensureDefaultNodesInitialized();
            syncStartNodeDomain();
            syncFunctionNodeMeta();
            stateInitializingDefault.value = false;
          }
        }
      } else {
        const restoredInitialFlow = await restoreInitialFlowData();

        if (restoredInitialFlow) {
          stateInitialLoadSource = 'server';
          syncStartNodeDomain();
          syncFunctionNodeMeta();
        } else {
          /**
           * 常量：restored。
           */
          const restored = await restoreDraft();

          if (restored) {
            stateInitialLoadSource = 'draft';
            syncStartNodeDomain();
            syncFunctionNodeMeta();
          } else {
            stateInitialLoadSource = 'default';
            stateInitializingDefault.value = true;
            await ensureDefaultNodesInitialized();
            syncStartNodeDomain();
            syncFunctionNodeMeta();
            stateInitializingDefault.value = false;
          }
        }
      }
    }

    const sourceHint = stateInitialLoadSource;

    if (sourceHint === 'server' || sourceHint === 'draft') {
      toast.add({
        title: t('pages.crawlers.editor.loadSource.title'),
        description: t(`pages.crawlers.editor.loadSource.${sourceHint}`),
        color: 'success',
        icon: sourceHint === 'server' ? 'i-lucide:cloud-check' : 'i-lucide:hard-drive-download',
        duration: 2600
      });
    }

    console.info('[crawler:editor:init]', {
      flowKind,
      sourceHint,
      draftKey: computedDraftKey.value,
      nodes: nodes.value.length,
      edges: edges.value.length
    });

    stateLastDraftSnapshot.value = createSnapshot();
  } catch (error) {
    console.error('[crawler:editor:init-failed]', {
      flowKind,
      draftKey: computedDraftKey.value,
      error
    });
  } finally {
    const loadingElapsed = Date.now() - loadingStartedAt;

    if (loadingElapsed < EDITOR_INIT_MIN_LOADING_MS) {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), EDITOR_INIT_MIN_LOADING_MS - loadingElapsed);
      });
    }

    stateInitializingDefault.value = false;
    stateEditorInitializing.value = false;
  }

  /**
   * 延迟调用 fitView，确保 DOM 和节点尺寸完全渲染后再适应视图。
   *
   * 这解决了在 modal/slideover 打开时节点被意外放大的问题：
   * fit-view-on-init 会在 VueFlow 初始化时立即触发，但若此时 DOM 还未完全渲染（例如抽屉正在动画），
   * fitView 计算的节点边界会不准确。延迟 150ms 调用可让 DOM 完全就位。
   */
  setTimeout(() => {
    void fitView({ padding: 0.15, duration: 300 });
  }, 150);

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

  const handleWindowKeydown = (event: KeyboardEvent): void => {
    if (!refEditorRoot.value) {
      return;
    }

    const target = event.target;

    if (target instanceof Node && !refEditorRoot.value.contains(target)) {
      return;
    }

    handleEditorKeydown(event);
  };

  window.addEventListener('keydown', handleWindowKeydown, { capture: true });
  offEditorWindowKeydown = () => {
    window.removeEventListener('keydown', handleWindowKeydown, { capture: true });
  };
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
  () => nodes.value.some((node) => node.id === systemNodeMeta.startNodeId),
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
const handelModalSave = async () => {
  console.info('[crawler:editor:save-click]', {
    flowKind,
    draftKey: computedDraftKey.value,
    nodes: nodes.value.length,
    edges: edges.value.length
  });

  await nextTick();

  // Vue Flow 的 updateNodeData 存在批处理，这里等一帧确保节点数据已落到快照。
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  /**
   * 常量：flowData。
   */
  const flowData = toObject();

  console.info('[crawler:editor:save-emit]', {
    flowKind,
    draftKey: computedDraftKey.value,
    nodeCount: Array.isArray(flowData.nodes) ? flowData.nodes.length : 0,
    edgeCount: Array.isArray(flowData.edges) ? flowData.edges.length : 0
  });

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
 * 函数：处理侧栏创建函数事件。
 * @param {'site' | 'global'} scope 作用域。
 * @returns {void} 无返回值。
 */
const handleSidebarCreateFunction = (scope: 'site' | 'global'): void => {
  emit('createFunction', scope);
};

/**
 * 函数：处理侧栏编辑函数逻辑事件。
 * @param {ICrawlersEditorSidebarFunctionRow} row 函数行。
 * @returns {void} 无返回值。
 */
const handleSidebarEditFunctionLogic = (row: ICrawlersEditorSidebarFunctionRow): void => {
  emit('editFunctionLogic', row);
};

/**
 * 函数：转发侧栏函数变更事件。
 * @returns {void} 无返回值。
 */
const handleSidebarFunctionsChanged = (): void => {
  emit('functionsChanged');
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
  offEditorWindowKeydown?.();
  offEditorWindowKeydown = null;
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
  --vf-edge-exec: var(--ui-primary);
  --vf-edge-string: var(--color-fuchsia-500);
  --vf-edge-number: var(--color-teal-400);
  --vf-edge-boolean: var(--color-red-500);
  --vf-edge-array: var(--color-yellow-400);
  --vf-edge-object: var(--color-blue-500);
  --vf-edge-any: var(--color-gray-400);
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
        stroke: var(--vf-edge-any);
        stroke-width: 2;
      }

      &.crawlers-edge-exec .vue-flow__edge-path {
        stroke: var(--vf-edge-exec);
        stroke-width: 3.5;
      }

      &.crawlers-edge-string .vue-flow__edge-path {
        stroke: var(--vf-edge-string);
      }

      &.crawlers-edge-number .vue-flow__edge-path {
        stroke: var(--vf-edge-number);
      }

      &.crawlers-edge-boolean .vue-flow__edge-path {
        stroke: var(--vf-edge-boolean);
      }

      &.crawlers-edge-array .vue-flow__edge-path {
        stroke: var(--vf-edge-array);
      }

      &.crawlers-edge-object .vue-flow__edge-path {
        stroke: var(--vf-edge-object);
      }

      &.crawlers-edge-any .vue-flow__edge-path {
        stroke: var(--vf-edge-any);
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
        stroke-width: 3;
      }

      &.crawlers-edge-exec.selected .vue-flow__edge-path,
      &.crawlers-edge-exec:focus .vue-flow__edge-path,
      &.crawlers-edge-exec:focus-visible .vue-flow__edge-path {
        stroke-width: 4.5;
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

  :deep(.vue-flow__node button .iconify),
  :deep(.vue-flow__node button svg) {
    opacity: 0.72;
    transition: opacity 160ms ease;
  }

  :deep(.vue-flow__node button:hover .iconify),
  :deep(.vue-flow__node button:hover svg),
  :deep(.vue-flow__node button:focus-visible .iconify),
  :deep(.vue-flow__node button:focus-visible svg) {
    opacity: 0.9;
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
