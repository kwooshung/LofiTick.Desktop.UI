<template>
  <Dashboard>
    <DashboardPage class="gap-6">
      <UPageCard title="首页测试台" description="邮件、播客脚本与桌面键鼠自动化参数的临时验证入口。" variant="naked" />

      <div class="flex items-center justify-between gap-3">
        <UTabs v-model="stateHomeTab" color="primary" variant="link" :content="false" :items="HOME_TABS_ITEMS" />
        <UBadge color="neutral" variant="soft">{{ computedHomeTabBadge }}</UBadge>
      </div>

      <UPageCard v-if="stateHomeTab === 'email'" variant="naked" :ui="{ container: 'space-y-5 sm:p-0 p-0' }">
        <div class="flex flex-col gap-3">
          <div class="text-muted text-sm leading-6">
            {{ t('pages.home.welcomeEmail.target', { email: stateTargetEmail }) }}
          </div>
          <div class="flex items-center gap-3">
            <UButton icon="i-lucide-mail" color="primary" :loading="computedSending" @click="handleSendWelcomeEmail">
              {{ t('pages.home.welcomeEmail.send') }}
            </UButton>
            <UBadge color="neutral" variant="soft">{{ stateTargetEmail }}</UBadge>
          </div>
        </div>

        <UAlert v-if="stateResultVisible" :color="stateResultSuccess ? 'success' : 'error'" variant="soft" :title="stateResultSuccess ? t('pages.home.welcomeEmail.result.successTitle') : t('pages.home.welcomeEmail.result.errorTitle')" :description="stateResultMessage" />
      </UPageCard>

      <template v-else-if="stateHomeTab === 'podcast'">
        <UPageCard variant="naked" :title="t('pages.home.podcastScript.title')" :description="t('pages.home.podcastScript.editorDescription')" :ui="{ container: 'space-y-5 sm:p-0 p-0' }">
          <section class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-highlighted text-sm font-semibold">{{ t('pages.home.podcastScript.body.label') }}</h3>
                <p class="text-muted mt-1 text-sm leading-6">{{ t('pages.home.podcastScript.body.description') }}</p>
              </div>

              <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="statePodcastScriptLoading" @click="handlePodcastBodyItemAppend">
                {{ t('pages.home.podcastScript.body.add') }}
              </UButton>
            </div>

            <UEmpty v-if="statePodcastScriptBodyItems.length === 0" icon="i-lucide:file-plus-2" :title="t('pages.home.podcastScript.body.emptyTitle')" :description="t('pages.home.podcastScript.body.emptyDescription')" />

            <VueDraggable
              v-else
              v-model="statePodcastScriptBodyItems"
              tag="div"
              class="podcast-template-draggable"
              target=".podcast-template-list"
              :animation="240"
              easing="cubic-bezier(0.22, 1, 0.36, 1)"
              :disabled="statePodcastScriptLoading"
              direction="vertical"
              draggable=".podcast-template-item"
              chosen-class="podcast-template-item-chosen"
              drag-class="podcast-template-item-drag"
              ghost-class="podcast-template-item-ghost"
              handle=".podcast-template-handle"
            >
              <TransitionGroup tag="div" class="podcast-template-list space-y-3" type="transition" name="podcast-template-sort">
                <div v-for="(item, index) in statePodcastScriptBodyItems" :key="index" class="podcast-template-item flex items-center gap-2">
                  <SettingsHotsearchPodcastScriptListItem
                    :item="item"
                    :disabled="statePodcastScriptLoading"
                    editor-mode="body"
                    :voice-options="computedPodcastVoiceOptions"
                    :segment-options="computedPodcastSegmentOptions"
                    :placeholder="t('pages.home.podcastScript.body.placeholder')"
                    :ad-content-placeholder="t('pages.home.podcastScript.body.placeholder')"
                    @update:voice-key="(value) => handlePodcastBodyItemVoiceUpdate(index, value)"
                    @update:content="(value) => handlePodcastBodyItemContentUpdate(index, value)"
                    @update:segment-type="(value) => handlePodcastBodyItemSegmentTypeUpdate(index, value)"
                    @remove="handlePodcastBodyItemRemove(index)"
                  />
                </div>
              </TransitionGroup>
            </VueDraggable>
          </section>

          <section class="space-y-6">
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-highlighted text-sm font-semibold">{{ t('pages.home.podcastScript.adOpening.label') }}</h3>
                  <p class="text-muted mt-1 text-sm leading-6">{{ t('pages.home.podcastScript.adOpening.description') }}</p>
                </div>

                <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="statePodcastScriptLoading" @click="handlePodcastAdOpeningItemAppend">
                  {{ t('pages.home.podcastScript.adOpening.add') }}
                </UButton>
              </div>

              <UEmpty v-if="statePodcastAdOpeningItems.length === 0" icon="i-lucide:audio-lines" :title="t('pages.home.podcastScript.adOpening.emptyTitle')" :description="t('pages.home.podcastScript.adOpening.emptyDescription')" />

              <VueDraggable
                v-else
                v-model="statePodcastAdOpeningItems"
                tag="div"
                class="podcast-template-draggable"
                target=".podcast-ad-opening-list"
                :animation="240"
                easing="cubic-bezier(0.22, 1, 0.36, 1)"
                :disabled="statePodcastScriptLoading"
                direction="vertical"
                draggable=".podcast-template-item"
                chosen-class="podcast-template-item-chosen"
                drag-class="podcast-template-item-drag"
                ghost-class="podcast-template-item-ghost"
                handle=".podcast-template-handle"
              >
                <TransitionGroup tag="div" class="podcast-ad-opening-list space-y-3" type="transition" name="podcast-template-sort">
                  <div v-for="(item, index) in statePodcastAdOpeningItems" :key="`opening-${index}`" class="podcast-template-item flex items-center gap-2">
                    <SettingsHotsearchPodcastScriptListItem
                      :item="item"
                      :disabled="statePodcastScriptLoading"
                      editor-mode="advertisement"
                      :voice-options="computedPodcastVoiceOptions"
                      :segment-options="[]"
                      :placeholder="t('pages.home.podcastScript.adOpening.placeholder')"
                      :ad-content-placeholder="t('pages.home.podcastScript.adOpening.placeholder')"
                      @update:voice-key="(value) => handlePodcastAdOpeningVoiceUpdate(index, value)"
                      @update:content="(value) => handlePodcastAdOpeningContentUpdate(index, value)"
                      @remove="handlePodcastAdOpeningItemRemove(index)"
                    />
                  </div>
                </TransitionGroup>
              </VueDraggable>
            </div>

            <div class="space-y-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-highlighted text-sm font-semibold">{{ t('pages.home.podcastScript.adClosing.label') }}</h3>
                  <p class="text-muted mt-1 text-sm leading-6">{{ t('pages.home.podcastScript.adClosing.description') }}</p>
                </div>

                <UButton color="primary" variant="soft" size="sm" icon="i-lucide:plus" :disabled="statePodcastScriptLoading" @click="handlePodcastAdClosingItemAppend">
                  {{ t('pages.home.podcastScript.adClosing.add') }}
                </UButton>
              </div>

              <UEmpty v-if="statePodcastAdClosingItems.length === 0" icon="i-lucide:audio-lines" :title="t('pages.home.podcastScript.adClosing.emptyTitle')" :description="t('pages.home.podcastScript.adClosing.emptyDescription')" />

              <VueDraggable
                v-else
                v-model="statePodcastAdClosingItems"
                tag="div"
                class="podcast-template-draggable"
                target=".podcast-ad-closing-list"
                :animation="240"
                easing="cubic-bezier(0.22, 1, 0.36, 1)"
                :disabled="statePodcastScriptLoading"
                direction="vertical"
                draggable=".podcast-template-item"
                chosen-class="podcast-template-item-chosen"
                drag-class="podcast-template-item-drag"
                ghost-class="podcast-template-item-ghost"
                handle=".podcast-template-handle"
              >
                <TransitionGroup tag="div" class="podcast-ad-closing-list space-y-3" type="transition" name="podcast-template-sort">
                  <div v-for="(item, index) in statePodcastAdClosingItems" :key="`closing-${index}`" class="podcast-template-item flex items-center gap-2">
                    <SettingsHotsearchPodcastScriptListItem
                      :item="item"
                      :disabled="statePodcastScriptLoading"
                      editor-mode="advertisement"
                      :voice-options="computedPodcastVoiceOptions"
                      :segment-options="[]"
                      :placeholder="t('pages.home.podcastScript.adClosing.placeholder')"
                      :ad-content-placeholder="t('pages.home.podcastScript.adClosing.placeholder')"
                      @update:voice-key="(value) => handlePodcastAdClosingVoiceUpdate(index, value)"
                      @update:content="(value) => handlePodcastAdClosingContentUpdate(index, value)"
                      @remove="handlePodcastAdClosingItemRemove(index)"
                    />
                  </div>
                </TransitionGroup>
              </VueDraggable>
            </div>
          </section>

          <div class="border-default space-y-4 rounded-xl border p-4">
            <div class="text-sm font-medium">
              {{ t('pages.home.podcastScript.actions.title') }}
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900/40">
              <div class="space-y-1">
                <div class="text-highlighted text-sm font-medium">
                  {{ t('pages.home.podcastScript.scope.label') }}
                </div>
                <div class="text-muted text-xs leading-6">
                  {{ t(statePodcastUseBilibiliScope ? 'pages.home.podcastScript.scope.bilibiliDescription' : 'pages.home.podcastScript.scope.commonDescription') }}
                </div>
              </div>
              <div class="flex items-center gap-3">
                <UBadge color="neutral" variant="outline">
                  {{ t(statePodcastUseBilibiliScope ? 'pages.home.podcastScript.badges.bilibili' : 'pages.home.podcastScript.badges.common') }}
                </UBadge>
                <USwitch v-model="statePodcastUseBilibiliScope" :disabled="statePodcastScriptLoading" />
              </div>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <UButton v-for="mode in podcastScriptModes" :key="mode.key" color="primary" variant="soft" :disabled="!computedCanGeneratePodcastScript" :loading="statePodcastScriptLoading && stateGeneratingMode === mode.key" @click="handlePodcastScriptGenerate(mode.edition, mode.length)">
                {{ t(mode.labelKey) }}
              </UButton>
            </div>
            <div class="text-muted text-xs leading-6">
              {{ t('pages.home.podcastScript.actions.tip') }}
            </div>
          </div>
        </UPageCard>

        <UPageCard variant="naked" :title="t('pages.home.podcastScript.result.title')" :description="t('pages.home.podcastScript.result.description')" :ui="{ container: 'space-y-5 sm:p-0 p-0' }">
          <UEmpty v-if="!statePodcastScriptDatas" icon="i-lucide-file-audio" :title="t('pages.home.podcastScript.result.emptyTitle')" :description="t('pages.home.podcastScript.result.emptyDescription')" />

          <template v-else>
            <div class="flex flex-wrap items-center gap-3">
              <UBadge color="primary" variant="soft">{{ statePodcastScriptDatas.title }}</UBadge>
              <UBadge color="neutral" variant="outline">{{ t(`pages.home.podcastScript.badges.${statePodcastScriptDatas.edition}`) }}</UBadge>
              <UBadge color="neutral" variant="outline">{{ t(`pages.home.podcastScript.badges.${statePodcastScriptDatas.length}`) }}</UBadge>
              <UBadge color="neutral" variant="outline">{{ t(`pages.home.podcastScript.badges.${statePodcastScriptDatas.mediaPlatformName || 'common'}`) }}</UBadge>
            </div>

            <div class="border-default space-y-4 rounded-xl border p-4">
              <div class="flex flex-wrap items-center gap-3">
                <UButton color="primary" :disabled="!computedCanGeneratePodcastAudio" :loading="statePodcastAudioLoading" @click="handlePodcastAudioGenerate">
                  {{ t('pages.home.podcastScript.result.audio.generate') }}
                </UButton>

                <UButton v-if="computedPodcastOutputDirectory" color="neutral" variant="outline" @click="handlePodcastOutputDirectoryOpen">
                  {{ t('pages.home.podcastScript.result.audio.openDirectory') }}
                </UButton>
              </div>

              <div class="text-muted text-xs leading-6">
                {{ t('pages.home.podcastScript.result.audio.defaultHint') }}
              </div>

              <UAlert v-if="statePodcastAudioError" color="error" variant="soft" :title="t('pages.home.podcastScript.result.audio.errorTitle')" :description="statePodcastAudioError" />

              <UAlert v-if="statePodcastTaskSnapshot" :color="computedPodcastTaskColor" variant="soft" :title="computedPodcastTaskTitle" :description="computedPodcastTaskDescription" />
            </div>

            <div class="grid gap-4 xl:grid-cols-2">
              <UPageCard v-for="(line, index) in statePodcastScriptDatas.lines" :key="`${line.speakerRole}-${line.segmentType}-${index}`" variant="subtle" :ui="{ container: 'space-y-3' }">
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <UBadge color="neutral" variant="soft">{{ line.speakerRole }}</UBadge>
                  <UBadge color="neutral" variant="outline">{{ line.segmentType }}</UBadge>
                  <UBadge color="neutral" variant="outline">{{ line.speaker }}</UBadge>
                </div>
                <div class="text-sm leading-6 whitespace-pre-wrap">
                  {{ line.text }}
                </div>
              </UPageCard>
            </div>
          </template>
        </UPageCard>
      </template>

      <template v-else>
        <UPageCard variant="naked" title="键鼠操作实验台" description="这里列出 Rust 自动化层的基础输入能力与人类行为策略参数，默认值与 Rust 设计保持一致。" :ui="{ container: 'space-y-6 sm:p-0 p-0' }">
          <section class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 class="text-highlighted text-sm font-semibold">执行测试</h3>
                <p class="text-muted mt-1 text-sm leading-6">按顺序编辑一组连续动作；每一步共享下面的速度、曲线与按键间隔参数。</p>
              </div>
              <div class="flex items-center gap-3">
                <UBadge :color="stateInputLabDryRun ? 'neutral' : 'warning'" variant="soft">
                  {{ stateInputLabDryRun ? 'dry-run' : '真实输入' }}
                </UBadge>
                <USwitch v-model="stateInputLabDryRun" />
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <UButton color="primary" variant="soft" size="sm" icon="i-lucide:move" @click="handleInputLabStepAppend('move_to')">添加移动</UButton>
                <UButton color="primary" variant="soft" size="sm" icon="i-lucide:mouse-pointer-click" @click="handleInputLabStepAppend('click_current')">添加点击</UButton>
                <UButton color="primary" variant="soft" size="sm" icon="i-lucide:text-cursor-input" @click="handleInputLabStepAppend('type_text')">添加输入</UButton>
                <UButton color="primary" variant="soft" size="sm" icon="i-lucide:command" @click="handleInputLabStepAppend('hotkey')">添加快捷键</UButton>
                <UButton color="primary" variant="soft" size="sm" icon="i-lucide:timer" @click="handleInputLabStepAppend('random_wait')">添加等待</UButton>
              </div>

              <UEmpty v-if="stateInputLabSteps.length === 0" icon="i-lucide:list-plus" title="没有连续动作" description="添加移动、点击、输入或等待步骤后再执行。" />

              <VueDraggable
                v-else
                v-model="stateInputLabSteps"
                tag="div"
                class="podcast-template-draggable"
                target=".input-lab-step-list"
                :animation="240"
                easing="cubic-bezier(0.22, 1, 0.36, 1)"
                direction="vertical"
                draggable=".input-lab-step-item"
                chosen-class="podcast-template-item-chosen"
                drag-class="podcast-template-item-drag"
                ghost-class="podcast-template-item-ghost"
                handle=".input-lab-step-handle"
              >
                <TransitionGroup tag="div" class="input-lab-step-list space-y-3" type="transition" name="podcast-template-sort">
                  <div v-for="(step, index) in stateInputLabSteps" :key="step.id" class="input-lab-step-item border-default bg-muted/30 rounded-lg border p-4">
                    <div class="flex flex-wrap items-center gap-3">
                      <UButton class="input-lab-step-handle cursor-grab" color="neutral" variant="ghost" size="sm" icon="i-lucide:grip-vertical" />
                      <UBadge color="neutral" variant="soft">{{ index + 1 }}</UBadge>
                      <UInput v-model="step.label" class="min-w-48 flex-1" />
                      <USwitch v-model="step.enabled" />
                      <UButton color="error" variant="ghost" size="sm" icon="i-lucide:trash-2" @click="handleInputLabStepRemove(index)" />
                    </div>

                    <div class="mt-4 grid gap-3 xl:grid-cols-[minmax(20rem,32rem)_minmax(0,1fr)]">
                      <UFormField label="动作" :ui="{ label: 'text-sm text-highlighted mb-1' }">
                        <USelect v-model="step.action" :items="INPUT_LAB_EXECUTE_ACTION_OPTIONS" class="w-full" />
                      </UFormField>

                      <div class="grid gap-3 lg:grid-cols-2">
                        <UFormField label="点位 / 位移" :ui="{ label: 'text-sm text-highlighted mb-1' }">
                          <div class="grid gap-2 sm:grid-cols-2">
                            <UInputNumber v-model="step.point!.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">x</span></template></UInputNumber
                            >
                            <UInputNumber v-model="step.point!.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">y</span></template></UInputNumber
                            >
                          </div>
                        </UFormField>

                        <UFormField label="文本 / 快捷键" :ui="{ label: 'text-sm text-highlighted mb-1' }">
                          <UTextarea v-model="step.text" autoresize :rows="2" class="w-full" />
                        </UFormField>

                        <UFormField label="起点" :ui="{ label: 'text-sm text-highlighted mb-1' }">
                          <div class="grid gap-2 sm:grid-cols-2">
                            <UInputNumber v-model="step.from!.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">x</span></template></UInputNumber
                            >
                            <UInputNumber v-model="step.from!.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">y</span></template></UInputNumber
                            >
                          </div>
                        </UFormField>

                        <UFormField label="终点" :ui="{ label: 'text-sm text-highlighted mb-1' }">
                          <div class="grid gap-2 sm:grid-cols-2">
                            <UInputNumber v-model="step.to!.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">x</span></template></UInputNumber
                            >
                            <UInputNumber v-model="step.to!.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">y</span></template></UInputNumber
                            >
                          </div>
                        </UFormField>

                        <UFormField label="等待区间" :ui="{ label: 'text-sm text-highlighted mb-1' }">
                          <div class="grid gap-2 sm:grid-cols-2">
                            <UInputNumber v-model="step.numbers['action.waitMs.min']" orientation="vertical" :min="0" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">min</span></template></UInputNumber
                            >
                            <UInputNumber v-model="step.numbers['action.waitMs.max']" orientation="vertical" :min="0" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                              ><template #leading><span class="text-muted text-xs">max</span></template></UInputNumber
                            >
                          </div>
                        </UFormField>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </VueDraggable>
            </div>

            <div class="divide-default bg-muted/30 divide-y rounded-lg px-4">
              <UFormField label="动作" description="选择要执行的基础操作或人类模拟操作。" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }" class="grid gap-3 py-4 xl:grid-cols-[minmax(20rem,32rem)_minmax(0,1fr)] xl:items-center">
                <USelect v-model="stateInputLabAction" :items="INPUT_LAB_EXECUTE_ACTION_OPTIONS" class="w-full" />
              </UFormField>

              <UFormField
                label="目标点 / 位移"
                description="用于 move_to、move_by、click、distance_to、drag_by 等动作；move_by / drag_by 中作为 delta 使用。"
                :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }"
                class="grid gap-3 py-4 xl:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)] xl:items-center"
              >
                <div class="grid gap-2 sm:grid-cols-2">
                  <UInputNumber v-model="stateInputLabPoint.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }">
                    <template #leading><span class="text-muted text-xs">x</span></template>
                  </UInputNumber>
                  <UInputNumber v-model="stateInputLabPoint.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }">
                    <template #leading><span class="text-muted text-xs">y</span></template>
                  </UInputNumber>
                </div>
              </UFormField>

              <UFormField label="拖拽起点 / 终点" description="用于 drag_to；drag_by 只使用起点和上面的目标点位移。" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }" class="grid gap-3 py-4 xl:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)] xl:items-center">
                <div class="grid gap-2 md:grid-cols-4">
                  <UInputNumber v-model="stateInputLabFrom.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">from x</span></template></UInputNumber
                  >
                  <UInputNumber v-model="stateInputLabFrom.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">from y</span></template></UInputNumber
                  >
                  <UInputNumber v-model="stateInputLabTo.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">to x</span></template></UInputNumber
                  >
                  <UInputNumber v-model="stateInputLabTo.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">to y</span></template></UInputNumber
                  >
                </div>
              </UFormField>

              <UFormField label="目标区域" description="用于区域随机点、区域点击和人类化区域动作。" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }" class="grid gap-3 py-4 xl:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)] xl:items-center">
                <div class="grid gap-2 md:grid-cols-4">
                  <UInputNumber v-model="stateInputLabRect.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">x</span></template></UInputNumber
                  >
                  <UInputNumber v-model="stateInputLabRect.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">y</span></template></UInputNumber
                  >
                  <UInputNumber v-model="stateInputLabRect.width" orientation="vertical" :min="1" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">w</span></template></UInputNumber
                  >
                  <UInputNumber v-model="stateInputLabRect.height" orientation="vertical" :min="1" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                    ><template #leading><span class="text-muted text-xs">h</span></template></UInputNumber
                  >
                </div>
              </UFormField>

              <UFormField label="拖拽区域" description="用于 drag_rect_to_rect_random 和 drag_area_to_area。" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }" class="grid gap-3 py-4 xl:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)] xl:items-center">
                <div class="grid gap-3">
                  <div class="grid gap-2 md:grid-cols-4">
                    <UInputNumber v-model="stateInputLabFromRect.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">from x</span></template></UInputNumber
                    >
                    <UInputNumber v-model="stateInputLabFromRect.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">from y</span></template></UInputNumber
                    >
                    <UInputNumber v-model="stateInputLabFromRect.width" orientation="vertical" :min="1" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">from w</span></template></UInputNumber
                    >
                    <UInputNumber v-model="stateInputLabFromRect.height" orientation="vertical" :min="1" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">from h</span></template></UInputNumber
                    >
                  </div>
                  <div class="grid gap-2 md:grid-cols-4">
                    <UInputNumber v-model="stateInputLabToRect.x" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">to x</span></template></UInputNumber
                    >
                    <UInputNumber v-model="stateInputLabToRect.y" orientation="vertical" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">to y</span></template></UInputNumber
                    >
                    <UInputNumber v-model="stateInputLabToRect.width" orientation="vertical" :min="1" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">to w</span></template></UInputNumber
                    >
                    <UInputNumber v-model="stateInputLabToRect.height" orientation="vertical" :min="1" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }"
                      ><template #leading><span class="text-muted text-xs">to h</span></template></UInputNumber
                    >
                  </div>
                </div>
              </UFormField>

              <UFormField
                label="文本 / 按键"
                description="用于 key_tap、type_text、paste_text；hotkey 固定测试 Control+A。"
                :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }"
                class="grid gap-3 py-4 xl:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)] xl:items-center"
              >
                <UTextarea v-model="stateInputLabText" autoresize :rows="3" class="w-full" />
              </UFormField>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <UButton color="primary" icon="i-lucide:play" :loading="stateInputLabExecuting" :disabled="!isTauriRuntime" @click="handleInputLabExecute">执行动作</UButton>
              <UButton color="neutral" variant="outline" icon="i-lucide:rotate-ccw" @click="handleInputLabDefaultsReset">恢复默认</UButton>
              <span v-if="!isTauriRuntime" class="text-warning text-sm">只能在 Tauri 桌面壳里执行。</span>
            </div>

            <section class="border-default bg-muted/30 space-y-4 rounded-lg border p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="space-y-1">
                  <h3 class="text-highlighted text-sm font-semibold">鼠标路径录制</h3>
                  <p class="text-muted text-sm leading-6">录制你真实操作时的鼠标路径，停止后直接输出 JSON 样本。</p>
                </div>
                <UBadge :color="stateInputPathRecordRecording ? 'warning' : 'neutral'" variant="soft">{{ stateInputPathRecordRecording ? '录制中' : '未录制' }}</UBadge>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <UFormField label="采样间隔" description="单位毫秒，默认约 60Hz。" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }">
                  <UInputNumber v-model="stateInputPathRecordSampleIntervalMs" orientation="vertical" :min="5" :max="1000" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
                </UFormField>
                <UFormField label="最长时间" description="单位毫秒，到时自动停止采样线程。" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }">
                  <UInputNumber v-model="stateInputPathRecordMaxDurationMs" orientation="vertical" :min="100" :max="120000" :step="1000" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
                </UFormField>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <UButton color="primary" icon="i-lucide:radio" :loading="stateInputPathRecordLoading && !stateInputPathRecordRecording" :disabled="!isTauriRuntime || stateInputPathRecordRecording" @click="handleInputPathRecordStart">开始录制</UButton>
                <UButton color="warning" variant="soft" icon="i-lucide:square" :loading="stateInputPathRecordLoading && stateInputPathRecordRecording" :disabled="!isTauriRuntime || !stateInputPathRecordRecording" @click="handleInputPathRecordStop">停止并输出</UButton>
                <UButton color="neutral" variant="outline" icon="i-lucide:x" :disabled="stateInputPathRecordRecording || !stateInputPathRecordOutput" @click="handleInputPathRecordOutputClear">清空输出</UButton>
              </div>

              <UAlert v-if="stateInputPathRecordError" color="error" variant="soft" title="录制失败" :description="stateInputPathRecordError" />

              <div v-if="stateInputPathRecordResult" class="flex flex-wrap items-center gap-2">
                <UBadge color="primary" variant="soft">{{ stateInputPathRecordResult.analysis.pointCount }} points</UBadge>
                <UBadge color="neutral" variant="outline">{{ stateInputPathRecordResult.analysis.durationMs }} ms</UBadge>
                <UBadge color="neutral" variant="outline">{{ Math.round(stateInputPathRecordResult.analysis.totalDistancePx) }} px</UBadge>
              </div>

              <UTextarea v-model="stateInputPathRecordOutput" autoresize :rows="10" class="w-full font-mono text-xs" />
            </section>

            <UAlert v-if="stateInputLabError" color="error" variant="soft" title="执行失败" :description="stateInputLabError" />
            <UAlert v-if="stateInputLabResult" color="success" variant="soft" title="执行完成" :description="stateInputLabResult.summary" />

            <div v-if="stateInputLabResult" class="space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge color="primary" variant="soft">{{ stateInputLabResult.action }}</UBadge>
                <UBadge color="neutral" variant="outline">{{ stateInputLabResult.dryRun ? 'dry-run' : '真实输入' }}</UBadge>
                <UBadge color="neutral" variant="outline">{{ stateInputLabResult.trace.length }} trace</UBadge>
              </div>
              <div class="divide-default bg-muted/30 divide-y rounded-lg px-4">
                <div v-for="(item, index) in stateInputLabResult.trace" :key="`${item.kind}-${index}`" class="grid gap-2 py-3 xl:grid-cols-[10rem_minmax(0,1fr)]">
                  <div class="flex items-center gap-2">
                    <UBadge color="neutral" variant="soft">{{ index + 1 }}</UBadge>
                    <span class="text-highlighted text-sm font-medium">{{ item.kind }}</span>
                  </div>
                  <div class="min-w-0 space-y-2">
                    <p class="text-muted text-sm leading-6">{{ item.summary }}</p>
                    <pre class="bg-default/60 overflow-auto rounded-md p-3 text-xs leading-5">{{ inputLabJsonFormat(item.detail) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="grid gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <section class="space-y-4">
              <div class="space-y-2">
                <h3 class="text-highlighted text-sm font-semibold">基础操作</h3>
                <p class="text-muted text-sm leading-6">这些操作由 InputController 提供，所有目标点点击都会先走多点平滑移动路径。</p>
              </div>
              <div class="divide-default divide-y">
                <div v-for="item in INPUT_CONTROLLER_ACTIONS" :key="item.name" class="grid gap-2 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <div class="flex items-center gap-2">
                    <UIcon :name="item.icon" class="text-muted size-4 shrink-0" />
                    <span class="text-highlighted text-sm font-medium">{{ item.name }}</span>
                  </div>
                  <div class="text-muted text-sm leading-6">{{ item.description }}</div>
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <h3 class="text-highlighted text-sm font-semibold">人类模拟操作</h3>
                <p class="text-muted text-sm leading-6">这些操作由 HumanInputAgent 组合基础操作完成，不直接调用 enigo。</p>
              </div>
              <div class="divide-default divide-y">
                <div v-for="item in HUMAN_INPUT_ACTIONS" :key="item.name" class="grid gap-2 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <div class="flex items-center gap-2">
                    <UIcon :name="item.icon" class="text-muted size-4 shrink-0" />
                    <span class="text-highlighted text-sm font-medium">{{ item.name }}</span>
                  </div>
                  <div class="text-muted text-sm leading-6">{{ item.description }}</div>
                </div>
              </div>
            </section>

            <section class="space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="text-highlighted text-sm font-semibold">参数配置</h3>
                  <p class="text-muted mt-1 text-sm leading-6">所有数值都使用 Rust 默认值；区间参数按 min/max 分开调整。</p>
                </div>
              </div>

              <div class="space-y-6">
                <section v-for="group in inputLabParameterGroups" :key="group.title" class="space-y-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <UIcon :name="group.icon" class="text-muted size-4" />
                    <h4 class="text-highlighted text-sm font-semibold">{{ group.title }}</h4>
                    <UBadge color="neutral" variant="soft">{{ group.items.length }} 项</UBadge>
                  </div>

                  <div class="divide-default bg-muted/30 divide-y rounded-lg px-4">
                    <UFormField v-for="item in group.items" :key="item.key" :label="item.label" :description="item.description" :ui="{ label: 'text-sm text-highlighted mb-1', description: 'text-muted' }" class="grid gap-3 py-4 xl:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)] xl:items-center">
                      <div class="w-full min-w-0 justify-self-end">
                        <template v-if="item.kind === 'switch'">
                          <USwitch v-model="stateInputLabBooleanValues[item.key]" />
                        </template>
                        <template v-else-if="item.kind === 'select'">
                          <USelect v-model="stateInputLabStringValues[item.key]" :items="item.options" class="w-full" />
                        </template>
                        <template v-else-if="item.kind === 'number'">
                          <UInputNumber v-model="stateInputLabNumberValues[item.key]" orientation="vertical" :step="item.step" :min="item.min" :max="item.max" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
                        </template>
                        <template v-else>
                          <div class="grid gap-2 sm:grid-cols-2">
                            <UInputNumber v-model="stateInputLabNumberValues[`${item.key}.min`]" orientation="vertical" :step="item.step" :min="item.min" :max="item.max" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }">
                              <template #leading>
                                <span class="text-muted text-xs">min</span>
                              </template>
                            </UInputNumber>
                            <UInputNumber v-model="stateInputLabNumberValues[`${item.key}.max`]" orientation="vertical" :step="item.step" :min="item.min" :max="item.max" class="w-full" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }">
                              <template #leading>
                                <span class="text-muted text-xs">max</span>
                              </template>
                            </UInputNumber>
                          </div>
                        </template>
                      </div>
                    </UFormField>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </UPageCard>
      </template>
    </DashboardPage>
  </Dashboard>
