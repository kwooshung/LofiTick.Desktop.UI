<template>
  <Dashboard>
    <DashboardPage class="gap-6">
      <UPageCard :title="t('pages.home.title')" :description="t('pages.home.podcastScript.description')" variant="naked" />

      <UPageCard variant="outline" :ui="{ container: 'space-y-5' }">
        <div class="flex flex-col gap-3">
          <div class="text-muted text-sm leading-6">
            {{ t('pages.home.welcomeEmail.target', { email: stateTargetEmail }) }}
          </div>
          <div class="flex items-center gap-3">
            <UButton icon="i-lucide-mail" color="primary" :loading="computedSending" @click="handleSendWelcomeEmail">
              {{ t('pages.home.welcomeEmail.send') }}
            </UButton>
            <UBadge color="neutral" variant="soft">{{ stateTargetEmail }}</UBadge>
          </div>
        </div>

        <UAlert v-if="stateResultVisible" :color="stateResultSuccess ? 'success' : 'error'" variant="soft" :title="stateResultSuccess ? t('pages.home.welcomeEmail.result.successTitle') : t('pages.home.welcomeEmail.result.errorTitle')" :description="stateResultMessage" />
      </UPageCard>

      <UPageCard variant="outline" :title="t('pages.home.podcastScript.title')" :description="t('pages.home.podcastScript.editorDescription')" :ui="{ container: 'space-y-5' }">
        <section class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-highlighted text-sm font-semibold">{{ t('pages.home.podcastScript.body.label') }}</h3>
              <p class="text-muted mt-1 text-sm leading-6">{{ t('pages.home.podcastScript.body.description') }}</p>
            </div>

            <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="statePodcastScriptLoading" @click="handlePodcastBodyItemAppend">
              {{ t('pages.home.podcastScript.body.add') }}
            </UButton>
          </div>

          <UEmpty v-if="statePodcastScriptBodyItems.length === 0" icon="i-lucide:file-plus-2" :title="t('pages.home.podcastScript.body.emptyTitle')" :description="t('pages.home.podcastScript.body.emptyDescription')" />

          <VueDraggable
            v-else
            v-model="statePodcastScriptBodyItems"
            tag="div"
            class="podcast-template-draggable"
            target=".podcast-template-list"
            :animation="240"
            easing="cubic-bezier(0.22, 1, 0.36, 1)"
            :disabled="statePodcastScriptLoading"
            direction="vertical"
            draggable=".podcast-template-item"
            chosen-class="podcast-template-item-chosen"
            drag-class="podcast-template-item-drag"
            ghost-class="podcast-template-item-ghost"
            handle=".podcast-template-handle"
          >
            <TransitionGroup tag="div" class="podcast-template-list space-y-3" type="transition" name="podcast-template-sort">
              <div v-for="(item, index) in statePodcastScriptBodyItems" :key="index" class="podcast-template-item flex items-center gap-2">
                <SettingsHotsearchPodcastScriptListItem
                  :item="item"
                  :disabled="statePodcastScriptLoading"
                  editor-mode="body"
                  :voice-options="computedPodcastVoiceOptions"
                  :segment-options="computedPodcastSegmentOptions"
                  :placeholder="t('pages.home.podcastScript.body.placeholder')"
                  :ad-content-placeholder="t('pages.home.podcastScript.body.placeholder')"
                  @update:voice-key="(value) => handlePodcastBodyItemVoiceUpdate(index, value)"
                  @update:content="(value) => handlePodcastBodyItemContentUpdate(index, value)"
                  @update:segment-type="(value) => handlePodcastBodyItemSegmentTypeUpdate(index, value)"
                  @remove="handlePodcastBodyItemRemove(index)"
                />
              </div>
            </TransitionGroup>
          </VueDraggable>
        </section>

        <section class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-highlighted text-sm font-semibold">{{ t('pages.home.podcastScript.adOpening.label') }}</h3>
                <p class="text-muted mt-1 text-sm leading-6">{{ t('pages.home.podcastScript.adOpening.description') }}</p>
              </div>

              <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="statePodcastScriptLoading" @click="handlePodcastAdOpeningItemAppend">
                {{ t('pages.home.podcastScript.adOpening.add') }}
              </UButton>
            </div>

            <UEmpty v-if="statePodcastAdOpeningItems.length === 0" icon="i-lucide:audio-lines" :title="t('pages.home.podcastScript.adOpening.emptyTitle')" :description="t('pages.home.podcastScript.adOpening.emptyDescription')" />

            <VueDraggable
              v-else
              v-model="statePodcastAdOpeningItems"
              tag="div"
              class="podcast-template-draggable"
              target=".podcast-ad-opening-list"
              :animation="240"
              easing="cubic-bezier(0.22, 1, 0.36, 1)"
              :disabled="statePodcastScriptLoading"
              direction="vertical"
              draggable=".podcast-template-item"
              chosen-class="podcast-template-item-chosen"
              drag-class="podcast-template-item-drag"
              ghost-class="podcast-template-item-ghost"
              handle=".podcast-template-handle"
            >
              <TransitionGroup tag="div" class="podcast-ad-opening-list space-y-3" type="transition" name="podcast-template-sort">
                <div v-for="(item, index) in statePodcastAdOpeningItems" :key="`opening-${index}`" class="podcast-template-item flex items-center gap-2">
                  <SettingsHotsearchPodcastScriptListItem
                    :item="item"
                    :disabled="statePodcastScriptLoading"
                    editor-mode="advertisement"
                    :voice-options="computedPodcastVoiceOptions"
                    :segment-options="[]"
                    :placeholder="t('pages.home.podcastScript.adOpening.placeholder')"
                    :ad-content-placeholder="t('pages.home.podcastScript.adOpening.placeholder')"
                    @update:voice-key="(value) => handlePodcastAdOpeningVoiceUpdate(index, value)"
                    @update:content="(value) => handlePodcastAdOpeningContentUpdate(index, value)"
                    @remove="handlePodcastAdOpeningItemRemove(index)"
                  />
                </div>
              </TransitionGroup>
            </VueDraggable>
          </div>

          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-highlighted text-sm font-semibold">{{ t('pages.home.podcastScript.adClosing.label') }}</h3>
                <p class="text-muted mt-1 text-sm leading-6">{{ t('pages.home.podcastScript.adClosing.description') }}</p>
              </div>

              <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="statePodcastScriptLoading" @click="handlePodcastAdClosingItemAppend">
                {{ t('pages.home.podcastScript.adClosing.add') }}
              </UButton>
            </div>

            <UEmpty v-if="statePodcastAdClosingItems.length === 0" icon="i-lucide:audio-lines" :title="t('pages.home.podcastScript.adClosing.emptyTitle')" :description="t('pages.home.podcastScript.adClosing.emptyDescription')" />

            <VueDraggable
              v-else
              v-model="statePodcastAdClosingItems"
              tag="div"
              class="podcast-template-draggable"
              target=".podcast-ad-closing-list"
              :animation="240"
              easing="cubic-bezier(0.22, 1, 0.36, 1)"
              :disabled="statePodcastScriptLoading"
              direction="vertical"
              draggable=".podcast-template-item"
              chosen-class="podcast-template-item-chosen"
              drag-class="podcast-template-item-drag"
              ghost-class="podcast-template-item-ghost"
              handle=".podcast-template-handle"
            >
              <TransitionGroup tag="div" class="podcast-ad-closing-list space-y-3" type="transition" name="podcast-template-sort">
                <div v-for="(item, index) in statePodcastAdClosingItems" :key="`closing-${index}`" class="podcast-template-item flex items-center gap-2">
                  <SettingsHotsearchPodcastScriptListItem
                    :item="item"
                    :disabled="statePodcastScriptLoading"
                    editor-mode="advertisement"
                    :voice-options="computedPodcastVoiceOptions"
                    :segment-options="[]"
                    :placeholder="t('pages.home.podcastScript.adClosing.placeholder')"
                    :ad-content-placeholder="t('pages.home.podcastScript.adClosing.placeholder')"
                    @update:voice-key="(value) => handlePodcastAdClosingVoiceUpdate(index, value)"
                    @update:content="(value) => handlePodcastAdClosingContentUpdate(index, value)"
                    @remove="handlePodcastAdClosingItemRemove(index)"
                  />
                </div>
              </TransitionGroup>
            </VueDraggable>
          </div>
        </section>

        <div class="border-default space-y-4 rounded-xl border p-4">
          <div class="text-sm font-medium">
            {{ t('pages.home.podcastScript.actions.title') }}
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <UButton v-for="mode in podcastScriptModes" :key="mode.key" color="primary" variant="soft" :disabled="!computedCanGeneratePodcastScript" :loading="statePodcastScriptLoading && stateGeneratingMode === mode.key" @click="handlePodcastScriptGenerate(mode.edition, mode.length)">
              {{ t(mode.labelKey) }}
            </UButton>
          </div>
          <div class="text-muted text-xs leading-6">
            {{ t('pages.home.podcastScript.actions.tip') }}
          </div>
        </div>
      </UPageCard>

      <UPageCard variant="outline" :title="t('pages.home.podcastScript.result.title')" :description="t('pages.home.podcastScript.result.description')" :ui="{ container: 'space-y-5' }">
        <UEmpty v-if="!statePodcastScriptDatas" icon="i-lucide-file-audio" :title="t('pages.home.podcastScript.result.emptyTitle')" :description="t('pages.home.podcastScript.result.emptyDescription')" />

        <template v-else>
          <div class="flex flex-wrap items-center gap-3">
            <UBadge color="primary" variant="soft">{{ statePodcastScriptDatas.title }}</UBadge>
            <UBadge color="neutral" variant="outline">{{ t(`pages.home.podcastScript.badges.${statePodcastScriptDatas.edition}`) }}</UBadge>
            <UBadge color="neutral" variant="outline">{{ t(`pages.home.podcastScript.badges.${statePodcastScriptDatas.length}`) }}</UBadge>
          </div>

          <div class="grid gap-4 xl:grid-cols-2">
            <UPageCard v-for="(line, index) in statePodcastScriptDatas.lines" :key="`${line.speakerRole}-${line.segmentType}-${index}`" variant="subtle" :ui="{ container: 'space-y-3' }">
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <UBadge color="neutral" variant="soft">{{ line.speakerRole }}</UBadge>
                <UBadge color="neutral" variant="outline">{{ line.segmentType }}</UBadge>
                <UBadge color="neutral" variant="outline">{{ line.speaker }}</UBadge>
              </div>
              <div class="text-sm leading-6 whitespace-pre-wrap">
                {{ line.text }}
              </div>
            </UPageCard>
          </div>
        </template>
      </UPageCard>
    </DashboardPage>
  </Dashboard>
