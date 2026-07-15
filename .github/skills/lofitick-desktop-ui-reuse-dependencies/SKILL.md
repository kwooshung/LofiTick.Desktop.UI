---
name: lofitick-desktop-ui-reuse-dependencies
description: 'Reuse-first implementation, existing wheels, es-toolkit, VueUse, debounce/throttle, timers, dependency selection, and duplicate implementation prevention. (复用优先、现有轮子、es-toolkit、VueUse、防抖节流、计时器、依赖选择与禁止重复实现)'
argument-hint: '请输入复用任务，例如：[工具函数] [防抖] [依赖选择] [重复实现]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# 复用优先与依赖选择

## 适用场景

- 实现功能、页面、组件、composable、store、shared type、工具函数或 API 封装之前。
- 判断是否已有组件、工具、类型、依赖、Tauri 封装或 Nuxt auto-import 能复用。
- 处理防抖、节流、计时器、轮询刷新或依赖选型。

## 复用优先级

- 实现任何功能前，必须先检查仓库内是否已有可复用“轮子”。
- 检查范围包括 `app/components/**`、`app/composables/**`、`app/stores/**`、`app/types/**`、`shared/**`、现有 Nuxt auto-import 项、现有 Tauri 封装、现有 API composable。
- 只要现有实现能够满足需求，或经小范围扩展即可满足，必须优先复用或扩展现有实现。
- 只要现有依赖已经能直接覆盖需求，就必须优先使用依赖实现。
- 禁止复制粘贴近似逻辑、平行新增重复组件、重复 composable、重复工具函数，或为已有能力再造一层语义重复的封装。
- 当发现某段实现已经在 2 处及以上出现，并且提取共享实现的收益不低于分散维护成本时，必须收敛为共享能力。
- 禁止明知重复仍继续铺开第二套、第三套实现。
- 若判断必须新增实现，必须先确认并说明现有轮子为何不适用。
- 可接受的不适用理由包括职责边界不符、运行环境不符、类型约束不符、交互语义不同、性能或可维护性原因。
- 不能说明清楚时，默认视为必须复用现有实现。
- 文件和文件夹不怕多，结构必须清晰；宁可多拆职责明确的小文件，也不要把不同职责揉进一个难以阅读的大文件。

## 第三方依赖判断

- 判断依赖、包版本或可替代实现前，必须先读 `package.json` 与 `pnpm-lock.yaml`。
- 当发现当前功能存在更合适的第三方依赖包时，可以主动给出 1 到 3 个候选并说明取舍。
- 推荐候选必须仍然活跃、社区使用广、维护及时且综合效率更高。
- 禁止为了“有包可用”随便推荐冷门或停更依赖。
- 新增依赖前必须优先复用既有依赖和既有工具链。
- 安装依赖必须使用 `pnpm install --ignore-workspace`。

## `es-toolkit` 与 VueUse

- 能用 `es-toolkit` 一定要优先使用，避免冗余代码。
- 使用 `es-toolkit` 前必须确认官方文档支持，且不是实验性功能，也不是“为兼容 lodash”的功能。
- 在变更方案清单里必须写清楚用到 `es-toolkit` 的哪些能力。
- 如果 `es-toolkit` 不支持，再考虑 VueUse。
- 如果 `@vueuse/nuxt` 或 `es-toolkit` 已有现成能力，必须优先使用它们或仓库内已有封装。
- 必须按当前场景选择更合适的工具，禁止在本地再手写一套同类实现。

## 原子化与结构清晰

- 页面、组件、composable、store、工具函数都必须原子化，默认只承担一个稳定职责。
- 单个函数必须尽量压到 30 行左右，通常不得超过 30~50 行；如果确实超过，必须能说明拆分会破坏语义边界、性能边界或使用边界。
- 单个 `*.vue` 文件优先控制在 300~500 行以内；若因页面复杂度必须超过上限，必须先拆出 section、子组件或共享 composable，再保留最终必要的页面壳。
- 组件原子化的判断标准是单一职责、单一状态域、单一呈现主题；当一个组件同时承担布局、业务数据整理和复杂交互时，必须拆分。
- 前端可复用的“轮子”必须在对应 skill 文档里列清楚，包括 `app/components/**`、`app/composables/**`、`app/stores/**`、`shared/**`、现有 API composable 与 Tauri 封装；skill 必须说明这些轮子分别负责什么、谁在复用、为什么不重复造。

## 防抖与节流

- 禁止用 `setTimeout` / `clearTimeout` 自己写 debounce/throttle。
- `@vueuse/nuxt` 与 `es-toolkit` 都能实现防抖/节流时，选择依据是运行环境和场景，不是固定谁优先。
- Vue/Nuxt 组件即 `*.vue` 中，更适合用 VueUse，例如 `useDebounceFn`，更贴合组合式与生命周期。
- 纯 TS 工具函数、Node 脚本中，更适合用 `es-toolkit`，例如 `debounce`，避免引入 Vue 运行时语义。
- 如果两者都可用且不确定，必须先说明选择理由与取舍，再让用户拍板。
- 组件内的延迟显示、延迟隐藏、定时重置、一次性超时与轮询刷新，默认也必须优先复用 VueUse 的 `useTimeoutFn`、`useIntervalFn`、`useDebounceFn`、`useThrottleFn`。
- 禁止新增裸 `setTimeout`、`clearTimeout`、`setInterval`、`clearInterval`。
- 只有明确属于脚本工具、编译产物处理或无法引入 Vue 运行时语义的场景，才允许用 Node、`es-toolkit` 等等价实现。
- 如果必须保留底层计时器，也要说明原因，并把清理语义收口成单一封装。

## `useApi` 限流边界

- HTTP 请求链路的限流优先交给 `useApi` 自带能力。
- `useApi` 返回值已内建 `refreshDebounced`、`retryDebounced`、`refreshThrottled`、`retryThrottled`。
- 需要限流时，优先通过 `useApi(..., { rateLimit: { debounce / throttle } })` 配置。
- 不要为同一条 HTTP 请求链路再额外包一层页面级 `useDebounceFn` / `useThrottleFn`。
- 同步 Redis 或远端设置的 HTTP 写请求，优先使用 `useApi` 自带 `rateLimit + refreshDebounced`。
- 如果同一页面还要写本地 Tauri settings、窗口状态或其他非 HTTP 本地镜像，本地副作用可以继续单独使用页面层防抖。
- HTTP 远端写链路仍必须交给 `useApi` 自己限流。
- 查询列表、搜索建议、筛选联动等读请求，可以继续按现有模式使用 `refreshDebounced` / `refreshThrottled`。

## 参考入口

- VueUse 文档：https://vueuse.org/
- es-toolkit 文档：https://es-toolkit.esm.dev/
