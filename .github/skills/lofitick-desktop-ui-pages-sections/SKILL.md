---
name: lofitick-desktop-ui-pages-sections
description: 'Nuxt pages, route shells, sections architecture, page type placement, component private types, and page-to-section reuse rules. (Nuxt 页面、路由薄壳、sections 架构、页面类型位置、组件私有类型与页面复用规则)'
argument-hint: '请输入页面任务，例如：[page] [section] [页面类型] [组件拆分]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# 页面与 Sections 边界

## 适用场景

- 新增或修改 `app/pages/**` 页面、路由壳、section 级页面实现。
- 判断页面业务是否应下沉到 `app/components/sections/**`。
- 处理页面类型、组件私有类型、section 内部组件位置。

## 页面薄壳

- `app/pages/**` 中的页面实现应优先下沉到 `app/components/sections/**`。
- 页面文件只保留路由壳或薄 wrapper。
- 子目录页面必须对应独立的 section 实现。
- 禁止把完整业务逻辑长期留在 page 文件里。
- 根目录 `app/pages/*.vue` 作为顶层页壳，除非用户明确要求，不要随意抽离或改写。
- 页面和组件都必须原子化；当一个页面或组件同时承担布局、状态管理、数据转换和交互流程时，必须拆分。

## Sections 目录职责

- `app/components/sections/**` 视为页面业务实现层。
- 新增或修改页面时，必须先检查 `app/components/sections/**` 是否已有可复用实现。
- 能复用就直接复用或扩展。
- 禁止在 `app/pages/**` 和 `app/components/sections/**` 两处并行维护同一份页面逻辑。
- `app/components/sections/**` 只允许放 page 直接调用的 section 级组件。
- 禁止在 `sections` 目录下放散装内部组件、节点壳、表格局部组件、弹窗内部组件、工具型 UI 零件等非 page 直接调用组件。
- `app/components/sections/**` 可以多拆文件，但每个文件都必须职责清晰，文件和文件夹不怕多，结构必须清晰。

## Section 内部组件

- section 内需要使用本地 `.vue` 内部组件时，内部组件必须放在 `app/components/**` 的非 `sections` 目录。
- 内部组件通过 Nuxt 组件自动注册或自动解析使用。
- 禁止在 section 内显式 `import xxx from '@/components/**/*.vue'`。
- 禁止在 section 内使用相对路径导入本地 Vue 组件。

## 页面类型

- `app/pages/**` 内禁止新增任何 `interface` 或 `type` 声明。
- 禁止页面内声明类型，不论复杂度、使用次数、是否仅用于本页。
- 页面需要类型时，必须新增到 `shared/types/pages/**`。
- 页面类型必须在 `shared/types/index.types.ts` 导出，以便 Nuxt 全局自动导入。
- API 请求/响应结构必须优先复用共享类型。
- 没有共享类型时，必须新增到共享类型，禁止在页面内临时声明。

## 组件私有类型

- 任何组件自身的 props、interface、type 定义都必须拆到与组件同级的 `index.types.ts` 文件中。
- 组件再静态导入同级 `index.types.ts`。
- 禁止把类型定义直接写在 `.vue` 组件脚本块里。
- 组件私有类型不得放进 `shared/types`。
- 只有需要跨多个组件复用的公共类型，才允许进入 `shared/types/**` 并从 `shared/types/index.types.ts` 汇总导出。

## 页面与组件尺寸

- 单个 `*.vue` 文件推荐控制在 150~250 行以内（包含 template + script + style）。
- 单个 `*.vue` 文件的常规警戒线是不超过 300 行；超过 300 行时，必须主动评估是否拆分。
- 单个 `*.vue` 文件的硬性上限原则上是不超过 400 行；超过 400 行必须拆分。
- 复杂页面的 Page 组件可以适当放宽到 500 行，但超过 500 行必须拆分成子组件或 composables。
- 生成或修改页面、section、页面壳时，如果预计会超过 300 行，必须先提醒用户并给出拆分方案。
- 页面、组件、section 都必须尽量保持单一职责；能拆就拆，禁止把布局、数据整理和复杂交互揉进一个大文件。

## 页面层级职责

- 父级路由文件，例如 `app/pages/foo.vue` 或 `app/pages/foo/index.vue`，不能承载某个子路由页面的完整业务实现。
- 子路由页面必须在各自目录中独立实现。
- 禁止通过子页反向导入父页页面来复用整页逻辑。
