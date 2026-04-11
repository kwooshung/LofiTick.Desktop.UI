<template>
  <template v-if="routeIsList">
    <UModal v-model:open="stateOpen" :title="t('components.quotes.search.header.title')" :dismissible="false" :ui="{ body: 'flex flex-col', footer: 'justify-between' }" @update:open="handleUpdateOpen">
      <UButton icon="i-lucide-search" :label="computedHasSearchConditions ? t('components.quotes.search.header.conditions') : t('components.quotes.search.header.startLabel')" color="neutral" variant="subtle" class="w-60" :ui="{ leadingIcon: 'text-muted' }">
        <template #trailing>
          <UKbd value="/" class="ms-auto" />
        </template>
      </UButton>
      <template #body>
        <USelectMenu
          v-model="stateSelectedUuid"
          v-model:search-term="stateKeywordUuid"
          icon="i-material-symbols:flag-outline-rounded"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.quotes.search.body.uuid.placeholder')"
          :items="stateItemsUuid"
          :loading="stateLoadingUuids"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
          class="mb-4"
        />
        <UFieldGroup class="mb-4">
          <USelect v-model="stateQuoteSearchType" value-key="id" :items="computedPageQuoteSearchTypeItems" />
          <UInput v-if="stateQuoteSearchType === 'content'" v-model="stateContent" icon="i-material-symbols:text-snippet-outline" variant="outline" class="w-full" :placeholder="t('components.quotes.search.body.content.placeholder')" clear>
            <template v-if="stateContent.length" #trailing>
              <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateContent = ''" />
            </template>
          </UInput>
          <UInput v-else v-model="stateTranslate" icon="i-material-symbols:g-translate" variant="outline" class="w-full" :placeholder="t('components.quotes.search.body.translate.placeholder')" clear>
            <template v-if="stateTranslate.length" #trailing>
              <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateTranslate = ''" />
            </template>
          </UInput>
        </UFieldGroup>
        <USelectMenu
          v-model="stateSelectedTypes"
          v-model:search-term="stateKeywordType"
          icon="i-material-symbols:category-outline-rounded"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.quotes.search.body.type.placeholder')"
          :items="stateItemsTypes"
          :loading="stateLoadingTypes"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
          class="mb-4"
        />
        <USelectMenu
          v-model="stateSourcesSelected"
          v-model:search-term="stateKeywordSource"
          icon="i-material-symbols:book-3-outline-rounded"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.quotes.search.body.source.placeholder')"
          :items="stateItemsSources"
          :loading="stateLoadingSources"
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
          v-model="stateAuthorsSelected"
          v-model:search-term="stateKeywordAuthor"
          icon="i-lucide-user"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.quotes.search.body.author.placeholder')"
          :items="stateItemsAuthor"
          :loading="stateLoadingAuthor"
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
        <USwitch v-model="stateIsAnd" :label="stateIsAnd ? t('components.quotes.search.footer.match.all') : t('components.quotes.search.footer.match.any')" />
        <div class="flex gap-2">
          <UButton color="neutral" variant="outline" @click="handleReset">{{ t('components.quotes.search.buttons.reset') }}</UButton>
          <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.quotes.search.buttons.search') }}</UButton>
        </div>
      </template>
    </UModal>
  </template>
  <template v-else-if="routeIsAuthors">
    <div class="flex items-center gap-2">
      <UFieldGroup>
        <USelectMenu
          ref="refAuthorMenu"
          v-model="stateAuthorsSelected"
          v-model:search-term="stateKeywordAuthor"
          icon="i-lucide-user"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.quotes.search.body.author.placeholder')"
          :items="stateItemsAuthor"
          :loading="stateLoadingAuthor"
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
        <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.quotes.search.buttons.search') }}</UButton>
      </UFieldGroup>
    </div>
  </template>
  <template v-else-if="props.routeIsSources">
    <div class="flex items-center gap-2">
      <UFieldGroup>
        <USelectMenu
          ref="refSourceMenu"
          v-model="stateSourcesSelected"
          v-model:search-term="stateKeywordSource"
          icon="i-material-symbols:book-3-outline-rounded"
          multiple
          ignore-filter
          clear
          :placeholder="t('components.quotes.search.body.source.placeholder')"
          :items="stateItemsSources"
          :loading="stateLoadingSources"
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
        <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.quotes.search.buttons.search') }}</UButton>
      </UFieldGroup>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