</template>

<script setup lang="ts">
import type { UnlistenFn } from '@tauri-apps/api/event';
import { VueDraggable } from 'vue-draggable-plus';

import type { IInputLabExecuteRequest, IInputLabExecuteResponse, IInputLabPoint, IInputLabRect, IInputLabStep, IInputPathRecordStopResponse, TInputLabAction } from '@@/shared/types/tauri/input-lab/index.types';

/**
 * 国际化：i18n
 */
const { t, locale } = useI18n();

/**
 * 函数：本地化路由。
 */
const localePath = useLocalePath();

/**
 * 常量：首页测试页签。
 */
const HOME_TABS_ITEMS = [
  { label: '邮箱', value: 'email', icon: 'i-lucide:mail' },
  { label: '播客相关', value: 'podcast', icon: 'i-lucide:radio' },
  { label: '键鼠操作', value: 'input', icon: 'i-lucide:mouse-pointer-click' }
];

/**
 * 常量：键鼠实验台可执行动作选项。
 */
const INPUT_LAB_EXECUTE_ACTION_OPTIONS = [
  { label: 'current_position - 读取当前位置', value: 'current_position' },
  { label: 'distance_to - 计算到目标点距离', value: 'distance_to' },
  { label: 'move_to - 平滑移动到目标点', value: 'move_to' },
  { label: 'move_by - 按位移平滑移动', value: 'move_by' },
  { label: 'move_to_rect_random - 移动到区域随机点', value: 'move_to_rect_random' },
  { label: 'click - 移动后左键点击', value: 'click' },
  { label: 'click_current - 点击当前位置', value: 'click_current' },
  { label: 'double_click - 移动后双击', value: 'double_click' },
  { label: 'right_click - 移动后右键点击', value: 'right_click' },
  { label: 'click_rect_random - 区域随机点击', value: 'click_rect_random' },
  { label: 'drag_to - 点到点拖拽', value: 'drag_to' },
  { label: 'drag_by - 起点加位移拖拽', value: 'drag_by' },
  { label: 'drag_rect_to_rect_random - 区域到区域拖拽', value: 'drag_rect_to_rect_random' },
  { label: 'scroll_vertical - 纵向滚动', value: 'scroll_vertical' },
  { label: 'scroll_horizontal - 横向滚动', value: 'scroll_horizontal' },
  { label: 'idle_random_move - 无目标随机移动', value: 'idle_random_move' },
  { label: 'idle_circle - 无目标画圆圈', value: 'idle_circle' },
  { label: 'idle_infinity - 无目标画无限符号', value: 'idle_infinity' },
  { label: 'idle_eight - 无目标连写 8', value: 'idle_eight' },
  { label: 'idle_random_scroll - 无目标随机滚轮', value: 'idle_random_scroll' },
  { label: 'key_tap - 单键点击', value: 'key_tap' },
  { label: 'hotkey - Control+A', value: 'hotkey' },
  { label: 'type_text - 逐字输入', value: 'type_text' },
  { label: 'paste_text - 快速文本输入', value: 'paste_text' },
  { label: 'random_wait - 随机等待', value: 'random_wait' },
  { label: 'move_to_area - 人类化移动到区域', value: 'move_to_area' },
  { label: 'click_area - 人类化区域点击', value: 'click_area' },
  { label: 'double_click_area - 人类化区域双击', value: 'double_click_area' },
  { label: 'right_click_area - 人类化区域右键', value: 'right_click_area' },
  { label: 'drag_area_to_area - 人类化区域拖拽', value: 'drag_area_to_area' },
  { label: 'scroll_vertical_human - 人类化纵向滚动', value: 'scroll_vertical_human' }
] satisfies Array<{ label: string; value: TInputLabAction }>;

