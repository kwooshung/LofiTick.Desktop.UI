<template>
  <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center' }">
    <template #header>
      <div class="flex-1">
        <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.unattended.sections.ue5.title') }}</div>
        <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.unattended.sections.ue5.description') }}</div>
      </div>
    </template>
  </UPageCard>

  <UPageCard variant="outline" :ui="{ root: 'mb-10', container: 'divide-y divide-default' }">
    <UFormField
      :label="t('pages.settings.unattended.sections.ue5.form.endpoint.label')"
      :description="t('pages.settings.unattended.sections.ue5.form.endpoint.description')"
      :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
      class="flex items-center justify-between gap-2 not-last:pb-4"
    >
      <FormUrlInput readonly :model-value="computedBaseUrl" placeholder="-" class="w-full max-w-full md:w-136 2xl:w-160">
        <template #actions>
          <div class="flex items-center gap-0.5">
            <UTooltip :text="t('pages.settings.unattended.tooltips.copyToClipboard')" :content="{ side: 'top' }">
              <UButton :color="copiedGet('base') ? 'success' : 'neutral'" variant="link" size="sm" :icon="copiedGet('base') ? 'i-lucide:copy-check' : 'i-lucide:copy'" :ui="{ leadingIcon: 'text-muted' }" @click.stop="handleCopy('base', computedBaseUrl)" />
            </UTooltip>
            <UTooltip :text="t('pages.settings.unattended.tooltips.openLink')" :content="{ side: 'top' }">
              <ULink raw :href="computedBaseUrl" class="text-muted hover:text-primary inline-flex items-center justify-center no-underline" @click.stop.prevent="handleLinkOpen(computedBaseUrl)">
                <UIcon name="i-lucide:external-link" class="size-4 shrink-0" />
              </ULink>
            </UTooltip>
          </div>
        </template>
      </FormUrlInput>
    </UFormField>
  </UPageCard>

  <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center' }">
    <template #header>
      <div class="flex-1">
        <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.unattended.sections.ue5.modal.title') }}</div>
        <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.unattended.sections.ue5.modal.description') }}</div>
      </div>
    </template>
  </UPageCard>

  <UPageCard variant="outline" :ui="{ root: 'mb-10', container: 'divide-y divide-default' }">
    <template v-if="computedRequests.length > 0">
      <div v-for="request in computedRequests" :key="request.id" class="flex flex-col gap-3 not-last:pb-4 md:flex-row md:items-start md:justify-between md:gap-4">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <div class="text-highlighted text-base font-medium text-pretty">{{ request.title }}</div>
            <UBadge color="primary" variant="subtle">{{ request.method }}</UBadge>
          </div>
          <div class="text-muted mt-1 text-sm text-pretty">{{ request.description }}</div>
          <div v-if="request.params.length > 0" class="mt-2 space-y-1.5">
            <div v-for="param in request.params" :key="`${request.id}|${param.name}|${param.value}`" class="text-muted font-mono text-xs">
              <span class="text-highlighted">{{ param.name }}</span>
              <span class="px-1">=</span>
              <span>{{ param.value || '-' }}</span>
            </div>
          </div>
        </div>

        <FormUrlInput readonly :model-value="request.url" class="w-full max-w-full md:w-136 2xl:w-160">
          <template #actions>
            <div class="flex items-center gap-0.5">
              <UTooltip :text="t('pages.settings.unattended.tooltips.copyToClipboard')" :content="{ side: 'top' }">
                <UButton
                  :color="copiedGet(`request|${request.id}`) ? 'success' : 'neutral'"
                  variant="link"
                  size="sm"
                  :icon="copiedGet(`request|${request.id}`) ? 'i-lucide:copy-check' : 'i-lucide:copy'"
                  :ui="{ leadingIcon: 'text-muted' }"
                  @click.stop="handleCopy(`request|${request.id}`, request.url)"
                />
              </UTooltip>
              <UTooltip :text="t('pages.settings.unattended.tooltips.openLink')" :content="{ side: 'top' }">
                <ULink raw :href="request.url" class="text-muted hover:text-primary inline-flex items-center justify-center no-underline" @click.stop.prevent="handleLinkOpen(request.url)">
                  <UIcon name="i-lucide:external-link" class="size-4 shrink-0" />
                </ULink>
              </UTooltip>
            </div>
          </template>
        </FormUrlInput>
      </div>
    </template>

    <UEmpty v-else icon="i-lucide:link-2-off" :title="t('pages.settings.unattended.sections.ue5.modal.empty.title')" :description="t('pages.settings.unattended.sections.ue5.modal.empty.description')" />
  </UPageCard>

  <UAlert v-if="stateDetailError" color="warning" variant="soft" icon="i-lucide:triangle-alert" :title="t('pages.settings.unattended.sections.ue5.modal.errorTitle')" :description="stateDetailError" />
</template>

<script setup lang="ts">
/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 窗口能力
 */
const { openExternalUrl } = useTauriWindow();

/**
 * Hook：Tauri 设置
 */
const { get: settingsGet, ue5BridgeAccessUrlGet, ue5BridgeAccessDetailGet } = useTauriSettings();

/**
 * 状态：当前接入地址
 */
const stateAccessUrl = ref('');

/**
 * 状态：详情错误信息
 */
const stateDetailError = ref('');

/**
 * 状态：复制成功 key
 */
const stateCopiedKey = ref('');

/**
 * 变量：复制状态重置计时器
 */
const { start: startTimeoutCopied, stop: stopTimeoutCopied } = useTimeoutFn(
  () => {
    stateCopiedKey.value = '';
  },
  1200,
  { immediate: false }
);

