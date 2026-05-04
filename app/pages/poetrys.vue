<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <SelectsEnabled v-if="computedRouteIsList" />
      <SelectsPagesizes />
      <SearchPoetrys :route-is-list="computedRouteIsList" :route-is-authors="computedRouteIsAuthors" :route-is-dynasties="computedRouteIsDynasties" />
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
 * 计算属性：各路由路径 > 所有
 */
const computedPathList = computed(() => localePath('/poetrys'));

/**
 * 计算属性：各路由路径 > 作者
 */
const computedPathAuthors = computed(() => localePath('/poetrys/authors'));

/**
 * 计算属性：各路由路径 > 朝代
 */
const computedPathDynasties = computed(() => localePath('/poetrys/dynasties'));

/**
 * 计算属性：当前是否为列表页路由
 */
const computedRouteIsList = computed(() => route.path === computedPathList.value);

/**
 * 计算属性：当前是否为作者页路由
 */
const computedRouteIsAuthors = computed(() => route.path === computedPathAuthors.value);

/**
 * 计算属性：当前是否为朝代页路由
 */
const computedRouteIsDynasties = computed(() => route.path === computedPathDynasties.value);

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
    label: t('pages.poetrys.title'),
    icon: 'i-material-symbols:text-snippet-outline',
    to: localePath('/poetrys'),
    exact: true
  }
];

/**
 * 变量：Tab链接
 */
const links = [
  [
    {
      label: t('pages.poetrys.all.title'),
      icon: 'i-material-symbols:text-snippet-outline',
      to: localePath('/poetrys'),
      exact: true
    },
    {
      label: t('pages.poetrys.authors.title'),
      icon: 'i-lucide:user',
      to: localePath('/poetrys/authors')
    },
    {
      label: t('pages.poetrys.dynasty.title'),
      icon: 'i-material-symbols-light:calendar-month',
      to: localePath('/poetrys/dynasties')
    }
  ]
] satisfies NavigationMenuItem[][];
</script>
