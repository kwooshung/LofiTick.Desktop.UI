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
        <div class="relative flex min-h-0 flex-1 overflow-hidden">
          <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.09),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(20,184,166,0.06),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.04),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.05),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(20,184,166,0.035),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.025),transparent_34%)]"
          />
          <div
            class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.35)_78%,transparent)] bg-size-[22px_22px] dark:bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)]"
          />
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_60%,rgba(15,23,42,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0,transparent_60%,rgba(15,23,42,0.02)_100%)]" />
        </div>

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
