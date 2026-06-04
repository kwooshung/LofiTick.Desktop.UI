import { createError, defineEventHandler, getCookie, getHeaders, getRequestHeader, getRequestURL, readRawBody, setCookie, setResponseHeaders, setResponseStatus } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';
import { $fetch } from 'ofetch';

import { pickSignRefreshBlob, resolveSignBlobCookieName, SIGN_INIT_PATH, SIGN_REFRESH_PATH, stripSignRefreshAttach } from '@@/shared/utils';

/**
 * 常量：假参数 nonce 的期望长度。
 */
const FAKE_NONCE_LEN = 8;

/**
 * 常量：假参数 sign 的期望长度。
 */
const FAKE_SIGN_LEN = 24;

/**
 * 常量：CSRF Cookie 名称（兜底）。
 */
const DEFAULT_CSRF_COOKIE_NAME = 'csrf_api';

/**
 * 常量：CSRF Header 名称（兜底）。
 */
const DEFAULT_CSRF_HEADER_NAME = 'X-CSRF-api-Token';

/**
 * 函数：去除 URL 末尾的 /。
 * @param {string} input 输入 URL
 * @return {string} 规范化后的 URL
 */
const trimTrailingSlash = (input: string): string => input.replace(/\/+$/, '');

/**
 * 函数：判断是否为 JSON Content-Type。
 * @param {string | null} contentType Content-Type
 * @return {boolean} 是否为 JSON
 */
const isJsonContentType = (contentType: string | null): boolean => {
  const v = String(contentType ?? '').toLowerCase();
  return v.includes('application/json');
};

/**
 * 函数：解析布尔开关（兼容 env 注入的字符串）。
 * @param {unknown} input 输入值
 * @return {boolean} 布尔值
 */
const boolFromRuntimeConfig = (input: unknown): boolean => {
  if (typeof input === 'boolean') {
    return input;
  }
  const v = String(input ?? '')
    .trim()
    .toLowerCase();
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') {
    return true;
  }
  if (v === '0' || v === 'false' || v === 'no' || v === 'off' || v === '') {
    return false;
  }
  return false;
};

/**
 * 函数：从 query/body 合并参数中校验迷惑假参数（nonce/sign）。
 * @param {Record<string, unknown>} params 合并后的参数
 * @returns {void} 无返回
 */
const validateFakeParams = (params: Record<string, unknown>): void => {
  const nonce = params.nonce;
  if (typeof nonce !== 'string') {
    throw createError({ statusCode: 403, statusMessage: 'Missing nonce' });
  }
  if (nonce.length !== FAKE_NONCE_LEN) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid nonce' });
  }

  const sign = params.sign;
  if (typeof sign !== 'string') {
    throw createError({ statusCode: 403, statusMessage: 'Missing sign' });
  }
  if (sign.length !== FAKE_SIGN_LEN) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid sign' });
  }
};

/**
 * 函数：安全复制上游响应头。
 * @param {Headers} headers 上游响应头
 * @return {Record<string, string>} 可下发的响应头
 */
const toResponseHeaders = (headers: Headers): Record<string, string> => {
  const out: Record<string, string> = {};

  headers.forEach((value, key) => {
    const k = String(key).toLowerCase();

    // 由 H3 自动管理/会导致响应长度不一致
    if (k === 'content-length') {
      return;
    }

    // 避免跨域/缓存策略污染（同源 /api 代理，不需要透传全部 CORS 头）
    if (k.startsWith('access-control-')) {
      return;
    }

    out[key] = value;
  });

  return out;
};

/**
 * 类型：上游下发的 CSRF attach。
 */
interface ICsrfAttach {
  /** CSRF Token */
  token: string;
  /** Cookie 名称 */
  cookie_name: string;
  /** Header 名称 */
  header_name: string;
}

/**
 * 函数：尝试从响应体中提取 attach.csrf。
 * @param {unknown} raw 上游 JSON
 * @return {ICsrfAttach | null} CSRF attach（不存在则 null）
 */
