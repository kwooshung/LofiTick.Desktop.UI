<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <template v-if="computedRouteIsHotsearch">
        <SelectsPagesizes cache-key="ad-hotsearch" />

        <USelect v-model="stateEditionScope" :items="editionScopeOptions" value-attribute="value" option-attribute="label" class="w-32" @update:model-value="handleFiltersApply" />

        <USelect v-model="statePlatform" :items="platformOptions" value-attribute="value" option-attribute="label" class="w-36" @update:model-value="handleFiltersApply" />

        <USelect v-model="stateEnabled" :items="enabledOptions" value-attribute="value" option-attribute="label" class="w-28" @update:model-value="handleFiltersApply" />

        <UInput v-model="stateKeyword" placeholder="搜索广告标题" :ui="{ trailing: 'pe-1' }" class="w-48 xl:w-56" @keyup.enter="handleFiltersApply">
          <template #leading>
            <UIcon name="i-lucide:search" class="text-dimmed size-4" />
          </template>

          <template #trailing>
            <UButton v-if="stateKeyword !== ''" color="neutral" variant="ghost" icon="i-lucide:x" size="xs" class="rounded-md" @click="handleFiltersReset" />
          </template>
        </UInput>

        <UButton icon="i-lucide-plus" color="primary" @click="handleToolbarCreate">添加广告</UButton>
      </template>
    </template>

    <NuxtPage :create-nonce="stateCreateNonce" />
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

import { hotsearchAdEditionScopeOptionsGet, hotsearchAdDeliveryPlatformOptionsGet } from '@@/shared/utils';

const EDITION_SCOPE_ALL_VALUE = 'all';
const ENABLED_ALL_VALUE = 'all';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 路由。
 */
const route = useRoute();

/**
 * 函数：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 状态：关键词。
 */
const stateKeyword = ref(typeof route.query.keyword === 'string' ? route.query.keyword : '');

/**
 * 状态：栏目范围。
 */
const stateEditionScope = ref(typeof route.query.editionScope === 'string' ? route.query.editionScope : EDITION_SCOPE_ALL_VALUE);

/**
 * 状态：平台筛选。
 */
const statePlatform = ref(typeof route.query.platform === 'string' ? route.query.platform : '');

/**
 * 状态：启用状态。
 */
const stateEnabled = ref(typeof route.query.enabled === 'string' ? route.query.enabled : ENABLED_ALL_VALUE);

/**
 * 常量：栏目范围选项。
 */
const editionScopeOptions = [{ label: '全部栏目', value: EDITION_SCOPE_ALL_VALUE }, ...hotsearchAdEditionScopeOptionsGet()];

const platformOptions = computed(() => [{ label: '全部平台', value: '' }, ...hotsearchAdDeliveryPlatformOptionsGet().map((p) => ({ label: t(p.labelKey), value: p.key }))]);

/**
 * 常量：启用状态选项。
 */
const enabledOptions = [
  { label: '全部状态', value: ENABLED_ALL_VALUE },
  { label: '启用', value: 'true' },
  { label: '停用', value: 'false' }
];

/**
 * 状态：创建 nonce。
 */
const stateCreateNonce = ref(0);

/**
 * 计算属性：当前是否为热搜广告页。
 */
const computedRouteIsHotsearch = computed(() => route.path === localePath('/ad/hotsearch'));

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

/**
 * 事件：应用筛选条件。
 */
const handleFiltersApply = () => {
  if (!computedRouteIsHotsearch.value) {
    return;
  }

  const nextQuery: Record<string, string> = {};
  const keyword = stateKeyword.value.trim();
  const pageSize = typeof route.query.pagesize === 'string' ? route.query.pagesize.trim() : '';

  if (keyword !== '') {
    nextQuery.keyword = keyword;
  }

  if (stateEditionScope.value !== EDITION_SCOPE_ALL_VALUE) {
    nextQuery.editionScope = stateEditionScope.value;
  }

  if (statePlatform.value && statePlatform.value !== '') {
    nextQuery.platform = statePlatform.value;
  }

  if (stateEnabled.value !== ENABLED_ALL_VALUE) {
    nextQuery.enabled = stateEnabled.value;
  }

  if (pageSize !== '') {
    nextQuery.pagesize = pageSize;
  }

  nextQuery.page = '1';

  navigateTo({
    path: route.path,
    query: nextQuery
  });
};

/**
 * 事件：重置筛选条件。
 */
const handleFiltersReset = () => {
  stateKeyword.value = '';
  stateEditionScope.value = EDITION_SCOPE_ALL_VALUE;
  stateEnabled.value = ENABLED_ALL_VALUE;

  const pageSize = typeof route.query.pagesize === 'string' ? route.query.pagesize.trim() : '';

  navigateTo({
    path: route.path,
    query: pageSize === '' ? { page: '1' } : { pagesize: pageSize, page: '1' }
  });
};

/**
 * 事件：工具栏点击新增。
 */
const handleToolbarCreate = () => {
  if (!computedRouteIsHotsearch.value) {
    return;
  }

  stateCreateNonce.value += 1;
};

/**
 * 监听：路由变化时同步筛选状态。
 */
watch(
  () => route.query,
  () => {
    stateKeyword.value = typeof route.query.keyword === 'string' ? route.query.keyword : '';
    stateEditionScope.value = typeof route.query.editionScope === 'string' ? route.query.editionScope : EDITION_SCOPE_ALL_VALUE;
    stateEnabled.value = typeof route.query.enabled === 'string' ? route.query.enabled : ENABLED_ALL_VALUE;
    statePlatform.value = typeof route.query.platform === 'string' ? route.query.platform : '';
  }
);
</script>
