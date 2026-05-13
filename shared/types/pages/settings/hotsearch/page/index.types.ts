/**
 * 类型：热搜平台标识。
 */
export type THotsearchPlatformType = 'baidu' | 'sina' | 'sina-news' | 'weibo' | 'toutiao' | 'qq-news' | 'thepaper' | 'netease-news' | 'huxiu' | 'hupu' | 'zhihu' | 'zhihu-daily' | 'ifanr' | 'sspai' | 'guokr' | '36kr' | 'douban-group' | 'helloGitHub' | 'v2ex' | 'history';

/**
 * 类型：热搜播客音色标识。
 */
export type THotsearchPodcastVoiceKey = 'random' | 'xiaoluo' | 'feifei';

/**
 * 类型：热搜播客模板类型。
 */
export type THotsearchPodcastTemplateType = 'opening' | 'closing';

/**
 * 类型：热搜播客文案类型。
 */
export type THotsearchPodcastSegmentType = 'normal' | 'adOpening' | 'adContent' | 'adClosing';

/**
 * 接口：热搜播客模板片段。
 */
export interface ISettingsHotsearchPodcastTemplateItem {
  /**
   * 播报音色。
   */
  voiceKey: THotsearchPodcastVoiceKey;

  /**
   * 文案内容。
   */
  content: string;

  /**
   * 文案类型。
   */
  segmentType: THotsearchPodcastSegmentType;

  /**
   * 模板类型。
   */
  templateType: THotsearchPodcastTemplateType;
}

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
   * 男生播报者名称。
   */
  podcastMaleSpeakerName: string;

  /**
   * 女生播报者名称。
   */
  podcastFemaleSpeakerName: string;

  /**
   * 早间节目名称。
   */
  podcastMorningProgramName: string;

  /**
   * 晚间节目名称。
   */
  podcastEveningProgramName: string;

  /**
   * VIP 专项版早间节目名称。
   */
  podcastVipMorningProgramName: string;

  /**
   * VIP 专项版晚间节目名称。
   */
  podcastVipEveningProgramName: string;

  /**
   * 播客模板片段列表。
   */
  podcastTemplateItems: ISettingsHotsearchPodcastTemplateItem[];

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
   * 播客生成缓冲时长（单位：秒）。
   */
  podcastBufferSeconds: number;

  /**
   * 失败后的最大重试次数。
   */
  retryMaxAttempts: number;

  /**
   * 重试间隔（单位：秒）。
   */
  retryDelaySeconds: number;
}
