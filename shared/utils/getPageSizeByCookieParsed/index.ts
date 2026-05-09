/**
 * 常量：Cookie 键名
 */
export const COOKIE_KEY_PAGESIZES = 'pagesizes';

/**
 * 函数：解析Cookie并获取分页大小
 * @param {Record<string, unknown>} [values={}] 键值映射表，已经从cookie中取出用来解析的
 * @param {string} key 键名
 * @returns {number} 分页大小
 */
export const getPageSizeByCookieParsed = (values: Record<string, unknown> = {}, key: string): number => {
  // 提取对应键名的值
  let val = values[key];

  // 解析为正整数
  let num = typeof val === 'number' ? val : parseInt(String(val), 10);

  // 返回有效值
  if (Number.isFinite(num) && num > 0) {
    return num;
  }

  // 尝试使用通用键名 'common'
  val = values['common'];

  // 解析为正整数
  num = typeof val === 'number' ? val : parseInt(String(val), 10);

  // 返回有效值
  if (Number.isFinite(num) && num > 0) {
    return num;
  }

  // 默认值
  return 20;
};
