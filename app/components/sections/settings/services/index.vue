<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.services.volcSpeech.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.services.volcSpeech.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'rounded-lg', container: 'divide-y divide-default' }">
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
        class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center"
      >
        <div class="w-full max-w-6xl min-w-0 justify-self-end">
          <UInput v-model="stateVolcSpeechResourceIdValue" :placeholder="t('pages.settings.services.volcSpeech.resourceId.placeholder')" autocomplete="off" :ui="{ trailing: 'pe-1' }" class="w-full">
            <template #trailing>
              <UButton color="neutral" variant="link" size="sm" icon="i-lucide:rotate-ccw" @click="handleResetVolcSpeechResourceId">
                {{ t('pages.settings.services.actions.resetDefaultResourceId') }}
              </UButton>
            </template>
          </UInput>
        </div>
      </UFormField>

      <UFormField :label="t('pages.settings.services.volcSpeech.maleSpeakerCode.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center">
        <template #description>
          <span>
            {{ t('pages.settings.services.volcSpeech.maleSpeakerCode.descriptionPrefix') }}
            <ULink raw href="https://www.volcengine.com/docs/6561/1257544" class="text-primary no-underline hover:underline" @click.prevent="handleVolcSpeechDocsOpen">
              {{ t('pages.settings.services.volcSpeech.maleSpeakerCode.linkLabel') }}
            </ULink>
            {{ t('pages.settings.services.volcSpeech.maleSpeakerCode.descriptionSuffix') }}
          </span>
        </template>
        <div class="w-full max-w-6xl min-w-0 justify-self-end">
          <UInput v-model="stateVolcSpeechMaleSpeakerCodeValue" :placeholder="t('pages.settings.services.volcSpeech.maleSpeakerCode.placeholder')" autocomplete="off" :ui="{ trailing: 'pe-1' }" class="w-full">
            <template #trailing>
              <UButton color="neutral" variant="link" size="sm" icon="i-lucide:rotate-ccw" @click="handleResetVolcSpeechMaleSpeakerCode">
                {{ t('pages.settings.services.actions.resetDefaultMaleSpeakerCode') }}
              </UButton>
            </template>
          </UInput>
        </div>
      </UFormField>

      <UFormField :label="t('pages.settings.services.volcSpeech.femaleSpeakerCode.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="grid gap-3 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:items-center">
        <template #description>
          <span>
            {{ t('pages.settings.services.volcSpeech.femaleSpeakerCode.descriptionPrefix') }}
            <ULink raw href="https://www.volcengine.com/docs/6561/1257544" class="text-primary no-underline hover:underline" @click.prevent="handleVolcSpeechDocsOpen">
              {{ t('pages.settings.services.volcSpeech.femaleSpeakerCode.linkLabel') }}
            </ULink>
            {{ t('pages.settings.services.volcSpeech.femaleSpeakerCode.descriptionSuffix') }}
          </span>
        </template>
        <div class="w-full max-w-6xl min-w-0 justify-self-end">
          <UInput v-model="stateVolcSpeechFemaleSpeakerCodeValue" :placeholder="t('pages.settings.services.volcSpeech.femaleSpeakerCode.placeholder')" autocomplete="off" :ui="{ trailing: 'pe-1' }" class="w-full">
            <template #trailing>
              <UButton color="neutral" variant="link" size="sm" icon="i-lucide:rotate-ccw" @click="handleResetVolcSpeechFemaleSpeakerCode">
                {{ t('pages.settings.services.actions.resetDefaultFemaleSpeakerCode') }}
              </UButton>
            </template>
          </UInput>
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
const DEFAULT_VOLC_SPEECH_MALE_SPEAKER_CODE = 'zh_male_dayixiansheng_v2_saturn_bigtts';
const DEFAULT_VOLC_SPEECH_FEMALE_SPEAKER_CODE = 'zh_female_mizaitongxue_v2_saturn_bigtts';

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 窗口。
 */
const tauriWindow = useTauriWindow();

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
 * 状态：豆包语音男声音色代码。
 */
const stateVolcSpeechMaleSpeakerCodeValue = ref(DEFAULT_VOLC_SPEECH_MALE_SPEAKER_CODE);

/**
 * 状态：豆包语音女声音色代码。
 */
const stateVolcSpeechFemaleSpeakerCodeValue = ref(DEFAULT_VOLC_SPEECH_FEMALE_SPEAKER_CODE);

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
    resourceId: DEFAULT_VOLC_SPEECH_RESOURCE_ID,
    maleSpeakerCode: DEFAULT_VOLC_SPEECH_MALE_SPEAKER_CODE,
    femaleSpeakerCode: DEFAULT_VOLC_SPEECH_FEMALE_SPEAKER_CODE
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
      resourceId: String((volcSpeechRaw as Record<string, unknown>).resourceId || '').trim() || DEFAULT_VOLC_SPEECH_RESOURCE_ID,
      maleSpeakerCode: String((volcSpeechRaw as Record<string, unknown>).maleSpeakerCode || '').trim() || DEFAULT_VOLC_SPEECH_MALE_SPEAKER_CODE,
      femaleSpeakerCode: String((volcSpeechRaw as Record<string, unknown>).femaleSpeakerCode || '').trim() || DEFAULT_VOLC_SPEECH_FEMALE_SPEAKER_CODE
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
  stateVolcSpeechMaleSpeakerCodeValue.value = services.volcSpeech.maleSpeakerCode;
  stateVolcSpeechFemaleSpeakerCodeValue.value = services.volcSpeech.femaleSpeakerCode;
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
    resourceId: String(stateVolcSpeechResourceIdValue.value || '').trim() || DEFAULT_VOLC_SPEECH_RESOURCE_ID,
    maleSpeakerCode: String(stateVolcSpeechMaleSpeakerCodeValue.value || '').trim() || DEFAULT_VOLC_SPEECH_MALE_SPEAKER_CODE,
    femaleSpeakerCode: String(stateVolcSpeechFemaleSpeakerCodeValue.value || '').trim() || DEFAULT_VOLC_SPEECH_FEMALE_SPEAKER_CODE
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
 * 事件：恢复默认男声音色代码。
 *
 * @returns {void} 无返回值
 */
const handleResetVolcSpeechMaleSpeakerCode = (): void => {
  stateVolcSpeechMaleSpeakerCodeValue.value = DEFAULT_VOLC_SPEECH_MALE_SPEAKER_CODE;
};

/**
 * 事件：恢复默认女声音色代码。
 *
 * @returns {void} 无返回值
 */
const handleResetVolcSpeechFemaleSpeakerCode = (): void => {
  stateVolcSpeechFemaleSpeakerCodeValue.value = DEFAULT_VOLC_SPEECH_FEMALE_SPEAKER_CODE;
};

/**
 * 事件：打开豆包语音文档。
 *
 * @returns {Promise<void>} 无返回值
 */
const handleVolcSpeechDocsOpen = async (): Promise<void> => {
  const href = 'https://www.volcengine.com/docs/6561/1257544';

  if (isTauriRuntime.value) {
    await tauriWindow.openExternalUrl(href);
    return;
  }

  window.open(href, '_blank', 'noopener,noreferrer');
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
watch([stateVolcSpeechAppIdValue, stateVolcSpeechAccessTokenValue, stateVolcSpeechResourceIdValue, stateVolcSpeechMaleSpeakerCodeValue, stateVolcSpeechFemaleSpeakerCodeValue], () => {
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
