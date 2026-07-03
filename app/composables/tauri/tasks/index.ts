import { invoke } from '@tauri-apps/api/core';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

import type { ICrawlerTaskBrowserSessionEvent, ICrawlerTaskBrowserSessionState, ICrawlerTaskExecuteAccepted, ICrawlerTaskExecuteRequest } from './index.types';

/**
 * 常量：爬虫浏览器会话状态变化事件名。
 */
const EVENT_CRAWLER_BROWSER_SESSION_STATE_CHANGED = 'crawler://browser-session-state-changed';

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
   * 函数：读取爬虫浏览器候选。
   * @returns {Promise<ICrawlerBrowserCandidate[]>} 浏览器候选列表。
   */
  const crawlerBrowserCandidatesGet = async (): Promise<ICrawlerBrowserCandidate[]> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ICrawlerBrowserCandidate[]>('crawler_browser_candidates_get');
  };

  /**
   * 函数：关闭爬虫浏览器会话。
   * @param {string} taskId 任务 ID。
   * @returns {Promise<void>} 无返回值。
   */
  const crawlerTaskBrowserSessionClose = async (taskId: string): Promise<void> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    await invoke('crawler_task_browser_session_close', { taskId });
  };

  /**
   * 函数：读取指定任务的浏览器会话状态。
   * @param {string} task 任务键。
   * @returns {Promise<ICrawlerTaskBrowserSessionState | null>} 浏览器会话状态。
   */
  const crawlerTaskBrowserSessionStateGet = async (task: string): Promise<ICrawlerTaskBrowserSessionState | null> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ICrawlerTaskBrowserSessionState | null>('crawler_task_browser_session_state_get', { task });
  };

  /**
   * 函数：监听爬虫浏览器会话状态变化事件。
   * @param {(state: ICrawlerTaskBrowserSessionEvent) => void} handler 事件回调。
   * @returns {Promise<UnlistenFn>} 取消监听函数。
   */
  const onCrawlerBrowserSessionStateChanged = async (handler: (state: ICrawlerTaskBrowserSessionEvent) => void): Promise<UnlistenFn> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return listen<ICrawlerTaskBrowserSessionEvent>(EVENT_CRAWLER_BROWSER_SESSION_STATE_CHANGED, (event) => {
      handler(event.payload);
    });
  };

  return { hotsearchScheduleGet, crawlerBrowserCandidatesGet, crawlerTaskExecute, crawlerTaskBrowserSessionClose, crawlerTaskBrowserSessionStateGet, onCrawlerBrowserSessionStateChanged };
};
