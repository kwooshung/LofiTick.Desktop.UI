/**
 * 接口：爬虫蓝图节点菜单项。
 */
export interface ICrawlerBlueprintNodeMenuItem {
  /**
   * 属性：节点唯一标识。
   */
  key: string;

  /**
   * 属性：节点标题。
   */
  label: string;

  /**
   * 属性：节点说明。
   */
  description: string;

  /**
   * 属性：节点图标。
   */
  icon: string;

  /**
   * 属性：节点分组。
   */
  group: string;
}

/**
 * 接口：爬虫蓝图节点分组。
 */
export interface ICrawlerBlueprintNodeMenuGroup {
  /**
   * 属性：分组唯一标识。
   */
  key: string;

  /**
   * 属性：分组标题。
   */
  label: string;

  /**
   * 属性：分组图标。
   */
  icon: string;

  /**
   * 属性：分组节点列表。
   */
  items: ICrawlerBlueprintNodeMenuItem[];
}
