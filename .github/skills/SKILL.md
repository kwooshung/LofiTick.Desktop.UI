---
name: 'lofitick-desktop-ui-skills'
description: 'LofiTick.Desktop.UI GitHub Copilot skill 根索引。按 Nuxt 页面、组件、useApi、i18n、Tauri、Tailwind、类型、server API 或 skill 维护任务加载子 skill，降低 token 消耗。'
argument-hint: '[task area]'
---

# LofiTick.Desktop.UI Skills

本文件是唯一子 skill 索引入口。只按当前任务加载最相关的子 skill，避免一次性加载完整工程规范。

## When to Use

- 处理 Nuxt 页面、组件、composable、store、server API、i18n、配置、测试或 Tauri 集成任务时，先按任务类型选择子 skill。
- 任务横跨多个边界时，先加载主责 skill，再按实际需要加载相邻 skill。
- 不要为了“保险”加载所有规则。

## Skill Index

- [Project Workflow](project-workflow/SKILL.md) — 项目结构、配置入口、依赖安装、变更门禁、清理规则与 skill 同步。
- [Nuxt Runtime And Imports](nuxt-runtime-imports/SKILL.md) — Nuxt 5、ESM、自动导入、别名路径、SFC 宏、定时器和脚本。
- [Implementation Reuse](implementation-reuse/SKILL.md) — 页面、组件、composable、store、shared、API/Tauri 封装复用与原子化。
- [Styling And Interaction](styling-interaction/SKILL.md) — Tailwind v4、Nuxt UI、断点、图标、空状态、链接语义和危险操作。
- [API SSR Fetching](api-ssr-fetching/SKILL.md) — Nitro 代理、useApi、SSR 首屏、限流、自愈重试和句柄规则。
- [TypeScript And Comments](typescript-comments/SKILL.md) — 类型命名、index.types.ts、state/ref 命名、JSDoc、any 和注释规范。
- [Pages I18n And Tauri Integration](pages-i18n-tauri/SKILL.md) — pages/sections、UTable、i18n 四语、Tauri invoke/listen。
- [Server API Routes](server-api-routes/SKILL.md) — Nuxt server API、method 文件拆分、参数解析、响应封装和错误码。
- [Skill Maintenance](skill-maintenance/SKILL.md) — skill 新增、拆分、索引维护、token 控制和复用轮子记录。
- [Skill Writer](skill-writer/SKILL.md) — skill 创建、优化、拆分、双语写作和 token 预算控制。
- [Banner Design](banner-design/SKILL.md) — 横幅、封面、广告、hero、排版、导出与多艺术方向设计。

## Maintenance Rules

- 新增、修改、删除代码、配置、测试或能力边界时，必须同步检查最相关的子 skill 是否需要更新。
- 发现可复用组件、composable、store、工具、类型、API/Tauri 封装或第三方依赖后，必须记录到对应子 skill，说明职责、复用入口、适用边界和禁止重复实现的原因。
- 新增稳定规则时，放入最贴近职责的子 skill；只有新增、删除或重命名子 skill 时才更新本索引。
- 子 skill 的 `name` 必须与文件夹名一致，使用 lowercase kebab-case；`description` 必须包含触发关键词，便于按需发现。
- 单个子 skill 应保持聚焦；如果一个 `SKILL.md` 开始混入多个无关主题，必须继续拆分。
- 禁止保留“大而全”的默认 skill；禁止在子 skill 中维护跨 skill 索引。
