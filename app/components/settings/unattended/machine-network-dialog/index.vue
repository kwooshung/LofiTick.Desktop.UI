<template>
  <UModal v-model:open="stateOpen" :title="t('components.sentinel.scenes.card.fields.network')" :ui="{ content: 'z-50 max-w-4xl', title: 'w-full font-normal' }">
    <template #title>
      <template v-if="props.machine">
        <div class="min-w-0">
          <div class="text-highlighted text-lg font-medium">{{ props.machine.machineName || t('components.sentinel.scenes.card.machine.unnamed') }}</div>
          <div class="text-muted mt-1 text-xs break-all">{{ props.machine.machineCode || '-' }}</div>
        </div>
      </template>
      <template v-else>
        <div class="text-lg font-medium">{{ t('components.sentinel.scenes.card.fields.network') }}</div>
      </template>
    </template>
    <template #body>
      <div v-if="props.machine" class="space-y-5">
        <UPageCard variant="naked" :ui="{ root: 'border-0 shadow-none bg-transparent', container: 'sm:p-0 p-0' }">
          <div class="space-y-4 text-sm">
            <div class="flex items-center justify-between gap-3">
              <div class="text-base font-medium">{{ t('components.sentinel.scenes.card.fields.network') }}</div>
              <UTabs color="primary" variant="link" size="sm" :content="false" :items="NETWORK_TABS_ITEMS" :model-value="stateNetworkTab" @update:model-value="handleNetworkTabUpdate" />
            </div>

            <dl v-if="stateNetworkTab === 'ipv4'" class="space-y-2 pt-1">
              <template v-if="computedIpv4Groups.length > 0">
                <dd v-for="group in computedIpv4Groups" :key="group.name" class="bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2">
                  <div class="flex min-w-0 flex-1 items-center gap-2">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-mdi:network-outline" class="text-dimmed" />
                      <span class="text-muted shrink-0">{{ String(group.name || '').trim() || '-' }}</span>
                    </div>
                    <span class="min-w-0 flex-1 text-right break-all">{{ ipJoin(group.ipv4) || '-' }}</span>
                  </div>
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
                    :ui="{ root: 'p-0 items-start justify-start', header: 'items-start text-left max-w-none', body: 'items-start max-w-none' }"
                  />
                </dd>
              </template>
            </dl>

            <dl v-else class="space-y-2 pt-1">
              <template v-if="computedIpv6Groups.length > 0">
                <dd v-for="group in computedIpv6Groups" :key="group.name" class="bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2">
                  <div class="flex min-w-0 flex-1 items-center gap-2">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-mdi:network-outline" class="text-dimmed" />
                      <span class="text-muted shrink-0">{{ String(group.name || '').trim() || '-' }}</span>
                    </div>
                    <span class="min-w-0 flex-1 text-right break-all">{{ ipJoin(group.ipv6) || '-' }}</span>
                  </div>
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
                    :ui="{ root: 'p-0 items-start justify-start', header: 'items-start text-left max-w-none', body: 'items-start max-w-none' }"
                  />
                </dd>
              </template>
            </dl>
          </div>
        </UPageCard>
      </div>
      <div v-else class="py-6">
        <UEmpty icon="i-mdi:network-outline" :title="t('components.sentinel.scenes.card.empty.data.title')" :description="t('components.sentinel.scenes.card.empty.data.description')" variant="naked" size="sm" :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

import type { IPageSettingsUnattendedMachineCardInfo, IPageSettingsUnattendedMachineNetworkGroup, IPageSettingsUnattendedMachineNetworkGroups, IPageSettingsUnattendedMachineNetworkSnapshot } from '@@/shared/types/pages/settings/unattended/index.types';

/**
 * 类型：网卡 Tab
 */
type TSettingsUnattendedMachineNetworkDialogTab = 'ipv4' | 'ipv6';

/**
 * 接口：机器网卡弹窗 Props
 */
interface ISettingsUnattendedMachineNetworkDialogProps {
  /**
   * 当前机器
   */
  machine: IPageSettingsUnattendedMachineCardInfo | null;
}

/**
 * 常量：网卡 Tabs 选项
 */
const NETWORK_TABS_ITEMS = [
  { label: 'IPv4', value: 'ipv4' },
  { label: 'IPv6', value: 'ipv6' }
] satisfies TabsItem[];

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Model：弹窗开关
 */
const stateOpen = defineModel<boolean>('open', { default: false });

/**
 * Props：组件属性
 */
const props = defineProps<ISettingsUnattendedMachineNetworkDialogProps>();

/**
 * 状态：当前网卡 Tab
 */
const stateNetworkTab = ref<TSettingsUnattendedMachineNetworkDialogTab>('ipv4');

/**
 * 函数：获取机器网络分组
 * @param {IPageSettingsUnattendedMachineCardInfo | null} machine 机器信息
 * @returns {IPageSettingsUnattendedMachineNetworkGroup[]} 分组列表
 */
const networkGroupsGet = (machine: IPageSettingsUnattendedMachineCardInfo | null): IPageSettingsUnattendedMachineNetworkGroup[] => {
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
    .filter((group) => group.ipv4.length > 0 || group.ipv6.length > 0);
};

/**
 * 函数：拼接 IP 列表
 * @param {string[]} ips IP 列表
 * @returns {string} 展示文本
 */
const ipJoin = (ips: string[]): string => {
  const list = Array.isArray(ips) ? ips.map((i) => String(i || '').trim()).filter((i) => i !== '') : [];
  return Array.from(new Set(list)).join(', ');
};

/**
 * 计算属性：IPv4 分组
 */
const computedIpv4Groups = computed(() => networkGroupsGet(props.machine).filter((group) => ipJoin(Array.isArray(group?.ipv4) ? group.ipv4 : []).trim() !== ''));

/**
 * 计算属性：IPv6 分组
 */
const computedIpv6Groups = computed(() => networkGroupsGet(props.machine).filter((group) => ipJoin(Array.isArray(group?.ipv6) ? group.ipv6 : []).trim() !== ''));

/**
 * 函数：处理网卡 Tab 更新
 * @param {string | number} value 选中值
 */
const handleNetworkTabUpdate = (value: string | number): void => {
  const safeValue = String(value || '').trim();
  if (safeValue !== 'ipv4' && safeValue !== 'ipv6') {
    return;
  }

  stateNetworkTab.value = safeValue as TSettingsUnattendedMachineNetworkDialogTab;
};

/**
 * 监听：机器变化时重置默认 Tab
 */
watch(
  () => props.machine,
  (machine) => {
    stateNetworkTab.value = networkGroupsGet(machine).some((group) => group.ipv4.length > 0) ? 'ipv4' : 'ipv6';
  },
  { immediate: true }
);
</script>
