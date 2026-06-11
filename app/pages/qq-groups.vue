<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <SelectsPagesizes />
      <div class="flex items-center gap-2">
        <SearchQqGroups />
        <UButton icon="i-lucide-plus" color="primary" @click="handleToolbarCreate">
          {{ t('pages.socials.qq.groups.add') }}
        </UButton>
      </div>
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
    label: t('pages.socials.qq.groups.title'),
    icon: 'i-ri:qq-line',
    to: localePath('/qq-groups'),
    exact: true
  }
];

/**
 * 变量：Tab 链接
 */
const links = [
  [
    {
      label: t('pages.socials.qq.groups.all.title'),
      icon: 'i-ri:qq-line',
      to: localePath('/qq-groups'),
      exact: true
    }
  ]
] satisfies NavigationMenuItem[][];

/**
 * 状态：创建 nonce
 */
const stateCreateNonce = ref(0);

/**
 * 事件：工具栏点击新增
 */
const handleToolbarCreate = () => {
  stateCreateNonce.value += 1;
};
</script>
