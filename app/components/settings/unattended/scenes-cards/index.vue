<template>
  <DefineMachineHeaderTemplate v-slot="{ machine, actionsVariant }">
    <div class="mb-3 flex min-w-0 items-start gap-2">
      <h3 class="text-lg font-medium whitespace-nowrap">{{ machine.machineName || t('components.sentinel.scenes.card.machine.unnamed') }}</h3>
      <UBadge :color="isLocalMachine(machine.machineCode) ? 'primary' : 'warning'" variant="soft">
        {{ isLocalMachine(machine.machineCode) ? t('components.sentinel.scenes.card.machine.local') : t('components.sentinel.scenes.card.machine.remote') }}
      </UBadge>
    </div>

    <ul :class="['space-y-1 text-sm', actionsVariant === 'card' ? 'mb-3 pb-3' : '']">
      <li class="mb-1 flex items-center gap-2">
        <div class="flex w-20 items-center gap-1">
          <UIcon name="i-ic:outline-computer" class="text-dimmed" />
          <span class="text-muted shrink-0">{{ t('components.sentinel.scenes.card.fields.machineCode') }}</span>
        </div>
        <span class="min-w-0 flex-1 break-all">{{ machine.machineCode || '-' }}</span>
        <UTooltip v-if="String(machine.machineCode || '').trim()" :text="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" :content="{ side: 'right' }">
          <UButton
            :color="copiedGet(`${machine.machineCode}|info|code`) ? 'success' : 'neutral'"
            variant="link"
            size="sm"
            :icon="copiedGet(`${machine.machineCode}|info|code`) ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            :aria-label="t('components.sentinel.scenes.card.tooltips.copyToClipboard')"
            @click.stop="handleIpCopy(`${machine.machineCode}|info|code`, String(machine.machineCode || ''))"
          />
        </UTooltip>
      </li>
      <li :ref="remarkInputWrapRef(machine.machineCode)" class="mb-1 flex items-center gap-2">
        <div class="flex w-20 items-center gap-1">
          <UIcon name="i-lucide:sticky-note" class="text-dimmed" />
          <span class="text-muted shrink-0">{{ t('components.sentinel.scenes.card.fields.machineRemark') }}</span>
        </div>
        <template v-if="remarkEditingGet(machine.machineCode)">
          <div class="min-w-0 flex-1">
            <UInput :model-value="remarkDraftGet(machine.machineCode)" size="sm" class="w-full" @update:model-value="(value) => handleRemarkDraftUpdate(machine.machineCode, value)" @keydown.enter.prevent="handleRemarkSave(machine)" @keydown.esc.prevent="handleRemarkEditCancel(machine)" />
          </div>
          <UTooltip :text="t('components.sentinel.scenes.card.tooltips.saveRemark')" :content="{ side: 'right' }">
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-save" :aria-label="t('components.sentinel.scenes.card.tooltips.saveRemark')" @click.stop="handleRemarkSave(machine)" />
          </UTooltip>
        </template>
        <template v-else>
          <span class="min-w-0 flex-1 break-all">{{ machine.machineRemark || '-' }}</span>
          <UTooltip :text="t('components.sentinel.scenes.card.tooltips.editRemark')" :content="{ side: 'right' }">
            <UButton color="neutral" variant="link" size="sm" icon="i-material-symbols:edit-outline" :aria-label="t('components.sentinel.scenes.card.tooltips.editRemark')" @click.stop="handleRemarkEditStart(machine)" />
          </UTooltip>
        </template>
      </li>
    </ul>
  </DefineMachineHeaderTemplate>

  <div class="3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    <div v-for="machine in computedMachines" :key="machine.machineCode" class="bg-elevated/50 overflow-hidden rounded-xl p-5 select-none">
      <ReuseMachineHeaderTemplate :machine="machine" actions-variant="card" />
      <div class="mb-3 pb-3">
        <UPageGrid class="gap-2 text-sm">
          <UPageCard icon="i-tabler:layout-grid" :title="t('components.sentinel.scenes.card.stats.scenes')" :description="String(scenesCountTotalGet(machine))" :ui="{ container: 'sm:py-2 sm:px-3 px-3 py-2' }" />
          <UPageCard icon="i-material-symbols:check-circle-outline" :title="t('components.sentinel.scenes.card.stats.enabled')" :description="String(scenesCountEnabledGet(machine))" :ui="{ container: 'sm:py-2 sm:px-3 px-3 py-2' }" />
          <UPageCard icon="i-material-symbols:cancel-outline" :title="t('components.sentinel.scenes.card.stats.disabled')" :description="String(scenesCountDisabledGet(machine))" :ui="{ container: 'sm:py-2 sm:px-3 px-3 py-2' }" />
        </UPageGrid>
      </div>
      <div class="border-default flex items-center justify-between gap-3 border-t pt-3">
        <div class="flex items-center gap-2">
          <UPopover v-if="!isLocalMachine(machine.machineCode)" :content="{ side: 'top', align: 'start', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-56 z-51' }">
            <UButton color="error" variant="soft" icon="i-lucide:trash-2" size="sm">{{ t('components.sentinel.scenes.card.actions.deleteMachine') }}</UButton>
            <template #content="{ close }">
              <div class="flex flex-col gap-2">
                <div class="text-highlighted text-sm font-medium">{{ t('components.sentinel.scenes.card.dialogs.deleteMachineTitle') }}</div>
                <div class="text-muted text-xs break-all">{{ machine.machineName || machine.machineCode || '-' }}</div>
                <div class="flex items-center justify-end gap-2 pt-1">
                  <UButton color="neutral" variant="outline" size="xs" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                  <UButton color="error" variant="solid" size="xs" @click="() => handleMachineDeleteConfirm(machine, close)">{{ t('common.actions.confirm') }}</UButton>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
        <div class="flex items-center gap-2">
          <UButton v-if="isLocalMachine(machine.machineCode)" icon="i-material-symbols:add-ad-outline-rounded" color="primary" size="sm" variant="soft" @click.stop="handleScenesAddClickByVariant('card')">{{ t('components.sentinel.scenes.card.actions.addScene') }}</UButton>
          <UButton icon="i-mdi:network-outline" color="primary" size="sm" variant="outline" @click.stop="handleMachineNetworkOpen(machine.machineCode)">{{ t('components.sentinel.scenes.card.actions.network') }}</UButton>
          <UButton icon="i-material-symbols:info-outline" color="primary" size="sm" variant="outline" @click.stop="handleMachineOpen(machine.machineCode)">{{ t('components.sentinel.scenes.card.actions.details') }}</UButton>
        </div>
      </div>
    </div>
  </div>

  <USlideover v-model:open="stateOpen" :title="computedSlideoverTitle" side="right" :ui="{ title: 'min-w-0 flex-1 font-normal', close: '-translate-y-1 shrink-0' }">
    <template #title>
      <template v-if="computedActiveMachine">
        <div class="w-102 min-w-0 font-normal">
          <ReuseMachineHeaderTemplate :machine="computedActiveMachine" actions-variant="slideover" :truncate="false" />
        </div>
      </template>
      <template v-else>
        <div class="text-lg font-medium">{{ computedSlideoverTitle }}</div>
      </template>
    </template>
    <template #body>
      <div v-if="computedActiveMachine" class="space-y-5">
        <section class="space-y-4">
          <div class="border-default flex items-center justify-between gap-3 border-b pb-3">
            <div class="flex min-w-0 items-center gap-2">
              <div class="text-highlighted text-lg font-medium">{{ t('components.sentinel.scenes.card.fields.scenes') }}</div>
              <UBadge color="neutral" variant="soft">{{ computedActiveMachine.items.length }}</UBadge>
            </div>
            <UButton v-if="isLocalMachine(computedActiveMachine.machineCode)" icon="i-material-symbols:add-ad-outline-rounded" color="primary" size="sm" variant="soft" @click.stop="handleScenesAddClickByVariant('slideover')">
              {{ t('components.sentinel.scenes.card.actions.addScene') }}
            </UButton>
          </div>

          <div v-if="computedActiveMachine.items.length > 0" class="space-y-3">
            <article v-for="item in computedActiveMachine.items" :key="item.id" class="bg-elevated/40 ring-default space-y-4 rounded-xl p-4 ring-1">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1 space-y-2">
                  <div class="flex min-w-0 flex-wrap items-center gap-2">
                    <div class="text-highlighted min-w-0 text-lg font-medium break-all">{{ item.sceneName || t('components.sentinel.scenes.card.scene.unnamed') }}</div>
                    <UBadge :color="item.enabled ? 'success' : 'neutral'" variant="soft">{{ item.enabled ? t('components.sentinel.scenes.card.scene.enabled') : t('components.sentinel.scenes.card.scene.disabled') }}</UBadge>
                  </div>

                  <div class="text-muted flex min-w-0 items-start gap-2 text-xs">
                    <UIcon name="i-material-symbols:terminal-rounded" class="mt-0.5 shrink-0" />
                    <span class="min-w-0 break-all">{{ scenesCommandTextGet(item.execPath, item.args) || '-' }}</span>
                  </div>
                </div>

                <template v-if="isLocalMachine(computedActiveMachine.machineCode)">
                  <USwitch :model-value="Boolean(item.enabled)" @update:model-value="(v: boolean) => emit('toggle-enabled', { id: String(item.id || ''), enabled: Boolean(v) })" />
                </template>
              </div>

              <div class="grid gap-3 xl:grid-cols-2">
                <div class="bg-default/80 space-y-1 rounded-lg px-3 py-2">
                  <div class="text-muted text-[11px] font-medium tracking-[0.08em] uppercase">{{ t('components.sentinel.scenes.labels.execPath') }}</div>
                  <div class="text-sm break-all">{{ item.execPath || '-' }}</div>
                </div>

                <div class="bg-default/80 space-y-1 rounded-lg px-3 py-2">
                  <div class="text-muted text-[11px] font-medium tracking-[0.08em] uppercase">{{ t('components.sentinel.scenes.labels.args') }}</div>
                  <div class="text-sm break-all">{{ scenesArgsTextGet(item.args) }}</div>
                </div>
              </div>

              <div v-if="isLocalMachine(computedActiveMachine.machineCode)" class="border-default flex items-center justify-end gap-2 border-t pt-3">
                <UButton color="primary" variant="outline" icon="i-material-symbols:edit-outline" size="sm" @click="() => emit('edit', String(item.id || ''))">{{ t('components.sentinel.scenes.card.actions.edit') }}</UButton>

                <UPopover :content="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-56 z-51' }">
                  <UButton color="error" variant="soft" icon="i-lucide:trash-2" size="sm">{{ t('components.sentinel.scenes.card.actions.delete') }}</UButton>
                  <template #content="{ close }">
                    <div class="flex flex-col gap-2">
                      <div class="text-highlighted text-sm font-medium">{{ t('components.sentinel.scenes.card.dialogs.deleteSceneTitle') }}</div>
                      <div class="text-muted text-xs break-all">{{ String(item.sceneName || '') }}</div>
                      <div class="flex items-center justify-end gap-2 pt-1">
                        <UButton color="neutral" variant="outline" size="xs" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                        <UButton color="error" variant="solid" size="xs" @click="() => handleDeleteConfirm(String(item.id || ''), close)">{{ t('common.actions.confirm') }}</UButton>
                      </div>
                    </div>
                  </template>
                </UPopover>
              </div>
            </article>
          </div>

          <div v-else class="ring-default ring-dashed rounded-xl px-4 py-5 ring-1">
            <UEmpty
              icon="i-tabler:layout-grid"
              :title="t('components.sentinel.scenes.card.empty.scenes.title')"
              :description="isLocalMachine(computedActiveMachine.machineCode) ? t('components.sentinel.scenes.card.empty.scenes.localDescription') : t('components.sentinel.scenes.card.empty.scenes.remoteDescription')"
              variant="naked"
              size="sm"
              :ui="{
                root: 'p-0',
                header: 'max-w-none',
                body: 'max-w-none'
              }"
            >
              <template v-if="isLocalMachine(computedActiveMachine.machineCode)" #actions>
                <UButton icon="i-material-symbols:add-ad-outline-rounded" color="primary" variant="soft" @click.stop="handleScenesAddClickByVariant('slideover')">{{ t('components.sentinel.scenes.card.actions.addScene') }}</UButton>
              </template>
            </UEmpty>
          </div>
        </section>
      </div>
      <div v-else class="py-6">
        <UEmpty
          icon="i-lucide-file"
          :title="t('components.sentinel.scenes.card.empty.data.title')"
          :description="t('components.sentinel.scenes.card.empty.data.description')"
          variant="naked"
          size="sm"
          :ui="{
            root: 'p-0',
            header: 'max-w-none',
            body: 'max-w-none'
          }"
        />
      </div>
    </template>
  </USlideover>

  <UModal v-model:open="stateNetworkOpen" :title="t('components.sentinel.scenes.card.fields.network')" :ui="{ content: 'z-50 max-w-4xl', title: 'w-full font-normal' }">
    <template #title>
      <template v-if="computedActiveMachine">
        <div class="w-214 min-w-0 font-normal">
          <ReuseMachineHeaderTemplate :machine="computedActiveMachine" actions-variant="slideover" :truncate="false" />
        </div>
      </template>
      <template v-else>
        <div class="text-lg font-medium">{{ t('components.sentinel.scenes.card.fields.network') }}</div>
      </template>
    </template>
    <template #body>
      <div v-if="computedActiveMachine" class="space-y-5">
        <UPageCard variant="naked" :ui="{ root: 'border-0 shadow-none bg-transparent', container: 'sm:p-0 p-0' }">
          <div class="space-y-4 text-sm">
            <div class="flex items-center justify-between gap-3">
              <div class="text-base font-medium">{{ t('components.sentinel.scenes.card.fields.network') }}</div>
              <UTabs color="primary" variant="link" size="sm" :content="false" :items="NETWORK_TABS_ITEMS" :model-value="networkTabGet(computedActiveMachine)" @update:model-value="(v) => handleNetworkTabUpdate(computedActiveMachine!.machineCode, v)" />
            </div>

            <dl v-if="networkTabGet(computedActiveMachine) === 'ipv4'" class="space-y-2 pt-1">
              <template v-if="networkGroupsIpv4Get(computedActiveMachine).length > 0">
                <dd v-for="group in networkGroupsIpv4Get(computedActiveMachine)" :key="group.name" class="bg-muted/40 flex items-center gap-2 rounded-lg px-3 py-2">
                  <div class="flex min-w-0 flex-1 items-center gap-2">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-mdi:network-outline" class="text-dimmed" />
                      <span class="text-muted shrink-0">{{ String(group.name || '').trim() || '-' }}</span>
                    </div>
                    <span class="min-w-0 flex-1 text-right break-all">{{ ipJoin(group.ipv4) || '-' }}</span>
                  </div>
                  <UTooltip :text="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" :content="{ side: 'right' }">
                    <UButton
                      :color="copiedGet(`${computedActiveMachine.machineCode}|ipv4|${group.name}`) ? 'success' : 'neutral'"
                      variant="link"
                      size="sm"
                      :icon="copiedGet(`${computedActiveMachine.machineCode}|ipv4|${group.name}`) ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                      :aria-label="t('components.sentinel.scenes.card.tooltips.copyToClipboard')"
                      @click.stop="handleIpCopy(`${computedActiveMachine.machineCode}|ipv4|${group.name}`, ipJoin(group.ipv4))"
                    />
                  </UTooltip>
                </dd>
              </template>
              <template v-else>
                <dd class="pt-1">
                  <UEmpty
                    icon="i-mdi:network-outline"
                    :title="t('components.sentinel.scenes.card.empty.ipv4.title')"
                    :description="t('components.sentinel.scenes.card.empty.ipv4.description')"
                    variant="naked"
                    size="xs"
                    :ui="{
                      root: 'p-0 items-start justify-start',
                      header: 'items-start text-left max-w-none',
                      body: 'items-start max-w-none'
                    }"
                  />
                </dd>
              </template>
            </dl>
            <dl v-else class="space-y-2 pt-1">
              <template v-if="networkGroupsIpv6Get(computedActiveMachine).length > 0">
                <dd v-for="group in networkGroupsIpv6Get(computedActiveMachine)" :key="group.name" class="bg-muted/40 flex items-center gap-2 rounded-lg px-3 py-2">
                  <div class="flex min-w-0 flex-1 items-center gap-2">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-mdi:network-outline" class="text-dimmed" />
                      <span class="text-muted shrink-0">{{ String(group.name || '').trim() || '-' }}</span>
                    </div>
                    <span class="min-w-0 flex-1 text-right break-all">{{ ipJoin(group.ipv6) || '-' }}</span>
                  </div>
                  <UTooltip :text="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" :content="{ side: 'right' }">
                    <UButton
                      :color="copiedGet(`${computedActiveMachine.machineCode}|ipv6|${group.name}`) ? 'success' : 'neutral'"
                      variant="link"
                      size="sm"
                      :icon="copiedGet(`${computedActiveMachine.machineCode}|ipv6|${group.name}`) ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                      :aria-label="t('components.sentinel.scenes.card.tooltips.copyToClipboard')"
                      @click.stop="handleIpCopy(`${computedActiveMachine.machineCode}|ipv6|${group.name}`, ipJoin(group.ipv6))"
                    />
                  </UTooltip>
                </dd>
              </template>
              <template v-else>
                <dd class="pt-1">
                  <UEmpty
                    icon="i-mdi:network-outline"
                    :title="t('components.sentinel.scenes.card.empty.ipv6.title')"
                    :description="t('components.sentinel.scenes.card.empty.ipv6.description')"
                    variant="naked"
                    size="xs"
                    :ui="{
                      root: 'p-0 items-start justify-start',
                      header: 'items-start text-left max-w-none',
                      body: 'items-start max-w-none'
                    }"
                  />
                </dd>
              </template>
            </dl>
          </div>
        </UPageCard>
      </div>
      <div v-else class="py-6">
        <UEmpty
          icon="i-mdi:network-outline"
          :title="t('components.sentinel.scenes.card.empty.data.title')"
          :description="t('components.sentinel.scenes.card.empty.data.description')"
          variant="naked"
          size="sm"
          :ui="{
            root: 'p-0',
            header: 'max-w-none',
            body: 'max-w-none'
          }"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import { createReusableTemplate, useClipboard } from '@vueuse/core';

