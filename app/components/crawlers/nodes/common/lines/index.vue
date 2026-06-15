<template>
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" :label="data?.text" :label-x="path[1]" :label-y="path[2]" :label-style="{ fill: 'white' }" :label-show-bg="true" :label-bg-style="{ fill: 'red' }" :label-bg-padding="[2, 4]" :label-bg-border-radius="2" />
</template>

<script lang="ts" setup>
import type { EdgeProps } from '@vue-flow/core';
import { BaseEdge, getBezierPath } from '@vue-flow/core';

import type { ILineEdgeData } from '@/components/crawlers/nodes/common/lines/index.types';

/**
 * 配置：不继承外部 attrs。
 */
defineOptions({
  inheritAttrs: false
});

/**
 * 属性：边组件入参。
 */
const props = defineProps<EdgeProps<ILineEdgeData>>();

const path = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
    curvature: props.curvature
  })
);
</script>
