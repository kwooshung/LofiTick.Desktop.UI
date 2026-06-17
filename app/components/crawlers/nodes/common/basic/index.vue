<template>
  <div :class="['border-default bg-default/65 relative overflow-hidden rounded-lg border shadow-xs transition-all duration-200 ease-out', computedIsSelected ? 'ring-primary/45 border-primary shadow-lg ring-2' : 'hover:shadow-sm']">
    <div :class="['relative flex items-start p-4 transition-[filter] duration-200 ease-out', headerBg, computedIsSelected ? 'brightness-110 saturate-125' : '', showExecIn ? 'pl-8' : '', showExecOut ? 'pr-8' : '']">
      <div v-if="hasNodeContext && (showExecIn || showExecOut)" class="absolute inset-0">
        <Handle v-if="showExecIn" id="exec-in" type="target" :position="Position.Left" :is-valid-connection="isValidConnectionTarget" class="absolute left-4! h-5! w-4! cursor-crosshair! rounded-none! border-0! bg-white [clip-path:polygon(0_0,100%_50%,0_100%)]" />
        <Handle v-if="showExecOut" id="exec-out" type="source" :position="Position.Right" :is-valid-connection="isValidConnectionSource" class="absolute right-4! h-5! w-4! cursor-crosshair! rounded-none! border-0! bg-white [clip-path:polygon(0_0,100%_50%,0_100%)]" />
      </div>
      <slot name="icon">
        <UIcon :name="iconName" :class="['mt-0.5 mr-3 shrink-0 text-xl', iconClass]" />
      </slot>
      <div class="flex flex-col">
        <h3 :class="['text-md m-0 truncate leading-snug font-bold', titleClass]">{{ title }}</h3>
        <p v-if="description" :class="['m-0 mt-0.5 truncate text-sm', descriptionClass]">{{ description }}</p>
      </div>
    </div>
    <div v-if="$slots.default || computedHasLeftPins || computedHasRightPins" class="flex items-stretch">
      <div v-if="computedHasLeftPins" class="nodrag flex shrink-0 cursor-auto flex-col gap-1 py-3 pl-3">
        <template v-for="pin in computedLeftPins" :key="pin.id">
          <div class="relative flex min-h-5 items-center justify-start cursor-default pl-3.25 gap-1.5">
            <Handle :id="pin.id" type="target" :position="Position.Left" :is-valid-connection="isValidSidePinTarget" :class="['h-3! w-3!', resolvePinColorClass(pin.dataType)]" />
            <div class="grow text-left">
              <UTooltip :text="pin.description || ''" :content="{ side: 'top' }" :disabled="!pin.description">
                <span class="block truncate text-left text-sm leading-5 font-medium">{{ pin.label }}</span>
              </UTooltip>
            </div>
          </div>
        </template>
      </div>

      <div class="flex-1">
        <div v-if="$slots.default" class="nodrag cursor-auto px-4 py-3">
          <slot />
        </div>
      </div>

      <div v-if="computedHasRightPins" class="nodrag flex shrink-0 cursor-auto flex-col gap-1 py-3 pr-3">
        <template v-for="pin in computedRightPins" :key="pin.id">
          <div class="relative flex min-h-5 items-center justify-end cursor-default pr-3.25 gap-1.5">
            <div class="grow text-right">
              <UTooltip :text="pin.description || ''" :content="{ side: 'top' }" :disabled="!pin.description">
                <span class="block truncate text-right text-sm leading-5 font-medium">{{ pin.label }}</span>
              </UTooltip>
            </div>
            <Handle :id="pin.id" type="source" :position="Position.Right" :is-valid-connection="isValidSidePinSource" :class="['h-3! w-3!', resolvePinColorClass(pin.dataType)]" />
          </div>
        </template>
      </div>
    </div>

    <div v-if="$slots.footer" class="nodrag cursor-auto pr-4 pb-4 pl-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Connection } from '@vue-flow/core';
import { Handle, Position, useNode, useNodeId } from '@vue-flow/core';

import type { IBasicSidePin, ICrawlersNodesCommonBasicProps, TBasicSidePinDataType } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 属性：基础节点配置。
 */
const { title, titleClass = 'text-white', iconName = 'i-lucide-monitor', iconClass = 'text-white/80', description, descriptionClass = 'text-white/70', headerBg, showExecIn = true, showExecOut = true, leftPins = [], rightPins = [] } = defineProps<ICrawlersNodesCommonBasicProps>();

/**
 * 常量：当前组件使用的引脚类型颜色类名映射。
 */
const BASIC_SIDE_PIN_COLOR_CLASS_MAP: Record<TBasicSidePinDataType, string> = {
  exec: 'bg-amber-400',
  string: 'bg-fuchsia-500',
  number: 'bg-teal-400',
  boolean: 'bg-red-500',
  array: 'bg-yellow-400',
  object: 'bg-blue-500',
  any: 'bg-gray-400'
};

/**
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();

/**
 * Hook：当前节点实例。
 */
