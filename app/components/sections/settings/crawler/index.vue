<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.crawler.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.crawler.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="candidate in stateCrawlerBrowserCandidates"
        :key="candidate.id"
        :label="candidate.name"
        :description="browserDescriptionGet(candidate)"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <USwitch v-if="candidate.installed" :model-value="stateCrawlerBrowserSelectedId === candidate.id" @update:model-value="(on) => handleCrawlerBrowserSelect(candidate, on)" />
        <div v-else class="flex shrink-0 items-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide:refresh-cw" :ui="{ leadingIcon: 'text-muted' }" :disabled="!isTauriRuntime" :loading="stateCrawlerBrowserRefreshing" @click="refreshCrawlerBrowsers(false)">
            {{ t('pages.settings.crawler.browser.actions.refresh') }}
          </UButton>
          <UButton color="neutral" variant="outline" icon="i-lucide:download" :ui="{ leadingIcon: 'text-muted' }" @click="handleCrawlerBrowserInstall(candidate)">
            {{ t('pages.settings.crawler.browser.actions.installOfficial') }}
          </UButton>
        </div>
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
 * Hook：Tauri 任务能力
 */
const tauriTasks = useTauriTasks();

/**
 * Hook：Tauri 窗口能力
 */
const tauriWindow = useTauriWindow();

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 函数：创建爬虫浏览器候选。
 * @param {string} id 浏览器标识
 * @param {string} name 浏览器名称
 * @param {string} icon 图标类名
 * @param {string} channel Playwright channel 名称
 * @param {string} installUrl 安装入口
 * @returns {ICrawlerBrowserCandidate} 浏览器候选
 */
function crawlerBrowserCandidateCreate(id: string, name: string, icon: string, channel: string, installUrl: string): ICrawlerBrowserCandidate {
  return {
    id,
    name,
    icon,
    channel,
    executablePath: '',
    supported: true,
    installed: false,
    recommended: false,
    installUrl,
    source: 'fallback',
    reason: 'not installed on this computer'
  };
}

/**
 * 函数：获取当前平台默认浏览器候选。
 * @returns {ICrawlerBrowserCandidate[]} 浏览器候选列表
 */
function crawlerBrowserCandidatesDefaultGet(): ICrawlerBrowserCandidate[] {
  const edge = crawlerBrowserCandidateCreate('msedge', 'Microsoft Edge', 'i-lucide:browser', 'msedge', 'https://www.microsoft.com/edge/download');
  const chrome = crawlerBrowserCandidateCreate('chrome', 'Google Chrome', 'i-lucide:browser', 'chrome', 'https://www.google.com/chrome/');
  const chromium = crawlerBrowserCandidateCreate('chromium', 'Chromium', 'i-lucide:browser', 'chromium', 'https://www.chromium.org/getting-involved/download-chromium/');

  if (import.meta.client) {
    const platform = window.navigator.userAgent.toLowerCase();
    if (platform.includes('mac')) {
      return [chrome, edge, chromium];
    }

    if (platform.includes('linux')) {
      return [chrome, chromium, edge];
    }
  }

  return [edge, chrome, chromium];
}

/**
 * 状态：组件是否挂载完成
 */
const stateIsMounted = ref(false);

/**
 * 状态：爬虫浏览器候选列表
 */
const stateCrawlerBrowserCandidates = ref<ICrawlerBrowserCandidate[]>(crawlerBrowserCandidatesDefaultGet());

/**
 * 状态：爬虫浏览器候选是否正在刷新
 */
const stateCrawlerBrowserRefreshing = ref(false);

/**
 * 状态：已选择的爬虫浏览器标识
 */
const stateCrawlerBrowserSelectedId = ref('');

/**
 * 状态：是否已经触发过浏览器安装入口
 */
const stateCrawlerBrowserInstallStarted = ref(false);

/**
 * 设置面包屑导航状态
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-lucide:layout-dashboard',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-lucide:settings',
    to: localePath('/settings'),
    exact: true
  },
  {
    label: t('pages.settings.crawler.title'),
    icon: 'i-mdi:spider-outline',
    to: localePath('/settings/crawler')
  }
];

/**
 * 函数：保存爬虫浏览器选择。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @returns {Promise<void>} 无返回值
 */