/**
 * 常量：基础输入操作清单。
 */
const INPUT_CONTROLLER_ACTIONS = [
  { name: 'current_position', icon: 'i-lucide:crosshair', description: '读取当前鼠标位置，dry-run 模式读取虚拟位置。' },
  { name: 'distance_to', icon: 'i-lucide:ruler', description: '计算当前位置到目标点的距离，用于推导移动耗时。' },
  { name: 'move_to', icon: 'i-lucide:move', description: '按多点路径平滑移动到目标点，公开入口不会瞬移。' },
  { name: 'move_by', icon: 'i-lucide:move-right', description: '按相对位移平滑移动鼠标。' },
  { name: 'move_to_rect_random', icon: 'i-lucide:scan-search', description: '从矩形区域内选取随机目标点并平滑移动。' },
  { name: 'click', icon: 'i-lucide:mouse-pointer-click', description: '先平滑移动到目标点，再执行当前位置点击。' },
  { name: 'click_current', icon: 'i-lucide:circle-dot', description: '不改变鼠标位置，只点击当前位置。' },
  { name: 'double_click', icon: 'i-lucide:copy-plus', description: '先平滑移动，再按配置执行两次点击。' },
  { name: 'right_click', icon: 'i-lucide:panel-right-open', description: '先平滑移动，再执行右键点击。' },
  { name: 'click_rect_random', icon: 'i-lucide:square-mouse-pointer', description: '从目标区域随机取点并点击。' },
  { name: 'drag_to', icon: 'i-lucide:mouse-pointer-2', description: '先平滑移动到起点，再按下、拖动、释放。' },
  { name: 'drag_by', icon: 'i-lucide:move-horizontal', description: '从指定起点按相对位移拖拽。' },
  { name: 'drag_rect_to_rect_random', icon: 'i-lucide:combine', description: '从一个区域随机点拖拽到另一个区域随机点。' },
  { name: 'scroll_vertical', icon: 'i-lucide:panel-top-open', description: '按分段配置执行纵向滚轮。' },
  { name: 'scroll_horizontal', icon: 'i-lucide:panel-left-open', description: '按分段配置执行横向滚轮。' },
  { name: 'idle_random_move', icon: 'i-lucide:waves', description: '在当前位置附近执行毫无目的的随机游走。' },
  { name: 'idle_circle', icon: 'i-lucide:circle', description: '执行基于录制样本尺寸的圆圈移动，方向可顺逆随机。' },
  { name: 'idle_infinity', icon: 'i-lucide:infinity', description: '执行基于录制样本尺寸的无限符号移动，方向可顺逆随机。' },
  { name: 'idle_eight', icon: 'i-lucide:badge-8', description: '执行偏手写感的连写 8 轨迹。' },
  { name: 'idle_random_scroll', icon: 'i-lucide:mouse', description: '先按录制样本尺度移动到滚动点，停留滚动后再离开。' },
  { name: 'key_tap', icon: 'i-lucide:keyboard', description: '按配置执行单个键的按下与释放。' },
  { name: 'key_down / key_up', icon: 'i-lucide:corner-down-left', description: '分别发送按下与释放事件，适合快捷键组合。' },
  { name: 'hotkey', icon: 'i-lucide:command', description: '按顺序按下按键，再反向释放。' },
  { name: 'type_text', icon: 'i-lucide:text-cursor-input', description: '逐字符输入 Unicode 文本，支持字符间隔。' },
  { name: 'paste_text', icon: 'i-lucide:clipboard-paste', description: '使用 enigo 文本输入能力快速输入整段文本。' },
  { name: 'random_wait', icon: 'i-lucide:timer', description: '按区间与全局等待倍率执行等待。' },
  { name: 'dry_run / trace', icon: 'i-lucide:list-tree', description: '只生成动作轨迹，不发送真实输入事件。' }
];

