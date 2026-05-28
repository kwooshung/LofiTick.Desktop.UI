/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce, throttle } from 'es-toolkit';

import { DEFAULT_SIGN_BLOB_COOKIE_NAME, getPublicSignAesSeedFromConfig, pickSignRefreshBlob, SIGN_BLOB_COOKIE_NAME_HINT_HEADER, SIGN_INIT_PATH, SIGN_REFRESH_PATH } from '@@/shared/utils';
import type { UseFetchOptions } from '#app';

import type { IApiResponseWrapper, IApiToastTryEmitArgs, IServerError, ISignRefreshPayload, ISignState, IUseApiDebounceOptions, IUseApiResult, IUseApiThrottleOptions, IUseFetchExtraOptions, TUseApiRateLimitedFn } from './index.types';

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
 * 函数：按统一口径尝试触发 API 错误 Toast。
 *
 * 该逻辑与 `useApi` 的 `onResponseError` 保持同源，确保 `toast.enable=false` 与去重规则一致。
 *
 * # Arguments
 *
 * * `args` - 触发参数。
 *
 * # Returns
 *
 * 无返回值。
 */
export const apiToastTryEmit = (args: IApiToastTryEmitArgs): void => {
  const raw = args.raw;
  const rawObj = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

  const status = rawObj.status as unknown;
  const code = status ? statusCodeBuild(status) : `${to3(args.fallbackHttp)}-000-000`;

  const toastSrc = (rawObj.toast ?? {}) as Record<string, unknown>;
  const toastEnableRaw = toastSrc.enable;
  const toastEnable = toastEnableRaw === false ? false : true;

  if (!toastEnable) {
    return;
  }

  const nowMs = Date.now();
  const dedupeKey = `api:${args.method}:${args.backendPath}:${code}:${args.keyHash}`;
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
  const statusObj = status && typeof status === 'object' && !Array.isArray(status) ? (status as Record<string, unknown>) : {};
  const statusTs = String(statusObj.ts ?? '');

  args.toastSet({
    key: `toast-api-${Date.now()}-${statusTs}`,
    enable: toastEnable,
    code,
    icon: String(toastSrc.icon ?? ''),
    color,
    duration: Number.isFinite(Number(toastSrc.duration)) ? Number(toastSrc.duration) : 3000,
    progress: toastSrc.progress === true,
    close: toastSrc.close === true
  });
};

/**
 * 常量：Nuxt CSRF token 刷新接口。
 */
const NUXT_CSRF_REFRESH_PATH = '/api/security/csrf';

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
 * 函数：拆分路径与查询串（并忽略 hash）。
 * @param {string} input 原始路径
 * @return {{ pathOnly: string; search: string }} 仅路径与查询串
 */
const splitPathAndSearch = (input: string): { pathOnly: string; search: string } => {
  const raw = String(input ?? '');

  const hashIndex = raw.indexOf('#');
  const noHash = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;

  const queryIndex = noHash.indexOf('?');
  if (queryIndex < 0) {
    return { pathOnly: noHash, search: '' };
  }

  const pathOnly = noHash.slice(0, queryIndex);
  const search = noHash.slice(queryIndex);
  return { pathOnly, search };
};

/**
 * 函数：将查询串解析为对象（支持重复 key 形成数组）。
 * @param {string} search 查询串（可带 ?）
 * @return {Record<string, unknown>} 参数对象
 */
const toParamsObjectFromSearch = (search: string): Record<string, unknown> => {
  const s = String(search ?? '').trim();
  if (s === '') {
    return {};
  }

  const qs = s.startsWith('?') ? s.slice(1) : s;
  if (qs === '') {
    return {};
  }

  const params = new URLSearchParams(qs);
  const out: Record<string, unknown> = {};

  for (const [k, v] of params.entries()) {
    const key = String(k ?? '');
    const val = String(v ?? '');
    if (key === '') {
      continue;
    }

    const existing = out[key];
    if (existing === undefined) {
      out[key] = val;
      continue;
    }

    if (Array.isArray(existing)) {
      existing.push(val);
      continue;
    }

    out[key] = [String(existing), val];
  }

  return out;
};

/**
 * 函数：将 query/body 归一为可签名对象。
 * @param {unknown} input 输入
 * @return {Record<string, unknown>} 对象
 */
