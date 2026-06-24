import type { Edge, Node } from '@vue-flow/core';

import type { ICrawlersListGroup, ICrawlersListRow } from '@/components/crawlers/list/index.types';
import type { ICrawlersEditorSidebarFunctionRow } from '@/components/crawlers/editor/sidebar/index.types';
import type { TCrawlersEditorFlowKind } from '@/composables/hooks/useCrawlersEditorLogic/index.types';

/**
 * 接口：编辑器剪贴板边界盒。
 */
export interface ICrawlersEditorClipboardBounds {
  /**
   * 属性：左侧坐标。
   */
  left: number;

  /**
   * 属性：顶部坐标。
   */
  top: number;

  /**
   * 属性：宽度。
   */
  width: number;

  /**
   * 属性：高度。
   */
  height: number;
}

/**
 * 接口：编辑器节点剪贴板数据。
 */
export interface ICrawlersEditorClipboardData {
  /**
   * 属性：剪贴板版本。
   */
  version: number;

  /**
   * 属性：来源草稿键。
   */
  sourceDraftKey: string;

  /**
   * 属性：复制时间戳。
   */
  copiedAt: number;

  /**
   * 属性：复制节点集合。
   */
  nodes: Node[];

  /**
   * 属性：复制边集合。
   */
  edges: Edge[];

  /**
   * 属性：原始边界盒。
   */
  bounds: ICrawlersEditorClipboardBounds;
}

/**
 * 接口：编辑器保存载荷。
 */
export interface ICrawlersEditorSavePayload {
  /**
   * 属性：当前画布导出数据。
   */
  flowData: unknown;

  /**
   * 属性：当前草稿缓存键。
   */
  draftKey: string;
}

/**
 * 接口：爬虫编辑器属性。
 */
export interface ICrawlersEditorProps {
  /**
   * 属性：流类型。
   */
  flowKind?: TCrawlersEditorFlowKind;

  /**
   * 属性：站点展示名称。
   */
  siteName?: string;

  /**
   * 属性：基础 URL。
   */
  baseUrl?: string;

  /**
   * 属性：流描述。
   */
  flowDescription?: string;

  /**
   * 属性：站点 ID。
   */
  targetId?: number;

  /**
   * 属性：左侧栏分组数据。
   */
  groups?: ICrawlersListGroup[];

  /**
   * 属性：当前选中条目 key。
   */
  selectedKey?: string;

  /**
   * 属性：函数列表刷新 nonce。
   */
  functionRefreshNonce?: number;

  /**
   * 属性：函数图刷新 nonce。
   */
  functionGraphRefreshNonce?: number;

  /**
   * 属性：初始导出图。
   */
  initialFlowData?: unknown;

  /**
   * 属性：初始数据来源提示。
   */
  initialLoadSource?: 'server' | 'draft' | 'default';

  /**
   * 属性：草稿缓存键。
   */
  draftStorageKey?: string;

  /**
   * 属性：执行按钮是否加载中。
   */
  executeLoading?: boolean;
}

/**
 * 接口：爬虫编辑器事件。
 */
export interface ICrawlersEditorEmits {
  /**
   * 事件：保存。
   */
  save: [payload: ICrawlersEditorSavePayload];

  /**
   * 事件：执行。
   */
  execute: [payload: IPageCrawlerBlueprintEditorExecutePayload];

  /**
   * 事件：取消。
   */
  cancel: [];

  /**
   * 事件：点击左侧列表条目。
   * @param {ICrawlersListRow} row 条目。
   * @param {MouseEvent} event 鼠标事件。
   */
  click: [row: ICrawlersListRow, event: MouseEvent];

  /**
   * 事件：创建函数。
   * @param {'site' | 'global'} scope 作用域。
   */
  createFunction: [scope: 'site' | 'global'];

  /**
   * 事件：编辑函数逻辑。
   * @param {ICrawlersEditorSidebarFunctionRow} row 函数行。
   */
  editFunctionLogic: [row: ICrawlersEditorSidebarFunctionRow];

  /**
   * 事件：函数元数据变更。
   */
  functionsChanged: [];
}
