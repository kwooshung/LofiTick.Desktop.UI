/**
 * 接口：首页欢迎邮件生成结果
 */
export interface IPageHomeWelcomeEmailPayload {
  /**
   * 属性：邮件主题
   */
  subject: string;

  /**
   * 属性：纯文本内容
   */
  text: string;

  /**
   * 属性：HTML 内容
   */
  html: string;

  /**
   * 属性：收件人列表
   */
  to: string[];
}

/**
 * 接口：首页发送欢迎邮件响应
 */
export interface IPageHomeSendWelcomeEmailResponse {
  /**
   * 属性：是否成功
   */
  ok: boolean;

  /**
   * 属性：实际收件人数
   */
  toCount: number;
}
