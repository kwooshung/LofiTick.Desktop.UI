/**
 * 接口：主题切换动画选项
 */
export interface IThemeSwitchAnimationOptions {
  /**
   * 动画持续时间，单位毫秒（默认：750）
   */
  duration?: number;

  /**
   * 动画缓动函数（默认：'ease-in-out'）
   */
  easing?: string;

  /**
   * 伪元素选择器（默认：'::view-transition-new(root)'）
   */
  pseudoElement?: string;

  /**
   * 全局类名（默认：'dark'）
   */
  globalClassName?: string;

  /**
   * 动画类型（默认：ThemeAnimationType.CIRCLE）
   */
  animationType?: EThemeAnimationType;

  /**
   * 模糊圆圈的模糊量（仅在 animationType 为 BLUR_CIRCLE 时有效，默认：2）
   */
  blurAmount?: number;

  /**
   * 样式元素 ID（默认：'theme-switch-style'）
   */
  styleId?: string;
}
