import type { Connection } from '@vue-flow/core';

/**
 * 接口：控制流执行分支。
 */
export interface IControlFlowBranchRailItem {
  /**
   * 属性：分支句柄 ID。
   */
  id: string;

  /**
   * 属性：分支标题。
   */
  label: string;

  /**
   * 属性：分支说明。
   */
  description: string;
}

/**
 * 接口：控制流执行分支校验函数。
 */
export type TControlFlowBranchRailConnectionChecker = (connection: Connection) => boolean;
