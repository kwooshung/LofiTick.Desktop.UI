/**
 * 接口：QQ 群列表行。
 */
export interface IQueryResultQqGroupsSummaryRow {
  /** 主键 ID */
  id: number;

  /** 群名称 */
  name: string;

  /** 群号 */
  number: number;

  /** 当前人数 */
  size: number;

  /** 群链接 */
  url: string;

  /** 是否完整（全量信息已抓取/已补齐） */
  full: boolean;

  /** 是否启用 */
  enabled: boolean;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：QQ 群列表分页响应。
 */
export interface IQueryResultQqGroupsSummaryPage {
  /** 行列表 */
  rows: IQueryResultQqGroupsSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

export type IQueryResultSocialQqGroupSummaryPage = IQueryResultQqGroupsSummaryPage;
