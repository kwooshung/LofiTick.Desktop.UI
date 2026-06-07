<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu v-if="!computedRouteIsDetail" :items="links" highlight class="-translate-x-2.5" />
      <div v-else class="flex items-center gap-2">
        <UIcon name="i-lucide:globe" class="text-dimmed size-4" />
        <span class="font-medium">{{ computedRouteDetailTitle }}</span>
      </div>
    </template>

    <template #toolbar-right>
      <div v-if="!computedRouteIsDetail" class="flex items-center gap-2">
        <div class="hidden shrink-0 items-center gap-2 md:flex">
          <SelectsPagesizes cache-key="crawlers" />

          <UInput ref="refToolbarSearchInput" v-model="stateToolbarKeyword" :placeholder="t('pages.crawlers.searchPlaceholder')" :ui="{ trailing: 'pe-1' }" class="w-56 xl:w-64" @keyup.enter="handleKeywordApply">
            <template #leading>
              <UIcon name="i-lucide:search" class="text-dimmed size-4" />
            </template>

            <template #trailing>
              <div class="flex items-center">
                <UButton v-if="stateToolbarKeyword !== ''" color="neutral" variant="ghost" icon="i-lucide:x" size="xs" class="rounded-md" @click="handleFilterReset" />
                <UKbd v-else value="/" class="ms-1" />
              </div>
            </template>
          </UInput>
        </div>

        <UButton icon="i-lucide:plus" color="primary" @click="handleToolbarCreate">
          {{ t('common.actions.add') }}
        </UButton>
      </div>

      <div v-else class="flex items-center gap-2">
        <SelectsPagesizes cache-key="crawlers-detail" />
        <UButton icon="i-lucide:edit" color="primary" variant="outline" @click="handleEditTarget">
          {{ t('common.actions.edit') }}
        </UButton>
        <UButton icon="i-lucide:plus" color="primary" @click="handleAddTask">
          {{ t('pages.crawlers.targets.addTask') }}
        </UButton>
      </div>
    </template>

    <NuxtPage :create-nonce="stateCreateNonce" :keyword="stateToolbarKeyword" />
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
 * 路由
 */
const route = useRoute();

/**
 * 引用：工具栏搜索框
 */
const refToolbarSearchInput = useTemplateRef('refToolbarSearchInput');

/**
 * 计算属性：目标站点路由
 */
const computedPathTargets = computed(() => localePath('/crawlers'));

/**
 * 计算属性：执行记录路由
 */
const computedPathExecutions = computed(() => localePath('/crawlers/executions'));

/**
 * 计算属性：当前是否为爬虫详情页
 */
const computedRouteIsDetail = computed<boolean>(() => typeof route.params.domain === 'string' && route.params.domain.trim() !== '');

/**
 * 函数：将域名转换为站点显示名
 * @param {string} domain 域名
 * @returns {string} 站点显示名
 */
const domainDisplayNameGet = (domain: string): string => {
  const trimmed = domain.trim();
  if (trimmed === '') {
    return t('pages.crawlers.targets.title');
  }

  const host = trimmed.split('/')[0].split('.')[0] ?? trimmed;
  if (host === '') {
    return trimmed;
  }

  return host.charAt(0).toUpperCase() + host.slice(1);
};

/**
 * 状态：创建 nonce
 */
const stateCreateNonce = ref(0);

/**
 * 状态：工具栏关键词
 */
const stateToolbarKeyword = ref('');

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 计算属性：详情页标题
 */
const computedRouteDetailTitle = computed<string>(() => {
  const last = storeBreadcrumb.states.at(-1)?.label;
  if (typeof last === 'string' && last.trim() !== '') {
    return last;
  }

  const domain = typeof route.params.domain === 'string' ? route.params.domain.trim() : '';
  return domain !== '' ? domainDisplayNameGet(domain) : t('pages.crawlers.targets.title');
});

/**
 * 事件：编辑站点
 */
const handleEditTarget = () => {
  // TODO: 打开编辑弹窗
};

/**
 * 事件：添加任务
 */
const handleAddTask = () => {
  // TODO: 打开添加任务弹窗
};

/**
 * 监听：路由变化时同步面包屑
 */
watch(
  () => route.path,
  () => {
    if (computedRouteIsDetail.value) {
      const detailDomain = typeof route.params.domain === 'string' ? route.params.domain.trim() : '';
      const detailTitle = detailDomain !== '' ? domainDisplayNameGet(detailDomain) : t('pages.crawlers.targets.title');

      storeBreadcrumb.states = [
        {
          label: t('pages.home.title'),
          icon: 'i-mdi:view-dashboard-outline',
          to: localePath('/'),
          exact: true
        },
        {
          label: t('pages.crawlers.title'),
          icon: 'i-lucide:bug',
          to: computedPathTargets.value,
          exact: true
        },
        {
          label: detailTitle,
          icon: 'i-lucide:globe',
          to: route.path,
          exact: true
        }
      ];

      return;
    }

    storeBreadcrumb.states = [
      {
        label: t('pages.home.title'),
        icon: 'i-mdi:view-dashboard-outline',
        to: localePath('/'),
        exact: true
      },
      {
        label: t('pages.crawlers.title'),
        icon: 'i-lucide:bug',
        to: computedPathTargets.value,
        exact: true
      }
    ];
  },
  { immediate: true }
);

/**
 * 变量：Tab 链接
 */
const links = [
  [
    {
      label: t('pages.crawlers.targets.title'),
      icon: 'i-lucide:globe',
      to: computedPathTargets.value,
      exact: true
    },
    {
      label: t('pages.crawlers.executions.title'),
      icon: 'i-lucide:clock',
      to: computedPathExecutions.value,
      exact: true
    }
  ]
] satisfies NavigationMenuItem[][];

/**
 * 事件：工具栏点击创建
 */
const handleToolbarCreate = () => {
  stateCreateNonce.value += 1;
};

/**
 * 事件：关键词应用
 */
const handleKeywordApply = () => {
  // 触发搜索
};

/**
 * 事件：重置筛选
 */
const handleFilterReset = () => {
  stateToolbarKeyword.value = '';
};

/**
 * 快捷键
 */
defineShortcuts({
  /**
   * 聚焦搜索框
   */
  '/': () => {
    refToolbarSearchInput.value?.inputRef?.focus();
  }
});
</script>
