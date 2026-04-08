/**
 * Hook：Tauri 运行环境
 * 描述：统一判断是否运行在 Tauri WebView 内，并提供最小的平台信息。
 * @returns {object} 环境信息
 */
import { isTauri } from '@tauri-apps/api/core';

export const useTauriEnv = () => {
  /**
   * 计算属性：是否运行在 Tauri
   */
  const isTauriRuntime = computed(() => {
    try {
      return Boolean(import.meta.client && isTauri());
    } catch {
      return false;
    }
  });

  /**
   * 计算属性：是否 Windows
   */
  const isWindows = computed(() => {
    if (!import.meta.client) {
      return false;
    }

    const nav = window.navigator as Navigator & { userAgentData?: { platform?: string } };
    const platform = String(nav.userAgentData?.platform || nav.platform || '').toLowerCase();
    return platform.includes('win');
  });

  return { isTauriRuntime, isWindows };
};
