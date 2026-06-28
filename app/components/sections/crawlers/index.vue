<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <DashboardPage :padded="false" class="flex-1 p-4 sm:gap-3 sm:p-3">
      <div class="flex w-full flex-1 flex-col gap-3">
        <div class="flex flex-wrap items-center gap-3" />
        <div v-if="computedCrawlerRows.length > 0" class="flex w-full flex-1 flex-wrap content-start justify-start gap-4">
          <Folder v-for="item in computedCrawlerRows" :key="item.id" :label="item.name" icon-name="i-lucide:globe" :to="localePath(`/crawlers/${encodeURIComponent(item.domain)}`)" :context-menu-props="buildCrawlerTargetContextMenuProps(item)" />
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
            <FormUrlInput v-model="stateEditor.baseUrl" base-url-only class="z-1 w-full" :placeholder="t('pages.crawlers.targets.form.baseUrl.placeholder')" />
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
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod';

/**
 * Props：组件入参。
 */
const { createNonce = 0, keyword = '' } = defineProps<IPageCrawlersTargetsProps>();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 状态：蓝图抽屉开关。
 */
const stateBlueprintDrawerOpen = useState<boolean>('crawlers-blueprint-open', () => false);

/**
 * 状态：蓝图抽屉目标站点。
 */
const stateBlueprintDrawerTarget = useState<IQueryResultCrawlerTargetRow | null>('crawlers-blueprint-target', () => null);

/**
 * 状态：蓝图抽屉当前编辑蓝图 ID。
 */
const stateBlueprintDrawerBlueprintId = useState<number>('crawlers-blueprint-id', () => 0);

/**
 * 状态：蓝图抽屉当前服务端节点图。
 */
const stateBlueprintDrawerFlowData = useState<unknown>('crawlers-blueprint-flow-data', () => null);

/**
 * 状态：蓝图抽屉当前启用状态。
 */
const stateBlueprintDrawerEnabled = useState<boolean>('crawlers-blueprint-enabled', () => true);

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * Hook：爬虫站点动作。
 */
const { buildCrawlerTargetContextMenuItems } = useCrawlerTargetMenuActions();

/**
 * 路由：当前页面路由。
 */
const route = useRoute();

/**
 * 状态：分页大小 cookie。
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow'
});

/**
 * 函数：从完整 URL 提取纯域名
 * @param {string} url 完整 URL
 * @returns {string} 纯域名
 */
