<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu :items="links" highlight class="-translate-x-2.5" />
    </template>

    <template #toolbar-right>
      <div class="flex items-center gap-2">
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
 * Hook：本地化路由
 */
const localePath = useLocalePath();

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
    label: t('pages.crawlers.title'),
    icon: 'i-lucide:bug',
    to: computedPathTargets.value,
    exact: true
  }
];

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
