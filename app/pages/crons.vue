<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <template v-if="computedRouteIsServer">
        <UInput v-model="stateSearchKeyword" class="w-72" :placeholder="t('pages.settings.cron.search.placeholder')" :disabled="!computedServerSearchEnabled" @keydown.enter.prevent="handleSearch" />
        <UButton color="primary" icon="i-lucide:search" :disabled="!computedServerSearchEnabled" @click="handleSearch">{{ t('pages.settings.cron.actions.search') }}</UButton>
        <UButton color="neutral" variant="ghost" icon="i-lucide:x" :disabled="!computedServerSearchEnabled" @click="handleResetSearch">{{ t('pages.settings.cron.actions.resetSearch') }}</UButton>
        <UButton color="primary" variant="soft" icon="i-lucide:refresh-cw" :disabled="!computedServerSearchEnabled" @click="handleSyncHotsearch">{{ t('pages.settings.cron.actions.syncHotsearch') }}</UButton>
        <UButton color="neutral" variant="outline" icon="i-lucide:rotate-ccw" @click="handleRefresh">{{ t('pages.settings.cron.actions.refresh') }}</UButton>
      </template>
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
 * 状态：计划任务搜索关键字
 */
const stateSearchKeyword = useState('crons-search-keyword', () => '');

/**
 * 状态：服务器任务刷新信号
 */
const stateRefreshNonce = useState('crons-refresh-nonce', () => 0);

/**
 * 状态：1Panel 是否已完成配置
 */
const stateOnepanelConfigured = useState('crons-onepanel-configured', () => false);

/**
 * 状态：热搜同步信号
 */
const stateSyncNonce = useState('crons-sync-nonce', () => 0);

/**
 * 计算属性：服务器任务路由
 */
const computedPathServer = computed(() => localePath('/crons/service'));

/**
 * 计算属性：服务器任务兼容路由
 */
const computedPathServerAlias = computed(() => localePath('/crons'));

/**
 * 计算属性：本地任务路由
 */
const computedPathLocal = computed(() => localePath('/crons/local'));

/**
 * 计算属性：系统任务路由
 */
const computedPathSystem = computed(() => localePath('/crons/system'));

/**
 * 计算属性：当前是否为服务器任务页
 */
const computedRouteIsServer = computed(() => route.path === computedPathServer.value || route.path === computedPathServerAlias.value);

/**
 * 计算属性：当前是否为本地任务页
 */
const computedRouteIsLocal = computed(() => route.path === computedPathLocal.value);

/**
 * 计算属性：服务器任务搜索能力是否可用
 */
const computedServerSearchEnabled = computed(() => stateOnepanelConfigured.value);

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
    label: t('pages.settings.cron.title'),
    icon: 'i-lucide:timer-reset',
    to: localePath('/crons/service'),
    exact: true
  }
];

/**
 * 变量：Tab 链接
 */
const links = [
  [
    {
      label: t('pages.settings.cron.tabs.local'),
      icon: 'i-lucide:monitor-cog',
      to: localePath('/crons/local')
    },
    {
      label: t('pages.settings.cron.tabs.server'),
      icon: 'i-lucide:server',
      to: localePath('/crons/service')
    },
    {
      label: t('pages.settings.cron.tabs.system'),
      icon: 'i-lucide:shield-check',
      to: localePath('/crons/system')
    }
  ]
] satisfies NavigationMenuItem[][];

/**
 * 事件：执行搜索
 */
const handleSearch = (): void => {
  const query: Record<string, string> = {};
  const keyword = String(stateSearchKeyword.value || '').trim();

  if (keyword) {
    query.info = keyword;
  }

  navigateTo({ path: computedPathServer.value, query });
};

/**
 * 事件：清空搜索
 */
const handleResetSearch = (): void => {
  stateSearchKeyword.value = '';
  navigateTo({ path: computedPathServer.value, query: {} });
};

/**
 * 事件：触发表格刷新
 */
const handleRefresh = (): void => {
  stateRefreshNonce.value += 1;
};

/**
 * 事件：触发热搜同步
 */
const handleSyncHotsearch = (): void => {
  stateSyncNonce.value += 1;
};

/**
 * 监听：路由变化时回填搜索关键字
 */
watch(
  () => route.query.info,
  (value) => {
    stateSearchKeyword.value = typeof value === 'string' ? value : '';
  },
  { immediate: true }
);
</script>
