<template>
  <div class="bg-default flex h-full min-h-0 overflow-hidden" :aria-label="computedDescription">
    <aside class="border-default bg-elevated/30 scrollbar h-full min-h-0 w-100 shrink-0 overflow-y-auto border-r p-3">
      <CrawlersList :groups="computedGroups" :selected-key="selectedKey" @click="handleListClick" />
    </aside>

    <div class="bg-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <div ref="canvasElement" class="crawlers-rete-canvas border-default bg-elevated/20 min-h-0 min-w-full flex-1 overflow-hidden rounded-xl border" />

      <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 py-3">
        <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ t('common.actions.cancel') }}</UButton>
        <UButton type="button" color="primary" icon="i-lucide:save" @click="emit('save')">{{ t('common.actions.save') }}</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClassicPreset, NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import { Presets, VuePlugin } from 'rete-vue-plugin';

import type { ICrawlersEditorEmits, ICrawlersEditorProps, ReteCanvasAreaExtra, ReteCanvasSchemes } from '@/components/crawlers/editor/index.types';
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
 * 状态：ReteJS 画布实例。
 */
let reteArea: AreaPlugin<ReteCanvasSchemes, ReteCanvasAreaExtra> | null = null;

/**
 * 状态：组件卸载标记。
 */
let isCanvasDisposed = false;

/**
 * 函数：初始化 ReteJS 基础画布。
 *
 * 仅负责创建最小可视化编辑器、插入示例节点并适配视口。
 *
 * # Returns
 *
 * 返回初始化完成的异步任务。
 */
const initializeReteCanvas = async (): Promise<void> => {
  const container = canvasElement.value;
  if (!container) {
    return;
  }

  const editor = new NodeEditor<ReteCanvasSchemes>();
  const area = new AreaPlugin<ReteCanvasSchemes, ReteCanvasAreaExtra>(container);
  const renderer = new VuePlugin<ReteCanvasSchemes, ReteCanvasAreaExtra>();

  renderer.addPreset(Presets.classic.setup());

  editor.use(area as unknown as AreaPlugin<ReteCanvasSchemes>);
  area.use(renderer);

  const socket = new ClassicPreset.Socket('text');

  const nodeInput = new ClassicPreset.Node('Input');
  nodeInput.addControl('value', new ClassicPreset.InputControl('text', { initial: 'Hello Rete' }));
  nodeInput.addOutput('output', new ClassicPreset.Output(socket, 'Output'));

  const nodeOutput = new ClassicPreset.Node('Output');
  nodeOutput.addInput('input', new ClassicPreset.Input(socket, 'Input'));

  await editor.addNode(nodeInput);
  await editor.addNode(nodeOutput);
  await editor.addConnection(new ClassicPreset.Connection(nodeInput, 'output', nodeOutput, 'input'));

  await area.translate(nodeOutput.id, { x: 300, y: 80 });
  await AreaExtensions.zoomAt(area, editor.getNodes());

  if (isCanvasDisposed) {
    area.destroy();
    return;
  }

  reteArea = area;
};

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
 * 生命周期：挂载后初始化画布。
 */
onMounted(() => {
  void initializeReteCanvas();
});

/**
 * 生命周期：卸载时销毁画布。
 */
onBeforeUnmount(() => {
  isCanvasDisposed = true;
  reteArea?.destroy();
  reteArea = null;
});
</script>
