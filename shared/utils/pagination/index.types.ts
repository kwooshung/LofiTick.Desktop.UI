/**
 * 接口：分页配置
 */
export interface ISqlOptionsPagination {
  /**
   * page 相关配置
   */
  page?: {
    /**
     * 默认页码（通常 1）
     */
    default?: number;

    /**
     * 最大允许页码（不传则无上限）
     */
    max?: number;
  };

  /**
   * size（每页条数）相关配置
   */
  size?: {
    /**
     * 默认每页条数（通常 20）
     */
    default?: number;

    /**
     * 最小每页条数（通常 1）
     */
    min?: number;

    /**
     * 最大每页条数（通常 100）
     */
    max?: number;
  };
}

export interface ISqlResultPagination {
  /**
   * 当前页码
   */
  page: number;

  /**
   * 每页条数
   */
  limit: number;

  /**
   * 偏移量
   */
  offset: number;
}
