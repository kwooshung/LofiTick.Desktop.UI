<template>
  <Dashboard>
    <template #toolbar-left>
      <UNavigationMenu v-if="!computedRouteIsDetail" :items="links" highlight class="-translate-x-2.5" />
      <div v-else class="flex items-center gap-2">
        <UIcon name="i-lucide:globe" class="text-dimmed size-4" />
        <span class="font-medium">{{ computedRouteDetailTitle }}</span>
      </div>
    </template>

    <template #toolbar-right>
      <div v-if="!computedRouteIsDetail" class="flex items-center gap-2">
        <div class="hidden shrink-0 items-center gap-2 md:flex">
          <SelectsPagesizes cache-key="crawlers" />

          <UPopover v-model:open="stateSearchPopoverOpen" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 10 }" :ui="{ content: 'w-[min(92vw,34rem)] p-0 overflow-hidden' }">
            <UButton icon="i-lucide-search" :label="computedSearchTriggerLabel" color="neutral" variant="subtle" class="w-52" :ui="{ leadingIcon: 'text-muted' }" @click="stateSearchPopoverOpen = true">
              <template #trailing>
                <UKbd value="/" class="ms-auto" />
              </template>
            </UButton>

            <template #content>
              <div class="bg-default flex flex-col gap-4 p-4 sm:p-5">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-highlighted text-sm font-semibold">{{ t('pages.crawlers.search.header.title') }}</div>
                    <div class="text-muted mt-1 text-xs">{{ computedSearchTriggerLabel }}</div>
                  </div>
                </div>

                <div class="max-h-[min(72vh,30rem)] space-y-3 overflow-y-auto pr-1">
                  <UInput ref="refToolbarSearchInput" v-model="stateToolbarKeyword" :placeholder="t('pages.crawlers.search.body.keyword.placeholder')" :ui="{ trailing: 'pe-1' }" class="w-full" @keyup.enter="handleKeywordApply">
                    <template #leading>
                      <UIcon name="i-lucide:search" class="text-dimmed size-4" />
                    </template>

                    <template #trailing>
                      <div class="flex items-center">
                        <UButton v-if="stateToolbarKeyword !== ''" color="neutral" variant="ghost" icon="i-lucide:x" size="xs" class="rounded-md" @click="handleFilterReset" />
                        <UKbd v-else value="/" class="ms-1" />
                      </div>
                    </template>
                  </UInput>

                  <SelectsEnabled :placeholder="t('pages.crawlers.search.body.enabled.placeholder')" />
                </div>

                <div class="border-default flex items-center justify-end gap-2 border-t pt-4">
                  <UButton color="neutral" variant="outline" @click="handleFilterReset">{{ t('common.actions.reset') }}</UButton>
                  <UButton icon="i-lucide-search" color="primary" @click="handleKeywordApply">{{ t('common.actions.search') }}</UButton>
                </div>
              </div>
            </template>
          </UPopover>
        </div>

        <UButton icon="i-lucide:plus" color="primary" @click="handleToolbarCreate">
          {{ t('common.actions.add') }}
        </UButton>
      </div>

      <div v-else class="flex items-center gap-2">
        <SelectsPagesizes cache-key="crawlers-detail" />
        <UButton icon="i-lucide:edit" color="primary" variant="outline" @click="handleEditTarget">
          {{ t('common.actions.edit') }}
        </UButton>
        <UButton icon="i-lucide:plus" color="primary" @click="handleAddTask">
          {{ t('pages.crawlers.targets.addTask') }}
        </UButton>
      </div>
    </template>

    <NuxtPage :create-nonce="stateCreateNonce" :keyword="stateToolbarKeyword" />

    <CrawlersCode
      v-model:open="stateCodeSlideoverOpen"
      :site-name="computedRouteDetailTitle"
      :base-url="String(stateDetail?.baseUrl ?? '').trim()"
      :target-id="Number(stateDetail?.id ?? 0)"
      :function-refresh-nonce="stateFunctionRefreshNonce"
      @save="handleBlueprintSave"
      @create-function="handleCreateFunctionFromSidebar"
      @edit-function-logic="handleEditFunctionLogicFromSidebar"
    />

    <USlideover
      v-model:open="stateFunctionLogicOpen"
      :title="computedFunctionLogicTitle"
      :description="computedFunctionLogicDescription"
      side="bottom"
      :overlay="false"
      :ui="{
        header: 'px-4 py-3 sm:px-4 sm:py-3',
        content: 'bg-default h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] rounded-none shadow-t-3xl shadow-black',
        body: 'h-full w-full overflow-hidden p-0 sm:p-0'
      }"
    >
      <template #body>
        <CrawlersEditor
          v-if="stateFunctionLogicDetail"
          :key="computedFunctionLogicEditorKey"
          :site-name="stateFunctionLogicDetail.name"
          :base-url="computedFunctionLogicEditorBaseUrl"
          :target-id="Number(stateFunctionLogicDetail.targetId ?? 0)"
          :function-refresh-nonce="stateFunctionRefreshNonce"
          :initial-flow-data="stateFunctionLogicDetail.graph"
          :draft-storage-key="computedFunctionLogicDraftKey"
          @cancel="stateFunctionLogicOpen = false"
          @save="handleFunctionLogicSave"
        />
      </template>
    </USlideover>

    <UModal v-model:open="stateFunctionEditorOpen" :dismissible="false" :title="computedFunctionEditorTitle" :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="w-full max-w-none space-y-4">
          <UFormField :label="t('pages.crawlers.editor.sidebar.createModal.scopeLabel')">
            <UBadge color="neutral" variant="soft">{{ computedFunctionEditorScopeLabel }}</UBadge>
          </UFormField>

          <UFormField required :label="t('pages.crawlers.editor.sidebar.createModal.nameLabel')">
            <UInput v-model="stateFunctionEditorName" class="w-full" :placeholder="t('pages.crawlers.editor.sidebar.createModal.namePlaceholder')" />
          </UFormField>

          <UFormField :label="t('pages.crawlers.editor.sidebar.createModal.descriptionLabel')">
            <UTextarea v-model="stateFunctionEditorDescription" class="w-full" :rows="3" autoresize :placeholder="t('pages.crawlers.editor.sidebar.createModal.descriptionPlaceholder')" />
          </UFormField>

          <p v-if="!computedFunctionEditorHasTarget" class="text-warning text-xs">
            {{ t('pages.crawlers.editor.sidebar.createModal.siteTargetRequired') }}
          </p>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton type="button" color="neutral" variant="outline" @click="close">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" icon="i-lucide:plus" color="primary" :disabled="!computedFunctionEditorCanSubmit" @click="handleCreateFunctionSubmit">
          {{ t('common.actions.add') }}
        </UButton>
      </template>
    </UModal>

    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="computedEditorTitle" :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm id="crawlerTargetEditorForm" :schema="schema" :state="stateEditor" class="w-full max-w-none space-y-4" @submit="handleEditorSubmit">
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
  </Dashboard>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, NavigationMenuItem } from '@nuxt/ui';
