<template>
  <DashboardPage>
    <UPageCard :title="t('pages.settings.connections.title')" :description="t('pages.settings.connections.description')" variant="naked" />

    <UPageCard variant="outline" :ui="{ container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.connections.apiBase.label')" :description="t('pages.settings.connections.apiBase.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput v-model="stateApiBaseValue" class="w-full max-w-full md:w-120 2xl:w-140" :placeholder="t('pages.settings.connections.apiBase.placeholder')" />
      </UFormField>
      <UFormField :label="t('pages.settings.connections.onepanelApiKey.label')" :description="t('pages.settings.connections.onepanelApiKey.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput id="onepanel-api-key" v-model="stateOnepanelApiKeyValue" :type="stateOnepanelApiKeyVisible ? 'text' : 'password'" class="w-full max-w-full md:w-120 2xl:w-140" :placeholder="t('pages.settings.connections.onepanelApiKey.placeholder')" :ui="{ trailing: 'pe-1' }">
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="stateOnepanelApiKeyVisible ? 'i-lucide-eye' : 'i-lucide-eye-off'"
              :aria-label="stateOnepanelApiKeyVisible ? 'Hide password' : 'Show password'"
              :aria-pressed="stateOnepanelApiKeyVisible"
              aria-controls="onepanel-api-key"
              @click="stateOnepanelApiKeyVisible = !stateOnepanelApiKeyVisible"
            />
          </template>
        </UInput>
      </UFormField>
      <UFormField :label="t('pages.settings.connections.ue5Upstream.label')" :description="t('pages.settings.connections.ue5Upstream.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-3 not-last:pb-4">
        <UInput v-model="stateUe5UpstreamValue" class="w-full max-w-full md:w-120 2xl:w-140" :placeholder="t('pages.settings.connections.ue5Upstream.placeholder')" />
      </UFormField>
    </UPageCard>
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置
 */
const tauriSettings = useTauriSettings();

/**
 * Hook：Tauri 直连 API 客户端
 */
const tauriApiClient = useTauriApiClient();

/**
 * API：1Panel 设置
 */
const { datas: stateOnepanelSettingsRemote, refresh: refreshOnepanelSettingsGet } = await useApi<IPageSettingsOnepanelSettings>('desktop/settings/onepanel', { immediate: false });
const { refresh: refreshOnepanelSettingsPatch } = await useApi<IPageSettingsOnepanelSettings>('desktop/settings/onepanel', { method: 'PATCH', immediate: false });

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 设置面包屑导航状态
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
 * 状态：后端 API Base
 */
const stateApiBaseValue = ref('');

/**
 * 状态：1Panel API Key
 */
const stateOnepanelApiKeyValue = ref('');

/**
 * 状态：1Panel API Key 是否明文显示
 */
const stateOnepanelApiKeyVisible = ref(false);

/**
 * 状态：UE5 上游地址
 */
const stateUe5UpstreamValue = ref('');

/**
 * 状态：API Base 保存中
 */
const stateApiBaseSaving = ref(false);

/**
 * 状态：1Panel API Key 保存中
 */
const stateOnepanelApiKeySaving = ref(false);

/**
 * 状态：UE5 上游地址保存中
 */
const stateUe5UpstreamSaving = ref(false);

/**
 * 状态：设置项是否已完成首轮加载
 */
const stateSettingsHydrated = ref(false);

/**
 * 事件：保存后端 API Base
 */
const handleSaveApiBase = async (): Promise<void> => {
  if (!isTauriRuntime.value || stateApiBaseSaving.value) {
    return;
  }

  stateApiBaseSaving.value = true;
  try {
    const config = await tauriApiClient.configUpdate({ apiBase: String(stateApiBaseValue.value || '').trim() });
    stateApiBaseValue.value = String(config.apiBase || '').trim();
  } finally {
    stateApiBaseSaving.value = false;
  }
};

/**
 * 事件：保存 1Panel API Key
 */
