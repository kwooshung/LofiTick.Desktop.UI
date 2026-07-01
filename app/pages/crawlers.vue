<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu v-if="computedCrawlerTask" :items="computedLinks" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <template v-if="computedCrawlerTask">
        <UButton icon="i-lucide:square" color="neutral" variant="outline" disabled>
          {{ t('pages.crawlers.task.actions.stop') }}
        </UButton>
        <UButton icon="i-lucide:play" color="primary" @click="handleTaskExecuteClick">
          {{ t('pages.crawlers.task.actions.execute') }}
        </UButton>
      </template>
    </template>

    <NuxtPage v-model:dialog-open="stateTaskDialogOpen" />
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

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
 * 状态：任务执行弹窗是否打开
 */
const stateTaskDialogOpen = ref(false);

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
 * 计算属性：任务导航
 */
const computedLinks = computed<NavigationMenuItem[][]>(() => [[{ label: t('pages.crawlers.task.filters.all'), icon: 'i-lucide:list-filter', to: localePath(`/crawlers/${computedCrawlerTask.value}`), exact: true }]]);

/**
 * 函数：打开当前任务执行弹窗
 * @return {void}
 */
const handleTaskExecuteClick = (): void => {
  stateTaskDialogOpen.value = true;
};

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
