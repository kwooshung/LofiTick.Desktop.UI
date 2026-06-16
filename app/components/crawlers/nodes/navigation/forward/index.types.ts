/**
 * 接口：前进节点数据。
 */
export interface ICrawlersNodesNavigationForwardData {
  /**
   * 属性：前进步数。
   */
  steps?: number;

  /**
   * 属性：前进后是否等待页面 ready。
   */
  waitReady?: boolean;

  /**
   * 属性：等待超时（毫秒）。
   */
  timeoutMs?: number;

  /**
   * 属性：无历史记录时是否忽略错误。
   */
  allowNoHistory?: boolean;
}
