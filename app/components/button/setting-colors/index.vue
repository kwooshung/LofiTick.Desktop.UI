<template>
  <UButton :size color="neutral" variant="outline" :icon="icon" :label="label" class="ring-default rounded-sm capitalize" :class="[selected ? 'bg-elevated' : 'hover:bg-elevated/50']">
    <template v-if="chip || !!slots.leading" #leading>
      <slot name="leading">
        <span class="inline-block size-2 rounded-full" :class="`bg-${chip}-500 dark:bg-${chip}-400`" />
      </slot>
    </template>
  </UButton>
</template>

<script setup lang="ts">
import type { IButtonSettingColorsProps } from '@/components/button/setting-colors/index.types';

/**
 * 属性
 */
withDefaults(defineProps<IButtonSettingColorsProps>(), {
  size: 'sm'
});

/**
 * 插槽：leading
 */
const slots = defineSlots<{
  leading: () => unknown;
}>();
</script>
