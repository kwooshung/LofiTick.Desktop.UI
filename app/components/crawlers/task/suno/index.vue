<template>
  <CrawlersTaskTable :rows="stateSunoTasks" />

  <UModal v-model:open="computedSunoDialogOpen" :title="t('pages.crawlers.spider.websites.suno.dialog.title')" :description="t('pages.crawlers.spider.websites.suno.dialog.description')" :ui="{ content: 'sm:max-w-2xl', footer: 'justify-end' }">
    <template #body>
      <UEmpty icon="i-lucide:construction" :title="t('pages.crawlers.spider.websites.suno.dialog.title')" :description="t('pages.crawlers.spider.websites.suno.dialog.description')" />
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="handleSunoClose">
          {{ t('pages.crawlers.spider.websites.suno.dialog.close') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ICrawlersTaskSunoEmits, ICrawlersTaskSunoProps } from '@/components/crawlers/task/suno/index.types';
import type { ICrawlerTaskRow } from '@/components/crawlers/task/table/index.types';

defineOptions({ name: 'CrawlersTaskSuno' });

/**
 * 属性：Suno 任务组件配置。
 */
const { dialogOpen } = defineProps<ICrawlersTaskSunoProps>();

/**
 * 事件：Suno 任务组件事件。
 */
const emit = defineEmits<ICrawlersTaskSunoEmits>();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 状态：Suno 任务列表。
 */
const stateSunoTasks = ref<ICrawlerTaskRow[]>([]);

/**
 * 计算属性：Suno 执行弹窗打开状态。
 */
const computedSunoDialogOpen = computed({
  get: () => dialogOpen,
  set: (value: boolean) => {
    emit('update:dialogOpen', value);
  }
});

/**
 * 函数：关闭 Suno 执行弹窗。
 * @return {void}
 */
const handleSunoClose = (): void => {
  computedSunoDialogOpen.value = false;
};
</script>
