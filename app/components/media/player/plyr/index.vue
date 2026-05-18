<template>
  <ClientOnly>
    <div :id="stateId" :class="stateRootClass" :style="stateRootStyle">
      <video v-if="stateRenderMode === 'video'" ref="refElement" :poster="props.poster" :autoplay="props.autoplay" class="size-full" controls playsinline />
      <audio v-else-if="stateRenderMode === 'audio'" ref="refElement" :autoplay="props.autoplay" class="size-full" controls />
      <div v-else ref="refElement" class="size-full" :data-plyr-provider="stateEmbedProvider" :data-plyr-embed-id="stateEmbedId" />

      <Teleport v-if="stateWaveformEnabled && stateWaveformTeleportTarget" :to="stateWaveformTeleportTarget">
        <div class="media-plyr__waveform-overlay">
          <MediaAudioWaves :waveform-path="stateWaveformPathResolved" :height="props.waveformHeight" :view-box-width="props.waveformViewBoxWidth" :view-box-height="props.waveformViewBoxHeight" :progress="stateWaveformProgress" :duration="stateWaveformDuration" @seek="mediaPlyrWaveformSeekHandle" />
        </div>
      </Teleport>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { IMediaAudioWavesSeekPayload } from '../../audio/waves/index.types';
import type { IMediaPlyrConfig, IMediaPlyrConfigInjected, IMediaPlyrInstanceConfigMinimum, IMediaPlyrPlayerSource, IMediaPlyrPlayerTrack, IMediaPlyrProps, IMediaPlyrSource, TMediaPlyrConfigControls, TMediaPlyrI18nDict, TMediaPlyrSourceProvider, TPlyrCtor } from './index.types';

/**
 * Props：组件属性
 */
const props = withDefaults(defineProps<IMediaPlyrProps>(), {
  type: 'auto'
});

/**
 * 常量：实例 id 自增计数
 */
let mediaPlyrIdCount = 0;

/**
 * 常量：Plyr 实例集合（用于同页互斥播放）
 * - 仅在客户端生命周期内使用
 */
const MEDIA_PLYR_INSTANCE_SET = (() => {
  /**
   * 常量：全局注册表 key（用于 HMR/重复模块加载下保持单例）
   */
  const key = '__LOFI_TICK_MEDIA_PLYR_INSTANCE_SET__';

  const globalStore = globalThis as unknown as Record<string, unknown>;
  const existing = globalStore[key];

  if (existing instanceof Set) {
    return existing as Set<Plyr>;
  }

  const created = new Set<Plyr>();
  globalStore[key] = created;

  return created;
})();

/**
 * 函数：暂停其它 Plyr 实例（用于同页互斥播放）
 * @param {Plyr} self 当前实例
 * @returns {void} 无返回值
 */
const mediaPlyrPauseOthers = (self: Plyr): void => {
  MEDIA_PLYR_INSTANCE_SET.forEach((player) => {
    if (player === self) {
      return;
    }

    try {
      player.pause();
    } catch {
      // ignore
    }
  });
};

/**
 * 函数：生成播放器 id
 * @returns {string} 播放器 id
 */
const mediaPlyrIdGet = (): string => {
  mediaPlyrIdCount += 1;

  return `media-plyr-${Date.now()}-${mediaPlyrIdCount}`;
};

/**
 * 函数：微任务调度（用于把焦点恢复放到事件链之后执行）
 * @param {() => void} fn 回调
 * @returns {void} 无返回值
 */
const mediaPlyrQueueMicrotask = (fn: () => void): void => {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn);
    return;
  }

  Promise.resolve().then(fn);
};

/**
 * 函数：将数值限制在 0~1
 * @param {number} val 数值
 * @returns {number} 结果
 */
