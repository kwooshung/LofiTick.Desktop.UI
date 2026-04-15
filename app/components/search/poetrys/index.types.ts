/**
 * 类型：组件属性（下拉菜单项）
 */
export interface IComponentPropsPoetrysSelectMenuItem {
  /**
   * 名称
   */
  label: string;

  /**
   * 值
   */
  value: number;

  /**
   * 数量
   */
  count: number;
}

/**
 * 类型：组件属性（路由状态）
 */
export interface IComponentPropsPoetrysSearch {
  /**
   * 当前是否为列表页路由
   */
  routeIsList: boolean;

  /**
   * 当前是否为作者页路由
   */
  routeIsAuthors: boolean;

  /**
   * 当前是否为朝代页路由
   */
  routeIsDynasties: boolean;
}

/**
 * 类型：诗词搜索条件载荷
 */
export interface IComponentEmitsPoetrysSearch {
  /**
   * 标题关键词
   */
  title: string;

  /**
   * 内容关键词
   */
  content: string;

  /**
   * 朝代ID列表
   */
  dynastyId: number[];

  /**
   * 作者ID列表
   */
  authorId: number[];

  /**
   * 匹配方式（true=全部满足，false=任一满足）
   */
  isAnd: boolean;
}
