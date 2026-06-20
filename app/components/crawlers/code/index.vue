<template>
  <USlideover
    v-model:open="open"
    :title="computedDrawerTitle"
    :description="computedDrawerDescription"
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
        v-if="open"
        :key="computedEditorKey"
        :site-name="computedDrawerSiteName"
        :base-url="computedDrawerBaseUrl"
        :target-id="computedDrawerTargetId"
        :groups="computedBlueprintGroups"
        :selected-key="computedSelectedKey"
        :function-refresh-nonce="functionRefreshNonce"
        :initial-flow-data="initialFlowData"
        :initial-load-source="initialLoadSource"
        @cancel="open = false"
        @click="handleEditorClick"
        @save="handleSave"
        @create-function="handleEditorCreateFunction"
        @edit-function-logic="handleEditorEditFunctionLogic"
        @functions-changed="handleEditorFunctionsChanged"
      />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { ICrawlersCodeEmits, ICrawlersCodeProps } from '@/components/crawlers/code/index.types';
import type { ICrawlersEditorSavePayload } from '@/components/crawlers/editor/index.types';
import type { ICrawlersEditorSidebarFunctionRow } from '@/components/crawlers/editor/sidebar/index.types';
import type { ICrawlersListRow } from '@/components/crawlers/list/index.types';
/**
 * 属性：站点名称与基础 URL。
 */
const { siteName = '', baseUrl = '', targetId = 0, groups = [], selectedKey = '', functionRefreshNonce = 0, initialFlowData = null, initialLoadSource } = defineProps<ICrawlersCodeProps>();

/**
 * 事件：蓝图抽屉事件。
 */
const emit = defineEmits<ICrawlersCodeEmits>();

/**
 * 状态：蓝图抽屉目标站点。
 */
const stateDrawerTarget = useState<IQueryResultCrawlerTargetRow | null>('crawlers-blueprint-target', () => null);

/**
 * 路由：当前路由。
 */
const route = useRoute();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：爬虫蓝图。
 */
const { groups: blueprintGroups } = useCrawlerBlueprintNodesMenu();

/**
 * 函数：将站点域名转成展示名称。
 * @param {string} domain 站点域名。
 * @returns {string} 展示名称。
 */
const domainDisplayNameGet = (domain: string): string => {
  /**
   * 常量：trimmed。
   */
  const trimmed = String(domain ?? '').trim();

  if (trimmed === '') {
    return '';
  }

  /**
   * 常量：host。
   */
  const host = trimmed.split('/')[0]?.split('.')?.[0]?.trim() ?? '';

  if (host === '') {
    return trimmed;
  }

  return host.charAt(0).toUpperCase() + host.slice(1);
};

/**
 * 计算属性：当前站点域名。
 */
const computedCurrentDomain = computed(() => {
  /**
   * 常量：value。
   */
  const value = route.params.domain;

  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return String(value[0] ?? '').trim();
  }

  return '';
});

/**
 * 计算属性：当前站点展示名称。
 */
const computedCurrentSiteName = computed(() => domainDisplayNameGet(computedCurrentDomain.value));

/**
 * 计算属性：抽屉站点名称。
 */
const computedDrawerSiteName = computed(() => {
  /**
   * 常量：targetName。
   */
  const targetName = String(stateDrawerTarget.value?.name ?? '').trim();
  if (targetName !== '') {
    return targetName;
  }

  /**
   * 常量：siteNameText。
   */
  const siteNameText = String(siteName ?? '').trim();

  return siteNameText !== '' ? siteNameText : computedCurrentSiteName.value;
});

/**
 * 常量：编辑区标题。
 */
const editorDrawerTitle = t('pages.crawlers.editor.title');

/**
 * 计算属性：抽屉标题。
 */
const computedDrawerTitle = computed(() => {
  /**
   * 常量：siteName。
   */
  const siteName = computedDrawerSiteName.value;

  return siteName !== '' ? `${editorDrawerTitle} / ${siteName}` : editorDrawerTitle;
});

/**
 * 计算属性：抽屉基础 URL。
 */
const computedDrawerBaseUrl = computed(() => {
  /**
   * 常量：targetBaseUrl。
   */
  const targetBaseUrl = String(stateDrawerTarget.value?.baseUrl ?? '').trim();
  if (targetBaseUrl !== '') {
    return targetBaseUrl;
  }

  return String(baseUrl ?? '').trim();
});

/**
 * 计算属性：抽屉站点 ID。
 */
const computedDrawerTargetId = computed<number>(() => {
  /**
   * 常量：targetIdValue。
   */
  const targetIdValue = Number(stateDrawerTarget.value?.id ?? targetId ?? 0);

  return Number.isFinite(targetIdValue) && targetIdValue > 0 ? targetIdValue : 0;
});

/**
 * 计算属性：抽屉描述。
 */
const computedDrawerDescription = computed(() => {
  return computedDrawerBaseUrl.value;
});

/**
 * 计算属性：蓝图分组。
 */
const computedBlueprintGroups = computed(() => (groups.length > 0 ? groups : blueprintGroups.value));

/**
 * 计算属性：默认选中节点。
 */
const computedSelectedKey = computed(() => (selectedKey !== '' ? selectedKey : (computedBlueprintGroups.value[0]?.crawlers[0]?.key ?? '')));

/**
 * 计算属性：编辑器重建 key。
 */
const computedEditorKey = computed(() => {
  return [computedDrawerTargetId.value, computedDrawerBaseUrl.value, computedDrawerSiteName.value].join('|');
});

/**
 * 双向绑定：抽屉开关。
 */
const open = defineModel<boolean>('open', {
  default: false
});

/**
 * 事件：保存蓝图。
 * @param {ICrawlersEditorSavePayload} payload 保存载荷。
 */
const handleSave = (payload: ICrawlersEditorSavePayload) => {
  emit('save', payload);
  open.value = false;
};

/**
 * 函数：处理列表点击。
 * @param {ICrawlersListRow} row 条目。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleEditorClick = (row: ICrawlersListRow, event: MouseEvent): void => {
  emit('click', row, event);
};

/**
 * 函数：处理编辑器创建函数事件。
 * @param {'site' | 'global'} scope 作用域。
 * @returns {void} 无返回值。
 */
const handleEditorCreateFunction = (scope: 'site' | 'global'): void => {
  emit('createFunction', scope);
};

/**
 * 函数：处理编辑器编辑函数逻辑事件。
 * @param {ICrawlersEditorSidebarFunctionRow} row 函数行。
 * @returns {void} 无返回值。
 */
const handleEditorEditFunctionLogic = (row: ICrawlersEditorSidebarFunctionRow): void => {
  emit('editFunctionLogic', row);
};

/**
 * 函数：转发函数元数据变更。
 * @returns {void} 无返回值。
 */
const handleEditorFunctionsChanged = (): void => {
  emit('functionsChanged');
};
</script>
