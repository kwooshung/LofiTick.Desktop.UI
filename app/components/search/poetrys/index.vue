<template>
  <template v-if="routeIsList">
    <DefinePoetrySearchPanelBody>
      <div class="grid gap-3 sm:grid-cols-2">
        <UInput v-model="stateTitle" icon="i-mdi:format-title" variant="outline" class="sm:col-span-1" :placeholder="t('components.poetrys.search.body.title.placeholder')" autofocus clear>
          <template v-if="stateTitle.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateTitle = ''" />
          </template>
        </UInput>
        <UInput v-model="stateContent" icon="i-material-symbols:text-snippet-outline" variant="outline" class="sm:col-span-1" :placeholder="t('components.poetrys.search.body.content.placeholder')" clear>
          <template v-if="stateContent.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateContent = ''" />
          </template>
        </UInput>
        <USelectMenu
          v-model="stateSelectedDynasties"
          v-model:search-term="stateKeywordDynasty"
          icon="i-material-symbols-light:calendar-month"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.poetrys.search.body.dynasty.placeholder')"
          :items="stateItemDynasties"
          :loading="stateLoadingDynasties"
          class="sm:col-span-1"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
        >
          <template #item-trailing="{ item }">
            <span class="text-muted">{{ item?.count }}</span>
          </template>
        </USelectMenu>
        <USelectMenu
          v-model="stateSelectedAuthor"
          v-model:search-term="stateKeywordAuthor"
          icon="i-lucide-user"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.poetrys.search.body.author.placeholder')"
          :items="stateItemAuthors"
          :loading="stateLoadingAuthors"
          class="sm:col-span-1"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
        >
          <template #item-trailing="{ item }">
            <span class="text-muted">{{ item?.count }}</span>
          </template>
        </USelectMenu>
        <USelect v-model="stateEnabled" value-key="id" class="sm:col-span-2" :items="computedEnabledItems" :placeholder="t('components.selects.enabled.placeholder')" />
      </div>
    </DefinePoetrySearchPanelBody>

    <DefinePoetrySearchPanelActions>
      <USwitch v-model="stateIsAnd" :label="stateIsAnd ? t('components.poetrys.search.footer.match.all') : t('components.poetrys.search.footer.match.any')" />
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline" @click="handleReset">{{ t('components.poetrys.search.buttons.reset') }}</UButton>
        <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.poetrys.search.buttons.search') }}</UButton>
      </div>
    </DefinePoetrySearchPanelActions>

    <template v-if="stateSearchPanelMobile">
      <UButton icon="i-lucide-search" :label="computedSearchTriggerLabel" color="neutral" variant="subtle" class="w-52" :ui="{ leadingIcon: 'text-muted' }" @click="stateOpen = true">
        <template #trailing>
          <UKbd value="/" class="ms-auto" />
        </template>
      </UButton>

      <USlideover v-model:open="stateOpen" :title="t('components.poetrys.search.header.title')" :ui="{ body: 'space-y-4', footer: 'justify-between' }">
        <template #body>
          <ReusePoetrySearchPanelBody />
        </template>
        <template #footer>
          <ReusePoetrySearchPanelActions />
        </template>
      </USlideover>
    </template>
    <template v-else>
      <UPopover v-model:open="stateOpen" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 10 }" :ui="{ content: 'w-[min(92vw,44rem)] p-0 overflow-hidden' }">
        <UButton icon="i-lucide-search" :label="computedSearchTriggerLabel" color="neutral" variant="subtle" class="w-52" :ui="{ leadingIcon: 'text-muted' }">
          <template #trailing>
            <UKbd value="/" class="ms-auto" />
          </template>
        </UButton>

        <template #content>
          <div class="bg-default flex flex-col gap-4 p-4 sm:p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-highlighted text-sm font-semibold">{{ t('components.poetrys.search.header.title') }}</div>
                <div class="text-muted mt-1 text-xs">{{ computedSearchTriggerLabel }}</div>
              </div>
            </div>

            <div class="max-h-[min(72vh,30rem)] overflow-y-auto pr-1">
              <ReusePoetrySearchPanelBody />
            </div>

            <div class="border-default flex items-center justify-between gap-3 border-t pt-4">
              <ReusePoetrySearchPanelActions />
            </div>
          </div>
        </template>
      </UPopover>
    </template>
  </template>
  <template v-else-if="routeIsAuthors">
    <div class="flex items-center gap-2">
      <UFieldGroup>
        <USelect v-model="statePageAuthorSearchType" value-key="id" :items="computedPageAuthorSearchTypeItems" />
        <USelectMenu
          v-if="statePageAuthorSearchType === 'author'"
          ref="refAuthorMenu"
          v-model="stateSelectedAuthor"
          v-model:search-term="stateKeywordAuthor"
          icon="i-lucide-user"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.poetrys.search.body.author.placeholder')"
          :items="stateItemAuthors"
          :loading="stateLoadingAuthors"
          :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          class="min-w-60"
        >
          <template #trailing>
            <UKbd value="/" class="ms-auto" />
          </template>
          <template #item-trailing="{ item }">
            <span class="text-muted">{{ item?.count }}</span>
          </template>
        </USelectMenu>
        <USelectMenu
          v-else
          ref="refDynastyMenu"
          v-model="stateSelectedDynasties"
          v-model:search-term="stateKeywordDynasty"
          icon="i-material-symbols-light:calendar-month"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.poetrys.search.body.dynasty.placeholder')"
          :items="stateItemDynasties"
          :loading="stateLoadingDynasties"
          :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          class="min-w-60"
        >
          <template #trailing>
            <UKbd value="/" class="ms-auto" />
          </template>
          <template #item-trailing="{ item }">
            <span class="text-muted">{{ item?.count }}</span>
          </template>
        </USelectMenu>
        <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.poetrys.search.buttons.search') }}</UButton>
      </UFieldGroup>
    </div>
  </template>
  <template v-else-if="routeIsDynasties">
    <div class="flex items-center gap-2">
      <UFieldGroup>
        <USelectMenu
          ref="refDynastyMenu"
          v-model="stateSelectedDynasties"
          v-model:search-term="stateKeywordDynasty"
          icon="i-material-symbols-light:calendar-month"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.poetrys.search.body.dynasty.placeholder')"
          :items="stateItemDynasties"
          :loading="stateLoadingDynasties"
          :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          class="min-w-60"
        >
          <template #trailing>
            <UKbd value="/" class="ms-auto" />
          </template>
          <template #item-trailing="{ item }">
            <span class="text-muted">{{ item?.count }}</span>
          </template>
        </USelectMenu>
        <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.poetrys.search.buttons.search') }}</UButton>
      </UFieldGroup>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

