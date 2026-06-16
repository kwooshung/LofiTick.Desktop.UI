<template>
  <div class="space-y-2">
    <USelect v-model="stateMode" class="w-full" :items="stateModeOptions" value-attribute="value" option-attribute="label" />

    <UInput v-model="stateValue" class="w-full" :placeholder="placeholder" />

    <p v-if="computedShowInvalidHint" class="text-error text-xs">{{ t('components.crawler.blueprint.nodes.common.selectorInput.invalidHint') }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersNodesCommonSelectorInputProps, TCrawlersNodesCommonSelectorType } from '@/components/crawlers/nodes/common/selector-input/index.types';

const { t } = useI18n();

const props = defineProps<ICrawlersNodesCommonSelectorInputProps>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:selectorType': [value: TCrawlersNodesCommonSelectorType];
}>();

const stateMode = ref<TCrawlersNodesCommonSelectorType>('xpath');
const stateValue = ref('');

const stateModeOptions = computed(() => {
  return [
    {
      value: 'xpath',
      label: t('components.crawler.blueprint.nodes.common.selectorInput.mode.options.xpath')
    },
    {
      value: 'css',
      label: t('components.crawler.blueprint.nodes.common.selectorInput.mode.options.css')
    }
  ];
});

const computedShowInvalidHint = computed(() => {
  const value = stateValue.value.trim();
  if (value === '') {
    return false;
  }

  if (value.includes('\n') || value.includes('\r')) {
    return true;
  }

  if (stateMode.value === 'xpath') {
    return !value.startsWith('/') && !value.startsWith('(');
  }

  if (value.startsWith('/') || value.startsWith('(')) {
    return true;
  }

  if (value.includes('<') || value.includes('>')) {
    return true;
  }

  return false;
});

watch(
  () => props.modelValue,
  (value) => {
    stateValue.value = String(value ?? '');
  },
  { immediate: true }
);

watch(
  () => props.selectorType,
  (selectorType) => {
    stateMode.value = selectorType === 'css' ? 'css' : 'xpath';
  },
  { immediate: true }
);

watch(stateMode, (mode) => {
  emit('update:selectorType', mode);
});

watch(stateValue, (value) => {
  emit('update:modelValue', value);
});
</script>
