/**
 * 接口：构建爬虫站点右键菜单的选项。
 */
export interface IBuildCrawlerTargetContextMenuItemsOptions {
  /**
   * 属性：是否显示打开详情动作。
   */
  showOpen?: boolean;

  /**
   * 属性：打开详情动作。
   */
  onOpen?: () => void;

  /**
   * 属性：编辑动作。
   */
  onEdit?: () => void;

  /**
   * 属性：添加任务动作。
   */
  onAddTask?: () => void;
}
