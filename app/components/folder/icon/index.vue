<template>
  <div class="group h-20 w-25 transition-all duration-200 ease-in">
    <div class="block h-2.5 w-7.5 rounded-t-md transition-colors duration-300 ease-in-out" :class="bgColor" />
    <div class="relative size-full rounded-md rounded-tl-none transition-colors duration-300 ease-in-out perspective-[75px]" :class="bgColor">
      <div class="absolute bottom-[10%] left-1/2 h-[80%] w-[70%] -translate-x-1/2 translate-y-[10%] rounded-md bg-neutral-200 transition-all duration-300 ease-in-out group-hover:translate-y-0" />
      <div class="absolute bottom-[10%] left-1/2 h-[70%] w-[80%] -translate-x-1/2 translate-y-[10%] rounded-md bg-neutral-100 transition-all duration-300 ease-in-out group-hover:translate-y-0" />
      <div class="absolute bottom-[10%] left-1/2 h-[60%] w-[90%] -translate-x-1/2 translate-y-[10%] rounded-md bg-neutral-50 transition-all duration-300 ease-in-out group-hover:translate-y-0" />
      <div class="absolute inset-0 flex origin-bottom items-center justify-center rounded-md transition-all duration-300 ease-in-out group-hover:scale-y-[0.6] group-hover:rotate-x-[-15deg]" :class="fgColor">
        <UIcon :name="iconName" class="text-primary-300/60 size-12 transition-colors duration-300 ease-in-out" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFolderIconProps } from '@/components/folder/icon/index.types';

/**
 * 属性
 */
const { bgColor = 'bg-primary-500', fgColor = 'bg-primary-400' } = defineProps<IFolderIconProps>();
</script>