const mediaPlyrClamp01 = (val: number): number => {
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
 * 函数：获取 Plyr container 元素
 * @param {Plyr} player Plyr 实例
 * @returns {HTMLElement | null} container 元素
 */
const mediaPlyrContainerGet = (player: Plyr): HTMLElement | null => {
  const container = (player.elements as unknown as { container?: unknown } | undefined)?.container;

  if (container instanceof HTMLElement) {
    return container;
  }

  return null;
};

/**
 * 函数：确保 Plyr container 可被脚本聚焦
 * @param {HTMLElement} container container
 * @returns {void} 无返回值
 */
const mediaPlyrContainerFocusableEnsure = (container: HTMLElement): void => {
  // 仅允许脚本聚焦，避免影响 Tab 顺序
  if (!container.hasAttribute('tabindex')) {
    container.setAttribute('tabindex', '-1');
  }
};

/**
 * 函数：是否需要把焦点恢复到 container（避免打断输入控件交互）
 * @param {HTMLElement} container container
 * @returns {boolean} 是否需要恢复
 */
const mediaPlyrFocusRestoreNeed = (container: HTMLElement): boolean => {
  const active = document.activeElement;

  if (!(active instanceof HTMLElement)) {
    return true;
  }

  // 焦点不在播放器内部：恢复到 container 以启用快捷键
  if (!container.contains(active)) {
    return true;
  }

  // 焦点在可编辑/输入控件上：避免抢焦点
  if (active.matches('input, textarea, select, [contenteditable]')) {
    return false;
  }

  return true;
};

/**
 * 函数：将焦点恢复到 container（用于启用 keyboard.focused 模式快捷键）
 * @param {Plyr} player Plyr 实例
 * @returns {void} 无返回值
 */
const mediaPlyrFocusRestoreToContainer = (player: Plyr): void => {
  if (!import.meta.client) {
    return;
  }

  const container = mediaPlyrContainerGet(player);
  if (!container) {
    return;
  }

  if (!mediaPlyrFocusRestoreNeed(container)) {
    return;
  }

  mediaPlyrContainerFocusableEnsure(container);

  // 放到事件链之后：确保不会停留在播放按钮（space 会被 Plyr 特判跳过）
  mediaPlyrQueueMicrotask(() => {
    try {
      container.focus({ preventScroll: true });
    } catch {
      container.focus();
    }
  });
};

/**
 * 函数：是否启用互斥播放（基于 Plyr config.autopause）
 * @param {Plyr} player Plyr 实例
 * @returns {boolean} 是否启用
 */
const mediaPlyrAutopauseEnabledGet = (player: Plyr): boolean => {
  const config = (player as unknown as { config?: IMediaPlyrInstanceConfigMinimum }).config;

  // 默认启用；显式设置为 false 才禁用
  return config?.autopause !== false;
};

/**
 * 状态：seekToPlay 事件清理控制器
 */
const stateSeekToPlayAbortController = shallowRef<AbortController | null>(null);

/**
 * 函数：是否启用 seekToPlay（基于 Plyr config.seekToPlay）
 * @param {Plyr} player Plyr 实例
 * @returns {boolean} 是否启用
 */
const mediaPlyrSeekToPlayEnabledGet = (player: Plyr): boolean => {
  const config = (player as unknown as { config?: IMediaPlyrConfig }).config;

  // 默认启用；显式设置为 false 才禁用
  return config?.seekToPlay !== false;
};

/**
 * 函数：清理 seekToPlay 监听
 * @returns {void} 无返回值
 */
const mediaPlyrSeekToPlayCleanup = (): void => {
  if (!stateSeekToPlayAbortController.value) {
    return;
  }

  try {
    stateSeekToPlayAbortController.value.abort();
  } catch {
    // ignore
  }

  stateSeekToPlayAbortController.value = null;
};

/**
 * 状态：波形相关事件清理控制器
 */
const stateWaveformAbortController = shallowRef<AbortController | null>(null);

/**
 * 函数：清理波形相关事件监听
 * @returns {void} 无返回值
 */
const mediaPlyrWaveformCleanup = (): void => {
  // 先清理自定义 DOM（避免多次整合导致混乱）
  mediaPlyrWaveformCustomProgressCleanup();
  stateWaveformTeleportTarget.value = null;

  if (stateWaveformAbortController.value) {
    try {
      stateWaveformAbortController.value.abort();
    } catch {
      // ignore
    }

    stateWaveformAbortController.value = null;
  }
};

/**
 * Hook：i18n
 */
const { locale, tm } = useI18n();

/**
 * 常量：Plyr settings 默认值（按官方 README 文档口径）
 */
const MEDIA_PLYR_SETTINGS_DEFAULT: NonNullable<IMediaPlyrConfig['settings']> = ['captions', 'quality', 'speed', 'loop'];

/**
 * 常量：Plyr controls 默认值（包含 duration，总时长）
 */
const MEDIA_PLYR_CONTROLS_DEFAULT: TMediaPlyrConfigControls[] = ['play-large', 'play', 'current-time', 'progress', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'];

/**
 * 引用：播放器 DOM 元素
 */
const refElement = ref<HTMLVideoElement | HTMLAudioElement | HTMLDivElement | null>(null);

/**
 * 状态：播放器 id
 */
const stateIdGenerated = ref(mediaPlyrIdGet());

/**
 * 状态：播放器 id
 */
const stateId = computed(() => props.id || stateIdGenerated.value);

/**
 * 状态：Plyr 实例
 */
const statePlayer = shallowRef<Plyr | null>(null);

/**
 * 状态：Plyr 构造器（缓存）
 */
const statePlyrCtor = shallowRef<TPlyrCtor | null>(null);

/**
 * 函数：获取 Plyr 构造器（动态导入 + 兼容 default 包装）
 * @returns {Promise<TPlyrCtor>} Plyr 构造器
 */
const mediaPlyrCtorGet = async (): Promise<TPlyrCtor> => {
  if (!import.meta.client) {
    throw new Error('Plyr 仅支持在客户端初始化');
  }

  if (statePlyrCtor.value) {
    return statePlyrCtor.value;
  }

  const mod = await import('plyr');
  let candidate: unknown = (mod as unknown as { default?: unknown }).default ?? (mod as unknown);

  // 某些打包/互操作场景会出现多层 default
  while (candidate && typeof candidate === 'object' && 'default' in (candidate as Record<string, unknown>)) {
    candidate = (candidate as { default?: unknown }).default ?? candidate;
  }

  if (typeof candidate !== 'function') {
    throw new TypeError('PlyrCtor is not a constructor');
  }

  statePlyrCtor.value = candidate as TPlyrCtor;
  return statePlyrCtor.value;
};

/**
 * 函数：规范化媒体源数组
 * @param {string | IMediaPlyrSource | IMediaPlyrSource[]} sources 媒体源
 * @returns {IMediaPlyrSource[]} 规范化后的媒体源数组
 */
const mediaPlyrSourcesNormalize = (sources: string | IMediaPlyrSource | IMediaPlyrSource[]): IMediaPlyrSource[] => {
  if (typeof sources === 'string') {
    const provider = mediaPlyrSourceProviderFromUrlSrcGet(sources) ?? 'html5';

    return [{ src: sources, provider }];
  }

  if (Array.isArray(sources)) {
    return sources;
  }

  return [sources];
};

/**
 * 接口：媒体源 URL Provider 识别规则
 */
interface IMediaPlyrSourceUrlProviderRule {
  /**
   * 提供者
   */
  provider: Exclude<TMediaPlyrSourceProvider, 'html5'>;

  /**
   * 函数：判断是否匹配
   * @param {URL} url URL
   * @returns {boolean} 是否匹配
   */
  match: (url: URL) => boolean;
}

/**
 * 常量：媒体源 URL Provider 识别规则（便于扩展其他平台）
 */
const MEDIA_PLYR_SOURCE_URL_PROVIDER_RULES: IMediaPlyrSourceUrlProviderRule[] = [
  {
    provider: 'youtube',
    match: (url) => {
      const host = url.hostname.toLowerCase();
      const path = url.pathname.toLowerCase();

      if (host === 'youtu.be' || host.endsWith('.youtu.be')) {
        return true;
      }

      if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtube-nocookie.com' || host.endsWith('.youtube-nocookie.com')) {
        return path.startsWith('/watch') || path.startsWith('/embed/') || path.startsWith('/shorts/');
      }

      return false;
    }
  },
  {
    provider: 'vimeo',
    match: (url) => {
      const host = url.hostname.toLowerCase();
      const path = url.pathname.toLowerCase();

      if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
        return /^\/\d+/.test(path) || path.startsWith('/video/');
      }

      if (host === 'player.vimeo.com') {
        return path.startsWith('/video/');
      }

      return false;
    }
  }
];

/**
 * 函数：从 URL 推断 provider
 * @param {URL} url URL
 * @returns {Exclude<TMediaPlyrSourceProvider, 'html5'> | undefined} 推断结果
 */
const mediaPlyrSourceProviderFromUrlGet = (url: URL): Exclude<TMediaPlyrSourceProvider, 'html5'> | undefined => {
  const hit = MEDIA_PLYR_SOURCE_URL_PROVIDER_RULES.find((rule) => rule.match(url));
  return hit?.provider;
};

