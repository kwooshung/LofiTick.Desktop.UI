/**
 * 接口：场景卡片列表组件属性。
 */
export interface ISettingsUnattendedScenesCardsProps {
  /**
   * 属性：机器场景配置列表。
   */
  machines: IPageSettingsUnattendedScenesMachineRedisConfig[];

  /**
   * 属性：机器日志列表。
   */
  logsMachines: IPageSettingsUnattendedSentinelLogsMachineCard[];

  /**
   * 属性：本机机器码。
   */
  localMachineCode: string;
}
