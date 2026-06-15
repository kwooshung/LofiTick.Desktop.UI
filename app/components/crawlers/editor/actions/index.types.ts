/**
 * 接口：编辑器底部操作栏属性。
 */
export interface ICrawlersEditorActionsProps {
  /**
   * 属性：取消按钮文案。
   */
  cancelText: string;

  /**
   * 属性：保存按钮文案。
   */
  saveText: string;
}

/**
 * 接口：编辑器底部操作栏事件。
 */
export interface ICrawlersEditorActionsEmits {
  /**
   * 事件：取消。
   */
  cancel: [];

  /**
   * 事件：保存。
   */
  save: [];
}