import type { IPageSettingsUnattendedMachineNetworkGroup, IPageSettingsUnattendedMachineNetworkGroups, IPageSettingsUnattendedMachineNetworkSnapshot, IPageSettingsUnattendedScenesMachineRedisConfig } from '@@/shared/types/pages/settings/unattended/index.types';

/**
 * 接口：无人值守-场景守护-卡片组件 Props
 */
interface ISettingsUnattendedScenesCardsProps {
  /**
   * 机器场景配置列表
   */
  machines: IPageSettingsUnattendedScenesMachineRedisConfig[];

  /**
   * 本机机器码
   */
  localMachineCode: string;
}

/**
 * 接口：无人值守-场景守护-切换启用事件参数
 */
interface ISettingsUnattendedScenesCardsToggleEnabledPayload {
  /**
   * 场景 ID
   */
  id: string;

  /**
   * 是否启用
   */
  enabled: boolean;
}

/**
 * 接口：无人值守-场景守护-机器备注更新事件参数
 */
interface ISettingsUnattendedScenesCardsUpdateMachineRemarkPayload {
  /**
   * 机器名称
   */
  machineName: string;

  /**
   * 机器码
   */
  machineCode: string;

  /**
   * 机器备注
   */
  machineRemark: string;
}

/**
 * 接口：无人值守-场景守护-删除主机事件参数
 */
