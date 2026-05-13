<template>
  <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
    <template #header>
      <div class="flex-1">
        <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.hotsearch.sections.podcast.title') }}</h3>
        <p class="text-muted mt-1 text-sm">{{ t('pages.settings.hotsearch.sections.podcast.description') }}</p>
      </div>
    </template>
  </UPageCard>

  <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
    <UFormField :label="t('pages.settings.hotsearch.fields.podcastProgramNames.label')" :description="t('pages.settings.hotsearch.fields.podcastProgramNames.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="not-last:pb-4">
      <div class="mt-5 grid gap-4 md:grid-cols-2">
        <UFormField :label="t('pages.settings.hotsearch.fields.podcastMorningProgramName.label')" :ui="{ label: 'text-sm text-highlighted mb-1', container: 'space-y-0' }" class="w-full min-w-0">
          <UInput :model-value="morningProgramName" color="primary" variant="outline" class="w-full" :disabled="props.disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastMorningProgramName.placeholder')" @update:model-value="handleMorningProgramNameUpdate" />
        </UFormField>

        <UFormField :label="t('pages.settings.hotsearch.fields.podcastEveningProgramName.label')" :ui="{ label: 'text-sm text-highlighted mb-1', container: 'space-y-0' }" class="w-full min-w-0">
          <UInput :model-value="eveningProgramName" color="primary" variant="outline" class="w-full" :disabled="props.disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastEveningProgramName.placeholder')" @update:model-value="handleEveningProgramNameUpdate" />
        </UFormField>

        <UFormField :label="t('pages.settings.hotsearch.fields.podcastVipMorningProgramName.label')" :ui="{ label: 'text-sm text-highlighted mb-1', container: 'space-y-0' }" class="w-full min-w-0">
          <UInput :model-value="vipMorningProgramName" color="primary" variant="outline" class="w-full" :disabled="props.disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastVipMorningProgramName.placeholder')" @update:model-value="handleVipMorningProgramNameUpdate" />
        </UFormField>

        <UFormField :label="t('pages.settings.hotsearch.fields.podcastVipEveningProgramName.label')" :ui="{ label: 'text-sm text-highlighted mb-1', container: 'space-y-0' }" class="w-full min-w-0">
          <UInput :model-value="vipEveningProgramName" color="primary" variant="outline" class="w-full" :disabled="props.disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastVipEveningProgramName.placeholder')" @update:model-value="handleVipEveningProgramNameUpdate" />
        </UFormField>
      </div>
    </UFormField>

    <UFormField
      :label="t('pages.settings.hotsearch.fields.podcastMaleSpeakerName.label')"
      :description="t('pages.settings.hotsearch.fields.podcastMaleSpeakerName.description')"
      :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
      class="flex items-center justify-between gap-3 not-last:pb-4"
    >
      <UInput :model-value="maleSpeakerName" color="primary" variant="outline" class="w-full md:w-56" :disabled="props.disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastMaleSpeakerName.placeholder')" @update:model-value="handleMaleSpeakerNameUpdate" />
    </UFormField>

    <UFormField
      :label="t('pages.settings.hotsearch.fields.podcastFemaleSpeakerName.label')"
      :description="t('pages.settings.hotsearch.fields.podcastFemaleSpeakerName.description')"
      :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
      class="flex items-center justify-between gap-3 not-last:pb-4"
    >
      <UInput :model-value="femaleSpeakerName" color="primary" variant="outline" class="w-full md:w-56" :disabled="props.disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastFemaleSpeakerName.placeholder')" @update:model-value="handleFemaleSpeakerNameUpdate" />
    </UFormField>

    <UFormField :label="t('pages.settings.hotsearch.fields.podcastVariables.label')" :description="t('pages.settings.hotsearch.fields.podcastVariables.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="not-last:pb-4">
      <div class="mt-4 flex flex-wrap gap-2">
        <UPopover v-for="item in computedVariableOptions" :key="item.token" mode="hover" :open-delay="120" :close-delay="80" arrow :content="{ side: 'top', align: 'start', sideOffset: 8 }" :ui="{ content: 'p-3 w-64' }">
          <UButton variant="outline" size="xs" :disabled="props.disabled" @mousedown.prevent @click="handleVariableInsert(item.token)">
            {{ item.label }}
          </UButton>

          <template #content>
            <div class="space-y-2">
              <div class="text-highlighted text-sm font-medium">{{ item.label }}</div>
              <div class="text-toned bg-elevated/60 rounded-md px-2.5 py-2 text-xs leading-5 break-all">{{ item.example }}</div>
              <div class="text-muted text-[11px]">{{ item.token }}</div>
            </div>
          </template>
        </UPopover>
      </div>
    </UFormField>

    <div class="space-y-5 not-last:pb-4">
      <section class="bg-elevated/30 border-default rounded-xl border p-4">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h4 class="text-highlighted text-sm font-semibold">{{ t('pages.settings.hotsearch.fields.podcastOpeningTemplates.label') }}</h4>
            <p class="text-muted mt-1 text-sm">{{ t('pages.settings.hotsearch.fields.podcastOpeningTemplates.description') }}</p>
          </div>

          <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="props.disabled" @click.stop.prevent="handleTemplateItemAppend('opening')">
            {{ t('pages.settings.hotsearch.actions.addOpeningTemplate') }}
          </UButton>
        </div>

        <div class="space-y-3">
          <UEmpty v-if="openingTemplateEntries.length === 0" icon="i-lucide:file-plus-2" :title="t('pages.settings.hotsearch.fields.podcastOpeningTemplates.empty.title')" :description="t('pages.settings.hotsearch.fields.podcastOpeningTemplates.empty.description')" />

          <div v-if="openingTemplateEntries.length > 0" ref="openingTemplateListElement" class="space-y-3">
            <div v-for="entry in openingTemplateEntries" :key="entry.renderKey" class="podcast-template-item flex items-center gap-2">
              <div class="border-accented bg-elevated/30 focus-within:border-primary flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border transition-colors duration-300">
                <div class="podcast-template-handle bg-elevated/30 text-dimmed border-default flex w-10 shrink-0 cursor-grab items-center justify-center border-r transition-colors duration-200 active:cursor-grabbing">
                  <UIcon name="i-lucide:grip-vertical" class="size-4" />
                </div>
                <USelect
                  :model-value="entry.item.voiceKey"
                  :items="computedVoiceOptions"
                  value-attribute="value"
                  option-attribute="label"
                  variant="none"
                  class="border-default w-30 shrink-0 rounded-none border-r bg-transparent"
                  :disabled="props.disabled"
                  @update:model-value="(value) => handleTemplateItemVoiceUpdate(entry.index, value)"
                />
                <UInput
                  :model-value="entry.item.content"
                  variant="none"
                  class="bg-default min-w-0 flex-1"
                  :disabled="props.disabled"
                  :placeholder="t('pages.settings.hotsearch.fields.podcastOpeningTemplates.placeholder')"
                  @click="handleTemplateItemContentFocus(entry.index, $event)"
                  @focus="handleTemplateItemContentFocus(entry.index, $event)"
                  @keyup="handleTemplateItemContentFocus(entry.index, $event)"
                  @select="handleTemplateItemContentFocus(entry.index, $event)"
                  @update:model-value="(value) => handleTemplateItemContentUpdate(entry.index, value)"
                />
                <USelect
                  :model-value="entry.item.segmentType"
                  :items="computedSegmentOptions"
                  value-attribute="value"
                  option-attribute="label"
                  variant="none"
                  class="border-default w-32 shrink-0 rounded-none border-l bg-transparent"
                  :disabled="props.disabled"
                  @update:model-value="(value) => handleTemplateItemSegmentTypeUpdate(entry.index, value)"
                />
                <div class="border-default flex w-10 shrink-0 items-center justify-center border-l">
                  <UButton color="neutral" variant="ghost" icon="i-lucide:x" class="text-muted flex h-full w-full items-center justify-center rounded-none p-0" :disabled="props.disabled" @click="handleTemplateItemRemove(entry.index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-elevated/30 border-default rounded-xl border p-4">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h4 class="text-highlighted text-sm font-semibold">{{ t('pages.settings.hotsearch.fields.podcastClosingTemplates.label') }}</h4>
            <p class="text-muted mt-1 text-sm">{{ t('pages.settings.hotsearch.fields.podcastClosingTemplates.description') }}</p>
          </div>

          <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="props.disabled" @click.stop.prevent="handleTemplateItemAppend('closing')">
            {{ t('pages.settings.hotsearch.actions.addClosingTemplate') }}
          </UButton>
        </div>

        <div class="space-y-3">
          <UEmpty v-if="closingTemplateEntries.length === 0" icon="i-lucide:file-plus-2" :title="t('pages.settings.hotsearch.fields.podcastClosingTemplates.empty.title')" :description="t('pages.settings.hotsearch.fields.podcastClosingTemplates.empty.description')" />

          <div v-if="closingTemplateEntries.length > 0" ref="closingTemplateListElement" class="space-y-3">
            <div v-for="entry in closingTemplateEntries" :key="entry.renderKey" class="podcast-template-item flex items-center gap-2">
              <div class="border-accented bg-elevated/30 focus-within:border-primary flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border transition-colors duration-300">
                <div class="podcast-template-handle bg-elevated/30 text-dimmed border-default flex w-10 shrink-0 cursor-grab items-center justify-center border-r transition-colors duration-200 active:cursor-grabbing">
                  <UIcon name="i-lucide:grip-vertical" class="size-4" />
                </div>
                <USelect
                  :model-value="entry.item.voiceKey"
                  :items="computedVoiceOptions"
                  value-attribute="value"
                  option-attribute="label"
                  variant="none"
                  class="border-default w-30 shrink-0 rounded-none border-r bg-transparent"
                  :disabled="props.disabled"
                  @update:model-value="(value) => handleTemplateItemVoiceUpdate(entry.index, value)"
                />
                <UInput
                  :model-value="entry.item.content"
                  variant="none"
                  class="bg-default min-w-0 flex-1"
                  :disabled="props.disabled"
                  :placeholder="t('pages.settings.hotsearch.fields.podcastClosingTemplates.placeholder')"
                  @click="handleTemplateItemContentFocus(entry.index, $event)"
                  @focus="handleTemplateItemContentFocus(entry.index, $event)"
                  @keyup="handleTemplateItemContentFocus(entry.index, $event)"
                  @select="handleTemplateItemContentFocus(entry.index, $event)"
                  @update:model-value="(value) => handleTemplateItemContentUpdate(entry.index, value)"
                />
                <USelect
                  :model-value="entry.item.segmentType"
                  :items="computedSegmentOptions"
                  value-attribute="value"
                  option-attribute="label"
                  variant="none"
                  class="border-default w-32 shrink-0 rounded-none border-l bg-transparent"
                  :disabled="props.disabled"
                  @update:model-value="(value) => handleTemplateItemSegmentTypeUpdate(entry.index, value)"
                />
                <div class="border-default flex w-10 shrink-0 items-center justify-center border-l">
                  <UButton color="neutral" variant="ghost" icon="i-lucide:x" class="text-muted flex h-full w-full items-center justify-center rounded-none p-0" :disabled="props.disabled" @click="handleTemplateItemRemove(entry.index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { useDraggable } from 'vue-draggable-plus';

