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
          <UInput :model-value="morningProgramName" color="primary" variant="outline" class="w-full" :disabled="disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastMorningProgramName.placeholder')" @update:model-value="handleMorningProgramNameUpdate" />
        </UFormField>

        <UFormField :label="t('pages.settings.hotsearch.fields.podcastEveningProgramName.label')" :ui="{ label: 'text-sm text-highlighted mb-1', container: 'space-y-0' }" class="w-full min-w-0">
          <UInput :model-value="eveningProgramName" color="primary" variant="outline" class="w-full" :disabled="disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastEveningProgramName.placeholder')" @update:model-value="handleEveningProgramNameUpdate" />
        </UFormField>

        <UFormField :label="t('pages.settings.hotsearch.fields.podcastVipMorningProgramName.label')" :ui="{ label: 'text-sm text-highlighted mb-1', container: 'space-y-0' }" class="w-full min-w-0">
          <UInput :model-value="vipMorningProgramName" color="primary" variant="outline" class="w-full" :disabled="disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastVipMorningProgramName.placeholder')" @update:model-value="handleVipMorningProgramNameUpdate" />
        </UFormField>

        <UFormField :label="t('pages.settings.hotsearch.fields.podcastVipEveningProgramName.label')" :ui="{ label: 'text-sm text-highlighted mb-1', container: 'space-y-0' }" class="w-full min-w-0">
          <UInput :model-value="vipEveningProgramName" color="primary" variant="outline" class="w-full" :disabled="disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastVipEveningProgramName.placeholder')" @update:model-value="handleVipEveningProgramNameUpdate" />
        </UFormField>
      </div>
    </UFormField>

    <UFormField
      :label="t('pages.settings.hotsearch.fields.podcastMaleSpeakerName.label')"
      :description="t('pages.settings.hotsearch.fields.podcastMaleSpeakerName.description')"
      :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
      class="flex items-center justify-between gap-3 not-last:pb-4"
    >
      <UInput :model-value="maleSpeakerName" color="primary" variant="outline" class="w-full md:w-56" :disabled="disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastMaleSpeakerName.placeholder')" @update:model-value="handleMaleSpeakerNameUpdate" />
    </UFormField>

    <UFormField
      :label="t('pages.settings.hotsearch.fields.podcastFemaleSpeakerName.label')"
      :description="t('pages.settings.hotsearch.fields.podcastFemaleSpeakerName.description')"
      :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
      class="flex items-center justify-between gap-3 not-last:pb-4"
    >
      <UInput :model-value="femaleSpeakerName" color="primary" variant="outline" class="w-full md:w-56" :disabled="disabled" :placeholder="t('pages.settings.hotsearch.fields.podcastFemaleSpeakerName.placeholder')" @update:model-value="handleFemaleSpeakerNameUpdate" />
    </UFormField>

    <UFormField :label="t('pages.settings.hotsearch.fields.podcastVariables.label')" :description="t('pages.settings.hotsearch.fields.podcastVariables.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="not-last:pb-4">
      <div class="mt-4 flex flex-wrap gap-2">
        <UPopover v-for="item in computedVariableOptions" :key="item.token" mode="hover" :open-delay="120" :close-delay="80" arrow :content="{ side: 'top', align: 'start', sideOffset: 8 }" :ui="{ content: 'p-3 w-64' }">
          <UButton variant="outline" size="xs" :disabled="disabled" @mousedown.prevent @click="handleVariableInsert(item.token)">
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

          <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="disabled" @click.stop.prevent="handleTemplateItemAppend('opening')">
            {{ t('pages.settings.hotsearch.actions.addOpeningTemplate') }}
          </UButton>
        </div>

        <div class="space-y-3">
          <UEmpty v-if="openingTemplateItems.length === 0" icon="i-lucide:file-plus-2" :title="t('pages.settings.hotsearch.fields.podcastOpeningTemplates.empty.title')" :description="t('pages.settings.hotsearch.fields.podcastOpeningTemplates.empty.description')" />

          <VueDraggable
            v-if="openingTemplateItems.length > 0"
            v-model="openingTemplateItemsModel"
            tag="div"
            class="podcast-template-draggable"
            target=".podcast-template-list"
            :animation="240"
            easing="cubic-bezier(0.22, 1, 0.36, 1)"
            :disabled="disabled"
            direction="vertical"
            draggable=".podcast-template-item"
            chosen-class="podcast-template-item-chosen"
            drag-class="podcast-template-item-drag"
            ghost-class="podcast-template-item-ghost"
            handle=".podcast-template-handle"
            @start="handleTemplateDragStart"
            @end="handleTemplateDragEnd"
          >
            <TransitionGroup tag="div" class="podcast-template-list space-y-3" type="transition" :name="!stateTemplateDragging ? 'podcast-template-sort' : undefined">
              <div v-for="item in openingTemplateItems" :key="templateItemRenderKeyGet(item)" class="podcast-template-item flex items-center gap-2">
                <SettingsHotsearchPodcastScriptListItem
                  :item="item"
                  :disabled="disabled"
                  editor-mode="template"
                  :voice-options="computedVoiceOptions"
                  :segment-options="computedTemplateSegmentOptions"
                  :placeholder="t('pages.settings.hotsearch.fields.podcastOpeningTemplates.placeholder')"
                  :ad-content-placeholder="t('pages.settings.hotsearch.fields.podcastOpeningTemplates.placeholderAdContent')"
                  @update:voice-key="(value) => handleTemplateItemVoiceUpdate(templateItemStateIndexGet(item), value)"
                  @update:content="(value) => handleTemplateItemContentUpdate(templateItemStateIndexGet(item), value)"
                  @update:segment-type="(value) => handleTemplateItemSegmentTypeUpdate(templateItemStateIndexGet(item), value)"
                  @focus-content="(event) => handleTemplateItemContentFocus(templateItemStateIndexGet(item), event)"
                  @remove="handleTemplateItemRemove(templateItemStateIndexGet(item))"
                />
              </div>
            </TransitionGroup>
          </VueDraggable>
        </div>
      </section>

      <section class="bg-elevated/30 border-default rounded-xl border p-4">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h4 class="text-highlighted text-sm font-semibold">{{ t('pages.settings.hotsearch.fields.podcastClosingTemplates.label') }}</h4>
            <p class="text-muted mt-1 text-sm">{{ t('pages.settings.hotsearch.fields.podcastClosingTemplates.description') }}</p>
          </div>

          <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="disabled" @click.stop.prevent="handleTemplateItemAppend('closing')">
            {{ t('pages.settings.hotsearch.actions.addClosingTemplate') }}
          </UButton>
        </div>

        <div class="space-y-3">
          <UEmpty v-if="closingTemplateItems.length === 0" icon="i-lucide:file-plus-2" :title="t('pages.settings.hotsearch.fields.podcastClosingTemplates.empty.title')" :description="t('pages.settings.hotsearch.fields.podcastClosingTemplates.empty.description')" />

          <VueDraggable
            v-if="closingTemplateItems.length > 0"
            v-model="closingTemplateItemsModel"
            tag="div"
            class="podcast-template-draggable"
            target=".podcast-template-list"
            :animation="240"
            easing="cubic-bezier(0.22, 1, 0.36, 1)"
            :disabled="disabled"
            direction="vertical"
            draggable=".podcast-template-item"
            chosen-class="podcast-template-item-chosen"
            drag-class="podcast-template-item-drag"
            ghost-class="podcast-template-item-ghost"
            handle=".podcast-template-handle"
            @start="handleTemplateDragStart"
            @end="handleTemplateDragEnd"
          >
            <TransitionGroup tag="div" class="podcast-template-list space-y-3" type="transition" :name="!stateTemplateDragging ? 'podcast-template-sort' : undefined">
              <div v-for="item in closingTemplateItems" :key="templateItemRenderKeyGet(item)" class="podcast-template-item flex items-center gap-2">
                <SettingsHotsearchPodcastScriptListItem
                  :item="item"
                  :disabled="disabled"
                  editor-mode="template"
                  :voice-options="computedVoiceOptions"
                  :segment-options="computedTemplateSegmentOptions"
                  :placeholder="t('pages.settings.hotsearch.fields.podcastClosingTemplates.placeholder')"
                  :ad-content-placeholder="t('pages.settings.hotsearch.fields.podcastClosingTemplates.placeholderAdContent')"
                  @update:voice-key="(value) => handleTemplateItemVoiceUpdate(templateItemStateIndexGet(item), value)"
                  @update:content="(value) => handleTemplateItemContentUpdate(templateItemStateIndexGet(item), value)"
                  @update:segment-type="(value) => handleTemplateItemSegmentTypeUpdate(templateItemStateIndexGet(item), value)"
                  @focus-content="(event) => handleTemplateItemContentFocus(templateItemStateIndexGet(item), event)"
                  @remove="handleTemplateItemRemove(templateItemStateIndexGet(item))"
                />
              </div>
            </TransitionGroup>
          </VueDraggable>
        </div>
      </section>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';

