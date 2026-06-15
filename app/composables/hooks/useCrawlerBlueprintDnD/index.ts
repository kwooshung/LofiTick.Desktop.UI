import { useVueFlow } from '@vue-flow/core';

import type { IUseCrawlerBlueprintDnD } from '@/composables/hooks/useCrawlerBlueprintDnD/index.types';

let id = 0;

/**
 * 函数：生成唯一节点 ID。
 *
 * @returns {string} 唯一的拖拽节点 ID。
 */
const getId = (): string => {
  return `dndnode_${id++}`;
};

/**
 * 常量：组合式拖拽状态。
 *
 * 实际项目中应尽量避免在全局作用域创建这类响应式状态，这里保留现有结构以便复用。
 */
const state = {
  /**
   * 属性：正在拖拽的节点类型。
   */
  draggedType: ref<string | null>(null),
  /**
   * 属性：是否处于拖拽悬停状态。
   */
  isDragOver: ref<boolean>(false),
  /**
   * 属性：是否正在拖拽。
   */
  isDragging: ref<boolean>(false)
};

/**
 * 函数：创建拖拽与放置交互能力。
 *
 * 组合式函数会暴露拖拽状态与事件处理器，供画布节点面板直接复用。
 *
 * @returns {IUseCrawlerBlueprintDnD} 拖拽状态与事件处理器。
 */

const useCrawlerBlueprintDnD = (): IUseCrawlerBlueprintDnD => {
  const { draggedType, isDragOver, isDragging } = state;

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow();

  /**
   * 函数：同步浏览器文本选择开关。
   *
   * 拖拽过程中禁止选中文本，避免拖拽交互与页面选择冲突。
   */
  watch(isDragging, (dragging: boolean) => {
    document.body.style.userSelect = dragging ? 'none' : '';
  });

  /**
   * 函数：开始拖拽。
   *
   * @param {DragEvent} event 拖拽事件对象。
   * @param {string} type 节点类型标识。
   */
  const onDragStart = (event: DragEvent, type: string): void => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type);
      event.dataTransfer.effectAllowed = 'move';
    }

    draggedType.value = type;
    isDragging.value = true;

    document.addEventListener('drop', onDragEnd);
  };

  /**
   * 函数：处理拖拽悬停事件。
   *
   * @param event 拖拽事件对象。
   */
  const onDragOver = (event: DragEvent): void => {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }
  };

  /**
   * 函数：处理拖拽离开事件。
   */
  const onDragLeave = (): void => {
    isDragOver.value = false;
  };

  /**
   * 函数：结束拖拽。
   */
  const onDragEnd = (): void => {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    document.removeEventListener('drop', onDragEnd);
  };

  /**
   * 函数：处理放置事件。
   *
   * @param event 放置事件对象。
   */
  const onDrop = (event: DragEvent): void => {
    if (!draggedType.value) {
      return;
    }

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY
    });

    const nodeId = getId();

    const newNode = {
      id: nodeId,
      type: draggedType.value,
      position,
      data: { label: nodeId }
    };

    /**
     * 函数：放置后修正节点位置，使其以鼠标为中心。
     *
     * 这里通过一次性回调在节点初始化后再修正坐标，并在完成后移除监听。
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
      }));

      off();
    });

    addNodes(newNode);
  };

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop
  };
};

export default useCrawlerBlueprintDnD;