import type { ISettingsHotsearchPodcastSegmentType, ISettingsHotsearchPodcastTemplateItem, THotsearchPodcastTemplateType, THotsearchPodcastVoiceKey } from '@@/shared/types/index.types';

import type { ISettingsHotsearchPodcastScriptSettingsProps } from './index.types';

/**
 * 类型：模板片段渲染项。
 */
interface IHotsearchPodcastTemplateEntry {
  /**
   * 字段：模板片段数据。
   */
  item: ISettingsHotsearchPodcastTemplateItem;
  /**
   * 字段：模板片段在总列表中的索引。
   */
  index: number;
  /**
   * 字段：模板片段稳定渲染键。
   */
  renderKey: string;
}

/**
 * 属性：热搜播客文案设置。
 */
const props = withDefaults(defineProps<ISettingsHotsearchPodcastScriptSettingsProps>(), {
  disabled: false,
  templateItems: () => []
});

/**
 * 事件：热搜播客文案设置更新。
 */
const emit = defineEmits<{
  'update:templateItems': [value: ISettingsHotsearchPodcastTemplateItem[]];
  'update:template-items': [value: ISettingsHotsearchPodcastTemplateItem[]];
}>();

/**
 * 数据：男生播报者名称。
 */
const maleSpeakerName = defineModel<string>('maleSpeakerName', { default: '小洛' });

