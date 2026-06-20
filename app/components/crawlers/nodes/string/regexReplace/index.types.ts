/**
 * 接口：正则替换节点数据。
 */
export interface IStringRegexReplaceNodeData {
  /**
   * 属性：输入文本。
   */
  text?: string;

  /**
   * 属性：正则表达式。
   */
  pattern?: string;

  /**
   * 属性：替换内容。
   */
  replacement?: string;

  /**
   * 属性：正则标志位。
   */
  flags?: string;
}
