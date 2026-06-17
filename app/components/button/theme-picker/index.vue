<template>
  <USlideover v-model:open="stateVisable" :title="t('pages.settings.ui.title')" :description="t('pages.settings.ui.description')" :overlay="false" direction="right" :ui="{ content: 'no-drag' }">
    <div class="group dark:hover:bg-accented hover:bg-elevated flex h-10 w-12 items-center justify-center text-[15px] transition-colors duration-300">
      <UIcon name="i-codicon:symbol-color" class="transition-transform duration-300" />
    </div>
    <template #body>
      <UPageCard :title="t('pages.settings.ui.colorMode.label')" :description="t('pages.settings.ui.colorMode.description')" variant="naked">
        <div class="mb-5 grid grid-cols-3 gap-3">
          <ButtonSettingColors v-for="m in colorModesOptions" :key="m.value" size="lg" v-bind="m" :selected="colorMode.preference === m.value" @click="(e: MouseEvent) => onClickColorModeButton(m.value, e)" />
        </div>
      </UPageCard>

      <UPageCard :title="t('pages.settings.ui.primary.label')" :description="t('pages.settings.ui.primary.description')" variant="naked">
        <div class="mb-5 grid grid-cols-3 gap-3">
          <ButtonSettingColors v-for="color in primaryColors" :key="color" size="lg" :label="t(`pages.settings.ui.primary.colors.${color}`)" :chip="color" :selected="!appConfig.theme.blackAsPrimary && computedPrimary === color" @click="handleSetPrimaryColor(color)" />
        </div>
      </UPageCard>

      <UPageCard :title="t('pages.settings.ui.neutral.label')" :description="t('pages.settings.ui.neutral.description')" variant="naked">
        <div class="mb-5 grid grid-cols-3 gap-3">
          <ButtonSettingColors v-for="color in neutralColors" :key="color" size="lg" :label="t(`pages.settings.ui.neutral.colors.${color}`)" :chip="color === 'neutral' ? 'old-neutral' : color" :selected="computedNeutral === color" @click="handleSetNeutralColor(color)" />
        </div>
      </UPageCard>

      <UPageCard :title="t('pages.settings.ui.radius.label')" :description="t('pages.settings.ui.radius.description')" variant="naked">
        <div class="mb-5 grid grid-cols-5 gap-3">
          <ButtonSettingColors v-for="r in radiuses" :key="r" size="lg" :label="String(r)" class="justify-center px-0" :selected="computedRadius === r" @click="handleSetRadius(r)" />
        </div>
      </UPageCard>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：应用配置
 */
const appConfig = useAppConfig();

/**
 * 状态：可见性
 */
const stateVisable = ref(false);

/**
 * 常量：颜色模式：选项
 */
const colorModesOptions = [
  { icon: appConfig.ui.icons.system, label: t('pages.settings.ui.colorMode.options.system'), value: 'system' },
  { icon: appConfig.ui.icons.light, label: t('pages.settings.ui.colorMode.options.light'), value: 'light' },
  { icon: appConfig.ui.icons.dark, label: t('pages.settings.ui.colorMode.options.dark'), value: 'dark' }
];

/**
 * Hook：颜色模式
 */
const colorMode = useColorMode();

/**
 * Hook：设置主题模式
 */
const { themeModeSet } = useSettingsThemeMode();

/**
 * 颜色模式：按钮点击
 * @param {string} mode 颜色模式
 * @param {MouseEvent} event 鼠标事件
 */
const onClickColorModeButton = async (mode: string, event: MouseEvent) => {
  const el = event.currentTarget as HTMLElement | null;
  await themeModeSet(mode as TSettingsThemeMode, el);
};

/**
 * Hook：主题外观设置
 */
const { neutralColors, primaryColors, radiuses, computedNeutral, computedPrimary, computedRadius, handleSetNeutralColor, handleSetPrimaryColor, handleSetRadius } = useSettingsThemeStyle();
</script>
