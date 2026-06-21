<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-3">
      <div class="flex w-full flex-1 gap-1">
        <div class="flex-1">
          <UTable
            :columns="columns"
            :data="computedQqGroupDatas"
            :loading="loading"
            class="shrink-0"
            sticky
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
              td: 'border-b border-default',
              separator: 'h-0'
            }"
          />
        </div>
      </div>
      <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div class="muted text-sm">{{ t('pages.socials.qq.groups.result.footer.total', { total: Number(datas?.total ?? 0) }) }}</div>
        <div class="flex items-center gap-1.5">
          <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
        </div>
      </div>
    </div>
    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="stateEditor.id ? t('pages.socials.qq.groups.edit') : t('pages.socials.qq.groups.add')" :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm id="qqGroupEditorForm" :schema="schema" :state="stateEditor" class="w-full max-w-none space-y-4" @submit="onSubmit">
          <UFormField required name="name" :label="t('pages.socials.qq.groups.form.name.label')" :help="computedUniqueNameHelp" :error="computedUniqueNameError" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UInput v-model="stateEditor.name" class="z-1 w-full" :placeholder="t('pages.socials.qq.groups.form.name.placeholder')" />
            <template #error="{ error }">
              <p v-if="error">{{ error }}</p>
            </template>
          </UFormField>
          <UFormField required name="number" :label="t('pages.socials.qq.groups.form.number.label')" :help="computedUniqueNumberHelp" :error="computedUniqueNumberError" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UInput v-model="stateEditor.number" class="z-1 w-full" :placeholder="t('pages.socials.qq.groups.form.number.placeholder')" />
            <template #error="{ error }">
              <p v-if="error">{{ error }}</p>
            </template>
          </UFormField>
          <UFormField required name="size" :label="t('pages.socials.qq.groups.form.size.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <USelect v-model="stateEditor.size" class="w-full" :items="sizeSelectItems" value-key="value" :placeholder="t('pages.socials.qq.groups.form.size.placeholder')" />
          </UFormField>
          <UFormField required name="url" :label="t('pages.socials.qq.groups.form.url.label')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <UTextarea v-model="stateEditor.url" class="w-full" :rows="3" autoresize :placeholder="t('pages.socials.qq.groups.form.url.placeholder')" />
          </UFormField>
          <UFormField name="full" :label="t('pages.socials.qq.groups.result.table.full')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <USwitch v-model="stateEditor.full" />
          </UFormField>
          <UFormField name="enabled" :label="t('common.labels.enabled')" :ui="{ error: 'empty:mt-0 empty:-translate-y-full transition-[margin,transform] duration-300 z-0' }">
            <USwitch v-model="stateEditor.enabled" />
          </UFormField>
        </UForm>
      </template>
      <template #footer="{ close }">
        <UButton type="button" color="neutral" variant="outline" @click="close">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="submit" form="qqGroupEditorForm" icon="i-lucide-save" color="primary" :disabled="!computedCanSubmit">{{ t('common.actions.save') }}</UButton>
      </template>
    </UModal>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui';
import { z } from 'zod';

/**
 * 属性：页面刷新标记。
 */
const { createNonce = 0 } = defineProps<IPageQqGroupsProps>();

/**
 * 组件：Nuxt 时间显示组件
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：按钮
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：链接
 */
const ULink = resolveComponent('ULink');

/**
 * 组件：开关
 */
const USwitch = resolveComponent('USwitch');

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 窗口能力
 */
const { openExternalUrl } = useTauriWindow();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 路由
 */
const route = useRoute();

/**
 * 状态：分页大小 cookie。
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow'
});

/**
 * 函数：获取当前生效分页大小。
 * @returns {string} 分页大小文本。
 */
const currentPageSizeGet = (): string => {
  /**
   * 常量：routeValue。
   */
  const routeValue = typeof route.query.pagesize !== 'undefined' ? String(route.query.pagesize).trim() : '';

  if (routeValue !== '') {
    return routeValue;
  }

  return String(getPageSizeByCookieParsed(pagesizesCookie.value, 'common'));
};

