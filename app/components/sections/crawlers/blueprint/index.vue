<template>
  <UDrawer
    v-model:open="open"
    direction="bottom"
    :overlay="false"
    :ui="{
      content: 'bg-default h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] w-full max-w-none rounded-none shadow-2xl',
      container: 'items-end justify-start',
      body: 'h-full overflow-hidden p-0',
      footer: 'border-default border-t bg-default px-4 py-3 sm:px-5'
    }"
  >
    <template #body>
      <div class="bg-default flex h-full min-h-0 flex-col">
        <div class="flex items-start justify-between gap-3 pb-4">
          <div>
            <div class="text-highlighted text-sm font-semibold">{{ t('pages.crawlers.blueprint.drawer.title') }}</div>
            <div class="text-muted mt-1 text-xs">{{ t('pages.crawlers.blueprint.drawer.description') }}</div>
          </div>
          <UBadge color="primary" variant="soft">{{ t('pages.crawlers.targets.addTask') }}</UBadge>
        </div>

        <div class="flex min-h-0 flex-1 items-stretch overflow-hidden">
          <div class="bg-card/70 flex min-h-0 w-[18rem] shrink-0 flex-col px-4 pt-4 pb-3">
            <SectionsCrawlersBlueprintNodeList @select="handleNodeSelect" />
          </div>

          <div class="bg-default flex min-h-0 flex-1 flex-col px-6 py-4">
            <div class="flex items-center justify-between gap-3 pb-3">
              <div>
                <div class="text-highlighted text-sm font-semibold">{{ t('pages.crawlers.blueprint.logic.title') }}</div>
                <div class="text-muted mt-1 text-xs">{{ t('pages.crawlers.blueprint.logic.description') }}</div>
              </div>
              <UBadge color="neutral" variant="soft">{{ t('pages.crawlers.blueprint.logic.badge') }}</UBadge>
            </div>

            <div class="bg-elevated/30 flex min-h-0 flex-1 items-center justify-center p-6">
              <div v-if="stateSelectedNode" class="max-w-lg text-center">
                <UIcon :name="stateSelectedNode.icon" class="text-primary mx-auto size-10" />
                <div class="text-highlighted mt-4 text-base font-semibold">{{ stateSelectedNode.title }}</div>
                <div class="text-muted mt-2 text-sm leading-6 text-pretty">{{ stateSelectedNode.description }}</div>
                <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <UBadge color="primary" variant="soft">{{ t('pages.crawlers.blueprint.logic.empty.badges.canvas') }}</UBadge>
                  <UBadge color="neutral" variant="soft">{{ t('pages.crawlers.blueprint.logic.empty.badges.inspector') }}</UBadge>
                  <UBadge color="info" variant="soft">{{ t('pages.crawlers.blueprint.logic.empty.badges.preview') }}</UBadge>
                </div>
              </div>

              <div v-else class="max-w-md text-center">
                <UIcon name="i-lucide:workflow" class="text-primary mx-auto size-10" />
                <div class="text-highlighted mt-4 text-base font-semibold">{{ t('pages.crawlers.blueprint.logic.empty.title') }}</div>
                <div class="text-muted mt-2 text-sm leading-6 text-pretty">{{ t('pages.crawlers.blueprint.logic.empty.description') }}</div>
                <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <UBadge color="primary" variant="soft">{{ t('pages.crawlers.blueprint.logic.empty.badges.canvas') }}</UBadge>
                  <UBadge color="neutral" variant="soft">{{ t('pages.crawlers.blueprint.logic.empty.badges.inspector') }}</UBadge>
                  <UBadge color="info" variant="soft">{{ t('pages.crawlers.blueprint.logic.empty.badges.preview') }}</UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="mx-auto flex w-full items-center justify-end gap-2">
        <UButton type="button" color="neutral" variant="outline" @click="open = false">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" color="primary" icon="i-lucide:save" @click="handleSave">{{ t('common.actions.save') }}</UButton>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { IBlueprintNodeItem } from './index.types';

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
 * 状态：当前选中的节点。
 */
const stateSelectedNode = shallowRef<IBlueprintNodeItem | null>(null);

/**
 * 事件：节点选择。
 */
const handleNodeSelect = (node: IBlueprintNodeItem) => {
  stateSelectedNode.value = node;
};

/**
 * 事件：保存蓝图。
 */
const handleSave = () => {
  open.value = false;
};
</script>
