/**
 * 接口：爬虫列表项属性。
 */
export interface ICrawlersListItemProps {
  /**
   * 属性：列表项标题。
   */
  label: string;

  /**
   * 属性：卡片说明。
   */
  description: string;

  /**
   * 属性：是否选中。
   */
  selected?: boolean;

  /**
   * 属性：是否禁用。
   */
  disabled?: boolean;

  /**
   * 属性：图标名称。
   */
  iconName?: string;

  /**
   * 属性：是否选中。
   */
  selected?: boolean;

  /**
   * 属性：是否禁用。
   */
  disabled?: boolean;
}

/**
 * 接口：爬虫列表项事件。
 */
export interface ICrawlersListItemEmits {
  /**
   * 事件：点击。
   * @param {MouseEvent} event 鼠标事件。
   */
  click: [event: MouseEvent];
}
