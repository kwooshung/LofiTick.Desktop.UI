<template>
  <DashboardPage>
    <CrawlersTaskFailureModal
      v-model:open="stateFailureModalOpen"
      :title="stateFailureModalTitle"
      :description="stateFailureModalDescription"
      :continuing="stateFailureModalContinuing"
      :stopping="stateFailureModalStopping"
      @cancel="handleFailureModalCancel"
      @continue="handleFailureModalContinue"
      @stop="handleFailureModalStop"
    />
    <CrawlersTaskPixabay v-if="computedTask === 'pixabay'" ref="refPixabayTask" v-model:dialog-open="computedDialogOpen" v-model:task-executing="computedTaskExecuting" v-model:browser-session-task-id="computedBrowserSessionTaskId" />
    <CrawlersTaskSuno v-else-if="computedTask === 'suno'" v-model:dialog-open="computedDialogOpen" />
    <UEmpty v-else icon="i-lucide:folder-x" :title="t('pages.crawlers.task.unsupported.title')" :description="t('pages.crawlers.task.unsupported.description')" />
  </DashboardPage>
</template>

<script setup lang="ts">
import type { ISectionsCrawlersTaskEmits, ISectionsCrawlersTaskProps } from '@/components/sections/crawlers/task/index.types';
import type { ISectionsCrawlersTaskFailureModalEmits, ISectionsCrawlersTaskFailureModalProps } from '@/components/sections/crawlers/task/failure-modal/index.types';
import type { ICrawlersTaskPixabayExposed, ICrawlersTaskPixabayFailureContext } from '@/components/crawlers/task/pixabay/index.types';
import type { ICrawlerTaskFailedEvent } from '@/composables/tauri/tasks/index.types';
import type { UnlistenFn } from '@tauri-apps/api/event';

defineOptions({ name: 'SectionsCrawlersTask' });

/**
 * 属性：爬虫任务区配置。
 */
const { dialogOpen, taskExecuting, browserSessionTaskId } = defineProps<ISectionsCrawlersTaskProps>();

/**
 * 事件：爬虫任务区事件。
 */
const emit = defineEmits<ISectionsCrawlersTaskEmits>();

/**
 * Hook：当前路由。
 */
const route = useRoute();

/**
 * Hook：i18n。
 */
const { t } = useI18n();

/**
 * Hook：本地化路由。
 */
const localePath = useLocalePath();

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Hook：Tauri 任务能力。
 */
const tauriTasks = useTauriTasks();

/**
 * Hook：Tauri 提醒音能力。
 */
const tauriSound = useTauriSound();

/**
 * Hook：Tauri 窗口能力。
 */
const tauriWindow = useTauriWindow();

/**
 * 状态：当前任务页是否处于激活状态。
 */
const stateTaskBreadcrumbActive = ref(false);

/**
 * 状态：失败弹窗是否打开。
 */
const stateFailureModalOpen = ref(false);

/**
 * 状态：失败弹窗标题。
 */
const stateFailureModalTitle = ref(t('pages.crawlers.task.retryConfirm.title'));

/**
 * 状态：失败弹窗描述。
 */
const stateFailureModalDescription = ref(t('pages.crawlers.task.retryConfirm.description'));

/**
 * 状态：失败继续等待中。
 */
const stateFailureModalContinuing = ref(false);

/**
 * 状态：失败终止中。
 */
const stateFailureModalStopping = ref(false);

/**
 * 状态：失败上下文。
 */
const stateFailureContext = ref<ICrawlersTaskPixabayFailureContext | null>(null);

/**
 * 引用：Pixabay 任务组件暴露方法。
 */
const refPixabayTask = ref<ICrawlersTaskPixabayExposed | null>(null);

/**
 * 变量：失败事件取消监听句柄。
 */
let unlistenCrawlerTaskFailed: UnlistenFn | null = null;

/**
 * 计算属性：当前动态爬虫任务键。
 */
const computedTask = computed(() => {
  const task = route.params.task;
  return Array.isArray(task) ? (task[0] ?? '') : (task ?? '');
});

/**
 * 计算属性：当前任务面包屑标题。
 */
const computedTaskBreadcrumbLabel = computed(() => {
  if (computedTask.value === 'pixabay') {
    return t('pages.crawlers.spider.websites.pixabay.name');
  }

  if (computedTask.value === 'suno') {
    return t('pages.crawlers.spider.websites.suno.name');
  }

  return t('pages.crawlers.task.unsupported.name');
});

/**
 * 计算属性：任务执行弹窗打开状态。
 */
const computedDialogOpen = computed({
  get: () => dialogOpen,
  set: (value: boolean) => {
    emit('update:dialogOpen', value);
  }
});