/**
 * 函数：从路由查询参数构建接口查询参数
 * @returns {Record<string,string|string[]>} 查询参数
 */
const buildApiQueryFromRoute = (): Record<string, string | string[]> => {
  const query: Record<string, string | string[]> = {};

  /**
   * 常量：name。
   */
  const name = typeof route.query.name !== 'undefined' ? String(route.query.name).trim() : '';
  if (name) {
    query.name = name;
  }

  /**
   * 常量：number。
   */
  const number = typeof route.query.number !== 'undefined' ? String(route.query.number).trim() : '';
  if (number) {
    query.number = number;
  }

  if (String(route.query.is_and) === '1') {
    query.is_and = '1';
  }

  /**
   * 常量：asArray。
   */
  const asArray = (v: unknown): string[] => (Array.isArray(v) ? v.map((i) => String(i)) : v != null ? [String(v)] : []);

  /**
   * 常量：sizes。
   */
  const sizes = asArray(route.query.size);
  if (sizes.length > 0) {
    query.size = sizes;
  }

  if (typeof route.query.full !== 'undefined') {
    query.full = String(route.query.full);
  }

  if (typeof route.query.enabled !== 'undefined') {
    query.enabled = String(route.query.enabled);
  }

  if (typeof route.query.page !== 'undefined') {
    query.page = String(route.query.page);
  }

  query.pagesize = currentPageSizeGet();

  if (typeof route.query.order_by !== 'undefined') {
    /**
     * 常量：by。
     */
    const by = String(route.query.order_by);
    if (by === 'id' || by === 'number' || by === 'size' || by === 'updated' || by === 'created') {
      query.order_by = by;
    }
  }

  if (typeof route.query.order_dir !== 'undefined') {
    /**
     * 常量：dir。
     */
    const dir = String(route.query.order_dir).toLowerCase();
    if (dir === 'asc' || dir === 'desc') {
      query.order_dir = dir;
    }
  }

  return query;
};

/**
 * 排序：切换指定字段（互斥）
 * @param {'id' | 'number' | 'size' | 'updated' | 'created'} field 排序字段
 */
const toggleSort = (field: 'id' | 'number' | 'size' | 'updated' | 'created') => {
  /**
   * 常量：currentBy。
   */
  const currentBy = String(route.query.order_by || 'id');
  /**
   * 常量：currentDir。
   */
  const currentDir = String(route.query.order_dir || 'desc');
  /**
   * 常量：nextBy。
   */
  const nextBy = field;
  /**
   * 常量：nextDir。
   */
  const nextDir = currentBy === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'desc';
  const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
  q.order_by = nextBy;
  q.order_dir = nextDir;
  navigateTo({ path: route.path, query: q });
};

/**
 * API：QQ群搜索
 */
const { datas, loading, refreshDebounced } = await useApi<IQueryResultSocialQqGroupSummaryPage>('socials/qq/groups', { datas: buildApiQueryFromRoute(), immediate: true });

/**
 * API：群号/名称查重（防抖请求）
 */
const {
  datas: stateUniqueDatas,
  loading: stateUniqueLoading,
  refreshDebounced: refreshUniqueDebounced
} = await useApi<{ nameExists: boolean; numberExists: boolean }>('socials/qq/groups/unique', {
  datas: {},
  immediate: false
});

/**
 * API：更新启用状态（复用实例，避免 useFetch key 缓存导致后续不请求）
 */
const { refresh: refreshSetEnabled } = await useApi<{ affected: number }>('socials/qq/groups/enabled', { method: 'POST', immediate: false });

/**
 * API：更新满员状态（复用实例，避免 useFetch key 缓存导致后续不请求）
 */
const { refresh: refreshSetFull } = await useApi<{ affected: number }>('socials/qq/groups/full', { method: 'POST', immediate: false });

