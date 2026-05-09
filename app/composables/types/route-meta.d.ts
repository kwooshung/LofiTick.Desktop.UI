import 'vue-router';

declare global {
  /**
   * 类型：窗口状态变化取消订阅句柄
   */
  type TUnsubscribeWindowStateChange = () => void;

  /**
   * 类型：关闭询问取消订阅句柄
   */
  type TUnsubscribePrecloseOnAppPreClose = () => void;

  /**
   * 接口：窗口状态快照
   */
  interface IWindowSnapshot {
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

  /**
   * 接口：电源状态
   */
  interface IPowerStatus {
    /**
     * 策略值
     */
    policy: {
      /**
       * 系统休眠策略
       */
      system: 'never' | 'always' | 'crawling' | 'playing';

      /**
       * 显示器休眠策略
       */
      display: 'never' | 'always' | 'crawling' | 'playing';
    };

    /**
     * 运行态阻止状态
     */
    active: {
      /**
       * 系统阻止是否生效
       */
      system: boolean;

      /**
       * 显示器阻止是否生效
       */
      display: boolean;
    };
  }

  /**
   * 类型：窗口关闭行为
   */
  type TSettingsCloseBehavior = 'unset' | 'minimize-to-tray' | 'exit';
}

declare module 'vue-router' {
  interface RouteMeta {
    // 直接写死标题（不推荐 i18n 下使用）
    title?: string;
    // i18n key（推荐），例如 'pages.home.title'
    titleKey?: string;
    // 传给 t() 的参数（可选），也会与 route.params 合并
    titleParams?: Record<string, string | number>;

    // 描述的 i18n key（可选）
    descriptionKey?: string;
    descriptionParams?: Record<string, string | number>;
  }
}
