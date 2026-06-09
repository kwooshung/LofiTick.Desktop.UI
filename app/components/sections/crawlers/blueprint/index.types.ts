/**
 * 接口：蓝图节点。
 */
export interface IBlueprintNodeItem {
  /**
   * 节点标题。
   */
  title: string;

  /**
   * 节点说明。
   */
  description: string;

  /**
   * 节点图标。
   */
  icon: string;

  /**
   * 节点强调色。
   */
  tone: 'primary' | 'info' | 'success' | 'warning' | 'neutral';
}

/**
 * 接口：蓝图节点分组。
 */
export interface IBlueprintNodeGroup {
  /**
   * 分组标题。
   */
  title: string;

  /**
   * 分组说明。
   */
  description: string;

  /**
   * 分组内节点列表。
   */
  nodes: IBlueprintNodeItem[];
}

/**
 * 接口：蓝图节点块属性。
 */
export interface IBlueprintNodeBlockProps {
  /**
   * 节点数据。
   */
  node: IBlueprintNodeItem;
}

/**
 * 接口：蓝图节点块事件。
 */
export interface IBlueprintNodeBlockEmits {
  /**
   * 事件：选中节点。
   */
  select: [node: IBlueprintNodeItem];
}
