---
name: lofitick-desktop-ui-skill-maintenance
description: 'Maintain LofiTick.Desktop.UI GitHub Copilot skills: frontmatter, indexing, splitting, deduplication, authority boundaries, and root routing updates. (维护 LofiTick.Desktop.UI GitHub Copilot skills：frontmatter、索引、拆分、去重、权威边界与根路由更新)'
argument-hint: '请输入 skill 维护任务，例如：[新增 skill] [拆分] [索引] [去重]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---

# Skill 维护规则

## 适用场景

- 新增、优化、审查、拆分或删除 `.github/skills/lofitick-desktop-ui-*/SKILL.md`。
- 维护 `lofitick-desktop-ui-coding` 根索引。
- 清理重复规则、旧入口、跨领域混写或触发词不足的 skill。

## Frontmatter

- 新 skill 必须使用以下结构：

```yaml
---
name: lofitick-desktop-ui-<skill-name>
description: 'English description that helps Copilot auto-trigger well. (对应的完整中文描述)'
argument-hint: '这里必须使用中文，例如：[平台] [风格] [用途]'
license: Private
metadata:
  author: SuttonKwok
  version: '1.0.0'
---
```

- `name` 必须与文件夹名一致。
- 文件夹名和 `name` 必须为 lowercase kebab-case。
- `description` 必须同时包含常见英文触发词和自然中文触发词。
- `argument-hint` 必须使用中文。
- 正文必须使用简体中文编写，除必要英文触发词、路径、命令和关键字外。

## 单一职责

- 一个 skill 只负责一个明确任务域。
- 先判断 skill 的唯一职责，再决定是否拆分。
- 如果一个 skill 同时覆盖多个无关领域，必须先建议拆分，再继续优化。
- 项目级约束、代码规范、目录规则和复用轮子，应写在对应项目 root skill 或子 skill 中。
- skill-writer 只负责“怎么写 skill”，不承载具体项目业务规则。

## Token 经济

- 先用根索引分流，再按需加载子 skill。
- 避免把同一类规则重复写多遍。
- 不要把项目级规范塞进元 skill。
- 优化旧 skill 时，必须保持原有职责不丢失，同时压缩重复规则、提升触发率、减少 token。
- 正文只保留长期稳定规则、工作流程和维护边界。
- 移除重复段落、重复入口、历史迁移叙述和项目级重复规则。

## 索引维护

- `.github/skills/lofitick-desktop-ui-coding/SKILL.md` 是编码规则根索引。
- 新增、删除或重命名子 skill 时，必须同步更新根索引。
- 根索引必须使用 Markdown 链接指向真实存在的 `SKILL.md`。
- 子 skill 禁止维护跨 skill 索引。
- 根索引只负责路由，不承载具体领域的长规则。
- 只要对 skill 有增删改，都要同步清理重复规则，确保整个 skill 系统一致可靠。

## 审查清单

- `name` 和文件夹名是否一致，且为 lowercase kebab-case。
- `description` 是否具体、可触发、可区分职责。
- 正文是否存在重复段落、重复列表、重复入口或跨领域混写。
- 是否把项目级规则误塞进元 skill。
- 是否已经明确权威来源、子 skill 拆分边界和旧入口清理方式。
- 是否同步更新 `lofitick-desktop-ui-coding` 根索引。
