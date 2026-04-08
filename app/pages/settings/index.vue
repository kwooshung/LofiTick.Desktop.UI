<template>
  <DashboardPage>
    <UPageCard :title="t('pages.settings.general.title')" :description="t('pages.settings.general.description')" variant="naked" />

    <UPageCard variant="outline" :ui="{ container: 'divide-y divide-default' }">
      <UFormField :label="t('pages.settings.general.closeBehavior.label')" :description="t('pages.settings.general.closeBehavior.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USelect v-model="stateCloseBehaviorValue" :items="closeBehaviorSelectOptions" class="w-56" value-attribute="value" option-attribute="label" @update:model-value="handleChangeCloseBehavior" />
      </UFormField>
      <UFormField
        :label="t('pages.settings.general.language.label')"
        :description="t('pages.settings.general.language.description', computedLocalesUnique.length)"
        :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <USelect
          :model-value="locale"
          :icon="computedLanguageIcon"
          :items="
            computedLocalesUnique.map((l) => ({
              icon: l.icon,
              label: l.name,
              value: l.code
            })) as SelectItem[]
          "
          class="w-46"
          @update:model-value="handleChangeLanguage"
        />
      </UFormField>
      <UFormField :label="t('pages.settings.general.rememberWindowState.label')" :description="t('pages.settings.general.rememberWindowState.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <USwitch v-model="stateRememberWindowStateValue" @update:model-value="handleChangeRememberWindowState" />
      </UFormField>
      <UFormField :label="t('pages.settings.general.appDirectory.label')" :description="t('pages.settings.general.appDirectory.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <UButton color="neutral" variant="outline" @click="handleOpenAppDirectory">{{ t('pages.settings.general.appDirectory.open') }}</UButton>
      </UFormField>
      <UFormField :label="t('pages.settings.general.userDataDirectory.label')" :description="t('pages.settings.general.userDataDirectory.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <UButton color="neutral" variant="outline" @click="handleOpenUserDataDirectory">{{ t('pages.settings.general.userDataDirectory.open') }}</UButton>
      </UFormField>
      <UFormField v-if="stateIsMounted" :label="t('pages.settings.general.storage.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            {{ t('pages.settings.general.storage.description') }}
            <span v-if="stateStoragePath">
              <UTooltip :text="stateStoragePath" :content="{ side: 'top' }" :disabled="stateStoragePath === computedTruncatedStorage">
                <ULink class="align-middle hover:cursor-pointer" @click.prevent="handleOpenStorage">{{ computedTruncatedStorage }}</ULink>
              </UTooltip>
            </span>
            <span v-else class="text-error">{{ t('pages.settings.general.storage.unset') }}</span>
          </div>
        </template>
        <div class="flex items-center gap-2">
          <UButton :color="stateSelectingStorage ? 'primary' : 'neutral'" variant="outline" :loading="stateSelectingStorage" @click="handleSelectStorage">
            {{ stateStoragePath ? t('pages.settings.general.storage.reselect') : t('pages.settings.general.storage.choose') }}
          </UButton>
        </div>
      </UFormField>
      <UFormField :label="t('pages.settings.general.devtools.label')" :description="t('pages.settings.general.devtools.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <UButton color="neutral" variant="outline" @click="handleToggleDevtools">{{ t('pages.settings.general.devtools.toggle') }}</UButton>
      </UFormField>
    </UPageCard>
  </DashboardPage>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui/runtime/types/index.js';

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置
 */
const tauriSettings = useTauriSettings();

/**
 * Hook：Tauri 窗口能力
 */
const tauriWindow = useTauriWindow();

/**
 * 状态：组件是否挂载完成
 */
const stateIsMounted = ref(false);

/**
 * Hook：i18n
 */
const { t, locale, locales, setLocale } = useI18n();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 函数：本地化路由
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
    label: t('pages.settings.general.title'),
    icon: 'i-proicons:settings',
    to: localePath('/settings')
  }
];

/**
 * 关闭行为：选项（使用对象数组：label/value）
 */
