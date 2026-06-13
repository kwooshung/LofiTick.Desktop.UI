import type { Ref } from 'vue';

/**
 * 接口：拖拽与放置交互能力。
 *
 * 统一描述蓝图拖拽时对外暴露的响应式状态与事件处理器。
 */
export interface IUseCrawlerBlueprintDnD {
  /**
   * 属性：正在拖拽的节点类型。
   */
  draggedType: Ref<string | null>;

  /**
   * 属性：是否处于拖拽悬停状态。
   */
  isDragOver: Ref<boolean>;

  /**
   * 属性：是否正在拖拽。
   */
  isDragging: Ref<boolean>;

  /**
   * 属性：开始拖拽的处理器。
   */
  onDragStart: (event: DragEvent, type: string) => void;

  /**
   * 属性：拖拽离开的处理器。
   */
  onDragLeave: () => void;

  /**
   * 属性：拖拽悬停的处理器。
   */
  onDragOver: (event: DragEvent) => void;

  /**
   * 属性：放置的处理器。
   */
  onDrop: (event: DragEvent) => void;
}
