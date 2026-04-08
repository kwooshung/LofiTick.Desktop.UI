<template>
  <div class="relative">
    <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="stateInternalSpinning" class="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm" :class="props.maskClass">
        <div :class="['flex flex-col items-center justify-center', computedContainerClasses]">
          <UIcon :name="props.icon" :size="computedSpinnerSize" :class="['animate-spin', props.iconClass]" />
          <span v-if="tip" class="text-sm text-gray-600 dark:text-gray-400">
            {{ tip }}
          </span>
        </div>
      </div>
      <slot v-else />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ISpinProps, TSpinSizePreset } from './index.types';

/**
 * 组件：属性
 */
const props = withDefaults(defineProps<ISpinProps>(), {
  loading: false,
  icon: 'i-gg:spinner',
  tip: '',
  size: 'default',
  delay: 300,
  iconClass: 'text-primary',
  maskClass: 'bg-white/80 dark:bg-gray-900/80'
});

/**
 * 状态：内部加载状态（处理延迟）
 */
const stateInternalSpinning = ref<boolean>(props.loading);

/**
 * 计算属性：Spinner 尺寸（UIcon size 支持字符串/数字）
 */
const computedSpinnerSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size;
  }
  const sizes: Record<TSpinSizePreset, number> = {
    small: 32,
    default: 48,
    large: 64
  };
  return sizes[props.size as TSpinSizePreset] ?? sizes.default;
});

/**
 * 计算属性：容器间距
 */
const computedContainerClasses = computed(() => {
  if (typeof props.size === 'number') {
    return 'gap-3';
  }
  const gaps: Record<TSpinSizePreset, string> = {
    small: 'gap-2',
    default: 'gap-3',
    large: 'gap-4'
  };
  return gaps[props.size as TSpinSizePreset] ?? gaps.default;
});

/**
 * 变量：延迟定时器
 */
let delayTimer: NodeJS.Timeout | null = null;

/**
 * 监听：spinning 变化
 */
watch(
  () => props.loading,
  (newVal) => {
    if (newVal) {
      // 开启加载：延迟显示
      if (props.delay > 0) {
        delayTimer = setTimeout(() => {
          stateInternalSpinning.value = true;
        }, props.delay);
      } else {
        stateInternalSpinning.value = true;
      }
    } else {
      // 关闭加载：立即隐藏，并取消延迟
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
      stateInternalSpinning.value = false;
    }
  },
  { immediate: true } // 初始同步
);

/**
 * 生命周期：清理定时器
 */
onUnmounted(() => {
  if (delayTimer) {
    clearTimeout(delayTimer);
  }
});
</script>
