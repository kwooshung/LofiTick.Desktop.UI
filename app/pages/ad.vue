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
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 函数：本地化路由。
 */
const localePath = useLocalePath();

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 设置面包屑导航状态。
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.ads.title'),
    icon: 'i-lucide-megaphone',
    to: localePath('/ad'),
    exact: true
  }
];

/**
 * 变量：广告页导航链接。
 */
const links = [
  [
    {
      label: t('pages.ads.title'),
      icon: 'i-lucide-megaphone',
      to: localePath('/ad'),
      exact: true
    },
    {
      label: t('pages.hotsearch.title'),
      icon: 'i-material-symbols:bigtop-updates-rounded',
      to: localePath('/ad/hotsearch')
    }
  ]
] satisfies NavigationMenuItem[][];
</script>