/**
 * 常量：人类行为操作清单。
 */
const HUMAN_INPUT_ACTIONS = [
  { name: 'move_to_area', icon: 'i-lucide:locate-fixed', description: '动作前观察，选择安全目标点，执行人类化移动和动作后观察。' },
  { name: 'click_area', icon: 'i-lucide:mouse-pointer-click', description: '区域安全点选择、人类化移动、当前位置点击、点击后观察。' },
  { name: 'double_click_area', icon: 'i-lucide:copy-plus', description: '区域安全点选择后执行人类化双击。' },
  { name: 'right_click_area', icon: 'i-lucide:panel-right-open', description: '区域安全点选择后执行人类化右键点击。' },
  { name: 'drag_area_to_area', icon: 'i-lucide:combine', description: '从起点区域安全点拖拽到终点区域安全点。' },
  { name: 'scroll_vertical_human', icon: 'i-lucide:panel-top-open', description: '滚动前等待、基础分段滚动、可选轻微反向滚动、滚动后观察。' },
  { name: 'overshoot', icon: 'i-lucide:undo-2', description: '按概率越过目标点，再回到目标。' },
  { name: 'hesitation', icon: 'i-lucide:pause', description: '移动前按概率插入停顿与小范围漂移。' },
  { name: 'micro_adjustment', icon: 'i-lucide:focus', description: '到达目标附近后按概率执行一到多次微修正。' },
  { name: 'session rhythm', icon: 'i-lucide:activity', description: '统一控制动作间隔、短暂停顿、长停顿和会话速度倍率。' }
];

/**
 * 常量：键鼠实验台数值默认值。
 */
const INPUT_LAB_NUMBER_DEFAULTS = {
  'move.durationMs.min': 150,
  'move.durationMs.max': 650,
  'move.durationPerPxMs.min': 0.18,
  'move.durationPerPxMs.max': 0.72,
  'move.durationBounds.min': 110,
  'move.durationBounds.max': 1200,
  'move.steps.min': 18,
  'move.steps.max': 48,
  'move.jitterPx.min': -5,
  'move.jitterPx.max': 5,
  'move.overshootPx.min': 0,
  'move.overshootPx.max': 6,
  'move.curveFactor.min': 0.015,
  'move.curveFactor.max': 0.22,
  'move.secondaryCurveFactor.min': 0.004,
  'move.secondaryCurveFactor.max': 0.12,
  'move.curveDirectionChangeProbability.min': 0.18,
  'move.curveDirectionChangeProbability.max': 0.46,
  'move.speedFactor.min': 0.95,
  'move.speedFactor.max': 1.45,
  'move.splitMoveProbability.min': 0.06,
  'move.splitMoveProbability.max': 0.16,
  'move.splitMoveCount.min': 2,
  'move.splitMoveCount.max': 3,
  'move.splitMovePauseMs.min': 70,
  'move.splitMovePauseMs.max': 240,
  'move.settleMs.min': 50,
  'move.settleMs.max': 170,
  'click.beforeClickMs.min': 30,
  'click.beforeClickMs.max': 180,
  'click.downUpMs.min': 45,
  'click.downUpMs.max': 140,
  'click.afterClickMs.min': 80,
  'click.afterClickMs.max': 260,
  'click.doubleClickGapMs.min': 90,
  'click.doubleClickGapMs.max': 220,
  'click.clickJitterPx.min': -2,
  'click.clickJitterPx.max': 2,
  'drag.holdBeforeMoveMs.min': 80,
  'drag.holdBeforeMoveMs.max': 220,
  'drag.releaseDelayMs.min': 60,
  'drag.releaseDelayMs.max': 180,
  'scroll.ticks.min': 1,
  'scroll.ticks.max': 4,
  'scroll.burstCount.min': 1,
  'scroll.burstCount.max': 3,
  'scroll.intervalMs.min': 80,
  'scroll.intervalMs.max': 220,
  'scroll.afterScrollMs.min': 120,
  'scroll.afterScrollMs.max': 360,
  'idle.durationMs.min': 1500,
  'idle.durationMs.max': 4800,
  'idle.steps.min': 42,
  'idle.steps.max': 84,
  'idle.radiusPx.min': 108,
  'idle.radiusPx.max': 540,
  'idle.shapeScale.min': 0.5,
  'idle.shapeScale.max': 1.5,
  'idle.aspectRatio.min': 0.62,
  'idle.aspectRatio.max': 1.48,
  'idle.rotationDeg.min': -28,
  'idle.rotationDeg.max': 28,
  'idle.jitterPx.min': -3,
  'idle.jitterPx.max': 3,
  'idle.clickProbability.min': 0,
  'idle.clickProbability.max': 0.08,
  'idle.scrollProbability.min': 0.02,
  'idle.scrollProbability.max': 0.14,
  'idle.scrollTicks.min': -3,
  'idle.scrollTicks.max': 3,
  'idle.scrollDriftPx.min': -3,
  'idle.scrollDriftPx.max': 3,
  'idle.scrollIntervalMs.min': 60,
  'idle.scrollIntervalMs.max': 220,
  'keyboard.keyDownUpMs.min': 35,
  'keyboard.keyDownUpMs.max': 110,
  'keyboard.keyIntervalMs.min': 45,
  'keyboard.keyIntervalMs.max': 160,
  'keyboard.textCharIntervalMs.min': 45,
  'keyboard.textCharIntervalMs.max': 180,
  'keyboard.beforeTypeMs.min': 80,
  'keyboard.beforeTypeMs.max': 260,
  'keyboard.afterTypeMs.min': 100,
  'keyboard.afterTypeMs.max': 320,
  'random.globalDelayFactor.min': 0.9,
  'random.globalDelayFactor.max': 1.25,
  'random.globalJitterFactor.min': 0.8,
  'random.globalJitterFactor.max': 1.3,
  'path.almostStraight': 28,
  'path.softCurve': 46,
  'path.multiSegment': 26,
  'overshoot.probability.min': 0.06,
  'overshoot.probability.max': 0.18,
  'overshoot.distancePx.min': 3,
  'overshoot.distancePx.max': 18,
  'overshoot.distanceRatio.min': 0.015,
  'overshoot.distanceRatio.max': 0.055,
  'overshoot.minTriggerDistancePx': 80,
  'overshoot.maxOvershootPx': 36,
  'micro.probability.min': 0.12,
  'micro.probability.max': 0.32,
  'micro.count.min': 1,
  'micro.count.max': 2,
  'micro.distancePx.min': 1,
  'micro.distancePx.max': 6,
  'micro.pauseBetweenMs.min': 25,
  'micro.pauseBetweenMs.max': 110,
  'hesitation.probability.min': 0.08,
  'hesitation.probability.max': 0.22,
  'hesitation.pauseCount.min': 1,
  'hesitation.pauseCount.max': 2,
  'hesitation.pauseDurationMs.min': 80,
  'hesitation.pauseDurationMs.max': 360,
  'hesitation.smallDriftPx.min': 0,
  'hesitation.smallDriftPx.max': 4,
  'target.innerPaddingRatio.min': 0.08,
  'target.innerPaddingRatio.max': 0.22,
  'target.centerBias.min': 0.35,
  'target.centerBias.max': 0.72,
  'target.avoidEdgePx.min': 2,
  'target.avoidEdgePx.max': 8,
  'target.avoidCornerPx.min': 4,
  'target.avoidCornerPx.max': 12,
  'humanClick.preClickPauseMs.min': 60,
  'humanClick.preClickPauseMs.max': 260,
  'humanClick.postClickPauseMs.min': 120,
  'humanClick.postClickPauseMs.max': 420,
  'humanClick.retryCount.min': 0,
  'humanClick.retryCount.max': 1,
  'humanClick.retryPauseMs.min': 160,
  'humanClick.retryPauseMs.max': 520,
  'humanScroll.beforeScrollMs.min': 80,
  'humanScroll.beforeScrollMs.max': 260,
  'humanScroll.reverseProbability.min': 0.03,
  'humanScroll.reverseProbability.max': 0.12,
  'humanScroll.reverseTicks.min': 1,
  'humanScroll.reverseTicks.max': 2,
  'humanScroll.afterObserveMs.min': 180,
  'humanScroll.afterObserveMs.max': 640,
  'rhythm.globalSpeedFactor.min': 0.9,
  'rhythm.globalSpeedFactor.max': 1.18,
  'rhythm.actionGapMs.min': 80,
  'rhythm.actionGapMs.max': 320,
  'rhythm.shortPauseProbability.min': 0.08,
  'rhythm.shortPauseProbability.max': 0.2,
  'rhythm.shortPauseMs.min': 300,
  'rhythm.shortPauseMs.max': 1100,
  'rhythm.longPauseProbability.min': 0.01,
  'rhythm.longPauseProbability.max': 0.04,
  'rhythm.longPauseMs.min': 1800,
  'rhythm.longPauseMs.max': 5200,
  'attention.beforeActionMs.min': 80,
  'attention.beforeActionMs.max': 280,
  'attention.afterActionMs.min': 160,
  'attention.afterActionMs.max': 560,
  'attention.pageObserveMs.min': 320,
  'attention.pageObserveMs.max': 1200,
  'attention.uncertaintyPauseMs.min': 500,
  'attention.uncertaintyPauseMs.max': 1800
};

/**
 * 常量：键鼠实验台布尔默认值。
 */
const INPUT_LAB_BOOLEAN_DEFAULTS = {
  'overshoot.enabled': true,
  'micro.enabled': true,
  'hesitation.enabled': true
};

/**
 * 常量：键鼠实验台字符串默认值。
 */
const INPUT_LAB_STRING_DEFAULTS = {
  'move.pathStyle': 'SoftCurve',
  'move.easeProfile': 'HumanVariable'
};

/**
 * 状态：首页当前页签。
 */
const stateHomeTab = ref('email');

/**
 * 状态：键鼠实验台数值。
 */
