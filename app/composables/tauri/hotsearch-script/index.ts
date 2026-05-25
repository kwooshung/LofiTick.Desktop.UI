import { invoke } from '@tauri-apps/api/core';

import type { IPageHomePodcastScriptGenerateRequest, IPageHomePodcastScriptGenerateResponse } from '@@/shared/types/index.types';

/**
 * Hook：热搜播客脚本。
 * 描述：封装 Desktop 壳侧的热搜播客脚本构建命令。
 * @returns {object} 热搜播客脚本方法。
 */
export const useTauriHotsearchScript = () => {
  /**
   * Hook：Tauri 环境。
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：构建热搜播客脚本。
   * @param {IPageHomePodcastScriptGenerateRequest} payload 构建参数。
   * @returns {Promise<IPageHomePodcastScriptGenerateResponse>} 构建结果。
   */
  const build = async (payload: IPageHomePodcastScriptGenerateRequest): Promise<IPageHomePodcastScriptGenerateResponse> => {
    if (!isTauriRuntime.value) {
      throw new Error('hotsearch podcast script build only supports tauri runtime');
    }

    return invoke<IPageHomePodcastScriptGenerateResponse>('hotsearch_podcast_script_build', { payload });
  };

  return { build };
};
