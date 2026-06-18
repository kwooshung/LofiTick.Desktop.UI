<template>
  <canvas ref="refCanvas" class="vueflow-canvas" />
</template>

<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core';

import type { IHelperLinesProps } from '@/components/crawlers/editor/lines/helper/index.types';

/**
 * 属性：辅助线坐标。
 */
const props = defineProps<IHelperLinesProps>();

/**
 * 计算属性：水平辅助线坐标。
 */
const horizontal = computed(() => props.horizontal);

/**
 * 计算属性：垂直辅助线坐标。
 */
const vertical = computed(() => props.vertical);

/**
 * Hook：Vue Flow 视口与尺寸信息。
 */
const { viewport, dimensions } = useVueFlow();

/**
 * 变量：画布元素引用。
 */
const refCanvas = ref<HTMLCanvasElement | null>(null);

/**
 * 计算属性：画布宽度。
 */
const width = computed(() => dimensions.value.width);

/**
 * 计算属性：画布高度。
 */
const height = computed(() => dimensions.value.height);

/**
 * 计算属性：视口 X 偏移。
 */
const x = computed(() => viewport.value.x);

/**
 * 计算属性：视口 Y 偏移。
 */
const y = computed(() => viewport.value.y);

/**
 * 计算属性：视口缩放。
 */
const zoom = computed(() => viewport.value.zoom);

/**
 * 函数：重绘辅助线画布。
 * @returns {void} 无返回值。
 */
const updateCanvasHelperLines = (): void => {
  /**
   * 常量：canvas。
   */
  const canvas = refCanvas.value;
  /**
   * 常量：ctx。
   */
  const ctx = canvas?.getContext('2d');

  if (!ctx || !canvas) {
    return;
  }

  /**
   * 常量：dpi。
   */
  const dpi = window.devicePixelRatio;
  canvas.width = width.value * dpi;
  canvas.height = height.value * dpi;

  ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
  ctx.beginPath();
  ctx.clearRect(0, 0, width.value, height.value);
  ctx.strokeStyle = '#00a63e';

  if (typeof vertical.value === 'number') {
    ctx.moveTo(vertical.value * zoom.value + x.value, 0);
    ctx.lineTo(vertical.value * zoom.value + x.value, height.value);
    ctx.stroke();
  }

  if (typeof horizontal.value === 'number') {
    ctx.moveTo(0, horizontal.value * zoom.value + y.value);
    ctx.lineTo(width.value, horizontal.value * zoom.value + y.value);
    ctx.stroke();
  }
};

/**
 * 监听：视口、尺寸或辅助线变化时重绘画布。
 */
watch([width, height, x, y, zoom, horizontal, vertical], () => updateCanvasHelperLines(), { immediate: true, deep: true });
</script>

<style scoped>
.vueflow-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
