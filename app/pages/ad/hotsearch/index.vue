<template>
  <DashboardPage>
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          :columns="columns"
          :data="computedTableRows"
          :loading="loading"
          class="shrink-0"
          sticky
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default align-top',
            separator: 'h-0'
          }"
        />
      </div>
    </div>

    <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
      <div class="muted text-sm">{{ `共 ${Number(datas?.total ?? 0)} 条` }}</div>
      <div class="flex items-center gap-1.5">
        <UPagination v-model:page="computedPage" show-edges :items-per-page="computedItemsPerPage" :total="Number(datas?.total ?? 0)" />
      </div>
    </div>

    <UModal v-model:open="stateEditorOpen" :dismissible="false" :title="stateEditor.id > 0 ? '编辑广告' : '添加广告'" :ui="{ content: 'max-w-4xl', footer: 'justify-end' }">
      <template #body>
        <UForm id="hotsearchAdEditorForm" :schema="schema" :state="stateEditor" class="space-y-5" @submit="onSubmit">
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField required name="title" label="广告标题" class="md:col-span-2">
              <UInput v-model="stateEditor.title" placeholder="例如：早餐咖啡联名口播" class="w-full" />
            </UFormField>

            <UFormField required name="adType" label="广告类型">
              <USelect v-model="stateEditor.adType" :items="adTypeOptions" value-attribute="value" option-attribute="label" class="w-full" />
            </UFormField>

            <UFormField required name="editionScopes" label="适用栏目">
              <div class="grid gap-2 sm:grid-cols-2">
                <label v-for="item in editorEditionScopeOptions" :key="item.value" class="border-default hover:bg-elevated/40 flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors">
                  <UCheckbox :model-value="stateEditor.editionScopes.includes(item.value)" @update:model-value="(value) => handleEditionScopeToggle(item.value, Boolean(value))" />
                  <span class="text-sm">{{ item.label }}</span>
                </label>
              </div>
            </UFormField>

            <UFormField required name="materialType" label="素材类型">
              <USelect v-model="stateEditor.materialType" :items="materialTypeOptions" value-attribute="value" option-attribute="label" class="w-full" :disabled="stateEditor.adType === 'oral'" />
            </UFormField>

            <UFormField required name="frameType" label="画幅类型">
              <USelect v-model="stateEditor.frameType" :items="frameTypeOptions" value-attribute="value" option-attribute="label" class="w-full" :disabled="stateEditor.materialType === 'none'" />
            </UFormField>

            <UFormField required name="price" label="价格">
              <UInputNumber v-model="stateEditor.price" :min="0" :step="0.01" :format-options="{ minimumFractionDigits: 2, maximumFractionDigits: 2 }" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
            </UFormField>

            <UFormField required name="priority" label="优先级">
              <UInputNumber v-model="stateEditor.priority" :step="1" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
            </UFormField>

            <UFormField required name="startAt" label="生效日期">
              <div class="border-default bg-elevated/20 space-y-3 rounded-(--ui-radius) border p-3">
                <UPopover>
                  <UButton color="neutral" variant="outline" class="w-full justify-between">
                    <span>{{ calendarButtonLabelGet(stateEditor.startAt) }}</span>
                    <UIcon name="i-lucide:calendar-days" class="text-dimmed size-4 shrink-0" />
                  </UButton>

                  <template #content>
                    <div class="p-2">
                      <UCalendar :model-value="computedStartDateValue" @update:model-value="handleStartDateUpdate" />
                    </div>
                  </template>
                </UPopover>

                <UInputTime :model-value="computedStartTimeValue" granularity="minute" :hour-cycle="24" class="w-full" @update:model-value="handleStartTimeUpdate">
                  <template #trailing>
                    <UIcon name="i-lucide:clock-3" class="text-dimmed size-4" />
                  </template>
                </UInputTime>
              </div>
            </UFormField>

            <UFormField required name="endAt" label="失效日期">
              <div class="border-default bg-elevated/20 space-y-3 rounded-(--ui-radius) border p-3">
                <UPopover>
                  <UButton color="neutral" variant="outline" class="w-full justify-between">
                    <span>{{ calendarButtonLabelGet(stateEditor.endAt) }}</span>
                    <UIcon name="i-lucide:calendar-days" class="text-dimmed size-4 shrink-0" />
                  </UButton>

                  <template #content>
                    <div class="p-2">
                      <UCalendar :model-value="computedEndDateValue" @update:model-value="handleEndDateUpdate" />
                    </div>
                  </template>
                </UPopover>

                <UInputTime :model-value="computedEndTimeValue" granularity="minute" :hour-cycle="24" class="w-full" @update:model-value="handleEndTimeUpdate">
                  <template #trailing>
                    <UIcon name="i-lucide:clock-9" class="text-dimmed size-4" />
                  </template>
                </UInputTime>
              </div>
            </UFormField>
          </div>

          <UFormField v-if="stateEditor.materialType !== 'none'" required name="asset" label="主素材">
            <div class="border-default bg-elevated/15 space-y-4 rounded-2xl border p-4">
              <UFileUpload
                v-model="stateEditorAssetFile"
                :accept="computedAssetAccept"
                :multiple="false"
                variant="area"
                layout="list"
                position="inside"
                :dropzone="true"
                :interactive="!stateSaving"
                :disabled="stateSaving"
                :label="computedAssetUploadLabel"
                :description="computedAssetUploadDescription"
                class="w-full"
              >
                <template #actions="{ files, open, removeFile }">
                  <div class="flex flex-wrap items-center gap-2">
                    <UButton color="primary" variant="soft" size="sm" icon="i-lucide:folder-up" :disabled="stateSaving" @click.stop.prevent="open()">选择素材</UButton>

                    <UButton v-if="files" color="neutral" variant="ghost" size="sm" icon="i-lucide:x" :disabled="stateSaving" @click.stop.prevent="removeFile()">清空选择</UButton>
                  </div>
                </template>

                <template #file-name="{ file }">
                  <div class="text-highlighted text-sm font-medium">{{ file.name }}</div>
                </template>

                <template #file-size="{ file }">
                  <div class="text-muted text-xs">{{ fileSizeTextGet(file.size) }}</div>
                </template>
              </UFileUpload>

              <div v-if="stateEditor.asset" class="space-y-3">
                <div class="text-muted flex flex-wrap items-center gap-2 text-xs">
                  <span>{{ fileSizeTextGet(stateEditor.asset.fileSizeBytes) }}</span>
                  <span v-if="stateEditor.asset.width > 0 && stateEditor.asset.height > 0">{{ `${stateEditor.asset.width} × ${stateEditor.asset.height}` }}</span>
                  <span v-if="stateEditor.asset.durationMs > 0">{{ durationTextGet(stateEditor.asset.durationMs) }}</span>
                </div>

                <div class="border-default bg-default/80 overflow-hidden rounded-xl border p-2">
                  <img v-if="stateEditor.materialType === 'image'" :src="stateEditor.asset.previewUrl" :alt="stateEditor.asset.originalName" class="max-h-72 w-full rounded-lg object-contain" />
                  <video v-else class="max-h-72 w-full rounded-lg" controls playsinline preload="metadata" :src="stateEditor.asset.previewUrl"></video>
                </div>
              </div>
            </div>
          </UFormField>

          <UFormField name="notes" label="备注">
            <UTextarea v-model="stateEditor.notes" :rows="4" autoresize class="w-full" placeholder="记录合作说明、播客插入提示或排期备注。" />
          </UFormField>

          <UFormField name="isEnabled" label="启用状态">
            <USwitch v-model="stateEditor.isEnabled" />
          </UFormField>
        </UForm>
      </template>

      <template #footer="{ close }">
        <UButton type="button" color="neutral" variant="outline" @click="close">取消</UButton>
        <UButton type="submit" form="hotsearchAdEditorForm" icon="i-lucide-save" color="primary" :disabled="!computedCanSubmit || stateSaving" :loading="stateSaving">保存</UButton>
      </template>
    </UModal>

    <USlideover
      v-model:open="stateDetailOpen"
      side="right"
      :title="stateDetailRow.title || '未命名广告'"
      description="热搜播客广告物料"
      :ui="{
        content: 'w-auto max-w-140',
        body: 'scrollbar space-y-5',
        title: 'text-highlighted text-lg font-semibold',
        description: 'text-muted'
      }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UBadge :color="stateDetailRow.isEnabled ? 'primary' : 'neutral'" variant="soft">{{ stateDetailRow.isEnabled ? '启用中' : '已停用' }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ adTypeLabelGet(stateDetailRow.adType) }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ materialTypeLabelGet(stateDetailRow.materialType) }}</UBadge>
            <UBadge color="neutral" variant="soft">{{ frameTypeLabelGet(stateDetailRow.frameType) }}</UBadge>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">适用栏目</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ editionScopeLabelGet(stateDetailRow.editionScope) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">素材类型</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ materialTypeLabelGet(stateDetailRow.materialType) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">价格</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ priceTextGet(stateDetailRow.price) }}</div>
            </div>
            <div class="bg-elevated/40 border-default rounded-xl border px-3 py-3">
              <div class="text-muted text-xs">优先级</div>
              <div class="text-highlighted mt-1 text-sm font-semibold">{{ stateDetailRow.priority }}</div>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">生效时间</span>
              <Datetime :value="stateDetailRow.startAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">失效时间</span>
              <Datetime :value="stateDetailRow.endAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">更新时间</span>
              <Datetime :value="stateDetailRow.updatedAt" mode="datetime" />
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-muted shrink-0">创建时间</span>
              <Datetime :value="stateDetailRow.createdAt" mode="datetime" />
            </div>
          </div>
        </div>
      </template>
    </USlideover>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import { CalendarDate, parseTime } from '@internationalized/date';
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui';
import type { InputTimeProps } from '@nuxt/ui/runtime/components/InputTime.vue';
import { z } from 'zod';

