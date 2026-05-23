import type { THotsearchPlatformType } from '@@/shared/types/pages/settings/hotsearch/index.types';

/**
 * 类型：热搜接口字段契约。
 *
 * 该文件用于约束 LofiTick.Desktop.UI 热搜页后续可消费的字段面。
 * 当前前端只有 [app/pages/hotsearch/index.vue] 这一层壳页面，尚未接入列表/详情请求，
 * 因此这里先锚定后端已经稳定存在的热搜相关结构，避免后续页面实现时再临时猜字段。
 *
 * 当前可确认的后端来源：
 * - `LofiTick.API/src/service/hot_search.rs`
 * - `LofiTick.API/src/handler/hot_search.rs`
 *
 * 当前已确认接口：
 * - `/crons/hot_searches/{platform}` -> `IQueryResultHotSearchCronPlatformResponse`
 * - `/crons/hot_searches/all` -> `IQueryResultHotSearchCronAllResponse`
 * - `/hotsearch/rows/{id}` PATCH -> `IQueryResultHotSearchUpdateResponse`
 * - `/hotsearch/dates` GET -> `IHotsearchArchiveDateSummary[]`
 * - `/hotsearch/dates/recount` -> `IQueryResultHotSearchDateRecountResponse`
 *
 * 说明：
 * - `/hotsearch/dates` 是热搜页面右上角日历使用的只读日期摘要接口。
 * - `/hotsearch/dates/recount` 是管理侧按日期重算 `hot_search_dates.count` 的独立接口。
 */

/**
 * 接口：热搜已入库记录。
 */
export interface IQueryResultHotSearchStoredRow {
  /** 主键 ID */
  id: number;

  /** 标题 */
  title: string;

  /** 正文内容 */
  content: string;

  /** 链接 */
  url: string;

  /** 分类枚举 ID */
  category: number;

  /** 平台枚举 ID */
  platform: number;

  /** 热度 */
  popularity: number;

  /** 是否已生成播客 */
  isPodcast: boolean;

  /** 本次是否新入库 */
  isNew: boolean;
}

/**
 * 接口：按平台抓取并入库响应。
 */
export interface IQueryResultHotSearchCronPlatformResponse {
  /** 平台 ID */
  platform: number;

  /** 总条数 */
  total: number;

  /** 新入库条数 */
  inserted: number;

  /** 去重命中条数 */
  existed: number;

  /** 列表 */
  items: IQueryResultHotSearchStoredRow[];
}

/**
 * 接口：抓取全部平台并入库响应。
 */
export interface IQueryResultHotSearchCronAllResponse {
  /** 汇总结果列表 */
  results: IQueryResultHotSearchCronPlatformResponse[];
}

/**
 * 接口：热搜更新请求。
 */
export interface IQueryResultHotSearchUpdateRequest {
  /** 是否已生成播客 */
  isPodcast?: boolean;

  /** 分类枚举 ID */
  category?: number;
}

/**
 * 接口：热搜更新响应。
 */
export interface IQueryResultHotSearchUpdateResponse {
  /** 是否成功 */
  ok: boolean;

  /** 受影响行数 */
  affected: number;
}

/**
 * 接口：按日期重算统计请求。
 */
export interface IQueryResultHotSearchDateRecountRequest {
  /** 日期（YYYY-MM-DD） */
  date: string;
}

/**
 * 接口：按日期重算统计响应。
 */
export interface IQueryResultHotSearchDateRecountResponse {
  /** 日期（YYYY-MM-DD） */
  date: string;

  /** 该日期的热搜条数 */
  count: number;
}

/**
 * 类型：热搜页面主分区。
 */
export type THotsearchSectionKey = 'data' | 'podcast' | 'music';

/**
 * 类型：热搜播客页面变体。
 */
export type THotsearchPodcastVariantKey = 'morning-short' | 'morning-long' | 'evening-short' | 'evening-long';

/**
 * 类型：热搜自媒体平台键。
 */
export type THotsearchMediaPlatformKey = 'general' | 'bilibili' | 'toutiao' | 'ixigua' | 'douyin' | 'xiaohongshu' | 'kuaishou' | 'weibo' | 'shengbo' | 'youtube' | 'ximalaya' | 'qingtingfm' | 'wangyi-podcast' | 'pipixia' | 'pipigaoxiao';

/**
 * 接口：热搜日期归档摘要。
 */
export interface IHotsearchArchiveDateSummary {
  /** 日期（YYYY-MM-DD） */
  date: string;

