/**
 * 常量：签名 init 路径。
 */
export const SIGN_INIT_PATH = '/security/sign/init';

/**
 * 常量：签名 refresh 路径。
 */
export const SIGN_REFRESH_PATH = '/security/sign/refresh';

/**
 * 常量：默认 refresh blob Cookie 名称。
 */
export const DEFAULT_SIGN_BLOB_COOKIE_NAME = 'sign_refresh';

/**
 * 常量：代理层提示 Cookie 名称的 Header。
 */
export const SIGN_BLOB_COOKIE_NAME_HINT_HEADER = 'X-Sign-Blob-Cookie-Name';

/**
 * 常量：签名 refresh blob 的格式前缀。
 */
export const SIGN_REFRESH_BLOB_PREFIX = 'v1.';

/**
 * 函数：从公开 runtimeConfig 中读取签名 AES seed。
 * @param {unknown} publicConfig runtimeConfig.public
 * @returns {string} AES seed
 */
export const getPublicSignAesSeedFromConfig = (publicConfig: unknown): string => {
  /**
   * 常量：value。
   */
  const value = (publicConfig ?? {}) as Record<string, unknown>;
  return String(value.signAesSeed ?? value.apiSignAesSeed ?? '').trim();
};

/**
 * 函数：从响应体中提取 sign_refresh blob。
 * @param {unknown} raw 响应体
 * @returns {string} sign_refresh blob，不存在则为空字符串
 */
export const pickSignRefreshBlob = (raw: unknown): string => {
  /**
   * 常量：source。
   */
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
  /**
   * 常量：attach。
   */
  const attach = source?.attach && typeof source.attach === 'object' && !Array.isArray(source.attach) ? (source.attach as Record<string, unknown>) : null;
  /**
   * 常量：blob。
   */
  const blob = String(attach?.sign_refresh ?? '').trim();

  if (!blob.startsWith(SIGN_REFRESH_BLOB_PREFIX)) {
    return '';
  }

  return blob;
};

/**
 * 函数：删除响应体中的 attach.sign_refresh。
 * @param {unknown} raw 响应体
 * @returns {unknown} 剥离 sign_refresh 后的响应体
 */
export const stripSignRefreshAttach = (raw: unknown): unknown => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return raw;
  }

  /**
   * 常量：output。
   */
  const output = { ...(raw as Record<string, unknown>) };
  /**
   * 常量：attach。
   */
  const attach = output.attach;

  if (!attach || typeof attach !== 'object' || Array.isArray(attach)) {
    return output;
  }

  /**
   * 常量：attachObject。
   */
  const attachObject = { ...(attach as Record<string, unknown>) };
  delete attachObject.sign_refresh;

  if (Object.keys(attachObject).length === 0) {
    delete output.attach;
  } else {
    output.attach = attachObject;
  }

  return output;
};

/**
 * 接口：签名 blob Cookie 名称解析参数。
 */
export interface IResolveSignBlobCookieNameArgs {
  /**
   * 响应 datas。
   */
  datas: unknown;

  /**
   * Header 提示值。
   */
  hintHeader: string | undefined;
}

/**
 * 函数：解析应写入 refresh blob 的 Cookie 名称。
 * @param {IResolveSignBlobCookieNameArgs} args 解析参数
 * @returns {string} Cookie 名称
 */
export const resolveSignBlobCookieName = (args: IResolveSignBlobCookieNameArgs): string => {
  const { datas, hintHeader } = args;

  /**
   * 常量：hinted。
   */
  const hinted = String(hintHeader ?? '').trim();
  if (hinted !== '') {
    return hinted;
  }

  /**
   * 常量：payload。
   */
  const payload = datas && typeof datas === 'object' && !Array.isArray(datas) ? (datas as Record<string, unknown>) : {};
  /**
   * 常量：cookieName。
   */
  const cookieName = String(payload.sign_blob_cookie_name ?? '').trim();
  if (cookieName !== '') {
    return cookieName;
  }

  return DEFAULT_SIGN_BLOB_COOKIE_NAME;
};
