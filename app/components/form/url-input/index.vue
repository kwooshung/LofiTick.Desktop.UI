<template>
  <UFieldGroup class="w-full">
    <USelect v-model="stateProtocol" :items="computedProtocolOptions" value-attribute="value" option-attribute="label" variant="outline" :disabled="props.readonly || props.disabled" :class="[props.protocolSelectClass, 'shrink-0']" />

    <UInput
      :model-value="stateValue"
      variant="outline"
      class="min-w-0 flex-1"
      :placeholder="computedInputPlaceholder"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :ui="{
        trailing: 'pe-1.5'
      }"
      @update:model-value="handleValueInput"
    >
      <template v-if="slots.actions" #trailing>
        <div class="flex items-center gap-1">
          <slot name="actions" />
        </div>
      </template>
    </UInput>
  </UFieldGroup>
</template>

<script setup lang="ts">
import type { IFormUrlInputProps, IFormUrlInputProtocolOption, IFormUrlInputSplitResult } from '@/components/form/url-input/index.types';

/**
 * 属性：URL 输入组件。
 * @type {IFormUrlInputProps}
 */
const props = withDefaults(defineProps<IFormUrlInputProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
  protocolSelectClass: 'w-[118px]',
  baseUrlOnly: false
});

/**
 * 数据：组件双向绑定 URL。
 */
const model = defineModel<string>({ default: '' });

/**
 * Hook：插槽。
 */
const slots = useSlots();

/**
 * 状态：当前协议。
 */
const stateProtocol = ref<'http' | 'https'>('https');

/**
 * 状态：当前主体内容。
 */
const stateValue = ref<string>('');

/**
 * 计算属性：协议选项。
 */
const computedProtocolOptions = computed<IFormUrlInputProtocolOption[]>(() => [
  { label: 'https://', value: 'https' },
  { label: 'http://', value: 'http' }
]);

/**
 * 计算属性：输入框占位文本。
 */
const computedInputPlaceholder = computed(() => String(props.placeholder || ''));

/**
 * 函数：提取输入值中的协议。
 * @param {string} url 原始输入。
 * @returns {'http' | 'https'} 协议。
 */
const extractProtocol = (url: string): 'http' | 'https' => (/^http:\/\//i.test(url.trim()) ? 'http' : 'https');

/**
 * 函数：去除输入值中的协议前缀。
 * @param {string} url 原始输入。
 * @returns {string} 去除协议后的输入。
 */
const stripProtocol = (url: string): string =>
  url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^\/\//, '');

/**
 * 函数：提取输入值中的主机部分。
 * @param {string} url 原始输入。
 * @returns {string} 主机部分。
 */
const extractHost = (url: string): string => stripProtocol(url).match(/^[^/?#]+/)?.[0] ?? '';

/**
 * 函数：拆分完整 URL。
 * @param {string} url 完整 URL。
 * @returns {IFormUrlInputSplitResult} 协议与主体内容。
 */
const splitUrl = (url: string): IFormUrlInputSplitResult => {
  const raw = String(url || '').trim();
  if (!raw) {
    return { protocol: 'https', value: '' };
  }

  const protocol = extractProtocol(raw);
  const stripped = stripProtocol(raw);

  return {
    protocol,
    value: props.baseUrlOnly ? extractHost(raw) : stripped
  };
};

/**
 * 函数：拼接完整 URL。
 * @param {'http' | 'https'} protocol URL 协议。
 * @param {string} value 协议后面的主体内容。
 * @returns {string} 完整 URL。
 */
const joinUrl = (protocol: 'http' | 'https', value: string | null): string => {
  const normalizedProtocol = protocol || 'https';
  const normalizedValue = String(value || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^\/\//, '');
  if (!normalizedValue) {
    return '';
  }

  if (props.baseUrlOnly) {
    return normalizedValue.match(/^[^/?#]+/)?.[0] ?? '';
  }

  return `${normalizedProtocol}://${normalizedValue}`;
};

/**
 * 函数：根据外部值同步内部状态。
 * @param {string} value 完整 URL。
 * @returns {void} 无返回值。
 */
const syncFromModel = (value: string): void => {
  const parsed = splitUrl(value);
  stateProtocol.value = parsed.protocol;
  stateValue.value = parsed.value;
};

/**
 * 事件：更新主体输入内容。
 * @param {string | number} value 最新输入值。
 * @returns {void} 无返回值。
 */
const handleValueInput = (value: string | number): void => {
  const parsed = splitUrl(String(value ?? ''));
  stateProtocol.value = parsed.protocol;
  stateValue.value = parsed.value;
};

watch(
  () => model.value,
  (value) => {
    syncFromModel(String(value || ''));
  },
  { immediate: true }
);

watch([stateProtocol, stateValue], () => {
  const nextValue = joinUrl(stateProtocol.value || 'https', stateValue.value);
  if (nextValue !== String(model.value || '')) {
    model.value = nextValue;
  }
});
</script>