import type { IComponentPropsPoetrysSearch, IComponentPropsPoetrysSelectMenuItem } from '@/components/search/poetrys/index.types';

/**
 * 属性：路由状态（由主页面传入）。
 */
/**
 * Props：组件入参。
 */
const { routeIsList, routeIsAuthors, routeIsDynasties } = defineProps<IComponentPropsPoetrysSearch>();

/**
 * 模板：诗词搜索面板主体。
 */
const [DefinePoetrySearchPanelBody, ReusePoetrySearchPanelBody] = createReusableTemplate();

/**
 * 模板：诗词搜索面板操作区。
 */
const [DefinePoetrySearchPanelActions, ReusePoetrySearchPanelActions] = createReusableTemplate();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Store：认证
 */
const storeAuth = useStoreAuth();

/**
 * 常量：路由
 */
const route = useRoute();

/**
 * 引用：选择菜单，作者
 */
const stateRefAuthorMenu = ref<{ triggerRef: { click: () => void } } | null>(null);

/**
 * 引用：选择菜单，朝代
 */
const stateRefDynastyMenu = ref<{ triggerRef: { click: () => void } } | null>(null);

/**
 * 状态：模态框开关
 */
const stateOpen = ref(false);

/**
 * 状态：搜索面板是否使用移动端抽屉模式。
 */
const stateSearchPanelMobile = ref(false);

/**
 * 状态：标题关键词
 */
const stateTitle = ref('');

/**
 * 状态：内容关键词
 */
const stateContent = ref('');

/**
 * 状态：作者页搜索类型
 */
