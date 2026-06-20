/**
 * 类型：裁剪方向。
 */
export type TStringTrimDirection = 'both' | 'start' | 'end' | 'all';

/**
 * 接口：字符串去空白节点数据。
 */
export interface IStringTrimNodeData {
  /**
   * 属性：输入文本。
   */
  text?: string;

  /**
   * 属性：裁剪方向。
   */
  direction?: TStringTrimDirection;

  /**
   * 属性：空白字符类型列表。
   */
  whitespaceTypes?: string[];
}
