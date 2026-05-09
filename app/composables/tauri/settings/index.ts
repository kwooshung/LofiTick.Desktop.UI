import { invoke } from '@tauri-apps/api/core';

/**
 * Hook：Tauri 设置
 * 描述：封装 Desktop 壳侧的 settings_get/settings_update。
 * @returns {object} 设置方法
 */

/**
 * 接口：本地路径存在性检查结果
 */
interface ITauriSettingsPathExistsItem {
  /**
   * 路径
   */
  path: string;

  /**
   * 是否存在
   */
  exists: boolean;
}

/**
 * 接口：场景受管副本结果
 */
interface ITauriManagedSceneExeResult {
  /**
   * 原始可执行文件路径
   */
  sourceExecPath: string;

  /**
   * 受管副本运行路径
   */
  execPath: string;
}

export const useTauriSettings = () => {
  /**
   * 函数：获取完整设置
   * @returns {Promise<Record<string, unknown>>} 设置 JSON
   */
  const get = async (): Promise<Record<string, unknown>> => {
    const v = await invoke<unknown>('settings_get');
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }

    return {};
  };

  /**
   * 函数：更新设置（深合并）
   * @param {Record<string, unknown>} patch 部分更新补丁
   * @returns {Promise<Record<string, unknown>>} 更新后的完整设置
   */
  const update = async (patch: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const v = await invoke<unknown>('settings_update', { patch });
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }

    return {};
  };

  /**
   * 函数：选择并设置数据存放目录（attachmentsDir）
   * @param {string} title 对话框标题
   * @param {string} current 当前目录
   * @returns {Promise<string | null>} 选择结果
   */
  const setAttachmentsDir = async (title: string, current: string): Promise<string | null> => {
    return invoke<string | null>('settings_set_attachments_dir', { title, current });
  };

  /**
   * 函数：获取本机网络快照
   * @returns {Promise<{ interfaces: Array<{ name: string; ips: string[] }> }>} 网络信息
   */
  const machineNetworkGet = async (): Promise<{ interfaces: Array<{ name: string; ips: string[] }> }> => {
    return invoke<{ interfaces: Array<{ name: string; ips: string[] }> }>('settings_machine_network_get');
  };

  /**
   * 函数：获取本机默认计算机名称
   * @returns {Promise<string>} 计算机名称（失败或不可用时为空字符串）
   */
  const machineHostnameGet = async (): Promise<string> => {
    return invoke<string>('settings_machine_hostname_get');
  };

  /**
   * 函数：批量检查本地路径是否存在
   * @param {string[]} paths 路径列表
   * @returns {Promise<ITauriSettingsPathExistsItem[]>} 检查结果
   */
  const pathsExistGet = async (paths: string[]): Promise<ITauriSettingsPathExistsItem[]> => {
    return invoke<ITauriSettingsPathExistsItem[]>('settings_paths_exist', { paths });
  };

  /**
   * 函数：创建或修复场景受管副本 exe
   * @param {string} sceneId 场景 ID
   * @param {string} sceneName 场景名称
   * @param {string} sourceExecPath 原始 exe 路径
   * @returns {Promise<ITauriManagedSceneExeResult>} 原始路径与受管副本路径
   */
  const sceneManagedExeMaterialize = async (sceneId: string, sceneName: string, sourceExecPath: string): Promise<ITauriManagedSceneExeResult> => {
    return invoke<ITauriManagedSceneExeResult>('settings_scene_managed_exe_materialize', { sceneId, sceneName, sourceExecPath });
  };

  /**
   * 函数：删除场景受管副本 exe
   * @param {string} execPath 受管副本路径
   * @param {string} sourceExecPath 原始 exe 路径
   * @returns {Promise<void>} 无返回值
   */
  const sceneManagedExeRemove = async (execPath: string, sourceExecPath: string): Promise<void> => {
    await invoke('settings_scene_managed_exe_remove', { execPath, sourceExecPath });
  };

  /**
   * 函数：获取 UE5 本地接入地址
   * @returns {Promise<string>} UE5 接入地址
   */
  const ue5BridgeAccessUrlGet = async (): Promise<string> => {
    return invoke<string>('ue5_bridge_access_url_get');
  };

  /**
   * 函数：获取 UE5 本地接入详情
   * @returns {Promise<IPageSettingsUnattendedUe5BridgeDetail>} UE5 接入详情
   */
  const ue5BridgeAccessDetailGet = async (): Promise<IPageSettingsUnattendedUe5BridgeDetail> => {
    return invoke<IPageSettingsUnattendedUe5BridgeDetail>('ue5_bridge_access_detail_get');
  };

  return { get, update, setAttachmentsDir, machineNetworkGet, machineHostnameGet, pathsExistGet, sceneManagedExeMaterialize, sceneManagedExeRemove, ue5BridgeAccessUrlGet, ue5BridgeAccessDetailGet };
};