const statePageAuthorSearchType = ref<'author' | 'dynasty'>('author');

/**
 * 状态：已选朝代
 */
const stateSelectedDynasties = ref<IComponentPropsPoetrysSelectMenuItem[]>([]);

/**
 * 状态：已选作者
 */
const stateSelectedAuthor = ref<IComponentPropsPoetrysSelectMenuItem[]>([]);

/**
 * 状态：朝代联想关键词
 */
const stateKeywordDynasty = ref('');

/**
 * 状态：作者联想关键词
 */
const stateKeywordAuthor = ref('');

/**
 * 状态：匹配方式（true=全部满足，false=任意满足）
 */
const stateIsAnd = ref(false);

/**
 * 状态：启用状态筛选。
 */
const stateEnabled = ref<'all' | 'enabled' | 'disabled'>('all');

/**
 * 状态：加载朝代联想
 */
const stateLoadingDynasties = ref(false);

/**
 * 状态：加载作者联想
 */
const stateLoadingAuthors = ref(false);

/**
 * 状态：缓存 > 作者标签映射
 */
const stateCacheAuthorLabelMap = ref(new Map<number, { label: string; count: number }>());

/**
 * 状态：缓存 > 朝代标签映射
 */
const stateCacheDynastyLabelMap = ref(new Map<number, { label: string; count: number }>());

/**
 * 常量：搜索候选默认数量。
 */
const SEARCH_SUGGESTION_LIMIT = 10;

/**
 * 计算属性：是否设置了搜索条件
 */
const computedHasSearchConditions = computed(() => {
  /**
   * 常量：q。
   */
  const q = route.query;

  /**
   * 函数：hasText。
   */
  const hasText = (typeof q.title !== 'undefined' && String(q.title ?? '').trim().length > 0) || (typeof q.content !== 'undefined' && String(q.content ?? '').trim().length > 0);

  return hasText || hasQueryParamIds('dynasty_ids') || hasQueryParamIds('author_ids') || typeof q.enabled !== 'undefined';
});

/**
 * 计算属性：搜索入口按钮文案。
 */
const computedSearchTriggerLabel = computed(() => (computedHasSearchConditions.value ? t('components.poetrys.search.header.conditions') : t('components.poetrys.search.header.startLabel')));

/**
 * 计算属性：作者页搜索类型选项
 */
const computedPageAuthorSearchTypeItems = computed<SelectItem[]>(() => [
  { id: 'author', label: t('components.poetrys.search.selects.author') },
  { id: 'dynasty', label: t('components.poetrys.search.selects.dynasty') }
]);

/**
 * 计算属性：启用状态选项。
 */
const computedEnabledItems = computed<SelectItem[]>(() => [
  { id: 'all', label: t('components.selects.enabled.items.all') },
  { id: 'enabled', label: t('components.selects.enabled.items.enabled') },
  { id: 'disabled', label: t('components.selects.enabled.items.disabled') }
]);

/**
 * Hook：朝代，限制选择数量
 */
const { items: stateItemDynasties, setOriginItems: setOriginDynasties } = useSelectMenuLimited(stateSelectedDynasties, 5);

/**
 * API：搜索朝代
 */
const { datas: stateDynastyData, refreshDebounced: refreshDebouncedDynasty } = await useApi<IQueryResultPoetrySearchDynastiesResponse>('poetrys/searchs/dynasties', { datas: { q: stateKeywordDynasty.value, limit: SEARCH_SUGGESTION_LIMIT } });

/**
 * API：按 ID 回填朝代标签。
 */
const { datas: stateDynastySummaryData, refresh: refreshDynastySummary } = await useApi<IQueryResultPoetryDynastiesSummaryPage>('poetrys/dynasties', { immediate: false });

/**
 * Hook：作者，限制选择数量
 */
const { items: stateItemAuthors, setOriginItems: setOriginAuthors } = useSelectMenuLimited(stateSelectedAuthor, 5);

/**
 * API：搜索作者
 */
const { datas: stateAuthorData, refreshDebounced: refreshDebouncedAuthor } = await useApi<IQueryResultPoetrySearchAuthorsResponse>('poetrys/searchs/authors', { datas: { q: stateKeywordAuthor.value, limit: SEARCH_SUGGESTION_LIMIT } });

