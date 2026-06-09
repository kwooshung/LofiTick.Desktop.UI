import type { Position } from '@vue-flow/core';

/**
 * 接口：执行三角组件属性。
 */
export interface ICrawlerBlueprintExecTriangleProps {
  /**
   * 属性：执行口 id。
   */
  id: string;

  /**
   * 属性：执行口类型。
   */
  type: 'source' | 'target';

  /**
   * 属性：执行口方位。
   */
  position: Position;

  /**
   * 属性：所在边。
   */
  side: 'left' | 'right';

  /**
   * 属性：垂直位置。
   */
  top: string;

  /**
   * 属性：可选标签。
   */
  label?: string;
}