const stateInputLabNumberValues = reactive<Record<string, number>>({ ...INPUT_LAB_NUMBER_DEFAULTS });

/**
 * 状态：键鼠实验台布尔值。
 */
const stateInputLabBooleanValues = reactive<Record<string, boolean>>({ ...INPUT_LAB_BOOLEAN_DEFAULTS });

/**
 * 状态：键鼠实验台字符串值。
 */
const stateInputLabStringValues = reactive<Record<string, string>>({ ...INPUT_LAB_STRING_DEFAULTS });

/**
 * 状态：键鼠实验台当前动作。
 */
const stateInputLabAction = ref<TInputLabAction>('move_to');

/**
 * 状态：键鼠实验台是否 dry-run。
 */
const stateInputLabDryRun = ref(false);

/**
 * 状态：键鼠实验台连续动作步骤。
 */
const stateInputLabSteps = ref<IInputLabStep[]>([inputLabStepCreate('move_to'), inputLabStepCreate('click_current'), inputLabStepCreate('type_text')]);

/**
 * 状态：键鼠实验台目标点。
 */
const stateInputLabPoint = reactive<IInputLabPoint>({ x: 300, y: 240 });

/**
 * 状态：键鼠实验台拖拽起点。
 */
const stateInputLabFrom = reactive<IInputLabPoint>({ x: 280, y: 260 });

/**
 * 状态：键鼠实验台拖拽终点。
 */
const stateInputLabTo = reactive<IInputLabPoint>({ x: 520, y: 360 });

/**
 * 状态：键鼠实验台目标区域。
 */
const stateInputLabRect = reactive<IInputLabRect>({ x: 260, y: 220, width: 240, height: 96 });

/**
 * 状态：键鼠实验台拖拽起点区域。
 */
const stateInputLabFromRect = reactive<IInputLabRect>({ x: 240, y: 220, width: 180, height: 90 });

/**
 * 状态：键鼠实验台拖拽终点区域。
 */
const stateInputLabToRect = reactive<IInputLabRect>({ x: 560, y: 320, width: 180, height: 90 });

/**
 * 状态：键鼠实验台文本。
 */
const stateInputLabText = ref('真的不错 NASA OK!');

/**
 * 状态：键鼠实验台是否执行中。
 */
const stateInputLabExecuting = ref(false);

/**
 * 状态：键鼠实验台执行错误。
 */
const stateInputLabError = ref('');

/**
 * 状态：键鼠实验台执行结果。
 */
const stateInputLabResult = ref<IInputLabExecuteResponse | null>(null);

/**
 * 状态：鼠标路径录制采样间隔。
 */
const stateInputPathRecordSampleIntervalMs = ref(16);

/**
 * 状态：鼠标路径录制最长时间。
 */
const stateInputPathRecordMaxDurationMs = ref(15_000);

/**
 * 状态：鼠标路径是否正在录制。
 */
const stateInputPathRecordRecording = ref(false);

/**
 * 状态：鼠标路径录制是否正在请求。
 */
const stateInputPathRecordLoading = ref(false);

/**
 * 状态：鼠标路径录制错误。
 */
const stateInputPathRecordError = ref('');

/**
 * 状态：鼠标路径录制输出。
 */
const stateInputPathRecordOutput = ref('');

/**
 * 状态：鼠标路径录制结果。
 */
const stateInputPathRecordResult = ref<IInputPathRecordStopResponse | null>(null);

/**
 * 计算属性：首页页签徽章。
 */
const computedHomeTabBadge = computed(() => {
  if (stateHomeTab.value === 'email') {
    return '欢迎邮件测试';
  }

  if (stateHomeTab.value === 'podcast') {
    return '热搜播客测试';
  }

  return 'Rust 默认参数';
});

/**
 * 常量：路径风格选项。
 */
const INPUT_LAB_PATH_STYLE_OPTIONS = [
  { label: 'AlmostStraight', value: 'AlmostStraight' },
  { label: 'SoftCurve', value: 'SoftCurve' },
  { label: 'MultiSegment', value: 'MultiSegment' }
];

/**
 * 常量：缓动曲线选项。
 */
const INPUT_LAB_EASE_PROFILE_OPTIONS = [
  { label: 'Linear', value: 'Linear' },
  { label: 'EaseInOut', value: 'EaseInOut' },
  { label: 'HumanVariable', value: 'HumanVariable' }
];

/**
 * 函数：创建数值区间参数项。
 * @param {string} key 参数键
 * @param {string} label 参数标签
 * @param {string} description 参数说明
 * @param {number} step 步进值
 * @param {number} min 最小限制
 * @param {number} max 最大限制
 * @returns {object} 参数项
 */
const inputLabRangeItemCreate = (key: string, label: string, description: string, step: number, min: number, max: number) => ({
  kind: 'range',
  key,
  label,
  description,
  step,
  min,
  max,
  options: []
});

/**
 * 函数：创建单数值参数项。
 * @param {string} key 参数键
 * @param {string} label 参数标签
 * @param {string} description 参数说明
 * @param {number} step 步进值
 * @param {number} min 最小限制
 * @param {number} max 最大限制
 * @returns {object} 参数项
 */
const inputLabNumberItemCreate = (key: string, label: string, description: string, step: number, min: number, max: number) => ({
  kind: 'number',
  key,
  label,
  description,
  step,
  min,
  max,
  options: []
});

/**
 * 函数：创建开关参数项。
 * @param {string} key 参数键
 * @param {string} label 参数标签
 * @param {string} description 参数说明
 * @returns {object} 参数项
 */
const inputLabSwitchItemCreate = (key: string, label: string, description: string) => ({
  kind: 'switch',
  key,
  label,
  description,
  step: 1,
  min: 0,
  max: 1,
  options: []
});

/**
 * 函数：创建选择参数项。
 * @param {string} key 参数键
 * @param {string} label 参数标签
 * @param {string} description 参数说明
 * @param {{ label: string; value: string }[]} options 选项列表
 * @returns {object} 参数项
 */
const inputLabSelectItemCreate = (key: string, label: string, description: string, options: { label: string; value: string }[]) => ({
  kind: 'select',
  key,
  label,
  description,
  step: 1,
  min: 0,
  max: 1,
  options
});

/**
 * 计算属性：键鼠实验台参数分组。
 */