import { hotsearchAdEditionScopeOptionsGet } from '@@/shared/utils';

type TAdInputTimeValue = InputTimeProps['modelValue'];

/**
 * 组件：日期时间。
 */
const Datetime = resolveComponent('Datetime');

/**
 * 组件：徽标。
 */
const UBadge = resolveComponent('UBadge');

/**
 * 组件：按钮。
 */
const UButton = resolveComponent('UButton');

/**
 * 组件：开关。
 */
const USwitch = resolveComponent('USwitch');

/**
 * 组件：分页。
 */
const UPagination = resolveComponent('UPagination');

/**
 * Hook：国际化。
 */
/**
 * Hook：提示消息。
 */
const toast = useToast();

const props = withDefaults(defineProps<IPageAdHotsearchProps>(), {
  createNonce: 0
});

/**
 * 路由。
 */
const route = useRoute();

/**
 * 状态：编辑器开关。
 */
const stateEditorOpen = ref(false);

/**
 * 状态：保存中。
 */
const stateSaving = ref(false);

/**
 * 状态：详情面板是否打开。
 */
const stateDetailOpen = ref(false);

/**
 * 状态：编辑器素材文件。
 */
const stateEditorAssetFile = ref<File | null>(null);

/**
 * 状态：详情行。
 */
