/**
 * 接口：除法节点数据。
 */
export interface IMathDivideNodeData {
  /**
   * 属性：操作数 ID 列表。
   */
  operandIds?: string[];

  /**
   * 属性：操作数值映射。
   */
  operandValues?: Record<string, number>;
}
