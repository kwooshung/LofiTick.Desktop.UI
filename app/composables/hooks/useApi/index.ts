/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce, throttle } from 'es-toolkit';

import type { UseFetchOptions } from '#app';

import type { IApiResponseWrapper, IServerError, ISignRefreshPayload, ISignState, IUseApiDebounceOptions, IUseApiResult, IUseApiThrottleOptions, IUseFetchExtraOptions, TUseApiRateLimitedFn } from './index.types';

/**
 * 常量：支持 Body 传参的方法集合
 */
const HAS_BODY_METHODS: Set<'POST' | 'PUT' | 'PATCH'> = new Set(['POST', 'PUT', 'PATCH']);

/**
 * 函数：格式化三位数字字符串
 * @param {unknown} input 输入值
 * @return {string} 三位数字字符串
 */
const to3 = (input: unknown): string => {
  const n = Number(input);
  if (!Number.isFinite(n)) {
    return '000';
  }
  return String(Math.trunc(n)).padStart(3, '0');
};

/**
 * 函数：构建业务码字符串（HHH-BBB-AAA）
 * @param {unknown} status 状态对象
 * @return {string} 业务码字符串
 */
const statusCodeBuild = (status: unknown): string => {
  const s = (status ?? {}) as Record<string, unknown>;
  return `${to3(s.http)}-${to3(s.biz)}-${to3(s.aim)}`;
};

/**
 * 函数：规范化 Toast 类型
 * @param {unknown} input 类型
 * @return {'neutral' | 'success' | 'info' | 'warning' | 'error'} 规范化后的类型
 */
const toastColorNormalize = (input: unknown): 'neutral' | 'success' | 'info' | 'warning' | 'error' => {
  const v = String(input ?? '').trim();
  if (v === 'neutral' || v === 'success' || v === 'info' || v === 'warning' || v === 'error') {
    return v;
  }
  return 'warning';
};

/**
 * 常量：错误 Toast 去重窗口（毫秒）。
 */
const TOAST_DEDUPE_WINDOW_MS = 3000;

/**
 * 常量：错误 Toast 去重时间戳缓存。
 */
const toastDedupeMsCache: Map<string, number> = new Map();

/**
 * 常量：签名 init 路径。
 */
const SIGN_INIT_PATH = '/security/sign/init';

/**
 * 常量：签名 refresh 路径。
 */
const SIGN_REFRESH_PATH = '/security/sign/refresh';

/**
 * 常量：默认 refresh blob Cookie 名称（兜底）。
 */
const DEFAULT_SIGN_BLOB_COOKIE_NAME = 'sign_refresh';

/**
 * 常量：代理层提示 Cookie 名称的 header。
 */
const SIGN_BLOB_COOKIE_NAME_HINT_HEADER = 'X-Sign-Blob-Cookie-Name';

/**
 * 常量：迷惑 Header（Soc-Fetch-Dest）。
 */
const SOC_FETCH_DEST_HEADER_NAME = 'Soc-Fetch-Dest';

/**
 * 常量：迷惑 Header（Soc-Fetch-Dest）值。
 */
const SOC_FETCH_DEST_HEADER_VALUE = 'empty; seg=rnbf';

/**
 * 常量：假参数 nonce 的期望长度。
 */
const FAKE_NONCE_LEN = 8;

/**
 * 常量：假参数 sign 的期望长度。
 */
const FAKE_SIGN_LEN = 24;

/**
 * 函数：从公开 runtimeConfig 获取签名 AES seed。
 * @param {unknown} publicConfig runtimeConfig.public
 * @return {string} AES seed
 */
const getPublicSignAesSeedFromConfig = (publicConfig: unknown): string => {
  const v = (publicConfig ?? {}) as Record<string, unknown>;
  return String(v.signAesSeed ?? v.apiSignAesSeed ?? '').trim();
};

/**
 * 函数：Base64URL 解码为字节数组。
 * @param {string} input Base64URL 字符串
 * @return {Uint8Array} 字节数组
 */
const b64UrlToBytes = (input: string): Uint8Array => {
  const s = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s + pad;

  if (import.meta.client) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }

  return Uint8Array.from(Buffer.from(b64, 'base64'));
};

/**
 * 函数：字节数组编码为 Base64（标准）。
 * @param {Uint8Array} bytes 字节数组
 * @return {string} Base64 字符串
 */
