---
name: lofitick-desktop-ui-i18n
description: 'Internationalization rules for LofiTick.Desktop.UI: zh.cn source of truth, zh.tw/en/ja key alignment, translation quality, and no te() runtime probing. (LofiTick.Desktop.UI 国际化规则：zh.cn 主语言、zh.tw/en/ja key 对齐、翻译质量与禁止 te() 运行时探测)'
argument-hint: '请输入 i18n 任务，例如：[新增文案] [翻译对齐] [缺失 key]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# i18n 规则

## 适用场景

- 新增、修改、审查页面或组件文案。
- 维护 `i18n/zh.cn.ts`、`i18n/zh.tw.ts`、`i18n/en.ts`、`i18n/ja.ts`。
- 处理缺失翻译键、运行时翻译探测、语言配置。

## 文件与主语言

- `i18n` 始终以 `i18n/zh.cn.ts` 为准。
- 简体中文是主语言。
- 除简体中文外，`zh.tw.ts`、`en.ts`、`ja.ts` 必须与 `zh.cn.ts` 一一对应。
- 其他语言不能多 key，也不能少 key。
- 语言文件目录为 `i18n/`。
- 文件命名固定为 `zh.cn.ts`、`zh.tw.ts`、`en.ts`、`ja.ts`。

## Locale 配置

- locale 配置在 `configs/nuxt/index.ts` 的 `i18n` 字段。
- 默认语言为 `zh_cn`。
- 当前 locale 包括：
  - `zh_cn`：简体中文，`zh.cn.ts`。
  - `zh_tw`：繁体中文（台湾），`zh.tw.ts`。
  - `en`：English，`en.ts`。
  - `ja`：日本語，`ja.ts`。

## 翻译质量

- 翻译必须准确、自然、精炼。
- 禁止生硬直译。
- 英文必须优先做到精准、简洁、可直接使用。
- 修改任意语言文案时，必须同步检查四语 key 是否完全对齐。

## 禁止运行时探测 key

- Vue 页面和组件中禁止使用 `te(...)` 探测某个翻译键是否存在再分支渲染。
- 应直接使用 `t(...)`。
- 如果 key 缺失，先补齐四语 i18n 文案，再使用该 key。
- 禁止用运行时探测键存在性来兜底。

## 审计脚本

- 可使用 `pnpm audit:i18n` 执行 i18n 审计。
- 运行脚本前仍需遵守项目脚本执行规则，默认使用项目 package script。
