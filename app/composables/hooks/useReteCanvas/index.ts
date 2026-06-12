import { animate } from 'animejs';
import { NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin, Zoom } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import type { ReroutePlugin } from 'rete-connection-reroute-plugin';
import { Presets, VuePlugin } from 'rete-vue-plugin';

import type { IReteCanvasHandle, IReteCanvasHandles, IReteCanvasSchemes, TReteCanvasAreaExtra } from './index.types';

/**
 * 函数：屏幕坐标转换为画布坐标。
 *
 * # Arguments
 *
 * * `x` - 屏幕横坐标。
 * * `y` - 屏幕纵坐标。
 * * `transform` - 当前画布变换。
 *
 * # Returns
 *
 * 返回画布坐标。
 */
const screenToArea = (x: number, y: number, transform: { x: number; y: number; k: number }): { x: number; y: number } => ({
  x: (x - transform.x) / transform.k,
  y: (y - transform.y) / transform.k
});

/**
 * 函数：画布坐标转换为屏幕坐标。
 *
 * # Arguments
 *
 * * `x` - 画布横坐标。
 * * `y` - 画布纵坐标。
 * * `transform` - 当前画布变换。
 *
 * # Returns
 *
 * 返回屏幕坐标。
 */
const areaToScreen = (x: number, y: number, transform: { x: number; y: number; k: number }): { x: number; y: number } => ({
  x: x * transform.k + transform.x,
  y: y * transform.k + transform.y
});

/**
 * 类：平滑缩放。
 */
class SmoothZoom extends Zoom {
  /**
   * 状态：当前缩放动画。
   */
  private animation: ReturnType<typeof animate> | null = null;

  /**
   * 状态：动画时长（单位：毫秒）。
   */
  private readonly duration: number;

  /**
   * 状态：缓动函数。
   */
  private readonly easing: string;

  /**
   * 状态：画布插件实例。
   */
  private readonly area: AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>;

  /**
   * 构造函数：创建平滑缩放实例。
   *
   * # Arguments
   *
   * * `intensity` - 缩放强度。
   * * `duration` - 动画时长（单位：毫秒）。
   * * `easing` - 缓动曲线。
   * * `area` - 画布插件实例。
   */
  constructor(intensity: number, duration: number, easing: string, area: AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>) {
    super(intensity);
    this.duration = duration;
    this.easing = easing;
    this.area = area;
  }

  /**
   * 函数：滚轮缩放。
   *
   * # Arguments
   *
   * * `event` - 滚轮事件。
   */
  override wheel = (event: WheelEvent): void => {
    event.preventDefault();

    const isZoomIn = event.deltaY < 0;
    const delta = isZoomIn ? this.intensity : -this.intensity;
    const { left, top } = this.container.getBoundingClientRect();
    const pointerX = event.clientX - left;
    const pointerY = event.clientY - top;
    const anchor = screenToArea(pointerX, pointerY, this.area.area.transform);
    const { k } = this.area.area.transform;
    const target = { zoom: k };

    if (this.animation) {
      this.animation.revert();
    }

    this.animation = animate(target, {
      zoom: k * (1 + delta),
      duration: this.duration,
      easing: this.easing,
      onUpdate: () => {
        const currentTransform = this.area.area.transform;
        const coordinates = areaToScreen(anchor.x, anchor.y, currentTransform);
        const nextX = coordinates.x - anchor.x * target.zoom;
        const nextY = coordinates.y - anchor.y * target.zoom;

        void this.area.area.zoom(target.zoom, nextX - currentTransform.x, nextY - currentTransform.y);
      }
    });
  };

  /**
   * 函数：销毁动画与缩放处理。
   */
  override destroy(): void {
    super.destroy();
    this.animation?.revert();
    this.animation = null;
  }
}

/**
 * 函数：初始化 ReteJS 基础画布。
 *
 * 仅负责创建最小可视化编辑器与空白画布，不预置任何默认节点。
 *
 * # Arguments
 *
 * * `canvasElement` - 画布挂载容器引用。
 *
 * # Returns
 *
 * 返回画布初始化句柄。
 */
