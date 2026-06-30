<template>
  <DashboardPage direction="horizontal" :padded="false" class="p-4 sm:gap-3 sm:p-3">
    <Folder :label="t('pages.crawlers.spider.websites.pixabay.name')" icon-name="i-simple-icons:pixabay" cursor-pointer @click="handlePixabayClick" />
    <Folder :label="t('pages.crawlers.spider.websites.suno.name')" icon-name="i-simple-icons:suno" />
  </DashboardPage>

  <UModal v-model:open="statePixabayDialogOpen" :title="t('pages.crawlers.spider.websites.pixabay.dialog.title')" :description="t('pages.crawlers.spider.websites.pixabay.dialog.description')" :ui="{ content: 'sm:max-w-2xl', footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField :label="t('pages.crawlers.spider.websites.pixabay.dialog.typeLabel')">
          <USelectMenu v-model="statePixabayCrawlerType" :items="pixabayCrawlerTypeOptions" value-key="value" label-key="label" class="w-full" :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }">
            <template #item="{ item }">
              <div class="flex flex-col gap-0.5 py-1.5">
                <div class="text-sm font-medium">{{ item.label }}</div>
                <div class="text-muted text-xs break-all">{{ item.url }}</div>
              </div>
            </template>
          </USelectMenu>
        </UFormField>

        <UFormField :label="t('pages.crawlers.spider.websites.pixabay.dialog.keywordLabel')" required>
          <UInput v-model="statePixabayKeyword" clear class="w-full" :placeholder="t('pages.crawlers.spider.websites.pixabay.dialog.keywordPlaceholder')" />
        </UFormField>

        <UFormField :label="t('pages.crawlers.spider.websites.pixabay.dialog.pageLabel')">
          <UInputNumber v-model="statePixabayPage" orientation="vertical" :min="1" :step="1" variant="outline" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
        </UFormField>

        <div class="border-default bg-elevated/20 rounded-lg border p-3">
          <div class="text-muted mb-1 text-xs">{{ t('pages.crawlers.spider.websites.pixabay.dialog.urlLabel') }}</div>
          <div class="text-sm leading-6 break-all">{{ computedPixabayCrawlerUrlPreview }}</div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="statePixabayDialogOpen = false">
          {{ t('pages.crawlers.spider.websites.pixabay.dialog.cancel') }}
        </UButton>
        <UButton color="primary" :disabled="!computedPixabayKeywordReady" @click="handlePixabaySubmit">
          {{ t('pages.crawlers.spider.websites.pixabay.dialog.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { IPixabayCrawlerCacheItem, IPixabayCrawlerCacheStore, IPixabayCrawlerOption, TPixabayCrawlerType } from '@/components/sections/crawlers/index.types';

/**
 * Hook：i18n。
 */
const { t } = useI18n();

/**
 * 常量：Pixabay 爬取缓存键。
 */
const PIXABAY_CRAWLER_CACHE_STORAGE_KEY = 'pages.crawlers.pixabay.cache';

/**
 * 状态：Pixabay 类型选择弹窗是否打开。
 */
const statePixabayDialogOpen = ref(false);

/**
 * 状态：Pixabay 当前选择的爬取类型。
 */
const statePixabayCrawlerType = ref<TPixabayCrawlerType>('music');

/**
 * 状态：Pixabay 搜索关键词。
 */
const statePixabayKeyword = ref('');

/**
 * 状态：Pixabay 页码。
 */
const statePixabayPage = ref(1);

/**
 * 状态：Pixabay 本地缓存存储。
 */
const statePixabayCacheStore = ref<IPixabayCrawlerCacheStore>({ items: {} });

/**
 * 计算属性：关键词是否已填写。
 */
const computedPixabayKeywordReady = computed(() => statePixabayKeyword.value.trim().length > 0);

/**
 * 函数：生成默认的 Pixabay 缓存项。
 *
 * # Returns
 *
 * 返回一个可直接写入本地存储的默认缓存项。
 */
const createDefaultPixabayCacheItem = (): IPixabayCrawlerCacheItem => ({
  keyword: '',
  page: 1
});

/**
 * 函数：读取本地存储中的 Pixabay 缓存。
 *
 * # Returns
 *
 * 返回已保存的缓存内容；读取失败时回退为空对象。
 */
const readPixabayCacheStore = (): IPixabayCrawlerCacheStore => {
  if (!import.meta.client) {
    return { items: {} };
  }

  try {
    const rawValue = localStorage.getItem(PIXABAY_CRAWLER_CACHE_STORAGE_KEY);
    if (!rawValue) {
      return { items: {} };
    }

    const parsedValue = JSON.parse(rawValue) as Partial<IPixabayCrawlerCacheStore> | null;
    if (!parsedValue || typeof parsedValue !== 'object' || !parsedValue.items || typeof parsedValue.items !== 'object') {
      return { items: {} };
    }

    return {
      items: parsedValue.items
    };
  } catch {
    return { items: {} };
  }
};

/**
 * 函数：写入本地存储中的 Pixabay 缓存。
 *
 * # Arguments
 *
 * * `store` - 待保存的缓存内容。
 */
const writePixabayCacheStore = (store: IPixabayCrawlerCacheStore): void => {
  if (!import.meta.client) {
    return;
  }

  localStorage.setItem(PIXABAY_CRAWLER_CACHE_STORAGE_KEY, JSON.stringify(store));
};

/**
 * 函数：应用指定类型的 Pixabay 缓存。
 *
 * # Arguments
 *
 * * `type` - Pixabay 地址键。
 */
const applyPixabayCacheByType = (type: TPixabayCrawlerType): void => {
  const cachedItem = statePixabayCacheStore.value.items[type] ?? createDefaultPixabayCacheItem();
  statePixabayKeyword.value = cachedItem.keyword;
  statePixabayPage.value = cachedItem.page;
};

/**
 * 函数：保存指定类型的 Pixabay 缓存。
 *
 * # Arguments
 *
 * * `type` - Pixabay 地址键。
 * * `keyword` - 搜索关键词。
 * * `page` - 页码。
 */
const savePixabayCacheByType = (type: TPixabayCrawlerType, keyword: string, page: number): void => {
  statePixabayCacheStore.value.items[type] = {
    keyword,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  };

  writePixabayCacheStore(statePixabayCacheStore.value);
};

/**
 * 计算属性：Pixabay 爬取类型选项。
 */
const pixabayCrawlerTypeOptions = computed<IPixabayCrawlerOption[]>(() => [
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.photos'), value: 'photos', url: 'https://pixabay.com/photos/search/{keyword}/?pagi={page}', disabled: true },
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.illustrations'), value: 'illustrations', url: 'https://pixabay.com/illustrations/search/{keyword}/?pagi={page}', disabled: true },
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.vectors'), value: 'vectors', url: 'https://pixabay.com/vectors/search/{keyword}/?pagi={page}', disabled: true },
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.videos'), value: 'videos', url: 'https://pixabay.com/videos/search/{keyword}/?pagi={page}', disabled: true },
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.gifs'), value: 'gifs', url: 'https://pixabay.com/gifs/search/{keyword}/?pagi={page}', disabled: true },
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.threeDModels'), value: '3d-models', url: 'https://pixabay.com/3d-models/search/{keyword}/?pagi={page}', disabled: true },
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.music'), value: 'music', url: 'https://pixabay.com/music/search/{keyword}/?pagi={page}' },
  { label: t('pages.crawlers.spider.websites.pixabay.dialog.types.soundEffects'), value: 'sound-effects', url: 'https://pixabay.com/sound-effects/search/{keyword}/?pagi={page}' }
]);

/**
 * 计算属性：当前选中地址选项。
 */
const computedPixabayCurrentOption = computed(() => pixabayCrawlerTypeOptions.value.find((item) => item.value === statePixabayCrawlerType.value) ?? pixabayCrawlerTypeOptions.value[0]);

/**
 * 计算属性：当前预览网址。
 */
const computedPixabayCrawlerUrlPreview = computed(() => {
  const keyword = statePixabayKeyword.value.trim();
  const page = statePixabayPage.value;
  const template = computedPixabayCurrentOption.value?.url ?? '';

  if (!template) {
    return '';
  }

  const resolvedKeyword = keyword.length > 0 ? encodeURIComponent(keyword) : t('pages.crawlers.spider.websites.pixabay.dialog.keywordPreview');
  const resolvedPage = Number.isFinite(page) && page > 0 ? String(Math.floor(page)) : '1';

  return template.replace('{keyword}', resolvedKeyword).replace('?pagi={page}', resolvedPage ? `?pagi=${resolvedPage}` : '');
});

/**
 * 监听：当前 Pixabay 地址变化时，保存旧值并回填新地址缓存。
 */
watch(statePixabayCrawlerType, (nextType, prevType) => {
  savePixabayCacheByType(prevType, statePixabayKeyword.value.trim(), statePixabayPage.value);
  applyPixabayCacheByType(nextType);
});

/**
 * 监听：关键词或页码变化时，自动写入当前地址缓存。
 */
watch([statePixabayKeyword, statePixabayPage], () => {
  savePixabayCacheByType(statePixabayCrawlerType.value, statePixabayKeyword.value.trim(), statePixabayPage.value);
});

/**
 * 生命周期：挂载后初始化本地缓存。
 */
onMounted(() => {
  statePixabayCacheStore.value = readPixabayCacheStore();
  applyPixabayCacheByType(statePixabayCrawlerType.value);
});

/**
 * 函数：打开 Pixabay 爬取选择弹窗。
 */
const handlePixabayClick = (): void => {
  statePixabayCrawlerType.value = 'music';
  statePixabayDialogOpen.value = true;
};

/**
 * 函数：确认 Pixabay 爬取地址。
 */
const handlePixabaySubmit = (): void => {
  statePixabayDialogOpen.value = false;
};
</script>
