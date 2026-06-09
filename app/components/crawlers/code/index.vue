<template>
  <USlideover
    v-model:open="open"
    :title="computedDrawerTitle"
    :description="baseUrl"
    side="bottom"
    :overlay="false"
    :ui="{
      header: 'px-4 py-3 sm:px-4 sm:py-3',
      content: 'bg-default h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] rounded-none shadow-3xl shadow-black/80',
      body: 'h-full w-full overflow-hidden p-0 sm:p-0'
    }"
  >
    <template #body>
      <div class="bg-default flex h-full min-h-0 flex-col overflow-hidden">
        <div class="relative flex min-h-0 flex-1 overflow-hidden"></div>
        <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 sm:p-3">
          <UButton type="button" color="neutral" variant="outline" @click="open = false">{{ t('common.actions.cancel') }}</UButton>
          <UButton type="button" color="primary" icon="i-lucide:save" @click="handleSave">{{ t('common.actions.save') }}</UButton>
        </div>
      </div>
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
 * 计算属性：抽屉标题。
 */
const computedDrawerTitle = computed(() => {
  const siteName = computedCurrentSiteName.value;

  return siteName !== '' ? `${t('pages.crawlers.blueprint.drawer.title')}（${siteName}）` : t('pages.crawlers.blueprint.drawer.title');
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
