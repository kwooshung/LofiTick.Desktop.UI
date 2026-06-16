import type { Connection, GraphNode, NodeChange, NodePositionChange, OnConnectStartParams } from '@vue-flow/core';

import type { ICrawlersEditorLogicOptions, ICrawlersEditorLogicResult, IGetHelperLinesResult } from '@/composables/hooks/useCrawlersEditorLogic/index.types';

/**
 * 组合式：编辑器画布交互逻辑。
 * @param {ICrawlersEditorLogicOptions} options 逻辑依赖。
 * @returns {ICrawlersEditorLogicResult} 画布事件处理函数。
 */
export const useCrawlersEditorLogic = (options: ICrawlersEditorLogicOptions): ICrawlersEditorLogicResult => {
  const { nodes, edges, stateHelperLineHorizontal, stateHelperLineVertical, addEdges, applyNodeChanges, addNodes } = options;

  /**
   * 函数：初始化默认起止节点。
   * @returns {void} 无返回值。
   */
  const initializeDefaultNodes = (): void => {
    if (nodes.value.length === 0) {
      addNodes({
        type: 'start',
        id: 'start',
        position: { x: 100, y: 100 },
        selectable: true,
        deletable: true
      });
      addNodes({
        type: 'end',
        id: 'end',
        position: { x: 1000, y: 100 },
        selectable: true,
        deletable: true
      });
    }
  };

  /**
   * 函数：计算节点拖拽时的辅助线与吸附位置。
   * @param {NodePositionChange} change 节点位置变更。
   * @param {GraphNode[]} nodes 当前节点集合。
   * @param {number} distance 吸附阈值。
   * @returns {IGetHelperLinesResult} 辅助线结果。
   */
  const getHelperLines = (change: NodePositionChange, nodes: GraphNode[], distance: number = 5): IGetHelperLinesResult => {
    const defaultResult: IGetHelperLinesResult = {
      horizontal: undefined,
      vertical: undefined,
      snapPosition: { x: undefined, y: undefined }
    };
    const nodeA = nodes.find((node) => node.id === change.id);

    if (!nodeA || !change.position) {
      return defaultResult;
    }

    const nodeABounds = {
      left: change.position.x,
      right: change.position.x + ((nodeA.dimensions.width as number) ?? 0),
      top: change.position.y,
      bottom: change.position.y + ((nodeA.dimensions.height as number) ?? 0),
      width: (nodeA.dimensions.width as number) ?? 0,
      height: (nodeA.dimensions.height as number) ?? 0
    };

    let horizontalDistance = distance;
    let verticalDistance = distance;

    return nodes
      .filter((node) => node.id !== nodeA.id)
      .reduce<IGetHelperLinesResult>((result, nodeB) => {
        const nodeBBounds = {
          left: nodeB.position.x,
          right: nodeB.position.x + ((nodeB.dimensions.width as number) ?? 0),
          top: nodeB.position.y,
          bottom: nodeB.position.y + ((nodeB.dimensions.height as number) ?? 0),
          width: nodeB.width ?? 0,
          height: nodeB.height ?? 0
        };

        const distanceLeftLeft = Math.abs(nodeABounds.left - nodeBBounds.left);

        if (distanceLeftLeft < verticalDistance) {
          result.snapPosition.x = nodeBBounds.left;
          result.vertical = nodeBBounds.left;
          verticalDistance = distanceLeftLeft;
        }

        const distanceRightRight = Math.abs(nodeABounds.right - nodeBBounds.right);

        if (distanceRightRight < verticalDistance) {
          result.snapPosition.x = nodeBBounds.right - nodeABounds.width;
          result.vertical = nodeBBounds.right;
          verticalDistance = distanceRightRight;
        }

        const distanceLeftRight = Math.abs(nodeABounds.left - nodeBBounds.right);

        if (distanceLeftRight < verticalDistance) {
          result.snapPosition.x = nodeBBounds.right;
          result.vertical = nodeBBounds.right;
          verticalDistance = distanceLeftRight;
        }

        const distanceRightLeft = Math.abs(nodeABounds.right - nodeBBounds.left);

        if (distanceRightLeft < verticalDistance) {
          result.snapPosition.x = nodeBBounds.left - nodeABounds.width;
          result.vertical = nodeBBounds.left;
          verticalDistance = distanceRightLeft;
        }

        const distanceTopTop = Math.abs(nodeABounds.top - nodeBBounds.top);

        if (distanceTopTop < horizontalDistance) {
          result.snapPosition.y = nodeBBounds.top;
          result.horizontal = nodeBBounds.top;
          horizontalDistance = distanceTopTop;
        }

        const distanceBottomTop = Math.abs(nodeABounds.bottom - nodeBBounds.top);

        if (distanceBottomTop < horizontalDistance) {
          result.snapPosition.y = nodeBBounds.top - nodeABounds.height;
          result.horizontal = nodeBBounds.top;
          horizontalDistance = distanceBottomTop;
        }

        const distanceBottomBottom = Math.abs(nodeABounds.bottom - nodeBBounds.bottom);

        if (distanceBottomBottom < horizontalDistance) {
          result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height;
          result.horizontal = nodeBBounds.bottom;
          horizontalDistance = distanceBottomBottom;
        }

        const distanceTopBottom = Math.abs(nodeABounds.top - nodeBBounds.bottom);

        if (distanceTopBottom < horizontalDistance) {
          result.snapPosition.y = nodeBBounds.bottom;
          result.horizontal = nodeBBounds.bottom;
          horizontalDistance = distanceTopBottom;
        }

        return result;
      }, defaultResult);
  };

  /**
   * 函数：根据节点位移更新辅助线并计算吸附位置。
   * @param {NodeChange[]} changes 节点变更集合。
   * @param {GraphNode[]} nodes 当前画布节点集合。
   * @returns {NodeChange[]} 处理后的节点变更集合。
   */
  const updateHelperLines = (changes: NodeChange[], nodes: GraphNode[]): NodeChange[] => {
    stateHelperLineHorizontal.value = undefined;
    stateHelperLineVertical.value = undefined;

    const statePositionChange = changes.length === 1 ? changes[0] : undefined;

    if (statePositionChange?.type === 'position' && statePositionChange.dragging && statePositionChange.position) {
      const helperLines = getHelperLines(statePositionChange as NodePositionChange, nodes);

      statePositionChange.position.x = helperLines.snapPosition.x ?? statePositionChange.position.x;
      statePositionChange.position.y = helperLines.snapPosition.y ?? statePositionChange.position.y;

      stateHelperLineHorizontal.value = helperLines.horizontal;
      stateHelperLineVertical.value = helperLines.vertical;
    }

    return changes;
  };

  /**
   * 函数：处理节点变更并应用辅助线吸附。
   * @param {NodeChange[]} changes 节点变更集合。
   * @returns {void} 无返回值。
   */
  const handleNodesChange = (changes: NodeChange[]): void => {
    const updatedChanges = updateHelperLines(changes, nodes.value);
    nodes.value = applyNodeChanges(updatedChanges);
  };

  /**
   * 函数：处理连接开始。
   * @param {{ event?: MouseEvent } & OnConnectStartParams} connectionEvent 连接开始参数。
   * @returns {void} 无返回值。
   */
  const handleConnectStart = (connectionEvent: { event?: MouseEvent } & OnConnectStartParams): void => {
    const { nodeId, handleType } = connectionEvent;

    console.clear();
    console.log('on connect start', { nodeId, handleType });
  };

  /**
   * 函数：统一校验连接是否合法。
   * @param {Connection} connection 连接参数。
   * @returns {boolean} 是否允许连接。
   */
  const isValidConnection = (connection: Connection): boolean => {
    const isExecConnection = connection.sourceHandle === 'exec-out' && connection.targetHandle === 'exec-in';

    if (!isExecConnection || !connection.source || !connection.target) {
      return false;
    }

    // 禁止同节点自连。
    if (connection.source === connection.target) {
      return false;
    }

    return true;
  };

  /**
   * 函数：处理连接完成。
   * @param {Connection} params 连接参数。
   * @returns {void} 无返回值。
   */
  const handleConnect = (params: Connection): void => {
    console.log('on connect', params);
    if (isValidConnection(params)) {
      // UE 蓝图风格：同一个执行输出引脚和执行输入引脚都只允许保留一条线。
      edges.value = edges.value.filter((edge) => {
        const isSameSourceExecPin = edge.source === params.source && edge.sourceHandle === params.sourceHandle;
        const isSameTargetExecPin = edge.target === params.target && edge.targetHandle === params.targetHandle;

        return !isSameSourceExecPin && !isSameTargetExecPin;
      });

      addEdges({
        ...params,
        animated: true,
        class: 'crawlers-edge-connected'
      });
    }
  };

  /**
   * 函数：处理连接结束。
   * @param {MouseEvent} event 鼠标事件（可选）。
   * @returns {void} 无返回值。
   */
  const handleConnectEnd = (event?: MouseEvent): void => {
    console.log('on connect end', event);
    console.log('nodes', nodes.value);
    console.log('edges', edges.value);
  };

  return {
    initializeDefaultNodes,
    handleNodesChange,
    handleConnectStart,
    isValidConnection,
    handleConnect,
    handleConnectEnd
  };
};
