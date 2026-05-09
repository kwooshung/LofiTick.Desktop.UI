<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>
    <ULink to="hotsearch_old">进入旧版</ULink>
    <!-- <template #panel-left>
      <div class="border-default flex h-full min-w-120 flex-col border-e">
        <ul class="scrollbar flex h-dvh flex-col overflow-x-hidden overflow-y-auto">
          <li v-for="(date, inx) in dates" :key="inx" class="border-default border-b">
            <ULink to="/" inactive-class="text-default" class="hover:bg-elevated flex items-center justify-between border-none px-4 py-2 transition-colors duration-100 ease-out">
              <div class="flex items-center">
                <Datetime :datetime="date" date-style="long" :relative="false" class="text-muted hover:text-primary" />
                <span v-if="isToday(date)" class="bg-primary-500 ml-2 h-2 w-2 rounded-full" aria-hidden="true" />
              </div>
              <div class="flex gap-2">
                <UBadge color="primary" variant="soft">早报 (60)</UBadge>
                <UBadge color="warning" variant="soft">晚报 (50)</UBadge>
              </div>
            </ULink>
          </li>
        </ul>
        <div class="flex h-16 items-center justify-between gap-3 p-4 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
          <div class="muted text-sm">{{ t('components.pagination.total', { total: 365 }) }}</div>
          <div class="flex items-center gap-1.5">
            <UPagination :default-page="1" show-edges :sibling-count="0" :items-per-page="60" :total="365" />
          </div>
        </div>
      </div>
    </template>
    <NuxtPage /> -->
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
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
    label: t('pages.hotsearch.title'),
    icon: 'i-mdi:spider-outline',
    to: localePath('/hotsearch'),
    exact: true
  }
];

/**
 * 数组：往前 60 天的日期数组（从今天开始）
 */
// const dates: Date[] = Array.from({ length: 60 }, (_, i) => DateTime.today().addDays(-i).toJSDate());

/**
 * 函数：判断给定日期是否为今天（按年/月/日比较）
 */
// const isToday = (d: Date): boolean => {
//   const dt = DateTime.fromJSDate(d);
//   const today = DateTime.today();
//   return dt.year() === today.year() && dt.month() === today.month() && dt.day() === today.day();
// };

/**
 * 变量：Tab链接
 */
const links = [
  [
    {
      label: t('pages.hotsearch.runtimes.title'),
      icon: 'i-material-symbols:nest-clock-farsight-analog-outline',
      to: localePath('/hotsearch'),
      exact: true
    },
    {
      label: t('pages.hotsearch.list.title'),
      icon: 'i-material-symbols:text-snippet-outline',
      to: localePath('/hotsearch/list')
    }
  ]
] satisfies NavigationMenuItem[][];
</script>
