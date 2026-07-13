---
name: lofitick-desktop-ui-design
description: 'Root routing skill for LofiTick.Desktop.UI design tasks: brand, design system, UI styling, slides, banners, and visual design. (LofiTick.Desktop.UI 设计规范根索引：按品牌、设计系统、UI 样式、幻灯片、横幅与视觉设计加载子 skill)'
argument-hint: '请输入设计任务领域，例如：[品牌] [设计系统] [UI 样式] [幻灯片] [横幅]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# LofiTick.Desktop.UI 设计 Skill 根索引

本文件是 `LofiTick.Desktop.UI` 设计规则的唯一 `skill` 索引入口。执行设计任务时只加载最相关的子 `skill`，避免一次性加载完整设计规范。

## 何时使用

- 处理 `LofiTick.Desktop.UI` 的品牌、设计系统、UI 样式、幻灯片、横幅、视觉资产或设计规范维护任务时使用。
- 先按任务主责加载一个子 `skill`；任务跨边界时，再加载相邻子 `skill`。
- 禁止为了“保险”加载全部子 `skill`。

## Skill 索引

| 任务领域                                            | 按需加载                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 品牌语气、视觉识别、信息框架、资产管理、品牌一致性  | [`lofitick-desktop-ui-design-brand`](../lofitick-desktop-ui-design-brand/SKILL.md)           |
| 设计 `token`、组件规格、`CSS` 变量、间距与排版尺度  | [`lofitick-desktop-ui-design-system`](../lofitick-desktop-ui-design-system/SKILL.md)         |
| `UI` 样式、可访问性、响应式布局、主题、暗色模式     | [`lofitick-desktop-ui-design-ui-styling`](../lofitick-desktop-ui-design-ui-styling/SKILL.md) |
| 幻灯片、`HTML` 演示、`Chart.js`、图表叙事、社媒视觉 | [`lofitick-desktop-ui-design-slides`](../lofitick-desktop-ui-design-slides/SKILL.md)         |
| 横幅、广告、网站首屏、创意资产、社媒封面、印刷物料  | [`lofitick-desktop-ui-design-banner`](../lofitick-desktop-ui-design-banner/SKILL.md)         |

## 维护规则

- 新增、修改、删除设计类 `skill` 时，必须同步检查本索引。
- 子 `skill` 的 `name` 必须与文件夹名一致，使用 `lowercase kebab-case`；`description` 必须包含触发关键词，便于按需发现。
- 正文中的路径、文件名、目录名、命令、包名、框架名、函数名、类型名、组件名、配置项、环境变量、`skill` 名称与根索引名称，都必须使用反引号包裹。
- 单个子 `skill` 应保持聚焦；如果一个 `SKILL.md` 开始混入多个无关主题，必须继续拆分。
- 禁止保留“大而全”的默认 `skill`；禁止在子 `skill` 中维护跨 `skill` 索引。
- 只要对设计类 `skill` 有增删改，都要及时更新本索引，使用 `Markdown` 链接维护入口收口，并清理重复规则，确保整个 `skill` 系统一致可靠。
