<template>
  <DashboardPage>
    <UPageCard :title="t('pages.settings.power.title')" :description="t('pages.settings.power.description')" variant="naked" />

    <UPageCard variant="outline" :ui="{ root: 'mb-10', container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.power.startup.enabled.label')" :description="t('pages.settings.power.startup.enabled.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USwitch v-model="stateStartupEnabledValue" :loading="stateStartupEnabledLoading" @update:model-value="handleChangeStartupEnabled" />
      </UFormField>

      <UFormField :label="t('pages.settings.power.system.label')" :description="t('pages.settings.power.system.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USelect
          v-model="storePower.states.policy.system"
          :icon="computedSystemIcon"
          :items="
            powerOptions.map((p) => ({
              icon: p.icon,
              label: p.label,
              value: p.value
            })) as SelectItem[]
          "
          class="w-46"
        />
      </UFormField>

      <UFormField :label="t('pages.settings.power.display.label')" :description="t('pages.settings.power.display.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USelect
          v-model="storePower.states.policy.display"
          :icon="computedDisplayIcon"
          :items="
            powerOptions.map((p) => ({
              icon: p.icon,
              label: p.label,
              value: p.value
            })) as SelectItem[]
          "
          class="w-46"
        />
      </UFormField>
    </UPageCard>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：Tauri 设置
 */
const tauriSettings = useTauriSettings();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Store：电源策略
 */
const storePower = useStorePower();

/**
 * 状态：开机自启（startup.enabled）
 */
const stateStartupEnabledValue = ref(false);

/**
 * 状态：开机自启设置加载态
 */
const stateStartupEnabledLoading = ref(false);

/**
 * Hook：本地化路由
 */
const localePath = useLocalePath();

/**
 * 设置面包屑导航状态
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-mdi:view-dashboard-outline',
    to: localePath('/'),
    exact: true
  },
  {
    label: t('pages.settings.title'),
    icon: 'i-proicons:settings',
    to: localePath('/settings'),
    exact: true
  },
  {
    label: t('pages.settings.power.title'),
    icon: 'i-carbon:flash',
    to: localePath('/settings/power')
  }
];

/**
 * 选项：阻止休眠
 */
const powerOptions = [
  { icon: 'i-mdi:sleep', label: t('pages.settings.power.options.never'), value: 'never' },
  { icon: 'i-mdi:sleep-off', label: t('pages.settings.power.options.always'), value: 'always' },
  { icon: 'i-mdi:spider-outline', label: t('pages.settings.power.options.crawling'), value: 'crawling' },
  { icon: 'i-lucide:play', label: t('pages.settings.power.options.playing'), value: 'playing' }
];

/**
 * 计算属性：系统休眠 Icon
 */
const computedSystemIcon = computed(() => {
  const option = powerOptions.find((o) => o.value === storePower.states.policy.system);
  return option ? option.icon : 'i-mdi:sleep';
});

/**
 * 计算属性：显示器休眠 Icon
 */
const computedDisplayIcon = computed(() => {
  const option = powerOptions.find((o) => o.value === storePower.states.policy.display);
  return option ? option.icon : 'i-mdi:sleep';
});

/**
 * 函数：加载并填充开机自启设置
 * @returns {Promise<void>} 无返回值
 */
const loadStartupEnabled = async (): Promise<void> => {
  stateStartupEnabledLoading.value = true;

  try {
    const conf = await tauriSettings.get();

    if (!conf) {
      return;
    }

    const startup = conf.startup;
    if (startup && typeof startup === 'object' && !Array.isArray(startup)) {
      stateStartupEnabledValue.value = Boolean((startup as Record<string, unknown>).enabled);
    }
  } catch {
    // ignore
  } finally {
    stateStartupEnabledLoading.value = false;
  }
};

/**
 * 事件：开机自启开关变更
 * @param {boolean} on 是否开启
 * @returns {Promise<void>} 无返回值
 */
const handleChangeStartupEnabled = async (on: boolean): Promise<void> => {
  if (stateStartupEnabledLoading.value) {
    return;
  }

  stateStartupEnabledLoading.value = true;

  try {
    await tauriSettings.update({ startup: { enabled: on } });
  } catch {
    // 更新失败则回滚 UI 状态
    stateStartupEnabledValue.value = !on;
  } finally {
    stateStartupEnabledLoading.value = false;
  }
};

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  await loadStartupEnabled();
});
</script>