interface ISettingsUnattendedScenesCardsDeleteMachinePayload {
  /**
   * 机器名称
   */
  machineName: string;

  /**
   * 机器码
   */
  machineCode: string;
}

/**
 * 类型：网卡 Tab
 */
type TSettingsUnattendedScenesCardsNetworkTab = 'ipv4' | 'ipv6';

/**
 * 类型：机器网卡 Tab 映射
 */
type TSettingsUnattendedScenesCardsNetworkTabMap = Record<string, TSettingsUnattendedScenesCardsNetworkTab>;

/**
 * 常量：网卡 Tabs 选项
 */
const NETWORK_TABS_ITEMS = [
  { label: 'IPv4', value: 'ipv4' },
  { label: 'IPv6', value: 'ipv6' }
] satisfies TabsItem[];

/**
 * 模板：机器卡片表头（可复用）
 */
const [DefineMachineHeaderTemplate, ReuseMachineHeaderTemplate] = createReusableTemplate<{
  /**
   * 机器配置
   */
  machine: IPageSettingsUnattendedScenesMachineRedisConfig;

  /**
   * 是否显示操作按钮
   */
  showActions?: boolean;

  /**
   * 变量：操作区展示模式
   */
  actionsVariant?: 'card' | 'slideover' | 'none';

  /**
   * 是否截断长文本
   */
  truncate?: boolean;
}>();

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Toast：消息提示
 */
