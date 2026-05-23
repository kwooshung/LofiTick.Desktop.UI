<template>
  <DashboardPage>
    <UPageCard :title="t('pages.settings.services.title')" :description="t('pages.settings.services.description')" variant="naked" />

    <UPageCard variant="outline" :ui="{ root: 'rounded-lg', header: 'py-4', container: 'divide-y divide-default' }">
      <template #header>
        <div class="min-w-0 flex-1">
          <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.services.volcSpeech.title') }}</div>
          <div class="text-muted mt-1 text-[15px] leading-6 text-pretty">{{ t('pages.settings.services.volcSpeech.description') }}</div>
        </div>
      </template>

      <UFormField
        :label="t('pages.settings.services.volcSpeech.appId.label')"
        :description="t('pages.settings.services.volcSpeech.appId.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center"
      >
        <div class="w-full max-w-6xl min-w-0 justify-self-end">
          <UInput v-model="stateVolcSpeechAppIdValue" class="w-full" :placeholder="t('pages.settings.services.volcSpeech.appId.placeholder')" autocomplete="off" />
        </div>
      </UFormField>

      <UFormField
        :label="t('pages.settings.services.volcSpeech.accessToken.label')"
        :description="t('pages.settings.services.volcSpeech.accessToken.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center"
      >
        <div class="w-full max-w-6xl min-w-0 justify-self-end">
          <UInput
            id="volc-speech-access-token"
            v-model="stateVolcSpeechAccessTokenValue"
            :type="stateVolcSpeechAccessTokenVisible ? 'text' : 'password'"
            :placeholder="t('pages.settings.services.volcSpeech.accessToken.placeholder')"
            autocomplete="new-password"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
          >
            <template #trailing>
              <div class="flex items-center">
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="stateVolcSpeechAccessTokenVisible ? 'i-lucide:eye' : 'i-lucide:eye-off'"
                  :aria-label="stateVolcSpeechAccessTokenVisible ? t('pages.settings.services.actions.hideAccessToken') : t('pages.settings.services.actions.showAccessToken')"
                  :aria-pressed="stateVolcSpeechAccessTokenVisible"
                  aria-controls="volc-speech-access-token"
                  @click="handleToggleAccessTokenVisible"
                />
              </div>
            </template>
          </UInput>
        </div>
      </UFormField>

      <UFormField
        :label="t('pages.settings.services.volcSpeech.resourceId.label')"
        :description="t('pages.settings.services.volcSpeech.resourceId.description')"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="grid gap-3 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center"
      >
        <div class="flex w-full max-w-6xl min-w-0 items-center gap-2 justify-self-end">
          <UInput v-model="stateVolcSpeechResourceIdValue" class="flex-1" :placeholder="t('pages.settings.services.volcSpeech.resourceId.placeholder')" autocomplete="off" />
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide:rotate-ccw" @click="handleResetVolcSpeechResourceId">
            {{ t('pages.settings.services.actions.resetDefaultResourceId') }}
          </UButton>
        </div>
      </UFormField>
    </UPageCard>
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * 常量：豆包语音默认资源标识。
 */
const DEFAULT_VOLC_SPEECH_RESOURCE_ID = 'volc.service_type.10050';

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置。
 */
const tauriSettings = useTauriSettings();

/**
 * API：服务凭证设置。
 */
const { datas: stateServicesRemote, refresh: refreshServicesGet } = await useApi<ISettingsServices>('desktop/settings/services', { immediate: false });
const { refreshDebounced: refreshServicesPatchDebounced } = await useApi<ISettingsServices>('desktop/settings/services', {
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
    label: t('pages.settings.services.title'),
    icon: 'i-lucide:key-round',
    to: localePath('/settings/services')
  }
];

/**
 * 状态：豆包语音 App ID。
 */
const stateVolcSpeechAppIdValue = ref('');

/**
 * 状态：豆包语音 Access Token。
 */
const stateVolcSpeechAccessTokenValue = ref('');

/**
 * 状态：豆包语音 Resource ID。
 */
const stateVolcSpeechResourceIdValue = ref(DEFAULT_VOLC_SPEECH_RESOURCE_ID);

/**
 * 状态：是否展示 Access Token 明文。
 */
const stateVolcSpeechAccessTokenVisible = ref(false);

/**
 * 状态：设置项是否已完成首轮加载。
 */
const stateSettingsHydrated = ref(false);

/**
 * 函数：返回默认服务凭证设置。
 *
 * @returns {ISettingsServices} 默认服务凭证。
 */
const defaultServicesSettingsGet = (): ISettingsServices => ({
  volcSpeech: {
    appId: '',
    accessToken: '',
    resourceId: DEFAULT_VOLC_SPEECH_RESOURCE_ID
  }
});

