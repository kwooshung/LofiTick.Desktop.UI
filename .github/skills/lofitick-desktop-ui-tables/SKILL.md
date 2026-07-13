---
name: lofitick-desktop-ui-tables
description: 'Nuxt UI UTable page table rules: sticky headers, responsive columns, tree data, column pinning, tfoot summary, and popover confirmations. (Nuxt UI UTable 页面表格规则：sticky、响应式列、树形数据、固定列、tfoot 汇总与 Popover 确认)'
argument-hint: '请输入表格任务，例如：[UTable] [固定列] [树形] [响应式]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# Pages 表格规范

## 适用场景

- 在页面或 section 中新增、修改列表、数据表、树形表、固定列表格或表格危险操作。
- 判断是否能手写原生 `table`。

## UTable 强制规则

- 表格必须使用 `@nuxt/ui` 的 `UTable`。
- 禁止手写原生 `table`，除非用户明确允许。
- 样式必须对齐项目既有范式。
- 优先使用 `sticky`。
- 复用 `table-fixed border-separate border-spacing-0` 及项目同款 `:ui` 配置。

## 响应式列

- 长内容必须做响应式。
- 通过列 `meta.class` 控制列显示，例如 `hidden md:table-cell`。
- 小屏必须在首列内合并多行信息，避免溢出与横向滚动失控。

## 树形数据

- 需要树形或可展开分组时，必须使用 `get-sub-rows` 实现 tree data。
- 必须在首列 `cell` 内提供 `+/-` 展开按钮。
- 展开按钮调用 `row.getToggleExpandedHandler()`。

## 列固定

- 需要 column pinning 时，必须使用 `v-model:column-pinning`。
- 所有 pinned 列必须显式配置 `size`。
- 表格外层必须有 `overflow-auto` 容器。

## 表头与表尾固定

- 需要表头或表尾固定时，必须使用 `sticky`。
- 汇总行必须通过 `tfoot` slot 输出。
- 禁止另起一套 footer 结构。

## 危险操作确认

- 删除、重置等危险操作需要二次确认时，优先使用 `UPopover` 承载确认内容。
- 确认内容采用侧边弹出，避免居中弹窗影响效率。
- 除非用户明确要求使用 `UModal`，否则不要改成居中弹窗。
