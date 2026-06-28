import type { XYPosition } from '@vue-flow/core';

/**
 * 接口：自定义边拐点。
 */
export interface ILineEdgePoint extends XYPosition {}

/**
 * 接口：自定义边扩展数据。
 */
export interface ILineEdgeData {
  /**
   * 属性：边标签文本。
   */
  text?: string;

  /**
   * 属性：边路径拐点集合。
   */
  points?: ILineEdgePoint[];
}
