<template>
  <DefineMachineHeaderTemplate v-slot="{ machine, showActions, truncate, actionsVariant }">
    <div class="mb-4 flex justify-between">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-medium whitespace-nowrap">{{ machine.machineName || t('components.sentinel.scenes.card.machine.unnamed') }}</h3>
        <UBadge :color="isLocalMachine(machine.machineCode) ? 'primary' : 'warning'" variant="soft">
          {{ isLocalMachine(machine.machineCode) ? t('components.sentinel.scenes.card.machine.local') : t('components.sentinel.scenes.card.machine.remote') }}
        </UBadge>
      </div>
      <div v-if="showActions !== false && actionsVariant !== 'none'" class="flex items-center gap-2">
        <UButton v-if="isLocalMachine(machine.machineCode)" icon="i-material-symbols:add-ad-outline-rounded" color="primary" size="sm" variant="soft" :class="actionsVariant === 'slideover' ? '-translate-x-8' : ''" @click.stop="handleScenesAddClickByVariant(actionsVariant)">{{
          t('components.sentinel.scenes.card.actions.addScene')
        }}</UButton>
        <UButton v-if="actionsVariant !== 'slideover'" icon="i-material-symbols:info-outline" color="primary" size="sm" variant="outline" @click.stop="handleMachineOpen(machine.machineCode)">{{ t('components.sentinel.scenes.card.actions.details') }}</UButton>
      </div>
    </div>

    <ul class="mb-3 space-y-1 pb-3 text-sm">
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
    </ul>
  </DefineMachineHeaderTemplate>

  <div class="3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    <div v-for="machine in computedMachines" :key="machine.machineCode" class="bg-elevated/50 overflow-hidden rounded-xl p-5 select-none">
      <ReuseMachineHeaderTemplate :machine="machine" />
      <div class="mb-3 pb-3">
        <UPageGrid class="gap-2 text-sm">
          <UPageCard icon="i-tabler:layout-grid" :title="t('components.sentinel.scenes.card.stats.scenes')" :description="String(scenesCountTotalGet(machine))" :ui="{ container: 'sm:py-2 sm:px-3 px-3 py-2' }" />
          <UPageCard icon="i-material-symbols:check-circle-outline" :title="t('components.sentinel.scenes.card.stats.enabled')" :description="String(scenesCountEnabledGet(machine))" :ui="{ container: 'sm:py-2 sm:px-3 px-3 py-2' }" />
          <UPageCard icon="i-material-symbols:cancel-outline" :title="t('components.sentinel.scenes.card.stats.disabled')" :description="String(scenesCountDisabledGet(machine))" :ui="{ container: 'sm:py-2 sm:px-3 px-3 py-2' }" />
        </UPageGrid>
      </div>
      <div class="text-sm">
        <div class="border-default mb-2 flex items-center justify-between gap-3 border-b">
          <div class="text-lg">{{ t('components.sentinel.scenes.card.fields.network') }}</div>
          <UTabs color="primary" variant="link" size="sm" :content="false" :items="NETWORK_TABS_ITEMS" :model-value="networkTabGet(machine)" class="w-auto" :ui="{ list: 'w-auto' }" @update:model-value="(v) => handleNetworkTabUpdate(machine.machineCode, v)" />
        </div>

        <dl v-if="networkTabGet(machine) === 'ipv4'" class="space-y-1 pt-2">
          <template v-if="networkGroupsIpv4Get(machine).length > 0">
            <dd v-for="group in networkGroupsIpv4Get(machine)" :key="group.name" class="mb-1 flex items-center gap-2">
              <div class="flex min-w-0 flex-1 items-center gap-2">
                <div class="flex items-center gap-1">
                  <UIcon name="i-mdi:network-outline" class="text-dimmed" />
                  <span class="text-muted shrink-0">{{ String(group.name || '').trim() || '-' }}</span>
                </div>
                <span class="min-w-0 flex-1 truncate text-right">{{ ipJoin(group.ipv4) || '-' }}</span>
              </div>
              <UTooltip :text="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" :content="{ side: 'right' }">
                <UButton
                  :color="copiedGet(`${machine.machineCode}|ipv4|${group.name}`) ? 'success' : 'neutral'"
                  variant="link"
                  size="sm"
                  :icon="copiedGet(`${machine.machineCode}|ipv4|${group.name}`) ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                  :aria-label="t('components.sentinel.scenes.card.tooltips.copyToClipboard')"
                  @click.stop="handleIpCopy(`${machine.machineCode}|ipv4|${group.name}`, ipJoin(group.ipv4))"
                />
              </UTooltip>
            </dd>
          </template>
          <template v-else>
            <dd class="mb-1 pt-1">
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
        <dl v-else class="space-y-1 pt-2">
          <template v-if="networkGroupsIpv6Get(machine).length > 0">
            <dd v-for="group in networkGroupsIpv6Get(machine)" :key="group.name" class="mb-1 flex items-center gap-2">
              <div class="flex min-w-0 flex-1 items-center gap-2">
                <div class="flex items-center gap-1">
                  <UIcon name="i-mdi:network-outline" class="text-dimmed" />
                  <span class="text-muted shrink-0">{{ String(group.name || '').trim() || '-' }}</span>
                </div>
                <span class="min-w-0 flex-1 truncate text-right">{{ ipJoin(group.ipv6) || '-' }}</span>
              </div>
              <UTooltip :text="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" :content="{ side: 'right' }">
                <UButton
                  :color="copiedGet(`${machine.machineCode}|ipv6|${group.name}`) ? 'success' : 'neutral'"
                  variant="link"
                  size="sm"
                  :icon="copiedGet(`${machine.machineCode}|ipv6|${group.name}`) ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                  :aria-label="t('components.sentinel.scenes.card.tooltips.copyToClipboard')"
                  @click.stop="handleIpCopy(`${machine.machineCode}|ipv6|${group.name}`, ipJoin(group.ipv6))"
                />
              </UTooltip>
            </dd>
          </template>
          <template v-else>
            <dd class="mb-1 pt-1">
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
    </div>
  </div>

  <USlideover v-model:open="stateOpen" :title="computedSlideoverTitle" side="right" :ui="{ overlay: 'z-40', title: 'w-full font-normal', content: 'z-40 w-auto min-w-2xl', close: '-translate-y-1' }">
    <template #title>
      <template v-if="computedActiveMachine">
        <div class="font-normal">
          <ReuseMachineHeaderTemplate :machine="computedActiveMachine" actions-variant="slideover" :truncate="false" />
        </div>
      </template>
      <template v-else>
        <div class="text-lg font-medium">{{ computedSlideoverTitle }}</div>
      </template>
    </template>
    <template #body>
      <div v-if="computedActiveMachine" class="space-y-5">
        <dl v-for="item in computedActiveMachine.items" :key="item.id">
          <dt class="mb-2 flex h-10 items-center justify-between">
            <span class="text-highlighted text-lg font-medium wrap-break-word">{{ item.sceneName || t('components.sentinel.scenes.card.scene.unnamed') }}</span>
            <div class="flex shrink-0 items-center gap-2">
              <UBadge :color="item.enabled ? 'success' : 'neutral'" variant="soft">{{ item.enabled ? t('components.sentinel.scenes.card.scene.enabled') : t('components.sentinel.scenes.card.scene.disabled') }}</UBadge>
              <template v-if="isLocalMachine(computedActiveMachine.machineCode)">
                <USwitch :model-value="Boolean(item.enabled)" @update:model-value="(v: boolean) => emit('toggle-enabled', { id: String(item.id || ''), enabled: Boolean(v) })" />
              </template>
            </div>
          </dt>
          <dd class="text-muted mt-1 text-xs break-all">
            <div class="flex gap-4">
              <UTextarea :default-value="scenesCommandTextGet(item.execPath, item.args) || '-'" readonly autoresize size="md" class="flex-1 resize-none" />
              <div v-if="isLocalMachine(computedActiveMachine.machineCode)" class="flex flex-col justify-between">
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
                <UButton color="primary" variant="outline" icon="i-material-symbols:edit-outline" size="sm" @click="() => emit('edit', String(item.id || ''))">{{ t('components.sentinel.scenes.card.actions.edit') }}</UButton>
              </div>
            </div>
          </dd>
        </dl>
        <div v-if="computedActiveMachine.items.length === 0" class="py-4">
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
          />
        </div>
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
 * 函数：确认删除
 * @param {string} id 场景 ID
 * @param {(() => void) | undefined} close 关闭 Popover
 */