const toParamsObjectForSignature = (input: unknown): Record<string, unknown> => {
  if (input == null) {
    return {};
  }

  if (input instanceof URLSearchParams) {
    return toParamsObjectFromSearch(input.toString());
  }

  if (typeof input === 'string') {
    const s = input.trim();
    if (s === '') {
      return {};
    }

    // 仅当看起来像 querystring 时才解析，避免误把普通字符串当作参数表。
    if (s.includes('=') || s.includes('&')) {
      return toParamsObjectFromSearch(s);
    }

    return {};
  }

  if (typeof input === 'object' && !Array.isArray(input)) {
    return omitUndefined(input);
  }

  return {};
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
 * 函数：映射签名用后端路径（对齐后端 SecurityLayer 实际看到的 path）。
 *
 * 后端对部分路由组使用 Axum `nest(prefix, router.route_layer(SecurityLayer))` 的挂载方式。
 * 在该结构下，`SecurityLayer` 参与签名校验时读取到的 `uri.path()` 会剥离 `prefix`，
 * 因此前端计算签名时必须使用“剥离后的 path”，否则会出现 `SIGN_MISMATCH`。
 *
 * # Arguments
 *
 * - `backendPath`：去掉 `/api` 前缀后的后端路径。
 *
 * # Returns
 *
 * 返回用于签名计算的后端路径。
 */
const toBackendPathForSignature = (backendPath: string): string => {
  const p0 = String(backendPath ?? '').trim();
  const p = p0 === '' ? '/' : p0.startsWith('/') ? p0 : `/${p0}`;

  const prefixes = ['/desktop', '/crons', '/live'] as const;
  for (const prefix of prefixes) {
    if (p === prefix) {
      return '/';
    }
    if (p.startsWith(`${prefix}/`)) {
      return p.slice(prefix.length);
    }
  }

  return p;
};

/**
 * 函数：归一化签名参数 key（对齐后端 RequestParams）。
 * @param {string} key 原始 key
 * @return {string} 归一化后的 key
 */
const normalizeSignatureKey = (key: string): string => {
  const keyLower = String(key ?? '')
    .trim()
    .toLowerCase();
  if (keyLower === 'pagesize') {
    return 'pageSize';
  }

  let out = '';
  let upperNext = false;

  for (const chRaw of String(key ?? '')) {
    if (chRaw === '_' || chRaw === '-') {
      upperNext = true;
      continue;
    }

    const ch = chRaw.toLowerCase();
    if (upperNext) {
      out += ch.toUpperCase();
      upperNext = false;
    } else {
      out += ch;
    }
  }

  return out;
};

/**
 * 函数：将字符串尝试转换为“可逆的数字”。
 * @param {string} input 字符串
 * @return {number | null} 数字或 null
 */
const toCanonicalNumberOrNull = (input: string): number | null => {
  const trimmed = String(input ?? '').trim();
  if (trimmed === '') {
    return null;
  }

  const num = Number(trimmed);
  if (!Number.isFinite(num)) {
    return null;
  }

  // 对齐后端：仅当 trimmed 与 String(Number(trimmed)) 一致时才允许数字化（特别是 -0）
  const canon = num === 0 ? '0' : String(num);
  if (canon !== trimmed) {
    return null;
  }

  return num;
};

/**
 * 函数：字符串布尔值归一（对齐后端 convert_boolean）。
 * @param {string} input 字符串
 * @return {boolean | null} 布尔或 null
 */
const toCanonicalBooleanOrNull = (input: string): boolean | null => {
  const lower = String(input ?? '')
    .trim()
    .toLowerCase();

  if (lower === 'true' || lower === 'yes' || lower === 'y' || lower === 'on') {
    return true;
  }
  if (lower === 'false' || lower === 'no' || lower === 'n' || lower === 'off') {
    return false;
  }

  return null;
};

/**
 * 函数：将任意值转换为“用于签名的 JS 字符串表示”。
 * @param {object} args 参数
 * @param {string} args.key 归一化后的 key
 * @param {unknown} args.value 原始值
 * @return {string | null} 签名字符串（null 表示缺失）
 */
const toSignatureJsStringOrNull = (args: { key: string; value: unknown }): string | null => {
  const keyLower = String(args.key ?? '').toLowerCase();
  const v = args.value;

  if (v === undefined) {
    return null;
  }
  if (v === null) {
    // 对齐后端：顶层 null 视为缺失（RequestParams: Value::Null => None）
    return null;
  }

  // Array：对齐后端 json_to_js_string：逐项转换后用逗号拼接；单元素数组按标量处理
  if (Array.isArray(v)) {
    if (v.length === 0) {
      return '';
    }
    if (v.length === 1) {
      return toSignatureJsStringOrNull({ key: args.key, value: v[0] });
    }

    // 对齐后端：数组元素仅做数字化（可逆）与原样字符串化；不做布尔字符串归一与 page/pageSize clamp。
    const toArrayElementString = (it: unknown): string => {
      if (it === undefined) {
        return '';
      }
      if (it === null) {
        return 'null';
      }
      if (typeof it === 'boolean') {
        return it ? 'true' : 'false';
      }
      if (typeof it === 'number' && Number.isFinite(it)) {
        return String(it);
      }
      if (typeof it === 'string') {
        const num = toCanonicalNumberOrNull(it);
        if (num !== null) {
          return String(num);
        }
        return it;
      }
      if (typeof it === 'object') {
        return '[object Object]';
      }
      return String(it);
    };

    return v.map(toArrayElementString).join(',');
  }

  // Boolean
  if (typeof v === 'boolean') {
    return v ? 'true' : 'false';
  }

  // Number：对齐后端 clamp 逻辑（page/pageSize）
  if (typeof v === 'number' && Number.isFinite(v)) {
    let num = v;
    if (keyLower === 'page' && num < 1) {
      num = 1;
    }
    if (keyLower === 'pagesize') {
      num = Math.min(100, Math.max(1, num));
    }
    if (Number.isInteger(num)) {
      return String(num);
    }
    return String(num);
  }

  // String：对齐后端：trim + 空字符串视为缺失 + 布尔字符串归一 + page/pageSize 数字化与 clamp
  if (typeof v === 'string') {
    const trimmed = v.trim();
    if (trimmed === '') {
      return null;
    }

    // 对齐后端：标量字符串包含逗号时按数组规则拆分（trim、过滤空项、元素仅做可逆数字化）。
    if (trimmed.includes(',')) {
      const parts = trimmed
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map((s) => {
          const num = toCanonicalNumberOrNull(s);
          return num !== null ? String(num) : s;
        });

      return parts.join(',');
    }

    const b = toCanonicalBooleanOrNull(trimmed);
    if (b !== null) {
      return b ? 'true' : 'false';
    }

    if (keyLower === 'page' || keyLower === 'pagesize') {
      const num = toCanonicalNumberOrNull(trimmed);
      if (num !== null) {
        let out = num;
        if (keyLower === 'page' && out < 1) {
          out = 1;
        }
        if (keyLower === 'pagesize') {
          out = Math.min(100, Math.max(1, out));
        }
        if (Number.isInteger(out)) {
          return String(out);
        }
        return String(out);
      }
    }

    return trimmed;
  }

  // Object：对齐后端：固定返回 "[object Object]"
  if (typeof v === 'object') {
    return '[object Object]';
  }

  return String(v);
};

/**
 * 函数：写入签名用 canonical 参数（后写覆盖先写）。
 * @param {object} args 参数
 * @param {Record<string, string>} args.out 输出表
 * @param {string} args.key 参数 key
 * @param {unknown} args.value 参数值
 * @return {void} 无返回
 */
const upsertSignatureParam = (args: { out: Record<string, string>; key: string; value: unknown }): void => {
  const keyNorm = normalizeSignatureKey(args.key);
  if (keyNorm === '' || keyNorm === 'nonce' || keyNorm === 'sign') {
    return;
  }

  const val = toSignatureJsStringOrNull({ key: keyNorm, value: args.value });
  if (val === null) {
    return;
  }

  args.out[keyNorm] = val;
};

/**
 * 常量：签名 canonical 规则测试入口。
 * 描述：仅供单元测试复用，避免前后端 canonical 规则再次发生漂移。
 */
export const useApiSignatureTestUtils = {
  normalizeSignatureKey,
  toBackendPathForSignature,
  toParamsObjectForSignature,
  toSignatureJsStringOrNull,
  canonicalizeParams: (input: Record<string, unknown>): Record<string, string> => {
    const out: Record<string, string> = {};

    for (const [key, value] of Object.entries(input)) {
      upsertSignatureParam({ out, key, value });
    }

    return out;
  }
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

  // 800 = Security, 6 = SIGN_TS_EXPIRED
  // SIGN_MISMATCH 更常见于参数或路径签名口径不一致，盲目重放只会产生重复请求。
  if (biz === 800 && aim === 6) {
    return true;
  }
  return false;
};

/**
 * 函数：是否需要触发条件3 的 CSRF 自愈。
 * @param {unknown} status 服务端 status
 * @return {boolean} 是否需要重新下发 CSRF token
 */
const shouldReinitCsrfOnStatus = (status: unknown): boolean => {
  const s = (status ?? {}) as Record<string, unknown>;
  const biz = Number(s.biz ?? -1);
  const aim = Number(s.aim ?? -1);

  // 800 = Security, 60/61/62 = CSRF cookie/header/mismatch
  if (biz === 800 && (aim === 60 || aim === 61 || aim === 62)) {
    return true;
  }
  return false;
};

/**
 * 函数：从 useFetch error 中提取服务端 status。
 *
 * 该函数用于在 `immediate: false` 的模式下，从 `base.refresh()` 后的 error
 * 中读取统一响应结构的 `status`，以判断是否需要触发签名 refresh。
 *
 * # Arguments
 *
 * * `err` - useFetch 的 error 值。
 *
 * # Returns
 *
 * 返回可能存在的 `status`；无法提取时返回 `undefined`。
 */
const pickStatusFromUseFetchError = (err: unknown): unknown => {
  const e = (err ?? {}) as Record<string, unknown>;
  const data = (e.data ?? (e.response as any)?._data) as unknown;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return undefined;
  }
  return (data as Record<string, unknown>).status;
};

