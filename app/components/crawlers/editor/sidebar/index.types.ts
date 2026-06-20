import type { ICrawlersListGroup, ICrawlersListRow } from '@/components/crawlers/list/index.types';

/**
 * 类型：编辑器左侧栏标签页。
 */
export type TCrawlersEditorSidebarTab = 'nodes' | 'site-functions' | 'global-functions';

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

  /**
   * 属性：当前站点 ID。
   */
  targetId?: number;

  /**
   * 属性：函数列表刷新 nonce。
   */
  functionRefreshNonce?: number;
}

/**
 * 接口：编辑器左侧栏标签页配置。
 */
export interface ICrawlersEditorSidebarTabItem {
  /**
   * 属性：标签页值。
   */
  value: TCrawlersEditorSidebarTab;

  /**
   * 属性：标签页标题。
   */
  label: string;

  /**
   * 属性：标签页图标。
   */
  icon: string;
}

/**
 * 接口：编辑器左侧栏点击条目。
 */
export interface ICrawlersEditorSidebarClickRow {
  /**
   * 属性：条目 key。
   */
  key: string;

  /**
   * 属性：条目名称。
   */
  name: string;

  /**
   * 属性：条目描述。
   */
  description: string;

  /**
   * 属性：条目图标名称。
   */
  iconName: string;
}

/**
 * 接口：侧栏函数列表行。
 */
export interface ICrawlersEditorSidebarFunctionRow {
  /**
   * 属性：函数 ID。
   */
  id: number;

  /**
   * 属性：函数名称。
   */
  name: string;

  /**
   * 属性：函数作用域。
   */
  scope: 'site' | 'global';

  /**
   * 属性：站点 ID。
   */
  targetId: number;

  /**
   * 属性：函数描述。
   */
  description: string;

  /**
   * 属性：引用数量。
   */
  referenceCount: number;
}

/**
 * 接口：编辑器左侧栏事件。
 */
export interface ICrawlersEditorSidebarEmits {
  /**
   * 事件：点击列表项。
   * @param {ICrawlersEditorSidebarClickRow} row 条目数据。
   * @param {MouseEvent} event 鼠标事件。
   */
  click: [row: ICrawlersEditorSidebarClickRow, event: MouseEvent];

  /**
   * 事件：点击创建函数。
   * @param {'site' | 'global'} scope 函数作用域。
   */
  createFunction: [scope: 'site' | 'global'];
}
