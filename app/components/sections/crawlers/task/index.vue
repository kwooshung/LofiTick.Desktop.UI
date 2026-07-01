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
</script>