/**
 * API：保存（新增/编辑）
 * - 禁止在函数中直接调用 useApi，统一在这里集中定义
 */
const { refresh: refreshSave } = await useApi<{ affected: number }>('socials/qq/groups/add', { method: 'POST', immediate: false });

/**
 * 状态：名称查重结果
 */
const stateUniqueNameExists = ref(false);

/**
 * 状态：号码查重结果
 */
const stateUniqueNumberExists = ref(false);

/**
 * 状态：当前正在查重的名称字段（用于 help 文案精准显示）
 */
const stateUniqueCheckingName = ref(false);

/**
 * 状态：当前正在查重的号码字段（用于 help 文案精准显示）
 */
const stateUniqueCheckingNumber = ref(false);

/**
 * 计算属性：名称查重提示（使用 FormField help，默认行为：有内容才展示）
 */
const computedUniqueNameHelp = computed<string | undefined>(() => {
  if (!stateEditorOpen.value) {
    return undefined;
  }

  /**
   * 常量：name。
   */
  const name = String(stateEditor.value.name ?? '').trim();
  if (!name) {
    return undefined;
  }

  /**
   * 常量：valid。
   */
  const valid = schema.pick({ name: true }).safeParse({ name }).success;
  if (!valid) {
    return undefined;
  }

  if (stateUniqueLoading.value && stateUniqueCheckingName.value) {
    return t('pages.socials.qq.groups.form.unique.checking');
  }
  return undefined;
});

/**
 * 计算属性：名称查重错误（error）
 */
const computedUniqueNameError = computed<string | undefined>(() => {
  if (!stateEditorOpen.value) {
    return undefined;
  }

  /**
   * 常量：name。
   */
  const name = String(stateEditor.value.name ?? '').trim();
  if (!name) {
    return undefined;
  }

  return stateUniqueNameExists.value ? t('pages.socials.qq.groups.form.unique.nameExists') : undefined;
});

/**
 * 计算属性：群号查重提示（help）
 */
const computedUniqueNumberHelp = computed<string | undefined>(() => {
  if (!stateEditorOpen.value) {
    return undefined;
  }

  /**
   * 常量：number。
   */
  const number = String(stateEditor.value.number ?? '').trim();
  if (!number) {
    return undefined;
  }

  /**
   * 常量：valid。
   */
  const valid = schema.pick({ number: true }).safeParse({ number }).success;
  if (!valid) {
    return undefined;
  }

  if (stateUniqueLoading.value && stateUniqueCheckingNumber.value) {
    return t('pages.socials.qq.groups.form.unique.checking');
  }
  return undefined;
});

/**
 * 计算属性：群号查重错误（error，优先级高于 help 且会给输入框上 error 颜色）
 */
const computedUniqueNumberError = computed<string | undefined>(() => {
  if (!stateEditorOpen.value) {
    return undefined;
  }

  /**
   * 常量：number。
   */
  const number = String(stateEditor.value.number ?? '').trim();
  if (!number) {
    return undefined;
  }

  return stateUniqueNumberExists.value ? t('pages.socials.qq.groups.form.unique.numberExists') : undefined;
});

/**
 * 状态：群号复制反馈
 */
const stateCopiedNumberId = ref<number | null>(null);
let stateCopiedNumberTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * 函数：复制到剪贴板
 * @param {string} text 文本
 * @returns {Promise<boolean>} 是否成功
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!import.meta.client) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      /**
       * 常量：el。
       */
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      el.style.top = '-9999px';
      document.body.appendChild(el);
      el.focus();
      el.select();
      /**
       * 常量：ok。
       */
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
};

/**
 * 事件：复制群号（复制成功后短暂显示对号）
 * @param {IPageTableColumnQqGroup} row 行数据
 */
