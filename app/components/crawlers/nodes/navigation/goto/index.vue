<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-external-link" :title="t('components.crawler.blueprint.nodes.navigation.goto.title')" :description="t('components.crawler.blueprint.nodes.navigation.goto.description')" header-bg="bg-blue-500" :right-pins="computedRightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.label')">
        <div class="space-y-2">
          <UTextarea v-model="statePath" autoresize class="scrollbar w-full" :placeholder="t('components.crawler.blueprint.nodes.navigation.goto.fields.path.placeholder')" :class="[computedPathError ? 'border-error/50 bg-error/5' : '']" @blur="handlePathBlur" @input="handleInputChange" />
        </div>
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerNavigationGotoTimeoutMs" v-model="stateTimeoutMs" :min="1000" :step="500" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <USwitch v-model="stateWaitReady" :label="t('components.crawler.blueprint.nodes.navigation.goto.fields.waitReady.label')" />
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersNodesNavigationGotoData } from '@/components/crawlers/nodes/navigation/goto/index.types';

/**
 * 常量：跳转节点默认超时时间（毫秒）。
 */
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();

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
 * 状态：是否等待页面就绪。
 */
const stateWaitReady = ref(true);

/**
 * 状态：超时时间（毫秒）。
 */
const stateTimeoutMs = ref(DEFAULT_TIMEOUT_MS);

/**
 * 状态：路径验证错误消息。
 */
const statePathError = ref('');

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
  stateWaitReady.value = Boolean(data.waitReady ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(1000, Number(data.timeoutMs)) : DEFAULT_TIMEOUT_MS;
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch([statePath, stateWaitReady, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    path: statePath.value,
    waitReady: stateWaitReady.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
