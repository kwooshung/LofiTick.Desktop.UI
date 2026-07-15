<template>
  <div class="relative">
    <slot v-if="overlay || !stateInternalSpinning" />

    <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="stateInternalSpinning" class="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm" :class="maskClass">
        <div :class="computedContentClass">
          <UIcon :name="icon" :size="computedSpinnerSize" :class="['animate-spin', iconClass]" />
          <span v-if="tip" :class="tipClass">
            {{ tip }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ISpinProps, TSpinSizePreset } from '@/components/spin/index.types';
import { useTimeoutFn } from '@vueuse/core';

/**
 * 组件：属性
 */
/**
 * Props：组件入参。
 */
const { loading = false, icon = 'i-gg:spinner', overlay = false, tip = '', size = 'default', delay = 300, iconClass = 'text-primary', contentClass = '', tipClass = 'text-sm text-gray-600 dark:text-gray-400', maskClass = 'bg-white/80 dark:bg-gray-900/80' } = defineProps<ISpinProps>();

/**
 * 状态：内部加载状态（处理延迟）
 */
const stateInternalSpinning = ref<boolean>(loading);

/**
 * 计算属性：Spinner 尺寸（UIcon size 支持字符串/数字）
 */
const computedSpinnerSize = computed(() => {
  if (typeof size === 'number') {
    return size;
  }
  const sizes: Record<TSpinSizePreset, number> = {
    small: 32,
    default: 48,
    large: 64
  };
  return sizes[size as TSpinSizePreset] ?? sizes.default;
});

/**
 * 计算属性：容器间距
 */
const computedContainerClasses = computed(() => {
  if (typeof size === 'number') {
    return 'gap-3';
  }
  const gaps: Record<TSpinSizePreset, string> = {
    small: 'gap-2',
    default: 'gap-3',
    large: 'gap-4'
  };
  return gaps[size as TSpinSizePreset] ?? gaps.default;
});

/**
 * 计算属性：内容容器类名。
 */
const computedContentClass = computed(() => {
  return ['flex flex-col items-center justify-center', computedContainerClasses.value, contentClass].filter(Boolean).join(' ');
});

/**
 * 变量：延迟定时器
 */
const { start: startDelayTimer, stop: stopDelayTimer } = useTimeoutFn(
  () => {
    stateInternalSpinning.value = true;
  },
  delay,
  { immediate: false }
);

/**
 * 监听：spinning 变化
 */
watch(
  () => loading,
  (newVal) => {
    if (newVal) {
      // 开启加载：延迟显示
      if (delay > 0) {
        startDelayTimer();
      } else {
        stateInternalSpinning.value = true;
      }
    } else {
      // 关闭加载：立即隐藏，并取消延迟
      stopDelayTimer();
      stateInternalSpinning.value = false;
    }
  },
  { immediate: true } // 初始同步
);

/**
 * 生命周期：清理定时器
 */
onUnmounted(() => {
  stopDelayTimer();
});
</script>
