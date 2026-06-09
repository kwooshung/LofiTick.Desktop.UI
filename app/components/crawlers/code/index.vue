<template>
  <USlideover
    v-model:open="open"
    :title="computedDrawerTitle"
    :description="baseUrl"
    side="bottom"
    :overlay="false"
    :ui="{
      header: 'px-4 py-3 sm:px-4 sm:py-3',
      content: 'bg-default h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] rounded-none shadow-t-3xl shadow-black',
      body: 'h-full w-full overflow-hidden p-0 sm:p-0'
    }"
  >
    <template #body>
      <CrawlersEditor :site-name="computedCurrentSiteName" :base-url="baseUrl" @cancel="open = false" @save="handleSave" />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
/**
 * 属性：站点基础 URL。
 */
withDefaults(
  defineProps<{
    baseUrl?: string;
  }>(),

  {
    baseUrl: ''
  }
);

/**
 * 路由：当前路由
 */
const route = useRoute();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 函数：将站点域名转成展示名称
 * @param {string} domain 站点域名
 * @returns {string} 展示名称
 */
const domainDisplayNameGet = (domain: string): string => {
  const trimmed = String(domain ?? '').trim();

  if (trimmed === '') {
    return '';
  }

  const host = trimmed.split('/')[0]?.split('.')?.[0]?.trim() ?? '';

  if (host === '') {
    return trimmed;
  }

  return host.charAt(0).toUpperCase() + host.slice(1);
};

/**
 * 计算属性：当前站点域名
 */
const computedCurrentDomain = computed(() => {
  const value = route.params.domain;

  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return String(value[0] ?? '').trim();
  }

  return '';
});

/**
 * 计算属性：当前站点展示名称
 */
const computedCurrentSiteName = computed(() => domainDisplayNameGet(computedCurrentDomain.value));

/**
 * 常量：编辑区标题。
 */
const editorDrawerTitle = t('pages.crawlers.editor.title');

/**
 * 计算属性：抽屉标题。
 */
const computedDrawerTitle = computed(() => {
  const siteName = computedCurrentSiteName.value;

  return siteName !== '' ? `${editorDrawerTitle} / ${siteName}` : editorDrawerTitle;
});

/**
 * 双向绑定：抽屉开关
 */
const open = defineModel<boolean>('open', {
  default: false
});

/**
 * 事件：保存蓝图
 */
const handleSave = () => {
  open.value = false;
};
</script>
