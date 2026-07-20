<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu v-if="computedCrawlerTask" :items="computedLinks" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="ghost" icon="i-lucide:settings" :to="localePath('/settings/crawler')" :ui="{ leadingIcon: 'text-muted' }" class="shrink-0">
          {{ t('pages.crawlers.actions.enterSettingsCrawler') }}
        </UButton>
        <template v-if="computedCrawlerTask">
          <UPopover v-model:open="stateTaskStopConfirmOpen" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'w-64 p-3' }">
            <UButton icon="i-lucide:square" color="neutral" variant="outline" :disabled="!computedTaskRunning || stateTaskStopping" :loading="stateTaskStopping" :ui="{ leadingIcon: 'text-muted' }">
              {{ t('pages.crawlers.task.actions.stop') }}
            </UButton>

            <template #content>
              <div class="space-y-3">
                <div class="space-y-1">
                  <div class="text-sm font-medium">
                    {{ t('pages.crawlers.task.actions.stopConfirmTitle') }}
                  </div>
                  <div class="text-muted text-xs leading-5">
                    {{ t('pages.crawlers.task.actions.stopConfirmDescription') }}
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <UButton size="xs" color="neutral" variant="ghost" :disabled="stateTaskStopping" @click="handleTaskStopConfirmCancelClick">
                    {{ t('pages.crawlers.task.actions.stopCancel') }}
                  </UButton>
                  <UButton size="xs" color="error" variant="solid" :loading="stateTaskStopping" @click="handleTaskStopClick">
                    {{ t('pages.crawlers.task.actions.stopConfirm') }}
                  </UButton>
                </div>
              </div>
            </template>
          </UPopover>
          <UButton icon="i-lucide:play" color="primary" :disabled="computedTaskRunning || stateTaskExecuting || stateTaskStopping" :loading="stateTaskExecuting" @click="handleTaskExecuteClick">
            {{ t('pages.crawlers.task.actions.execute') }}
          </UButton>
        </template>
      </div>
    </template>

    <UModal v-model:open="stateCrawlerBrowserEnableHintOpen" :title="t('pages.settings.crawler.browser.title')" :description="t('pages.settings.crawler.browser.description')" :ui="{ content: 'sm:max-w-lg', footer: 'justify-end' }">
      <template #body>
        <div class="text-muted text-sm leading-6">当前没有启用浏览器，请先到爬虫设置页面启用一个浏览器，再回来执行任务。</div>
      </template>

      <template #footer>
        <UButton color="primary" icon="i-lucide:settings" :to="localePath('/settings/crawler')" :ui="{ leadingIcon: 'text-white' }"> 去爬虫设置 </UButton>
      </template>
    </UModal>

    <NuxtPage v-model:dialog-open="stateTaskDialogOpen" v-model:task-executing="stateTaskExecuting" v-model:browser-session-task-id="stateCrawlerBrowserSessionTaskId" />
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import type { UnlistenFn } from '@tauri-apps/api/event';

import type { ICrawlerTaskFailedEvent } from '@/composables/tauri/tasks/index.types';

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Hook：当前路由
 */
const route = useRoute();

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置。
 */
const tauriSettings = useTauriSettings();

/**
 * Hook：Tauri 窗口能力。
 */
const tauriWindow = useTauriWindow();

/**
 * 状态：任务执行弹窗是否打开
 */
const stateTaskDialogOpen = ref(false);

/**
 * 状态：当前任务是否正在执行。
 */
const stateTaskExecuting = ref(false);

/**
 * 状态：当前任务是否正在停止。
 */
const stateTaskStopping = ref(false);

/**
 * 状态：停止任务确认浮层是否打开。
 */
const stateTaskStopConfirmOpen = ref(false);

/**
 * 状态：浏览器启用提示是否打开。
 */
const stateCrawlerBrowserEnableHintOpen = ref(false);

/**
 * 计算属性：当前爬虫任务键
 */
const computedCrawlerTask = computed(() => {
  const task = route.params.task;
  return Array.isArray(task) ? (task[0] ?? '') : (task ?? '');
});

/**
 * 常量：面包屑状态仓库
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Hook：Tauri 任务能力。
 */
const tauriTasks = useTauriTasks();

/**
 * 变量：爬虫浏览器会话状态变化事件取消监听句柄。
 */
let unlistenCrawlerBrowserSessionStateChanged: UnlistenFn | null = null;

/**
 * 变量：爬虫任务失败事件取消监听句柄。
 */
let unlistenCrawlerTaskFailed: UnlistenFn | null = null;

/**
 * 状态：当前任务对应的浏览器会话任务 ID。
 */
