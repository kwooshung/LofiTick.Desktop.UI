import type { Connection, GraphNode, NodeChange, NodePositionChange, OnConnectStartParams } from '@vue-flow/core';

import type { TBasicSidePinDataType } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersEditorLogicOptions, ICrawlersEditorLogicResult, IGetHelperLinesResult } from '@/composables/hooks/useCrawlersEditorLogic/index.types';

/**
 * 组合式：编辑器画布交互逻辑。
 * @param {ICrawlersEditorLogicOptions} options 逻辑依赖。
 * @returns {ICrawlersEditorLogicResult} 画布事件处理函数。
 */
export const useCrawlersEditorLogic = (options: ICrawlersEditorLogicOptions): ICrawlersEditorLogicResult => {
  const { nodes, edges, stateHelperLineHorizontal, stateHelperLineVertical, addEdges, applyNodeChanges, addNodes } = options;

  /**
   * 类型：节点矩形边界。
   */
  type TNodeBounds = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  };

  /**
   * 函数：从 handle id 推断引脚数据类型。
   * @param {string | null | undefined} handleId 引脚 handle 标识。
   * @returns {TBasicSidePinDataType | 'unknown'} 推断结果。
   */
  const inferDataTypeFromHandleId = (handleId?: string | null): TBasicSidePinDataType | 'unknown' => {
    /**
     * 常量：id。
     */
    const id = String(handleId ?? '')
      .trim()
      .toLowerCase();

    if (id === '') {
      return 'unknown';
    }

    if (id === 'exec-in' || id === 'exec-out' || id.includes('exec')) {
      return 'exec';
    }

    if (id.includes('boolean') || id.includes('bool')) {
      return 'boolean';
    }

    if (id.includes('string') || id.includes('message') || id.includes('text') || id.includes('info')) {
      return 'string';
    }

    if (id.includes('number') || id.includes('integer') || id.includes('int') || id.includes('float')) {
      return 'number';
    }

    if (id.includes('array') || id.includes('list')) {
      return 'array';
    }

    if (id.includes('object') || id.includes('struct') || id.includes('element')) {
      return 'object';
    }

    if (id.includes('any') || id.includes('context') || id.includes('item')) {
      return 'any';
    }

    return 'unknown';
  };

  /**
   * 函数：将推断出的类型规范化为边样式类型。
   * @param {TBasicSidePinDataType | 'unknown'} dataType 推断结果。
   * @returns {TBasicSidePinDataType} 可用于边样式的类型。
   */
  const normalizeEdgeDataType = (dataType: TBasicSidePinDataType | 'unknown'): TBasicSidePinDataType => {
    if (dataType === 'unknown') {
      return 'any';
    }

    return dataType;
  };

  /**
   * 函数：移除已有 class 中旧的边样式标记。
   * @param {string} className 原始 class。
   * @returns {string[]} 过滤后的 class 列表。
   */
  const removeLegacyEdgeVisualClasses = (className: string): string[] => {
    return className
      .split(/\s+/)
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .filter((item) => !item.startsWith('crawlers-edge-'));
  };

  /**
   * 函数：根据连接信息构建边的视觉样式信息。
   * @param {string | null | undefined} sourceHandle 源 handle。
   * @param {string | null | undefined} targetHandle 目标 handle。
   * @returns {{ isExecConnection: boolean; edgeDataType: TBasicSidePinDataType }} 样式信息。
   */
  const getEdgeVisualMeta = (sourceHandle?: string | null, targetHandle?: string | null): { isExecConnection: boolean; edgeDataType: TBasicSidePinDataType } => {
    /**
     * 函数：isExecConnection。
     */
    const isExecConnection = sourceHandle === 'exec-out' && targetHandle === 'exec-in';
    /**
     * 常量：sourceType。
     */
    const sourceType = normalizeEdgeDataType(inferDataTypeFromHandleId(sourceHandle));
    /**
     * 常量：targetType。
     */
    const targetType = normalizeEdgeDataType(inferDataTypeFromHandleId(targetHandle));
    /**
     * 常量：edgeDataType。
     */
    const edgeDataType = sourceType === 'any' ? targetType : sourceType;

    return {
      isExecConnection,
      edgeDataType
    };
  };

  /**
   * 函数：构建边 class 字符串。
   * @param {string} currentClass 当前 class。
   * @param {TBasicSidePinDataType} edgeDataType 边数据类型。
   * @param {boolean} isExecConnection 是否执行线。
   * @returns {string} 规范化后的 class。
   */
  const buildEdgeClassName = (currentClass: string, edgeDataType: TBasicSidePinDataType, isExecConnection: boolean): string => {
    /**
     * 常量：baseClasses。
     */
    const baseClasses = removeLegacyEdgeVisualClasses(currentClass);

    return [...baseClasses, 'crawlers-edge-connected', `crawlers-edge-${edgeDataType}`, isExecConnection ? 'crawlers-edge-exec' : 'crawlers-edge-data'].join(' ');
  };

  /**
   * 监听：边集合变化时自动补齐视觉样式，保证历史边也遵循类型颜色规则。
   */
  watchEffect(() => {
    if (edges.value.length === 0) {
      return;
    }

    /**
     * 常量：changed。
     */
    let changed = false;
    /**
     * 常量：nextEdges。
     */
    const nextEdges = edges.value.map((edge) => {
      const { isExecConnection, edgeDataType } = getEdgeVisualMeta(edge.sourceHandle, edge.targetHandle);
      /**
       * 常量：nextClassName。
       */
      const nextClassName = buildEdgeClassName(String(edge.class ?? ''), edgeDataType, isExecConnection);

      if (String(edge.class ?? '') === nextClassName && Boolean(edge.animated) === isExecConnection) {
        return edge;
      }

      changed = true;

      return {
        ...edge,
        class: nextClassName,
        animated: isExecConnection
      };
    });

    if (changed) {
      edges.value = nextEdges;
    }
  });

  /**
   * 函数：校验普通数据引脚类型是否兼容。
   * @param {Connection} connection 连接参数。
   * @returns {boolean} 是否兼容。
   */
  const isValidDataPinConnection = (connection: Connection): boolean => {
    /**
     * 常量：sourceType。
     */
    const sourceType = inferDataTypeFromHandleId(connection.sourceHandle);
    /**
     * 常量：targetType。
     */
    const targetType = inferDataTypeFromHandleId(connection.targetHandle);

    if (sourceType === 'exec' || targetType === 'exec') {
      return false;
    }

    if (sourceType === 'unknown' || targetType === 'unknown') {
      return true;
    }

    if (sourceType === 'any' || targetType === 'any') {
      return true;
    }

    return sourceType === targetType;
  };

  /**
   * 函数：初始化默认起止节点。
   * @returns {void} 无返回值。
   */
  const initializeDefaultNodes = (): void => {
    if (nodes.value.length === 0) {
      addNodes({
        type: 'start',
        id: 'start',
        position: { x: 0, y: 0 },
        selectable: true,
        deletable: false
      });

      addNodes({
        type: 'end',
        id: 'end',
        position: { x: 1000, y: 0 },
        selectable: true,
        deletable: false
      });
    }
  };

  /**
   * 函数：获取节点边界。
   * @param {GraphNode} node 节点。
   * @param {{ x: number; y: number } | undefined} position 可选覆盖位置。
   * @returns {TNodeBounds} 节点边界。
   */
  const getNodeBounds = (node: GraphNode, position?: { x: number; y: number }): TNodeBounds => {
    /**
     * 常量：width。
     */
    const width = Number(node.dimensions.width ?? node.width ?? 0);
    /**
     * 常量：height。
     */
    const height = Number(node.dimensions.height ?? node.height ?? 0);
    /**
     * 常量：left。
     */
    const left = Number(position?.x ?? node.position.x ?? 0);
    /**
     * 常量：top。
     */
    const top = Number(position?.y ?? node.position.y ?? 0);

    return {
      left,
      right: left + width,
      top,
      bottom: top + height,
      width,
      height
    };
  };

  /**
   * 函数：基于边界盒计算辅助线与吸附位置。
   * @param {TNodeBounds} nodeABounds 当前拖拽边界盒。
   * @param {Set<string>} ignoredNodeIds 需要忽略的节点 ID 集合。
   * @param {GraphNode[]} nodes 当前节点集合。
   * @param {number} distance 吸附阈值。
   * @returns {IGetHelperLinesResult} 辅助线结果。
   */
  const getHelperLinesByBounds = (nodeABounds: TNodeBounds, ignoredNodeIds: Set<string>, nodes: GraphNode[], distance: number = 5): IGetHelperLinesResult => {
    /**
     * 常量：defaultResult。
     */
    const defaultResult: IGetHelperLinesResult = {
      horizontal: undefined,
      vertical: undefined,
      snapPosition: { x: undefined, y: undefined }
    };

    /**
     * 常量：horizontalDistance。
     */
    let horizontalDistance = distance;
    /**
     * 常量：verticalDistance。
     */
    let verticalDistance = distance;

    return nodes
      .filter((node) => !ignoredNodeIds.has(node.id))
      .reduce<IGetHelperLinesResult>((result, nodeB) => {
        /**
         * 常量：nodeBBounds。
         */
        const nodeBBounds = getNodeBounds(nodeB);

        /**
         * 常量：distanceLeftLeft。
         */
        const distanceLeftLeft = Math.abs(nodeABounds.left - nodeBBounds.left);

        if (distanceLeftLeft < verticalDistance) {
          result.snapPosition.x = nodeBBounds.left;
          result.vertical = nodeBBounds.left;
          verticalDistance = distanceLeftLeft;
        }

        /**
         * 常量：distanceRightRight。
         */
        const distanceRightRight = Math.abs(nodeABounds.right - nodeBBounds.right);

        if (distanceRightRight < verticalDistance) {
          result.snapPosition.x = nodeBBounds.right - nodeABounds.width;
          result.vertical = nodeBBounds.right;
          verticalDistance = distanceRightRight;
        }

        /**
         * 常量：distanceLeftRight。
         */
        const distanceLeftRight = Math.abs(nodeABounds.left - nodeBBounds.right);

        if (distanceLeftRight < verticalDistance) {
          result.snapPosition.x = nodeBBounds.right;
          result.vertical = nodeBBounds.right;
          verticalDistance = distanceLeftRight;
        }

        /**
         * 常量：distanceRightLeft。
         */
        const distanceRightLeft = Math.abs(nodeABounds.right - nodeBBounds.left);

        if (distanceRightLeft < verticalDistance) {
          result.snapPosition.x = nodeBBounds.left - nodeABounds.width;
          result.vertical = nodeBBounds.left;
          verticalDistance = distanceRightLeft;
        }

        /**
         * 常量：distanceTopTop。
         */
        const distanceTopTop = Math.abs(nodeABounds.top - nodeBBounds.top);

        if (distanceTopTop < horizontalDistance) {
          result.snapPosition.y = nodeBBounds.top;
          result.horizontal = nodeBBounds.top;
          horizontalDistance = distanceTopTop;
        }

        /**
         * 常量：distanceBottomTop。
         */
        const distanceBottomTop = Math.abs(nodeABounds.bottom - nodeBBounds.top);

        if (distanceBottomTop < horizontalDistance) {
          result.snapPosition.y = nodeBBounds.top - nodeABounds.height;
          result.horizontal = nodeBBounds.top;
          horizontalDistance = distanceBottomTop;
        }

        /**
         * 常量：distanceBottomBottom。
         */
        const distanceBottomBottom = Math.abs(nodeABounds.bottom - nodeBBounds.bottom);

        if (distanceBottomBottom < horizontalDistance) {
          result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height;
          result.horizontal = nodeBBounds.bottom;
          horizontalDistance = distanceBottomBottom;
        }

        /**
         * 常量：distanceTopBottom。
         */
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
   * 函数：计算节点拖拽时的辅助线与吸附位置。
   * @param {NodePositionChange} change 节点位置变更。
   * @param {GraphNode[]} nodes 当前节点集合。
   * @param {number} distance 吸附阈值。
   * @returns {IGetHelperLinesResult} 辅助线结果。
   */
  const getHelperLines = (change: NodePositionChange, nodes: GraphNode[], distance: number = 5): IGetHelperLinesResult => {
    /**
     * 常量：defaultResult。
     */
    const defaultResult: IGetHelperLinesResult = {
      horizontal: undefined,
      vertical: undefined,
      snapPosition: { x: undefined, y: undefined }
    };
    /**
     * 常量：nodeA。
     */
    const nodeA = nodes.find((node) => node.id === change.id);

    if (!nodeA || !change.position) {
      return defaultResult;
    }

    return getHelperLinesByBounds(getNodeBounds(nodeA, change.position), new Set([nodeA.id]), nodes, distance);
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

    /**
     * 常量：positionChanges。
     */
    const positionChanges = changes.filter((change): change is NodePositionChange => change.type === 'position' && Boolean(change.dragging) && Boolean(change.position));

    if (positionChanges.length === 0) {
      return changes;
    }

    /**
     * 状态：statePositionChange。
     */
    const statePositionChange = positionChanges.length === 1 ? positionChanges[0] : undefined;

    if (statePositionChange?.type === 'position' && statePositionChange.dragging && statePositionChange.position) {
      /**
       * 常量：helperLines。
       */
      const helperLines = getHelperLines(statePositionChange as NodePositionChange, nodes);

      statePositionChange.position.x = helperLines.snapPosition.x ?? statePositionChange.position.x;
      statePositionChange.position.y = helperLines.snapPosition.y ?? statePositionChange.position.y;

      stateHelperLineHorizontal.value = helperLines.horizontal;
      stateHelperLineVertical.value = helperLines.vertical;

      return changes;
    }

    /**
     * 常量：draggingNodeIds。
     */
    const draggingNodeIds = new Set(positionChanges.map((change) => change.id));
    /**
     * 常量：draggingBounds。
     */
    const draggingBounds = positionChanges
      .map((change) => {
        /**
         * 常量：node。
         */
        const node = nodes.find((item) => item.id === change.id);

        if (!node || !change.position) {
          return undefined;
        }

        return getNodeBounds(node, change.position);
      })
      .filter((item): item is TNodeBounds => Boolean(item));

    if (draggingBounds.length === 0) {
      return changes;
    }

    /**
     * 常量：groupBounds。
     */
    const [firstDraggingBounds, ...restDraggingBounds] = draggingBounds;

    if (!firstDraggingBounds) {
      return changes;
    }

    const groupBounds = restDraggingBounds.reduce<TNodeBounds>((result, bounds) => {
      return {
        left: Math.min(result.left, bounds.left),
        right: Math.max(result.right, bounds.right),
        top: Math.min(result.top, bounds.top),
        bottom: Math.max(result.bottom, bounds.bottom),
        width: Math.max(result.right, bounds.right) - Math.min(result.left, bounds.left),
        height: Math.max(result.bottom, bounds.bottom) - Math.min(result.top, bounds.top)
      };
    }, firstDraggingBounds);

    /**
     * 常量：helperLines。
     */
    const helperLines = getHelperLinesByBounds(groupBounds, draggingNodeIds, nodes);
    /**
     * 常量：deltaX。
     */
    const deltaX = helperLines.snapPosition.x === undefined ? 0 : helperLines.snapPosition.x - groupBounds.left;
    /**
     * 常量：deltaY。
     */
    const deltaY = helperLines.snapPosition.y === undefined ? 0 : helperLines.snapPosition.y - groupBounds.top;

    if (deltaX !== 0 || deltaY !== 0) {
      positionChanges.forEach((change) => {
        if (!change.position) {
          return;
        }

        change.position.x += deltaX;
        change.position.y += deltaY;
      });
    }

    stateHelperLineHorizontal.value = helperLines.horizontal;
    stateHelperLineVertical.value = helperLines.vertical;

    return changes;
  };

  /**
   * 函数：处理节点变更并应用辅助线吸附。
   * @param {NodeChange[]} changes 节点变更集合。
   * @returns {void} 无返回值。
   */
  const handleNodesChange = (changes: NodeChange[]): void => {
    /**
     * 函数：updatedChanges。
     */
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
    if (!connection.source) {
      return false;
    }

    // 拖拽过程中的半连接状态先放行，避免数据引脚无法吸附。
    if (!connection.sourceHandle || !connection.targetHandle) {
      return true;
    }

    /**
     * 函数：isExecConnection。
     */
    const isExecConnection = connection.sourceHandle === 'exec-out' && connection.targetHandle === 'exec-in';

    if (!connection.target) {
      return isExecConnection || isValidDataPinConnection(connection);
    }

    // 禁止同节点自连。
    if (connection.source === connection.target) {
      return false;
    }

    return isExecConnection || isValidDataPinConnection(connection);
  };

  /**
   * 函数：处理连接完成。
   * @param {Connection} params 连接参数。
   * @returns {void} 无返回值。
   */
  const handleConnect = (params: Connection): void => {
    if (isValidConnection(params)) {
      const { isExecConnection, edgeDataType } = getEdgeVisualMeta(params.sourceHandle, params.targetHandle);

      if (isExecConnection) {
        // UE 蓝图风格：同一个执行输出引脚和执行输入引脚都只允许保留一条线。
        edges.value = edges.value.filter((edge) => {
          /**
           * 函数：isSameSourceExecPin。
           */
          const isSameSourceExecPin = edge.source === params.source && edge.sourceHandle === params.sourceHandle;
          /**
           * 函数：isSameTargetExecPin。
           */
          const isSameTargetExecPin = edge.target === params.target && edge.targetHandle === params.targetHandle;

          return !isSameSourceExecPin && !isSameTargetExecPin;
        });
      } else {
        /**
         * 函数：hasSameDataEdge。
         */
        const hasSameDataEdge = edges.value.some((edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle && edge.target === params.target && edge.targetHandle === params.targetHandle);

        if (hasSameDataEdge) {
          return;
        }
      }

      addEdges({
        ...params,
        animated: isExecConnection,
        class: buildEdgeClassName('', edgeDataType, isExecConnection)
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
