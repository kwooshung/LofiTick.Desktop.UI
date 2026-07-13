---
name: 'lofitick-desktop-ui-coding'
description: 'LofiTick.Desktop.UI GitHub Copilot skill 根索引。按 Nuxt 页面、组件、useApi、i18n、Tauri、Tailwind、类型、server API 或 skill 维护任务加载子 skill，降低 token 消耗。'
argument-hint: '[task area]'
---

# LofiTick.Desktop.UI 技能

本文件是唯一子 `skill` 索引入口。只按当前任务加载最相关的子 `skill`，避免一次性加载完整工程规范。

## 何时使用

- 处理 Nuxt 页面、组件、composable、store、server API、i18n、配置、测试或 Tauri 集成任务时，先按任务类型选择子 `skill`。
- 任务横跨多个边界时，先加载主责 `skill`，再按实际需要加载相邻 `skill`。
- 不要为了“保险”加载所有规则。

## Skill 索引

## 维护规则

- 新增、修改、删除代码、配置、测试或能力边界时，必须同步检查最相关的子 `skill` 是否需要更新。
- 发现可复用组件、composable、store、工具、类型、API/Tauri 封装或第三方依赖后，必须记录到对应子 `skill`，说明职责、复用入口、适用边界和禁止重复实现的原因。
- 新增稳定规则时，放入最贴近职责的子 `skill`；只有新增、删除或重命名子 `skill` 时才更新本索引。
- 子 `skill` 的 `name` 必须与文件夹名一致，使用 `lowercase kebab-case`；`description` 必须包含触发关键词，便于按需发现。
- 单个子 `skill` 应保持聚焦；如果一个 `SKILL.md` 开始混入多个无关主题，必须继续拆分。
- 禁止保留“大而全”的默认 `skill`；禁止在子 `skill` 中维护跨 `skill` 索引。
- 只要对 skill 有了增删改，都要及时更新 `lofitick-desktop-ui-coding` 这个 `skill` 索引，要用 `md 链接`、维护入口收口，并清理重复规则，确保整个 Skill 系统的一致性和可靠性。
