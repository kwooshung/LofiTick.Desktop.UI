/**
 * 函数：生成纯小写数字字母的固定长度 ID。
 *
 * 该实现与后端 Rust 的 base36 规则保持一致：随机字节视为大端无符号整数，
 * 转为 base36 后执行 `padStart(length, '0')` 与 `slice(-length)`。
 *
 * @param {number} length 期望输出长度。
 * @returns {string} 固定长度的 base36 小写字符串。
 */
export const generateIdBase36 = (length: number): string => {
  const size = Number(length);

  if (!Number.isFinite(size) || size <= 0) {
    return '';
  }

  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) {
    throw new Error('crypto.getRandomValues missing');
  }

  const byteLength = Math.ceil((size * 6) / 8);
  const bytes = new Uint8Array(byteLength);
  cryptoApi.getRandomValues(bytes);

  let value = 0n;
  for (const byte of bytes) {
    value = (value << 8n) | BigInt(byte);
  }

  const raw = value.toString(36);

  return raw.padStart(size, '0').slice(-size);
};
