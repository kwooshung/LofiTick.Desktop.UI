import type { THotsearchPodcastSegmentType, THotsearchPodcastVoiceKey } from '@@/shared/types/pages/settings/hotsearch/index.types';

/**
 * 接口：首页欢迎邮件生成结果
 */
export interface IPageHomeWelcomeEmailPayload {
  /**
   * 属性：邮件主题
   */
  subject: string;

  /**
   * 属性：纯文本内容
   */
  text: string;

  /**
   * 属性：HTML 内容
   */
  html: string;

  /**
   * 属性：收件人列表
   */
  to: string[];
}

/**
 * 接口：首页发送欢迎邮件响应
 */
export interface IPageHomeSendWelcomeEmailResponse {
  /**
   * 属性：是否成功
   */
  ok: boolean;

  /**
   * 属性：实际收件人数
   */
  toCount: number;
}

/**
 * 类型：首页播客脚本生成时段。
 */
export type TPageHomePodcastEdition = 'morning' | 'evening';

/**
 * 类型：首页播客脚本生成篇幅。
 */
export type TPageHomePodcastLength = 'short' | 'long';

/**
 * 类型：首页播客正文片段类型。
 */
export type TPageHomePodcastBodySegmentType = Exclude<THotsearchPodcastSegmentType, 'adContent' | 'adPlaceholder'>;

/**
 * 接口：首页播客广告片段。
 */
export interface IPageHomePodcastScriptAdvertisementItem {
  /**
   * 播报角色。
   */
  voiceKey: THotsearchPodcastVoiceKey;

  /**
   * 文本内容。
   */
  content: string;

  /**
   * 片段类型。
   */
  segmentType: 'adContent';
}

/**
 * 接口：首页播客脚本生成请求。
 */
export interface IPageHomePodcastScriptGenerateRequest {
  /**
   * 时段。
   */
  edition: TPageHomePodcastEdition;

  /**
   * 篇幅。
   */
  length: TPageHomePodcastLength;

  /**
    * 可选的媒体平台英文名。
    */
    mediaPlatformName?: string;

    /**
   * 广告开头片段列表。
   */
  adOpeningItems: IPageHomePodcastScriptAdvertisementItem[];

  /**
   * 广告结尾片段列表。
   */
  adClosingItems: IPageHomePodcastScriptAdvertisementItem[];

  /**
   * 正文片段列表。
   */
  bodyItems: IPageHomePodcastScriptBodyItem[];
}

/**
 * 接口：首页播客脚本行。
 */
export interface IPageHomePodcastScriptLine {
  /**
   * 播报角色。
   */
  speakerRole: Exclude<THotsearchPodcastVoiceKey, 'R'>;

  /**
   * 真实 speaker code。
   */
  speaker: string;

  /**
   * 播报文本。
   */
  text: string;

  /**
   * 文案类型。
   */
  segmentType: THotsearchPodcastSegmentType;
}

/**
 * 接口：首页播客正文片段。
 */
export interface IPageHomePodcastScriptBodyItem {
  /**
   * 播报角色。
   */
  voiceKey: THotsearchPodcastVoiceKey;

  /**
   * 文本内容。
   */
  content: string;

  /**
   * 片段类型。
   */
  segmentType: TPageHomePodcastBodySegmentType;
}

/**
 * 接口：首页播客脚本生成结果。
 */
export interface IPageHomePodcastScriptGenerateResponse {
  /**
   * 时段。
   */
  edition: TPageHomePodcastEdition;

  /**
   * 篇幅。
   */
  length: TPageHomePodcastLength;

  /**
   * 当前标题。
   */
  title: string;

  /**
   * 可选的媒体平台英文名。
   */
  mediaPlatformName?: string;

  /**
   * 最终播报行。
   */
  lines: IPageHomePodcastScriptLine[];
}
