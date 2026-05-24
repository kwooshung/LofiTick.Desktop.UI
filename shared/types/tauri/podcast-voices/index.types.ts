/**
 * 类型：播客试听角色。
 */
export type TPodcastVoiceRole = 'duet';

/**
 * 接口：Tauri 播客音色示例结果。
 * 描述：对应 Desktop 壳侧 `PodcastVoiceSampleResult`。
 */
export interface ITauriPodcastVoiceSampleResult {
  /**
   * 稳定音色键。
   */
  key: string;

  /**
   * 展示名称。
   */
  name: string;

  /**
   * 展示说明。
   */
  description: string;

  /**
   * 试听角色。
   */
  role: TPodcastVoiceRole;

  /**
   * 音频 MIME 类型。
   */
  mimeType: string;

  /**
   * Base64 音频内容。
   */
  audioBase64: string;

  /**
   * 本地音频文件路径。
   */
  audioFilePath: string;

  /**
   * 当前音色的错误信息。
   */
  errorMessage: string;
}