/**
 * 数据：女生播报者名称。
 */
const femaleSpeakerName = defineModel<string>('femaleSpeakerName', { default: '菲菲' });

/**
 * 数据：早间节目名称。
 */
const morningProgramName = defineModel<string>('morningProgramName', { default: '洛菲热点早报' });

/**
 * 数据：晚间节目名称。
 */
const eveningProgramName = defineModel<string>('eveningProgramName', { default: '洛菲热点晚报' });

/**
 * 数据：VIP 专项版早间节目名称。
 */
const vipMorningProgramName = defineModel<string>('vipMorningProgramName', { default: '洛菲热点早报 尊享版' });

/**
 * 数据：VIP 专项版晚间节目名称。
 */
const vipEveningProgramName = defineModel<string>('vipEveningProgramName', { default: '洛菲热点晚报 尊享版' });

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * 状态：当前聚焦的模板片段索引。
 */
const activeTemplateItemIndex = ref<number | null>(null);

/**
 * 状态：当前文案光标起点。
 */
const activeTemplateItemSelectionStart = ref<number | null>(null);

/**
 * 状态：当前文案光标终点。
 */
const activeTemplateItemSelectionEnd = ref<number | null>(null);

/**
 * 状态：本地模板片段列表。
 */
const stateTemplateItems = ref<ISettingsHotsearchPodcastTemplateItem[]>([]);