const toast = useToast();

/**
 * Hook：剪贴板
 */
const { copy } = useClipboard();

/**
 * 状态：当前复制成功的 key
 */
const stateCopiedKey = ref<string>('');

/**
 * 变量：复制状态重置计时器
 */
let timeoutCopied: ReturnType<typeof setTimeout> | undefined;

/**
 * 函数：判断某个 key 是否处于复制成功态
 * @param {string} key 复制 key
 * @returns {boolean} 是否已复制
 */
const copiedGet = (key: string): boolean => stateCopiedKey.value === String(key || '').trim();

/**
 * 函数：复制 IP 文本到剪贴板，并短暂显示对钩
 * @param {string} key 复制 key
 * @param {string} text 待复制文本
 */
const handleIpCopy = async (key: string, text: string): Promise<void> => {
  const safeKey = String(key || '').trim();
  const value = String(text || '').trim();

  if (!safeKey || !value) {
    return;
  }

  try {
    await copy(value);
  } catch {
    return;
  }

  toast.add({
    description: h('span', { class: 'break-all' }, [h('span', { class: 'text-muted' }, '已复制：'), h('span', { class: 'text-highlighted' }, value)]),
    color: 'success',
    icon: 'i-lucide-copy-check',
    duration: 1200,
    type: 'foreground',
    close: false
  });

  stateCopiedKey.value = safeKey;
  if (timeoutCopied) {
    clearTimeout(timeoutCopied);
  }
  timeoutCopied = setTimeout(() => {
    if (stateCopiedKey.value === safeKey) {
      stateCopiedKey.value = '';
    }
  }, 1200);
};

