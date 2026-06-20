/**
 * 接口：刷新页面节点数据。
 */
export interface ICrawlersNodesNavigationRefreshData {
  /**
   * 属性：刷新后是否等待页面 ready。
   */
  waitReady?: boolean;

  /**
   * 属性：等待超时（毫秒）。
   */
  timeoutMs?: number;

  /**
   * 属性：是否强制刷新。
   */
  hardReload?: boolean;
}