/**
 * 状态：开头模板列表容器。
 */
const openingTemplateListElement = ref<HTMLElement | null>(null);

/**
 * 状态：结尾模板列表容器。
 */
const closingTemplateListElement = ref<HTMLElement | null>(null);

/**
 * 状态：模板片段稳定渲染键列表。
 */
const templateItemRenderKeys = ref<string[]>([]);

/**
 * 变量：片段输入框 DOM 引用。
 */
const templateItemInputElements = ref<Array<HTMLInputElement | null>>([]);

/**
 * 监听：同步父级模板片段。
 */
watch(
  () => props.templateItems,
  (value) => {
    stateTemplateItems.value = [...value];
    templateItemRenderKeys.value = value.map((_, index) => templateItemRenderKeys.value[index] ?? templateItemRenderKeyCreate());
  },
  {
    deep: true,
    immediate: true
  }
);

/**
 * 计算属性：播客音色选项。
 */
const computedVoiceOptions = computed(() =>
  hotsearchPodcastVoiceOptionsGet().map((item) => ({
    value: item.value,
    label: t(item.key)
  }))
);

/**
 * 计算属性：文案类型选项。
 */
const computedSegmentOptions = computed<Array<{ value: ISettingsHotsearchPodcastSegmentType; label: string }>>(() =>
  hotsearchPodcastSegmentOptionsGet().map((item) => ({
    value: item.value,
    label: t(item.key)
  }))
);

/**
 * 计算属性：开头模板列表。
 */
const openingTemplateEntries = computed<IHotsearchPodcastTemplateEntry[]>(() => stateTemplateItems.value.map((item, index) => ({ item, index, renderKey: templateItemRenderKeys.value[index] ?? `template-item-${index}` })).filter((entry) => entry.item.templateType === 'opening'));

/**
 * 计算属性：结尾模板列表。
 */
const closingTemplateEntries = computed<IHotsearchPodcastTemplateEntry[]>(() => stateTemplateItems.value.map((item, index) => ({ item, index, renderKey: templateItemRenderKeys.value[index] ?? `template-item-${index}` })).filter((entry) => entry.item.templateType === 'closing'));

/**
 * 计算属性：变量列表。
 */
const computedVariableOptions = computed(() =>
  hotsearchPodcastVariableOptionsGet().map((item) => ({
    token: item.token,
    label: t(item.key),
    description: t(item.descriptionKey),
    example: hotsearchPodcastVariableExampleGet(item.token)
  }))
);

/**
 * 函数：创建模板片段稳定渲染键。
 * @returns {string} 渲染键。
 */
