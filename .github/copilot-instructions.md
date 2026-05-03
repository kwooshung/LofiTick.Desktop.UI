# GitHub Copilot 使用说明

> **声明（强制）**
>
> - 本文档内所有规则均为强制要求，必须逐条严格遵守。
> - 任何"为了省时间"而省略步骤、或"为了迎合需求"而妥协规则的行为，都是禁止的。

## 目录

- [1. 项目与工作区](#1-项目与工作区)
- [2. 执行流程（改动前门禁）](#2-执行流程改动前门禁)
- [3. 工程与依赖约束](#3-工程与依赖约束)
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
- 本项目是 **LofiTick Desktop UI**，定位为 Tauri 桌面客户端的前端层，纯客户端渲染（`ssr: false`）。
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

- 任何操作前，必须优先阅读 `package.json`，不要猜依赖、不要靠经验拍脑袋。
- 特别是 `configs/nuxt/index.ts`、`configs/nuxt/modules.ts` 必须先仔细阅读，避免误解现有配置。

### 1.3 安装依赖（强制）

- 必须使用 `pnpm install --ignore-workspace`，因为父目录 `i:\Frontends\` 存在 `pnpm-workspace.yaml`。
- **禁止**直接执行 `pnpm install`（不加 `--ignore-workspace`），会将依赖装到父目录。

---

## 2. 执行流程（改动前门禁）

- 默认仅阅读文件；任何改动前，必须先提供变更清晰的 Markdown 方案清单（必须带 Emoji，但不能滥用），待我确认后方可执行。
- 仅修改我明确指定的文件或范围；禁止顺手修改不相关文件。若确有必要，必须先给出变更方案清单并等我确认。
- 禁止修改业务语义或对外行为（除非我明确指示"允许改逻辑"）。
- 禁止执行 `git restore` 或批量回滚操作：
  - 除非我明确指定具体文件；
  - 若处理范围模糊或涉及多个文件，必须先列出清单并询问我。
- 代码必须简洁、优雅、高效，避免冗余与重复；遵循最佳实践与设计模式；为了性能与可维护性可进行必要重构，但不能突破本规则。

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
- 该规则以 `.nuxt/imports.d.ts` 的生成清单为准；不确定时优先查该文件再决定是否补 import。

### 3.3 实现优先级（强制）

- 强制：在实现任何功能、页面、组件、composable、store、shared type、工具函数或 API 封装之前，必须先检查仓库内是否已经存在可复用的“轮子”（包括但不限于：`app/components/**`、`app/composables/**`、`app/stores/**`、`app/types/**`、`shared/**`、现有 Nuxt auto-import 项、现有 Tauri 封装与现有 API composable）。
- 强制：只要现有实现能够满足当前需求或经小范围扩展即可满足，就必须优先复用；禁止复制粘贴近似逻辑、平行新增重复组件/重复 composable/重复工具函数，或为已有能力再造一层语义重复的封装。
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

#### 4.2.1 Composables 顶层调用（强制：零容忍）

- 任何返回实例/句柄/方法的 `useXxx`：必须在 `setup` 顶层调用。
- 禁止在任意函数体内调用，包括但不限于：`onMounted/onBeforeUnmount/watch/watchEffect` 回调、事件回调、普通工具函数等。

#### 4.2.2 句柄与响应式（强制）

- 订阅函数返回的"取消订阅句柄"（例如 `unsubscribe`）、计时器句柄等运行时句柄：默认使用普通变量保存（`let unsubscribe: null | (() => void) = null`），不要强行改成 `ref/shallowRef`。
- 是否使用响应式的判断标准：是否需要驱动模板渲染/被 `watch` 追踪/参与计算属性；仅用于生命周期清理的句柄不需要响应式。
- 注释必须反映真实语义；如果实现是普通变量，就用"变量/句柄"，不要误标为"状态"。

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

- `app/pages/**` 内：禁止新增任何 `interface` 或 `type` 声明（不论复杂度、使用次数、是否仅用于本页）。
- 页面需要类型：必须新增到 `app/types/pages/...`。
- 并且必须在 `app/types/index.types.ts` 导出，以便 Nuxt 全局自动导入。
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
- 取消监听句柄用普通变量保存（`let unlisten: (() => void) | null = null`），不要用 `ref`。

### 8.4 类型同步（强制）

- Rust 侧暴露给前端的命令参数/返回值结构体，必须在前端 `app/types/tauri/` 下维护对应的 TypeScript interface。
- Rust 结构体字段命名使用 `snake_case`，TypeScript 接口字段对齐使用 `camelCase`（通过 `serde` rename_all 或手动映射）；两侧命名必须一一对应，禁止凭感觉猜字段名。

---

## 9. Skills 与冲突处理

### 9.1 Skills 索引（相对于项目根目录）

- [.workbuddy/skills/](../.workbuddy/skills/)（如有项目级 skill，以此目录为准）

### 9.2 冲突处理优先级（强制）

1. 项目源码优先：如果 skill 建议与仓库现有代码/配置冲突，以仓库为准；必须提醒我并给差异与可选方案。
2. 本地 copilot 指令优先：风格/约定冲突时，以本文档为准。
3. agent-skills 次之：在前两者都未覆盖时，参考 skills 文档。

### 9.3 冲突检测提示（建议）

- 采纳 skill 建议前先检查：
  1. 是否修改关键配置（`package.json`、`tsconfig.json`、`nuxt.config.ts`、`configs/nuxt/index.ts` 等）；
  2. 是否改变业务语义或对外行为；
  3. 是否违反仓库强制规则（例如文件命名约束）。
- 任一触发：必须先报告冲突并给两种方案（保守/激进），请求确认。

---

## 10. 参考与示例

### 10.1 官方文档

- Nuxt 5: https://nuxt.com/docs/getting-started/
- Vue 3: https://vuejs.org/guide/
- TypeScript: https://www.typescriptlang.org/docs/
- Tauri: https://v2.tauri.app/start/
- TailwindCSS: https://tailwindcss.com/docs/
- Nuxt UI: https://ui.nuxt.com/
- VueUse: https://vueuse.org/
- es-toolkit: https://es-toolkit.dev/intro.html
- Pinia: https://pinia.vuejs.org/
- nuxt-i18n: https://i18n.nuxtjs.org/docs/
- dayjs: https://day.js.org/docs/en/installation/installation

### 10.2 参考文件（风格对齐用）

> 记住：这些文件是风格参考，不是让我提需求就去改它们，除非我明确要求。

- `app/components/` — 组件实现参考
- `app/pages/` — 页面实现参考
- `app/stores/` — Pinia store 实现参考

### 10.3 函数注释示例

```ts
/**
 * 函数：获取默认头像路径
 * @param {number} gender 性别：0=未知，1=男士，2=女士
 * @return {string} 默认头像路径
 */
export const avatarDefaultGet = (gender: number): string => {
  /**
   * 常量：基础头像路径
   */
  const basePath = `images/avatars/default`;

  // 男士头像
  if (gender === 1) {
    return `${basePath}/male.png`;
  }
  // 女士头像
  else if (gender === 2) {
    return `${basePath}/female.png`;
  }

  return '';
};

/**
 * 函数：获取头像，如果路径为空则返回默认头像路径
 * @param {string} path 头像路径
 * @param {number} gender 性别：0=未知，1=男士，2=女士
 * @return {string} 头像完整路径
 */
export const avatarGetOrDefault = (path: string, gender: number): string => {
  // 路径为空则返回默认头像
  if (!path || path.trim() === '') {
    return avatarDefaultGet(gender);
  }

  return path;
};
```
