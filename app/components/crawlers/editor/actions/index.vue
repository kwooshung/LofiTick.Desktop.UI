<template>
  <div class="border-default bg-default flex items-center justify-between gap-3 border-t px-3 py-3">
    <div class="flex items-center gap-2">
      <UTooltip :text="restoreText">
        <UButton type="button" color="neutral" variant="outline" icon="i-lucide:rotate-ccw" @click="emit('restore')" />
      </UTooltip>
      <UTooltip :text="zoomInText">
        <UButton type="button" color="neutral" variant="outline" icon="i-lucide:zoom-in" @click="emit('zoom-in')" />
      </UTooltip>
      <UTooltip :text="zoomOutText">
        <UButton type="button" color="neutral" variant="outline" icon="i-lucide:zoom-out" @click="emit('zoom-out')" />
      </UTooltip>
      <UTooltip :text="autoLayoutText">
        <UButton type="button" color="neutral" variant="outline" icon="i-lucide:layout-grid" @click="emit('auto-layout')" />
      </UTooltip>
      <UTooltip :text="redoText">
        <UButton type="button" color="neutral" variant="outline" icon="i-lucide:redo-2" @click="emit('redo')" />
      </UTooltip>
      <UTooltip :text="undoText">
        <UButton type="button" color="neutral" variant="outline" icon="i-lucide:undo-2" @click="emit('undo')" />
      </UTooltip>
      <UTooltip v-if="executeVisible" :text="executeText || ''">
        <UButton type="button" color="primary" variant="soft" icon="i-lucide:play" :loading="executeLoading" :disabled="executeDisabled || executeLoading" @click="emit('execute')" />
      </UTooltip>
    </div>
    <div class="flex items-center gap-2">
      <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ cancelText }}</UButton>
      <UButton type="button" color="primary" icon="i-lucide:save" :disabled="saveDisabled" @click="emit('save')">{{ saveText }}</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersEditorActionsEmits, ICrawlersEditorActionsProps } from '@/components/crawlers/editor/actions/index.types';

/**
 * 属性：底部操作栏文案。
 */
/**
 * Props：组件入参。
 */
const { cancelText, saveText, saveDisabled = false, executeVisible = false, executeText = '', executeDisabled = false, executeLoading = false } = defineProps<ICrawlersEditorActionsProps>();

/**
 * 事件：底部操作栏操作。
 */
const emit = defineEmits<ICrawlersEditorActionsEmits>();
</script>
