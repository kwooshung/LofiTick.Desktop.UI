/**
 * Hook：统一的主题模式设置
 * - 负责处理：是否需要切换动画、matchMedia 判定、写入 preference
 * - TODO: 集成 Tauri invoke API，同步主题模式到原生设置
 * @param {IThemeSwitchAnimationOptions} options 动画配置项（可选）
 * @return {TUseSettingsThemeModeResult} Hook 返回对象
 */
export const useSettingsThemeMode = (options: IThemeSwitchAnimationOptions = {}): TUseSettingsThemeModeResult => {
  /**
   * Hook：主题模式
   */
  const colorMode = useColorMode();

  /**
   * Hook：主题模式，动画
   */
  const { triggerElRef, toggleSwitchTheme } = useThemeSwitchAnimation(options);

  /**
   * 函数：获取系统是否为深色
   * @return {boolean} 是否为深色
   */
  const systemIsDarkGet = (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  };

  /**
   * 函数：获取某个模式下的实际是否深色
   * @param {TSettingsThemeMode} mode 主题模式
   * @return {boolean} 是否为深色
   */
  const themeModeIsDarkGet = (mode: TSettingsThemeMode): boolean => {
    if (mode === 'dark') {
      return true;
    }
    if (mode === 'light') {
      return false;
    }
    return systemIsDarkGet();
  };

  /**
   * 函数：获取当前实际是否深色
   * @return {boolean} 是否为深色
   */
  const currentIsDarkGet = (): boolean => {
    /**
     * 常量：v。
     */
    const v = colorMode.value;

    if (v === 'dark') {
      return true;
    }
    if (v === 'light') {
      return false;
    }
    return systemIsDarkGet();
  };

  /**
   * 函数：设置主题模式
   * @param {TSettingsThemeMode} mode 主题模式
   * @param {HTMLElement | null} triggerEl 触发元素（用于动画起点）
   * @return {Promise<void>} Promise
   */
  const themeModeSet = async (mode: TSettingsThemeMode, triggerEl?: HTMLElement | null): Promise<void> => {
    if (triggerEl) {
      triggerElRef.value = triggerEl;
    }

    // 非浏览器环境不做 matchMedia/动画
    if (typeof window === 'undefined') {
      colorMode.preference = mode;
      // TODO: invoke Tauri API to sync theme mode to native settings
      return;
    }

    /**
     * 常量：currentIsDark。
     */
    const currentIsDark = currentIsDarkGet();
    /**
     * 常量：nextIsDark。
     */
    const nextIsDark = themeModeIsDarkGet(mode);

    if (currentIsDark !== nextIsDark) {
      await toggleSwitchTheme();
    }

    colorMode.preference = mode;
    // TODO: invoke Tauri API to sync theme mode to native settings
  };

  /**
   * 函数：循环切换主题模式
   * - 顺序：dark -> light -> system -> dark
   * @param {HTMLElement | null} triggerEl 触发元素（用于动画起点）
   * @return {Promise<void>} Promise
   */
  const themeModeCycle = async (triggerEl?: HTMLElement | null): Promise<void> => {
    /**
     * 常量：currentPreference。
     */
    const currentPreference = (colorMode.preference ?? 'system') as TSettingsThemeMode;
    const nextPreference: TSettingsThemeMode = currentPreference === 'dark' ? 'light' : currentPreference === 'light' ? 'system' : 'dark';

    await themeModeSet(nextPreference, triggerEl);
  };

  return {
    themeModeSet,
    themeModeCycle
  };
};
