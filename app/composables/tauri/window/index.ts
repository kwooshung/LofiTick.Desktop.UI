import { invoke } from '@tauri-apps/api/core';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

/**
 * 常量：窗口状态变化事件名
 */
const EVENT_WINDOW_STATE_CHANGE = 'window_state_change';

/**
 * Hook：Tauri 窗口能力
 * 描述：统一封装 Desktop 壳侧暴露的窗口命令与事件。
 * @returns {object} 窗口能力方法
 */
export const useTauriWindow = () => {
  /**
   * 函数：获取窗口状态快照
   * @returns {Promise<IWindowSnapshot>} 状态快照
   */
  const snapshotGet = async (): Promise<IWindowSnapshot> => {
    return invoke<IWindowSnapshot>('window_get_snapshot');
  };

  /**
   * 函数：最小化窗口
   * @returns {Promise<void>} 无返回值
   */
  const minimize = async (): Promise<void> => {
    await invoke('window_minimize');
  };

  /**
   * 函数：切换最大化/恢复
   * @returns {Promise<void>} 无返回值
   */
  const toggleMaximize = async (): Promise<void> => {
    await invoke('window_toggle_maximize');
  };

  /**
   * 函数：切换全屏
   * @returns {Promise<void>} 无返回值
   */
  const toggleFullscreen = async (): Promise<void> => {
    await invoke('window_toggle_fullscreen');
  };

  /**
   * 函数：切换置顶
   * @returns {Promise<void>} 无返回值
   */
  const toggleAlwaysOnTop = async (): Promise<void> => {
    await invoke('window_toggle_always_on_top');
  };

  /**
   * 函数：切换 DevTools
   * @returns {Promise<void>} 无返回值
   */
  const toggleDevtools = async (): Promise<void> => {
    await invoke('window_toggle_devtools');
  };

  /**
   * 函数：请求关闭窗口
   * 描述：该命令会触发壳侧的 preclose 逻辑。
   * @returns {Promise<void>} 无返回值
   */
  const requestClose = async (): Promise<void> => {
    await invoke('window_request_close');
  };

  /**
   * 函数：重启应用
   * @returns {Promise<void>} 无返回值
   */
  const restart = async (): Promise<void> => {
    await invoke('window_restart');
  };

  /**
   * 函数：监听窗口状态变化
   * @param {(snapshot: IWindowSnapshot) => void} handler 事件处理器
   * @returns {Promise<UnlistenFn>} 取消监听函数
   */
  const onWindowStateChange = async (handler: (snapshot: IWindowSnapshot) => void): Promise<UnlistenFn> => {
    return getCurrentWebviewWindow().listen<IWindowSnapshot>(EVENT_WINDOW_STATE_CHANGE, (event) => {
      handler(event.payload);
    });
  };

  /**
   * 函数：打开目录
   * @param {string} path 目录路径
   * @returns {Promise<void>} 无返回值
   */
  const openDirectory = async (path: string): Promise<void> => {
    await invoke('window_open_directory', { path });
  };

  /**
   * 函数：打开应用目录
   * @returns {Promise<void>} 无返回值
   */
  const openAppDirectory = async (): Promise<void> => {
    await invoke('window_open_app_directory');
  };

  /**
   * 函数：打开用户数据目录
   * @returns {Promise<void>} 无返回值
   */
  const openUserDataDirectory = async (): Promise<void> => {
    await invoke('window_open_user_data_directory');
  };

  /**
   * 函数：使用系统默认浏览器打开链接
   * @param {string} url 完整链接地址
   * @returns {Promise<void>} 无返回值
   */
  const openExternalUrl = async (url: string): Promise<void> => {
    await invoke('window_open_external_url', { url });
  };

  /**
   * 函数：打开文件选择对话框
   * @param {IOpenFilePayload} payload 对话框参数
   * @returns {Promise<string | null>} 选择的文件路径
   */
  const openFile = async (payload: IOpenFilePayload): Promise<string | null> => {
    return invoke<string | null>('window_open_file', { payload });
  };

  /**
   * 函数：打开文件选择对话框并读取文件内容
   * @param {IOpenFilePayload} payload 对话框参数
   * @returns {Promise<IOpenFileContentResult | null>} 选择结果
   */
  const openFileContent = async (payload: IOpenFilePayload): Promise<IOpenFileContentResult | null> => {
    return invoke<IOpenFileContentResult | null>('window_open_file_content', { payload });
  };

  return {
    snapshotGet,
    minimize,
    toggleMaximize,
    toggleFullscreen,
    toggleAlwaysOnTop,
    toggleDevtools,
    requestClose,
    restart,
    onWindowStateChange,
    openDirectory,
    openAppDirectory,
    openUserDataDirectory,
    openExternalUrl,
    openFile,
    openFileContent
  };
};