import { z } from 'zod';

import type { ICrawlersEditorSidebarFunctionDetail, ICrawlersEditorSidebarFunctionRow } from '@/components/crawlers/editor/sidebar/index.types';

/**
 * 页面：按爬虫路由层级刷新父页实例。
 */
definePageMeta({
  key: (route) => {
    /**
     * 常量：domain。
     */
    const domain = route.params.domain;
    if (typeof domain === 'string' && domain.trim() !== '') {
      return `crawlers-detail-${domain}`;
    }

    return 'crawlers-index';
  }
});

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 路由
 */
const route = useRoute();

/**
 * 引用：工具栏搜索框
 */
const stateRefToolbarSearchInput = ref<{ inputRef?: HTMLInputElement | null } | null>(null);

/**
 * 计算属性：是否设置了搜索条件。
 */
const computedHasSearchConditions = computed(() => {
  return stateToolbarKeyword.value.trim() !== '' || String(route.query.enabled ?? '').trim() !== '';
});

/**
 * 计算属性：搜索入口按钮文案。
 */
const computedSearchTriggerLabel = computed(() => (computedHasSearchConditions.value ? t('pages.crawlers.search.header.conditions') : t('pages.crawlers.search.header.startLabel')));

/**
 * 计算属性：目标站点路由
 */
const computedPathTargets = computed(() => localePath('/crawlers'));

/**
 * 计算属性：执行记录路由
 */
