<template>
  <DashboardPage :padded="false" class="p-4 sm:p-3">
    <div class="flex min-h-0 flex-1 flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <UIcon :name="computedTaskIcon" class="size-5 shrink-0" />
            <h1 class="truncate text-xl font-semibold">{{ computedTaskTitle }}</h1>
          </div>
          <p class="text-muted mt-1 text-sm">{{ computedTaskDescription }}</p>
        </div>
      </div>

      <CrawlersTaskPixabay v-if="computedTask === 'pixabay'" />
      <CrawlersTaskSuno v-else-if="computedTask === 'suno'" />
      <UEmpty v-else icon="i-lucide:folder-x" :title="t('pages.crawlers.task.unsupported.title')" :description="t('pages.crawlers.task.unsupported.description')" />
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
defineOptions({ name: 'SectionsCrawlersTask' });

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
 * 计算属性：当前任务图标。
 */
const computedTaskIcon = computed(() => {
  if (computedTask.value === 'pixabay') {
    return 'i-simple-icons:pixabay';
  }

  if (computedTask.value === 'suno') {
    return 'i-simple-icons:suno';
  }

  return 'i-lucide:folder-question';
});

/**
 * 计算属性：当前任务标题。
 */
const computedTaskTitle = computed(() => {
  if (computedTask.value === 'pixabay') {
    return t('pages.crawlers.spider.websites.pixabay.name');
  }

  if (computedTask.value === 'suno') {
    return t('pages.crawlers.spider.websites.suno.name');
  }

  return t('pages.crawlers.task.unsupported.name');
});

/**
 * 计算属性：当前任务说明。
 */
const computedTaskDescription = computed(() => {
  if (computedTask.value === 'pixabay') {
    return t('pages.crawlers.spider.websites.pixabay.page.description');
  }

  if (computedTask.value === 'suno') {
    return t('pages.crawlers.spider.websites.suno.page.description');
  }

  return t('pages.crawlers.task.unsupported.description');
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
