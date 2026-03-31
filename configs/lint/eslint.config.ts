// @ts-check
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

import withNuxt from '../../.nuxt/eslint.config.mjs';

export default withNuxt({
  plugins: {
    // 作为规则使用的 simple-import-sort 插件
    'simple-import-sort': simpleImportSort,

    // 作为规则使用的 Prettier 插件
    prettier: prettierPlugin,

    // 处理未使用 import / 变量的插件（可被 --fix 自动删除未使用的 import）
    'unused-imports': unusedImports
  },
  rules: {
    // Vue 相关：html 自闭合标签、多个根节点等规则关闭
    'vue/html-self-closing': 'off',

    // Vue 相关：允许多个根节点
    'vue/no-multiple-template-root': 'off',

    // Vue 相关：关闭属性换行规则
    'vue/first-attribute-linebreak': 'off',

    // Vue 相关：关闭必须为 props 设置默认值的规则
    'vue/require-default-prop': 'off',

    // 使用 simple-import-sort 插件进行导入排序
    'simple-import-sort/imports': 'error',

    // 使用 simple-import-sort 插件进行导出排序
    'simple-import-sort/exports': 'error',

    // 代码风格（由 Prettier 管理的大多格式化规则通过 eslint-config-prettier 已被禁用）
    curly: ['error', 'all'],

    // 让 Prettier 负责 semi 的具体样式；在 rules 中用 prettier/prettier 报告样式问题
    semi: 'off',

    // extra semi：如果是 TypeScript 项目，使用 @typescript-eslint 的规则
    'no-extra-semi': 'off',

    // prettier 插件作为 ESLint 规则（会显示格式化问题）
    'prettier/prettier': 'error',

    // 在 --fix 时会删除未使用的 import（可自动清理 import）
    'unused-imports/no-unused-imports': 'error',

    // 用来报告未使用的变量（并配合忽略以 _ 开头的用法）
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ]
  }
});
