<template>
  <div class="flex h-full min-h-0 flex-col gap-4">
    <UPageCard v-if="computedVariant === null" variant="outline">
      <template #header>
        <div class="flex w-full flex-col gap-2">
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.hotsearch.sections.podcast.title') }}</h3>
          <p class="text-muted text-sm leading-6">{{ t('pages.hotsearch.podcast.description') }}</p>
        </div>
      </template>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <UPageCard v-for="item in computedVariantOptions" :key="item.key" :title="t(item.labelKey)" :description="t(item.descriptionKey)" variant="subtle">
          <template #footer>
            <UButton block color="primary" variant="soft" icon="i-lucide:arrow-right" @click="handleVariantNavigate(item.key)">
              {{ t('pages.hotsearch.podcast.enterVariant') }}
            </UButton>
          </template>
        </UPageCard>
      </div>
    </UPageCard>

    <template v-else>
      <UPageCard variant="outline">
        <div class="space-y-4">
          <div class="space-y-4">
            <section class="space-y-5">
              <div class="space-y-2">
                <div
                  v-for="(item, index) in computedPodcastView.sentences"
                  :key="item.id"
                  class="group grid gap-3 rounded-xl px-3 py-4 transition-all duration-200 md:grid-cols-[auto_fit-content(100%)_auto] md:items-start md:px-4"
                  :class="item.id === stateCurrentSentenceId ? 'hover:bg-muted/40' : 'hover:bg-muted/40'"
                >
                  <div class="flex items-center gap-3 md:items-start">
                    <div class="flex flex-col items-center">
                      <div class="flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-200" :class="item.id === stateCurrentSentenceId ? 'border-primary bg-primary/8 text-primary' : 'border-default text-toned'">
                        {{ index + 1 }}
                      </div>
                    </div>

                    <div class="min-w-0 pt-0.5">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="text-highlighted text-sm font-semibold">{{ item.speakerName }}</span>
                        <span class="text-muted text-xs">{{ item.durationLabel }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="min-w-0 space-y-3 pt-0.5">
                    <div v-if="item.id === stateCurrentSentenceId" class="bg-primary/6 ring-primary/15 inline-block w-fit max-w-full rounded-lg px-3 py-2 ring-1">
                      <p class="text-highlighted leading-7 font-medium wrap-break-word">{{ item.text }}</p>
                    </div>
                    <p v-else class="text-toned inline-block max-w-full leading-7 transition-colors duration-200">{{ item.text }}</p>

                    <div class="w-fit max-w-full pb-1">
                      <MediaAudioWaves :waveform-path="item.waveformPath" :progress="computedSentenceProgressGet(item.id)" :duration="computedAudioDuration" @seek="(payload) => handleSentenceSeek(item.id, payload.percent)" />
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center justify-end md:pt-1">
                    <UButton color="primary" :variant="item.id === stateCurrentSentenceId && stateAudioPlaying ? 'solid' : 'soft'" :icon="item.id === stateCurrentSentenceId && stateAudioPlaying ? 'i-lucide:pause' : 'i-lucide:play'" @click="handleSentenceToggle(item.id)" />
                  </div>
                </div>
              </div>

              <div v-if="computedCurrentSentence" class="sticky bottom-0 z-10 w-full min-w-0 pt-3">
                <div class="border-default bg-default/95 flex w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-xl border px-4 py-3 shadow-sm backdrop-blur">
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="text-primary bg-primary/8 flex size-9 shrink-0 items-center justify-center rounded-full border border-current/20">
                      <UIcon :name="stateAudioPlaying ? 'i-lucide:audio-lines' : 'i-lucide:radio'" class="size-4" />
                    </div>
                    <div class="min-w-0">
                      <div class="text-primary text-[11px] font-medium tracking-[0.18em] uppercase">{{ t('pages.hotsearch.podcast.playAll') }}</div>
                      <p class="text-highlighted mt-1 truncate text-sm leading-6">{{ t('pages.hotsearch.podcast.nowPlaying', { text: computedCurrentSentence.text }) }}</p>
                    </div>
                  </div>

                  <div class="flex min-w-0 items-center gap-2">
                    <span class="text-muted hidden max-w-36 truncate text-xs sm:inline">{{ computedCurrentSentence.speakerName }} / {{ computedCurrentSentence.durationLabel }}</span>
                    <UButton class="shrink-0" color="primary" :variant="stateAudioPlaying ? 'solid' : 'soft'" :icon="stateAudioPlaying ? 'i-lucide:pause' : 'i-lucide:play'" @click="handleSentenceToggle(computedCurrentSentence.id)" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </UPageCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { THotsearchPodcastVariantKey } from '@@/shared/types/index.types';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 路由：当前路由。
 */
const route = useRoute();

/**
 * 状态：句子音频实例。
 */
const stateAudio = shallowRef<HTMLAudioElement | null>(null);

/**
 * 状态：当前句子 ID。
 */
const stateCurrentSentenceId = ref<string | null>(null);

/**
 * 状态：当前句子进度。
 */
const stateCurrentSentenceProgress = ref(0);

/**
 * 状态：当前句子时长。
 */
const stateCurrentSentenceDuration = ref(0);

/**
 * 状态：是否正在播放。
 */
const stateAudioPlaying = ref(false);

/**
 * 状态：是否处于顺播模式。
 */
const stateSequenceMode = ref(false);

/**
 * 状态：页头主播放按钮文案。
 */
const stateHeaderPlaybackPrimaryLabel = useState('hotsearch-podcast-playback-primary-label', () => '');

/**
 * 状态：页头主播放按钮图标。
 */
const stateHeaderPlaybackPrimaryIcon = useState('hotsearch-podcast-playback-primary-icon', () => 'i-lucide:play');

/**
 * 状态：页头停止按钮是否可用。
 */
const stateHeaderPlaybackStopEnabled = useState('hotsearch-podcast-playback-stop-enabled', () => false);

/**
 * 状态：页头主播放命令版本号。
 */
const stateHeaderPlaybackPrimaryCommand = useState('hotsearch-podcast-playback-primary-command', () => 0);

/**
 * 状态：页头停止命令版本号。
 */
const stateHeaderPlaybackStopCommand = useState('hotsearch-podcast-playback-stop-command', () => 0);

/**
 * 计算属性：当前日期。
 */
const computedSelectedDate = computed(() => hotsearchQueryStringGet(route.query.date as string | null | Array<string | null> | undefined) || hotsearchArchiveDateSummariesGet()[0]?.date || '');

/**
 * 计算属性：播客变体选项。
 */
const computedVariantOptions = computed(() => hotsearchPodcastVariantOptionsGet());

/**
 * 计算属性：当前播客变体。
 */
const computedVariant = computed<THotsearchPodcastVariantKey | null>(() => {
  const path = route.path;

  if (path === localePath('/hotsearch/podcast/morning-short')) {
    return 'morning-short';
  }
  if (path === localePath('/hotsearch/podcast/morning-long')) {
    return 'morning-long';
  }
  if (path === localePath('/hotsearch/podcast/evening-short')) {
    return 'evening-short';
  }
  if (path === localePath('/hotsearch/podcast/evening-long')) {
    return 'evening-long';
  }

  return null;
});

/**
 * 计算属性：当前播客视图模型。
 */
const computedPodcastView = computed(() => {
  return hotsearchPodcastViewGet(computedSelectedDate.value, computedVariant.value ?? 'morning-short', hotsearchQueryStringGet(route.query.mediaPlatform as string | null | Array<string | null> | undefined));
});

/**
 * 计算属性：当前句子标签。
 */
const computedCurrentSentence = computed(() => {
  return computedPodcastView.value.sentences.find((item) => item.id === stateCurrentSentenceId.value) ?? null;
});

/**
 * 计算属性：主播放按钮文案。
 */
const computedPlaybackPrimaryLabel = computed(() => {
  return stateAudioPlaying.value ? t('pages.hotsearch.podcast.pause') : t('pages.hotsearch.podcast.playAll');
});

/**
 * 计算属性：主播放按钮图标。
 */
const computedPlaybackPrimaryIcon = computed(() => {
  return stateAudioPlaying.value ? 'i-lucide:pause' : 'i-lucide:play';
});

/**
 * 计算属性：停止按钮是否可用。
 */
const computedPlaybackStopEnabled = computed(() => {
  return stateCurrentSentenceId.value !== null;
});

/**
 * 计算属性：当前音频时长。
 */
const computedAudioDuration = computed(() => {
  return stateCurrentSentenceDuration.value > 0 ? stateCurrentSentenceDuration.value : undefined;
});

/**
 * 监听：同步页头播放按钮状态。
 */
watchEffect(() => {
  stateHeaderPlaybackPrimaryLabel.value = computedPlaybackPrimaryLabel.value;
  stateHeaderPlaybackPrimaryIcon.value = computedPlaybackPrimaryIcon.value;
  stateHeaderPlaybackStopEnabled.value = computedPlaybackStopEnabled.value;
});

/**
 * 生命周期：初始化音频实例。
 */
onMounted(() => {
  const audio = new Audio();

  audio.addEventListener('timeupdate', () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
      stateCurrentSentenceProgress.value = 0;
      return;
    }

    stateCurrentSentenceDuration.value = audio.duration;
    stateCurrentSentenceProgress.value = audio.currentTime / audio.duration;
  });

  audio.addEventListener('play', () => {
    stateAudioPlaying.value = true;
  });

  audio.addEventListener('pause', () => {
    stateAudioPlaying.value = false;
  });

  audio.addEventListener('ended', () => {
    if (!stateSequenceMode.value || stateCurrentSentenceId.value === null) {
      stateAudioPlaying.value = false;
      stateCurrentSentenceProgress.value = 0;
      return;
    }

    const index = computedPodcastView.value.sentences.findIndex((item) => item.id === stateCurrentSentenceId.value);
    const nextSentence = computedPodcastView.value.sentences[index + 1];

    if (!nextSentence) {
      handleStopAudio();
      return;
    }

    void handleSentencePlay(nextSentence.id, true);
  });

  stateAudio.value = audio;
});

