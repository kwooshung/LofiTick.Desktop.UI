<template>
  <div class="media-audio-waves flex" :class="{ 'media-audio-waves--order-132': stateRectOrderIs132 }" :style="{ height: `${props.height}px` }">
    <div
      ref="refInteractive"
      class="flex size-full cursor-pointer touch-none"
      :style="{ height: `${props.height}px` }"
      @pointermove="mediaAudioWavesPreviewUpdateByPointerEvent"
      @pointerleave="mediaAudioWavesPreviewClear"
      @pointerdown="mediaAudioWavesDragStart"
      @pointerup="mediaAudioWavesDragEnd"
      @pointercancel="mediaAudioWavesDragCancel"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <svg :viewBox="stateViewBox" width="100%" height="50%" x="0" y="25%" preserveAspectRatio="none">
          <defs>
            <clipPath :id="stateLineClipId">
              <path :d="props.waveformPath" stroke-width="0" />
            </clipPath>
          </defs>
          <g :clip-path="`url(#${stateLineClipId})`" class="text-neutral-400 dark:text-neutral-400">
            <rect width="100%" height="100%" fill="currentColor" />
            <g class="media-audio-waves__rects media-audio-waves__rects--123">
              <rect :width="stateProgressWidth" height="100%" fill="var(--ui-primary)" class="transition-width duration-200 ease-linear" />
              <rect :width="statePreviewWidth" height="100%" fill="var(--ui-color-primary-800)" />
            </g>
            <g class="media-audio-waves__rects media-audio-waves__rects--132">
              <rect :width="statePreviewWidth" height="100%" fill="var(--ui-color-primary-800)" />
              <rect :width="stateProgressWidth" height="100%" fill="var(--ui-primary)" class="transition-width duration-200 ease-linear" />
            </g>
          </g>
        </svg>
        <svg v-show="stateIndicatorVisible" :width="stateIndicatorWidth" height="100%">
          <line stroke="var(--ui-color-primary-500)" stroke-width="2" stroke-linecap="round" x1="100%" x2="100%" y1="0" y2="100%" />
        </svg>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IMediaAudioWavesEmits, IMediaAudioWavesProps } from './index.types';

/**
 * Props：组件属性
 */
const props = withDefaults(defineProps<IMediaAudioWavesProps>(), {
  height: 40,
  viewBoxWidth: 370,
  viewBoxHeight: 32,
  progress: 0
});

/**
 * Emits：组件事件
 */
const emit = defineEmits<IMediaAudioWavesEmits>();

/**
 * 函数：将数值限制在 0~1
 * @param {number} val 数值
 * @returns {number} 结果
 */
const mediaAudioWavesClamp01 = (val: number): number => {
  if (!Number.isFinite(val)) {
    return 0;
  }

  if (val < 0) {
    return 0;
  }
  if (val > 1) {
    return 1;
  }

  return val;
};

/**
 * 引用：可交互区域元素
 */
const refInteractive = ref<HTMLElement | null>(null);

/**
 * 状态：是否处于拖拽中
 */
const stateDragging = shallowRef(false);

/**
 * 状态：预览进度（hover/drag）
 * - null：不显示预览
 */
const statePreviewPercent = shallowRef<number | null>(null);

/**
 * 函数：基于 PointerEvent 计算进度百分比（0~1）
 * @param {PointerEvent} event PointerEvent
 * @returns {number | null} 百分比（0~1），无法计算时返回 null
 */
const mediaAudioWavesPercentFromPointerEvent = (event: PointerEvent): number | null => {
  if (!refInteractive.value) {
    return null;
  }

  const rect = refInteractive.value.getBoundingClientRect();
  if (!Number.isFinite(rect.width) || rect.width <= 0) {
    return null;
  }

  return mediaAudioWavesClamp01((event.clientX - rect.left) / rect.width);
};

/**
 * 函数：是否允许更新预览（hover/drag）
 * @param {PointerEvent} event PointerEvent
 * @returns {boolean} 是否允许
 */
const mediaAudioWavesPreviewUpdateAllowGet = (event: PointerEvent): boolean => {
  // mouse：支持悬停预览
  // 兼容：部分环境 pointerType 可能为空字符串
  if (event.pointerType === 'mouse' || event.pointerType === '') {
    return true;
  }

  // touch/pen：仅在拖拽期间更新
  return stateDragging.value;
};

/**
 * 函数：更新预览进度（用于 hover/drag）
 * @param {PointerEvent} event PointerEvent
 * @returns {void} 无返回值
 */
const mediaAudioWavesPreviewUpdateByPointerEvent = (event: PointerEvent): void => {
  if (!mediaAudioWavesPreviewUpdateAllowGet(event)) {
    return;
  }

  const percent = mediaAudioWavesPercentFromPointerEvent(event);
  if (percent === null) {
    return;
  }

  statePreviewPercent.value = percent;
};

/**
 * 函数：清理预览进度（鼠标离开时）
 * @returns {void} 无返回值
 */
