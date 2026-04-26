import { createDecipheriv, createHash, createHmac, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * 类型：Set-Cookie 行。
 */
type TSetCookieLine = string;

/**
 * 类型：签名 init 解密后的 payload。
 */
interface ISignRefreshPayload {
  /**
   * 属性：窗口派生 key（hex 小写）。
   */
  sign_key_hex: string;
}

/**
 * 类型：执行结果。
 */
interface ISignReproResult {
  /**
   * 属性：sign/init 返回的 window_num。
   */
  init_window_num: number;

  /**
   * 属性：派生 key 的 sha256（仅用于对账）。
   */
  derived_key_hash: string;

  /**
   * 属性：最终请求 URL。
   */
  scenes_url: string;

  /**
   * 属性：最终请求 HTTP 状态码。
   */
  http: number;

  /**
   * 属性：最终响应体（尽量解析为 JSON）。
   */
  body: unknown;
}

/**
 * 常量：假参数 nonce 的期望长度（hex 字符数）。
 */
const FAKE_NONCE_LEN = 8;

/**
 * 常量：假参数 sign 的期望长度（hex 字符数）。
 */
const FAKE_SIGN_LEN = 24;

/**
 * 函数：计算 sha256(hex)。
 *
 * 用于对齐服务端的 hash 计算与调试对账。
 *
 * # Arguments
 *
 * * `text` - 输入文本。
 *
 * # Returns
 *
 * 返回 64 位小写 hex 字符串。
 */
const sha256_hex = (text: string): string => {
  return createHash('sha256').update(text, 'utf8').digest('hex');
};

/**
 * 函数：计算 HMAC-SHA256 并输出 Base64。
 *
 * 用于生成 `Soc-Fetch-Platform` header 中的 `sig`。
 *
 * # Arguments
 *
 * * `key_text` - HMAC key（按服务端约定为 UTF-8 文本）。
 * * `msg_text` - 待签名消息（按服务端约定为 UTF-8 文本）。
 *
 * # Returns
 *
 * 返回 Base64 字符串。
 */
const hmac_sha256_base64 = (key_text: string, msg_text: string): string => {
  return createHmac('sha256', Buffer.from(key_text, 'utf8')).update(msg_text, 'utf8').digest('base64');
};

/**
 * 函数：生成指定长度的小写 hex 字符串。
 *
 * 该值仅用于通过 Nuxt dev 层的 fake 参数校验，不参与真实签名计算。
 *
 * # Arguments
 *
 * * `len` - 期望长度（单位：字符）。
 *
 * # Returns
 *
 * 返回小写 hex 字符串。
 */
const random_hex_lower = (len: number): string => {
  return randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len)
    .toLowerCase();
};

/**
 * 函数：Base64URL 解码为 Buffer。
 *
 * 用于解密 `sign_refresh`（v1.window.nonce.cipher）。
 *
 * # Arguments
 *
 * * `s` - Base64URL 字符串。
 *
 * # Returns
 *
 * 返回 Buffer。
 */
const b64url_to_buf = (s: string): Buffer => {
  let out = s.replace(/-/g, '+').replace(/_/g, '/');
  while (out.length % 4 !== 0) {
    out += '=';
  }
  return Buffer.from(out, 'base64');
};

/**
 * 函数：从 fetch Response 读取 Set-Cookie 列表。
 *
 * 兼容 undici/Node fetch 的 `headers.getSetCookie()` 与单行 `set-cookie`。
 *
 * # Arguments
 *
 * * `res` - fetch Response。
 *
 * # Returns
 *
 * 返回 Set-Cookie 行数组。
 */
const response_get_set_cookie_lines = (res: Response): TSetCookieLine[] => {
  const h = res.headers as unknown as { getSetCookie?: () => string[] };
  if (typeof h.getSetCookie === 'function') {
    return h.getSetCookie();
  }

  const raw = res.headers.get('set-cookie');
  if (raw === null || raw.trim() === '') {
    return [];
  }

  return raw
    .split(/,(?=[^;]+?=)/g)
    .map((x) => x.trim())
    .filter((x) => x !== '');
};

/**
 * 函数：读取 Desktop.UI 根目录 `.env` 内的 `NUXT_PUBLIC_SIGN_AES_SEED`。
 *
 * 仅用于本地复现对账，脚本不会打印该值。
 *
 * # Returns
 *
 * 返回 seed；不存在则返回空字符串。
 */
const read_seed_from_env_file = (): string => {
  const env_url = new URL('../../.env', import.meta.url);

  try {
    const env_text = readFileSync(env_url, 'utf8');
    const line = env_text
      .split(/\r?\n/)
      .map((x) => x.trim())
      .find((x) => x.startsWith('NUXT_PUBLIC_SIGN_AES_SEED='));

    if (line === undefined) {
      return '';
    }

    return line.split('=', 2)[1]?.trim() ?? '';
  } catch {
    return '';
  }
};

