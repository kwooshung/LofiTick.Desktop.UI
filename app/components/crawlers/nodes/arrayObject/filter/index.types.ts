/**
 * 类型：数组过滤模式。
 */
export type TArrayObjectFilterMode = 'truthy' | 'nonEmpty' | 'distinct';

/**
 * 接口：数组过滤节点数据。
 */
export interface IArrayObjectFilterNodeData {
  /**
   * 属性：过滤模式。
   */
  mode?: TArrayObjectFilterMode;

  /**
   * 属性：过滤路径。
   */
  path?: string;
}