const stateCrawlerBrowserSessionTaskId = ref('');

/**
 * 计算属性：当前任务是否正在运行。
 */
const computedTaskRunning = computed(() => stateCrawlerBrowserSessionTaskId.value.trim().length > 0);

/**
 * 函数：同步当前爬虫浏览器会话状态。
 */
const syncCrawlerBrowserSessionState = async (): Promise<void> => {
  if (!import.meta.client || !isTauriRuntime.value) {
    return;
  }

  const task = computedCrawlerTask.value.trim();
  if (!task) {
    stateCrawlerBrowserSessionTaskId.value = '';
    stateTaskExecuting.value = false;
    return;
  }

  const snapshot = await tauriTasks.crawlerTaskBrowserSessionStateGet(task);
  stateCrawlerBrowserSessionTaskId.value = snapshot?.taskId ?? '';
  stateTaskExecuting.value = false;
};

/**
 * 计算属性：任务导航
 */
const computedLinks = computed<NavigationMenuItem[][]>(() => [[{ label: t('pages.crawlers.task.filters.all'), icon: 'i-lucide:list-filter', to: localePath(`/crawlers/${computedCrawlerTask.value}`), exact: true }]]);

/**
 * 函数：打开当前任务执行弹窗
 * @return {void}
 */
const handleTaskExecuteClick = async (): Promise<void> => {
  if (computedTaskRunning.value || stateTaskExecuting.value || stateTaskStopping.value) {
    return;
  }

  const conf = await tauriSettings.get();
  const crawlerSetting = conf.crawler;
  const browserSetting = crawlerSetting && typeof crawlerSetting === 'object' && !Array.isArray(crawlerSetting) ? (crawlerSetting as Record<string, unknown>).browser : null;
  const browserId = browserSetting && typeof browserSetting === 'object' && !Array.isArray(browserSetting) ? String((browserSetting as Record<string, unknown>).id || '') : '';

  if (!browserId) {
    stateCrawlerBrowserEnableHintOpen.value = true;
    return;
  }

  stateTaskDialogOpen.value = true;
};

/**
 * 函数：关闭停止任务确认浮层。
 */
const handleTaskStopConfirmCancelClick = (): void => {
  stateTaskStopConfirmOpen.value = false;
};

watch(
  computedCrawlerTask,
  () => {
    void syncCrawlerBrowserSessionState();
  },
  { immediate: true }
);

/**
 * 函数：停止当前爬虫任务。
 */
const handleTaskStopClick = async (): Promise<void> => {
  if (!computedTaskRunning.value || stateTaskStopping.value) {
    return;
  }

  stateTaskStopping.value = true;

  try {
    await tauriTasks.crawlerTaskBrowserSessionClose(stateCrawlerBrowserSessionTaskId.value);
    stateTaskStopConfirmOpen.value = false;
  } finally {
    await syncCrawlerBrowserSessionState();
    stateTaskStopping.value = false;
  }
};

/**
 * 生命周期：组件挂载。
 */
onMounted(async () => {
  if (!import.meta.client || !isTauriRuntime.value || unlistenCrawlerBrowserSessionStateChanged) {
    return;
  }

  unlistenCrawlerBrowserSessionStateChanged = await tauriTasks.onCrawlerBrowserSessionStateChanged((snapshot) => {
    if (snapshot.taskId !== stateCrawlerBrowserSessionTaskId.value) {
      return;
    }

    if (!snapshot.running) {
      stateCrawlerBrowserSessionTaskId.value = '';
      stateTaskExecuting.value = false;
    }
  });

  unlistenCrawlerTaskFailed = await tauriTasks.onCrawlerTaskFailed((event: ICrawlerTaskFailedEvent) => {
    if (event.taskId !== stateCrawlerBrowserSessionTaskId.value && event.taskId !== computedCrawlerTask.value) {
      return;
    }

    stateTaskDialogOpen.value = false;
    void tauriWindow.restore();
  });
});

/**
 * 生命周期：组件卸载。
 */
onBeforeUnmount(() => {
  if (unlistenCrawlerBrowserSessionStateChanged) {
    unlistenCrawlerBrowserSessionStateChanged();
    unlistenCrawlerBrowserSessionStateChanged = null;
  }

  if (unlistenCrawlerTaskFailed) {
    unlistenCrawlerTaskFailed();
    unlistenCrawlerTaskFailed = null;
  }
});

/**
 * 状态：当前任务面包屑是否激活。
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.crawlers.title'),
    icon: 'i-mdi:spider-outline',
    to: localePath('/crawlers'),
    exact: true
  }
];
</script>
