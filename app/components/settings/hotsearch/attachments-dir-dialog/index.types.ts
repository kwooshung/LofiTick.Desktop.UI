/**
 * 接口：附件目录确认弹窗属性。
 */
export interface ISettingsHotsearchAttachmentsDirDialogProps {
  /**
   * 属性：弹窗开关。
   */
  open: boolean;

  /**
   * 属性：当前附件目录。
   */
  currentPath?: string;
}

/**
 * 接口：附件目录确认弹窗事件。
 */
export interface ISettingsHotsearchAttachmentsDirDialogEmits {
  /**
   * 事件：更新弹窗开关。
   */
  (event: 'update:open', value: boolean): void;

  /**
   * 事件：附件目录已保存。
   */
  (event: 'selected', value: string): void;
}
