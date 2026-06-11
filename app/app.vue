<template>
  <UApp :locale="locales[locale]" :toaster="appConfig.toaster">
    <UTheme>
      <NuxtRouteAnnouncer />
      <NuxtLoadingIndicator color="var(--ui-primary)" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <SettingsUnattendedScenesSyncDialog />
      <SettingsHotsearchAttachmentsDirDialog v-model:open="stateHotsearchAttachmentsDirDialogOpen" @selected="handleHotsearchAttachmentsDirPick" />
    </UTheme>
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
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：运行时配置
 */
const runtimeConfig = useRuntimeConfig();

/**
 * Hook：Tauri 直连 API 客户端
 */
const { configGet: tauriApiClientConfigGet, configUpdate: tauriApiClientConfigUpdate } = useTauriApiClient();

/**
 * Hook：Tauri 设置
 */
const { get: settingsGet, update: settingsUpdate, machineNetworkGet, machineHostnameGet, pathsExistGet, hotsearchPodcastHeadMusicPathsGet, hotsearchPodcastHeadMusicWrite } = useTauriSettings();

/**
 * Hook：无人值守场景差异确认弹窗
 */
const { request: unattendedScenesSyncRequest } = useUnattendedScenesSyncDialog();

/**
 * 状态：启动静默上报是否已执行
 */
const stateUnattendedStartupReported = useState<boolean>('unattended-startup-reported', () => false);

/**
 * 状态：壳侧 API 客户端配置是否已同步
 */
const stateTauriApiClientConfigured = useState<boolean>('tauri-api-client-configured', () => false);

/**
 * 状态：启动同步是否已执行
 */
const stateStartupSharedSettingsSynced = useState<boolean>('startup-shared-settings-synced', () => false);

/**
 * 状态：启动场景差异确认是否已执行
 */
const stateStartupScenesSyncHandled = useState<boolean>('startup-scenes-sync-handled', () => false);

/**
 * 状态：启动期附件目录提示弹窗。
 */
const stateHotsearchAttachmentsDirDialogOpen = useState<boolean>('hotsearch-attachments-dir-dialog-open', () => false);

/**
 * API：热搜配置（GET）
 * 描述：用于启动时将 Redis 公共配置镜像到本地 settings。
 */
const { datas: stateHotsearchRemoteConfig, refresh: refreshHotsearchRemoteGet } = await useApi<ISettingsHotsearch>('desktop/settings/hotsearch', { immediate: false });
const { datas: stateHotsearchPodcastGenerateOwnerRemote, refresh: refreshHotsearchPodcastGenerateOwnerGet } = await useApi<ISettingsHotsearchPodcastGenerateOwner>('desktop/settings/hotsearch/podcast_generate_owner', { immediate: false });
const { refresh: refreshHotsearchPodcastGenerateOwnerPatch } = await useApi<ISettingsHotsearchPodcastGenerateOwner>('desktop/settings/hotsearch/podcast_generate_owner', {
  method: 'PATCH',
  immediate: false
});
const { datas: stateUpyunObjectUrl, refresh: refreshUpyunObjectUrlGet } = await useApi<Record<string, unknown>>(`storages/upyun/${HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET}/objects/url`, { immediate: false });

/**
 * API：服务凭证（GET）
 * 描述：用于启动时将 Redis 公共配置镜像到本地 settings。
 */
const { datas: stateServicesRemoteConfig, refresh: refreshServicesRemoteGet } = await useApi<ISettingsServices>('desktop/settings/services', { immediate: false });

/**
 * API：场景配置（GET）
 * 描述：用于启动时发现本地与远程差异并弹出确认。
 */
const { datas: stateScenesRemoteFetched, refresh: refreshScenesRemoteGet } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { immediate: false });

/**
 * API：场景配置（PATCH）
 * 描述：用于启动时静默上报本机网络信息。
 */
const { refresh: refreshScenesRemotePatch } = await useApi<IPageSettingsUnattendedScenesMachineRedisConfig>('desktop/settings/unattended/scenes', { method: 'PATCH', immediate: false });

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
 * 函数：拼接启动期固定开头音乐原始远端地址。
 * @param {string} path 对象路径
 * @returns {string} 远端地址；未配置公开域名时返回空字符串
 */
