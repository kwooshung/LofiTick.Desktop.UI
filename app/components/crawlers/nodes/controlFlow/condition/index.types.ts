/**
 * 类型：条件判断模式。
 */
export type TControlFlowConditionMode = 'boolean' | 'compare';

/**
 * 接口：条件判断执行分支。
 */
export interface IControlFlowConditionBranch {
  /**
   * 属性：分支句柄 ID。
   */
  id: 'true' | 'false';

  /**
   * 属性：分支标题。
   */
  label: string;

  /**
   * 属性：分支描述。
   */
  description: string;
}