const mediaAudioWavesPreviewClear = (): void => {
  // 拖拽中不清理，避免 capture 过程中闪烁
  if (stateDragging.value) {
    return;
  }

  statePreviewPercent.value = null;
};

/**
 * 函数：开始拖拽
 * @param {PointerEvent} event PointerEvent
 * @returns {void} 无返回值
 */
const mediaAudioWavesDragStart = (event: PointerEvent): void => {
  stateDragging.value = true;

  // 立即更新一次预览，让“按下就有反馈”
  mediaAudioWavesPreviewUpdateByPointerEvent(event);

  // 捕获指针：确保拖出区域仍能收到 move/up
  try {
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
  } catch {
    // ignore
  }
};

/**
 * 函数：结束拖拽（松手触发 seek）
 * @param {PointerEvent} event PointerEvent
 * @returns {void} 无返回值
 */
const mediaAudioWavesDragEnd = (event: PointerEvent): void => {
  if (!stateDragging.value) {
    return;
  }

  stateDragging.value = false;

  const percent = mediaAudioWavesPercentFromPointerEvent(event) ?? statePreviewPercent.value;
  if (typeof percent === 'number') {
    mediaAudioWavesSeekEmit(percent);
  }

  // touch 没有 hover 语义，松手后直接清理预览
  if (event.pointerType !== 'mouse') {
    statePreviewPercent.value = null;
  }

  try {
    (event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId);
  } catch {
    // ignore
  }
};

/**
 * 函数：取消拖拽
 * @returns {void} 无返回值
 */
const mediaAudioWavesDragCancel = (): void => {
  stateDragging.value = false;
  statePreviewPercent.value = null;
};

/**
 * 常量：实例唯一 id（用于 clipPath 避免同页重复）
 */
const stateId = useId();

/**
 * 计算属性：clipPath id
 */
const stateLineClipId = computed(() => `media-audio-waves-line-${stateId.replace(/[^a-zA-Z0-9_-]/g, '-')}`);

/**
 * 计算属性：viewBox
 */
const stateViewBox = computed(() => `0 0 ${props.viewBoxWidth} ${props.viewBoxHeight}`);

/**
 * 计算属性：进度 rect 宽度（viewBox 坐标）
 */
const stateProgressWidth = computed(() => props.viewBoxWidth * mediaAudioWavesClamp01(props.progress ?? 0));

/**
 * 计算属性：预览 rect 宽度（viewBox 坐标）
 */
const statePreviewWidth = computed(() => {
  if (statePreviewPercent.value === null) {
    return 0;
  }

  return props.viewBoxWidth * mediaAudioWavesClamp01(statePreviewPercent.value);
});

/**
 * 计算属性：rect 绘制顺序是否需要切换为 1-3-2
 * - 规则：仅在 hover/拖拽存在预览值时，且预览进度超过播放进度时切换
 */
const stateRectOrderIs132 = computed(() => {
  if (statePreviewPercent.value === null) {
    return false;
  }

  const previewPercent = mediaAudioWavesClamp01(statePreviewPercent.value);
  const progressPercent = mediaAudioWavesClamp01(props.progress ?? 0);

  return previewPercent > progressPercent;
});

/**
 * 计算属性：指示线是否可见
 * - 规则：仅在鼠标悬停（有预览值）或拖拽中显示
 */
const stateIndicatorVisible = computed(() => stateDragging.value || statePreviewPercent.value !== null);

/**
 * 计算属性：指示位置百分比（0~1）
 * - 预览存在时：跟随预览位置
 * - 否则：跟随播放头（progress）
 */
const stateIndicatorPercent = computed(() => {
  if (statePreviewPercent.value === null) {
    return mediaAudioWavesClamp01(props.progress ?? 0);
  }

  return mediaAudioWavesClamp01(statePreviewPercent.value);
});

/**
 * 计算属性：指示线容器宽度（百分比）
 * - 通过设置 <svg> 的 width，让 line 固定绘制在 x=100% 处
 */
const stateIndicatorWidth = computed(() => `${stateIndicatorPercent.value * 100}%`);

/**
 * 函数：触发 seek 事件
 * @param {number} percent 百分比（0~1）
 * @returns {void} 无返回值
 */
const mediaAudioWavesSeekEmit = (percent: number): void => {
  const normalized = mediaAudioWavesClamp01(percent);

  if (typeof props.duration === 'number' && Number.isFinite(props.duration)) {
    emit('seek', { percent: normalized, time: props.duration * normalized });
    return;
  }

  emit('seek', { percent: normalized });
};

defineExpose({
  seekEmit: mediaAudioWavesSeekEmit
});
</script>

<style scoped>
/* stylelint-disable selector-class-pattern -- 组件使用 BEM 风格 class（__ / --），允许该命名模式 */

.media-audio-waves__rects--132 {
  display: none;
}

.media-audio-waves--order-132 .media-audio-waves__rects--123 {
  display: none;
}

.media-audio-waves--order-132 .media-audio-waves__rects--132 {
  display: inline;
}
</style>
