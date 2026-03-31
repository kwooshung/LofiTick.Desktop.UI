import type { FetchError } from 'ofetch';

import type { UseFetchOptions } from '#app';

/**
 * 接口：统一包裹后的响应结构
 */
export interface IApiResponseWrapper<TData = Record<string, unknown>> {
  /**
   * 数据
   */
  datas: TData;

  /**
   * 状态
   */
  status: IServerError;
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
