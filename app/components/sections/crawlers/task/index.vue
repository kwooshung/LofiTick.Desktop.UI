<template>
  <DashboardPage>
    <CrawlersTaskPixabay v-if="computedTask === 'pixabay'" v-model:dialog-open="computedDialogOpen" v-model:webview-task-id="computedWebviewTaskId" v-model:webview-visible="computedWebviewVisible" />
    <CrawlersTaskSuno v-else-if="computedTask === 'suno'" v-model:dialog-open="computedDialogOpen" />
    <UEmpty v-else icon="i-lucide:folder-x" :title="t('pages.crawlers.task.unsupported.title')" :description="t('pages.crawlers.task.unsupported.description')" />
  </DashboardPage>
</template>

<script setup lang="ts">
import type { ISectionsCrawlersTaskEmits, ISectionsCrawlersTaskProps } from '@/components/sections/crawlers/task/index.types';

defineOptions({ name: 'SectionsCrawlersTask' });

/**
 * 属性：爬虫任务区配置。
 */
const { dialogOpen, webviewTaskId, webviewVisible } = defineProps<ISectionsCrawlersTaskProps>();

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
 * 状态：当前任务页是否处于激活状态。
 */
const stateTaskBreadcrumbActive = ref(false);

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
 * 计算属性：当前 Pixabay 爬虫 WebView 任务 ID。
 */
const computedWebviewTaskId = computed({
  get: () => webviewTaskId,
  set: (value: string) => {
    emit('update:webviewTaskId', value);
  }
});

/**
 * 计算属性：当前 Pixabay 爬虫 WebView 可见状态。
 */
const computedWebviewVisible = computed({
  get: () => webviewVisible,
  set: (value: boolean) => {
    emit('update:webviewVisible', value);
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
</script>
