<template>
  <div class="space-y-2">
    <UFieldGroup class="w-full">
      <USelect v-model="stateMode" class="w-28" :items="stateModeOptions" value-attribute="value" option-attribute="label" />

      <UInput v-model="stateValue" class="w-full" :placeholder="placeholder" />
    </UFieldGroup>

    <p v-if="computedShowInvalidHint" class="text-error text-xs">{{ t('components.crawler.blueprint.nodes.common.selectorInput.invalidHint') }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ICrawlersNodesCommonSelectorInputProps, TCrawlersNodesCommonSelectorType } from '@/components/crawlers/nodes/common/selector-input/index.types';

const { t } = useI18n();

/**
 * Props：组件入参。
 */
const props = defineProps<ICrawlersNodesCommonSelectorInputProps>();

/**
 * 常量：emit。
 */
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:selectorType': [value: TCrawlersNodesCommonSelectorType];
}>();

/**
 * 状态：stateMode。
 */
const stateMode = ref<TCrawlersNodesCommonSelectorType>('xpath');
/**
 * 状态：stateValue。
 */
const stateValue = ref('');

/**
 * 状态：stateModeOptions。
 */
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

/**
 * 函数：校验 CSS 选择器语法。
 * @param {string} value 选择器文本。
 * @return {boolean} 是否有效。
 */
const validateCssSelector = (value: string): boolean => {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return true;
  }

  try {
    return CSS.supports(`selector(${value})`);
  } catch {
    return false;
  }
};

/**
 * 函数：校验 XPath 选择器语法。
 * @param {string} value 选择器文本。
 * @return {boolean} 是否有效。
 */
const validateXpathSelector = (value: string): boolean => {
  if (typeof document === 'undefined' || typeof document.createExpression !== 'function') {
    return true;
  }

  try {
    document.createExpression(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * 计算属性：computedShowInvalidHint。
 */
const computedShowInvalidHint = computed(() => {
  /**
   * 常量：value。
   */
  const value = stateValue.value.trim();
  if (value === '') {
    return false;
  }

  if (value.includes('\n') || value.includes('\r')) {
    return true;
  }

  if (stateMode.value === 'xpath') {
    return !validateXpathSelector(value);
  }

  return !validateCssSelector(value);
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
