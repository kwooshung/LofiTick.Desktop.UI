<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.connections.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.connections.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <div class="space-y-6">
      <UPageCard variant="outline" :ui="{ root: 'rounded-lg', container: 'divide-y divide-default' }">
        <UFormField
          :label="t('pages.settings.connections.apiBase.label')"
          :description="t('pages.settings.connections.apiBase.description')"
          :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
          class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center"
        >
          <div class="w-full max-w-6xl min-w-0 justify-self-end">
            <FormUrlInput v-model="stateApiBaseValue" class="w-full" :placeholder="t('pages.settings.connections.apiBase.placeholder')" />
          </div>
        </UFormField>

        <UFormField
          :label="t('pages.settings.connections.onepanelPanelBase.label')"
          :description="t('pages.settings.connections.onepanelPanelBase.description')"
          :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
          class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center"
        >
          <div class="w-full max-w-6xl min-w-0 justify-self-end">
            <FormUrlInput v-model="stateOnepanelPanelBaseValue" class="w-full" :placeholder="t('pages.settings.connections.onepanelPanelBase.placeholder')" />
          </div>
        </UFormField>
      </UPageCard>

      <UPageCard variant="outline" :title="t('pages.settings.connections.onepanelLinks.title')" :description="t('pages.settings.connections.onepanelLinks.description')" :ui="{ root: 'rounded-lg', container: 'divide-y divide-default' }">
        <UFormField
          :label="t('pages.settings.connections.onepanelLinks.currentBase')"
          :description="t('pages.settings.connections.onepanelPanelBase.description')"
          :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
          class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center"
        >
          <div class="flex w-full max-w-6xl min-w-0 flex-col gap-2 justify-self-end">
            <FormUrlInput :model-value="computedPanelBase" readonly />

            <div class="flex flex-wrap justify-end gap-2">
              <UButton color="primary" size="sm" icon="i-lucide:arrow-up-right" @click="handleOpenExternal(onepanelLinkBuild(computedPanelBase, ONEPANEL_CRONJOBS_PATH))">
                {{ t('pages.settings.connections.onepanelLinks.actions.openCronjobs') }}
              </UButton>
              <UButton color="neutral" variant="outline" size="sm" icon="i-lucide:library" @click="handleOpenExternal(onepanelLinkBuild(computedPanelBase, ONEPANEL_CRON_LIBRARY_PATH))">
                {{ t('pages.settings.connections.onepanelLinks.actions.openScriptLibrary') }}
              </UButton>
            </div>
          </div>
        </UFormField>

        <template v-for="section in computedOnepanelLinkSections" :key="section.title">
          <div class="not-last:pb-4">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <div class="text-highlighted text-base font-semibold">{{ section.title }}</div>
                <p v-if="section.description" class="text-muted mt-1 text-sm">{{ section.description }}</p>
              </div>
              <UBadge variant="soft">{{ section.groups.length }}</UBadge>
            </div>

            <div class="space-y-4">
              <section v-for="group in section.groups" :key="`${section.title}-${group.title}`" class="border-default bg-elevated/25 rounded-md border p-4">
                <div class="text-highlighted mb-3 text-sm font-medium">{{ group.title }}</div>

                <div class="space-y-3">
                  <UFormField v-for="link in group.links" :key="link.href" :label="link.label" :description="link.path" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted text-xs' }" class="grid gap-3 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center">
                    <div class="flex w-full max-w-6xl min-w-0 items-center gap-2 justify-self-end">
                      <FormUrlInput :model-value="link.href" readonly class="flex-1" />
                      <UButton color="neutral" variant="outline" size="sm" icon="i-lucide:arrow-up-right" @click="handleOpenExternal(link.href)" />
                    </div>
                  </UFormField>
                </div>
              </section>
            </div>
          </div>
        </template>
      </UPageCard>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 窗口。
 */
const tauriWindow = useTauriWindow();

/**
 * Hook：Tauri 直连 API 客户端。
 */
const tauriApiClient = useTauriApiClient();

/**
 * API：服务连接设置。
 */
const { datas: stateConnectionsSettingsRemote, refresh: refreshConnectionsSettingsGet } = await useApi<IPageSettingsConnectionsSettings>('desktop/settings/connections', { immediate: false });
const { refreshDebounced: refreshConnectionsSettingsPatchDebounced } = await useApi<IPageSettingsConnectionsSettings>('desktop/settings/connections', {
  method: 'PATCH',
  immediate: false,
  rateLimit: {
    debounce: {
      wait: 300,
      leading: false,
      trailing: true
    }
  }
});

/**
 * Hook：i18n。
 */
