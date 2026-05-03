<template>
  <DashboardPage>
    <UnattendedLogsOverview />
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

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
    label: t('pages.settings.unattended.title'),
    icon: 'i-mdi:robot-outline',
    to: localePath('/unattended')
  }
];
</script>
