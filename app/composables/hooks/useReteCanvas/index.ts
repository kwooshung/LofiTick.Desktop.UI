import { NodeEditor } from 'rete';
import { AreaPlugin } from 'rete-area-plugin';
import { Presets, VuePlugin } from 'rete-vue-plugin';
import { onBeforeUnmount, onMounted, type Ref, shallowRef } from 'vue';

import type { IReteCanvasHandle, IReteCanvasSchemes, TReteCanvasAreaExtra } from './index.types';

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
    }
  };
};
