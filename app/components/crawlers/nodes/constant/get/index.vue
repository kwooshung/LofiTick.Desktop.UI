<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-bookmark-check" :title="t('components.crawler.blueprint.nodes.constant.get.title')" :description="t('components.crawler.blueprint.nodes.constant.get.description')" header-bg="bg-cyan-600" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.constant.get.fields.constantKey.label')">
        <USelect v-model="stateConstantKey" class="w-full" :items="stateConstantKeyOptions" value-attribute="value" option-attribute="label" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

/**
 * 类型：常量键。
 */
type TConstantKey = 'attachmentDir';

const { t } = useI18n();
const stateNode = useNode();

/**
 * 状态：是否完成首次数据回填。
 */
const stateInitialized = ref(false);

/**
 * 状态：常量键。
 */
const stateConstantKey = ref<TConstantKey>('attachmentDir');

/**
 * 计算属性：常量键选项。
 */
const stateConstantKeyOptions = computed(() => [
  {
    value: 'attachmentDir',
    label: t('components.crawler.blueprint.nodes.constant.get.fields.constantKey.options.attachmentDir')
  }
]);

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-value-string',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.value'),
    direction: 'out',
    dataType: 'string',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.constant.get.outputs.value.description')
  },
  {
    id: 'result-constant-key-string',
    label: t('components.crawler.blueprint.nodes.constant.get.outputs.constantKey.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 68,
    description: t('components.crawler.blueprint.nodes.constant.get.outputs.constantKey.description')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 90,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  const constantKey = String(data.constantKey ?? 'attachmentDir');
  stateConstantKey.value = constantKey === 'attachmentDir' ? 'attachmentDir' : 'attachmentDir';
  stateInitialized.value = true;
});

watch(stateConstantKey, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    constantKey: stateConstantKey.value
  };
});
</script>
