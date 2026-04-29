import { invoke } from '@tauri-apps/api/core';

import type { IApiClientConfig, IApiClientConfigPatch, IApiClientRequestInput, IApiClientRequestOutput } from '@@/shared/types/tauri/api-client/index.types';

import { apiToastTryEmit } from '../../hooks/useApi';

/**
 * Hook：Tauri 直连 API 客户端
 * 描述：封装 Desktop 壳侧 `api_client_request`，并复用 `useApi` 的 toast 口径（含 `toast.enable=false` 静默）。
 * @returns {object} 直连请求方法
 */
export const useTauriApiClient = () => {
  /**
   * Store：Toast Api 信息
   */
  const toastStore = useStoreToastApi();

  /**
   * Hook：Tauri 环境
   */
  const { isTauriRuntime } = useTauriEnv();

  /**
   * 函数：发起直连请求
   * @param {IApiClientRequestInput} input 请求输入
   * @returns {Promise<IApiClientRequestOutput>} 请求输出
   */
  const request = async (input: IApiClientRequestInput): Promise<IApiClientRequestOutput> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    const method = String(input?.method ?? '')
      .trim()
      .toUpperCase();
    const path = String(input?.path ?? '').trim();

    const keyHash = JSON.stringify({
      method,
      path,
      query: input?.query ?? null,
      body: input?.body ?? null,
      datas: input?.datas ?? null
    });

    const out = await invoke<IApiClientRequestOutput>('api_client_request', { input });

    const http = Number(out?.http ?? 0);
    if (Number.isFinite(http) && http >= 400) {
      apiToastTryEmit({
        method: method || 'GET',
        backendPath: path || '/',
        keyHash,
        raw: out?.json,
        fallbackHttp: http,
        toastSet: toastStore.set
      });
    }

    return out;
  };

  /**
   * 函数：更新壳侧 API 客户端配置
   * @param {IApiClientConfigPatch} patch 配置补丁
   * @returns {Promise<IApiClientConfig>} 更新后的完整配置
   */
  const configUpdate = async (patch: IApiClientConfigPatch): Promise<IApiClientConfig> => {
    if (!import.meta.client) {
      throw new Error('client only');
    }

    if (!isTauriRuntime.value) {
      throw new Error('tauri only');
    }

    return await invoke<IApiClientConfig>('api_client_config_update', { patch });
  };

  return { request, configUpdate };
};
