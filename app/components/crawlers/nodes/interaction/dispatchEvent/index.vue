<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-send" :title="t('components.crawler.blueprint.nodes.interaction.dispatchEvent.title')" :description="t('components.crawler.blueprint.nodes.interaction.dispatchEvent.description')" header-bg="bg-purple-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.label')">
        <USelect v-model="stateEventName" class="w-full" :items="stateEventNameOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.bubbles.label')">
        <USwitch v-model="stateBubbles" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.cancelable.label')">
        <USwitch v-model="stateCancelable" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerInteractionDispatchEventTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.simulateNativeInput.label')">
        <USwitch v-model="stateSimulateNativeInput" />
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
const stateEventName = ref('click');
const stateBubbles = ref(true);
const stateCancelable = ref(true);
const stateTimeoutMs = ref(10000);
const stateSimulateNativeInput = ref(false);

const leftPins: IBasicSidePin[] = [
  {
    id: 'element-input',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.element'),
    direction: 'in',
    dataType: 'object',
    topPercent: 50,
    description: '由元素查询节点输出的目标元素'
  }
];

const stateAllowedEventValues = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'input', 'change', 'focus', 'blur', 'keydown', 'keyup', 'keypress', 'submit'] as const;

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

const stateEventNameOptions = computed(() => {
  return [
    {
      value: 'click',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.click')
    },
    {
      value: 'dblclick',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.dblclick')
    },
    {
      value: 'mousedown',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.mousedown')
    },
    {
      value: 'mouseup',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.mouseup')
    },
    {
      value: 'mouseenter',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.mouseenter')
    },
    {
      value: 'mouseleave',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.mouseleave')
    },
    {
      value: 'mousemove',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.mousemove')
    },
    {
      value: 'input',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.input')
    },
    {
      value: 'change',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.change')
    },
    {
      value: 'focus',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.focus')
    },
    {
      value: 'blur',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.blur')
    },
    {
      value: 'keydown',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.keydown')
    },
    {
      value: 'keyup',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.keyup')
    },
    {
      value: 'keypress',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.keypress')
    },
    {
      value: 'submit',
      label: t('components.crawler.blueprint.nodes.interaction.common.fields.eventName.options.submit')
    }
  ];
});

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateEventName.value = stateAllowedEventValues.includes(String(data.eventName) as (typeof stateAllowedEventValues)[number]) ? String(data.eventName) : 'click';
  stateBubbles.value = Boolean(data.bubbles ?? true);
  stateCancelable.value = Boolean(data.cancelable ?? true);
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateSimulateNativeInput.value = Boolean(data.simulateNativeInput ?? false);
  stateInitialized.value = true;
});

watch([stateEventName, stateBubbles, stateCancelable, stateTimeoutMs, stateSimulateNativeInput], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    eventName: stateEventName.value,
    bubbles: stateBubbles.value,
    cancelable: stateCancelable.value,
    timeoutMs: stateTimeoutMs.value,
    simulateNativeInput: stateSimulateNativeInput.value
  };
});
</script>