import type { ISettingsHotsearchPodcastScriptListProps } from '@/components/settings/hotsearch/podcast-script-list/index.types';

/**
 * 属性：热搜播客文案列表。
 */
const { disabled = false, templateItems = [] } = defineProps<ISettingsHotsearchPodcastScriptListProps>();

/**
 * 事件：热搜播客文案设置更新。
 */
const emit = defineEmits<{
  'update:template-items': [value: ISettingsHotsearchPodcastTemplateItem[]];
}>();

/**
 * 数据：男生播报者名称。
 */
const maleSpeakerName = defineModel<string>('maleSpeakerName', { default: '男声主播' });

/**
 * 数据：女生播报者名称。
 */
const femaleSpeakerName = defineModel<string>('femaleSpeakerName', { default: '女声主播' });

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
const stateActiveTemplateItemIndex = ref<number | null>(null);

/**
 * 状态：当前文案光标起点。
 */
const stateActiveTemplateItemSelectionStart = ref<number | null>(null);

/**
 * 状态：当前文案光标终点。
 */
const stateActiveTemplateItemSelectionEnd = ref<number | null>(null);

/**
 * 状态：本地模板片段列表。
 */
const stateTemplateItems = ref<ISettingsHotsearchPodcastTemplateItem[]>([]);

