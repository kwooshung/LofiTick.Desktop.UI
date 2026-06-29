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
      :initial-flow-data="computedCrawlerInitialFlowData"
      :execute-loading="stateCrawlerBlueprintExecuting"
      @save="handleBlueprintSave"
      @save-and-close="handleBlueprintSaveAndClose"
      @execute="handleBlueprintExecute"
      @create-function="handleCreateFunctionFromSidebar"
      @edit-function-logic="handleEditFunctionLogicFromSidebar"
      @functions-changed="stateFunctionRefreshNonce += 1"
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
        <div class="relative h-full w-full">
          <div v-if="stateFunctionLogicLoading" class="bg-default/70 absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm">
            <div class="bg-default/90 border-default flex flex-col items-center justify-center gap-3 rounded-md border px-3 py-2">
              <UIcon name="i-lucide:loader-circle" class="text-primary size-5 animate-spin" />
              <span class="text-muted text-xs">{{ t('pages.crawlers.editor.loadSource.loading') }}</span>
            </div>
          </div>

          <CrawlersEditor
            v-if="stateFunctionLogicDetail"
            :key="computedFunctionLogicEditorKey"
            flow-kind="function"
            :site-name="stateFunctionLogicDetail.name"
            :base-url="computedFunctionLogicEditorBaseUrl"
            :flow-description="computedFunctionLogicDescription"
            :target-id="Number(stateFunctionLogicDetail.targetId ?? 0)"
            :function-refresh-nonce="stateFunctionRefreshNonce"
            :initial-flow-data="stateFunctionLogicDetail.graph"
            :initial-load-source="stateFunctionLogicLoadSource"
            :draft-storage-key="computedFunctionLogicDraftKey"
            @cancel="stateFunctionLogicOpen = false"
            @save="handleFunctionLogicSave"
            @save-and-close="handleFunctionLogicSaveAndClose"
            @functions-changed="stateFunctionRefreshNonce += 1"
          />
        </div>
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
import type { UnlistenFn } from '@tauri-apps/api/event';
import { z } from 'zod';

import type { ICrawlersEditorSavePayload } from '@/components/crawlers/editor/index.types';
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
 * Hook：提示。
 */
const toast = useToast();

/**
 * Hook：Tauri 爬虫蓝图能力。
 */
const { execute: executeCrawlerBlueprint, onOutputLogEvent: onCrawlerBlueprintOutputLogEvent, unlockCrawlerBlueprintAudio } = useTauriCrawlerBlueprint();

/**
 * 变量：取消订阅爬虫蓝图输出日志事件句柄。
 */
let unsubscribeCrawlerBlueprintOutputLog: UnlistenFn | null = null;

/**
 * 函数：映射爬虫蓝图输出日志 Toast 颜色。
 * @param {TTauriCrawlerBlueprintOutputLogLevel} level 日志级别。
 * @returns {'info' | 'warning' | 'error'} Toast 颜色。
 */
const crawlerBlueprintOutputLogToastColor = (level: TTauriCrawlerBlueprintOutputLogLevel): 'info' | 'warning' | 'error' => {
  if (level === 'warn') {
    return 'warning';
  }

  if (level === 'error') {
    return 'error';
  }

  return 'info';
};

/**
 * 生命周期：监听爬虫蓝图输出日志并显示 Toast。
 */
onMounted(async () => {
  try {
    unsubscribeCrawlerBlueprintOutputLog = await onCrawlerBlueprintOutputLogEvent((payload: ITauriCrawlerBlueprintOutputLogEvent) => {
      toast.add({
        color: crawlerBlueprintOutputLogToastColor(payload.level),
        title: payload.title,
        description: payload.message
      });
    });
  } catch {
    unsubscribeCrawlerBlueprintOutputLog = null;
  }
});

/**
 * 生命周期：释放爬虫蓝图输出日志监听。
 */
onUnmounted(() => {
  unsubscribeCrawlerBlueprintOutputLog?.();
  unsubscribeCrawlerBlueprintOutputLog = null;
});

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 路由。
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
 * 状态：函数逻辑加载中。
 */
