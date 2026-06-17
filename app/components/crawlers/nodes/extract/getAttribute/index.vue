<template>
  <CrawlersNodesCommonBasic icon-name="i-lucide-tag" :title="t('components.crawler.blueprint.nodes.extract.getAttribute.title')" header-bg="bg-emerald-500" :left-pins="leftPins" :right-pins="rightPins">
    <div class="space-y-3">
      <UFormField :label="t('components.crawler.blueprint.nodes.extract.getAttribute.fields.commonAttribute.label')">
        <USelect v-model="stateCommonAttribute" class="w-full" :items="stateCommonAttributeOptions" value-attribute="value" option-attribute="label" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.extract.getAttribute.fields.attributeName.label')">
        <UInput v-model="stateAttributeName" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.extract.getAttribute.fields.attributeName.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.extract.getAttribute.fields.defaultValue.label')">
        <UInput v-model="stateDefaultValue" class="w-full" :placeholder="t('components.crawler.blueprint.nodes.extract.getAttribute.fields.defaultValue.placeholder')" />
      </UFormField>

      <UFormField :label="t('components.crawler.blueprint.nodes.interaction.common.fields.timeoutMs.label')">
        <CrawlersNodesCommonNumberInput id="crawlerExtractGetAttributeTimeoutMs" v-model="stateTimeoutMs" :min="100" :step="100" prefix="#" :unit="t('components.crawler.blueprint.nodes.common.units.millisecond')" />
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

const COMMON_ATTRIBUTE_VALUES = [
  'id',
  'class',
  'name',
  'type',
  'value',
  'href',
  'src',
  'alt',
  'title',
  'placeholder',
  'role',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'for',
  'tabindex',
  'disabled',
  'readonly',
  'checked',
  'selected',
  'required',
  'hidden',
  'style',
  'target',
  'rel',
  'download',
  'content',
  'data-id',
  'data-key',
  'data-value',
  'data-index',
  'data-name',
  'data-type',
  'data-role',
  'data-testid',
  'data-track',
  'data-url'
] as const;

const stateCommonAttribute = ref('href');
const stateAttributeName = ref('href');
const stateDefaultValue = ref('');
const stateTimeoutMs = ref(10000);

const stateCommonAttributeOptions = computed(() => {
  return [
    ...COMMON_ATTRIBUTE_VALUES.map((attribute) => {
      return {
        label: attribute,
        value: attribute
      };
    }),
    {
      label: t('components.crawler.blueprint.nodes.extract.getAttribute.fields.commonAttribute.options.custom'),
      value: '__custom__'
    }
  ];
});

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
    id: 'attribute-string',
    label: t('components.crawler.blueprint.nodes.extract.getAttribute.outputs.value.label'),
    direction: 'out',
    dataType: 'string',
    topPercent: 30,
    description: t('components.crawler.blueprint.nodes.extract.getAttribute.outputs.value.description')
  },
  {
    id: 'attribute-exists',
    label: t('components.crawler.blueprint.nodes.common.pinLabels.exists'),
    direction: 'out',
    dataType: 'boolean',
    topPercent: 58,
    description: t('components.crawler.blueprint.nodes.extract.getAttribute.outputs.existsDescription')
  },
  {
    id: 'result-message',
    label: t('components.crawler.blueprint.nodes.interaction.common.outputs.message'),
    direction: 'out',
    dataType: 'string',
    topPercent: 84,
    description: t('components.crawler.blueprint.nodes.interaction.common.outputs.messageDescription')
  }
];

watchEffect(() => {
  if (stateInitialized.value) {
    return;
  }

  const data = (stateNode.node.data ?? {}) as Record<string, unknown>;
  stateAttributeName.value = String(data.attributeName ?? 'href');
  stateCommonAttribute.value = COMMON_ATTRIBUTE_VALUES.includes(stateAttributeName.value as (typeof COMMON_ATTRIBUTE_VALUES)[number]) ? stateAttributeName.value : '__custom__';
  stateDefaultValue.value = String(data.defaultValue ?? '');
  stateTimeoutMs.value = Number.isFinite(Number(data.timeoutMs)) ? Math.max(100, Number(data.timeoutMs)) : 10000;
  stateInitialized.value = true;
});

watch(stateCommonAttribute, () => {
  if (!stateInitialized.value) {
    return;
  }

  if (stateCommonAttribute.value !== '__custom__') {
    stateAttributeName.value = stateCommonAttribute.value;
  }
});

watch(stateAttributeName, () => {
  if (!stateInitialized.value) {
    return;
  }

  stateCommonAttribute.value = COMMON_ATTRIBUTE_VALUES.includes(stateAttributeName.value as (typeof COMMON_ATTRIBUTE_VALUES)[number]) ? stateAttributeName.value : '__custom__';
});

watch([stateAttributeName, stateDefaultValue, stateTimeoutMs], () => {
  if (!stateInitialized.value) {
    return;
  }

  stateNode.node.data = {
    ...(stateNode.node.data as Record<string, unknown> | undefined),
    attributeName: stateAttributeName.value,
    defaultValue: stateDefaultValue.value,
    timeoutMs: stateTimeoutMs.value
  };
});
</script>
