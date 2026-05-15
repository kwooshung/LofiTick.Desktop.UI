<template>
  <aside class="border-default bg-elevated/20 flex h-full w-68 shrink-0 flex-col border-e">
    <div class="border-default flex items-start justify-between gap-3 border-b px-4 py-4">
      <div>
        <h3 class="text-highlighted text-sm font-semibold">{{ t('pages.hotsearch.layout.dates.title') }}</h3>
        <p class="text-muted mt-1 text-xs leading-5">{{ t('pages.hotsearch.layout.dates.description') }}</p>
      </div>
      <UBadge color="neutral" variant="soft">{{ props.summaries.length }}</UBadge>
    </div>

    <div class="scrollbar flex-1 space-y-2 overflow-y-auto p-3">
      <button
        v-for="item in props.summaries"
        :key="item.date"
        type="button"
        class="border-default hover:border-primary hover:bg-elevated w-full rounded-lg border p-3 text-left transition-colors duration-200"
        :class="item.date === props.selectedDate ? 'border-primary bg-primary/6 shadow-sm' : ''"
        @click="handleDateSelect(item.date)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="text-highlighted text-sm font-semibold">{{ hotsearchDateLabelGet(item.date) }}</div>
            <div class="text-muted mt-1 text-xs">{{ item.updatedAt }}</div>
          </div>
          <UIcon v-if="item.mediaReady" name="i-lucide:badge-check" class="text-primary mt-0.5 size-4" />
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <UBadge color="primary" variant="soft">{{ t('pages.hotsearch.layout.dates.total', { value: item.totalCount }) }}</UBadge>
          <UBadge color="success" variant="soft">{{ t('pages.hotsearch.layout.dates.newCount', { value: item.newCount }) }}</UBadge>
          <UBadge color="warning" variant="soft">{{ t('pages.hotsearch.layout.dates.podcastCount', { value: item.podcastCount }) }}</UBadge>
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
