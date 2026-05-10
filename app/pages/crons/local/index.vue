<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-3">
      <div class="flex w-full flex-1 gap-1 overflow-auto">
        <div class="min-w-full flex-1">
          <div class="flex min-h-96 items-center justify-center">
            <UEmpty icon="i-lucide:clock-3" :title="t('pages.settings.cron.local.empty.title')" :description="t('pages.settings.cron.local.empty.description')" variant="naked" />
          </div>
        </div>
      </div>
      <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div class="muted text-sm">{{ t('pages.settings.cron.footer.total', { total: 0 }) }}</div>
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：国际化
 */
const { t } = useI18n();
</script>
