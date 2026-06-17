<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-eye" :title="t('components.crawler.blueprint.nodes.scroll.intoView.title')" header-bg="bg-cyan-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.intoView.fields.behavior.label')">
        <USelect v-model="stateBehavior" class="w-full" :items="stateBehaviorOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.intoView.fields.block.label')">
        <USelect v-model="stateBlock" class="w-full" :items="stateAlignOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.intoView.fields.inline.label')">
        <USelect v-model="stateInline" class="w-full" :items="stateAlignOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <USwitch v-model="stateEnsureVisible" :label="t('components.crawler.blueprint.nodes.scroll.intoView.fields.ensureVisible.label')" />

      <UFormField :label="t('components.crawler.blueprint.nodes.scroll.intoView.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerScrollIntoViewTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>
    </div>
  </CrawlersNodesCommonBasic>
</template>

<script setup lang="ts">
import { useNode } from '@vue-flow/core';

import type { IBasicSidePin } from '@/components/crawlers/nodes/common/basic/index.types';

const { t } = useI18n();

const stateNode = useNode();
const stateInitialized = ref(false);

const stateBehavior = ref('smooth');
const stateBlock = ref('center');
const stateInline = ref('nearest');
const stateEnsureVisible = ref(true);
const stateTimeoutMs = ref(10000);

const leftPins: IBasicSidePin[] = [
  {
    id: 'element-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 50,
    description: t('components.crawler.blueprint.nodes.common.pinLabels.element')
  }
];

const rightPins: IBasicSidePin[] = [
  {
    id: 'result-boolean',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.boolean'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 35,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.booleanDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 75,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

const stateBehaviorOptions = computed(() => {
  return [
    {
      value: 'auto',
      label: t('components.crawler.blueprint.nodes.scroll.intoView.fields.behavior.options.auto')
    },
    {
      value: 'smooth',
      label: t('components.crawler.blueprint.nodes.scroll.intoView.fields.behavior.options.smooth')
    }
  ];
});

const stateAlignOptions = computed(() => {
  return [
    {
      value: 'start',
      label: t('components.crawler.blueprint.nodes.scroll.intoView.fields.alignOptions.start')
    },
    {
      value: 'center',
      label: t('components.crawler.blueprint.nodes.scroll.intoView.fields.alignOptions.center')
    },
    {
      value: 'end',
      label: t('components.crawler.blueprint.nodes.scroll.intoView.fields.alignOptions.end')
    },
    {
      value: 'nearest',
      label: t('components.crawler.blueprint.nodes.scroll.intoView.fields.alignOptions.nearest')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateBehavior.value = ['auto', 'smooth'].includes(String(data.behavior)) ? String(data.behavior) : 'smooth';
  stateBlock.value = ['start', 'center', 'end', 'nearest'].includes(String(data.block)) ? String(data.block) : 'center';
  stateInline.value = ['start', 'center', 'end', 'nearest'].includes(String(data.inline)) ? String(data.inline) : 'nearest';
  stateEnsureVisible.value = Boolean(data.ensureVisible ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateInitialized.value = true;
});

watch([stateBehavior, stateBlock, stateInline, stateEnsureVisible, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    behavior: stateBehavior.value,
    block: stateBlock.value,
    inline: stateInline.value,
    ensureVisible: stateEnsureVisible.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