const startupHotsearchHeadMusicRemoteUrlBuild = (path: string): string => {
  const domain = String(runtimeConfig.public.upyunFilesDomain || '')
    .trim()
    .replace(/\/+$/, '');
  const normalizedPath = String(path || '').trim();

  if (!domain || !normalizedPath) {
    return '';
  }

  return `${domain}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
};

/**
 * 函数：刷新播客生成占用信息。
 * @returns {Promise<ISettingsHotsearchPodcastGenerateOwner | null>} 占用信息
 */
const startupHotsearchPodcastGenerateOwnerRefresh = async (): Promise<ISettingsHotsearchPodcastGenerateOwner | null> => {
  try {
    await refreshHotsearchPodcastGenerateOwnerGet({ ignoreResponseError: true });
    return hotsearchPodcastGenerateOwnerNormalize(stateHotsearchPodcastGenerateOwnerRemote.value);
  } catch {
    return null;
  }
};

/**
 * 函数：读取启动期固定开头音乐远端对象路径。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @param {ISettingsHotsearchLocal} hotsearch 热搜设置
 * @returns {string} 已持久化的对象路径
 */
const startupHotsearchHeadMusicRemotePathGet = (kind: THotsearchPodcastHeadMusicKind, hotsearch: ISettingsHotsearchLocal): string => {
  return String(hotsearch.podcastHeadMusicRemotePaths?.[kind] ?? '').trim();
};

/**
 * 函数：从云端同步固定开头音乐到本地。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型
 * @param {ISettingsHotsearchLocal} hotsearch 热搜设置
 * @returns {Promise<void>} 无返回值
 */
const startupHotsearchHeadMusicSyncFromRemote = async (kind: THotsearchPodcastHeadMusicKind, hotsearch: ISettingsHotsearchLocal): Promise<void> => {
  const remotePath = startupHotsearchHeadMusicRemotePathGet(kind, hotsearch);
  if (!remotePath) {
    throw new Error('hotsearch head music path missing');
  }

  let url = startupHotsearchHeadMusicRemoteUrlBuild(remotePath);

  if (!url) {
    stateUpyunObjectUrl.value = undefined;
    await refreshUpyunObjectUrlGet({
      query: {
        path: remotePath,
        ttl_sec: 600
      }
    });

    url = String(toRecord(stateUpyunObjectUrl.value)?.url ?? '').trim();
  }

  if (!url) {
    throw new Error('hotsearch head music url missing');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('hotsearch head music download failed');
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  await hotsearchPodcastHeadMusicWrite(kind, Array.from(bytes));
};

/**
 * 函数：同步启动期播客生成状态。
 * @returns {Promise<void>} 无返回值
 */
const startupHotsearchPodcastGenerateSync = async (): Promise<void> => {
  const settings = await settingsGet();
  const hotsearch = hotsearchLocalSettingsNormalize((settings as Record<string, unknown>).hotsearch);

  if (!hotsearch.podcastGenerateEnabled) {
    return;
  }

  const machine = toRecord((settings as Record<string, unknown>).machine) ?? {};
  const machineCode = String(machine.code ?? '').trim();
  let machineName = String(machine.name ?? '').trim();

  if (!machineName) {
    try {
      machineName = String(await machineHostnameGet()).trim();
    } catch {
      machineName = '';
    }
  }

  if (!machineCode) {
    await settingsUpdate({
      hotsearch: {
        ...hotsearch,
        podcastGenerateEnabled: false
      }
    });
    return;
  }

  const owner = await startupHotsearchPodcastGenerateOwnerRefresh();
  if (owner && owner.machineCode !== machineCode) {
    await settingsUpdate({
      hotsearch: {
        ...hotsearch,
        podcastGenerateEnabled: false
      }
    });
    return;
  }

  let headMusicPaths: Awaited<ReturnType<typeof hotsearchPodcastHeadMusicPathsGet>> | null = null;
  try {
    headMusicPaths = await hotsearchPodcastHeadMusicPathsGet();
  } catch {
    stateHotsearchAttachmentsDirDialogOpen.value = true;
    return;
  }

  const remoteExistsList = HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS.map((kind) => startupHotsearchHeadMusicRemotePathGet(kind, hotsearch) !== '');
  if (remoteExistsList.some((exists) => !exists)) {
    await settingsUpdate({
      hotsearch: {
        ...hotsearch,
        podcastGenerateEnabled: false
      }
    });
    return;
  }

  const localExistsResults = await pathsExistGet([headMusicPaths.normalPath, headMusicPaths.vipPath]);
  const localExistsMap = localExistsResults.reduce<Record<string, boolean>>((acc, item) => {
    acc[String(item.path || '').trim()] = Boolean(item.exists);
    return acc;
  }, {});

  if (!localExistsMap[headMusicPaths.normalPath]) {
    await startupHotsearchHeadMusicSyncFromRemote('normal', hotsearch);
  }
  if (!localExistsMap[headMusicPaths.vipPath]) {
    await startupHotsearchHeadMusicSyncFromRemote('vip', hotsearch);
  }

  await refreshHotsearchPodcastGenerateOwnerPatch({
    body: {
      datas: {
        enabled: true,
        machineCode,
        machineName
      }
    },
    ignoreResponseError: true
  });
};

/**
 * 函数：处理启动期附件目录选择。
 * @param {string} _picked 已保存目录
 * @returns {Promise<void>} 无返回值
 */
const handleHotsearchAttachmentsDirPick = async (_picked: string): Promise<void> => {
  try {
    await startupHotsearchPodcastGenerateSync();
  } catch (error) {
    console.warn('[startup-sync] hotsearch attachments dir follow-up failed', error);
  }
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
 * 函数：同步 Redis 共享设置到本地镜像。
 * 描述：当前覆盖热搜配置与服务凭证，避免首次启动必须先进入设置页才能下发到本地。
 */
const sharedSettingsSyncOnStartup = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }
  if (stateStartupSharedSettingsSynced.value) {
    return;
  }

  stateStartupSharedSettingsSynced.value = true;

  try {
    await refreshHotsearchRemoteGet({ ignoreResponseError: true });
    if (stateHotsearchRemoteConfig.value) {
      const settings = await settingsGet();
      const currentLocalSettings = hotsearchLocalSettingsNormalize((settings as Record<string, unknown>).hotsearch);

      await settingsUpdate({
        hotsearch: {
          ...currentLocalSettings,
          ...hotsearchSharedSettingsExtract(stateHotsearchRemoteConfig.value)
        }
      });
    }
  } catch {
    // ignore
  }

  try {
    await startupHotsearchPodcastGenerateSync();
  } catch (error) {
    console.warn('[startup-sync] hotsearch podcast generate sync failed', error);
  }

  try {
    await refreshServicesRemoteGet({ ignoreResponseError: true });
    if (stateServicesRemoteConfig.value) {
      await settingsUpdate({
        services: stateServicesRemoteConfig.value
      });
    }
  } catch {
    // ignore
  }
};

/**
 * 函数：构建路径存在性映射。
 * @param {string[]} paths 路径列表
 * @returns {Promise<Record<string, boolean>>} 路径存在性映射
 */
const startupExecExistsMapBuild = async (paths: string[]): Promise<Record<string, boolean>> => {
  const uniquePaths = Array.from(new Set(paths.map((item) => String(item || '').trim()).filter((item) => item !== '')));
  if (uniquePaths.length === 0) {
    return {};
  }

  const results = await pathsExistGet(uniquePaths);
  return results.reduce<Record<string, boolean>>((acc, item) => {
    acc[String(item.path || '').trim()] = Boolean(item.exists);
    return acc;
  }, {});
};

/**
 * 函数：同步一份场景列表到本地与远端。
 * @param {string} machineCode 机器码
 * @param {string} machineName 机器名称
 * @param {IPageSettingsUnattendedScenesItem[]} items 场景列表
 * @param {ISettingsUnattendedScenesLocal} rollbackState 本地回滚副本
 * @returns {Promise<void>} 无返回值
 */
const startupScenesPersistLocalAndRemote = async (machineCode: string, machineName: string, items: IPageSettingsUnattendedScenesItem[], rollbackState: ISettingsUnattendedScenesLocal): Promise<void> => {
  const nextLocal = {
    updatedAt: new Date().toISOString(),
    items: unattendedScenesItemsNormalize(items)
  } satisfies ISettingsUnattendedScenesLocal;

  await settingsUpdate({
    unattended: {
      scenes: nextLocal
    }
  });

  try {
    await refreshScenesRemotePatch({
      query: { machineCode },
      body: {
        datas: {
          machineName,
          machineCode,
          items: unattendedScenesItemsNormalize(items)
        }
      },
      ignoreResponseError: true
    });
  } catch {
    await settingsUpdate({
      unattended: {
        scenes: rollbackState
      }
    });
    throw new Error('startup scenes sync failed');
  }
};

/**
 * 函数：启动时检查本地与远程场景差异。
 * 描述：发现差异时直接弹出与设置页相同的确认弹窗。
 */
const unattendedScenesSyncOnStartup = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }
  if (stateStartupScenesSyncHandled.value) {
    return;
  }

  stateStartupScenesSyncHandled.value = true;

  let settings: Record<string, unknown> = {};
  try {
    settings = await settingsGet();
  } catch {
    return;
  }

  const machine = toRecord(settings.machine) ?? {};
  const unattended = toRecord(settings.unattended) ?? {};
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

  try {
    await refreshScenesRemoteGet({ query: { machineCode }, ignoreResponseError: true });
  } catch {
    // ignore
  }

  const local = unattendedScenesLocalNormalize(unattended.scenes);
  const remote = stateScenesRemoteFetched.value
    ? {
        ...stateScenesRemoteFetched.value,
        items: unattendedScenesItemsNormalize(stateScenesRemoteFetched.value.items)
      }
    : null;

  if (local.items.length === 0 && (!remote || remote.items.length === 0)) {
    return;
  }

  const paths = [...local.items.map((item) => item.execPath), ...(Array.isArray(remote?.items) ? remote.items.map((item) => item.execPath) : [])];
  const execExistsByPath = await startupExecExistsMapBuild(paths);
  const entries = unattendedScenesSyncEntriesBuild({ local, remote, execExistsByPath });

  if (entries.every((entry) => entry.status === 'same')) {
    return;
  }

  const choice = await unattendedScenesSyncRequest({
    machineCode,
    machineName: String(machineName || remote?.machineName || '').trim(),
    local,
    remote,
    entries
  });

  if (choice === 'remote') {
    await startupScenesPersistLocalAndRemote(machineCode, machineName, unattendedScenesItemsNormalize(remote?.items), local);
    return;
  }

  if (choice === 'local') {
    await startupScenesPersistLocalAndRemote(machineCode, machineName, local.items, local);
    return;
  }

  const mergedItems = unattendedScenesMergePreferLocal(local.items, unattendedScenesItemsNormalize(remote?.items));
  await startupScenesPersistLocalAndRemote(machineCode, machineName, mergedItems, local);
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
 * 函数：同步壳侧 API 客户端配置
 * 描述：仅在 Tauri 运行时执行一次，把前端 runtimeConfig 中的 apiBase/signAesSeed 写入桌面壳。
 */
const tauriApiClientConfigSyncOnce = async (): Promise<void> => {
  if (!import.meta.client) {
    return;
  }
  if (!isTauriRuntime.value) {
    return;
  }
  if (stateTauriApiClientConfigured.value) {
    return;
  }

  const apiBase = String(runtimeConfig.public.apiBase || '').trim();
  const signAesSeed = String(runtimeConfig.public.signAesSeed || '').trim();
  if (!apiBase && !signAesSeed) {
    console.warn('[tauri-api-client] runtime config missing', {
      apiBaseReady: Boolean(apiBase),
      signAesSeedReady: Boolean(signAesSeed)
    });
    return;
  }

  const currentConfig = await tauriApiClientConfigGet();
  const nextPatch: IApiClientConfigPatch = {};

  if (!String(currentConfig.apiBase || '').trim() && apiBase) {
    nextPatch.apiBase = apiBase;
  }

  if (!String(currentConfig.signAesSeed || '').trim() && signAesSeed) {
    nextPatch.signAesSeed = signAesSeed;
  }

  if (Object.keys(nextPatch).length > 0) {
    await tauriApiClientConfigUpdate(nextPatch);
  }

  stateTauriApiClientConfigured.value = true;
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
 * 函数：从 localStorage 加载并应用主题设置。
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
 * 事件：阻止 Tauri 默认右键菜单。
 * @param {MouseEvent} event 右键菜单事件。
 */
const handleTauriContextMenuDefaultPrevent = (event: MouseEvent): void => {
  if (!isTauriRuntime.value) {
    return;
  }

  event.preventDefault();
};

/**
 * 生命周期：挂载后
 */
onMounted(() => {
  document.addEventListener('contextmenu', handleTauriContextMenuDefaultPrevent);

  loadSettings();

  void (async () => {
    try {
      await tauriApiClientConfigSyncOnce();
    } catch (error) {
      console.warn('[tauri-api-client] config sync failed', error);
    }

    try {
      await sharedSettingsSyncOnStartup();
    } catch (error) {
      console.warn('[startup-sync] shared settings sync failed', error);
    }

    await unattendedStartupReportOnce();

    try {
      await unattendedScenesSyncOnStartup();
    } catch (error) {
      console.warn('[startup-sync] unattended scenes sync failed', error);
    }
  })();

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
onBeforeUnmount(() => {
  document.removeEventListener('contextmenu', handleTauriContextMenuDefaultPrevent);
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
