/**
 * 类型：数组对象合并模式。
 */
export type TArrayObjectMergeMode = 'smart' | 'arrayConcat' | 'objectAssign';

/**
 * 接口：数组对象合并节点数据。
 */
export interface IArrayObjectMergeNodeData {
  /**
   * 属性：合并模式。
   */
  mode?: TArrayObjectMergeMode;

  /**
   * 属性：数据源 ID 列表。
   */
  sourceIds?: string[];

  /**
   * 属性：数据源文本值映射。
   */
  sourceValues?: Record<string, string>;
}