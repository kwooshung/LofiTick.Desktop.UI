import { invoke } from '@tauri-apps/api/core';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

import { buildCrawlerBlueprintSoundDataUrl, CRAWLER_BLUEPRINT_SOUND_BASE64_MAP } from '@/composables/tauri/crawler-blueprint/sounds';
import type { ITauriCrawlerBlueprintPlaySoundEvent, TTauriCrawlerBlueprintPlaySoundKind } from '@@/shared/types/index.types';

/**
 * 常量：爬虫蓝图输出日志事件名。
 */
const CRAWLER_BLUEPRINT_OUTPUT_LOG_EVENT = 'crawler-blueprint://output-log';
/**
 * 常量：爬虫蓝图播放提示音事件名。
 */
const CRAWLER_BLUEPRINT_PLAY_SOUND_EVENT = 'crawler-blueprint://play-sound';

/**
 * 变量：共享音频上下文。
 */
let stateCrawlerBlueprintAudioContext: AudioContext | null = null;

/**
 * 常量：提示音频率映射。
 */
const CRAWLER_BLUEPRINT_SOUND_FREQUENCY_MAP: Record<TTauriCrawlerBlueprintPlaySoundKind, number> = {
  info: 880,
  success: 660,
  warning: 520,
  error: 330
};

/**
 * 函数：获取提示音 data URL。
 *
 * base64 音频优先从集中资源表中读取，未配置时返回空串以便走兜底播放。
 *
 * # Arguments
 *
 * * `kind` - 提示音类型。
 *
 * # Returns
 *
 * 返回 data URL；未配置时返回空串。
 */
const getCrawlerBlueprintSoundDataUrl = (kind: TTauriCrawlerBlueprintPlaySoundKind): string => {
  return buildCrawlerBlueprintSoundDataUrl(CRAWLER_BLUEPRINT_SOUND_BASE64_MAP[kind] ?? '');
};

/**
 * 函数：获取共享音频上下文。
 *
 * 该上下文由执行入口解锁，由根组件常驻监听消费。
 *
 * # Returns
 *
 * 返回共享音频上下文；非客户端环境返回空值。
 */
const getCrawlerBlueprintAudioContext = (): AudioContext | null => {
  if (!import.meta.client) {
    return null;
  }

  if (!stateCrawlerBlueprintAudioContext) {
    stateCrawlerBlueprintAudioContext = new AudioContext();
  }

  return stateCrawlerBlueprintAudioContext;
};

/**
 * 函数：解锁提示音播放。
 *
 * 该函数必须在用户手势链路内调用一次，后续事件播放才能稳定生效。
 *
 * # Returns
 *
 * 返回 Promise；不可解锁时仍然安全结束。
 */
const unlockCrawlerBlueprintAudio = async (): Promise<void> => {
  const audioContext = getCrawlerBlueprintAudioContext();

  if (!audioContext || audioContext.state === 'running') {
    return;
  }

  try {
    await audioContext.resume();
  } catch {
    // 忽略解锁失败：浏览器策略会在用户再次触发后允许重试。
  }
};

/**
 * 函数：播放提示音。
 *
 * 该函数仅播放短促提示音，不加载外部素材。
 *
 * # Arguments
 *
 * * `kind` - 提示音类型。
 *
 * # Returns
 *
 * 返回 Promise；播放失败时静默结束。
 */
const playCrawlerBlueprintSound = async (kind: TTauriCrawlerBlueprintPlaySoundKind): Promise<void> => {
  const soundDataUrl = getCrawlerBlueprintSoundDataUrl(kind);

  if (soundDataUrl) {
    const audio = new Audio(soundDataUrl);

    try {
      await audio.play();
    } catch {
      // base64 音频播放失败时回退到合成音，避免提示链路中断。
    }

    return;
  }

  const audioContext = getCrawlerBlueprintAudioContext();

  if (!audioContext) {
    return;
  }

  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch {
      return;
    }
  }

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 1;
  gainNode.connect(audioContext.destination);

  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = CRAWLER_BLUEPRINT_SOUND_FREQUENCY_MAP[kind] ?? CRAWLER_BLUEPRINT_SOUND_FREQUENCY_MAP.info;
  oscillator.connect(gainNode);

  const startedAt = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0.0001, startedAt);
  gainNode.gain.exponentialRampToValueAtTime(1, startedAt + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startedAt + 0.18);

  oscillator.start(startedAt);
  oscillator.stop(startedAt + 0.2);

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
};

/**
 * Hook：Tauri 爬虫蓝图能力。
 * @returns {object} 爬虫蓝图能力方法。
 */
export const useTauriCrawlerBlueprint = () => {
  /**
   * Hook：Tauri 环境。
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：执行爬虫蓝图。
   * @param {ITauriCrawlerBlueprintExecuteRequest} request 执行请求。
   * @returns {Promise<ITauriCrawlerBlueprintExecuteResponse>} 执行响应。
   */
  const execute = async (request: ITauriCrawlerBlueprintExecuteRequest): Promise<ITauriCrawlerBlueprintExecuteResponse> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ITauriCrawlerBlueprintExecuteResponse>('crawler_blueprint_execute', { request });
  };

  /**
   * 函数：监听爬虫蓝图输出日志事件。
   * @param {(payload: ITauriCrawlerBlueprintOutputLogEvent) => void} handler 事件处理器。
   * @returns {Promise<UnlistenFn>} 取消监听函数。
   */
  const onOutputLogEvent = async (handler: (payload: ITauriCrawlerBlueprintOutputLogEvent) => void): Promise<UnlistenFn> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return listen<ITauriCrawlerBlueprintOutputLogEvent>(CRAWLER_BLUEPRINT_OUTPUT_LOG_EVENT, (event) => {
      handler(event.payload);
    });
  };

  /**
   * 函数：监听爬虫蓝图提示音事件。
   * @param {(payload: ITauriCrawlerBlueprintPlaySoundEvent) => void} handler 事件处理器。
   * @returns {Promise<UnlistenFn>} 取消监听函数。
   */
  const onPlaySoundEvent = async (handler: (payload: ITauriCrawlerBlueprintPlaySoundEvent) => void): Promise<UnlistenFn> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return listen<ITauriCrawlerBlueprintPlaySoundEvent>(CRAWLER_BLUEPRINT_PLAY_SOUND_EVENT, (event) => {
      handler(event.payload);
    });
  };

  return { execute, onOutputLogEvent, onPlaySoundEvent, unlockCrawlerBlueprintAudio, playCrawlerBlueprintSound };
};