export const useReteCanvas = (canvasElement: Ref<HTMLDivElement | null>): IReteCanvasHandles & IReteCanvasHandle => {
  /**
   * 状态：ReteJS 画布实例。
   */
  const editor = shallowRef<NodeEditor<IReteCanvasSchemes> | null>(null);

  /**
   * 状态：ReteJS 画布插件实例。
   */
  const area = shallowRef<AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra> | null>(null);

  /**
   * 状态：节点选择器实例。
   */
  const selector = shallowRef<ReturnType<typeof AreaExtensions.selector> | null>(null);

  /**
   * 状态：连线重路由插件实例。
   */
  const reroutePluginRef = shallowRef<ReroutePlugin<IReteCanvasSchemes> | null>(null);

  /**
   * 状态：初始化完成标记。
   */
  const isReady = shallowRef(false);

  /**
   * 状态：网格背景层。
   */
  let backgroundElement: HTMLDivElement | null = null;

  /**
   * 状态：socket 指针按下事件处理器。
   */
  let socketPointerDownHandler: ((event: PointerEvent) => void) | null = null;

  /**
   * 状态：socket 指针抬起事件处理器。
   */
  let socketPointerUpHandler: ((event: PointerEvent) => void) | null = null;

  /**
   * 状态：是否正在进行 socket 连线拖拽。
   */
  let isSocketDragging = false;

  /**
   * 状态：组件卸载标记。
   */
  let isCanvasDisposed = false;

  /**
   * 函数：初始化画布内容。
   *
   * # Returns
   *
   * 初始化完成时返回空值。
   */
  const initialize = async (): Promise<void> => {
    const container = canvasElement.value;
    if (!container) {
      return;
    }

    const reteAreaInstance = new AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>(container);
    const renderer = new VuePlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>();
    const connection = new ConnectionPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>();

    backgroundElement = document.createElement('div');
    backgroundElement.setAttribute('aria-hidden', 'true');
    backgroundElement.className = [
      'pointer-events-none',
      'absolute',
      'top-[-320000px]',
      'left-[-320000px]',
      'z-0',
      'table',
      'h-[640000px]',
      'w-[640000px]',
      'bg-[color:var(--ui-bg)]',
      '[background-image:linear-gradient(var(--ui-border)_2px,transparent_2px),linear-gradient(90deg,var(--ui-border)_2px,transparent_2px),linear-gradient(var(--ui-border)_1px,transparent_1px),linear-gradient(90deg,var(--ui-border)_1px,var(--ui-bg)_1px)]',
      '[background-position:-2px_-2px,-2px_-2px,-1px_-1px,-1px_-1px]',
      '[background-size:80px_80px,80px_80px,16px_16px,16px_16px]'
    ].join(' ');

    reteAreaInstance.area.content.add(backgroundElement);

    const editorInstance = new NodeEditor<IReteCanvasSchemes>();

    const selectorInstance = AreaExtensions.selector();
    const selectorAccumulating = AreaExtensions.accumulateOnCtrl();
    connection.addPreset(ConnectionPresets.classic.setup());

    AreaExtensions.selectableNodes(reteAreaInstance, selectorInstance, {
      accumulating: selectorAccumulating
    });

    renderer.addPreset(Presets.classic.setup());

    editorInstance.use(reteAreaInstance as unknown as AreaPlugin<IReteCanvasSchemes>);

    reteAreaInstance.use(connection);
    reteAreaInstance.use(renderer);

    // 兜底：强制接管 socket 指针事件，避免节点拖拽抢占导致无法连线。
    socketPointerDownHandler = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const isSocketTarget = Boolean(target.closest('[data-testid="input-socket"], [data-testid="output-socket"], .socket'));
      if (!isSocketTarget) {
        return;
      }

      isSocketDragging = true;
      event.stopPropagation();
      void connection.pick(event, 'down');
    };

    socketPointerUpHandler = (event: PointerEvent) => {
      if (!isSocketDragging) {
        return;
      }

      isSocketDragging = false;
      event.stopPropagation();
      void connection.pick(event, 'up');
    };

    container.addEventListener('pointerdown', socketPointerDownHandler, true);
    window.addEventListener('pointerup', socketPointerUpHandler, true);

    AreaExtensions.restrictor(reteAreaInstance, {
      scaling: () => ({ min: 0.5005, max: 10 })
    });

    selector.value = selectorInstance;

    AreaExtensions.simpleNodesOrder(reteAreaInstance);

    reteAreaInstance.area.setZoomHandler(new SmoothZoom(0.5, 200, 'cubicBezier(.45,.91,.49,.98)', reteAreaInstance));

    if (isCanvasDisposed) {
      if (socketPointerDownHandler) {
        container.removeEventListener('pointerdown', socketPointerDownHandler, true);
        socketPointerDownHandler = null;
      }

      if (socketPointerUpHandler) {
        window.removeEventListener('pointerup', socketPointerUpHandler, true);
        socketPointerUpHandler = null;
      }

      isSocketDragging = false;
      reteAreaInstance.destroy();
      backgroundElement?.remove();
      backgroundElement = null;
      return;
    }

    editor.value = editorInstance;
    area.value = reteAreaInstance;
    reroutePluginRef.value = null;
    isReady.value = true;
  };

  /**
   * 生命周期：挂载后初始化画布。
   */
  onMounted(() => {
    void initialize();
  });

  /**
   * 生命周期：卸载时销毁画布。
   */
  onBeforeUnmount(() => {
    isCanvasDisposed = true;

    if (socketPointerDownHandler) {
      canvasElement.value?.removeEventListener('pointerdown', socketPointerDownHandler, true);
      socketPointerDownHandler = null;
    }

    if (socketPointerUpHandler) {
      window.removeEventListener('pointerup', socketPointerUpHandler, true);
      socketPointerUpHandler = null;
    }

    isSocketDragging = false;

    area.value?.destroy();
    area.value = null;
    editor.value = null;
    selector.value = null;
    reroutePluginRef.value = null;
    isReady.value = false;
    backgroundElement?.remove();
    backgroundElement = null;
  });

  return {
    /**
     * 函数：销毁画布。
     *
     * # Returns
     *
     * 无返回值。
     */
    destroy: () => {
      isCanvasDisposed = true;

      if (socketPointerDownHandler) {
        canvasElement.value?.removeEventListener('pointerdown', socketPointerDownHandler, true);
        socketPointerDownHandler = null;
      }

      if (socketPointerUpHandler) {
        window.removeEventListener('pointerup', socketPointerUpHandler, true);
        socketPointerUpHandler = null;
      }

      isSocketDragging = false;

      area.value?.destroy();
      area.value = null;
      editor.value = null;
      selector.value = null;
      reroutePluginRef.value = null;
      isReady.value = false;
      backgroundElement?.remove();
      backgroundElement = null;
    },
    editor,
    area,
    selector,
    reroutePlugin: reroutePluginRef,
    isReady
  };
};
