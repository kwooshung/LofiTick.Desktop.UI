<template>
  <USlideover
    v-model:open="open"
    :title="t('pages.crawlers.blueprint.drawer.title')"
    :description="t('pages.crawlers.blueprint.drawer.description')"
    side="bottom"
    :overlay="false"
    :ui="{
      header: 'px-4 py-3 sm:px-4 sm:py-3',
      content: 'bg-default h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] rounded-none shadow-3xl shadow-black/80',
      body: 'h-full w-full overflow-hidden p-0 sm:p-0'
    }"
  >
    <template #body>
      <div class="bg-default flex h-full min-h-0 flex-col overflow-hidden">
        <div class="relative flex min-h-0 flex-1 overflow-hidden"></div>
        <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 sm:p-3">
          <UButton type="button" color="neutral" variant="outline" @click="open = false">{{ t('common.actions.cancel') }}</UButton>
          <UButton type="button" color="primary" icon="i-lucide:save" @click="handleSave">{{ t('common.actions.save') }}</UButton>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 双向绑定：抽屉开关。
 */
const open = defineModel<boolean>('open', {
  default: false
});

/**
 * 事件：保存蓝图。
 */
const handleSave = () => {
  open.value = false;
};
</script>