/**
 * API：按 ID 回填作者标签。
 */
const { datas: stateAuthorSummaryData, refresh: refreshAuthorSummary } = await useApi<IQueryResultPoetryAuthorsSummaryPage>('poetrys/authors', { immediate: false });

/**
 * 函数：构建联想请求参数。
 * @param {string} keyword 搜索关键词
 * @returns {{ q: string; limit: number }} 联想请求参数
 */
const buildSuggestionDatas = (keyword: string): { q: string; limit: number } => ({
  q: String(keyword ?? '').trim(),
  limit: SEARCH_SUGGESTION_LIMIT
});

/**
 * 函数：构建按 ID 回填名称的请求参数。
 * @param {'author_ids' | 'dynasty_ids'} key 过滤键名
 * @param {number[]} ids ID 列表
 * @returns {Record<string, string | string[]>} 列表查询参数
 */
const buildHydrateQueryDatas = (key: 'author_ids' | 'dynasty_ids', ids: number[]): Record<string, string | string[]> => ({
  [key]: ids.map((id) => String(id)),
  page: '1',
  pagesize: String(Math.max(ids.length, SEARCH_SUGGESTION_LIMIT))
});

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
 * 函数：查询数组参数
 * @param {('dynasty_ids' | 'author_ids')} key 参数键名
 * @return {boolean} 是否存在有效参数
 */
const hasQueryParamIds = (key: 'dynasty_ids' | 'author_ids'): boolean => {
  /**
   * 常量：v。
   */
  const v = route.query[key];

  if (typeof v === 'undefined' || v === null) {
    return false;
  }
  if (Array.isArray(v)) {
    return v.length > 0;
  }
  return String(v).trim().length > 0;
};

/**
 * 辅助：从路由查询提取 ID 数组
 */
const getQueryIds = (key: 'dynasty_ids' | 'author_ids'): number[] => {
  /**
   * 常量：v。
   */
  const v = route.query[key];
  /**
   * 常量：arr。
   */
  const arr = v ? (Array.isArray(v) ? v : [v]) : [];
  return arr.map((s) => parseInt(String(s), 10)).filter((n) => Number.isFinite(n) && n > 0);
};

/**
 * 辅助：将 ID 映射为选择项，优先使用当前选择或缓存中的 label
 */
const mapIdsToSelected = (ids: number[], current: IComponentPropsPoetrysSelectMenuItem[], cache: Map<number, { label: string; count: number }>): IComponentPropsPoetrysSelectMenuItem[] => {
  return ids.map((id) => {
    /**
     * 常量：hitSel。
     */
    const hitSel = current.find((s) => s.value === id);
    /**
     * 常量：hitCache。
     */
    const hitCache = cache.get(id);
    return {
      label: hitSel?.label ?? hitCache?.label ?? String(id),
      value: id,
      count: hitSel?.count ?? hitCache?.count ?? 0
    };
  });
};

/**
 * 函数：列表页——从路由查询参数应用默认值（在模态打开时执行）
 */
const applyListDefaultsFromRoute = async (): Promise<void> => {
  // 标题与内容
  if (typeof route.query.title !== 'undefined') {
    stateTitle.value = String(route.query.title ?? '').trim();
  }
  if (typeof route.query.content !== 'undefined') {
    stateContent.value = String(route.query.content ?? '').trim();
  }

  // isAnd（1=true，0=false）
  if (typeof route.query.is_and !== 'undefined') {
    stateIsAnd.value = String(route.query.is_and) === '1';
  }

  stateEnabled.value = readEnabledStateFromRoute();

  // 选择项：根据 ID 设置默认值（使用缓存或当前选择补全 label）
  const dynasty_ids = getQueryIds('dynasty_ids');
  /**
   * 常量：author_ids。
   */
  const author_ids = getQueryIds('author_ids');

  stateSelectedDynasties.value = mapIdsToSelected(dynasty_ids, stateSelectedDynasties.value, stateCacheDynastyLabelMap.value);
  stateSelectedAuthor.value = mapIdsToSelected(author_ids, stateSelectedAuthor.value, stateCacheAuthorLabelMap.value);

  await Promise.all([hydrateSelectedDynastiesByIds(dynasty_ids), hydrateSelectedAuthorsByIds(author_ids)]);
};

