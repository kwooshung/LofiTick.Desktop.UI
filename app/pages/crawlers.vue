<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <UButton icon="i-lucide:plus" color="primary" @click="handleToolbarCreate">
        {{ t('common.actions.add') }}
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
 * Hook：本地化路由
 */
const localePath = useLocalePath();

/**
 * 计算属性：目标站点路由
 */
const computedPathTargets = computed(() => localePath('/crawlers'));

/**
 * 计算属性：执行记录路由
 */
const computedPathExecutions = computed(() => localePath('/crawlers/executions'));

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
    label: t('pages.crawlers.title'),
    icon: 'i-lucide:bug',
    to: computedPathTargets.value,
    exact: true
  }
];

/**
 * 变量：Tab 链接
 */
const links = [
  [
    {
      label: t('pages.crawlers.targets.title'),
      icon: 'i-lucide:globe',
      to: computedPathTargets.value,
      exact: true
    },
    {
      label: t('pages.crawlers.executions.title'),
      icon: 'i-lucide:clock',
      to: computedPathExecutions.value,
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
