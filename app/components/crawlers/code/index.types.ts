import type { ICrawlersEditorSavePayload } from '@/components/crawlers/editor/index.types';
import type { ICrawlersListGroup, ICrawlersListRow } from '@/components/crawlers/list/index.types';

/**
 * 接口：爬虫蓝图抽屉属性。
 */
export interface ICrawlersCodeProps {
  /**
   * 属性：站点名称。
   */
  siteName?: string;

  /**
   * 属性：基础 URL。
   */
  baseUrl?: string;

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
}

/**
 * 接口：爬虫蓝图抽屉事件。
 */
export interface ICrawlersCodeEmits {
  /**
   * 事件：保存。
   */
  save: [payload: ICrawlersEditorSavePayload];

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
}
