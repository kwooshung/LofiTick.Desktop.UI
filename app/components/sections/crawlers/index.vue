<template>
  <div class="flex flex-col">
    <DashboardPage direction="horizontal" :padded="false" class="p-4 sm:gap-3 sm:p-3">
      <template v-if="computedCrawlerRows.length > 0">
        <Folder v-for="item in computedCrawlerRows" :key="item.id" :label="item.name" icon-name="i-lucide:globe" :to="localePath(`/crawlers/${encodeURIComponent(item.domain)}`)" />
      </template>
      <div v-else class="flex flex-1 items-center justify-center py-12">
        <UEmpty icon="i-lucide:globe" :title="t('pages.crawlers.targets.empty.title')" :description="t('pages.crawlers.targets.empty.description')" />
      </div>
    </DashboardPage>

    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="stateEditor.id ? t('pages.crawlers.targets.edit') : t('pages.crawlers.targets.add')" :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm id="crawlerTargetEditorForm" :schema="schema" :state="stateEditor" class="w-full max-w-none space-y-4" @submit="onSubmit">
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
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
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
 * Props
 */
const props = withDefaults(defineProps<IPageCrawlersTargetsProps>(), {
  createNonce: 0,
  keyword: ''
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
  description: '',
  isEnabled: true
});

/**
 * API：获取站点列表
 */
const { datas: stateDatas, refresh: refreshList } = await useApi<{ rows: IQueryResultCrawlerTargetRow[] }>('crawlers/targets', {
  immediate: true,
  query: String(props.keyword ?? '').trim() !== '' ? { keyword: String(props.keyword).trim() } : undefined
});

/**
 * 计算属性：爬虫目标站点列表。
 */
const computedCrawlerRows = computed<IQueryResultCrawlerTargetRow[]>(() => stateDatas.value?.rows ?? []);

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
 * 事件：点击新增
 */
const handleCreate = () => {
  stateEditor.value = {
    id: 0,
    name: '',
    domain: '',
    description: '',
    isEnabled: true
  };
  stateEditorOpen.value = true;
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
 * 监听：createNonce 变化
 */
watch(
  () => props.createNonce,
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
      name: event.data.name,
      domain: event.data.domain,
      description: event.data.description ?? '',
      isEnabled: event.data.isEnabled ?? true
    },
    replace: true
  });

  stateEditorOpen.value = false;
  await refreshList();
};
</script>
