/**
 * 接口：Cookie 键值结构。
 */
export interface ICookiePair {
  /**
   * 属性：行 ID。
   */
  id: string;

  /**
   * 属性：Cookie 名称。
   */
  name: string;

  /**
   * 属性：Cookie 值。
   */
  value: string;

  /**
   * 属性：域名。
   */
  domain: string;

  /**
   * 属性：路径。
   */
  path: string;

  /**
   * 属性：SameSite 策略。
   */
  sameSite: string;

  /**
   * 属性：过期时间（本地日期时间字符串）。
   */
  expiresAt: string;

  /**
   * 属性：是否 HttpOnly。
   */
  httpOnly: boolean;

  /**
   * 属性：是否 Secure。
   */
  secure: boolean;

  /**
   * 属性：是否持久化。
   */
  persistent: boolean;
}

/**
 * 类型：Cookie 时间输入值。
 */
export type TCookieInputTimeValue = ReturnType<typeof import('@internationalized/date').parseTime>;