  /** 当天总条数 */
  totalCount: number;

  /** 当天新增条数 */
  newCount: number;

  /** 当天已生成播客条数 */
  podcastCount: number;

  /** 当天涉及平台数 */
  platformCount: number;

  /** 是否已有完整媒体产物 */
  mediaReady: boolean;

  /** 最近更新时间文本 */
  updatedAt: string;
}

/**
 * 接口：热搜数据表格行。
 */
export interface IHotsearchDataRow {
  /** 主键 ID */
  id: number;

  /** 日期（YYYY-MM-DD） */
  date: string;

  /** 排名 */
  rank: number;

  /** 标题 */
  title: string;

  /** 摘要 */
  summary: string;

  /** 链接 */
  url: string;

  /** 分类 i18n key */
  categoryKey: string;

  /** 平台 ID */
  platform: number;

  /** 平台类型 */
  platformType: THotsearchPlatformType;

  /** 热度 */
  popularity: number;

  /** 是否已生成播客 */
  isPodcast: boolean;

  /** 是否为新增 */
  isNew: boolean;

  /** 创建时间文本 */
  publishedAt: string;
}

/**
 * 接口：热搜数据分页结果。
 */
export interface IHotsearchDataPage {
  /** 行列表 */
  rows: IHotsearchDataRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：热搜平台统计行。
 */
export interface IHotsearchPlatformSummaryRow {
  /** 平台 ID */
  platform: number;

  /** 平台类型 */
  platformType: THotsearchPlatformType;

  /** 数量 */
  count: number;

  /** 创建时间文本 */
  createdAt: string;

  /** 更新时间文本 */
  updatedAt: string;
}

/**
 * 接口：热搜平台统计分页结果。
 */
export interface IHotsearchPlatformSummaryPage {
  /** 行列表 */
  rows: IHotsearchPlatformSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：热搜标签统计行。
 */
export interface IHotsearchTagSummaryRow {
  /** 分类 ID */
  category: number;

  /** 分类 i18n key */
  categoryKey: string;

  /** 数量 */
  count: number;

  /** 创建时间文本 */
  createdAt: string;

  /** 更新时间文本 */
  updatedAt: string;
}

/**
 * 接口：热搜标签统计分页结果。
 */
export interface IHotsearchTagSummaryPage {
  /** 行列表 */
  rows: IHotsearchTagSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：热搜播客单句脚本。
 */
export interface IHotsearchPodcastSentence {
  /** 句子 ID */
  id: string;

  /** 播报者姓名 */
  speakerName: string;

  /** 文案内容 */
  text: string;

  /** 音频时长文本 */
  durationLabel: string;

  /** 音频地址 */
  audioUrl: string;

  /** 波形路径 */
  waveformPath: string;
}

/**
 * 接口：热搜完整媒体源。
 */
export interface IHotsearchPodcastMediaSource {
  /** 媒体地址 */
  src: string;

  /** MIME 类型 */
  type?: string;

  /** 清晰度或尺寸 */
  size?: number;
}

/**
 * 接口：热搜完整媒体资产。
 */
export interface IHotsearchPodcastMediaAsset {
  /** 资产 ID */
  id: string;

  /** 标题 */
  title: string;

  /** 描述 */
  description: string;

  /** 媒体类型 */
  kind: 'audio' | 'video';

  /** 封面图 */
  poster?: string;

  /** 波形路径（仅音频） */
  waveformPath?: string;

  /** 媒体源列表 */
  sources: IHotsearchPodcastMediaSource[];
}

/**
 * 接口：热搜自媒体平台选项。
 */
export interface IHotsearchMediaPlatformOption {
  /** 平台键 */
  key: THotsearchMediaPlatformKey;

  /** 平台名称 i18n key */
  labelKey: string;

  /** 平台类别 */
  category: 'general' | 'video' | 'audio' | 'community';

  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 接口：热搜播客页面视图模型。
 */
export interface IHotsearchPodcastViewModel {
  /** 日期 */
  date: string;

  /** 当前播客变体 */
  variant: THotsearchPodcastVariantKey;

  /** 标题 */
  title: string;

  /** 描述 */
  description: string;

  /** 当前选中平台 */
  selectedPlatformKey: THotsearchMediaPlatformKey;

  /** 可选平台列表 */
  availablePlatforms: IHotsearchMediaPlatformOption[];

  /** 句子列表 */
  sentences: IHotsearchPodcastSentence[];

  /** 完整媒体资产 */
  assets: IHotsearchPodcastMediaAsset[];
}