/**
 * 生命周期：组件卸载
 */
onBeforeUnmount(() => {
  if (timeoutCopied) {
    clearTimeout(timeoutCopied);
  }
});

/**
 * 事件：组件事件
 */
const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'toggle-enabled', payload: ISettingsUnattendedScenesCardsToggleEnabledPayload): void;
  (e: 'update-machine-remark', payload: ISettingsUnattendedScenesCardsUpdateMachineRemarkPayload): void;
  (e: 'delete-machine', payload: ISettingsUnattendedScenesCardsDeleteMachinePayload): void;
  (e: 'edit' | 'delete', id: string): void;
}>();

/**
 * Props：组件输入
 */
const props = defineProps<ISettingsUnattendedScenesCardsProps>();

/**
 * 状态：Slideover 是否打开
 */
const stateOpen = ref(false);

/**
 * 状态：网卡弹窗是否打开
 */
const stateNetworkOpen = ref(false);

/**
 * 状态：机器备注编辑态
 */
const stateRemarkEditingByMachineCode = ref<Record<string, boolean>>({});

/**
 * 状态：机器备注草稿
 */
const stateRemarkDraftByMachineCode = ref<Record<string, string>>({});

/**
 * 状态：机器备注输入框容器引用
 */
const stateRemarkInputWrapByMachineCode = ref<Record<string, HTMLElement | null>>({});

