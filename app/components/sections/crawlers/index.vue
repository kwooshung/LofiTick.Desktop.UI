<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <DashboardPage :padded="false" class="flex-1 p-4 sm:gap-3 sm:p-3">
      <div class="flex w-full flex-1 flex-col gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <USelect v-model="stateEnabled" value-key="id" :items="computedEnabledItems" :placeholder="t('components.selects.enabled.placeholder')" class="w-56" />
        </div>
        <div v-if="computedCrawlerRows.length > 0" class="flex w-full flex-1 flex-wrap content-start justify-start gap-4">
          <Folder v-for="item in computedCrawlerRows" :key="item.id" :label="item.name" icon-name="i-lucide:globe" :to="localePath(`/crawlers/${encodeURIComponent(item.domain)}`)" />
        </div>
        <div v-else class="flex flex-1 items-center justify-center py-12">
          <UEmpty icon="i-lucide:globe" :title="t('pages.crawlers.targets.empty.title')" :description="t('pages.crawlers.targets.empty.description')" />
        </div>

        <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <div class="muted text-sm">{{ t('components.pagination.total', { total: computedTotal }) }}</div>
          <div class="flex items-center gap-1.5">
            <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="computedTotal" />
          </div>
        </div>
      </div>
    </DashboardPage>

    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="stateEditor.id ? t('pages.crawlers.targets.edit') : t('pages.crawlers.targets.add')" :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm id="crawlerTargetEditorForm" :schema="schema" :state="stateEditor" class="w-full max-w-none space-y-4" @submit="onSubmit">
          <UFormField required name="name" :label="t('pages.crawlers.targets.form.name.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UInput v-model="stateEditor.name" class="z-1 w-full" :placeholder="t('pages.crawlers.targets.form.name.placeholder')" />
          </UFormField>

          <UFormField required name="baseUrl" :label="t('pages.crawlers.targets.form.baseUrl.label')" :help="computedUniqueDomainHelp" :error="computedUniqueDomainError" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <FormUrlInput v-model="stateEditor.baseUrl" class="z-1 w-full" :placeholder="t('pages.crawlers.targets.form.baseUrl.placeholder')" />
            <template #error="{ error }">
              <p v-if="error">{{ error }}</p>
            </template>
          </UFormField>

          <UFormField name="description" :label="t('pages.crawlers.targets.form.description.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UTextarea v-model="stateEditor.description" class="w-full" :rows="3" autoresize :placeholder="t('pages.crawlers.targets.form.description.placeholder')" />
          </UFormField>

          <UFormField name="isEnabled" :label="t('pages.crawlers.targets.form.isEnabled.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <USwitch v-model="stateEditor.isEnabled" />
          </UFormField>
        </UForm>
      </template>

      <template #footer="{ close }">
        <UButton type="button" color="neutral" variant="outline" @click="close">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="submit" form="crawlerTargetEditorForm" icon="i-lucide-save" color="primary" :disabled="!computedCanSubmit">{{ t('common.actions.save') }}</UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from '@nuxt/ui';
import { z } from 'zod';

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 路由：当前页面路由。
 */
const route = useRoute();

/**
 * 组件：分页。
 */
const UPagination = resolveComponent('UPagination');

/**
 * 计算属性：启用状态筛选项。
 */
const computedEnabledItems = computed<SelectItem[]>(() => [
  { id: 'all', label: t('components.selects.enabled.items.all') },
  { id: 'enabled', label: t('components.selects.enabled.items.enabled') },
  { id: 'disabled', label: t('components.selects.enabled.items.disabled') }
]);

/**
 * 状态：启用状态筛选。
 */
const stateEnabled = ref<'all' | 'enabled' | 'disabled'>('all');

/**
 * 状态：分页大小 cookie。
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow'
});

/**
 * Props
 */
const props = withDefaults(defineProps<IPageCrawlersTargetsProps>(), {
  createNonce: 0,
  keyword: ''
});

/**
 * 函数：从完整 URL 提取纯域名
 * @param {string} url 完整 URL
 * @returns {string} 纯域名
 */
