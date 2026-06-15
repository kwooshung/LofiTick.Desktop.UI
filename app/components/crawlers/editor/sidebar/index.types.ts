import type { ICrawlersListGroup, ICrawlersListRow } from '@/components/crawlers/list/index.types';

/**
 * 接口：编辑器左侧栏属性。
 */
export interface ICrawlersEditorSidebarProps {
  /**
   * 属性：分组列表。
   */
  groups: ICrawlersListGroup[];

  /**
   * 属性：当前选中 key。
   */
  selectedKey: string;
}

/**
 * 接口：编辑器左侧栏事件。
 */
export interface ICrawlersEditorSidebarEmits {
  /**
   * 事件：点击列表项。
   * @param {ICrawlersListRow} row 条目数据。
   * @param {MouseEvent} event 鼠标事件。
   */
  click: [row: ICrawlersListRow, event: MouseEvent];
}
