import { invoke } from '@tauri-apps/api/core';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

/**
 * 常量：播客任务事件名列表。
 */
const PODCAST_TASK_EVENTS = [
  'podcast://task-started',
  'podcast://connection-started',
  'podcast://session-started',
  'podcast://round-started',
  'podcast://audio-chunk',
  'podcast://round-finished',
  'podcast://usage',
  'podcast://task-finished',
  'podcast://task-failed',
  'podcast://task-canceled'
] as const;

/**
 * Hook：Tauri 播客任务。
 * 描述：封装桌面壳播客任务快照查询与事件监听能力。
 * @returns {object} 播客任务方法。
 */
export const useTauriPodcast = () => {
  /**
   * Hook：Tauri 环境。
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：读取单个播客任务快照。
   * @param {string} taskId 任务 ID。
   * @returns {Promise<ITauriPodcastTaskSnapshot>} 任务快照。
   */
  const taskGet = async (taskId: string): Promise<ITauriPodcastTaskSnapshot> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ITauriPodcastTaskSnapshot>('podcast_task_get', { taskId });
  };

  /**
   * 函数：监听播客任务事件。
   * @param {(payload: ITauriPodcastTaskEvent) => void} handler 事件回调。
   * @returns {Promise<UnlistenFn>} 取消监听函数。
   */
  const onTaskEvent = async (handler: (payload: ITauriPodcastTaskEvent) => void): Promise<UnlistenFn> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    /**
     * 常量：unlistens。
     */
    const unlistens = await Promise.all(
      PODCAST_TASK_EVENTS.map(async (eventName) => {
        return listen<ITauriPodcastTaskEvent>(eventName, (event) => {
          handler(event.payload);
        });
      })
    );

    return () => {
      for (const unlisten of unlistens) {
        unlisten();
      }
    };
  };

  return { taskGet, onTaskEvent };
};
