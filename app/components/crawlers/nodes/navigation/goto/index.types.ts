/**
 * 接口：跳转页面节点数据。
 */
export interface ICrawlersNodesNavigationGotoData {
  /**
   * 属性：目标路径（将与开始节点 domain 拼接）。
   */
  path?: string;

  /**
   * 属性：历史兼容字段，旧版本使用目标地址。
   */
  url?: string;

  /**
   * 属性：是否显示 WebView。
   */
  showWebview?: boolean;

  /**
   * 属性：跳转后是否等待页面 ready。
   */
  waitReady?: boolean;

  /**
   * 属性：等待超时（毫秒）。
   */
  timeoutMs?: number;
}
