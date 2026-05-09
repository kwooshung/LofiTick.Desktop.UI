/**
 * 接口：PageSizes 选择器组件 Props
 */
export interface ISelectPagesizesProps {
  /**
   * 属性：尺寸
   * 描述：分页尺寸候选列表
   */
  sizes?: number[];

  /**
   * 属性：缓存键（命名空间）
   * 描述：用于区分不同模块的 pagesize 缓存
   */
  cacheKey?: string;
}
