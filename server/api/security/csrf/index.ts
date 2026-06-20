import { createError, defineEventHandler } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';

/**
 * 接口：Nuxt CSRF token 刷新响应。
 */
interface IApiSecurityCsrfResponse {
  /** 当前可用的 CSRF token */
  token: string;

  /** 当前请求头名称 */
  headerName: string;
}

/**
 * API：获取当前页面可用的 Nuxt CSRF token。
 *
 * 该接口仅服务于前端同源自愈：当 `nuxt-csurf` 因旧 token 产生 `EBADCSRFTOKEN` 时，
 * 客户端可以先拉取一次最新 token，再重试真正的写请求。
 *
 * # Returns
 *
 * 返回当前请求上下文中的 CSRF token 与 header 名称。
 *
 * # Errors
 *
 * 当请求方法不是 `GET`，或当前 token 不可用时返回错误。
 */
export default defineEventHandler((event): IApiSecurityCsrfResponse => {
  if (event.method !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  /**
   * 常量：runtimeConfig。
   */
  const runtimeConfig = useRuntimeConfig(event);
  /**
   * 函数：token。
   */
  const token = String((event.context as Record<string, unknown>).csrfToken ?? '').trim();
  /**
   * 常量：publicConfig。
   */
  const publicConfig = runtimeConfig.public as { csurf?: { headerName?: unknown } } | undefined;
  /**
   * 常量：csurf。
   */
  const csurf = publicConfig?.csurf;
  /**
   * 常量：header。
   */
  const header = String(csurf?.headerName ?? '').trim();

  if (token === '' || header === '') {
    throw createError({ statusCode: 500, statusMessage: 'CSRF Token Unavailable' });
  }

  return {
    token,
    headerName: header
  };
});
