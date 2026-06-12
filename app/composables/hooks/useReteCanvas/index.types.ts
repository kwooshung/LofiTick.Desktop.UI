import type { ClassicPreset } from 'rete';
import type { VueArea2D } from 'rete-vue-plugin';

/**
 * 接口：ReteJS 画布数据结构。
 */
export interface IReteCanvasSchemes {
  /**
   * 属性：节点类型。
   */
  Node: ClassicPreset.Node;

  /**
   * 属性：连线类型。
   */
  Connection: ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>;
}

/**
 * 类型：ReteJS Vue 渲染额外信号。
 */
export type TReteCanvasAreaExtra = VueArea2D<IReteCanvasSchemes>;

/**
 * 接口：ReteJS 画布初始化句柄。
 */
export interface IReteCanvasHandle {
  /**
   * 属性：销毁画布。
   */
  destroy: () => void;
}
