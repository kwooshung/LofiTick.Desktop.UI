<template>
  <aside class="border-default bg-elevated/12 flex h-full w-68 shrink-0 flex-col border-e">
    <div class="scrollbar flex-1 overflow-y-auto">
      <div
        v-for="item in props.summaries"
        :key="item.date"
        class="border-default hover:bg-elevated/60 flex w-full items-start gap-3 border-b px-3 py-3 text-left transition-colors duration-200 last:border-b-0"
        :class="item.date === props.selectedDate ? 'bg-primary/6' : ''"
        @click="handleDateSelect(item.date)"
      >
        <div class="border-default bg-default flex h-16 w-18 flex-col overflow-hidden rounded-lg border shadow-sm">
          <div class="bg-red-600 px-2 py-1 text-center text-xs tracking-[0.04em] text-white">{{ item.date.slice(0, 4) }}/{{ item.date.slice(5, 7) }}</div>
          <div class="flex items-center justify-center px-2 py-1">
            <div class="text-highlighted text-2xl">
              {{ item.date.slice(8, 10) }}
            </div>
          </div>
        </div>

        <div class="min-w-0 flex-1 space-y-2 pt-0.5">
          <div class="text-highlighted text-sm leading-5 font-medium">{{ item.updatedAt }}</div>

          <div class="flex flex-wrap items-center gap-2">
            <UBadge color="primary" variant="soft">{{ t('pages.hotsearch.layout.dates.total', { value: item.totalCount }) }}</UBadge>
            <UBadge color="warning" variant="soft">{{ t('pages.hotsearch.layout.dates.podcastCount', { value: item.podcastCount }) }}</UBadge>
          </div>
        </div>
      </div>
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