const bytesToBase64Std = (bytes: Uint8Array): string => {
  if (import.meta.client) {
    let bin = '';
    for (const b of bytes) {
      bin += String.fromCharCode(b);
    }
    return btoa(bin);
  }
  return Buffer.from(bytes).toString('base64');
};

/**
 * 函数：字节数组转为小写 hex 字符串。
 * @param {Uint8Array} bytes 字节数组
 * @return {string} hex 字符串
 */
const bytesToHexLower = (bytes: Uint8Array): string => {
  let out = '';
  for (const b of bytes) {
    out += b.toString(16).padStart(2, '0');
  }
  return out;
};

/**
 * 函数：生成随机小写 hex 字符串。
 * @param {number} byteLength 随机字节数
 * @return {string} 小写 hex 字符串
 */
const randomHexLower = (byteLength: number): string => {
  const len = Number(byteLength);
  if (!Number.isFinite(len) || len <= 0) {
    return '';
  }

  if (!crypto?.getRandomValues) {
    throw new Error('crypto.getRandomValues missing');
  }

  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return bytesToHexLower(bytes);
};

/**
 * 函数：复制为纯 ArrayBuffer（规避 BufferSource 类型差异）。
 * @param {Uint8Array} bytes 字节数组
 * @return {ArrayBuffer} ArrayBuffer
 */
const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const out = new Uint8Array(bytes.byteLength);
  out.set(bytes);
  return out.buffer;
};

/**
 * 函数：计算 SHA-256（hex 小写）。
 * @param {string} input 输入字符串
 * @return {Promise<string>} hex 字符串
 */
const sha256HexLower = async (input: string): Promise<string> => {
  const enc = new TextEncoder();
  const data = enc.encode(input);

  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHexLower(new Uint8Array(digest));
};

/**
 * 函数：计算 HMAC-SHA256。
 * @param {Uint8Array} key key
 * @param {Uint8Array} data data
 * @return {Promise<Uint8Array>} 签名字节
 */
const hmacSha256 = async (key: Uint8Array, data: Uint8Array): Promise<Uint8Array> => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(key),
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' }
    },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, toArrayBuffer(data));
  return new Uint8Array(sig);
};

/**
 * 函数：派生 AES-256 key（32 字节）。
 * @param {string} seed AES seed
 * @param {number} windowNum 窗口编号
 * @return {Promise<Uint8Array>} key 字节
 */
const deriveAesKey = async (seed: string, windowNum: number): Promise<Uint8Array> => {
  const enc = new TextEncoder();
  const key = enc.encode(seed);
  const data = enc.encode(String(windowNum));
  return await hmacSha256(key, data);
};

/**
 * 函数：解密 sign_refresh blob。
 * @param {string} blob blob 字符串（v1.window.nonce.cipher）
 * @return {Promise<ISignRefreshPayload>} 解密后的 payload
 */
const decryptSignRefreshBlob = async (args: { blob: string; aesSeed: string }): Promise<ISignRefreshPayload> => {
  const { blob, aesSeed } = args;

  const parts = String(blob ?? '').split('.');
  if (parts.length !== 4) {
    throw new Error('sign_refresh blob invalid');
  }

  const version = parts[0] ?? '';
  const windowNumStr = parts[1] ?? '';
  const nonceB64Url = parts[2] ?? '';
  const cipherB64Url = parts[3] ?? '';
  if (version !== 'v1') {
    throw new Error('sign_refresh blob invalid');
  }

  const windowNum = Number(windowNumStr);
  if (!Number.isFinite(windowNum)) {
    throw new Error('sign_refresh blob invalid');
  }

  const seed = String(aesSeed ?? '').trim();
  if (seed === '') {
    throw new Error('NUXT_PUBLIC_SIGN_AES_SEED missing');
  }

  const nonce = b64UrlToBytes(nonceB64Url);
  const ciphertext = b64UrlToBytes(cipherB64Url);
  if (nonce.byteLength !== 12) {
    throw new Error('sign_refresh blob invalid');
  }

  const aesKeyRaw = await deriveAesKey(seed, windowNum);
  const aesKey = await crypto.subtle.importKey('raw', toArrayBuffer(aesKeyRaw), { name: 'AES-GCM' }, false, ['decrypt']);

  const plaintext = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(nonce)
    },
    aesKey,
    toArrayBuffer(ciphertext)
  );

  const jsonText = new TextDecoder().decode(new Uint8Array(plaintext));
  const raw = JSON.parse(jsonText) as Record<string, unknown>;

  return {
    signKeyHex: String(raw.sign_key_hex ?? ''),
    ttlSec: Number(raw.ttl_sec ?? 0),
    clockSkewMs: Number(raw.clock_skew_ms ?? 0),
    signHeaderName: String(raw.sign_header_name ?? ''),
    signSigPrefix: String(raw.sign_sig_prefix ?? ''),
    windowNum: Number(raw.window_num ?? windowNum),
    issuedAtMs: Number(raw.issued_at_ms ?? 0)
  };
};

