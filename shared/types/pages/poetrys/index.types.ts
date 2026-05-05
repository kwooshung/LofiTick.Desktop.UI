/**
 * 类型：诗词接口字段契约。
 *
 * 该文件是 LofiTick.Desktop.UI 诗词页面的单一字段来源，
 * 字段面必须与 Rust API 的真实响应保持一致。
 *
 * 契约来源：
 * - `LofiTick.API/src/service/poetry.rs`
 * - `LofiTick.API/src/handler/poetry.rs`
 *
 * 当前前端已使用的接口：
 * - `poetrys` -> `IQueryResultPoetrysSummaryPage`
 * - `poetrys/detail` -> `IQueryResultPoetryDetailResponse`
 * - `poetrys/authors` -> `IQueryResultPoetryAuthorsSummaryPage`
 * - `poetrys/dynasties` -> `IQueryResultPoetryDynastiesSummaryPage`
 * - `poetrys/searchs/authors` -> `IQueryResultPoetrySearchAuthorsResponse`
 * - `poetrys/searchs/dynasties` -> `IQueryResultPoetrySearchDynastiesResponse`
 *
 * 明确不存在的旧字段：
 * - `chapter`
 * - `section`
 * - `translate`
 */

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
 *
 * 该结构严格对应后端 `PoetrySummaryRow`。
 * 不允许额外补入 `chapter`、`section`、`translate` 等旧字段。
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
 *
 * 该结构严格对应后端 `PoetryDetailRow`。
 * 详情当前只返回 `content` 正文段落，不返回 `translate`。
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

  /** 摘要句 */
  sentence: string;

  /** 正文段落 */
  content: string[];

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
 * 接口：诗词作者联想响应。
 */
export interface IQueryResultPoetrySearchAuthorsResponse {
  /** 行列表 */
  rows: IQueryResultPoetryAuthorsBasicRow[];
}

/**
 * 接口：诗词朝代联想响应。
 */
export interface IQueryResultPoetrySearchDynastiesResponse {
  /** 行列表 */
  rows: IQueryResultPoetryDynastiesBasicRow[];
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
