<template>
  <DashboardPage>
    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.crawler.browser.title') }}</h3>
          <p class="text-muted mt-1 text-sm">{{ t('pages.settings.crawler.browser.description') }}</p>
        </div>
        <ULink raw :to="localePath('/crawlers')" class="border-primary text-primary hover:bg-primary/8 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors">
          <UIcon name="i-mdi:spider-outline" class="size-4 shrink-0" />
          {{ t('pages.settings.crawler.actions.enterCrawlers') }}
        </ULink>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ root: 'mb-6', container: 'divide-y divide-default' }">
      <UFormField :description="t('pages.settings.crawler.browser.runtimeDescriptions.edge')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #label>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-logos:microsoft-edge" class="size-5" />
            <span>{{ crawlerBrowserCandidateGet('msedge').name }}</span>
          </span>
        </template>
        <USwitch v-if="crawlerBrowserCandidateGet('msedge').installed" :model-value="stateCrawlerBrowserSelectedId === 'msedge'" @update:model-value="(on) => handleCrawlerBrowserSelect(crawlerBrowserCandidateGet('msedge'), on)" />
        <div v-else class="flex shrink-0 items-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide:refresh-cw" :ui="{ leadingIcon: 'text-primary' }" :disabled="!isTauriRuntime" :loading="stateCrawlerBrowserRefreshing" @click="refreshCrawlerBrowsers(false)">
            {{ t('pages.settings.crawler.browser.actions.refresh') }}
          </UButton>
          <UButton color="neutral" variant="outline" icon="i-lucide:download" :ui="{ leadingIcon: 'text-primary' }" @click="handleCrawlerBrowserInstall(crawlerBrowserCandidateGet('msedge'))">
            {{ t('pages.settings.crawler.browser.actions.installOfficial') }}
          </UButton>
        </div>
      </UFormField>
      <UFormField :description="t('pages.settings.crawler.browser.runtimeDescriptions.chrome')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #label>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-devicon:chrome" class="size-5" />
            <span>{{ crawlerBrowserCandidateGet('chrome').name }}</span>
          </span>
        </template>
        <USwitch v-if="crawlerBrowserCandidateGet('chrome').installed" :model-value="stateCrawlerBrowserSelectedId === 'chrome'" @update:model-value="(on) => handleCrawlerBrowserSelect(crawlerBrowserCandidateGet('chrome'), on)" />
        <div v-else class="flex shrink-0 items-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide:refresh-cw" :ui="{ leadingIcon: 'text-primary' }" :disabled="!isTauriRuntime" :loading="stateCrawlerBrowserRefreshing" @click="refreshCrawlerBrowsers(false)">
            {{ t('pages.settings.crawler.browser.actions.refresh') }}
          </UButton>
          <UButton color="neutral" variant="outline" icon="i-lucide:download" :ui="{ leadingIcon: 'text-primary' }" @click="handleCrawlerBrowserInstall(crawlerBrowserCandidateGet('chrome'))">
            {{ t('pages.settings.crawler.browser.actions.installOfficial') }}
          </UButton>
        </div>
      </UFormField>
      <UFormField :description="t('pages.settings.crawler.browser.runtimeDescriptions.chromium')" :ui="{ label: 'text-base text-highlighted mb-1', description: 'text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #label>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-streamline-color:chrome-flat" class="size-5" />
            <span>{{ crawlerBrowserCandidateGet('chromium').name }}</span>
          </span>
        </template>
        <USwitch v-if="crawlerBrowserCandidateGet('chromium').installed" :model-value="stateCrawlerBrowserSelectedId === 'chromium'" @update:model-value="(on) => handleCrawlerBrowserSelect(crawlerBrowserCandidateGet('chromium'), on)" />
        <div v-else class="flex shrink-0 items-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide:refresh-cw" :ui="{ leadingIcon: 'text-primary' }" :disabled="!isTauriRuntime" :loading="stateCrawlerBrowserRefreshing" @click="refreshCrawlerBrowsers(false)">
            {{ t('pages.settings.crawler.browser.actions.refresh') }}
          </UButton>
          <UButton color="neutral" variant="outline" icon="i-lucide:download" :ui="{ leadingIcon: 'text-primary' }" @click="handleCrawlerBrowserInstall(crawlerBrowserCandidateGet('chromium'))">
            {{ t('pages.settings.crawler.browser.actions.installOfficial') }}
          </UButton>
        </div>
      </UFormField>
    </UPageCard>

    <UPageCard variant="naked" :ui="{ header: 'mb-0 flex w-full items-center gap-3' }">
      <template #header>
        <div class="flex-1">
          <h3 class="text-highlighted text-base font-semibold">{{ t('pages.settings.crawler.browserProfilesDirectory.label') }}</h3>
          <p class="text-muted mt-1 text-sm">{{ t('pages.settings.crawler.browserProfilesDirectory.description') }}</p>
        </div>
      </template>
    </UPageCard>

    <UPageCard variant="outline" :ui="{ container: 'divide-y divide-default' }">
      <UFormField v-if="stateIsMounted" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #label>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-lucide:folder" class="text-muted size-4 shrink-0" />
            <span>{{ t('pages.settings.crawler.browserProfilesDirectory.rootLabel') }}</span>
          </span>
        </template>
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.rootDescription') }}</div>
            <UTooltip v-if="stateCrawlerBrowserProfilesRootPath" :text="stateCrawlerBrowserProfilesRootPath" :content="{ side: 'top' }">
              <ULink raw class="text-muted hover:text-primary block max-w-full cursor-pointer overflow-hidden font-normal text-ellipsis whitespace-nowrap no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesRoot">
                {{ crawlerBrowserProfilesPathLabelShortGet(stateCrawlerBrowserProfilesRootPath) }}
              </ULink>
            </UTooltip>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <div class="flex items-center justify-end gap-2">
          <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:folder-open" :ui="{ leadingIcon: 'text-primary' }" :disabled="!stateCrawlerBrowserProfilesRootPath" @click="handleOpenCrawlerBrowserProfilesRoot">
            {{ t('pages.settings.crawler.browserProfilesDirectory.open') }}
          </UButton>
          <UPopover :open="stateCrawlerBrowserProfilesClearTarget === 'root'" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-80 z-51' }" @update:open="(open) => handleCrawlerBrowserProfilesDirectoryClearToggle('root', open)">
            <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-error' }" :disabled="!stateCrawlerBrowserProfilesRootPath || stateCrawlerBrowserProfilesClearing" :loading="stateCrawlerBrowserProfilesClearing">
              {{ t('pages.settings.crawler.browserProfilesDirectory.clearCache') }}
              <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(stateCrawlerBrowserProfilesRootSizeBytes)" :content="{ side: 'top' }">
                <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(stateCrawlerBrowserProfilesRootSizeBytes) }}</UBadge>
              </UTooltip>
            </UButton>
            <template #content="{ close }">
              <div class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ stateCrawlerBrowserProfilesRootPath }}</div>
                <div class="text-muted text-xs">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmDescription') }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-primary' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" :loading="stateCrawlerBrowserProfilesClearing" @click="() => handleCrawlerBrowserProfilesDirectoryClear('root', close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </UFormField>

      <UFormField v-if="stateIsMounted" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #label>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-lucide:folder" class="text-muted size-4 shrink-0" />
            <span>{{ t('pages.settings.crawler.browserProfilesDirectory.edgeLabel') }}</span>
          </span>
        </template>
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.edgeDescription') }}</div>
            <UTooltip v-if="stateCrawlerBrowserProfilesEdgePath" :text="stateCrawlerBrowserProfilesEdgePath" :content="{ side: 'top' }">
              <ULink raw class="text-muted hover:text-primary block max-w-full cursor-pointer overflow-hidden font-normal text-ellipsis whitespace-nowrap no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesEdge">
                {{ crawlerBrowserProfilesPathLabelShortGet(stateCrawlerBrowserProfilesEdgePath) }}
              </ULink>
            </UTooltip>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <div class="flex items-center justify-end gap-2">
          <UDropdownMenu :items="crawlerBrowserProfilesOpenMenuItemsGet('edge')" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :ui="{ content: 'w-44' }">
            <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:folder-open" trailing-icon="i-lucide:chevron-down" :ui="{ leadingIcon: 'text-primary', trailingIcon: 'text-muted' }">
              {{ t('pages.settings.crawler.browserProfilesDirectory.actionOpen') }}
            </UButton>
          </UDropdownMenu>
          <UPopover :open="crawlerBrowserDirectoryClearPopoverOpenGet('edge')" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-80 z-51' }" @update:open="(open) => handleCrawlerBrowserDirectoryClearMenuToggle('edge', open)">
            <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:trash-2" trailing-icon="i-lucide:chevron-down" :ui="{ leadingIcon: 'text-error', trailingIcon: 'text-muted' }" :disabled="stateCrawlerBrowserProfilesClearing || stateCrawlerBrowserMatchesClearing" :loading="stateCrawlerBrowserProfilesClearing || stateCrawlerBrowserMatchesClearing">
              {{ t('pages.settings.crawler.browserProfilesDirectory.actionClear') }}
              <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(crawlerBrowserProfilesTotalSizeBytesGet(stateCrawlerBrowserProfilesEdgeSizeBytes, stateCrawlerBrowserMatchesEdgeSizeBytes))" :content="{ side: 'top' }">
                <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(crawlerBrowserProfilesTotalSizeBytesGet(stateCrawlerBrowserProfilesEdgeSizeBytes, stateCrawlerBrowserMatchesEdgeSizeBytes)) }}</UBadge>
              </UTooltip>
            </UButton>
            <template #content="{ close }">
              <div v-if="!crawlerBrowserDirectoryClearConfirmOpenGet('edge')" class="flex flex-col gap-1">
                <UButton block color="neutral" variant="ghost" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-error' }" :disabled="!stateCrawlerBrowserProfilesEdgePath" @click="handleCrawlerBrowserProfilesDirectoryClearSelect('edge')">
                  <span class="flex flex-1 items-center justify-between gap-3">
                    <span>{{ t('pages.settings.crawler.browserProfilesDirectory.clearCache') }}</span>
                    <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(stateCrawlerBrowserProfilesEdgeSizeBytes)" :content="{ side: 'top' }">
                      <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(stateCrawlerBrowserProfilesEdgeSizeBytes) }}</UBadge>
                    </UTooltip>
                  </span>
                </UButton>
                <UButton block color="neutral" variant="ghost" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-error' }" :disabled="!stateCrawlerBrowserMatchesEdgePath" @click="handleCrawlerBrowserMatchesDirectoryClearSelect('edge')">
                  <span class="flex flex-1 items-center justify-between gap-3">
                    <span>{{ t('pages.settings.crawler.browserProfilesDirectory.clearMatches') }}</span>
                    <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(stateCrawlerBrowserMatchesEdgeSizeBytes)" :content="{ side: 'top' }">
                      <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(stateCrawlerBrowserMatchesEdgeSizeBytes) }}</UBadge>
                    </UTooltip>
                  </span>
                </UButton>
              </div>
              <div v-else-if="stateCrawlerBrowserProfilesClearTarget === 'edge'" class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ stateCrawlerBrowserProfilesEdgePath }}</div>
                <div class="text-muted text-xs">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmDescription') }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-primary' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" :loading="stateCrawlerBrowserProfilesClearing" @click="() => handleCrawlerBrowserProfilesDirectoryClear('edge', close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
              <div v-else class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.settings.crawler.browserProfilesDirectory.matchesClearConfirmTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ stateCrawlerBrowserMatchesEdgePath }}</div>
                <div class="text-muted text-xs">{{ t('pages.settings.crawler.browserProfilesDirectory.matchesClearConfirmDescription') }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-primary' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" :loading="stateCrawlerBrowserMatchesClearing" @click="() => handleCrawlerBrowserMatchesDirectoryClear('edge', close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </UFormField>

      <UFormField v-if="stateIsMounted" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #label>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-lucide:folder" class="text-muted size-4 shrink-0" />
            <span>{{ t('pages.settings.crawler.browserProfilesDirectory.chromeLabel') }}</span>
          </span>
        </template>
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.chromeDescription') }}</div>
            <UTooltip v-if="stateCrawlerBrowserProfilesChromePath" :text="stateCrawlerBrowserProfilesChromePath" :content="{ side: 'top' }">
              <ULink raw class="text-muted hover:text-primary block max-w-full cursor-pointer overflow-hidden font-normal text-ellipsis whitespace-nowrap no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesChrome">
                {{ crawlerBrowserProfilesPathLabelShortGet(stateCrawlerBrowserProfilesChromePath) }}
              </ULink>
            </UTooltip>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <div class="flex items-center justify-end gap-2">
          <UDropdownMenu :items="crawlerBrowserProfilesOpenMenuItemsGet('chrome')" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :ui="{ content: 'w-44' }">
            <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:folder-open" trailing-icon="i-lucide:chevron-down" :ui="{ leadingIcon: 'text-primary', trailingIcon: 'text-muted' }">
              {{ t('pages.settings.crawler.browserProfilesDirectory.actionOpen') }}
            </UButton>
          </UDropdownMenu>
          <UPopover :open="crawlerBrowserDirectoryClearPopoverOpenGet('chrome')" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-80 z-51' }" @update:open="(open) => handleCrawlerBrowserDirectoryClearMenuToggle('chrome', open)">
            <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:trash-2" trailing-icon="i-lucide:chevron-down" :ui="{ leadingIcon: 'text-error', trailingIcon: 'text-muted' }" :disabled="stateCrawlerBrowserProfilesClearing || stateCrawlerBrowserMatchesClearing" :loading="stateCrawlerBrowserProfilesClearing || stateCrawlerBrowserMatchesClearing">
              {{ t('pages.settings.crawler.browserProfilesDirectory.actionClear') }}
              <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(crawlerBrowserProfilesTotalSizeBytesGet(stateCrawlerBrowserProfilesChromeSizeBytes, stateCrawlerBrowserMatchesChromeSizeBytes))" :content="{ side: 'top' }">
                <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(crawlerBrowserProfilesTotalSizeBytesGet(stateCrawlerBrowserProfilesChromeSizeBytes, stateCrawlerBrowserMatchesChromeSizeBytes)) }}</UBadge>
              </UTooltip>
            </UButton>
            <template #content="{ close }">
              <div v-if="!crawlerBrowserDirectoryClearConfirmOpenGet('chrome')" class="flex flex-col gap-1">
                <UButton block color="neutral" variant="ghost" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-error' }" :disabled="!stateCrawlerBrowserProfilesChromePath" @click="handleCrawlerBrowserProfilesDirectoryClearSelect('chrome')">
                  <span class="flex flex-1 items-center justify-between gap-3">
                    <span>{{ t('pages.settings.crawler.browserProfilesDirectory.clearCache') }}</span>
                    <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(stateCrawlerBrowserProfilesChromeSizeBytes)" :content="{ side: 'top' }">
                      <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(stateCrawlerBrowserProfilesChromeSizeBytes) }}</UBadge>
                    </UTooltip>
                  </span>
                </UButton>
                <UButton block color="neutral" variant="ghost" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-error' }" :disabled="!stateCrawlerBrowserMatchesChromePath" @click="handleCrawlerBrowserMatchesDirectoryClearSelect('chrome')">
                  <span class="flex flex-1 items-center justify-between gap-3">
                    <span>{{ t('pages.settings.crawler.browserProfilesDirectory.clearMatches') }}</span>
                    <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(stateCrawlerBrowserMatchesChromeSizeBytes)" :content="{ side: 'top' }">
                      <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(stateCrawlerBrowserMatchesChromeSizeBytes) }}</UBadge>
                    </UTooltip>
                  </span>
                </UButton>
              </div>
              <div v-else-if="stateCrawlerBrowserProfilesClearTarget === 'chrome'" class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ stateCrawlerBrowserProfilesChromePath }}</div>
                <div class="text-muted text-xs">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmDescription') }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-primary' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" :loading="stateCrawlerBrowserProfilesClearing" @click="() => handleCrawlerBrowserProfilesDirectoryClear('chrome', close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
              <div v-else class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.settings.crawler.browserProfilesDirectory.matchesClearConfirmTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ stateCrawlerBrowserMatchesChromePath }}</div>
                <div class="text-muted text-xs">{{ t('pages.settings.crawler.browserProfilesDirectory.matchesClearConfirmDescription') }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-primary' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" :loading="stateCrawlerBrowserMatchesClearing" @click="() => handleCrawlerBrowserMatchesDirectoryClear('chrome', close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </UFormField>

      <UFormField v-if="stateIsMounted" :ui="{ label: 'text-base text-highlighted mb-1', description: 'mr-16 text-muted' }" class="flex items-center justify-between gap-2 not-last:pb-4">
        <template #label>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-lucide:folder" class="text-muted size-4 shrink-0" />
            <span>{{ t('pages.settings.crawler.browserProfilesDirectory.chromiumLabel') }}</span>
          </span>
        </template>
        <template #description>
          <div class="space-y-1">
            <div>{{ t('pages.settings.crawler.browserProfilesDirectory.chromiumDescription') }}</div>
            <UTooltip v-if="stateCrawlerBrowserProfilesChromiumPath" :text="stateCrawlerBrowserProfilesChromiumPath" :content="{ side: 'top' }">
              <ULink raw class="text-muted hover:text-primary block max-w-full cursor-pointer overflow-hidden font-normal text-ellipsis whitespace-nowrap no-underline hover:underline" @click="handleOpenCrawlerBrowserProfilesChromium">
                {{ crawlerBrowserProfilesPathLabelShortGet(stateCrawlerBrowserProfilesChromiumPath) }}
              </ULink>
            </UTooltip>
            <span v-else class="text-error">{{ t('pages.settings.crawler.browserProfilesDirectory.unset') }}</span>
          </div>
        </template>
        <div class="flex items-center justify-end gap-2">
          <UDropdownMenu :items="crawlerBrowserProfilesOpenMenuItemsGet('chromium')" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :ui="{ content: 'w-44' }">
            <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:folder-open" trailing-icon="i-lucide:chevron-down" :ui="{ leadingIcon: 'text-primary', trailingIcon: 'text-muted' }">
              {{ t('pages.settings.crawler.browserProfilesDirectory.actionOpen') }}
            </UButton>
          </UDropdownMenu>
          <UPopover :open="crawlerBrowserDirectoryClearPopoverOpenGet('chromium')" arrow :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-80 z-51' }" @update:open="(open) => handleCrawlerBrowserDirectoryClearMenuToggle('chromium', open)">
            <UButton class="shrink-0 whitespace-nowrap" color="neutral" variant="outline" icon="i-lucide:trash-2" trailing-icon="i-lucide:chevron-down" :ui="{ leadingIcon: 'text-error', trailingIcon: 'text-muted' }" :disabled="stateCrawlerBrowserProfilesClearing || stateCrawlerBrowserMatchesClearing" :loading="stateCrawlerBrowserProfilesClearing || stateCrawlerBrowserMatchesClearing">
              {{ t('pages.settings.crawler.browserProfilesDirectory.actionClear') }}
              <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(crawlerBrowserProfilesTotalSizeBytesGet(stateCrawlerBrowserProfilesChromiumSizeBytes, stateCrawlerBrowserMatchesChromiumSizeBytes))" :content="{ side: 'top' }">
                <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(crawlerBrowserProfilesTotalSizeBytesGet(stateCrawlerBrowserProfilesChromiumSizeBytes, stateCrawlerBrowserMatchesChromiumSizeBytes)) }}</UBadge>
              </UTooltip>
            </UButton>
            <template #content="{ close }">
              <div v-if="!crawlerBrowserDirectoryClearConfirmOpenGet('chromium')" class="flex flex-col gap-1">
                <UButton block color="neutral" variant="ghost" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-error' }" :disabled="!stateCrawlerBrowserProfilesChromiumPath" @click="handleCrawlerBrowserProfilesDirectoryClearSelect('chromium')">
                  <span class="flex flex-1 items-center justify-between gap-3">
                    <span>{{ t('pages.settings.crawler.browserProfilesDirectory.clearCache') }}</span>
                    <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(stateCrawlerBrowserProfilesChromiumSizeBytes)" :content="{ side: 'top' }">
                      <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(stateCrawlerBrowserProfilesChromiumSizeBytes) }}</UBadge>
                    </UTooltip>
                  </span>
                </UButton>
                <UButton block color="neutral" variant="ghost" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-error' }" :disabled="!stateCrawlerBrowserMatchesChromiumPath" @click="handleCrawlerBrowserMatchesDirectoryClearSelect('chromium')">
                  <span class="flex flex-1 items-center justify-between gap-3">
                    <span>{{ t('pages.settings.crawler.browserProfilesDirectory.clearMatches') }}</span>
                    <UTooltip :text="crawlerBrowserProfilesSizeLabelGet(stateCrawlerBrowserMatchesChromiumSizeBytes)" :content="{ side: 'top' }">
                      <UBadge color="neutral" variant="soft" class="max-w-16 justify-center truncate">{{ crawlerBrowserProfilesSizeLabelShortGet(stateCrawlerBrowserMatchesChromiumSizeBytes) }}</UBadge>
                    </UTooltip>
                  </span>
                </UButton>
              </div>
              <div v-else-if="stateCrawlerBrowserProfilesClearTarget === 'chromium'" class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ stateCrawlerBrowserProfilesChromiumPath }}</div>
                <div class="text-muted text-xs">{{ t('pages.settings.crawler.browserProfilesDirectory.clearConfirmDescription') }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-primary' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" :loading="stateCrawlerBrowserProfilesClearing" @click="() => handleCrawlerBrowserProfilesDirectoryClear('chromium', close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
              <div v-else class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('pages.settings.crawler.browserProfilesDirectory.matchesClearConfirmTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ stateCrawlerBrowserMatchesChromiumPath }}</div>
                <div class="text-muted text-xs">{{ t('pages.settings.crawler.browserProfilesDirectory.matchesClearConfirmDescription') }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-primary' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" :loading="stateCrawlerBrowserMatchesClearing" @click="() => handleCrawlerBrowserMatchesDirectoryClear('chromium', close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </UFormField>
    </UPageCard>
  </DashboardPage>
</template>

<script setup lang="ts">
/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri 设置
 */
const tauriSettings = useTauriSettings();

/**
 * Hook：Tauri 任务能力
 */
const tauriTasks = useTauriTasks();

/**
 * Hook：Tauri 窗口能力
 */
const tauriWindow = useTauriWindow();

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Hook：提示消息。
 */
const toast = useToast();

/**
 * 函数：本地化路由
 */
const localePath = useLocalePath();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 常量：默认浏览器候选配置。
 */
const crawlerBrowserCandidatesDefault: ICrawlerBrowserCandidate[] = [
  {
    id: 'msedge',
    name: 'Microsoft Edge',
    icon: 'i-logos:microsoft-edge',
    channel: 'msedge',
    executablePath: '',
    supported: true,
    installed: false,
    recommended: false,
    installUrl: 'https://www.microsoft.com/edge/download',
    source: 'fallback',
    reason: 'not installed on this computer'
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    icon: 'i-devicon:chrome',
    channel: 'chrome',
    executablePath: '',
    supported: true,
    installed: false,
    recommended: false,
    installUrl: 'https://www.google.com/chrome/',
    source: 'fallback',
    reason: 'not installed on this computer'
  },
  {
    id: 'chromium',
    name: 'Chromium',
    icon: 'i-streamline-color:chrome-flat',
    channel: 'chromium',
    executablePath: '',
    supported: true,
    installed: false,
    recommended: false,
    installUrl: 'https://www.chromium.org/getting-involved/download-chromium/',
    source: 'fallback',
    reason: 'not installed on this computer'
  }
];

/**
 * 常量：默认浏览器候选兜底项。
 */
const crawlerBrowserCandidateFallback: ICrawlerBrowserCandidate = crawlerBrowserCandidatesDefault.find((candidate) => candidate.id === 'msedge') as ICrawlerBrowserCandidate;

/**
 * 常量：当前支持展示目录的爬虫站点。
 */
const crawlerBrowserProfileSite = 'pixabay.com';

/**
 * 状态：组件是否挂载完成
 */
const stateIsMounted = ref(false);

/**
 * 状态：爬虫浏览器候选列表。
 */
const stateCrawlerBrowserCandidates = ref<ICrawlerBrowserCandidate[]>(crawlerBrowserCandidatesDefault);

/**
 * 函数：按标识获取爬虫浏览器候选。
 * @param {ICrawlerBrowserCandidate['id']} id 浏览器标识。
 * @returns {ICrawlerBrowserCandidate} 候选项。
 */
const crawlerBrowserCandidateGet = (id: ICrawlerBrowserCandidate['id']): ICrawlerBrowserCandidate => {
  return stateCrawlerBrowserCandidates.value.find((candidate) => candidate.id === id) ?? crawlerBrowserCandidatesDefault.find((candidate) => candidate.id === id) ?? crawlerBrowserCandidateFallback;
};

/**
 * 状态：爬虫浏览器候选是否正在刷新
 */
const stateCrawlerBrowserRefreshing = ref(false);

/**
 * 状态：已选择的爬虫浏览器标识
 */
const stateCrawlerBrowserSelectedId = ref('');

/**
 * 状态：是否已经触发过浏览器安装入口
 */
const stateCrawlerBrowserInstallStarted = ref(false);

/**
 * 状态：爬虫浏览器资料目录路径。
 */
const stateCrawlerBrowserProfilesRootPath = ref('');

/**
 * 状态：爬虫浏览器资料目录是否存在。
 */
const stateCrawlerBrowserProfilesRootExists = ref(false);

/**
 * 状态：Edge 浏览器资料目录路径。
 */
const stateCrawlerBrowserProfilesEdgePath = ref('');

/**
 * 状态：Edge 浏览器资料子目录是否存在。
 */
const stateCrawlerBrowserProfilesEdgeExists = ref(false);

/**
 * 状态：Chrome 浏览器资料目录路径。
 */
const stateCrawlerBrowserProfilesChromePath = ref('');

/**
 * 状态：Chrome 浏览器资料子目录是否存在。
 */
const stateCrawlerBrowserProfilesChromeExists = ref(false);

/**
 * 状态：Chromium 浏览器资料目录路径。
 */
const stateCrawlerBrowserProfilesChromiumPath = ref('');

/**
 * 状态：Chromium 浏览器资料目录是否存在。
 */
const stateCrawlerBrowserProfilesChromiumExists = ref(false);

/**
 * 状态：当前打开的资料清空确认目标。
 */
const stateCrawlerBrowserProfilesClearTarget = ref<'root' | 'edge' | 'chrome' | 'chromium' | ''>('');

/**
 * 状态：当前打开的匹配记录清空确认目标。
 */
const stateCrawlerBrowserMatchesClearTarget = ref<'edge' | 'chrome' | 'chromium' | ''>('');

/**
 * 状态：当前打开的浏览器目录清理选择菜单目标。
 */
const stateCrawlerBrowserDirectoryClearMenuTarget = ref<'edge' | 'chrome' | 'chromium' | ''>('');

/**
 * 状态：爬虫浏览器资料目录是否正在清空。
 */
const stateCrawlerBrowserProfilesClearing = ref(false);

/**
 * 状态：爬虫浏览器匹配记录目录是否正在清空。
 */
const stateCrawlerBrowserMatchesClearing = ref(false);

/**
 * 状态：爬虫浏览器资料目录根目录占用字节数。
 */
const stateCrawlerBrowserProfilesRootSizeBytes = ref(0);

/**
 * 状态：Edge 浏览器资料目录占用字节数。
 */
const stateCrawlerBrowserProfilesEdgeSizeBytes = ref(0);

/**
 * 状态：Chrome 浏览器资料目录占用字节数。
 */
const stateCrawlerBrowserProfilesChromeSizeBytes = ref(0);

/**
 * 状态：Chromium 浏览器资料目录占用字节数。
 */
const stateCrawlerBrowserProfilesChromiumSizeBytes = ref(0);

/**
 * 状态：Edge 浏览器匹配记录目录路径。
 */
const stateCrawlerBrowserMatchesEdgePath = ref('');

/**
 * 状态：Edge 浏览器匹配记录目录是否存在。
 */
const stateCrawlerBrowserMatchesEdgeExists = ref(false);

/**
 * 状态：Chrome 浏览器匹配记录目录路径。
 */
const stateCrawlerBrowserMatchesChromePath = ref('');

/**
 * 状态：Chrome 浏览器匹配记录目录是否存在。
 */
const stateCrawlerBrowserMatchesChromeExists = ref(false);

/**
 * 状态：Chromium 浏览器匹配记录目录路径。
 */
const stateCrawlerBrowserMatchesChromiumPath = ref('');

/**
 * 状态：Chromium 浏览器匹配记录目录是否存在。
 */
const stateCrawlerBrowserMatchesChromiumExists = ref(false);

/**
 * 状态：Edge 浏览器匹配记录目录占用字节数。
 */
const stateCrawlerBrowserMatchesEdgeSizeBytes = ref(0);

/**
 * 状态：Chrome 浏览器匹配记录目录占用字节数。
 */
const stateCrawlerBrowserMatchesChromeSizeBytes = ref(0);

/**
 * 状态：Chromium 浏览器匹配记录目录占用字节数。
 */
const stateCrawlerBrowserMatchesChromiumSizeBytes = ref(0);

/**
 * 接口：爬虫浏览器资料目录状态。
 */
interface ICrawlerBrowserProfilesDirectoryState {
  /** 目录路径。 */
  path: string;

  /** 目录是否存在。 */
  exists: boolean;
}

/**
 * 函数：格式化爬虫浏览器资料目录体积。
 * @param {number} sizeBytes 字节数。
 * @returns {string} 可读体积文本。
 */
const crawlerBrowserProfilesSizeLabelGet = (sizeBytes: number): string => {
  const normalizedSize = Number.isFinite(sizeBytes) && sizeBytes > 0 ? sizeBytes : 0;
  if (normalizedSize === 0) {
    return '0 B';
  }

  const sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
  const sizeIndex = Math.min(Math.floor(Math.log(normalizedSize) / Math.log(1024)), sizeUnits.length - 1);
  const scaledSize = normalizedSize / 1024 ** sizeIndex;
  const roundedSize = Math.round(scaledSize * 10) / 10;
  return `${roundedSize % 1 === 0 ? roundedSize.toFixed(0) : roundedSize.toFixed(1)} ${sizeUnits[sizeIndex]}`;
};

/**
 * 函数：格式化爬虫浏览器资料目录体积短文本。
 * @param {number} sizeBytes 字节数。
 * @returns {string} 可用于按钮徽章的短文本。
 */
const crawlerBrowserProfilesSizeLabelShortGet = (sizeBytes: number): string => {
  const label = crawlerBrowserProfilesSizeLabelGet(sizeBytes);
  if (label.length <= 8) {
    return label;
  }

  return `${label.slice(0, 4)}...${label.slice(-2)}`;
};

/**
 * 函数：汇总爬虫浏览器资料与匹配记录目录体积。
 * @param {number} profileSizeBytes 资料目录字节数。
 * @param {number} matchesSizeBytes 匹配记录目录字节数。
 * @returns {number} 合计字节数。
 */
const crawlerBrowserProfilesTotalSizeBytesGet = (profileSizeBytes: number, matchesSizeBytes: number): number => {
  const normalizedProfileSize = Number.isFinite(profileSizeBytes) && profileSizeBytes > 0 ? profileSizeBytes : 0;
  const normalizedMatchesSize = Number.isFinite(matchesSizeBytes) && matchesSizeBytes > 0 ? matchesSizeBytes : 0;
  return normalizedProfileSize + normalizedMatchesSize;
};

/**
 * 函数：格式化爬虫浏览器资料目录路径短文本。
 * @param {string} path 完整目录路径。
 * @returns {string} 中间省略后的路径文本。
 */
const crawlerBrowserProfilesPathLabelShortGet = (path: string): string => {
  const normalizedPath = path.trim();
  const maxLength = 42;
  if (normalizedPath.length <= maxLength) {
    return normalizedPath;
  }

  const prefixLength = 16;
  const suffixLength = maxLength - prefixLength - 3;
  return `${normalizedPath.slice(0, prefixLength)}...${normalizedPath.slice(-suffixLength)}`;
};

/**
 * 函数：拼接爬虫浏览器资料目录路径。
 * @param {string} basePath 基础路径。
 * @param {string} segment 子目录名。
 * @returns {string} 拼接后的路径。
 */
const crawlerBrowserProfilesDirectoryPathJoin = (basePath: string, segment: string): string => {
  const trimmedBasePath = basePath.trim().replace(/[\\/]+$/, '');
  if (!trimmedBasePath) {
    return '';
  }

  const separator = trimmedBasePath.includes('\\') ? '\\' : '/';
  return [trimmedBasePath, segment].join(separator);
};

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
    label: t('pages.settings.crawler.title'),
    icon: 'i-mdi:spider-outline',
    to: localePath('/settings/crawler')
  }
];

/**
 * 函数：保存爬虫浏览器选择。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @returns {Promise<void>} 无返回值
 */
const saveCrawlerBrowserCandidate = async (candidate: ICrawlerBrowserCandidate): Promise<void> => {
  stateCrawlerBrowserSelectedId.value = candidate.id;
  await tauriSettings.update({
    crawler: {
      browser: {
        id: candidate.id,
        name: candidate.name,
        channel: candidate.channel,
        executablePath: candidate.executablePath || ''
      }
    }
  });
};

/**
 * 函数：刷新爬虫浏览器候选。
 * @param {boolean} silent 是否静默忽略失败
 * @returns {Promise<void>} 无返回值
 */
const refreshCrawlerBrowsers = async (silent: boolean): Promise<void> => {
  if (stateCrawlerBrowserRefreshing.value || !isTauriRuntime.value) {
    return;
  }

  stateCrawlerBrowserRefreshing.value = true;
  try {
    const candidates = await tauriTasks.crawlerBrowserCandidatesGet();
    if (candidates.length > 0) {
      stateCrawlerBrowserCandidates.value = candidates;
    }

    const selected = stateCrawlerBrowserCandidates.value.find((candidate) => candidate.id === stateCrawlerBrowserSelectedId.value && candidate.installed);
    const fallback = selected || stateCrawlerBrowserCandidates.value.find((candidate) => candidate.recommended);
    if (fallback) {
      await saveCrawlerBrowserCandidate(fallback);
    }
  } catch (error) {
    if (!silent) {
      throw error;
    }
  } finally {
    stateCrawlerBrowserRefreshing.value = false;
  }
};

/**
 * 函数：加载已保存的爬虫浏览器设置。
 * @returns {Promise<void>} 无返回值
 */
const loadCrawlerBrowserSettings = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  const conf = await tauriSettings.get();
  const crawlerSetting = conf.crawler;
  if (!crawlerSetting || typeof crawlerSetting !== 'object' || Array.isArray(crawlerSetting)) {
    return;
  }

  const browserSetting = (crawlerSetting as Record<string, unknown>).browser;
  if (!browserSetting || typeof browserSetting !== 'object' || Array.isArray(browserSetting)) {
    return;
  }

  stateCrawlerBrowserSelectedId.value = String((browserSetting as Record<string, unknown>).id || '');
};