const inputLabParameterGroups = computed(() => [
  {
    title: '基础移动 MouseMoveProfile',
    icon: 'i-lucide:move',
    items: [
      inputLabRangeItemCreate('move.durationMs', 'duration_ms', '移动总耗时区间，单位毫秒。', 10, 0, 5000),
      inputLabRangeItemCreate('move.durationPerPxMs', 'duration_per_px_ms', '每像素耗时系数。', 0.01, 0, 5),
      inputLabRangeItemCreate('move.durationBounds', 'min/max_duration_ms', '移动耗时硬边界，单位毫秒。', 10, 1, 10000),
      inputLabRangeItemCreate('move.steps', 'steps', '移动拆分步数，最小值必须大于等于 2。', 1, 2, 200),
      inputLabRangeItemCreate('move.jitterPx', 'jitter_px', '中间路径点随机扰动，单位像素。', 1, -50, 50),
      inputLabRangeItemCreate('move.overshootPx', 'overshoot_px', '基础层越过回正距离，单位像素。', 1, 0, 120),
      inputLabRangeItemCreate('move.curveFactor', 'curve_factor', '主曲线弧度系数，每次移动随机方向与大小。', 0.01, 0, 1),
      inputLabRangeItemCreate('move.secondaryCurveFactor', 'secondary_curve_factor', '二段曲线弧度系数，用于让路径中途换向。', 0.01, 0, 1),
      inputLabRangeItemCreate('move.curveDirectionChangeProbability', 'curve_direction_change_probability', '曲线中途换向概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('move.speedFactor', 'speed_factor', '移动速度倍率区间。', 0.01, 0.1, 5),
      inputLabRangeItemCreate('move.splitMoveProbability', 'split_move_probability', '把一次目标移动拆成多段移动的概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('move.splitMoveCount', 'split_move_count', '分段移动段数，默认保持低比例触发。', 1, 1, 10),
      inputLabRangeItemCreate('move.splitMovePauseMs', 'split_move_pause_ms', '分段移动之间的随机等待，单位毫秒。', 10, 0, 5000),
      inputLabRangeItemCreate('move.settleMs', 'settle_ms', '到达目标后的停顿，单位毫秒。', 10, 0, 3000),
      inputLabSelectItemCreate('move.pathStyle', 'path_style', '基础层默认路径风格。', INPUT_LAB_PATH_STYLE_OPTIONS),
      inputLabSelectItemCreate('move.easeProfile', 'ease_profile', '基础层默认缓动曲线。', INPUT_LAB_EASE_PROFILE_OPTIONS)
    ]
  },
  {
    title: '基础点击 MouseClickProfile',
    icon: 'i-lucide:mouse-pointer-click',
    items: [
      inputLabRangeItemCreate('click.beforeClickMs', 'before_click_ms', '点击前等待，单位毫秒。', 10, 0, 3000),
      inputLabRangeItemCreate('click.downUpMs', 'down_up_ms', '按下到释放间隔，单位毫秒。', 5, 0, 1000),
      inputLabRangeItemCreate('click.afterClickMs', 'after_click_ms', '点击后等待，单位毫秒。', 10, 0, 3000),
      inputLabRangeItemCreate('click.doubleClickGapMs', 'double_click_gap_ms', '双击间隔，单位毫秒。', 5, 0, 1000),
      inputLabRangeItemCreate('click.clickJitterPx', 'click_jitter_px', '点击点扰动，单位像素。', 1, -50, 50)
    ]
  },
  {
    title: '基础拖拽 / 滚动 / 键盘',
    icon: 'i-lucide:keyboard',
    items: [
      inputLabRangeItemCreate('drag.holdBeforeMoveMs', 'drag.hold_before_move_ms', '拖拽按下后开始移动前等待。', 10, 0, 3000),
      inputLabRangeItemCreate('drag.releaseDelayMs', 'drag.release_delay_ms', '拖拽释放前等待。', 10, 0, 3000),
      inputLabRangeItemCreate('scroll.ticks', 'scroll.ticks', '单段滚轮刻度。', 1, -20, 20),
      inputLabRangeItemCreate('scroll.burstCount', 'scroll.burst_count', '滚动分段次数。', 1, 1, 20),
      inputLabRangeItemCreate('scroll.intervalMs', 'scroll.interval_ms', '滚动段间等待。', 10, 0, 3000),
      inputLabRangeItemCreate('scroll.afterScrollMs', 'scroll.after_scroll_ms', '滚动完成后等待。', 10, 0, 5000),
      inputLabRangeItemCreate('keyboard.keyDownUpMs', 'keyboard.key_down_up_ms', '按键按下到释放间隔。', 5, 0, 1000),
      inputLabRangeItemCreate('keyboard.keyIntervalMs', 'keyboard.key_interval_ms', '按键之间等待。', 5, 0, 2000),
      inputLabRangeItemCreate('keyboard.textCharIntervalMs', 'keyboard.text_char_interval_ms', '逐字输入字符间隔。', 5, 0, 2000),
      inputLabRangeItemCreate('keyboard.beforeTypeMs', 'keyboard.before_type_ms', '输入前等待。', 10, 0, 3000),
      inputLabRangeItemCreate('keyboard.afterTypeMs', 'keyboard.after_type_ms', '输入后等待。', 10, 0, 3000),
      inputLabRangeItemCreate('random.globalDelayFactor', 'random.global_delay_factor', '全局等待倍率。', 0.01, 0, 5),
      inputLabRangeItemCreate('random.globalJitterFactor', 'random.global_jitter_factor', '全局坐标扰动倍率。', 0.01, 0, 5)
    ]
  },
  {
    title: '无目标鼠标行为 MouseIdleProfile',
    icon: 'i-lucide:mouse',
    items: [
      inputLabRangeItemCreate('idle.durationMs', 'duration_ms', '无目标行为总耗时，单位毫秒。', 10, 0, 10000),
      inputLabRangeItemCreate('idle.steps', 'steps', '无目标轨迹采样点数量。', 1, 3, 240),
      inputLabRangeItemCreate('idle.radiusPx', 'radius_px', '随机游走基础活动半径，单位像素；一次无目的随机移动中会多次随机切换为 1 到 3 倍，并降低最高播放速度。', 1, 1, 1200),
      inputLabRangeItemCreate('idle.shapeScale', 'shape_scale', '录制样本倍率；圆圈、无限符号和连写 8 内部按半尺寸绘制，随机滚轮按原样本尺度移动。', 0.1, 0.1, 3),
      inputLabRangeItemCreate('idle.aspectRatio', 'aspect_ratio', '图形横纵比例扰动。', 0.01, 0.1, 5),
      inputLabRangeItemCreate('idle.rotationDeg', 'rotation_deg', '图形整体随机旋转角度。', 1, -180, 180),
      inputLabRangeItemCreate('idle.jitterPx', 'jitter_px', '无目标轨迹点扰动，单位像素；录制图形绘制时会缩减到三分之一。', 1, -80, 80),
      inputLabRangeItemCreate('idle.clickProbability', 'click_probability', '移动过程中随机点击概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('idle.scrollProbability', 'scroll_probability', '移动过程中随机滚轮概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('idle.scrollTicks', 'scroll_ticks', '随机滚轮刻度。', 1, -20, 20),
      inputLabRangeItemCreate('idle.scrollDriftPx', 'scroll_drift_px', '滚轮停留期间偶发微漂移像素。', 1, -50, 50),
      inputLabRangeItemCreate('idle.scrollIntervalMs', 'scroll_interval_ms', '滚轮动作之间的随机等待。', 10, 0, 5000)
    ]
  },
  {
    title: '人类路径 / 越过 / 微修正 / 犹豫',
    icon: 'i-lucide:route',
    items: [
      inputLabNumberItemCreate('path.almostStraight', 'path.almost_straight', '近似直线路径权重。', 1, 0, 1000),
      inputLabNumberItemCreate('path.softCurve', 'path.soft_curve', '柔和曲线路径权重。', 1, 0, 1000),
      inputLabNumberItemCreate('path.multiSegment', 'path.multi_segment', '分段路径权重。', 1, 0, 1000),
      inputLabSwitchItemCreate('overshoot.enabled', 'overshoot.enabled', '是否启用越过目标再回正。'),
      inputLabRangeItemCreate('overshoot.probability', 'overshoot.probability', '越过发生概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('overshoot.distancePx', 'overshoot.distance_px', '固定越过距离。', 1, 0, 200),
      inputLabRangeItemCreate('overshoot.distanceRatio', 'overshoot.distance_ratio', '按移动距离计算的越过比例。', 0.001, 0, 1),
      inputLabNumberItemCreate('overshoot.minTriggerDistancePx', 'overshoot.min_trigger_distance_px', '允许触发越过的最小移动距离。', 1, 0, 1000),
      inputLabNumberItemCreate('overshoot.maxOvershootPx', 'overshoot.max_overshoot_px', '最大越过距离。', 1, 0, 500),
      inputLabSwitchItemCreate('micro.enabled', 'micro.enabled', '是否启用目标附近微修正。'),
      inputLabRangeItemCreate('micro.probability', 'micro.probability', '微修正发生概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('micro.count', 'micro.count', '微修正次数。', 1, 1, 20),
      inputLabRangeItemCreate('micro.distancePx', 'micro.distance_px', '单次微修正距离。', 1, 0, 80),
      inputLabRangeItemCreate('micro.pauseBetweenMs', 'micro.pause_between_ms', '微修正之间停顿。', 5, 0, 2000),
      inputLabSwitchItemCreate('hesitation.enabled', 'hesitation.enabled', '是否启用移动前犹豫。'),
      inputLabRangeItemCreate('hesitation.probability', 'hesitation.probability', '犹豫发生概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('hesitation.pauseCount', 'hesitation.pause_count', '犹豫停顿次数。', 1, 1, 20),
      inputLabRangeItemCreate('hesitation.pauseDurationMs', 'hesitation.pause_duration_ms', '犹豫停顿时长。', 10, 0, 5000),
      inputLabRangeItemCreate('hesitation.smallDriftPx', 'hesitation.small_drift_px', '犹豫时小范围漂移。', 1, 0, 80)
    ]
  },
  {
    title: '人类目标点 / 点击 / 滚动 / 会话',
    icon: 'i-lucide:sliders-horizontal',
    items: [
      inputLabRangeItemCreate('target.innerPaddingRatio', 'target.inner_padding_ratio', '目标区域内部安全 padding 比例。', 0.01, 0, 0.49),
      inputLabRangeItemCreate('target.centerBias', 'target.center_bias', '偏向中心区域选点的概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('target.avoidEdgePx', 'target.avoid_edge_px', '边缘避让像素。', 1, 0, 100),
      inputLabRangeItemCreate('target.avoidCornerPx', 'target.avoid_corner_px', '角落避让像素。', 1, 0, 100),
      inputLabRangeItemCreate('humanClick.preClickPauseMs', 'click.pre_click_pause_ms', '策略层点击前等待。', 10, 0, 3000),
      inputLabRangeItemCreate('humanClick.postClickPauseMs', 'click.post_click_pause_ms', '策略层点击后等待。', 10, 0, 3000),
      inputLabRangeItemCreate('humanClick.retryCount', 'click.retry_count', '换点重试次数。', 1, 0, 10),
      inputLabRangeItemCreate('humanClick.retryPauseMs', 'click.retry_pause_ms', '换点重试间隔。', 10, 0, 5000),
      inputLabRangeItemCreate('humanScroll.beforeScrollMs', 'scroll.before_scroll_ms', '人类化滚动前等待。', 10, 0, 3000),
      inputLabRangeItemCreate('humanScroll.reverseProbability', 'scroll.reverse_micro_scroll_probability', '轻微反向滚动概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('humanScroll.reverseTicks', 'scroll.reverse_micro_scroll_ticks', '轻微反向滚动刻度。', 1, 0, 20),
      inputLabRangeItemCreate('humanScroll.afterObserveMs', 'scroll.after_scroll_observe_ms', '滚动后观察等待。', 10, 0, 5000),
      inputLabRangeItemCreate('rhythm.globalSpeedFactor', 'rhythm.global_speed_factor', '会话级速度倍率。', 0.01, 0.1, 5),
      inputLabRangeItemCreate('rhythm.actionGapMs', 'rhythm.action_gap_ms', '动作之间间隔。', 10, 0, 5000),
      inputLabRangeItemCreate('rhythm.shortPauseProbability', 'rhythm.short_pause_probability', '短暂停顿概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('rhythm.shortPauseMs', 'rhythm.short_pause_ms', '短暂停顿时长。', 10, 0, 10000),
      inputLabRangeItemCreate('rhythm.longPauseProbability', 'rhythm.long_pause_probability', '长停顿概率。', 0.01, 0, 1),
      inputLabRangeItemCreate('rhythm.longPauseMs', 'rhythm.long_pause_ms', '长停顿时长。', 10, 0, 30000),
      inputLabRangeItemCreate('attention.beforeActionMs', 'attention.before_action_ms', '动作前观察等待。', 10, 0, 5000),
      inputLabRangeItemCreate('attention.afterActionMs', 'attention.after_action_ms', '动作后观察等待。', 10, 0, 5000),
      inputLabRangeItemCreate('attention.pageObserveMs', 'attention.page_observe_ms', '页面观察等待。', 10, 0, 10000),
      inputLabRangeItemCreate('attention.uncertaintyPauseMs', 'attention.uncertainty_pause_ms', '不确定状态等待。', 10, 0, 10000)
    ]
  }
]);

/**
 * 事件：恢复键鼠实验台默认值。
 * @returns {void} 无返回值
 */
const handleInputLabDefaultsReset = (): void => {
  Object.assign(stateInputLabNumberValues, INPUT_LAB_NUMBER_DEFAULTS);
  Object.assign(stateInputLabBooleanValues, INPUT_LAB_BOOLEAN_DEFAULTS);
  Object.assign(stateInputLabStringValues, INPUT_LAB_STRING_DEFAULTS);
  stateInputLabDryRun.value = false;
  stateInputLabSteps.value = [inputLabStepCreate('move_to'), inputLabStepCreate('click_current'), inputLabStepCreate('type_text')];
};

/**
 * 函数：创建键鼠实验台点位。
 * @param {number} x X 坐标
 * @param {number} y Y 坐标
 * @returns {IInputLabPoint} 点位对象
 */
function inputLabPointCreate(x: number, y: number): IInputLabPoint {
  return { x, y };
}

/**
 * 函数：创建键鼠实验台矩形。
 * @param {number} x X 坐标
 * @param {number} y Y 坐标
 * @param {number} width 宽度
 * @param {number} height 高度
 * @returns {IInputLabRect} 矩形对象
 */
function inputLabRectCreate(x: number, y: number, width: number, height: number): IInputLabRect {
  return { x, y, width, height };
}

/**
 * 函数：创建键鼠实验台连续动作步骤。
 * @param {TInputLabAction} action 动作名称
 * @returns {IInputLabStep} 连续动作步骤
 */
function inputLabStepCreate(action: TInputLabAction): IInputLabStep {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    label: inputLabStepLabelGet(action),
    enabled: true,
    action,
    point: inputLabPointCreate(300, 240),
    from: inputLabPointCreate(280, 260),
    to: inputLabPointCreate(520, 360),
    rect: inputLabRectCreate(260, 220, 240, 96),
    fromRect: inputLabRectCreate(240, 220, 180, 90),
    toRect: inputLabRectCreate(560, 320, 180, 90),
    text: action === 'hotkey' ? 'Control+A' : action.includes('synthetic_ime') ? '真的不错 NASA OK!' : 'LofiTick input lab',
    keys: [],
    numbers: {
      'action.waitMs.min': 300,
      'action.waitMs.max': 900
    }
  };
}

/**
 * 函数：获取键鼠实验台步骤默认名称。
 * @param {TInputLabAction} action 动作名称
 * @returns {string} 默认名称
 */
function inputLabStepLabelGet(action: TInputLabAction): string {
  const option = INPUT_LAB_EXECUTE_ACTION_OPTIONS.find((item) => item.value === action);

  return option?.label.split(' - ')[1] || action;
}

/**
 * 事件：追加键鼠实验台连续动作步骤。
 * @param {TInputLabAction} action 动作名称
 * @returns {void} 无返回值
 */
const handleInputLabStepAppend = (action: TInputLabAction): void => {
  stateInputLabSteps.value.push(inputLabStepCreate(action));
};

/**
 * 事件：删除键鼠实验台连续动作步骤。
 * @param {number} index 步骤索引
 * @returns {void} 无返回值
 */
const handleInputLabStepRemove = (index: number): void => {
  stateInputLabSteps.value.splice(index, 1);
};

/**
 * 函数：复制键鼠实验台点位。
 * @param {IInputLabPoint} point 点位对象
 * @returns {IInputLabPoint} 点位副本
 */
const inputLabPointCopy = (point: IInputLabPoint): IInputLabPoint => ({
  x: point.x,
  y: point.y
});

/**
 * 函数：复制键鼠实验台矩形。
 * @param {IInputLabRect} rect 矩形对象
 * @returns {IInputLabRect} 矩形副本
 */
const inputLabRectCopy = (rect: IInputLabRect): IInputLabRect => ({
  x: rect.x,
  y: rect.y,
  width: rect.width,
  height: rect.height
});

/**
 * 函数：构建键鼠实验台执行请求。
 * @returns {IInputLabExecuteRequest} 执行请求
 */
const inputLabRequestBuild = (): IInputLabExecuteRequest => ({
  action: stateInputLabSteps.value.length > 0 ? 'move_to' : stateInputLabAction.value,
  steps: stateInputLabSteps.value,
  dryRun: stateInputLabDryRun.value,
  numbers: { ...stateInputLabNumberValues },
  booleans: { ...stateInputLabBooleanValues },
  strings: { ...stateInputLabStringValues },
  point: inputLabPointCopy(stateInputLabPoint),
  from: inputLabPointCopy(stateInputLabFrom),
  to: inputLabPointCopy(stateInputLabTo),
  rect: inputLabRectCopy(stateInputLabRect),
  fromRect: inputLabRectCopy(stateInputLabFromRect),
  toRect: inputLabRectCopy(stateInputLabToRect),
  text: stateInputLabText.value
});

/**
 * 函数：格式化键鼠实验台 JSON。
 * @param {unknown} input 输入内容
 * @returns {string} JSON 文本
 */
const inputLabJsonFormat = (input: unknown): string => JSON.stringify(input, null, 2);

/**
 * 函数：格式化键鼠实验台错误。
 * @param {unknown} error 原始错误
 * @returns {string} 错误文本
 */
const inputLabErrorFormat = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error || 'unknown input lab error');
};

/**
 * 常量：脚本生成模式。
 */
const podcastScriptModes = [
  { key: 'morning:short', edition: 'morning', length: 'short', labelKey: 'pages.home.podcastScript.actions.morningShort' },
  { key: 'morning:long', edition: 'morning', length: 'long', labelKey: 'pages.home.podcastScript.actions.morningLong' },
  { key: 'evening:short', edition: 'evening', length: 'short', labelKey: 'pages.home.podcastScript.actions.eveningShort' },
  { key: 'evening:long', edition: 'evening', length: 'long', labelKey: 'pages.home.podcastScript.actions.eveningLong' }
] as const;

/**
 * 函数：创建默认播客正文片段。
 * @param {THotsearchPodcastVoiceKey} voiceKey 播报角色
 * @param {string} content 文本内容
 * @param {THotsearchPodcastSegmentType} segmentType 片段类型
 * @returns {IPageHomePodcastScriptBodyItem} 默认正文片段
 */
const createPodcastBodyItem = (voiceKey: THotsearchPodcastVoiceKey = 'M', content = '', segmentType: THotsearchPodcastSegmentType = 'normal'): IPageHomePodcastScriptBodyItem => ({
  voiceKey,
  content,
  segmentType
});

/**
 * 函数：创建默认播客广告片段。
 * @param {THotsearchPodcastVoiceKey} voiceKey 播报角色
 * @param {string} content 文本内容
 * @returns {IPageHomePodcastScriptAdvertisementItem} 默认广告片段
 */
const createPodcastAdvertisementItem = (voiceKey: THotsearchPodcastVoiceKey = 'M', content = ''): IPageHomePodcastScriptAdvertisementItem => ({
  voiceKey,
  content,
  segmentType: 'adContent'
});

/**
 * 状态：默认收件邮箱。
 */
const stateTargetEmail = 'kwooshung@qq.com';

/**
 * 状态：结果是否展示。
 */
const stateResultVisible = ref(false);

/**
 * 状态：结果是否成功。
 */
const stateResultSuccess = ref(false);

/**
 * 状态：结果文案。
 */
const stateResultMessage = ref('');

/**
 * 状态：当前脚本结果。
 */
const statePodcastScriptDatas = ref<IPageHomePodcastScriptGenerateResponse | null>(null);

/**
 * 状态：是否切换到 bilibili 平台测试。
 */
const statePodcastUseBilibiliScope = ref(false);

/**
 * 状态：广告开头测试内容。
 */
const statePodcastAdOpeningItems = ref<IPageHomePodcastScriptAdvertisementItem[]>([
  createPodcastAdvertisementItem('M', '首先感谢小米手机对本期节目的陪伴支持。'),
  createPodcastAdvertisementItem('F', '不管是日常通勤刷资讯、宅家追更看视频，还是出门随手拍风景，小米全系机型都能适配各种生活场景。'),
  createPodcastAdvertisementItem('M', '旗舰机有 2nm 旗舰性能和全焦段影像，千元机也兼顾超长续航和耐用性。'),
  createPodcastAdvertisementItem('F', '再加上澎湃 OS 2.0 带来的流畅体验，从高端到入门几乎把全价位段都覆盖到了。'),
  createPodcastAdvertisementItem('M', '现在配合国补入手会更划算，想换机的话，闭眼选也不容易踩雷。'),
  createPodcastAdvertisementItem('F', '感谢小米手机对本期节目的大力支持。')
]);

/**
 * 状态：广告结尾测试内容。
 */
const statePodcastAdClosingItems = ref<IPageHomePodcastScriptAdvertisementItem[]>([
  createPodcastAdvertisementItem('F', '节目的最后，也把这次赞助信息留给你。洛菲效率时钟不是单纯多一个计时器，而是把一天里最容易断掉的专注、计划和复盘重新串回到同一个节奏里。'),
  createPodcastAdvertisementItem('M', '如果你最近也在找一个更顺手的桌面效率工具，可以去节目说明里的入口看看。感谢这次赞助支持，我们下一期接着聊。')
]);

/**
 * 状态：正文测试片段。
 */
const statePodcastScriptBodyItems = ref<IPageHomePodcastScriptBodyItem[]>([
  createPodcastBodyItem('M', '今天这条热搜我一开始真没太当回事，觉得又是一条大家刷两下就过去的话题。结果越往下看越不对，大家表面上像在吵一句话，实际上已经开始借这件事翻旧账了。'),
  createPodcastBodyItem('F', '对，我也是这种感觉。前面看着还是玩梗、截图、复读那一套，但你多刷几条就会发现，评论区已经不是单纯围观了，很多人明显是在拿自己的经历往里对。'),
  createPodcastBodyItem('M', '所以它后面才会一下子变重，因为话题只要开始碰到平台怎么处理、当事人怎么回应、大家还愿不愿意继续信，这个东西就不会是热度过去就算了。'),
  createPodcastBodyItem('F', '我们这一段也就不急着把过程从头捋到尾了，先挑几个最有代表性的讨论点聊一聊，看看这一波到底是大家反应过头了，还是有些问题本来就一直卡在那里。')
]);

/**
 * 状态：当前生成模式。
 */
const stateGeneratingMode = ref('');

/**
 * API：生成欢迎邮件。
 */
const {
  datas: stateWelcomeEmailDatas,
  loading: stateWelcomeEmailLoading,
  refresh: refreshWelcomeEmail
} = await useApi<IPageHomeWelcomeEmailPayload>('email/welcome', {
  method: 'POST',
  immediate: false
});

/**
 * API：发送邮件。
 */
const {
  datas: stateEmailSendDatas,
  loading: stateEmailSendLoading,
  refresh: refreshEmailSend
} = await useApi<IPageHomeSendWelcomeEmailResponse>('email/send', {
  method: 'POST',
  immediate: false
});

/**
 * Hook：热搜播客脚本。
 */
const hotsearchScript = useTauriHotsearchScript();

/**
 * Hook：Tauri 播客任务。
 */
const tauriPodcast = useTauriPodcast();

/**
 * Hook：Tauri 键鼠实验台。
 */
const tauriInputLab = useTauriInputLab();

/**
 * Hook：Tauri 窗口。
 */
const tauriWindow = useTauriWindow();

/**
 * Hook：Tauri 环境。
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * 状态：是否正在生成脚本。
 */
const statePodcastScriptLoading = ref(false);

/**
 * 状态：当前播客音频受理结果。
 */
const statePodcastAudioAccepted = ref<ITauriPodcastGenerateAccepted | null>(null);

/**
 * 状态：当前播客任务快照。
 */
const statePodcastTaskSnapshot = ref<ITauriPodcastTaskSnapshot | null>(null);

/**
 * 状态：是否正在发起播客音频生成。
 */
const statePodcastAudioLoading = ref(false);

/**
 * 状态：播客音频生成错误。
 */
const statePodcastAudioError = ref('');

/**
 * 变量：取消订阅播客任务事件句柄。
 */
let unlistenPodcastTaskEvent: UnlistenFn | null = null;

/**
 * 计算属性：是否正在发送。
 */
const computedSending = computed(() => stateWelcomeEmailLoading.value || stateEmailSendLoading.value);

/**
 * 计算属性：播报角色选项。
 */
const computedPodcastVoiceOptions = computed(() =>
  hotsearchPodcastVoiceOptionsGet().map((item) => ({
    value: item.value,
    label: t(item.key)
  }))
);

/**
 * 计算属性：片段类型选项。
 */
const computedPodcastSegmentOptions = computed(() =>
  hotsearchPodcastSegmentOptionsGet('body').map((item) => ({
    value: item.value,
    label: t(item.key)
  }))
);

/**
 * 计算属性：是否允许生成播客脚本。
 */
const computedCanGeneratePodcastScript = computed(() => statePodcastScriptBodyItems.value.some((item) => String(item.content || '').trim() !== '') && !statePodcastScriptLoading.value);

/**
 * 计算属性：是否正在处理播客音频任务。
 */
const computedPodcastAudioBusy = computed(() => {
  /**
   * 常量：status。
   */
  const status = statePodcastTaskSnapshot.value?.status;
  return statePodcastAudioLoading.value || status === 'accepted' || status === 'running';
});

/**
 * 计算属性：是否允许生成播客音频。
 */
const computedCanGeneratePodcastAudio = computed(() => {
  return Boolean(statePodcastScriptDatas.value) && !statePodcastScriptLoading.value && !computedPodcastAudioBusy.value;
});

/**
 * 计算属性：当前媒体平台英文名。
 */
const computedPodcastMediaPlatformName = computed<string | undefined>(() => (statePodcastUseBilibiliScope.value ? 'bilibili' : undefined));

/**
 * 计算属性：当前播客输出文件路径。
 */
const computedPodcastFinalFilePath = computed(() => statePodcastTaskSnapshot.value?.result?.finalFilePath || '');

/**
 * 计算属性：当前播客输出目录。
 */
const computedPodcastOutputDirectory = computed(() => podcastOutputDirectoryGet(computedPodcastFinalFilePath.value));

/**
 * 计算属性：播客任务提示标题。
 */
const computedPodcastTaskTitle = computed(() => {
  /**
   * 常量：status。
   */
  const status = statePodcastTaskSnapshot.value?.status;

  if (!status) {
    return '';
  }

  if (status === 'failed') {
    return t('pages.home.podcastScript.result.audio.errorTitle');
  }

  return t('pages.home.podcastScript.result.audio.statusTitle');
});

/**
 * 计算属性：播客任务提示颜色。
 */
const computedPodcastTaskColor = computed(() => {
  /**
   * 常量：status。
   */
  const status = statePodcastTaskSnapshot.value?.status;

  if (status === 'succeeded') {
    return 'success';
  }

  if (status === 'failed') {
    return 'error';
  }

  if (status === 'canceled') {
    return 'warning';
  }

  return 'primary';
});

/**
 * 计算属性：播客任务提示文案。
 */
const computedPodcastTaskDescription = computed(() => podcastTaskDescriptionGet(statePodcastTaskSnapshot.value));

/**
 * 事件：发送欢迎邮件。
 */
const handleSendWelcomeEmail = async (): Promise<void> => {
  stateResultVisible.value = false;

  try {
    await refreshWelcomeEmail({ datas: { locale: locale.value }, replace: true });

    /**
     * 常量：payload。
     */
    const payload = stateWelcomeEmailDatas.value;
    if (!payload || !payload.subject || !payload.html) {
      throw new Error('welcome payload missing');
    }

    await refreshEmailSend({
      datas: {
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        to: payload.to
      },
      replace: true
    });

    stateResultVisible.value = true;
    stateResultSuccess.value = true;
    stateResultMessage.value = t('pages.home.welcomeEmail.result.success', {
      count: Number(stateEmailSendDatas.value?.toCount ?? payload.to.length),
      email: stateTargetEmail
    });
  } catch {
    stateResultVisible.value = true;
    stateResultSuccess.value = false;
    stateResultMessage.value = t('pages.home.welcomeEmail.result.error', {
      email: stateTargetEmail
    });
  }
};

/**
 * 函数：重置当前播客音频任务状态。
 * @returns {void} 无返回值
 */
const resetPodcastAudioState = (): void => {
  statePodcastAudioAccepted.value = null;
  statePodcastTaskSnapshot.value = null;
  statePodcastAudioError.value = '';
};

/**
 * 函数：提取播客输出目录。
 * @param {string} finalFilePath 最终文件路径
 * @returns {string} 输出目录
 */
const podcastOutputDirectoryGet = (finalFilePath: string): string => {
  /**
   * 函数：normalized。
   */
  const normalized = String(finalFilePath || '').trim();
  if (!normalized) {
    return '';
  }

  return normalized.replace(/[\\/][^\\/]+$/, '');
};

/**
 * 函数：提取播客错误原文。
 * @param {unknown} input 原始错误输入
 * @returns {string} 错误原文
 */
const podcastAudioErrorRawGet = (input: unknown): string => {
  if (typeof input === 'string') {
    return input.trim();
  }

  if (input instanceof Error) {
    return String(input.message || '').trim();
  }

  return '';
};

/**
 * 函数：格式化播客错误提示文案。
 * @param {unknown} input 原始错误输入
 * @returns {string} 面向用户的错误提示
 */
const podcastAudioErrorMessageFormat = (input: unknown): string => {
  /**
   * 常量：raw。
   */
  const raw = podcastAudioErrorRawGet(input);
  if (!raw) {
    return t('pages.home.podcastScript.result.audio.errorFallback');
  }

  if (raw.toLowerCase().includes('redis: nil')) {
    return t('pages.home.podcastScript.result.audio.errorVolcRedisNil', { raw });
  }

  return raw;
};

/**
 * 函数：构建播客任务提示文案。
 * @param {ITauriPodcastTaskSnapshot | null} snapshot 当前任务快照
 * @returns {string} 提示文案
 */
const podcastTaskDescriptionGet = (snapshot: ITauriPodcastTaskSnapshot | null): string => {
  if (!snapshot) {
    return t('pages.home.podcastScript.result.audio.statusIdle');
  }

  if (snapshot.status === 'accepted') {
    return t('pages.home.podcastScript.result.audio.statusAccepted');
  }

  if (snapshot.status === 'running') {
    return t('pages.home.podcastScript.result.audio.statusRunning', {
      phase: t(`pages.home.podcastScript.result.audio.phases.${snapshot.phase}`)
    });
  }

  if (snapshot.status === 'succeeded') {
    return t('pages.home.podcastScript.result.audio.statusSucceeded', {
      path: snapshot.result?.finalFilePath || ''
    });
  }

  if (snapshot.status === 'canceled') {
    return t('pages.home.podcastScript.result.audio.statusCanceled');
  }

  return t('pages.home.podcastScript.result.audio.statusFailed', {
    message: podcastAudioErrorMessageFormat(snapshot.lastError)
  });
};

/**
 * 函数：构造正文请求片段。
 * @returns {IPageHomePodcastScriptBodyItem[]} 结构化正文片段
 */
const buildPodcastScriptBodyItems = (): IPageHomePodcastScriptBodyItem[] =>
  statePodcastScriptBodyItems.value
    .map((item) => ({
      voiceKey: item.voiceKey,
      content: String(item.content ?? ''),
      segmentType: item.segmentType
    }))
    .filter((item) => item.content.trim() !== '');

/**
 * 函数：构造广告请求片段。
 * @param {IPageHomePodcastScriptAdvertisementItem[]} items 广告片段列表
 * @returns {IPageHomePodcastScriptAdvertisementItem[]} 结构化广告片段列表
 */
const buildPodcastAdvertisementItems = (items: IPageHomePodcastScriptAdvertisementItem[]): IPageHomePodcastScriptAdvertisementItem[] =>
  items
    .map((item) => ({
      voiceKey: item.voiceKey,
      content: String(item.content ?? ''),
      segmentType: 'adContent' as const
    }))
    .filter((item) => item.content.trim() !== '');

/**
 * 事件：新增正文片段。
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemAppend = (): void => {
  statePodcastScriptBodyItems.value.push(createPodcastBodyItem());
};

/**
 * 事件：移除正文片段。
 * @param {number} index 片段索引
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemRemove = (index: number): void => {
  statePodcastScriptBodyItems.value.splice(index, 1);
};

/**
 * 事件：更新正文片段角色。
 * @param {number} index 片段索引
 * @param {THotsearchPodcastVoiceKey} value 角色值
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemVoiceUpdate = (index: number, value: THotsearchPodcastVoiceKey): void => {
  /**
   * 常量：item。
   */
  const item = statePodcastScriptBodyItems.value[index];

  if (!item) {
    return;
  }

  item.voiceKey = value;
};

/**
 * 事件：更新正文片段内容。
 * @param {number} index 片段索引
 * @param {string} value 文本内容
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemContentUpdate = (index: number, value: string): void => {
  /**
   * 常量：item。
   */
  const item = statePodcastScriptBodyItems.value[index];

  if (!item) {
    return;
  }

  item.content = value;
};

/**
 * 事件：更新广告开头角色。
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningItemAppend = (): void => {
  statePodcastAdOpeningItems.value.push(createPodcastAdvertisementItem());
};

/**
 * 事件：移除广告开头片段。
 * @param {number} index 片段索引
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningItemRemove = (index: number): void => {
  statePodcastAdOpeningItems.value.splice(index, 1);
};

/**
 * 事件：更新广告开头角色。
 * @param {number} index 片段索引
 * @param {THotsearchPodcastVoiceKey} value 角色值
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningVoiceUpdate = (index: number, value: THotsearchPodcastVoiceKey): void => {
  /**
   * 常量：item。
   */
  const item = statePodcastAdOpeningItems.value[index];

  if (!item) {
    return;
  }

  item.voiceKey = value;
};

/**
 * 事件：更新广告开头内容。
 * @param {number} index 片段索引
 * @param {string} value 文本内容
 * @returns {void} 无返回值
 */
const handlePodcastAdOpeningContentUpdate = (index: number, value: string): void => {
  /**
   * 常量：item。
   */
  const item = statePodcastAdOpeningItems.value[index];

  if (!item) {
    return;
  }

  item.content = value;
};

/**
 * 事件：新增广告结尾片段。
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingItemAppend = (): void => {
  statePodcastAdClosingItems.value.push(createPodcastAdvertisementItem());
};

/**
 * 事件：移除广告结尾片段。
 * @param {number} index 片段索引
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingItemRemove = (index: number): void => {
  statePodcastAdClosingItems.value.splice(index, 1);
};

/**
 * 事件：更新广告结尾角色。
 * @param {number} index 片段索引
 * @param {THotsearchPodcastVoiceKey} value 角色值
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingVoiceUpdate = (index: number, value: THotsearchPodcastVoiceKey): void => {
  /**
   * 常量：item。
   */
  const item = statePodcastAdClosingItems.value[index];

  if (!item) {
    return;
  }

  item.voiceKey = value;
};

/**
 * 事件：更新广告结尾内容。
 * @param {number} index 片段索引
 * @param {string} value 文本内容
 * @returns {void} 无返回值
 */
const handlePodcastAdClosingContentUpdate = (index: number, value: string): void => {
  /**
   * 常量：item。
   */
  const item = statePodcastAdClosingItems.value[index];

  if (!item) {
    return;
  }

  item.content = value;
};

/**
 * 事件：更新正文片段类型。
 * @param {number} index 片段索引
 * @param {ISettingsHotsearchPodcastSegmentType} value 片段类型
 * @returns {void} 无返回值
 */
const handlePodcastBodyItemSegmentTypeUpdate = (index: number, value: THotsearchPodcastSegmentType): void => {
  /**
   * 常量：item。
   */
  const item = statePodcastScriptBodyItems.value[index];

  if (!item) {
    return;
  }

  item.segmentType = value;
};

/**
 * 事件：生成播客脚本。
 * @param {'morning' | 'evening'} edition 时段
 * @param {'short' | 'long'} length 篇幅
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastScriptGenerate = async (edition: TPageHomePodcastEdition, length: TPageHomePodcastLength): Promise<void> => {
  stateGeneratingMode.value = `${edition}:${length}`;
  statePodcastScriptLoading.value = true;
  resetPodcastAudioState();

  try {
    statePodcastScriptDatas.value = await hotsearchScript.build({
      edition,
      length,
      mediaPlatformName: computedPodcastMediaPlatformName.value,
      adOpeningItems: computedPodcastMediaPlatformName.value ? buildPodcastAdvertisementItems(statePodcastAdOpeningItems.value) : [],
      adClosingItems: computedPodcastMediaPlatformName.value ? buildPodcastAdvertisementItems(statePodcastAdClosingItems.value) : [],
      bodyItems: buildPodcastScriptBodyItems()
    });
  } finally {
    statePodcastScriptLoading.value = false;
    stateGeneratingMode.value = '';
  }
};

/**
 * 事件：生成播客音频。
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastAudioGenerate = async (): Promise<void> => {
  if (!statePodcastScriptDatas.value) {
    return;
  }

  statePodcastAudioLoading.value = true;
  statePodcastAudioError.value = '';

  try {
    /**
     * 常量：accepted。
     */
    const accepted = await hotsearchScript.generate(statePodcastScriptDatas.value);
    statePodcastAudioAccepted.value = accepted;
    statePodcastTaskSnapshot.value = await tauriPodcast.taskGet(accepted.taskId);
  } catch (error) {
    statePodcastAudioError.value = podcastAudioErrorMessageFormat(error);
  } finally {
    statePodcastAudioLoading.value = false;
  }
};

