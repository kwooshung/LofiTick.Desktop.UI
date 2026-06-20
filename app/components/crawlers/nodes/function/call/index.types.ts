import type { IVariableDefinitionData } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 接口：函数图最小节点结构。
 */
export interface IFunctionGraphNodeLike {
  /**
   * 属性：节点类型。
   */
  type?: string;

  /**
   * 属性：节点数据。
   */
  data?: unknown;
}

/**
 * 接口：函数详情最小结构。
 */
export interface IFunctionDetailLike {
  /**
   * 属性：函数 ID。
   */
  id?: number;

  /**
   * 属性：函数名称。
   */
  name?: string;

  /**
   * 属性：函数描述。
   */
  description?: string;

  /**
   * 属性：函数作用域。
   */
  scope?: 'site' | 'global';

  /**
   * 属性：站点 ID。
   */
  targetId?: number;

  /**
   * 属性：函数图。
   */
  graph?: unknown;
}

/**
 * 接口：函数引脚提取结果。
 */
export interface IFunctionPinsExtractResult {
  /**
   * 属性：参数列表。
   */
  parameters: IVariableDefinitionData[];

  /**
   * 属性：返回值列表。
   */
  returns: IVariableDefinitionData[];
}
