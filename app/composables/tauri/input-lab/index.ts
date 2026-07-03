import { invoke } from '@tauri-apps/api/core';

import type { IInputLabExecuteRequest, IInputLabExecuteResponse } from '@@/shared/types/tauri/input-lab/index.types';

/**
 * Hook：Tauri 键鼠实验台。
 * 描述：封装桌面壳侧键鼠自动化实验命令。
 * @returns {object} 键鼠实验台方法。
 */
export const useTauriInputLab = () => {
  /**
   * Hook：Tauri 环境。
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：执行键鼠实验动作。
   * @param {IInputLabExecuteRequest} request 实验执行请求。
   * @returns {Promise<IInputLabExecuteResponse>} 实验执行结果。
   */
  const execute = async (request: IInputLabExecuteRequest): Promise<IInputLabExecuteResponse> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<IInputLabExecuteResponse>('crawler_input_lab_execute', { request });
  };

  return { execute };
};