/**
 * 函数：从 src（仅限完整 http(s) URL）推断 provider
 * @param {string} src 媒体源地址
 * @returns {Exclude<TMediaPlyrSourceProvider, 'html5'> | undefined} 推断结果
 */
const mediaPlyrSourceProviderFromUrlSrcGet = (src: string): Exclude<TMediaPlyrSourceProvider, 'html5'> | undefined => {
  const raw = src.trim();

  // 非 URL（相对路径、EmbedId 等）不做解析
  if (!/^https?:\/\//i.test(raw)) {
    return undefined;
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return undefined;
  }

  return mediaPlyrSourceProviderFromUrlGet(url);
};

/**
 * 函数：从 src 推断是否为音频文件（仅在未提供 MIME type 时兜底）
 * @param {string} src 媒体源地址或路径
 * @returns {boolean} 是否为音频
 */
const mediaPlyrSrcIsAudioInfer = (src: string): boolean => {
  const raw = src.trim();

  if (!raw) {
    return false;
  }

  // 仅针对普通路径/URL 的扩展名判断，避免误判 blob/data
  if (raw.startsWith('blob:') || raw.startsWith('data:')) {
    return false;
  }

  const cleaned = raw.split('#')[0]?.split('?')[0] ?? raw;
  const dotIndex = cleaned.lastIndexOf('.');

  if (dotIndex === -1) {
    return false;
  }

  const ext = cleaned.slice(dotIndex + 1).toLowerCase();
  const audioExts = new Set(['mp3', 'm4a', 'aac', 'wav', 'ogg', 'oga', 'flac', 'opus']);

  return audioExts.has(ext);
};

/**
 * 函数：将 locale 转换为 BCP 47
 * @param {string} val locale
 * @returns {string} BCP 47 语言标签
 */
const mediaPlyrLocaleToBcp47 = (val: string): string => {
  const lower = val.trim().toLowerCase();

  if (lower === 'zh-cn') {
    return 'zh-CN';
  }
  if (lower === 'zh-tw') {
    return 'zh-TW';
  }

  return lower;
};

/**
 * 计算属性：媒体源
 */
const stateSources = computed(() => mediaPlyrSourcesNormalize(props.sources));

/**
 * 计算属性：自动识别 provider
 */
const stateAutoProvider = computed<TMediaPlyrSourceProvider | undefined>(() => stateSources.value[0]?.provider);

/**
 * 计算属性：渲染模式
 */
const stateRenderMode = computed<'video' | 'audio' | 'embed'>(() => {
  if (props.type === 'youtube' || props.type === 'vimeo') {
    return 'embed';
  }
  if (props.type === 'audio') {
    return 'audio';
  }
  if (props.type === 'video') {
    return 'video';
  }

  // auto
  if (stateAutoProvider.value === 'youtube' || stateAutoProvider.value === 'vimeo') {
    return 'embed';
  }

  const firstSource = stateSources.value[0];
  const firstType = firstSource?.type;

  if (firstType && firstType.startsWith('audio/')) {
    return 'audio';
  }

  if (firstSource?.src && mediaPlyrSrcIsAudioInfer(firstSource.src)) {
    return 'audio';
  }

  return 'video';
});

/**
 * 计算属性：归一化后的 waveformPath
 * - 目的：满足 waves 组件要求 waveformPath 为必填 string
 */
const stateWaveformPathResolved = computed(() => {
  if (typeof props.waveformPath !== 'string') {
    return '';
  }

  return props.waveformPath.trim();
});

/**
 * 计算属性：是否启用音频波形覆盖
 */
const stateWaveformEnabled = computed(() => {
  if (stateRenderMode.value !== 'audio') {
    return false;
  }

  return stateWaveformPathResolved.value !== '';
});

/**
 * 计算属性：根容器 class
 */
const stateRootClass = computed(() => {
  if (stateWaveformEnabled.value) {
    return 'media-plyr media-plyr--waveform shadow-md';
  }

  return 'media-plyr shadow-md';
});

/**
 * 计算属性：根容器 style（用于波形高度等覆盖）
 */
const stateRootStyle = computed(() => {
  if (!stateWaveformEnabled.value) {
    return undefined;
  }

  const height = typeof props.waveformHeight === 'number' && Number.isFinite(props.waveformHeight) && props.waveformHeight > 0 ? props.waveformHeight : 40;

  return {
    '--media-plyr-waveform-height': `${height}px`
  } as Record<string, string>;
});

/**
 * 状态：波形 Teleport 目标（.plyr__progress）
 */
const stateWaveformTeleportTarget = shallowRef<HTMLElement | null>(null);

/**
 * 状态：波形进度（0~1）
 */
const stateWaveformProgress = shallowRef(0);

/**
 * 状态：波形时长（秒）
 */
const stateWaveformDuration = shallowRef<number | undefined>(undefined);

/**
 * 状态：自定义 progress 元素（用于 waves 全权接管交互）
 */
const stateWaveformProgressCustom = shallowRef<HTMLElement | null>(null);

/**
 * 状态：原生 progress 元素（用于隐藏，避免与自定义 progress 冲突）
 */
const stateWaveformProgressNative = shallowRef<HTMLElement | null>(null);

/**
 * 状态：自定义 tooltip 元素
 */
const stateWaveformTooltip = shallowRef<HTMLElement | null>(null);

/**
 * 状态：tooltip 是否处于指针按下锁定中
 */
const stateWaveformTooltipPinned = shallowRef(false);

/**
 * 函数：waves seek 事件处理（驱动 Plyr currentTime）
 * @param {IMediaAudioWavesSeekPayload} payload payload
 * @returns {void} 无返回值
 */
const mediaPlyrWaveformSeekHandle = (payload: IMediaAudioWavesSeekPayload): void => {
  const player = statePlayer.value;
  if (!player) {
    return;
  }

  const duration = typeof stateWaveformDuration.value === 'number' && Number.isFinite(stateWaveformDuration.value) && stateWaveformDuration.value > 0 ? stateWaveformDuration.value : undefined;
  if (!duration) {
    return;
  }

  // 优先使用组件提供的 time（当 duration 存在时 waves 会输出）
  const timeRaw = typeof payload.time === 'number' && Number.isFinite(payload.time) ? payload.time : duration * mediaPlyrClamp01(payload.percent);

  try {
    (player as unknown as { currentTime?: number }).currentTime = Math.max(0, Math.min(duration, timeRaw));
  } catch {
    // ignore
  }
};