/**
 * 事件：选择爬虫浏览器。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @param {boolean} on 是否启用
 * @returns {Promise<void>} 无返回值
 */
const handleCrawlerBrowserSelect = async (candidate: ICrawlerBrowserCandidate, on: boolean): Promise<void> => {
  if (!on || !isTauriRuntime.value || !candidate.installed) {
    return;
  }

  await saveCrawlerBrowserCandidate(candidate);
};

/**
 * 事件：打开浏览器安装入口。
 * @param {ICrawlerBrowserCandidate} candidate 浏览器候选
 * @returns {Promise<void>} 无返回值
 */
const handleCrawlerBrowserInstall = async (candidate: ICrawlerBrowserCandidate): Promise<void> => {
  if (import.meta.client && !isTauriRuntime.value) {
    window.open(candidate.installUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  stateCrawlerBrowserInstallStarted.value = true;
  await tauriWindow.openExternalUrl(candidate.installUrl);
  await refreshCrawlerBrowsers(true);
};

/**
 * 函数：加载爬虫浏览器资料目录信息。
 * @returns {Promise<void>} 无返回值
 */
const loadCrawlerBrowserProfilesDirectory = async (): Promise<void> => {
  if (!isTauriRuntime.value) {
    return;
  }

  const directory = await tauriSettings.crawlerBrowserProfilesDirGet();
  const rootPath = directory.directoryPath;
  const edgePath = crawlerBrowserProfilesDirectoryPathJoin(rootPath, 'edge');
  const chromePath = crawlerBrowserProfilesDirectoryPathJoin(rootPath, 'chrome');
  const chromiumPath = crawlerBrowserProfilesDirectoryPathJoin(rootPath, 'chromium');
  const pathEntries = [rootPath, edgePath, chromePath, chromiumPath];
  const pathExistsEntries = await tauriSettings.pathsExistGet(pathEntries);
  const pathExistsMap = new Map(pathExistsEntries.map((item) => [item.path, item.exists]));
  const [edgeMatches, chromeMatches, chromiumMatches] = await Promise.all([
    tauriSettings.crawlerBrowserMatchesDirGet('edge', crawlerBrowserProfileSite),
    tauriSettings.crawlerBrowserMatchesDirGet('chrome', crawlerBrowserProfileSite),
    tauriSettings.crawlerBrowserMatchesDirGet('chromium', crawlerBrowserProfileSite)
  ]);
  const [rootSizeBytes, edgeSizeBytes, chromeSizeBytes, chromiumSizeBytes, edgeMatchesSizeBytes, chromeMatchesSizeBytes, chromiumMatchesSizeBytes] = await Promise.all([
    tauriSettings.crawlerBrowserProfilesDirSizeGet('root').catch(() => 0),
    tauriSettings.crawlerBrowserProfilesDirSizeGet('edge').catch(() => 0),
    tauriSettings.crawlerBrowserProfilesDirSizeGet('chrome').catch(() => 0),
    tauriSettings.crawlerBrowserProfilesDirSizeGet('chromium').catch(() => 0),
    tauriSettings.crawlerBrowserMatchesDirSizeGet('edge', crawlerBrowserProfileSite).catch(() => 0),
    tauriSettings.crawlerBrowserMatchesDirSizeGet('chrome', crawlerBrowserProfileSite).catch(() => 0),
    tauriSettings.crawlerBrowserMatchesDirSizeGet('chromium', crawlerBrowserProfileSite).catch(() => 0)
  ]);

  stateCrawlerBrowserProfilesRootPath.value = rootPath;
  stateCrawlerBrowserProfilesRootExists.value = pathExistsMap.get(rootPath) ?? directory.exists;
  stateCrawlerBrowserProfilesEdgePath.value = edgePath;
  stateCrawlerBrowserProfilesEdgeExists.value = pathExistsMap.get(edgePath) ?? false;
  stateCrawlerBrowserProfilesChromePath.value = chromePath;
  stateCrawlerBrowserProfilesChromeExists.value = pathExistsMap.get(chromePath) ?? false;
  stateCrawlerBrowserProfilesChromiumPath.value = chromiumPath;
  stateCrawlerBrowserProfilesChromiumExists.value = pathExistsMap.get(chromiumPath) ?? false;
  stateCrawlerBrowserMatchesEdgePath.value = edgeMatches.directoryPath;
  stateCrawlerBrowserMatchesEdgeExists.value = edgeMatches.exists;
  stateCrawlerBrowserMatchesChromePath.value = chromeMatches.directoryPath;
  stateCrawlerBrowserMatchesChromeExists.value = chromeMatches.exists;
  stateCrawlerBrowserMatchesChromiumPath.value = chromiumMatches.directoryPath;
  stateCrawlerBrowserMatchesChromiumExists.value = chromiumMatches.exists;
  stateCrawlerBrowserProfilesRootSizeBytes.value = rootSizeBytes;
  stateCrawlerBrowserProfilesEdgeSizeBytes.value = edgeSizeBytes;
  stateCrawlerBrowserProfilesChromeSizeBytes.value = chromeSizeBytes;
  stateCrawlerBrowserProfilesChromiumSizeBytes.value = chromiumSizeBytes;
  stateCrawlerBrowserMatchesEdgeSizeBytes.value = edgeMatchesSizeBytes;
  stateCrawlerBrowserMatchesChromeSizeBytes.value = chromeMatchesSizeBytes;
  stateCrawlerBrowserMatchesChromiumSizeBytes.value = chromiumMatchesSizeBytes;
};

/**
 * 函数：按资料范围读取路径与存在状态。
 * @param {'root' | 'edge' | 'chrome' | 'chromium'} scope 资料范围。
 * @returns {{ path: string; exists: boolean }} 当前范围的路径与存在状态。
 */
const crawlerBrowserProfilesDirectoryStateGet = (scope: 'root' | 'edge' | 'chrome' | 'chromium'): ICrawlerBrowserProfilesDirectoryState => {
  switch (scope) {
    case 'root':
      return { path: stateCrawlerBrowserProfilesRootPath.value, exists: stateCrawlerBrowserProfilesRootExists.value };
    case 'edge':
      return { path: stateCrawlerBrowserProfilesEdgePath.value, exists: stateCrawlerBrowserProfilesEdgeExists.value };
    case 'chrome':
      return { path: stateCrawlerBrowserProfilesChromePath.value, exists: stateCrawlerBrowserProfilesChromeExists.value };
    case 'chromium':
      return { path: stateCrawlerBrowserProfilesChromiumPath.value, exists: stateCrawlerBrowserProfilesChromiumExists.value };
  }
};

/**
 * 函数：切换资料清空确认弹层。
 * @param {'root' | 'edge' | 'chrome' | 'chromium'} scope 资料范围。
 * @param {boolean} open 是否打开。
 * @returns {void} 无返回值。
 */
const handleCrawlerBrowserProfilesDirectoryClearToggle = (scope: 'root' | 'edge' | 'chrome' | 'chromium', open: boolean): void => {
  stateCrawlerBrowserProfilesClearTarget.value = open ? scope : '';
};

/**
 * 函数：清空爬虫浏览器资料目录缓存。
 * @param {'root' | 'edge' | 'chrome' | 'chromium'} scope 资料范围。
 * @param {(() => void) | undefined} close 弹层关闭函数。
 * @returns {Promise<void>} 无返回值。
 */
const handleCrawlerBrowserProfilesDirectoryClear = async (scope: 'root' | 'edge' | 'chrome' | 'chromium', close?: () => void): Promise<void> => {
  if (!isTauriRuntime.value || stateCrawlerBrowserProfilesClearing.value) {
    return;
  }

  const directory = crawlerBrowserProfilesDirectoryStateGet(scope);
  if (!directory.path) {
    return;
  }

  stateCrawlerBrowserProfilesClearing.value = true;
  try {
    await tauriSettings.crawlerBrowserProfilesDirClear(scope);
    await loadCrawlerBrowserProfilesDirectory();
    toast.add({
      title: t('pages.settings.crawler.browserProfilesDirectory.clearSuccess')
    });
    close?.();
  } catch {
    toast.add({
      title: t('pages.settings.crawler.browserProfilesDirectory.clearFailed'),
      color: 'error'
    });
  } finally {
    stateCrawlerBrowserProfilesClearing.value = false;
    stateCrawlerBrowserProfilesClearTarget.value = '';
    stateCrawlerBrowserDirectoryClearMenuTarget.value = '';
  }
};

/**
 * 函数：按浏览器范围读取匹配记录路径与存在状态。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {{ path: string; exists: boolean }} 当前范围的路径与存在状态。
 */
const crawlerBrowserMatchesDirectoryStateGet = (browser: 'edge' | 'chrome' | 'chromium'): ICrawlerBrowserProfilesDirectoryState => {
  switch (browser) {
    case 'edge':
      return { path: stateCrawlerBrowserMatchesEdgePath.value, exists: stateCrawlerBrowserMatchesEdgeExists.value };
    case 'chrome':
      return { path: stateCrawlerBrowserMatchesChromePath.value, exists: stateCrawlerBrowserMatchesChromeExists.value };
    case 'chromium':
      return { path: stateCrawlerBrowserMatchesChromiumPath.value, exists: stateCrawlerBrowserMatchesChromiumExists.value };
  }
};

/**
 * 函数：读取浏览器目录清理弹层是否打开。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {boolean} 是否打开。
 */
const crawlerBrowserDirectoryClearPopoverOpenGet = (browser: 'edge' | 'chrome' | 'chromium'): boolean => {
  return stateCrawlerBrowserDirectoryClearMenuTarget.value === browser || stateCrawlerBrowserProfilesClearTarget.value === browser || stateCrawlerBrowserMatchesClearTarget.value === browser;
};

/**
 * 函数：读取浏览器目录清理弹层是否正在确认。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {boolean} 是否正在确认。
 */
const crawlerBrowserDirectoryClearConfirmOpenGet = (browser: 'edge' | 'chrome' | 'chromium'): boolean => {
  return stateCrawlerBrowserProfilesClearTarget.value === browser || stateCrawlerBrowserMatchesClearTarget.value === browser;
};

/**
 * 函数：切换浏览器目录清理选择菜单。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @param {boolean} open 是否打开。
 * @returns {void} 无返回值。
 */
const handleCrawlerBrowserDirectoryClearMenuToggle = (browser: 'edge' | 'chrome' | 'chromium', open: boolean): void => {
  stateCrawlerBrowserDirectoryClearMenuTarget.value = open ? browser : '';
  stateCrawlerBrowserProfilesClearTarget.value = '';
  stateCrawlerBrowserMatchesClearTarget.value = '';
};

/**
 * 事件：选择清空浏览器资料目录缓存。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {void} 无返回值。
 */
const handleCrawlerBrowserProfilesDirectoryClearSelect = (browser: 'edge' | 'chrome' | 'chromium'): void => {
  stateCrawlerBrowserDirectoryClearMenuTarget.value = '';
  stateCrawlerBrowserMatchesClearTarget.value = '';
  stateCrawlerBrowserProfilesClearTarget.value = browser;
};

/**
 * 事件：选择清空浏览器匹配记录目录。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {void} 无返回值。
 */
const handleCrawlerBrowserMatchesDirectoryClearSelect = (browser: 'edge' | 'chrome' | 'chromium'): void => {
  stateCrawlerBrowserDirectoryClearMenuTarget.value = '';
  stateCrawlerBrowserProfilesClearTarget.value = '';
  stateCrawlerBrowserMatchesClearTarget.value = browser;
};

/**
 * 函数：清空爬虫浏览器匹配记录目录。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @param {(() => void) | undefined} close 弹层关闭函数。
 * @returns {Promise<void>} 无返回值。
 */
const handleCrawlerBrowserMatchesDirectoryClear = async (browser: 'edge' | 'chrome' | 'chromium', close?: () => void): Promise<void> => {
  if (!isTauriRuntime.value || stateCrawlerBrowserMatchesClearing.value) {
    return;
  }

  const directory = crawlerBrowserMatchesDirectoryStateGet(browser);
  if (!directory.path) {
    return;
  }

  stateCrawlerBrowserMatchesClearing.value = true;
  try {
    await tauriSettings.crawlerBrowserMatchesDirClear(browser, crawlerBrowserProfileSite);
    await loadCrawlerBrowserProfilesDirectory();
    toast.add({
      title: t('pages.settings.crawler.browserProfilesDirectory.matchesClearSuccess')
    });
    close?.();
  } catch {
    toast.add({
      title: t('pages.settings.crawler.browserProfilesDirectory.matchesClearFailed'),
      color: 'error'
    });
  } finally {
    stateCrawlerBrowserMatchesClearing.value = false;
    stateCrawlerBrowserMatchesClearTarget.value = '';
    stateCrawlerBrowserDirectoryClearMenuTarget.value = '';
  }
};

/**
 * 事件：打开爬虫浏览器资料目录。
 * @param {string} path 目录路径。
 * @param {boolean} exists 目录是否存在。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserProfilesDirectory = async (path: string, exists: boolean): Promise<void> => {
  if (!isTauriRuntime.value || !path) {
    return;
  }

  if (!exists) {
    toast.add({
      title: t('pages.settings.crawler.browserProfilesDirectory.notExists'),
      color: 'error'
    });
    return;
  }

  await tauriWindow.openDirectory(path);
};

/**
 * 事件：按浏览器打开资料目录。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserProfilesBrowser = async (browser: 'edge' | 'chrome' | 'chromium'): Promise<void> => {
  const directory = crawlerBrowserProfilesDirectoryStateGet(browser);
  await handleOpenCrawlerBrowserProfilesDirectory(directory.path, directory.exists);
};

/**
 * 事件：按浏览器打开匹配记录目录。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserMatchesBrowser = async (browser: 'edge' | 'chrome' | 'chromium'): Promise<void> => {
  const directory = crawlerBrowserMatchesDirectoryStateGet(browser);
  await handleOpenCrawlerBrowserProfilesDirectory(directory.path, directory.exists);
};

/**
 * 函数：生成浏览器目录打开菜单项。
 * @param {'edge' | 'chrome' | 'chromium'} browser 浏览器范围。
 * @returns {Array<Array<Record<string, unknown>>>} 菜单项列表。
 */
const crawlerBrowserProfilesOpenMenuItemsGet = (browser: 'edge' | 'chrome' | 'chromium'): Array<Array<Record<string, unknown>>> => {
  const profileDirectory = crawlerBrowserProfilesDirectoryStateGet(browser);
  const matchesDirectory = crawlerBrowserMatchesDirectoryStateGet(browser);

  return [
    [
      {
        label: t('pages.settings.crawler.browserProfilesDirectory.browserDirectory'),
        icon: 'i-lucide:folder-open',
        disabled: !profileDirectory.path,
        onSelect: (): void => {
          void handleOpenCrawlerBrowserProfilesBrowser(browser);
        }
      }
    ],
    [
      {
        label: t('pages.settings.crawler.browserProfilesDirectory.matchesDirectory'),
        icon: 'i-lucide:folder-open',
        disabled: !matchesDirectory.path,
        onSelect: (): void => {
          void handleOpenCrawlerBrowserMatchesBrowser(browser);
        }
      }
    ]
  ];
};

/**
 * 事件：打开浏览器目录。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserProfilesRoot = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesDirectory(stateCrawlerBrowserProfilesRootPath.value, stateCrawlerBrowserProfilesRootExists.value);
};

/**
 * 事件：打开 Edge 浏览器资料目录。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserProfilesEdge = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesBrowser('edge');
};

/**
 * 事件：打开 Chrome 浏览器资料目录。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserProfilesChrome = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesBrowser('chrome');
};

/**
 * 事件：打开 Chromium 浏览器资料目录。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserProfilesChromium = async (): Promise<void> => {
  await handleOpenCrawlerBrowserProfilesBrowser('chromium');
};

/**
 * 事件：打开 Edge 浏览器匹配记录目录。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserMatchesEdge = async (): Promise<void> => {
  await handleOpenCrawlerBrowserMatchesBrowser('edge');
};

/**
 * 事件：打开 Chrome 浏览器匹配记录目录。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserMatchesChrome = async (): Promise<void> => {
  await handleOpenCrawlerBrowserMatchesBrowser('chrome');
};

/**
 * 事件：打开 Chromium 浏览器匹配记录目录。
 * @returns {Promise<void>} 无返回值。
 */
const handleOpenCrawlerBrowserMatchesChromium = async (): Promise<void> => {
  await handleOpenCrawlerBrowserMatchesBrowser('chromium');
};

/**
 * 事件：窗口重新获得焦点
 */
const handleWindowFocus = (): void => {
  if (!stateCrawlerBrowserInstallStarted.value) {
    return;
  }

  stateCrawlerBrowserInstallStarted.value = false;
  void refreshCrawlerBrowsers(true);
};

/**
 * 生命周期：组件挂载完成
 */
onMounted(async () => {
  stateIsMounted.value = true;

  await loadCrawlerBrowserProfilesDirectory();
  await loadCrawlerBrowserSettings();
  await refreshCrawlerBrowsers(true);
  window.addEventListener('focus', handleWindowFocus);
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  window.removeEventListener('focus', handleWindowFocus);
});
</script>
