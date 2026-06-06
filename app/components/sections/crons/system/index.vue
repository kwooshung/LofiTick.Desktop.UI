<template>
  <DashboardPage>
    <div class="flex w-full flex-1 flex-col gap-3">
      <div class="flex w-full flex-1 gap-1 overflow-auto">
        <div class="min-w-full flex-1">
          <UTable
            :columns="columns"
            :data="systemTasks"
            sticky
            class="shrink-0"
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
              td: 'border-b border-default align-top',
              separator: 'h-0'
            }"
          />
        </div>
      </div>
      <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div class="muted text-sm">{{ t('pages.settings.cron.footer.total', { total: systemTasks.length }) }}</div>
      </div>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

/**
 * 组件：徽标
 */
const UBadge = resolveComponent('UBadge');

/**
 * Hook：国际化
 */
const { t } = useI18n();

interface ISystemTaskRow {
  key: string;
  title: string;
  description: string;
  schedulePrimary: string;
  scheduleSecondary?: string | null;
  groupLabel: string;
}

/**
 * 计算属性：系统任务清单
 */
const systemTasks = computed<ISystemTaskRow[]>(() => [
  {
    key: 'hotsearchMorningGenerate',
    title: t('pages.settings.cron.system.items.hotsearchMorningGenerate.title'),
    description: t('pages.settings.cron.system.items.hotsearchMorningGenerate.description'),
    schedulePrimary: t('pages.settings.cron.system.schedules.hotsearchMorningGenerate.primary'),
    scheduleSecondary: t('pages.settings.cron.system.schedules.hotsearchMorningGenerate.secondary'),
    groupLabel: t('pages.settings.cron.system.groups.system')
  },
  {
    key: 'hotsearchEveningGenerate',
    title: t('pages.settings.cron.system.items.hotsearchEveningGenerate.title'),
    description: t('pages.settings.cron.system.items.hotsearchEveningGenerate.description'),
    schedulePrimary: t('pages.settings.cron.system.schedules.hotsearchEveningGenerate.primary'),
    scheduleSecondary: t('pages.settings.cron.system.schedules.hotsearchEveningGenerate.secondary'),
    groupLabel: t('pages.settings.cron.system.groups.system')
  },
  {
    key: 'hotsearchStep',
    title: t('pages.settings.cron.system.items.hotsearchStep.title'),
    description: t('pages.settings.cron.system.items.hotsearchStep.description'),
    schedulePrimary: t('pages.settings.cron.system.schedules.hotsearchStep.primary'),
    scheduleSecondary: t('pages.settings.cron.system.schedules.hotsearchStep.secondary'),
    groupLabel: t('pages.settings.cron.system.groups.hook')
  },
  {
    key: 'quoteRandom',
    title: t('pages.settings.cron.system.items.quoteRandom.title'),
    description: t('pages.settings.cron.system.items.quoteRandom.description'),
    schedulePrimary: t('pages.settings.cron.system.schedules.quoteRandom.primary'),
    scheduleSecondary: t('pages.settings.cron.system.schedules.quoteRandom.secondary'),
    groupLabel: t('pages.settings.cron.system.groups.system')
  }
]);

/**
 * 常量：系统任务表格列
 */
const columns: TableColumn<ISystemTaskRow>[] = [
  {
    accessorKey: 'title',
    header: t('pages.settings.cron.table.name'),
    cell: ({ row }) => h('div', { class: 'space-y-1 min-w-0' }, [h('div', { class: 'text-highlighted font-medium' }, row.original.title), h('div', { class: 'text-sm text-dimmed whitespace-normal break-words' }, row.original.description)])
  },
  {
    accessorKey: 'schedulePrimary',
    header: t('pages.settings.cron.table.schedule'),
    cell: ({ row }) => h('div', { class: 'space-y-1' }, [h('div', { class: 'text-sm text-muted break-words' }, row.original.schedulePrimary), h('div', { class: 'text-sm text-dimmed break-words' }, row.original.scheduleSecondary ?? t('common.labels.none'))])
  },
  {
    accessorKey: 'groupLabel',
    header: t('pages.settings.cron.table.status'),
    cell: ({ row }) => h('div', { class: 'flex flex-wrap gap-2' }, [h(UBadge, { color: 'neutral', variant: 'soft' }, () => row.original.groupLabel), h(UBadge, { color: 'warning', variant: 'soft' }, () => t('pages.settings.cron.system.readonly'))])
  }
];
</script>
