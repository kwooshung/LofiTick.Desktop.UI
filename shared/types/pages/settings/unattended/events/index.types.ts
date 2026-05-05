/**
 * 类型：settings / unattended 组件事件契约。
 *
 * 该文件承载 settings/unattended 组件之间通过 emits 传递的 payload，
 * 用于统一页面层与组件层的事件输入输出语义。
 */

/**
 * 接口：无人值守-场景组件切换启用事件参数
 */
export interface IPageSettingsUnattendedScenesToggleEnabledPayload {
  /**
   * 场景 ID
   */
  id: string;

  /**
   * 是否启用
   */
  enabled: boolean;
}

/**
 * 接口：无人值守-场景组件更新机器备注事件参数
 */
export interface IPageSettingsUnattendedScenesUpdateMachineRemarkPayload {
  /**
   * 机器名称
   */
  machineName: string;

  /**
   * 机器码
   */
  machineCode: string;

  /**
   * 机器备注
   */
  machineRemark: string;
}

/**
 * 接口：无人值守-场景组件删除机器事件参数
 */
export interface IPageSettingsUnattendedScenesDeleteMachinePayload {
  /**
   * 机器名称
   */
  machineName: string;

  /**
   * 机器码
   */
  machineCode: string;
}
