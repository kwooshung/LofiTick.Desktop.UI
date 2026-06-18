/**
 * 类型：机器网卡弹窗页签。
 */
export type TSettingsUnattendedMachineNetworkDialogTab = 'ipv4' | 'ipv6';

/**
 * 接口：机器网卡弹窗属性。
 */
export interface ISettingsUnattendedMachineNetworkDialogProps {
  /**
   * 属性：当前机器信息。
   */
  machine: IPageSettingsUnattendedMachineCardInfo | null;
}
