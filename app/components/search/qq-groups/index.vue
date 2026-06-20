<template>
  <DefineQqGroupsSearchPanelBody>
    <div class="grid gap-3 sm:grid-cols-2">
      <UInput v-model="stateName" icon="i-mdi:format-title" variant="outline" class="sm:col-span-1" :placeholder="t('components.socials.qq.groups.search.body.name.placeholder')" autofocus clear>
        <template v-if="stateName.length" #trailing>
          <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateName = ''" />
        </template>
      </UInput>
      <UInput v-model="stateNumber" icon="i-material-symbols:123" variant="outline" class="sm:col-span-1" :placeholder="t('components.socials.qq.groups.search.body.number.placeholder')" clear>
        <template v-if="stateNumber.length" #trailing>
          <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateNumber = ''" />
        </template>
      </UInput>
      <USelectMenu
        v-model="stateSelectedSizes"
        icon="i-mdi:account-group-outline"
        multiple
        clear
        class="sm:col-span-2"
        :placeholder="t('components.socials.qq.groups.search.body.size.placeholder')"
        :items="sizeItems"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
      />
      <USelect v-model="stateFull" value-key="id" class="sm:col-span-1" :items="computedFullItems" :placeholder="t('components.selects.full.placeholder')" />
      <USelect v-model="stateEnabled" value-key="id" class="sm:col-span-1" :items="computedEnabledItems" :placeholder="t('components.selects.enabled.placeholder')" />
    </div>
  </DefineQqGroupsSearchPanelBody>

  <DefineQqGroupsSearchPanelActions>
    <USwitch v-model="stateIsAnd" :label="stateIsAnd ? t('components.socials.qq.groups.search.footer.match.all') : t('components.socials.qq.groups.search.footer.match.any')" />
    <div class="flex gap-2">
      <UButton color="neutral" variant="outline" @click="handleReset">{{ t('components.socials.qq.groups.search.buttons.reset') }}</UButton>
      <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.socials.qq.groups.search.buttons.search') }}</UButton>
    </div>
  </DefineQqGroupsSearchPanelActions>

  <template v-if="stateSearchPanelMobile">
    <UButton icon="i-lucide-search" :label="computedSearchTriggerLabel" color="neutral" variant="subtle" class="w-52" :ui="{ leadingIcon: 'text-muted' }" @click="stateOpen = true">
      <template #trailing>
        <UKbd value="/" class="ms-auto" />
      </template>
    </UButton>

    <USlideover v-model:open="stateOpen" :title="t('components.socials.qq.groups.search.header.title')" :ui="{ body: 'space-y-4', footer: 'justify-between' }" @update:open="handleUpdateOpen">
      <template #body>
        <ReuseQqGroupsSearchPanelBody />
      </template>
      <template #footer>
        <ReuseQqGroupsSearchPanelActions />
      </template>
    </USlideover>
  </template>
  <template v-else>
    <UPopover v-model:open="stateOpen" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 10 }" :ui="{ content: 'w-[min(92vw,44rem)] p-0 overflow-hidden' }" @update:open="handleUpdateOpen">
      <UButton icon="i-lucide-search" :label="computedSearchTriggerLabel" color="neutral" variant="subtle" class="w-52" :ui="{ leadingIcon: 'text-muted' }">
        <template #trailing>
          <UKbd value="/" class="ms-auto" />
        </template>
      </UButton>

      <template #content>
        <div class="bg-default flex flex-col gap-4 p-4 sm:p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-highlighted text-sm font-semibold">{{ t('components.socials.qq.groups.search.header.title') }}</div>
              <div class="text-muted mt-1 text-xs">{{ computedSearchTriggerLabel }}</div>
            </div>
          </div>

          <div class="max-h-[min(72vh,30rem)] overflow-y-auto pr-1">
            <ReuseQqGroupsSearchPanelBody />
          </div>

          <div class="border-default flex items-center justify-between gap-3 border-t pt-4">
            <ReuseQqGroupsSearchPanelActions />
          </div>
        </div>
      </template>
    </UPopover>
  </template>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

import type { IComponentPropsQqGroupsSizeSelectItem } from '@/components/search/qq-groups/index.types';

/**
 * 模板：QQ群搜索面板主体。
 */
const [DefineQqGroupsSearchPanelBody, ReuseQqGroupsSearchPanelBody] = createReusableTemplate();

/**
 * 模板：QQ群搜索面板操作区。
 */
const [DefineQqGroupsSearchPanelActions, ReuseQqGroupsSearchPanelActions] = createReusableTemplate();

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
 * 状态：模态框开关
 */
const stateOpen = ref(false);

/**
 * 状态：搜索面板是否使用移动端抽屉模式。
 */
const stateSearchPanelMobile = ref(false);

/**
 * 状态：名称关键词
 */
const stateName = ref('');

/**
 * 状态：群号关键词
 */
const stateNumber = ref('');

/**
 * 状态：已选规模
 */
const stateSelectedSizes = ref<IComponentPropsQqGroupsSizeSelectItem[]>([]);

/**
 * 状态：匹配方式（true=全部满足，false=任意满足）
 */
const stateIsAnd = ref(false);

/**
 * 状态：启用状态筛选。
 */
const stateEnabled = ref<'all' | 'enabled' | 'disabled'>('all');

/**
 * 状态：满员状态筛选。
 */
const stateFull = ref<'all' | 'full' | 'not_full'>('all');

/**
 * 函数：获取规模标签
 * @param {number} count 规模数量
 * @returns {string} 规模标签
 */
const getSizeLabel = (count: number): string => t('components.socials.qq.groups.search.body.size.item', { count });

/**
 * 常量：规模选项
 */