/**
 * 函数：解密 `sign_refresh` blob，并提取 `sign_key_hex`。
 *
 * blob 格式：`v1.window.nonce.cipher`。
 *
 * # Arguments
 *
 * * `blob` - cookie 值。
 * * `seed` - AES seed（文本）。
 *
 * # Returns
 *
 * 返回解密后的 payload。
 */
const sign_refresh_decrypt = (blob: string, seed: string): ISignRefreshPayload => {
  const parts = blob.split('.');
  if (!(parts.length === 4 && parts[0] === 'v1')) {
    throw new Error('bad sign_refresh blob');
  }

  const window_num = Number(parts[1]);
  if (!Number.isFinite(window_num)) {
    throw new Error('bad window_num');
  }

  const nonce = b64url_to_buf(parts[2] ?? '');
  const ct_all = b64url_to_buf(parts[3] ?? '');

  const aes_key = createHmac('sha256', Buffer.from(seed, 'utf8')).update(String(window_num), 'utf8').digest();

  const tag = ct_all.subarray(ct_all.length - 16);
  const data = ct_all.subarray(0, ct_all.length - 16);

  const decipher = createDecipheriv('aes-256-gcm', aes_key, nonce);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(data), decipher.final()]);

  const raw = JSON.parse(pt.toString('utf8')) as unknown;
  if (raw === null || typeof raw !== 'object') {
    throw new Error('bad decrypted payload');
  }

  const payload = raw as Partial<ISignRefreshPayload>;
  const sign_key_hex = String(payload.sign_key_hex ?? '').trim();
  if (sign_key_hex === '') {
    throw new Error('empty sign_key_hex');
  }

  return { sign_key_hex };
};

/**
 * 函数：运行端到端签名复现（Nuxt dev 代理 + Rust 验签）。
 *
 * 该脚本用于把“签名不匹配”问题收敛为可复现的证据链。
 *
 * # Returns
 *
 * 返回执行结果。
 */
const run = async (): Promise<ISignReproResult> => {
  const api_origin = String(process.env.LOFITICK_API_ORIGIN ?? 'http://localhost:3000').trim();

  const backend_path = '/settings/unattended/scenes';
  const machine_code = String(process.env.LOFITICK_MACHINE_CODE ?? 'c4befacf52fec9c1d60f3796').trim();

  // 1) sign/init -> Set-Cookie: sign_refresh
  const init_res = await fetch(`${api_origin}/api/security/sign/init`, {
    headers: {
      'x-sign-blob-cookie-name': 'sign_refresh'
    }
  });

  const set_cookie_lines = response_get_set_cookie_lines(init_res);
  const sign_cookie_line = set_cookie_lines.find((x) => x.toLowerCase().startsWith('sign_refresh='));
  if (sign_cookie_line === undefined) {
    throw new Error('no sign_refresh set-cookie');
  }

  const cookie_pair = sign_cookie_line.split(';', 1)[0] ?? '';
  const blob = cookie_pair.split('=', 2)[1]?.trim() ?? '';
  if (blob === '') {
    throw new Error('empty sign_refresh');
  }

  // 2) decrypt blob -> sign_key_hex
  const seed_env = String(process.env.NUXT_PUBLIC_SIGN_AES_SEED ?? process.env.SECURITY_SIGN_AES_SEED ?? '').trim();
  const seed = seed_env !== '' ? seed_env : read_seed_from_env_file();
  if (seed.trim() === '') {
    throw new Error('missing aes seed');
  }

  const payload = sign_refresh_decrypt(blob, seed);

  // 3) build request params (must carry ts/nonce/sign; but sig excludes nonce/sign)
  const ts = String(Date.now());
  const fake_nonce = random_hex_lower(FAKE_NONCE_LEN);
  const fake_sign = random_hex_lower(FAKE_SIGN_LEN);

  // 4) compute sig (canonical params excludes nonce/sign)
  const content = `${backend_path}?machinecode=${encodeURIComponent(machine_code)}&ts=${encodeURIComponent(ts)}`;
  const hash_content_hex = sha256_hex(content);
  const sig = hmac_sha256_base64(payload.sign_key_hex, hash_content_hex);

  // 5) call scenes via proxy
  const qs = new URLSearchParams({
    machineCode: machine_code,
    ts,
    nonce: fake_nonce,
    sign: fake_sign
  }).toString();

  const scenes_url = `${api_origin}/api/desktop${backend_path}?${qs}`;
  const scenes_res = await fetch(scenes_url, {
    headers: {
      'Soc-Fetch-Platform': `browser; sig=${sig}`
    }
  });

  const body_text = await scenes_res.text();
  let body: unknown;
  try {
    body = JSON.parse(body_text) as unknown;
  } catch {
    body = body_text;
  }

  return {
    init_window_num: Number(blob.split('.')[1] ?? NaN),
    derived_key_hash: sha256_hex(payload.sign_key_hex),
    scenes_url,
    http: scenes_res.status,
    body
  };
};

try {
  const result = await run();
  // 输出仅用于对账，不包含 seed/key/cookie 明文。
  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  const msg = e instanceof Error ? (e.stack ?? e.message) : String(e);
  // 错误输出同样避免泄露敏感信息。
  console.error(msg);
  process.exitCode = 1;
}