/**
 * 计算属性：Embed provider
 */
const stateEmbedProvider = computed<'youtube' | 'vimeo'>(() => {
  if (props.type === 'youtube' || props.type === 'vimeo') {
    return props.type;
  }

  return stateAutoProvider.value === 'vimeo' ? 'vimeo' : 'youtube';
});

/**
 * 计算属性：Embed id
 */
const stateEmbedId = computed(() => stateSources.value[0]?.src || '');

/**
 * 函数：获取 Plyr options（强制使用系统 i18n）
 * @returns {IMediaPlyrConfigInjected} Plyr options
 */
const mediaPlyrOptionsGet = (): IMediaPlyrConfigInjected => {
  /**
   * 常量：选项副本（避免直接修改 props）
   */
  const options: IMediaPlyrConfig = { ...(props.options ?? {}) };

  /**
   * 常量：controls 原始值
   */
  const controlsRaw = options.controls;

  // 仅当 controls 为非空数组时才尊重用户配置
  // - controls 不是数组：统一使用默认控件
  // - controls 为空数组：默认也使用默认控件
  // - 仅当 hideControls=true 且 controls=[] 时，才允许完全隐藏控件
  if (Array.isArray(controlsRaw)) {
    if (controlsRaw.length === 0 && options.hideControls === true) {
      // 尊重用户：完全隐藏控件
    } else if (controlsRaw.length > 0) {
      // 尊重用户：非空数组配置
    } else {
      options.controls = MEDIA_PLYR_CONTROLS_DEFAULT;
    }
  } else {
    options.controls = MEDIA_PLYR_CONTROLS_DEFAULT;
  }

  // 未传入 settings 时按文档默认值补齐
  if (options.settings === undefined) {
    options.settings = MEDIA_PLYR_SETTINGS_DEFAULT;
  }

  // 未传入 seekToPlay 时按默认值补齐（用户交互 seek 后自动播放）
  if (options.seekToPlay === undefined) {
    options.seekToPlay = true;
  }

  // 组件级 autoplay 语义优先透传到 Plyr 配置。
  if (options.autoplay === undefined && props.autoplay !== undefined) {
    options.autoplay = props.autoplay;
  }

  return {
    ...options,
    i18n: tm('components.plyr') as unknown as TMediaPlyrI18nDict
  };
};

/**
 * 函数：获取 Plyr source
 * @returns {Record<string, unknown>} Plyr source
 */
const mediaPlyrSourceGet = (): IMediaPlyrPlayerSource => {
  const type = stateRenderMode.value === 'audio' ? 'audio' : 'video';

  /**
   * 常量：tracks（仅在 props.tracks 为 URL 字符串时启用）
   */
  const tracks: IMediaPlyrPlayerTrack[] =
    typeof props.tracks === 'string'
      ? [
          {
            kind: 'captions',
            label: mediaPlyrLocaleToBcp47(locale.value),
            srclang: mediaPlyrLocaleToBcp47(locale.value),
            src: props.tracks,
            default: true
          }
        ]
      : [];

  return {
    type,
    poster: props.poster,
    sources: stateSources.value,
    tracks
  };
};

/**
 * 函数：销毁播放器
 * @returns {void} 无返回值
 */
const mediaPlyrDestroy = (): void => {
  if (!statePlayer.value) {
    return;
  }

  mediaPlyrSeekToPlayCleanup();
  mediaPlyrWaveformCleanup();

  stateWaveformTeleportTarget.value = null;
  stateWaveformProgress.value = 0;
  stateWaveformDuration.value = undefined;
  stateWaveformProgressCustom.value = null;
  stateWaveformProgressNative.value = null;
  stateWaveformTooltip.value = null;
  stateWaveformTooltipPinned.value = false;

  MEDIA_PLYR_INSTANCE_SET.delete(statePlayer.value);

  statePlayer.value.destroy();
  statePlayer.value = null;
};

/**
 * 函数：格式化时间（mm:ss）
 * @param {number} seconds 秒
 * @returns {string} 格式化后的字符串
 */
const mediaPlyrWaveformTimeFormatMmSs = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');

  return `${mm}:${ss}`;
};

/**
 * 函数：清理自定义 progress（恢复原生 DOM，避免混乱）
 * @returns {void} 无返回值
 */
function mediaPlyrWaveformCustomProgressCleanup(): void {
  stateWaveformTooltipPinned.value = false;

  if (stateWaveformProgressCustom.value) {
    try {
      stateWaveformProgressCustom.value.remove();
    } catch {
      // ignore
    }
  }

  if (stateWaveformProgressNative.value) {
    stateWaveformProgressNative.value.classList.remove('media-plyr__progress-native--hidden');
  }

  stateWaveformProgressCustom.value = null;
  stateWaveformProgressNative.value = null;
  stateWaveformTooltip.value = null;
}

/**
 * 函数：设置 tooltip 可见性
 * @param {boolean} visible 是否可见
 * @returns {void} 无返回值
 */
const mediaPlyrWaveformTooltipVisibleSet = (visible: boolean): void => {
  if (!stateWaveformTooltip.value) {
    return;
  }

  stateWaveformTooltip.value.classList.toggle('plyr__tooltip--visable', visible);
};

/**
 * 函数：基于百分比更新 tooltip
 * @param {number} percent 百分比（0~1）
 * @returns {void} 无返回值
 */
const mediaPlyrWaveformTooltipUpdateByPercent = (percent: number): void => {
  if (!stateWaveformTooltip.value) {
    return;
  }

  const duration = typeof stateWaveformDuration.value === 'number' && Number.isFinite(stateWaveformDuration.value) && stateWaveformDuration.value > 0 ? stateWaveformDuration.value : undefined;
  if (!duration) {
    return;
  }

  const normalized = mediaPlyrClamp01(percent);
  const time = duration * normalized;

  stateWaveformTooltip.value.textContent = mediaPlyrWaveformTimeFormatMmSs(time);
  stateWaveformTooltip.value.style.left = `${normalized * 100}%`;

  mediaPlyrWaveformTooltipVisibleSet(true);
};

/**
 * 函数：确保自定义 progress 存在（waves 全权接管交互 + tooltip）
 * @param {Plyr | null} player Plyr 实例
 * @returns {void} 无返回值
 */