const stateDetailRow = ref<IHotsearchAdMaterialSummaryRow>({
  id: 0,
  title: '',
  adType: 'oral',
  materialType: 'none',
  frameType: 'none',
  editionScope: 'both',
  price: 0,
  priority: 0,
  isEnabled: false,
  startAt: '',
  endAt: '',
  updatedAt: '',
  createdAt: '',
  asset: null
});

/**
 * 函数：格式化本地日期时间。
 * @param {Date} value 日期对象。
 * @returns {string} 本地日期时间。
 */
const localDateTimeValueCreate = (value: Date): string => {
  const pad = (input: number) => String(input).padStart(2, '0');

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

/**
 * 函数：生成默认编辑器状态。
 * @returns {IPageAdHotsearchEditorForm} 默认状态。
 */
const editorDefaultStateCreate = (): IPageAdHotsearchEditorForm => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0);

  return {
    id: 0,
    title: '',
    adType: 'oral',
    materialType: 'none',
    frameType: 'none',
    editionScopes: ['morning', 'evening'],
    price: 0,
    priority: 0,
    asset: null,
    notes: '',
    isEnabled: true,
    startAt: localDateTimeValueCreate(todayStart),
    endAt: localDateTimeValueCreate(todayEnd)
  };
};

/**
 * 状态：编辑器表单。
 */
const stateEditor = ref<IPageAdHotsearchEditorForm>(editorDefaultStateCreate());

/**
 * 常量：广告类型选项。
 */
const adTypeOptions = [
  { label: '口播', value: 'oral' },
  { label: '画中画', value: 'picture_in_picture' },
  { label: '混剪', value: 'montage' }
];

/**
 * 常量：素材类型选项。
 */
const materialTypeOptions = [
  { label: '无素材', value: 'none' },
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' }
];

/**
 * 常量：画幅类型选项。
 */
const frameTypeOptions = [
  { label: '不区分', value: 'none' },
  { label: '横版', value: 'landscape' },
  { label: '竖版', value: 'portrait' }
];

/**
 * 常量：编辑器栏目范围选项。
 */
const editorEditionScopeOptions = hotsearchAdEditionScopeOptionsGet();

/**
 * 常量：表单校验。
 */
const schema = z
  .object({
    title: z.string().trim().min(1, '请填写广告标题').max(120, '广告标题不能超过 120 个字符'),
    adType: z.enum(['oral', 'picture_in_picture', 'montage']),
    materialType: z.enum(['none', 'image', 'video']),
    frameType: z.enum(['none', 'landscape', 'portrait']),
    editionScopes: z.array(z.enum(['morning', 'evening'])).min(1, '请至少选择一个适用栏目'),
    price: z.number().min(0, '价格必须大于等于 0'),
    priority: z.number().int('优先级必须是整数'),
    asset: z
      .object({
        originalName: z.string().trim().min(1, '请选择素材文件'),
        mimeType: z.string().trim().min(1, '素材类型不正确'),
        fileExt: z.string().trim().min(1, '素材扩展名不能为空'),
        fileSizeBytes: z.number().positive('素材大小必须大于 0'),
        width: z.number().min(0),
        height: z.number().min(0),
        durationMs: z.number().min(0),
        previewUrl: z.string().trim().min(1)
      })
      .nullable(),
    notes: z.string().max(500, '备注不能超过 500 个字符'),
    isEnabled: z.boolean(),
    startAt: z
      .string()
      .trim()
      .min(1, '请选择生效时间')
      .refine((value) => !Number.isNaN(new Date(value).getTime()), '生效时间格式不正确'),
    endAt: z
      .string()
      .trim()
      .min(1, '请选择失效时间')
      .refine((value) => !Number.isNaN(new Date(value).getTime()), '失效时间格式不正确')
  })
  .superRefine((value, ctx) => {
    if (value.adType === 'oral' && value.materialType !== 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['materialType'], message: '口播广告的素材类型必须是无素材' });
    }

    if (value.adType !== 'oral' && value.materialType === 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['materialType'], message: '非口播广告必须选择图片或视频素材' });
    }

    if (value.materialType === 'none' && value.frameType !== 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['frameType'], message: '无素材广告的画幅类型必须是不区分' });
    }

    if (value.materialType !== 'none' && value.frameType === 'none') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['frameType'], message: '图片或视频素材必须指定画幅类型' });
    }

    if (value.materialType !== 'none' && !value.asset) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: '请选择对应的图片或视频素材' });
    }

    if (value.materialType === 'image' && value.asset?.mimeType && !value.asset.mimeType.startsWith('image/')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: '图片广告必须上传图片素材' });
    }

    if (value.materialType === 'video' && value.asset?.mimeType && !value.asset.mimeType.startsWith('video/')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asset'], message: '视频广告必须上传视频素材' });
    }

    if (new Date(value.startAt).getTime() > new Date(value.endAt).getTime()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endAt'], message: '失效时间必须大于等于生效时间' });
    }
  });

/**
 * 计算属性：表单是否可提交。
 */
const computedCanSubmit = computed(() => schema.safeParse({ ...stateEditor.value }).success);

/**
 * 状态：分页大小 cookie。
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow'
});

/**
 * API：上传策略快照。
 */
