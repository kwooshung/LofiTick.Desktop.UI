<template>
  <div class="bg-default flex h-full min-h-0 overflow-hidden" :aria-label="computedDescription">
    <aside class="border-default bg-elevated/30 w-80 shrink-0 border-r"></aside>

    <div class="bg-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <div class="flex-1 overflow-auto p-4"></div>

      <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 py-3">
        <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" color="primary" icon="i-lucide:save" @click="emit('save')">{{ t('common.actions.save') }}</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 属性：站点展示名称与基础 URL。
 */
const props = withDefaults(
  defineProps<{
    siteName?: string;
    baseUrl?: string;
  }>(),

  {
    siteName: '',
    baseUrl: ''
  }
);

/**
 * 事件：编辑器操作。
 */
const emit = defineEmits<{
  save: [];
  cancel: [];
}>();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 计算属性：描述文本。
 */
const computedDescription = computed(() => {
  const siteName = String(props.siteName ?? '').trim();
  const baseUrl = String(props.baseUrl ?? '').trim();

  return [siteName, baseUrl].filter((value) => value !== '').join(' · ');
});
</script>