const mediaPlyrWaveformCustomProgressEnsure = (player: Plyr | null): void => {
  if (!player || !stateWaveformEnabled.value) {
    mediaPlyrWaveformCustomProgressCleanup();
    stateWaveformTeleportTarget.value = null;
    return;
  }

  const abortController = stateWaveformAbortController.value;
  if (!abortController) {
    return;
  }

  const container = mediaPlyrContainerGet(player);
  if (!container) {
    stateWaveformTeleportTarget.value = null;
    return;
  }

  const progressContainer = container.querySelector('.plyr__controls__item.plyr__progress__container');
  if (!(progressContainer instanceof HTMLElement)) {
    // 找不到 progress container：按约定不做任何操作
    stateWaveformTeleportTarget.value = null;
    return;
  }

  // 已创建：直接复用
  if (stateWaveformProgressCustom.value && stateWaveformProgressCustom.value.isConnected) {
    stateWaveformTeleportTarget.value = stateWaveformProgressCustom.value;
    return;
  }

  // 防御：避免混乱（先清理再创建）
  mediaPlyrWaveformCustomProgressCleanup();

  const nativeProgress = progressContainer.querySelector('.plyr__progress');
  if (!(nativeProgress instanceof HTMLElement)) {
    stateWaveformTeleportTarget.value = null;
    return;
  }

  nativeProgress.classList.add('media-plyr__progress-native--hidden');
  stateWaveformProgressNative.value = nativeProgress;

  const customProgress = document.createElement('div');
  customProgress.className = 'plyr__progress media-plyr__progress-custom';

  const tooltip = document.createElement('span');
  tooltip.className = 'plyr__tooltip';
  tooltip.textContent = '00:00';
  tooltip.style.left = '0%';

  customProgress.appendChild(tooltip);

  // 插入到原生 progress 后面（让我们的 progress 占位）
  try {
    nativeProgress.insertAdjacentElement('afterend', customProgress);
  } catch {
    // ignore
  }

  stateWaveformProgressCustom.value = customProgress;
  stateWaveformTooltip.value = tooltip;
  stateWaveformTeleportTarget.value = customProgress;

  /**
   * 函数：从 PointerEvent 计算进度百分比
   * @param {PointerEvent} event PointerEvent
   * @returns {number | null} 百分比（0~1），无法计算时返回 null
   */
  const percentFromPointerEventGet = (event: PointerEvent): number | null => {
    const rect = customProgress.getBoundingClientRect();
    if (!Number.isFinite(rect.width) || rect.width <= 0) {
      return null;
    }

    return mediaPlyrClamp01((event.clientX - rect.left) / rect.width);
  };

  customProgress.addEventListener(
    'pointerenter',
    () => {
      // hover 时显示（不改变 Plyr 逻辑，仅控制显示）
      mediaPlyrWaveformTooltipVisibleSet(true);
    },
    { signal: abortController.signal, capture: true }
  );

  customProgress.addEventListener(
    'pointermove',
    (event) => {
      const percent = percentFromPointerEventGet(event);
      if (percent === null) {
        return;
      }

      mediaPlyrWaveformTooltipUpdateByPercent(percent);
    },
    { signal: abortController.signal, capture: true }
  );

  customProgress.addEventListener(
    'pointerleave',
    () => {
      if (stateWaveformTooltipPinned.value) {
        return;
      }

      mediaPlyrWaveformTooltipVisibleSet(false);
    },
    { signal: abortController.signal, capture: true }
  );

  customProgress.addEventListener(
    'pointerdown',
    (event) => {
      stateWaveformTooltipPinned.value = true;

      const percent = percentFromPointerEventGet(event);
      if (percent !== null) {
        mediaPlyrWaveformTooltipUpdateByPercent(percent);
      }

      try {
        customProgress.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    },
    { signal: abortController.signal, capture: true }
  );

  /**
   * 函数：结束 tooltip 锁定
   * @returns {void} 无返回值
   */
  const tooltipUnpin = (): void => {
    stateWaveformTooltipPinned.value = false;
    mediaPlyrWaveformTooltipVisibleSet(false);
  };

  customProgress.addEventListener('pointerup', tooltipUnpin, { signal: abortController.signal, capture: true });
  customProgress.addEventListener('pointercancel', tooltipUnpin, { signal: abortController.signal, capture: true });
  customProgress.addEventListener('lostpointercapture', tooltipUnpin, { signal: abortController.signal, capture: true });
};

/**
 * 函数：解析并设置波形 Teleport 目标
 * @param {Plyr | null} player Plyr 实例
 * @returns {void} 无返回值
 */
const mediaPlyrWaveformTeleportTargetResolve = (player: Plyr | null): void => {
  mediaPlyrWaveformCustomProgressEnsure(player);
};

/**
 * 函数：同步波形进度（从 Plyr/MediaElement 读取 currentTime/duration）
 * @param {Plyr | null} player Plyr 实例
 * @returns {void} 无返回值
 */
const mediaPlyrWaveformSync = (player: Plyr | null): void => {
  if (!player || !stateWaveformEnabled.value) {
    stateWaveformProgress.value = 0;
    stateWaveformDuration.value = undefined;
    return;
  }

  const candidate = player as unknown as { media?: unknown; currentTime?: unknown; duration?: unknown };
  const media = candidate.media instanceof HTMLMediaElement ? candidate.media : null;

  const durationRaw = (typeof candidate.duration === 'number' ? candidate.duration : undefined) ?? (media ? media.duration : undefined);
  const currentTimeRaw = (typeof candidate.currentTime === 'number' ? candidate.currentTime : undefined) ?? (media ? media.currentTime : undefined);

  const duration = typeof durationRaw === 'number' && Number.isFinite(durationRaw) && durationRaw > 0 ? durationRaw : undefined;
  const currentTime = typeof currentTimeRaw === 'number' && Number.isFinite(currentTimeRaw) && currentTimeRaw >= 0 ? currentTimeRaw : 0;

  stateWaveformDuration.value = duration;
  stateWaveformProgress.value = duration ? mediaPlyrClamp01(currentTime / duration) : 0;
};

/**
 * 函数：创建播放器
 * @returns {void} 无返回值
 */
const mediaPlyrCreate = async (): Promise<void> => {
  if (!refElement.value) {
    return;
  }

  mediaPlyrDestroy();

  const PlyrCtor = await mediaPlyrCtorGet();
  statePlayer.value = new PlyrCtor(refElement.value, mediaPlyrOptionsGet());

  /**
   * 常量：当前 Plyr 实例
   */
  const player = statePlayer.value;

  MEDIA_PLYR_INSTANCE_SET.add(player);

  mediaPlyrWaveformCleanup();
  stateWaveformAbortController.value = new AbortController();

  // 初始化：波形挂载点与进度同步
  mediaPlyrWaveformTeleportTargetResolve(player);
  mediaPlyrWaveformSync(player);

  // 监听：进度同步（只读，不影响 Plyr 行为）
  player.on('timeupdate', () => {
    mediaPlyrWaveformSync(player);
  });
  {
    const abortController = stateWaveformAbortController.value;
    const media = (player as unknown as { media?: unknown }).media;

    if (abortController && media instanceof HTMLMediaElement) {
      media.addEventListener(
        'durationchange',
        () => {
          mediaPlyrWaveformSync(player);
        },
        { signal: abortController.signal }
      );
    }
  }
  player.on('loadedmetadata', () => {
    mediaPlyrWaveformTeleportTargetResolve(player);
    mediaPlyrWaveformSync(player);
  });

  /**
   * 函数：安全调用 play。
   *
   * 在浏览器或宿主环境拒绝播放时吞掉 Promise rejection，避免污染控制台。
   *
   * # Returns
   *
   * 无返回值。
   */
  const playerPlaySafe = (): void => {
    try {
      const result = player.play() as unknown;
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        (result as Promise<unknown>).catch(() => {
          // ignore
        });
      }
    } catch {
      // ignore
    }
  };

  player.on('ready', () => {
    mediaPlyrWaveformTeleportTargetResolve(player);
    mediaPlyrWaveformSync(player);

    if (props.autoplay === true) {
      playerPlaySafe();
    }
  });

  /**
   * 函数：播放时互斥 + 恢复焦点（启用快捷键）
   * @returns {void} 无返回值
   */
  const onPlayOrPlaying = (): void => {
    if (mediaPlyrAutopauseEnabledGet(player)) {
      mediaPlyrPauseOthers(player);
    }

    mediaPlyrFocusRestoreToContainer(player);
  };

  // 监听：播放阶段（部分 provider 事件时序不同，这里双保险）
  player.on('play', onPlayOrPlaying);
  player.on('playing', onPlayOrPlaying);

  // 监听：暂停后也恢复焦点，方便继续使用方向键/快捷键
  player.on('pause', () => {
    mediaPlyrFocusRestoreToContainer(player);
  });

  // 监听：用户交互 seek 后自动播放（可通过 options.seekToPlay 关闭）
  if (mediaPlyrSeekToPlayEnabledGet(player)) {
    mediaPlyrSeekToPlayCleanup();

    const abortController = new AbortController();
    stateSeekToPlayAbortController.value = abortController;

    /**
     * 变量：用户最近一次触发 seek 交互的时间戳
     */
    let stateSeekInteractAt = 0;

    /**
     * 变量：用户开始 seek 交互时是否处于暂停/停止状态
     */
    let stateSeekStartPaused = false;

    /**
     * 变量：是否处于 seek 拖动交互中
     */
    let stateSeekInteractionInProgress = false;

    /**
     * 变量：用户结束 seek 交互的时间戳
     */
    let stateSeekInteractEndAt = 0;

    const container = mediaPlyrContainerGet(player);

    /**
     * 函数：是否为 seek 交互目标
     * @param {Event} event 事件
     * @returns {boolean} 是否为 seek 交互
     */
    const seekInteractionIs = (event: Event): boolean => {
      if (!(event.target instanceof Element)) {
        return false;
      }

      if (!container) {
        return false;
      }

      return event.target.matches('input[data-plyr="seek"]') || event.target.closest('input[data-plyr="seek"]') !== null || event.target.closest('.plyr__progress') !== null;
    };

    /**
     * 函数：记录 seek 开始交互（不立即播放）
     * - 暂停/停止状态：拖动直到释放才播放
     * - 播放状态：不执行 seekToPlay，避免与内置行为冲突
     * @param {Event} event 事件
     * @returns {void} 无返回值
     */
    const seekInteractStartHandle = (event: Event): void => {
      if (!seekInteractionIs(event)) {
        return;
      }

      stateSeekInteractAt = Date.now();
      stateSeekStartPaused = (player as unknown as { paused?: boolean }).paused === true;
      stateSeekInteractionInProgress = true;
    };

    /**
     * 函数：seek 交互结束时触发播放
     * - 注意：把 play 放在用户手势事件里，避免被浏览器 autoplay 策略拦截
     * @param {Event} event 事件
     * @returns {void} 无返回值
     */
    const seekInteractEndHandle = (event: Event): void => {
      if (!seekInteractionIs(event)) {
        return;
      }

      stateSeekInteractionInProgress = false;
      stateSeekInteractEndAt = Date.now();

      // 仅在“开始时处于暂停/停止”才自动播放
      if (!stateSeekStartPaused) {
        return;
      }

      playerPlaySafe();
    };

    if (container) {
      // 开始交互：只记录，不播放
      container.addEventListener('pointerdown', seekInteractStartHandle, { signal: abortController.signal, capture: true });
      container.addEventListener('mousedown', seekInteractStartHandle, { signal: abortController.signal, capture: true });
      container.addEventListener('touchstart', seekInteractStartHandle, { signal: abortController.signal, capture: true });
      container.addEventListener('keydown', seekInteractStartHandle, { signal: abortController.signal, capture: true });

      // 结束交互：释放时播放
      container.addEventListener('pointerup', seekInteractEndHandle, { signal: abortController.signal, capture: true });
      container.addEventListener('mouseup', seekInteractEndHandle, { signal: abortController.signal, capture: true });
      container.addEventListener('touchend', seekInteractEndHandle, { signal: abortController.signal, capture: true });
      container.addEventListener('keyup', seekInteractEndHandle, { signal: abortController.signal, capture: true });
    }

    // 兜底：某些情况下 seek 交互与实际 seek 完成存在延迟
    player.on('seeked', () => {
      if (Date.now() - stateSeekInteractAt > 1500) {
        return;
      }

      if (!stateSeekStartPaused) {
        return;
      }

      // 拖动过程中会频繁触发 seeked：只允许在“交互结束后”触发兜底播放
      if (stateSeekInteractionInProgress) {
        return;
      }

      if (Date.now() - stateSeekInteractEndAt > 1500) {
        return;
      }

      playerPlaySafe();
    });
  }

  statePlayer.value.source = mediaPlyrSourceGet();
};

