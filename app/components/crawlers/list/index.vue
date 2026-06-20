<template>
  <div class="space-y-5">
    <section v-for="item in items" :key="item.label" class="space-y-3">
      <div class="border-default border-b pb-3">
        <div class="flex items-start gap-3">
          <div class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
            <UIcon :name="item.icon" class="size-4" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium tracking-wide">{{ item.label }}</div>
                <div class="text-muted mt-1 text-xs leading-5">{{ item.description }}</div>
              </div>
              <UBadge color="neutral" variant="soft" class="shrink-0">{{ item.crawlers.length }}</UBadge>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <CrawlersListItem v-for="crawler in item.crawlers" :key="crawler.key" :name="crawler.key" :label="crawler.name" :description="crawler.description" :icon-name="crawler.iconName" :selected="crawler.key === selectedKey" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersListProps } from '@/components/crawlers/list/index.types';

/**
 * 属性：爬虫列表分组数据。
 */
const { groups = [], selectedKey = '' } = defineProps<ICrawlersListProps>();

/**
 * 计算属性：分组项目。
 */
const items = computed(() =>
  groups.map((group) => ({
    label: group.label,
    description: group.description,
    icon: group.iconName,
    crawlers: group.crawlers.map((crawler) => ({
      ...crawler,
      description: crawler.description.replace(/[。．.]+$/u, '')
    }))
  }))
);
</script>
