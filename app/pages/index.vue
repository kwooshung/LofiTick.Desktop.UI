<template>
  <Dashboard>
    <div class="text-lofitick">asdf</div>

    <ULink :to="localePath('/folder')"></ULink>
  </Dashboard>
</template>

<script setup lang="ts">
/**
 * 国际化：i18n
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
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
    icon: 'i-proicons:settings',
    to: localePath('/'),
    exact: true
  }
];
</script>