/**
 * 状态：当前正在编辑备注的机器码
 */
const stateActiveRemarkEditingMachineCode = ref<string>('');

/**
 * 状态：当前选择的机器码
 */
const stateActiveMachineCode = ref<string>('');

/**
 * 状态：各机器网卡 Tab
 */
const stateNetworkTabByMachineCode = ref<TSettingsUnattendedScenesCardsNetworkTabMap>({});

/**
 * 计算属性：机器列表
 */
const computedMachines = computed(() => (Array.isArray(props.machines) ? props.machines : []));

/**
 * 计算属性：当前激活机器
 */
const computedActiveMachine = computed(() => {
  const code = String(stateActiveMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return computedMachines.value.find((i) => String(i.machineCode || '').trim() === code) ?? null;
});

/**
 * 计算属性：当前正在编辑备注的机器
 */
const computedActiveRemarkEditingMachine = computed(() => {
  const code = String(stateActiveRemarkEditingMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return computedMachines.value.find((i) => String(i.machineCode || '').trim() === code) ?? null;
});

/**
 * 计算属性：当前正在编辑备注的容器
 */
const computedActiveRemarkEditingWrap = computed(() => {
  const code = String(stateActiveRemarkEditingMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return stateRemarkInputWrapByMachineCode.value[code] ?? null;
});

/**
 * 计算属性：Slideover 标题
 */
const computedSlideoverTitle = computed(() => {
  const m = computedActiveMachine.value;
  if (!m) {
    return '场景守护';
  }

  const name = String(m.machineName || '').trim() || t('components.sentinel.scenes.card.machine.unnamed');
  const code = String(m.machineCode || '').trim();
  return code ? `${name} · ${code}` : name;
});

/**
 * 函数：获取备注编辑态
 * @param {string} machineCode 机器码
 * @returns {boolean} 是否处于编辑态
 */
const remarkEditingGet = (machineCode: string): boolean => Boolean(stateRemarkEditingByMachineCode.value[String(machineCode || '').trim()]);

/**
 * 函数：获取备注草稿
 * @param {string} machineCode 机器码
 * @returns {string} 备注草稿
 */
const remarkDraftGet = (machineCode: string): string => {
  const code = String(machineCode || '').trim();
  return code ? String(stateRemarkDraftByMachineCode.value[code] ?? '') : '';
};

/**
 * 函数：记录备注输入框容器引用
 * @param {string} machineCode 机器码
 * @returns {(el: unknown) => void} 模板 ref 回调
 */
const remarkInputWrapRef = (machineCode: string) => {
  return (el: unknown): void => {
    const code = String(machineCode || '').trim();
    if (!code) {
      return;
    }

    stateRemarkInputWrapByMachineCode.value[code] = el instanceof HTMLElement ? el : null;
  };
};

/**
 * 函数：获取备注输入框 DOM
 * @param {string} machineCode 机器码
 * @returns {HTMLInputElement | null} 输入框元素
 */
const getRemarkInputEl = (machineCode: string): HTMLInputElement | null => {
  const code = String(machineCode || '').trim();
  if (!code) {
    return null;
  }

  const wrap = stateRemarkInputWrapByMachineCode.value[code];
  if (!wrap) {
    return null;
  }

  return wrap.querySelector('input');
};

/**
 * 函数：是否本机
 * @param {string} machineCode 机器码
 * @returns {boolean} 是否本机
 */
const isLocalMachine = (machineCode: string): boolean => String(machineCode || '').trim() === String(props.localMachineCode || '').trim();

/**
 * 函数：打开指定机器
 * @param {string} machineCode 机器码
 */
const handleMachineOpen = (machineCode: string) => {
  stateActiveMachineCode.value = String(machineCode || '').trim();
  stateOpen.value = true;
};

/**
 * 函数：打开指定机器的网卡弹窗
 * @param {string} machineCode 机器码
 */
const handleMachineNetworkOpen = (machineCode: string): void => {
  stateActiveMachineCode.value = String(machineCode || '').trim();
  stateNetworkOpen.value = true;
};

/**
 * 函数：开始编辑机器备注
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 */
const handleRemarkEditStart = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): void => {
  const code = String(machine?.machineCode || '').trim();
  if (!code) {
    return;
  }

  stateRemarkEditingByMachineCode.value = { [code]: true };
  stateRemarkDraftByMachineCode.value[code] = String(machine?.machineRemark || '');
  stateActiveRemarkEditingMachineCode.value = code;

  nextTick(() => {
    const input = getRemarkInputEl(code);
    if (!input) {
      return;
    }

    input.focus();
    input.select();
  });
};

/**
 * 函数：取消编辑机器备注
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 */
const handleRemarkEditCancel = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): void => {
  const code = String(machine?.machineCode || '').trim();
  if (!code) {
    return;
  }

  stateRemarkDraftByMachineCode.value[code] = String(machine?.machineRemark || '');
  stateRemarkEditingByMachineCode.value[code] = false;
  if (stateActiveRemarkEditingMachineCode.value === code) {
    stateActiveRemarkEditingMachineCode.value = '';
  }
};

/**
 * 函数：更新机器备注草稿
 * @param {string} machineCode 机器码
 * @param {string | number} value 输入值
 */
const handleRemarkDraftUpdate = (machineCode: string, value: string | number): void => {
  const code = String(machineCode || '').trim();
  if (!code) {
    return;
  }

  stateRemarkDraftByMachineCode.value[code] = String(value ?? '');
};

/**
 * 函数：保存机器备注
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 */
const handleRemarkSave = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): void => {
  const machineCode = String(machine?.machineCode || '').trim();
  if (!machineCode) {
    return;
  }

  stateRemarkEditingByMachineCode.value[machineCode] = false;
  if (stateActiveRemarkEditingMachineCode.value === machineCode) {
    stateActiveRemarkEditingMachineCode.value = '';
  }
  emit('update-machine-remark', {
    machineName: String(machine?.machineName || '').trim(),
    machineCode,
    machineRemark: remarkDraftGet(machineCode).trim()
  });
};

