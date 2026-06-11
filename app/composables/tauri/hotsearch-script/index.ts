import { invoke } from '@tauri-apps/api/core';

import type { IPageHomePodcastScriptGenerateRequest, IPageHomePodcastScriptGenerateResponse, ITauriPodcastGenerateAccepted } from '@@/shared/types/index.types';

/**
 * Hook：热搜播客脚本。
 * 描述：封装 Desktop 壳侧的热搜播客脚本构建命令。
 * @returns {object} 热搜播客脚本方法。
 */
export const useTauriHotsearchScript = (): object => {
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

  /**
   * 函数：根据当前脚本结果生成真实播客音频。
   * @param {IPageHomePodcastScriptGenerateResponse} payload 当前脚本结果。
   * @returns {Promise<ITauriPodcastGenerateAccepted>} 任务受理结果。
   */
  const generate = async (payload: IPageHomePodcastScriptGenerateResponse): Promise<ITauriPodcastGenerateAccepted> => {
    if (!isTauriRuntime.value) {
      throw new Error('hotsearch podcast audio generate only supports tauri runtime');
    }

    return invoke<ITauriPodcastGenerateAccepted>('hotsearch_podcast_generate', { payload });
  };

  return { build, generate };
};
