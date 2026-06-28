/**
 * 接口：跳转页面路径变量。
 */
export interface ICrawlersNodesNavigationGotoPathVariable {
  /**
   * 属性：变量唯一标识。
   */
  id: string;

  /**
   * 属性：变量名称。
   */
  name: string;
}

/**
 * 接口：跳转页面节点数据。
 */
export interface ICrawlersNodesNavigationGotoData {
  /**
   * 属性：目标路径（将与开始节点 domain 拼接）。
   */
  path?: string;

  /**
   * 属性：来自数据引脚或上一执行节点的目标路径。
   */
  inputPath?: string;

  /**
   * 属性：目标路径模板变量定义列表。
   */
  pathVariables?: ICrawlersNodesNavigationGotoPathVariable[];

  /**
   * 属性：历史兼容字段，旧版本使用目标地址。
   */
  url?: string;

  /**
   * 属性：窗口宽度（像素）。
   */
  windowWidth?: number;

  /**
   * 属性：窗口高度（像素）。
   */
  windowHeight?: number;

  /**
   * 属性：窗口位置模式。
   */
  windowPositionMode?: 'preset' | 'custom';

  /**
   * 属性：窗口预设位置。
   */
  windowPositionPreset?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

  /**
   * 属性：窗口坐标 X（像素）。
   */
  windowX?: number;

  /**
   * 属性：窗口坐标 Y（像素）。
   */
  windowY?: number;

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
