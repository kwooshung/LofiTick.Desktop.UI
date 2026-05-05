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
 * - `/crons/hot_searchs/{platform}` -> `IQueryResultHotSearchCronPlatformResponse`
 * - `/crons/hot_searchs/all` -> `IQueryResultHotSearchCronAllResponse`
 * - `/hot_searchs/{id}` PATCH -> `IQueryResultHotSearchUpdateResponse`
 * - `/hot_search_dates/recount` -> `IQueryResultHotSearchDateRecountResponse`
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
