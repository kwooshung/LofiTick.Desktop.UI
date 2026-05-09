/**
 * 接口：文件选择过滤器
 */
export interface IOpenFileFilter {
  /**
   * 过滤器名称
   */
  name: string;

  /**
   * 扩展名列表（不带点）
   */
  extensions: string[];
}

/**
 * 接口：打开文件对话框参数
 */
export interface IOpenFilePayload {
  /**
   * 对话框标题
   */
  title: string;

  /**
   * 默认路径（可选）
   */
  defaultPath?: string;

  /**
   * 过滤器（可选）
   */
  filters?: IOpenFileFilter[];
}
