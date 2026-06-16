import type { Connection, Edge, GraphNode, Node, NodeChange, OnConnectStartParams, XYPosition } from '@vue-flow/core';
import type { Ref } from 'vue';

/**
 * 接口：节点吸附辅助线计算结果。
 */
export interface IGetHelperLinesResult {
  horizontal?: number;
  vertical?: number;
  snapPosition: Partial<XYPosition>;
}

/**
 * 接口：编辑器画布逻辑参数。
 */
export interface ICrawlersEditorLogicOptions {
  /**
   * 属性：节点数据引用。
   */
  nodes: Ref<GraphNode[]>;

  /**
   * 属性：边数据引用。
   */
  edges: Ref<Edge[]>;

  /**
   * 属性：水平辅助线引用。
   */
  stateHelperLineHorizontal: Ref<number | undefined>;

  /**
   * 属性：垂直辅助线引用。
   */
  stateHelperLineVertical: Ref<number | undefined>;

  /**
   * 函数：新增边。
   * @param {Connection | Edge} params 边参数。
   * @returns {void} 无返回值。
   */
  addEdges: (params: Connection | Edge) => void;

  /**
   * 函数：应用节点变更。
   * @param {NodeChange[]} changes 节点变更集合。
   * @returns {GraphNode[]} 更新后的节点集合。
   */
  applyNodeChanges: (changes: NodeChange[]) => GraphNode[];

  /**
   * 函数：新增节点。
   * @param {Node | Node[]} node 节点或节点集合。
   * @returns {void} 无返回值。
   */
  addNodes: (node: Node | Node[]) => void;
}

/**
 * 接口：编辑器画布交互逻辑返回值。
 */
export interface ICrawlersEditorLogicResult {
  /**
   * 函数：初始化默认节点。
   * @returns {void} 无返回值。
   */
  initializeDefaultNodes: () => void;

  /**
   * 函数：处理节点变更。
   * @param {NodeChange[]} changes 节点变更集合。
   * @returns {void} 无返回值。
   */
  handleNodesChange: (changes: NodeChange[]) => void;

  /**
   * 函数：处理连接开始。
   * @param {{ event?: MouseEvent } & OnConnectStartParams} connectionEvent 连接开始参数。
   * @returns {void} 无返回值。
   */
  handleConnectStart: (connectionEvent: { event?: MouseEvent } & OnConnectStartParams) => void;

  /**
   * 函数：统一校验连接是否合法。
   * @param {Connection} connection 连接参数。
   * @returns {boolean} 是否允许连接。
   */
  isValidConnection: (connection: Connection) => boolean;

  /**
   * 函数：处理连接完成。
   * @param {Connection} params 连接参数。
   * @returns {void} 无返回值。
   */
  handleConnect: (params: Connection) => void;

  /**
   * 函数：处理连接结束。
   * @param {MouseEvent} event 鼠标事件（可选）。
   * @returns {void} 无返回值。
   */
  handleConnectEnd: (event?: MouseEvent) => void;
}