const {
  datas: stateUpyunDirectUploadPolicy,
  error: stateUpyunDirectUploadPolicyError,
  refresh: refreshUpyunDirectUploadPolicyPost
} = await useApi<Record<string, unknown>>('storages/upyun/assets/direct-upload/policy', {
  method: 'POST',
  immediate: false
});

/**
 * 函数：获取当前生效分页大小。
 * @returns {string} 分页大小文本。
 */
const currentPageSizeGet = (): string => {
  const routeValue = typeof route.query.pagesize === 'string' ? route.query.pagesize.trim() : '';

  if (routeValue !== '') {
    return routeValue;
  }

  return String(getPageSizeByCookieParsed(pagesizesCookie.value, 'ad-hotsearch'));
};

/**
 * 函数：从路由查询参数构建接口查询参数。
 * @returns {Record<string, string>} 查询参数。
 */
const buildApiQueryFromRoute = (): Record<string, string> => {
  const query: Record<string, string> = {};
  const keyword = typeof route.query.keyword === 'string' ? route.query.keyword.trim() : '';
  const editionScope = typeof route.query.editionScope === 'string' ? route.query.editionScope.trim() : '';
  const enabled = typeof route.query.enabled === 'string' ? route.query.enabled.trim() : '';
  const page = typeof route.query.page === 'string' ? route.query.page.trim() : '';
  const pageSize = currentPageSizeGet();

  if (keyword !== '') {
    query.keyword = keyword;
  }

  if (editionScope !== '') {
    query.editionScope = editionScope;
  }

  if (enabled !== '') {
    query.enabled = enabled;
  }

  if (page !== '') {
    query.page = page;
  }

  if (pageSize !== '') {
    query.pageSize = pageSize;
  }

  return query;
};

/**
 * API：热搜广告物料列表。
 */
const { datas, loading, refreshDebounced } = await useApi<IHotsearchAdMaterialPage>('hotsearch/ads/materials', {
  datas: buildApiQueryFromRoute(),
  immediate: true
});

/**
 * API：新增热搜广告物料。
 */
const { refresh: refreshCreate } = await useApi<IHotsearchAdMaterialSaveResult>('hotsearch/ads/materials', {
  method: 'POST',
  immediate: false
});

/**
 * 函数：将时间文本转换为 UInputTime 可用值。
 * @param {string} value 时间文本。
 * @param {string} fallback 回退时间。
 * @returns {TAdInputTimeValue} 时间值。
 */
const timeValueFromText = (value: string, fallback: string): TAdInputTimeValue => {
  const normalized = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  try {
    return parseTime(normalized) as unknown as TAdInputTimeValue;
  } catch {
    return parseTime(fallback) as unknown as TAdInputTimeValue;
  }
};

/**
 * 函数：将 UInputTime 值格式化为 HH:mm。
 * @param {TAdInputTimeValue} value 时间值。
 * @param {string} fallback 回退时间。
 * @returns {string} 时间文本。
 */
const textFromTimeValue = (value: TAdInputTimeValue, fallback: string): string => {
  if (!value) {
    return fallback;
  }

  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
};

/**
 * 函数：提取日期部分。
 * @param {string} value 日期时间文本。
 * @returns {string} 日期文本。
 */
const datePartGet = (value: string): string => {
  const matched = /^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}$/.exec(String(value || '').trim());

  return matched ? matched[1] : '';
};

/**
 * 函数：提取时间部分。
 * @param {string} value 日期时间文本。
 * @param {string} fallback 回退时间。
 * @returns {string} 时间文本。
 */
const timePartGet = (value: string, fallback: string): string => {
  const matched = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})$/.exec(String(value || '').trim());

  return matched ? matched[1] : fallback;
};

/**
 * 函数：合并日期与时间为本地日期时间。
 * @param {string} dateText 日期文本。
 * @param {string} timeText 时间文本。
 * @returns {string} 本地日期时间。
 */
const localDateTimeMerge = (dateText: string, timeText: string): string => `${dateText}T${timeText}`;

/**
 * 函数：解析本地日期时间为日历日期。
 * @param {string} value 本地日期时间。
 * @returns {CalendarDate | undefined} 日历日期。
 */
const calendarDateFromDateTimeGet = (value: string): CalendarDate | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}$/.exec(String(value || '').trim());

  if (!matched) {
    return undefined;
  }

  return new CalendarDate(Number(matched[1]), Number(matched[2]), Number(matched[3]));
};

/**
 * 函数：格式化日历日期为 ISO 日期。
 * @param {DateValue} value 日历日期。
 * @returns {string} ISO 日期。
 */
const calendarIsoDateGet = (value: DateValue): string => {
  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
};

/**
 * 函数：获取日历按钮文案。
 * @param {string} value 本地日期时间。
 * @returns {string} 日期按钮文案。
 */
const calendarButtonLabelGet = (value: string): string => {
  const dateText = datePartGet(value);

  return dateText === '' ? '请选择日期' : dateText.replaceAll('-', '/');
};

/**
 * 函数：读取媒体元数据。
 * @param {string} materialType 素材类型。
 * @param {string} previewUrl 本地预览地址。
 * @returns {Promise<{ width: number; height: number; durationMs: number }>} 元数据。
 */