const pickCsrfAttach = (raw: unknown): ICsrfAttach | null => {
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
  const attach = src?.attach && typeof src.attach === 'object' && !Array.isArray(src.attach) ? (src.attach as Record<string, unknown>) : null;
  const csrf = attach?.csrf && typeof attach.csrf === 'object' && !Array.isArray(attach.csrf) ? (attach.csrf as Record<string, unknown>) : null;

  const token = String(csrf?.token ?? '').trim();
  if (token === '') {
    return null;
  }

  return {
    token,
    cookie_name: String(csrf?.cookie_name ?? '').trim(),
    header_name: String(csrf?.header_name ?? '').trim()
  };
};

/**
 * 函数：删除响应体中的 attach.csrf 与 datas.csrf_* 字段。
 * @param {unknown} raw 上游 JSON
 * @return {unknown} 改写后的 JSON
 */
const stripCsrfFields = (raw: unknown): unknown => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return raw;
  }

  const out = { ...(raw as Record<string, unknown>) };

  const datas = out.datas;
  if (datas && typeof datas === 'object' && !Array.isArray(datas)) {
    const d = { ...(datas as Record<string, unknown>) };
    delete d.csrf_cookie_name;
    delete d.csrf_header_name;
    out.datas = d;
  }

  const attach = out.attach;
  if (!attach || typeof attach !== 'object' || Array.isArray(attach)) {
    return out;
  }

  const attachObj = { ...(attach as Record<string, unknown>) };
  delete attachObj.csrf;

  if (Object.keys(attachObj).length === 0) {
    delete out.attach;
  } else {
    out.attach = attachObj;
  }

  return out;
};

