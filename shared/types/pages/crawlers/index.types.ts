/**
 * 接口：爬虫目标站点列表行。
 */
export interface IQueryResultCrawlerTargetRow {
  /**
   * 主键 ID
   */
  id: number;

  /**
   * 网站名称
   */
  name: string;

  /**
   * 唯一域名
   */
  domain: string;

  /**
   * 基础URL
   */
  baseUrl: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 是否启用
   */
  isEnabled: boolean;

  /**
   * 任务数量
   */
  taskCount: number;

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 更新时间
   */
  updatedAt: string;
}

/**
 * 接口：爬虫目标站点列表分页响应。
 */
export interface IQueryResultCrawlerTargetSummaryPage {
  /**
   * 行列表
   */
  rows: IQueryResultCrawlerTargetRow[];

  /**
   * 当前页
   */
  page: number;

  /**
   * 每页数量
   */
  pageSize: number;

  /**
   * 总数
   */
  total: number;
}

/**
 * 接口：爬虫目标站点表单。
 */
export interface IPageCrawlerTargetForm {
  /**
   * 主键 ID
   */
  id: number;

  /**
   * 网站名称
   */
  name: string;

  /**
   * 唯一域名
   */
  domain: string;

  /**
   * 基础URL
   */
  baseUrl: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 是否启用
   */
  isEnabled: boolean;
}

/**
 * 接口：爬虫目标站点页面属性。
 */
export interface IPageCrawlersTargetsProps {
  /**
   * 属性：创建 nonce
   * 描述：用于触发创建相关逻辑的刷新
   */
  createNonce?: number;

  /**
   * 属性：搜索关键词
   */
  keyword?: string;
}

/**
 * 类型：爬虫函数作用域。
 */
export type TCrawlerFunctionScope = 'site' | 'global';

/**
 * 接口：爬虫函数列表行。
 */
export interface IQueryResultCrawlerFunctionRow {
  /**
   * 函数 ID。
   */
  id: number;

  /**
   * 函数名称。
   */
  name: string;

  /**
   * 作用域。
   */
  scope: TCrawlerFunctionScope;

  /**
   * 站点 ID。
   */
  targetId: number;

  /**
   * 引用数量。
   */
  referenceCount: number;

  /**
   * 创建时间。
   */
  createdAt: string;

  /**
   * 更新时间。
   */
  updatedAt: string;
}

/**
 * 类型：爬虫蓝图执行状态。
 */
export type TCrawlerBlueprintLastRunStatus = 'pending' | 'running' | 'success' | 'failed' | 'stopped' | string;

/**
 * 接口：爬虫蓝图列表行。
 */
export interface IQueryResultCrawlerBlueprintRow {
  /**
   * 蓝图 ID。
   */
  id: number;

  /**
   * 站点 ID。
   */
  targetId: number;

  /**
   * 蓝图名称。
   */
  name: string;

  /**
   * 蓝图描述。
   */
  description: string;

  /**
   * 是否启用。
   */
  isEnabled: boolean;

  /**
   * 最后执行状态。
   */
  lastRunStatus: TCrawlerBlueprintLastRunStatus;

  /**
   * 最后执行时间。
   */
  lastRunAt: string;

  /**
   * 创建时间。
   */
  createdAt: string;

  /**
   * 更新时间。
   */
  updatedAt: string;
}

/**
 * 接口：爬虫蓝图列表分页响应。
 */
export interface IQueryResultCrawlerBlueprintSummaryPage {
  /**
   * 列表行。
   */
  rows: IQueryResultCrawlerBlueprintRow[];

  /**
   * 当前页。
   */
  page: number;

  /**
   * 每页数量。
   */
  pageSize: number;

  /**
   * 总数。
   */
  total: number;
}