import type { IComponentPropsQuotesSearch, IComponentPropsQuotesSelectMenuItem, IComponentPropsQuotesUuidSelectMenuItem } from '@/components/search/quotes/index.types';
import type { IQueryResultQuoteAuthorsBasicRow, IQueryResultQuoteSourcesBasicRow, IQueryResultQuotesSearchUuid } from '@@/shared/types/pages/quotes/index.types';

/**
 * 属性：路由状态（由主页面传入）
 */
const props = defineProps<IComponentPropsQuotesSearch>();

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
 * 引用：选择菜单，出处
 */
const refSourceMenu = useTemplateRef('refSourceMenu');

/**
 * 状态：模态框开关
 */
const stateOpen = ref(false);

/**
 * 状态：UUID
 */
const stateUuid = ref('');

/**
 * 状态：内容关键词
 */
const stateContent = ref('');

/**
 * 状态：翻译关键词
 */
const stateTranslate = ref('');

/**
 * 状态：列表页内容/译文搜索类型
 */
const stateQuoteSearchType = ref<'content' | 'translate'>('content');

/**
 * 状态：已选Uuid
 */
const stateSelectedUuid = ref<IComponentPropsQuotesUuidSelectMenuItem[]>([]);

/**
 * 状态：已选类型
 */
const stateSelectedTypes = ref<IComponentPropsQuotesSelectMenuItem[]>([]);

/**
 * 状态：已选出处
 */
const stateSourcesSelected = ref<IComponentPropsQuotesSelectMenuItem[]>([]);

/**
 * 状态：已选作者
 */
const stateAuthorsSelected = ref<IComponentPropsQuotesSelectMenuItem[]>([]);

/**
 * 状态：Uuid联想关键词
 */
const stateKeywordUuid = ref('');

/**
 * 状态：类型联想关键词
 */
const stateKeywordType = ref('');

/**
 * 状态：出处联想关键词
 */
const stateKeywordSource = ref('');

/**
 * 状态：作者联想关键词
 */
const stateKeywordAuthor = ref('');

/**
 * 状态：匹配方式（true=全部满足，false=任意满足）
 */
const stateIsAnd = ref(false);

/**
 * 状态：加载Uuid联想
 */
const stateLoadingUuids = ref(false);

/**
 * 状态：加载类型联想
 */
const stateLoadingTypes = ref(false);

/**
 * 状态：加载出处联想
 */
const stateLoadingSources = ref(false);

/**
 * 状态：加载作者联想
 */
const stateLoadingAuthor = ref(false);

/**
 * 状态：缓存 > Uuid映射
 */
const stateCacheUuidLabelMap = ref(new Map<number, { label: string; value: number }>());

/**
 * 状态：缓存 > 类型映射
 */
const stateCacheTypeLabelMap = ref(new Map<number, { label: string; count: number }>());

/**
 * 状态：缓存 > 出处映射
 */
const stateCacheSourceLabelMap = ref(new Map<number, { label: string; count: number }>());

/**
 * 状态：缓存 > 作者映射
 */
const stateCacheAuthorLabelMap = ref(new Map<number, { label: string; count: number }>());

/**
 * 计算属性：是否设置了搜索条件
 */
const computedHasSearchConditions = computed(() => {
  const q = route.query;

  const hasText = (typeof q.uuid !== 'undefined' && String(q.uuid ?? '').trim().length > 0) || (typeof q.content !== 'undefined' && String(q.content ?? '').trim().length > 0) || (typeof q.translate !== 'undefined' && String(q.translate ?? '').trim().length > 0);

  return hasText || hasQueryParamIds('type_ids') || hasQueryParamIds('source_ids') || hasQueryParamIds('author_ids');
});

