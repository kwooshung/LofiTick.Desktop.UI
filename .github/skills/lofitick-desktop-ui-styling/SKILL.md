---
name: lofitick-desktop-ui-styling
description: 'Tailwind CSS v4, Nuxt UI styling, breakpoints, arbitrary values, tokens, icon consistency, empty states, link semantics, Datetime display, and UI interaction color rules. (Tailwind CSS v4、Nuxt UI 样式、断点、任意值、token、图标一致性、空状态、链接语义、Datetime 时间展示与交互颜色规则)'
argument-hint: '请输入样式任务，例如：[Tailwind] [图标] [空状态] [链接] [时间]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# 样式、图标、空状态与时间展示

## 适用场景

- 编写或修改 Vue 模板样式、Tailwind class、Nuxt UI `ui` 配置、图标、按钮颜色、空状态、链接、时间展示。
- 处理 `app/assets/css/main.css`、断点、任意值工具类或项目级工具类。

## Tailwind 与 CSS 入口

- 本项目使用 TailwindCSS v4 语法。
- 全局样式入口为 `app/assets/css/main.css`。
- 通过 `@import 'tailwindcss';` 启用 Tailwind。
- 通过 `@import '@nuxt/ui';` 接入 Nuxt UI 样式。
- 同时引入 `vue-transitions.css`。
- 编写样式优先级：
  1. 优先在模板里使用 Tailwind utility。
  2. 需要全局或跨组件复用的基础样式与工具类，新增到 `app/assets/css/main.css`，例如 `@utility`。
  3. 页面或组件局部样式再考虑 `scoped`，仅在确有必要且能说明边界时使用。
- 不要为了“写得像传统 CSS”而回退到大段自定义 CSS。

## 项目级工具类

- 新增项目级工具类的条件是：该命名类在仓库中被引用超过一次，即大于 1 次。
- 单次使用的特殊尺寸，应优先评估为合理例外或保留方括号写法，并在变更清单中说明。
- 编写 `class` 时，必须优先使用 Tailwind CSS v4 内置 utility class。
- 只有内置 utility 无法准确表达需求时，才允许补充项目级 `@utility` 或局部样式。

## 断点与任意值

- 断点来自 `app/assets/css/main.css` 的 `@theme` 定义。
- 除 Tailwind 默认断点外，项目额外提供 `3xl: 120rem`（1920px）与 `4xl: 130rem`（2080px）。
- 还包含 `5xl` 到 `8xl`，具体以 `main.css` 为准。
- 使用方式是在 class 中写 `3xl:...`、`4xl:...`，例如 `3xl:grid-cols-5`。
- 禁止在 class 中使用带方括号的任意值工具类作为断点限定，例如 `4xl:w-[30rem]`、`3xl:gap-[22px]`、`5xl:translate-x-[1.5rem]`。
- 所有响应式尺寸与间距必须使用项目在 `main.css` 中定义的断点、命名工具类或 CSS 变量。
- 若确有非常特殊的尺寸需求，必须先在 `main.css` 中新增明确命名的工具类，并在变更清单中说明。
- 禁止直接在组件内使用响应式方括号写法。
- Tailwind CSS v4 中所有使用 `[]` 的任意值写法，只有在项目本地没有对应命名类、Tailwind 官方也没有对应内置 utility class 时才允许使用。
- 只要本地或官方存在可用 class，必须优先使用已有 class。
- 变更前必须自查并替换未审核的任意值样式。
- PR 描述中需列出全部替换点与理由。

## Token 与默认色

- 禁止新增硬编码颜色、字体、阴影等设计 token。
- 必须复用现有 Tailwind tokens、Nuxt UI 主题能力与项目已有工具类。
- 默认文本/背景颜色禁止直接显式指定 `text-default` / `bg-default`，除非确有组件边界、主题覆盖或第三方样式对齐等必要原因。
- `text-default/xx` 与 `bg-default/xx` 这类透明度语义不属于默认色回填。
- `text-default/xx` 与 `bg-default/xx` 允许用于分隔符、遮罩、弱背景等真实语义场景，禁止误删。

## 图标规则

- 当前项目全局默认使用 `lucide` 线条图标。
- 禁止混用填充图标、品牌图标、`mdi`、`material-symbols`、`tabler`、`proicons`、`file-icons` 等不同线条粗细或填充风格的图标。
- 确需品牌标识时，必须先在变更清单中说明原因并等待确认。
- 同一语义动作必须使用同一个图标。
- 最终判定标准是渲染后的视觉一致性，不是类名是否看起来一致。
- 刷新/同步统一使用 `i-lucide:refresh-cw`。
- 重置/恢复默认统一使用 `i-lucide:rotate-ccw`。
- 打开外链统一使用 `i-lucide:external-link`。
- 打开/选择目录统一使用对应 `folder-*` 线条图标。
- 保存统一使用 `i-lucide:save`。
- 删除统一使用 `i-lucide:trash-2`。
- 取消统一使用 `i-lucide:x`。
- 确认统一使用 `i-lucide:check`。
- 新增动作前必须先搜索现有同语义图标。
- 禁止同一个动作在两个地方用不同图标。
- 图标一致性的验收标准必须看实际渲染效果，不能只看 token、类名或图标名称一致。
- 如果两枚按钮代码上同样的图标和同样的颜色类，实际呈现仍有差异，需要按渲染结果继续调到视觉一致。