/**
 * 事件：打开播客输出目录。
 * @returns {Promise<void>} 无返回值
 */
const handlePodcastOutputDirectoryOpen = async (): Promise<void> => {
  if (!computedPodcastOutputDirectory.value) {
    return;
  }

  await tauriWindow.openDirectory(computedPodcastOutputDirectory.value);
};

/**
 * 事件：执行键鼠实验台动作。
 * @returns {Promise<void>} 无返回值
 */
const handleInputLabExecute = async (): Promise<void> => {
  stateInputLabExecuting.value = true;
  stateInputLabError.value = '';
  stateInputLabResult.value = null;

  try {
    stateInputLabResult.value = await tauriInputLab.execute(inputLabRequestBuild());
  } catch (error) {
    stateInputLabError.value = inputLabErrorFormat(error);
  } finally {
    stateInputLabExecuting.value = false;
  }
};

/**
 * 事件：开始录制鼠标路径。
 * @returns {Promise<void>} 无返回值
 */
const handleInputPathRecordStart = async (): Promise<void> => {
  stateInputPathRecordLoading.value = true;
  stateInputPathRecordError.value = '';
  stateInputPathRecordResult.value = null;
  stateInputPathRecordOutput.value = '';

  try {
    const response = await tauriInputLab.recordStart({
      sampleIntervalMs: stateInputPathRecordSampleIntervalMs.value,
      maxDurationMs: stateInputPathRecordMaxDurationMs.value
    });
    stateInputPathRecordRecording.value = response.recording;
  } catch (error) {
    stateInputPathRecordError.value = inputLabErrorFormat(error);
  } finally {
    stateInputPathRecordLoading.value = false;
  }
};

