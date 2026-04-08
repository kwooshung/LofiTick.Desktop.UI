/**
 * Hook：Tauri 设置
 * 描述：封装 Desktop 壳侧的 settings_get/settings_update。
 * @returns {object} 设置方法
 */
import { invoke } from '@tauri-apps/api/core';

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

  return { get, update, setAttachmentsDir, machineNetworkGet };
};