const mediaMetadataRead = async (materialType: 'image' | 'video', previewUrl: string): Promise<{ width: number; height: number; durationMs: number }> => {
  if (!import.meta.client) {
    return { width: 0, height: 0, durationMs: 0 };
  }

  if (materialType === 'image') {
    return await new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        resolve({
          width: image.naturalWidth || 0,
          height: image.naturalHeight || 0,
          durationMs: 0
        });
      };
      image.onerror = () => {
        resolve({ width: 0, height: 0, durationMs: 0 });
      };
      image.src = previewUrl;
    });
  }

  return await new Promise((resolve) => {
    const video = document.createElement('video');

    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        durationMs: Number.isFinite(video.duration) ? Math.max(0, Math.round(video.duration * 1000)) : 0
      });

      video.removeAttribute('src');
      video.load();
    };
    video.onerror = () => {
      resolve({ width: 0, height: 0, durationMs: 0 });
      video.removeAttribute('src');
      video.load();
    };
    video.src = previewUrl;
  });
};

/**
 * 函数：构建素材扩展名。
 * @param {File} file 文件。
 * @returns {string} 扩展名。
 */
const fileExtGet = (file: File): string => {
  const matched = /\.([^.]+)$/.exec(file.name.trim());

  return matched ? matched[1].toLowerCase() : '';
};

/**
 * 函数：格式化文件大小。
 * @param {number} size 文件大小。
 * @returns {string} 文本。
 */
const fileSizeTextGet = (size: number): string => {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

/**
 * 函数：格式化时长。
 * @param {number} durationMs 时长毫秒。
 * @returns {string} 文本。
 */
const durationTextGet = (durationMs: number): string => {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * 函数：将未知值转为普通对象。
 * @param {unknown} input 输入值。
 * @returns {Record<string, unknown> | null} 普通对象。
 */
const toRecord = (input: unknown): Record<string, unknown> | null => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }

  return input as Record<string, unknown>;
};

/**
 * 函数：确保内部 useApi 请求成功。
 * @param {unknown} input useApi error。
 * @param {string} message 失败文案。
 */
const ensureInternalUseApiSucceeded = (input: unknown, message: string): void => {
  if (!input) {
    return;
  }

  throw new Error(message);
};

/**
 * 函数：请求直传策略快照。
 * @param {Record<string, unknown>} body 请求体。
 * @param {string} errorMessage 失败文案。
 * @returns {Promise<Record<string, unknown>>} 策略快照。
 */
const requestUpyunDirectUploadPolicySnapshot = async (body: Record<string, unknown>, errorMessage: string): Promise<Record<string, unknown>> => {
  await refreshUpyunDirectUploadPolicyPost({
    body,
    ignoreResponseError: true
  });

  ensureInternalUseApiSucceeded(stateUpyunDirectUploadPolicyError.value, errorMessage);
  return toRecord(stateUpyunDirectUploadPolicy.value) ?? {};
};

/**
 * 函数：构建素材公开地址。
 * @param {string} path 文件路径。
 * @returns {string} 公共地址。
 */
/**
 * 函数：创建素材保存路径。
 * @param {File} file 文件。
 * @returns {string} 保存路径。
 */
const editorAssetSaveKeyCreate = (file: File): string => {
  const extension = fileExtGet(file);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return extension === '' ? `/hotsearch/ads/materials/${suffix}` : `/hotsearch/ads/materials/${suffix}.${extension}`;
};

/**
 * 函数：上传当前主素材。
 * @param {File} file 待上传文件。
 * @param {IPageAdHotsearchEditorAsset} asset 本地素材元数据。
 * @returns {Promise<IHotsearchAdMaterialAsset>} 已上传素材。
 */
const uploadEditorAssetFile = async (file: File, asset: IPageAdHotsearchEditorAsset): Promise<IHotsearchAdMaterialAsset> => {
  const errorMessage = '素材上传失败';
  const saveKey = editorAssetSaveKeyCreate(file);
  const policy = await requestUpyunDirectUploadPolicySnapshot(
    {
      save_key: saveKey,
      expires_in_sec: 1800
    },
    errorMessage
  );
  const uploadUrl = String(policy.upload_url ?? '').trim();
  const uploadPolicy = String(policy.policy ?? '').trim();
  const authorization = String(policy.authorization ?? '').trim();
  const resolvedSaveKey = String(policy.save_key ?? saveKey).trim();

  if (!uploadUrl || !uploadPolicy || !authorization || !resolvedSaveKey) {
    throw new Error(errorMessage);
  }

  const formData = new FormData();
  formData.set('policy', uploadPolicy);
  formData.set('authorization', authorization);
  formData.set('save-key', resolvedSaveKey);
  formData.set('file', file);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', uploadUrl, true);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      reject(new Error(errorMessage));
    });
    xhr.addEventListener('error', () => reject(new Error(errorMessage)));
    xhr.addEventListener('abort', () => reject(new Error(errorMessage)));
    xhr.send(formData);
  });

  return {
    storageBucket: 'assets',
    fileKey: resolvedSaveKey,
    originalName: asset.originalName,
    mimeType: asset.mimeType,
    fileExt: asset.fileExt,
    fileSizeBytes: asset.fileSizeBytes,
    width: asset.width,
    height: asset.height,
    durationMs: asset.durationMs
  };
};

/**
 * 函数：清空编辑器素材。
 */
const editorAssetClear = (): void => {
  const previewUrl = String(stateEditor.value.asset?.previewUrl ?? '').trim();

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  stateEditor.value.asset = null;
};

/**
 * 函数：重置编辑器。
 */
const editorReset = (): void => {
  editorAssetClear();
  stateEditorAssetFile.value = null;
  stateEditor.value = editorDefaultStateCreate();
};

/**
 * 计算属性：开始日期值。
 */
const computedStartDateValue = computed(() => calendarDateFromDateTimeGet(stateEditor.value.startAt));

