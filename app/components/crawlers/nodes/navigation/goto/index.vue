<template>
  <CrawlersNodesCommonBasic
    icon-name="i-lucide-external-link"
    :title="t('components.crawler.blueprint.nodes.navigation.goto.title')"
    :description="t('components.crawler.blueprint.nodes.navigation.goto.description')"
    header-bg="bg-blue-500"
    :left-pins="computedLeftPins"
    :right-pins="computedRightPins"
  >
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.label')">
        <div ref="refPathTextareaWrapper" class="space-y-2">
          <UTextarea
            v-model="statePath"
            autoresize
            class="scrollbar w-full"
            :placeholder="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.placeholder')"
            :class="[computedPathError ? 'border-error/50 bg-error/5' : '']"
            @blur="handlePathBlur"
            @click="handlePathSelectionUpdate"
            @focus="handlePathSelectionUpdate"
            @input="handlePathSelectionUpdate"
            @keyup="handlePathSelectionUpdate"
            @mouseup="handlePathSelectionUpdate"
          />
        </div>
      </UFormField>

      <div class="space-y-2">
        <span class="text-toned text-xs leading-none font-medium">{{ t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.label') }}</span>

        <CrawlersNodesFunctionPins
          :node-id="computedNodeId"
          direction="input"
          :model-value="statePathVariables"
          :empty-title="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.empty.title')"
          :empty-description="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.empty.description')"
          :empty-action-label="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.actions.add')"
          :add-action-label="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.actions.add')"
          :name-placeholder="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.placeholder')"
          :string-placeholder="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.placeholder')"
          :json-placeholder="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.placeholder')"
          :show-default-value="false"
          @update:model-value="handlePathVariablesUpdate"
        >
          <template #actions="{ item }">
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-text-cursor-input" class="shrink-0" :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.actions.insert')" @mousedown.prevent @click="handlePathVariableInsert(item)" />
          </template>
        </CrawlersNodesFunctionPins>
      </div>

      <div class="space-y-3">
        <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.windowWidth.label')">
          <CrawlersNodesCommonNumberInput id="crawlerNavigationGotoWindowWidth" v-model="stateWindowWidth" :min="320" :step="10" prefix="W" unit="px" />
        </UFormField>

        <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.windowHeight.label')">
          <CrawlersNodesCommonNumberInput id="crawlerNavigationGotoWindowHeight" v-model="stateWindowHeight" :min="240" :step="10" prefix="H" unit="px" />
        </UFormField>
      </div>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionMode.label')">
        <USelect v-model="stateWindowPositionMode" class="w-full" :items="computedWindowPositionModeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <template v-if="stateWindowPositionMode === 'custom'">
        <div class="space-y-3">
          <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.windowX.label')">
            <CrawlersNodesCommonNumberInput id="crawlerNavigationGotoWindowX" v-model="stateWindowX" :min="-10000" :step="10" prefix="X" unit="px" />
          </UFormField>

          <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.windowY.label')">
            <CrawlersNodesCommonNumberInput id="crawlerNavigationGotoWindowY" v-model="stateWindowY" :min="-10000" :step="10" prefix="Y" unit="px" />
          </UFormField>
        </div>
      </template>

      <UFormField v-else :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.label')">
        <USelect v-model="stateWindowPositionPreset" class="w-full" :items="computedWindowPositionPresetOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerNavigationGotoTimeoutMs" v-model="stateTimeoutMs" :min="1000" :step="500" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <USwitch v-model="stateShowWebview" :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.showWebview.label')" />

      <USwitch v-model="stateWaitReady" :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.waitReady.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode, useNodeId, useVueFlow } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersNodesNavigationGotoData, ICrawlersNodesNavigationGotoPathVariable } from '@/components/crawlers/nodes/navigation/goto/index.types';
import type { IVariableDefinitionData } from '@/components/crawlers/nodes/variable/shared/index';
import { variableDefinitionsParse } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 类型：窗口位置模式。
 */
type TCrawlersNodesNavigationGotoWindowPositionMode = 'preset' | 'custom';

/**
 * 类型：窗口预设位置。
 */