/**
 * 函数：重建播放器
 * @returns {void} 无返回值
 */
const mediaPlyrRecreate = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  try {
    // 等待 DOM 切换完成（video/audio/embed）
    await nextTick();
    await mediaPlyrCreate();
  } catch (error) {
    console.error(error);
  }
};

/**
 * 函数：同步媒体源（不重建实例）
 * @returns {void} 无返回值
 */
const mediaPlyrSyncSource = (): void => {
  if (!statePlayer.value) {
    return;
  }

  statePlayer.value.source = mediaPlyrSourceGet();
};

/**
 * 监听：渲染模式变化（video/audio/embed）
 */
watch(
  () => stateRenderMode.value,
  () => {
    mediaPlyrRecreate();
  }
);

/**
 * 监听：媒体源变化
 */
watch(
  () => props.sources,
  () => {
    mediaPlyrSyncSource();
  },
  { deep: true }
);

/**
 * 监听：封面变化
 */
watch(
  () => props.poster,
  () => {
    mediaPlyrSyncSource();
  }
);

/**
 * 监听：options 变化（通常需要重新初始化）
 */
watch(
  () => props.options,
  () => {
    mediaPlyrRecreate();
  },
  { deep: true }
);

/**
 * 监听：音频波形参数变化
 * - 目标：允许在播放器已创建后再注入 waveformPath（或调整 viewBox/height）并立即生效
 * - 注意：不重建 Plyr，只更新覆盖层挂载点与进度同步
 */
