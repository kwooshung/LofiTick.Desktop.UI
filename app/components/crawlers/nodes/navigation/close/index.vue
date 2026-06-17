<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide:monitor-x" :title="t('components.crawler.blueprint.nodes.navigation.closePage.title')" :description="t('components.crawler.blueprint.nodes.navigation.closePage.description')" header-bg="bg-blue-500" :right-pins="rightPins">
    <USwitch v-model="stateEndFlowAfterClose" :label="t('components.crawler.blueprint.nodes.navigation.closePage.fields.endFlowAfterClose.label')" />
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';
import type { ICrawlersNodesNavigationCloseData } from '@/components/crawlers/nodes/navigation/close/index.types';

/**
 * Hook：国际化工具。
 */
const { t } = useI18n();

/**
 * Hook：当前节点上下文。
 */
const stateNode = useNode();

/**
 * 状态：是否已完成 node.data 的首次回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：关闭页面后是否终止流程。
 */
const stateEndFlowAfterClose = ref(true);

/**
 * 常量：右侧数据输出引脚配置。
 */
const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.navigation.closePage.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.navigation.closePage.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.navigation.closePage.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.navigation.closePage.outputs.messageDescription')
  }
];

/**
 * 监听：初始化阶段将 node.data 回填到本地状态。
 */
watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as ICrawlersNodesNavigationCloseData;
  stateEndFlowAfterClose.value = Boolean(data.endFlowAfterClose ?? true);
  stateInitialized.value = true;
});

/**
 * 监听：本地状态变化时回写到 node.data。
 */
watch(stateEndFlowAfterClose, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    endFlowAfterClose: stateEndFlowAfterClose.value
  };
});
</script>
