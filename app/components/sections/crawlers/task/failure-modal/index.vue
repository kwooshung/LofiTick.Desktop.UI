<template>
  <UModal v-model:open="computedOpen" :title="computedTitle" :description="computedDescription" :ui="{ content: 'sm:max-w-lg', footer: 'justify-end' }">
    <template #body>
      <div class="text-muted text-sm leading-6">
        <div class="text-default text-base font-medium">
          {{ computedTitle }}
        </div>
        <div class="mt-2 whitespace-pre-line">
          {{ computedDescription }}
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <UButton color="neutral" variant="ghost" :disabled="stateContinuing || stateStopping" @click="handleCancelClick">
          {{ t('pages.crawlers.task.retryConfirm.cancel') }}
        </UButton>
        <UButton color="error" variant="solid" :loading="stateStopping" @click="handleStopClick">
          {{ t('pages.crawlers.task.retryConfirm.stop') }}
        </UButton>
        <UButton color="primary" :loading="stateContinuing" @click="handleContinueClick">
          {{ t('pages.crawlers.task.retryConfirm.confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ISectionsCrawlersTaskFailureModalEmits, ISectionsCrawlersTaskFailureModalProps } from './index.types';

defineOptions({ name: 'SectionsCrawlersTaskFailureModal' });

/**
 * 属性：失败弹窗配置。
 */
const { open, title, description, continuing, stopping } = defineProps<ISectionsCrawlersTaskFailureModalProps>();

/**
 * 事件：失败弹窗事件。
 */
const emit = defineEmits<ISectionsCrawlersTaskFailureModalEmits>();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 计算属性：失败弹窗打开状态。
 */
const computedOpen = computed({
  get: () => open,
  set: (value: boolean) => {
    emit('update:open', value);
  }
});

/**
 * 计算属性：失败弹窗标题。
 */
const computedTitle = computed(() => title);

/**
 * 计算属性：失败弹窗描述。
 */
const computedDescription = computed(() => description);

/**
 * 变量：继续等待中。
 */
const stateContinuing = computed(() => continuing);

/**
 * 变量：终止中。
 */
const stateStopping = computed(() => stopping);

/**
 * 函数：取消失败弹窗。
 */
const handleCancelClick = (): void => {
  emit('cancel');
};

/**
 * 函数：继续等待。
 */
const handleContinueClick = (): void => {
  emit('continue');
};

/**
 * 函数：终止任务。
 */
const handleStopClick = (): void => {
  emit('stop');
};
</script>