/**
 * 函数：从 useFetch error 中提取错误响应对象。
 *
 * 该函数用于兼容 Nitro `createError(...)` 与 ofetch `FetchError` 的多种结构，
 * 以便统一判断 Nuxt 自身的 CSRF 拒绝。
 *
 * # Arguments
 *
 * * `err` - useFetch 的 error 值。
 *
 * # Returns
 *
 * 返回可读取字段的对象；不存在时返回空对象。
 */
const pickUseFetchErrorObject = (err: unknown): Record<string, unknown> => {
  const e = (err ?? {}) as Record<string, unknown>;
  const data = (e.data ?? (e.response as any)?._data) as unknown;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {};
  }
  return data as Record<string, unknown>;
};

/**
 * 函数：判断是否命中 Nuxt 自身的 CSRF 拒绝。
 *
 * 该判断只处理 `nuxt-csurf` 在同源 `/api/**` 层抛出的 `EBADCSRFTOKEN`，
 * 不影响后端安全层的签名/CSRF 自愈逻辑。
 *
 * # Arguments
 *
 * * `err` - useFetch 的 error 值。
 *
 * # Returns
 *
 * 命中 Nuxt CSRF 拒绝时返回 `true`。
 */
const shouldRefreshNuxtCsrfOnError = (err: unknown): boolean => {
  const e = (err ?? {}) as Record<string, unknown>;
  const data = pickUseFetchErrorObject(err);

  const statusCode = Number(e.statusCode ?? data.statusCode ?? (e.response as any)?.status ?? 0);
  const errorName = String(e.name ?? data.name ?? '').trim();
  const statusMessage = String(e.statusMessage ?? data.statusMessage ?? '').trim();
  const message = String(e.message ?? data.message ?? '').trim();

  if (statusCode !== 403) {
    return false;
  }

  return errorName === 'EBADCSRFTOKEN' || statusMessage === 'CSRF Token Mismatch' || message === 'CSRF Token invalid' || message === 'CSRF Token not found' || message === 'CSRF Cookie not found';
};

