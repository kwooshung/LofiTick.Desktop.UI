import { invoke } from '@tauri-apps/api/core';

/**
 * Hook：Tauri 播客试听能力
 * 描述：统一封装 Desktop 壳侧的首页固定播客预览读取与生成命令。
 * @returns {object} 试听能力方法
 */
export const useTauriPodcastVoices = () => {
  /**
   * 函数：读取首页固定播客预览文件列表
   * @returns {Promise<ITauriPodcastVoiceSampleResult[]>} 音色示例结果
   */
  const samplesListGet = async (): Promise<ITauriPodcastVoiceSampleResult[]> => {
    return invoke<ITauriPodcastVoiceSampleResult[]>('podcast_voice_samples_list');
  };

  /**
   * 函数：获取首页固定播客预览支持数量
   * @returns {Promise<number>} 当前支持的预览条目数量
   */
  const supportedCountGet = async (): Promise<number> => {
    return invoke<number>('podcast_voice_samples_supported_count_get');
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
    supportedCountGet
  };
};
