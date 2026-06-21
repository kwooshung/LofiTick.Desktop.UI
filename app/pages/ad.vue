<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <template v-if="computedRouteIsHotsearch">
        <SelectsPagesizes cache-key="ad-hotsearch" />

        <UPopover v-model:open="stateFiltersOpen" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 10 }" :ui="{ content: 'w-[min(92vw,36rem)] overflow-hidden p-0' }">
          <UButton icon="i-lucide-search" :label="computedFilterTriggerLabel" color="neutral" variant="subtle" class="w-60" :ui="{ leadingIcon: 'text-muted' }">
            <template #trailing>
              <UKbd value="/" class="ms-auto" />
            </template>
          </UButton>

          <template #content>
            <div class="bg-default flex flex-col gap-4 p-4 sm:p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-highlighted text-sm font-semibold">{{ t('pages.ads.filters.searchTitle') }}</div>
                  <div class="text-muted mt-1 text-xs">{{ t('pages.ads.filters.searchDescription') }}</div>
                </div>
              </div>

              <div class="max-h-[min(72vh,34rem)] space-y-3 overflow-y-auto pr-1">
                <UInput v-model="stateKeyword" :placeholder="t('pages.ads.filters.keywordPlaceholder')" :ui="{ trailing: 'pe-1' }" class="w-full" @keyup.enter="handleFiltersApply">
                  <template #leading>
                    <UIcon name="i-lucide:search" class="text-dimmed size-4" />
                  </template>

                  <template #trailing>
                    <UButton v-if="stateKeyword !== ''" color="neutral" variant="ghost" icon="i-lucide:x" size="xs" class="rounded-md" @click="stateKeyword = ''" />
                  </template>
                </UInput>

                <div class="grid gap-3 sm:grid-cols-2">
                  <USelect v-model="stateEditionScope" :items="editionScopeOptions" value-attribute="value" option-attribute="label" class="w-full" />

                  <USelect v-model="statePlatform" :items="platformOptions" value-attribute="value" option-attribute="label" class="w-full" />

                  <USelect v-model="stateEnabled" :items="enabledOptions" value-attribute="value" option-attribute="label" class="w-full sm:col-span-2" />
                </div>
              </div>

              <div class="border-default flex items-center justify-end gap-2 border-t pt-4">
                <UButton color="neutral" variant="outline" @click="handleFiltersReset">{{ t('common.actions.reset') }}</UButton>
                <UButton icon="i-lucide-search" color="primary" @click="handleFiltersApply">{{ t('common.actions.search') }}</UButton>
              </div>
            </div>
          </template>
        </UPopover>

        <UButton icon="i-lucide-plus" color="primary" @click="handleToolbarCreate">{{ t('pages.ads.actions.create') }}</UButton>
      </template>
    </template>

    <NuxtPage :create-nonce="stateCreateNonce" />
  </Dashboard>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

/**
 * 常量：EDITION_SCOPE_ALL_VALUE。
 */
const EDITION_SCOPE_ALL_VALUE = 'all';
/**
 * 常量：ENABLED_ALL_VALUE。
 */
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
 * 状态：筛选浮层开关。
 */
const stateFiltersOpen = ref(false);

/**
 * 状态：栏目范围。
 */
const stateEditionScope = ref(typeof route.query.editionScope === 'string' ? route.query.editionScope : EDITION_SCOPE_ALL_VALUE);

/**
 * 状态：平台筛选。
 */
const statePlatform = ref(typeof route.query.platform === 'string' ? route.query.platform : null);

/**
 * 状态：启用状态。
 */
const stateEnabled = ref(typeof route.query.enabled === 'string' ? route.query.enabled : ENABLED_ALL_VALUE);

/**
 * 常量：栏目范围选项。
 */
const editionScopeOptions = computed(() => [{ label: t('pages.ads.filters.allEditions'), value: EDITION_SCOPE_ALL_VALUE }, ...hotsearchAdEditionScopeOptionsGet()]);

/**
 * 常量：platformOptions。
 */
const platformOptions = computed(() => [{ label: t('pages.ads.filters.allPlatforms'), value: null }, ...hotsearchAdDeliveryPlatformOptionsGet().map((p) => ({ label: t(p.labelKey), value: p.key }))]);

/**
 * 常量：启用状态选项。
 */
const enabledOptions = computed(() => [
  { label: t('pages.ads.filters.allStatuses'), value: ENABLED_ALL_VALUE },
  { label: t('common.labels.enabled'), value: 'true' },
  { label: t('common.labels.disabled'), value: 'false' }
]);

/**
 * 计算属性：当前激活的筛选数量。
 */
const computedActiveFilterCount = computed(() => {
  /**
   * 常量：count。
   */
  let count = 0;

  if (stateKeyword.value.trim() !== '') {
    count += 1;
  }

  if (stateEditionScope.value !== EDITION_SCOPE_ALL_VALUE) {
    count += 1;
  }

  if (statePlatform.value && statePlatform.value !== '') {
    count += 1;
  }

  if (stateEnabled.value !== ENABLED_ALL_VALUE) {
    count += 1;
  }

  return count;
});

/**
 * 计算属性：搜索触发器文案。
 */
const computedFilterTriggerLabel = computed(() => {
  if (computedActiveFilterCount.value <= 0) {
    return t('pages.ads.filters.triggerDefault');
  }

  return t('pages.ads.filters.triggerFiltered', { count: computedActiveFilterCount.value });
});

/**
 * 状态：创建 nonce。
 */
const stateCreateNonce = ref(0);

/**
 * 计算属性：当前是否为热搜广告页。
 */
const computedRouteIsHotsearch = computed(() => route.path === localePath('/ad/hotsearch'));

/**
 * Store：认证。
 */
const storeAuth = useStoreAuth();

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

  stateFiltersOpen.value = false;

  const nextQuery: Record<string, string> = {};
  /**
   * 常量：keyword。
   */
  const keyword = stateKeyword.value.trim();
  /**
   * 常量：pageSize。
   */
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
  statePlatform.value = null;
  stateEnabled.value = ENABLED_ALL_VALUE;
  stateFiltersOpen.value = false;

  /**
   * 常量：pageSize。
   */
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
    statePlatform.value = typeof route.query.platform === 'string' ? route.query.platform : null;
  }
);

/**
 * 快捷键。
 */
defineShortcuts({
  '/': () => {
    if (!storeAuth.states.ui.show && computedRouteIsHotsearch.value) {
      stateFiltersOpen.value = true;
    }
  },
  enter: () => {
    if (stateFiltersOpen.value && computedRouteIsHotsearch.value) {
      handleFiltersApply();
    }
  }
});
</script>
