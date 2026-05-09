const config = {
  // 官方最新推荐配置（2025 年标准）
  extends: [
    'stylelint-config-standard-scss', // SCSS 基础规则
    'stylelint-config-recommended-vue/scss', // Vue + SCSS 支持
    'stylelint-config-recess-order' // 关键：RECSS 排序顺序
  ],

  plugins: [
    'stylelint-order' // recess-order 内部已经用了这个插件
  ],

  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ],

  // 忽略生成的文件和 node_modules
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/.nuxt/**', '**/.output/**', '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', 'app/assets/css/main.css'],

  rules: {
    // 允许 Tailwind 的 @apply、@layer 等
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'variants', 'responsive', 'screen', 'use', 'mixin', 'include', 'extend', 'function', 'if', 'else', 'each', 'for', 'return']
      }
    ],

    // SCSS 专用：允许 @use、@forward 等
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'use', 'forward']
      }
    ],

    'font-family-no-missing-generic-family-keyword': null, // Tailwind 常用
    'no-descending-specificity': null, // Vue 组件经常误报
    'no-invalid-double-slash-comments': null, // SCSS 支持 // 注释
    'value-keyword-case': null, // 兼容 oklch() 等
    'custom-property-empty-line-before': 'never',
    'declaration-empty-line-before': 'never',

    'color-hex-length': 'short', // #fff 而不是 #ffffff
    'shorthand-property-no-redundant-values': true, // padding: 10px 10px → 不允许
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'length-zero-no-unit': true, // 0px → 0
    'function-name-case': 'lower',
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true
  }
};

export default config;