/**
 * 函数：判断本次错误是否应先静默，等待自愈重试结果。
 *
 * 该判断只覆盖当前链路已支持“自动自愈一次”的错误：
 * - 后端安全层的签名过期 / 签名不匹配
 * - 后端安全层的 CSRF 缺失 / 缺 header / 不匹配
 * - Nuxt 同源代理层的 CSRF 拒绝
 *
 * # Arguments
 *
 * * `args` - 判定所需参数。
 *
 * # Returns
 *
 * 命中可自愈错误时返回 `true`。
 */
const shouldSilenceToastForRecoverableError = (args: { status: unknown; raw?: unknown; fallbackHttp?: number }): boolean => {
  if (shouldRefreshOnStatus(args.status) || shouldReinitCsrfOnStatus(args.status)) {
    return true;
  }

  const rawObj = args.raw && typeof args.raw === 'object' && !Array.isArray(args.raw) ? (args.raw as Record<string, unknown>) : {};
  const statusCode = Number(args.fallbackHttp ?? rawObj.statusCode ?? 0);
  const errorName = String(rawObj.name ?? '').trim();
  const statusMessage = String(rawObj.statusMessage ?? '').trim();
  const message = String(rawObj.message ?? '').trim();

  if (statusCode !== 403) {
    return false;
  }

  return errorName === 'EBADCSRFTOKEN' || statusMessage === 'CSRF Token Mismatch' || message === 'CSRF Token invalid' || message === 'CSRF Token not found' || message === 'CSRF Cookie not found';
};

/**
 * 函数：刷新当前页面可用的 Nuxt CSRF token。
 *
 * 该函数通过本地 `/api/security/csrf` 获取最新 token，并同步写回当前文档的 meta，
 * 供后续写请求重新读取。
 *
 * # Returns
 *
 * 成功刷新时返回 `true`，否则返回 `false`。
 */
