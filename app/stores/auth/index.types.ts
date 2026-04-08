/**
 * 接口：认证状态
 */
export interface IStoresAuth {
  /**
   * UI 状态
   */
  ui: {
    /**
     * 是否显示锁屏/遮罩
     */
    show: boolean;

    /**
     * 是否锁定（预留字段）
     */
    lock: boolean;
  };

  /**
   * 成员信息（最小占位，避免组件依赖缺失）
   */
  member: {
    /**
     * MFA 状态（最小占位）
     */
    mfa: {
      /**
       * 当前是否已通过验证
       */
      verify: boolean;
    };
  };
}

/**
 * 接口：认证状态更新参数
 */
export interface IStoresAuthUpdate {
  /**
   * UI 状态
   */
  ui?: {
    /**
     * 是否显示锁屏/遮罩
     */
    show?: boolean;

    /**
     * 是否锁定
     */
    lock?: boolean;
  };

  /**
   * 成员信息
   */
  member?: {
    /**
     * MFA 状态
     */
    mfa?: {
      /**
       * 当前是否已通过验证
       */
      verify?: boolean;
    };
  };
}