/**
 * 事件：停止录制鼠标路径。
 * @returns {Promise<void>} 无返回值
 */
const handleInputPathRecordStop = async (): Promise<void> => {
  stateInputPathRecordLoading.value = true;
  stateInputPathRecordError.value = '';

  try {
    const response = await tauriInputLab.recordStop();
    stateInputPathRecordRecording.value = response.recording;
    stateInputPathRecordResult.value = response;
    stateInputPathRecordOutput.value = inputLabJsonFormat(response);
  } catch (error) {
    stateInputPathRecordError.value = inputLabErrorFormat(error);
  } finally {
    stateInputPathRecordLoading.value = false;
  }
};

/**
 * 事件：清空鼠标路径录制输出。
 * @returns {void} 无返回值
 */
const handleInputPathRecordOutputClear = (): void => {
  stateInputPathRecordResult.value = null;
  stateInputPathRecordOutput.value = '';
  stateInputPathRecordError.value = '';
};

/**
 * 生命周期：组件挂载。
 */
onMounted(async () => {
  if (!import.meta.client || !isTauriRuntime.value) {
    return;
  }

  unlistenPodcastTaskEvent = await tauriPodcast.onTaskEvent((event) => {
    if (event.taskId !== statePodcastAudioAccepted.value?.taskId) {
      return;
    }

    statePodcastTaskSnapshot.value = event.snapshot;
  });
});

/**
 * 生命周期：组件卸载。
 */
onBeforeUnmount(() => {
  if (unlistenPodcastTaskEvent) {
    unlistenPodcastTaskEvent();
    unlistenPodcastTaskEvent = null;
  }
});

/**
 * Store：面包屑。
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * 设置面包屑导航状态。
 */
storeBreadcrumb.states = [
  {
    label: t('pages.home.title'),
    icon: 'i-proicons:settings',
    to: localePath('/'),
    exact: true
  }
];
</script>
