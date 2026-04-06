import type { FetchError } from 'ofetch';

import type { UseFetchOptions } from '#app';

/**
 * 接口：服务端状态结构（ApiStatus）。
 */
export interface IServerError {
  /**
   * 调用方类型（TTT）。
   */
  type: string;

  /**
   * HTTP 状态码。
   */
  http: number;

  /**
   * 业务模块码。
   */
  biz: number;

  /**
   * 目标码。
   */
  aim: number;

  /**
   * 毫秒时间戳字符串。
   */
  ts: string;

  /**
   * 可读信息（可选）。
   */
  message?: string;
}

/**
 * 接口：Toast 配置（来自服务端）
 */
export interface IApiResponseToast {
  /**
   * 是否启用
   */
  enable?: boolean;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 类型
   */
  type?: string;

  /**
   * 持续时间，单位毫秒
   */
  duration?: number;

  /**
   * 是否显示进度条
   */
  progress?: boolean;

  /**
   * 是否显示关闭按钮
   */
  close?: boolean;
}

/**
 * 接口：统一包裹后的响应结构
 */
export interface IApiResponseWrapper<TData = Record<string, unknown>> {
  /**
   * 数据
   */
  datas?: TData;

  /**
   * 状态
   */
  status: IServerError;

  /**
   * Toast 配置（可选）
   */
  toast?: IApiResponseToast;

  /**
   * 附加数据（可选）
   */
  attach?: unknown;
}

/**
 * 接口：签名刷新 payload（客户端解密后）。
 */
export interface ISignRefreshPayload {
  /**
   * 当前窗口的派生签名密钥（小写 hex）。
   */
  signKeyHex: string;

  /**
   * 签名有效期（秒）。
   */
  ttlSec: number;

  /**
   * 时钟偏差容忍（毫秒）。
   */
  clockSkewMs: number;

  /**
   * 签名 header 名称。
   */
  signHeaderName: string;

  /**
   * 签名 header 前缀。
   */
  signSigPrefix: string;

  /**
   * 窗口编号。
   */
  windowNum: number;

  /**
   * 签发时间（毫秒）。
   */
  issuedAtMs: number;
}

/**
 * 接口：签名运行时状态。
 */
export interface ISignState {
  /**
   * Nuxt server 写入 refresh blob 的 Cookie 名称。
   */
  signBlobCookieName: string;

  /**
   * 最近一次解密得到的 payload。
   */
  payload: ISignRefreshPayload | null;
}

/**
 * 类型：UseFetchExtraOptions
 */
export interface IUseFetchExtraOptions extends Omit<UseFetchOptions<unknown>, 'pick' | 'transform'> {
  /**
   * 万能业务参数
   */
  datas?: MaybeRef<Record<string, unknown>>;

  /**
   * 是否替换（而非合并）业务参数
   */
  replace?: boolean;

  /**
   * 函数：宽化 transform
   */
  transform?: (input: unknown) => unknown;

  /**
   * 宽化 pick
   */
  pick?: unknown;

  /**
   * 限流配置（可选）
   */
  rateLimit?: RateLimitOptions;
}

/**
 * 接口：request 函数返回值类型
 */
export interface IRequestResult<T = unknown> {
  data: Ref<T | undefined>;
  loading: Ref<boolean>;
  error: Ref<FetchError<unknown> | undefined>;
  retry: (opts?: IUseFetchExtraOptions) => Promise<void>;
  refresh: (opts?: IUseFetchExtraOptions) => Promise<void>;
  refreshDebounced: TUseApiRateLimitedFn;
  retryDebounced: TUseApiRateLimitedFn;
  refreshThrottled: TUseApiRateLimitedFn;
  retryThrottled: TUseApiRateLimitedFn;
}

/**
 * 接口：useApi 返回值类型
 */
export interface IUseApiResult<TData = Record<string, unknown>> {
  datas: Ref<TData | undefined>;
  status: Ref<IServerError | undefined>;
  loading: Ref<boolean>;
  error: Ref<FetchError<unknown> | undefined>;
  retry: (opts?: IUseFetchExtraOptions) => Promise<void>;
  refresh: (opts?: IUseFetchExtraOptions) => Promise<void>;
  refreshDebounced: TUseApiRateLimitedFn;
  retryDebounced: TUseApiRateLimitedFn;
  refreshThrottled: TUseApiRateLimitedFn;
  retryThrottled: TUseApiRateLimitedFn;
}

/**
 * 类型：防抖选项
 */
export interface IUseApiDebounceOptions {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * 类型：节流选项
 */
export interface IUseApiThrottleOptions {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * 类型：限流配置集合
 */
export interface RateLimitOptions {
  debounce?: IUseApiDebounceOptions;
  throttle?: IUseApiThrottleOptions;
}

/**
 * 类型：限流函数
 */
export type TUseApiRateLimitedFn = (opts?: IUseFetchExtraOptions) => void;
