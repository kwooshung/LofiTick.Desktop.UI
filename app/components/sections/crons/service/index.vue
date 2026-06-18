<template>
  <DashboardPage>
    <UPageCard :title="t('pages.settings.cron.serverShortcut.title')" :description="t('pages.settings.cron.serverShortcut.description')" variant="naked" />

    <div class="space-y-6 pb-6">
      <UPageCard variant="outline" :ui="{ root: 'rounded-lg', container: 'divide-y divide-default' }">
        <UFormField
          :label="t('pages.settings.cron.serverShortcut.fields.serverTaskLabel')"
          :description="t('pages.settings.cron.serverShortcut.heroDescription')"
          :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
          class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] xl:items-center"
        >
          <div class="flex w-full min-w-0 flex-wrap items-center justify-end gap-2">
            <UBadge color="primary" variant="soft">{{ t('pages.settings.cron.tabs.server') }}</UBadge>
            <UBadge color="neutral" variant="outline">1Panel</UBadge>
          </div>
        </UFormField>

        <UFormField
          :label="t('pages.settings.cron.serverShortcut.fields.realCronLabel')"
          :description="t('pages.settings.cron.serverShortcut.fields.realCronDescription')"
          :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
          class="grid gap-3 not-last:pb-4 xl:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] xl:items-center"
        >
          <div class="flex w-full min-w-0 flex-wrap items-center justify-end gap-2">
            <ULink raw :href="computedCronjobsUrl" class="bg-primary text-inverted hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors" @click.prevent="handleOpenExternal(computedCronjobsUrl)">
              <UIcon name="i-lucide:arrow-up-right" class="size-4 shrink-0" />
              {{ t('pages.settings.cron.serverShortcut.actions.openCronjobs') }}
            </ULink>
            <ULink raw :href="computedLibraryUrl" class="border-default text-highlighted hover:bg-elevated inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors" @click.prevent="handleOpenExternal(computedLibraryUrl)">
              <UIcon name="i-lucide:library" class="size-4 shrink-0" />
              {{ t('pages.settings.cron.serverShortcut.actions.openScriptLibrary') }}
            </ULink>
          </div>
        </UFormField>

        <UFormField
          :label="t('pages.settings.cron.serverShortcut.fields.panelBaseLabel')"
          :description="t('pages.settings.cron.serverShortcut.fields.panelBaseDescription')"
          :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }"
          class="grid gap-3 xl:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] xl:items-center"
        >
          <div class="flex w-full min-w-0 flex-col items-stretch gap-2 justify-self-end xl:items-end">
            <div class="text-highlighted w-full text-sm leading-6 break-all xl:max-w-4xl xl:text-right">{{ computedPanelBase }}</div>

            <div class="flex flex-wrap items-center justify-end gap-2">
              <ULink raw :to="localePath('/settings/connections')" class="bg-elevated text-highlighted hover:bg-elevated/80 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors">
                <UIcon name="i-lucide:settings-2" class="size-4 shrink-0" />
                {{ t('pages.settings.cron.serverShortcut.actions.openConnections') }}
              </ULink>
            </div>
          </div>
        </UFormField>
      </UPageCard>

      <section class="grid items-start gap-8 pt-8 xl:grid-cols-[14rem_minmax(0,1fr)] xl:pt-10">
        <aside class="space-y-8 pb-8 xl:sticky xl:top-6 xl:pb-10">
          <div class="space-y-3">
            <div class="text-muted text-[11px] tracking-[0.18em] uppercase">{{ t('pages.settings.cron.serverShortcut.quickEntriesTitle') }}</div>

            <div class="space-y-2">
              <ULink
                v-for="link in computedQuickLinks"
                :key="`${link.label}-summary`"
                raw
                :href="link.href"
                class="border-default hover:border-primary/45 hover:bg-elevated/35 group flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
                @click.prevent="handleOpenExternal(link.href)"
              >
                <div class="min-w-0">
                  <div class="text-highlighted text-sm font-medium">{{ link.label }}</div>
                  <div class="text-muted mt-1 truncate text-xs">{{ link.href }}</div>
                </div>

                <UIcon name="i-lucide:arrow-up-right" class="text-muted group-hover:text-highlighted size-4 shrink-0 transition-colors" />
              </ULink>
            </div>
          </div>
        </aside>

        <div class="min-w-0 space-y-6">
          <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-end gap-3 px-0 py-0' }">
            <template #header>
              <div class="min-w-0 flex-1">
                <div class="text-highlighted text-base font-semibold text-pretty">{{ t('pages.settings.cron.serverShortcut.atlas.title') }}</div>
                <div class="text-muted mt-1 text-[15px] text-pretty">{{ t('pages.settings.cron.serverShortcut.atlas.description') }}</div>
              </div>

              <div class="text-muted hidden text-xs tracking-[0.16em] uppercase sm:block">{{ t('pages.settings.cron.serverShortcut.atlas.total', { count: computedLinkTotal }) }}</div>
            </template>
          </UPageCard>

          <div class="space-y-10">
            <template v-for="section in computedAtlasSections" :key="section.title">
              <section class="space-y-5">
                <div class="grid gap-5 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-8">
                  <div class="space-y-2">
                    <div class="text-highlighted text-lg font-semibold">{{ section.title }}</div>
                    <p v-if="section.description" class="text-muted text-sm leading-6">
                      {{ section.description }}
                    </p>
                  </div>

                  <div class="space-y-4">
                    <div v-for="group in section.groups" :key="`${section.title}-${group.title}`" class="min-w-0 space-y-2.5">
                      <div class="text-muted text-[11px] font-medium tracking-[0.18em] uppercase">{{ group.title }}</div>

                      <div class="flex flex-wrap gap-2">
                        <ULink
                          v-for="link in group.links"
                          :key="link.href"
                          raw
                          :href="link.href"
                          class="border-default/70 hover:border-primary/45 hover:bg-elevated/35 group inline-flex max-w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                          @click.prevent="handleOpenExternal(link.href)"
                        >
                          <span class="text-highlighted truncate text-sm font-medium">{{ link.label }}</span>
                          <UIcon name="i-lucide:arrow-up-right" class="text-muted group-hover:text-highlighted size-3.5 shrink-0 transition-colors" />
                        </ULink>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </template>
          </div>
        </div>
      </section>
    </div>
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 窗口。
 */
