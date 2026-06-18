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
          <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900/40">
            <div class="space-y-1">
              <div class="text-highlighted text-sm font-medium">
                {{ t('pages.home.podcastScript.scope.label') }}
              </div>
              <div class="text-muted text-xs leading-6">
                {{ t(statePodcastUseBilibiliScope ? 'pages.home.podcastScript.scope.bilibiliDescription' : 'pages.home.podcastScript.scope.commonDescription') }}
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UBadge color="neutral" variant="outline">
                {{ t(statePodcastUseBilibiliScope ? 'pages.home.podcastScript.badges.bilibili' : 'pages.home.podcastScript.badges.common') }}
              </UBadge>
              <USwitch v-model="statePodcastUseBilibiliScope" :disabled="statePodcastScriptLoading" />
            </div>
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
            <UBadge color="neutral" variant="outline">{{ t(`pages.home.podcastScript.badges.${statePodcastScriptDatas.mediaPlatformName || 'common'}`) }}</UBadge>
          </div>

          <div class="border-default space-y-4 rounded-xl border p-4">
            <div class="flex flex-wrap items-center gap-3">
              <UButton color="primary" :disabled="!computedCanGeneratePodcastAudio" :loading="statePodcastAudioLoading" @click="handlePodcastAudioGenerate">
                {{ t('pages.home.podcastScript.result.audio.generate') }}
              </UButton>

              <UButton v-if="computedPodcastOutputDirectory" color="neutral" variant="outline" @click="handlePodcastOutputDirectoryOpen">
                {{ t('pages.home.podcastScript.result.audio.openDirectory') }}
              </UButton>
            </div>

            <div class="text-muted text-xs leading-6">
              {{ t('pages.home.podcastScript.result.audio.defaultHint') }}
            </div>

            <UAlert v-if="statePodcastAudioError" color="error" variant="soft" :title="t('pages.home.podcastScript.result.audio.errorTitle')" :description="statePodcastAudioError" />

            <UAlert v-if="statePodcastTaskSnapshot" :color="computedPodcastTaskColor" variant="soft" :title="computedPodcastTaskTitle" :description="computedPodcastTaskDescription" />
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
import type { UnlistenFn } from '@tauri-apps/api/event';

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
 * 状态：是否切换到 bilibili 平台测试。
 */
const statePodcastUseBilibiliScope = ref(false);

/**
 * 状态：广告开头测试内容。
 */
const statePodcastAdOpeningItems = ref<IPageHomePodcastScriptAdvertisementItem[]>([
  createPodcastAdvertisementItem('M', '首先感谢小米手机对本期节目的陪伴支持。'),
  createPodcastAdvertisementItem('F', '不管是日常通勤刷资讯、宅家追更看视频，还是出门随手拍风景，小米全系机型都能适配各种生活场景。'),
  createPodcastAdvertisementItem('M', '旗舰机有 2nm 旗舰性能和全焦段影像，千元机也兼顾超长续航和耐用性。'),
  createPodcastAdvertisementItem('F', '再加上澎湃 OS 2.0 带来的流畅体验，从高端到入门几乎把全价位段都覆盖到了。'),
  createPodcastAdvertisementItem('M', '现在配合国补入手会更划算，想换机的话，闭眼选也不容易踩雷。'),
  createPodcastAdvertisementItem('F', '感谢小米手机对本期节目的大力支持。')
]);

/**
 * 状态：广告结尾测试内容。
 */
const statePodcastAdClosingItems = ref<IPageHomePodcastScriptAdvertisementItem[]>([
  createPodcastAdvertisementItem('F', '节目的最后，也把这次赞助信息留给你。洛菲效率时钟不是单纯多一个计时器，而是把一天里最容易断掉的专注、计划和复盘重新串回到同一个节奏里。'),
  createPodcastAdvertisementItem('M', '如果你最近也在找一个更顺手的桌面效率工具，可以去节目说明里的入口看看。感谢这次赞助支持，我们下一期接着聊。')
]);

/**
 * 状态：正文测试片段。
 */
const statePodcastScriptBodyItems = ref<IPageHomePodcastScriptBodyItem[]>([
  createPodcastBodyItem('M', '今天这条热搜我一开始真没太当回事，觉得又是一条大家刷两下就过去的话题。结果越往下看越不对，大家表面上像在吵一句话，实际上已经开始借这件事翻旧账了。'),
  createPodcastBodyItem('F', '对，我也是这种感觉。前面看着还是玩梗、截图、复读那一套，但你多刷几条就会发现，评论区已经不是单纯围观了，很多人明显是在拿自己的经历往里对。'),
  createPodcastBodyItem('M', '所以它后面才会一下子变重，因为话题只要开始碰到平台怎么处理、当事人怎么回应、大家还愿不愿意继续信，这个东西就不会是热度过去就算了。'),
  createPodcastBodyItem('F', '我们这一段也就不急着把过程从头捋到尾了，先挑几个最有代表性的讨论点聊一聊，看看这一波到底是大家反应过头了，还是有些问题本来就一直卡在那里。')
]);

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
 * Hook：Tauri 播客任务。
 */