/**
 * 函数：规范化服务凭证设置。
 *
 * @param {Record<string, unknown>} settings 完整 settings JSON
 * @returns {ISettingsServices} 规范化后的服务凭证设置
 */
const servicesSettingsResolve = (settings: Record<string, unknown>): ISettingsServices => {
  const defaults = defaultServicesSettingsGet();
  const servicesRaw = settings.services;

  if (!servicesRaw || typeof servicesRaw !== 'object' || Array.isArray(servicesRaw)) {
    return defaults;
  }

  const volcSpeechRaw = (servicesRaw as Record<string, unknown>).volcSpeech;

  if (!volcSpeechRaw || typeof volcSpeechRaw !== 'object' || Array.isArray(volcSpeechRaw)) {
    return defaults;
  }

  return {
    volcSpeech: {
      appId: String((volcSpeechRaw as Record<string, unknown>).appId || '').trim(),
      accessToken: String((volcSpeechRaw as Record<string, unknown>).accessToken || '').trim(),
      resourceId: String((volcSpeechRaw as Record<string, unknown>).resourceId || '').trim() || DEFAULT_VOLC_SPEECH_RESOURCE_ID
    }
  };
};

/**
 * 函数：回填服务凭证设置。
 *
 * @param {ISettingsServices} services 服务凭证设置
 * @returns {void} 无返回值
 */
const applyServicesState = (services: ISettingsServices): void => {
  stateVolcSpeechAppIdValue.value = services.volcSpeech.appId;
  stateVolcSpeechAccessTokenValue.value = services.volcSpeech.accessToken;
  stateVolcSpeechResourceIdValue.value = services.volcSpeech.resourceId;
};

/**
 * 函数：从完整本地 settings 回填服务凭证设置。
 *
 * @param {Record<string, unknown>} settings 完整 settings JSON
 * @returns {void} 无返回值
 */
const applyServicesSettings = (settings: Record<string, unknown>): void => {
  applyServicesState(servicesSettingsResolve(settings));
};

/**
 * 函数：获取当前页面上的服务凭证设置。
 *
 * @returns {ISettingsServices} 当前服务凭证设置
 */
const currentServicesSettingsGet = (): ISettingsServices => ({
  volcSpeech: {
    appId: String(stateVolcSpeechAppIdValue.value || '').trim(),
    accessToken: String(stateVolcSpeechAccessTokenValue.value || '').trim(),
    resourceId: String(stateVolcSpeechResourceIdValue.value || '').trim() || DEFAULT_VOLC_SPEECH_RESOURCE_ID
  }
});

/**
 * 函数：同步本地服务凭证镜像。
 *
 * @param {ISettingsServices} services 服务凭证设置
 * @returns {Promise<void>} 无返回值
 */
const syncLocalServicesSettings = async (services: ISettingsServices): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriSettings.update({ services });
};

/**
 * 事件：切换 Access Token 显示状态。
 *
 * @returns {void} 无返回值
 */
const handleToggleAccessTokenVisible = (): void => {
  stateVolcSpeechAccessTokenVisible.value = !stateVolcSpeechAccessTokenVisible.value;
};

/**
 * 事件：恢复默认 Resource ID。
 *
 * @returns {void} 无返回值
 */
const handleResetVolcSpeechResourceId = (): void => {
  stateVolcSpeechResourceIdValue.value = DEFAULT_VOLC_SPEECH_RESOURCE_ID;
};

/**
 * 函数：自动同步本地服务凭证镜像（防抖）。
 */
const persistServicesLocalDebounced = useDebounceFn(() => {
  void syncLocalServicesSettings(currentServicesSettingsGet());
}, 300);

/**
 * 函数：自动同步服务凭证到 Redis（防抖）。
 */
const persistServicesRemoteDebounced = (): void => {
  refreshServicesPatchDebounced({
    body: {
      datas: currentServicesSettingsGet()
    }
  });
};

/**
 * 函数：加载并填充设置。
 *
 * @returns {Promise<void>} 无返回值
 */
const loadSettings = async (): Promise<void> => {
  if (isTauriRuntime.value) {
    const settings = await tauriSettings.get();
    applyServicesSettings(settings);
  }

  await refreshServicesGet();

  if (stateServicesRemote.value) {
    applyServicesState(stateServicesRemote.value);
    await syncLocalServicesSettings(stateServicesRemote.value);
  }

  stateSettingsHydrated.value = true;
};

/**
 * 监听：服务凭证输入变化后自动保存。
 */
watch([stateVolcSpeechAppIdValue, stateVolcSpeechAccessTokenValue, stateVolcSpeechResourceIdValue], () => {
  if (!stateSettingsHydrated.value) {
    return;
  }

  persistServicesLocalDebounced();
  persistServicesRemoteDebounced();
});

/**
 * 生命周期：页面加载。
 */
onMounted(() => {
  void loadSettings();
});
</script>