const stateNode = useNode();

/**
 * 计算属性：左侧引脚配置。
 */
const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return leftPins.filter((pin) => pin.direction === 'in');
});

/**
 * 计算属性：右侧引脚配置。
 */
const computedRightPins = computed<IBasicSidePin[]>(() => {
  return rightPins.filter((pin) => pin.direction === 'out');
});

/**
 * 计算属性：是否存在左侧引脚列。
 */
const computedHasLeftPins = computed(() => computedLeftPins.value.length > 0);

/**
 * 计算属性：是否存在右侧引脚列。
 */
const computedHasRightPins = computed(() => computedRightPins.value.length > 0);

/**
 * 计算属性：当前组件是否运行在 Vue Flow 节点上下文中。
 */
const hasNodeContext = computed(() => String(stateNodeId ?? '').trim() !== '');

/**
 * 计算属性：当前节点是否处于选中状态。
 */
const computedIsSelected = computed(() => Boolean(stateNode.node.selected));

/**
 * 函数：解析引脚颜色类名。
 *
 * # Arguments
 *
 * * `dataType` - 引脚数据类型。
 *
 * # Returns
 *
 * 返回对应的 Tailwind 颜色类名；未识别时回退为 any 类型颜色类名。
 */
const resolvePinColorClass = (dataType: TBasicSidePinDataType): string => {
  return BASIC_SIDE_PIN_COLOR_CLASS_MAP[dataType] ?? BASIC_SIDE_PIN_COLOR_CLASS_MAP.any;
};

/**
 * 函数：从 handle id 推断数据类型。
 *
 * # Arguments
 *
 * * `handleId` - 连接端点 handle 标识。
 *
 * # Returns
 *
 * 返回可识别的数据类型；无法识别时返回 unknown。
 */
const inferDataTypeFromHandleId = (handleId?: string | null): TBasicSidePinDataType | 'unknown' => {
  const id = String(handleId ?? '')
    .trim()
    .toLowerCase();

  if (id === '') {
    return 'unknown';
  }

  if (id === 'exec-in' || id === 'exec-out' || id.includes('exec')) {
    return 'exec';
  }

  if (id.includes('boolean') || id.includes('bool') || id.includes('result')) {
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

  if (id.includes('any')) {
    return 'any';
  }

  return 'unknown';
};

/**
 * 函数：验证普通数据引脚是否类型兼容。
 *
 * # Arguments
 *
 * * `connection` - 当前连接信息。
 *
 * # Returns
 *
 * 类型兼容返回 true，否则返回 false。
 */
const isValidSidePinDataTypeConnection = (connection: Connection): boolean => {
  const sourceType = inferDataTypeFromHandleId(connection.sourceHandle);
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
 * 函数：验证连接是否满足 exec-out -> exec-in 规则。
 */
const isExecConnection = (connection: Connection): boolean => {
  return connection.sourceHandle === 'exec-out' && connection.targetHandle === 'exec-in';
};

/**
 * 函数：验证连接目标是否合法（仅允许其他节点的 exec-out 连接到当前节点 exec-in）。
 */
const isValidConnectionTarget = (connection: Connection): boolean => {
  console.log('validate connection target', connection);
  return isExecConnection(connection) && connection.source !== stateNodeId;
};

/**
 * 函数：验证连接源是否合法（仅允许当前节点 exec-out 连接到其他节点 exec-in）。
 */
const isValidConnectionSource = (connection: Connection): boolean => {
  console.log('validate connection source', connection);
  return isExecConnection(connection) && connection.target !== stateNodeId;
};

/**
 * 函数：验证左侧普通引脚连接目标是否合法。
 *
 * # Arguments
 *
 * * `connection` - 当前连接信息。
 *
 * # Returns
 *
 * 仅阻止节点连接到自身，其余交由上层流程决定。
 */
const isValidSidePinTarget = (connection: Connection): boolean => {
  if (!connection.source) {
    return false;
  }

  if (connection.source === stateNodeId) {
    return false;
  }

  // 拖拽过程中 targetHandle 可能暂未确定，先放行，落到目标引脚后再做类型校验。
  if (!connection.sourceHandle || !connection.targetHandle) {
    return true;
  }

  return isValidSidePinDataTypeConnection(connection);
};

/**
 * 函数：验证右侧普通引脚连接源是否合法。
 *
 * # Arguments
 *
 * * `connection` - 当前连接信息。
 *
 * # Returns
 *
 * 仅阻止节点连接到自身，其余交由上层流程决定。
 */
const isValidSidePinSource = (connection: Connection): boolean => {
  if (!connection.source) {
    return false;
  }

  if (connection.target && connection.target === stateNodeId) {
    return false;
  }

  // 拖拽过程中 targetHandle 可能暂未确定，先放行，落到目标引脚后再做类型校验。
  if (!connection.sourceHandle || !connection.targetHandle) {
    return true;
  }

  return isValidSidePinDataTypeConnection(connection);
};
</script>