/**
 * 函数：作者页——从路由查询参数应用默认值（authorId）
 */
const applyAuthorsDefaultsFromRoute = async (): Promise<void> => {
  /**
   * 常量：ids。
   */
  const ids = getQueryIds('author_ids');

  stateSelectedAuthor.value = mapIdsToSelected(ids, stateSelectedAuthor.value, stateCacheAuthorLabelMap.value);
  await hydrateSelectedAuthorsByIds(ids);
};

/**
 * 函数：朝代页——从路由查询参数应用默认值（dynastyId）
 */
const applyDynastiesDefaultsFromRoute = async (): Promise<void> => {
  /**
   * 常量：ids。
   */
  const ids = getQueryIds('dynasty_ids');

  stateSelectedDynasties.value = mapIdsToSelected(ids, stateSelectedDynasties.value, stateCacheDynastyLabelMap.value);
  await hydrateSelectedDynastiesByIds(ids);
};

/**
 * 函数：按 ID 回填作者选择项标签。
 * @param {number[]} ids 作者 ID 列表
 * @returns {Promise<void>} 回填完成
 */
const hydrateSelectedAuthorsByIds = async (ids: number[]): Promise<void> => {
  /**
   * 常量：missingIds。
   */
  const missingIds = ids.filter((id) => !stateCacheAuthorLabelMap.value.has(id));

  if (missingIds.length === 0) {
    stateSelectedAuthor.value = mapIdsToSelected(ids, stateSelectedAuthor.value, stateCacheAuthorLabelMap.value);
    return;
  }

  await refreshAuthorSummary({ datas: buildHydrateQueryDatas('author_ids', missingIds), replace: true });

  /**
   * 常量：rows。
   */
  const rows = stateAuthorSummaryData.value?.rows ?? [];
  rows.forEach((row) => {
    stateCacheAuthorLabelMap.value.set(row.id, { label: row.name, count: row.count });
  });

  stateSelectedAuthor.value = mapIdsToSelected(ids, stateSelectedAuthor.value, stateCacheAuthorLabelMap.value);
};

/**
 * 函数：按 ID 回填朝代选择项标签。
 * @param {number[]} ids 朝代 ID 列表
 * @returns {Promise<void>} 回填完成
 */
const hydrateSelectedDynastiesByIds = async (ids: number[]): Promise<void> => {
  /**
   * 常量：missingIds。
   */
  const missingIds = ids.filter((id) => !stateCacheDynastyLabelMap.value.has(id));

  if (missingIds.length === 0) {
    stateSelectedDynasties.value = mapIdsToSelected(ids, stateSelectedDynasties.value, stateCacheDynastyLabelMap.value);
    return;
  }

  await refreshDynastySummary({ datas: buildHydrateQueryDatas('dynasty_ids', missingIds), replace: true });

  /**
   * 常量：rows。
   */
  const rows = stateDynastySummaryData.value?.rows ?? [];
  rows.forEach((row) => {
    stateCacheDynastyLabelMap.value.set(row.id, { label: row.name, count: row.count });
  });

  stateSelectedDynasties.value = mapIdsToSelected(ids, stateSelectedDynasties.value, stateCacheDynastyLabelMap.value);
};

/**
 * 监听：朝代联想数据变化
 */
watch(stateDynastyData, (val) => {
  /**
   * 常量：rows。
   */
  const rows = val?.rows ?? [];
  /**
   * 常量：newItems。
   */
  const newItems = rows.map((r) => ({ label: r.name, value: r.id, count: r.count }));
  setOriginDynasties(newItems);
  stateLoadingDynasties.value = false;
  // 缓存：ID→label/count
  rows.forEach((r) => {
    stateCacheDynastyLabelMap.value.set(r.id, { label: r.name, count: r.count });
  });
  /**
   * 同步：用返回数据补全已选项标签
   */
  stateSelectedDynasties.value = stateSelectedDynasties.value.map((s) => {
    /**
     * 常量：hit。
     */
    const hit = rows.find((r) => r.id === s.value);
    return hit ? { label: hit.name, value: hit.id, count: hit.count } : s;
  });
});

