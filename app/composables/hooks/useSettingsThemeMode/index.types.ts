/**
 * 接口：useSettingsThemeMode 返回结果
 */
export interface IUseSettingsThemeModeResult {
  /**
   * 函数：设置主题模式
   * @param {TSettingsThemeMode} mode 主题模式
   * @param {HTMLElement | null} triggerEl 触发元素（用于动画起点）
   * @return {Promise<void>} Promise
   */
  themeModeSet: (mode: TSettingsThemeMode, triggerEl?: HTMLElement | null) => Promise<void>;

  /**
   * 函数：循环切换主题模式
   * - 顺序：dark -> light -> system -> dark
   * @param {HTMLElement | null} triggerEl 触发元素（用于动画起点）
   * @return {Promise<void>} Promise
   */
  themeModeCycle: (triggerEl?: HTMLElement | null) => Promise<void>;
}

/**
 * 类型：useSettingsThemeMode 返回结果
 */
export type TUseSettingsThemeModeResult = IUseSettingsThemeModeResult;
