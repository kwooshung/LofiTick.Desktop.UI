<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <UButton v-if="computedRouteIsServer" icon="i-lucide-plus" color="primary" @click="handleToolbarCreate">
        {{ t('pages.settings.cron.actions.create') }}
      </UButton>
    </template>

    <NuxtPage :create-nonce="stateCreateNonce" />
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
 * 计算属性：本地任务路由
 */
const computedPathLocal = computed(() => localePath('/crons'));

/**
 * 计算属性：服务器任务路由
 */
const computedPathServer = computed(() => localePath('/crons/service'));

/**
 * 计算属性：系统任务路由
 */
const computedPathSystem = computed(() => localePath('/crons/system'));

/**
 * 计算属性：当前是否为服务器任务页
 */
const computedRouteIsServer = computed(() => route.path === computedPathServer.value);

/**
 * 状态：创建 nonce
 */
const stateCreateNonce = ref(0);

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
    to: computedPathLocal.value,
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
      to: computedPathLocal.value,
      exact: true
    },
    {
      label: t('pages.settings.cron.tabs.server'),
      icon: 'i-lucide:server',
      to: computedPathServer.value,
      exact: true
    },
    {
      label: t('pages.settings.cron.tabs.system'),
      icon: 'i-lucide:shield-check',
      to: computedPathSystem.value,
      exact: true
    }
  ]
] satisfies NavigationMenuItem[][];

/**
 * 事件：工具栏点击创建
 */
const handleToolbarCreate = () => {
  stateCreateNonce.value += 1;
};
</script>
