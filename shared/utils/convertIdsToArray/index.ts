/**
 * 函数：将单个数字 ID 或数字 ID 数组转换为数字数组
 * @param {number | number[] | undefined} ids 单个数字 ID 或数字 ID 数组
 * @returns {number[]} 数字数组
 */
export const convertIdsToArray = (ids?: number | number[]): number[] => (typeof ids === 'number' ? [ids] : Array.isArray(ids) ? ids : []);
