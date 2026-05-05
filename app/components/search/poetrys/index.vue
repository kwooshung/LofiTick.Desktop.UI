<template>
  <template v-if="routeIsList">
    <UModal v-model:open="stateOpen" :title="t('components.poetrys.search.header.title')" :dismissible="false" :ui="{ body: 'flex flex-col', footer: 'justify-between' }" @update:open="handleUpdateOpen">
      <UButton icon="i-lucide-search" :label="computedHasSearchConditions ? t('components.poetrys.search.header.conditions') : t('components.poetrys.search.header.startLabel')" color="neutral" variant="subtle" class="w-60" :ui="{ leadingIcon: 'text-muted' }">
        <template #trailing>
          <UKbd value="/" class="ms-auto" />
        </template>
      </UButton>
      <template #body>
        <UInput v-model="stateTitle" icon="i-mdi:format-title" variant="outline" :placeholder="t('components.poetrys.search.body.title.placeholder')" autofocus clear class="mb-4">
          <template v-if="stateTitle.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateTitle = ''" />
          </template>
        </UInput>
        <UInput v-model="stateContent" icon="i-material-symbols:text-snippet-outline" variant="outline" :placeholder="t('components.poetrys.search.body.content.placeholder')" clear class="mb-4">
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
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
          class="mb-4"
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
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
          class="mb-4"
        >
          <template #item-trailing="{ item }">
            <span class="text-muted">{{ item?.count }}</span>
          </template>
        </USelectMenu>
      </template>
      <template #footer>
        <USwitch v-model="stateIsAnd" :label="stateIsAnd ? t('components.poetrys.search.footer.match.all') : t('components.poetrys.search.footer.match.any')" />
        <div class="flex gap-2">
          <UButton color="neutral" variant="outline" @click="handleReset">{{ t('components.poetrys.search.buttons.reset') }}</UButton>
          <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.poetrys.search.buttons.search') }}</UButton>
        </div>
      </template>
    </UModal>
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
  <template v-else-if="props.routeIsDynasties">
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
import type {
  IQueryResultPoetryAuthorsBasicRow,
  IQueryResultPoetryAuthorsSummaryPage,
  IQueryResultPoetryDynastiesBasicRow,
  IQueryResultPoetryDynastiesSummaryPage,
  IQueryResultPoetrySearchAuthorsResponse,
  IQueryResultPoetrySearchDynastiesResponse
} from '@@/shared/types/pages/poetrys/index.types';

/**
 * 属性：路由状态（由主页面传入）
 */
const props = defineProps<IComponentPropsPoetrysSearch>();

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
const refAuthorMenu = useTemplateRef('refAuthorMenu');

/**
 * 引用：选择菜单，朝代
 */
const refDynastyMenu = useTemplateRef('refDynastyMenu');

/**
 * 状态：模态框开关
 */
const stateOpen = ref(false);

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
  const q = route.query;

  const hasText = (typeof q.title !== 'undefined' && String(q.title ?? '').trim().length > 0) || (typeof q.content !== 'undefined' && String(q.content ?? '').trim().length > 0);

  return hasText || hasQueryParamIds('dynasty_ids') || hasQueryParamIds('author_ids');
});

/**
 * 计算属性：作者页搜索类型选项
 */
