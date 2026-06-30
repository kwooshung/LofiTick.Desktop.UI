<template>
  <Dashboard>
    <NuxtPage />
  </Dashboard>
</template>

<script setup lang="ts">
/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

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
    icon: 'i-mdi:spider-outline',
    to: localePath('/crawlers'),
    exact: true
  }
];
</script>
