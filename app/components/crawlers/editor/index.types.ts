import type { ICrawlersListGroup, ICrawlersListRow } from '@/components/crawlers/list/index.types';

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
   * 属性：站点展示名称。
   */
  siteName?: string;

  /**
   * 属性：基础 URL。
   */
  baseUrl?: string;

  /**
   * 属性：左侧栏分组数据。
   */
  groups?: ICrawlersListGroup[];

  /**
   * 属性：当前选中条目 key。
   */
  selectedKey?: string;
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
   * 事件：取消。
   */
  cancel: [];

  /**
   * 事件：点击左侧列表条目。
   * @param {ICrawlersListRow} row 条目。
   * @param {MouseEvent} event 鼠标事件。
   */
  click: [row: ICrawlersListRow, event: MouseEvent];
}