const tauriWindow = useTauriWindow();

/**
 * Hook：国际化。
 */
const { t } = useI18n();

/**
 * 函数：本地化路由。
 */
const localePath = useLocalePath();

/**
 * API：1Panel 设置。
 */
const { datas: stateOnepanelSettingsRemote, refresh: refreshOnepanelSettingsGet } = await useApi<IPageSettingsOnepanelSettings>('desktop/settings/one_panel', { immediate: false });

/**
 * 计算属性：当前 1Panel 根域名。
 */
const computedPanelBase = computed(() => onepanelPanelBaseNormalize(String(stateOnepanelSettingsRemote.value?.panelBase || '').trim() || ONEPANEL_PANEL_BASE_DEFAULT));

/**
 * 计算属性：计划任务页地址。
 */
const computedCronjobsUrl = computed(() => onepanelLinkBuild(computedPanelBase.value, ONEPANEL_CRONJOBS_PATH));

/**
 * 计算属性：脚本库页地址。
 */
const computedLibraryUrl = computed(() => onepanelLinkBuild(computedPanelBase.value, ONEPANEL_CRON_LIBRARY_PATH));

/**
 * 计算属性：快捷入口。
 */
const computedQuickLinks = computed(() => {
  return [
    {
      label: t('pages.settings.cron.serverShortcut.quickLinks.overview'),
      href: onepanelLinkBuild(computedPanelBase.value, '/')
    },
    {
      label: t('pages.settings.cron.serverShortcut.quickLinks.terminal'),
      href: onepanelLinkBuild(computedPanelBase.value, '/terminal')
    },
    {
      label: t('pages.settings.cron.serverShortcut.quickLinks.logs'),
      href: onepanelLinkBuild(computedPanelBase.value, '/logs/operation')
    }
  ];
});

/**
 * 计算属性：1Panel 分组入口。
 */
const computedOnepanelLinkSections = computed(() => {
  return onepanelLinkSections.map((section) => ({
    ...section,
    groups: section.groups.map((group) => ({
      ...group,
      links: group.links.map((link) => ({
        ...link,
        href: onepanelLinkBuild(computedPanelBase.value, link.path)
      }))
    }))
  }));
});

/**
 * 计算属性：链接总数。
 */
const computedLinkTotal = computed(() => {
  return computedOnepanelLinkSections.value.reduce((count, section) => count + sectionLinkCountGet(section), 0);
});

/**
 * 计算属性：导航图谱。
 */
const computedAtlasSections = computed(() => {
  return computedOnepanelLinkSections.value.map((section, index) => ({
    ...section,
    serial: String(index + 1).padStart(2, '0'),
    count: sectionLinkCountGet(section)
  }));
});

/**
 * 函数：统计栏目链接数量。
 *
 * @param {typeof computedOnepanelLinkSections.value[number]} section 栏目数据
 * @return {number} 链接总数
 */
const sectionLinkCountGet = (section: (typeof computedOnepanelLinkSections.value)[number]): number => {
  return section.groups.reduce((count, group) => count + group.links.length, 0);
};

/**
 * 函数：打开外部链接。
 *
 * @param {string} href 目标地址
 * @return {Promise<void>} 无返回值
 */
const handleOpenExternal = async (href: string): Promise<void> => {
  if (!import.meta.client) {
    return;
  }

  if (isTauriRuntime.value) {
    await tauriWindow.openExternalUrl(href);
    return;
  }

  window.open(href, '_blank', 'noopener,noreferrer');
};

/**
 * 生命周期：页面加载。
 */
onMounted(() => {
  void refreshOnepanelSettingsGet();
});
</script>
