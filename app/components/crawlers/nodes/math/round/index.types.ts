/**
 * 类型：取整模式。
 */
export type TRoundMode = 'round' | 'ceil' | 'floor';

/**
 * 接口：取整节点数据。
 */
export interface IMathRoundNodeData {
  /**
   * 属性：取整模式。
   */
  roundMode?: TRoundMode;

  /**
   * 属性：输入值。
   */
  value?: number;
}
