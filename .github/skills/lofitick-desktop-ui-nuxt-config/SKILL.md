---
name: lofitick-desktop-ui-nuxt-config
description: 'Nuxt 5 configuration, SSR, ESM, package scripts, modules, dependency checks, config proxy files, and test/build commands for LofiTick.Desktop.UI. (LofiTick.Desktop.UI Nuxt 5 配置、SSR、ESM、脚本、模块、依赖检查、配置代理文件与测试构建命令)'
argument-hint: '请输入配置任务，例如：[Nuxt 配置] [依赖] [脚本] [测试]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# Nuxt 配置与工程基础

## 适用场景

- 修改 Nuxt、Vite、Nitro、安全、i18n、模块、脚本、测试、构建相关配置。
- 判断依赖、版本、模块是否已存在。
- 处理 ESM、Node 脚本或根配置代理文件。

## 基础事实

- 项目基于 **Nuxt 5**，通过 `pnpm.overrides` 将 `nuxt` 别名到 `nuxt-nightly@5x`。
- `configs/nuxt/index.ts` 中当前 `ssr: true`。
- `configs/nuxt/index.ts` 中 `future.compatibilityVersion: 4`，用于启用 Nuxt 5 兼容模式并逐步对齐 v5 行为。
- `app.rootId` 为 `LofiTick`。
- `pageTransition` 使用 `name: 'page'` 与 `mode: 'out-in'`。
- `site.url` 为 `https://desktop.ui.lofitick.com/`。
- 开发服务器默认 `host` 来自 `HOST` 或 `localhost`，`port` 来自 `PORT` 或 `3000`。
- Vite `build.target` 为 `esnext`，关闭 sourcemap。
- Vite watcher 忽略 `**/src-tauri/**`、`**/src-tauri/**/bin/**`、`**/bin/**`，避免扫描 Tauri sidecar 与二进制目录。
- Nuxt CSS 入口为 `~/assets/css/main.css`。
- Nuxt UI 主题颜色包括 `primary`、`secondary`、`info`、`success`、`warning`、`error`、`neutral`，且 `fonts: false`。
- `nuxtCharts.autoImports` 为 `false`。
- `ogImage.enabled` 为 `false`。
- `colorMode.storageKey` 为 `app-theme-mode`。
- server/client sourcemap 均关闭。

## 配置代理文件

- 根目录 `nuxt.config.ts`、`eslint.config.ts`、`prettier.config.ts`、`stylelint.config.mjs`、`vitest.config.ts` 均为代理入口。
- 禁止直接在根目录代理文件里添加配置逻辑。
- 配置逻辑必须进入 `configs/**` 对应职责目录。

## ESM 规则

- `package.json` 为 `"type": "module"`。
- 所有运行时代码、配置和脚本默认只能写 ESM。
- 禁止 `require()`、`module.exports`、`exports.xxx`。
- 涉及路径时，禁止假设 `__dirname` 存在。
- 需要路径时使用 `import.meta.url`、`URL` 或 `fileURLToPath`。

## 模块清单

- 当前 Nuxt 模块由 `configs/nuxt/modules.ts` 维护。
- 已启用模块包括：
  - `@nuxt/ui`：UI 组件库。
  - `@pinia/nuxt`：状态管理。
  - `@vueuse/nuxt`：组合式工具。
  - `@nuxt/scripts`：脚本管理。
  - `dayjs-nuxt`：日期处理。
  - `@nuxt/image`：图片处理。
  - `nuxt-security`：安全防护。
  - `@nuxtjs/i18n`：国际化。
  - `nuxt-email-renderer`：邮件模板渲染。
  - `@formkit/auto-animate/nuxt`：表单动画。
  - `nuxt-charts`：图表。
  - `@radya/nuxt-dompurify`：DOM 净化。
  - `nuxt-qrcode`：二维码生成。
  - `@nuxtjs/mdc`：Markdown 组件。
- `@nuxtjs/seo` 在模块文件中处于注释状态，不能按已启用模块处理。

## 依赖检查

- 判断依赖、包版本、可替代实现前，必须先读 `package.json` 与 `pnpm-lock.yaml`。
- 不要凭经验假设依赖已存在。
- 新增依赖前必须优先复用现有依赖与现有工具链。
- 依赖安装必须使用 `pnpm install --ignore-workspace`。

## 脚本执行

- 需要执行脚本时默认使用 `node` 或项目已有 package script。
- 禁止用 Python 替代 Node 脚本，除非用户明确要求。
- 常用脚本包括：
  - `pnpm dev`：`nuxt dev`。
  - `pnpm build`：`nuxt build && pnpm minify-next-ui-colors`。
  - `pnpm preview`：`nuxt preview`。
  - `pnpm generate`：`nuxt generate`。
  - `pnpm lint`：`nuxt prepare && eslint .`。
  - `pnpm lint:fix`：`nuxt prepare && eslint . --fix`。
  - `pnpm format`：`prettier --write .`。
  - `pnpm test`：`vitest`。
  - `pnpm test:unit`：`vitest --project unit`。
  - `pnpm test:nuxt`：`vitest --project nuxt`。
  - `pnpm test:e2e`：`vitest --environment nuxt`。
  - `pnpm test:watch`：`vitest --watch`。
  - `pnpm test:ui`：`vitest --ui`。
  - `pnpm sync:electron-types`：同步 Electron 类型。
  - `pnpm audit:i18n`：执行 i18n 审计。

## 安全配置事实

- `nuxt-security` 当前启用，`enabled: true`，`strict: false`。
- `routeRules['/api/email/send']` 关闭 `xssValidator`。
- CSP、权限策略、请求体大小限制等安全项在 `configs/nuxt/index.ts` 中集中维护。
- 修改安全配置前必须先读现有配置，禁止凭经验补规则。

## 参考入口

- Nuxt 5 文档：https://nuxt.com/