const extractDomainFromUrl = (url: string): string => {
  const raw = String(url || '').trim();
  if (!raw) {
    return '';
  }
  const withoutProtocol = raw.replace(/^https?:\/\//i, '');
  const matchResult = withoutProtocol.match(/^[^/?#]+/);
  return matchResult ? matchResult[0] : withoutProtocol;
};

/**
 * 常量：表单验证规则
 */
const schema = z.object({
  id: z.number().optional(),
  name: z
    .string({ message: t('pages.crawlers.targets.form.name.verify.required') })
    .trim()
    .min(1, t('pages.crawlers.targets.form.name.verify.required'))
    .max(255, t('pages.crawlers.targets.form.name.verify.length')),
  baseUrl: z
    .string({ message: t('pages.crawlers.targets.form.baseUrl.verify.required') })
    .trim()
    .min(1, t('pages.crawlers.targets.form.baseUrl.verify.required'))
    .max(255, t('pages.crawlers.targets.form.baseUrl.verify.length')),
  domain: z
    .string({ message: t('pages.crawlers.targets.form.domain.verify.required') })
    .trim()
    .min(1, t('pages.crawlers.targets.form.domain.verify.required'))
    .max(255, t('pages.crawlers.targets.form.domain.verify.length'))
    .regex(/^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, t('pages.crawlers.targets.form.domain.verify.pattern')),
  description: z.string().optional(),
  isEnabled: z.boolean().optional()
});

/**
 * 类型：表单数据
 */
type Schema = z.output<typeof schema>;

/**
 * 状态：编辑器开关
 */
const stateEditorOpen = ref(false);

/**
 * 状态：编辑器表单
 */
const stateEditor = ref<IPageCrawlerTargetForm>({
  id: 0,
  name: '',
  domain: '',
  baseUrl: '',
  description: '',
  isEnabled: true
});

/**
 * 函数：获取当前生效分页大小。
 * @returns {string} 分页大小文本。
 */
const currentPageSizeGet = (): string => {
  const pagesize = String(route.query.pagesize ?? '').trim();

  if (pagesize !== '') {
    return pagesize;
  }

  return String(getPageSizeByCookieParsed(pagesizesCookie.value, 'crawlers'));
};

/**
 * 函数：从路由读取启用状态。
 * @returns {'all' | 'enabled' | 'disabled'} 启用状态。
 */
const readEnabledStateFromRoute = (): 'all' | 'enabled' | 'disabled' => {
  const value = String(route.query.enabled ?? '').trim();

  if (value === '1') {
    return 'enabled';
  }

  if (value === '0') {
    return 'disabled';
  }

  return 'all';
};

/**
 * 函数：从路由构建列表查询参数。
 * @returns {Record<string, string>} 查询参数。
 */
const buildCrawlerQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {};

  const keyword = String(route.query.keyword ?? props.keyword ?? '').trim();
  if (keyword !== '') {
    query.keyword = keyword;
  }

  const page = String(route.query.page ?? '').trim();
  if (page !== '') {
    query.page = page;
  }

  const enabledState = readEnabledStateFromRoute();
  if (enabledState !== 'all') {
    query.enabled = enabledState === 'enabled' ? '1' : '0';
  }

  query.pagesize = currentPageSizeGet();

  return query;
};

/**
 * API：获取站点列表
 */
const { datas: stateDatas, refresh: refreshList } = await useApi<IQueryResultCrawlerTargetSummaryPage>('crawlers/targets', {
  immediate: true,
  datas: buildCrawlerQueryFromRoute()
});

/**
 * 计算属性：爬虫目标站点列表。
 */
const computedCrawlerRows = computed<IQueryResultCrawlerTargetRow[]>(() => stateDatas.value?.rows ?? []);

/**
 * 计算属性：列表总数。
 */
const computedTotal = computed<number>(() => Number(stateDatas.value?.total ?? 0));

/**
 * 计算属性：当前页。
 */
const computedPage = computed<number>({
  get: () => {
    const parsed = parseInt(String(route.query.page ?? ''), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  },
  set: (value: number) => {
    navigateTo({
      path: route.path,
      query: {
        ...route.query,
        page: String(Math.max(1, value))
      }
    });
  }
});

/**
 * 计算属性：每页数量。
 */
const computedItemsPerPage = computed<number>(() => {
  const parsed = parseInt(String(route.query.pagesize ?? ''), 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'crawlers');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }

  const apiSize = Number(stateDatas.value?.pageSize ?? 20);
  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

watch(
  () => route.query,
  () => {
    refreshList({ datas: buildCrawlerQueryFromRoute(), replace: true });
  }
);

/**
 * 监听：启用状态筛选变化并回写路由。
 */
watch(stateEnabled, (value) => {
  const nextEnabled = value === 'all' ? undefined : value === 'enabled' ? '1' : '0';
  const currentEnabled = String(route.query.enabled ?? '').trim();

  if ((nextEnabled ?? '') === currentEnabled) {
    return;
  }

  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      page: '1',
      ...(nextEnabled ? { enabled: nextEnabled } : {})
    }
  });
});

/**
 * 监听：路由启用状态变化时同步筛选控件。
 */
watch(
  () => route.query.enabled,
  () => {
    stateEnabled.value = readEnabledStateFromRoute();
  },
  { immediate: true }
);

/**
 * API：域名查重（防抖请求）
 */
const {
  datas: stateUniqueDatas,
  loading: stateUniqueLoading,
  refreshDebounced: refreshUniqueDebounced
} = await useApi<{ domainExists: boolean }>('crawlers/targets/unique', {
  datas: {},
  immediate: false
});

/**
 * 状态：域名查重结果
 */
const stateUniqueDomainExists = ref(false);

/**
 * 状态：当前正在查重的域名字段
 */
const stateUniqueCheckingDomain = ref(false);

/**
 * 计算属性：域名查重提示
 */
const computedUniqueDomainHelp = computed<string | undefined>(() => {
  if (!stateEditorOpen.value) {
    return undefined;
  }

  const domain = String(stateEditor.value.domain ?? '').trim();
  if (!domain) {
    return undefined;
  }

  const valid = schema.pick({ domain: true }).safeParse({ domain }).success;
  if (!valid) {
    return undefined;
  }

  if (stateUniqueLoading.value && stateUniqueCheckingDomain.value) {
    return t('pages.crawlers.targets.form.unique.checking');
  }
  return undefined;
});

/**
 * 计算属性：域名查重错误
 */
const computedUniqueDomainError = computed<string | undefined>(() => {
  if (!stateEditorOpen.value) {
    return undefined;
  }

  const domain = String(stateEditor.value.domain ?? '').trim();
  if (!domain) {
    return undefined;
  }

  return stateUniqueDomainExists.value ? t('pages.crawlers.targets.form.unique.domainExists') : undefined;
});

/**
 * 计算属性：表单是否可提交
 */
const computedCanSubmit = computed(() => schema.safeParse({ ...stateEditor.value }).success && !stateUniqueDomainExists.value);

/**
 * 事件：点击新增
 */
const handleCreate = () => {
  stateEditor.value = {
    id: 0,
    name: '',
    domain: '',
    baseUrl: '',
    description: '',
    isEnabled: true
  };
  stateEditorOpen.value = true;
};

/**
 * 监听：从 baseUrl 自动推导 domain
 */
watch(
  () => stateEditor.value.baseUrl,
  (val) => {
    stateEditor.value.domain = extractDomainFromUrl(val ?? '');
  },
  { immediate: true }
);

/**
 * 监听：查重接口返回
 */
watch(
  stateUniqueDatas,
  (val) => {
    stateUniqueDomainExists.value = Boolean(val?.domainExists);
  },
  { immediate: true }
);

watch(stateUniqueLoading, (isLoading) => {
  if (!isLoading) {
    stateUniqueCheckingDomain.value = false;
  }
});

/**
 * 监听：编辑器打开/输入变化时触发查重（防抖）
 */
watch([stateEditorOpen, () => stateEditor.value.id, () => stateEditor.value.domain], ([isOpen]) => {
  if (!isOpen) {
    stateUniqueDomainExists.value = false;
    stateUniqueCheckingDomain.value = false;
    return;
  }

  const id = Number(stateEditor.value.id ?? 0);
  const domain = String(stateEditor.value.domain ?? '').trim();

  if (!domain) {
    stateUniqueDomainExists.value = false;
    stateUniqueCheckingDomain.value = false;
    return;
  }

  const shouldCheckDomain = !!domain && schema.pick({ domain: true }).safeParse({ domain }).success;

  if (!shouldCheckDomain) {
    stateUniqueDomainExists.value = false;
    stateUniqueCheckingDomain.value = false;
    return;
  }

  stateUniqueCheckingDomain.value = true;
  refreshUniqueDebounced({ datas: { id, domain }, replace: true });
});

/**
 * 监听：createNonce 变化
 */
watch(
  () => props.createNonce,
  (value, oldValue) => {
    if (typeof value === 'number' && typeof oldValue === 'number' && value !== oldValue) {
      handleCreate();
    }
  }
);

/**
 * API：保存（新增/编辑）
 */
const { refresh: refreshSave } = await useApi<{ affected: number }>('crawlers/targets/add', { method: 'POST', immediate: false });

/**
 * 事件：提交表单
 */
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await refreshSave({
    datas: {
      name: event.data.name,
      domain: event.data.domain,
      baseUrl: event.data.baseUrl,
      description: event.data.description ?? '',
      isEnabled: event.data.isEnabled ?? true
    },
    replace: true
  });

  stateEditorOpen.value = false;
  await refreshList({ datas: buildCrawlerQueryFromRoute(), replace: true });
};
</script>
