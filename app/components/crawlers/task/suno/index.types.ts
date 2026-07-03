/**
 * 接口：Suno 任务组件属性。
 */
export interface ICrawlersTaskSunoProps {
  /**
   * 属性：任务执行弹窗是否打开。
   */
  dialogOpen: boolean;
}

/**
 * 类型：Suno 任务组件事件。
 */
export interface ICrawlersTaskSunoEmits {
  /**
   * 事件：更新任务执行弹窗打开状态。
   * @param {boolean} value 是否打开
   */
  (event: 'update:dialogOpen', value: boolean): void;
}