/**
 * 事件：点击备注编辑区外部时取消编辑
 */
onClickOutside(computedActiveRemarkEditingWrap, () => {
  const machine = computedActiveRemarkEditingMachine.value;
  if (!machine) {
    return;
  }

  handleRemarkEditCancel(machine);
});

/**
 * 函数：获取机器网络分组。
 *
 * 兼容两种结构：直接 groups 数组，或旧版 interfaces 快照格式。
 *
 * # Arguments
 *
 * * `machine` - 机器配置。
 *
 * # Returns
 *
 * 网卡分组列表。
 */
const networkGroupsGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): IPageSettingsUnattendedMachineNetworkGroup[] => {
  const network = machine?.network;
  if (!network || typeof network !== 'object' || Array.isArray(network)) {
    return [];
  }

  const src = network as unknown as Record<string, unknown>;
  const groups = src.groups;
  if (Array.isArray(groups)) {
    return groups as IPageSettingsUnattendedMachineNetworkGroups['groups'];
  }

  const interfaces = src.interfaces;
  if (!Array.isArray(interfaces)) {
    return [];
  }

  const snapshot: IPageSettingsUnattendedMachineNetworkSnapshot = {
    interfaces: interfaces as IPageSettingsUnattendedMachineNetworkSnapshot['interfaces']
  };

  return (Array.isArray(snapshot.interfaces) ? snapshot.interfaces : [])
    .map((iface) => {
      const name = String(iface?.name ?? '').trim() || '-';
      const ips = Array.isArray(iface?.ips) ? iface.ips : [];
      const cleaned = ips.map((i) => String(i ?? '').trim()).filter((i) => i !== '');
      const ipv4 = Array.from(new Set(cleaned.filter((i) => i.includes('.') && !i.includes(':'))));
      const ipv6 = Array.from(new Set(cleaned.filter((i) => i.includes(':'))));
      return { name, ipv4, ipv6 };
    })
    .filter((g) => g.ipv4.length > 0 || g.ipv6.length > 0);
};

/**
 * 函数：拼接 IP 列表。
 *
 * # Arguments
 *
 * * `ips` - IP 列表。
 *
 * # Returns
 *
 * 去重后逗号分隔的字符串。
 */
const ipJoin = (ips: string[]): string => {
  const list = Array.isArray(ips) ? ips.map((i) => String(i || '').trim()).filter((i) => i !== '') : [];
  return Array.from(new Set(list)).join(', ');
};

/**
 * 函数：获取存在 IPv4 的网卡分组。
 *
 * # Arguments
 *
 * * `machine` - 机器配置。
 *
 * # Returns
 *
 * 过滤后只含 IPv4 地址的分组列表。
 */
const networkGroupsIpv4Get = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): IPageSettingsUnattendedMachineNetworkGroup[] => networkGroupsGet(machine).filter((g) => ipJoin(Array.isArray(g?.ipv4) ? g.ipv4 : []).trim() !== '');

