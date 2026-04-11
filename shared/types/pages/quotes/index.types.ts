/**
 * 接口：语录作者基础信息。
 */
export interface IQueryResultQuotesAuthorsBasicRow {
  /** 作者 ID */
  id: number;

  /** 作者名称 */
  name: string;

  /** 关联数量 */
  count: number;
}

/**
 * 接口：语录来源基础信息。
 */
export interface IQueryResultQuotesSourcesBasicRow {
  /** 来源 ID */
  id: number;

  /** 来源名称 */
  name: string;

  /** 关联数量 */
  count: number;
}

/**
 * 接口：语录列表行。
 */
export interface IQueryResultQuotesSummaryRow {
  /** 语录 ID */
  id: number;

  /** UUID */
  uuid: string;

  /** 名句 */
  sentence: string;

  /** 译文 */
  translate: string;

  /** 类型 ID */
  typeId: number;

  /** 作者 */
  author: IQueryResultQuotesAuthorsBasicRow;

  /** 来源 */
  source: IQueryResultQuotesSourcesBasicRow;

  /** 是否启用 */
  enabled: boolean;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：语录列表分页响应。
 */
export interface IQueryResultQuotesSummaryPage {
  /** 行列表 */
  rows: IQueryResultQuotesSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：语录作者列表行。
 */
export interface IQueryResultQuotesAuthorsSummaryRow {
  /** 作者 ID */
  id: number;

  /** 作者名称 */
  name: string;

  /** 关联数量 */
  count: number;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：语录作者分页响应。
 */
export interface IQueryResultQuotesAuthorsSummaryPage {
  /** 行列表 */
  rows: IQueryResultQuotesAuthorsSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：语录来源列表行。
 */
export interface IQueryResultQuotesSourcesSummaryRow {
  /** 来源 ID */
  id: number;

  /** 来源名称 */
  name: string;

  /** 关联数量 */
  count: number;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：语录来源分页响应。
 */
export interface IQueryResultQuotesSourcesSummaryPage {
  /** 行列表 */
  rows: IQueryResultQuotesSourcesSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：语录 UUID 搜索行。
 */
export interface IQueryResultQuotesSearchUuid {
  /** 主键 ID */
  id: number;

  /** UUID */
  uuid: string;
}

export type IQueryResultQuoteAuthorsBasicRow = IQueryResultQuotesAuthorsBasicRow;
export type IQueryResultQuoteSourcesBasicRow = IQueryResultQuotesSourcesBasicRow;
export type IQueryResultQuoteAuthorsSummaryPage = IQueryResultQuotesAuthorsSummaryPage;
export type IQueryResultQuoteSourcesSummaryPage = IQueryResultQuotesSourcesSummaryPage;