/**
 * 生命周期：释放音频实例。
 */
onBeforeUnmount(() => {
  if (!stateAudio.value) {
    return;
  }

  stateAudio.value.pause();
  stateAudio.value.src = '';
  stateAudio.value.load();
});

/**
 * 监听：路由切换时停止播放。
 */
watch(
  () => route.fullPath,
  () => {
    handleStopAudio();
  }
);

/**
 * 监听：页头主播放命令。
 */
watch(
  () => stateHeaderPlaybackPrimaryCommand.value,
  (value, oldValue) => {
    if (value === oldValue) {
      return;
    }

    handlePlaybackPrimaryAction();
  }
);

/**
 * 监听：页头停止命令。
 */
watch(
  () => stateHeaderPlaybackStopCommand.value,
  (value, oldValue) => {
    if (value === oldValue) {
      return;
    }

    handleStopAudio();
  }
);

/**
 * 函数：跳转播客变体。
 *
 * # Arguments
 *
 * * `variant` - 目标变体。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleVariantNavigate = (variant: THotsearchPodcastVariantKey): void => {
  navigateTo({
    path: localePath(`/hotsearch/podcast/${variant}`),
    query: {
      date: computedSelectedDate.value,
      mediaPlatform: hotsearchQueryStringGet(route.query.mediaPlatform as string | null | Array<string | null> | undefined) || undefined
    }
  });
};

/**
 * 函数：获取句子播放进度。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 *
 * # Returns
 *
 * 返回当前句子的进度百分比。
 */
