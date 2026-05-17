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
      <Teleport to="#hotsearch-podcast-player-header">
        <header class="border-default/70 bg-default/92 grid items-center gap-3 border-y px-4 py-4 backdrop-blur-sm sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6">
          <div class="bg-default/80 border-default/70 inline-flex items-center gap-2 rounded-lg border p-1">
            <UButton color="primary" size="sm" :variant="stateAudioPlaying ? 'soft' : 'ghost'" :icon="computedPlaybackPrimaryIcon" class="size-9 justify-center rounded-md active:scale-[0.98]" :ui="{ base: 'shadow-none ring-0' }" @click="handlePlaybackPrimaryAction" />
            <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide:skip-back" :disabled="!computedHasPreviousSentence" class="size-9 justify-center rounded-md active:scale-[0.98]" :ui="{ base: 'shadow-none ring-0' }" @click="handlePreviousSentence" />
            <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide:skip-forward" :disabled="!computedHasNextSentence" class="size-9 justify-center rounded-md active:scale-[0.98]" :ui="{ base: 'shadow-none ring-0' }" @click="handleNextSentence" />
          </div>

          <div class="border-default/70 bg-default/65 min-w-0 rounded-lg border px-3 py-2.5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <div class="text-highlighted truncate text-sm font-medium">
                  {{ computedHeaderPrimaryLabel }}
                </div>
                <p class="text-muted mt-1 line-clamp-1 text-sm leading-6">
                  {{ computedHeaderSecondaryLabel }}
                </p>
              </div>

              <div class="border-default/60 text-toned shrink-0 border-l pl-3 text-right text-xs tabular-nums">
                {{ computedHeaderCurrentSentenceProgressLabel }}
              </div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-highlighted text-[1.65rem] leading-none font-semibold tracking-tight tabular-nums">
              {{ computedQueueCounterLabel }}
            </div>
            <div class="mt-1 flex items-center justify-end gap-2 text-xs tabular-nums">
              <span class="text-toned">{{ computedCurrentOverallProgressLabel }}</span>
              <span class="text-default/30">/</span>
              <span class="text-muted">{{ computedTotalDurationLabel }}</span>
            </div>
          </div>
        </header>
      </Teleport>

      <section class="border-default/70 bg-default/95 divide-default/70 min-h-0 flex-1 divide-y overflow-y-auto border-b">
        <div v-for="(item, index) in computedPodcastView.sentences" :key="item.id" :ref="sentenceRowRefGet(item.id)" class="group px-4 py-3 transition-[background-color,transform] duration-200 sm:px-5" :class="item.id === stateCurrentSentenceId ? 'bg-primary/4.5' : 'hover:bg-muted/25'">
          <div class="grid gap-3 md:grid-cols-[8.25rem_minmax(0,1fr)_10.25rem] md:items-start md:gap-3">
            <div class="flex items-center gap-3 md:self-start">
              <div class="text-muted text-xs tracking-[0.16em] uppercase tabular-nums">
                {{ sentenceOrderLabelGet(index) }}
              </div>
              <div class="text-highlighted min-w-0 text-base font-semibold">
                {{ item.speakerName }}
              </div>
            </div>

            <div class="min-w-0 space-y-2">
              <div class="w-full overflow-hidden rounded-xl pb-0.5">
                <MediaAudioWaves :waveform-path="item.waveformPath" :progress="computedSentenceProgressGet(item.id)" :duration="computedSentenceDurationGet(item.id)" @seek="(payload) => handleSentenceSeek(item.id, payload.percent)" />
              </div>

              <p class="text-muted text-sm leading-6 wrap-break-word whitespace-normal" :class="item.id === stateCurrentSentenceId ? 'text-highlighted' : ''">
                {{ item.text }}
              </p>
            </div>

            <div class="flex items-center justify-between gap-3 md:justify-end md:self-start">
              <span class="text-muted min-w-26 text-right text-xs font-medium tabular-nums">{{ sentencePlaybackLabelGet(item.id) }}</span>
              <UButton
                color="primary"
                :variant="item.id === stateCurrentSentenceId && stateAudioPlaying ? 'solid' : 'soft'"
                class="h-9 min-w-11 justify-center rounded-lg px-0 active:scale-[0.98]"
                :ui="{ base: 'shadow-none ring-0' }"
                :aria-label="item.id === stateCurrentSentenceId && stateAudioPlaying ? t('pages.hotsearch.podcast.pause') : t('pages.hotsearch.podcast.playAll')"
                @click="handleSentenceToggle(item.id)"
              >
                <UIcon :name="item.id === stateCurrentSentenceId && stateAudioPlaying ? 'i-lucide:pause' : 'i-lucide:play'" class="size-4" />
              </UButton>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { IHotsearchPodcastSentence, THotsearchPodcastVariantKey } from '@@/shared/types/index.types';

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
 * 状态：待处理的波形定位百分比。
 */
