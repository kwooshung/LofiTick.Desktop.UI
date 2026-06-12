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
const { editor: reteEditor, area: reteArea, reroutePlugin, isReady: reteCanvasReady, destroy: destroyReteCanvas } = useReteCanvas(canvasElement);

/**
 * 函数：创建带尺寸的画布节点（用于 minimap 正常绘制）。
 * @param {string} label 节点标题。
 * @returns {ClassicPreset.Node & { width: number; height: number }} 节点实例。
 */
const createSizedNode = (label: string): ClassicPreset.Node & { width: number; height: number } => {
  const node = new ClassicPreset.Node(label) as ClassicPreset.Node & { width: number; height: number };
  node.width = 190;
  node.height = 130;

  return node;
};

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

  const a = createSizedNode('A');
  a.addControl('a', new ClassicPreset.InputControl('text', {}));
  a.addOutput('a', new ClassicPreset.Output(socket, undefined, true));

  const b = createSizedNode('B');
  b.addInput('b', new ClassicPreset.Input(socket, undefined, true));

  await currentEditor.addNode(a);
  await currentEditor.addNode(b);

  const conn1 = new ClassicPreset.Connection(a as ClassicPreset.Node, 'a', b as ClassicPreset.Node, 'b');
  const conn2 = new ClassicPreset.Connection(a as ClassicPreset.Node, 'a', b as ClassicPreset.Node, 'b');

  await currentEditor.addConnection(conn1);
  await currentEditor.addConnection(conn2);

  await currentArea.translate(a.id, { x: 0, y: 0 });
  await currentArea.translate(b.id, { x: 400, y: 0 });

  // 为连线添加中间折点
  if (reroutePlugin.value) {
    reroutePlugin.value.add(conn1.id, { x: 300, y: -50 });
    reroutePlugin.value.add(conn2.id, { x: 300, y: 200 });
  }

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