</template>

<script setup lang="ts">
import type {
  IPageHomePodcastScriptAdvertisementItem,
  IPageHomePodcastScriptBodyItem,
  IPageHomePodcastScriptGenerateResponse,
  IPageHomeSendWelcomeEmailResponse,
  IPageHomeWelcomeEmailPayload,
  TPageHomePodcastEdition,
  TPageHomePodcastLength,
  THotsearchPodcastSegmentType,
  THotsearchPodcastVoiceKey
} from '@@/shared/types/index.types';
import { hotsearchPodcastSegmentOptionsGet, hotsearchPodcastVoiceOptionsGet } from '@@/shared/utils/hotsearch';
import { VueDraggable } from 'vue-draggable-plus';

/**
 * 国际化：i18n
 */
const { t, locale } = useI18n();

/**
 * 函数：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 常量：脚本生成模式。
 */
const podcastScriptModes = [
  { key: 'morning:short', edition: 'morning', length: 'short', labelKey: 'pages.home.podcastScript.actions.morningShort' },
  { key: 'morning:long', edition: 'morning', length: 'long', labelKey: 'pages.home.podcastScript.actions.morningLong' },
  { key: 'evening:short', edition: 'evening', length: 'short', labelKey: 'pages.home.podcastScript.actions.eveningShort' },
  { key: 'evening:long', edition: 'evening', length: 'long', labelKey: 'pages.home.podcastScript.actions.eveningLong' }
] as const;