const handleDeleteConfirm = (id: string, close?: () => void) => {
  emit('delete', id);
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
 * 函数：获取机器网络分组
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {IPageSettingsUnattendedMachineNetworkGroup[]} 分组列表
 */
const networkGroupsGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): IPageSettingsUnattendedMachineNetworkGroup[] => {
  const network = machine?.network;
  if (!network || typeof network !== 'object' || Array.isArray(network)) {
    return [];
  }

  const src = network as Record<string, unknown>;
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

  const mapped = (Array.isArray(snapshot.interfaces) ? snapshot.interfaces : [])
    .map((iface) => {
      const name = String(iface?.name ?? '').trim() || '-';
      const ips = Array.isArray(iface?.ips) ? iface.ips : [];

      const cleaned = ips.map((i) => String(i ?? '').trim()).filter((i) => i !== '');

      const ipv4 = Array.from(new Set(cleaned.filter((i) => i.includes('.') && !i.includes(':'))));
      const ipv6 = Array.from(new Set(cleaned.filter((i) => i.includes(':'))));

      return { name, ipv4, ipv6 };
    })
    .filter((g) => g.ipv4.length > 0 || g.ipv6.length > 0);

  return mapped;
};

/**
 * 函数：拼接 IP 列表
 * @param {string[]} ips IP 列表
 * @returns {string} 拼接文本
 */
