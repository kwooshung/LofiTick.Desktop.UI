/**
 * 类型：无人值守启动行为
 */
export type TUnattendedStartBehavior = 'normal' | 'minimize' | 'minimize-to-tray';

/**
 * 接口：无人值守-哨兵请求配置
 */
export interface ISettingsUnattendedSentinelRequest {
  /**
   * 请求地址
   */
  url: string;
}

/**
 * 接口：无人值守-心跳配置
 */
export interface ISettingsUnattendedHeartbeat {
  /**
   * 心跳间隔（单位：秒）
   */
  interval: number;

  /**
   * 连续超时次数阈值
   */
  timeoutCount: number;
}

/**
 * 接口：无人值守-重启突发窗口配置
 */
export interface ISettingsUnattendedRestartBurst {
  /**
   * 窗口期（单位：秒）
   */
  window: number;

  /**
   * 冷却期（单位：秒）
   */
  cooldown: number;

  /**
   * 最大尝试次数
   */
  maxAttempts: number;
}

/**
 * 接口：无人值守-重启配置
 */
export interface ISettingsUnattendedRestart {
  /**
   * 重启延迟（单位：秒）
   */
  delay: number;

  /**
   * 重启冷却（单位：秒）
   */
  cooldown: number;

  /**
   * 最大尝试次数
   */
  maxAttempts: number;

  /**
   * 突发窗口配置
   */
  burst: ISettingsUnattendedRestartBurst;
}

/**
 * 接口：无人值守-哨兵配置
 */
export interface ISettingsUnattendedSentinel {
  /**
   * 请求配置
   */
  request: ISettingsUnattendedSentinelRequest;

  /**
   * 心跳配置
   */
  heartbeat: ISettingsUnattendedHeartbeat;

  /**
   * 重启配置
   */
  restart: ISettingsUnattendedRestart;
}

/**
 * 接口：无人值守-启动配置
 */
export interface ISettingsUnattendedStart {
  /**
   * 是否开机自启
   */
  up: boolean;

  /**
   * 启动行为
   */
  behaviors: TUnattendedStartBehavior;
}

/**
 * 接口：无人值守配置
 */
export interface ISettingsUnattended {
  /**
   * 是否启用
   */
  enabled: boolean;

  /**
   * 启动配置
   */
  start: ISettingsUnattendedStart;

  /**
   * 哨兵配置
   */
  sentinel: ISettingsUnattendedSentinel;
}

/**
 * 接口：无人值守-本机网络接口信息
 */
export interface IPageSettingsUnattendedMachineNetworkInterface {
  /**
   * 网卡名称
   */
  name: string;

  /**
   * IP 列表
   */
  ips: string[];
}

/**
 * 接口：无人值守-本机网络快照
 */
export interface IPageSettingsUnattendedMachineNetworkSnapshot {
  /**
   * 网卡列表
   */
  interfaces: IPageSettingsUnattendedMachineNetworkInterface[];
}

/**
 * 接口：无人值守-机器网络分组
 */
export interface IPageSettingsUnattendedMachineNetworkGroup {
  /**
   * 分组名称
   */
  name: string;

  /**
   * IPv4 列表
   */
  ipv4: string[];

  /**
   * IPv6 列表
   */
  ipv6: string[];
}

/**
 * 接口：无人值守-机器网络分组集合
 */
export interface IPageSettingsUnattendedMachineNetworkGroups {
  /**
   * 分组列表
   */
  groups: IPageSettingsUnattendedMachineNetworkGroup[];
}

/**
 * 类型：无人值守-机器网络信息
 */
export type TPageSettingsUnattendedMachineNetwork = IPageSettingsUnattendedMachineNetworkSnapshot | IPageSettingsUnattendedMachineNetworkGroups;

/**
 * 接口：无人值守-场景条目
 */
export interface IPageSettingsUnattendedScenesItem {
  /**
   * 场景 ID
   */
  id: string;

  /**
   * 场景名称
   */
  sceneName: string;

  /**
   * 可执行文件路径
   */
  execPath: string;

  /**
   * 参数列表
   */
  args: string[];

  /**
   * 是否启用
   */
  enabled: boolean;
}

/**
 * 接口：无人值守-按机器存储的场景配置
 */
export interface IPageSettingsUnattendedScenesMachineRedisConfig {
  /**
   * 机器名称
   */
  machineName: string;

  /**
   * 机器 UUID
   */
  machineUuid: string;

  /**
   * 机器码
   */
  machineCode: string;

  /**
   * 网络信息
   */
  network?: TPageSettingsUnattendedMachineNetwork | null;

  /**
   * 场景列表
   */
  items: IPageSettingsUnattendedScenesItem[];
}
