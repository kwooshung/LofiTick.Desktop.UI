import { modules } from './modules';

export const development = {
  debug: true,
  devtools: {
    enabled: true
  },
  modules: [
    ...modules,

    // ESLint 集成（代码检查）
    '@nuxt/eslint',
    // 测试工具（单元/端到端测试）
    '@nuxt/test-utils',
    // 测试模块（补充）
    '@nuxt/test-utils/module'
  ]
};
