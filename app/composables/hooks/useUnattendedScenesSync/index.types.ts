/**
 * 类型：场景同步用户选择。
 */
export type TUnattendedScenesSyncChoice = 'local' | 'remote' | 'merge';

/**
 * 类型：场景同步状态。
 */
export type TUnattendedScenesSyncStatus = 'local-only' | 'remote-only' | 'same' | 'conflict';

/**
 * 接口：场景同步对比条目。
 */
export interface IUnattendedScenesSyncEntry {
  /** 场景 ID。 */
  sceneId: string;

  /** 展示名称。 */
  sceneName: string;

  /** 差异状态。 */
  status: TUnattendedScenesSyncStatus;

  /** 本地版本。 */
  local?: IPageSettingsUnattendedScenesItem;

  /** 远程版本。 */
  remote?: IPageSettingsUnattendedScenesItem;

  /** 本地路径是否存在。 */
  localExecExists?: boolean;

  /** 远程路径是否存在。 */
  remoteExecExists?: boolean;
}

/**
 * 接口：场景同步弹窗载荷。
 */
export interface IUnattendedScenesSyncPayload {
  /** 机器码。 */
  machineCode: string;

  /** 机器名称。 */
  machineName: string;

  /** 本地场景副本。 */
  local: ISettingsUnattendedScenesLocal;

  /** 远程场景配置。 */
  remote: IPageSettingsUnattendedScenesMachineRedisConfig | null;

  /** 对比条目。 */
  entries: IUnattendedScenesSyncEntry[];
}

/**
 * 接口：场景同步条目构建参数。
 */
export interface IUnattendedScenesSyncEntriesBuildArgs {
  /** 本地场景副本。 */
  local: ISettingsUnattendedScenesLocal;

  /** 远程场景配置。 */
  remote: IPageSettingsUnattendedScenesMachineRedisConfig | null;

  /** 路径存在性映射。 */
  execExistsByPath: Record<string, boolean>;
}
