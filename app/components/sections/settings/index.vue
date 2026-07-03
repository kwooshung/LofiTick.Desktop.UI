<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h2 class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.general.title') }}</h2>
          <p class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.general.description') }}</p>
        </div>
      </template>
    </UPageCard>

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
          :icon="computedLocaleIcon"
          :items="
            computedLocalesUnique.map((l) => ({
              icon: settingsLocaleIconGet(l.code),
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
        <UButton color="neutral" variant="outline" icon="i-lucide:folder-open" :ui="{ leadingIcon: 'text-muted' }" @click="handleOpenAppDirectory">{{ t('pages.settings.general.appDirectory.open') }}</UButton>
      </UFormField>
      <UFormField :label="t('pages.settings.general.userDataDirectory.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.general.userDataDirectory.description') }}</div>
            <ULink v-if="stateUserDataDirectoryPath" raw class="text-muted hover:text-primary inline-flex max-w-full cursor-pointer align-middle font-normal break-all whitespace-normal no-underline hover:underline" @click="handleOpenUserDataDirectory">
              {{ stateUserDataDirectoryPath }}
            </ULink>
            <span v-else class="text-error">{{ t('pages.settings.general.userDataDirectory.unset') }}</span>
          </div>
        </template>
        <UButton color="neutral" variant="outline" icon="i-lucide:folder-open" :ui="{ leadingIcon: 'text-muted' }" @click="handleOpenUserDataDirectory">{{ t('pages.settings.general.userDataDirectory.open') }}</UButton>
      </UFormField>
      <UFormField v-if="stateIsMounted" :label="t('pages.settings.general.storage.label')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.general.storage.description') }}</div>
            <span v-if="stateStoragePath">
              <ULink raw class="text-muted hover:text-primary inline-flex max-w-full cursor-pointer align-middle font-normal break-all whitespace-normal no-underline hover:underline" @click="handleOpenStorage">
                {{ stateStoragePath }}
              </ULink>
            </span>
            <span v-else class="text-error">{{ t('pages.settings.general.storage.unset') }}</span>
          </div>
        </template>
        <div class="flex items-center gap-2">
          <UButton :color="stateSelectingStorage ? 'primary' : 'neutral'" variant="outline" icon="i-lucide:folder-search" :ui="{ leadingIcon: 'text-muted' }" :loading="stateSelectingStorage" @click="handleSelectStorage">
            {{ stateStoragePath ? t('pages.settings.general.storage.reselect') : t('pages.settings.general.storage.choose') }}
          </UButton>
        </div>
      </UFormField>
      <UFormField :label="t('pages.settings.general.devtools.label')" :description="t('pages.settings.general.devtools.description')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <UButton color="neutral" variant="outline" icon="i-lucide:bug" :ui="{ leadingIcon: 'text-muted' }" @click="handleToggleDevtools">{{ t('pages.settings.general.devtools.toggle') }}</UButton>
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
 * Hook：提示消息。
 */
const toast = useToast();

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
    label: t('pages.settings.general.title'),
    icon: 'i-lucide:settings',
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
 * 状态：用户数据目录路径。
 */
const stateUserDataDirectoryPath = ref('');

/**
 * 状态：用户数据目录是否存在。
 */
const stateUserDataDirectoryExists = ref(false);

/**
 * 状态：是否正在选择数据存放目录。
 */
const stateSelectingStorage = ref(false);

/**
 * 状态：记忆窗口状态（始终写入窗口状态；该值仅控制启动时是否恢复）
 */
const stateRememberWindowStateValue = ref(true);

/**
 * 状态：设置项是否已完成首轮加载
 */
const stateSettingsHydrated = ref(false);

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
 * 函数：按 locale 获取国旗图标
 * @param {string} code locale 代码
 * @returns {string} 图标名
 */
const settingsLocaleIconGet = (code: string): string => {
  /**
   * 常量：normalized。
   */
  const normalized = code.trim().toLowerCase().replace(/_/g, '-');

  if (normalized === 'zh-cn') {
    return 'i-flag-cn-4x3';
  }

  if (normalized === 'zh-tw') {
    return 'i-flag-tw-4x3';
  }

  if (normalized === 'ja') {
    return 'i-flag-jp-4x3';
  }

  return 'i-flag-us-4x3';
};

/**
 * 计算属性：当前 locale 图标
 */
const computedLocaleIcon = computed(() => settingsLocaleIconGet(locale.value));

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

    /**
     * 常量：result。
     */
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
  if (!isTauriRuntime.value || !stateUserDataDirectoryPath.value) {
    return;
  }

  if (!stateUserDataDirectoryExists.value) {
    toast.add({
      title: t('pages.settings.general.userDataDirectory.notExists'),
      color: 'error'
    });
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

  /**
   * 常量：conf。
   */
  const conf = await tauriSettings.get();

  if (!conf) {
    return;
  }

  stateStoragePath.value = String(conf.attachmentsDir || '');

  /**
   * 常量：userDataDirectory。
   */
  const userDataDirectory = await tauriWindow.userDataDirectoryGet();
  stateUserDataDirectoryPath.value = userDataDirectory.directoryPath;
  stateUserDataDirectoryExists.value = userDataDirectory.exists;

  /**
   * 常量：windowSetting。
   */
  const windowSetting = conf.window;
  if (windowSetting && typeof windowSetting === 'object' && !Array.isArray(windowSetting)) {
    /**
     * 常量：src。
     */
    const src = windowSetting as Record<string, unknown>;
    stateCloseBehaviorValue.value = String(src.closeBehaviors || 'unset');
    stateRememberWindowStateValue.value = Boolean(src.remember);
  }

  stateSettingsHydrated.value = true;
};

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  stateIsMounted.value = true;

  await loadSettings();
});
</script>

<style>
::-ms-reveal {
  display: none;
}
</style>
