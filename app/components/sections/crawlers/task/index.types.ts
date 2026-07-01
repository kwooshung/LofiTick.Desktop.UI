/**
 * 接口：爬虫任务区属性。
 */
export interface ISectionsCrawlersTaskProps {
  /**
   * 属性：任务执行弹窗是否打开。
   */
  dialogOpen: boolean;
}

/**
 * 类型：爬虫任务区事件。
 */
export interface ISectionsCrawlersTaskEmits {
  /**
   * 事件：更新任务执行弹窗打开状态。
   * @param {boolean} value 是否打开
   */
  (event: 'update:dialogOpen', value: boolean): void;
}