/**
 * 函数：创建默认播客正文片段。
 * @param {THotsearchPodcastVoiceKey} voiceKey 播报角色
 * @param {string} content 文本内容
 * @param {THotsearchPodcastSegmentType} segmentType 片段类型
 * @returns {IPageHomePodcastScriptBodyItem} 默认正文片段
 */
const createPodcastBodyItem = (voiceKey: THotsearchPodcastVoiceKey = 'M', content = '', segmentType: THotsearchPodcastSegmentType = 'normal'): IPageHomePodcastScriptBodyItem => ({
  voiceKey,
  content,
  segmentType
});

/**
 * 函数：创建默认播客广告片段。
 * @param {THotsearchPodcastVoiceKey} voiceKey 播报角色
 * @param {string} content 文本内容
 * @returns {IPageHomePodcastScriptAdvertisementItem} 默认广告片段
 */
const createPodcastAdvertisementItem = (voiceKey: THotsearchPodcastVoiceKey = 'M', content = ''): IPageHomePodcastScriptAdvertisementItem => ({
  voiceKey,
  content,
  segmentType: 'adContent'
});

/**
 * 状态：默认收件邮箱。
 */
const stateTargetEmail = 'kwooshung@qq.com';

/**
 * 状态：结果是否展示。
 */
const stateResultVisible = ref(false);

