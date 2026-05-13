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

          <div v-for="entry in openingTemplateEntries" :key="`opening:${entry.index}`" class="flex items-center gap-2" @dragover.prevent @drop.prevent="handleTemplateItemDrop(entry.index)">
            <div class="border-accented bg-elevated/30 focus-within:border-primary flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border transition-colors duration-300">
              <div class="bg-elevated/30 text-dimmed border-default flex w-10 shrink-0 cursor-grab items-center justify-center border-r active:cursor-grabbing" draggable="true" @dragstart="handleTemplateItemDragStart(entry.index, $event)" @dragend="handleTemplateItemDragEnd">
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
                <UButton color="neutral" variant="ghost" icon="i-lucide:x" class="text-muted h-full w-full rounded-none" :disabled="props.disabled" @click="handleTemplateItemRemove(entry.index)" />
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

          <div v-for="entry in closingTemplateEntries" :key="`closing:${entry.index}`" class="flex items-center gap-2" @dragover.prevent @drop.prevent="handleTemplateItemDrop(entry.index)">
            <div class="border-accented bg-elevated/30 focus-within:border-primary flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border transition-colors duration-300">
              <div class="bg-elevated/30 text-dimmed border-default flex w-10 shrink-0 cursor-grab items-center justify-center border-r active:cursor-grabbing" draggable="true" @dragstart="handleTemplateItemDragStart(entry.index, $event)" @dragend="handleTemplateItemDragEnd">
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
                <UButton color="neutral" variant="ghost" icon="i-lucide:x" class="text-muted h-full w-full rounded-none" :disabled="props.disabled" @click="handleTemplateItemRemove(entry.index)" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import type { ISettingsHotsearchPodcastSegmentType, ISettingsHotsearchPodcastTemplateItem, THotsearchPodcastTemplateType, THotsearchPodcastVoiceKey } from '@@/shared/types/index.types';

import type { ISettingsHotsearchPodcastScriptSettingsProps } from './index.types';

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
 * 状态：当前拖拽中的片段索引。
 */
const draggingTemplateItemIndex = ref<number | null>(null);

/**
 * 状态：本地模板片段列表。
 */
const stateTemplateItems = ref<ISettingsHotsearchPodcastTemplateItem[]>([]);

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
const openingTemplateEntries = computed(() => stateTemplateItems.value.map((item, index) => ({ item, index })).filter((entry) => entry.item.templateType === 'opening'));

/**
 * 计算属性：结尾模板列表。
 */
const closingTemplateEntries = computed(() => stateTemplateItems.value.map((item, index) => ({ item, index })).filter((entry) => entry.item.templateType === 'closing'));

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
 * @returns {void} 无返回值。
 */
const emitTemplateItemsUpdate = (value: ISettingsHotsearchPodcastTemplateItem[]): void => {
  stateTemplateItems.value = [...value];
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
  nextItems.push(hotsearchPodcastTemplateItemDefaultCreate(templateType));
  const nextIndex = nextItems.length - 1;

  stateTemplateItems.value = nextItems;
  emitTemplateItemsUpdate(nextItems);
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
  emitTemplateItemsUpdate(stateTemplateItems.value.filter((_, itemIndex) => itemIndex !== index));
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
 * 函数：开始拖拽模板片段。
 * @param {number} index 片段索引。
 * @param {DragEvent} event 原始拖拽事件。
 * @returns {void} 无返回值。
 */
const handleTemplateItemDragStart = (index: number, event: DragEvent): void => {
  if (props.disabled) {
    return;
  }

  event.dataTransfer?.setData('text/plain', String(index));
  event.dataTransfer!.effectAllowed = 'move';
  draggingTemplateItemIndex.value = index;
};

/**
 * 函数：放下拖拽片段。
 * @param {number} index 片段索引。
 * @returns {void} 无返回值。
 */
const handleTemplateItemDrop = (index: number): void => {
  if (props.disabled || draggingTemplateItemIndex.value === null) {
    return;
  }

  handleTemplateItemMove(draggingTemplateItemIndex.value, index);
  draggingTemplateItemIndex.value = null;
};

/**
 * 函数：结束拖拽片段。
 * @returns {void} 无返回值。
 */
const handleTemplateItemDragEnd = (): void => {
  draggingTemplateItemIndex.value = null;
};

/**
 * 函数：移动模板片段。
 * @param {number} fromIndex 起始索引。
 * @param {number} toIndex 目标索引。
 * @returns {void} 无返回值。
 */
const handleTemplateItemMove = (fromIndex: number, toIndex: number): void => {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= stateTemplateItems.value.length || toIndex >= stateTemplateItems.value.length) {
    return;
  }

  const nextItems = [...stateTemplateItems.value];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  emitTemplateItemsUpdate(nextItems);

  const nextInputElements = [...templateItemInputElements.value];
  const [movedInputElement] = nextInputElements.splice(fromIndex, 1);
  nextInputElements.splice(toIndex, 0, movedInputElement ?? null);
  templateItemInputElements.value = nextInputElements;

  if (activeTemplateItemIndex.value === fromIndex) {
    activeTemplateItemIndex.value = toIndex;
    return;
  }

  if (activeTemplateItemIndex.value === null) {
    return;
  }

  if (fromIndex < toIndex && activeTemplateItemIndex.value > fromIndex && activeTemplateItemIndex.value <= toIndex) {
    activeTemplateItemIndex.value -= 1;
  } else if (fromIndex > toIndex && activeTemplateItemIndex.value >= toIndex && activeTemplateItemIndex.value < fromIndex) {
    activeTemplateItemIndex.value += 1;
  }
};
</script>