type TCrawlersNodesNavigationGotoWindowPositionPreset = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * 常量：窗口位置模式选项。
 */
const CRAWLER_WINDOW_POSITION_MODE_OPTIONS = ['preset', 'custom'] as const satisfies readonly TCrawlersNodesNavigationGotoWindowPositionMode[];

/**
 * 常量：窗口预设位置选项。
 */
const CRAWLER_WINDOW_POSITION_PRESET_OPTIONS = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const satisfies readonly TCrawlersNodesNavigationGotoWindowPositionPreset[];

/**
 * 常量：默认窗口宽度（像素）。
 */
const DEFAULT_WINDOW_WIDTH = 1280;

/**
 * 常量：默认窗口高度（像素）。
 */
const DEFAULT_WINDOW_HEIGHT = 800;

/**
 * 常量：默认窗口位置模式。
 */
const DEFAULT_WINDOW_POSITION_MODE: TCrawlersNodesNavigationGotoWindowPositionMode = 'preset';

/**
 * 常量：默认窗口预设位置。
 */
const DEFAULT_WINDOW_POSITION_PRESET: TCrawlersNodesNavigationGotoWindowPositionPreset = 'center';

/**
 * 常量：跳转节点默认超时时间（毫秒）。
 */
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();

/**
 * 事件：节点内部尺寸刷新。
 */
const emit = defineEmits<{
  updateNodeInternals: [];
}>();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();

/**
 * 常量：当前节点 ID。
 */
const stateNodeId = useNodeId();

/**
 * Hook：Vue Flow。
 */
const { edges } = useVueFlow();

/**
 * Hook：提示。
 */
const toast = useToast();

/**
 * 常量：baseUrl provide key。
 */
const PROVIDE_KEY_BASE_URL = 'crawlers:editor:baseUrl';

/**
 * Hook：获取编辑器的 baseUrl。
 */
const injectedBaseUrl = inject<string>(PROVIDE_KEY_BASE_URL, '');

/**
 * 函数：从 baseUrl 中提取域名部分。
 * @param {string} baseUrlText 基础 URL（例如 https://example.com）。
 * @returns {string | undefined} 域名部分（例如 example.com），或 undefined 如果无法解析。
 */
const extractDomainFromBaseUrl = (baseUrlText: string): string | undefined => {
  if (!baseUrlText.trim()) {
    return undefined;
  }

  try {
    const url = new URL(baseUrlText);
    return url.hostname;
  } catch {
    return undefined;
  }
};

/**
 * 状态：是否已完成 node.data 的首次回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：目标路径。
 */
const statePath = ref('');

/**
 * 状态：路径输入框当前选区起点（字符索引）。
 */
const statePathSelectionStart = ref<number | null>(null);

/**
 * 状态：路径输入框当前选区终点（字符索引）。
 */
const statePathSelectionEnd = ref<number | null>(null);

/**
 * 状态：路径输入框包装元素。
 */
const refPathTextareaWrapper = ref<HTMLDivElement | null>(null);

/**
 * 状态：目标路径变量定义列表。
 */
const statePathVariables = ref<ICrawlersNodesNavigationGotoPathVariable[]>([]);

/**
 * 计算属性：当前节点 ID（含兜底）。
 */
const computedNodeId = computed<string>(() => {
  const fromHook = String(stateNodeId.value ?? '').trim();

  if (fromHook !== '') {
    return fromHook;
  }

  return String(stateNode.node.id ?? '').trim();
});

/**
 * 状态：是否等待页面就绪。
 */
const stateWaitReady = ref(true);

/**
 * 状态：是否显示 WebView。
 */
const stateShowWebview = ref(false);

/**
 * 状态：窗口宽度（像素）。
 */
const stateWindowWidth = ref(DEFAULT_WINDOW_WIDTH);

/**
 * 状态：窗口高度（像素）。
 */
const stateWindowHeight = ref(DEFAULT_WINDOW_HEIGHT);

/**
 * 状态：窗口位置模式。
 */