const tauriPodcast = useTauriPodcast();

/**
 * Hook：Tauri 窗口。
 */
const tauriWindow = useTauriWindow();

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * 状态：是否正在生成脚本。
 */
const statePodcastScriptLoading = ref(false);

/**
 * 状态：当前播客音频受理结果。
 */
const statePodcastAudioAccepted = ref<ITauriPodcastGenerateAccepted | null>(null);

/**
 * 状态：当前播客任务快照。
 */
const statePodcastTaskSnapshot = ref<ITauriPodcastTaskSnapshot | null>(null);

/**
 * 状态：是否正在发起播客音频生成。
 */
const statePodcastAudioLoading = ref(false);

/**
 * 状态：播客音频生成错误。
 */
const statePodcastAudioError = ref('');

/**
 * 变量：取消订阅播客任务事件句柄。
 */
let unlistenPodcastTaskEvent: UnlistenFn | null = null;

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
 * 计算属性：是否正在处理播客音频任务。
 */
const computedPodcastAudioBusy = computed(() => {
  /**
   * 常量：status。
   */
  const status = statePodcastTaskSnapshot.value?.status;
  return statePodcastAudioLoading.value || status === 'accepted' || status === 'running';
});

/**
 * 计算属性：是否允许生成播客音频。
 */
const computedCanGeneratePodcastAudio = computed(() => {
  return Boolean(statePodcastScriptDatas.value) && !statePodcastScriptLoading.value && !computedPodcastAudioBusy.value;
});

/**
 * 计算属性：当前媒体平台英文名。
 */
const computedPodcastMediaPlatformName = computed<string | undefined>(() => (statePodcastUseBilibiliScope.value ? 'bilibili' : undefined));

/**
 * 计算属性：当前播客输出文件路径。
 */
const computedPodcastFinalFilePath = computed(() => statePodcastTaskSnapshot.value?.result?.finalFilePath || '');

/**
 * 计算属性：当前播客输出目录。
 */
const computedPodcastOutputDirectory = computed(() => podcastOutputDirectoryGet(computedPodcastFinalFilePath.value));

/**
 * 计算属性：播客任务提示标题。
 */
const computedPodcastTaskTitle = computed(() => {
  /**
   * 常量：status。
   */
  const status = statePodcastTaskSnapshot.value?.status;

  if (!status) {
    return '';
  }

  if (status === 'failed') {
    return t('pages.home.podcastScript.result.audio.errorTitle');
  }

  return t('pages.home.podcastScript.result.audio.statusTitle');
});

/**
 * 计算属性：播客任务提示颜色。
 */
const computedPodcastTaskColor = computed(() => {
  /**
   * 常量：status。
   */
  const status = statePodcastTaskSnapshot.value?.status;

  if (status === 'succeeded') {
    return 'success';
  }

  if (status === 'failed') {
    return 'error';
  }

  if (status === 'canceled') {
    return 'warning';
  }

  return 'primary';
});

/**
 * 计算属性：播客任务提示文案。
 */
const computedPodcastTaskDescription = computed(() => podcastTaskDescriptionGet(statePodcastTaskSnapshot.value));

/**
 * 事件：发送欢迎邮件。
 */
