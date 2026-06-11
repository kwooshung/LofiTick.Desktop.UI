<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <SelectsPagesizes />
      <SearchQuotes :route-is-list="computedRouteIsList" :route-is-authors="computedRouteIsAuthors" :route-is-sources="computedRouteIsSources" />
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
const computedPathList = computed(() => localePath('/quotes'));

/**
 * 计算属性：各路由路径 > 作者
 */
const computedPathAuthors = computed(() => localePath('/quotes/authors'));

/**
 * 计算属性：各路由路径 > 出处
 */
const computedPathSources = computed(() => localePath('/quotes/sources'));

/**
 * 计算属性：当前是否为列表页路由
 */
const computedRouteIsList = computed(() => route.path === computedPathList.value);

/**
 * 计算属性：当前是否为作者页路由
 */
const computedRouteIsAuthors = computed(() => route.path === computedPathAuthors.value);

/**
 * 计算属性：当前是否为出处页路由
 */
const computedRouteIsSources = computed(() => route.path === computedPathSources.value);

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
    label: t('pages.quotes.title'),
    icon: 'i-material-symbols:text-snippet-outline',
    to: localePath('/quotes'),
    exact: true
  }
];

/**
 * 变量：Tab链接
 */
const links = [
  [
    {
      label: t('pages.quotes.all.title'),
      icon: 'i-material-symbols:text-snippet-outline',
      to: localePath('/quotes'),
      exact: true
    },
    {
      label: t('pages.quotes.authors.title'),
      icon: 'i-lucide:user',
      to: localePath('/quotes/authors')
    },
    {
      label: t('pages.quotes.sources.title'),
      icon: 'i-material-symbols:book-3-outline-rounded',
      to: localePath('/quotes/sources')
    }
  ]
] satisfies NavigationMenuItem[][];
</script>
