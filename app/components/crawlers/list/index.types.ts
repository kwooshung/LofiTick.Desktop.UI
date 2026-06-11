/**
 * 接口：爬虫列表条目。
 */
export interface ICrawlersListRow {
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
}

/**
 * 接口：爬虫列表分组。
 */
export interface ICrawlersListGroup {
  /**
   * 属性：分组标题。
   */
  label: string;

  /**
   * 属性：分组说明。
   */
  description: string;

  /**
   * 属性：图标名称。
   */
  iconName: string;

  /**
   * 属性：分组内条目。
   */
  crawlers: ICrawlersListRow[];
}

/**
 * 接口：爬虫列表项属性。
 */
export interface ICrawlersListProps {
  /**
   * 属性：分组数据。
   */
  groups: ICrawlersListGroup[];

  /**
   * 属性：当前选中条目 key。
   */
  selectedKey?: string;
}

/**
 * 接口：爬虫列表项事件。
 */
export interface ICrawlersListEmits {
  /**
   * 事件：点击条目。
   * @param {ICrawlersListRow} row 条目。
   * @param {MouseEvent} event 鼠标事件。
   */
  click: [row: ICrawlersListRow, event: MouseEvent];
}
