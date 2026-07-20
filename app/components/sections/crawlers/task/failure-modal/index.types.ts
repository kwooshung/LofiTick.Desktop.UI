/**
 * 接口：失败弹窗属性。
 */
export interface ISectionsCrawlersTaskFailureModalProps {
  /**
   * 属性：弹窗是否打开。
   */
  open: boolean;

  /**
   * 属性：标题。
   */
  title: string;

  /**
   * 属性：描述。
   */
  description: string;

  /**
   * 属性：是否继续等待中。
   */
  continuing: boolean;

  /**
   * 属性：是否终止中。
   */
  stopping: boolean;
}

/**
 * 类型：失败弹窗事件。
 */
export interface ISectionsCrawlersTaskFailureModalEmits {
  /**
   * 事件：更新打开状态。
   * @param {boolean} value 是否打开
   */
  (event: 'update:open', value: boolean): void;

  /**
   * 事件：取消。
   */
  (event: 'cancel'): void;

  /**
   * 事件：继续等待。
   */
  (event: 'continue'): void;

  /**
   * 事件：终止任务。
   */
  (event: 'stop'): void;
}
