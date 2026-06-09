<template>
  <USlideover
    v-model:open="open"
    :title="t('pages.crawlers.blueprint.drawer.title')"
    :description="t('pages.crawlers.blueprint.drawer.description')"
    side="bottom"
    :overlay="false"
    :ui="{
      header: 'px-4 py-3 sm:px-4 sm:py-3',
      content: 'bg-default h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] rounded-none shadow-3xl shadow-black/80',
      body: 'h-full w-full overflow-hidden p-0 sm:p-0'
    }"
  >
    <template #body>
      <div class="bg-default flex h-full min-h-0 flex-col overflow-hidden">
        <UContextMenu :items="computedBlueprintContextMenuItems" :ui="{ content: 'w-fit min-w-[14rem] max-w-[min(88vw,24rem)] max-h-[min(58vh,24rem)] overflow-y-auto' }" class="flex min-h-0 flex-1 flex-col">
          <div class="relative flex min-h-0 flex-1 overflow-hidden">
            <div
              class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.09),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(20,184,166,0.06),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.04),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.05),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(20,184,166,0.035),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.025),transparent_34%)]"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.35)_78%,transparent)] bg-size-[22px_22px] dark:bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)]"
            />
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_60%,rgba(15,23,42,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0,transparent_60%,rgba(15,23,42,0.02)_100%)]" />

            <div class="absolute top-4 bottom-4 left-4 z-20 flex w-60 flex-col gap-3">
              <UCard class="border-default/70 bg-default/95 border shadow-xl shadow-black/10 backdrop-blur" variant="soft">
                <div class="space-y-3">
                  <div>
                    <p class="text-primary text-xs font-semibold tracking-[0.24em] uppercase">节点面板</p>
                    <p class="text-muted mt-1 text-sm">拖到右侧画布即可创建节点。</p>
                  </div>

                  <div class="space-y-2">
                    <button
                      v-for="item in blueprintPaletteItems"
                      :key="item.type"
                      class="border-default/70 bg-muted/40 text-default hover:border-primary/50 hover:bg-primary/5 flex w-full cursor-grab items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-medium transition active:cursor-grabbing"
                      draggable="true"
                      type="button"
                      @dragstart="handleNodeDragStart($event, item.type)"
                    >
                      <span>{{ item.label }}</span>
                      <span class="text-muted text-xs">拖拽</span>
                    </button>
                  </div>

                  <p class="text-muted text-xs leading-5">滚轮缩放，按 Backspace 或 Delete 删除选中节点/连线。</p>
                </div>
              </UCard>
            </div>

            <ClientOnly>
              <VueFlow
                class="relative z-10 h-full w-full"
                :nodes="blueprintDemoNodes"
                :edges="blueprintDemoEdges"
                :fit-view-on-init="true"
                :nodes-draggable="true"
                :nodes-connectable="true"
                :elements-selectable="true"
                :edges-updatable="true"
                :pan-on-drag="true"
                :zoom-on-scroll="true"
                :zoom-on-pinch="true"
                :zoom-on-double-click="false"
                :delete-key-code="['Backspace', 'Delete']"
                :node-types="blueprintNodeTypes"
                @dragover.prevent="handleFlowDragOver"
                @drop.prevent="handleFlowDrop"
                @connect="handleConnect"
                @edge-update-start="handleEdgeUpdateStart"
                @edge-update="handleEdgeUpdate"
                @edge-update-end="handleEdgeUpdateEnd"
              >
                <Panel position="bottom-right" :show-zoom="true" :show-fit-view="true" :show-interactive="true" class="border-default/80 bg-default/95 right-4! bottom-4! rounded-2xl border shadow-2xl shadow-black/15 backdrop-blur" />
              </VueFlow>

              <template #fallback>
                <div class="relative z-10 flex h-full w-full items-center justify-center">
                  <UCard class="max-w-md border-dashed" variant="soft">
                    <div class="space-y-2">
                      <p class="text-highlighted text-base font-medium">Vue Flow Demo</p>
                      <p class="text-muted text-sm">正在加载爬虫蓝图画布。</p>
                    </div>
                  </UCard>
                </div>
              </template>
            </ClientOnly>
          </div>
        </UContextMenu>

        <div class="border-default bg-default flex items-center justify-end gap-2 border-t px-3 sm:p-3">
          <UButton type="button" color="neutral" variant="outline" @click="open = false">{{ t('common.actions.cancel') }}</UButton>
          <UButton type="button" color="primary" icon="i-lucide:save" @click="handleSave">{{ t('common.actions.save') }}</UButton>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui';
