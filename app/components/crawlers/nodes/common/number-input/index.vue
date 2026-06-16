<template>
  <div :class="computedRootClass">
    <label v-if="computedShowPrefix" :for="id" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-l-sm border border-r-0 px-2 py-0 text-xs whitespace-nowrap">{{ prefix }}</label>
    <div :class="computedInputWrapClass">
      <UInputNumber
        :id="id"
        :model-value="modelValue"
        orientation="vertical"
        :min="min"
        :step="step"
        color="primary"
        variant="none"
        class="h-8 w-full"
        :increment="{ color: 'neutral', variant: 'soft' }"
        :decrement="{ color: 'neutral', variant: 'soft' }"
        @update:model-value="handleModelValueUpdate"
      />
    </div>
    <label :for="id" class="bg-elevated/50 border-accented text-muted flex h-8 items-center justify-center rounded-r-sm border border-l-0 px-2 py-0 text-xs whitespace-nowrap">{{ unit }}</label>
  </div>
</template>

<script setup lang="ts">
interface ICrawlersNodesCommonNumberInputProps {
  id: string;
  modelValue: number;
  min: number;
  step: number;
  prefix: string;
  unit: string;
}

const props = defineProps<ICrawlersNodesCommonNumberInputProps>();

const computedShowPrefix = computed(() => {
  const prefix = String(props.prefix ?? '').trim();

  return prefix !== '' && prefix !== '#';
});

const computedRootClass = computed(() => {
  return computedShowPrefix.value ? 'grid w-60 shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center self-center' : 'grid w-60 shrink-0 grid-cols-[minmax(0,1fr)_3rem] items-center self-center';
});

const computedInputWrapClass = computed(() => {
  return computedShowPrefix.value
    ? 'border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center border transition-colors duration-300'
    : 'border-accented focus-within:border-primary relative flex h-8 min-w-0 items-center rounded-l-sm border transition-colors duration-300';
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const handleModelValueUpdate = (value: number | null | undefined): void => {
  emit('update:modelValue', Number.isFinite(Number(value)) ? Number(value) : props.min);
};
</script>
