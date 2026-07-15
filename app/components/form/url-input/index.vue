<template>
  <UFieldGroup class="w-full">
    <USelect v-model="stateProtocol" :items="computedProtocolOptions" value-attribute="value" option-attribute="label" :disabled="props.readonly || props.disabled" :class="props.protocolSelectClass" />

    <UInput :model-value="stateValue" class="w-full" :placeholder="computedInputPlaceholder" :readonly="props.readonly" :disabled="props.disabled" :ui="slots.actions ? { trailing: 'pe-1' } : undefined" @update:model-value="handleValueInput" @blur="handleInputBlur">
      <template v-if="slots.actions" #trailing>
        <div class="flex items-center gap-0.5">
          <slot name="actions" />
        </div>
      </template>
    </UInput>
  </UFieldGroup>
</template>

<script setup lang="ts">
import type { IFormUrlInputProps, IFormUrlInputProtocolOption, IFormUrlInputSplitResult, TFormUrlInputProtocol } from '@/components/form/url-input/index.types';

/**
 * 属性：URL 输入组件。
 * @type {IFormUrlInputProps}
 */
/**
 * Props：组件入参。
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
const stateProtocol = ref<TFormUrlInputProtocol>('https');

/**
 * 状态：当前主体内容。
 */
const stateValue = ref<string>('');

/**
 * 计算属性：协议选项。
 */
const computedProtocolOptions = computed<IFormUrlInputProtocolOption[]>(() => [
  { label: 'https://', value: 'https' },
  { label: 'http://', value: 'http' },
  { label: 'wss://', value: 'wss' },
  { label: 'ws://', value: 'ws' }
]);

/**
 * 计算属性：输入框占位文本。
 */
const computedInputPlaceholder = computed(() => {
  /**
   * 常量：placeholder。
   */
  const placeholder = String(props.placeholder || '').trim();

  if (!placeholder) {
    return '';
  }

  if (/^(https?|wss?):\/\//i.test(placeholder)) {
    return splitUrl(placeholder).value;
  }

  return placeholder;
});

/**
 * 函数：拆分完整 URL。
 * @param {string} url 完整 URL。
 * @returns {IFormUrlInputSplitResult} 协议与主体内容。
 */
const splitUrl = (url: string): IFormUrlInputSplitResult => {
  /**
   * 常量：raw。
   */
  const raw = String(url || '').trim();
  if (!raw) {
    return { protocol: 'https', value: '' };
  }

  let protocol: TFormUrlInputProtocol = 'https';
  let body: string = raw;
  const matched = raw.match(/^(https?|wss?):\/\//i);

  if (matched?.[1]) {
    protocol = matched[1].toLowerCase() as TFormUrlInputProtocol;
    body = raw.slice(matched[0].length);
  }

  if (props.baseUrlOnly) {
    /**
     * 常量：matchResult。
     */
    const matchResult = body.match(/^[^/?#]+/);
    body = matchResult ? matchResult[0] : body;
  }

  return { protocol, value: body };
};

/**
 * 函数：拼接完整 URL。
 * @param {TFormUrlInputProtocol} protocol URL 协议。
 * @param {string} value 协议后面的主体内容。
 * @returns {string} 完整 URL。
 */
const joinUrl = (protocol: TFormUrlInputProtocol, value: string): string => {
  /**
   * 函数：normalizedValue。
   */
  const normalizedValue = String(value || '')
    .trim()
    .replace(/^(https?|wss?):\/\//i, '');
  if (!normalizedValue) {
    return '';
  }

  if (props.baseUrlOnly) {
    /**
     * 常量：matchResult。
     */
    const matchResult = normalizedValue.match(/^[^/?#]+/);
    const host = matchResult ? matchResult[0] : normalizedValue;

    return `${protocol}://${host}`;
  }

  return `${protocol}://${normalizedValue}`;
};

/**
 * 函数：根据外部值同步内部状态。
 * @param {string} value 外部传入的值。
 * @returns {void} 无返回值。
 */
const syncFromModel = (value: string): void => {
  /**
   * 函数：parsed。
   */
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
  /**
   * 函数：parsed。
   */
  const parsed = splitUrl(String(value ?? ''));
  stateProtocol.value = parsed.protocol;

  if (props.baseUrlOnly && parsed.value === stateValue.value) {
    /**
     * 常量：temp。
     */
    const temp = stateValue.value;
    stateValue.value = '';
    nextTick(() => {
      stateValue.value = temp;
    });
  } else {
    stateValue.value = parsed.value;
  }
};

/**
 * 事件：handleInputBlur。
 */
const handleInputBlur = (): void => {
  if (!props.baseUrlOnly) {
    return;
  }
  /**
   * 函数：parsed。
   */
  const parsed = splitUrl(joinUrl(stateProtocol.value, stateValue.value));
  if (parsed.value !== stateValue.value) {
    stateValue.value = parsed.value;
  }
};

watch(
  () => model.value,
  (value) => {
    syncFromModel(String(value || ''));
  },
  { immediate: true }
);

watch([stateProtocol, stateValue], () => {
  /**
   * 常量：nextValue。
   */
  const nextValue = joinUrl(stateProtocol.value, stateValue.value);
  if (nextValue !== String(model.value || '')) {
    model.value = nextValue;
  }
});
</script>
