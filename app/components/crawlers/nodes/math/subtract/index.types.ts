/**
 * 接口：减法节点数据。
 */
export interface IMathSubtractNodeData {
  /**
   * 属性：操作数 ID 列表。
   */
  operandIds?: string[];

  /**
   * 属性：操作数值映射。
   */
  operandValues?: Record<string, number>;
}
