<template>
  <g @dblclick="handleEdgeDoubleClick">
    <BaseEdge :id="props.id" :style="props.style" :path="computedPath[0]" :marker-end="props.markerEnd" :label="props.data?.text" :label-x="computedPath[1]" :label-y="computedPath[2]" :label-style="{ fill: 'white' }" :label-show-bg="true" :label-bg-style="{ fill: 'red' }" :label-bg-padding="[2, 4]" :label-bg-border-radius="2" />

    <circle
      v-for="(point, index) in computedPoints"
      :key="`${props.id}-${index}`"
      class="crawlers-edge-bend-point"
      :class="{ 'crawlers-edge-bend-point-selected': stateSelectedPointIndex === index }"
      :cx="point.x"
      :cy="point.y"
      r="5"
      tabindex="0"
      @pointerdown.stop.prevent="(event) => handlePointPointerDown(event, index)"
      @dblclick.stop.prevent="() => handlePointRemove(index)"
    />
  </g>
</template>

<script setup lang="ts">
import type { EdgeProps, XYPosition } from '@vue-flow/core';
import { BaseEdge, getBezierPath, useVueFlow } from '@vue-flow/core';

import type { ILineEdgeData, ILineEdgePoint } from '@/components/crawlers/editor/lines/edge/index.types';

/**
 * 配置：不继承外部 attrs。
 */
defineOptions({
  inheritAttrs: false
});

/**
 * 属性：边组件入参。
 */
/**
 * Props：组件入参。
 */
const props = defineProps<EdgeProps<ILineEdgeData>>();

/**
 * Hook：Vue Flow 边集合。
 */
const { edges, screenToFlowCoordinate } = useVueFlow();

/**
 * 状态：当前选中的拐点序号。
 */
const stateSelectedPointIndex = ref<number | null>(null);

/**
 * 状态：当前拖拽中的拐点序号。
 */
const stateDraggingPointIndex = ref<number | null>(null);

/**
 * 函数：规范化拐点坐标。
 * @param {unknown} value 原始拐点数据。
 * @returns {ILineEdgePoint[]} 可渲染的拐点集合。
 */
const normalizePoints = (value: unknown): ILineEdgePoint[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const point = item as Partial<XYPosition>;
    const x = Number(point.x);
    const y = Number(point.y);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return [];
    }

    return [{ x, y }];
  });
};

/**
 * 计算属性：当前边拐点集合。
 */
const computedPoints = computed<ILineEdgePoint[]>(() => normalizePoints(props.data?.points));

/**
 * 函数：构建折线路径。
 * @param {XYPosition[]} points 路径点集合。
 * @returns {string} SVG path。
 */
const buildPolylinePath = (points: XYPosition[]): string => {
  if (points.length === 0) {
    return '';
  }

  const [firstPoint, ...restPoints] = points;
  return [`M ${firstPoint.x} ${firstPoint.y}`, ...restPoints.map((point) => `L ${point.x} ${point.y}`)].join(' ');
};

/**
 * 函数：计算两点中点。
 * @param {XYPosition} start 起点。
 * @param {XYPosition} end 终点。
 * @returns {XYPosition} 中点。
 */
const midpoint = (start: XYPosition, end: XYPosition): XYPosition => ({
  x: (start.x + end.x) / 2,
  y: (start.y + end.y) / 2
});

/**
 * 函数：计算点到线段距离。
 * @param {XYPosition} point 目标点。
 * @param {XYPosition} start 线段起点。
 * @param {XYPosition} end 线段终点。
 * @returns {number} 距离。
 */
const distanceToSegment = (point: XYPosition, start: XYPosition, end: XYPosition): number => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;

  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * deltaX + (point.y - start.y) * deltaY) / lengthSquared));
  const projected = {
    x: start.x + ratio * deltaX,
    y: start.y + ratio * deltaY
  };

  return Math.hypot(point.x - projected.x, point.y - projected.y);
};

/**
 * 函数：查找拐点插入位置。
 * @param {XYPosition} point 新拐点。
 * @returns {number} 插入序号。
 */