const handleCopyGroupNumber = async (row: IPageTableColumnQqGroup): Promise<void> => {
  /**
   * 常量：ok。
   */
  const ok = await copyToClipboard(String(row.number ?? ''));
  if (!ok) {
    return;
  }

  stateCopiedNumberId.value = row.id;
  if (stateCopiedNumberTimer) {
    clearTimeout(stateCopiedNumberTimer);
  }
  stateCopiedNumberTimer = setTimeout(() => {
    if (stateCopiedNumberId.value === row.id) {
      stateCopiedNumberId.value = null;
    }
  }, 1500);
};

/**
 * 函数：构建群链接地址。
 * @param {IPageTableColumnQqGroup} row 行数据
 * @returns {string} 链接地址
 */
const buildGroupLinkUrl = (row: IPageTableColumnQqGroup): string => String(row.url ?? '').trim();

/**
 * 事件：点击群链接。
 * @param {MouseEvent} event 点击事件
 * @param {IPageTableColumnQqGroup} row 行数据
 */
const handleGroupLinkClick = async (event: MouseEvent, row: IPageTableColumnQqGroup): Promise<void> => {
  /**
   * 常量：url。
   */
  const url = buildGroupLinkUrl(row);
  if (!url) {
    event.preventDefault();
    return;
  }

  if (isTauriRuntime.value) {
    event.preventDefault();
    await openExternalUrl(url);
  }
};

/**
 * 函数：群规模文案
 * @param {number} count 人数
 * @returns {string} 文案
 */
const getSizeLabel = (count: number): string => t('pages.socials.qq.groups.form.size.item', { count });

/**
 * 计算属性：将接口返回映射为表格需要的格式
 */
const computedQqGroupDatas = computed<IPageTableColumnQqGroup[]>(() => {
  if (!datas.value || !datas.value.rows || datas.value.rows.length === 0) {
    return [];
  }

  return datas.value.rows.map((item) => ({
    id: item.id,
    name: item.name,
    number: String(item.number),
    size: item.size,
    url: item.url,
    full: item.full,
    enabled: item.enabled,
    times: {
      updated: item.updated,
      created: item.created
    }
  }));
});

/**
 * 计算属性：当前页（与路由同步）
 */
const computedPage = computed<number>({
  get: () => {
    /**
     * 常量：str。
     */
    const str = route.query.page as string | undefined;
    /**
     * 常量：num。
     */
    const num = parseInt(str ?? '', 10);
    return Number.isFinite(num) && num > 0 ? num : 1;
  },
  set: (value: number) => {
    const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
    q.page = String(Math.max(1, value));
    navigateTo({ path: route.path, query: q });
  }
});

/**
 * 计算属性：每页数量
 */
