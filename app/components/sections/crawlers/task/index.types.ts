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
   * 属性：当前 Pixabay 爬虫浏览器会话任务 ID。
   */
  browserSessionTaskId: string;

  /**
   * 属性：当前 Pixabay 爬虫浏览器会话是否可见。
   */
  browserSessionVisible: boolean;
}

/**
 * 类型：爬虫任务区事件。
 */
export interface ISectionsCrawlersTaskEmits {
  /**
   * 事件：更新任务执行弹窗打开状态。
   * @param {boolean} value 是否打开
   */
  (event: 'update:dialogOpen' | 'update:taskExecuting' | 'update:browserSessionVisible', value: boolean): void;

  /**
   * 事件：更新当前 Pixabay 爬虫浏览器会话任务 ID。
   * @param {string} value 任务 ID
   */
  (event: 'update:browserSessionTaskId', value: string): void;
}