/**
 * 函数：是否为 sign init/refresh 请求。
 * @param {string} backendPath 后端路径
 * @return {boolean} 是否跳过签名
 */
const isSignBootstrapPath = (backendPath: string): boolean => {
  return backendPath === SIGN_INIT_PATH || backendPath === SIGN_REFRESH_PATH;
};

/**
 * 函数：规范化为后端路径（去掉 /api 前缀）。
 * @param {string} input 原始路径
 * @return {string} 后端路径
 */
const toBackendPath = (input: string): string => {
  const p = input.startsWith('/') ? input : `/${input}`;
  if (p === '/api') {
    return '/';
  }
  if (p.startsWith('/api/')) {
    return p.slice('/api'.length);
  }
  return p;
};

/**
 * 函数：计算请求签名（Base64）。
 * @param {object} args 参数
 * @param {string} args.backendPath 后端路径
 * @param {string[]} args.sortedParamPairs 参数对
 * @param {string} args.signKeyHex 窗口派生 key（hex 小写）
 * @return {Promise<string>} Base64 签名
 */
const computeSignatureBase64 = async (args: { backendPath: string; sortedParamPairs: string[]; signKeyHex: string }): Promise<string> => {
  const { backendPath, sortedParamPairs, signKeyHex } = args;

  const content = `${backendPath}?${sortedParamPairs.join('&')}`;
  const hashContentHexLower = await sha256HexLower(content);

  const enc = new TextEncoder();
  const keyBytes = enc.encode(signKeyHex);
  const dataBytes = enc.encode(hashContentHexLower);
  const sigBytes = await hmacSha256(keyBytes, dataBytes);
  return bytesToBase64Std(sigBytes);
};

/**
 * 函数：是否需要触发条件3 refresh。
 * @param {unknown} status 服务端 status
 * @return {boolean} 是否需要 refresh
 */
const shouldRefreshOnStatus = (status: unknown): boolean => {
  const s = (status ?? {}) as Record<string, unknown>;
  const biz = Number(s.biz ?? -1);
  const aim = Number(s.aim ?? -1);

  // 800 = Security, 6 = SIGN_TS_EXPIRED, 10 = SIGN_MISMATCH
  if (biz === 800 && (aim === 6 || aim === 10)) {
    return true;
  }
  return false;
};

/**
 * 常量：API 派生密钥缓存
 */
export const useApiDerivedKeyCache: Map<string, string> = new Map<string, string>();

/**
 * 函数：从 MaybeRef 解包真实值
 */
const resolve = <T>(v: T | Ref<T> | undefined): T | undefined => (isRef(v) ? v.value : v);

/**
 * 函数：剔除对象中值为 undefined 的键
 */
