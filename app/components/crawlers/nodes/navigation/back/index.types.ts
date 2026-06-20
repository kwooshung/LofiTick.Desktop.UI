/**
 * 接口：后退节点数据。
 */
export interface ICrawlersNodesNavigationBackData {
  /**
   * 属性：后退步数。
   */
  steps?: number;

  /**
   * 属性：后退后是否等待页面 ready。
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
