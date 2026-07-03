import { invoke } from '@tauri-apps/api/core';

import type { IInputLabExecuteRequest, IInputLabExecuteResponse, IInputPathRecordStartRequest, IInputPathRecordStartResponse, IInputPathRecordStopResponse } from '@@/shared/types/tauri/input-lab/index.types';

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

  /**
   * 函数：开始录制鼠标路径。
   * @param {IInputPathRecordStartRequest} request 录制启动请求。
   * @returns {Promise<IInputPathRecordStartResponse>} 录制启动结果。
   */
  const recordStart = async (request: IInputPathRecordStartRequest): Promise<IInputPathRecordStartResponse> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<IInputPathRecordStartResponse>('crawler_input_path_record_start', { request });
  };

  /**
   * 函数：停止录制鼠标路径。
   * @returns {Promise<IInputPathRecordStopResponse>} 录制停止结果。
   */
  const recordStop = async (): Promise<IInputPathRecordStopResponse> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<IInputPathRecordStopResponse>('crawler_input_path_record_stop');
  };

  return { execute, recordStart, recordStop };
};
