<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex items-center gap-2">
      <UCheckbox />
      <span class="text-sm">启用托盘图标</span>
    </div>
    <div class="flex items-center gap-2">
      <UCheckbox />
      <span class="text-sm">开机启动</span>
    </div>
    <div class="flex items-center gap-2">
      <UCheckbox />
      <span class="text-sm">显示应用菜单</span>
    </div>
    <div class="flex items-center gap-2">
      <UCheckbox />
      <span class="text-sm">显示窗口菜单</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关键配置：禁用所有布局
definePageMeta({
  layout: false
});
</script>