const ipJoin = (ips: string[]): string => {
  const list = Array.isArray(ips) ? ips.map((i) => String(i || '').trim()).filter((i) => i !== '') : [];
  return Array.from(new Set(list)).join(', ');
};

/**
 * 函数：获取存在 IPv4 的网卡分组
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {IPageSettingsUnattendedMachineNetworkGroup[]} IPv4 分组
 */
const networkGroupsIpv4Get = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): IPageSettingsUnattendedMachineNetworkGroup[] => {
  const groups = networkGroupsGet(machine);
  return groups.filter((g) => ipJoin(Array.isArray(g?.ipv4) ? g.ipv4 : []).trim() !== '');
};

/**
 * 函数：获取存在 IPv6 的网卡分组
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {IPageSettingsUnattendedMachineNetworkGroup[]} IPv6 分组
 */
const networkGroupsIpv6Get = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): IPageSettingsUnattendedMachineNetworkGroup[] => {
  const groups = networkGroupsGet(machine);
  return groups.filter((g) => ipJoin(Array.isArray(g?.ipv6) ? g.ipv6 : []).trim() !== '');
};

/**
 * 函数：获取网卡 Tab 默认值
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {TSettingsUnattendedScenesCardsNetworkTab} Tab
 */
const networkTabDefaultGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): TSettingsUnattendedScenesCardsNetworkTab => {
  if (networkGroupsIpv4Get(machine).length > 0) {
    return 'ipv4';
  }

  if (networkGroupsIpv6Get(machine).length > 0) {
    return 'ipv6';
  }

  return 'ipv4';
};

/**
 * 函数：获取当前网卡 Tab
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {TSettingsUnattendedScenesCardsNetworkTab} Tab
 */
const networkTabGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): TSettingsUnattendedScenesCardsNetworkTab => {
  const code = String(machine?.machineCode || '').trim();
  const current = code ? stateNetworkTabByMachineCode.value[code] : undefined;
  if (current === 'ipv4' || current === 'ipv6') {
    return current;
  }

  return networkTabDefaultGet(machine);
};

/**
 * 函数：切换网卡 Tab
 * @param {string} machineCode 机器码
 * @param {TSettingsUnattendedScenesCardsNetworkTab} tab Tab
 */
const handleNetworkTabChange = (machineCode: string, tab: TSettingsUnattendedScenesCardsNetworkTab): void => {
  const code = String(machineCode || '').trim();
  if (!code) {
    return;
  }

  stateNetworkTabByMachineCode.value[code] = tab;
};

/**
 * 函数：处理网卡 Tabs 更新
 * @param {string} machineCode 机器码
 * @param {string | number} value Tabs 值
 */
const handleNetworkTabUpdate = (machineCode: string, value: string | number): void => {
  const v = String(value || '').trim();
  if (v !== 'ipv4' && v !== 'ipv6') {
    return;
  }

  handleNetworkTabChange(machineCode, v);
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
