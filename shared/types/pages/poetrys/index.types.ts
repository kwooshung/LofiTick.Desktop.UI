/**
 * 接口：诗词标签基础信息。
 */
export interface IQueryResultPoetryTagsBasicRow {
  /** 标签 ID */
  id: number;

  /** 标签名称 */
  name: string;

  /** 关联数量 */
  count: number;
}

/**
 * 接口：诗词朝代基础信息。
 */
export interface IQueryResultPoetryDynastiesBasicRow {
  /** 朝代 ID */
  id: number;

  /** 朝代名称 */
  name: string;

  /** 关联数量 */
  count: number;
}

/**
 * 接口：诗词作者基础信息。
 */
export interface IQueryResultPoetryAuthorsBasicRow {
  /** 作者 ID */
  id: number;

  /** 作者名称 */
  name: string;

  /** 关联数量 */
  count: number;
}

/**
 * 接口：诗词列表行。
 */
export interface IQueryResultPoetrysSummaryRow {
  /** 作品 ID */
  id: number;

  /** 标题 */
  title: string;

  /** 摘要句 */
  sentence: string;

  /** 正文段落 */
  content: string[];

  /** 译文段落 */
  translate: string[];

  /** 朝代 */
  dynasty: IQueryResultPoetryDynastiesBasicRow;

  /** 作者 */
  author: IQueryResultPoetryAuthorsBasicRow;

  /** 标签 */
  tags: IQueryResultPoetryTagsBasicRow[];

  /** 是否启用 */
  enabled: boolean;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：诗词列表分页响应。
 */
export interface IQueryResultPoetrysSummaryPage {
  /** 行列表 */
  rows: IQueryResultPoetrysSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：诗词作者列表行。
 */
export interface IQueryResultPoetryAuthorsSummaryRow {
  /** 作者 ID */
  id: number;

  /** 作者名称 */
  name: string;

  /** 关联数量 */
  count: number;

  /** 代表性朝代（用于作者页展示与联动筛选） */
  dynasty?: IQueryResultPoetryDynastiesBasicRow | null;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：诗词作者分页响应。
 */
export interface IQueryResultPoetryAuthorsSummaryPage {
  /** 行列表 */
  rows: IQueryResultPoetryAuthorsSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：诗词朝代列表行。
 */
export interface IQueryResultPoetryDynastiesSummaryRow {
  /** 朝代 ID */
  id: number;

  /** 朝代名称 */
  name: string;

  /** 关联数量 */
  count: number;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：诗词朝代分页响应。
 */
export interface IQueryResultPoetryDynastiesSummaryPage {
  /** 行列表 */
  rows: IQueryResultPoetryDynastiesSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}

/**
 * 接口：诗词标签列表行。
 */
export interface IQueryResultPoetryTagsSummaryRow {
  /** 标签 ID */
  id: number;

  /** 标签名称 */
  name: string;

  /** 关联数量 */
  count: number;

  /** 更新时间（ISO 字符串） */
  updated: string;

  /** 创建时间（ISO 字符串） */
  created: string;
}

/**
 * 接口：诗词标签分页响应。
 */
export interface IQueryResultPoetryTagsSummaryPage {
  /** 行列表 */
  rows: IQueryResultPoetryTagsSummaryRow[];

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总数 */
  total: number;
}