const sizeItems = computed<IComponentPropsQqGroupsSizeSelectItem[]>(() => [
  { label: getSizeLabel(200), value: 20 },
  { label: getSizeLabel(500), value: 50 },
  { label: getSizeLabel(1000), value: 100 },
  { label: getSizeLabel(2000), value: 200 },
  { label: getSizeLabel(3000), value: 300 },
  { label: getSizeLabel(5000), value: 500 }
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
 * 计算属性：满员状态选项。
 */
const computedFullItems = computed<SelectItem[]>(() => [
  { id: 'all', label: t('components.selects.full.items.all') },
  { id: 'full', label: t('components.selects.full.items.full') },
  { id: 'not_full', label: t('components.selects.full.items.not_full') }
]);

/**
 * 计算属性：是否已设置搜索条件
 */
const computedHasSearchConditions = computed(() => {
  /**
   * 常量：q。
   */
  const q = route.query;
  /**
   * 函数：hasText。
   */
  const hasText = (typeof q.name !== 'undefined' && String(q.name ?? '').trim().length > 0) || (typeof q.number !== 'undefined' && String(q.number ?? '').trim().length > 0);

  /**
   * 常量：v。
   */
  const v = q.size;
  /**
   * 函数：hasSize。
   */
  const hasSize = Array.isArray(v) ? v.length > 0 : typeof v !== 'undefined' && String(v).trim().length > 0;

  return hasText || hasSize || typeof q.enabled !== 'undefined' || typeof q.full !== 'undefined';
});

/**
 * 计算属性：搜索入口按钮文案。
 */
const computedSearchTriggerLabel = computed(() => (computedHasSearchConditions.value ? t('components.socials.qq.groups.search.header.conditions') : t('components.socials.qq.groups.search.header.startLabel')));

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
 * 函数：从路由读取满员状态。
 * @returns {'all' | 'full' | 'not_full'} 满员状态。
 */
const readFullStateFromRoute = (): 'all' | 'full' | 'not_full' => {
  /**
   * 常量：value。
   */
  const value = String(route.query.full ?? '').trim();

  if (value === '1') {
    return 'full';
  }

  if (value === '0') {
    return 'not_full';
  }

  return 'all';
};

/**
 * 函数：从路由查询应用默认值（在模态打开时执行）
 */
const applyDefaultsFromRoute = (): void => {
  if (typeof route.query.name !== 'undefined') {
    stateName.value = String(route.query.name ?? '').trim();
  }

  if (typeof route.query.number !== 'undefined') {
    stateNumber.value = String(route.query.number ?? '').trim();
  }

  if (typeof route.query.is_and !== 'undefined') {
    stateIsAnd.value = String(route.query.is_and) === '1';
  }

  stateEnabled.value = readEnabledStateFromRoute();
  stateFull.value = readFullStateFromRoute();

  /**
   * 常量：v。
   */
  const v = route.query.size;
  /**
   * 常量：arr。
   */
  const arr = v ? (Array.isArray(v) ? v : [v]) : [];
  /**
   * 常量：ids。
   */
  const ids = arr.map((s) => parseInt(String(s), 10)).filter((n) => Number.isFinite(n) && n > 0);

  /**
   * 函数：map。
   */
  const map = new Map<number, string>([
    [20, getSizeLabel(200)],
    [50, getSizeLabel(500)],
    [100, getSizeLabel(1000)],
    [200, getSizeLabel(2000)],
    [500, getSizeLabel(5000)]
  ]);

  stateSelectedSizes.value = ids.map((id) => ({
    label: map.get(id) ?? getSizeLabel(id * 10),
    value: id
  }));
};

/**
 * 函数：根据当前输入更新路由查询参数（并重置分页）
 */
const updateRouteQueryForSearch = (): void => {
  const query: Record<string, string | string[]> = {};

  if (stateName.value.trim()) {
    query.name = stateName.value.trim();
  }

  if (stateNumber.value.trim()) {
    query.number = stateNumber.value.trim();
  }

  if (stateSelectedSizes.value.length > 0) {
    query.size = stateSelectedSizes.value.map((i) => String(i.value));
  }

  if (stateIsAnd.value) {
    query.is_and = '1';
  }

  if (stateEnabled.value !== 'all') {
    query.enabled = stateEnabled.value === 'enabled' ? '1' : '0';
  }

  if (stateFull.value !== 'all') {
    query.full = stateFull.value === 'full' ? '1' : '0';
  }

  if (typeof route.query.pagesize !== 'undefined') {
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
 * 事件：模态框打开后加载默认值
 * @param {boolean} isOpen 模态是否打开
 */
const handleUpdateOpen = (isOpen: boolean) => {
  if (isOpen) {
    applyDefaultsFromRoute();
  }
};

/**
 * 事件：重置搜索条件
 */
const handleReset = (): void => {
  stateName.value = '';
  stateNumber.value = '';
  stateSelectedSizes.value = [];
  stateIsAnd.value = false;
  stateEnabled.value = 'all';
  stateFull.value = 'all';

  handleSearch();
  stateOpen.value = false;
};

/**
 * 事件：发起搜索
 */
const handleSearch = (): void => {
  updateRouteQueryForSearch();
  stateOpen.value = false;
};

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
 * 生命周期：初始化时绑定视口监听。
 */
onMounted(() => {
  syncSearchPanelViewportMode();

  if (import.meta.client) {
    window.addEventListener('resize', syncSearchPanelViewportMode);
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
  '/': () => {
    if (!storeAuth.states.ui.show) {
      stateOpen.value = true;
    }
  },
  enter: () => {
    if (stateOpen.value) {
      handleSearch();
    }
  }
});
</script>