/**
 * 函数：从 URL 中提取基地址
 * @param {string} url 完整地址
 * @returns {string} 基地址
 */
const urlBaseGet = (url: string): string => {
  /**
   * 常量：value。
   */
  const value = String(url || '').trim();
  if (!value) {
    return '';
  }

  try {
    /**
     * 函数：parsed。
     */
    const parsed = new URL(value);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    /**
     * 常量：matched。
     */
    const matched = value.match(/^(https?:\/\/[^/]+)/i);
    return matched?.[1] ? String(matched[1]).trim() : value.replace(/\/+$/, '');
  }
};

/**
 * 函数：将基地址补齐为目录形式
 * @param {string} url 完整地址
 * @returns {string} 末尾带 / 的基地址
 */
const urlBaseDirectoryGet = (url: string): string => {
  /**
   * 常量：value。
   */
  const value = urlBaseGet(url);
  if (!value) {
    return '';
  }

  return `${value.replace(/\/+$/, '')}/`;
};

/**
 * 函数：从 URL 中提取参数列表
 * @param {string} url 完整地址
 * @returns {IPageSettingsUe5RequestParamItem[]} 参数列表
 */
const urlParamsGet = (url: string): IPageSettingsUe5RequestParamItem[] => {
  /**
   * 常量：value。
   */
  const value = String(url || '').trim();
  if (!value) {
    return [];
  }

  try {
    return Array.from(new URL(value).searchParams.entries()).map(([name, paramValue]) => ({
      name: String(name || '').trim(),
      value: String(paramValue || '').trim()
    }));
  } catch {
    /**
     * 常量：query。
     */
    const query = value.split('?')[1] || '';
    if (!query) {
      return [];
    }

    return query
      .split('&')
      .map((part) => part.trim())
      .filter((part) => part !== '')
      .map((part) => {
        const [name, paramValue = ''] = part.split('=');

        return {
          name: decodeURIComponent(String(name || '').trim()),
          value: decodeURIComponent(String(paramValue || '').trim())
        };
      });
  }
};

/**
 * 计算属性：本地接入基地址
 */
const computedBaseUrl = computed((): string => urlBaseDirectoryGet(stateAccessUrl.value));

/**
 * 计算属性：当前请求列表
 */
const computedRequests = computed<IPageSettingsUe5RequestItem[]>(() => {
  /**
   * 常量：accessUrl。
   */
  const accessUrl = String(stateAccessUrl.value || '').trim();
  /**
   * 常量：heartbeatUrl。
   */
  const heartbeatUrl = computedBaseUrl.value ? `${computedBaseUrl.value}ue5/heartbeat` : '';

  if (!accessUrl || !heartbeatUrl) {
    return [];
  }

  return [
    {
      id: 'access',
      title: t('pages.settings.unattended.sections.ue5.modal.requests.access.title'),
      method: 'GET',
      url: accessUrl,
      description: t('pages.settings.unattended.sections.ue5.modal.requests.access.description'),
      params: urlParamsGet(accessUrl)
    },
    {
      id: 'heartbeat',
      title: t('pages.settings.unattended.sections.ue5.modal.requests.heartbeat.title'),
      method: 'POST',
      url: heartbeatUrl,
      description: t('pages.settings.unattended.sections.ue5.modal.requests.heartbeat.description'),
      params: []
    }
  ];
});

/**
 * 函数：判断某个 key 是否已复制
 * @param {string} key 复制 key
 * @returns {boolean} 是否已复制
 */
const copiedGet = (key: string): boolean => stateCopiedKey.value === String(key || '').trim();

/**
 * 函数：复制文本
 * @param {string} key 复制 key
 * @param {string} value 文本
 * @returns {Promise<void>} 无返回值
 */
const handleCopy = async (key: string, value: string): Promise<void> => {
  /**
   * 常量：copiedKey。
   */
  const copiedKey = String(key || '').trim();
  /**
   * 常量：text。
   */
  const text = String(value || '').trim();

  if (!copiedKey || !text || !import.meta.client) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    stateCopiedKey.value = copiedKey;
    stopTimeoutCopied();
    startTimeoutCopied();
  } catch {
    // ignore
  }
};

/**
 * 函数：直接打开请求地址
 * @param {string} url 请求地址
 * @returns {void} 无返回值
 */
const handleLinkOpen = (url: string): void => {
  /**
   * 常量：value。
   */
  const value = String(url || '').trim();
  if (!value || !import.meta.client) {
    return;
  }

  if (isTauriRuntime.value) {
    void openExternalUrl(value);
    return;
  }

  window.open(value, '_blank', 'noopener,noreferrer');
};

/**
 * 函数：刷新详情数据
 * @returns {Promise<void>} 无返回值
 */
const handleDetailRefresh = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    stateDetailError.value = '';
    return;
  }

  stateDetailError.value = '';

  try {
    /**
     * 常量：detail。
     */
    const detail = await ue5BridgeAccessDetailGet();
    stateAccessUrl.value = String(detail.accessUrl || '').trim() || stateAccessUrl.value;
  } catch (error) {
    stateDetailError.value = error instanceof Error ? error.message : String(error || '').trim() || 'UE5 bridge unavailable';
    try {
      stateAccessUrl.value = String(await ue5BridgeAccessUrlGet()).trim() || stateAccessUrl.value;
    } catch {
      // ignore
    }
  }
};

/**
 * 生命周期：初始化接入地址
 */
onMounted(async () => {
  if (isTauriRuntime.value) {
    try {
      stateAccessUrl.value = String(await ue5BridgeAccessUrlGet()).trim() || stateAccessUrl.value;
    } catch {
      // ignore
    }
  }

  await handleDetailRefresh();
});
</script>