/**
 * 计算属性：结束日期值。
 */
const computedEndDateValue = computed(() => calendarDateFromDateTimeGet(stateEditor.value.endAt));

/**
 * 计算属性：开始时间值。
 */
const computedStartTimeValue = computed(() => timeValueFromText(timePartGet(stateEditor.value.startAt, '00:00'), '00:00'));

/**
 * 计算属性：结束时间值。
 */
const computedEndTimeValue = computed(() => timeValueFromText(timePartGet(stateEditor.value.endAt, '23:59'), '23:59'));

/**
 * 计算属性：素材接收类型。
 */
const computedAssetAccept = computed(() => {
  if (stateEditor.value.materialType === 'image') {
    return 'image/*';
  }

  if (stateEditor.value.materialType === 'video') {
    return 'video/*';
  }

  return undefined;
});

/**
 * 计算属性：素材上传标题。
 */
const computedAssetUploadLabel = computed(() => {
  return stateEditor.value.materialType === 'image' ? '把图片拖到这里' : '把视频拖到这里';
});

/**
 * 计算属性：素材上传说明。
 */
const computedAssetUploadDescription = computed(() => {
  return stateEditor.value.materialType === 'image' ? '支持常见图片格式，建议提前准备清晰主视觉。' : '支持常见视频格式，建议先裁切到最终投放片段。';
});

/**
 * 函数：获取广告类型文案。
 * @param {IHotsearchAdMaterialSummaryRow['adType']} value 广告类型。
 * @returns {string} 文案。
 */
const adTypeLabelGet = (value: IHotsearchAdMaterialSummaryRow['adType']): string => {
  if (value === 'oral') {
    return '口播';
  }

  if (value === 'picture_in_picture') {
    return '画中画';
  }

  if (value === 'montage') {
    return '混剪';
  }

  return value;
};

/**
 * 函数：获取素材类型文案。
 * @param {IHotsearchAdMaterialSummaryRow['materialType']} value 素材类型。
 * @returns {string} 文案。
 */
const materialTypeLabelGet = (value: IHotsearchAdMaterialSummaryRow['materialType']): string => {
  if (value === 'none') {
    return '无素材';
  }

  if (value === 'image') {
    return '图片';
  }

  if (value === 'video') {
    return '视频';
  }

  return value;
};

/**
 * 函数：获取画幅文案。
 * @param {IHotsearchAdMaterialSummaryRow['frameType']} value 画幅类型。
 * @returns {string} 文案。
 */
const frameTypeLabelGet = (value: IHotsearchAdMaterialSummaryRow['frameType']): string => {
  if (value === 'none') {
    return '不区分';
  }

  if (value === 'landscape') {
    return '横版';
  }

  if (value === 'portrait') {
    return '竖版';
  }

  return value;
};

/**
 * 函数：获取栏目范围文案。
 * @param {IHotsearchAdMaterialSummaryRow['editionScope']} value 栏目范围。
 * @returns {string} 文案。
 */
const editionScopeLabelGet = (value: IHotsearchAdMaterialSummaryRow['editionScope']): string => {
  if (value === 'morning') {
    return '仅早报';
  }

  if (value === 'evening') {
    return '仅晚报';
  }

  if (value === 'both') {
    return '仅早报 + 仅晚报';
  }

  return value;
};

/**
 * 函数：获取价格文案。
 * @param {number} value 价格。
 * @returns {string} 文案。
 */
const priceTextGet = (value: number): string => `¥${Number(value ?? 0).toFixed(2)}`;

/**
 * 计算属性：表格数据。
 */
const computedTableRows = computed<IPageTableColumnHotsearchAdMaterial[]>(() => {
  if (!datas.value?.rows || datas.value.rows.length === 0) {
    return [];
  }

  return datas.value.rows.map((item) => ({
    id: Number(item.id ?? 0),
    title: String(item.title ?? ''),
    adType: String(item.adType ?? ''),
    materialType: String(item.materialType ?? ''),
    frameType: String(item.frameType ?? ''),
    editionScope: String(item.editionScope ?? ''),
    priceText: priceTextGet(Number(item.price ?? 0)),
    priority: Number(item.priority ?? 0),
    isEnabled: Boolean(item.isEnabled),
    startAt: String(item.startAt ?? ''),
    endAt: String(item.endAt ?? ''),
    updatedAt: String(item.updatedAt ?? '')
  }));
});

/**
 * 计算属性：当前页。
 */
const computedPage = computed<number>({
  get: () => {
    const str = typeof route.query.page === 'string' ? route.query.page : '';
    const num = Number.parseInt(str, 10);
    return Number.isFinite(num) && num > 0 ? num : 1;
  },
  set: (value: number) => {
    const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>;
    q.page = String(Math.max(1, value));
    navigateTo({ path: route.path, query: q });
  }
});

/**
 * 计算属性：每页数量。
 */
const computedItemsPerPage = computed<number>(() => {
  const routeValue = typeof route.query.pagesize === 'string' ? route.query.pagesize : '';
  const parsed = Number.parseInt(routeValue, 10);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  const cookieSize = getPageSizeByCookieParsed(pagesizesCookie.value, 'ad-hotsearch');
  if (Number.isFinite(cookieSize) && cookieSize > 0) {
    return cookieSize;
  }

  const apiSize = Number(datas.value?.pageSize ?? 20);
  return Number.isFinite(apiSize) && apiSize > 0 ? apiSize : 20;
});

/**
 * 事件：开始日期变更。
 * @param {DateValue | undefined} value 日期值。
 */
