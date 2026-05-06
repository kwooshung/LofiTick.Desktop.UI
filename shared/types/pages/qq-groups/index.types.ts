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
 * 接口：QQ 群管理表格行。
 */
export interface IPageTableColumnQqGroup {
  /**
   * 主键 ID
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 群号
   */
  number: string;

  /**
   * 规模
   */
  size: number;

  /**
   * 加群链接
   */
  url: string;

  /**
   * 是否满员
   */
  full: boolean;

  /**
   * 是否启用
   */
  enabled: boolean;

  /**
   * 时间
   */
  times: {
    /**
     * 更新时间
     */
    updated: string;

    /**
     * 创建时间
     */
    created: string;
  };
}

/**
 * 接口：QQ 群管理表单。
 */
export interface IPageQqGroupForm {
  /**
   * 主键 ID
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 群号
   */
  number: string;

  /**
   * 规模
   */
  size: number;

  /**
   * 加群链接
   */
  url: string;

  /**
   * 是否满员
   */
  full: boolean;

  /**
   * 是否启用
   */
  enabled: boolean;
}

/**
 * 接口：QQ 群页面属性。
 */
export interface IPageQqGroupsProps {
  /**
   * 属性：创建 nonce
   * 描述：用于触发创建相关逻辑的刷新
   */
  createNonce?: number;
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
