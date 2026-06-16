/**
 * 接口：爬虫蓝图节点定义。
 */
export interface ICrawlersBlueprintNodeDefinition {
  /**
   * 属性：节点 key。
   */
  key: string;

  /**
   * 属性：节点标题翻译键。
   */
  title: string;

  /**
   * 属性：节点描述翻译键。
   */
  description: string;

  /**
   * 属性：节点图标名称。
   */
  icon: string;
}

/**
 * 接口：爬虫蓝图分组定义。
 */
export interface ICrawlersBlueprintGroupDefinition {
  /**
   * 属性：分组标题翻译键。
   */
  title: string;

  /**
   * 属性：分组描述翻译键。
   */
  description: string;

  /**
   * 属性：分组图标。
   */
  icon: string;

  /**
   * 属性：分组节点定义。
   */
  nodes: ICrawlersBlueprintNodeDefinition[];
}