const computedPathExecutions = computed(() => localePath('/crawlers/executions'));

/**
 * 计算属性：当前是否为爬虫详情页
 */
const computedRouteIsDetail = computed<boolean>(() => typeof route.params.domain === 'string' && route.params.domain.trim() !== '');

/**
 * 计算属性：站点域名
 */
const computedDomain = computed<string>(() => {
  /**
   * 常量：value。
   */
  const value = route.params.domain;
  return typeof value === 'string' ? value : Array.isArray(value) ? (value[0] ?? '') : '';
});

/**
 * 函数：将域名转换为站点显示名
 * @param {string} domain 域名
 * @returns {string} 站点显示名
 */
const domainDisplayNameGet = (domain: string): string => {
  /**
   * 常量：trimmed。
   */
  const trimmed = domain.trim();
  if (trimmed === '') {
    return t('pages.crawlers.targets.title');
  }

  /**
   * 常量：domainPart。
   */
  const domainPart = trimmed.split('/')[0] ?? trimmed;
  /**
   * 常量：host。
   */
  const host = domainPart.split('.')[0] ?? trimmed;
  if (host === '') {
    return trimmed;
  }

  return host.charAt(0).toUpperCase() + host.slice(1);
};

/**
 * 状态：创建 nonce
 */
const stateCreateNonce = ref(0);

/**
 * 状态：工具栏关键词
 */
const stateToolbarKeyword = ref('');

/**
 * 状态：搜索面板是否打开。
 */
const stateSearchPopoverOpen = ref(false);

/**
 * 状态：编辑器开关
 */
const stateEditorOpen = ref(false);

/**
 * 状态：蓝图抽屉开关。
 */
const stateCodeSlideoverOpen = useState<boolean>('crawlers-blueprint-open', () => false);

/**
 * 状态：函数列表刷新 nonce。
 */
const stateFunctionRefreshNonce = ref(0);

/**
 * 状态：函数创建弹窗开关。
 */
const stateFunctionEditorOpen = ref(false);

/**
 * 状态：函数创建作用域。
 */
const stateFunctionEditorScope = ref<'site' | 'global'>('site');

/**
 * 状态：函数创建名称。
 */
const stateFunctionEditorName = ref('');

/**
 * 状态：函数创建描述。
 */
const stateFunctionEditorDescription = ref('');

/**
 * 状态：函数逻辑抽屉开关。
 */
const stateFunctionLogicOpen = ref(false);

/**
 * 状态：函数逻辑详情。
 */
const stateFunctionLogicDetail = ref<ICrawlersEditorSidebarFunctionDetail | null>(null);

/**
 * 状态：蓝图抽屉目标站点。
 */
const stateBlueprintDrawerTarget = useState<IQueryResultCrawlerTargetRow | null>('crawlers-blueprint-target', () => null);

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
 * 常量：表单验证规则
 */
