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

          <UInput ref="refToolbarSearchInput" v-model="stateToolbarKeyword" :placeholder="t('pages.crawlers.searchPlaceholder')" :ui="{ trailing: 'pe-1' }" class="w-56 xl:w-64" @keyup.enter="handleKeywordApply">
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

    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="computedEditorTitle" :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm id="crawlerTargetEditorForm" :schema="schema" :state="stateEditor" class="w-full max-w-none space-y-4" @submit="handleEditorSubmit">
          <UFormField required name="name" :label="t('pages.crawlers.targets.form.name.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UInput v-model="stateEditor.name" class="z-1 w-full" :placeholder="t('pages.crawlers.targets.form.name.placeholder')" />
          </UFormField>

          <UFormField required name="domain" :label="t('pages.crawlers.targets.form.domain.label')" :help="computedUniqueDomainHelp" :error="computedUniqueDomainError" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UrlInput v-model="stateEditor.domain" base-url-only class="z-1 w-full" :placeholder="t('pages.crawlers.targets.form.domain.placeholder')" />
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
import type { NavigationMenuItem } from '@nuxt/ui';
import { z } from 'zod';

import UrlInput from '@/components/form/url-input/index.vue';

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
const refToolbarSearchInput = useTemplateRef('refToolbarSearchInput');

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
  const value = route.params.domain;
  return typeof value === 'string' ? value : Array.isArray(value) ? value[0] ?? '' : '';
});

/**
 * 函数：将域名转换为站点显示名
 * @param {string} domain 域名
 * @returns {string} 站点显示名
 */
const domainDisplayNameGet = (domain: string): string => {
  const trimmed = domain.trim();
  if (trimmed === '') {
    return t('pages.crawlers.targets.title');
  }

  const host = trimmed.split('/')[0].split('.')[0] ?? trimmed;
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
  description: '',
  isEnabled: true
});

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
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 计算属性：详情页标题
 */
const computedRouteDetailTitle = computed<string>(() => {
  const detailName = String(stateDetail.value?.name ?? '').trim();
  if (detailName !== '') {
    return detailName;
  }

  const domain = computedDomain.value;
  return domain !== '' ? domainDisplayNameGet(domain) : t('pages.crawlers.targets.title');
});

/**
 * 监听：站点详情变化时同步面包屑
 */
watch(
  stateDetail,
  (value) => {
    if (!computedRouteIsDetail.value) {
      return;
    }

    const title = String(value?.name ?? computedDomain.value).trim() || computedDomain.value;

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
        label: title,
        icon: 'i-lucide:globe',
        to: localePath(`/crawlers/${encodeURIComponent(computedDomain.value)}`),
        exact: true
      }
    ];
  },
  { immediate: true }
);

/**
 * 事件：编辑站点
 */
const handleEditTarget = () => {
  stateEditor.value = {
    id: Number(stateDetail.value?.id ?? 0),
    name: String(stateDetail.value?.name ?? ''),
    domain: String(stateDetail.value?.domain ?? computedDomain.value),
    description: String(stateDetail.value?.description ?? ''),
    isEnabled: Boolean(stateDetail.value?.isEnabled ?? true)
  };

  stateEditorOpen.value = true;
};

/**
 * 事件：添加任务
 */
const handleAddTask = () => {
  // TODO: 打开添加任务弹窗
};

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
 * API：保存（新增/编辑）
 */
const { refresh: refreshSave } = await useApi<{ affected: number }>('crawlers/targets/add', { method: 'POST', immediate: false });

/**
 * 事件：提交表单
 */
const handleEditorSubmit = async (event: FormSubmitEvent<IPageCrawlerTargetForm>) => {
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
 * 监听：路由变化时同步面包屑
 */
watch(
  () => route.path,
  () => {
    if (computedRouteIsDetail.value) {
      const detailDomain = typeof route.params.domain === 'string' ? route.params.domain.trim() : '';
      const detailTitle = detailDomain !== '' ? domainDisplayNameGet(detailDomain) : t('pages.crawlers.targets.title');

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
          label: detailTitle,
          icon: 'i-lucide:globe',
          to: route.path,
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
  },
  { immediate: true }
);

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
  // 触发搜索
};

/**
 * 事件：重置筛选
 */
const handleFilterReset = () => {
  stateToolbarKeyword.value = '';
};

/**
 * 快捷键
 */
defineShortcuts({
  /**
   * 聚焦搜索框
   */
  '/': () => {
    refToolbarSearchInput.value?.inputRef?.focus();
  }
});
</script>
