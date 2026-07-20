import { invoke } from '@tauri-apps/api/core';

/**
 * 类型：提醒音类型。
 */
export type TTipSoundKind = 'notification' | 'conn' | 'success' | 'failed' | 'error';

/**
 * Hook：Tauri 提醒音能力。
 * 描述：封装桌面壳侧的通用提醒音播放命令。
 * @returns {object} 提醒音方法。
 */
export const useTauriSound = () => {
  /**
   * 函数：播放提醒音。
   * @param {TTipSoundKind} kind 提醒音类型。
   * @returns {Promise<void>} 无返回值。
   */
  const tipPlay = async (kind: TTipSoundKind): Promise<void> => {
    if (!import.meta.client) {
      return;
    }

    await invoke('sound_tip_play', { kind });
  };

  return { tipPlay };
};
