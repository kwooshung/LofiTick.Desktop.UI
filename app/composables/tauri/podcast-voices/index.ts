import { invoke } from '@tauri-apps/api/core';

/**
 * Hook：Tauri 播客音色元数据
 * 描述：统一封装 Desktop 壳侧的播客音色 catalog 读写命令。
 * @returns {object} 音色元数据方法
 */
export const useTauriPodcastVoices = () => {
  /**
   * 函数：读取首页官方音色示例文件列表
   * @returns {Promise<ITauriPodcastVoiceSampleResult[]>} 音色示例结果
   */
  const samplesListGet = async (): Promise<ITauriPodcastVoiceSampleResult[]> => {
    return invoke<ITauriPodcastVoiceSampleResult[]>('podcast_voice_samples_list');
  };

  /**
   * 函数：获取首页官方音色示例支持数量
   * @returns {Promise<number>} 当前支持的官方音色数量
   */
  const supportedCountGet = async (): Promise<number> => {
    return invoke<number>('podcast_voice_samples_supported_count_get');
  };

  /**
   * 函数：获取播客音色状态
   * @returns {Promise<ITauriPodcastVoicesState>} 音色状态
   */
  const stateGet = async (): Promise<ITauriPodcastVoicesState> => {
    return invoke<ITauriPodcastVoicesState>('podcast_voices_state_get');
  };

  /**
   * 函数：更新播客音色状态
   * @param {ITauriPodcastVoicesState} state 音色状态
   * @returns {Promise<ITauriPodcastVoicesState>} 写入后的音色状态
   */
  const stateUpdate = async (state: ITauriPodcastVoicesState): Promise<ITauriPodcastVoicesState> => {
    return invoke<ITauriPodcastVoicesState>('podcast_voices_state_update', { state });
  };

  /**
   * 函数：为全部支持音色生成示例音频
   * @param {string} text 示例文案
   * @returns {Promise<ITauriPodcastVoiceSampleResult[]>} 音色示例结果
   */
  const samplesGenerate = async (text: string): Promise<ITauriPodcastVoiceSampleResult[]> => {
    return invoke<ITauriPodcastVoiceSampleResult[]>('podcast_voice_samples_generate', { text });
  };

  return {
    samplesGenerate,
    samplesListGet,
    supportedCountGet,
    stateGet,
    stateUpdate
  };
};
