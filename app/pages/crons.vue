<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <NuxtPage />
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 路由
 */
const route = useRoute();

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

/**
 * 计算属性：服务器任务路由
 */
const computedPathServer = computed(() => localePath('/crons/service'));

/**
 * 计算属性：服务器任务兼容路由
 */
const computedPathServerAlias = computed(() => localePath('/crons'));

/**
 * 计算属性：本地任务路由
 */
const computedPathLocal = computed(() => localePath('/crons/local'));

/**
 * 计算属性：系统任务路由
 */
const computedPathSystem = computed(() => localePath('/crons/system'));

/**
 * 计算属性：当前是否为本地任务页
 */
const computedRouteIsLocal = computed(() => route.path === computedPathLocal.value);

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 设置面包屑导航状态
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.cron.title'),
    icon: 'i-lucide:timer-reset',
    to: localePath('/crons/service'),
    exact: true
  }
];

/**
 * 变量：Tab 链接
 */
const links = [
  [
    {
      label: t('pages.settings.cron.tabs.local'),
      icon: 'i-lucide:monitor-cog',
      to: localePath('/crons/local')
    },
    {
      label: t('pages.settings.cron.tabs.server'),
      icon: 'i-lucide:server',
      to: localePath('/crons/service')
    },
    {
      label: t('pages.settings.cron.tabs.system'),
      icon: 'i-lucide:shield-check',
      to: localePath('/crons/system')
    }
  ]
] satisfies NavigationMenuItem[][];

</script>
