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
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 变量：设置页 Tab 链接
 */
const links = [
  [
    {
      label: t('pages.settings.general.title'),
      icon: 'i-proicons:settings',
      to: localePath('/settings'),
      exact: true
    },
    {
      label: t('pages.settings.ui.title'),
      icon: 'i-lucide:brush-cleaning',
      to: localePath('/settings/ui')
    },
    {
      label: t('pages.settings.playback.title'),
      icon: 'i-lucide:play',
      to: localePath('/settings/playback')
    },
    {
      label: t('pages.settings.power.title'),
      icon: 'i-carbon:flash',
      to: localePath('/settings/power')
    },
    {
      label: t('pages.settings.unattended.sections.ue5.title'),
      icon: 'i-file-icons:unrealscript',
      to: localePath('/settings/ue5')
    },
    {
      label: t('pages.settings.unattended.title'),
      icon: 'i-mdi:robot-outline',
      to: localePath('/settings/unattended')
    }
  ]
] satisfies NavigationMenuItem[][];
</script>