import { MarkerType, Position, VueFlow, useZoomPanHelper } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import type { Edge, Node } from '@vue-flow/core';

import CrawlerBlueprintNodeShell from '@/components/sections/crawlers/blueprint/node-shell/index.vue';

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * Hook：爬虫蓝图节点菜单。
 */
const { buildCrawlerBlueprintContextMenuItems } = useCrawlerBlueprintNodeMenu();

/**
 * Hook：蓝图视口缩放与坐标投影。
 */
const { project } = useZoomPanHelper();

/**
 * 常量：蓝图节点面板条目。
 */
const blueprintPaletteItems = [
  { type: 'action', label: '操作节点' },
  { type: 'branch', label: '分支节点' },
  { type: 'logic', label: '逻辑节点' }
] as const;

/**
 * 常量：蓝图节点类型映射。
 */
const blueprintNodeTypes = {
  'blueprint-shell': CrawlerBlueprintNodeShell
};

/**
 * 常量：蓝图连线视觉样式。
 */
const blueprintEdgeStyle = {
  stroke: 'rgba(255, 255, 255, 0.95)',
  strokeWidth: 4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

/**
 * 常量：蓝图面板演示节点。
 */
const blueprintDemoNodes = ref<any[]>([]);

/**
 * 常量：蓝图面板初始节点。
 */
const blueprintDemoInitialNodes = [
  {
    id: 'start',
    type: 'blueprint-shell',
    position: { x: 40, y: 180 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      title: '爬虫开始',
      subtitle: '执行入口节点',
      badge: 'START',
      tone: 'start',
      execInputs: 0,
      execOutputs: 1,
      outputLabels: ['Exec']
    }
  },
  {
    id: 'set-variable',
    type: 'blueprint-shell',
    position: { x: 320, y: 120 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      title: '设置变量',
      subtitle: '写入当前上下文变量',
      badge: 'ACTION',
      tone: 'action',
      execInputs: 1,
      execOutputs: 1,
      outputLabels: ['Exec']
    }
  },
  {
    id: 'branch',
    type: 'blueprint-shell',
    position: { x: 620, y: 210 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      title: '分支',
      subtitle: '根据条件分成两条执行线',
      badge: 'BRANCH',
      tone: 'branch',
      execInputs: 1,
      execOutputs: 2,
      outputLabels: ['True', 'False']
    }
  },
  {
    id: 'end',
    type: 'blueprint-shell',
    position: { x: 900, y: 180 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      title: '爬虫结束',
      subtitle: '执行出口节点',
      badge: 'END',
      tone: 'end',
      execInputs: 1,
      execOutputs: 0
    }
  }
];

/**
 * 常量：蓝图面板演示连线。
 */
const blueprintDemoEdges = ref<Edge[]>([
  {
    id: 'start-set-variable',
    source: 'start',
    target: 'set-variable',
    animated: true,
    selectable: true,
    deletable: true,
    updatable: true,
    style: blueprintEdgeStyle,
    markerEnd: MarkerType.ArrowClosed
  } as Edge,
  {
    id: 'set-variable-branch',
    source: 'set-variable',
    target: 'branch',
    animated: true,
    selectable: true,
    deletable: true,
    updatable: true,
    style: blueprintEdgeStyle,
    markerEnd: MarkerType.ArrowClosed
  } as Edge,
  {
    id: 'branch-end',
    source: 'branch',
    target: 'end',
    animated: true,
    selectable: true,
    deletable: true,
    updatable: true,
    style: blueprintEdgeStyle,
    markerEnd: MarkerType.ArrowClosed
  } as Edge
]);

onMounted(() => {
  blueprintDemoNodes.value = blueprintDemoInitialNodes;
});

/**
 * 事件：开始拖拽节点类型。
 * @param {DragEvent} event 拖拽事件。
 * @param {string} type 节点类型。
 */
const handleNodeDragStart = (event: DragEvent, type: string) => {
  if (!event.dataTransfer) {
    return;
  }

  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('application/vueflow-node-type', type);
};

/**
 * 事件：拖拽经过画布。
 * @param {DragEvent} event 拖拽事件。
 */
const handleFlowDragOver = (event: DragEvent) => {
  if (!event.dataTransfer) {
    return;
  }

  event.dataTransfer.dropEffect = 'move';
};

/**
 * 事件：在画布中放置节点。
 * @param {DragEvent} event 拖拽事件。
 */
const handleFlowDrop = (event: DragEvent) => {
  const nodeType = event.dataTransfer?.getData('application/vueflow-node-type');

  if (!nodeType) {
    return;
  }

  const position = project({ x: event.clientX, y: event.clientY });
  const nodeLabel = blueprintPaletteItems.find((item) => item.type === nodeType)?.label ?? '节点';

  blueprintDemoNodes.value.push({
    id: `${nodeType}-${Date.now()}`,
    type: 'blueprint-shell',
    position,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      title: nodeLabel,
      subtitle: '拖拽创建的新节点',
      badge: 'NODE',
      tone: nodeType === 'branch' ? 'branch' : 'action',
      execInputs: nodeType === 'start' ? 0 : 1,
      execOutputs: nodeType === 'branch' ? 2 : 1,
      outputLabels: nodeType === 'branch' ? ['True', 'False'] : ['Exec']
    }
  });
};

