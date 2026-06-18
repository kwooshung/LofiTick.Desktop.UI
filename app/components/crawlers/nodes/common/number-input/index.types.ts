/**
 * 接口：通用数值输入组件属性。
 */
export interface ICrawlersNodesCommonNumberInputProps {
  /**
   * 属性：输入框 ID。
   */
  id: string;

  /**
   * 属性：当前值。
   */
  modelValue: number;

  /**
   * 属性：最小值。
   */
  min?: number;

  /**
   * 属性：最大值。
   */
  max?: number;

  /**
   * 属性：步长。
   */
  step?: number;

  /**
   * 属性：前缀文本。
   */
  prefix?: string;

  /**
   * 属性：单位文本。
   */
  unit?: string;
}
