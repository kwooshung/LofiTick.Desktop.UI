/// <reference types="node" />

import { development } from './development';
import { production } from './production';

const name = 'LofiTick';
const isDev = process.env.NODE_ENV !== 'production';
const envConfig = isDev ? development : production;

export const configs = {
  compatibilityDate: '2025-09-15',
  ssr: true,

  future: {
    // 启用 Nuxt 5 兼容模式，逐步对齐 v5 行为
    compatibilityVersion: 4
  },

  app: {
    rootId: name,
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    head: {
      titleTemplate: `%s - ${name}`,
      templateParams: {
        siteName: name
      },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    baseURL: '/',
    buildAssetsDir: '/_nuxt/'
  },

  devServer: {
    host: (process.env.HOST as string) || 'localhost',
    port: Number(process.env.PORT || 3000)
  },

  nitro: {
    output: {
      dir: './dist'
    },
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },

  vite: {
    build: {
      target: 'esnext',
      sourcemap: false
    },
    optimizeDeps: {
      // 预打包 CJS 格式的依赖，避免运行时 Vite 动态发现导致页面重载
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'dayjs',
        'dayjs/plugin/updateLocale',
        'dayjs/plugin/relativeTime',
        'dayjs/plugin/utc',
        'dayjs/locale/zh-cn',
        'dayjs/locale/zh-tw',
        'dayjs/locale/en',
        'dayjs/locale/ja',
        'dayjs/plugin/timezone',
        'dayjs/plugin/localizedFormat',
        'dayjs/plugin/advancedFormat',
        '@kwooshung/console-badge',
        'tailwindcss/colors',
        'es-toolkit',
        '@tauri-apps/api/core'
      ]
    }
  },

  imports: {
    dirs: ['~/{composables,stores}/**/*.{ts,js,mjs,mts}']
  },

  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'neutral']
    },
    fonts: false
  },

  ogImage: {
    enabled: false
  },

  colorMode: {
    storageKey: 'app-theme-mode'
  },

  dayjs: {
    /**
     * 激活的语言包列表，与 i18n 配置保持一致
     */
    locales: ['zh-cn', 'zh-tw', 'en', 'ja'],

    /**
     * 默认语言包，与 i18n defaultLocale 对应
     */
    defaultLocale: 'zh-cn',

    /**
     * 插件列表：根据需要启用相应功能
     */
    plugins: ['utc', 'timezone', 'relativeTime', 'localizedFormat', 'advancedFormat']
  },

  i18n: {
    langDir: './',
    strategy: 'prefix_except_default',
    defaultLocale: 'zh_cn',
    locales: [
      { icon: 'i-flag:cn-4x3', name: '简体中文', code: 'zh_cn', language: 'zh-CN', file: 'zh.cn.ts' },
      { icon: 'i-flag:cn-4x3', name: '繁体中文（台湾）', code: 'zh_tw', language: 'zh-TW', file: 'zh.tw.ts' },
      { icon: 'i-flag:us-4x3', name: 'English', code: 'en', language: 'en-US', file: 'en.ts' },
      { icon: 'i-flag:jp-4x3', name: '日本語', code: 'ja', language: 'ja-JP', file: 'ja.ts' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      fallbackLocale: 'zh_cn'
    }
  },

  sourcemap: {
    server: false,
    client: false
  },

  routeRules: {
    '/api/email/send': {
      security: {
        xssValidator: false
      }
    }
  },

  security: {
    csrf: {
      // 启用 CSRF 防护（默认对写方法生效）
      enabled: true,
      // 生产环境默认启用 HTTPS 检测，因此如果不支持 HTTPS，请在此处设置为 false
      https: false,
      // 需要保护的 HTTP 方法
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
      // 默认为 false，要在服务器上运行 useCsrfFetch，请将其设置为 true
      addCsrfTokenToEventCtx: true,
      cookieKey: 'csrf_id',
      cookie: {
        path: '/',
        httpOnly: true,
        sameSite: 'strict'
      },
      // 请求头中携带 CSRF token 的名称
      headerName: 'x-csrf-token'
    }
  },

  // 运行时配置：API 地址通过环境变量注入
  runtimeConfig: {
    // 后端签名体系的“迷惑假参数”校验开关（仅 Nitro 代理层使用）。
    //
    // - 环境变量：NUXT_SIGN_FAKE_PARAMS_VALIDATE
    // - 取值：true/false（字符串会在运行时被解析）
    //
    // 注意：Rust API 侧仍会执行强制校验；该开关只控制代理层是否提前拦截。
    signFakeParamsValidate: true,
    public: {
      // 由 .env 注入（prod 默认值），开发时由 .env.development 覆盖
      apiBase: '',

      // 前端可见：用于解密 sign_refresh blob 的 AES seed（对应后端 SECURITY_SIGN_AES_SEED）
      signAesSeed: ''
    }
  },

  // 环境特定配置（手动合并，规避 Nuxt 5 nightly $production/$development bug）
  ...envConfig
} as const;
