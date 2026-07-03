/**
 * 接口：爬虫站点文件夹行。
 */
export interface IQueryResultCrawlerTargetRow {
  /**
   * 主键 ID。
   */
  id: number;

  /**
   * 网站名称。
   */
  name: string;

  /**
   * 唯一域名。
   */
  domain: string;

  /**
   * 基础 URL。
   */
  baseUrl: string;

  /**
   * 描述。
   */
  description: string;

  /**
   * 是否启用。
   */
  isEnabled: boolean;

  /**
   * 任务数量。
   */
  taskCount: number;

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
 * 接口：爬虫站点文件夹分页响应。
 */
export interface IQueryResultCrawlerTargetSummaryPage {
  /**
   * 行列表。
   */
  rows: IQueryResultCrawlerTargetRow[];

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

/**
 * 接口：爬虫站点表单。
 */
export interface IPageCrawlerTargetForm {
  /**
   * 主键 ID。
   */
  id: number;

  /**
   * 网站名称。
   */
  name: string;

  /**
   * 唯一域名。
   */
  domain: string;

  /**
   * 基础 URL。
   */
  baseUrl: string;

  /**
   * 描述。
   */
  description: string;

  /**
   * 是否启用。
   */
  isEnabled: boolean;
}

/**
 * 接口：爬虫站点页面属性。
 */
export interface IPageCrawlersTargetsProps {
  /**
   * 属性：创建 nonce。
   * 描述：用于触发创建相关逻辑的刷新。
   */
  createNonce?: number;

  /**
   * 属性：搜索关键词。
   */
  keyword?: string;
}