const handleStartDateUpdate = (value: DateValue | undefined): void => {
  if (!value) {
    return;
  }

  stateEditor.value.startAt = localDateTimeMerge(calendarIsoDateGet(value), timePartGet(stateEditor.value.startAt, '00:00'));
};

/**
 * 事件：结束日期变更。
 * @param {DateValue | undefined} value 日期值。
 */
const handleEndDateUpdate = (value: DateValue | undefined): void => {
  if (!value) {
    return;
  }

  stateEditor.value.endAt = localDateTimeMerge(calendarIsoDateGet(value), timePartGet(stateEditor.value.endAt, '23:59'));
};

/**
 * 事件：开始时间变更。
 * @param {TAdInputTimeValue} value 时间值。
 */
const handleStartTimeUpdate = (value: TAdInputTimeValue): void => {
  stateEditor.value.startAt = localDateTimeMerge(datePartGet(stateEditor.value.startAt), textFromTimeValue(value, '00:00'));
};

/**
 * 事件：结束时间变更。
 * @param {TAdInputTimeValue} value 时间值。
 */
const handleEndTimeUpdate = (value: TAdInputTimeValue): void => {
  stateEditor.value.endAt = localDateTimeMerge(datePartGet(stateEditor.value.endAt), textFromTimeValue(value, '23:59'));
};

/**
 * 事件：查看详情。
 * @param {IPageTableColumnHotsearchAdMaterial} row 表格行。
 */
const handleViewDetail = (row: IPageTableColumnHotsearchAdMaterial) => {
  const source = datas.value?.rows.find((item) => Number(item.id) === row.id);
  if (!source) {
    return;
  }

  stateDetailRow.value = {
    id: Number(source.id ?? 0),
    title: String(source.title ?? ''),
    adType: String(source.adType ?? ''),
    materialType: String(source.materialType ?? ''),
    frameType: String(source.frameType ?? ''),
    editionScope: String(source.editionScope ?? ''),
    price: Number(source.price ?? 0),
    priority: Number(source.priority ?? 0),
    isEnabled: Boolean(source.isEnabled),
    startAt: String(source.startAt ?? ''),
    endAt: String(source.endAt ?? ''),
    updatedAt: String(source.updatedAt ?? ''),
    createdAt: String(source.createdAt ?? ''),
    asset: source.asset ?? null
  };
  stateDetailOpen.value = true;
};

/**
 * 事件：打开新增模态框。
 */
const handleCreate = () => {
  editorReset();
  stateEditorOpen.value = true;
};

/**
 * 事件：切换适用栏目。
 * @param {'morning' | 'evening'} value 栏目值。
 * @param {boolean} enabled 是否选中。
 */
const handleEditionScopeToggle = (value: 'morning' | 'evening', enabled: boolean): void => {
  const nextValues = enabled ? [...stateEditor.value.editionScopes, value] : stateEditor.value.editionScopes.filter((item) => item !== value);

  stateEditor.value.editionScopes = Array.from(new Set(nextValues));
};

/**
 * 函数：将表单栏目范围映射为后端字段。
 * @param {Array<'morning' | 'evening'>} values 表单栏目范围。
 * @returns {'morning' | 'evening' | 'both'} 后端栏目范围。
 */
const editionScopePayloadGet = (values: Array<'morning' | 'evening'>): 'morning' | 'evening' | 'both' => {
  const uniqueValues = Array.from(new Set(values));

  if (uniqueValues.includes('morning') && uniqueValues.includes('evening')) {
    return 'both';
  }

  if (uniqueValues.includes('evening')) {
    return 'evening';
  }

  return 'morning';
};

/**
 * 函数：构建保存请求。
 * @param {IPageAdHotsearchEditorForm} source 表单状态。
 * @param {IHotsearchAdMaterialAsset | null} asset 已上传素材。
 * @returns {Record<string, unknown>} 保存请求。
 */
const savePayloadBuild = (source: IPageAdHotsearchEditorForm, asset: IHotsearchAdMaterialAsset | null): Record<string, unknown> => {
  const adType = source.adType;
  const materialType = adType === 'oral' ? 'none' : source.materialType;
  const frameType = materialType === 'none' ? 'none' : source.frameType;

  return {
    title: source.title.trim(),
    adType,
    materialType,
    frameType,
    editionScope: editionScopePayloadGet(source.editionScopes),
    price: source.price,
    priority: source.priority,
    asset: materialType === 'none' ? undefined : asset,
    notes: source.notes.trim() === '' ? undefined : source.notes.trim(),
    isEnabled: source.isEnabled,
    startAt: new Date(source.startAt).toISOString(),
    endAt: new Date(source.endAt).toISOString()
  };
};

/**
 * 事件：提交新增表单。
 * @param {FormSubmitEvent<z.output<typeof schema>>} event 表单提交事件。
 */
const onSubmit = async (event: FormSubmitEvent<z.output<typeof schema>>): Promise<void> => {
  if (!schema.safeParse(event.data).success || stateSaving.value) {
    return;
  }

  stateSaving.value = true;

  try {
    let uploadedAsset: IHotsearchAdMaterialAsset | null = null;

    if (stateEditor.value.materialType !== 'none') {
      if (!stateEditorAssetFile.value || !stateEditor.value.asset) {
        throw new Error('请选择要上传的素材文件');
      }

      uploadedAsset = await uploadEditorAssetFile(stateEditorAssetFile.value, stateEditor.value.asset);
    }

    await refreshCreate({
      datas: savePayloadBuild(stateEditor.value, uploadedAsset),
      replace: true
    });

    stateEditorOpen.value = false;
    editorReset();
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : '广告保存失败',
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 2500,
      type: 'foreground',
      close: false
    });
  } finally {
    stateSaving.value = false;
  }
};

