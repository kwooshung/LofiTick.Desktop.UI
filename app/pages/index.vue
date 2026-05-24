<template>
  <Dashboard>
    <DashboardPage class="gap-6">
      <UPageCard :title="t('pages.home.title')" :description="t('pages.home.welcomeEmail.description')" variant="naked" />

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

      <UPageCard variant="outline" :title="t('pages.home.voicePreview.title')" :description="t('pages.home.voicePreview.description')" :ui="{ container: 'space-y-5' }">
        <UFormField :label="t('pages.home.voicePreview.input.label')" :description="t('pages.home.voicePreview.input.description')">
          <UTextarea v-model="stateVoicePreviewText" :rows="4" :placeholder="t('pages.home.voicePreview.input.placeholder')" class="w-full" />
        </UFormField>

        <div class="flex flex-wrap items-center gap-3">
          <UButton icon="i-lucide:audio-lines" color="primary" :loading="stateVoicePreviewLoading" :disabled="!computedCanGenerateVoicePreview" @click="handleVoicePreviewGenerate">
            {{ t('pages.home.voicePreview.generate') }}
          </UButton>
          <UBadge color="neutral" variant="soft">
            {{ t('pages.home.voicePreview.supportedCount', { count: computedVoicePreviewSupportedCount }) }}
          </UBadge>
        </div>

        <UAlert v-if="stateVoicePreviewErrorMessage" color="error" variant="soft" icon="i-lucide:triangle-alert" :title="t('pages.home.voicePreview.result.errorTitle')" :description="stateVoicePreviewErrorMessage" />

        <UEmpty v-if="!stateVoicePreviewLoading && stateVoicePreviewResults.length === 0" icon="i-lucide:audio-lines" :title="t('pages.home.voicePreview.empty.title')" :description="t('pages.home.voicePreview.empty.description')" />

        <div v-else class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <UPageCard v-for="item in stateVoicePreviewResults" :key="item.key" variant="subtle" :title="item.name" :description="item.description" :ui="{ container: 'space-y-4' }">
            <template #footer>
              <div class="flex items-center justify-between gap-3 text-xs">
                <UBadge color="neutral" variant="outline">{{ item.role }}</UBadge>
                <span class="text-muted">{{ item.key }}</span>
              </div>
            </template>

            <UAlert v-if="item.errorMessage" color="warning" variant="soft" icon="i-lucide:triangle-alert" :title="t('pages.home.voicePreview.result.itemErrorTitle')" :description="item.errorMessage" />

            <audio v-else-if="computedVoicePreviewAudioUrls[item.key]" :ref="(element) => handleVoicePreviewAudioElementRef(item.key, element)" class="w-full" controls :src="computedVoicePreviewAudioUrls[item.key]" preload="none" @play="handleVoicePreviewAudioPlay(item.key)" />
          </UPageCard>
        </div>
      </UPageCard>
    </DashboardPage>
  </Dashboard>
</template>

<script setup lang="ts">
import { convertFileSrc } from '@tauri-apps/api/core';

/**
 * 国际化：i18n
 */
const { t, locale } = useI18n();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 播客音色能力
 */
const tauriPodcastVoices = useTauriPodcastVoices();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * 状态：默认收件邮箱
 */
const stateTargetEmail = 'kwooshung@qq.com';

/**
 * 状态：结果是否展示
 */
const stateResultVisible = ref(false);

/**
 * 状态：结果是否成功
 */
const stateResultSuccess = ref(false);

/**
 * 状态：结果文案
 */
const stateResultMessage = ref('');

/**
 * 状态：音色示例输入文案
 */
const stateVoicePreviewText = ref('亲爱的听众朋友们，大家好，我是小洛菲，欢迎收听今天的《洛菲热点播报》，首先感谢小米手机对本期节目的陪伴支持～不管是日常通勤刷资讯、宅家追更看视频，还是出门随手拍风景，小米全系机型都能适配各种生活场景，感谢小米手机对本节目的大力支持！');

/**
 * 状态：音色示例结果列表
 */
const stateVoicePreviewResults = ref<ITauriPodcastVoiceSampleResult[]>([]);

/**
 * 状态：官方音色真实支持数量
 */
const stateVoicePreviewSupportedCount = ref(0);

/**
 * 状态：音色示例是否正在生成
 */
const stateVoicePreviewLoading = ref(false);

/**
 * 状态：音色示例全局错误信息
 */
const stateVoicePreviewErrorMessage = ref('');

/**
 * 状态：音色示例播放地址映射
 */
const stateVoicePreviewAudioUrls = ref<Record<string, string>>({});

/**
 * 变量：首页音频元素映射
 */
const voicePreviewAudioElements = new Map<string, HTMLAudioElement>();

/**
 * API：生成欢迎邮件
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
 * API：发送邮件
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
 * 计算属性：是否正在发送
 */
const computedSending = computed(() => stateWelcomeEmailLoading.value || stateEmailSendLoading.value);

/**
 * 计算属性：是否允许生成音色示例
 */
