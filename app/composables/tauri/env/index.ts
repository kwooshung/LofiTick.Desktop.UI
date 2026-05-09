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
    if (!import.meta.client) {
      return false;
    }

    try {
      if (isTauri()) {
        return true;
      }
    } catch {
      // ignore
    }

    // 兜底：部分环境下 isTauri() 可能误判，这里用全局注入的标记判断。
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    return Boolean(w?.__TAURI_INTERNALS__);
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
