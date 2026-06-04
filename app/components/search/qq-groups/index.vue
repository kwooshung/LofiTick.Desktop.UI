<template>
  <UModal v-model:open="stateOpen" :title="t('components.socials.qq.groups.search.header.title')" :dismissible="false" :ui="{ body: 'flex flex-col', footer: 'justify-between' }" @update:open="handleUpdateOpen">
    <UButton icon="i-lucide-search" :label="computedHasSearchConditions ? t('components.socials.qq.groups.search.header.conditions') : t('components.socials.qq.groups.search.header.startLabel')" color="neutral" variant="subtle" class="w-60" :ui="{ leadingIcon: 'text-muted' }">
      <template #trailing>
        <UKbd value="/" class="ms-auto" />
      </template>
    </UButton>
    <template #body>
      <UInput v-model="stateName" icon="i-mdi:format-title" variant="outline" :placeholder="t('components.socials.qq.groups.search.body.name.placeholder')" autofocus clear class="mb-4">
        <template v-if="stateName.length" #trailing>
          <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateName = ''" />
        </template>
      </UInput>
      <UInput v-model="stateNumber" icon="i-material-symbols:123" variant="outline" :placeholder="t('components.socials.qq.groups.search.body.number.placeholder')" clear class="mb-4">
        <template v-if="stateNumber.length" #trailing>
          <UButton color="neutral" variant="link" size="sm" icon="i-tabler:x" aria-label="Clear input" @click="stateNumber = ''" />
        </template>
      </UInput>
      <USelectMenu
        v-model="stateSelectedSizes"
        icon="i-mdi:account-group-outline"
        multiple
        clear
        :placeholder="t('components.socials.qq.groups.search.body.size.placeholder')"
        :items="sizeItems"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
      />
    </template>
    <template #footer>
      <USwitch v-model="stateIsAnd" :label="stateIsAnd ? t('components.socials.qq.groups.search.footer.match.all') : t('components.socials.qq.groups.search.footer.match.any')" />
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline" @click="handleReset">{{ t('components.socials.qq.groups.search.buttons.reset') }}</UButton>
        <UButton icon="i-lucide-search" color="primary" @click="handleSearch">{{ t('components.socials.qq.groups.search.buttons.search') }}</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { IComponentPropsQqGroupsSizeSelectItem } from '@/components/search/qq-groups/index.types';

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
 * 计算属性：是否已设置搜索条件
 */
const computedHasSearchConditions = computed(() => {
  const q = route.query;
  const hasText = (typeof q.name !== 'undefined' && String(q.name ?? '').trim().length > 0) || (typeof q.number !== 'undefined' && String(q.number ?? '').trim().length > 0);

  const v = q.size;
  const hasSize = Array.isArray(v) ? v.length > 0 : typeof v !== 'undefined' && String(v).trim().length > 0;

  return hasText || hasSize;
});

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

  const v = route.query.size;
  const arr = v ? (Array.isArray(v) ? v : [v]) : [];
  const ids = arr.map((s) => parseInt(String(s), 10)).filter((n) => Number.isFinite(n) && n > 0);

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

  if (typeof route.query.pagesize !== 'undefined') {
    query.pagesize = route.query.pagesize as string;
  }

  if (typeof route.query.enabled !== 'undefined') {
    query.enabled = route.query.enabled as string;
  }

  if (typeof route.query.full !== 'undefined') {
    query.full = route.query.full as string;
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
