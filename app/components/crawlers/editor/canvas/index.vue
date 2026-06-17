<template>
  <div class="bg-default relative flex min-h-0 min-w-full flex-1 items-center justify-center overflow-hidden">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :is-valid-connection="isValidConnection"
      :connection-mode="ConnectionMode.Strict"
      :delete-key-code="['Backspace', 'Delete']"
      :elements-selectable="true"
      :pan-on-drag="[1]"
      :selection-key-code="true"
      :select-nodes-on-drag="true"
      :selection-mode="SelectionMode.Full"
      fit-view-on-init
      @dragover="(event: DragEvent) => emit('dragover', event as DragEvent)"
      @dragleave="(event: DragEvent) => emit('dragleave', event as DragEvent)"
      @connect="(params) => emit('connect', params)"
      @connect-start="(params) => emit('connect-start', params as TCrawlersCanvasConnectStartEvent)"
      @connect-end="(event) => emit('connect-end', event as MouseEvent | undefined)"
      @nodes-change="(changes) => emit('nodes-change', changes)"
    >
      <CrawlersEditorLinesHelper :horizontal="helperLineHorizontal" :vertical="helperLineVertical" />
      <template #node-start="props"><CrawlersNodesCommonStart v-bind="props" /></template>
      <template #node-end="props"><CrawlersNodesCommonEnd v-bind="props" /></template>
      <template #node-navigation-goto="props"><CrawlersNodesNavigationGoto v-bind="props" /></template>
      <template #node-navigation-refresh="props"><CrawlersNodesNavigationRefresh v-bind="props" /></template>
      <template #node-navigation-back="props"><CrawlersNodesNavigationBack v-bind="props" /></template>
      <template #node-navigation-forward="props"><CrawlersNodesNavigationForward v-bind="props" /></template>
      <template #node-navigation-close-page="props"><CrawlersNodesNavigationClose v-bind="props" /></template>
      <template #node-wait-element="props"><CrawlersNodesWaitElement v-bind="props" /></template>
      <template #node-wait-time="props"><CrawlersNodesWaitTime v-bind="props" /></template>
      <template #node-wait-random="props"><CrawlersNodesWaitRandom v-bind="props" /></template>
      <template #node-wait-load-state="props"><CrawlersNodesWaitLoadState v-bind="props" /></template>
      <template #node-wait-condition="props"><CrawlersNodesWaitCondition v-bind="props" /></template>
      <template #node-wait-text="props"><CrawlersNodesWaitText v-bind="props" /></template>
      <template #node-wait-delay="props"><CrawlersNodesWaitDelay v-bind="props" /></template>
      <template #node-interaction-click-element="props"><CrawlersNodesInteractionClickElement v-bind="props" /></template>
      <template #node-interaction-double-click-element="props"><CrawlersNodesInteractionDoubleClickElement v-bind="props" /></template>
      <template #node-interaction-hover-element="props"><CrawlersNodesInteractionHoverElement v-bind="props" /></template>
      <template #node-interaction-input-text="props"><CrawlersNodesInteractionInputText v-bind="props" /></template>
      <template #node-interaction-fill-content="props"><CrawlersNodesInteractionFillContent v-bind="props" /></template>
      <template #node-interaction-select-option="props"><CrawlersNodesInteractionSelectOption v-bind="props" /></template>
      <template #node-interaction-check-box="props"><CrawlersNodesInteractionCheckBox v-bind="props" /></template>
      <template #node-interaction-uncheck-box="props"><CrawlersNodesInteractionUncheckBox v-bind="props" /></template>
      <template #node-interaction-focus-element="props"><CrawlersNodesInteractionFocusElement v-bind="props" /></template>
      <template #node-interaction-dispatch-event="props"><CrawlersNodesInteractionDispatchEvent v-bind="props" /></template>
      <template #node-interaction-press-key="props"><CrawlersNodesInteractionPressKey v-bind="props" /></template>
      <template #node-mouse-move="props"><CrawlersNodesInteractionMouseMove v-bind="props" /></template>
      <template #node-scroll-to-position="props"><CrawlersNodesScrollToPosition v-bind="props" /></template>
      <template #node-scroll-into-view="props"><CrawlersNodesScrollIntoView v-bind="props" /></template>
      <template #node-scroll-infinite="props"><CrawlersNodesScrollInfinite v-bind="props" /></template>
      <template #node-extract-get-text="props"><CrawlersNodesExtractGetText v-bind="props" /></template>
      <template #node-extract-get-attribute="props"><CrawlersNodesExtractGetAttribute v-bind="props" /></template>
      <template #node-extract-get-html="props"><CrawlersNodesExtractGetHtml v-bind="props" /></template>
      <template #node-extract-get-value="props"><CrawlersNodesExtractGetValue v-bind="props" /></template>
      <template #node-extract-query-element="props"><CrawlersNodesExtractQueryElement v-bind="props" /></template>
      <template #node-extract-query-all-elements="props"><CrawlersNodesExtractQueryAllElements v-bind="props" /></template>
      <template #node-extract-execute-script="props"><CrawlersNodesExtractExecuteScript v-bind="props" /></template>
      <template #node-http-request="props"><CrawlersNodesHttpRequest v-bind="props" /></template>
      <template #node-http-get-cookies="props"><CrawlersNodesHttpGetCookies v-bind="props" /></template>
      <template #node-http-set-cookies="props"><CrawlersNodesHttpSetCookies v-bind="props" /></template>
      <template #node-detect-verification="props"><CrawlersNodesDetectVerification v-bind="props" /></template>
      <template #node-system-screen-size="props"><CrawlersNodesSystemScreenSize v-bind="props" /></template>
      <template #node-system-window-size="props"><CrawlersNodesSystemWindowSize v-bind="props" /></template>
      <template #node-system-mouse-position="props"><CrawlersNodesSystemMousePosition v-bind="props" /></template>
      <template #node-system-element-position="props"><CrawlersNodesSystemElementPosition v-bind="props" /></template>
      <template #node-system-read-clipboard="props"><CrawlersNodesSystemReadClipboard v-bind="props" /></template>
      <template #node-system-write-clipboard="props"><CrawlersNodesSystemWriteClipboard v-bind="props" /></template>
      <template #node-variable-set="props"><CrawlersNodesVariableSet v-bind="props" /></template>
      <template #node-variable-get="props"><CrawlersNodesVariableGet v-bind="props" /></template>
      <template #node-logic-equal="props"><CrawlersNodesLogicEqual v-bind="props" /></template>
      <template #node-logic-not-equal="props"><CrawlersNodesLogicNotEqual v-bind="props" /></template>
      <template #node-logic-greater-than="props"><CrawlersNodesLogicGreaterThan v-bind="props" /></template>
      <template #node-logic-less-than="props"><CrawlersNodesLogicLessThan v-bind="props" /></template>
      <template #node-logic-greater-than-or-equal="props"><CrawlersNodesLogicGreaterThanOrEqual v-bind="props" /></template>
      <template #node-logic-less-than-or-equal="props"><CrawlersNodesLogicLessThanOrEqual v-bind="props" /></template>
      <template #node-logic-and="props"><CrawlersNodesLogicAnd v-bind="props" /></template>
      <template #node-logic-or="props"><CrawlersNodesLogicOr v-bind="props" /></template>
      <template #node-logic-not="props"><CrawlersNodesLogicNot v-bind="props" /></template>
      <template #node-logic-is-empty="props"><CrawlersNodesLogicIsEmpty v-bind="props" /></template>
      <template #node-logic-exists="props"><CrawlersNodesLogicExists v-bind="props" /></template>
      <template #node-math-add="props"><CrawlersNodesMathAdd v-bind="props" /></template>
      <template #node-math-subtract="props"><CrawlersNodesMathSubtract v-bind="props" /></template>
      <template #node-math-multiply="props"><CrawlersNodesMathMultiply v-bind="props" /></template>
      <template #node-math-divide="props"><CrawlersNodesMathDivide v-bind="props" /></template>
      <template #node-math-round="props"><CrawlersNodesMathRound v-bind="props" /></template>
      <template #node-math-random="props"><CrawlersNodesMathRandom v-bind="props" /></template>
      <template #node-math-absolute="props"><CrawlersNodesMathAbsolute v-bind="props" /></template>
      <template #node-math-modulo="props"><CrawlersNodesMathModulo v-bind="props" /></template>
      <template #node-math-power="props"><CrawlersNodesMathPower v-bind="props" /></template>
      <template #node-string-substring="props"><CrawlersNodesStringSubstring v-bind="props" /></template>
      <template #node-string-replace="props"><CrawlersNodesStringReplace v-bind="props" /></template>
      <template #node-string-concat="props"><CrawlersNodesStringConcat v-bind="props" /></template>
      <template #node-string-regex-match="props"><CrawlersNodesStringRegexMatch v-bind="props" /></template>
      <template #node-string-regex-replace="props"><CrawlersNodesStringRegexReplace v-bind="props" /></template>
      <template #node-string-split="props"><CrawlersNodesStringSplit v-bind="props" /></template>
      <template #node-string-length="props"><CrawlersNodesStringLength v-bind="props" /></template>
      <template #node-string-uppercase="props"><CrawlersNodesStringUppercase v-bind="props" /></template>
      <template #node-string-lowercase="props"><CrawlersNodesStringLowercase v-bind="props" /></template>
      <template #node-string-trim="props"><CrawlersNodesStringTrim v-bind="props" /></template>
      <template #node-array-object-filter="props"><CrawlersNodesArrayObjectFilter v-bind="props" /></template>
      <template #node-array-object-merge="props"><CrawlersNodesArrayObjectMerge v-bind="props" /></template>
      <template #node-array-object-split="props"><CrawlersNodesArrayObjectSplit v-bind="props" /></template>
      <template #node-array-object-length="props"><CrawlersNodesArrayObjectLength v-bind="props" /></template>
      <template #node-array-object-item="props"><CrawlersNodesArrayObjectItem v-bind="props" /></template>
      <template #node-type-convert-string="props"><CrawlersNodesTypeConvertString v-bind="props" /></template>
      <template #node-type-convert-number="props"><CrawlersNodesTypeConvertNumber v-bind="props" /></template>
      <template #node-type-convert-boolean="props"><CrawlersNodesTypeConvertBoolean v-bind="props" /></template>
      <template #node-type-convert-json="props"><CrawlersNodesTypeConvertJson v-bind="props" /></template>
      <template #node-type-convert-parse-json="props"><CrawlersNodesTypeConvertParseJson v-bind="props" /></template>
      <template #node-control-flow-loop="props"><CrawlersNodesControlFlowLoop v-bind="props" /></template>
      <template #node-control-flow-condition="props"><CrawlersNodesControlFlowCondition v-bind="props" /></template>
      <template #node-control-flow-switch="props"><CrawlersNodesControlFlowSwitch v-bind="props" /></template>
      <template #node-output-send-to-api="props"><CrawlersNodesOutputSendToApi v-bind="props" /></template>
      <template #node-output-print-log="props"><CrawlersNodesOutputPrintLog v-bind="props" /></template>
      <template #node-output-screenshot="props"><CrawlersNodesOutputScreenshot v-bind="props" /></template>
      <CrawlersBackgroundDropzone :class="[isDragOver ? 'bg-primary/10' : 'bg-transparent', 'transition-colors duration-200 ease-in-out']">
        <UEmpty
          v-if="isDragOver"
          icon="i-lucide:mouse-pointer-click"
          :title="dragTitle"
          :description="dragDescription"
          variant="naked"
          size="sm"
          :ui="{
            root: 'pointer-events-none rounded-lg border border-1 border-default bg-default px-4 py-3 shadow-sm',
            header: 'max-w-none',
            body: 'max-w-none'
          }"
        />
        <UEmpty
          v-else-if="isCanvasEmpty"
          icon="i-lucide:workflow"
          :title="emptyTitle"
          :description="emptyDescription"
          variant="naked"
          size="sm"
          :ui="{
            root: 'pointer-events-none rounded-lg border border-1 border-default bg-default px-4 py-3 shadow-sm',
            header: 'max-w-none',
            body: 'max-w-none'
          }"
        />
      </CrawlersBackgroundDropzone>
      <MiniMap class="bg-elevated/80" />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ConnectionMode, SelectionMode, VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';

import type { ICrawlersEditorCanvasEmits, ICrawlersEditorCanvasProps, TCrawlersCanvasConnectStartEvent } from '@/components/crawlers/editor/canvas/index.types';

/**
 * 属性：画布渲染与状态数据。
 */
const { nodes, edges, isValidConnection, helperLineHorizontal, helperLineVertical, isDragOver, isCanvasEmpty, dragTitle, dragDescription, emptyTitle, emptyDescription } = defineProps<ICrawlersEditorCanvasProps>();

/**
 * 事件：画布交互事件。
 */
const emit = defineEmits<ICrawlersEditorCanvasEmits>();
</script>
