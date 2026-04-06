import { createError, defineEventHandler, getHeaders, getRequestHeader, getRequestURL, readRawBody, setCookie, setResponseHeaders, setResponseStatus } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';
import { $fetch } from 'ofetch';

/**
 * 常量：刷新 blob 的默认 Cookie 名称。
 */
const DEFAULT_SIGN_BLOB_COOKIE_NAME = 'sign_refresh';

/**
 * 常量：签名刷新 blob 的格式前缀（用于兜底识别）。
 */
const SIGN_REFRESH_BLOB_PREFIX = 'v1.';

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
 * 函数：从请求中推断写入 refresh blob 的 Cookie 名称。
 * @param {object} args 参数
 * @param {unknown} args.datas 响应 datas
 * @param {string | undefined} args.hintHeader 请求头提示值
 * @return {string} Cookie 名称
 */
const resolveSignBlobCookieName = (args: { datas: unknown; hintHeader: string | undefined }): string => {
  const { datas, hintHeader } = args;

  const hinted = String(hintHeader ?? '').trim();
  if (hinted !== '') {
    return hinted;
  }

  const d = (datas ?? {}) as Record<string, unknown>;
  const name = String(d.sign_blob_cookie_name ?? '').trim();
  if (name !== '') {
    return name;
  }

  return DEFAULT_SIGN_BLOB_COOKIE_NAME;
};

/**
 * 函数：尝试从响应体中提取 attach.sign_refresh。
 * @param {unknown} raw 上游 JSON
 * @return {string} 刷新 blob（不存在则空字符串）
 */
const pickSignRefreshBlob = (raw: unknown): string => {
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
  const attach = src?.attach && typeof src.attach === 'object' && !Array.isArray(src.attach) ? (src.attach as Record<string, unknown>) : null;
  const blob = String(attach?.sign_refresh ?? '').trim();
  if (!blob.startsWith(SIGN_REFRESH_BLOB_PREFIX)) {
    return '';
  }
  return blob;
};

/**
 * 函数：删除响应体中的 attach.sign_refresh。
 * @param {unknown} raw 上游 JSON
 * @return {unknown} 改写后的 JSON
 */
const stripSignRefreshAttach = (raw: unknown): unknown => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return raw;
  }

  const out = { ...(raw as Record<string, unknown>) };
  const attach = out.attach;

  if (!attach || typeof attach !== 'object' || Array.isArray(attach)) {
    return out;
  }

  const attachObj = { ...(attach as Record<string, unknown>) };
  delete attachObj.sign_refresh;

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

  const url = getRequestURL(event);
  const upstreamBase = trimTrailingSlash(apiBase);

  const params = event.context.params as { path?: string | string[] } | undefined;
  const rest = params?.path;
  const restPath = Array.isArray(rest) ? rest.join('/') : String(rest ?? '');
  const upstreamPath = `/${restPath}`.replace(/\/+/g, '/');

  const upstreamUrl = new URL(upstreamBase + upstreamPath);
  upstreamUrl.search = url.search;

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

  const rawBody = method === 'GET' || method === 'HEAD' ? undefined : await readRawBody(event);

  const upstreamRes = await $fetch.raw(upstreamUrl.toString(), {
    method,
    headers: upstreamHeaders,
    body: rawBody,
    ignoreResponseError: true,
    // 这里强制为 text，避免上游返回非 JSON 时解析报错
    responseType: 'text'
  });

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

  return json;
});