const omitUndefined = (obj: unknown): Record<string, unknown> => {
  const src = obj && typeof obj === 'object' && !Array.isArray(obj) ? (obj as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(src)) {
    if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
};

/**
 * 函数：规范化路径（强制前缀 /api/）
 */
const toApiPath = (input: string): string => {
  if (input.startsWith('/api/')) {
    return input;
  }
  if (input.startsWith('/')) {
    return `/api${input}`;
  }
  return `/api/${input}`;
};

/**
 * Hook：获取签名状态（SSR 安全）。
 */
const useSignState = (): Ref<ISignState> => {
  return useState<ISignState>('use-api-sign-state', () => ({
    signBlobCookieName: DEFAULT_SIGN_BLOB_COOKIE_NAME,
    payload: null
  }));
};

/**
 * 函数：调用签名 bootstrap 接口（init/refresh）。
 * @param {string} backendPath 后端路径
 * @return {Promise<Record<string, unknown>>} datas
 */
const fetchSignBootstrap = async (args: { backendPath: string; signState: Ref<ISignState>; apiBase: string; setHttpOnlyCookieIfMissing?: (args: { name: string; value: string }) => Promise<void> }): Promise<{ datas: Record<string, unknown>; signRefreshBlob: string }> => {
  const { backendPath, signState, apiBase } = args;
  const hintedCookieName = String(signState.value.signBlobCookieName ?? DEFAULT_SIGN_BLOB_COOKIE_NAME).trim() || DEFAULT_SIGN_BLOB_COOKIE_NAME;

  // SSR：直接请求后端，避免依赖“本次响应写入的 cookie”。
  if (import.meta.server) {
    const base = String(apiBase ?? '').trim();
    if (base === '') {
      throw new Error('NUXT_PUBLIC_API_BASE missing');
    }

    const url = `${base.replace(/\/+$/, '')}${backendPath}`;

    const raw = await $fetch<IApiResponseWrapper<Record<string, unknown>>>(url, {
      method: 'GET',
      headers: {
        AppType: 'desktop'
      }
    });

    const datas = raw?.datas && typeof raw.datas === 'object' && !Array.isArray(raw.datas) ? (raw.datas as Record<string, unknown>) : {};
    const attach = raw?.attach && typeof raw.attach === 'object' && !Array.isArray(raw.attach) ? (raw.attach as Record<string, unknown>) : null;
    const signRefreshBlob = String(attach?.sign_refresh ?? '').trim();

    // SSR：sign/init 下发的 csrf token 需要由当前响应显式 set-cookie（SSR 直连后端不会经过 /api 代理）。
    const csrfRaw = attach?.csrf && typeof attach.csrf === 'object' && !Array.isArray(attach.csrf) ? (attach.csrf as Record<string, unknown>) : null;
    const csrfToken = String(csrfRaw?.token ?? '').trim();
    const csrfCookieName = String(csrfRaw?.cookie_name ?? '').trim();
    if (csrfToken !== '' && csrfCookieName !== '' && typeof args.setHttpOnlyCookieIfMissing === 'function') {
      await args.setHttpOnlyCookieIfMissing({ name: csrfCookieName, value: csrfToken });
    }

    return {
      datas,
      signRefreshBlob
    };
  }

  // Client：走同源 /api 代理，由代理写入 refresh cookie 并删除 attach。
  const apiPath = toApiPath(backendPath);

  const raw = await $fetch<IApiResponseWrapper<Record<string, unknown>>>(apiPath, {
    method: 'GET',
    headers: {
      [SIGN_BLOB_COOKIE_NAME_HINT_HEADER]: hintedCookieName
    }
  });

  const datas = raw?.datas && typeof raw.datas === 'object' && !Array.isArray(raw.datas) ? (raw.datas as Record<string, unknown>) : {};

  return {
    datas,
    signRefreshBlob: ''
  };
};

/**
 * 类型：CookieRef 获取函数。
 */
type TGetCookieRef = (name: string) => Promise<Ref<string | null>>;

/**
 * 类型：HttpOnly Cookie 写入函数（仅当缺失时写入）。
 */
type TSetHttpOnlyCookieIfMissing = (args: { name: string; value: string }) => Promise<void>;

/**
 * 函数：尝试消费 refresh cookie 并更新本地 payload。
 */
const consumeRefreshCookieIfPresent = async (args: { signState: Ref<ISignState>; aesSeed: string; getCookieRef: TGetCookieRef }): Promise<void> => {
  const { signState, aesSeed, getCookieRef } = args;
  const cookieName = String(signState.value.signBlobCookieName ?? DEFAULT_SIGN_BLOB_COOKIE_NAME).trim() || DEFAULT_SIGN_BLOB_COOKIE_NAME;

  const cookie = await getCookieRef(cookieName);
  const blob = String(cookie.value ?? '').trim();
  if (!blob.startsWith('v1.')) {
    return;
  }

  const payload = await decryptSignRefreshBlob({ blob, aesSeed });
  signState.value.payload = payload;

  // 立即清理 cookie，避免重复使用
  cookie.value = null;
};

/**
 * 函数：确保签名状态已初始化。
 */
const ensureSignReady = async (args: { signState: Ref<ISignState>; apiBase: string; aesSeed: string; getCookieRef: TGetCookieRef; setHttpOnlyCookieIfMissing: TSetHttpOnlyCookieIfMissing }): Promise<void> => {
  const { signState, apiBase, aesSeed, getCookieRef, setHttpOnlyCookieIfMissing } = args;
  if (signState.value.payload) {
    return;
  }

  // Client：只允许从 cookie 获取（init 必须由 Nuxt server 负责）。
  if (import.meta.client) {
    await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
    if (signState.value.payload) {
      return;
    }
    throw new Error('sign payload missing (SSR init required)');
  }

  // 拉取 init（该请求无需签名，代理层会写入 refresh cookie）
  const res = await fetchSignBootstrap({ backendPath: SIGN_INIT_PATH, signState, apiBase, setHttpOnlyCookieIfMissing });
  const cookieName = String(res.datas.sign_blob_cookie_name ?? '').trim();
  if (cookieName !== '') {
    signState.value.signBlobCookieName = cookieName;
  }

  // SSR：可直接拿到 attach.sign_refresh 并立即解密。
  if (import.meta.server && res.signRefreshBlob.startsWith('v1.')) {
    signState.value.payload = await decryptSignRefreshBlob({ blob: res.signRefreshBlob, aesSeed });
    return;
  }

  await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
};

/**
 * 函数：执行 refresh 并刷新本地 payload。
 */
const performSignRefresh = async (args: { signState: Ref<ISignState>; apiBase: string; aesSeed: string; getCookieRef: TGetCookieRef }): Promise<void> => {
  const { signState, apiBase, aesSeed, getCookieRef } = args;

  const res = await fetchSignBootstrap({ backendPath: SIGN_REFRESH_PATH, signState, apiBase });
  const cookieName = String(res.datas.sign_blob_cookie_name ?? '').trim();
  if (cookieName !== '') {
    signState.value.signBlobCookieName = cookieName;
  }

  // SSR：可直接拿到 attach.sign_refresh 并立即解密。
  if (import.meta.server && res.signRefreshBlob.startsWith('v1.')) {
    signState.value.payload = await decryptSignRefreshBlob({ blob: res.signRefreshBlob, aesSeed });
    return;
  }

  await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
};

/**
 * 函数：转为可展开对象
 */
const toSpreadableObject = (input: unknown): Record<string, unknown> => {
  if (input == null) {
    return {};
  }
  if (typeof input === 'string') {
    const out: Record<string, unknown> = {};
    for (let i = 0; i < input.length; i++) {
      out[String(i)] = input.charAt(i);
    }
    return out;
  }
  if (typeof input === 'object' && !Array.isArray(input)) {
    return omitUndefined(input);
  }
  return {};
};

/**
 * 函数：合并 headers
 */
const mergeHeaders = (existing: HeadersInit | undefined, extra: Record<string, string>): Record<string, string> => {
  const result: Record<string, string> = {};
  if (existing instanceof Headers) {
    existing.forEach((v, k) => (result[k] = v));
  } else if (Array.isArray(existing)) {
    for (const [k, v] of existing) {
      result[String(k)] = String(v);
    }
  } else if (existing && typeof existing === 'object') {
    for (const [k, v] of Object.entries(existing)) {
      result[k] = String(v as string);
    }
  }
  Object.assign(result, extra);
  return result;
};

/**
 * 工具：创建防抖包装
 */
const createDebounced = (fn: (opts?: IUseFetchExtraOptions) => Promise<void>, options: IUseApiDebounceOptions): TUseApiRateLimitedFn => {
  const debounceOpts = {
    ...(options.leading !== undefined ? { leading: options.leading } : {}),
    ...(options.trailing !== undefined ? { trailing: options.trailing } : {}),
    ...(options.maxWait !== undefined ? { maxWait: options.maxWait } : {})
  } as unknown as Parameters<typeof debounce>[2];
  const wrapped = debounce(
    (opts?: IUseFetchExtraOptions) => {
      void fn(opts);
    },
    options.wait,
    debounceOpts
  );
  return (opts?: IUseFetchExtraOptions) => wrapped(opts);
};

/**
 * 工具：创建节流包装
 */
const createThrottled = (fn: (opts?: IUseFetchExtraOptions) => Promise<void>, options: IUseApiThrottleOptions): TUseApiRateLimitedFn => {
  const throttleOpts = {
    ...(options.leading !== undefined ? { leading: options.leading } : {}),
    ...(options.trailing !== undefined ? { trailing: options.trailing } : {})
  } as unknown as Parameters<typeof throttle>[2];
  const wrapped = throttle(
    (opts?: IUseFetchExtraOptions) => {
      void fn(opts);
    },
    options.wait,
    throttleOpts
  );
  return (opts?: IUseFetchExtraOptions) => wrapped(opts);
};

/**
 * 函数：规范化 HTTP 方法
 */
const normalizeMethod = (method?: unknown): string =>
  String(method ?? 'GET')
    .toUpperCase()
    .trim();

/**
 * 函数：统一封装 API 请求
 */
const request = async <T>(path: string, options: IUseFetchExtraOptions = {}): Promise<any> => {
  const apiPath = toApiPath(path);
  const backendPath = toBackendPath(path);
  const method = normalizeMethod(options.method);
  const hasBodyMethod = HAS_BODY_METHODS.has(method as any);

  /**
   * 常量：Nuxt 上下文（用于在异步链路中安全获取 cookie ref）。
   */
  const nuxtApp = useNuxtApp();

  /**
   * 常量：运行时配置（必须在首次 await 之前读取，避免 async setup 上下文丢失）。
   */
  const runtimeConfig = useRuntimeConfig();
  const publicConfig = (runtimeConfig.public as Record<string, unknown> | undefined) ?? {};
  const apiBase = String(publicConfig.apiBase ?? '').trim();
  const aesSeed = getPublicSignAesSeedFromConfig(publicConfig);

  /**
   * 状态：签名状态（必须在首次 await 之前获取）。
   */
  const signState = useSignState();

  /**
   * 函数：获取 cookie ref（通过 Nuxt 上下文执行，避免异步回调里直接调用 composable）。
   * @param {string} name Cookie 名称
   * @return {Ref<string | null>} cookie ref
   */
  const getCookieRef: TGetCookieRef = async (name: string): Promise<Ref<string | null>> => {
    return await nuxtApp.runWithContext(() => useCookie<string | null>(name, { default: () => null }));
  };

  /**
   * 函数：仅当缺失时写入 HttpOnly Cookie。
   * @param {object} args 参数
   * @param {string} args.name Cookie 名称
   * @param {string} args.value Cookie 值
   * @return {Promise<void>} 无返回
   */
  const setHttpOnlyCookieIfMissing: TSetHttpOnlyCookieIfMissing = async (cookieArgs): Promise<void> => {
    await nuxtApp.runWithContext(() => {
      const name = String(cookieArgs.name ?? '').trim();
      const value = String(cookieArgs.value ?? '').trim();
      if (name === '' || value === '') {
        return;
      }

      const isHttps = useRequestURL().protocol === 'https:';
      const cookieRef = useCookie<string | null>(name, {
        default: () => null,
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/'
      });

      const tokenExisting = String(cookieRef.value ?? '').trim();
      if (tokenExisting === '') {
        cookieRef.value = value;
      }
    });
  };

  /**
   * 状态：Toast store（必须在 setup 上下文中获取，避免回调里调用 composable 触发 Nuxt 报错）
   */
  const toastStore = useStoreToastApi();

  const querySource = isRef(options.query) ? (options.query as Ref<unknown>) : ref(options.query);
  const bodySource = isRef(options.body) ? (options.body as Ref<unknown>) : ref(options.body);
  const datasSource = isRef(options.datas) ? (options.datas as Ref<Record<string, unknown>>) : ref(options.datas);

  const baseAllParamsRef = computed<Record<string, unknown>>(() => ({
    ...toSpreadableObject(resolve(querySource.value)),
    ...toSpreadableObject(resolve(bodySource.value)),
    ...toSpreadableObject(resolve(datasSource.value))
  }));

  const keyHash = JSON.stringify({ method, apiPath, params: baseAllParamsRef.value });
  const staticKey = `api-${keyHash.length}-${Date.now()}`;

  const headersObj = mergeHeaders(options.headers as HeadersInit | undefined, {});

  // 提示代理层：当前 refresh cookie name（用于条件2自动注入时落盘）
  const hintedCookieName = String(signState.value.signBlobCookieName ?? DEFAULT_SIGN_BLOB_COOKIE_NAME).trim() || DEFAULT_SIGN_BLOB_COOKIE_NAME;
  headersObj[SIGN_BLOB_COOKIE_NAME_HINT_HEADER] = hintedCookieName;
  const { pick: _omitPick, transform: _omitTransform, rateLimit: _omitRateLimit, ...restOptions } = options;

  const finalOptions: UseFetchOptions<unknown> & Record<string, unknown> = {
    watch: false,
    immediate: false,
    ...restOptions,
    headers: headersObj,
    onResponseError(ctx: any) {
      const raw = ctx?.response?._data as IApiResponseWrapper<unknown> | undefined;

      const status = raw?.status as unknown;
      const code = raw?.status ? statusCodeBuild(status) : `${to3(ctx?.response?.status)}-000-000`;

      const toastSrc = (raw?.toast ?? {}) as Record<string, unknown>;
      const toastEnableRaw = toastSrc.enable;
      const toastEnable = toastEnableRaw === false ? false : true;

      if (!toastEnable) {
        return;
      }

      const nowMs = Date.now();
      const dedupeKey = `api:${method}:${backendPath}:${code}:${keyHash}`;
      const lastMs = toastDedupeMsCache.get(dedupeKey) ?? 0;

      if (nowMs - lastMs < TOAST_DEDUPE_WINDOW_MS) {
        return;
      }

      toastDedupeMsCache.set(dedupeKey, nowMs);
      if (toastDedupeMsCache.size > 200) {
        for (const [k, v] of toastDedupeMsCache) {
          if (nowMs - v > TOAST_DEDUPE_WINDOW_MS * 2) {
            toastDedupeMsCache.delete(k);
          }
        }
      }

      const color = toastSrc.type !== undefined ? toastColorNormalize(toastSrc.type) : 'error';

      toastStore.set({
        key: `toast-api-${Date.now()}-${(raw as any)?.status?.ts ?? ''}`,
        enable: toastEnable,
        code,
        icon: String(toastSrc.icon ?? ''),
        color,
        duration: Number.isFinite(Number(toastSrc.duration)) ? Number(toastSrc.duration) : 3000,
        progress: toastSrc.progress === true,
        close: toastSrc.close === true
      });
    },
    key: staticKey
  };

  if (hasBodyMethod) {
    finalOptions.body = computed(() => ({
      ...omitUndefined(resolve(options.body)),
      ...toSpreadableObject(resolve(datasSource.value))
    })) as any;
    finalOptions.query = options.query as any;
  } else {
    finalOptions.query = computed(() => ({
      ...omitUndefined(resolve(options.query)),
      ...toSpreadableObject(resolve(datasSource.value))
    })) as any;
    if (options.body !== undefined) {
      finalOptions.body = options.body;
    }
  }

  // 计算签名：仅对非 sign init/refresh 生效
  const runWithSignature = async (): Promise<void> => {
    if (isSignBootstrapPath(backendPath)) {
      return;
    }

    await ensureSignReady({ signState, apiBase, aesSeed, getCookieRef, setHttpOnlyCookieIfMissing });
    await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });

    const tsMs = Date.now();
    const ts = String(tsMs);

    // 迷惑假参数：nonce/sign（不参与真实签名计算，但会随请求携带并由服务端校验格式）
    const nonce = randomHexLower(FAKE_NONCE_LEN / 2);
    const sign = randomHexLower(FAKE_SIGN_LEN / 2);

    // 注入 ts：根据方法放入 query/body
    if (hasBodyMethod) {
      finalOptions.body = computed(() => ({
        ...omitUndefined(resolve(options.body)),
        ...toSpreadableObject(resolve(datasSource.value)),
        ts,
        nonce,
        sign
      })) as any;
    } else {
      finalOptions.query = computed(() => ({
        ...omitUndefined(resolve(options.query)),
        ...toSpreadableObject(resolve(datasSource.value)),
        ts,
        nonce,
        sign
      })) as any;
    }

    // 计算签名参数（合并 query/body/datas 后排序）
    const allParams: Record<string, unknown> = {
      ...toSpreadableObject(resolve(querySource.value)),
      ...toSpreadableObject(resolve(bodySource.value)),
      ...toSpreadableObject(resolve(datasSource.value)),
      ts
    };

    const sortedPairs = Object.keys(allParams)
      .filter((key) => key !== 'sign' && key !== 'nonce' && allParams[key] !== undefined)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(String(allParams[key]))}`);

    const payload = signState.value.payload as ISignRefreshPayload | null;
    if (!payload || String(payload.signKeyHex ?? '').trim() === '') {
      throw new Error('sign payload missing');
    }

    const sig = await computeSignatureBase64({
      backendPath,
      sortedParamPairs: sortedPairs,
      signKeyHex: payload.signKeyHex
    });

    finalOptions.headers = mergeHeaders(finalOptions.headers as any, {
      [payload.signHeaderName]: `${payload.signSigPrefix}${sig}`,
      [SOC_FETCH_DEST_HEADER_NAME]: SOC_FETCH_DEST_HEADER_VALUE
    });
  };

  await runWithSignature();

  const fetch = hasBodyMethod ? ((useCsrfFetch as any) ?? useFetch) : useFetch;
  const base: any = await nuxtApp.runWithContext(() => fetch(apiPath as any, finalOptions as any));

  const { error, pending } = base;

  // 条件2：只要代理层写入了 refresh cookie，就尝试解密并缓存
  await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });

  // 条件3：完全过期/窗口切换导致拒绝时，refresh 后重试一次
  const errData = (error.value as any)?.data ?? (error.value as any)?.response?._data;
  const errStatus = (errData as any)?.status;

  if (!isSignBootstrapPath(backendPath) && error.value && shouldRefreshOnStatus(errStatus)) {
    await performSignRefresh({ signState, apiBase, aesSeed, getCookieRef });
    await runWithSignature();
    finalOptions.key = `${staticKey}-${Date.now()}`;
    await base.refresh();
    await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
  }

  const retry = async (opts?: IUseFetchExtraOptions) => {
    if (opts) {
      const rest = { ...opts } as Partial<IUseFetchExtraOptions>;
      delete (rest as any).datas;
      delete (rest as any).query;
      delete (rest as any).body;
      await base.refresh(rest as any);
    } else {
      await base.refresh();
    }
  };

  const refresh = async (opts: IUseFetchExtraOptions = {}) => {
    if (opts.datas !== undefined) {
      datasSource.value = toSpreadableObject(resolve(opts.datas)) as any;
    }
    if (opts.query !== undefined) {
      querySource.value = toSpreadableObject(resolve(opts.query));
    }
    if (opts.body !== undefined) {
      bodySource.value = toSpreadableObject(resolve(opts.body));
    }
    finalOptions.key = `${staticKey}-${Date.now()}`;
    await base.refresh();
  };

  const debounceOpts: IUseApiDebounceOptions = {
    wait: options.rateLimit?.debounce?.wait ?? 300,
    leading: options.rateLimit?.debounce?.leading ?? false,
    trailing: options.rateLimit?.debounce?.trailing ?? true,
    maxWait: options.rateLimit?.debounce?.maxWait
  };
  const throttleOpts: IUseApiThrottleOptions = {
    wait: options.rateLimit?.throttle?.wait ?? 500,
    leading: options.rateLimit?.throttle?.leading ?? true,
    trailing: options.rateLimit?.throttle?.trailing ?? false
  };

  return {
    data: base.data,
    loading: pending,
    error,
    retry,
    refresh,
    refreshDebounced: createDebounced(refresh, debounceOpts),
    retryDebounced: createDebounced(retry, debounceOpts),
    refreshThrottled: createThrottled(refresh, throttleOpts),
    retryThrottled: createThrottled(retry, throttleOpts)
  } as T;
};

/**
 * Hook：useApi
 * @param {string} path 请求路径
 * @param {IUseFetchExtraOptions} [options] 配置
 * @template TData 业务数据类型
 */
export const useApi = async <TData = Record<string, unknown>>(path: string, options: IUseFetchExtraOptions = {}): Promise<IUseApiResult<TData>> => {
  const { data: raw, loading, error, retry, refresh, refreshDebounced, retryDebounced, refreshThrottled, retryThrottled } = await request<IApiResponseWrapper<TData>>(path, options);

  const datas = computed(() => raw.value?.datas) as Ref<TData | undefined>;
  const status = computed(() => raw.value?.status) as Ref<IServerError | undefined>;

  return {
    datas,
    status,
    loading,
    error,
    retry,
    refresh,
    refreshDebounced,
    retryDebounced,
    refreshThrottled,
    retryThrottled
  } as unknown as IUseApiResult<TData>;
};
