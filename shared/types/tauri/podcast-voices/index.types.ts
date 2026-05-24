/**
 * 类型：播客音色角色。
 */
export type TPodcastVoiceRole = 'random' | 'single' | 'duet';

/**
 * 接口：Tauri 播客音色条目。
 * 描述：对应 Desktop 壳侧 `PodcastVoiceCatalogItem`。
 */
export interface ITauriPodcastVoiceCatalogItem {
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
   * 音色角色。
   */
  role: TPodcastVoiceRole;
}

/**
 * 接口：Tauri 播客音色状态。
 * 描述：对应 Desktop 壳侧 `PodcastVoicesState`。
 */
export interface ITauriPodcastVoicesState {
  /**
   * 最近一次更新时间。
   */
  updatedAt: string;

  /**
   * 音色列表。
   */
  items: ITauriPodcastVoiceCatalogItem[];
}

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
   * 音色角色。
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
