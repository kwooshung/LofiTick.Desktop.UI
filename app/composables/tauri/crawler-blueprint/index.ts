import { invoke } from '@tauri-apps/api/core';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

/**
 * 常量：爬虫蓝图输出日志事件名。
 */
const CRAWLER_BLUEPRINT_OUTPUT_LOG_EVENT = 'crawler-blueprint://output-log';

/**
 * Hook：Tauri 爬虫蓝图能力。
 * @returns {object} 爬虫蓝图能力方法。
 */
export const useTauriCrawlerBlueprint = () => {
  /**
   * Hook：Tauri 环境。
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：执行爬虫蓝图。
   * @param {ITauriCrawlerBlueprintExecuteRequest} request 执行请求。
   * @returns {Promise<ITauriCrawlerBlueprintExecuteResponse>} 执行响应。
   */
  const execute = async (request: ITauriCrawlerBlueprintExecuteRequest): Promise<ITauriCrawlerBlueprintExecuteResponse> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ITauriCrawlerBlueprintExecuteResponse>('crawler_blueprint_execute', { request });
  };

  /**
   * 函数：监听爬虫蓝图输出日志事件。
   * @param {(payload: ITauriCrawlerBlueprintOutputLogEvent) => void} handler 事件处理器。
   * @returns {Promise<UnlistenFn>} 取消监听函数。
   */
  const onOutputLogEvent = async (handler: (payload: ITauriCrawlerBlueprintOutputLogEvent) => void): Promise<UnlistenFn> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return listen<ITauriCrawlerBlueprintOutputLogEvent>(CRAWLER_BLUEPRINT_OUTPUT_LOG_EVENT, (event) => {
      handler(event.payload);
    });
  };

  return { execute, onOutputLogEvent };
};