/**
 * 计算属性：列表页搜索类型选项
 */
const computedPageQuoteSearchTypeItems = computed<SelectItem[]>(() => [
  { id: 'content', label: t('components.quotes.search.selects.content') },
  { id: 'translate', label: t('components.quotes.search.selects.translate') }
]);

/**
 * Hook：类型，限制选择数量
 */
const { items: stateItemsTypes, setOriginItems: setTypesOrigin } = useSelectMenuLimited(stateSelectedTypes, 5);

/**
 * Hook：UUID，限制选择数量
 */
const { items: stateItemsUuid, setOriginItems: setUuidOrigin } = useSelectMenuLimited(stateSelectedUuid, 5);

/**
 * Hook：出处，限制选择数量
 */
const { items: stateItemsSources, setOriginItems: setSourcesOrigin } = useSelectMenuLimited(stateSourcesSelected, 5);

/**
 * Hook：作者，限制选择数量
 */
const { items: stateItemsAuthor, setOriginItems: setAuthorOrigin } = useSelectMenuLimited(stateAuthorsSelected, 5);

/**
 * API：搜索 UUID
 */
const { datas: stateUuidData, refreshDebounced: refreshUuidDebounced } = await useApi<IQueryResultQuotesSearchUuid[]>('quotes/searchs/uuid', {
  datas: { q: stateKeywordUuid.value, limit: 10 }
});

/**
 * API：搜索出处
 */
const { datas: stateSourcesData, refreshDebounced: refreshSourcesDebounced } = await useApi<{ rows: IQueryResultQuoteSourcesBasicRow[] }>('quotes/searchs/sources', {
  datas: { q: stateKeywordSource.value, limit: 10 }
});

/**
 * API：搜索作者
 */
const { datas: stateAuthorData, refreshDebounced: refreshAuthorDebounced } = await useApi<{ rows: IQueryResultQuoteAuthorsBasicRow[] }>('quotes/searchs/authors', {
  datas: { q: stateKeywordAuthor.value, limit: 10 }
});

/**
 * 函数：查询数组参数
 * @param {('type_ids' | 'source_ids' | 'author_ids')} key 参数键名
 * @return {boolean} 是否存在有效参数
 */