const schema = z.object({
  id: z.number().optional(),
  name: z
    .string({ message: t('pages.crawlers.targets.form.name.verify.required') })
    .trim()
    .min(1, t('pages.crawlers.targets.form.name.verify.required'))
    .max(255, t('pages.crawlers.targets.form.name.verify.length')),
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
 * 类型：编辑器表单提交值。
 */

/**
 * API：获取站点详情
 */
const { datas: stateDetail, refresh: refreshDetail } = await useApi<IQueryResultCrawlerTargetRow>(`crawlers/targets/${computedDomain.value}`, {
  immediate: computedRouteIsDetail.value
});

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
 * 计算属性：当前编辑标题
 */
const computedEditorTitle = computed<string>(() => {
  return stateEditor.value.id > 0 ? t('pages.crawlers.targets.edit') : t('pages.crawlers.targets.add');
});

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
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 计算属性：详情页标题
 */
const computedRouteDetailTitle = computed<string>(() => {
  /**
   * 常量：detailName。
   */
  const detailName = String(stateDetail.value?.name ?? '').trim();
  if (detailName !== '') {
    return detailName;
  }

  /**
   * 常量：domain。
   */
  const domain = computedDomain.value;
  return domain !== '' ? domainDisplayNameGet(domain) : t('pages.crawlers.targets.title');
});

/**
 * 计算属性：函数创建弹窗标题。
 */
const computedFunctionEditorTitle = computed(() => {
  return stateFunctionEditorScope.value === 'site' ? t('pages.crawlers.editor.sidebar.createModal.titleSite') : t('pages.crawlers.editor.sidebar.createModal.titleGlobal');
});

/**
 * 计算属性：函数创建作用域文案。
 */
const computedFunctionEditorScopeLabel = computed(() => {
  return stateFunctionEditorScope.value === 'site' ? t('pages.crawlers.editor.sidebar.createModal.scopeSite') : t('pages.crawlers.editor.sidebar.createModal.scopeGlobal');
});

/**
 * 计算属性：函数创建目标站点 ID。
 */
const computedFunctionEditorTargetId = computed(() => {
  const detailTargetId = Number(stateDetail.value?.id ?? 0);
  if (Number.isFinite(detailTargetId) && detailTargetId > 0) {
    return detailTargetId;
  }

  const drawerTargetId = Number(stateBlueprintDrawerTarget.value?.id ?? 0);
  return Number.isFinite(drawerTargetId) && drawerTargetId > 0 ? drawerTargetId : 0;
});

/**
 * 计算属性：函数创建是否存在可用站点。
 */
const computedFunctionEditorHasTarget = computed(() => {
  if (stateFunctionEditorScope.value === 'global') {
    return true;
  }

  return computedFunctionEditorTargetId.value > 0;
});

/**
 * 计算属性：函数创建是否可提交。
 */
const computedFunctionEditorCanSubmit = computed(() => {
  return stateFunctionEditorName.value.trim() !== '' && computedFunctionEditorHasTarget.value;
});

/**
 * 函数：同步面包屑
 */
const syncBreadcrumb = () => {
  if (computedRouteIsDetail.value) {
    storeBreadcrumb.states = [
      {
        label: t('pages.home.title'),
        icon: 'i-mdi:view-dashboard-outline',
        to: localePath('/'),
        exact: true
      },
      {
        label: t('pages.crawlers.title'),
        icon: 'i-lucide:bug',
        to: computedPathTargets.value,
        exact: true
      },
      {
        label: computedRouteDetailTitle.value,
        icon: 'i-lucide:globe',
        to: localePath(`/crawlers/${encodeURIComponent(computedDomain.value)}`),
        exact: true
      }
    ];
    return;
  }

  storeBreadcrumb.states = [
    {
      label: t('pages.home.title'),
      icon: 'i-mdi:view-dashboard-outline',
      to: localePath('/'),
      exact: true
    },
    {
      label: t('pages.crawlers.title'),
      icon: 'i-lucide:bug',
      to: computedPathTargets.value,
      exact: true
    }
  ];
};

/**
 * 监听：路由与详情标题变化时同步面包屑
 */
watch(
  [computedRouteIsDetail, computedRouteDetailTitle],
  () => {
    syncBreadcrumb();
  },
  { immediate: true }
);

/**
 * 事件：编辑站点
 */
const handleEditTarget = () => {
  if (!stateDetail.value) {
    return;
  }

  stateEditorOriginalDomain.value = String(stateDetail.value.domain ?? '').trim();
  stateEditor.value = {
    id: Number(stateDetail.value?.id ?? 0),
    name: String(stateDetail.value?.name ?? ''),
    domain: String(stateDetail.value?.domain ?? computedDomain.value),
    baseUrl: String(stateDetail.value?.baseUrl ?? ''),
    description: String(stateDetail.value?.description ?? ''),
    isEnabled: Boolean(stateDetail.value?.isEnabled ?? true)
  };

  stateEditorOpen.value = true;
};

/**
 * 函数：归一化用于查重比较的域名。
 * @param {string} value 域名或 URL。
 * @returns {string} 归一化域名。
 */
const normalizeDomainForUniqueCompare = (value: string): string => {
  /**
   * 常量：raw。
   */
  const raw = String(value ?? '').trim();
  if (raw === '') {
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
  return (matchResult ? matchResult[0] : withoutProtocol).trim().toLowerCase();
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
 * 事件：添加任务
 */
const handleAddTask = () => {
  stateBlueprintDrawerTarget.value = stateDetail.value ?? null;
  stateCodeSlideoverOpen.value = true;
};

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
  const domain = String(stateEditor.value.domain ?? '').trim();

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
 * API：保存（新增/编辑）
 */
const { refresh: refreshSave } = await useApi<{ affected: number }>('crawlers/targets/add', { method: 'POST', immediate: false });

/**
 * API：创建函数。
 */
const { refresh: refreshFunctionCreate } = await useApi<{ id: number }>('crawlers/functions/add', {
  method: 'POST',
  immediate: false
});

/**
 * API：函数详情。
 */
const { datas: stateFunctionDetailRemote, refresh: refreshFunctionDetail } = await useApi<ICrawlersEditorSidebarFunctionDetail>('crawlers/functions/detail', {
  immediate: false
});

/**
 * API：保存函数图。
 */
const { refresh: refreshFunctionGraphSave } = await useApi<{ affected: number; referenceCount: number }>('crawlers/functions/graph', {
  method: 'POST',
  immediate: false
});

/**
 * 计算属性：函数逻辑抽屉标题。
 */
const computedFunctionLogicTitle = computed(() => {
  const name = String(stateFunctionLogicDetail.value?.name ?? '').trim();
  return name !== '' ? `${t('pages.crawlers.editor.title')} / ${name}` : t('pages.crawlers.editor.title');
});

/**
 * 计算属性：函数逻辑抽屉描述。
 */
const computedFunctionLogicDescription = computed(() => {
  return String(stateFunctionLogicDetail.value?.description ?? '').trim();
});

/**
 * 计算属性：函数逻辑编辑器基础 URL。
 */
const computedFunctionLogicEditorBaseUrl = computed(() => {
  if (stateFunctionLogicDetail.value?.scope === 'site') {
    return String(stateDetail.value?.baseUrl ?? '').trim();
  }

  return '';
});

/**
 * 计算属性：函数逻辑草稿键。
 */
const computedFunctionLogicDraftKey = computed(() => {
  const id = Number(stateFunctionLogicDetail.value?.id ?? 0);
  return Number.isFinite(id) && id > 0 ? `crawler:blueprint:draft:function:${id}` : '';
});

/**
 * 计算属性：函数逻辑编辑器 key。
 */
const computedFunctionLogicEditorKey = computed(() => {
  return String(stateFunctionLogicDetail.value?.id ?? 'function-logic');
});

/**
 * 事件：提交表单
 */
const handleEditorSubmit = async (event: FormSubmitEvent<z.output<typeof schema>>) => {
  await refreshSave({
    datas: {
      id: event.data.id,
      name: event.data.name,
      domain: event.data.domain,
      description: event.data.description ?? '',
      isEnabled: event.data.isEnabled ?? true
    },
    replace: true
  });

  stateEditorOpen.value = false;
  await refreshDetail({ replace: true });
};

/**
 * 事件：保存蓝图。
 */
const handleBlueprintSave = async (payload: { flowData?: unknown; draftKey?: string }) => {
  /**
   * 常量：target。
   */
  const target = stateDetail.value ?? stateBlueprintDrawerTarget.value;
  if (!target) {
    return;
  }

  await refreshSave({
    datas: {
      id: Number(target.id ?? 0),
      name: String(target.name ?? '').trim(),
      domain: String(target.domain ?? '').trim(),
      description: String(target.description ?? ''),
      isEnabled: Boolean(target.isEnabled ?? true)
    },
    replace: true
  });

  if (import.meta.client) {
    /**
     * 常量：draftKey。
     */
    const draftKey = String(payload?.draftKey ?? '').trim();
    if (draftKey !== '') {
      localStorage.removeItem(draftKey);
    }
  }
};

/**
 * 事件：侧栏触发创建函数。
 * @param {'site' | 'global'} scope 作用域。
 * @returns {void} 无返回值。
 */
const handleCreateFunctionFromSidebar = (scope: 'site' | 'global'): void => {
  stateFunctionEditorScope.value = scope;
  stateFunctionEditorName.value = '';
  stateFunctionEditorDescription.value = '';
  stateFunctionEditorOpen.value = true;
};

/**
 * 事件：提交创建函数。
 * @returns {Promise<void>} Promise。
 */
const handleCreateFunctionSubmit = async (): Promise<void> => {
  const name = stateFunctionEditorName.value.trim();
  const description = stateFunctionEditorDescription.value.trim();

  if (name === '' || !computedFunctionEditorCanSubmit.value) {
    return;
  }

  const scope = stateFunctionEditorScope.value;

  await refreshFunctionCreate({
    datas: {
      name,
      scope,
      targetId: scope === 'site' ? computedFunctionEditorTargetId.value : undefined,
      description
    },
    replace: true
  });

  stateFunctionEditorOpen.value = false;
  stateFunctionRefreshNonce.value += 1;
};

/**
 * 事件：侧栏触发编辑函数逻辑。
 * @param {ICrawlersEditorSidebarFunctionRow} row 函数行。
 * @returns {Promise<void>} Promise。
 */
const handleEditFunctionLogicFromSidebar = async (row: ICrawlersEditorSidebarFunctionRow): Promise<void> => {
  const id = Number(row.id ?? 0);

  if (!Number.isFinite(id) || id <= 0) {
    return;
  }

  await refreshFunctionDetail({
    datas: { id },
    replace: true
  });

  if (!stateFunctionDetailRemote.value) {
    return;
  }

  stateFunctionLogicDetail.value = stateFunctionDetailRemote.value;
  stateFunctionLogicOpen.value = true;
};

/**
 * 事件：保存函数逻辑。
 * @param {{ flowData?: unknown; draftKey?: string }} payload 保存载荷。
 * @returns {Promise<void>} Promise。
 */
const handleFunctionLogicSave = async (payload: { flowData?: unknown; draftKey?: string }): Promise<void> => {
  const id = Number(stateFunctionLogicDetail.value?.id ?? 0);

  if (!Number.isFinite(id) || id <= 0) {
    return;
  }

  await refreshFunctionGraphSave({
    datas: {
      id,
      graph: payload?.flowData ?? {}
    },
    replace: true
  });

  if (import.meta.client) {
    const draftKey = String(payload?.draftKey ?? '').trim();
    if (draftKey !== '') {
      localStorage.removeItem(draftKey);
    }
  }

  stateFunctionLogicOpen.value = false;
  stateFunctionRefreshNonce.value += 1;
};

/**
 * 变量：Tab 链接
 */
const links = [
  [
    {
      label: t('pages.crawlers.targets.title'),
      icon: 'i-lucide:globe',
      to: computedPathTargets.value,
      exact: true
    },
    {
      label: t('pages.crawlers.executions.title'),
      icon: 'i-lucide:clock',
      to: computedPathExecutions.value,
      exact: true
    }
  ]
] satisfies NavigationMenuItem[][];

/**
 * 事件：工具栏点击创建
 */
const handleToolbarCreate = () => {
  stateCreateNonce.value += 1;
};

/**
 * 事件：关键词应用
 */
const handleKeywordApply = () => {
  /**
   * 常量：keyword。
   */
  const keyword = stateToolbarKeyword.value.trim();
  /**
   * 常量：query。
   */
  const query = { ...route.query };

  query.page = '1';

  if (keyword !== '') {
    query.keyword = keyword;
  } else {
    delete query.keyword;
  }

  navigateTo({ path: route.path, query }, { replace: true });
  stateSearchPopoverOpen.value = false;
};

/**
 * 事件：重置筛选
 */
const handleFilterReset = () => {
  stateToolbarKeyword.value = '';
  /**
   * 常量：query。
   */
  const query = { ...route.query };

  delete query.keyword;
  delete query.enabled;
  query.page = '1';

  navigateTo(
    {
      path: route.path,
      query
    },
    { replace: true }
  );
  stateSearchPopoverOpen.value = false;
};

/**
 * 监听：路由关键词变化时同步到工具栏输入。
 */
watch(
  () => route.query.keyword,
  (value) => {
    stateToolbarKeyword.value = String(value ?? '').trim();
  },
  { immediate: true }
);

/**
 * 监听：搜索面板打开后自动聚焦关键词输入。
 */
watch(stateSearchPopoverOpen, async (isOpen) => {
  if (!isOpen) {
    return;
  }

  await nextTick();
  stateRefToolbarSearchInput.value?.inputRef?.focus();
});

/**
 * 快捷键
 */
defineShortcuts({
  /**
   * 聚焦搜索框
   */
  '/': () => {
    stateSearchPopoverOpen.value = true;
  }
});
</script>
