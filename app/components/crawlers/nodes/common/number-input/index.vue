<template>
  <div :class="computedRootClass">
    <label v-if="computedShowPrefix" :for="id" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ prefix }}</label>
    <div :class="computedInputWrapClass">
      <UInputNumber
        :id="id"
        :model-value="modelValue"
        orientation="vertical"
        :min="min"
        :step="step"
        color="primary"
        variant="none"
        class="h-8 w-full"
        :increment="{ color: 'neutral', variant: 'soft' }"
        :decrement="{ color: 'neutral', variant: 'soft' }"
        @update:model-value="handleModelValueUpdate"
      />
    </div>
    <label v-if="computedShowUnit" :for="id" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ unit }}</label>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersNodesCommonNumberInputProps } from '@/components/crawlers/nodes/common/number-input/index.types';

/**
 * 属性：通用数值输入组件属性。
 */
const props = defineProps<ICrawlersNodesCommonNumberInputProps>();

/**
 * 计算属性：是否显示前缀标签。
 */
const computedShowPrefix = computed(() => {
  /**
   * 常量：prefix。
   */
  const prefix = String(props.prefix ?? '').trim();

  return prefix !== '' && prefix !== '#';
});

/**
 * 计算属性：是否显示单位标签。
 */
const computedShowUnit = computed(() => {
  /**
   * 常量：unit。
   */
  const unit = String(props.unit ?? '').trim();

  return unit !== '';
});

/**
 * 计算属性：根容器样式类。
 */
const computedRootClass = computed(() => {
  if (computedShowPrefix.value && computedShowUnit.value) {
    return 'grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center';
  }

  if (computedShowPrefix.value) {
    return 'grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)] items-center self-center';
  }

  if (computedShowUnit.value) {
    return 'grid w-60 shrink-0 grid-cols-[minmax(0,1fr)_3rem] items-center self-center';
  }

  return 'grid w-60 shrink-0 grid-cols-[minmax(0,1fr)] items-center self-center';
});

/**
 * 计算属性：输入包裹容器样式类。
 */
const computedInputWrapClass = computed(() => {
  if (computedShowPrefix.value && computedShowUnit.value) {
    return 'border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center border transition-colors duration-300';
  }

  if (computedShowPrefix.value) {
    return 'border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center rounded-r-sm border transition-colors duration-300';
  }

  if (computedShowUnit.value) {
    return 'border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center rounded-l-sm border transition-colors duration-300';
  }

  return 'border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center rounded-sm border transition-colors duration-300';
});

/**
 * 事件：组件更新事件。
 */
const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

/**
 * 函数：处理数值更新事件。
 * @param {number | null | undefined} value 最新值。
 */
const handleModelValueUpdate = (value: number | null | undefined): void => {
  emit('update:modelValue', Number.isFinite(Number(value)) ? Number(value) : props.min);
};
</script>
