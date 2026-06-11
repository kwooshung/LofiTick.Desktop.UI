<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-4">
      <div class="border-default bg-card rounded-lg border p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-highlighted font-semibold">
            <UIcon name="i-lucide:clock" class="mr-2 inline-block size-4" />
            {{ t('pages.crawlers.executions.title') }}
          </h3>
        </div>

        <UEmpty icon="i-lucide:history" :title="t('pages.crawlers.executions.empty.title')" :description="t('pages.crawlers.executions.empty.description')" class="py-8" />
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