const computedPageAuthorSearchTypeItems = computed<SelectItem[]>(() => [
  { id: 'author', label: t('components.poetrys.search.selects.author') },
  { id: 'dynasty', label: t('components.poetrys.search.selects.dynasty') }
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
 * 函数：查询数组参数
 * @param {('dynasty_ids' | 'author_ids')} key 参数键名
 * @return {boolean} 是否存在有效参数
 */
const hasQueryParamIds = (key: 'dynasty_ids' | 'author_ids'): boolean => {
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
  const v = route.query[key];
  const arr = v ? (Array.isArray(v) ? v : [v]) : [];
  return arr.map((s) => parseInt(String(s), 10)).filter((n) => Number.isFinite(n) && n > 0);
};

/**
 * 辅助：将 ID 映射为选择项，优先使用当前选择或缓存中的 label
 */
const mapIdsToSelected = (ids: number[], current: IComponentPropsPoetrysSelectMenuItem[], cache: Map<number, { label: string; count: number }>): IComponentPropsPoetrysSelectMenuItem[] => {
  return ids.map((id) => {
    const hitSel = current.find((s) => s.value === id);
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

  // 选择项：根据 ID 设置默认值（使用缓存或当前选择补全 label）
  const dynasty_ids = getQueryIds('dynasty_ids');
  const author_ids = getQueryIds('author_ids');

  stateSelectedDynasties.value = mapIdsToSelected(dynasty_ids, stateSelectedDynasties.value, stateCacheDynastyLabelMap.value);
  stateSelectedAuthor.value = mapIdsToSelected(author_ids, stateSelectedAuthor.value, stateCacheAuthorLabelMap.value);

  await Promise.all([hydrateSelectedDynastiesByIds(dynasty_ids), hydrateSelectedAuthorsByIds(author_ids)]);
};

/**
 * 函数：作者页——从路由查询参数应用默认值（authorId）
 */
const applyAuthorsDefaultsFromRoute = async (): Promise<void> => {
  const ids = getQueryIds('author_ids');

  stateSelectedAuthor.value = mapIdsToSelected(ids, stateSelectedAuthor.value, stateCacheAuthorLabelMap.value);
  await hydrateSelectedAuthorsByIds(ids);
};

/**
 * 函数：朝代页——从路由查询参数应用默认值（dynastyId）
 */
const applyDynastiesDefaultsFromRoute = async (): Promise<void> => {
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
  const missingIds = ids.filter((id) => !stateCacheAuthorLabelMap.value.has(id));

  if (missingIds.length === 0) {
    stateSelectedAuthor.value = mapIdsToSelected(ids, stateSelectedAuthor.value, stateCacheAuthorLabelMap.value);
    return;
  }

  await refreshAuthorSummary({ datas: buildHydrateQueryDatas('author_ids', missingIds), replace: true });

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
  const missingIds = ids.filter((id) => !stateCacheDynastyLabelMap.value.has(id));

  if (missingIds.length === 0) {
    stateSelectedDynasties.value = mapIdsToSelected(ids, stateSelectedDynasties.value, stateCacheDynastyLabelMap.value);
    return;
  }

  await refreshDynastySummary({ datas: buildHydrateQueryDatas('dynasty_ids', missingIds), replace: true });

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
  const rows = val?.rows ?? [];
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
    const hit = rows.find((r) => r.id === s.value);
    return hit ? { label: hit.name, value: hit.id, count: hit.count } : s;
  });
});

/**
 * 监听：作者联想数据变化
 */
watch(stateAuthorData, (val) => {
  const rows = val?.rows ?? [];
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
    if (props.routeIsList) {
      if (stateOpen.value) {
        await applyListDefaultsFromRoute();
        // 刷新联想数据以便补全选择项标签
        refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
        refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
      }
      return;
    }

    // 其他页面：根据当前页类型同步各自参数
    if (props.routeIsAuthors) {
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
    if (props.routeIsDynasties) {
      await applyDynastiesDefaultsFromRoute();
      refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
      return;
    }
  }
);

/**
 * 事件：模态框打开后，加载默认联想数据
 * @param {boolean} isOpen 模态框是否打开
 */
const handleUpdateOpen = async (isOpen: boolean) => {
  if (isOpen) {
    /**
     * 列表页：仅在模态打开时读取路由默认值
     */
    if (props.routeIsList) {
      await applyListDefaultsFromRoute();
    }
    stateLoadingDynasties.value = true;
    stateLoadingAuthors.value = true;
    refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
    refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
  }
};

/**
 * 事件：根据当前路由快捷聚焦对应控件
 */
const triggerQuickFocus = () => {
  if (props.routeIsAuthors) {
    if (statePageAuthorSearchType.value === 'author') {
      refAuthorMenu.value?.triggerRef.click();
    } else {
      refDynastyMenu.value?.triggerRef.click();
    }
  }

  if (props.routeIsDynasties) {
    refDynastyMenu.value?.triggerRef.click();
  }
};

/**
 * 函数：根据当前路由初始化默认联想数据
 */
const requestDefaultsForCurrentRoute = async (): Promise<void> => {
  if (props.routeIsAuthors) {
    stateLoadingAuthors.value = true;
    stateLoadingDynasties.value = true;
    refreshDebouncedAuthor({ datas: buildSuggestionDatas(stateKeywordAuthor.value) });
    refreshDebouncedDynasty({ datas: buildSuggestionDatas(stateKeywordDynasty.value) });
    return;
  }

  if (props.routeIsDynasties) {
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
  if (props.routeIsList) {
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
  } else if (props.routeIsAuthors) {
    // 作者页：互斥提交 author_ids 或 dynasty_ids
    if (statePageAuthorSearchType.value === 'author' && stateSelectedAuthor.value.length > 0) {
      query.author_ids = stateSelectedAuthor.value.map((i) => String(i.value));
    } else if (statePageAuthorSearchType.value === 'dynasty' && stateSelectedDynasties.value.length > 0) {
      query.dynasty_ids = stateSelectedDynasties.value.map((i) => String(i.value));
    }
  } else if (props.routeIsDynasties) {
    // 朝代页：仅 dynasty_ids
    if (stateSelectedDynasties.value.length > 0) {
      query.dynasty_ids = stateSelectedDynasties.value.map((i) => String(i.value));
    }
  }

  // 保留：每页数量
  if (route.query.pagesize) {
    query.pagesize = route.query.pagesize as string;
  }

  // 保留：启用状态
  if (typeof route.query.enabled !== 'undefined') {
    query.enabled = route.query.enabled as string;
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
  // 加载默认联想数据
  requestDefaultsForCurrentRoute();

  // 非列表页：初始化应用默认值
  if (!props.routeIsList) {
    if (props.routeIsAuthors) {
      applyAuthorsDefaultsFromRoute();
      return;
    }
    if (props.routeIsDynasties) {
      applyDynastiesDefaultsFromRoute();
      return;
    }
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
      if (props.routeIsList) {
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