const refreshNuxtCsrfToken = async (onUpdated?: (token: string) => void): Promise<boolean> => {
  if (import.meta.server) {
    return false;
  }

  const raw = await $fetch<{ token?: unknown }>(NUXT_CSRF_REFRESH_PATH, {
    method: 'GET',
    credentials: 'include'
  });

  const token = String(raw?.token ?? '').trim();
  if (token === '') {
    return false;
  }

  let meta = window.document.querySelector('meta[name="csrf-token"]');
  if (!meta) {
    meta = window.document.createElement('meta');
    meta.setAttribute('name', 'csrf-token');
    window.document.head.appendChild(meta);
  }

  meta.setAttribute('content', token);
  onUpdated?.(token);
  return true;
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
    const signRefreshBlob = pickSignRefreshBlob(raw);

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
 * 函数：从 document.cookie 读取指定 cookie 值。
 *
 * 该函数用于兜底：浏览器通过响应头 `Set-Cookie` 写入 cookie 时，
 * Nuxt `useCookie()` 返回的 ref 在同一个 tick 内不一定能同步到最新值。
 *
 * # Arguments
 *
 * * `name` - Cookie 名称。
 *
 * # Returns
 *
 * 返回 cookie 的字符串值；不存在则返回空字符串。
 */
const readCookieValueFromDocument = (name: string): string => {
  if (!import.meta.client) {
    return '';
  }

  const target = String(name ?? '').trim();
  if (target === '') {
    return '';
  }

  const raw = String(document.cookie ?? '').trim();
  if (raw === '') {
    return '';
  }

  const parts = raw.split(/;\s*/g);
  for (const part of parts) {
    if (!part) {
      continue;
    }

    const idx = part.indexOf('=');
    if (idx <= 0) {
      continue;
    }

    const key = decodeURIComponent(part.slice(0, idx));
    if (key !== target) {
      continue;
    }

    return decodeURIComponent(part.slice(idx + 1));
  }

  return '';
};

/**
 * 函数：尝试消费 refresh cookie 并更新本地 payload。
 */
const consumeRefreshCookieIfPresent = async (args: { signState: Ref<ISignState>; aesSeed: string; getCookieRef: TGetCookieRef }): Promise<void> => {
  const { signState, aesSeed, getCookieRef } = args;

  if (import.meta.server) {
    return;
  }

  const cookieName = String(signState.value.signBlobCookieName ?? DEFAULT_SIGN_BLOB_COOKIE_NAME).trim() || DEFAULT_SIGN_BLOB_COOKIE_NAME;

  const cookie = await getCookieRef(cookieName);
  let blob = String(cookie.value ?? '').trim();

  // Client：兜底从 document.cookie 读取，避免 useCookie ref 未同步导致刷新失败。
  if (import.meta.client && !blob.startsWith('v1.')) {
    const fromDoc = String(readCookieValueFromDocument(cookieName) ?? '').trim();
    if (fromDoc !== '') {
      blob = fromDoc;
    }
  }

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

  // Client：优先尝试从 cookie 获取；若缺失则自动触发一次 init 让代理写入 refresh cookie。
  if (import.meta.client) {
    await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
    if (signState.value.payload) {
      return;
    }

    // 走同源 /api 代理请求 sign/init，由代理写入 refresh cookie。
    const res = await fetchSignBootstrap({ backendPath: SIGN_INIT_PATH, signState, apiBase });
    const cookieName = String(res.datas.sign_blob_cookie_name ?? '').trim();
    if (cookieName !== '') {
      signState.value.signBlobCookieName = cookieName;
    }

    await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
    if (signState.value.payload) {
      return;
    }

    throw new Error('sign payload missing');
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
  if (import.meta.server && options.immediate !== true) {
    const noopAsync = async (): Promise<void> => {};
    const noopRateLimited: TUseApiRateLimitedFn = () => {};

    return {
      data: ref<T | undefined>(undefined),
      loading: ref(false),
      error: ref(null),
      retry: noopAsync,
      refresh: noopAsync,
      refreshDebounced: noopRateLimited,
      retryDebounced: noopRateLimited,
      refreshThrottled: noopRateLimited,
      retryThrottled: noopRateLimited
    };
  }

  const nuxtApp = useNuxtApp();
  return await nuxtApp.runWithContext(async () => {
    const apiPath = toApiPath(path);
    const backendPathWithSearch = toBackendPath(path);
    const backendParts = splitPathAndSearch(backendPathWithSearch);
    const backendPath = backendParts.pathOnly;
    const backendQueryFromPath = toParamsObjectFromSearch(backendParts.search);
    const signatureBackendPath = toBackendPathForSignature(backendPath);
    const method = normalizeMethod(options.method);
    const hasBodyMethod = HAS_BODY_METHODS.has(method as any);
    const isWriteMethod = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';

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
      if (import.meta.server) {
        return ref<string | null>(null);
      }

      return useCookie<string | null>(name, { default: () => null });
    };

    /**
     * 函数：仅当缺失时写入 HttpOnly Cookie。
     * @param {object} args 参数
     * @param {string} args.name Cookie 名称
     * @param {string} args.value Cookie 值
     * @return {Promise<void>} 无返回
     */
    const setHttpOnlyCookieIfMissing: TSetHttpOnlyCookieIfMissing = async (cookieArgs): Promise<void> => {
      if (import.meta.server) {
        return;
      }

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
    };

    /**
     * 状态：Toast store（必须在 setup 上下文中获取，避免回调里调用 composable 触发 Nuxt 报错）
     */
    const toastStore = useStoreToastApi();

    const querySource = isRef(options.query) ? (options.query as Ref<unknown>) : ref(options.query);
    const bodySource = isRef(options.body) ? (options.body as Ref<unknown>) : ref(options.body);
    const datasSource = isRef(options.datas) ? (options.datas as Ref<Record<string, unknown>>) : ref(options.datas);

    const baseQueryRef = computed<Record<string, unknown>>(() => omitUndefined(resolve(querySource.value)));
    const baseBodyRef = computed<Record<string, unknown>>(() => ({
      ...omitUndefined(resolve(bodySource.value)),
      ...toSpreadableObject(resolve(datasSource.value))
    }));
    const baseGetQueryRef = computed<Record<string, unknown>>(() => ({
      ...omitUndefined(resolve(querySource.value)),
      ...toSpreadableObject(resolve(datasSource.value))
    }));

    const baseAllParamsRef = computed<Record<string, unknown>>(() => {
      if (hasBodyMethod) {
        return {
          ...toSpreadableObject(resolve(querySource.value)),
          ...toSpreadableObject(resolve(bodySource.value)),
          ...toSpreadableObject(resolve(datasSource.value))
        };
      }
      return {
        ...toSpreadableObject(resolve(querySource.value)),
        ...toSpreadableObject(resolve(datasSource.value))
      };
    });

    const keyHash = JSON.stringify({ method, apiPath, params: baseAllParamsRef.value });
    const staticKey = `api-${keyHash.length}-${Date.now()}`;

    const headersObj = mergeHeaders(options.headers as HeadersInit | undefined, {});

    // 提示代理层：当前 refresh cookie name（用于条件2自动注入时落盘）
    const hintedCookieName = String(signState.value.signBlobCookieName ?? DEFAULT_SIGN_BLOB_COOKIE_NAME).trim() || DEFAULT_SIGN_BLOB_COOKIE_NAME;
    headersObj[SIGN_BLOB_COOKIE_NAME_HINT_HEADER] = hintedCookieName;
    const { pick: _omitPick, transform: _omitTransform, rateLimit: _omitRateLimit, immediate: immediateOption, ignoreResponseError: ignoreResponseErrorOption, ...restOptions } = options;
    const shouldRunImmediate = immediateOption === true;
    const defaultIgnoreResponseError = ignoreResponseErrorOption === true;

    /**
     * 变量：最近一次响应的服务端 status。
     *
     * 用于在 `immediate: false` 场景下，可靠判断本次 `base.refresh()` 是否命中
     * `SIGN_TS_EXPIRED` / `SIGN_MISMATCH`，从而触发签名 refresh 并重试一次。
     */
    let lastResponseStatus: unknown = undefined;

    /**
     * 变量：当前请求周期是否允许静默吞掉首个可自愈错误 Toast。
     *
     * 每次外层 `refresh()` / `retry()` 会重置为 `true`，
     * 如果首个失败命中签名或 CSRF 自愈条件，则先静默，等待自动补救后的最终结果再决定是否提示。
     */
    let canSilenceRecoverableToast = true;

    /**
     * 变量：当前请求周期是否忽略统一错误提示。
     */
    let activeIgnoreResponseError = defaultIgnoreResponseError;

    /**
     * 函数：在指定静默策略下执行一次请求周期。
     * @param {boolean} ignoreResponseError 是否忽略统一错误提示
     * @param {() => Promise<TValue>} runner 执行函数
     * @returns {Promise<TValue>} 执行结果
     * @template TValue 返回值类型
     */
    const runWithIgnoreResponseError = async <TValue>(ignoreResponseError: boolean, runner: () => Promise<TValue>): Promise<TValue> => {
      const previousValue = activeIgnoreResponseError;
      activeIgnoreResponseError = ignoreResponseError;

      try {
        return await runner();
      } finally {
        activeIgnoreResponseError = previousValue;
      }
    };

    /**
     * 状态：本次请求签名相关参数（稳定引用，避免 useFetch 捕获旧 options 导致 ts 固化）。
     */
    const sigTsRef = ref('');
    const sigNonceRef = ref('');
    const sigSignRef = ref('');
    const sigExtraHeadersRef = ref<Record<string, string>>({});
    const nuxtCsrfTokenRef = ref('');

    /**
     * 计算：Nuxt CSRF 请求头。
     *
     * 写请求在真正发出前总是读取当前文档中的最新 token，
     * 避免长生命周期 `useFetch` 实例沿用过期 header。
     */
    const nuxtCsrfHeadersRef = computed<Record<string, string>>(() => {
      if (import.meta.server || !isWriteMethod || isSignBootstrapPath(backendPath)) {
        return {};
      }

      const { csrf, headerName } = useCsrf();
      const token = String((nuxtCsrfTokenRef.value || csrf) ?? '').trim();
      const name = String(headerName ?? '').trim();

      if (token === '' || name === '') {
        return {};
      }

      return { [name]: token };
    });

    /**
     * 计算：带签名字段的 query。
     *
     * 迷惑假参数 `ts/nonce/sign` 一律显示在 URL 中，便于对外观测时保持一致。
     */
    const signedQueryRef = computed<Record<string, unknown>>(() => {
      const ts = sigTsRef.value;
      if (ts === '') {
        return hasBodyMethod ? baseQueryRef.value : baseGetQueryRef.value;
      }

      return {
        ...(hasBodyMethod ? baseQueryRef.value : baseGetQueryRef.value),
        ts,
        nonce: sigNonceRef.value,
        sign: sigSignRef.value
      };
    });

    /**
     * 计算：最终请求 body。
     *
     * 写请求仅携带业务参数，迷惑假参数不再混入 body。
     */
    const signedBodyRef = computed<Record<string, unknown>>(() => baseBodyRef.value);

    /**
     * 计算：最终请求 headers（稳定引用）。
     */
    const signedHeadersRef = computed<Record<string, string>>(() => mergeHeaders(headersObj as any, mergeHeaders(nuxtCsrfHeadersRef.value, sigExtraHeadersRef.value)));

    // SSR 首屏数据必须在服务端首包阶段直接发出，避免先建 immediate:false 实例再手动 refresh
    // 导致 async setup 上下文断裂，最终让 HTML 首屏缺失真实数据。
    const shouldUseServerImmediateFetch = import.meta.server && shouldRunImmediate;

    const finalOptions: UseFetchOptions<unknown> & Record<string, unknown> = {
      watch: false,
      immediate: false,
      ...restOptions,
      headers: headersObj,
      onResponseError(ctx: any) {
        const raw = ctx?.response?._data as IApiResponseWrapper<unknown> | undefined;
        const fallbackHttp = ctx?.response?.status;

        lastResponseStatus = raw?.status;

        if (activeIgnoreResponseError) {
          return;
        }

        if (canSilenceRecoverableToast && shouldSilenceToastForRecoverableError({ status: raw?.status, raw, fallbackHttp })) {
          canSilenceRecoverableToast = false;
          return;
        }

        apiToastTryEmit({
          method,
          backendPath,
          keyHash,
          raw,
          fallbackHttp,
          toastSet: toastStore.set
        });
      },
      key: staticKey
    };

    if (hasBodyMethod) {
      finalOptions.body = signedBodyRef as any;
      finalOptions.query = signedQueryRef as any;
    } else {
      finalOptions.query = signedQueryRef as any;

      // GET/HEAD/DELETE：强制不发送 body，避免与服务端“GET 不解析 body”的规则冲突。
      delete (finalOptions as any).body;
    }

    finalOptions.headers = signedHeadersRef as any;

    // 计算签名：仅对非 sign init/refresh 生效
    const runWithSignature = async (): Promise<void> => {
      if (isSignBootstrapPath(backendPath)) {
        return;
      }

      await ensureSignReady({ signState, apiBase, aesSeed, getCookieRef, setHttpOnlyCookieIfMissing });
      await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });

      const tsMs = Date.now();
      const ts = String(tsMs);

      sigTsRef.value = ts;

      // 迷惑假参数：nonce/sign（不参与真实签名计算，但会随请求携带并由服务端校验格式）
      const nonce = randomHexLower(FAKE_NONCE_LEN / 2);
      const sign = randomHexLower(FAKE_SIGN_LEN / 2);

      sigNonceRef.value = nonce;
      sigSignRef.value = sign;

      // 计算签名参数（合并 query/body/datas 后排序）
      const finalQueryParams = toParamsObjectForSignature(resolve(finalOptions.query as any));
      const finalBodyParams = hasBodyMethod ? toParamsObjectForSignature(signedBodyRef.value) : {};

      const allParams: Record<string, unknown> = hasBodyMethod
        ? {
            ...backendQueryFromPath,
            ...finalQueryParams,
            ...finalBodyParams,
            ts
          }
        : {
            ...backendQueryFromPath,
            ...finalQueryParams,
            ts
          };

      const canonicalParams: Record<string, string> = {};
      for (const [k, v] of Object.entries(allParams)) {
        upsertSignatureParam({ out: canonicalParams, key: k, value: v });
      }

      const sortedPairs = Object.keys(canonicalParams)
        .sort()
        .map((key) => `${key}=${encodeURIComponent(canonicalParams[key] ?? '')}`);

      const payload = signState.value.payload as ISignRefreshPayload | null;
      if (!payload || String(payload.signKeyHex ?? '').trim() === '') {
        throw new Error('sign payload missing');
      }

      const sig = await computeSignatureBase64({
        backendPath: signatureBackendPath,
        sortedParamPairs: sortedPairs,
        signKeyHex: payload.signKeyHex
      });

      const extraHeaders: Record<string, string> = {
        [payload.signHeaderName]: `${payload.signSigPrefix}${sig}`,
        [SOC_FETCH_DEST_HEADER_NAME]: SOC_FETCH_DEST_HEADER_VALUE
      };

      sigExtraHeadersRef.value = extraHeaders;
    };

    if (shouldUseServerImmediateFetch) {
      await runWithSignature();
      finalOptions.immediate = true;
    }

    const fetch = useFetch;
    const base: any = await nuxtApp.runWithContext(() => fetch(apiPath as any, finalOptions as any));

    const { error, pending } = base;

    // 条件2：只要代理层写入了 refresh cookie，就尝试解密并缓存
    await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });

    /**
     * 函数：当遇到“窗口切换/完全过期”导致的拒绝时，refresh 并重试一次。
     *
     * 由于本项目默认使用 `immediate: false`，首次创建 useFetch 实例时并不会真正发起请求。
     * 因此“条件3”的处理必须落在 `refresh()` / `retry()` 这类真正触发请求的 wrapper 内。
     *
     * # Arguments
     *
     * * `refreshArgs` - 透传给 `base.refresh(...)` 的参数。
     *
     * # Returns
     *
     * 无返回。
     */
    const refreshOnceIfSecurityRejected = async (refreshArgs?: unknown): Promise<void> => {
      if (isSignBootstrapPath(backendPath)) {
        return;
      }

      const errStatus = lastResponseStatus ?? pickStatusFromUseFetchError(error.value);
      const shouldRefreshNuxtCsrf = shouldRefreshNuxtCsrfOnError(error.value);

      if (!error.value || (!shouldRefreshOnStatus(errStatus) && !shouldReinitCsrfOnStatus(errStatus) && !shouldRefreshNuxtCsrf)) {
        return;
      }

      if (shouldRefreshNuxtCsrf) {
        try {
          await refreshNuxtCsrfToken((token) => {
            nuxtCsrfTokenRef.value = token;
          });
        } catch {
          return;
        }
      } else if (shouldRefreshOnStatus(errStatus)) {
        await performSignRefresh({ signState, apiBase, aesSeed, getCookieRef });
      } else {
        // CSRF 自愈：通过 sign/init 的 server-to-server 下发，让代理补齐 CSRF cookie。
        const res = await fetchSignBootstrap({ backendPath: SIGN_INIT_PATH, signState, apiBase });
        const cookieName = String(res.datas.sign_blob_cookie_name ?? '').trim();
        if (cookieName !== '') {
          signState.value.signBlobCookieName = cookieName;
        }
      }

      await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
      await runWithSignature();
      finalOptions.key = `${staticKey}-${Date.now()}`;
      canSilenceRecoverableToast = false;

      try {
        if (refreshArgs !== undefined) {
          await base.refresh(refreshArgs as any);
        } else {
          await base.refresh();
        }
      } catch {
        // ignore
      }

      await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
    };

    const retry = async (opts?: IUseFetchExtraOptions) => {
      canSilenceRecoverableToast = true;
      const ignoreResponseError = opts?.ignoreResponseError ?? defaultIgnoreResponseError;

      if (opts) {
        const rest = { ...opts } as Partial<IUseFetchExtraOptions>;
        delete (rest as any).datas;
        delete (rest as any).query;
        delete (rest as any).body;
        delete (rest as any).ignoreResponseError;

        await runWithIgnoreResponseError(ignoreResponseError, async () => {
          await runWithSignature();
          try {
            await base.refresh(rest as any);
          } catch {
            // ignore
          }
          await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
          await refreshOnceIfSecurityRejected(rest as any);
        });
      } else {
        await runWithIgnoreResponseError(ignoreResponseError, async () => {
          await runWithSignature();
          try {
            await base.refresh();
          } catch {
            // ignore
          }
          await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
          await refreshOnceIfSecurityRejected();
        });
      }
    };

    let latestRefreshVersion = 0;
    let activeRefreshPromise: Promise<void> | null = null;
    let queuedDatasSource: Record<string, unknown> | null = null;
    let queuedQuerySource: Record<string, unknown> | null = null;
    let queuedBodySource: Record<string, unknown> | null = null;
    let queuedIgnoreResponseError = defaultIgnoreResponseError;

    const snapshotRecord = (input: unknown): Record<string, unknown> => toSpreadableObject(resolve(input));

    const captureQueuedSources = (opts: IUseFetchExtraOptions): void => {
      queuedDatasSource = opts.datas !== undefined ? snapshotRecord(opts.datas) : snapshotRecord(datasSource.value);
      queuedQuerySource = opts.query !== undefined ? snapshotRecord(opts.query) : snapshotRecord(querySource.value);
      queuedBodySource = opts.body !== undefined ? snapshotRecord(opts.body) : snapshotRecord(bodySource.value);
      queuedIgnoreResponseError = opts.ignoreResponseError ?? defaultIgnoreResponseError;
    };

    const applyQueuedSources = (): void => {
      datasSource.value = { ...(queuedDatasSource ?? snapshotRecord(datasSource.value)) } as any;
      querySource.value = { ...(queuedQuerySource ?? snapshotRecord(querySource.value)) };
      bodySource.value = { ...(queuedBodySource ?? snapshotRecord(bodySource.value)) };
    };

    const executeRefreshOnce = async (): Promise<void> => {
      applyQueuedSources();
      finalOptions.key = `${staticKey}-${Date.now()}`;
      canSilenceRecoverableToast = true;

      await runWithIgnoreResponseError(queuedIgnoreResponseError, async () => {
        if (isWriteMethod && !isSignBootstrapPath(backendPath) && Object.keys(nuxtCsrfHeadersRef.value).length === 0) {
          try {
            await refreshNuxtCsrfToken((token) => {
              nuxtCsrfTokenRef.value = token;
            });
          } catch {
            // ignore
          }
        }

        await runWithSignature();
        try {
          await base.refresh();
        } catch (refreshError) {
          if (import.meta.server && shouldRunImmediate) {
            throw refreshError;
          }
        }
        await consumeRefreshCookieIfPresent({ signState, aesSeed, getCookieRef });
        await refreshOnceIfSecurityRejected();
      });
    };

    const refresh = async (opts: IUseFetchExtraOptions = {}) => {
      captureQueuedSources(opts);

      latestRefreshVersion += 1;

      if (activeRefreshPromise) {
        await activeRefreshPromise;
        return;
      }

      const refreshPromise = (async () => {
        let processedVersion = 0;

        while (processedVersion !== latestRefreshVersion) {
          processedVersion = latestRefreshVersion;
          await executeRefreshOnce();
        }
      })();

      activeRefreshPromise = refreshPromise;

      try {
        await refreshPromise;
      } finally {
        if (activeRefreshPromise === refreshPromise) {
          activeRefreshPromise = null;
        }
      }
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

    if (shouldRunImmediate && !shouldUseServerImmediateFetch) {
      await refresh();
    }

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
  });
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