/**
 * 监听：作者联想数据变化
 */
watch(stateAuthorData, (val) => {
  /**
   * 常量：rows。
   */
  const rows = val?.rows ?? [];
  /**
   * 常量：newItems。
   */
  const newItems = rows.map((r) => ({ label: r.name, value: r.id, count: r.count }));
  setOriginAuthors(newItems);
  stateLoadingAuthors.value = false;
  // 缓存：ID→label/count
  rows.forEach((r) => {
    stateCacheAuthorLabelMap.value.set(r.id, { label: r.name, count: r.count });
  });
  /**
   * 同步：用返回数据补全已选项标签
   */
  stateSelectedAuthor.value = stateSelectedAuthor.value.map((s) => {
    /**
     * 常量：hit。
     */
    const hit = rows.find((r) => r.id === s.value);
    return hit ? { label: hit.name, value: hit.id, count: hit.count } : s;
  });
});

/**
 * 监听：朝代关键词变化触发联想请求
 */
watch(stateKeywordDynasty, () => {
  stateLoadingDynasties.value = true;
  refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
});

/**
 * 监听：作者关键词变化触发联想请求
 */
watch(stateKeywordAuthor, () => {
  stateLoadingAuthors.value = true;
  refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
});

/**
 * 监听：作者页搜索类型切换时互斥清空另一侧选择与关键词
 */
watch(statePageAuthorSearchType, (val) => {
  if (val === 'author') {
    stateSelectedDynasties.value = [];
    stateKeywordDynasty.value = '';
  } else {
    stateSelectedAuthor.value = [];
    stateKeywordAuthor.value = '';
  }
});

/**
 * 监听：路由变化时根据当前路由加载默认联想数据
 */
watch(
  () => route.path,
  () => {
    void requestDefaultsForCurrentRoute();
  }
);

/**
 * 监听：路由查询变化时应用默认值（含初始化）
 */
watch(
  () => route.query,
  async () => {
    // 列表页：仅在模态打开时应用默认值
    if (routeIsList) {
      if (stateOpen.value) {
        await applyListDefaultsFromRoute();
        // 刷新联想数据以便补全选择项标签
        refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
        refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
      }
      return;
    }

    // 其他页面：根据当前页类型同步各自参数
    if (routeIsAuthors) {
      if (statePageAuthorSearchType.value === 'author') {
        await applyAuthorsDefaultsFromRoute();
      } else {
        await applyDynastiesDefaultsFromRoute();
      }
      // 刷新联想数据以便补全选择项标签
      refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
      refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
      return;
    }
    if (routeIsDynasties) {
      await applyDynastiesDefaultsFromRoute();
      refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
      return;
    }
  }
);

/**
 * 监听：搜索面板打开时，初始化默认值与联想数据。
 */
watch(stateOpen, async (isOpen) => {
  if (!isOpen || !routeIsList) {
    return;
  }

  await applyListDefaultsFromRoute();
  stateLoadingDynasties.value = true;
  stateLoadingAuthors.value = true;
  refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
  refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
});

/**
 * 函数：同步搜索面板视口模式。
 */
const syncSearchPanelViewportMode = (): void => {
  if (!import.meta.client) {
    stateSearchPanelMobile.value = false;
    return;
  }

  stateSearchPanelMobile.value = window.innerWidth < 768;
};

/**
 * 事件：根据当前路由快捷聚焦对应控件
 */
const triggerQuickFocus = () => {
  if (routeIsAuthors) {
    if (statePageAuthorSearchType.value === 'author') {
      stateRefAuthorMenu.value?.triggerRef.click();
    } else {
      stateRefDynastyMenu.value?.triggerRef.click();
    }
  }

  if (routeIsDynasties) {
    stateRefDynastyMenu.value?.triggerRef.click();
  }
};

/**
 * 函数：根据当前路由初始化默认联想数据
 */
const requestDefaultsForCurrentRoute = async (): Promise<void> => {
  if (routeIsAuthors) {
    stateLoadingAuthors.value = true;
    stateLoadingDynasties.value = true;
    refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
    refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
    return;
  }

  if (routeIsDynasties) {
    stateLoadingDynasties.value = true;
    refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
    return;
  }
};

