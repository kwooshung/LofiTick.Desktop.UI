/**
 * 接口：Tauri 爬虫蓝图执行请求。
 */
export interface ITauriCrawlerBlueprintExecuteRequest {
  /**
   * 蓝图 ID。
   */
  blueprintId: number;

  /**
   * 站点 ID。
   */
  targetId: number;

  /**
   * 站点名称。
   */
  siteName: string;

  /**
   * 基础 URL。
   */
  baseUrl: string;

  /**
   * 完整节点图数据。
   */
  nodes: unknown;
}

/**
 * 接口：Tauri 爬虫蓝图执行响应。
 */
export interface ITauriCrawlerBlueprintExecuteResponse {
  /**
   * 执行会话 ID。
   */
  sessionId?: string;

  /**
   * 任务 ID。
   */
  taskId?: string;
}
