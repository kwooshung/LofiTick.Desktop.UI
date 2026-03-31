<template>
  <UApp :locale="locales[locale]" :toaster="appConfig.toaster">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import ConsoleBadge from '@kwooshung/console-badge';
import { en, ja, zh_cn, zh_tw } from '@nuxt/ui/locale';
import colors from 'tailwindcss/colors';

/**
 * 常量：支持的语言
 */
const locales = { zh_cn, zh_tw, en, ja };

/**
 * Hook：应用配置
 */
const appConfig = useAppConfig();

/**
 * Hook：i18n
 */
const { locale, t } = useI18n();

/**
 * Hook：主题模式
 */
const colorMode = useColorMode();

/**
 * 计算属性：文档语言
 */
const computedLang = computed(() => locales[locale.value].code);

/**
 * 计算属性：文档方向
 */
const computedDir = computed(() => locales[locale.value].dir);

/**
 * 计算属性：主题颜色
 */
const computedColor = computed(() => {
  const neutralKey = appConfig.ui.colors.neutral as keyof typeof colors;
  return colorMode.value === 'dark' ? (colors[neutralKey] && typeof colors[neutralKey] === 'object' ? colors[neutralKey][900] : 'black') : 'white';
});

/**
 * 计算属性：圆角样式
 */
const computedRadius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`);

/**
 * 计算属性：黑色主色
 */
const computedBlackAsPrimary = computed(() => (appConfig.theme.blackAsPrimary ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}'));

/**
 * Store：应用信息
 */
const storeAppInfo = useStoreAppInfo();

/**
 * 监听：语言代码变化，更新 dayjs 语言
 */
watch(
  () => locale.value,
  (newLocale) => {
    useDayjs().locale(newLocale.replace('_', '-'));
  },
  { immediate: true }
);

/**
 * 函数：从 localStorage 加载并应用主题设置
 * TODO: Tauri 桌面端接入 @tauri-apps/api 读取持久化配置
 */
const loadSettings = (): void => {
  const mode = localStorage.getItem('app-theme-mode');
  const primary = localStorage.getItem('app-theme-primary');
  const neutral = localStorage.getItem('app-theme-neutral');
  const radius = localStorage.getItem('app-theme-radius');
  const blackAsPrimary = localStorage.getItem('app-theme-black-as-primary');

  if (mode) {
    colorMode.preference = mode;
  }
  if (primary) {
    appConfig.ui.colors.primary = primary;
  }
  if (neutral) {
    appConfig.ui.colors.neutral = neutral;
  }
  if (radius) {
    appConfig.theme.radius = Number(radius);
  }
  if (blackAsPrimary !== null) {
    appConfig.theme.blackAsPrimary = blackAsPrimary === 'true';
  }
};

/**
 * Hook：设置页面头部信息
 */
useHead({
  meta: [
    {
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      key: 'theme-color',
      name: 'theme-color',
      content: computedColor
    }
  ],
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico'
    }
  ],
  style: [
    { innerHTML: computedRadius, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: computedBlackAsPrimary, id: 'nuxt-ui-black-as-primary', tagPriority: -2 }
  ],
  htmlAttrs: {
    lang: computedLang,
    dir: computedDir
  },
  bodyAttrs: {
    class: 'h-screen w-screen'
  }
});

/**
 * 生命周期：挂载后
 */
onMounted(() => {
  loadSettings();

  if (!storeAppInfo.states.isDev) {
    console.clear();
  }

  setTimeout(() => {
    new ConsoleBadge(t('common.site.console.info.appName'), storeAppInfo.states.name).leftBgColor('#120338').rightBgColor('#00c16a').print();
    new ConsoleBadge(t('common.site.console.info.appVersion'), storeAppInfo.states.version).leftBgColor('#120338').rightBgColor('#1677ff').print();
    new ConsoleBadge(t('common.site.console.info.theme'), colorMode.value).leftBgColor('#120338').rightBgColor('#eb2f96').print();
    new ConsoleBadge(t('common.site.console.info.language'), locale.value).leftBgColor('#120338').rightBgColor('#5b8c00').print();
    new ConsoleBadge(t('common.site.console.info.runtimeEnv'), storeAppInfo.states.isDev ? '开发' : '生产').leftBgColor('#120338').rightBgColor('#13c2c2').print();
    new ConsoleBadge(t('common.site.console.info.systemArch'), storeAppInfo.states.platform.name).leftBgColor('#120338').rightBgColor('#120338').print();
  }, 3000);
});
</script>

<style lang="css">
.page-enter-active,
.page-leave-active,
.layout-enter-active,
.layout-leave-active {
  transition:
    opacity 300ms,
    filter 150ms;
}

.page-enter-from,
.page-leave-to,
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(3px);
}
</style>
