<template>
  <UModal v-model:open="stateOpen" :dismissible="!busy" :title="t('pages.crawlers.blueprints.parameters.title')" :description="t('pages.crawlers.blueprints.parameters.description')" :ui="{ content: 'max-w-2xl overflow-hidden', body: 'p-0', footer: 'justify-between border-t border-default bg-muted/20 px-5 py-3' }">
    <template #body>
      <div>
        <div class="border-default bg-muted/20 flex min-w-0 items-center gap-3 border-b px-5 py-3">
          <div class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-md">
            <UIcon name="i-lucide:globe-2" class="size-4.5" />
          </div>
          <div class="min-w-0 flex-1 space-y-0.5">
            <div class="text-highlighted truncate text-sm font-medium">{{ computedSiteName }}</div>
            <div v-if="computedBaseUrl !== ''" class="text-muted flex min-w-0 items-center gap-1.5 text-xs">
              <UIcon name="i-lucide:link" class="size-3.5 shrink-0" />
              <span class="truncate font-mono">{{ computedBaseUrl }}</span>
            </div>
          </div>
        </div>

        <div class="max-h-[min(62vh,34rem)] overflow-y-auto px-5 py-4">
          <div v-for="item in stateItems" :key="item.id" class="border-default space-y-2 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
            <div class="flex min-w-0 items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="text-highlighted truncate text-sm font-medium">{{ parameterLabelGet(item) }}</div>
              </div>
              <span class="text-muted shrink-0 text-xs">{{ t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${item.dataType}`) }}</span>
            </div>

            <UInput v-if="item.dataType === 'string'" :model-value="String(item.value ?? '')" class="w-full" :placeholder="t('pages.crawlers.blueprints.parameters.fields.stringPlaceholder')" @update:model-value="(value) => handleStringUpdate(item.id, value)" />

            <UInputNumber
              v-else-if="item.dataType === 'number'"
              :model-value="Number(item.value ?? 0)"
              class="w-full"
              orientation="vertical"
              :increment="{ color: 'neutral', variant: 'soft' }"
              :decrement="{ color: 'neutral', variant: 'soft' }"
              @update:model-value="(value) => handleNumberUpdate(item.id, Number(value ?? 0))"
            />

            <div v-else-if="item.dataType === 'boolean'" class="border-default flex items-center justify-between rounded-lg border px-3 py-2">
              <span class="text-toned text-sm">{{ Boolean(item.value) ? 'true' : 'false' }}</span>
              <USwitch :model-value="Boolean(item.value)" unchecked-icon="i-lucide:x" checked-icon="i-lucide:check" @update:model-value="(value) => handleBooleanUpdate(item.id, value === true)" />
            </div>

            <UTextarea v-else :model-value="item.jsonText" :rows="5" autoresize class="w-full font-mono text-xs" :placeholder="t('pages.crawlers.blueprints.parameters.fields.jsonPlaceholder')" @update:model-value="(value) => handleJsonUpdate(item.id, value)" />

            <div v-if="item.error !== ''" class="text-error flex items-center gap-1.5 text-xs">
              <UIcon name="i-lucide:circle-alert" class="size-3.5 shrink-0" />
              <span>{{ item.error }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" :disabled="busy" @click="close">{{ t('common.actions.cancel') }}</UButton>
      <div class="flex flex-wrap justify-end gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide:save" :loading="busy" :disabled="computedHasError" @click="handleSaveDefaultAndExecute">
          {{ t('pages.crawlers.blueprints.parameters.actions.saveDefaultAndExecute') }}
        </UButton>
        <UButton color="primary" icon="i-lucide:play" :loading="busy" :disabled="computedHasError" @click="handleExecute">
          {{ t('pages.crawlers.blueprints.parameters.actions.execute') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ICrawlerBlueprintExecutionParameterEditorItem, ICrawlerBlueprintExecutionParametersSubmitPayload, ICrawlersExecutionParametersEmits, ICrawlersExecutionParametersProps } from '@/components/crawlers/execution/parameters/index.types';
import { crawlerBlueprintExecutionDefaultsApply, crawlerBlueprintExecutionParametersExtract } from '@/components/crawlers/execution/parameters/utils/index';
import { variableJsonTextGet, variableJsonTextParse } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * Props：组件入参。
 */
const { siteName = '', baseUrl = '', flowData, busy = false } = defineProps<ICrawlersExecutionParametersProps>();

/**
 * 事件：执行参数弹窗事件。
 */
const emit = defineEmits<ICrawlersExecutionParametersEmits>();

/**
 * 双向绑定：弹窗开关。
 */
const stateOpen = defineModel<boolean>('open', {
  default: false
});

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 状态：参数编辑项。
 */
const stateItems = ref<ICrawlerBlueprintExecutionParameterEditorItem[]>([]);

/**
 * 函数：创建参数编辑项。
 * @param {ReturnType<typeof crawlerBlueprintExecutionParametersExtract>[number]} item 参数定义。
 * @returns {ICrawlerBlueprintExecutionParameterEditorItem} 参数编辑项。
 */
const editorItemCreate = (item: ReturnType<typeof crawlerBlueprintExecutionParametersExtract>[number]): ICrawlerBlueprintExecutionParameterEditorItem => {
  return {
    ...item,
    value: item.defaultValue,
    jsonText: variableJsonTextGet(item.dataType, item.defaultValue),
    error: ''
  };
};

/**
 * 计算属性：是否存在校验错误。
 */
const computedHasError = computed<boolean>(() => stateItems.value.some((item) => item.error.trim() !== ''));

/**
 * 计算属性：站点名称。
 */
const computedSiteName = computed<string>(() => {
  const value = String(siteName ?? '').trim();

  return value !== '' ? value : t('pages.crawlers.targets.title');
});

/**
 * 计算属性：站点基础 URL。
 */
const computedBaseUrl = computed<string>(() => String(baseUrl ?? '').trim());

/**
 * 函数：读取参数标签。
 * @param {ICrawlerBlueprintExecutionParameterEditorItem} item 参数编辑项。
 * @returns {string} 参数标签。
 */
const parameterLabelGet = (item: ICrawlerBlueprintExecutionParameterEditorItem): string => {
  const name = item.name.trim();

  return name !== '' ? name : item.id;
};

/**
 * 函数：读取参数说明。
 * @param {ICrawlerBlueprintExecutionParameterEditorItem} item 参数编辑项。
 * @returns {string} 参数说明。
 */
const parameterDescriptionGet = (item: ICrawlerBlueprintExecutionParameterEditorItem): string => {
  return t('pages.crawlers.blueprints.parameters.fields.description', {
    id: item.id,
    type: t(`components.crawler.blueprint.nodes.variable.common.dataTypes.${item.dataType}`)
  });
};

/**
 * 函数：查找参数编辑项。
 * @param {string} itemId 参数 ID。
 * @returns {ICrawlerBlueprintExecutionParameterEditorItem | null} 参数编辑项。
 */
const itemFind = (itemId: string): ICrawlerBlueprintExecutionParameterEditorItem | null => {
  return stateItems.value.find((item) => item.id === itemId) ?? null;
};

/**
 * 事件：更新字符串参数。
 * @param {string} itemId 参数 ID。
 * @param {string | number} value 输入值。
 * @returns {void} 无返回值。
 */
const handleStringUpdate = (itemId: string, value: string | number): void => {
  const item = itemFind(itemId);

  if (!item) {
    return;
  }

  item.value = String(value ?? '');
  item.error = '';
};

/**
 * 事件：更新数字参数。
 * @param {string} itemId 参数 ID。
 * @param {number} value 输入值。
 * @returns {void} 无返回值。
 */
const handleNumberUpdate = (itemId: string, value: number): void => {
  const item = itemFind(itemId);

  if (!item) {
    return;
  }

  item.value = Number.isFinite(Number(value)) ? Number(value) : 0;
  item.error = '';
};

/**
 * 事件：更新布尔参数。
 * @param {string} itemId 参数 ID。
 * @param {boolean} value 输入值。
 * @returns {void} 无返回值。
 */
const handleBooleanUpdate = (itemId: string, value: boolean): void => {
  const item = itemFind(itemId);

  if (!item) {
    return;
  }

  item.value = Boolean(value);
  item.error = '';
};

/**
 * 事件：更新 JSON 参数。
 * @param {string} itemId 参数 ID。
 * @param {string | number} value 输入值。
 * @returns {void} 无返回值。
 */
const handleJsonUpdate = (itemId: string, value: string | number): void => {
  const item = itemFind(itemId);

  if (!item) {
    return;
  }

  item.jsonText = String(value ?? '');
  const parsedValue = variableJsonTextParse(item.dataType, item.jsonText);

  if (parsedValue === null) {
    item.error = t('pages.crawlers.blueprints.parameters.fields.jsonInvalid');
    return;
  }

  item.value = parsedValue;
  item.error = '';
};

/**
 * 函数：构建执行参数覆盖值。
 * @returns {Record<string, unknown>} 执行参数覆盖值。
 */
const parametersBuild = (): Record<string, unknown> => {
  return stateItems.value.reduce<Record<string, unknown>>((result, item) => {
    result[item.id] = item.value;
    return result;
  }, {});
};

/**
 * 函数：提交执行参数。
 * @param {boolean} saveDefaults 是否保存为默认值。
 * @returns {void} 无返回值。
 */
const submit = (saveDefaults: boolean): void => {
  if (computedHasError.value) {
    return;
  }

  const parameters = parametersBuild();
  const submitFlowData = saveDefaults ? crawlerBlueprintExecutionDefaultsApply(flowData, parameters) : flowData;
  const payload: ICrawlerBlueprintExecutionParametersSubmitPayload = {
    parameters,
    flowData: submitFlowData
  };

  if (saveDefaults) {
    emit('saveDefaultAndExecute', payload);
  } else {
    emit('execute', payload);
  }
};

/**
 * 事件：使用当前值执行。
 * @returns {void} 无返回值。
 */
const handleExecute = (): void => {
  submit(false);
};

/**
 * 事件：保存当前值为默认值并执行。
 * @returns {void} 无返回值。
 */
const handleSaveDefaultAndExecute = (): void => {
  submit(true);
};

watch(
  () => [stateOpen.value, flowData] as const,
  () => {
    if (!stateOpen.value) {
      return;
    }

    stateItems.value = crawlerBlueprintExecutionParametersExtract(flowData).map((item) => editorItemCreate(item));
  },
  { immediate: true }
);
</script>