/**
 * Store：应用信息（版本/平台/env）
 * 说明：Tauri 桌面端通过 @tauri-apps/api 获取，Web 端使用默认值
 * TODO: 接入 Tauri invoke API
 */
export const useStoreAppInfo = defineStore('appinfo', () => {
  /**
   * 状态：应用信息
   */
  const states = ref({
    isDev: import.meta.dev ?? false,
    name: '',
    version: '',
    platform: {
      name: '',
      isMac: false,
      isWindows: false,
      isLinux: false
    }
  });

  return { states };
});
