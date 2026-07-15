---
name: lofitick-desktop-ui-api-useapi
description: 'useApi, Nuxt server proxy, /api routing, SSR first-screen data, silent security retry, rate limiting, and API request rules for LofiTick.Desktop.UI. (useApi、Nuxt server 代理、/api 路由、SSR 首屏数据、静默安全重试、限流与 API 请求规则)'
argument-hint: '请输入 API 任务，例如：[useApi] [SSR 首屏] [代理] [限流]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# API 请求与 useApi

## 适用场景

- 编写或修改前端 API 请求、Nuxt Server 代理、`useApi` 调用、SSR 首屏数据、限流或安全重试逻辑。
- 判断是否允许裸调 `$fetch` / `useFetch` / `fetch`。

## API 代理

- 本项目所有 API 请求统一走 Nitro，即 Nuxt Server 代理。
- 前端只请求同源 `/api/**`。
- Nitro 将 `/api/**` 转发到外部 Rust 后端。
- Rust API 基础地址通过环境变量 `NUXT_PUBLIC_API_BASE` 注入。
- `NUXT_PUBLIC_API_BASE` 对应 `useRuntimeConfig().public.apiBase` 的默认来源。
- 禁止在代码中硬编码 API URL。
- 统一代理规则是 `/api/**` -> `${NUXT_PUBLIC_API_BASE}/**`。
- 后端路径不带 `/api` 前缀。
- 禁止为每个 API 路径单独维护代理规则；只能维护统一代理规则。
- 生产环境必须以 `nuxt build` + `nuxt preview` 或等价 Nitro/Node 常驻服务运行。
- `nuxt generate` 的纯静态产物无法承担 server 代理能力。

## useApi 基础规则

- 所有 API 请求必须通过统一 composable 封装发起，例如 `app/composables/useApi`。
- 禁止在组件模板或业务逻辑中直接裸调 `$fetch`、`useFetch`、`fetch`。
- API composable 禁止写在函数体内。
- `useApi` 必须在 `setup` 顶层声明。
- `useApi` 返回值必须解构取需要字段。
- 禁止整体接收 `useApi` 返回对象。

## SSR 首屏数据

- 只要页面首次打开时就应该看到数据，该请求就必须作为 SSR 首屏请求处理。
- SSR 首屏请求必须在 `setup` 顶层通过 `await useApi(..., { immediate: true })` 声明。
- 必须保证服务端首包返回真实数据。
- 禁止把首屏数据请求降级为 `onMounted`、事件回调或其他仅客户端触发的补请求。
- 禁止用“先渲染空壳，再等客户端补数据”的方式规避 SSR。
- `useApi`、代理层、签名链路的实现必须兼容 SSR 首包。
- 即使请求需要签名、cookie 或 CSRF，自定义封装也必须让服务端首包拿到真实结果。
- 不能因为手动 `refresh()`、上下文丢失或 client-only 分支导致 HTML 首屏缺数。
- 任何 SSR 问题都必须优先排查并修复根因。
- 禁止无脑使用 `ClientOnly` 作为默认解法。
- `ClientOnly` 仅允许作为最后兜底手段，在确实没有其他可行方案时使用。

## 安全错误自愈

- 首开失败如果属于签名过期、签名不匹配、CSRF 缺失或不匹配、Nuxt 同源 CSRF 拒绝这类可自动自愈一次的安全错误，首次失败必须静默完成自愈与重试。
- 禁止在最终结果未确定前先弹 API 错误 toast。
- 只有用户主动触发、非首屏必需、或会造成不必要 SSR 开销的请求，才允许使用 `immediate: false`。

## Composables 顶层调用

- 任何返回实例、句柄或方法的 `useXxx` 必须在 `setup` 顶层调用。
- 禁止在任意函数体内调用。
- 禁止在 `onMounted`、`onBeforeUnmount`、`watch`、`watchEffect` 回调、事件回调、普通工具函数里调用这类 composable。

## 句柄与响应式

- 订阅函数返回的取消订阅句柄，例如 `unsubscribe`，默认使用普通变量保存。
- 计时器句柄等运行时句柄默认也使用普通变量保存。
- 推荐形式：`let unsubscribe: null | (() => void) = null`。
- 不要强行改成 `ref` 或 `shallowRef`。
- 是否使用响应式的判断标准是：是否需要驱动模板渲染、被 `watch` 追踪或参与计算属性。
- 仅用于生命周期清理的句柄不需要响应式。
- 注释必须反映真实语义；如果实现是普通变量，就用“变量/句柄”，不要误标为“状态”。

## useApi 限流

- `useApi` 返回值已内建限流句柄：`refreshDebounced`、`retryDebounced`、`refreshThrottled`、`retryThrottled`。
- 优先复用这些句柄。
- 不要为同一条 HTTP 请求链路再额外包一层页面级 `useDebounceFn` 或 `useThrottleFn`。
- 需要限流时，必须优先通过 `useApi(..., { rateLimit: { debounce / throttle } })` 配置。
- 禁止把 HTTP 写请求放到页面层手写防抖/节流包装里。
- 同步 Redis 或远端设置的 HTTP 写请求，优先使用 `useApi` 自带 `rateLimit + refreshDebounced`。
- 如果同一个页面同时还要写本地 Tauri settings、窗口状态或其他非 HTTP 本地镜像，这类本地副作用可以继续单独使用页面层防抖。
- HTTP 远端写链路仍必须交给 `useApi` 自己限流。
- 查询列表、搜索建议、筛选联动等读请求，可以继续按现有模式使用 `refreshDebounced` 或 `refreshThrottled`。
