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

import type { IPageSettingsUnattendedMachineNetworkGroups, IPageSettingsUnattendedMachineNetworkSnapshot, IPageSettingsUnattendedScenesMachineRedisConfig } from '@@/shared/types/pages/settings/unattended/index.types';

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
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置
 */
const { get: settingsGet, machineNetworkGet, machineHostnameGet } = useTauriSettings();

/**
 * API：场景配置（PATCH）
 * 描述：用于启动时静默上报本机网络信息。
 */
const { refresh: refreshScenesRemotePatch } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { method: 'PATCH', immediate: false });

/**
 * 状态：启动静默上报是否已执行
 */
const stateUnattendedStartupReported = useState<boolean>('unattended-startup-reported', () => false);

/**
 * 工具：转为普通对象
 * @param {unknown} input 输入
 * @returns {Record<string, unknown> | null} 对象
 */
const toRecord = (input: unknown): Record<string, unknown> | null => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }
  return input as Record<string, unknown>;
};

/**
 * 工具：网络快照转为分组结构
 * @param {IPageSettingsUnattendedMachineNetworkSnapshot | null} snapshot 网络快照
 * @returns {IPageSettingsUnattendedMachineNetworkGroups} 分组结构
 */
const networkSnapshotToGroups = (snapshot: IPageSettingsUnattendedMachineNetworkSnapshot | null): IPageSettingsUnattendedMachineNetworkGroups => {
  const interfaces = Array.isArray(snapshot?.interfaces) ? snapshot!.interfaces : [];
  const groups = interfaces
    .map((iface) => {
      const name = String(iface?.name ?? '').trim() || '-';
      const ips = Array.isArray(iface?.ips) ? iface.ips : [];

      const cleaned = ips.map((i) => String(i ?? '').trim()).filter((i) => i !== '');

      const ipv4 = Array.from(new Set(cleaned.filter((i) => i.includes('.') && !i.includes(':'))));
      const ipv6 = Array.from(new Set(cleaned.filter((i) => i.includes(':'))));

      return { name, ipv4, ipv6 };
    })
    .filter((g) => g.ipv4.length > 0 || g.ipv6.length > 0);

  return { groups };
};

/**
 * 函数：应用启动后静默上报一次本机网络
 * 描述：仅在 Tauri 运行时触发；失败吞掉，不打断 UI。
 */
const unattendedStartupReportOnce = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }
  if (stateUnattendedStartupReported.value) {
    return;
  }

  stateUnattendedStartupReported.value = true;

  let settings: Record<string, unknown> = {};
  try {
    settings = await settingsGet();
  } catch {
    return;
  }

  const machine = toRecord(settings.machine) ?? {};
  const machineCode = String(machine.code ?? '').trim();
  if (!machineCode) {
    return;
  }

  let machineName = String(machine.name ?? '').trim();
  if (!machineName) {
    try {
      machineName = String(await machineHostnameGet()).trim();
    } catch {
      // ignore
    }
  }

  let snapshot: IPageSettingsUnattendedMachineNetworkSnapshot | null = null;
  try {
    snapshot = await machineNetworkGet();
  } catch {
    // ignore
  }

  const network = networkSnapshotToGroups(snapshot);

  try {
    await refreshScenesRemotePatch({
      query: { machineCode },
      body: {
        datas: {
          machineName,
          machineCode,
          network
        }
      },
      ignoreResponseError: true
    });
  } catch {
    // ignore
  }
};

/**
 * 函数：阻止 Tauri 运行时的默认右键菜单
 * @param {MouseEvent} event 鼠标事件
 * @returns {void} 无返回值
 */
const handleTauriContextMenu = (event: MouseEvent): void => {
  if (!isTauriRuntime.value) {
    return;
  }

  event.preventDefault();
};

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

  void unattendedStartupReportOnce();

  if (isTauriRuntime.value) {
    window.addEventListener('contextmenu', handleTauriContextMenu, true);
  }

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

/**
 * 生命周期：卸载后
 */
onUnmounted(() => {
  window.removeEventListener('contextmenu', handleTauriContextMenu, true);
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
