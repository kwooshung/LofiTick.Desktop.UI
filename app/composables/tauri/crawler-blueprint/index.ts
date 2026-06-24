import { invoke } from '@tauri-apps/api/core';

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

  return { execute };
};
