import { invoke } from '@tauri-apps/api/core';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWebviewWindow, WebviewWindow } from '@tauri-apps/api/webviewWindow';

/**
 * 常量：关闭前询问事件名
 */
const EVENT_APP_PRE_CLOSE = 'app_pre_close';

/**
 * 类型：关闭前询问回传动作
 */
export type TPrecloseResolveAction = 'cancel' | 'minimize-to-tray' | 'exit';

/**
 * Hook：Tauri 关闭前询问
 * 描述：监听壳侧的 preclose 事件，并回传用户选择。
 * @returns {object} preclose 方法
 */
export const useTauriPreclose = () => {
  /**
   * 函数：监听关闭前询问事件
   * @param {() => void} handler 触发回调
   * @returns {Promise<UnlistenFn>} 取消监听函数
   */
  const onAppPreClose = async (handler: () => void): Promise<UnlistenFn> => {
    // 同时监听 window 域与 app 全局域：Rust 侧可能通过 window.emit 或 app.emit 发出事件。
    const unlisteners: UnlistenFn[] = [];

    try {
      /**
       * 常量：main。
       */
      const main = await WebviewWindow.getByLabel('main');
      if (main) {
        unlisteners.push(
          await main.listen(EVENT_APP_PRE_CLOSE, () => {
            handler();
          })
        );
      } else {
        unlisteners.push(
          await getCurrentWebviewWindow().listen(EVENT_APP_PRE_CLOSE, () => {
            handler();
          })
        );
      }
    } catch (err) {
      console.error('[tauri-preclose] window.listen failed', err);
    }

    try {
      unlisteners.push(
        await listen(EVENT_APP_PRE_CLOSE, () => {
          handler();
        })
      );
    } catch (err) {
      console.error('[tauri-preclose] app.listen failed', err);
    }

    if (unlisteners.length === 0) {
      throw new Error('[tauri-preclose] no listeners registered');
    }

    return () => {
      for (const unlisten of unlisteners) {
        try {
          unlisten();
        } catch {
          // ignore
        }
      }
    };
  };

  /**
   * 函数：回传关闭决策
   * @param {TPrecloseResolveAction} action 用户选择
   * @param {boolean | undefined} remember 是否记住
   * @returns {Promise<boolean>} 是否成功投递
   */
  const resolve = async (action: TPrecloseResolveAction, remember?: boolean): Promise<boolean> => {
    return invoke<boolean>('preclose_resolve', { action, _remember: remember });
  };

  return { onAppPreClose, resolve };
};
