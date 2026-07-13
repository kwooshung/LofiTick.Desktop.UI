---
name: 'lofitick-nuxt-ui-coding'
description: 'Root index for LofiTick.Desktop.UI Nuxt 5/Vue/TypeScript coding skills. Use for frontend coding tasks, then load the narrow child skill for workflow, imports, reuse, styling, API fetching, types, pages, i18n, Tauri, or server routes. (LofiTick Desktop UI 前端编码技能总索引：用于前端编码任务，并按工作流、导入、复用、样式、API、类型、页面、i18n、Tauri、服务端路由加载子技能)'
argument-hint: '[task area]'
---

# LofiTick Desktop UI Coding Skills

This is the entry index only. Load the most specific child skill first.

## Child Skills

- [Project Workflow](project-workflow/SKILL.md) - project setup, workspace rules, config checks, change gates, cleanup, and skill maintenance.
- [Nuxt Runtime And Imports](nuxt-runtime-imports/SKILL.md) - ESM, auto-imports, alias paths, SFC macros, template refs, and timer rules.
- [Implementation Reuse](implementation-reuse/SKILL.md) - reuse rules for components, composables, stores, shared types, API/Tauri wrappers, and duplicate prevention.
- [Styling And Interaction](styling-interaction/SKILL.md) - Tailwind v4, Nuxt UI, empty states, links, icons, and danger interactions.
- [API SSR Fetching](api-ssr-fetching/SKILL.md) - useApi, Nitro proxy, SSR first load, rate limits, and retry behavior.
- [TypeScript And Comments](typescript-comments/SKILL.md) - naming, interfaces, state/ref prefixes, JSDoc, any, and comment rules.
- [Pages i18n And Tauri](pages-i18n-tauri/SKILL.md) - pages/sections, UTable, i18n, invoke/listen, and Tauri command typing.
- [Server API Routes](server-api-routes/SKILL.md) - server api routes, method splits, parameter parsing, response contracts, and error codes.

## Index Rules

- Keep this file short and only route by task area.
- Put stable rules into the narrowest child skill that owns them.
- Avoid duplicate rules across child skills; one topic should have one authority.
- If a child skill starts covering unrelated topics, split it again.
