/**
 * 接口：编辑器底部操作栏属性。
 */
export interface ICrawlersEditorActionsProps {
  /**
   * 属性：还原按钮文案。
   */
  restoreText: string;

  /**
   * 属性：放大按钮文案。
   */
  zoomInText: string;

  /**
   * 属性：缩小按钮文案。
   */
  zoomOutText: string;

  /**
   * 属性：自动排版按钮文案。
   */
  autoLayoutText: string;

  /**
   * 属性：恢复按钮文案。
   */
  redoText: string;

  /**
   * 属性：撤销按钮文案。
   */
  undoText: string;

  /**
   * 属性：取消按钮文案。
   */
  cancelText: string;

  /**
   * 属性：保存按钮文案。
   */
  saveText: string;

  /**
   * 属性：保存按钮是否禁用。
   */
  saveDisabled?: boolean;

  /**
   * 属性：执行按钮是否显示。
   */
  executeVisible?: boolean;

  /**
   * 属性：执行按钮文案。
   */
  executeText?: string;

  /**
   * 属性：执行按钮是否禁用。
   */
  executeDisabled?: boolean;

  /**
   * 属性：执行按钮是否加载中。
   */
  executeLoading?: boolean;
}

/**
 * 接口：编辑器底部操作栏事件。
 */
export interface ICrawlersEditorActionsEmits {
  /**
   * 事件：还原。
   */
  restore: [];

  /**
   * 事件：放大。
   */
  'zoom-in': [];

  /**
   * 事件：缩小。
   */
  'zoom-out': [];

  /**
   * 事件：自动排版。
   */
  'auto-layout': [];

  /**
   * 事件：恢复。
   */
  redo: [];

  /**
   * 事件：撤销。
   */
  undo: [];

  /**
   * 事件：取消。
   */
  cancel: [];

  /**
   * 事件：保存。
   */
  save: [];

  /**
   * 事件：执行。
   */
  execute: [];
}
