/**
 * 类型：随机区间类型。
 */
export type TRandomIntervalType = 'leftClosedRightOpen' | 'leftOpenRightClosed' | 'open' | 'closed';

/**
 * 类型：随机数字类型。
 */
export type TRandomNumberType = 'float' | 'integer';

/**
 * 接口：随机数节点数据。
 */
export interface IMathRandomNodeData {
  /**
   * 属性：最小值。
   */
  min?: number;

  /**
   * 属性：最大值。
   */
  max?: number;

  /**
   * 属性：区间类型。
   */
  intervalType?: TRandomIntervalType;

  /**
   * 属性：数字类型。
   */
  numberType?: TRandomNumberType;
}
