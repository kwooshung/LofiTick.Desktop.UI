/**
 * 接口：窗口状态快照
 * 描述：由 Desktop 壳侧通过事件或命令返回，用于 UI 同步窗口控制按钮状态。
 */
export interface IWindowSnapshot {
  /**
   * 是否置顶
   */
  isTopmost: boolean;

  /**
   * 是否最大化
   */
  isMaximized: boolean;

  /**
   * 是否全屏
   */
  isFullScreen: boolean;
}