const stateWindowPositionMode = ref<TCrawlersNodesNavigationGotoWindowPositionMode>(DEFAULT_WINDOW_POSITION_MODE);

/**
 * 状态：窗口预设位置。
 */
const stateWindowPositionPreset = ref<TCrawlersNodesNavigationGotoWindowPositionPreset>(DEFAULT_WINDOW_POSITION_PRESET);

/**
 * 状态：窗口坐标 X（像素）。
 */
const stateWindowX = ref(0);

/**
 * 状态：窗口坐标 Y（像素）。
 */
const stateWindowY = ref(0);

/**
 * 状态：超时时间（毫秒）。
 */
const stateTimeoutMs = ref(DEFAULT_TIMEOUT_MS);

/**
 * 状态：路径验证错误消息。
 */
const statePathError = ref('');

/**
 * 计算属性：窗口位置模式选项。
 */
const computedWindowPositionModeOptions = computed(() => [
  {
    value: 'preset',
    label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionMode.options.preset')
  },
  {
    value: 'custom',
    label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionMode.options.custom')
  }
]);

/**
 * 计算属性：窗口预设位置选项。
 */
const computedWindowPositionPresetOptions = computed(() => [
  { value: 'top-left', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.topLeft') },
  { value: 'top-center', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.topCenter') },
  { value: 'top-right', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.topRight') },
  { value: 'center-left', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.centerLeft') },
  { value: 'center', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.center') },
  { value: 'center-right', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.centerRight') },
  { value: 'bottom-left', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.bottomLeft') },
  { value: 'bottom-center', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.bottomCenter') },
  { value: 'bottom-right', label: t('components.crawler.blueprint.nodes.navigation.goto.fields.windowPositionPreset.options.bottomRight') }
]);

/**
 * 函数：判断窗口位置模式是否合法。
 * @param {string} value 位置模式字符串。
 * @returns {value is TCrawlersNodesNavigationGotoWindowPositionMode} 是否为合法位置模式。
 */
const isWindowPositionMode = (value: string): value is TCrawlersNodesNavigationGotoWindowPositionMode => {
  return CRAWLER_WINDOW_POSITION_MODE_OPTIONS.includes(value as TCrawlersNodesNavigationGotoWindowPositionMode);
};

/**
 * 函数：判断窗口预设位置是否合法。
 * @param {string} value 预设位置字符串。
 * @returns {value is TCrawlersNodesNavigationGotoWindowPositionPreset} 是否为合法预设位置。
 */
const isWindowPositionPreset = (value: string): value is TCrawlersNodesNavigationGotoWindowPositionPreset => {
  return CRAWLER_WINDOW_POSITION_PRESET_OPTIONS.includes(value as TCrawlersNodesNavigationGotoWindowPositionPreset);
};

/**
 * 计算属性：路径验证错误（不为空时表示有错误）。
 */
const computedPathError = computed(() => statePathError.value);

/**
 * 函数：处理路径输入失焦时的验证与提取。
 *
 * @returns {void} 无返回值。
 */
const handlePathBlur = (): void => {
  const input = statePath.value.trim();
  if (input === '') {
    statePathError.value = '';
    return;
  }

  // 从 baseUrl 中提取期望的域名
  const expectedDomain = extractDomainFromBaseUrl(injectedBaseUrl);

  // 尝试从完整 URL 中提取路径，同时验证域名
  const parseResult = parseAndExtractUrlPath(input, expectedDomain);

  if (!parseResult.success) {
    // 使用国际化文案
    let errorMsg = parseResult.error || t('components.crawler.blueprint.nodes.navigation.goto.fields.path.validation.invalidUrl');

    // 尝试映射已知的错误信息到国际化文案
    if (parseResult.error?.includes('路径不能为空') || parseResult.error?.includes('Path cannot be empty')) {
      errorMsg = t('components.crawler.blueprint.nodes.navigation.goto.fields.path.validation.empty');
    } else if (parseResult.error?.includes('域名不匹配') || parseResult.error?.includes('Domain mismatch')) {
      errorMsg = parseResult.error; // 已包含详细信息
    } else if (parseResult.error?.includes('应以')) {
      errorMsg = t('components.crawler.blueprint.nodes.navigation.goto.fields.path.validation.invalidFormat');
    }

    statePathError.value = errorMsg;
    toast.add({
      title: t('components.crawler.blueprint.nodes.navigation.goto.fields.path.validation.invalidTitle'),
      description: errorMsg,
      color: 'error',
      icon: 'i-lucide:triangle-alert',
      duration: 3200
    });
    return;
  }

  // 解析成功
  statePathError.value = '';

  // 如果提取了路径（从完整 URL），自动更新
  if (parseResult.isFullUrl && parseResult.path && parseResult.path !== input) {
    statePath.value = parseResult.path;
    const domain = parseResult.domain || input;
    const pathStr = parseResult.path;
    const extractedMessage = t('components.crawler.blueprint.nodes.navigation.goto.fields.path.validation.extracted', {
      domain,
      path: pathStr
    });

    toast.add({
      title: t('components.crawler.blueprint.nodes.navigation.goto.fields.path.validation.extractedTitle'),
      description: extractedMessage,
      color: 'info',
      icon: 'i-lucide:info',
      duration: 2600
    });
  }
};

/**
 * 函数：处理输入值变化。
 *
 * @returns {void} 无返回值。
 */
const handleInputChange = (): void => {
  // 实时清除错误提示和信息提示，同时清除自动消失计时器
  statePathError.value = '';
};

/**
 * 函数：获取路径输入框原生 textarea 元素。
 * @returns {HTMLTextAreaElement | null} 原生 textarea 元素。
 */
const getPathTextareaElement = (): HTMLTextAreaElement | null => {
  const element = refPathTextareaWrapper.value?.querySelector('textarea');

  return element instanceof HTMLTextAreaElement ? element : null;
};

/**
 * 函数：记录路径输入框当前选区。
 * @param {Event} event 原始事件。
 * @returns {void} 无返回值。
 */
const handlePathSelectionUpdate = (event: Event): void => {
  const target = event.target;

  if (!(target instanceof HTMLTextAreaElement)) {
    return;
  }

  statePathSelectionStart.value = target.selectionStart;
  statePathSelectionEnd.value = target.selectionEnd;
};

/**
 * 函数：获取路径变量输入引脚 ID。
 * @param {string} variableId 路径变量 ID。
 * @returns {string} 输入引脚 ID。
 */
const pathVariableInputHandleIdGet = (variableId: string, dataType: ICrawlersNodesNavigationGotoPathVariable['dataType']): string => {
  return `path-variable-${variableId}-${dataType}`;
};

/**
 * 函数：解析路径变量定义列表。
 * @param {unknown} value 未知来源变量定义。
 * @returns {ICrawlersNodesNavigationGotoPathVariable[]} 路径变量定义列表。
 */
const pathVariablesParse = (value: unknown): ICrawlersNodesNavigationGotoPathVariable[] => {
  return variableDefinitionsParse(value) as ICrawlersNodesNavigationGotoPathVariable[];
};

/**
 * 事件：更新路径变量列表。
 * @param {IVariableDefinitionData[]} value 路径变量列表。
 * @returns {void} 无返回值。
 */
const handlePathVariablesUpdate = (value: IVariableDefinitionData[]): void => {
  statePathVariables.value = variableDefinitionsParse(value) as ICrawlersNodesNavigationGotoPathVariable[];
};

/**
 * 事件：新增路径变量。
 * @returns {void} 无返回值。
 */
const handlePathVariableAdd = (): void => {
  statePathVariables.value.push({
    id: variableDefinitionIdCreate(),
    name: '',
    dataType: 'string'
  });
};

/**
 * 事件：更新路径变量数据类型。
 * @param {string} variableId 路径变量 ID。
 * @param {string | number} value 输入值。
 * @returns {void} 无返回值。
 */
const handlePathVariableDataTypeUpdate = (variableId: string, value: string | number): void => {
  const nextType = String(value ?? '') as ICrawlersNodesNavigationGotoPathVariable['dataType'];

  if (!variableValueDataTypesGet().includes(nextType)) {
    return;
  }

  const targetItem = statePathVariables.value.find((item) => item.id === variableId);

  if (!targetItem || targetItem.dataType === nextType) {
    return;
  }

  const previousHandleId = pathVariableInputHandleIdGet(targetItem.id, targetItem.dataType);
  edges.value = edges.value.filter((edge) => !(edge.target === stateNode.node.id && edge.targetHandle === previousHandleId));
  statePathVariables.value = statePathVariables.value.map((item) => (item.id === variableId ? { ...item, dataType: nextType } : item));
};

/**
 * 事件：向目标路径插入变量占位符。
 * @param {ICrawlersNodesNavigationGotoPathVariable} item 路径变量定义。
 * @returns {Promise<void>} 无返回值。
 */
const handlePathVariableInsert = async (item: ICrawlersNodesNavigationGotoPathVariable): Promise<void> => {
  const tokenName = item.name.trim() !== '' ? item.name.trim() : item.id;
  const token = `{${tokenName}}`;
  const selectionStart = statePathSelectionStart.value ?? statePath.value.length;
  const selectionEnd = statePathSelectionEnd.value ?? selectionStart;
  const nextPath = `${statePath.value.slice(0, selectionStart)}${token}${statePath.value.slice(selectionEnd)}`;
  const nextCursor = selectionStart + token.length;

  statePath.value = nextPath;
  statePathSelectionStart.value = nextCursor;
  statePathSelectionEnd.value = nextCursor;

  await nextTick();

  const textareaElement = getPathTextareaElement();
  textareaElement?.focus();
  textareaElement?.setSelectionRange(nextCursor, nextCursor);
};

/**
 * 事件：更新路径变量名称。
 * @param {string} variableId 路径变量 ID。
 * @param {string | number} value 输入值。
 * @returns {void} 无返回值。
 */
const handlePathVariableNameUpdate = (variableId: string, value: string | number): void => {
  statePathVariables.value = statePathVariables.value.map((item) => (item.id === variableId ? { ...item, name: variableDefinitionNameNormalize(String(value ?? '')) } : item));
};

/**
 * 函数：判断路径变量输入引脚是否已连接。
 * @param {ICrawlersNodesNavigationGotoPathVariable} item 路径变量定义。
 * @returns {boolean} 是否已连接。
 */
const hasConnectedPathVariable = (item: ICrawlersNodesNavigationGotoPathVariable): boolean => {
  const handleId = pathVariableInputHandleIdGet(item.id, item.dataType);

  return edges.value.some((edge) => edge.target === stateNode.node.id && edge.targetHandle === handleId);
};

/**
 * 事件：移除路径变量。
 * @param {string} variableId 路径变量 ID。
 * @returns {void} 无返回值。
 */
const handlePathVariableRemove = (variableId: string): void => {
  const targetItem = statePathVariables.value.find((item) => item.id === variableId);
  const handleId = targetItem ? pathVariableInputHandleIdGet(targetItem.id, targetItem.dataType) : pathVariableInputHandleIdGet(variableId, 'string');
  statePathVariables.value = statePathVariables.value.filter((item) => item.id !== variableId);
  edges.value = edges.value.filter((edge) => !(edge.target === stateNode.node.id && edge.targetHandle === handleId));
};

/**
 * 计算属性：左侧数据输入引脚配置。
 */
const computedLeftPins = computed<IBasicSidePin[]>(() => {
  return [
    {
      id: 'path-string',
      label: t('components.crawler.blueprint.nodes.navigation.goto.inputs.path'),
      direction: 'in',
      dataType: 'string',
      topPercent: 50,
      description: t('components.crawler.blueprint.nodes.navigation.goto.inputs.pathDescription')
    },
    ...statePathVariables.value.map((item, index) => ({
      id: pathVariableInputHandleIdGet(item.id, item.dataType),
      label: item.name.trim() !== '' ? item.name.trim() : t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.fallbackLabel', { index: index + 1 }),
      direction: 'in' as const,
      dataType: item.dataType,
      topPercent: Math.min(85, 20 + index * 12),
      description: t('components.crawler.blueprint.nodes.navigation.goto.fields.pathVariables.pinDescription', {
        name: item.name.trim() !== '' ? item.name.trim() : `${index + 1}`
      })
    }))
  ];
});

/**
 * 计算属性：路径变量引脚签名。
 */
const computedPathVariablePinSignature = computed(() => {
  return statePathVariables.value.map((item) => `${item.id}:${item.dataType}:${item.name}`).join('|');
});

/**
 * 计算属性：右侧数据输出引脚配置。
 */
const computedRightPins = computed<IBasicSidePin[]>(() => {
  return [
    {
      id: 'result-boolean',
      label: t('components.crawler.blueprint.nodes.navigation.goto.outputs.boolean'),
      direction: 'out',
      dataType: 'boolean',
      topPercent: 35,
      description: t('components.crawler.blueprint.nodes.navigation.goto.outputs.booleanDescription')
    },
    {
      id: 'result-message',
      label: t('components.crawler.blueprint.nodes.navigation.goto.outputs.message'),
      direction: 'out',
      dataType: 'string',
      topPercent: 75,
      description: t('components.crawler.blueprint.nodes.navigation.goto.outputs.messageDescription')
    }
  ];
});

/**
 * 监听：初始化阶段将 node.data 回填到本地状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  /**
   * 常量：data。
   */
  const data = (stateNode.node.data ?? {}) as ICrawlersNodesNavigationGotoData;
  statePath.value = String(data.path ?? data.url ?? '');
  statePathVariables.value = pathVariablesParse(data.pathVariables);
  stateWindowWidth.value = Number.isFinite(Number(data.windowWidth)) ? Math.max(320, Number(data.windowWidth)) : DEFAULT_WINDOW_WIDTH;
  stateWindowHeight.value = Number.isFinite(Number(data.windowHeight)) ? Math.max(240, Number(data.windowHeight)) : DEFAULT_WINDOW_HEIGHT;
  stateWindowPositionMode.value = isWindowPositionMode(String(data.windowPositionMode ?? '')) ? String(data.windowPositionMode) : DEFAULT_WINDOW_POSITION_MODE;
  stateWindowPositionPreset.value = isWindowPositionPreset(String(data.windowPositionPreset ?? '')) ? String(data.windowPositionPreset) : DEFAULT_WINDOW_POSITION_PRESET;
  stateWindowX.value = Number.isFinite(Number(data.windowX)) ? Number(data.windowX) : 0;
  stateWindowY.value = Number.isFinite(Number(data.windowY)) ? Number(data.windowY) : 0;
  stateShowWebview.value = Boolean(data.showWebview ?? false);
  stateWaitReady.value = Boolean(data.waitReady ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(1000, Number(data.timeoutMs)) : DEFAULT_TIMEOUT_MS;
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch(
  [statePath, statePathVariables, stateWindowWidth, stateWindowHeight, stateWindowPositionMode, stateWindowPositionPreset, stateWindowX, stateWindowY, stateShowWebview, stateWaitReady, stateTimeoutMs],
  () => {
    if (!stateInitialized.value) {
      return;
    }

    stateNode.node.data = {
      ...(stateNode.node.data as Record<string, unknown> | undefined),
      path: statePath.value,
      pathVariables: statePathVariables.value.map((item) => ({
        id: item.id,
        name: item.name,
        dataType: item.dataType
      })),
      windowWidth: stateWindowWidth.value,
      windowHeight: stateWindowHeight.value,
      windowPositionMode: stateWindowPositionMode.value,
      windowPositionPreset: stateWindowPositionPreset.value,
      windowX: stateWindowX.value,
      windowY: stateWindowY.value,
      showWebview: stateShowWebview.value,
      waitReady: stateWaitReady.value,
      timeoutMs: stateTimeoutMs.value
    };
  },
  { deep: true }
);

/**
 * 监听：路径变量引脚变化后刷新 Vue Flow 内部命中区域。
 */
watch(
  computedPathVariablePinSignature,
  async () => {
    await nextTick();
    emit('updateNodeInternals');
  },
  { immediate: true }
);
</script>