const closeBehaviorSelectOptions = [
  { label: t('pages.settings.general.closeBehavior.options.unset'), value: 'unset' },
  { label: t('pages.settings.general.closeBehavior.options.minimizeToTray'), value: 'minimize-to-tray' },
  { label: t('pages.settings.general.closeBehavior.options.exit'), value: 'exit' }
];

/**
 * 状态：关闭行为（general.closeBehavior）
 */
const stateCloseBehaviorValue = ref('unset');

/**
 * 状态：数据存放路径（general.storage）
 */
const stateStoragePath = ref('');

/**
 * 状态：截断显示的存放路径
 */
const stateSelectingStorage = ref(false);

/**
 * 状态：记忆窗口状态（始终写入窗口状态；该值仅控制启动时是否恢复）
 */
const stateRememberWindowStateValue = ref(true);

/**
 * 计算属性：语言列表（去重）
 * 描述：避免 i18n 运行时 locales 出现重复项导致下拉重复
 */
const computedLocalesUnique = computed(() => {
  /**
   * 常量：按语言 code 去重
   */
  const map = new Map<string, (typeof locales.value)[number]>();

  for (const item of locales.value) {
    if (!item || typeof item.code !== 'string') {
      continue;
    }

    if (!map.has(item.code)) {
      map.set(item.code, item);
    }
  }

  return Array.from(map.values());
});

/**
 * 计算属性：语言图标
 */
const computedLanguageIcon = computed(() => String(computedLocalesUnique.value.find((l) => l.code === locale.value)?.icon || ''));

/**
 * 计算属性：截断显示的存放路径
 */
const computedTruncatedStorage = computed(() => {
  const p = stateStoragePath.value;

  if (!p) {
    return '';
  }

  if (p.length <= 56) {
    return p;
  }

  return `${p.slice(0, 24)} … ${p.slice(-20)}`;
});

/**
 * 事件：选择数据存放目录
 */
const handleSelectStorage = async (): Promise<void> => {
  if (stateSelectingStorage.value) {
    return;
  }

  stateSelectingStorage.value = true;
  try {
    if (!isTauriRuntime.value) {
      return;
    }

    const result = await tauriSettings.setAttachmentsDir(t('pages.settings.general.storage.dialogTitle'), stateStoragePath.value);

    if (result) {
      stateStoragePath.value = result;
    }
  } catch {
    // ignore
  } finally {
    stateSelectingStorage.value = false;
  }
};

/**
 * 事件：打开数据存放目录
 */
const handleOpenStorage = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriWindow.openDirectory(stateStoragePath.value);
};

/**
 * 事件：打开应用目录
 */
const handleOpenAppDirectory = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriWindow.openAppDirectory();
};

/**
 * 事件：打开用户目录（userData）
 */
const handleOpenUserDataDirectory = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriWindow.openUserDataDirectory();
};

/**
 * 事件：关闭行为变更
 */
const handleChangeCloseBehavior = async (val: string): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriSettings.update({ window: { closeBehaviors: val as TSettingsCloseBehavior } });
};

/**
 * 事件：记忆窗口状态变更
 */
const handleChangeRememberWindowState = async (on: boolean): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriSettings.update({ window: { remember: on } });
};

/**
 * 事件：语言变更
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleChangeLanguage = async (val: any): Promise<void> => {
  setLocale(val);
};

/**
 * 事件：切换 DevTools
 */
const handleToggleDevtools = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriWindow.toggleDevtools();
};

/**
 * 函数：加载并填充设置。
 */
const loadSettings = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  const conf = await tauriSettings.get();

  if (!conf) {
    return;
  }

  stateStoragePath.value = String(conf.attachmentsDir || '');

  const windowSetting = conf.window;
  if (windowSetting && typeof windowSetting === 'object' && !Array.isArray(windowSetting)) {
    const src = windowSetting as Record<string, unknown>;
    stateCloseBehaviorValue.value = String(src.closeBehaviors || 'unset');
    stateRememberWindowStateValue.value = Boolean(src.remember);
  }
};

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  stateIsMounted.value = true;

  await loadSettings();
});
</script>