const statePendingSeekPercent = ref<number | null>(null);

/**
 * 状态：自动切句锁。
 */
const stateSentenceAutoAdvanceLock = ref<string | null>(null);

/**
 * 状态：是否正在播放。
 */
const stateAudioPlaying = ref(false);

/**
 * 状态：是否处于顺播模式。
 */
const stateSequenceMode = ref(false);

/**
 * 状态：句子行元素映射。
 */
const stateSentenceRowElements: Record<string, HTMLElement | null> = {};

/**
 * 变量：稳定的句子行 ref 回调缓存。
 */
const sentenceRowRefCallbacks: Record<string, (element: unknown) => void> = {};

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
 * 计算属性：头部展示句子。
 */
const computedHeaderSentence = computed(() => {
  return computedCurrentSentence.value ?? computedPodcastView.value.sentences[0] ?? null;
});

/**
 * 计算属性：当前句子索引。
 */
const computedCurrentSentenceIndex = computed(() => {
  if (!stateCurrentSentenceId.value) {
    return -1;
  }

  return computedPodcastView.value.sentences.findIndex((item) => item.id === stateCurrentSentenceId.value);
});

/**
 * 计算属性：句子总数。
 */
const computedSentenceTotal = computed(() => computedPodcastView.value.sentences.length);

/**
 * 计算属性：是否存在上一句。
 */
const computedHasPreviousSentence = computed(() => computedCurrentSentenceIndex.value > 0);

/**
 * 计算属性：是否存在下一句。
 */
const computedHasNextSentence = computed(() => computedCurrentSentenceIndex.value >= 0 && computedCurrentSentenceIndex.value < computedPodcastView.value.sentences.length - 1);

/**
 * 计算属性：主播放按钮图标。
 */
const computedPlaybackPrimaryIcon = computed(() => {
  return stateAudioPlaying.value ? 'i-lucide:pause' : 'i-lucide:play';
});

/**
 * 计算属性：顶部队列计数标签。
 */
const computedQueueCounterLabel = computed(() => {
  const padWidth = Math.max(3, String(computedSentenceTotal.value).length);
  const currentIndex = computedCurrentSentenceIndex.value >= 0 ? computedCurrentSentenceIndex.value + 1 : 0;

  return `${String(currentIndex).padStart(padWidth, '0')}/${String(computedSentenceTotal.value).padStart(padWidth, '0')}`;
});

/**
 * 计算属性：当前句已播秒数。
 */
const computedCurrentSentenceElapsedSeconds = computed(() => {
  if (!computedCurrentSentence.value) {
    return 0;
  }

  const durationSeconds = sentenceDurationSecondsGet(computedCurrentSentence.value);

  if (durationSeconds <= 0) {
    return 0;
  }

  if (stateCurrentSentenceId.value !== computedCurrentSentence.value.id || stateCurrentSentenceDuration.value <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(stateCurrentSentenceDuration.value * stateCurrentSentenceProgress.value, durationSeconds));
});