const extractDomainFromUrl = (url: string): string => {
  /**
   * 常量：raw。
   */
  const raw = String(url || '').trim();
  if (!raw) {
    return '';
  }
  /**
   * 常量：withoutProtocol。
   */
  const withoutProtocol = raw.replace(/^https?:\/\//i, '');
  /**
   * 常量：matchResult。
   */
  const matchResult = withoutProtocol.match(/^[^/?#]+/);
  return matchResult ? matchResult[0] : withoutProtocol;
};

/**
 * 函数：归一化用于查重比较的域名。
 * @param {string} value 域名或 URL。
 * @returns {string} 归一化域名。
 */
const normalizeDomainForUniqueCompare = (value: string): string => extractDomainFromUrl(value).trim().toLowerCase();

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
 * 状态：编辑器打开时的原始域名。
 */
const stateEditorOriginalDomain = ref('');

/**
 * 状态：最近一次触发查重的域名。
 */
const stateUniqueCheckingDomainValue = ref('');

/**
 * 函数：获取当前生效分页大小。
 * @returns {string} 分页大小文本。
 */
const currentPageSizeGet = (): string => {
  /**
   * 常量：pagesize。
   */
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
  /**
   * 常量：value。
   */
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

  /**
   * 常量：keywordValue。
   */
  const keywordValue = String(route.query.keyword ?? keyword ?? '').trim();
  if (keywordValue !== '') {
    query.keyword = keywordValue;
  }

  /**
   * 常量：page。
   */
  const page = String(route.query.page ?? '').trim();
  if (page !== '') {
    query.page = page;
  }

  /**
   * 常量：enabledState。
   */
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
    /**
     * 函数：parsed。
     */
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
  /**
   * 函数：parsed。
   */
  const parsed = parseInt(String(route.query.pagesize ?? ''), 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  /**
   * 常量：cookieSize。
   */
  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'crawlers');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }

  /**
   * 常量：apiSize。
   */
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

  /**
   * 常量：domain。
   */
  const domain = String(stateEditor.value.domain ?? '').trim();
  if (!domain) {
    return undefined;
  }

  /**
   * 常量：valid。
   */
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

  /**
   * 常量：domain。
   */
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
  stateEditorOriginalDomain.value = '';
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
 * 事件：编辑站点。
 * @param {IQueryResultCrawlerTargetRow} row 站点行。
 */
const handleEditTarget = (row: IQueryResultCrawlerTargetRow) => {
  stateEditorOriginalDomain.value = String(row.domain ?? '').trim();
  stateEditor.value = {
    id: Number(row.id ?? 0),
    name: String(row.name ?? ''),
    domain: String(row.domain ?? ''),
    baseUrl: String(row.baseUrl ?? ''),
    description: String(row.description ?? ''),
    isEnabled: Boolean(row.isEnabled ?? true)
  };
  stateEditorOpen.value = true;
};

/**
 * 函数：编辑器域名是否未变化。
 * @returns {boolean} 未变化时返回 true。
 */
const isEditorDomainUnchanged = (): boolean => {
  /**
   * 常量：id。
   */
  const id = Number(stateEditor.value.id ?? 0);
  /**
   * 常量：domain。
   */
  const domain = normalizeDomainForUniqueCompare(String(stateEditor.value.domain ?? ''));
  /**
   * 常量：originalDomain。
   */
  const originalDomain = normalizeDomainForUniqueCompare(String(stateEditorOriginalDomain.value ?? ''));
  return id > 0 && domain !== '' && domain === originalDomain;
};

/**
 * 函数：构建站点右键菜单属性。
 * @param {IQueryResultCrawlerTargetRow} row 站点行。
 * @returns {import('@nuxt/ui').ContextMenuProps} 右键菜单属性。
 */
const buildCrawlerTargetContextMenuProps = (row: IQueryResultCrawlerTargetRow) => ({
  items: buildCrawlerTargetContextMenuItems(row, {
    onOpen: () => {
      void navigateTo(localePath(`/crawlers/${encodeURIComponent(row.domain)}`));
    },
    onEdit: () => {
      handleEditTarget(row);
    },
    onAddTask: () => {
      stateBlueprintDrawerTarget.value = row;
      stateBlueprintDrawerBlueprintId.value = 0;
      stateBlueprintDrawerFlowData.value = null;
      stateBlueprintDrawerEnabled.value = true;
      stateBlueprintDrawerOpen.value = true;
    }
  })
});

/**
 * 监听：从 baseUrl 自动推导 domain
 */
watch(
  () => stateEditor.value.baseUrl,
  (val) => {
    /**
     * 常量：domain。
     */
    const domain = extractDomainFromUrl(val ?? '');
    if (stateEditor.value.baseUrl !== domain) {
      stateEditor.value.baseUrl = domain;
    }
    stateEditor.value.domain = domain;
  },
  { immediate: true }
);

/**
 * 监听：查重接口返回
 */
watch(
  stateUniqueDatas,
  (val) => {
    if (isEditorDomainUnchanged()) {
      stateUniqueDomainExists.value = false;
      return;
    }

    /**
     * 常量：domain。
     */
    const domain = String(stateEditor.value.domain ?? '').trim();
    if (domain === '' || domain !== stateUniqueCheckingDomainValue.value) {
      return;
    }

    stateUniqueDomainExists.value = Boolean(val?.domainExists);
  },
  { immediate: true }
);

/**
 * 监听：查重接口 loading 状态变化
 */
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
    stateUniqueCheckingDomainValue.value = '';
    return;
  }

  /**
   * 常量：id。
   */
  const id = Number(stateEditor.value.id ?? 0);
  /**
   * 常量：domain。
   */
  const domain = normalizeDomainForUniqueCompare(String(stateEditor.value.domain ?? ''));

  if (!domain) {
    stateUniqueDomainExists.value = false;
    stateUniqueCheckingDomain.value = false;
    stateUniqueCheckingDomainValue.value = '';
    return;
  }

  if (isEditorDomainUnchanged()) {
    stateUniqueDomainExists.value = false;
    stateUniqueCheckingDomain.value = false;
    stateUniqueCheckingDomainValue.value = '';
    return;
  }

  /**
   * 常量：shouldCheckDomain。
   */
  const shouldCheckDomain = !!domain && schema.pick({ domain: true }).safeParse({ domain }).success;

  if (!shouldCheckDomain) {
    stateUniqueDomainExists.value = false;
    stateUniqueCheckingDomain.value = false;
    stateUniqueCheckingDomainValue.value = '';
    return;
  }

  stateUniqueCheckingDomain.value = true;
  stateUniqueCheckingDomainValue.value = domain;
  refreshUniqueDebounced({ datas: { id, domain }, replace: true });
});

/**
 * 监听：createNonce 变化
 */
watch(
  () => createNonce,
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
      id: event.data.id,
      name: event.data.name,
      domain: normalizeDomainForUniqueCompare(event.data.domain),
      baseUrl: extractDomainFromUrl(event.data.baseUrl),
      description: event.data.description ?? '',
      isEnabled: event.data.isEnabled ?? true
    },
    replace: true
  });

  stateEditorOpen.value = false;
  await refreshList({ datas: buildCrawlerQueryFromRoute(), replace: true });
};
</script>
