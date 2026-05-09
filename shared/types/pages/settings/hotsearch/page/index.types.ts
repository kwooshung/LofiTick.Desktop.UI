/**
 * 类型：热搜平台标识。
 */
export type THotsearchPlatformType = 'baidu' | 'sina' | 'sina-news' | 'weibo' | 'toutiao' | 'qq-news' | 'thepaper' | 'netease-news' | 'huxiu' | 'hupu' | 'zhihu' | 'zhihu-daily' | 'ifanr' | 'sspai' | 'guokr' | '36kr' | 'douban-group' | 'helloGitHub' | 'v2ex' | 'history';

/**
 * 接口：热搜平台项。
 */
export interface ISettingsHotsearchPlatformItem {
  /**
   * 平台枚举 ID。
   */
  id: number;

  /**
   * 平台类型。
   */
  type: THotsearchPlatformType;

  /**
   * i18n 键。
   */
  key: string;
}

/**
 * 接口：热搜自动化设置。
 */
export interface ISettingsHotsearch {
  /**
   * 是否启用热搜自动抓取。
   */
  enabled: boolean;

  /**
   * 是否启用播客自动生成。
   */
  podcastEnabled: boolean;

  /**
   * 月度预算积分。
   */
  monthlyBudget: number;

  /**
   * 已启用的平台 ID 列表。
   */
  platformIds: number[];

  /**
   * 早间热搜开始时间，格式 HH:mm。
   */
  morningStartAt: string;

  /**
   * 晚间热搜开始时间，格式 HH:mm。
   */
  eveningStartAt: string;

  /**
   * 单个平台之间的抓取间隔（单位：秒）。
   */
  platformIntervalSeconds: number;

  /**
   * 早晚窗口的随机偏移范围（单位：秒）。
   */
  scheduleJitterSeconds: number;

  /**
   * 播客生成缓冲时长（单位：分钟）。
   */
  podcastBufferMinutes: number;

  /**
   * 失败后的最大重试次数。
   */
  retryMaxAttempts: number;

  /**
   * 重试间隔（单位：分钟）。
   */
  retryDelayMinutes: number;
}
