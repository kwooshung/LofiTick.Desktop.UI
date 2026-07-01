import { invoke } from '@tauri-apps/api/core';

import type { ICrawlerTaskExecuteAccepted, ICrawlerTaskExecuteRequest, ICrawlerTaskWebviewState } from './index.types';

/**
 * Hook：Tauri 任务能力
 * 描述：封装桌面壳 tasks 模块暴露的计划与爬虫命令。
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

  /**
   * 函数：受理爬虫任务。
   * @param {ICrawlerTaskExecuteRequest} request 爬虫任务请求。
   * @returns {Promise<ICrawlerTaskExecuteAccepted>} 受理结果。
   */
  const crawlerTaskExecute = async (request: ICrawlerTaskExecuteRequest): Promise<ICrawlerTaskExecuteAccepted> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ICrawlerTaskExecuteAccepted>('crawler_task_execute', { request });
  };

  /**
   * 函数：显示爬虫 WebView。
   * @param {string} taskId 任务 ID。
   * @returns {Promise<void>} 无返回值。
   */
  const crawlerTaskWebviewShow = async (taskId: string): Promise<void> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    await invoke('crawler_task_webview_show', { taskId });
  };

  /**
   * 函数：隐藏爬虫 WebView。
   * @param {string} taskId 任务 ID。
   * @returns {Promise<void>} 无返回值。
   */
  const crawlerTaskWebviewHide = async (taskId: string): Promise<void> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    await invoke('crawler_task_webview_hide', { taskId });
  };

  /**
   * 函数：读取指定任务的 WebView 状态。
   * @param {string} task 任务键。
   * @returns {Promise<ICrawlerTaskWebviewState | null>} WebView 状态。
   */
  const crawlerTaskWebviewStateGet = async (task: string): Promise<ICrawlerTaskWebviewState | null> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ICrawlerTaskWebviewState | null>('crawler_task_webview_state_get', { task });
  };

  return { hotsearchScheduleGet, crawlerTaskExecute, crawlerTaskWebviewShow, crawlerTaskWebviewHide, crawlerTaskWebviewStateGet };
};