/**
 * 计算属性：当前任务执行状态。
 */
const computedTaskExecuting = computed({
  get: () => taskExecuting,
  set: (value: boolean) => {
    emit('update:taskExecuting', value);
  }
});

/**
 * 计算属性：当前 Pixabay 爬虫浏览器会话任务 ID。
 */
const computedBrowserSessionTaskId = computed({
  get: () => browserSessionTaskId,
  set: (value: string) => {
    emit('update:browserSessionTaskId', value);
  }
});

/**
 * 函数：同步当前任务面包屑。
 */
const syncTaskBreadcrumb = (): void => {
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
    },
    {
      label: computedTaskBreadcrumbLabel.value,
      icon: computedTask.value === 'pixabay' ? 'i-simple-icons:pixabay' : computedTask.value === 'suno' ? 'i-simple-icons:suno' : 'i-lucide:folder-question',
      to: localePath(`/crawlers/${computedTask.value}`),
      exact: true
    }
  ];
};

/**
 * 函数：恢复爬虫根面包屑。
 */
const syncCrawlersBreadcrumb = (): void => {
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
};

/**
 * 函数：打开失败弹窗。
 * @param {ICrawlerTaskFailedEvent} event 失败事件。
 * @returns {void} 无返回值。
 */
const openFailureModal = (event: ICrawlerTaskFailedEvent): void => {
  stateFailureContext.value = { step: event.step, error: event.error };
  stateFailureModalTitle.value = `${t('pages.crawlers.task.retryConfirm.title')} - ${event.step}`;
  stateFailureModalDescription.value = event.error;
  stateFailureModalOpen.value = true;
  void tauriWindow.restore();
};

/**
 * 函数：取消失败弹窗。
 * @returns {void} 无返回值。
 */
const handleFailureModalCancel = (): void => {
  stateFailureModalOpen.value = false;
  stateFailureModalTitle.value = t('pages.crawlers.task.retryConfirm.title');
  stateFailureModalDescription.value = t('pages.crawlers.task.retryConfirm.description');
  stateFailureContext.value = null;
};

/**
 * 函数：继续失败步骤。
 * @returns {Promise<void>} 无返回值。
 */
const handleFailureModalContinue = async (): Promise<void> => {
  if (stateFailureModalContinuing.value || stateFailureContext.value === null) {
    return;
  }

  stateFailureModalContinuing.value = true;

  try {
    await refPixabayTask.value?.continueFailure();
    handleFailureModalCancel();
  } finally {
    stateFailureModalContinuing.value = false;
  }
};

/**
 * 函数：终止失败任务。
 * @returns {Promise<void>} 无返回值。
 */
const handleFailureModalStop = async (): Promise<void> => {
  if (stateFailureModalStopping.value || stateFailureContext.value === null) {
    return;
  }

  stateFailureModalStopping.value = true;

  try {
    await refPixabayTask.value?.stopFailure();
    handleFailureModalCancel();
  } finally {
    stateFailureModalStopping.value = false;
  }
};

/**
 * 监听：任务键变化时，仅在激活状态下同步当前任务面包屑。
 */
watch(
  computedTask,
  () => {
    if (!stateTaskBreadcrumbActive.value) {
      return;
    }

    syncTaskBreadcrumb();
  },
  { immediate: true }
);

/**
 * 生命周期：激活时写入任务面包屑。
 */
onActivated(() => {
  stateTaskBreadcrumbActive.value = true;
  syncTaskBreadcrumb();
});

/**
 * 生命周期：失活时恢复爬虫根面包屑。
 */
onDeactivated(() => {
  stateTaskBreadcrumbActive.value = false;
  syncCrawlersBreadcrumb();
});

/**
 * 生命周期：挂载后订阅任务失败事件。
 */
onMounted(async () => {
  if (!import.meta.client || !isTauriRuntime.value || unlistenCrawlerTaskFailed !== null) {
    return;
  }

  unlistenCrawlerTaskFailed = await tauriTasks.onCrawlerTaskFailed((event: ICrawlerTaskFailedEvent) => {
    if (event.taskId !== computedBrowserSessionTaskId.value && event.taskId !== computedTask.value && !event.taskId.includes(computedTask.value)) {
      return;
    }

    openFailureModal(event);
    void tauriSound.tipPlay('notification');
  });
});

/**
 * 生命周期：卸载时取消监听。
 */
onBeforeUnmount(() => {
  if (unlistenCrawlerTaskFailed) {
    unlistenCrawlerTaskFailed();
    unlistenCrawlerTaskFailed = null;
  }
});
</script>