const saveCrawlerBrowserCandidate = async (candidate: ICrawlerBrowserCandidate): Promise<void> => {
  stateCrawlerBrowserSelectedId.value = candidate.id;
  await tauriSettings.update({
    crawler: {
      browser: {
        id: candidate.id,
        name: candidate.name,
        channel: candidate.channel,
        executablePath: candidate.executablePath || ''
      }
    }
  });
};

/**
 * 函数：获取浏览器运行环境描述。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @returns {string} 运行环境描述
 */
const browserRuntimeDescriptionGet = (candidate: ICrawlerBrowserCandidate): string => {
  if (candidate.id === 'msedge') {
    return t('pages.settings.crawler.browser.runtimeDescriptions.edge');
  }

  if (candidate.id === 'chrome') {
    return t('pages.settings.crawler.browser.runtimeDescriptions.chrome');
  }

  return t('pages.settings.crawler.browser.runtimeDescriptions.chromium');
};

/**
 * 函数：获取浏览器设置行描述。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @returns {string} 设置行描述
 */
const browserDescriptionGet = (candidate: ICrawlerBrowserCandidate): string => {
  return browserRuntimeDescriptionGet(candidate);
};

/**
 * 函数：刷新爬虫浏览器候选。
 * @param {boolean} silent 是否静默忽略失败
 * @returns {Promise<void>} 无返回值
 */
const refreshCrawlerBrowsers = async (silent: boolean): Promise<void> => {
  if (stateCrawlerBrowserRefreshing.value || !isTauriRuntime.value) {
    return;
  }

  stateCrawlerBrowserRefreshing.value = true;
  try {
    const candidates = await tauriTasks.crawlerBrowserCandidatesGet();
    if (candidates.length > 0) {
      stateCrawlerBrowserCandidates.value = candidates;
    }

    const selected = stateCrawlerBrowserCandidates.value.find((candidate) => candidate.id === stateCrawlerBrowserSelectedId.value && candidate.installed);
    const fallback = selected || stateCrawlerBrowserCandidates.value.find((candidate) => candidate.recommended);
    if (fallback) {
      await saveCrawlerBrowserCandidate(fallback);
    }
  } catch (error) {
    if (!silent) {
      throw error;
    }
  } finally {
    stateCrawlerBrowserRefreshing.value = false;
  }
};

/**
 * 函数：加载已保存的爬虫浏览器设置。
 * @returns {Promise<void>} 无返回值
 */
const loadCrawlerBrowserSettings = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  const conf = await tauriSettings.get();
  const crawlerSetting = conf.crawler;
  if (!crawlerSetting || typeof crawlerSetting !== 'object' || Array.isArray(crawlerSetting)) {
    return;
  }

  const browserSetting = (crawlerSetting as Record<string, unknown>).browser;
  if (!browserSetting || typeof browserSetting !== 'object' || Array.isArray(browserSetting)) {
    return;
  }

  stateCrawlerBrowserSelectedId.value = String((browserSetting as Record<string, unknown>).id || '');
};

/**
 * 事件：选择爬虫浏览器。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @param {boolean} on 是否启用
 * @returns {Promise<void>} 无返回值
 */
const handleCrawlerBrowserSelect = async (candidate: ICrawlerBrowserCandidate, on: boolean): Promise<void> => {
  if (!on || !isTauriRuntime.value || !candidate.installed) {
    return;
  }

  await saveCrawlerBrowserCandidate(candidate);
};

/**
 * 事件：打开浏览器安装入口。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @returns {Promise<void>} 无返回值
 */
const handleCrawlerBrowserInstall = async (candidate: ICrawlerBrowserCandidate): Promise<void> => {
  if (import.meta.client && !isTauriRuntime.value) {
    window.open(candidate.installUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  stateCrawlerBrowserInstallStarted.value = true;
  await tauriWindow.openExternalUrl(candidate.installUrl);
  await refreshCrawlerBrowsers(true);
};

/**
 * 事件：窗口重新获得焦点
 */
const handleWindowFocus = (): void => {
  if (!stateCrawlerBrowserInstallStarted.value) {
    return;
  }

  stateCrawlerBrowserInstallStarted.value = false;
  void refreshCrawlerBrowsers(true);
};

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  stateIsMounted.value = true;

  await loadCrawlerBrowserSettings();
  await refreshCrawlerBrowsers(true);
  window.addEventListener('focus', handleWindowFocus);
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  window.removeEventListener('focus', handleWindowFocus);
});
</script>
