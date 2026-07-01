/**
 * 接口：爬虫任务区属性。
 */
export interface ISectionsCrawlersTaskProps {
  /**
   * 属性：任务执行弹窗是否打开。
   */
  dialogOpen: boolean;

  /**
   * 属性：当前任务是否正在执行。
   */
  taskExecuting: boolean;

  /**
   * 属性：当前 Pixabay 爬虫 WebView 任务 ID。
   */
  webviewTaskId: string;

  /**
   * 属性：当前 Pixabay 爬虫 WebView 是否可见。
   */
  webviewVisible: boolean;
}

/**
 * 类型：爬虫任务区事件。
 */
export interface ISectionsCrawlersTaskEmits {
  /**
   * 事件：更新任务执行弹窗打开状态。
   * @param {boolean} value 是否打开
   */
  (event: 'update:dialogOpen' | 'update:taskExecuting' | 'update:webviewVisible', value: boolean): void;

  /**
   * 事件：更新当前 Pixabay 爬虫 WebView 任务 ID。
   * @param {string} value 任务 ID
   */
  (event: 'update:webviewTaskId', value: string): void;
}