const findInsertIndex = (point: XYPosition): number => {
  const routePoints = [{ x: props.sourceX, y: props.sourceY }, ...computedPoints.value, { x: props.targetX, y: props.targetY }];

  if (routePoints.length <= 2) {
    return 0;
  }

  let insertIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < routePoints.length - 1; index += 1) {
    const distance = distanceToSegment(point, routePoints[index], routePoints[index + 1]);

    if (distance < bestDistance) {
      bestDistance = distance;
      insertIndex = index;
    }
  }

  return insertIndex;
};

/**
 * 函数：更新当前边拐点。
 * @param {ILineEdgePoint[]} points 下一组拐点。
 * @returns {void} 无返回值。
 */
const updatePoints = (points: ILineEdgePoint[]): void => {
  edges.value = edges.value.map((edge) => {
    if (edge.id !== props.id) {
      return edge;
    }

    const nextData = {
      ...(edge.data ?? {}),
      points
    } satisfies ILineEdgeData;

    return {
      ...edge,
      type: edge.type ?? 'crawler',
      data: nextData
    };
  });
};

/**
 * 计算属性：边路径。
 */
const computedPath = computed<[string, number, number]>(() => {
  if (computedPoints.value.length > 0) {
    const routePoints = [{ x: props.sourceX, y: props.sourceY }, ...computedPoints.value, { x: props.targetX, y: props.targetY }];
    const labelPoint = midpoint(routePoints[Math.floor((routePoints.length - 1) / 2)], routePoints[Math.ceil((routePoints.length - 1) / 2)]);

    return [buildPolylinePath(routePoints), labelPoint.x, labelPoint.y];
  }

  return getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
    curvature: props.curvature
  });
});

/**
 * 事件：双击边路径时新增拐点。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleEdgeDoubleClick = (event: MouseEvent): void => {
  event.preventDefault();
  const point = screenToFlowCoordinate({ x: event.clientX, y: event.clientY });
  const nextPoints = [...computedPoints.value];
  const insertIndex = findInsertIndex(point);
  nextPoints.splice(insertIndex, 0, point);
  updatePoints(nextPoints);
  stateSelectedPointIndex.value = insertIndex;
};

/**
 * 事件：删除拐点。
 * @param {number} index 拐点序号。
 * @returns {void} 无返回值。
 */
const handlePointRemove = (index: number): void => {
  const nextPoints = computedPoints.value.filter((_point, pointIndex) => pointIndex !== index);
  updatePoints(nextPoints);
  stateSelectedPointIndex.value = null;
};

/**
 * 事件：按下拐点开始选择或拖拽。
 * @param {PointerEvent} event 指针事件。
 * @param {number} index 拐点序号。
 * @returns {void} 无返回值。
 */
const handlePointPointerDown = (event: PointerEvent, index: number): void => {
  stateSelectedPointIndex.value = index;
  stateDraggingPointIndex.value = index;
  (event.currentTarget as SVGCircleElement | null)?.focus();
};

/**
 * 事件：拖拽拐点。
 * @param {PointerEvent} event 指针事件。
 * @returns {void} 无返回值。
 */
const handleWindowPointerMove = (event: PointerEvent): void => {
  if (stateDraggingPointIndex.value === null) {
    return;
  }

  const point = screenToFlowCoordinate({ x: event.clientX, y: event.clientY });
  const nextPoints = computedPoints.value.map((item, index) => (index === stateDraggingPointIndex.value ? point : item));
  updatePoints(nextPoints);
};

/**
 * 事件：结束拐点拖拽。
 * @returns {void} 无返回值。
 */
const handleWindowPointerUp = (): void => {
  stateDraggingPointIndex.value = null;
};

/**
 * 事件：键盘删除已选拐点。
 * @param {KeyboardEvent} event 键盘事件。
 * @returns {void} 无返回值。
 */
const handleWindowKeydown = (event: KeyboardEvent): void => {
  if (stateSelectedPointIndex.value === null || (event.key !== 'Delete' && event.key !== 'Backspace')) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  handlePointRemove(stateSelectedPointIndex.value);
};

onMounted(() => {
  window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
  window.addEventListener('pointerup', handleWindowPointerUp, { passive: true });
  window.addEventListener('keydown', handleWindowKeydown, { capture: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handleWindowPointerMove);
  window.removeEventListener('pointerup', handleWindowPointerUp);
  window.removeEventListener('keydown', handleWindowKeydown, { capture: true });
});
</script>