const templateItemRenderKeyCreate = (): string => {
  return `template-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * 函数：将数字日期转换为中文大写日期。
 * @param {number} value 数值。
 * @returns {string} 中文日期。
 */
const numberToChineseDateText = (value: number): string => {
  const numerals = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  if (value <= 0) {
    return '';
  }

  if (value <= 10) {
    return value === 10 ? '十' : numerals[value] || '';
  }

  if (value < 20) {
    return `十${numerals[value % 10] || ''}`;
  }

  if (value % 10 === 0) {
    return `${numerals[Math.trunc(value / 10)] || ''}十`;
  }

  return `${numerals[Math.trunc(value / 10)] || ''}十${numerals[value % 10] || ''}`;
};

/**
 * 函数：归一化农历月日文本。
 * @param {string} value 原始农历文本。
 * @returns {string} 归一化后的农历月日。
 */
const lunarDateTextNormalize = (value: string): string => {
  return value
    .replace(/^农历/, '')
    .replace(/(\d{1,2})月/, (_, monthText: string) => `${numberToChineseDateText(Number(monthText))}月`)
    .replace(/(\d{1,2})(?:日|号)?$/, (_, dayText: string) => numberToChineseDateText(Number(dayText)));
};

/**
 * 函数：按当前设置生成变量示例值。
 * @param {string} token 变量 token。
 * @returns {string} 示例值。
 */
const hotsearchPodcastVariableExampleGet = (token: string): string => {
  const now = new Date();
  const solarYear = now.getFullYear();
  const solarMonth = now.getMonth() + 1;
  const solarDay = now.getDate();
  const solarDateTime = `${solarYear}年${solarMonth}月${solarDay}日`;
  const solarDate = `${solarMonth}月${solarDay}日`;
  const solarTime = new Intl.DateTimeFormat('zh-CN', {
    timeStyle: 'short'
  }).format(now);
  const lunarRawDate = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    month: 'long',
    day: 'numeric'
  }).format(now);
  const lunarDate = `农历${lunarDateTextNormalize(lunarRawDate)}`;
  const weekday = new Intl.DateTimeFormat('zh-CN', {
    weekday: 'long'
  }).format(now);
  const maleSpeaker = maleSpeakerName.value || '小洛';
  const femaleSpeaker = femaleSpeakerName.value || '菲菲';
  const morningProgram = morningProgramName.value || '洛菲热点早报';
  const eveningProgram = eveningProgramName.value || '洛菲热点晚报';
  const vipMorningProgram = vipMorningProgramName.value || '洛菲热点早报 尊享版';
  const vipEveningProgram = vipEveningProgramName.value || '洛菲热点晚报 尊享版';

  switch (token) {
    case '[speakerName]':
      return `${maleSpeaker} 或 ${femaleSpeaker}`;
    case '[maleSpeakerName]':
      return maleSpeaker;
    case '[femaleSpeakerName]':
      return femaleSpeaker;
    case '[programName]':
      return `${morningProgram} 或 ${eveningProgram} 或 ${vipMorningProgram} 或 ${vipEveningProgram}`;
    case '[morningProgramName]':
      return morningProgram;
    case '[eveningProgramName]':
      return eveningProgram;
    case '[vipMorningProgramName]':
      return vipMorningProgram;
    case '[vipEveningProgramName]':
      return vipEveningProgram;
    case '[morningGreeting]':
      return '早上好';
    case '[eveningGreeting]':
      return '晚上好';
    case '[solarDateTime]':
      return solarDateTime;
    case '[solarDate]':
      return solarDate;
    case '[solarTime]':
      return solarTime;
    case '[lunarDateTime]':
      return lunarDate;
    case '[lunarDate]':
      return lunarDate;
    case '[weekday]':
      return weekday;
    case '[editionLabel]':
      return '早间版 或 晚间版';
    default:
      return token;
  }
};

/**
 * 函数：发出模板片段更新事件。
 * @param {ISettingsHotsearchPodcastTemplateItem[]} value 最新模板列表。
 * @param {string[]} renderKeys 最新渲染键列表。
 * @returns {void} 无返回值。
 */
const emitTemplateItemsUpdate = (value: ISettingsHotsearchPodcastTemplateItem[], renderKeys: string[] = templateItemRenderKeys.value): void => {
  stateTemplateItems.value = [...value];
  templateItemRenderKeys.value = [...renderKeys];
  emit('update:templateItems', value);
  emit('update:template-items', value);
};

/**
 * 函数：更新男生播报者名称。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleMaleSpeakerNameUpdate = (value: string | number): void => {
  maleSpeakerName.value = String(value ?? '');
};

/**
 * 函数：更新女生播报者名称。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleFemaleSpeakerNameUpdate = (value: string | number): void => {
  femaleSpeakerName.value = String(value ?? '');
};

/**
 * 函数：更新早间节目名称。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleMorningProgramNameUpdate = (value: string | number): void => {
  morningProgramName.value = String(value ?? '');
};

/**
 * 函数：更新晚间节目名称。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleEveningProgramNameUpdate = (value: string | number): void => {
  eveningProgramName.value = String(value ?? '');
};

/**
 * 函数：更新 VIP 专项版早间节目名称。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleVipMorningProgramNameUpdate = (value: string | number): void => {
  vipMorningProgramName.value = String(value ?? '');
};

/**
 * 函数：更新 VIP 专项版晚间节目名称。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleVipEveningProgramNameUpdate = (value: string | number): void => {
  vipEveningProgramName.value = String(value ?? '');
};

/**
 * 函数：更新模板片段音色。
 * @param {number} index 片段索引。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleTemplateItemVoiceUpdate = (index: number, value: string | number): void => {
  const nextItems = [...stateTemplateItems.value];
  nextItems[index] = {
    ...nextItems[index],
    voiceKey: String(value || '') as THotsearchPodcastVoiceKey
  };
  emitTemplateItemsUpdate(nextItems);
};

/**
 * 函数：更新模板片段文案。
 * @param {number} index 片段索引。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleTemplateItemContentUpdate = (index: number, value: string | number): void => {
  const nextItems = [...stateTemplateItems.value];
  nextItems[index] = {
    ...nextItems[index],
    content: String(value ?? '')
  };
  emitTemplateItemsUpdate(nextItems);
};

/**
 * 函数：更新模板片段文案类型。
 * @param {number} index 片段索引。
 * @param {string | number} value 最新值。
 * @returns {void} 无返回值。
 */
const handleTemplateItemSegmentTypeUpdate = (index: number, value: string | number): void => {
  const nextItems = [...stateTemplateItems.value];
  nextItems[index] = {
    ...nextItems[index],
    segmentType: String(value || 'normal') as ISettingsHotsearchPodcastSegmentType
  };
  emitTemplateItemsUpdate(nextItems);
};

/**
 * 函数：记录当前聚焦的文案输入框。
 * @param {number} index 片段索引。
 * @param {Event} event 原始事件。
 * @returns {void} 无返回值。
 */
const handleTemplateItemContentFocus = (index: number, event: Event): void => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    activeTemplateItemIndex.value = index;
    return;
  }

  activeTemplateItemIndex.value = index;
  activeTemplateItemSelectionStart.value = target.selectionStart;
  activeTemplateItemSelectionEnd.value = target.selectionEnd;
  templateItemInputElements.value[index] = target;
};

/**
 * 函数：新增模板片段。
 * @param {'opening' | 'closing'} templateType 模板类型。
 * @returns {void} 无返回值。
 */
const handleTemplateItemAppend = (templateType: THotsearchPodcastTemplateType): void => {
  const nextItems = stateTemplateItems.value.slice();
  const nextRenderKeys = [...templateItemRenderKeys.value, templateItemRenderKeyCreate()];
  nextItems.push(hotsearchPodcastTemplateItemDefaultCreate(templateType));
  const nextIndex = nextItems.length - 1;

  stateTemplateItems.value = nextItems;
  templateItemRenderKeys.value = nextRenderKeys;
  emitTemplateItemsUpdate(nextItems, nextRenderKeys);
  activeTemplateItemIndex.value = nextIndex;
  activeTemplateItemSelectionStart.value = 0;
  activeTemplateItemSelectionEnd.value = 0;

  void nextTick().then(() => {
    const inputElement = templateItemInputElements.value[nextIndex];
    inputElement?.focus();
    inputElement?.setSelectionRange(0, 0);
  });
};

/**
 * 函数：删除模板片段。
 * @param {number} index 片段索引。
 * @returns {void} 无返回值。
 */
const handleTemplateItemRemove = (index: number): void => {
  const nextItems = stateTemplateItems.value.filter((_, itemIndex) => itemIndex !== index);
  const nextRenderKeys = templateItemRenderKeys.value.filter((_, itemIndex) => itemIndex !== index);

  emitTemplateItemsUpdate(nextItems, nextRenderKeys);
  templateItemInputElements.value = templateItemInputElements.value.filter((_, itemIndex) => itemIndex !== index);

  if (activeTemplateItemIndex.value === index) {
    activeTemplateItemIndex.value = null;
    activeTemplateItemSelectionStart.value = null;
    activeTemplateItemSelectionEnd.value = null;
  } else if (activeTemplateItemIndex.value !== null && activeTemplateItemIndex.value > index) {
    activeTemplateItemIndex.value -= 1;
  }
};

/**
 * 函数：插入变量。
 * @param {string} token 变量 token。
 * @returns {Promise<void>} 无返回值。
 */
const handleVariableInsert = async (token: string): Promise<void> => {
  if (activeTemplateItemIndex.value !== null && stateTemplateItems.value[activeTemplateItemIndex.value]) {
    const index = activeTemplateItemIndex.value;
    const currentItem = stateTemplateItems.value[index];
    const selectionStart = activeTemplateItemSelectionStart.value ?? currentItem.content.length;
    const selectionEnd = activeTemplateItemSelectionEnd.value ?? selectionStart;
    const nextContent = `${currentItem.content.slice(0, selectionStart)}${token}${currentItem.content.slice(selectionEnd)}`;
    const nextCursor = selectionStart + token.length;
    const nextItems = [...stateTemplateItems.value];

    nextItems[index] = {
      ...currentItem,
      content: nextContent
    };

    emitTemplateItemsUpdate(nextItems);
    activeTemplateItemSelectionStart.value = nextCursor;
    activeTemplateItemSelectionEnd.value = nextCursor;

    await nextTick();

    const inputElement = templateItemInputElements.value[index];
    inputElement?.focus();
    inputElement?.setSelectionRange(nextCursor, nextCursor);
  }
};

/**
 * 函数：按模板类型重排模板片段。
 * @param {'opening' | 'closing'} templateType 模板类型。
 * @param {IHotsearchPodcastTemplateEntry[]} entries 重排后的模板列表。
 * @returns {void} 无返回值。
 */
const handleTemplateEntriesReorder = (templateType: THotsearchPodcastTemplateType, entries: IHotsearchPodcastTemplateEntry[]): void => {
  if (props.disabled) {
    return;
  }

  const targetIndexes = stateTemplateItems.value.reduce<number[]>((result, item, index) => {
    if (item.templateType === templateType) {
      result.push(index);
    }

    return result;
  }, []);

  if (targetIndexes.length !== entries.length) {
    return;
  }

  const nextItems = [...stateTemplateItems.value];
  const nextInputElements = [...templateItemInputElements.value];
  const nextRenderKeys = [...templateItemRenderKeys.value];
  const movedIndexMap = new Map<number, number>();

  entries.forEach((entry, orderIndex) => {
    const targetIndex = targetIndexes[orderIndex];

    nextItems[targetIndex] = entry.item;
    nextInputElements[targetIndex] = templateItemInputElements.value[entry.index] ?? null;
    nextRenderKeys[targetIndex] = entry.renderKey;
    movedIndexMap.set(entry.index, targetIndex);
  });

  templateItemInputElements.value = nextInputElements;

  if (activeTemplateItemIndex.value !== null && movedIndexMap.has(activeTemplateItemIndex.value)) {
    activeTemplateItemIndex.value = movedIndexMap.get(activeTemplateItemIndex.value) ?? activeTemplateItemIndex.value;
  }

  emitTemplateItemsUpdate(nextItems, nextRenderKeys);
};

/**
 * 函数：按模板类型移动模板片段。
 * @param {'opening' | 'closing'} templateType 模板类型。
 * @param {number} fromIndex 分组内起始索引。
 * @param {number} toIndex 分组内目标索引。
 * @returns {void} 无返回值。
 */
const handleTemplateEntryMoveByType = (templateType: THotsearchPodcastTemplateType, fromIndex: number, toIndex: number): void => {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return;
  }

  const entries = templateType === 'opening' ? [...openingTemplateEntries.value] : [...closingTemplateEntries.value];

  if (fromIndex >= entries.length || toIndex >= entries.length) {
    return;
  }

  const [movedEntry] = entries.splice(fromIndex, 1);
  entries.splice(toIndex, 0, movedEntry);
  handleTemplateEntriesReorder(templateType, entries);
};

const openingTemplateDraggable = useDraggable(openingTemplateListElement, {
  animation: 180,
  immediate: false,
  disabled: props.disabled,
  chosenClass: 'podcast-template-item-chosen',
  dragClass: 'podcast-template-item-drag',
  ghostClass: 'podcast-template-item-ghost',
  handle: '.podcast-template-handle',
  onUpdate: (event) => {
    if (event.oldIndex === undefined || event.newIndex === undefined) {
      return;
    }

    handleTemplateEntryMoveByType('opening', event.oldIndex, event.newIndex);
  }
});

const closingTemplateDraggable = useDraggable(closingTemplateListElement, {
  animation: 180,
  immediate: false,
  disabled: props.disabled,
  chosenClass: 'podcast-template-item-chosen',
  dragClass: 'podcast-template-item-drag',
  ghostClass: 'podcast-template-item-ghost',
  handle: '.podcast-template-handle',
  onUpdate: (event) => {
    if (event.oldIndex === undefined || event.newIndex === undefined) {
      return;
    }

    handleTemplateEntryMoveByType('closing', event.oldIndex, event.newIndex);
  }
});

/**
 * 函数：同步模板拖拽实例。
 * @param {UseDraggableReturn} draggable 拖拽实例。
 * @param {HTMLElement | null} element 列表容器。
 * @param {number} length 当前列表长度。
 * @returns {Promise<void>} 无返回值。
 */
const syncTemplateDraggable = async (draggable: ReturnType<typeof useDraggable>, element: HTMLElement | null, length: number): Promise<void> => {
  draggable.destroy();

  if (!element || length <= 0 || props.disabled) {
    return;
  }

  await nextTick();

  if (!element.isConnected) {
    return;
  }

  draggable.start(element);
};

watch(
  [openingTemplateListElement, () => openingTemplateEntries.value.length, () => props.disabled],
  async ([element, length]) => {
    await syncTemplateDraggable(openingTemplateDraggable, element, length);
  },
  {
    flush: 'post'
  }
);

watch(
  [closingTemplateListElement, () => closingTemplateEntries.value.length, () => props.disabled],
  async ([element, length]) => {
    await syncTemplateDraggable(closingTemplateDraggable, element, length);
  },
  {
    flush: 'post'
  }
);

onBeforeUnmount(() => {
  openingTemplateDraggable.destroy();
  closingTemplateDraggable.destroy();
});
</script>

<style scoped>
.podcast-template-item {
  transition:
    transform 180ms ease,
    opacity 180ms ease,
    filter 180ms ease;
}

.podcast-template-item :deep(.podcast-template-handle) {
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.podcast-template-item:hover :deep(.podcast-template-handle) {
  background-color: color-mix(in srgb, var(--ui-primary) 8%, transparent);
  color: var(--ui-primary);
}

.podcast-template-item-chosen {
  z-index: 2;
}

.podcast-template-item-chosen :deep(> div) {
  border-color: color-mix(in srgb, var(--ui-primary) 36%, var(--ui-border));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ui-primary) 18%, transparent);
}

.podcast-template-item-chosen :deep(.podcast-template-handle) {
  background-color: color-mix(in srgb, var(--ui-primary) 12%, transparent);
  color: var(--ui-primary);
}

.podcast-template-item-ghost {
  opacity: 0.42;
}

.podcast-template-item-ghost :deep(> div) {
  border-style: dashed;
  border-color: color-mix(in srgb, var(--ui-primary) 32%, var(--ui-border));
}

.podcast-template-item-drag {
  z-index: 30;
  transform: scale(1.01);
}

.podcast-template-item-drag :deep(> div) {
  border-color: color-mix(in srgb, var(--ui-primary) 44%, var(--ui-border));
  box-shadow:
    0 14px 36px rgba(15, 23, 42, 0.16),
    0 0 0 1px color-mix(in srgb, var(--ui-primary) 24%, transparent);
}

.podcast-template-item-drag :deep(.podcast-template-handle) {
  background-color: color-mix(in srgb, var(--ui-primary) 16%, transparent);
  color: var(--ui-primary);
}
</style>
