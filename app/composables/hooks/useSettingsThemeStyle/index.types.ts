/**
 * 接口：useSettingsThemeStyle 返回结果
 */
export interface IUseSettingsThemeStyleResult {
  /**
   * 常量：中性色系：颜色列表
   */
  neutralColors: string[];

  /**
   * 常量：主要色系：颜色列表
   */
  primaryColors: string[];

  /**
   * 常量：圆角：可选值（单位：rem）
   */
  radiuses: number[];

  /**
   * 计算属性：中性色系：计算属性
   */
  computedNeutral: ComputedRef<string>;

  /**
   * 计算属性：主要色系：计算属性
   */
  computedPrimary: ComputedRef<string>;

  /**
   * 计算属性：圆角：计算属性
   */
  computedRadius: ComputedRef<number>;

  /**
   * 函数：中性色系：设置
   * @param {string} color 颜色
   * @return {void} void
   */
  handleSetNeutralColor: (color: string) => void;

  /**
   * 函数：主要色系：设置
   * @param {string} color 颜色
   * @return {void} void
   */
  handleSetPrimaryColor: (color: string) => void;

  /**
   * 函数：圆角：设置
   * @param {number} value 圆角值
   * @return {void} void
   */
  handleSetRadius: (value: number) => void;

  /**
   * 函数：深色模式下使用黑色作为主要色
   * @param {boolean} value 是否启用
   * @return {void} void
   */
  handleSetBlackAsPrimary: (value: boolean) => void;
}

/**
 * 类型：useSettingsThemeStyle 返回结果
 */
export type TUseSettingsThemeStyleResult = IUseSettingsThemeStyleResult;
