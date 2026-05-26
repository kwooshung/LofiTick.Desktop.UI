<template>
  <aside class="drag bg-elevated/25 border-default relative flex h-full w-40 shrink-0 flex-col border-e transition-[width,background] duration-100 ease-out">
    <Logo class="mx-auto flex h-16 -translate-x-1 items-center" class-icon-area="mr-1 text-3xl text-primary" class-text-area="flex" class-texts="ml-1 text-default text-xl" />
    <div class="flex flex-1 flex-col gap-1 p-2">
      <UNavigationMenu :class="`${storeAuth.states.ui.show ? '' : 'no-'}drag`" :items="computedLinks" orientation="vertical" tooltip popover />
    </div>
    <div id="footer" class="h-12"></div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

/**
 * Hook：认证 Store
 */
const storeAuth = useStoreAuth();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 计算属性：侧边栏链接
 */
const computedLinks = computed<NavigationMenuItem[]>(() => [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/')
  },
  {
    label: t('pages.lives.title'),
    icon: 'i-material-symbols:live-tv-outline-rounded',
    to: localePath('/lives')
  },
  {
    label: t('pages.musics.title'),
    icon: 'i-mdi:folder-music-outline',
    to: localePath('/musics')
  },
  {
    label: t('pages.analyses.title'),
    icon: 'i-material-symbols:trending-up',
    to: localePath('/analyses')
  },
  {
    label: t('pages.reviews.title'),
    icon: 'i-mingcute:list-check-2-line',
    to: localePath('/reviews')
  },
  {
    label: t('pages.crawlers.title'),
    icon: 'i-mdi:spider-outline',
    to: localePath('/crawlers')
  },
  {
    label: t('pages.hotsearch.title'),
    icon: 'i-material-symbols:bigtop-updates-rounded',
    to: localePath('/hotsearch')
  },
  {
    label: t('pages.poetrys.title'),
    icon: 'i-material-symbols:text-snippet-outline',
    to: localePath('/poetrys')
  },
  {
    label: t('pages.quotes.title'),
    icon: 'i-mingcute:blockquote-line',
    to: localePath('/quotes')
  },
  {
    label: t('pages.socials.qq.groups.title'),
    icon: 'i-ri:qq-line',
    to: localePath('/qq-groups')
  },
  {
    label: t('pages.members.title'),
    icon: 'i-lucide-users',
    to: localePath('/members')
  },
  {
    label: t('pages.ads.title'),
    icon: 'i-lucide-megaphone',
    to: localePath('/ad')
  },
  {
    label: t('pages.incomes.title'),
    icon: 'i-tabler:moneybag',
    to: localePath('/incomes')
  },
  {
    label: t('pages.settings.cron.title'),
    icon: 'i-lucide:timer-reset',
    to: localePath('/crons')
  },
  {
    label: t('pages.settings.unattended.title'),
    icon: 'i-mdi:robot-outline',
    to: localePath('/unattended')
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-proicons:settings',
    to: localePath('/settings')
  }
]);
</script>
