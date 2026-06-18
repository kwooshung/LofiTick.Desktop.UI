/**
 * 接口：哨兵日志卡片组件属性。
 */
export interface ISettingsUnattendedSentinelLogsCardsProps {
  /**
   * 属性：机器日志列表。
   */
  machines: IPageSettingsUnattendedSentinelLogsMachineCard[];

  /**
   * 属性：本机机器码。
   */
  localMachineCode: string;
}
