import { invoke } from '@tauri-apps/api/core';

/**
 * Hook：Tauri 任务能力
 * 描述：封装桌面壳 tasks 模块暴露的只读计划命令。
 * @returns {object} 任务能力方法
 */
export const useTauriTasks = () => {
  /**
   * Hook：Tauri 环境
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：读取热搜窗口计划快照
   * @returns {Promise<ITauriHotsearchScheduleSnapshot>} 当前热搜计划
   */
  const hotsearchScheduleGet = async (): Promise<ITauriHotsearchScheduleSnapshot> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ITauriHotsearchScheduleSnapshot>('hotsearch_schedule_get');
  };

  return { hotsearchScheduleGet };
};