const computedItemsPerPage = computed<number>(() => {
  /**
   * 常量：str。
   */
  const str = route.query.pagesize as string | undefined;
  /**
   * 函数：parsed。
   */
  const parsed = parseInt(str ?? '', 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  /**
   * 常量：cookieSize。
   */
  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'common');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }
  /**
   * 常量：apiSize。
   */
  const apiSize = Number(datas.value?.pageSize ?? 20);
  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 函数：切换启用状态
 * @param {IPageTableColumnQqGroup} row 行数据
 * @param {boolean} value 启用状态
 */
const handleToggleEnabled = async (row: IPageTableColumnQqGroup, value: boolean) => {
  /**
   * 常量：prev。
   */
  const prev = row.enabled;
  row.enabled = value;

  try {
    await refreshSetEnabled({ datas: { id: row.id, enabled: value }, replace: true });
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  } catch {
    row.enabled = prev;
  }
};

/**
 * 函数：切换满员状态
 * @param {IPageTableColumnQqGroup} row 行数据
 * @param {boolean} value 满员状态
 */
const handleToggleFull = async (row: IPageTableColumnQqGroup, value: boolean) => {
  /**
   * 常量：prev。
   */
  const prev = row.full;
  row.full = value;

  try {
    await refreshSetFull({ datas: { id: row.id, full: value }, replace: true });
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  } catch {
    row.full = prev;
  }
};

/**
 * 监听：查询参数变化时刷新列表（防抖）
 */
watch(
  () => route.query,
  () => {
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  }
);

/**
 * 常量：规模下拉项
 */
const sizeSelectItems = [
  { label: getSizeLabel(200), value: 20 },
  { label: getSizeLabel(500), value: 50 },
  { label: getSizeLabel(1000), value: 100 },
  { label: getSizeLabel(2000), value: 200 },
  { label: getSizeLabel(5000), value: 500 }
];

/**
 * 常量：表单验证规则
 */
const schema = z.object({
  id: z.number().optional(),
  name: z
    .string({ message: t('pages.socials.qq.groups.form.name.verify.required') })
    .trim()
    .min(1, t('pages.socials.qq.groups.form.name.verify.required'))
    .max(64, t('pages.socials.qq.groups.form.name.verify.length')),
  number: z
    .string({ message: t('pages.socials.qq.groups.form.number.verify.required') })
    .trim()
    .min(1, t('pages.socials.qq.groups.form.number.verify.required'))
    .regex(/^\d{5,12}$/, t('pages.socials.qq.groups.form.number.verify.pattern')),
  size: z.number({ message: t('pages.socials.qq.groups.form.size.verify.required') }).refine((val) => [20, 50, 100, 200, 500].includes(val), { message: t('pages.socials.qq.groups.form.size.verify.pattern') }),
  url: z
    .string({ message: t('pages.socials.qq.groups.form.url.verify.required') })
    .trim()
    .min(1, t('pages.socials.qq.groups.form.url.verify.required'))
    .url(t('pages.socials.qq.groups.form.url.verify.pattern')),
  full: z.boolean().optional(),
  enabled: z.boolean().optional()
});

/**
 * 类型：表单数据
 */
type Schema = z.output<typeof schema>;

/**
 * 计算属性：表单是否可提交
 */
const computedCanSubmit = computed(() => schema.safeParse({ ...stateEditor.value }).success && !stateUniqueNameExists.value && !stateUniqueNumberExists.value);

/**
 * 状态：编辑器开关
 */
const stateEditorOpen = ref(false);

/**
 * 状态：编辑器表单
 */
const stateEditor = ref<IPageQqGroupForm>({
  id: 0,
  name: '',
  number: '',
  size: 20,
  url: '',
  full: false,
  enabled: true
});

/**
 * 事件：点击新增
 */
const handleCreate = () => {
  stateEditor.value = {
    id: 0,
    name: '',
    number: '',
    size: 20,
    url: '',
    full: false,
    enabled: true
  };
  stateEditorOpen.value = true;
};

/**
 * 监听：查重接口返回
 */
watch(
  stateUniqueDatas,
  (val) => {
    stateUniqueNameExists.value = Boolean(val?.nameExists);
    stateUniqueNumberExists.value = Boolean(val?.numberExists);
  },
  { immediate: true }
);

watch(stateUniqueLoading, (isLoading) => {
  if (!isLoading) {
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
  }
});

/**
 * 监听：编辑器打开/输入变化时触发查重（防抖）
 */
watch([stateEditorOpen, () => stateEditor.value.id, () => stateEditor.value.name, () => stateEditor.value.number], ([isOpen]) => {
  if (!isOpen) {
    stateUniqueNameExists.value = false;
    stateUniqueNumberExists.value = false;
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
    return;
  }

  /**
   * 常量：id。
   */
  const id = Number(stateEditor.value.id ?? 0);
  /**
   * 常量：name。
   */
  const name = String(stateEditor.value.name ?? '').trim();
  /**
   * 常量：number。
   */
  const number = String(stateEditor.value.number ?? '').trim();

  if (!name && !number) {
    stateUniqueNameExists.value = false;
    stateUniqueNumberExists.value = false;
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
    return;
  }

  /**
   * 常量：shouldCheckName。
   */
  const shouldCheckName = !!name && schema.pick({ name: true }).safeParse({ name }).success;
  /**
   * 常量：shouldCheckNumber。
   */
  const shouldCheckNumber = !!number && schema.pick({ number: true }).safeParse({ number }).success;

  // 字段不合法时，清掉旧的查重结果，避免残留“重复”提示
  if (!shouldCheckName) {
    stateUniqueNameExists.value = false;
  }
  if (!shouldCheckNumber) {
    stateUniqueNumberExists.value = false;
  }

  if (!shouldCheckName && !shouldCheckNumber) {
    stateUniqueCheckingName.value = false;
    stateUniqueCheckingNumber.value = false;
    return;
  }

  stateUniqueCheckingName.value = shouldCheckName;
  stateUniqueCheckingNumber.value = shouldCheckNumber;

  refreshUniqueDebounced({
    datas: {
      id: Number.isFinite(id) && id > 0 ? id : undefined,
      name: shouldCheckName ? name : undefined,
      number: shouldCheckNumber ? number : undefined
    }
  });
});

onBeforeUnmount(() => {
  if (stateCopiedNumberTimer) {
    clearTimeout(stateCopiedNumberTimer);
  }
});

watch(
  () => createNonce,
  (value, oldValue) => {
    if (typeof value === 'number' && typeof oldValue === 'number' && value !== oldValue) {
      handleCreate();
    }
  }
);

/**
 * 事件：点击编辑
 * @param {IPageTableColumnQqGroup} row 行数据
 */
const handleEdit = (row: IPageTableColumnQqGroup) => {
  stateEditor.value = {
    id: row.id,
    name: row.name,
    number: row.number,
    size: row.size,
    url: row.url,
    full: row.full,
    enabled: row.enabled
  };
  stateEditorOpen.value = true;
};

/**
 * 事件：提交表单
 */
const handleSubmit = async (payload: Schema) => {
  if (stateUniqueNameExists.value || stateUniqueNumberExists.value) {
    return;
  }

  await refreshSave({
    datas: {
      id: payload.id || undefined,
      name: payload.name,
      number: payload.number,
      size: payload.size,
      url: payload.url,
      full: payload.full,
      enabled: payload.enabled
    },
    replace: true
  });

  stateEditorOpen.value = false;
  refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
};

/**
 * 事件：提交表单
 * @param {FormSubmitEvent<Schema>} e 表单提交事件
 */
const onSubmit = async (e: FormSubmitEvent<Schema>): Promise<void> => {
  if (schema.safeParse(e.data).success) {
    await handleSubmit(e.data);
  }
};

/**
 * 常量：表格列定义
 */
const columns: TableColumn<IPageTableColumnQqGroup>[] = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-15',
        td: 'w-15'
      }
    },
    header: () => {
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'id' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.id'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('id') });
    },
    cell: ({ row }) => row.original.id.toString().padStart(5, '0')
  },
  {
    accessorKey: 'name',
    meta: {
      class: {
        th: 'w-auto',
        td: 'w-auto'
      }
    },
    header: t('pages.socials.qq.groups.result.table.name'),
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: 'number',
    meta: {
      class: {
        th: 'w-auto',
        td: 'w-auto'
      }
    },
    header: () => {
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'number' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.number'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('number') });
    },
    cell: ({ row }) => {
      /**
       * 函数：isCopied。
       */
      const isCopied = stateCopiedNumberId.value === row.original.id;
      /**
       * 常量：icon。
       */
      const icon = isCopied ? 'i-lucide-copy-check' : 'i-lucide-copy';
      /**
       * 常量：color。
       */
      const color = isCopied ? 'success' : 'neutral';

      return h('div', { class: 'flex items-center gap-1' }, [
        h(
          ULink,
          {
            raw: true,
            href: buildGroupLinkUrl(row.original),
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'px-0 no-underline text-primary text-xs hover:underline',
            onClick: (event: MouseEvent) => void handleGroupLinkClick(event, row.original)
          },
          () => row.original.number
        ),
        h(UButton, {
          color,
          variant: 'ghost',
          size: 'xs',
          icon,
          class: '-mx-1 transition-colors',
          'aria-label': 'Copy group id',
          onClick: () => void handleCopyGroupNumber(row.original)
        })
      ]);
    }
  },
  {
    accessorKey: 'size',
    meta: {
      class: {
        th: 'w-20 text-right',
        td: 'w-20 text-right'
      }
    },
    header: () => {
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'size' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('pages.socials.qq.groups.result.table.size'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('size') });
    },
    cell: ({ row }) => getSizeLabel(row.original.size * 10)
  },
  {
    accessorKey: 'full',
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20'
      }
    },
    header: t('pages.socials.qq.groups.result.table.full'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.full,
        'onUpdate:modelValue': (value: boolean) => handleToggleFull(row.original, value)
      })
  },
  {
    accessorKey: 'enabled',
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20'
      }
    },
    header: t('common.labels.enabled'),
    cell: ({ row }) =>
      h(USwitch, {
        modelValue: row.original.enabled,
        'onUpdate:modelValue': (value: boolean) => handleToggleEnabled(row.original, value)
      })
  },
  {
    id: 'times',
    accessorKey: 'times',
    meta: {
      class: {
        th: 'w-45 2xl:hidden',
        td: 'w-45 2xl:hidden text-default'
      }
    },
    header: t('common.labels.time'),
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col gap-1.5' }, [
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.updatedAt')}：`),
          h(Datetime, {
            class: 'w-auto max-w-full',
            datetime: row.original.times.updated,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        ]),
        h('div', { class: 'flex items-center gap-1 text-xs' }, [
          h('span', { class: 'shrink-0 text-muted' }, `${t('common.datetimes.createdAt')}：`),
          h(Datetime, {
            class: 'w-auto max-w-full',
            datetime: row.original.times.created,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        ])
      ])
  },
  {
    accessorKey: 'timesUpdated',
    meta: {
      class: {
        th: 'hidden 2xl:table-cell w-30 text-right',
        td: 'hidden 2xl:table-cell w-30 text-right'
      }
    },
    header: () => {
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'updated' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('common.datetimes.updatedAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('updated') });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'self-end w-auto max-w-full text-sm',
        datetime: row.original.times.updated,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
  },
  {
    accessorKey: 'timesCreated',
    meta: {
      class: {
        th: 'hidden 2xl:table-cell w-30 text-right',
        td: 'hidden 2xl:table-cell w-30 text-right'
      }
    },
    header: () => {
      /**
       * 常量：by。
       */
      const by = String(route.query.order_by || 'id');
      /**
       * 常量：dir。
       */
      const dir = String(route.query.order_dir || 'desc');
      /**
       * 函数：isSorted。
       */
      const isSorted = by === 'created' ? (dir === 'asc' ? 'asc' : 'desc') : false;
      /**
       * 常量：icon。
       */
      const icon = isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down';
      return h(UButton, { color: 'neutral', variant: 'ghost', label: t('common.datetimes.createdAt'), icon, class: '-mx-2.5 font-semibold', onClick: () => toggleSort('created') });
    },
    cell: ({ row }) =>
      h(Datetime, {
        class: 'self-end w-auto max-w-full text-sm',
        datetime: row.original.times.created,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
  },
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-20 text-center',
        td: 'w-20'
      }
    },
    enableHiding: false,
    header: () => h('div', { class: 'w-full text-center' }, t('common.labels.actions')),
    cell: ({ row }) =>
      h(
        UButton,
        {
          color: 'neutral',
          variant: 'ghost',
          label: t('pages.socials.qq.groups.edit'),
          onClick: () => handleEdit(row.original)
        },
        () => t('pages.socials.qq.groups.edit')
      )
  }
];
</script>
