<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.crawler.browser.title') }}</h3>
          <p class="text-muted mt-1 text-sm">{{ t('pages.settings.crawler.browser.description') }}</p>
        </div>
        <ULink raw :to="localePath('/crawlers')" class="border-primary text-primary hover:bg-primary/8 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors">
          <UIcon name="i-mdi:spider-outline" class="size-4 shrink-0" />
          {{ t('pages.settings.crawler.actions.enterCrawlers') }}
        </ULink>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'overflow-hidden p-0 sm:p-0 gap-y-0' }">
      <div class="after:border-default relative overflow-hidden p-4 after:pointer-events-none after:absolute after:right-4 after:bottom-0 after:left-4 after:border-b after:content-[''] sm:p-6 sm:after:right-6 sm:after:left-6">
        <UFormField :label="crawlerBrowserCandidateGet('msedge').name" :description="t('pages.settings.crawler.browser.runtimeDescriptions.edge')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2">
          <USwitch v-if="crawlerBrowserCandidateGet('msedge').installed" :model-value="stateCrawlerBrowserSelectedId === 'msedge'" @update:model-value="(on) => handleCrawlerBrowserSelect(crawlerBrowserCandidateGet('msedge'), on)" />
          <div v-else class="flex shrink-0 items-center gap-2">
            <UButton color="neutral" variant="outline" icon="i-lucide:refresh-cw" :ui="{ leadingIcon: 'text-muted' }" :disabled="!isTauriRuntime" :loading="stateCrawlerBrowserRefreshing" @click="refreshCrawlerBrowsers(false)">
              {{ t('pages.settings.crawler.browser.actions.refresh') }}
            </UButton>
            <UButton color="neutral" variant="outline" icon="i-lucide:download" :ui="{ leadingIcon: 'text-muted' }" @click="handleCrawlerBrowserInstall(crawlerBrowserCandidateGet('msedge'))">
              {{ t('pages.settings.crawler.browser.actions.installOfficial') }}
            </UButton>
          </div>
        </UFormField>
        <UIcon name="i-logos:microsoft-edge" class="absolute -top-16 -left-16 size-64 opacity-5" />
      </div>
      <div class="after:border-default relative overflow-hidden p-4 after:pointer-events-none after:absolute after:right-4 after:bottom-0 after:left-4 after:border-b after:content-[''] sm:p-6 sm:after:right-6 sm:after:left-6">
        <UFormField :label="crawlerBrowserCandidateGet('chrome').name" :description="t('pages.settings.crawler.browser.runtimeDescriptions.chrome')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2">
          <USwitch v-if="crawlerBrowserCandidateGet('chrome').installed" :model-value="stateCrawlerBrowserSelectedId === 'chrome'" @update:model-value="(on) => handleCrawlerBrowserSelect(crawlerBrowserCandidateGet('chrome'), on)" />
          <div v-else class="flex shrink-0 items-center gap-2">
            <UButton color="neutral" variant="outline" icon="i-lucide:refresh-cw" :ui="{ leadingIcon: 'text-muted' }" :disabled="!isTauriRuntime" :loading="stateCrawlerBrowserRefreshing" @click="refreshCrawlerBrowsers(false)">
              {{ t('pages.settings.crawler.browser.actions.refresh') }}
            </UButton>
            <UButton color="neutral" variant="outline" icon="i-lucide:download" :ui="{ leadingIcon: 'text-muted' }" @click="handleCrawlerBrowserInstall(crawlerBrowserCandidateGet('chrome'))">
              {{ t('pages.settings.crawler.browser.actions.installOfficial') }}
            </UButton>
          </div>
        </UFormField>
        <UIcon name="i-devicon:chrome" class="absolute -top-16 -left-16 size-64 opacity-5" />
      </div>
      <div class="relative overflow-hidden p-4 sm:p-6">
        <UFormField :label="crawlerBrowserCandidateGet('chromium').name" :description="t('pages.settings.crawler.browser.runtimeDescriptions.chromium')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2">
          <USwitch v-if="crawlerBrowserCandidateGet('chromium').installed" :model-value="stateCrawlerBrowserSelectedId === 'chromium'" @update:model-value="(on) => handleCrawlerBrowserSelect(crawlerBrowserCandidateGet('chromium'), on)" />
          <div v-else class="flex shrink-0 items-center gap-2">
            <UButton color="neutral" variant="outline" icon="i-lucide:refresh-cw" :ui="{ leadingIcon: 'text-muted' }" :disabled="!isTauriRuntime" :loading="stateCrawlerBrowserRefreshing" @click="refreshCrawlerBrowsers(false)">
              {{ t('pages.settings.crawler.browser.actions.refresh') }}
            </UButton>
            <UButton color="neutral" variant="outline" icon="i-lucide:download" :ui="{ leadingIcon: 'text-muted' }" @click="handleCrawlerBrowserInstall(crawlerBrowserCandidateGet('chromium'))">
              {{ t('pages.settings.crawler.browser.actions.installOfficial') }}
            </UButton>
          </div>
        </UFormField>
        <UIcon name="i-streamline-color:chrome-flat" class="absolute -top-16 -left-16 size-64 opacity-5" />
      </div>
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.crawler.browserProfilesDirectory.label') }}</h3>
          <p class="text-muted mt-1 text-sm">{{ t('pages.settings.crawler.browserProfilesDirectory.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ container: 'divide-y divide-default' }">
      <UFormField v-if="stateIsMounted" :label="t('pages.settings.crawler.browserProfilesDirectory.rootLabel')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.rootDescription') }}</div>
            <ULink v-if="stateCrawlerBrowserProfilesRootPath" raw class="text-muted hover:text-primary inline-flex max-w-full cursor-pointer align-middle font-normal break-all whitespace-normal no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesRoot">
              {{ stateCrawlerBrowserProfilesRootPath }}
            </ULink>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <UButton color="neutral" variant="outline" icon="i-lucide:folder-open" :ui="{ leadingIcon: 'text-muted' }" :disabled="!stateCrawlerBrowserProfilesRootPath" @click="handleOpenCrawlerBrowserProfilesRoot">
          {{ t('pages.settings.crawler.browserProfilesDirectory.open') }}
        </UButton>
      </UFormField>

      <UFormField v-if="stateIsMounted" :label="t('pages.settings.crawler.browserProfilesDirectory.edgeLabel')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.edgeDescription') }}</div>
            <ULink v-if="stateCrawlerBrowserProfilesEdgePath" raw class="text-muted hover:text-primary inline-flex max-w-full cursor-pointer align-middle font-normal break-all whitespace-normal no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesEdge">
              {{ stateCrawlerBrowserProfilesEdgePath }}
            </ULink>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <UButton color="neutral" variant="outline" icon="i-lucide:folder-open" :ui="{ leadingIcon: 'text-muted' }" :disabled="!stateCrawlerBrowserProfilesEdgePath" @click="handleOpenCrawlerBrowserProfilesEdge">
          {{ t('pages.settings.crawler.browserProfilesDirectory.open') }}
        </UButton>
      </UFormField>

      <UFormField v-if="stateIsMounted" :label="t('pages.settings.crawler.browserProfilesDirectory.chromeLabel')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.chromeDescription') }}</div>
            <ULink v-if="stateCrawlerBrowserProfilesChromePath" raw class="text-muted hover:text-primary inline-flex max-w-full cursor-pointer align-middle font-normal break-all whitespace-normal no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesChrome">
              {{ stateCrawlerBrowserProfilesChromePath }}
            </ULink>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <UButton color="neutral" variant="outline" icon="i-lucide:folder-open" :ui="{ leadingIcon: 'text-muted' }" :disabled="!stateCrawlerBrowserProfilesChromePath" @click="handleOpenCrawlerBrowserProfilesChrome">
          {{ t('pages.settings.crawler.browserProfilesDirectory.open') }}
        </UButton>
      </UFormField>

      <UFormField v-if="stateIsMounted" :label="t('pages.settings.crawler.browserProfilesDirectory.chromiumLabel')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.chromiumDescription') }}</div>
            <ULink v-if="stateCrawlerBrowserProfilesChromiumPath" raw class="text-muted hover:text-primary inline-flex max-w-full cursor-pointer align-middle font-normal break-all whitespace-normal no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesChromium">
              {{ stateCrawlerBrowserProfilesChromiumPath }}
            </ULink>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <UButton color="neutral" variant="outline" icon="i-lucide:folder-open" :ui="{ leadingIcon: 'text-muted' }" :disabled="!stateCrawlerBrowserProfilesChromiumPath" @click="handleOpenCrawlerBrowserProfilesChromium">
          {{ t('pages.settings.crawler.browserProfilesDirectory.open') }}
        </UButton>
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
 * Hook：提示消息。
 */
const toast = useToast();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 常量：默认浏览器候选配置。
 */
const crawlerBrowserCandidatesDefault: ICrawlerBrowserCandidate[] = [
  {
    id: 'msedge',
    name: 'Microsoft Edge',
    icon: 'i-logos:microsoft-edge',
    channel: 'msedge',
    executablePath: '',
    supported: true,
    installed: false,
    recommended: false,
    installUrl: 'https://www.microsoft.com/edge/download',
    source: 'fallback',
    reason: 'not installed on this computer'
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    icon: 'i-devicon:chrome',
    channel: 'chrome',
    executablePath: '',
    supported: true,
    installed: false,
    recommended: false,
    installUrl: 'https://www.google.com/chrome/',
    source: 'fallback',
    reason: 'not installed on this computer'
  },
  {
    id: 'chromium',
    name: 'Chromium',
    icon: 'i-streamline-color:chrome-flat',
    channel: 'chromium',
    executablePath: '',
    supported: true,
    installed: false,
    recommended: false,
    installUrl: 'https://www.chromium.org/getting-involved/download-chromium/',
    source: 'fallback',
    reason: 'not installed on this computer'
  }
];

/**
 * 常量：默认浏览器候选兜底项。
 */
const crawlerBrowserCandidateFallback: ICrawlerBrowserCandidate = crawlerBrowserCandidatesDefault.find((candidate) => candidate.id === 'msedge') as ICrawlerBrowserCandidate;

/**
 * 状态：组件是否挂载完成
 */
const stateIsMounted = ref(false);

/**
 * 状态：爬虫浏览器候选列表。
 */
const stateCrawlerBrowserCandidates = ref<ICrawlerBrowserCandidate[]>(crawlerBrowserCandidatesDefault);

/**
 * 函数：按标识获取爬虫浏览器候选。
 * @param {ICrawlerBrowserCandidate['id']} id 浏览器标识。
 * @returns {ICrawlerBrowserCandidate} 候选项。
 */
const crawlerBrowserCandidateGet = (id: ICrawlerBrowserCandidate['id']): ICrawlerBrowserCandidate => {
  return stateCrawlerBrowserCandidates.value.find((candidate) => candidate.id === id) ?? crawlerBrowserCandidatesDefault.find((candidate) => candidate.id === id) ?? crawlerBrowserCandidateFallback;
};

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
 * 状态：爬虫浏览器资料目录路径。
 */
const stateCrawlerBrowserProfilesRootPath = ref('');

/**
 * 状态：爬虫浏览器资料目录是否存在。
 */
const stateCrawlerBrowserProfilesRootExists = ref(false);

/**
 * 状态：Edge 浏览器资料子目录路径。
 */
const stateCrawlerBrowserProfilesEdgePath = ref('');

/**
 * 状态：Edge 浏览器资料子目录是否存在。
 */
const stateCrawlerBrowserProfilesEdgeExists = ref(false);

/**
 * 状态：Chrome 浏览器资料子目录路径。
 */
const stateCrawlerBrowserProfilesChromePath = ref('');

/**
 * 状态：Chrome 浏览器资料子目录是否存在。
 */
const stateCrawlerBrowserProfilesChromeExists = ref(false);

/**
 * 状态：Chromium 浏览器资料子目录路径。
 */
const stateCrawlerBrowserProfilesChromiumPath = ref('');

/**
 * 状态：Chromium 浏览器资料子目录是否存在。
 */
const stateCrawlerBrowserProfilesChromiumExists = ref(false);

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
 * 函数：拼接爬虫浏览器资料目录路径。
 * @param {string} basePath 基础路径。
 * @param {string} segment 子目录名。
 * @returns {string} 拼接后的路径。
 */
const crawlerBrowserProfilesDirectoryPathJoin = (basePath: string, segment: string): string => {
  const trimmedBasePath = basePath.trim().replace(/[\\/]+$/, '');
  if (!trimmedBasePath) {
    return '';
  }

  const separator = trimmedBasePath.includes('\\') ? '\\' : '/';
  return [trimmedBasePath, segment].join(separator);
};

/**
 * 函数：加载爬虫浏览器资料目录信息。
 * @returns {Promise<void>} 无返回值
 */
const loadCrawlerBrowserProfilesDirectory = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  const directory = await tauriSettings.crawlerBrowserProfilesDirGet();
  const rootPath = directory.directoryPath;
  const edgePath = crawlerBrowserProfilesDirectoryPathJoin(rootPath, 'edge');
  const chromePath = crawlerBrowserProfilesDirectoryPathJoin(rootPath, 'chrome');
  const chromiumPath = crawlerBrowserProfilesDirectoryPathJoin(rootPath, 'chromium');
  const pathEntries = [rootPath, edgePath, chromePath, chromiumPath];
  const pathExistsEntries = await tauriSettings.pathsExistGet(pathEntries);
  const pathExistsMap = new Map(pathExistsEntries.map((item) => [item.path, item.exists]));

  stateCrawlerBrowserProfilesRootPath.value = rootPath;
  stateCrawlerBrowserProfilesRootExists.value = pathExistsMap.get(rootPath) ?? directory.exists;
  stateCrawlerBrowserProfilesEdgePath.value = edgePath;
  stateCrawlerBrowserProfilesEdgeExists.value = pathExistsMap.get(edgePath) ?? false;
  stateCrawlerBrowserProfilesChromePath.value = chromePath;
  stateCrawlerBrowserProfilesChromeExists.value = pathExistsMap.get(chromePath) ?? false;
  stateCrawlerBrowserProfilesChromiumPath.value = chromiumPath;
  stateCrawlerBrowserProfilesChromiumExists.value = pathExistsMap.get(chromiumPath) ?? false;
};

/**
 * 事件：打开爬虫浏览器资料目录。
 * @param {string} path 目录路径。
 * @param {boolean} exists 目录是否存在。
 * @returns {Promise<void>} 无返回值
 */
const handleOpenCrawlerBrowserProfilesDirectory = async (path: string, exists: boolean): Promise<void> => {
  if (!isTauriRuntime.value || !path) {
    return;
  }

  if (!exists) {
    toast.add({
      title: t('pages.settings.crawler.browserProfilesDirectory.notExists'),
      color: 'error'
    });
    return;
  }

  await tauriWindow.openDirectory(path);
};

/**
 * 事件：打开浏览器根目录。
 * @returns {Promise<void>} 无返回值
 */
const handleOpenCrawlerBrowserProfilesRoot = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesDirectory(stateCrawlerBrowserProfilesRootPath.value, stateCrawlerBrowserProfilesRootExists.value);
};

/**
 * 事件：打开 Edge 浏览器资料子目录。
 * @returns {Promise<void>} 无返回值
 */
const handleOpenCrawlerBrowserProfilesEdge = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesDirectory(stateCrawlerBrowserProfilesEdgePath.value, stateCrawlerBrowserProfilesEdgeExists.value);
};

/**
 * 事件：打开 Chrome 浏览器资料子目录。
 * @returns {Promise<void>} 无返回值
 */
const handleOpenCrawlerBrowserProfilesChrome = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesDirectory(stateCrawlerBrowserProfilesChromePath.value, stateCrawlerBrowserProfilesChromeExists.value);
};

/**
 * 事件：打开 Chromium 浏览器资料子目录。
 * @returns {Promise<void>} 无返回值
 */
const handleOpenCrawlerBrowserProfilesChromium = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesDirectory(stateCrawlerBrowserProfilesChromiumPath.value, stateCrawlerBrowserProfilesChromiumExists.value);
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

  await loadCrawlerBrowserProfilesDirectory();
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
