import { invoke } from '@tauri-apps/api/core';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

/**
 * 常量：哨兵状态事件名
 */
const EVENT_SENTINEL_EVENT = 'sentinel_event';

/**
 * 接口：哨兵状态附加信息
 */
export interface ISentinelStatusAttach {
  /**
   * 当前机器码
   */
  machineCode: string;

  /**
   * 已启用场景数量
   */
  enabledSceneCount: number;

  /**
   * 在线窗口秒数
   */
  onlineWindowSeconds: number;

  /**
   * 最后一次心跳时间
   */
  lastSeenAt?: null | string;

  /**
   * 已超时秒数
   */
  staleForSeconds?: null | number;

  /**
   * 恢复状态标签
   */
  recoveryState: 'idle' | 'pending' | 'cooldown' | 'stopped';

  /**
   * 当前连续重启次数
   */
  recoveryAttemptsInEpisode: number;

  /**
   * 当前爆发窗口内已完成轮次
   */
  recoveryEpisodesInBurst: number;

  /**
   * 已触发爆发次数
   */
  recoveryBurstCount: number;

  /**
   * 是否已停止自动重启
   */
  recoveryStopped: boolean;

  /**
   * 下一次允许尝试重启的时间
   */
  recoveryNextAttemptAt?: null | string;

  /**
   * 本轮离线开始时间
   */
  recoveryOfflineSinceAt?: null | string;
}

/**
 * 接口：哨兵状态主体
 */
export interface ISentinelStatusBody {
  /**
   * 当前状态
   */
  state: 'idle' | 'online' | 'offline' | 'error';

  /**
   * 状态原因
   */
  reason?: null | string;

  /**
   * 附加消息
   */
  message?: null | string;
}

/**
 * 接口：哨兵状态事件载荷
 */
export interface ISentinelStatusPayload {
  /**
   * 事件类型
   */
  type: string;

  /**
   * 状态主体
   */
  status: ISentinelStatusBody;

  /**
   * 附加信息
   */
  attach: ISentinelStatusAttach;
}

/**
 * Hook：Tauri 哨兵
 * 描述：封装桌面壳暴露的哨兵状态快照命令与实时事件监听。
 * @returns {object} 哨兵状态方法
 */
export const useTauriSentinel = () => {
  /**
   * Hook：Tauri 环境
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：读取当前哨兵状态快照
   * @returns {Promise<ISentinelStatusPayload | null>} 当前状态快照
   */
  const statusGet = async (): Promise<ISentinelStatusPayload | null> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return invoke<ISentinelStatusPayload | null>('sentinel_status_get');
  };

  /**
   * 函数：监听哨兵状态变化
   * @param {(payload: ISentinelStatusPayload) => void} handler 状态回调
   * @returns {Promise<UnlistenFn>} 取消监听函数
   */
  const onStatusChange = async (handler: (payload: ISentinelStatusPayload) => void): Promise<UnlistenFn> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return listen<ISentinelStatusPayload>(EVENT_SENTINEL_EVENT, (event) => {
      handler(event.payload);
    });
  };

  return { statusGet, onStatusChange };
};
