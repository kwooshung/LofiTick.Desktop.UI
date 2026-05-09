<template>
  <DashboardPage>
    <SettingsUe5 />
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：i18n
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
    label: t('pages.settings.title'),
    icon: 'i-proicons:settings',
    to: localePath('/settings'),
    exact: true
  },
  {
    label: t('pages.settings.unattended.sections.ue5.title'),
    icon: 'i-file-icons:unrealscript',
    to: localePath('/settings/ue5')
  }
];
</script>
