<template>
  <aside class="border-default bg-elevated/12 flex h-full w-68 shrink-0 flex-col border-e">
    <div class="scrollbar flex-1 overflow-y-auto">
      <button
        v-for="item in props.summaries"
        :key="item.date"
        type="button"
        class="border-default hover:bg-elevated/60 flex w-full items-start gap-3 border-b px-3 py-3 text-left transition-colors duration-200 last:border-b-0"
        :class="item.date === props.selectedDate ? 'bg-primary/6' : ''"
        @click="handleDateSelect(item.date)"
      >
        <div class="border-default bg-default flex w-18 shrink-0 flex-col overflow-hidden rounded-lg border shadow-sm">
          <div class="bg-red-600 px-2 py-1 text-center text-xs tracking-[0.04em] text-white">{{ item.date.slice(0, 4) }}/{{ item.date.slice(5, 7) }}</div>
          <div class="flex min-h-13 items-center justify-center px-2 py-2">
            <div class="text-highlighted text-3xl leading-none tracking-[-0.04em]">
              {{ item.date.slice(8, 10) }}
            </div>
          </div>
        </div>

        <div class="min-w-0 flex-1 space-y-1.5 pt-0.5">
          <div class="flex min-w-0 items-start justify-between gap-2">
            <div class="text-highlighted text-sm">{{ hotsearchDateLabelGet(item.date) }}</div>
            <UIcon v-if="item.mediaReady" name="i-lucide:badge-check" class="text-primary mt-0.5 size-4 shrink-0" />
          </div>

          <div class="text-muted text-xs">{{ t('pages.hotsearch.layout.updatedAt') }} {{ item.updatedAt }}</div>

          <div class="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5">
            <span>{{ t('pages.hotsearch.layout.dates.total', { value: item.totalCount }) }}</span>
            <span>{{ t('pages.hotsearch.layout.dates.podcastCount', { value: item.podcastCount }) }}</span>
          </div>
        </div>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { IHotsearchDateSidebarProps } from './index.types';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 属性：日期侧栏属性。
 */
const props = defineProps<IHotsearchDateSidebarProps>();

/**
 * 事件：日期切换。
 */
const emit = defineEmits<{
  change: [date: string];
}>();

/**
 * 函数：选择日期。
 *
 * @param {string} date 日期。
 * @return {void}
 */
const handleDateSelect = (date: string): void => {
  emit('change', date);
};
</script>
