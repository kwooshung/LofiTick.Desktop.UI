import type { ClassicPreset, NodeEditor } from 'rete';
import type { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import type { RerouteExtra, ReroutePlugin } from 'rete-connection-reroute-plugin';
import type { MinimapExtra } from 'rete-minimap-plugin';
import type { VueArea2D } from 'rete-vue-plugin';
import type { ShallowRef } from 'vue';

/**
 * 接口：ReteJS 画布数据结构。
 */
export interface IReteCanvasSchemes {
  /**
   * 属性：节点类型。
   */
  Node: ClassicPreset.Node & { width: number; height: number };

  /**
   * 属性：连线类型。
   */
  Connection: ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>;
}

/**
 * 类型：ReteJS Vue 渲染额外信号。
 */
export type TReteCanvasAreaExtra = VueArea2D<IReteCanvasSchemes> | MinimapExtra | RerouteExtra;

/**
 * 接口：ReteJS 画布句柄集合。
 */
export interface IReteCanvasHandles {
  /**
   * 属性：节点编辑器实例。
   */
  editor: ShallowRef<NodeEditor<IReteCanvasSchemes> | null>;

  /**
   * 属性：画布插件实例。
   */
  area: ShallowRef<AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra> | null>;

  /**
   * 属性：节点选择器实例。
   */
  selector: ShallowRef<ReturnType<typeof AreaExtensions.selector> | null>;

  /**
   * 属性：连线重路由插件实例。
   */
  reroutePlugin: ShallowRef<ReroutePlugin<IReteCanvasSchemes> | null>;

  /**
   * 属性：初始化完成状态。
   */
  isReady: Readonly<ShallowRef<boolean>>;
}

/**
 * 接口：ReteJS 画布初始化句柄。
 */
export interface IReteCanvasHandle {
  /**
   * 属性：销毁画布。
   */
  destroy: () => void;
}