const handleSendWelcomeEmail = async (): Promise<void> => {
  stateResultVisible.value = false;

  try {
    await refreshWelcomeEmail({ datas: { locale: locale.value }, replace: true });

    /**
     * 常量：payload。
     */
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
 * 函数：重置当前播客音频任务状态。
 * @returns {void} 无返回值
 */
const resetPodcastAudioState = (): void => {
  statePodcastAudioAccepted.value = null;
  statePodcastTaskSnapshot.value = null;
  statePodcastAudioError.value = '';
};

/**
 * 函数：提取播客输出目录。
 * @param {string} finalFilePath 最终文件路径
 * @returns {string} 输出目录
 */
const podcastOutputDirectoryGet = (finalFilePath: string): string => {
  /**
   * 函数：normalized。
   */
  const normalized = String(finalFilePath || '').trim();
  if (!normalized) {
    return '';
  }

  return normalized.replace(/[\\/][^\\/]+$/, '');
};

/**
 * 函数：提取播客错误原文。
 * @param {unknown} input 原始错误输入
 * @returns {string} 错误原文
 */
const podcastAudioErrorRawGet = (input: unknown): string => {
  if (typeof input === 'string') {
    return input.trim();
  }

  if (input instanceof Error) {
    return String(input.message || '').trim();
  }

  return '';
};

/**
 * 函数：格式化播客错误提示文案。
 * @param {unknown} input 原始错误输入
 * @returns {string} 面向用户的错误提示
 */
const podcastAudioErrorMessageFormat = (input: unknown): string => {
  /**
   * 常量：raw。
   */
  const raw = podcastAudioErrorRawGet(input);
  if (!raw) {
    return t('pages.home.podcastScript.result.audio.errorFallback');
  }

  if (raw.toLowerCase().includes('redis: nil')) {
    return t('pages.home.podcastScript.result.audio.errorVolcRedisNil', { raw });
  }

  return raw;
};

/**
 * 函数：构建播客任务提示文案。
 * @param {ITauriPodcastTaskSnapshot | null} snapshot 当前任务快照
 * @returns {string} 提示文案
 */
const podcastTaskDescriptionGet = (snapshot: ITauriPodcastTaskSnapshot | null): string => {
  if (!snapshot) {
    return t('pages.home.podcastScript.result.audio.statusIdle');
  }

  if (snapshot.status === 'accepted') {
    return t('pages.home.podcastScript.result.audio.statusAccepted');
  }

  if (snapshot.status === 'running') {
    return t('pages.home.podcastScript.result.audio.statusRunning', {
      phase: t(`pages.home.podcastScript.result.audio.phases.${snapshot.phase}`)
    });
  }

  if (snapshot.status === 'succeeded') {
    return t('pages.home.podcastScript.result.audio.statusSucceeded', {
      path: snapshot.result?.finalFilePath || ''
    });
  }

  if (snapshot.status === 'canceled') {
    return t('pages.home.podcastScript.result.audio.statusCanceled');
  }

  return t('pages.home.podcastScript.result.audio.statusFailed', {
    message: podcastAudioErrorMessageFormat(snapshot.lastError)
  });
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
  /**
   * 常量：item。
   */
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
  /**
   * 常量：item。
   */
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
  /**
   * 常量：item。
   */
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
  /**
   * 常量：item。
   */
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
  /**
   * 常量：item。
   */
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
  /**
   * 常量：item。
   */
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
  /**
   * 常量：item。
   */
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
  resetPodcastAudioState();

  try {
    statePodcastScriptDatas.value = await hotsearchScript.build({
      edition,
      length,
      mediaPlatformName: computedPodcastMediaPlatformName.value,
      adOpeningItems: computedPodcastMediaPlatformName.value ? buildPodcastAdvertisementItems(statePodcastAdOpeningItems.value) : [],
      adClosingItems: computedPodcastMediaPlatformName.value ? buildPodcastAdvertisementItems(statePodcastAdClosingItems.value) : [],
      bodyItems: buildPodcastScriptBodyItems()
    });
  } finally {
    statePodcastScriptLoading.value = false;
    stateGeneratingMode.value = '';
  }
};

/**
 * 事件：生成播客音频。
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastAudioGenerate = async (): Promise<void> => {
  if (!statePodcastScriptDatas.value) {
    return;
  }

  statePodcastAudioLoading.value = true;
  statePodcastAudioError.value = '';

  try {
    /**
     * 常量：accepted。
     */
    const accepted = await hotsearchScript.generate(statePodcastScriptDatas.value);
    statePodcastAudioAccepted.value = accepted;
    statePodcastTaskSnapshot.value = await tauriPodcast.taskGet(accepted.taskId);
  } catch (error) {
    statePodcastAudioError.value = podcastAudioErrorMessageFormat(error);
  } finally {
    statePodcastAudioLoading.value = false;
  }
};

/**
 * 事件：打开播客输出目录。
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastOutputDirectoryOpen = async (): Promise<void> => {
  if (!computedPodcastOutputDirectory.value) {
    return;
  }

  await tauriWindow.openDirectory(computedPodcastOutputDirectory.value);
};

/**
 * 生命周期：组件挂载。
 */
onMounted(async () => {
  if (!import.meta.client || !isTauriRuntime.value) {
    return;
  }

  unlistenPodcastTaskEvent = await tauriPodcast.onTaskEvent((event) => {
    if (event.taskId !== statePodcastAudioAccepted.value?.taskId) {
      return;
    }

    statePodcastTaskSnapshot.value = event.snapshot;
  });
});

/**
 * 生命周期：组件卸载。
 */
onBeforeUnmount(() => {
  if (unlistenPodcastTaskEvent) {
    unlistenPodcastTaskEvent();
    unlistenPodcastTaskEvent = null;
  }
});

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