/**
 * 计算属性：当前句目标时长秒数。
 */
const computedCurrentSentenceTargetDurationSeconds = computed(() => {
  if (!computedCurrentSentence.value) {
    return 0;
  }

  return sentenceDurationSecondsGet(computedCurrentSentence.value);
});

/**
 * 计算属性：当前整体播放进度标签。
 */
const computedCurrentOverallProgressLabel = computed(() => {
  if (computedCurrentSentenceIndex.value < 0) {
    return '00:00';
  }

  const finishedSeconds = computedPodcastView.value.sentences.slice(0, computedCurrentSentenceIndex.value).reduce((total, item) => total + sentenceDurationSecondsGet(item), 0);
  const elapsedSeconds = Math.min(finishedSeconds + computedCurrentSentenceElapsedSeconds.value, computedTotalDurationSeconds.value);

  return podcastDurationLabelGet(elapsedSeconds);
});

/**
 * 计算属性：头部主标签。
 */
const computedHeaderPrimaryLabel = computed(() => {
  if (!computedHeaderSentence.value) {
    return t('pages.hotsearch.podcast.notStarted');
  }

  const headerSentenceIndex = computedPodcastView.value.sentences.findIndex((item) => item.id === computedHeaderSentence.value?.id);

  return `${sentenceOrderLabelGet(Math.max(headerSentenceIndex, 0))} · ${computedHeaderSentence.value.speakerName}`;
});

/**
 * 计算属性：头部次级信息。
 */
const computedHeaderSecondaryLabel = computed(() => {
  if (!computedHeaderSentence.value) {
    return `${computedSentenceTotal.value} · ${computedTotalDurationLabel.value}`;
  }

  return computedHeaderSentence.value.text;
});

/**
 * 计算属性：头部当前句进度标签。
 */
const computedHeaderCurrentSentenceProgressLabel = computed(() => {
  if (!computedHeaderSentence.value) {
    return '00:00 / 00:00';
  }

  return sentencePlaybackLabelGet(computedHeaderSentence.value.id);
});

/**
 * 函数：获取句子播放时间标签。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 *
 * # Returns
 *
 * 返回统一的已播/总长时间标签。
 */
const sentencePlaybackLabelGet = (sentenceId: string): string => {
  const sentence = computedPodcastView.value.sentences.find((item) => item.id === sentenceId);
  const durationSeconds = sentence ? sentenceDurationSecondsGet(sentence) : 0;
  const elapsedSeconds = stateCurrentSentenceId.value === sentenceId ? Math.min(computedCurrentSentenceElapsedSeconds.value, durationSeconds) : 0;

  return `${podcastDurationLabelGet(elapsedSeconds)} / ${podcastDurationLabelGet(durationSeconds)}`;
};

/**
 * 计算属性：总时长秒数。
 */
const computedTotalDurationSeconds = computed(() => {
  return computedPodcastView.value.sentences.reduce((total, item) => total + sentenceDurationSecondsGet(item), 0);
});

/**
 * 计算属性：总时长标签。
 */
const computedTotalDurationLabel = computed(() => podcastDurationLabelGet(computedTotalDurationSeconds.value));

/**
 * 生命周期：初始化音频实例。
 */
