import type { ISqlOptionsPagination, ISqlResultPagination } from '@@/shared/utils/pagination/index.types';

/**
 * 函数：计算分页参数
 * @param {number | string | null} page 页码
 * @param {number | string | null} size 每页条数
 * @param {ISqlOptionsPagination} [options] 配置
 * @returns {ISqlResultPagination} 计算后的分页参数
 */
export const calcPagination = (page?: number | string | null, size?: number | string | null, options?: ISqlOptionsPagination): ISqlResultPagination => {
  // 默认值（全写死在这里，清晰）
  const DEFAULT_PAGE = 1;
  /**
   * 常量：DEFAULT_SIZE。
   */
  const DEFAULT_SIZE = 20;
  /**
   * 常量：MIN_SIZE。
   */
  const MIN_SIZE = 1;
  /**
   * 常量：MAX_SIZE。
   */
  const MAX_SIZE = 100;

  // 合并配置（不传就用默认）
  const pageConfig = options?.page ?? {};
  /**
   * 常量：sizeConfig。
   */
  const sizeConfig = options?.size ?? {};

  // page 计算（最小 1，无上限除非指定）
  let p = Math.max(DEFAULT_PAGE, Math.floor(Number(page) || DEFAULT_PAGE));
  if (pageConfig.max !== undefined) {
    p = Math.min(pageConfig.max, p);
  }

  // size 计算（每页条数）
  const rawSize = Number(size);
  /**
   * 常量：s。
   */
  let s = sizeConfig.default ?? DEFAULT_SIZE;
  if (!Number.isNaN(rawSize)) {
    s = Math.max(sizeConfig.min ?? MIN_SIZE, Math.min(sizeConfig.max ?? MAX_SIZE, rawSize));
  }

  // offset
  const offset = Math.max(0, (p - 1) * s);

  return { page: p, limit: s, offset };
};