const { t } = useI18n();

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 函数：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 设置面包屑导航状态。
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-proicons:settings',
    to: localePath('/settings'),
    exact: true
  },
  {
    label: t('pages.settings.connections.title'),
    icon: 'i-lucide:cable',
    to: localePath('/settings/connections')
  }
];

/**
 * 常量：Rust API 默认域名。
 */
const DEFAULT_API_BASE = 'http://localhost:8180/';

/**
 * 状态：Rust API 域名。
 */
const stateApiBaseValue = ref('');

/**
 * 状态：1Panel 根域名。
 */
const stateOnepanelPanelBaseValue = ref(ONEPANEL_PANEL_BASE_DEFAULT);

/**
 * 状态：设置项是否已完成首轮加载。
 */
const stateSettingsHydrated = ref(false);

/**
 * 计算属性：当前生效的 1Panel 根域名。
 */
const computedPanelBase = computed(() => onepanelPanelBaseNormalize(stateOnepanelPanelBaseValue.value));

/**
 * 计算属性：1Panel 导航清单。
 */
const computedOnepanelLinkSections = computed(() => {
  return onepanelLinkSections.map((section) => ({
    ...section,
    groups: section.groups.map((group) => ({
      ...group,
      links: group.links.map((link) => ({
        ...link,
        href: onepanelLinkBuild(computedPanelBase.value, link.path)
      }))
    }))
  }));
});

/**
 * 函数：打开外部链接。
 *
 * @param {string} href 目标地址
 * @return {Promise<void>} 无返回值
 */
const handleOpenExternal = async (href: string): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  if (isTauriRuntime.value) {
    await tauriWindow.openExternalUrl(href);
    return;
  }

  window.open(href, '_blank', 'noopener,noreferrer');
};

/**
 * 函数：防抖同步 Tauri 本地 API 配置镜像。
 */
const persistApiBaseLocalDebounced = useDebounceFn(async () => {
  if (!isTauriRuntime.value) {
    return;
  }

  const config = await tauriApiClient.configUpdate({
    apiBase: String(stateApiBaseValue.value || '').trim()
  });
  stateApiBaseValue.value = String(config.apiBase || '').trim();
}, 300);

/**
 * 函数：构建当前服务连接远端配置。
 */
const currentConnectionsSettingsGet = (): IPageSettingsConnectionsSettings => ({
  apiBase: String(stateApiBaseValue.value || '').trim(),
  panelBase: computedPanelBase.value
});

/**
 * 函数：防抖同步服务连接到 Redis。
 */
const persistConnectionsRemoteDebounced = (): void => {
  refreshConnectionsSettingsPatchDebounced({
    body: {
      datas: currentConnectionsSettingsGet()
    }
  });
};

/**
 * 函数：回填 1Panel 设置。
 */
const applyOnepanelSettings = (): void => {
  stateOnepanelPanelBaseValue.value = onepanelPanelBaseNormalize(String(stateConnectionsSettingsRemote.value?.panelBase || '').trim() || ONEPANEL_PANEL_BASE_DEFAULT);
};

/**
 * 函数：加载并填充设置。
 */
const loadSettings = async (): Promise<void> => {
  if (isTauriRuntime.value) {
    const apiClientConfig = await tauriApiClient.configGet();

    stateApiBaseValue.value = String(apiClientConfig.apiBase || '').trim() || DEFAULT_API_BASE;
  }
  stateOnepanelPanelBaseValue.value = ONEPANEL_PANEL_BASE_DEFAULT;

  await refreshConnectionsSettingsGet();

  if (stateConnectionsSettingsRemote.value?.apiBase) {
    stateApiBaseValue.value = String(stateConnectionsSettingsRemote.value.apiBase || '').trim() || DEFAULT_API_BASE;

    if (isTauriRuntime.value) {
      await tauriApiClient.configUpdate({ apiBase: stateApiBaseValue.value });
    }
  }

  applyOnepanelSettings();
  stateSettingsHydrated.value = true;
};

/**
 * 监听：Rust API 域名输入变化后自动保存。
 */
watch(stateApiBaseValue, () => {
  if (!stateSettingsHydrated.value) {
    return;
  }

  persistApiBaseLocalDebounced();
  persistConnectionsRemoteDebounced();
});

/**
 * 监听：1Panel 根域名输入变化后自动保存。
 */
watch(stateOnepanelPanelBaseValue, () => {
  if (!stateSettingsHydrated.value) {
    return;
  }

  persistConnectionsRemoteDebounced();
});

/**
 * 生命周期：页面加载。
 */
onMounted(() => {
  void loadSettings();
});
</script>
