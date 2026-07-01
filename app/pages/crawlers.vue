<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu v-if="computedCrawlerTask" :items="computedLinks" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <template v-if="computedCrawlerTask">
        <UButton :icon="stateCrawlerWebviewVisible ? 'i-lucide:eye-off' : 'i-lucide:eye'" color="neutral" variant="outline" :disabled="!computedTaskRunning || stateCrawlerWebviewBusy" :loading="stateCrawlerWebviewBusy" :ui="{ leadingIcon: 'text-muted' }" @click="handleCrawlerWebviewToggleClick">
          {{ stateCrawlerWebviewVisible ? t('pages.crawlers.task.actions.webviewHide') : t('pages.crawlers.task.actions.webviewShow') }}
        </UButton>
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
    </template>

    <NuxtPage v-model:dialog-open="stateTaskDialogOpen" v-model:task-executing="stateTaskExecuting" v-model:webview-task-id="stateCrawlerWebviewTaskId" v-model:webview-visible="stateCrawlerWebviewVisible" />
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import type { UnlistenFn } from '@tauri-apps/api/event';

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
 * 状态：爬虫 WebView 切换中。
 */
const stateCrawlerWebviewBusy = ref(false);

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
 * 变量：爬虫 WebView 状态变化事件取消监听句柄。
 */
let unlistenCrawlerWebviewStateChanged: UnlistenFn | null = null;

/**
 * 状态：当前任务对应的 WebView 任务 ID。
 */
const stateCrawlerWebviewTaskId = ref('');

/**
 * 状态：当前任务对应的 WebView 是否可见。
 */
const stateCrawlerWebviewVisible = ref(false);

/**
 * 计算属性：当前任务是否正在运行。
 */
const computedTaskRunning = computed(() => stateCrawlerWebviewTaskId.value.trim().length > 0);

/**
 * 函数：同步当前爬虫 WebView 状态。
 */
const syncCrawlerWebviewState = async (): Promise<void> => {
  if (!import.meta.client || !isTauriRuntime.value) {
    return;
  }

  const task = computedCrawlerTask.value.trim();
  if (!task) {
    stateCrawlerWebviewTaskId.value = '';
    stateCrawlerWebviewVisible.value = false;
    stateTaskExecuting.value = false;
    return;
  }

  const snapshot = await tauriTasks.crawlerTaskWebviewStateGet(task);
  stateCrawlerWebviewTaskId.value = snapshot?.taskId ?? '';
  stateCrawlerWebviewVisible.value = snapshot?.visible ?? false;
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
const handleTaskExecuteClick = (): void => {
  if (computedTaskRunning.value || stateTaskExecuting.value || stateTaskStopping.value) {
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
    void syncCrawlerWebviewState();
  },
  { immediate: true }
);

/**
 * 函数：切换当前 Pixabay 爬虫 WebView 显示状态。
 */
const handleCrawlerWebviewToggleClick = async (): Promise<void> => {
  if (!computedTaskRunning.value || stateCrawlerWebviewBusy.value) {
    return;
  }

  stateCrawlerWebviewBusy.value = true;

  try {
    if (stateCrawlerWebviewVisible.value) {
      await tauriTasks.crawlerTaskWebviewHide(stateCrawlerWebviewTaskId.value);
      stateCrawlerWebviewVisible.value = false;
    } else {
      await tauriTasks.crawlerTaskWebviewShow(stateCrawlerWebviewTaskId.value);
      stateCrawlerWebviewVisible.value = true;
    }
  } finally {
    stateCrawlerWebviewBusy.value = false;
  }
};

/**
 * 函数：停止当前爬虫任务。
 */
const handleTaskStopClick = async (): Promise<void> => {
  if (!computedTaskRunning.value || stateTaskStopping.value) {
    return;
  }

  stateTaskStopping.value = true;

  try {
    await tauriTasks.crawlerTaskWebviewClose(stateCrawlerWebviewTaskId.value);
    stateTaskStopConfirmOpen.value = false;
  } finally {
    await syncCrawlerWebviewState();
    stateTaskStopping.value = false;
  }
};

/**
 * 生命周期：组件挂载。
 */
onMounted(async () => {
  if (!import.meta.client || !isTauriRuntime.value || unlistenCrawlerWebviewStateChanged) {
    return;
  }

  unlistenCrawlerWebviewStateChanged = await tauriTasks.onCrawlerWebviewStateChanged((taskId) => {
    if (taskId !== stateCrawlerWebviewTaskId.value) {
      return;
    }

    void syncCrawlerWebviewState();
  });
});

/**
 * 生命周期：组件卸载。
 */
onBeforeUnmount(() => {
  if (unlistenCrawlerWebviewStateChanged) {
    unlistenCrawlerWebviewStateChanged();
    unlistenCrawlerWebviewStateChanged = null;
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