/**
 * 状态：结果是否成功。
 */
const stateResultSuccess = ref(false);

/**
 * 状态：结果文案。
 */
const stateResultMessage = ref('');

/**
 * 状态：当前脚本结果。
 */
const statePodcastScriptDatas = ref<IPageHomePodcastScriptGenerateResponse | null>(null);

/**
 * 状态：广告开头测试内容。
 */
const statePodcastAdOpeningItems = ref<IPageHomePodcastScriptAdvertisementItem[]>([createPodcastAdvertisementItem()]);

/**
 * 状态：广告结尾测试内容。
 */
const statePodcastAdClosingItems = ref<IPageHomePodcastScriptAdvertisementItem[]>([createPodcastAdvertisementItem()]);

/**
 * 状态：正文测试片段。
 */
const statePodcastScriptBodyItems = ref<IPageHomePodcastScriptBodyItem[]>([createPodcastBodyItem('M', '今天先带你看一下早报主线。'), createPodcastBodyItem('F', '我们再把其中最值得展开的重点讲清楚。'), createPodcastBodyItem('D', '如果你只想快速听结论，这一段就是给你的摘要。')]);

/**
 * 状态：当前生成模式。
 */
const stateGeneratingMode = ref('');

/**
 * API：生成欢迎邮件。
 */
const {
  datas: stateWelcomeEmailDatas,
  loading: stateWelcomeEmailLoading,
  refresh: refreshWelcomeEmail
} = await useApi<IPageHomeWelcomeEmailPayload>('email/welcome', {
  method: 'POST',
  immediate: false
});

/**
 * API：发送邮件。
 */
const {
  datas: stateEmailSendDatas,
  loading: stateEmailSendLoading,
  refresh: refreshEmailSend
} = await useApi<IPageHomeSendWelcomeEmailResponse>('email/send', {
  method: 'POST',
  immediate: false
});