/**
 * 函数：获取存在 IPv6 的网卡分组。
 *
 * # Arguments
 *
 * * `machine` - 机器配置。
 *
 * # Returns
 *
 * 过滤后只含 IPv6 地址的分组列表。
 */
const networkGroupsIpv6Get = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): IPageSettingsUnattendedMachineNetworkGroup[] => networkGroupsGet(machine).filter((g) => ipJoin(Array.isArray(g?.ipv6) ? g.ipv6 : []).trim() !== '');

/**
 * 函数：获取当前网卡 Tab。
 *
 * 优先取已存储的选择；若无，则默认 ipv4（有数据时）或 ipv4。
 *
 * # Arguments
 *
 * * `machine` - 机器配置。
 *
 * # Returns
 *
 * 当前 Tab 值。
 */
const networkTabGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): TSettingsUnattendedScenesCardsNetworkTab => {
  const code = String(machine?.machineCode || '').trim();
  const current = code ? stateNetworkTabByMachineCode.value[code] : undefined;
  if (current === 'ipv4' || current === 'ipv6') {
    return current;
  }

  return networkGroupsIpv4Get(machine).length > 0 ? 'ipv4' : networkGroupsIpv6Get(machine).length > 0 ? 'ipv6' : 'ipv4';
};

/**
 * 函数：处理网卡 Tabs 更新。
 *
 * # Arguments
 *
 * * `machineCode` - 机器码。
 * * `value` - 选中的 Tab 值。
 */
const handleNetworkTabUpdate = (machineCode: string, value: string | number): void => {
  const code = String(machineCode || '').trim();
  const v = String(value || '').trim();
  if (!code || (v !== 'ipv4' && v !== 'ipv6')) {
    return;
  }

  stateNetworkTabByMachineCode.value[code] = v as TSettingsUnattendedScenesCardsNetworkTab;
};

/**
 * 函数：确认删除
 * @param {string} id 场景 ID
 * @param {(() => void) | undefined} close 关闭 Popover
 */
const handleDeleteConfirm = (id: string, close?: () => void) => {
  emit('delete', id);
  close?.();
};

/**
 * 函数：确认删除主机
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @param {(() => void) | undefined} close 关闭 Popover
 */
const handleMachineDeleteConfirm = (machine: IPageSettingsUnattendedScenesMachineRedisConfig, close?: () => void) => {
  emit('delete-machine', {
    machineName: String(machine.machineName || '').trim(),
    machineCode: String(machine.machineCode || '').trim()
  });
  close?.();
};

/**
 * 事件：添加场景
 */
const handleScenesAddClickByVariant = (actionsVariant?: 'card' | 'slideover' | 'none'): void => {
  if (actionsVariant === 'slideover') {
    emit('add');
    return;
  }

  stateOpen.value = false;
  emit('add');
};

/**
 * 函数：构建命令展示文本（execPath + args）
 * @param {string} execPath 可执行文件路径
 * @param {string[]} args 参数列表
 * @returns {string} 命令文本
 */
const scenesCommandTextGet = (execPath: string, args: string[]): string => {
  const safeExecPath = String(execPath || '').trim();
  const safeArgs = Array.isArray(args) ? args.map((i) => String(i)) : [];

  const parts = [safeExecPath, ...safeArgs].filter((i) => String(i).trim() !== '');
  return parts
    .map((i) => {
      const s = String(i);
      return /\s/.test(s) ? `"${s.replaceAll('"', '\\"')}"` : s;
    })
    .join(' ')
    .trim();
};

/**
 * 函数：构建参数展示文本
 * @param {string[]} args 参数列表
 * @returns {string} 参数摘要
 */
const scenesArgsTextGet = (args: string[]): string => {
  const safeArgs = Array.isArray(args) ? args.map((i) => String(i)) : [];
  const parts = safeArgs.filter((i) => String(i).trim() !== '');
  if (parts.length === 0) {
    return '-';
  }

  return parts
    .map((i) => {
      const s = String(i);
      return /\s/.test(s) ? `"${s.replaceAll('"', '\\"')}"` : s;
    })
    .join(' ')
    .trim();
};

/**
 * 函数：获取场景总数
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {number} 总数
 */
const scenesCountTotalGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): number => (Array.isArray(machine?.items) ? machine.items.length : 0);

/**
 * 函数：获取启用数量
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {number} 启用数量
 */
const scenesCountEnabledGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): number => (Array.isArray(machine?.items) ? machine.items.filter((i) => Boolean(i?.enabled)).length : 0);

/**
 * 函数：获取未启用数量
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {number} 未启用数量
 */
const scenesCountDisabledGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): number => {
  const total = scenesCountTotalGet(machine);
  const enabled = scenesCountEnabledGet(machine);
  return Math.max(0, total - enabled);
};
</script>
