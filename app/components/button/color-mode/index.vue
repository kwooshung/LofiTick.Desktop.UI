<template>
  <div class="group dark:hover:bg-accented hover:bg-elevated flex h-7.5 w-11.25 items-center justify-center transition-colors duration-300" @click="handleClick">
    <UIcon :name="iconName" class="transition-transform duration-300" />
  </div>
</template>

<script setup lang="ts">
/**
 * Hook：主题模式
 */
const colorMode = useColorMode();

/**
 * Hook：设置主题模式
 */
const { themeModeCycle } = useSettingsThemeMode();

/**
 * 常量：主题模式图标映射（使用完整 token，避免运行时字符串拼接影响打包优化）
 */
const themeModeIconMap = {
  system: 'i-material-symbols:desktop-windows-outline',
  dark: 'i-material-symbols:moon-stars-outline-rounded',
  light: 'i-material-symbols:sunny-outline-rounded'
} as const;

/**
 * 计算属性：图标名称
 */
const iconName = computed(() => {
  /**
   * 常量：pref。
   */
  const pref = (colorMode.preference ?? 'system') as string;

  // 仅接受已显式声明的模式；其它值一律回退 system
  if (pref in themeModeIconMap) {
    return themeModeIconMap[pref as keyof typeof themeModeIconMap];
  }

  return themeModeIconMap.system;
});

/**
 * 事件：按钮点击
 * @param {MouseEvent} event 鼠标事件
 */
const handleClick = async (event: MouseEvent) => {
  /**
   * 常量：el。
   */
  const el = event.currentTarget as HTMLElement | null;
  await themeModeCycle(el);
};
</script>