/**
 * Hook：热搜播客脚本。
 */
const hotsearchScript = useTauriHotsearchScript();

/**
 * 状态：是否正在生成脚本。
 */
const statePodcastScriptLoading = ref(false);

/**
 * 计算属性：是否正在发送。
 */
const computedSending = computed(() => stateWelcomeEmailLoading.value || stateEmailSendLoading.value);

/**
 * 计算属性：播报角色选项。
 */
const computedPodcastVoiceOptions = computed(() =>
  hotsearchPodcastVoiceOptionsGet().map((item) => ({
    value: item.value,
    label: t(item.key)
  }))
);

/**
 * 计算属性：片段类型选项。
 */
const computedPodcastSegmentOptions = computed(() =>
  hotsearchPodcastSegmentOptionsGet('body').map((item) => ({
    value: item.value,
    label: t(item.key)
  }))
);

/**
 * 计算属性：是否允许生成播客脚本。
 */
const computedCanGeneratePodcastScript = computed(() => statePodcastScriptBodyItems.value.some((item) => String(item.content || '').trim() !== '') && !statePodcastScriptLoading.value);

/**
 * 事件：发送欢迎邮件。
 */
const handleSendWelcomeEmail = async (): Promise<void> => {
  stateResultVisible.value = false;

  try {
    await refreshWelcomeEmail({ datas: { locale: locale.value }, replace: true });

    const payload = stateWelcomeEmailDatas.value;
    if (!payload || !payload.subject || !payload.html) {
      throw new Error('welcome payload missing');
    }

    await refreshEmailSend({
      datas: {
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        to: payload.to
      },
      replace: true
    });

    stateResultVisible.value = true;
    stateResultSuccess.value = true;
    stateResultMessage.value = t('pages.home.welcomeEmail.result.success', {
      count: Number(stateEmailSendDatas.value?.toCount ?? payload.to.length),
      email: stateTargetEmail
    });
  } catch {
    stateResultVisible.value = true;
    stateResultSuccess.value = false;
    stateResultMessage.value = t('pages.home.welcomeEmail.result.error', {
      email: stateTargetEmail
    });
  }
};

/**
 * 函数：构造正文请求片段。
 * @returns {IPageHomePodcastScriptBodyItem[]} 结构化正文片段
 */
const buildPodcastScriptBodyItems = (): IPageHomePodcastScriptBodyItem[] =>
  statePodcastScriptBodyItems.value
    .map((item) => ({
      voiceKey: item.voiceKey,
      content: String(item.content ?? ''),
      segmentType: item.segmentType
    }))
    .filter((item) => item.content.trim() !== '');

/**
 * 函数：构造广告请求片段。
 * @param {IPageHomePodcastScriptAdvertisementItem[]} items 广告片段列表
 * @returns {IPageHomePodcastScriptAdvertisementItem[]} 结构化广告片段列表
 */
const buildPodcastAdvertisementItems = (items: IPageHomePodcastScriptAdvertisementItem[]): IPageHomePodcastScriptAdvertisementItem[] =>
  items
    .map((item) => ({
      voiceKey: item.voiceKey,
      content: String(item.content ?? ''),
      segmentType: 'adContent' as const
    }))
    .filter((item) => item.content.trim() !== '');

