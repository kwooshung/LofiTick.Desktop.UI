---
name: lofitick-desktop-ui-types-comments
description: 'TypeScript naming, interfaces, types, inline type avoidance, Vue state/ref naming, comments, JSDoc, any, dynamic imports, and template comment rules. (TypeScript 命名、接口类型、避免内联类型、Vue 状态/ref 命名、注释、JSDoc、any、动态导入与模板注释规则)'
argument-hint: '请输入类型或注释任务，例如：[类型] [注释] [state 命名] [JSDoc]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# TypeScript 与注释规范

## 适用场景

- 编写或修改 TS 类型、接口、函数签名、Vue 状态变量、模板引用变量、注释或 JSDoc。
- 判断是否允许 `any`、动态导入或内联对象类型。

## 新增文件命名

- 新增文件仅限 `index.ts`、`index.vue`、`index.types.ts`。
- 需要命名的文件均以文件夹名称命名。
- 这是对新增文件的约束。
- 禁止为了满足该规则去重命名、搬迁或改造现有文件结构，除非用户明确要求。

## 类型与接口命名

- 每个类型以 `T` 开头命名，例如 `TUserConfig`。
- 每个接口以 `I` 开头命名，例如 `IUser`。
- 对象结构优先使用 `interface`。
- 需要写属性注释的对象结构必须使用 `interface`。
- 禁止用 `type` 定义对象字面量结构。
- `type` 仅用于联合类型、字面量类型、函数类型、交叉类型等不适合逐属性注释的场景。
- TS/JS 函数声明默认优先使用箭头函数。
- 只有确实需要函数提升、构造函数、原型方法、装饰器/框架约定或必须保留动态 `this` 绑定时，才允许使用 `function` 声明或表达式。

## 避免内联类型

- 禁止把内联对象字面量类型写到变量或函数签名中，例如 `{ a: string }`。
- 应提取为 `interface` 或 `type`，便于注释与维护。
- 简单联合类型、函数类型等可在局部就地声明，不强制提取，但必须保持可读性。
- 页面、组件、composable、store、工具函数或消息处理器，只要存在可命名的参数或返回值，必须在函数签名层显式标注参数类型与返回类型。
- 禁止依赖推导来回避语义说明。

## 组件状态命名

- 在 `app/**/*.vue` 中，凡是由 `ref`、`reactive`、`shallowRef`、`shallowReactive` 创建且不属于 `props` 的组件状态变量，命名必须使用 `state` 前缀。
- 命名格式固定为 `stateXxx`，例如 `stateLoading`、`stateRows`、`stateForm`。
- 禁止继续使用无 `state` 前缀的状态命名，例如 `loading`、`canvasRef`、`formState`。
- `props` 解构字段、`computed`、普通函数、事件处理函数不适用本条，不要求改为 `state` 前缀。

## 元素引用命名

- 只要模板里使用静态元素引用 `ref="xxx"`，变量名必须使用 `ref` 前缀。
- 命名格式固定为 `refXxx`。
- 元素引用变量禁止使用 `state` 前缀，例如禁止 `stateCanvasRef`、`statePreviewStageElement`。
- 推荐写法：模板 `ref="refCanvas"` 对应脚本 `const refCanvas = ref<HTMLCanvasElement | null>(null)`。
- 动态引用 `:ref="fn"` 不受本条前缀约束，但其返回的实际键名也建议遵循 `refXxx`。

## 组件与页面类型边界

- `app/components/**` 里的组件私有 `props`、事件载荷、计算辅助类型与展示模型，必须优先拆到组件同级 `index.types.ts`。
- 组件再从同级 `index.types.ts` 静态导入类型。
- 禁止把这类类型长期写在 `<script setup>` 里和业务逻辑混在一起。
- 任何组件自身的 props、interface、type 定义都必须拆到与组件同级的 `index.types.ts` 文件中，再由组件静态导入。
- 组件私有类型不得放进 `shared/types`。
- 只有需要跨多个组件复用的公共类型，才允许进入 `shared/types/**` 并从 `shared/types/index.types.ts` 汇总导出。
- `app/pages/**` 里的页面类型禁止就地声明；页面类型必须放到 `shared/types/pages/**` 并从 `shared/types/index.types.ts` 导出。

## 注释规则

- interface 属性注释必须使用 `/** ... */`，禁止使用单行 `//`。
- 函数、类型、接口、类必须有完整注释，描述参数、返回值等稳定语义。
- 逻辑步骤或操作说明允许使用 `//`，但必须放在代码上方，禁止行尾注释。
- 对于类型、接口、变量、常量、函数、类、Hook、状态、计算属性、生命周期（组件挂载）的注释，必须以对应的中文前缀开头。
- 接口属性不需要使用中文前缀。
- Vue 模板 `<template>` 中禁止出现 HTML 注释，包括临时注释、整段注释代码与 TODO 注释。
- 需要说明时，必须改写到脚本区或文档中。

## JSDoc 标签

- JSDoc 标准格式统一使用 `@param` 与 `@return`。
- 禁止混用 `@returns`，避免同一工程出现两套注释口径。
- `@param` 与 `@return` 必须与函数签名语义一致。
- 参数、返回值的类型信息要写在花括号中。

## 特征式注释禁止项

- 注释只描述代码本身的业务语义、约束与边界，即长期成立的事实。
- 禁止在注释中写改动痕迹、实现细节对比、本次调整说明。
- 禁止注释包含“本次修改”“为了这次改动”“临时兼容”“后续再改”“先这样”。
- 禁止注释包含“额外包含”“仅存”“只用于同步”“不包含 X 字段”这类结构对比说明。
- 禁止注释包含“复用现有 UI”“凑合”“为了不改别处所以”等表达。
- 如果需要说明为什么这样改，应写在变更清单、PR/Commit 描述或 Issue 中，不要写进代码注释。
- 示例：`描述：用于跨设备同步哨兵配置。` 优于 `描述：Redis 仅存片段（request.url + heartbeat/restart），不包含 enabled/start。`
- 示例：`描述：请求地址用于哨兵向服务端发起请求。` 优于 `描述：sentinel 片段额外包含 request.url。`

## `any` 与动态导入

- 尽可能避免 `any` 或隐式 `any`。
- 确有必要使用 `any` 时，必须先在方案清单里说明，等待用户确认后才能改。
- 不允许动态导入，必须使用静态导入。
- 如果动态导入确有必要或优势，必须先给方案清单并等待用户确认。
