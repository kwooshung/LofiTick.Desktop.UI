import { omit } from 'es-toolkit/object';
import colors from 'tailwindcss/colors';

/**
 * Hook：统一的主题外观设置
 * - 负责处理：中性色/主色/圆角/黑主色的 appConfig 写入、本地存储同步
 * - TODO: 集成 Tauri invoke API，同步主题外观到原生设置
 * @return {TUseSettingsThemeStyleResult} Hook 返回对象
 */
export const useSettingsThemeStyle = (): TUseSettingsThemeStyleResult => {
  /**
   * Hook：应用配置
   */
  const appConfig = useAppConfig();

  /**
   * 函数：本地存储：设置
   * @param {string} key key
   * @param {string} value value
   * @return {void} void
   */
  const localStorageSet = (key: string, value: string): void => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(key, value);
  };

  /*====================【中性色系】====================*/
  /**
   * 常量：中性色系：颜色列表
   */
  const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive', 'ink'];

  /**
   * 计算属性：中性色系：计算属性
   */
  const computedNeutral = computed(() => appConfig.ui.colors.neutral);

  /**
   * 函数：中性色系：设置
   * @param {string} color 颜色
   * @return {void} void
   */
  const handleSetNeutralColor = (color: string): void => {
    appConfig.ui.colors.neutral = color;
    localStorageSet('app-theme-neutral', color);
    // TODO: invoke Tauri API to sync neutral color to native settings
  };

  /*====================【主要色系】====================*/
  /**
   * 常量：主要色系：排除某些颜色（这些颜色不适合作为主要色）
   */
  const colorsToOmit: (keyof typeof colors)[] = ['inherit', 'current', 'transparent', 'black', 'white', ...(neutralColors as (keyof typeof colors)[])];

  /**
   * 常量：主要色系：颜色列表
   */
  const primaryColors = Object.keys(omit(colors, colorsToOmit));

  /**
   * 计算属性：主要色系：计算属性
   */
  const computedPrimary = computed(() => appConfig.ui.colors.primary);

  /**
   * 函数：主要色系：设置
   * @param {string} color 颜色
   * @return {void} void
   */
  const handleSetPrimaryColor = (color: string): void => {
    appConfig.ui.colors.primary = color;
    handleSetBlackAsPrimary(false);
    localStorageSet('app-theme-primary', color);
    // TODO: invoke Tauri API to sync primary color to native settings
  };

  /*====================【圆角】====================*/
  /**
   * 常量：圆角：可选值（单位：rem）
   */
  const radiuses = [0, 0.125, 0.25, 0.375, 0.5];

  /**
   * 计算属性：圆角：计算属性
   */
  const computedRadius = computed(() => appConfig.theme.radius);

  /**
   * 函数：圆角：设置
   * @param {number} value 圆角值
   * @return {void} void
   */
  const handleSetRadius = (value: number): void => {
    appConfig.theme.radius = value;
    localStorageSet('app-theme-radius', String(value));
    // TODO: invoke Tauri API to sync corner radius to native settings
  };

  /*====================【辅助功能】====================*/
  /**
   * 函数：深色模式下使用黑色作为主要色
   * @param {boolean} value 是否启用
   * @return {void} void
   */
  const handleSetBlackAsPrimary = (value: boolean): void => {
    appConfig.theme.blackAsPrimary = value;
    localStorageSet('app-theme-black-as-primary', String(value));
    // TODO: invoke Tauri API to sync blackAsPrimary to native settings
  };

  return {
    neutralColors,
    primaryColors,
    radiuses,
    computedNeutral,
    computedPrimary,
    computedRadius,
    handleSetNeutralColor,
    handleSetPrimaryColor,
    handleSetRadius,
    handleSetBlackAsPrimary
  };
};