/**
 * 事件：新增正文片段。
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemAppend = (): void => {
  statePodcastScriptBodyItems.value.push(createPodcastBodyItem());
};

/**
 * 事件：移除正文片段。
 * @param {number} index 片段索引
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemRemove = (index: number): void => {
  statePodcastScriptBodyItems.value.splice(index, 1);
};

/**
 * 事件：更新正文片段角色。
 * @param {number} index 片段索引
 * @param {THotsearchPodcastVoiceKey} value 角色值
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemVoiceUpdate = (index: number, value: THotsearchPodcastVoiceKey): void => {
  const item = statePodcastScriptBodyItems.value[index];

  if (!item) {
    return;
  }

  item.voiceKey = value;
};

/**
 * 事件：更新正文片段内容。
 * @param {number} index 片段索引
 * @param {string} value 文本内容
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemContentUpdate = (index: number, value: string): void => {
  const item = statePodcastScriptBodyItems.value[index];

  if (!item) {
    return;
  }

  item.content = value;
};

/**
 * 事件：更新广告开头角色。
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningItemAppend = (): void => {
  statePodcastAdOpeningItems.value.push(createPodcastAdvertisementItem());
};

/**
 * 事件：移除广告开头片段。
 * @param {number} index 片段索引
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningItemRemove = (index: number): void => {
  statePodcastAdOpeningItems.value.splice(index, 1);
};

/**
 * 事件：更新广告开头角色。
 * @param {number} index 片段索引
 * @param {THotsearchPodcastVoiceKey} value 角色值
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningVoiceUpdate = (index: number, value: THotsearchPodcastVoiceKey): void => {
  const item = statePodcastAdOpeningItems.value[index];

  if (!item) {
    return;
  }

  item.voiceKey = value;
};

/**
 * 事件：更新广告开头内容。
 * @param {number} index 片段索引
 * @param {string} value 文本内容
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningContentUpdate = (index: number, value: string): void => {
  const item = statePodcastAdOpeningItems.value[index];

  if (!item) {
    return;
  }

  item.content = value;
};

/**
 * 事件：新增广告结尾片段。
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingItemAppend = (): void => {
  statePodcastAdClosingItems.value.push(createPodcastAdvertisementItem());
};

/**
 * 事件：移除广告结尾片段。
 * @param {number} index 片段索引
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingItemRemove = (index: number): void => {
  statePodcastAdClosingItems.value.splice(index, 1);
};

/**
 * 事件：更新广告结尾角色。
 * @param {number} index 片段索引
 * @param {THotsearchPodcastVoiceKey} value 角色值
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingVoiceUpdate = (index: number, value: THotsearchPodcastVoiceKey): void => {
  const item = statePodcastAdClosingItems.value[index];

  if (!item) {
    return;
  }

  item.voiceKey = value;
};

/**
 * 事件：更新广告结尾内容。
 * @param {number} index 片段索引
 * @param {string} value 文本内容
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingContentUpdate = (index: number, value: string): void => {
  const item = statePodcastAdClosingItems.value[index];

  if (!item) {
    return;
  }

  item.content = value;
};

/**
 * 事件：更新正文片段类型。
 * @param {number} index 片段索引
 * @param {ISettingsHotsearchPodcastSegmentType} value 片段类型
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemSegmentTypeUpdate = (index: number, value: THotsearchPodcastSegmentType): void => {
  const item = statePodcastScriptBodyItems.value[index];

  if (!item) {
    return;
  }

  item.segmentType = value;
};

/**
 * 事件：生成播客脚本。
 * @param {'morning' | 'evening'} edition 时段
 * @param {'short' | 'long'} length 篇幅
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastScriptGenerate = async (edition: TPageHomePodcastEdition, length: TPageHomePodcastLength): Promise<void> => {
  stateGeneratingMode.value = `${edition}:${length}`;
  statePodcastScriptLoading.value = true;

  try {
    statePodcastScriptDatas.value = await hotsearchScript.build({
      edition,
      length,
      adOpeningItems: buildPodcastAdvertisementItems(statePodcastAdOpeningItems.value),
      adClosingItems: buildPodcastAdvertisementItems(statePodcastAdClosingItems.value),
      bodyItems: buildPodcastScriptBodyItems()
    });
  } finally {
    statePodcastScriptLoading.value = false;
    stateGeneratingMode.value = '';
  }
};

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 设置面包屑导航状态。
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-proicons:settings',
    to: localePath('/'),
    exact: true
  }
];
</script>