const handleSaveOnepanelApiKey = async (): Promise<void> => {
  if (stateOnepanelApiKeySaving.value) {
    return;
  }

  stateOnepanelApiKeySaving.value = true;
  try {
    await refreshOnepanelSettingsPatch({
      body: {
        datas: {
          apiKey: String(stateOnepanelApiKeyValue.value || '').trim()
        }
      }
    });

    stateOnepanelApiKeyValue.value = String(stateOnepanelSettingsRemote.value?.apiKey || stateOnepanelApiKeyValue.value || '').trim();
  } finally {
    stateOnepanelApiKeySaving.value = false;
  }
};

/**
 * 事件：保存 UE5 上游地址
 */
const handleSaveUe5Upstream = async (): Promise<void> => {
  if (!isTauriRuntime.value || stateUe5UpstreamSaving.value) {
    return;
  }

  stateUe5UpstreamSaving.value = true;
  try {
    const result = await tauriSettings.update({
      unattended: {
        sentinel: {
          request: {
            url: String(stateUe5UpstreamValue.value || '').trim()
          }
        }
      }
    });

    const unattended = typeof result.unattended === 'object' && result.unattended && !Array.isArray(result.unattended) ? (result.unattended as Record<string, unknown>) : {};
    const sentinel = typeof unattended.sentinel === 'object' && unattended.sentinel && !Array.isArray(unattended.sentinel) ? (unattended.sentinel as Record<string, unknown>) : {};
    const request = typeof sentinel.request === 'object' && sentinel.request && !Array.isArray(sentinel.request) ? (sentinel.request as Record<string, unknown>) : {};

    stateUe5UpstreamValue.value = String(request.url || '').trim();
  } finally {
    stateUe5UpstreamSaving.value = false;
  }
};

/**
 * 函数：自动保存 API Base（防抖）
 */
const persistApiBaseDebounced = useDebounceFn(() => {
  void handleSaveApiBase();
}, 300);

/**
 * 函数：自动保存 1Panel API Key（防抖）
 */
const persistOnepanelApiKeyDebounced = useDebounceFn(() => {
  void handleSaveOnepanelApiKey();
}, 300);

/**
 * 函数：自动保存 UE5 上游域名（防抖）
 */
const persistUe5UpstreamDebounced = useDebounceFn(() => {
  void handleSaveUe5Upstream();
}, 300);

/**
 * 函数：加载并填充设置。
 */
const loadSettings = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  const conf = await tauriSettings.get();
  const apiClientConfig = await tauriApiClient.configGet();

  stateApiBaseValue.value = String(apiClientConfig.apiBase || '').trim();
  stateOnepanelApiKeyValue.value = '';
  stateUe5UpstreamValue.value = String((((conf.unattended as Record<string, unknown> | undefined)?.sentinel as Record<string, unknown> | undefined)?.request as Record<string, unknown> | undefined)?.url || '').trim();

  await refreshOnepanelSettingsGet();
  stateOnepanelApiKeyValue.value = String(stateOnepanelSettingsRemote.value?.apiKey || '').trim();
  stateSettingsHydrated.value = true;
};

/**
 * 监听：API Base 输入变化后自动保存
 */
watch(stateApiBaseValue, () => {
  if (!stateSettingsHydrated.value) {
    return;
  }

  persistApiBaseDebounced();
});

/**
 * 监听：1Panel API Key 输入变化后自动保存
 */
watch(stateOnepanelApiKeyValue, () => {
  if (!stateSettingsHydrated.value) {
    return;
  }

  persistOnepanelApiKeyDebounced();
});

/**
 * 监听：UE5 上游域名输入变化后自动保存
 */
watch(stateUe5UpstreamValue, () => {
  if (!stateSettingsHydrated.value) {
    return;
  }

  persistUe5UpstreamDebounced();
});

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  await loadSettings();
});
</script>

<style>
::-ms-reveal {
  display: none;
}
</style>