/**
 * 函数：根据当前输入更新路由查询参数（并重置分页）
 */
const updateRouteQueryForSearch = (): void => {
  const query: Record<string, string | string[]> = {};

  // 不同页面仅提交对应的查询参数
  if (routeIsList) {
    // 标题
    if (stateTitle.value.trim()) {
      query.title = stateTitle.value.trim();
    }

    // 内容
    if (stateContent.value.trim()) {
      query.content = stateContent.value.trim();
    }

    // 朝代
    if (stateSelectedDynasties.value.length > 0) {
      query.dynasty_ids = stateSelectedDynasties.value.map((i) => String(i.value));
    }

    // 作者
    if (stateSelectedAuthor.value.length > 0) {
      query.author_ids = stateSelectedAuthor.value.map((i) => String(i.value));
    }

    // 匹配方式
    if (stateIsAnd.value) {
      query.is_and = '1';
    }

    if (stateEnabled.value !== 'all') {
      query.enabled = stateEnabled.value === 'enabled' ? '1' : '0';
    }
  } else if (routeIsAuthors) {
    // 作者页：互斥提交 author_ids 或 dynasty_ids
    if (statePageAuthorSearchType.value === 'author' && stateSelectedAuthor.value.length > 0) {
      query.author_ids = stateSelectedAuthor.value.map((i) => String(i.value));
    } else if (statePageAuthorSearchType.value === 'dynasty' && stateSelectedDynasties.value.length > 0) {
      query.dynasty_ids = stateSelectedDynasties.value.map((i) => String(i.value));
    }
  } else if (routeIsDynasties) {
    // 朝代页：仅 dynasty_ids
    if (stateSelectedDynasties.value.length > 0) {
      query.dynasty_ids = stateSelectedDynasties.value.map((i) => String(i.value));
    }
  }

  // 保留：每页数量
  if (route.query.pagesize) {
    query.pagesize = route.query.pagesize as string;
  }

  navigateTo({
    path: route.path,
    query: {
      ...query,
      page: '1'
    }
  });
};

/**
 * 事件：重置搜索条件
 */
const handleReset = (): void => {
  stateTitle.value = '';
  stateContent.value = '';
  stateSelectedDynasties.value = [];
  stateSelectedAuthor.value = [];
  stateKeywordDynasty.value = '';
  stateKeywordAuthor.value = '';
  stateIsAnd.value = false;
  stateEnabled.value = 'all';

  // 自动触发搜索
  handleSearch();

  // 自动关闭 modal
  stateOpen.value = false;
};

/**
 * 事件：发起搜索（列表页成功后关闭模态）
 */
const handleSearch = (): void => {
  // 更新路由查询参数（并重置分页）
  updateRouteQueryForSearch();

  stateOpen.value = false;
};

/**
 * 生命周期：初始化时加载默认联想数据，并在非列表页应用默认值
 */
onMounted(() => {
  syncSearchPanelViewportMode();

  if (import.meta.client) {
    window.addEventListener('resize', syncSearchPanelViewportMode);
  }

  // 加载默认联想数据
  requestDefaultsForCurrentRoute();

  // 非列表页：初始化应用默认值
  if (!routeIsList) {
    if (routeIsAuthors) {
      applyAuthorsDefaultsFromRoute();
      return;
    }
    if (routeIsDynasties) {
      applyDynastiesDefaultsFromRoute();
      return;
    }
  }
});

/**
 * 生命周期：卸载时清理视口监听。
 */
onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', syncSearchPanelViewportMode);
  }
});

/**
 * 快捷键
 */
defineShortcuts({
  /**
   * 列表页打开模态，其他页聚焦对应控件
   */
  '/': () => {
    if (!storeAuth.states.ui.show) {
      if (routeIsList) {
        stateOpen.value = true;
      } else {
        triggerQuickFocus();
      }
    }
  },
  /**
   * Enter 发起搜索
   */
  enter: () => {
    if (stateOpen.value) {
      handleSearch();
    }
  }
});
</script>