onMounted(() => {
  const audio = new Audio();

  audio.addEventListener('timeupdate', () => {
    const targetDurationSeconds = computedCurrentSentenceTargetDurationSeconds.value;

    if (targetDurationSeconds <= 0) {
      stateCurrentSentenceDuration.value = 0;
      stateCurrentSentenceProgress.value = 0;
      return;
    }

    stateCurrentSentenceDuration.value = targetDurationSeconds;
    stateCurrentSentenceProgress.value = Math.min(audio.currentTime, targetDurationSeconds) / targetDurationSeconds;

    if (audio.currentTime + 0.05 < targetDurationSeconds || !stateCurrentSentenceId.value) {
      stateSentenceAutoAdvanceLock.value = null;
      return;
    }

    if (stateSentenceAutoAdvanceLock.value === stateCurrentSentenceId.value) {
      return;
    }

    stateSentenceAutoAdvanceLock.value = stateCurrentSentenceId.value;

    if (!stateSequenceMode.value) {
      audio.pause();
      return;
    }

    const nextSentence = sentenceNeighborGet(1);

    if (!nextSentence) {
      handlePlaybackCompleted();
      return;
    }

    void handleSentencePlay(nextSentence.id, true);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (statePendingSeekPercent.value === null) {
      return;
    }

    const targetDurationSeconds = computedCurrentSentenceTargetDurationSeconds.value;

    if (targetDurationSeconds <= 0) {
      return;
    }

    audio.currentTime = Math.max(0, Math.min(1, statePendingSeekPercent.value)) * targetDurationSeconds;
    statePendingSeekPercent.value = null;
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

    if (computedCurrentSentenceTargetDurationSeconds.value > 0 && audio.currentTime + 0.05 < computedCurrentSentenceTargetDurationSeconds.value) {
      return;
    }

    const nextSentence = sentenceNeighborGet(1);

    if (!nextSentence) {
      handlePlaybackCompleted();
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
 * 监听：当前句变化时滚动到可视范围。
 */
watch(
  () => stateCurrentSentenceId.value,
  (sentenceId) => {
    if (!sentenceId) {
      return;
    }

    void nextTick(() => {
      sentenceScrollIntoView(sentenceId);
    });
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
 * 函数：设置句子行元素引用。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 * * `element` - 句子行元素。
 *
 * # Returns
 *
 * 无返回值。
 */
const sentenceRowRefSet = (sentenceId: string, element: Element | null): void => {
  if (element instanceof HTMLElement) {
    if (stateSentenceRowElements[sentenceId] === element) {
      return;
    }

    stateSentenceRowElements[sentenceId] = element;
    return;
  }

  if (!(sentenceId in stateSentenceRowElements)) {
    return;
  }

  stateSentenceRowElements[sentenceId] = null;
};

/**
 * 函数：获取句子行引用设置器。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 *
 * # Returns
 *
 * 返回模板可直接复用的 ref 设置函数。
 */
const sentenceRowRefGet = (sentenceId: string) => {
  if (!sentenceRowRefCallbacks[sentenceId]) {
    sentenceRowRefCallbacks[sentenceId] = (element: unknown): void => {
      sentenceRowRefSet(sentenceId, element instanceof Element ? element : null);
    };
  }

  return sentenceRowRefCallbacks[sentenceId];
};

/**
 * 函数：将句序号格式化为四位补零。
 *
 * # Arguments
 *
 * * `index` - 句子索引。
 *
 * # Returns
 *
 * 四位补零后的序号。
 */
const sentenceOrderLabelGet = (index: number): string => {
  return String(index + 1).padStart(4, '0');
};

/**
 * 函数：解析句子时长秒数。
 *
 * # Arguments
 *
 * * `sentence` - 句子对象。
 *
 * # Returns
 *
 * 对应的秒数。
 */
const sentenceDurationSecondsGet = (sentence: IHotsearchPodcastSentence): number => {
  const matched = /([\d.]+)\s*s/i.exec(sentence.durationLabel.trim());

  if (!matched) {
    return 0;
  }

  const seconds = Number(matched[1]);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
};

/**
 * 函数：格式化播客总时长标签。
 *
 * # Arguments
 *
 * * `seconds` - 总秒数。
 *
 * # Returns
 *
 * 格式化后的时长标签。
 */
const podcastDurationLabelGet = (seconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
 * 函数：获取句子显示时长。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 *
 * # Returns
 *
 * 当前句返回实际时长，其余句返回标签反解秒数。
 */
const computedSentenceDurationGet = (sentenceId: string): number | undefined => {
  if (stateCurrentSentenceId.value === sentenceId && stateCurrentSentenceDuration.value > 0) {
    return stateCurrentSentenceDuration.value;
  }

  const sentence = computedPodcastView.value.sentences.find((item) => item.id === sentenceId);

  if (!sentence) {
    return undefined;
  }

  const seconds = sentenceDurationSecondsGet(sentence);
  return seconds > 0 ? seconds : undefined;
};

/**
 * 函数：获取相邻句子。
 *
 * # Arguments
 *
 * * `delta` - 相对偏移量，`-1` 为上一句，`1` 为下一句。
 *
 * # Returns
 *
 * 返回相邻句子；若不存在则返回 `null`。
 */
const sentenceNeighborGet = (delta: number): IHotsearchPodcastSentence | null => {
  if (computedCurrentSentenceIndex.value < 0) {
    return null;
  }

  return computedPodcastView.value.sentences[computedCurrentSentenceIndex.value + delta] ?? null;
};

/**
 * 函数：滚动指定句子到可视范围。
 *
 * # Arguments
 *
 * * `sentenceId` - 句子 ID。
 *
 * # Returns
 *
 * 无返回值。
 */
const sentenceScrollIntoView = (sentenceId: string): void => {
  stateSentenceRowElements[sentenceId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
  stateCurrentSentenceDuration.value = sentenceDurationSecondsGet(sentence);
  stateSentenceAutoAdvanceLock.value = null;

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

  if (stateCurrentSentenceId.value === sentenceId) {
    stateSequenceMode.value = true;
    void stateAudio.value.play().catch(() => {
      stateAudioPlaying.value = false;
    });
    return;
  }

  void handleSentencePlay(sentenceId, true);
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
    stateSequenceMode.value = true;
    void stateAudio.value.play().catch(() => {
      stateAudioPlaying.value = false;
    });
    return;
  }

  handlePlayAll();
};

/**
 * 函数：播放上一句。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePreviousSentence = (): void => {
  const previousSentence = sentenceNeighborGet(-1);

  if (!previousSentence) {
    return;
  }

  void handleSentencePlay(previousSentence.id, stateSequenceMode.value);
};

/**
 * 函数：播放下一句。
 *
 * # Returns
 *
 * 无返回值。
 */
const handleNextSentence = (): void => {
  const nextSentence = sentenceNeighborGet(1);

  if (!nextSentence) {
    return;
  }

  void handleSentencePlay(nextSentence.id, stateSequenceMode.value);
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
 * 函数：处理播放完成。
 *
 * 当顺播到最后一条自然结束时，切回第一条作为当前激活项，
 * 但保持暂停状态，避免自动重新开始播放。
 *
 * # Returns
 *
 * 无返回值。
 */
const handlePlaybackCompleted = (): void => {
  const firstSentence = computedPodcastView.value.sentences[0];

  if (!stateAudio.value || !firstSentence) {
    handleStopAudio();
    return;
  }

  stateAudio.value.pause();

  if (stateAudio.value.src !== firstSentence.audioUrl) {
    stateAudio.value.src = firstSentence.audioUrl;
    stateAudio.value.load();
  } else {
    stateAudio.value.currentTime = 0;
  }

  stateCurrentSentenceId.value = firstSentence.id;
  stateCurrentSentenceProgress.value = 0;
  stateCurrentSentenceDuration.value = sentenceDurationSecondsGet(firstSentence);
  stateAudioPlaying.value = false;
  stateSequenceMode.value = false;
  statePendingSeekPercent.value = null;
  stateSentenceAutoAdvanceLock.value = null;
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
  statePendingSeekPercent.value = null;
  stateSentenceAutoAdvanceLock.value = null;
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
    statePendingSeekPercent.value = Math.max(0, Math.min(1, percent));
    void handleSentencePlay(sentenceId, true);
    return;
  }

  if (!Number.isFinite(stateAudio.value.duration) || stateAudio.value.duration <= 0) {
    return;
  }

  stateAudio.value.currentTime = Math.max(0, Math.min(1, percent)) * stateAudio.value.duration;
};
</script>
