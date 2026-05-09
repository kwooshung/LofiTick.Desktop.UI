/**
 * 类型：阻止休眠模式
 */
import { invoke } from '@tauri-apps/api/core';

export type TPowerBlockMode = 'never' | 'always' | 'crawling' | 'playing';

/**
 * 接口：电源策略快照
 */
export interface IPowerSnapshot {
  /**
   * 策略
   */
  policy: {
    /**
     * 系统策略
     */
    system: TPowerBlockMode;

    /**
     * 显示器策略
     */
    display: TPowerBlockMode;
  };

  /**
   * 运行态阻止状态
   */
  active: {
    /**
     * 系统阻止是否生效
     */
    system: boolean;

    /**
     * 显示器阻止是否生效
     */
    display: boolean;
  };
}

/**
 * Hook：Tauri 电源策略
 * 描述：封装 Desktop 壳侧的 power_* 命令。
 * @returns {object} 电源方法
 */
export const useTauriPower = () => {
  /**
   * 函数：获取电源快照
   * @returns {Promise<IPowerSnapshot>} 快照
   */
  const get = async (): Promise<IPowerSnapshot> => {
    return invoke<IPowerSnapshot>('power_get');
  };

  /**
   * 函数：运行态阻止系统休眠
   * @param {boolean} on 是否开启
   * @returns {Promise<void>} 无返回值
   */
  const blockSystem = async (on: boolean): Promise<void> => {
    await invoke('power_block_system', { on });
  };

  /**
   * 函数：运行态阻止显示器休眠
   * @param {boolean} on 是否开启
   * @returns {Promise<void>} 无返回值
   */
  const blockDisplay = async (on: boolean): Promise<void> => {
    await invoke('power_block_display', { on });
  };

  /**
   * 函数：设置策略
   * @param {{ system: TPowerBlockMode; display: TPowerBlockMode }} policy 策略
   * @returns {Promise<void>} 无返回值
   */
  const setPolicy = async (policy: { system: TPowerBlockMode; display: TPowerBlockMode }): Promise<void> => {
    await invoke('power_set_policy', { policy });
  };

  return { get, blockSystem, blockDisplay, setPolicy };
};