const hasQueryParamIds = (key: 'type_ids' | 'source_ids' | 'author_ids'): boolean => {
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
const getQueryIds = (key: 'type_ids' | 'source_ids' | 'author_ids'): number[] => {
  const v = route.query[key];
  const arr = v ? (Array.isArray(v) ? v : [v]) : [];
  return arr.map((s) => parseInt(String(s), 10)).filter((n) => Number.isFinite(n) && n > 0);
};

/**
 * 辅助：将 ID 映射为选择项，优先使用当前选择或缓存中的 label
 */
const mapIdsToSelected = (ids: number[], current: IComponentPropsQuotesSelectMenuItem[], cache: Map<number, { label: string; count: number }>): IComponentPropsQuotesSelectMenuItem[] => {
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
const applyListDefaultsFromRoute = (): void => {
  const q = route.query;

  // UUID
  if (typeof q.uuid !== 'undefined') {
    stateUuid.value = String(q.uuid ?? '').trim();
    stateKeywordUuid.value = stateUuid.value;
  } else {
    stateUuid.value = '';
    stateKeywordUuid.value = '';
  }

  // 内容
  if (typeof q.content !== 'undefined') {
    stateContent.value = String(q.content ?? '').trim();
  } else {
    stateContent.value = '';
  }

  // 翻译
  if (typeof q.translate !== 'undefined') {
    stateTranslate.value = String(q.translate ?? '').trim();
  } else {
    stateTranslate.value = '';
  }

  // 根据路由中是否存在 translate/content 决定当前搜索类型（互斥）
  const hasContent = typeof q.content !== 'undefined' && String(q.content ?? '').trim().length > 0;
  const hasTranslate = typeof q.translate !== 'undefined' && String(q.translate ?? '').trim().length > 0;
  if (hasTranslate && !hasContent) {
    stateQuoteSearchType.value = 'translate';
  } else if (hasContent && !hasTranslate) {
    stateQuoteSearchType.value = 'content';
  }

  // isAnd（1=true，0=false）
  if (typeof q.is_and !== 'undefined') {
    stateIsAnd.value = String(q.is_and) === '1';
  }

  // 选择项：根据 ID 设置默认值（使用缓存或当前选择补全 label）
  const typeIds = getQueryIds('type_ids');
  const sourceIds = getQueryIds('source_ids');
  const authorIds = getQueryIds('author_ids');

  stateSelectedTypes.value = mapIdsToSelected(typeIds, stateSelectedTypes.value, stateCacheTypeLabelMap.value);
  stateSourcesSelected.value = mapIdsToSelected(sourceIds, stateSourcesSelected.value, stateCacheSourceLabelMap.value);
  stateAuthorsSelected.value = mapIdsToSelected(authorIds, stateAuthorsSelected.value, stateCacheAuthorLabelMap.value);
};

/**
 * 函数：作者页——从路由查询参数应用默认值（authorId）
 */
const applyAuthorsDefaultsFromRoute = (): void => {
  const v = route.query.author_ids;
  const arr = v ? (Array.isArray(v) ? v : [v]) : [];
  const ids = arr.map((s) => parseInt(String(s), 10)).filter((n) => Number.isFinite(n) && n > 0);
  const current = stateAuthorsSelected.value;
  stateAuthorsSelected.value = ids.map((id) => {
    const hitSel = current.find((s) => s.value === id);
    const hitCache = stateCacheAuthorLabelMap.value.get(id);
    return {
      label: hitSel?.label ?? hitCache?.label ?? String(id),
      value: id,
      count: hitSel?.count ?? hitCache?.count ?? 0
    };
  });
};

/**
 * 函数：出处页——从路由查询参数应用默认值（sourceId）
 */
const applySourcesDefaultsFromRoute = (): void => {
  const v = route.query.source_ids;
  const arr = v ? (Array.isArray(v) ? v : [v]) : [];
  const ids = arr.map((s) => parseInt(String(s), 10)).filter((n) => Number.isFinite(n) && n > 0);
  const current = stateSourcesSelected.value;
  stateSourcesSelected.value = ids.map((id) => {
    const hitSel = current.find((s) => s.value === id);
    const hitCache = stateCacheSourceLabelMap.value.get(id);
    return {
      label: hitSel?.label ?? hitCache?.label ?? String(id),
      value: id,
      count: hitSel?.count ?? hitCache?.count ?? 0
    };
  });
};

/**
 * 监听：Uuid联想数据变化
 */
watch(stateUuidData, (val) => {
  const rows = val ?? [];
  const newItems = rows.map((r) => ({ label: r.uuid, value: r.id }));
  setUuidOrigin(newItems);
  stateLoadingUuids.value = false;
  // 缓存：ID→label/count
  rows.forEach((r) => {
    stateCacheUuidLabelMap.value.set(r.id, { label: r.uuid, value: r.id });
  });
  /**
   * 同步：用返回数据补全已选项标签
   */
  stateSelectedUuid.value = stateSelectedUuid.value.map((s) => {
    const hit = rows.find((r) => r.id === s.value);
    return hit ? { label: hit.uuid, value: hit.id } : s;
  });

  /**
   * 若路由中已带 uuid 且当前未选中任何项，则自动选中对应项
   */
  const routeUuid = typeof route.query.uuid !== 'undefined' ? String(route.query.uuid ?? '').trim() : '';
  if (routeUuid && stateSelectedUuid.value.length === 0) {
    const hit = rows.find((r) => r.uuid === routeUuid);
    if (hit) {
      stateSelectedUuid.value = [{ label: hit.uuid, value: hit.id }];
    }
  }
});

/**
 * 监听：出处联想数据变化
 */
watch(stateSourcesData, (val) => {
  const rows = val?.rows ?? [];
  const newItems = rows.map((r) => ({ label: r.name, value: r.id, count: r.count }));
  setSourcesOrigin(newItems);
  stateLoadingSources.value = false;
  rows.forEach((r) => {
    stateCacheSourceLabelMap.value.set(r.id, { label: r.name, count: r.count });
  });
  /**
   * 同步：用返回数据补全已选项标签
   */
  stateSourcesSelected.value = stateSourcesSelected.value.map((s) => {
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
  setAuthorOrigin(newItems);
  stateLoadingAuthor.value = false;
  // 缓存：ID→label/count
  rows.forEach((r) => {
    stateCacheAuthorLabelMap.value.set(r.id, { label: r.name, count: r.count });
  });
  /**
   * 同步：用返回数据补全已选项标签
   */
  stateAuthorsSelected.value = stateAuthorsSelected.value.map((s) => {
    const hit = rows.find((r) => r.id === s.value);
    return hit ? { label: hit.name, value: hit.id, count: hit.count } : s;
  });
});

/**
 * 监听：Uuid关键词变化触发联想请求
 */
watch(stateKeywordUuid, () => {
  stateUuid.value = stateKeywordUuid.value.trim();
  stateLoadingUuids.value = true;
  refreshUuidDebounced({ datas: { q: stateKeywordUuid.value } });
});

/**
 * 监听：出处关键词变化触发联想请求
 */
watch(stateKeywordSource, () => {
  stateLoadingSources.value = true;
  refreshSourcesDebounced({ datas: { q: stateKeywordSource.value } });
});

/**
 * 监听：作者关键词变化触发联想请求
 */
watch(stateKeywordAuthor, () => {
  stateLoadingAuthor.value = true;
  refreshAuthorDebounced({ datas: { q: stateKeywordAuthor.value } });
});

/**
 * 监听：路由变化时根据当前路由加载默认联想数据
 */
watch(
  () => route.path,
  () => {
    requestDefaultsForCurrentRoute();
  }
);

/**
 * 监听：路由查询变化时应用默认值（含初始化）
 */
watch(
  () => route.query,
  () => {
    // 列表页：仅在模态打开时应用默认值
    if (props.routeIsList) {
      if (stateOpen.value) {
        applyListDefaultsFromRoute();

        // 刷新联想数据以便补全标签
        refreshUuidDebounced({ datas: { q: stateKeywordUuid.value } });
        refreshSourcesDebounced({ datas: { q: stateKeywordSource.value } });
        refreshAuthorDebounced({ datas: { q: stateKeywordAuthor.value } });

        // 设置类型和uuid
      }
      return;
    }

    // 其他页面：根据当前页类型同步各自参数
    if (props.routeIsAuthors) {
      applyAuthorsDefaultsFromRoute();
      refreshAuthorDebounced({ datas: { q: stateKeywordAuthor.value } });
      return;
    }
    if (props.routeIsSources) {
      applySourcesDefaultsFromRoute();
      refreshSourcesDebounced({ datas: { q: stateKeywordSource.value } });
      return;
    }
  }
);

/**
 * 事件：模态框打开后，加载默认联想数据
 * @param {boolean} isOpen 模态框是否打开
 */
const handleUpdateOpen = (isOpen: boolean) => {
  if (isOpen) {
    /**
     * 列表页：仅在模态打开时读取路由默认值
     */
    if (props.routeIsList) {
      applyListDefaultsFromRoute();
    }

    stateLoadingUuids.value = true;
    stateLoadingSources.value = true;
    stateLoadingAuthor.value = true;
    refreshUuidDebounced({ datas: { q: stateKeywordUuid.value } });
    refreshSourcesDebounced({ datas: { q: stateKeywordSource.value } });
    refreshAuthorDebounced({ datas: { q: stateKeywordAuthor.value } });
  }
};

/**
 * 事件：根据当前路由快捷聚焦对应控件
 */
const triggerQuickFocus = () => {
  if (props.routeIsAuthors) {
    refAuthorMenu.value?.triggerRef.click();
  } else if (props.routeIsSources) {
    refSourceMenu.value?.triggerRef.click();
  }
};

/**
 * 函数：根据当前路由初始化默认联想数据
 */
const requestDefaultsForCurrentRoute = () => {
  if (props.routeIsAuthors) {
    stateLoadingAuthor.value = true;
    refreshAuthorDebounced({ datas: { q: stateKeywordAuthor.value } });
    return;
  }

  if (props.routeIsSources) {
    stateLoadingSources.value = true;
    refreshSourcesDebounced({ datas: { q: stateKeywordSource.value } });
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
    const uuid = stateUuid.value.trim();
    const content = stateContent.value.trim();
    const translate = stateTranslate.value.trim();

    // uuid
    if (uuid) {
      query.uuid = uuid;
    }

    // 内容/译文：根据当前搜索类型互斥写入路由参数
    if (stateQuoteSearchType.value === 'content') {
      if (content) {
        query.content = content;
      }
    } else if (stateQuoteSearchType.value === 'translate') {
      if (translate) {
        query.translate = translate;
      }
    }

    // 类型
    if (stateSelectedTypes.value.length > 0) {
      query.type_ids = stateSelectedTypes.value.map((i) => String(i.value));
    }

    // 来源
    if (stateSourcesSelected.value.length > 0) {
      query.source_ids = stateSourcesSelected.value.map((i) => String(i.value));
    }

    // 作者
    if (stateAuthorsSelected.value.length > 0) {
      query.author_ids = stateAuthorsSelected.value.map((i) => String(i.value));
    }

    // 匹配方式
    if (stateIsAnd.value) {
      query.is_and = '1';
    }
  } else if (props.routeIsAuthors) {
    // 作者页：仅 author_ids
    if (stateAuthorsSelected.value.length > 0) {
      query.author_ids = stateAuthorsSelected.value.map((i) => String(i.value));
    }
  } else if (props.routeIsSources) {
    // 出处页：仅 source_ids
    if (stateSourcesSelected.value.length > 0) {
      query.source_ids = stateSourcesSelected.value.map((i) => String(i.value));
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
  stateUuid.value = '';
  stateContent.value = '';
  stateTranslate.value = '';
  stateQuoteSearchType.value = 'content';
  stateSelectedUuid.value = [];
  stateSelectedTypes.value = [];
  stateSourcesSelected.value = [];
  stateAuthorsSelected.value = [];
  stateKeywordUuid.value = '';
  stateKeywordType.value = '';
  stateKeywordSource.value = '';
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
  // 列表页：优先使用下拉已选 uuid 覆盖输入框内容
  if (props.routeIsList && stateSelectedUuid.value.length > 0) {
    stateUuid.value = String(stateSelectedUuid.value[0]?.label ?? '').trim();
  }

  // 更新路由查询参数（并重置分页）
  updateRouteQueryForSearch();

  stateOpen.value = false;
};

/**
 * 生命周期：初始化时加载默认联想数据，并在非列表页应用默认值
 */
onMounted(() => {
  // 初始化：类型选项（本地枚举，无需请求）
  const typeItems: IComponentPropsQuotesSelectMenuItem[] = [];

  quoteTypes.forEach((id) => {
    const label = t(`components.quotes.search.types.${id}`);
    stateCacheTypeLabelMap.value.set(id, { label, count: 0 });
    typeItems.push({ label, value: id, count: 0 });
  });

  setTypesOrigin(typeItems);

  // 加载默认联想数据
  requestDefaultsForCurrentRoute();

  // 非列表页：初始化应用默认值
  if (!props.routeIsList) {
    if (props.routeIsAuthors) {
      applyAuthorsDefaultsFromRoute();
      return;
    }

    if (props.routeIsSources) {
      applySourcesDefaultsFromRoute();
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
