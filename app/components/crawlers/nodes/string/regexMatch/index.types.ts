/**
 * 接口：正则匹配节点数据。
 */
export interface IStringRegexMatchNodeData {
  /**
   * 属性：输入文本。
   */
  text?: string;

  /**
   * 属性：正则表达式。
   */
  pattern?: string;

  /**
   * 属性：正则标志位。
   */
  flags?: string;
}