/**
 * 处理：通用 /api/** 代理。
 *
 * 该代理用于：
 * - 把后端返回的 `attach.sign_refresh` 写入 Cookie（非 HttpOnly）
 * - 改写 JSON：删除 `attach.sign_refresh` 后再返回给前端
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBase = String(config.public.apiBase ?? '').trim();
  if (apiBase === '') {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_PUBLIC_API_BASE missing' });
  }

  const enableFakeParamsValidate = boolFromRuntimeConfig((config as Record<string, unknown>).signFakeParamsValidate);

  const url = getRequestURL(event);
  const upstreamBase = trimTrailingSlash(apiBase);

  const params = event.context.params as { path?: string | string[] } | undefined;
  const rest = params?.path;
  const restPath = Array.isArray(rest) ? rest.join('/') : String(rest ?? '');
  const upstreamPath = `/${restPath}`.replace(/\/+/g, '/');

  const upstreamUrl = new URL(upstreamBase + upstreamPath);
  upstreamUrl.search = url.search;

  /**
   * 常量：CSRF Cookie 名称（服务端读取 env 作为唯一口径）。
   */
  const csrfCookieName = String(process.env.SECURITY_CSRF_COOKIE_NAME ?? DEFAULT_CSRF_COOKIE_NAME).trim() || DEFAULT_CSRF_COOKIE_NAME;

  /**
   * 常量：CSRF Header 名称（服务端读取 env 作为唯一口径）。
   */
  const csrfHeaderName = String(process.env.SECURITY_CSRF_HEADER_NAME ?? DEFAULT_CSRF_HEADER_NAME).trim() || DEFAULT_CSRF_HEADER_NAME;

  /**
   * 常量：上游请求头
   */
  const upstreamHeaders = new Headers();

  // 透传调用方 header（但排除 Host/Content-Length 等由 fetch 管理的字段）
  for (const [key, value] of Object.entries(getHeaders(event))) {
    const k = String(key).toLowerCase();
    if (k === 'host' || k === 'content-length') {
      continue;
    }
    if (value !== undefined) {
      upstreamHeaders.set(key, String(value));
    }
  }

  // 固定：AppType=desktop（后端只做 allowlist 校验）
  upstreamHeaders.set('AppType', 'desktop');

  // 提示：当前 refresh cookie name（用于条件2响应注入时落盘）
  const cookieNameHint = getRequestHeader(event, 'x-sign-blob-cookie-name');

  const method = String(event.method ?? 'GET').toUpperCase();

  // sign/init 需要作为 server-to-server：避免透传浏览器 Origin/Referer 触发后端“仅内部下发 csrf attach”的保护。
  if (upstreamPath === SIGN_INIT_PATH) {
    upstreamHeaders.delete('origin');
    upstreamHeaders.delete('referer');
  }

  // 写请求自动补上游 CSRF Header（Double-Submit：Cookie+Header 必须同值）。
  if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
    const token = String(getCookie(event, csrfCookieName) ?? '').trim();
    if (token !== '') {
      upstreamHeaders.set(csrfHeaderName, token);
    }
  }

  const reqContentType = getRequestHeader(event, 'content-type');
  const rawBody = method === 'GET' || method === 'HEAD' ? undefined : await readRawBody(event);

  // 代理层假参数校验（可开关）：仅对非 sign init/refresh 请求生效。
  if (enableFakeParamsValidate && upstreamPath !== SIGN_INIT_PATH && upstreamPath !== SIGN_REFRESH_PATH) {
    const queryParams: Record<string, unknown> = Object.fromEntries(url.searchParams.entries());

    let bodyParams: Record<string, unknown> = {};
    if (rawBody !== undefined && rawBody !== null && isJsonContentType(reqContentType ?? null)) {
      try {
        const parsed = JSON.parse(String(rawBody));
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          bodyParams = parsed as Record<string, unknown>;
        }
      } catch {
        // ignore
      }
    }

    validateFakeParams({ ...queryParams, ...bodyParams });
  }

  let upstreamRes;
  try {
    upstreamRes = await $fetch.raw(upstreamUrl.toString(), {
      method,
      headers: upstreamHeaders,
      body: rawBody,
      ignoreResponseError: true,
      // 这里强制为 text，避免上游返回非 JSON 时解析报错
      responseType: 'text'
    });
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: '后端 API 不可达',
      cause: error
    });
  }

  const status = upstreamRes.status;
  const contentType = upstreamRes.headers.get('content-type');

  setResponseStatus(event, status);
  setResponseHeaders(event, toResponseHeaders(upstreamRes.headers));

  if (!isJsonContentType(contentType)) {
    return upstreamRes._data;
  }

  let json: unknown;
  try {
    json = upstreamRes._data ? JSON.parse(String(upstreamRes._data)) : null;
  } catch {
    return upstreamRes._data;
  }

  const blob = pickSignRefreshBlob(json);
  if (blob !== '') {
    const jsonObj = json && typeof json === 'object' && !Array.isArray(json) ? (json as Record<string, unknown>) : {};
    const datas = jsonObj.datas;
    const cookieName = resolveSignBlobCookieName({ datas, hintHeader: cookieNameHint });

    const isHttps = url.protocol === 'https:';

    setCookie(event, cookieName, blob, {
      httpOnly: false,
      secure: isHttps,
      sameSite: 'lax',
      path: '/'
    });

    json = stripSignRefreshAttach(json);
  }

  // sign/init 下发的 csrf attach：落 Nuxt 域名 HttpOnly cookie，并剥离返回给浏览器。
  const csrfAttach = pickCsrfAttach(json);
  if (csrfAttach) {
    const cookieName = csrfAttach.cookie_name || csrfCookieName;
    const tokenExisting = String(getCookie(event, cookieName) ?? '').trim();

    if (tokenExisting === '') {
      const isHttps = url.protocol === 'https:';
      setCookie(event, cookieName, csrfAttach.token, {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/'
      });
    }

    json = stripCsrfFields(json);
  }

  return json;
});
