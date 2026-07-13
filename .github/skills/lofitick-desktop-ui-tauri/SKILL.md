---
name: lofitick-desktop-ui-tauri
description: 'Tauri frontend integration for LofiTick.Desktop.UI: @tauri-apps/api, runtime detection, invoke typing, useTauri composables, and event cleanup. (LofiTick.Desktop.UI Tauri 前端集成：@tauri-apps/api、运行环境检测、invoke 类型、useTauri 封装与事件清理)'
argument-hint: '请输入 Tauri 任务，例如：[invoke] [事件监听] [窗口] [文件系统]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# Tauri 集成规范

## 适用场景

- 在前端调用 Tauri 原生能力、`invoke` 命令、Tauri 事件监听或桌面环境判断。
- 新增或修改 `app/composables/tauri/**` 封装。

## 基础边界

- 本项目桌面端能力通过 Tauri 实现，Rust 后端提供主进程能力。
- 前端通过 `@tauri-apps/api` 与 Tauri 主进程通信。
- 所有 Tauri 原生能力，包括文件系统、系统通知、窗口管理、剪贴板等，必须通过 `@tauri-apps/api` 官方模块调用。
- 禁止直接操作 `window.__TAURI__`。

## 运行环境检查

- 调用 Tauri API 前必须确认当前运行环境为 Tauri。
- 可检查 `window.__TAURI_INTERNALS__` 是否存在。
- 必须避免在浏览器开发环境崩溃。

## invoke 命令

- Tauri 命令通过 `invoke(command, args)` 调用。
- 命令对应 Rust 侧 `#[tauri::command]`。
- 必须为每个 `invoke` 调用提供完整 TypeScript 类型定义。
- 禁止使用 `any` 作为参数或返回值类型。
- `invoke` 命令封装统一放在 `app/composables/tauri/` 下。
- 封装命名使用 `useTauri` 前缀，例如 `useTauriWindow`、`useTauriFs`。

## 事件监听

- Tauri 事件监听 `listen` 返回的取消监听函数必须在 `onUnmounted` 中调用。
- 必须防止内存泄漏。
- 取消监听句柄默认使用普通变量保存。
- 仅当需要驱动模板渲染、被 `watch` 追踪或参与计算属性时，才使用响应式保存。

## 参考入口

- Tauri API：https://tauri.app/
