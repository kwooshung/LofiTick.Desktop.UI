/**
 * 接口：字符串拼接节点数据。
 */
export interface IStringConcatNodeData {
  /**
   * 属性：片段 ID 列表。
   */
  segmentIds?: string[];

  /**
   * 属性：片段值映射。
   */
  segmentValues?: Record<string, string>;
}