/**
 * 表格：列定义。
 */
const columns: TableColumn<IPageTableColumnHotsearchAdMaterial>[] = [
  {
    accessorKey: 'id',
    header: '编号',
    cell: ({ row }) => h('span', { class: 'text-muted text-sm' }, `#${row.original.id}`),
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20'
      }
    }
  },
  {
    id: 'summary',
    header: '广告信息',
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'space-y-2 py-0.5' }, [
        h('div', { class: 'text-highlighted text-sm font-medium leading-6' }, item.title || '未命名广告'),
        h('div', { class: 'flex flex-wrap gap-1.5' }, [
          h(UBadge, { color: item.isEnabled ? 'primary' : 'neutral', variant: 'soft' }, () => (item.isEnabled ? '启用中' : '已停用')),
          h(UBadge, { color: 'neutral', variant: 'soft' }, () => adTypeLabelGet(item.adType)),
          h(UBadge, { color: 'neutral', variant: 'soft' }, () => materialTypeLabelGet(item.materialType)),
          h(UBadge, { color: 'neutral', variant: 'soft' }, () => frameTypeLabelGet(item.frameType))
        ])
      ]);
    },
    meta: {
      class: {
        th: 'min-w-72',
        td: 'min-w-72'
      }
    }
  },
  {
    id: 'delivery',
    header: '投放配置',
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'space-y-1.5 text-sm' }, [h('div', { class: 'text-highlighted' }, editionScopeLabelGet(item.editionScope)), h('div', { class: 'text-muted text-xs' }, `优先级 ${item.priority}`), h('div', { class: 'text-muted text-xs' }, item.priceText)]);
    },
    meta: {
      class: {
        th: 'w-44',
        td: 'w-44'
      }
    }
  },
  {
    id: 'time',
    header: '时间',
    cell: ({ row }) => {
      const item = row.original;

      return h('div', { class: 'space-y-2 text-xs' }, [
        h('div', { class: 'space-y-1' }, [h('div', { class: 'text-muted' }, '生效'), h(Datetime, { value: item.startAt, mode: 'datetime' })]),
        h('div', { class: 'space-y-1' }, [h('div', { class: 'text-muted' }, '失效'), h(Datetime, { value: item.endAt, mode: 'datetime' })]),
        h('div', { class: 'space-y-1' }, [h('div', { class: 'text-muted' }, '更新'), h(Datetime, { value: item.updatedAt, mode: 'datetime' })])
      ]);
    },
    meta: {
      class: {
        th: 'w-56',
        td: 'w-56'
      }
    }
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => h(UButton, { color: 'neutral', variant: 'ghost', size: 'sm', onClick: () => handleViewDetail(row.original) }, () => '查看'),
    meta: {
      class: {
        th: 'w-24 text-right',
        td: 'w-24 text-right'
      }
    }
  }
];

let assetSelectionToken = 0;

/**
 * 监听：路由变化时刷新列表。
 */
watch(
  () => route.query,
  () => {
    refreshDebounced({ datas: buildApiQueryFromRoute(), replace: true });
  }
);

watch(
  () => props.createNonce,
  (value, oldValue) => {
    if (typeof value === 'number' && typeof oldValue === 'number' && value !== oldValue) {
      handleCreate();
    }
  }
);

watch(
  () => stateEditor.value.adType,
  (value) => {
    if (value === 'oral') {
      stateEditor.value.materialType = 'none';
      stateEditor.value.frameType = 'none';
    }
  }
);

watch(
  () => stateEditor.value.materialType,
  (value) => {
    if (value === 'none') {
      stateEditor.value.adType = 'oral';
      stateEditor.value.frameType = 'none';
      stateEditorAssetFile.value = null;
      editorAssetClear();
      return;
    }

    if (value === 'image' && stateEditorAssetFile.value && !stateEditorAssetFile.value.type.startsWith('image/')) {
      stateEditorAssetFile.value = null;
      editorAssetClear();
    }

    if (value === 'video' && stateEditorAssetFile.value && !stateEditorAssetFile.value.type.startsWith('video/')) {
      stateEditorAssetFile.value = null;
      editorAssetClear();
    }
  }
);

watch(
  () => stateEditor.value.frameType,
  (value) => {
    if (value === 'none') {
      stateEditor.value.materialType = 'none';
      stateEditor.value.adType = 'oral';
    }
  }
);

watch(
  () => stateEditorAssetFile.value,
  async (file) => {
    assetSelectionToken += 1;
    const currentToken = assetSelectionToken;

    editorAssetClear();

    if (!file || stateEditor.value.materialType === 'none') {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const materialType = stateEditor.value.materialType;
    const metadata = await mediaMetadataRead(materialType, previewUrl);

    if (currentToken !== assetSelectionToken) {
      URL.revokeObjectURL(previewUrl);
      return;
    }

    stateEditor.value.asset = {
      originalName: file.name,
      mimeType: file.type || (materialType === 'image' ? 'image/*' : 'video/*'),
      fileExt: fileExtGet(file),
      fileSizeBytes: file.size,
      width: metadata.width,
      height: metadata.height,
      durationMs: metadata.durationMs,
      previewUrl
    };
  }
);

onBeforeUnmount(() => {
  editorAssetClear();
});
</script>
