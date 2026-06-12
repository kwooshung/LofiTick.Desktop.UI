<template>
  <div class="bg-default flex h-full min-h-0 overflow-hidden" :aria-label="computedDescription">
    <aside class="border-default bg-elevated/30 scrollbar h-full min-h-0 w-100 shrink-0 overflow-y-auto border-r p-3">
      <CrawlersList :groups="computedGroups" :selected-key="selectedKey" @click="handleListClick" />
    </aside>

    <div class="bg-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <div ref="canvasElement" class="bg-default relative isolate min-h-0 min-w-full flex-1 overflow-hidden" />

      <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 py-3">
        <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" color="primary" icon="i-lucide:save" @click="emit('save')">{{ t('common.actions.save') }}</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClassicPreset } from 'rete';

import type { ICrawlersEditorEmits, ICrawlersEditorProps } from '@/components/crawlers/editor/index.types';
import type { ICrawlersListRow } from '@/components/crawlers/list/index.types';

/**
 * 属性：站点展示名称与基础 URL。
 */
const { siteName = '', baseUrl = '', groups = [], selectedKey = '' } = defineProps<ICrawlersEditorProps>();

/**
 * 事件：编辑器操作。
 */
const emit = defineEmits<ICrawlersEditorEmits>();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：爬虫蓝图。
 */
const { groups: blueprintGroups } = useCrawlerBlueprint();

/**
 * 状态：ReteJS 画布容器。
 */
const canvasElement = ref<HTMLDivElement | null>(null);

/**
 * 句柄：ReteJS 画布实例。
 */
const { editor: reteEditor, area: reteArea, isReady: reteCanvasReady, destroy: destroyReteCanvas } = useReteCanvas(canvasElement);

/**
 * 状态：默认节点是否已注入。
 */
const hasDefaultNodesApplied = ref(false);

/**
 * 函数：初始化默认节点。
 *
 * # Returns
 *
 * 返回初始化完成后的异步任务。
 */
const setupDefaultCanvas = async (): Promise<void> => {
  const currentEditor = reteEditor.value;
  const currentArea = reteArea.value;

  if (!reteCanvasReady.value || !currentEditor || !currentArea || hasDefaultNodesApplied.value) {
    return;
  }

  const socket = new ClassicPreset.Socket('socket');

  const input = new ClassicPreset.Node('输入');
  input.addControl('value', new ClassicPreset.InputControl('text', { initial: 'Hello' }));
  input.addOutput('output', new ClassicPreset.Output(socket, '输出'));

  const output = new ClassicPreset.Node('输出');
  output.addInput('input', new ClassicPreset.Input(socket, '输入'));

  await currentEditor.addNode(input);
  await currentEditor.addNode(output);
  await currentEditor.addConnection(new ClassicPreset.Connection(input, 'output', output, 'input'));

  await currentArea.translate(input.id, { x: 0, y: 0 });
  await currentArea.translate(output.id, { x: 280, y: 0 });

  hasDefaultNodesApplied.value = true;
};

/**
 * 监听：当 ReteJS 画布准备就绪时，设置默认节点
 */
watch(
  [reteEditor, reteArea, reteCanvasReady],
  () => {
    void setupDefaultCanvas();
  },
  { immediate: true }
);

/**
 * 计算属性：描述文本。
 */
const computedDescription = computed(() => {
  const siteNameText = String(siteName ?? '').trim();
  const baseUrlText = String(baseUrl ?? '').trim();

  return [siteNameText, baseUrlText].filter((value) => value !== '').join(' · ');
});

/**
 * 计算属性：分组数据。
 */
const computedGroups = computed(() => (groups.length > 0 ? groups : blueprintGroups.value));

/**
 * 函数：处理列表点击。
 * @param {ICrawlersListRow} row 条目。
 * @param {MouseEvent} event 鼠标事件。
 * @returns {void} 无返回值。
 */
const handleListClick = (row: ICrawlersListRow, event: MouseEvent): void => {
  emit('click', row, event);
};

/**
 * 生命周期：卸载时销毁画布。
 */
onBeforeUnmount(() => {
  destroyReteCanvas();
});
</script>