/**
 * 事件：连接节点。
 * @param {{ source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }} connection 连接信息。
 */
const handleConnect = (connection: { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }) => {
  const nextEdgeId = `${connection.source}-${connection.sourceHandle ?? 'out'}-${connection.target}-${connection.targetHandle ?? 'in'}`;

  blueprintDemoEdges.value.push({
    id: nextEdgeId,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle ?? null,
    targetHandle: connection.targetHandle ?? null,
    selectable: true,
    deletable: true,
    updatable: true,
    animated: true,
    style: blueprintEdgeStyle,
    markerEnd: MarkerType.ArrowClosed
  } as Edge);
};

/**
 * 状态：当前边更新是否已成功连接到另一个节点。
 */
const edgeUpdateApplied = ref(false);

/**
 * 事件：开始更新边。
 */
const handleEdgeUpdateStart = () => {
  edgeUpdateApplied.value = false;
};

/**
 * 事件：更新边。
 */
const handleEdgeUpdate = () => {
  edgeUpdateApplied.value = true;
};

/**
 * 事件：结束更新边。
 * @param {{ edge: Edge }} payload 边更新结束信息。
 */
const handleEdgeUpdateEnd = (payload: { edge: Edge }) => {
  if (edgeUpdateApplied.value) {
    return;
  }

  blueprintDemoEdges.value = blueprintDemoEdges.value.filter((edge) => edge.id !== payload.edge.id);
};

/**
 * 计算属性：蓝图节点右键菜单。
 */
const computedBlueprintContextMenuItems = computed<ContextMenuItem[][]>(() => buildCrawlerBlueprintContextMenuItems(handleBlueprintNodeSelect));

/**
 * 双向绑定：抽屉开关。
 */
const open = defineModel<boolean>('open', {
  default: false
});

/**
 * 事件：选择蓝图节点菜单项。
 */
const emit = defineEmits<{
  /**
   * 事件：选择节点。
   * @param {ICrawlerBlueprintNodeMenuItem} node 节点菜单项。
   */
  (event: 'node-select', node: ICrawlerBlueprintNodeMenuItem): void;
}>();

/**
 * 事件：蓝图节点菜单点击。
 * @param {ICrawlerBlueprintNodeMenuItem} node 节点菜单项。
 */
const handleBlueprintNodeSelect = (node: ICrawlerBlueprintNodeMenuItem) => {
  emit('node-select', node);
};

/**
 * 事件：保存蓝图。
 */
const handleSave = () => {
  open.value = false;
};
</script>