/**
 * 状态：模板片段稳定渲染键列表。
 */
const stateTemplateItemRenderKeys = ref<string[]>([]);

/**
 * 变量：片段输入框 DOM 引用。
 */
const stateTemplateItemInputElements = ref<Array<HTMLInputElement | null>>([]);

/**
 * 状态：当前是否处于模板拖拽中。
 */
const stateTemplateDragging = ref(false);

/**
 * 函数：判断模板片段列表是否一致。
 * @param {ISettingsHotsearchPodcastTemplateItem[]} left 左侧模板列表。
 * @param {ISettingsHotsearchPodcastTemplateItem[]} right 右侧模板列表。
 * @returns {boolean} 是否一致。
 */
const templateItemsEqual = (left: ISettingsHotsearchPodcastTemplateItem[], right: ISettingsHotsearchPodcastTemplateItem[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((item, index) => {
    /**
     * 常量：target。
     */
    const target = right[index];

    if (!target) {
      return false;
    }

    return item.voiceKey === target.voiceKey && item.content === target.content && item.segmentType === target.segmentType && item.templateType === target.templateType;
  });
};

/**
 * 监听：同步父级模板片段。
 */
watch(
  () => templateItems,
  (value) => {
    if (templateItemsEqual(stateTemplateItems.value, value)) {
      return;
    }

    stateTemplateItems.value = [...value];
    stateTemplateItemRenderKeys.value = value.map((_, index) => stateTemplateItemRenderKeys.value[index] ?? templateItemRenderKeyCreate());
  },
  {
    deep: true,
    immediate: true
  }
);

/**
 * 计算属性：播客音色选项。
 */
const computedVoiceOptions = computed(() => {
  return hotsearchPodcastVoiceOptionsGet().map((item) => ({
    value: item.value,
    label: t(item.key)
  }));
});

/**
 * 计算属性：模板文案类型选项。
 */
const computedTemplateSegmentOptions = computed<Array<{ value: THotsearchPodcastSegmentType; label: string }>>(() =>
  hotsearchPodcastSegmentOptionsGet('template').map((item) => ({
    value: item.value,
    label: t(item.key)
  }))
);

/**
 * 计算属性：开头模板列表。
 */
const openingTemplateItems = computed<ISettingsHotsearchPodcastTemplateItem[]>(() => stateTemplateItems.value.filter((item) => item.templateType === 'opening'));

/**
 * 计算属性：结尾模板列表。
 */
const closingTemplateItems = computed<ISettingsHotsearchPodcastTemplateItem[]>(() => stateTemplateItems.value.filter((item) => item.templateType === 'closing'));

/**
 * 计算属性：可写的开头模板列表。
 */
const openingTemplateItemsModel = computed<ISettingsHotsearchPodcastTemplateItem[]>({
  get: () => openingTemplateItems.value,
  set: (value) => {
    handleTemplateItemsReorder('opening', value);
  }
});

/**
 * 计算属性：可写的结尾模板列表。
 */
const closingTemplateItemsModel = computed<ISettingsHotsearchPodcastTemplateItem[]>({
  get: () => closingTemplateItems.value,
  set: (value) => {
    handleTemplateItemsReorder('closing', value);
  }
});

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
function templateItemRenderKeyCreate(): string {
  return `template-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * 函数：获取模板片段在总列表中的索引。
 * @param {ISettingsHotsearchPodcastTemplateItem} item 模板片段。
 * @returns {number} 总列表索引。
 */
const templateItemStateIndexGet = (item: ISettingsHotsearchPodcastTemplateItem): number => {
  return stateTemplateItems.value.indexOf(item);
};

/**
 * 函数：获取模板片段稳定渲染键。
 * @param {ISettingsHotsearchPodcastTemplateItem} item 模板片段。
 * @returns {string} 渲染键。
 */
const templateItemRenderKeyGet = (item: ISettingsHotsearchPodcastTemplateItem): string => {
  /**
   * 常量：index。
   */
  const index = templateItemStateIndexGet(item);

  if (index < 0) {
    return templateItemRenderKeyCreate();
  }

  return stateTemplateItemRenderKeys.value[index] ?? `template-item-${index}`;
};

/**
 * 函数：标记模板拖拽开始。
 * @returns {void} 无返回值。
 */
const handleTemplateDragStart = (): void => {
  stateTemplateDragging.value = true;
};

/**
 * 函数：标记模板拖拽结束。
 * @returns {Promise<void>} 无返回值。
 */
const handleTemplateDragEnd = async (): Promise<void> => {
  await nextTick();
  stateTemplateDragging.value = false;
};

/**
 * 函数：将数字日期转换为中文大写日期。
 * @param {number} value 数值。
 * @returns {string} 中文日期。
 */
const numberToChineseDateText = (value: number): string => {
  /**
   * 常量：numerals。
   */
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
 * 函数：生成带干支年的农历年月日文本。
 * @param {Date} value 日期。
 * @returns {string} 归一化后的农历年月日。
 */
const lunarDateTimeTextGet = (value: Date): string => {
  /**
   * 常量：lunarRawDateTime。
   */
  const lunarRawDateTime = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(value);
  /**
   * 函数：normalized。
   */
  const normalized = lunarDateTextNormalize(lunarRawDateTime.replace(/^\d+/, ''));

  return normalized.startsWith('农历') ? normalized : `农历${normalized}`;
};

/**
 * 函数：将节目名称格式化为带中文书名号的文本。
 * @param {string} value 原始节目名称。
 * @returns {string} 带中文书名号的节目名称。
 */
const programNameRender = (value: string): string => {
  /**
   * 函数：normalized。
   */
  const normalized = String(value || '')
    .trim()
    .replace(/^《/, '')
    .replace(/》$/, '')
    .trim();

  return `《${normalized}》`;
};

/**
 * 函数：按当前设置生成变量示例值。
 * @param {string} token 变量 token。
 * @returns {string} 示例值。
 */
const hotsearchPodcastVariableExampleGet = (token: string): string => {
  /**
   * 常量：now。
   */
  const now = new Date();
  /**
   * 常量：solarYear。
   */
  const solarYear = now.getFullYear();
  /**
   * 常量：solarMonth。
   */
  const solarMonth = now.getMonth() + 1;
  /**
   * 常量：solarDay。
   */
  const solarDay = now.getDate();
  /**
   * 常量：solarDateTime。
   */
  const solarDateTime = `${solarYear}年${solarMonth}月${solarDay}日`;
  /**
   * 常量：solarDate。
   */
  const solarDate = `${solarMonth}月${solarDay}日`;
  /**
   * 常量：solarTime。
   */
  const solarTime = new Intl.DateTimeFormat('zh-CN', {
    timeStyle: 'short'
  }).format(now);
  /**
   * 常量：lunarRawDate。
   */
  const lunarRawDate = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    month: 'long',
    day: 'numeric'
  }).format(now);
  /**
   * 常量：lunarDate。
   */
  const lunarDate = `农历${lunarDateTextNormalize(lunarRawDate)}`;
  /**
   * 常量：lunarDateTime。
   */
  const lunarDateTime = lunarDateTimeTextGet(now);
  /**
   * 常量：weekday。
   */
  const weekday = new Intl.DateTimeFormat('zh-CN', {
    weekday: 'long'
  }).format(now);
  /**
   * 常量：maleSpeaker。
   */
  const maleSpeaker = maleSpeakerName.value || '男声主播';
  /**
   * 常量：femaleSpeaker。
   */
  const femaleSpeaker = femaleSpeakerName.value || '女声主播';
  /**
   * 常量：morningProgram。
   */
  const morningProgram = programNameRender(morningProgramName.value || '洛菲热点早报');
  /**
   * 常量：eveningProgram。
   */
  const eveningProgram = programNameRender(eveningProgramName.value || '洛菲热点晚报');
  /**
   * 常量：vipMorningProgram。
   */
  const vipMorningProgram = programNameRender(vipMorningProgramName.value || '洛菲热点早报 尊享版');
  /**
   * 常量：vipEveningProgram。
   */
  const vipEveningProgram = programNameRender(vipEveningProgramName.value || '洛菲热点晚报 尊享版');

  switch (token) {
    case '[speakerName]':
      return `${maleSpeaker} 或 ${femaleSpeaker}`;
    case '[otherSpeakerName]':
      return `${femaleSpeaker} 或 ${maleSpeaker}`;
    case '[maleSpeakerName]':
      return maleSpeaker;
    case '[femaleSpeakerName]':
      return femaleSpeaker;
    case '[maleOtherSpeakerName]':
      return femaleSpeaker;
    case '[femaleOtherSpeakerName]':
      return maleSpeaker;
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
    case '[greeting]':
      return '早上好 或 晚上好';
    case '[solarDateTime]':
      return solarDateTime;
    case '[solarDate]':
      return solarDate;
    case '[solarTime]':
      return solarTime;
    case '[lunarDateTime]':
      return lunarDateTime;
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
const emitTemplateItemsUpdate = (value: ISettingsHotsearchPodcastTemplateItem[], renderKeys: string[] = stateTemplateItemRenderKeys.value): void => {
  stateTemplateItems.value = [...value];
  stateTemplateItemRenderKeys.value = [...renderKeys];
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
  /**
   * 常量：nextItems。
   */
  const nextItems = [...stateTemplateItems.value];
  /**
   * 常量：currentItem。
   */
  const currentItem = nextItems[index];

  if (!currentItem) {
    return;
  }

  nextItems[index] = {
    ...currentItem,
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
  /**
   * 常量：nextItems。
   */
  const nextItems = [...stateTemplateItems.value];
  /**
   * 常量：currentItem。
   */
  const currentItem = nextItems[index];

  if (!currentItem) {
    return;
  }

  nextItems[index] = {
    ...currentItem,
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
  /**
   * 常量：nextSegmentType。
   */
  const nextSegmentType = String(value || 'normal') as THotsearchPodcastSegmentType;
  if (nextSegmentType === 'adContent') {
    return;
  }

  /**
   * 常量：templateSegmentType。
   */
  const templateSegmentType = nextSegmentType as THotsearchPodcastTemplateSegmentType;
  /**
   * 常量：nextItems。
   */
  const nextItems = [...stateTemplateItems.value];
  /**
   * 常量：currentItem。
   */
  const currentItem = nextItems[index];

  if (!currentItem) {
    return;
  }

  /**
   * 函数：isAdPlaceholder。
   */
  const isAdPlaceholder = nextSegmentType === 'adPlaceholder';

  nextItems[index] = {
    ...currentItem,
    content: isAdPlaceholder ? '' : currentItem.content,
    segmentType: templateSegmentType
  };

  if (isAdPlaceholder && stateActiveTemplateItemIndex.value === index) {
    stateActiveTemplateItemIndex.value = null;
    stateActiveTemplateItemSelectionStart.value = null;
    stateActiveTemplateItemSelectionEnd.value = null;
    stateTemplateItemInputElements.value[index]?.blur();
  }

  emitTemplateItemsUpdate(nextItems);
};

/**
 * 函数：记录当前聚焦的文案输入框。
 * @param {number} index 片段索引。
 * @param {Event} event 原始事件。
 * @returns {void} 无返回值。
 */
const handleTemplateItemContentFocus = (index: number, event: Event): void => {
  /**
   * 常量：target。
   */
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    stateActiveTemplateItemIndex.value = index;
    return;
  }

  stateActiveTemplateItemIndex.value = index;
  stateActiveTemplateItemSelectionStart.value = target.selectionStart;
  stateActiveTemplateItemSelectionEnd.value = target.selectionEnd;
  stateTemplateItemInputElements.value[index] = target;
};

/**
 * 函数：新增模板片段。
 * @param {'opening' | 'closing'} templateType 模板类型。
 * @returns {void} 无返回值。
 */
const handleTemplateItemAppend = (templateType: THotsearchPodcastTemplateType): void => {
  /**
   * 常量：nextItems。
   */
  const nextItems = stateTemplateItems.value.slice();
  /**
   * 常量：nextRenderKeys。
   */
  const nextRenderKeys = [...stateTemplateItemRenderKeys.value, templateItemRenderKeyCreate()];
  nextItems.push(hotsearchPodcastTemplateItemDefaultCreate(templateType));
  /**
   * 常量：nextIndex。
   */
  const nextIndex = nextItems.length - 1;

  stateTemplateItems.value = nextItems;
  stateTemplateItemRenderKeys.value = nextRenderKeys;
  emitTemplateItemsUpdate(nextItems, nextRenderKeys);
  stateActiveTemplateItemIndex.value = nextIndex;
  stateActiveTemplateItemSelectionStart.value = 0;
  stateActiveTemplateItemSelectionEnd.value = 0;

  void nextTick().then(() => {
    /**
     * 常量：inputElement。
     */
    const inputElement = stateTemplateItemInputElements.value[nextIndex];
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
  /**
   * 常量：nextItems。
   */
  const nextItems = stateTemplateItems.value.filter((_, itemIndex) => itemIndex !== index);
  /**
   * 常量：nextRenderKeys。
   */
  const nextRenderKeys = stateTemplateItemRenderKeys.value.filter((_, itemIndex) => itemIndex !== index);

  emitTemplateItemsUpdate(nextItems, nextRenderKeys);
  stateTemplateItemInputElements.value = stateTemplateItemInputElements.value.filter((_, itemIndex) => itemIndex !== index);

  if (stateActiveTemplateItemIndex.value === index) {
    stateActiveTemplateItemIndex.value = null;
    stateActiveTemplateItemSelectionStart.value = null;
    stateActiveTemplateItemSelectionEnd.value = null;
  } else if (stateActiveTemplateItemIndex.value !== null && stateActiveTemplateItemIndex.value > index) {
    stateActiveTemplateItemIndex.value -= 1;
  }
};

/**
 * 函数：插入变量。
 * @param {string} token 变量 token。
 * @returns {Promise<void>} 无返回值。
 */
const handleVariableInsert = async (token: string): Promise<void> => {
  /**
   * 常量：index。
   */
  const index = stateActiveTemplateItemIndex.value;

  if (index === null) {
    return;
  }

  /**
   * 常量：currentItem。
   */
  const currentItem = stateTemplateItems.value[index];

  if (!currentItem) {
    return;
  }

  if (currentItem.segmentType === 'adPlaceholder') {
    return;
  }

  /**
   * 常量：selectionStart。
   */
  const selectionStart = stateActiveTemplateItemSelectionStart.value ?? currentItem.content.length;
  /**
   * 常量：selectionEnd。
   */
  const selectionEnd = stateActiveTemplateItemSelectionEnd.value ?? selectionStart;
  /**
   * 常量：nextContent。
   */
  const nextContent = `${currentItem.content.slice(0, selectionStart)}${token}${currentItem.content.slice(selectionEnd)}`;
  /**
   * 常量：nextCursor。
   */
  const nextCursor = selectionStart + token.length;
  /**
   * 常量：nextItems。
   */
  const nextItems = [...stateTemplateItems.value];

  nextItems[index] = {
    ...currentItem,
    content: nextContent
  };

  emitTemplateItemsUpdate(nextItems);
  stateActiveTemplateItemSelectionStart.value = nextCursor;
  stateActiveTemplateItemSelectionEnd.value = nextCursor;

  await nextTick();

  /**
   * 常量：inputElement。
   */
  const inputElement = stateTemplateItemInputElements.value[index];
  inputElement?.focus();
  inputElement?.setSelectionRange(nextCursor, nextCursor);
};

/**
 * 函数：按模板类型重排模板片段。
 * @param {'opening' | 'closing'} templateType 模板类型。
 * @param {ISettingsHotsearchPodcastTemplateItem[]} items 重排后的模板列表。
 * @returns {void} 无返回值。
 */
const handleTemplateItemsReorder = (templateType: THotsearchPodcastTemplateType, items: ISettingsHotsearchPodcastTemplateItem[]): void => {
  if (disabled) {
    return;
  }

  /**
   * 常量：targetIndexes。
   */
  const targetIndexes = stateTemplateItems.value.reduce<number[]>((result, item, index) => {
    if (item.templateType === templateType) {
      result.push(index);
    }

    return result;
  }, []);

  if (targetIndexes.length !== items.length) {
    return;
  }

  /**
   * 常量：nextItems。
   */
  const nextItems = [...stateTemplateItems.value];
  /**
   * 常量：nextInputElements。
   */
  const nextInputElements = [...stateTemplateItemInputElements.value];
  /**
   * 常量：nextRenderKeys。
   */
  const nextRenderKeys = [...stateTemplateItemRenderKeys.value];
  /**
   * 常量：movedIndexMap。
   */
  const movedIndexMap = new Map<number, number>();

  items.forEach((item, orderIndex) => {
    /**
     * 常量：targetIndex。
     */
    const targetIndex = targetIndexes[orderIndex];
    if (targetIndex === undefined) {
      return;
    }

    /**
     * 常量：sourceIndex。
     */
    const sourceIndex = stateTemplateItems.value.indexOf(item);

    nextItems[targetIndex] = item;
    nextInputElements[targetIndex] = sourceIndex >= 0 ? (stateTemplateItemInputElements.value[sourceIndex] ?? null) : null;
    nextRenderKeys[targetIndex] = sourceIndex >= 0 ? (stateTemplateItemRenderKeys.value[sourceIndex] ?? templateItemRenderKeyCreate()) : templateItemRenderKeyCreate();

    if (sourceIndex >= 0) {
      movedIndexMap.set(sourceIndex, targetIndex);
    }
  });

  stateTemplateItemInputElements.value = nextInputElements;

  /**
   * 常量：activeIndex。
   */
  const activeIndex = stateActiveTemplateItemIndex.value;
  if (activeIndex !== null && movedIndexMap.has(activeIndex)) {
    stateActiveTemplateItemIndex.value = movedIndexMap.get(activeIndex) ?? activeIndex;
  }

  emitTemplateItemsUpdate(nextItems, nextRenderKeys);
};
</script>

<style scoped>
.podcast-template-draggable {
  display: block;
}

.podcast-template-list {
  position: relative;
}

.podcast-template-item {
  transition:
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease,
    filter 180ms ease;
  will-change: transform;
}

.podcast-template-sort-move {
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.podcast-template-sort-enter-active,
.podcast-template-sort-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.podcast-template-sort-enter-from,
.podcast-template-sort-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.podcast-template-item :deep(.podcast-template-handle) {
  touch-action: none;
  user-select: none;
}

.podcast-template-item:hover :deep(.podcast-template-handle) {
  color: var(--ui-primary);
  background-color: color-mix(in srgb, var(--ui-primary) 8%, transparent);
}

.podcast-template-item-chosen {
  z-index: 2;
}

.podcast-template-item-chosen :deep(> div) {
  border-color: color-mix(in srgb, var(--ui-primary) 36%, var(--ui-border));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ui-primary) 18%, transparent);
}

.podcast-template-item-chosen :deep(.podcast-template-handle) {
  color: var(--ui-primary);
  background-color: color-mix(in srgb, var(--ui-primary) 12%, transparent);
}

.podcast-template-item-ghost {
  opacity: 0.42;
  transition: none !important;
}

.podcast-template-item-ghost :deep(> div) {
  border-color: color-mix(in srgb, var(--ui-primary) 32%, var(--ui-border));
  border-style: dashed;
}

.podcast-template-item-drag {
  z-index: 30;
  transform: scale(1.01);
  transition: none !important;
  will-change: transform;
}

.podcast-template-item-drag :deep(> div) {
  border-color: color-mix(in srgb, var(--ui-primary) 44%, var(--ui-border));
  box-shadow:
    0 14px 36px rgb(15 23 42 / 16%),
    0 0 0 1px color-mix(in srgb, var(--ui-primary) 24%, transparent);
}

.podcast-template-item-drag :deep(.podcast-template-handle) {
  color: var(--ui-primary);
  background-color: color-mix(in srgb, var(--ui-primary) 16%, transparent);
}

.podcast-template-item-fallback {
  pointer-events: none;
  opacity: 0.96;
  transform: scale(1.01);
  transition: none !important;
  will-change: transform;
}

.podcast-template-item-drag :deep(> div),
.podcast-template-item-fallback :deep(> div),
.podcast-template-item-ghost :deep(> div) {
  transition: none !important;
}

.podcast-template-item-fallback :deep(> div) {
  border-color: color-mix(in srgb, var(--ui-primary) 50%, var(--ui-border));
  box-shadow: 0 20px 44px -24px color-mix(in srgb, var(--ui-primary) 34%, transparent);
}
</style>
