import { createError, defineEventHandler, getMethod } from 'h3';

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
  if (getMethod(event) !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  const { csrf, headerName } = useCsrf();

  const token = String(csrf ?? '').trim();
  const header = String(headerName ?? '').trim();

  if (token === '' || header === '') {
    throw createError({ statusCode: 500, statusMessage: 'CSRF Token Unavailable' });
  }

  return {
    token,
    headerName: header
  };
});