const computedCanGenerateVoicePreview = computed(() => String(stateVoicePreviewText.value || '').trim() !== '' && !stateVoicePreviewLoading.value);

/**
 * 计算属性：官方音色支持数量
 */
const computedVoicePreviewSupportedCount = computed(() => {
  return stateVoicePreviewSupportedCount.value || stateVoicePreviewResults.value.length;
});

/**
 * 计算属性：音色示例播放地址映射
 */
const computedVoicePreviewAudioUrls = computed(() => stateVoicePreviewAudioUrls.value);

/**
 * 函数：加载首页官方音色示例卡片
 * @returns {Promise<void>} 无返回值
 */
const loadVoicePreviewCards = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    stateVoicePreviewResults.value = [];
    voicePreviewUrlsRevoke();
    return;
  }

  const results = await tauriPodcastVoices.samplesListGet();
  stateVoicePreviewResults.value = results;
  await voicePreviewUrlsHydrate(results);
};

/**
 * 函数：加载首页官方音色真实支持数量
 * @returns {Promise<void>} 无返回值
 */
const loadVoicePreviewSupportedCount = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    stateVoicePreviewSupportedCount.value = 0;
    return;
  }

  stateVoicePreviewSupportedCount.value = await tauriPodcastVoices.supportedCountGet();
};

/**
 * 事件：发送欢迎邮件
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
 * 函数：释放旧的音色示例播放地址
 */
const voicePreviewUrlsRevoke = (): void => {
  for (const element of voicePreviewAudioElements.values()) {
    element.pause();
  }

  voicePreviewAudioElements.clear();

  for (const url of Object.values(stateVoicePreviewAudioUrls.value)) {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  stateVoicePreviewAudioUrls.value = {};
};

/**
 * 函数：登记首页音频元素引用
 * @param {string} key 音色键
 * @param {Element | ComponentPublicInstance | null} element 音频元素
 * @returns {void} 无返回值
 */
const handleVoicePreviewAudioElementRef = (key: string, element: Element | ComponentPublicInstance | null): void => {
  if (element instanceof HTMLAudioElement) {
    voicePreviewAudioElements.set(key, element);
    return;
  }

  voicePreviewAudioElements.delete(key);
};

/**
 * 函数：暂停其他首页音频
 * @param {string} activeKey 当前正在播放的音色键
 * @returns {void} 无返回值
 */
const handleVoicePreviewAudioPlay = (activeKey: string): void => {
  for (const [key, element] of voicePreviewAudioElements.entries()) {
    if (key !== activeKey) {
      element.pause();
    }
  }
};

/**
 * 函数：把 Base64 音频转成浏览器可播放地址
 * @param {ITauriPodcastVoiceSampleResult[]} items 音色示例结果
 * @returns {void} 无返回值
 */
const voicePreviewUrlsHydrate = async (items: ITauriPodcastVoiceSampleResult[]): Promise<void> => {
  voicePreviewUrlsRevoke();

  const nextUrls: Record<string, string> = {};

  for (const item of items) {
    if (item.errorMessage) {
      continue;
    }

    if (item.audioFilePath && isTauriRuntime.value) {
      try {
        const assetUrl = convertFileSrc(item.audioFilePath);
        const response = await fetch(assetUrl);
        if (!response.ok) {
          continue;
        }

        const blob = await response.blob();
        nextUrls[item.key] = URL.createObjectURL(blob);
      } catch {
        continue;
      }

      continue;
    }

    if (!item.audioBase64) {
      continue;
    }

    const binary = atob(item.audioBase64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    nextUrls[item.key] = URL.createObjectURL(new Blob([bytes], { type: item.mimeType || 'audio/mpeg' }));
  }

  stateVoicePreviewAudioUrls.value = nextUrls;
};

/**
 * 事件：生成全部支持音色的示例音频
 */
const handleVoicePreviewGenerate = async (): Promise<void> => {
  if (!computedCanGenerateVoicePreview.value) {
    return;
  }

  stateVoicePreviewErrorMessage.value = '';
  stateVoicePreviewLoading.value = true;

  try {
    if (!isTauriRuntime.value) {
      throw new Error(t('pages.home.voicePreview.result.notTauri'));
    }

    const results = await tauriPodcastVoices.samplesGenerate(String(stateVoicePreviewText.value || '').trim());
    stateVoicePreviewResults.value = results;
    await voicePreviewUrlsHydrate(results);
  } catch (error) {
    stateVoicePreviewResults.value = [];
    voicePreviewUrlsRevoke();
    stateVoicePreviewErrorMessage.value = error instanceof Error ? error.message : t('pages.home.voicePreview.result.error');
  } finally {
    stateVoicePreviewLoading.value = false;
  }
};

/**
 * 生命周期：页面卸载
 */
onBeforeUnmount(() => {
  voicePreviewUrlsRevoke();
});

/**
 * 生命周期：页面挂载
 */
onMounted(async () => {
  await loadVoicePreviewSupportedCount();
  await loadVoicePreviewCards();
});

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 设置面包屑导航状态
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
