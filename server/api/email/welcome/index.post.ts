import { createError, defineEventHandler, readBody } from 'h3';

import { welcomeEmailBuild } from '@@/server/utils/email/index';

/**
 * 接口：欢迎邮件请求体
 */
interface IApiEmailWelcomeBody {
  /**
   * 属性：语言代码
   */
  locale?: string;
}

/**
 * API：生成欢迎邮件内容。
 *
 * 该接口只负责在本地渲染欢迎邮件模板，真正发送仍由前端继续调用 Rust `/email/send`。
 */
export default defineEventHandler(async (event) => {
  /**
   * 常量：body。
   */
  const body = (await readBody<IApiEmailWelcomeBody>(event).catch(() => null)) ?? {};

  try {
    /**
     * 常量：datas。
     */
    const datas = await welcomeEmailBuild(String(body.locale ?? 'zh_cn'));

    return {
      datas,
      status: {
        type: '000',
        http: 200,
        biz: 0,
        aim: 0,
        ts: String(Date.now())
      }
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Welcome Email Build Failed'
    });
  }
});