watch(
  () => [stateWaveformPathResolved.value, props.waveformHeight, props.waveformViewBoxWidth, props.waveformViewBoxHeight] as const,
  () => {
    mediaPlyrWaveformTeleportTargetResolve(statePlayer.value);
    mediaPlyrWaveformSync(statePlayer.value);
  }
);

/**
 * 监听：语言变化（必须跟随系统 i18n）
 */
watch(
  () => locale.value,
  () => {
    mediaPlyrRecreate();
  }
);

/**
 * 生命周期（组件挂载）：创建播放器
 */
onMounted(() => {
  mediaPlyrRecreate();
});

/**
 * 生命周期（组件卸载）：销毁播放器
 */
onBeforeUnmount(() => {
  mediaPlyrDestroy();
});

/**
 * Expose：对外暴露方法与属性
 */
defineExpose({
  player: statePlayer,
  recreate: mediaPlyrRecreate,
  destroy: mediaPlyrDestroy
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- Plyr uses third-party class names that don't match the project's selector naming pattern */

.media-plyr {
  /* ========== 字体与排版（Font & Typography）========== */

  /* 变量：播放器使用的字体族（font family） */
  --plyr-font-family: var(--default-font-family);

  /* 变量：基础字号（主要用于字幕） */
  --plyr-font-size-base: 15px;

  /* 变量：小号字号（主要用于字幕） */
  --plyr-font-size-small: 12px;

  /* 变量：大号字号（主要用于字幕） */
  --plyr-font-size-large: 18px;

  /* 变量：更大号字号（主要用于字幕） */
  --plyr-font-size-xlarge: 20px;

  /* 变量：时间显示的字号 */
  --plyr-font-size-time: var(--plyr-font-size-small);

  /* 变量：菜单使用的字号 */
  --plyr-font-size-menu: var(--plyr-font-size-small);

  /* 变量：徽章（badge）使用的字号 */
  --plyr-font-size-badge: 9px;

  /* 变量：常规字重 */
  --plyr-font-weight-regular: 400;

  /* 变量：加粗字重 */
  --plyr-font-weight-bold: 600;

  /* 变量：播放器内部行高 */
  --plyr-line-height: 1.7;

  /* 变量：是否启用字体抗锯齿（font antialiasing） */
  --plyr-font-smoothing: antialiased;

  /* ========== 核心颜色与焦点（Core Colors & Focus）========== */

  /* 变量：主 UI 颜色（primary UI color） */
  --plyr-color-main: var(--ui-primary);

  /* 变量：视频与 poster 包裹层背景色（支持透明通道视频/封面时的底色） */
  --plyr-video-background: var(--ui-color-neutral-950);

  /* 变量：:focus-visible（键盘聚焦）时的焦点样式颜色 */
  --plyr-focus-visible-color: var(--ui-primary);

  /* ========== 徽章（Badge / Menu Badge）========== */

  /* 变量：菜单徽章的背景色 */
  --plyr-badge-background: var(--ui-color-neutral-800);

  /* 变量：菜单徽章的文字颜色 */
  --plyr-badge-text-color: var(--ui-color-neutral-200);

  /* 变量：菜单徽章的圆角 */
  --plyr-badge-border-radius: calc(var(--ui-radius) * 1.5);

  /* ========== 字幕（Captions）========== */

  /* 变量：字幕背景色 */
  --plyr-captions-background: rgb(0 0 0 / 80%);

  /* 变量：字幕文字颜色 */
  --plyr-captions-text-color: var(--color-white);

  /* ========== 控件尺寸与间距（Controls Layout）========== */

  /* 变量：控件图标尺寸 */
  --plyr-control-icon-size: 18px;

  /* 变量：控件之间的间距（部分地方会被当作倍数使用，例如 10px / 2 = 5px） */
  --plyr-control-spacing: 10px;

  /* 变量：控件内部 padding */
  --plyr-control-padding: calc(var(--plyr-control-spacing) * 0.7);

  /* 变量：控件圆角 */
  --plyr-control-radius: calc(var(--ui-radius) * 1.5);

  /* 变量：菜单项“选中/勾选”状态的背景色 */
  --plyr-control-toggle-checked-background: var(--plyr-color-main);

  /* ========== 视频控件外观（Video Controls）========== */

  /* 变量：视频控件区域背景（常用渐变遮罩） */
  --plyr-video-controls-background: linear-gradient(rgb(0 0 0 / 0%), rgb(0 0 0 / 75%));

  /* 变量：视频控件的文字/图标颜色 */
  --plyr-video-control-color: var(--color-white);

  /* 变量：视频控件在 :hover/:focus/:focus-visible 时的文字/图标颜色 */
  --plyr-video-control-color-hover: var(--color-white);

  /* 变量：视频控件在 :hover/:focus/:focus-visible 时的背景色 */
  --plyr-video-control-background-hover: var(--ui-text-default);

  /* ========== 音频控件外观（Audio Controls）========== */

  /* 变量：音频控件区域背景 */
  --plyr-audio-controls-background: var(--ui-bg-muted);

  /* 变量：音频控件的文字/图标颜色 */
  --plyr-audio-control-color: var(--ui-text);

  /* 变量：音频控件在 :hover/:focus/:focus-visible 时的文字/图标颜色 */
  --plyr-audio-control-color-hover: var(--color-white);

  /* 变量：音频控件在 :hover/:focus/:focus-visible 时的背景色 */
  --plyr-audio-control-background-hover: var(--plyr-color-main);

  /* ========== 菜单（Menu）========== */

  /* 变量：菜单背景色 */
  --plyr-menu-background: var(--ui-bg-muted);

  /* 变量：菜单项文字/图标颜色 */
  --plyr-menu-color: var(--ui-text);

  /* 变量：菜单阴影 */
  --plyr-menu-shadow: 0 1px 2px rgb(0 0 0 / 15%);

  /* 变量：菜单圆角 */
  --plyr-menu-radius: var(--ui-radius);

  /* 变量：菜单底部小箭头尺寸 */
  --plyr-menu-arrow-size: calc(var(--ui-radius) * 1.5);

  /* 变量：菜单内箭头颜色（子菜单指示箭头） */
  --plyr-menu-item-arrow-color: var(--ui-text-toned);

  /* 变量：菜单内箭头尺寸（子菜单指示箭头） */
  --plyr-menu-item-arrow-size: 4px;

  /* 变量：子菜单页顶部“返回按钮”下方分割线的边框颜色 */
  --plyr-menu-border-color: var(--ui-border-muted);

  /* 变量：子菜单页顶部“返回按钮”下方分割线的阴影颜色 */
  --plyr-menu-border-shadow-color: var(--color-white);

  /* ========== 进度/缓冲/加载（Progress / Buffer / Loading）========== */

  /* 变量：拖动条（Scrubber）加载态条纹尺寸 */
  --plyr-progress-loading-size: 25px;

  /* 变量：拖动条（Scrubber）加载态背景色 */
  --plyr-progress-loading-background: rgb(35 40 47 / 60%);

  /* 变量：视频缓冲（Buffered）填充颜色 */
  --plyr-video-progress-buffered-background: rgb(255 255 255 / 25%);

  /* 变量：音频缓冲（Buffered）填充颜色 */
  --plyr-audio-progress-buffered-background: rgb(193 200 209 / 60%);

  /* ========== 滑杆（Range）========== */

  /* 变量：滑块（Thumb）高度 */
  --plyr-range-thumb-height: 13px;

  /* 变量：滑块（Thumb）背景色 */
  --plyr-range-thumb-background: var(--color-white);

  /* 变量：滑块（Thumb）阴影 */
  --plyr-range-thumb-shadow: 0 1px 1px rgb(128 128 128 / 15%), 0 0 0 1px rgb(128 128 128 / 20%);

  /* 变量：滑块（Thumb）在 :active（按下）时阴影宽度 */
  --plyr-range-thumb-active-shadow-width: 3px;

  /* 变量：轨道（Track）高度 */
  --plyr-range-track-height: 5px;

  /* 变量：已播放/已填充部分（Fill）的颜色 */
  --plyr-range-fill-background: var(--plyr-color-main);

  /* 变量：视频轨道（Track）背景，用于 Scrubber/Progress */
  --plyr-video-range-track-background: var(--plyr-video-progress-buffered-background);

  /* 变量：视频滑块（Thumb）在 :active（按下）时阴影颜色 */
  --plyr-video-range-thumb-active-shadow-color: rgb(255 255 255 / 50%);

  /* 变量：音频轨道（Track）背景，用于 Scrubber/Progress */
  --plyr-audio-range-track-background: var(--plyr-audio-progress-buffered-background);

  /* 变量：音频滑块（Thumb）在 :active（按下）时阴影颜色 */
  --plyr-audio-range-thumb-active-shadow-color: rgb(128 128 128 / 10%);

  /* ========== 提示气泡（Tooltip）========== bg-stone-800 ring-stone-800 */

  /* 变量：提示气泡（Tooltip）背景色 */
  --plyr-tooltip-background: var(--ui-color-neutral-900);

  /* 变量：提示气泡（Tooltip）文字/图标颜色 */
  --plyr-tooltip-color: var(--color-white);

  /* 变量：提示气泡（Tooltip）内边距 */
  --plyr-tooltip-padding: calc(var(--plyr-control-spacing) / 2);

  /* 变量：提示气泡（Tooltip）底部小箭头尺寸 */
  --plyr-tooltip-arrow-size: var(--ui-radius);

  /* 变量：提示气泡（Tooltip）圆角 */
  --plyr-tooltip-radius: calc(var(--ui-radius) * 0.75);

  /* 变量：提示气泡（Tooltip）阴影 */
  --plyr-tooltip-shadow: 0 1px 2px rgb(0 0 0 / 15%);

  & > ::v-deep(div.plyr) {
    border-radius: var(--plyr-badge-border-radius);
  }

  &.media-plyr--waveform {
    & ::v-deep(.plyr__progress__container) {
      padding: 0;
      margin: 0;
    }

    & ::v-deep(.plyr__progress.media-plyr__progress-custom) {
      position: relative;
      height: var(--media-plyr-waveform-height, 40px);
      margin-right: calc(var(--plyr-range-thumb-height, 13px) / 3);

      // 注意：不能在这里裁剪，否则会把 Plyr tooltip 一起裁掉
      overflow: visible;
    }

    & ::v-deep(.plyr__progress.media-plyr__progress-native--hidden) {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      pointer-events: none;
      opacity: 0;
      clip-path: rect(0 0 0 0);
    }

    // 注意：不要覆盖 .plyr__tooltip 的定位样式
    // - Plyr 会基于轨道/输入框计算 tooltip 的定位
    // - 自行改 position 会导致 tooltip 与进度/点击区域错位
    & ::v-deep(.plyr__progress.media-plyr__progress-custom .plyr__tooltip) {
      z-index: 4;
      visibility: hidden;
      pointer-events: none;
      opacity: 0;
      transition:
        opacity 120ms ease-out,
        visibility 120ms ease-out;
    }

    & ::v-deep(.plyr__progress.media-plyr__progress-custom .plyr__tooltip.plyr__tooltip--visable) {
      visibility: visible;
      opacity: 1;
    }

    & ::v-deep(.plyr__progress.media-plyr__progress-custom .media-plyr__waveform-overlay) {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: stretch;

      // 仅裁剪波形本身，避免影响 Plyr tooltip 的显示
      overflow: hidden;
      pointer-events: auto;
    }

    & ::v-deep(.plyr__progress.media-plyr__progress-custom .media-plyr__waveform-overlay > *) {
      width: 100%;
      min-width: 0;
      height: 100%;
    }
  }
}
</style>