const computedSentenceProgressGet = (sentenceId: string): number => {
  return stateCurrentSentenceId.value === sentenceId ? stateCurrentSentenceProgress.value : 0;
};

/**
 * 函数：播放指定句子。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 * * `fromSequence` - 是否来自顺播。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleSentencePlay = async (sentenceId: string, fromSequence = false): Promise<void> => {
  const sentence = computedPodcastView.value.sentences.find((item) => item.id === sentenceId);

  if (!sentence || !stateAudio.value) {
    return;
  }

  stateSequenceMode.value = fromSequence;
  stateCurrentSentenceId.value = sentence.id;
  stateCurrentSentenceProgress.value = 0;
  stateCurrentSentenceDuration.value = 0;

  if (stateAudio.value.src !== sentence.audioUrl) {
    stateAudio.value.src = sentence.audioUrl;
    stateAudio.value.load();
  }

  try {
    await stateAudio.value.play();
  } catch {
    stateAudioPlaying.value = false;
  }
};

/**
 * 函数：切换句子播放。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleSentenceToggle = (sentenceId: string): void => {
  if (!stateAudio.value) {
    return;
  }

  if (stateCurrentSentenceId.value === sentenceId && stateAudioPlaying.value) {
    handlePauseAudio();
    return;
  }

  void handleSentencePlay(sentenceId);
};

/**
 * 函数：顺播全部句子。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePlayAll = (): void => {
  const firstSentence = computedPodcastView.value.sentences[0];

  if (!firstSentence) {
    return;
  }

  void handleSentencePlay(firstSentence.id, true);
};

/**
 * 函数：处理主播放按钮动作。
 *
 * 根据当前播放状态切换为暂停、继续或从第一句开始顺播。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePlaybackPrimaryAction = (): void => {
  if (stateAudioPlaying.value) {
    handlePauseAudio();
    return;
  }

  if (stateAudio.value && stateCurrentSentenceId.value !== null) {
    void stateAudio.value.play().catch(() => {
      stateAudioPlaying.value = false;
    });
    return;
  }

  handlePlayAll();
};

/**
 * 函数：暂停音频。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePauseAudio = (): void => {
  stateAudio.value?.pause();
};

/**
 * 函数：停止音频。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleStopAudio = (): void => {
  if (!stateAudio.value) {
    return;
  }

  stateAudio.value.pause();
  stateAudio.value.currentTime = 0;
  stateAudioPlaying.value = false;
  stateSequenceMode.value = false;
  stateCurrentSentenceProgress.value = 0;
  stateCurrentSentenceDuration.value = 0;
};

/**
 * 函数：句子波形跳转。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 * * `percent` - 目标百分比。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleSentenceSeek = (sentenceId: string, percent: number): void => {
  const sentence = computedPodcastView.value.sentences.find((item) => item.id === sentenceId);

  if (!sentence || !stateAudio.value) {
    return;
  }

  if (stateCurrentSentenceId.value !== sentenceId) {
    void handleSentencePlay(sentenceId);
    return;
  }

  if (!Number.isFinite(stateAudio.value.duration) || stateAudio.value.duration <= 0) {
    return;
  }

  stateAudio.value.currentTime = Math.max(0, Math.min(1, percent)) * stateAudio.value.duration;
};

/**
 * 生命周期：清理页头播放状态。
 */
onBeforeUnmount(() => {
  stateHeaderPlaybackPrimaryLabel.value = '';
  stateHeaderPlaybackPrimaryIcon.value = 'i-lucide:play';
  stateHeaderPlaybackStopEnabled.value = false;
});
</script>
