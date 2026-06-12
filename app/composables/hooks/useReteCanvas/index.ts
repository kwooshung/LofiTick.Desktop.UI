import { animate } from 'animejs';
import { NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin, Zoom } from 'rete-area-plugin';
import { Presets, VuePlugin } from 'rete-vue-plugin';

import type { IReteCanvasHandle, IReteCanvasSchemes, TReteCanvasAreaExtra } from './index.types';

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
 * 类型：平滑缩放动画实例。
 */
type TSmoothZoomAnimation = ReturnType<typeof animate>;

/**
 * 类型：边界平移时的指针位置。
 */
interface IBoundaryPointerPosition {
  /**
   * 属性：屏幕横坐标。
   */
  x: number;

  /**
   * 属性：屏幕纵坐标。
   */
  y: number;
}

/**
 * 函数：创建边界自动平移控制。
 *
 * 拖拽节点靠近编辑器边缘时，按距离比例自动平移视口。
 *
 * # Arguments
 *
 * * `area` - 画布插件实例。
 * * `container` - 画布容器。
 *
 * # Returns
 *
 * 返回销毁方法。
 */
const panningBoundaryCreate = (area: AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>, container: HTMLElement): { destroy: () => void } => {
  /**
   * 常量：触发边界的阈值（单位：像素）。
   */
  const threshold = 96;

  /**
   * 常量：单帧最大平移速度（单位：像素）。
   */
  const maxSpeed = 24;

  /**
   * 状态：是否处于节点拖拽中。
   */
  let isNodeDragging = false;

  /**
   * 状态：当前指针位置。
   */
  let pointerPosition: IBoundaryPointerPosition | null = null;

  /**
   * 状态：动画帧句柄。
   */
  let frameId: number | null = null;

  /**
   * 函数：停止边界平移循环。
   */
  const stop = (): void => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };

  /**
   * 函数：计算某个方向上的平移量。
   *
   * # Arguments
   *
   * * `distance` - 指针到边界的距离。
   * * `direction` - 平移方向，正值表示坐标增加，负值表示坐标减少。
   *
   * # Returns
   *
   * 返回该方向上的平移增量。
   */
  const computeShift = (distance: number, direction: 1 | -1): number => {
    if (distance >= threshold) {
      return 0;
    }

    return (1 - distance / threshold) * maxSpeed * direction;
  };

  /**
   * 函数：执行一帧边界平移。
   */
  const step = (): void => {
    frameId = null;

    if (!isNodeDragging || !pointerPosition) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const leftDistance = pointerPosition.x - rect.left;
    const rightDistance = rect.right - pointerPosition.x;
    const topDistance = pointerPosition.y - rect.top;
    const bottomDistance = rect.bottom - pointerPosition.y;

    const shiftX = computeShift(leftDistance, 1) + computeShift(rightDistance, -1);
    const shiftY = computeShift(topDistance, 1) + computeShift(bottomDistance, -1);

    if (shiftX === 0 && shiftY === 0) {
      return;
    }

    const transform = area.area.transform;
    void area.area.translate(transform.x + shiftX, transform.y + shiftY);
    frameId = requestAnimationFrame(step);
  };

  /**
   * 函数：启动边界平移循环。
   */
  const schedule = (): void => {
    if (frameId === null) {
      frameId = requestAnimationFrame(step);
    }
  };

  area.addPipe((context) => {
    if (!context || typeof context !== 'object' || !('type' in context)) {
      return context;
    }

    if (context.type === 'nodepicked' || context.type === 'nodetranslate') {
      isNodeDragging = true;
    } else if (context.type === 'pointermove') {
      pointerPosition = {
        x: context.data.event.clientX,
        y: context.data.event.clientY
      };

      if (isNodeDragging) {
        schedule();
      }
    } else if (context.type === 'pointerup') {
      isNodeDragging = false;
      pointerPosition = null;
      stop();
    }

    return context;
  });

  return {
    /**
     * 函数：销毁边界平移控制。
     */
    destroy: (): void => {
      isNodeDragging = false;
      pointerPosition = null;
      stop();
    }
  };
};

/**
 * 类：平滑缩放。
 */
class SmoothZoom extends Zoom {
  /**
   * 状态：当前缩放动画。
   */
  private animation: TSmoothZoomAnimation | null = null;

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
export const useReteCanvas = (canvasElement: Ref<HTMLDivElement | null>): IReteCanvasHandle => {
  /**
   * 状态：ReteJS 画布实例。
   */
  const reteArea = shallowRef<AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra> | null>(null);

  /**
   * 状态：网格背景层。
   */
  let backgroundElement: HTMLDivElement | null = null;

  /**
   * 状态：边界自动平移控制。
   */
  let panningBoundary: { destroy: () => void } | null = null;

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

    const area = new AreaPlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>(container);
    const renderer = new VuePlugin<IReteCanvasSchemes, TReteCanvasAreaExtra>();

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

    area.area.content.add(backgroundElement);

    renderer.addPreset(Presets.classic.setup());

    const editor = new NodeEditor<IReteCanvasSchemes>();
    editor.use(area as unknown as AreaPlugin<IReteCanvasSchemes>);
    area.use(renderer);

    AreaExtensions.restrictor(area, {
      scaling: () => ({ min: 0.5005, max: 10 })
    });

    AreaExtensions.snapGrid(area, {
      size: 5
    });

    area.area.setZoomHandler(new SmoothZoom(0.5, 200, 'cubicBezier(.45,.91,.49,.98)', area));

    panningBoundary = panningBoundaryCreate(area, container);

    if (isCanvasDisposed) {
      area.destroy();
      backgroundElement?.remove();
      backgroundElement = null;
      return;
    }

    reteArea.value = area;
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
    reteArea.value?.destroy();
    reteArea.value = null;
    backgroundElement?.remove();
    backgroundElement = null;
    panningBoundary?.destroy();
    panningBoundary = null;
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
      reteArea.value?.destroy();
      reteArea.value = null;
      backgroundElement?.remove();
      backgroundElement = null;
      panningBoundary?.destroy();
      panningBoundary = null;
    }
  };
};
