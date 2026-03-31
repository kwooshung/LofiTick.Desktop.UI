/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce, throttle } from 'es-toolkit';

import type { UseFetchOptions } from '#app';

import type { IApiResponseWrapper, IUseApiResult, IUseFetchExtraOptions, IUseApiDebounceOptions, IUseApiThrottleOptions, TUseApiRateLimitedFn } from './index.types';

/**
 * 常量：支持 Body 传参的方法集合
 */
const HAS_BODY_METHODS: Set<'POST' | 'PUT' | 'PATCH' | 'DELETE'> = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * 函数：刷新认证（登出/token 过期时触发）
 */
export const refreshTokenIfNeeded = async (): Promise<void> => {
  const storeAuth = useStoreAuth();
  storeAuth.states.ui.show = true;
  storeAuth.states.ui.lock = false;
};

/**
 * 常量：API 派生密钥缓存
 */
export const useApiDerivedKeyCache: Map<string, string> = new Map<string, string>();

/**
 * 函数：从 MaybeRef 解包真实值
 */
const resolve = <T>(v: T | Ref<T> | undefined): T | undefined => (isRef(v) ? v.value : v);

/**
 * 函数：剔除对象中值为 undefined 的键
 */
const omitUndefined = (obj: unknown): Record<string, unknown> => {
  const src = obj && typeof obj === 'object' && !Array.isArray(obj) ? (obj as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(src)) {
    if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
};

/**
 * 函数：规范化路径（强制前缀 /api/）
 */
const toApiPath = (input: string): string => {
  if (input.startsWith('/api/')) return input;
  if (input.startsWith('/')) return `/api${input}`;
  return `/api/${input}`;
};

/**
 * 函数：转为可展开对象
 */
const toSpreadableObject = (input: unknown): Record<string, unknown> => {
  if (input == null) return {};
  if (typeof input === 'string') {
    const out: Record<string, unknown> = {};
    for (let i = 0; i < input.length; i++) out[String(i)] = input.charAt(i);
    return out;
  }
  if (typeof input === 'object' && !Array.isArray(input)) return omitUndefined(input);
  return {};
};

/**
 * 函数：合并 headers
 */
const mergeHeaders = (existing: HeadersInit | undefined, extra: Record<string, string>): Record<string, string> => {
  const result: Record<string, string> = {};
  if (existing instanceof Headers) {
    existing.forEach((v, k) => (result[k] = v));
  } else if (Array.isArray(existing)) {
    for (const [k, v] of existing) result[String(k)] = String(v);
  } else if (existing && typeof existing === 'object') {
    for (const [k, v] of Object.entries(existing)) result[k] = String(v as string);
  }
  Object.assign(result, extra);
  return result;
};

/**
 * 工具：创建防抖包装
 */
const createDebounced = (fn: (opts?: IUseFetchExtraOptions) => Promise<void>, options: IUseApiDebounceOptions): TUseApiRateLimitedFn => {
  const debounceOpts = {
    ...(options.leading !== undefined ? { leading: options.leading } : {}),
    ...(options.trailing !== undefined ? { trailing: options.trailing } : {}),
    ...(options.maxWait !== undefined ? { maxWait: options.maxWait } : {})
  } as unknown as Parameters<typeof debounce>[2];
  const wrapped = debounce((opts?: IUseFetchExtraOptions) => { void fn(opts); }, options.wait, debounceOpts);
  return (opts?: IUseFetchExtraOptions) => wrapped(opts);
};

/**
 * 工具：创建节流包装
 */
const createThrottled = (fn: (opts?: IUseFetchExtraOptions) => Promise<void>, options: IUseApiThrottleOptions): TUseApiRateLimitedFn => {
  const throttleOpts = {
    ...(options.leading !== undefined ? { leading: options.leading } : {}),
    ...(options.trailing !== undefined ? { trailing: options.trailing } : {})
  } as unknown as Parameters<typeof throttle>[2];
  const wrapped = throttle((opts?: IUseFetchExtraOptions) => { void fn(opts); }, options.wait, throttleOpts);
  return (opts?: IUseFetchExtraOptions) => wrapped(opts);
};

/**
 * 函数：规范化 HTTP 方法
 */
const normalizeMethod = (method?: unknown): string =>
  String(method ?? 'GET').toUpperCase().trim();

/**
 * 函数：统一封装 API 请求
 */
const request = async <T>(path: string, options: IUseFetchExtraOptions = {}): Promise<any> => {
  const apiPath = toApiPath(path);
  const method = normalizeMethod(options.method);
  const hasBodyMethod = HAS_BODY_METHODS.has(method as any);

  const querySource = isRef(options.query) ? (options.query as Ref<unknown>) : ref(options.query);
  const bodySource = isRef(options.body) ? (options.body as Ref<unknown>) : ref(options.body);
  const datasSource = isRef(options.datas) ? (options.datas as Ref<Record<string, unknown>>) : ref(options.datas);

  const baseAllParamsRef = computed<Record<string, unknown>>(() => ({
    ...toSpreadableObject(resolve(querySource.value)),
    ...toSpreadableObject(resolve(bodySource.value)),
    ...toSpreadableObject(resolve(datasSource.value))
  }));

  const keyHash = JSON.stringify({ method, apiPath, params: baseAllParamsRef.value });
  const staticKey = `api-${keyHash.length}-${Date.now()}`;

  const headersObj = mergeHeaders(options.headers as HeadersInit | undefined, {});
  const { pick: _omitPick, transform: _omitTransform, rateLimit: _omitRateLimit, ...restOptions } = options;

  const finalOptions: UseFetchOptions<unknown> & Record<string, unknown> = {
    watch: false,
    immediate: false,
    ...restOptions,
    headers: headersObj,
    onResponseError(ctx: any) {
      const raw = ctx.response._data as IApiResponseWrapper<unknown> | undefined;
      if (raw?.status?.toast?.enable) {
        const storeToast = useStoreToastApi();
        storeToast.set({
          key: `toast-api-${Date.now()}-${raw.status.ts ?? ''}`,
          enable: true,
          code: raw.status.code ?? '',
          icon: raw.status.toast.icon ?? '',
          color: raw.status.toast.type ?? 'warning',
          duration: raw.status.toast.duration ?? 3000,
          progress: raw.status.toast.progress ?? false,
          close: raw.status.toast.close ?? false
        });
      }
    },
    key: staticKey
  };

  if (hasBodyMethod) {
    finalOptions.body = computed(() => ({
      ...omitUndefined(resolve(options.body)),
      ...toSpreadableObject(resolve(datasSource.value))
    })) as any;
    finalOptions.query = options.query as any;
  } else {
    finalOptions.query = computed(() => ({
      ...omitUndefined(resolve(options.query)),
      ...toSpreadableObject(resolve(datasSource.value))
    })) as any;
    if (options.body !== undefined) {
      finalOptions.body = options.body;
    }
  }

  const fetch = hasBodyMethod ? (useCsrfFetch ?? useFetch) : useFetch;
  const base: any = await fetch<T | undefined>(apiPath, finalOptions);

  const { error, pending } = base;

  const retry = async (opts?: IUseFetchExtraOptions) => {
    if (opts) {
      const rest = { ...opts } as Partial<IUseFetchExtraOptions>;
      delete (rest as any).datas;
      delete (rest as any).query;
      delete (rest as any).body;
      await base.refresh(rest as any);
    } else {
      await base.refresh();
    }
  };

  const refresh = async (opts: IUseFetchExtraOptions = {}) => {
    if (opts.datas !== undefined) datasSource.value = toSpreadableObject(resolve(opts.datas)) as any;
    if (opts.query !== undefined) querySource.value = toSpreadableObject(resolve(opts.query));
    if (opts.body !== undefined) bodySource.value = toSpreadableObject(resolve(opts.body));
    finalOptions.key = `${staticKey}-${Date.now()}`;
    await base.refresh();
  };

  const debounceOpts: IUseApiDebounceOptions = {
    wait: options.rateLimit?.debounce?.wait ?? 300,
    leading: options.rateLimit?.debounce?.leading ?? false,
    trailing: options.rateLimit?.debounce?.trailing ?? true,
    maxWait: options.rateLimit?.debounce?.maxWait
  };
  const throttleOpts: IUseApiThrottleOptions = {
    wait: options.rateLimit?.throttle?.wait ?? 500,
    leading: options.rateLimit?.throttle?.leading ?? true,
    trailing: options.rateLimit?.throttle?.trailing ?? false
  };

  return {
    data: base.data,
    loading: pending,
    error,
    retry,
    refresh,
    refreshDebounced: createDebounced(refresh, debounceOpts),
    retryDebounced: createDebounced(retry, debounceOpts),
    refreshThrottled: createThrottled(refresh, throttleOpts),
    retryThrottled: createThrottled(retry, throttleOpts)
  };
};

/**
 * Hook：useApi
 * @param {string} path 请求路径
 * @param {IUseFetchExtraOptions} [options] 配置
 * @template TData 业务数据类型
 */
export const useApi = async <TData = Record<string, unknown>>(path: string, options: IUseFetchExtraOptions = {}): Promise<IUseApiResult<TData>> => {
  const { data: raw, loading, error, retry, refresh, refreshDebounced, retryDebounced, refreshThrottled, retryThrottled } = await request<IApiResponseWrapper<TData>>(path, options);

  const datas = computed(() => raw.value?.datas) as Ref<TData | undefined>;
  const status = computed(() => raw.value?.status) as Ref<IServerError | undefined>;

  return {
    datas,
    status,
    loading,
    error,
    retry,
    refresh,
    refreshDebounced,
    retryDebounced,
    refreshThrottled,
    retryThrottled
  } as unknown as IUseApiResult<TData>;
};
