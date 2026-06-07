<template>
  <Dashboard>
    <template #toolbar-left>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide:globe" class="text-dimmed size-4" />
        <span class="font-medium">{{ stateDetail?.name }}</span>
      </div>
    </template>

    <template #toolbar-right>
      <div class="flex items-center gap-2">
        <SelectsPagesizes cache-key="crawlers-detail" />
        <UButton icon="i-lucide:edit" color="primary" variant="outline" @click="handleEdit">
          {{ t('common.actions.edit') }}
        </UButton>
        <UButton icon="i-lucide:plus" color="primary" @click="handleAddTask">
          {{ t('pages.crawlers.targets.addTask') }}
        </UButton>
      </div>
    </template>

    <NuxtPage :domain="params.domain" />
  </Dashboard>
</template>

<script setup lang="ts">
/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Hook：路由参数
 */
const params = definePageParams<{ domain: string }>();

/**
 * API：获取站点详情
 */
const { datas: stateDetail } = await useApi<IQueryResultCrawlerTargetRow>(`crawlers/targets/${params.domain}`, {
  immediate: true
});

/**
 * 事件：编辑站点
 */
const handleEdit = () => {
  // TODO: 打开编辑弹窗
};

/**
 * 事件：添加任务
 */
const handleAddTask = () => {
  // TODO: 打开添加任务弹窗
};
</script>