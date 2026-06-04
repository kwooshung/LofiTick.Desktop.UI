/**
 * 类型：热搜平台标识。
 */
export type THotsearchPlatformType = 'baidu' | 'sina' | 'sina-news' | 'weibo' | 'toutiao' | 'qq-news' | 'thepaper' | 'netease-news' | 'huxiu' | 'hupu' | 'zhihu' | 'zhihu-daily' | 'ifanr' | 'sspai' | 'guokr' | '36kr' | 'douban-group' | 'helloGitHub' | 'v2ex' | 'history';

/**
 * 类型：热搜播客音色标识。
 */
export type THotsearchPodcastVoiceKey = 'M' | 'F' | 'R';

/**
 * 类型：热搜播客开头音乐类型。
 */
export type THotsearchPodcastHeadMusicKind = 'normal' | 'vip';

/**
 * 类型：热搜播客模板类型。
 */
export type THotsearchPodcastTemplateType = 'opening' | 'closing';

/**
 * 类型：热搜播客文案类型。
 */
export type THotsearchPodcastSegmentType = 'normal' | 'morningOnly' | 'eveningOnly' | 'adContent' | 'adPlaceholder';

/**
 * 类型：热搜播客模板文案类型。
 */
export type THotsearchPodcastTemplateSegmentType = Exclude<THotsearchPodcastSegmentType, 'adContent'>;

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
  segmentType: THotsearchPodcastTemplateSegmentType;

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
 * 接口：热搜播客开头音乐远端路径。
 */
export interface ISettingsHotsearchPodcastHeadMusicRemotePaths {
  /**
   * 普通版远端对象路径。
   */
  normal: string;

  /**
   * VIP 版远端对象路径。
   */
  vip: string;
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
   * 播客 AI 规则 Markdown。
   */
  podcastAiRulesMarkdown: string;

  /**
   * 播客模板片段列表。
   */
  podcastTemplateItems: ISettingsHotsearchPodcastTemplateItem[];

  /**
   * 播客开头音乐远端对象路径。
   */
  podcastHeadMusicRemotePaths: ISettingsHotsearchPodcastHeadMusicRemotePaths;

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

/**
 * 接口：热搜播客生成占用信息。
 */
export interface ISettingsHotsearchPodcastGenerateOwner {
  /**
   * 当前占用机器码。
   */
  machineCode: string;

  /**
   * 当前占用机器名称。
   */
  machineName: string;

  /**
   * 首次开启时间。
   */
  enabledAt: string;

  /**
   * 最近心跳或续租时间。
   */
  updatedAt: string;
}

/**
 * 接口：热搜本地设置。
 */
export interface ISettingsHotsearchLocal extends ISettingsHotsearch {
  /**
   * 本机是否承担播客生成。
   */
  podcastGenerateEnabled: boolean;
}
