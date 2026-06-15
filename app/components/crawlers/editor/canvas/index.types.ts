import type { Connection, Edge, Node, NodeChange, OnConnectStartParams } from '@vue-flow/core';

/**
 * 接口：编辑器画布属性。
 */
export interface ICrawlersEditorCanvasProps {
  /**
   * 属性：节点集合。
   */
  nodes: Node[];

  /**
   * 属性：边集合。
   */
  edges: Edge[];

  /**
   * 属性：水平辅助线。
   */
  helperLineHorizontal?: number;

  /**
   * 属性：垂直辅助线。
   */
  helperLineVertical?: number;

  /**
   * 属性：是否拖拽中。
   */
  isDragOver: boolean;

  /**
   * 属性：画布是否为空。
   */
  isCanvasEmpty: boolean;

  /**
   * 属性：拖拽标题。
   */
  dragTitle: string;

  /**
   * 属性：拖拽描述。
   */
  dragDescription: string;

  /**
   * 属性：空画布标题。
   */
  emptyTitle: string;

  /**
   * 属性：空画布描述。
   */
  emptyDescription: string;
}

/**
 * 类型：连接开始参数。
 */
export type TCrawlersCanvasConnectStartEvent = { event?: MouseEvent } & OnConnectStartParams;

/**
 * 接口：编辑器画布事件。
 */
export interface ICrawlersEditorCanvasEmits {
  /**
   * 事件：拖拽悬停。
   * @param {DragEvent} event 拖拽事件。
   */
  dragover: [event: DragEvent];

  /**
   * 事件：拖拽离开。
   * @param {DragEvent} event 拖拽事件。
   */
  dragleave: [event: DragEvent];

  /**
   * 事件：连接完成。
   * @param {Connection} params 连接参数。
   */
  connect: [params: Connection];

  /**
   * 事件：连接开始。
   * @param {TCrawlersCanvasConnectStartEvent} params 连接开始参数。
   */
  'connect-start': [params: TCrawlersCanvasConnectStartEvent];

  /**
   * 事件：连接结束。
   * @param {MouseEvent} event 鼠标事件。
   */
  'connect-end': [event?: MouseEvent];

  /**
   * 事件：节点变更。
   * @param {NodeChange[]} changes 节点变更集合。
   */
  'nodes-change': [changes: NodeChange[]];
}
