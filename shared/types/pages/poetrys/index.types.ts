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
 * 类型：诗词作品类型。
 */
export type TPoetryKind = 'unknown' | 'shi' | 'ci' | 'qu' | 'fu' | 'wen';

/**
 * 接口：词牌/曲牌基础信息。
 */
export interface IQueryResultPoetryRhythmicBasicRow {
  /** 词牌/曲牌 ID */
  id: number;

  /** 词牌/曲牌名称 */
  name: string;
}

/**
 * 接口：诗词列表行。
 */
export interface IQueryResultPoetrysSummaryRow {
  /** 作品 ID */
  id: number;

  /** 标题 */
  title: string;

  /** 类型 */
  kind: TPoetryKind;

  /** 词牌/曲牌 */
  rhythmic: IQueryResultPoetryRhythmicBasicRow;

  /** 章/卷/篇 */
  chapter: string;

  /** 节/部 */
  section: string;

  /** 摘要句 */
  sentence: string;

  /** 朝代 */
  dynasty: IQueryResultPoetryDynastiesBasicRow;

  /** 作者 */
  author: IQueryResultPoetryAuthorsBasicRow;

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
 * 接口：诗词表列信息。
 */
export interface IPageTableColumnPoetrysInfos {
  /** 标题 */
  title: string;

  /** 类型 */
  kind: TPoetryKind;

  /** 词牌/曲牌 */
  rhythmic: IQueryResultPoetryRhythmicBasicRow;

  /** 章/卷/篇 */
  chapter: string;

  /** 节/部 */
  section: string;

  /** 核心句 */
  sentence: string;

  /** 朝代 */
  dynasty: IQueryResultPoetryDynastiesBasicRow;

  /** 作者 */
  author: IQueryResultPoetryAuthorsBasicRow;
}

/**
 * 接口：诗词表列时间。
 */
export interface IPageTableColumnPoetrysTime {
  /** 更新时间 */
  updated: string;

  /** 创建时间 */
  created: string;
}

/**
 * 接口：诗词表列。
 */
export interface IPageTableColumnPoetrys {
  /** 作品 ID */
  id: number;

  /** 作品信息 */
  infos: IPageTableColumnPoetrysInfos;

  /** 是否启用 */
  enabled: boolean;

  /** 时间信息 */
  times: IPageTableColumnPoetrysTime;
}

/**
 * 接口：诗词详情信息。
 */
export interface IPagePoetrysDetailInfo {
  /** 作品 ID */
  id: number;

  /** 标题 */
  title: string;

  /** 类型 */
  kind: TPoetryKind;

  /** 词牌/曲牌 */
  rhythmic: IQueryResultPoetryRhythmicBasicRow;

  /** 章/卷/篇 */
  chapter: string;

  /** 节/部 */
  section: string;

  /** 摘要句 */
  sentence: string;

  /** 正文段落 */
  content: string[];

  /** 译文段落 */
  translate: string[];

  /** 作者 */
  author: IQueryResultPoetryAuthorsBasicRow;

  /** 朝代 */
  dynasty: IQueryResultPoetryDynastiesBasicRow;

  /** 是否启用 */
  enabled: boolean;

  /** 更新时间 */
  updated: string;

  /** 创建时间 */
  created: string;
}

/**
 * 接口：诗词详情响应。
 */
export interface IQueryResultPoetryDetailResponse {
  /** 详情 */
  detail: IPagePoetrysDetailInfo;
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

  /** 代表性朝代 */
  dynasty: IQueryResultPoetryDynastiesBasicRow;

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
 * 接口：诗词作者表列。
 */
export interface IPageTableColumnPoetryAuthors {
  /** 作者 ID */
  id: number;

  /** 作者信息 */
  infos: {
    /** 作者名称 */
    name: string;

    /** 作品数量 */
    count: number;

    /** 所属朝代 */
    dynasty: IQueryResultPoetryDynastiesBasicRow;
  };

  /** 时间信息 */
  times: {
    /** 更新时间 */
    updated: string;

    /** 创建时间 */
    created: string;
  };
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

  /** 作者数量 */
  authorCount: number;

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
 * 接口：诗词朝代表列。
 */
export interface IPageTableColumnPoetryDynasties {
  /** 朝代 ID */
  id: number;

  /** 朝代名称 */
  name: string;

  /** 作品数量 */
  count: number;

  /** 作者数量 */
  authorCount: number;

  /** 时间信息 */
  times: {
    /** 更新时间 */
    updated: string;

    /** 创建时间 */
    created: string;
  };
}
