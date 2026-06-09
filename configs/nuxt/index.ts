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

  site: {
    name,
    url: 'https://desktop.ui.lofitick.com/'
  },

  schemaOrg: {
    defaults: false
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

  nuxtCharts: {
    autoImports: false
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
    enabled: true,
    strict: false,
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',

      contentSecurityPolicy: {
        'base-uri': ["'none'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:', 'blob:', 'https://www.bing.com', 'https://mails.lofitick.com', 'https://access.lofitick.com', 'https://files.lofitick.com', 'https://downloads.lofitick.com'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'worker-src': ["'self'", 'blob:'],
        'style-src': ["'self'", 'https:', "'unsafe-inline'", 'https://mails.lofitick.com', 'https://access.lofitick.com', 'https://files.lofitick.com', 'https://downloads.lofitick.com'],
        'script-src': ["'self'", 'https:', "'unsafe-inline'", "'strict-dynamic'", "'nonce-{{nonce}}'", 'https://mails.lofitick.com', 'https://access.lofitick.com', 'https://files.lofitick.com', 'https://downloads.lofitick.com'],
        'upgrade-insecure-requests': false // 是否启用升级不安全请求，避免强制升级 HTTPS 导致某些资源加载失败
      },
      originAgentCluster: '?1',
      // referrerPolicy: 'no-referrer',
      referrerPolicy: 'strict-origin-when-cross-origin', // 或 'same-origin' 如果只想同域发送
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true
      },
      xContentTypeOptions: 'nosniff',
      xDNSPrefetchControl: 'off',
      xDownloadOptions: 'noopen',
      xFrameOptions: 'SAMEORIGIN',
      xPermittedCrossDomainPolicies: 'none',
      xXSSProtection: '1',
      permissionsPolicy: {
        camera: [],
        'display-capture': [],
        fullscreen: [],
        geolocation: [],
        microphone: []
      }
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000,
      throwError: true
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      headers: false,
      driver: {
        name: 'lruCache'
      },
      throwError: true
    },
    xssValidator: {
      throwError: true
    },
    corsHandler: {
      // origin: serverlUrl,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      preflight: {
        statusCode: 204
      }
    },
    allowedMethodsRestricter: {
      methods: '*',
      throwError: true
    },
    hidePoweredBy: true,
    basicAuth: false,
    csrf: {
      // 启用 CSRF 防护（默认已启用）
      enabled: true,
      // 生产环境默认启用 HTTPS 检测，因此如果不支持 HTTPS，请在此处设置为 false
      https: false,
      // 需要保护的 HTTP 方法
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
      // 默认为false，要在服务器上运行useCsrfFetch，请将其设置为true
      addCsrfTokenToEventCtx: true,
      // 其他可选配置（如 cookie 选项、header 名称等）
      cookie: {
        path: '/',
        httpOnly: true,
        sameSite: 'strict'
      },
      // 请求头中携带 CSRF token 的名称
      headerName: 'x-csrf-token'
    },
    nonce: true,
    removeLoggers: true,
    ssg: {
      meta: true,
      hashScripts: true,
      hashStyles: false,
      nitroHeaders: true,
      exportToPresets: true
    },
    sri: true
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

      // assets 桶公开域名，用于前端直接拼接远程资源地址
      upyunAssetsDomain: '',

      // files 桶公开域名，用于热搜播客开头音乐等文件资源直链
      upyunFilesDomain: '',

      // 前端可见：用于解密 sign_refresh blob 的 AES seed（对应后端 SECURITY_SIGN_AES_SEED）
      signAesSeed: ''
    }
  },

  // 环境特定配置（手动合并，规避 Nuxt 5 nightly $production/$development bug）
  ...envConfig
} as const;
