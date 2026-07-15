---
name: lofitick-desktop-ui-project-workflow
description: 'Project workflow, workspace boundaries, change approval, documentation tree, README/config checks, rule sync, and conflict handling for LofiTick.Desktop.UI. (LofiTick.Desktop.UI 项目流程、工作区边界、改动门禁、文档树、README/配置检查、规则同步与冲突处理)'
argument-hint: '请输入流程任务，例如：[改动范围] [文档同步] [规则冲突]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# 项目流程与边界

## 适用场景

- 判断 Desktop.UI 项目定位、目录边界、关联只读项目或配置读取顺序。
- 准备新增、修改、删除源码、配置、测试、文档或能力边界。
- 维护文档树、同步稳定规则、处理本地规则与其他 skill 的冲突。

## 项目定位

- 本项目基于 **Nuxt 5**，通过 `pnpm.overrides` 将 `nuxt` 别名到 `nuxt-nightly@5x`。
- 本项目是 **LofiTick Desktop UI**，定位为 Tauri 桌面客户端前端层。
- 当前启用服务端渲染，`ssr: true`，以 `configs/nuxt/index.ts` 为准。
- 本仓库只有一个前端项目：`i:/Frontends/LofiTick.Desktop.UI`。
- 关联只读项目只能读取，禁止修改：
  - `I:\Desktops\LofiTickDesktop\frontend`：参考配置来源。
  - `I:\Backends\Rust\LofiTick.API`：后端 Rust API。

## 目录约定

- 前端源码位于 `app/`，Nuxt 4 兼容模式，`~` 别名指向此目录。
- `app/pages/`：页面。
- `app/components/`：组件。
- `app/composables/`：组合式函数。
- `app/stores/`：Pinia 状态管理。
- `app/assets/css/`：样式文件。
- 所有配置文件统一放在 `configs/`：
  - `configs/nuxt/`：Nuxt 配置，包括 `index.ts`、`modules.ts`、`development.ts`、`production.ts`。
  - `configs/lint/`：ESLint 与 Stylelint 配置。
  - `configs/formatting/`：Prettier 配置。
  - `configs/testing/`：Vitest 配置。
- 根目录的 `nuxt.config.ts`、`eslint.config.ts`、`prettier.config.ts`、`stylelint.config.mjs`、`vitest.config.ts` 都只是从 `configs/` 导入的代理文件，禁止直接在根目录文件中添加配置逻辑。

## 必读顺序

- 判断项目已实现能力、页面边界、桌面集成范围或是否需要新增实现前，必须优先阅读根目录 `README.md`。
- 如果根目录没有 `README.md`，按 `package.json` -> `pnpm-lock.yaml` -> `configs/nuxt/index.ts` -> `configs/nuxt/modules.ts` 的顺序补足认知。
- 任何操作前，必须优先阅读 `package.json` 与 `pnpm-lock.yaml`，禁止猜依赖或凭经验判断。
- 特别是 `configs/nuxt/index.ts`、`configs/nuxt/modules.ts` 必须先仔细阅读，避免误解现有配置。

## 安装依赖

- 安装依赖必须使用 `pnpm install --ignore-workspace`。
- 原因：父目录 `i:\Frontends\` 存在 `pnpm-workspace.yaml`。
- 禁止直接执行不带 `--ignore-workspace` 的 `pnpm install`，避免依赖装到父目录。

## 改动前门禁

- 默认仅阅读文件。
- 任何改动前，必须先提供带 Emoji、清晰的 Markdown 变更方案清单，并等待用户确认。
- 仅修改用户明确指定的文件或范围；禁止顺手修改不相关文件。
- 如果确有必要修改额外范围，必须先给出变更方案清单并等待确认。
- 当用户明确指定“只动某一层 / 某个文件 / 某个范围”或“只做某一类改动”时，必须严格以该范围为边界执行。
- 未获追加授权，禁止自行扩展到相邻层或额外范围，例如把数据改动扩展为 UI、交互、视觉、渲染方式或其他未点名模块。
- 禁止修改业务语义或对外行为，除非用户明确指示“允许改逻辑”。
- 删除或修改某个功能后，必须同步清理相关冗余残留，包括旧页面路径、旧组件、旧类型、旧工具、旧测试、旧文档、旧文案、旧注释与无调用实现。
- 禁止以“先保留着”“也许以后还用”为理由留下可确认的相关冗余。
- 当发现功能、页面片段、组件、composable、类型、工具函数或文件内容在 2 处及以上使用时，必须优先评估并提取为共享实现。
- 除非能明确证明提取后的复杂度、耦合度或维护成本明显高于分散维护成本，否则禁止重复铺开。
- 已经发现的问题、冗余、重复实现或应抽取共享点，必须继续处理到可交付完成态，禁止以“差不多”“先这样”收尾。
- 禁止执行 `git restore` 或批量回滚操作，除非用户明确指定具体文件。
- 若回滚范围模糊或涉及多个文件，必须先列出清单并询问用户。
- 代码必须简洁、优雅、高效，避免冗余与重复。
- 可以为了性能与可维护性做必要重构，但不能突破本规则。

## 文档树规则

- 本项目文档结构必须与源码树一一对应。
- `app/**`、`shared/**`、`server/**`、`i18n/**` 中每个真实存在的源码文件都要有对应 Markdown 文档。
- 目录总览使用 `index.md`，类型页使用 `index.types.md`。
- 根目录只保留 `README.md`。
- 其他目录只保留 `index.md` 作为目录入口，禁止在子目录再放 `README.md`。
- `index.md` 只能链接下一层子文档，不能跨多层直链。
- 如果目录下存在 `index.types.md`，该目录的 `index.md` 必须显式链接它。
- 只有源码中真实存在且确实承担职责的目录，才允许创建对应 `index.md`。
- 禁止为了凑层级人为新增空目录或空索引。
- 页面、组件、composable、store、共享类型、服务端 API、i18n 规则页都必须有自己的文档。
- 文档必须写清楚职责、依赖项、被谁依赖、以及和同级/父级模块的关系。
- 新增、移动、删除源码时，必须同步新增、移动、删除对应文档，并同步更新父级 `index.md` 的下一层链接。

## 规则同步

- 实现、调试或验收过程中发现新的稳定规则时，必须主动评估是否需要同步补充到规则文档。
- 稳定规则包括命名约束、输出目录、文件约定、能力边界、平台差异、调用顺序、依赖使用约定、回退策略与常见误用陷阱。
- 若判断应补充，必须先主动向用户提出“可补充到本文档”的建议，待用户确认后再修改文档。
- 禁止跳过确认直接改规则文档。

## Skill 冲突处理

- 当用户明确提到 `skills` 或要求启用某个 skill 时，优先加载对应 skill 指令。
- 如果多个 skill 的规则冲突，优先使用最近启用的 skill 规则。
- skill 指令仅作为补充，不能覆盖本项目核心约束。
