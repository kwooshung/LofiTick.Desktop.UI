<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.ui.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.ui.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-10', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.ui.colorMode.label')" :description="t('pages.settings.ui.colorMode.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <div v-if="stateIsMounted" class="grid grid-cols-3 gap-3">
          <ButtonSettingColors v-for="m in colorModesOptions" :key="m.value" size="lg" v-bind="m" :selected="colorMode.preference === m.value" @click="(e: MouseEvent) => onClickColorModeButton(m.value, e)" />
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard :title="t('pages.settings.ui.primary.label')" :description="t('pages.settings.ui.primary.description')" variant="naked">
      <div v-if="stateIsMounted" class="mb-5 grid grid-cols-6 gap-3">
        <ButtonSettingColors v-for="color in primaryColors" :key="color" size="lg" :label="t(`pages.settings.ui.primary.colors.${color}`)" :chip="color" :selected="!appConfig.theme.blackAsPrimary && computedPrimary === color" @click="handleSetPrimaryColor(color)" />
      </div>
    </UPageCard>

    <UPageCard :title="t('pages.settings.ui.neutral.label')" :description="t('pages.settings.ui.neutral.description')" variant="naked">
      <div v-if="stateIsMounted" class="mb-5 grid grid-cols-6 gap-3">
        <ButtonSettingColors v-for="color in neutralColors" :key="color" size="lg" :label="t(`pages.settings.ui.neutral.colors.${color}`)" :chip="color === 'neutral' ? 'old-neutral' : color" :selected="computedNeutral === color" @click="handleSetNeutralColor(color)" />
      </div>
    </UPageCard>

    <UPageCard :title="t('pages.settings.ui.radius.label')" :description="t('pages.settings.ui.radius.description')" variant="naked">
      <div v-if="stateIsMounted" class="mb-5 grid grid-cols-5 gap-3">
        <ButtonSettingColors v-for="r in radiuses" :key="r" size="lg" :label="String(r)" class="justify-center px-0" :selected="computedRadius === r" @click="handleSetRadius(r)" />
      </div>
    </UPageCard>
  </DashboardPage>
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
 * 状态：组件是否挂载完成
 */
const stateIsMounted = ref(false);

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 设置面包屑导航状态
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-lucide:layout-dashboard',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-lucide:settings',
    to: localePath('/settings'),
    exact: true
  },
  {
    label: t('pages.settings.ui.title'),
    icon: 'i-lucide:brush-cleaning',
    to: localePath('/settings/ui')
  }
];

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
  /**
   * 常量：el。
   */
  const el = event.currentTarget as HTMLElement | null;
  await themeModeSet(mode as TSettingsThemeMode, el);
};

/**
 * Hook：主题外观设置
 */
const { neutralColors, primaryColors, radiuses, computedNeutral, computedPrimary, computedRadius, handleSetNeutralColor, handleSetPrimaryColor, handleSetRadius } = useSettingsThemeStyle();

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  stateIsMounted.value = true;
});
</script>
