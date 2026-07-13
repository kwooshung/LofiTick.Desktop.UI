---
name: lofitick-desktop-ui-coding
description: 'Root routing skill for LofiTick.Desktop.UI Nuxt, Vue, TypeScript, useApi, i18n, Tailwind, Tailwind v4, twcss4, Tauri, workflow, and skill maintenance tasks. (LofiTick.Desktop.UI 编码规范根索引：按 Nuxt、Vue、TypeScript、useApi、i18n、Tailwind、Tauri、流程与 skill 维护任务加载子 skill)'
argument-hint: '请输入任务领域，例如：[页面] [useApi] [样式] [i18n] [Tauri]'
license: Private
metadata:
	author: SuttonKwok
	version: '2.0.0'
---

# LofiTick.Desktop.UI 编码 Skill 根索引

本文件是 Desktop.UI 编码规则的唯一 `skill` 索引入口。执行任务时只加载最相关的子 `skill`，避免一次性加载完整工程规范。

## 何时使用

- 处理 `LofiTick.Desktop.UI` 的 Nuxt、Vue、TypeScript、组件、页面、API、样式、i18n、Tauri、配置、测试、文档或 skill 维护任务时使用。
- 先按任务主责加载一个子 `skill`；任务跨边界时，再加载相邻子 `skill`。
- 禁止为了“保险”加载全部子 `skill`。

## Skill 索引

| 任务领域                                                                       | 按需加载                                                                                       |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 项目定位、目录、改动门禁、文档树、规则同步、冲突处理                           | [`lofitick-desktop-ui-project-workflow`](../lofitick-desktop-ui-project-workflow/SKILL.md)     |
| `Nuxt 5`、`SSR`、配置代理、依赖、`ESM`、脚本、测试命令                         | [`lofitick-desktop-ui-nuxt-config`](../lofitick-desktop-ui-nuxt-config/SKILL.md)               |
| `Nuxt auto-import`、别名导入、`Vue SFC` 宏、模板 `props` / `ref`、组件自动注册 | [`lofitick-desktop-ui-imports-auto`](../lofitick-desktop-ui-imports-auto/SKILL.md)             |
| 复用优先级、现有轮子、`es-toolkit`、`VueUse`、防抖节流、计时器                 | [`lofitick-desktop-ui-reuse-dependencies`](../lofitick-desktop-ui-reuse-dependencies/SKILL.md) |
| `/api/**` 代理、`useApi`、`SSR` 首屏、自动自愈、限流、禁止裸请求               | [`lofitick-desktop-ui-api-useapi`](../lofitick-desktop-ui-api-useapi/SKILL.md)                 |
| `TypeScript` 命名、接口/类型、注释、`JSDoc`、状态/引用命名、`any`、动态导入    | [`lofitick-desktop-ui-types-comments`](../lofitick-desktop-ui-types-comments/SKILL.md)         |
| 页面薄壳、`sections` 边界、页面类型、组件私有类型                              | [`lofitick-desktop-ui-pages-sections`](../lofitick-desktop-ui-pages-sections/SKILL.md)         |
| `UTable`、`sticky`、响应式列、树形、固定列、表尾、危险操作确认                 | [`lofitick-desktop-ui-tables`](../lofitick-desktop-ui-tables/SKILL.md)                         |
| `Tailwind v4`、`Nuxt UI`、断点、任意值、图标、空状态、链接语义、时间展示       | [`lofitick-desktop-ui-styling`](../lofitick-desktop-ui-styling/SKILL.md)                       |
| 四语 `i18n`、主语言、`key` 对齐、翻译质量、禁止 `te(...)` 探测                 | [`lofitick-desktop-ui-i18n`](../lofitick-desktop-ui-i18n/SKILL.md)                             |
| `Tauri API`、环境检查、`invoke` 类型、`useTauri*`、事件清理                    | [`lofitick-desktop-ui-tauri`](../lofitick-desktop-ui-tauri/SKILL.md)                           |
| `Skill` `frontmatter`、拆分、去重、索引维护、权威来源                          | [`lofitick-desktop-ui-skill-maintenance`](../lofitick-desktop-ui-skill-maintenance/SKILL.md)   |
| `Skill` 写作、拆分、去重、索引写法、关键词包裹、权威来源                       | [`lofitick-desktop-ui-skill-writer`](../lofitick-desktop-ui-skill-writer/SKILL.md)            |

## 维护规则

- 新增、修改、删除代码、配置、测试、文档或能力边界时，必须同步检查最相关的子 `skill` 是否需要更新。
- 发现可复用组件、composable、store、工具、类型、API/Tauri 封装或第三方依赖后，必须记录到对应子 `skill`，说明职责、复用入口、适用边界和禁止重复实现的原因。
- 新增稳定规则时，放入最贴近职责的子 `skill`；只有新增、删除或重命名子 `skill` 时才更新本索引。
- 子 `skill` 的 `name` 必须与文件夹名一致，使用 `lowercase kebab-case`；`description` 必须包含触发关键词，便于按需发现。
- 单个子 `skill` 应保持聚焦；如果一个 `SKILL.md` 开始混入多个无关主题，必须继续拆分。
- 禁止保留“大而全”的默认 `skill`；禁止在子 `skill` 中维护跨 `skill` 索引。
- 只要对 `skill` 有了增删改，都要及时更新本索引，使用 `Markdown` 链接维护入口收口，并清理重复规则，确保整个 `skill` 系统一致可靠。
