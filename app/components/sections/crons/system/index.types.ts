/**
 * 接口：系统任务表格行。
 */
export interface ISystemTaskRow {
  /**
   * 属性：唯一键。
   */
  key: string;

  /**
   * 属性：任务标题。
   */
  title: string;

  /**
   * 属性：任务描述。
   */
  description: string;

  /**
   * 属性：主调度表达。
   */
  schedulePrimary: string;

  /**
   * 属性：辅助调度表达。
   */
  scheduleSecondary?: string | null;

  /**
   * 属性：任务分组标签。
   */
  groupLabel: string;
}