## 按钮与图标颜色

- 图标按钮若只需要调整图标颜色，必须通过 Nuxt UI 的 `ui.leadingIcon` / `ui.trailingIcon` 等图标插槽样式处理。
- 禁止把颜色 class 写到按钮根节点导致文字一起变色。
- 按钮图标颜色默认应保持与按钮内容协调的浅色层级。
- 当前项目通常使用 `ui.leadingIcon: 'text-muted'` 或等价 slot class。
- 当按钮本身是高对比实色语义按钮时，图标应优先采用白色或与按钮语义匹配的可读性颜色。
- 禁止一刀切把所有按钮图标都固定成 `text-muted`。
- 禁止让同语义按钮在不同位置出现明显不同的图标层级。
- 如果按钮图标或输入框 leading/trailing 图标在默认主题下已经是最合适、最清楚的颜色，就不要人为干预。
- `UInput`、`UInputTime`、`USelect` 这类输入控件的前后装饰图标，默认优先保持组件自身主题输出。
- 只有在明确需要强调语义或对比度时，才允许覆盖颜色。
- 删除、重置等危险操作按钮默认状态不得直接使用危险色。
- 危险操作按钮仅允许在 hover、focus、active 等交互态显式变为危险色。
- 二次确认内的最终确认按钮除外。

## Chrome 校准引导

- Chrome 校准引导里的“复制扩展目录”按钮必须放在弹窗标题区或同级操作区。
- 不得在正文里重复展示完整扩展目录路径。
- 正文只保留步骤与风险提示。

## 空状态

- 任何“暂无数据 / 暂无内容 / 空列表 / 无结果”的 UI，必须优先使用 Nuxt UI 的 `UEmpty` 组件表达。
- `UEmpty` 可配置 `title`、`description`、`icon`、`actions`、`variant`、`size`。
- 禁止只写一行占位文本。
- 空状态文案必须准确指向当前页面或区域的真实操作入口。
- 禁止写会误导用户的指引。
- 如果存在可执行动作，例如刷新、新建、添加，优先使用 `UEmpty` 的 `actions` 或插槽承载按钮。
- 仅当用户明确要求“就写一句话即可”时，才允许使用纯文本占位。

## 链接语义

- 纯导航场景必须优先使用 `ULink` 或带 `to` / `href` 的链接型组件。
- 禁止把只是跳转路由或打开链接的交互默认写成 `UButton + onClick + navigateTo`。
- 用户点击后的本质是进入另一个页面、路由或外部地址时，应保留链接语义。
- 保留链接语义可以获得正确的可访问性、中键新开、右键复制链接与预取能力。
- 如果视觉上需要按钮样式，但语义仍然是导航，允许使用带 `to` / `href` 的 `UButton`。
- 重点是保留链接语义，不是强行改成 `ULink`。
- 当 `ULink` 承接原本无下划线的文本按钮样式时，必须优先使用 `raw` 去掉 Nuxt UI 默认底边装饰。
- 再显式加 `no-underline`，最后按交互需要补 `hover:underline`。
- 禁止把组件默认底边线和自定义下划线叠在一起。
- 排序、复制、开关、提交、弹窗、详情展开、调用 Tauri 能力等动作型交互继续使用 `UButton`。
- 禁止为了统一外观而把动作交互误建模成链接。

## 时间展示

- 前端展示后端时间时，优先复用统一的 `Datetime` 组件。
- 避免在页面里手写时区换算或相对时间计算。
- 后端若返回时间字段，默认要求为明确带 `Z` 的 UTC ISO 8601 字符串。
- 前端负责自动转换为当前时区显示。
- 前端不负责猜测无时区文本到底是 UTC 还是本地时间。
- 禁止把 API 返回的 `YYYY-MM-DD HH:mm:ss`、`YYYY-MM-DD HH:mm` 这类无时区文本长期当作稳定契约继续扩散。
- 发现此类接口时，应优先推动后端改成 UTC ISO 输出，而不是在前端补更多解析特例。
- 同类页面时间展示口径必须一致。
- 若诗词、热搜、设置页等都走 `Datetime`，其入参时间格式也必须尽量统一。

## 参考入口

- Nuxt UI 文档：https://ui.nuxt.com/
