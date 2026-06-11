# LofiTick Desktop UI - GitHub Copilot 指令

# GitHub Copilot 使用说明

> **声明（强制）**
>
> - 本文档内所有规则均为强制要求，必须逐条严格遵守。
> - 任何"为了省时间"而省略步骤、或"为了迎合需求"而妥协规则的行为，都是禁止的。

## 目录

- [1. 项目与工作区](#1-项目与工作区)
- [2. 执行流程（改动前门禁）](#2-执行流程改动前门禁)
- [2.1 规则同步（强制）](#21-规则同步强制)
- [3. 工程与依赖约束](#3-工程与依赖约束)
- [3.2.1 导入路径（强制）](#321-导入路径强制)
- [4. API 请求规范](#4-api-请求规范)
- [5. TypeScript 与注释规范](#5-typescript-与注释规范)
- [6. Pages 特例（零容忍）](#6-pages-特例零容忍)
- [7. i18n 规则](#7-i18n-规则)
- [8. Tauri 集成规范](#8-tauri-集成规范)
- [9. Skills 与冲突处理](#9-skills-与冲突处理)
- [10. 参考与示例](#10-参考与示例)

---

## 1. 项目与工作区

- 本项目基于 **Nuxt 5**（nightly 日更版，通过 `pnpm.overrides` 将 `nuxt` 别名到 `nuxt-nightly@5x`）。
- 本项目是 **LofiTick Desktop UI**，定位为 Tauri 桌面客户端的前端层，当前启用服务端渲染（`ssr: true`，以 [configs/nuxt/index.ts](configs/nuxt/index.ts) 为准）。
- 本仓库只有一个前端项目，路径为 `i:/Frontends/LofiTick.Desktop.UI`。
- 关联只读项目（**只能读取，不能修改**）：
  - `I:\Desktops\LofiTickDesktop\frontend` — 参考配置来源
  - `I:\Backends\Rust\LofiTick.API` — 后端 Rust API

### 1.1 目录约定（强制先确认）

- 前端源码位于 `app/`（Nuxt 4 兼容模式，`~` 别名指向此目录）：
  - `app/pages/` — 页面
  - `app/components/` — 组件
  - `app/composables/` — 组合式函数
  - `app/stores/` — Pinia 状态管理
  - `app/assets/css/` — 样式文件
- 所有配置文件统一放在 `configs/` 目录：
  - `configs/nuxt/` — Nuxt 配置（index.ts, modules.ts, development.ts, production.ts）
  - `configs/lint/` — ESLint + Stylelint 配置
  - `configs/formatting/` — Prettier 配置
  - `configs/testing/` — Vitest 配置
- 根目录的 `nuxt.config.ts`、`eslint.config.ts`、`prettier.config.ts`、`stylelint.config.mjs`、`vitest.config.ts` 均是从 `configs/` 导入的代理文件，**禁止直接在根目录文件中添加配置逻辑**。

### 1.2 必须先读配置（强制）

- 项目文档导航：[README.md](../README.md)
- 强制：在判断项目已实现能力、页面边界、桌面集成范围与是否需要新增实现前，必须优先阅读根目录 `README.md`；若根目录暂不存在 `README.md`，则按 `package.json` -> `configs/nuxt/index.ts` -> `configs/nuxt/modules.ts` 的顺序补足项目能力认知，禁止跳过这条检查链直接凭经验下结论。
- 任何操作前，必须优先阅读 `package.json`，不要猜依赖、不要靠经验拍脑袋。
- 特别是 `configs/nuxt/index.ts`、`configs/nuxt/modules.ts` 必须先仔细阅读，避免误解现有配置。

### 1.3 安装依赖（强制）

- 必须使用 `pnpm install --ignore-workspace`，因为父目录 `i:\Frontends\` 存在 `pnpm-workspace.yaml`。
- **禁止**直接执行 `pnpm install`（不加 `--ignore-workspace`），会将依赖装到父目录。

---

## 2. 执行流程（改动前门禁）

- 默认仅阅读文件；任何改动前，必须先提供变更清晰的 Markdown 方案清单（必须带 Emoji，但不能滥用），待我确认后方可执行。
- 仅修改我明确指定的文件或范围；禁止顺手修改不相关文件。若确有必要，必须先给出变更方案清单并等我确认。
- 强制：当我明确指定"只动某一层 / 某个文件 / 某个范围"或"只做某一类改动"时，必须严格以该范围为边界执行；未获得追加授权，禁止自行扩展到相邻层或额外范围（例如把数据改动扩展为 UI、交互、视觉、渲染方式或其他未点名模块的改动）。
- 禁止修改业务语义或对外行为（除非我明确指示"允许改逻辑"）。
- 强制：只要删除某个功能或修改某个功能，处理完成后必须同步清理该功能相关的全部冗余残留，包括但不限于旧页面路径、旧组件/类型/工具、旧测试、旧文档、旧文案、旧注释与无调用实现；禁止以"先保留着""也许以后还用"为理由留下任何可确认的相关冗余。
- 强制：当发现某个功能、页面片段、组件、composable、类型、工具函数或文件内容在 2 处及以上使用时，必须优先评估并提取为共享实现；除非能够明确证明"提取后的复杂度、耦合度或维护成本明显高于各自单写"，否则禁止重复铺开同类实现。
- 强制：你是人工智能，不允许模仿人类式偷懒；凡是已经发现的问题、冗余、重复实现或应当抽取的共享点，都必须继续处理到可以交付的完成态，禁止以"差不多""先这样"作为收尾标准。
- 禁止执行 `git restore` 或批量回滚操作：
  - 除非我明确指定具体文件；
  - 若处理范围模糊或涉及多个文件，必须先列出清单并询问我。
- 代码必须简洁、优雅、高效，避免冗余与重复；遵循最佳实践与设计模式；为了性能与可维护性可进行必要重构，但不能突破本规则。

### 2.1 规则同步（强制）

- 强制：当在实现、调试、验收或对话过程中发现新的"稳定规则"时，必须主动评估是否需要同步补充到本文档，而不是等待用户反复提醒。
- 强制：这里的"稳定规则"包括但不限于：命名约束、输出目录/文件约定、能力边界、平台差异、调用顺序、依赖使用约定、回退策略与常见误用陷阱。
- 强制：若判断应当补充，必须先主动向用户提出"可补充到本文档"的建议，待用户确认后再修改本文档；禁止跳过确认直接改文档。

---

## 3. 工程与依赖约束

### 3.1 ESM 编码风格（强制）

- `package.json` 为 `"type": "module"`：只能写 ESM。
- 禁止写 CommonJS：禁止 `require()` / `module.exports` / `exports.xxx`。
- 涉及路径时：禁止假设 `__dirname` 存在；需要路径时使用 ESM 方式（`import.meta.url` + `URL`/`fileURLToPath`）。

### 3.2 自动导入（Nuxt 5）（强制：先确认再补 import）

- Nuxt 5 配置了自动导入部分模块（例如 `composables/`、`stores/`）。
- 如果你发现变量/函数未显式导入：先确认是否 Nuxt 自动导入导致的；不要擅自补 import。
- 在 `app/` 的 Nuxt 编译上下文中，Vue 组合式 API（例如 `ref`/`computed`/`watch`/生命周期函数等）默认已通过 auto-import 全局可用；不要再显式 `import ... from "vue"`。
- 强制：在 `app/**` 的 Nuxt 运行时上下文中，只要某个值/类型已经出现在 `.nuxt/imports.d.ts`，就禁止再显式从 `vue`、`#imports`、`@/composables/**`、`@/stores/**` 导入同一符号；应直接使用自动导入。
- 强制：`app/composables/**`、`app/stores/**`、以及其导出的类型/接口/类型别名，只要已进入 `.nuxt/imports.d.ts`，在 `app/**` 内就应优先直接使用；禁止为了"看起来更明确"再补一层显式 import。
- 该规则以 `.nuxt/imports.d.ts` 的生成清单为准；不确定时优先查该文件再决定是否补 import。
- `app/pages/**` 与 `app/components/**` 中，凡是可由 Nuxt 自动注册的本地 `.vue` 组件，禁止显式 `import xxx from './xxx.vue'` 或 `../index.vue` 这类写法；优先直接在模板中使用组件名。
- 页面层级职责强制：父级路由文件（例如 `app/pages/foo.vue` 或 `app/pages/foo/index.vue`）不能承载某个子路由页面的完整业务实现；子路由页面必须在各自目录中独立实现，禁止通过子页反向导入父页页面来复用整页逻辑。
- `resolveComponent(...)` 只允许用于真正需要动态渲染或动态映射的场景，例如表格列、运行时按配置切换组件类型、渲染函数中必须拿到组件引用的地方；如果只是静态使用 Nuxt UI 组件或本地组件，必须直接用模板标签或正常静态写法，禁止为了“看起来统一”滥用 `resolveComponent`。
- 共享类型的全局导入入口固定为 `shared/types/index.types.ts`：凡是需要被页面、组件、composable 高频复用的共享类型，必须先汇总到该文件，再交给 Nuxt 自动导入；禁止在 `app/**` 中长期保留本可通过全局导入获得的 `@@/shared/types/**` 显式 `import type`。
- 共享值/工具的全局导入入口固定为 `shared/utils/index.ts`：凡是需要被页面、组件、composable 高频复用的常量、枚举值、纯工具函数，必须先确认是否已经从该总出口导出；不要因为"当前文件报未定义"就直接在局部补 `import`。
- 如果怀疑是"没有全局导入"而不是"类型/变量不存在"，排查顺序固定为：`shared/types/index.types.ts` / `shared/utils/index.ts` -> `.nuxt/imports.d.ts` -> `pnpm exec nuxi prepare`；禁止跳过这条检查链直接下结论。
- Vue SFC 宏例外（强制）：`defineProps<T>()`、`defineEmits<T>()`、`defineSlots<T>()`、`defineModel<T>()` 这类编译期宏所使用的类型参数，必须优先使用当前文件可静态解析的显式 `import type`；不要依赖 Nuxt 的全局自动导入类型去喂给这些宏，否则可能出现 `Unresolvable type reference` 编译错误。
- 事件定义顺序（强制）：如果组件存在事件定义，`defineEmits(...)` 必须写在 `defineProps(...)` 之后，并且保持 `<script setup>` 顶层；不要把事件定义放到 props 之前或函数体内部。

- 模板引用选择（强制）：在 `<script setup>` 中获取 DOM 或组件引用时，优先使用 `ref` 同名变量自动绑定（Vue 编译器自动识别顶层同名 `ref` 与模板 `ref` 属性）；只有当场景需要动态 ref 名（`:ref="dynamicName"`）或非顶层作用域绑定时，才使用 `useTemplateRef()`。不要在常规场景下为了"显得高级"而刻意使用 `useTemplateRef`。

- 模板 props 访问（强制）：在 Vue 模板里，能不用 `props.xxx` 就不用；优先在 `<script setup>` 中把会直接用于模板展示的字段直接解构成局部常量或计算属性，再在模板中直接使用这些标识符。开始写之前必须先到 `package.json` / lockfile 确认当前 Vue 版本；当前仓库锁定 Vue 3.5.35。Vue 3.5+ 下，能直接从 `defineProps(...)` 解构并保持响应式时，优先直接解构，只有在需要整体透传、动态 key 访问、对象级遍历或确实必须保持对象语义时，才保留 `props` 或改用 `toRefs`。
- 模板内联定义（强制）：凡是只服务于当前模板、且不会被复用的静态对象或静态配置，优先直接写在模板属性里；不要为了“整洁”把它们提到 `<script setup>` 里再绕一层常量或计算属性。

- Vue 页面与组件中，禁止使用 `te(...)` 先判断翻译键是否存在再决定是否调用 `t(...)`；应直接调用 `t(...)`，缺失的翻译键必须补齐到对应 `i18n` 文件，禁止用运行时探测键存在性来兜底。

### 3.2.1 导入路径（强制）

- 强制：在本项目运行时代码目录 `app/**`、`shared/**`、`server/**`、`i18n/**` 中，只要导入目标属于当前项目内部模块，就禁止继续使用相对路径 `./`、`../`；必须改为别名路径。
- 强制：`app/**` 下的内部模块统一使用 `@/` 别名；跨到项目根其他目录（例如 `shared/**`、`server/**`、`i18n/**`、`app/**`）统一使用 `@@/` 别名。
- 强制：不要在同一文件里混用"相对路径 + 别名路径"去引用当前项目内部模块；一旦属于当前项目内部导入，统一按 `@/` 或 `@@/` 收口。
- 例外：`configs/**`、`scripts/**`、根级配置文件以及其他 Node/工具链上下文，不能机械套用 `@/`、`@@/`；必须先确认该执行环境支持对应别名，再决定是否改写。

### 3.3 实现优先级（强制）

- 强制：在实现任何功能、页面、组件、composable、store、shared type、工具函数或 API 封装之前，必须先检查仓库内是否已经存在可复用的"轮子"（包括但不限于：`app/components/**`、`app/composables/**`、`app/stores/**`、`app/types/**`、`shared/**`、现有 Nuxt auto-import 项、现有 Tauri 封装与现有 API composable）。
- 强制：只要现有实现能够满足当前需求或经小范围扩展即可满足，就必须优先复用；禁止复制粘贴近似逻辑、平行新增重复组件/重复 composable/重复工具函数，或为已有能力再造一层语义重复的封装。
- 强制：只要某段实现已经在 2 处及以上出现，并且提取为共享实现后的收益不低于分散维护成本，就必须收敛为共享能力；禁止明知重复仍继续铺开第二套、第三套实现。
- 强制：若判断必须新增实现，必须先确认并说明现有轮子为何不适用（职责边界不符、运行环境不符、类型约束不符、交互语义不同、性能或可维护性原因等）；不能说明清楚时，默认视为必须复用现有实现。
- 能用 `es-toolkit` 一定要优先使用，避免冗余代码：
  - 必须确认 `es-toolkit` 官方文档支持且不是实验性功能，也不是"为兼容 lodash"的功能。
  - 在方案清单里要写清楚用到 `es-toolkit` 的哪些能力。
- 若 `es-toolkit` 不支持，再考虑 `VueUse`。
- 但如果是"同一能力两者都能做"（例如防抖/节流）：不是"谁优先"的问题，而是"谁更适合当前运行环境/场景"的问题（见 3.5）。
- 遇到不确定情况：先查官方文档；仍不确定就先问我，不要自行拍脑袋。

### 3.4 脚本执行（强制）

- 需要执行脚本时默认使用 `node`；不要用 `python`，除非我明确指示。

### 3.5 防抖/节流（强制：禁止手写）

- 禁止用 `setTimeout/clearTimeout` 自己写 debounce/throttle。
- `@vueuse/nuxt` 与 `es-toolkit` 都能做到防抖/节流时：不是"谁优先"，而是"谁更适合"。
  - Vue/Nuxt 组件（`*.vue`）：更适合用 `VueUse`（例如 `useDebounceFn`，项目已启用 `@vueuse/nuxt`），更贴合组合式与生命周期。
  - 纯 TS 工具函数 / Node 脚本：更适合用 `es-toolkit`（例如 `debounce`），避免引入 Vue 运行时语义。
  - 如果两者都可用且你不确定：必须先说明你选择的理由与取舍，再让我拍板。

### 3.6 CSS 与断点（强制）

- 本项目使用 TailwindCSS（v4 语法），全局样式入口为 [`app/assets/css/main.css`](../app/assets/css/main.css)：
  - 通过 `@import 'tailwindcss';` 启用 Tailwind。
  - 通过 `@import '@nuxt/ui';` 接入 Nuxt UI 的样式。
  - 同时引入了过渡样式（`vue-transitions.css`）。
- 编写样式时的优先级（从高到低）：
  1. 优先在模板里使用 Tailwind utility（不要为了"写得像传统 CSS"而回退到大段自定义 CSS）。
  2. 需要全局/跨组件复用的基础样式与工具类，新增到 [`app/assets/css/main.css`](../app/assets/css/main.css)（例如 `@utility`）。
  3. 页面/组件局部样式再考虑 `scoped`（仅在确有必要且能说明边界时）。
- 编写 `class` 时，必须优先使用 Tailwind CSS v4 内置 utility class；只有当内置 utility 无法准确表达需求时，才允许补充项目级 `@utility` 或局部样式。
- 断点来自 [`app/assets/css/main.css`](../app/assets/css/main.css) 的 `@theme` 定义，除 Tailwind 默认断点外，项目额外提供：
  - `3xl`：`120rem`（1920px）
  - `4xl`：`130rem`（2080px）
  - （还包含 `5xl~8xl`，以该文件为准）
    使用方式：在 class 中写 `3xl:...`、`4xl:...`（例如 `3xl:grid-cols-5`）。
- 禁止新增硬编码的颜色/字体/阴影等设计 token；必须复用现有 Tailwind tokens、Nuxt UI 主题能力与项目已有工具类。

### 3.7 空状态（强制）

- 任何"暂无数据/暂无内容/空列表/无结果"的 UI：必须优先使用 Nuxt UI 的 `UEmpty` 组件表达（可配置 `title/description/icon/actions/variant/size`），禁止只写一行占位文本。
- 空状态文案必须准确指向当前页面/区域的真实操作入口，禁止写会误导用户的指引。
- 若存在可执行动作（例如"刷新/新建/添加"）：优先使用 `UEmpty` 的 `actions` 或插槽承载按钮。
- 仅当我明确要求"就写一句话即可"时，才允许使用纯文本占位。

### 3.8 链接语义（强制）

- 纯导航场景必须优先使用 `ULink` 或带 `to` / `href` 的链接型组件；禁止把"只是跳转路由/打开链接"的交互默认写成 `UButton + onClick + navigateTo`。
- 只要用户点击后的本质是"进入另一个页面 / 路由 / 外部地址"，就应保留链接语义，以便获得正确的可访问性、中键新开、右键复制链接与预取能力。
- 若视觉上需要按钮样式，但语义仍然是导航：允许使用带 `to` / `href` 的 `UButton`；这类场景不必强行改成 `ULink`，重点是保留链接语义，而不是组件名。
- 当 `ULink` 承接原本无下划线的文本按钮样式时，必须优先使用 `raw` 去掉 Nuxt UI 默认的底边装饰，再显式加 `no-underline`，最后按交互需要补 `hover:underline`；禁止把组件默认底边线和自定义下划线叠在一起。
- 排序、复制、开关、提交、弹窗、详情展开、调用 Tauri 能力等"动作型交互"继续使用 `UButton`；禁止为了统一外观而把动作交互误建模成链接。

### 3.9 时间字段消费规则（强制）

- 强制：前端展示后端时间时，优先复用统一的 `Datetime` 组件，避免在页面里手写时区换算或相对时间计算。
- 强制：后端若返回时间字段，默认要求其为明确带 `Z` 的 UTC ISO 8601 字符串；前端负责自动转换为当前时区显示，不负责猜测无时区文本到底是 UTC 还是本地时间。
- 禁止：把 API 返回的 `YYYY-MM-DD HH:mm:ss`、`YYYY-MM-DD HH:mm` 这类无时区文本长期当作稳定契约继续扩散；发现此类接口时，应优先推动后端改成 UTC ISO 输出，而不是在前端补更多解析特例。
- 强制：同类页面的时间展示口径必须一致；若诗词、热搜、设置页等都走 `Datetime`，则其入参时间格式也必须尽量统一。
- Vue 3.5+ 组件中，`withDefaults(defineProps(...))` 应优先改为直接解构默认值的写法；能用 `const { a = 1 } = defineProps<...>()` 就不要再保留 `withDefaults`，模板里也优先直接使用解构出的标识符。
- `props` / `defineProps` 必须放在 `import` 之后、`<script setup>` 顶层，不允许藏在函数体里或条件分支里。
- 只在确实会用到时才解构 props；如果某个属性不会被脚本或模板使用，就不要把它从 `defineProps` 里解构出来。

---

## 4. API 请求规范

> 本项目所有 API 请求统一走 Nitro（Nuxt Server）代理：前端只请求同源 `/api/**`，由 Nitro 转发到外部 Rust 后端。

### 4.1 API 地址（强制）

- Rust API 基础地址通过环境变量 `NUXT_PUBLIC_API_BASE` 注入（对应 `useRuntimeConfig().public.apiBase` 的默认来源），禁止在代码中硬编码 URL。
- 统一代理规则：`/api/**` -> `${NUXT_PUBLIC_API_BASE}/**`（后端不带 `/api` 前缀）。
- 禁止为每个 API 路径单独维护代理规则；只能维护这一条统一代理。
- 部署约束：生产环境必须以 `nuxt build` + `nuxt preview`（或等价的 Nitro/Node 常驻服务）运行；`nuxt generate` 的纯静态产物无法承担 server 代理能力。

### 4.2 useApi（强制：零容忍）

- 所有 API 请求必须通过统一的 composable 封装（例如 `app/composables/useApi`）发起。
- 禁止在组件模板或业务逻辑中直接裸调 `$fetch` / `useFetch` / `fetch`。
- API composable 禁止写在函数体内：必须在 `setup` 顶层声明。
- API composable 返回值必须解构取需要字段；禁止整体接收对象。

#### 4.2.1 SSR 首屏数据（强制：零容忍）

- 只要页面在"首次打开时就应该看到数据"，该请求就必须作为 SSR 首屏请求处理：必须在 `setup` 顶层通过 `await useApi(..., { immediate: true })` 声明，并保证服务端首包就返回真实数据。
- 禁止把这类首屏数据请求降级为 `onMounted`、事件回调或其他仅客户端触发的补请求；禁止用"先渲染空壳，再等客户端补数据"的方式规避 SSR。
- `useApi` / 代理层 / 签名链路的实现必须兼容 SSR 首包：即使请求需要签名、cookie 或 CSRF，自定义封装也必须让服务端首包拿到真实结果，不能因为手动 `refresh()`、上下文丢失或 client-only 分支导致 HTML 首屏缺数。
- 只要首开失败属于"签名过期 / 签名不匹配 / CSRF 缺失或不匹配 / Nuxt 同源 CSRF 拒绝"这类可自动自愈一次的安全错误，首次失败必须静默完成自愈与重试；禁止在最终结果未确定前先弹 API 错误 toast。
- 只有用户主动触发、非首屏必需、或会造成不必要 SSR 开销的请求，才允许继续使用 `immediate: false`。
- 任何 SSR 问题都必须优先排查并修复根因，禁止无脑使用 `ClientOnly` 作为默认解法；`ClientOnly` 仅允许作为最后兜底手段，在确实没有其他可行方案时才使用。

#### 4.2.2 Composables 顶层调用（强制：零容忍）

- 任何返回实例/句柄/方法的 `useXxx`：必须在 `setup` 顶层调用。
- 禁止在任意函数体内调用，包括但不限于：`onMounted/onBeforeUnmount/watch/watchEffect` 回调、事件回调、普通工具函数等。

#### 4.2.3 句柄与响应式（强制）

- 订阅函数返回的"取消订阅句柄"（例如 `unsubscribe`）、计时器句柄等运行时句柄：默认使用普通变量保存（`let unsubscribe: null | (() => void) = null`），不要强行改成 `ref/shallowRef`。
- 是否使用响应式的判断标准：是否需要驱动模板渲染/被 `watch` 追踪/参与计算属性；仅用于生命周期清理的句柄不需要响应式。
- 注释必须反映真实语义；如果实现是普通变量，就用"变量/句柄"，不要误标为"状态"。

#### 4.2.4 useApi 限流（强制）

- `useApi` 返回值已内建限流句柄：`refreshDebounced`、`retryDebounced`、`refreshThrottled`、`retryThrottled`；优先复用，不要为同一条 HTTP 请求链路再额外包一层页面级 `useDebounceFn` / `useThrottleFn`。
- 需要限流时，必须优先通过 `useApi(..., { rateLimit: { debounce / throttle } })` 配置，而不是把 HTTP 写请求放到页面层手写防抖/节流包装里。
- 只要是"同步 Redis / 远端设置"的 HTTP 写请求，优先使用 `useApi` 自带的 `rateLimit + refreshDebounced`。
- 如果同一个页面同时还要写本地 Tauri settings、窗口状态或其他非 HTTP 本地镜像，这类本地副作用可以继续单独使用页面层防抖；但 HTTP 远端写链路仍必须交给 `useApi` 自己限流。
- 查询列表、搜索建议、筛选联动等读请求，可以继续按现有模式使用 `refreshDebounced` / `refreshThrottled`。

---

## 5. TypeScript 与注释规范

### 5.1 新增文件命名（强制）

- 新增文件仅限：`index.ts` / `index.vue` / `index.types.ts`。
- 需要命名的文件均以文件夹名称命名。
- 注意：这是对"新增文件"的约束；禁止为了满足该规则去重命名/搬迁/改造现有文件结构（除非我明确要求）。

### 5.2 命名与类型选择（强制）

- 每个类型以 `T` 开头命名；每个接口以 `I` 开头命名（例如 `IUser`、`TUserConfig`）。
- 对象结构（需要写属性注释的那种）一律优先使用 `interface`，禁止用 `type` 定义对象字面量结构。
- `type` 仅允许用于：联合类型/字面量类型/函数类型/交叉类型等不适合逐属性注释的场景。

### 5.3 避免内联类型（强制：说清楚）

- 禁止内联对象字面量类型（例如 `{ a: string }`）到变量/函数签名中；应提取为 `interface/type` 以便注释与维护。
- 简单联合类型/函数类型等可在局部就地声明（不强制提取），但要保持可读性。

### 5.4 注释（强制：零容忍）

- interface 属性注释：必须使用 `/** ... */`（不能用单行 `//`）。
- 函数/类型/接口/类：必须有完整注释（描述、参数、返回值等）。
- 逻辑步骤/操作说明：允许使用 `//`，但必须放在代码上方，禁止行尾注释。
- 对于 `类型/接口/变量/常量/函数/类/Hook/状态/计算属性/生命周期（组件挂载）` 的注释，必须以对应的中文前缀开头，接口属性除外。

#### 5.4.1 特征式注释（强制：禁止）

- 注释的职责：只描述代码本身的业务语义、约束与边界（长期成立的事实）。
- 禁止在注释中写"特征式注释"（改动痕迹/实现细节对比/本次调整说明），包括但不限于：
  - "本次修改/为了这次改动/临时兼容/后续再改/先这样"
  - "额外包含/仅存/只用于同步/不包含 X 字段（作为结构对比说明）"
  - "复用现有 UI/凑合/为了不改别处所以..."
- 如果确实需要说明"为什么这样改"：写在变更清单、PR/Commit 描述或 Issue 中；不要写进代码注释里。

示例：

- ❌ `描述：Redis 仅存片段（request.url + heartbeat/restart），不包含 enabled/start。`
- ✅ `描述：用于跨设备同步哨兵配置。`
- ❌ `描述：sentinel 片段额外包含 request.url。`
- ✅ `描述：请求地址用于哨兵向服务端发起请求。`

### 5.5 any 与动态导入（强制）

- 尽可能避免 `any` 或隐式 `any`；确有必要必须先在方案清单里说明，等我确认后才能改。
- 不允许动态导入，必须使用静态导入；若确有必要或优势，必须先给方案清单并等我确认。

---

## 6. Pages 特例（零容忍）

> 本节规则优先于第 5 节的"通用类型规则"。

- `app/pages/**` 中的页面实现应优先下沉到 `app/components/sections/**`；页面文件只保留路由壳或薄 wrapper，子目录页面必须对应独立的 section 实现，禁止把完整业务逻辑长期留在 page 文件里。
- `app/components/sections/**` 视为页面业务实现层。新增或修改页面时，必须先检查这里是否已有可复用实现；能复用就直接复用或扩展，不要在 `app/pages/**` 和 `app/components/sections/**` 两处并行维护同一份页面逻辑。
- `app/components/sections/**` 只允许放 page 直接调用的 section 级组件；禁止在该目录下放散装内部组件、节点壳、表格局部组件、弹窗内部组件、工具型 UI 零件等非 page 直接调用组件。
- section 内需要使用本地 `.vue` 内部组件时，内部组件必须放在 `app/components/**` 的非 `sections` 目录，并通过 Nuxt 组件自动注册/自动解析使用；禁止在 section 内显式 `import xxx from '@/components/**/*.vue'` 或相对路径导入本地 Vue 组件。
- 任何组件自身的 props/interface/type 定义都必须拆到与组件同级的 `index.types.ts` 文件中，再由组件静态导入；禁止把类型定义直接写在 `.vue` 组件脚本块里。
- 只有需要跨多个组件复用的公共类型，才允许进入 `shared/types/**` 并从 `shared/types/index.types.ts` 汇总导出；组件私有类型不得放进 shared/types。
- 该规则主要适用于 `app/pages/**` 的子目录页面；根目录 `app/pages/*.vue` 作为顶层页壳，除非明确要求，不要随意抽离或改写。

- `app/pages/**` 内：禁止新增任何 `interface` 或 `type` 声明（不论复杂度、使用次数、是否仅用于本页）。
- 页面需要类型：必须新增到 `shared/types/pages/...`。
- 并且必须在 `shared/types/index.types.ts` 导出，以便 Nuxt 全局自动导入。
- API 请求/响应的结构：必须优先复用共享类型；没有就新增到共享类型，禁止在页面内临时声明。

### 6.1 Pages 表格（UTable）规范（零容忍）

- ✅ 表格必须使用 `@nuxt/ui` 的 `UTable`，禁止手写原生 `table`（除非我明确允许）。
- ✅ 样式必须对齐项目既有范式：优先使用 `sticky`，并复用 `table-fixed border-separate border-spacing-0` 及项目同款 `:ui` 配置。
- ✅ 长内容必须做响应式：通过列 `meta.class`（例如 `hidden md:table-cell`）控制列显示；小屏在首列内合并多行信息，避免溢出与横向滚动失控。
- ✅ 需要树形（可展开分组）时：必须使用 `get-sub-rows` 实现 tree data，并在首列 `cell` 内提供 `+/-` 展开按钮，调用 `row.getToggleExpandedHandler()`。
- ✅ 需要列固定（column pinning）时：必须使用 `v-model:column-pinning`；所有 pinned 列必须显式配置 `size`；表格外层必须有 `overflow-auto` 容器。
- ✅ 需要表头/表尾固定（sticky header/footer）时：必须使用 `sticky`，并通过 `tfoot` slot 输出汇总行，避免另起一套 footer 结构。
- ✅ 危险操作（删除/重置）需要二次确认时：优先使用 `UPopover` 承载确认内容（侧边弹出），避免居中弹窗影响效率（除非我明确要求用 `UModal`）。

---

## 7. i18n 规则（强制）

- `i18n` 始终以 `i18n/zh.cn.ts` 为准（简体中文是主语言）。
- 其他语言翻译内容必须与 `zh.cn.ts` 完全对齐：不能多也不能少。
- 翻译必须符合母语者习惯用法，禁止生硬直译，需要润色自然流畅。
- 语言文件目录：`i18n/`，文件命名：`zh.cn.ts` / `zh.tw.ts` / `en.ts` / `ja.ts`。
- locale 配置在 `configs/nuxt/index.ts` 的 `i18n` 字段，默认语言为 `zh_cn`。
- 在 Vue 页面和组件中，不要用 `te(...)` 探测某个键是否存在再分支渲染；应直接使用 `t(...)`。如果键缺失，先补齐四语 `i18n` 文案，再使用该键。

---

## 8. Tauri 集成规范

> 本项目的桌面端能力通过 Tauri 实现（Rust 后端）。前端通过 `@tauri-apps/api` 与 Tauri 主进程通信。

### 8.1 Tauri API 调用（强制）

- 所有 Tauri 原生能力（文件系统、系统通知、窗口管理、剪贴板等）必须通过 `@tauri-apps/api` 提供的官方模块调用，禁止直接操作 `window.__TAURI__`。
- 调用 Tauri API 前必须确认当前运行环境为 Tauri（例如检查 `window.__TAURI_INTERNALS__` 是否存在），避免在浏览器开发环境崩溃。

### 8.2 invoke 命令（强制）

- Tauri 命令通过 `invoke(command, args)` 调用（对应 Rust `#[tauri::command]`）。
- 必须为每个 invoke 调用提供完整的 TypeScript 类型定义，禁止使用 `any` 作为参数或返回值类型。
- invoke 命令封装：统一放在 `app/composables/tauri/` 下，以 `useTauri` 前缀命名（例如 `useTauriWindow`、`useTauriFs`）。

### 8.3 事件监听（强制）

- Tauri 事件监听（`listen`）返回的取消监听函数必须在 `onUnmounted` 中调用，防止内存泄漏。

---

## 9. Skills 与冲突处理

- 当用户明确提到 "skills" 或要求启用某个 skill 时，优先加载对应 skill 的指令。
- 如果多个 skill 的规则冲突，优先使用最近启用的 skill 规则。
- skill 指令仅作为补充，不能覆盖本规则文档的核心约束。

---

## 10. 参考与示例

- Nuxt 5 文档：https://nuxt.com/
- Nuxt UI 文档：https://ui.nuxt.com/
- VueUse 文档：https://vueuse.org/
- es-toolkit 文档：https://es-toolkit.esm.dev/
- Tauri API：https://tauri.app/
