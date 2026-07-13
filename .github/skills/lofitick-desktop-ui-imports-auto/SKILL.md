---
name: lofitick-desktop-ui-imports-auto
description: 'Nuxt auto-imports, alias imports, Vue SFC macros, defineProps/defineEmits order, template props, refs, and component auto registration rules. (Nuxt 自动导入、别名导入、Vue SFC 宏、defineProps/defineEmits 顺序、模板 props、ref 与组件自动注册规则)'
argument-hint: '请输入导入或组件任务，例如：[auto-import] [别名] [defineProps] [ref]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# 自动导入、别名与 Vue SFC 边界

## 适用场景

- 处理 `app/**` 下的 Vue、页面、组件、composable、store 导入问题。
- 判断是否应该显式 import、使用 Nuxt 自动导入、使用别名路径或依赖 SFC 宏。
- 修改 `defineProps`、`defineEmits`、模板引用、组件自动注册、模板 props 访问。

## Nuxt 自动导入

- Nuxt 5 已配置自动导入部分模块，例如 `composables/` 与 `stores/`。
- 在 `app/` 的 Nuxt 编译上下文中，Vue 组合式 API 默认已通过 auto-import 全局可用。
- `ref`、`computed`、`watch`、生命周期函数等 Vue 组合式 API 不要再显式 `import ... from 'vue'`。
- 在 `app/**` 的 Nuxt 运行时上下文中，只要某个值或类型已经出现在 `.nuxt/imports.d.ts`，就禁止再显式从 `vue`、`#imports`、`@/composables/**`、`@/stores/**` 导入同一符号。
- `app/composables/**`、`app/stores/**` 及其导出的类型、接口、类型别名，只要进入 `.nuxt/imports.d.ts`，在 `app/**` 内就应优先直接使用。
- 禁止为了“看起来更明确”再补一层显式 import。
- 是否自动导入，以 `.nuxt/imports.d.ts` 生成清单为准。
- 不确定时，优先查 `.nuxt/imports.d.ts`，再决定是否补 import。

## 自动导入排查顺序

- 如果怀疑是“没有全局导入”而不是“类型/变量不存在”，排查顺序固定为：
  1. `shared/types/index.types.ts` 或 `shared/utils/index.ts`。
  2. `.nuxt/imports.d.ts`。
  3. `pnpm exec nuxi prepare`。
- 禁止跳过这条检查链直接下结论。

## 别名导入

- 在 `app/**`、`shared/**`、`server/**`、`i18n/**` 运行时代码中，只要导入目标属于当前项目内部模块，就禁止使用相对路径 `./`、`../`。
- 当前项目内部导入必须改为别名路径。
- `app/**` 下的内部模块统一使用 `@/` 别名。
- 跨到项目根其他目录，例如 `shared/**`、`server/**`、`i18n/**`、`app/**`，统一使用 `@@/` 别名。
- 不要在同一文件里混用相对路径与别名路径引用当前项目内部模块。
- 一旦属于当前项目内部导入，统一按 `@/` 或 `@@/` 收口。
- 例外：`configs/**`、`scripts/**`、根级配置文件以及其他 Node/工具链上下文，不能机械套用 `@/`、`@@/`。
- 工具链上下文必须先确认执行环境支持对应别名，再决定是否改写。

## 共享入口

- 共享类型的全局导入入口固定为 `shared/types/index.types.ts`。
- 需要被页面、组件、composable 高频复用的共享类型，必须先汇总到 `shared/types/index.types.ts`，再交给 Nuxt 自动导入。
- 禁止在 `app/**` 中长期保留本可通过全局导入获得的 `@@/shared/types/**` 显式 `import type`。
- 共享值与工具的全局导入入口固定为 `shared/utils/index.ts`。
- 需要被页面、组件、composable 高频复用的常量、枚举值、纯工具函数，必须先确认是否已经从 `shared/utils/index.ts` 导出。
- 不要因为当前文件报未定义，就直接在局部补 `import`。

## Vue SFC 宏

- `defineProps<T>()`、`defineEmits<T>()`、`defineSlots<T>()`、`defineModel<T>()` 这类编译期宏的类型参数，必须优先使用当前文件可静态解析的显式 `import type`。
- 不要依赖 Nuxt 的全局自动导入类型作为这些宏的泛型参数，否则可能出现 `Unresolvable type reference` 编译错误。
- 当类型来自同级 `index.types.ts` 或共享类型入口时，也必须先显式导入再传给宏。
- 如果组件存在事件定义，`defineEmits(...)` 必须写在 `defineProps(...)` 之后，并保持在 `<script setup>` 顶层。
- 不要把事件定义放到 props 之前或函数体内部。
- `props` / `defineProps` 必须放在 `import` 之后、`<script setup>` 顶层，不允许藏在函数体或条件分支里。

## Props 访问

- Vue 模板里能不用 `props.xxx` 就不用。
- 优先在 `<script setup>` 中把会直接用于模板展示的字段解构成局部常量或计算属性，再在模板中直接使用标识符。
- 开始写之前必须先到 `package.json` / lockfile 确认 Vue 版本；当前锁定 Vue 3.5.38。
- Vue 3.5+ 下，能直接从 `defineProps(...)` 解构并保持响应式时，优先直接解构。
- 只有需要整体透传、动态 key 访问、对象级遍历或确实必须保持对象语义时，才保留 `props` 或改用 `toRefs`。
- Vue 3.5+ 组件中，`withDefaults(defineProps(...))` 应优先改为直接解构默认值。
- 能写 `const { a = 1 } = defineProps<...>()` 时，不要保留 `withDefaults`。
- 模板里也优先直接使用解构出的标识符。
- 只在确实会用到时才解构 props；如果属性不会被脚本或模板使用，不要从 `defineProps` 中解构出来。

## 模板引用

- 在 `<script setup>` 中获取 DOM 或组件引用时，优先使用 `ref` 同名变量自动绑定。
- Vue 编译器会自动识别顶层同名 `ref` 与模板 `ref` 属性。
- 只有场景需要动态 ref 名，例如 `:ref="dynamicName"`，或非顶层作用域绑定时，才使用 `useTemplateRef()`。
- 不要在常规场景下刻意使用 `useTemplateRef`。

## 组件自动注册

- `app/pages/**` 与 `app/components/**` 中，凡是可由 Nuxt 自动注册的本地 `.vue` 组件，禁止显式 `import xxx from './xxx.vue'` 或 `../index.vue`。
- 优先直接在模板中使用组件名。
- section 内需要使用本地 `.vue` 内部组件时，内部组件必须放在 `app/components/**` 的非 `sections` 目录，并通过 Nuxt 组件自动注册/自动解析使用。
- 禁止在 section 内显式 `import xxx from '@/components/**/*.vue'` 或相对路径导入本地 Vue 组件。

## 模板内联定义

- 只服务于当前模板且不会复用的静态对象或静态配置，优先直接写在模板属性里。
- 不要为了“整洁”把静态对象或静态配置提到 `<script setup>` 里再绕一层常量或计算属性。

## `resolveComponent` 边界

- `resolveComponent(...)` 只允许用于真正需要动态渲染或动态映射的场景。
- 允许场景包括表格列、运行时按配置切换组件类型、渲染函数中必须拿到组件引用。
- 如果只是静态使用 Nuxt UI 组件或本地组件，必须直接用模板标签或正常静态写法。
- 禁止为了“看起来统一”滥用 `resolveComponent`。