const stateFunctionLogicLoading = ref(false);

/**
 * 状态：爬虫蓝图执行中。
 */
const stateCrawlerBlueprintExecuting = ref(false);

/**
 * 状态：函数逻辑初始数据来源。
 */
const stateFunctionLogicLoadSource = ref<'server' | 'draft' | 'default'>('server');

/**
 * 常量：函数图调试前缀。
 */
const FUNCTION_GRAPH_DEBUG_PREFIX = '[crawler:function-graph]';

/**
 * 状态：函数逻辑详情。
 */
const stateFunctionLogicDetail = ref<ICrawlersEditorSidebarFunctionDetail | null>(null);

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
 * 函数：归一化基础 URL。
 * @param {string} value 域名或 URL。
 * @returns {string} 带协议的基础 URL。
 */
const normalizeBaseUrlForSave = (value: string): string => {
  /**
   * 常量：raw。
   */
  const raw = String(value ?? '').trim();
  if (raw === '') {
    return '';
  }

  /**
   * 常量：withProtocol。
   */
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  /**
   * 常量：matchResult。
   */
  const matchResult = withProtocol.match(/^(https?:\/\/[^/?#]+)/i);

  return matchResult ? matchResult[1] : withProtocol;
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
  stateBlueprintDrawerBlueprintId.value = 0;
  stateBlueprintDrawerFlowData.value = null;
  stateBlueprintDrawerEnabled.value = true;
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
const { refresh: refreshSave } = await useApi<{ affected: number; id: number }>('crawlers/targets/add', { method: 'POST', immediate: false });

/**
 * API：保存站点主逻辑蓝图。
 */
const {
  status: stateCrawlerTaskGraphSaveStatus,
  error: stateCrawlerTaskGraphSaveError,
  datas: stateCrawlerTaskGraphSaveResult,
  refresh: refreshCrawlerTaskGraphSave
} = await useApi<{ affected: number; id: number; referenceCount: number }>('crawlers/blueprints/add', {
  method: 'POST',
  immediate: false
});

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
const {
  datas: stateFunctionDetailRemote,
  status: stateFunctionDetailStatus,
  error: stateFunctionDetailError,
  refresh: refreshFunctionDetail
} = await useApi<ICrawlersEditorSidebarFunctionDetail>('crawlers/functions/detail', {
  immediate: false
});

/**
 * API：保存函数图。
 */
const {
  datas: stateFunctionGraphSaveResult,
  status: stateFunctionGraphSaveStatus,
  error: stateFunctionGraphSaveError,
  refresh: refreshFunctionGraphSave
} = await useApi<{ affected: number; referenceCount: number }>('crawlers/functions/graph', {
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
 * 类型：函数图统计。
 */
type TFunctionGraphStats = {
  parameters: number;
  returns: number;
};

/**
 * 函数：安全解析函数图对象。
 * @param {unknown} graph 函数图。
 * @returns {{ nodes?: Array<Record<string, unknown>> } | null} 解析结果。
 */
const graphParseSafe = (graph: unknown): { nodes?: Array<Record<string, unknown>> } | null => {
  const normalizedGraph = (() => {
    if (typeof graph === 'string') {
      try {
        return JSON.parse(graph) as unknown;
      } catch {
        return null;
      }
    }

    return graph;
  })();

  if (!normalizedGraph || typeof normalizedGraph !== 'object') {
    return null;
  }

  return normalizedGraph as { nodes?: Array<Record<string, unknown>> };
};

/**
 * 类型：开始节点蓝图元数据。
 */
type TStartNodeCrawlerMeta = {
  crawlerTitle: string;
  crawlerDescription: string;
};

/**
 * 函数：提取开始节点中的蓝图元数据。
 * @param {unknown} flowData 图数据。
 * @returns {TStartNodeCrawlerMeta | null} 蓝图元数据。
 */
const startNodeCrawlerMetaGet = (flowData: unknown): TStartNodeCrawlerMeta | null => {
  const parsed = graphParseSafe(flowData);

  if (!parsed || !Array.isArray(parsed.nodes)) {
    return null;
  }

  const startNode = parsed.nodes.find((node) => String(node.type ?? '').trim() === 'start');

  if (!startNode) {
    return null;
  }

  const data = (startNode.data ?? {}) as Record<string, unknown>;

  return {
    crawlerTitle: String(data.crawlerTitle ?? '').trim(),
    crawlerDescription: String(data.crawlerDescription ?? '').trim()
  };
};

/**
 * 函数：统计函数图中的参数与返回值数量。
 * @param {unknown} graph 函数图。
 * @returns {TFunctionGraphStats} 统计结果。
 */
const functionGraphStatsGet = (graph: unknown): TFunctionGraphStats => {
  const normalizedGraph = (() => {
    if (typeof graph === 'string') {
      try {
        return JSON.parse(graph) as unknown;
      } catch {
        return null;
      }
    }

    return graph;
  })();

  if (!normalizedGraph || typeof normalizedGraph !== 'object') {
    return { parameters: 0, returns: 0 };
  }

  const nodes = ((normalizedGraph as { nodes?: unknown }).nodes ?? []) as Array<Record<string, unknown>>;

  if (!Array.isArray(nodes) || nodes.length === 0) {
    return { parameters: 0, returns: 0 };
  }

  const startNode = nodes.find((item) => ['function-start', 'start'].includes(String(item.type ?? '').trim()));
  const returnNode = nodes.find((item) => ['function-return', 'end'].includes(String(item.type ?? '').trim()));

  const parametersRaw = (startNode?.data as Record<string, unknown> | undefined)?.functionParameters;
  const returnsRaw = (returnNode?.data as Record<string, unknown> | undefined)?.functionReturns;

  return {
    parameters: Array.isArray(parametersRaw) ? parametersRaw.length : 0,
    returns: Array.isArray(returnsRaw) ? returnsRaw.length : 0
  };
};

/**
 * 函数：提取函数起止节点调试快照。
 * @param {unknown} graph 图数据。
 * @returns {Array<Record<string, unknown>>} 调试快照。
 */
const functionGraphDebugSnapshotGet = (graph: unknown): Array<Record<string, unknown>> => {
  const parsed = graphParseSafe(graph);

  if (!parsed || !Array.isArray(parsed.nodes)) {
    return [];
  }

  return parsed.nodes
    .filter((node: Record<string, unknown>) => {
      const type = String(node.type ?? '').trim();
      return type === 'function-start' || type === 'function-return';
    })
    .map((node: Record<string, unknown>) => {
      const data = typeof node.data === 'object' && node.data !== null ? (node.data as Record<string, unknown>) : {};
      const parameters = Array.isArray(data.functionParameters) ? data.functionParameters : Array.isArray(data.parameters) ? data.parameters : [];
      const returns = Array.isArray(data.functionReturns) ? data.functionReturns : Array.isArray(data.returns) ? data.returns : [];

      return {
        id: node.id,
        type: node.type,
        functionName: data.functionName,
        functionParametersLength: parameters.length,
        functionReturnsLength: returns.length,
        keys: Object.keys(data)
      };
    });
};

/**
 * 计算属性：页面逻辑初始图。
 */
const computedCrawlerInitialFlowData = computed<unknown>(() => {
  const detail = (stateDetail.value ?? {}) as Record<string, unknown>;

  if (detail.code !== undefined) {
    return detail.code;
  }

  if (detail.graph !== undefined) {
    return detail.graph;
  }

  return null;
});

/**
 * 函数：解析函数草稿图数据。
 * @param {number} id 函数 ID。
 * @returns {unknown | null} 草稿图。
 */
const functionDraftGraphGet = (id: number): unknown | null => {
  if (!import.meta.client || !(Number.isFinite(id) && id > 0)) {
    return null;
  }

  const draftKey = `crawler:blueprint:draft:function:${id}`;
  const raw = localStorage.getItem(draftKey);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { ts?: number; data?: string };
    const snapshot = String(parsed.data ?? '').trim();

    if (snapshot === '') {
      return null;
    }

    return JSON.parse(snapshot) as unknown;
  } catch {
    return null;
  }
};

/**
 * 函数：保存成功后删除草稿缓存。
 * @param {unknown} value 草稿缓存键。
 * @returns {Promise<void>} Promise。
 */
const draftRemoveAfterSave = async (value: unknown): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  const draftKey = String(value ?? '').trim();
  if (draftKey === '') {
    return;
  }

  const stateDraftCleanupKey = useState<string>('crawlers-editor-draft-cleanup-key');
  stateDraftCleanupKey.value = '';
  await nextTick();
  stateDraftCleanupKey.value = draftKey;

  localStorage.removeItem(draftKey);
  await nextTick();
  localStorage.removeItem(draftKey);
};

/**
 * 事件：提交表单
 */
const handleEditorSubmit = async (event: FormSubmitEvent<z.output<typeof schema>>) => {
  await refreshSave({
    datas: {
      id: event.data.id,
      name: event.data.name,
      domain: normalizeDomainForUniqueCompare(event.data.baseUrl),
      baseUrl: normalizeBaseUrlForSave(event.data.baseUrl),
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
const handleBlueprintSave = async (payload: ICrawlersEditorSavePayload): Promise<boolean> => {
  /**
   * 常量：target。
   */
  const target = stateDetail.value ?? stateBlueprintDrawerTarget.value;
  if (!target) {
    return false;
  }

  /**
   * 常量：targetId。
   */
  const targetId = Number(target.id ?? 0);

  if (!Number.isFinite(targetId) || targetId <= 0) {
    toast.add({
      title: t('pages.crawlers.editor.saveFeedback.title'),
      description: t('pages.crawlers.editor.loadSource.saveFailed'),
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 4200
    });
    return false;
  }

  const startNodeCrawlerMeta = startNodeCrawlerMetaGet(payload?.flowData);

  if (!startNodeCrawlerMeta || startNodeCrawlerMeta.crawlerTitle === '') {
    toast.add({
      title: t('pages.crawlers.editor.saveFeedback.title'),
      description: t('components.crawler.blueprint.nodes.common.start.form.crawlerTitleRequired'),
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 4200
    });
    return false;
  }

  await refreshCrawlerTaskGraphSave({
    datas: {
      id: stateBlueprintDrawerBlueprintId.value > 0 ? stateBlueprintDrawerBlueprintId.value : undefined,
      targetId,
      name: startNodeCrawlerMeta.crawlerTitle,
      description: startNodeCrawlerMeta.crawlerDescription,
      nodes: payload?.flowData ?? {},
      isEnabled: stateBlueprintDrawerBlueprintId.value > 0 ? stateBlueprintDrawerEnabled.value : true
    },
    replace: true
  });

  const saveHttp = Number(stateCrawlerTaskGraphSaveStatus.value?.http ?? 0);
  const saveFailed = Boolean(stateCrawlerTaskGraphSaveError.value) || (saveHttp >= 400 && saveHttp !== 0);

  if (saveFailed) {
    toast.add({
      title: t('pages.crawlers.editor.saveFeedback.title'),
      description: t('pages.crawlers.editor.loadSource.saveFailed'),
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 4200
    });
    return false;
  }

  toast.add({
    title: t('pages.crawlers.editor.saveFeedback.title'),
    description: t('pages.crawlers.editor.loadSource.saveSuccess'),
    color: 'success',
    icon: 'i-lucide:check-check',
    duration: 2600
  });

  const savedId = Number(stateCrawlerTaskGraphSaveResult.value?.id ?? 0);
  if (Number.isFinite(savedId) && savedId > 0 && stateBlueprintDrawerBlueprintId.value <= 0) {
    stateBlueprintDrawerBlueprintId.value = savedId;
    stateBlueprintDrawerEnabled.value = true;
  }

  await draftRemoveAfterSave(payload?.draftKey);

  const stateBlueprintRefreshNonce = useState<number>('crawlers-blueprints-refresh-nonce');
  if (stateBlueprintRefreshNonce) {
    stateBlueprintRefreshNonce.value = Number(stateBlueprintRefreshNonce.value ?? 0) + 1;
  }
  // 列表刷新由 `crawlers-blueprints-refresh-nonce` 全局 state 驱动，避免直接引用 domain 组件内部方法
  return true;
};

/**
 * 事件：保存蓝图并关闭编辑器。
 * @param {ICrawlersEditorSavePayload} payload 保存载荷。
 * @returns {Promise<void>} Promise。
 */
const handleBlueprintSaveAndClose = async (payload: ICrawlersEditorSavePayload): Promise<void> => {
  const saved = await handleBlueprintSave(payload);

  if (saved) {
    stateCodeSlideoverOpen.value = false;
  }
};

/**
 * 事件：执行当前编辑器蓝图。
 * @param {IPageCrawlerBlueprintEditorExecutePayload} payload 执行载荷。
 * @returns {Promise<void>} Promise。
 */
const handleBlueprintExecute = async (payload: IPageCrawlerBlueprintEditorExecutePayload): Promise<void> => {
  if (stateCrawlerBlueprintExecuting.value) {
    return;
  }

  const target = stateDetail.value ?? stateBlueprintDrawerTarget.value;
  const targetId = Number(target?.id ?? 0);

  if (!target || !Number.isFinite(targetId) || targetId <= 0) {
    toast.add({
      color: 'error',
      title: t('pages.crawlers.blueprints.actions.execute'),
      description: t('pages.crawlers.blueprints.actions.runFailed')
    });
    return;
  }

  stateCrawlerBlueprintExecuting.value = true;

  try {
    await unlockCrawlerBlueprintAudio();

    await executeCrawlerBlueprint({
      blueprintId: Number(stateBlueprintDrawerBlueprintId.value ?? 0),
      targetId,
      siteName: String(target.name ?? computedRouteDetailTitle.value ?? '').trim(),
      baseUrl: String(target.baseUrl ?? '').trim(),
      nodes: payload.flowData ?? {}
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message.trim() : String(error ?? '').trim();

    toast.add({
      color: 'error',
      title: String(target.name ?? computedRouteDetailTitle.value ?? '').trim() || t('pages.crawlers.blueprints.actions.execute'),
      description: errorMessage !== '' ? errorMessage : t('pages.crawlers.blueprints.actions.runFailed')
    });
  } finally {
    stateCrawlerBlueprintExecuting.value = false;
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

  stateFunctionLogicOpen.value = true;
  stateFunctionLogicLoading.value = true;
  stateFunctionLogicDetail.value = null;

  try {
    await refreshFunctionDetail({
      datas: { id },
      replace: true
    });

    const requestFailed = Boolean(stateFunctionDetailError.value) || Number(stateFunctionDetailStatus.value?.http ?? 200) >= 400;
    const remoteDetail = stateFunctionDetailRemote.value;

    console.info(`${FUNCTION_GRAPH_DEBUG_PREFIX} load-detail`, {
      id,
      requestFailed,
      status: stateFunctionDetailStatus.value,
      error: stateFunctionDetailError.value,
      remoteDetailId: Number(remoteDetail?.id ?? 0)
    });

    if (!requestFailed && remoteDetail && Number(remoteDetail.id ?? 0) === id) {
      stateFunctionLogicDetail.value = remoteDetail;
      stateFunctionLogicLoadSource.value = 'server';
      console.info(`${FUNCTION_GRAPH_DEBUG_PREFIX} load-success`, {
        id,
        source: 'server',
        stats: functionGraphStatsGet(remoteDetail.graph),
        snapshot: functionGraphDebugSnapshotGet(remoteDetail.graph)
      });
      return;
    }

    const draftGraph = functionDraftGraphGet(id);

    stateFunctionLogicDetail.value = {
      ...row,
      graph: draftGraph ?? {}
    };

    stateFunctionLogicLoadSource.value = draftGraph ? 'draft' : 'default';
    console.warn(`${FUNCTION_GRAPH_DEBUG_PREFIX} load-fallback`, {
      id,
      source: stateFunctionLogicLoadSource.value,
      reason: requestFailed ? 'request-failed' : 'remote-detail-not-matched',
      status: stateFunctionDetailStatus.value,
      error: stateFunctionDetailError.value,
      stats: functionGraphStatsGet(draftGraph ?? {}),
      snapshot: functionGraphDebugSnapshotGet(draftGraph ?? {})
    });
  } catch (error) {
    const draftGraph = functionDraftGraphGet(id);

    stateFunctionLogicDetail.value = {
      ...row,
      graph: draftGraph ?? {}
    };

    stateFunctionLogicLoadSource.value = draftGraph ? 'draft' : 'default';
    console.error(`${FUNCTION_GRAPH_DEBUG_PREFIX} load-exception`, {
      id,
      source: stateFunctionLogicLoadSource.value,
      error,
      stats: functionGraphStatsGet(draftGraph ?? {}),
      snapshot: functionGraphDebugSnapshotGet(draftGraph ?? {})
    });
  } finally {
    stateFunctionLogicLoading.value = false;
  }
};

/**
 * 事件：保存函数逻辑。
 * @param {ICrawlersEditorSavePayload} payload 保存载荷。
 * @returns {Promise<boolean>} 是否保存成功。
 */
const handleFunctionLogicSave = async (payload: ICrawlersEditorSavePayload): Promise<boolean> => {
  const id = Number(stateFunctionLogicDetail.value?.id ?? 0);

  if (!Number.isFinite(id) || id <= 0) {
    toast.add({
      title: t('pages.crawlers.editor.saveFeedback.title'),
      description: t('pages.crawlers.editor.loadSource.saveFailed'),
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 4200
    });

    return false;
  }

  try {
    const localStats = functionGraphStatsGet(payload?.flowData ?? {});

    console.info(`${FUNCTION_GRAPH_DEBUG_PREFIX} save-request`, {
      id,
      localStats,
      localSnapshot: functionGraphDebugSnapshotGet(payload?.flowData ?? {})
    });

    await refreshFunctionGraphSave({
      datas: {
        id,
        graph: payload?.flowData ?? {}
      },
      replace: true
    });

    const saveHttp = Number(stateFunctionGraphSaveStatus.value?.http ?? 0);
    const saveFailed = Boolean(stateFunctionGraphSaveError.value) || (saveHttp >= 400 && saveHttp !== 0);
    const saveAffected = Number(stateFunctionGraphSaveResult.value?.affected ?? 0);

    console.info(`${FUNCTION_GRAPH_DEBUG_PREFIX} save-http`, {
      id,
      status: stateFunctionGraphSaveStatus.value,
      error: stateFunctionGraphSaveError.value,
      result: stateFunctionGraphSaveResult.value
    });

    if (saveFailed) {
      const code = `${String(stateFunctionGraphSaveStatus.value?.http ?? '000')}-${String(stateFunctionGraphSaveStatus.value?.biz ?? '000')}-${String(stateFunctionGraphSaveStatus.value?.aim ?? '000')}`;

      toast.add({
        title: t('pages.crawlers.editor.saveFeedback.title'),
        description: t('pages.crawlers.editor.loadSource.saveFailedWithCode', { code }),
        color: 'error',
        icon: 'i-lucide:triangle-alert',
        duration: 4200
      });

      console.error(`${FUNCTION_GRAPH_DEBUG_PREFIX} save-http-failed`, {
        id,
        status: stateFunctionGraphSaveStatus.value,
        error: stateFunctionGraphSaveError.value,
        localSnapshot: functionGraphDebugSnapshotGet(payload?.flowData ?? {})
      });
      return false;
    }

    if (!Number.isFinite(saveAffected) || saveAffected <= 0) {
      toast.add({
        title: t('pages.crawlers.editor.saveFeedback.title'),
        description: t('pages.crawlers.editor.loadSource.saveFailed'),
        color: 'error',
        icon: 'i-lucide:triangle-alert',
        duration: 4200
      });

      console.error(`${FUNCTION_GRAPH_DEBUG_PREFIX} save-affected-invalid`, {
        id,
        status: stateFunctionGraphSaveStatus.value,
        error: stateFunctionGraphSaveError.value,
        result: stateFunctionGraphSaveResult.value,
        localSnapshot: functionGraphDebugSnapshotGet(payload?.flowData ?? {})
      });
      return false;
    }

    await refreshFunctionDetail({
      datas: { id },
      replace: true
    });

    const remoteDetail = stateFunctionDetailRemote.value;

    if (remoteDetail && Number(remoteDetail.id ?? 0) === id) {
      stateFunctionLogicDetail.value = remoteDetail;

      const remoteStats = functionGraphStatsGet(remoteDetail.graph);
      console.info(`${FUNCTION_GRAPH_DEBUG_PREFIX} save-echo`, {
        id,
        localStats,
        remoteStats,
        remoteSnapshot: functionGraphDebugSnapshotGet(remoteDetail.graph)
      });

      if (remoteStats.parameters < localStats.parameters || remoteStats.returns < localStats.returns) {
        toast.add({
          title: t('pages.crawlers.editor.saveFeedback.title'),
          description: t('pages.crawlers.editor.loadSource.persistMismatch'),
          color: 'error',
          icon: 'i-lucide:triangle-alert',
          duration: 4200
        });

        console.error(`${FUNCTION_GRAPH_DEBUG_PREFIX} persist-mismatch`, {
          id,
          localStats,
          remoteStats,
          localSnapshot: functionGraphDebugSnapshotGet(payload?.flowData ?? {}),
          remoteSnapshot: functionGraphDebugSnapshotGet(remoteDetail.graph)
        });
      }
    } else if (stateFunctionLogicDetail.value) {
      toast.add({
        title: t('pages.crawlers.editor.saveFeedback.title'),
        description: t('pages.crawlers.editor.loadSource.saveEchoMissing'),
        color: 'warning',
        icon: 'i-lucide:triangle-alert',
        duration: 3800
      });

      console.warn(`${FUNCTION_GRAPH_DEBUG_PREFIX} save-echo-missing`, {
        id,
        status: stateFunctionDetailStatus.value,
        error: stateFunctionDetailError.value
      });

      stateFunctionLogicDetail.value = {
        ...stateFunctionLogicDetail.value,
        graph: payload?.flowData ?? {}
      };
    }

    stateFunctionRefreshNonce.value += 1;

    toast.add({
      title: t('pages.crawlers.editor.saveFeedback.title'),
      description: t('pages.crawlers.editor.loadSource.saveSuccess'),
      color: 'success',
      icon: 'i-lucide:check-check',
      duration: 2600
    });

    await draftRemoveAfterSave(payload?.draftKey);
    return true;
  } catch (error) {
    toast.add({
      title: t('pages.crawlers.editor.saveFeedback.title'),
      description: t('pages.crawlers.editor.loadSource.saveFailed'),
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 4200
    });

    console.error(`${FUNCTION_GRAPH_DEBUG_PREFIX} save-exception`, {
      id,
      error,
      localSnapshot: functionGraphDebugSnapshotGet(payload?.flowData ?? {})
    });
    return false;
  }
};

/**
 * 事件：保存函数逻辑并关闭编辑器。
 * @param {ICrawlersEditorSavePayload} payload 保存载荷。
 * @returns {Promise<void>} Promise。
 */
const handleFunctionLogicSaveAndClose = async (payload: ICrawlersEditorSavePayload): Promise<void> => {
  const saved = await handleFunctionLogicSave(payload);

  if (saved) {
    stateFunctionLogicOpen.value = false;
  }
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
