<template>
  <div class="bg-elevated/65 ring-default relative overflow-hidden rounded-lg px-4 py-3.5 ring-1 select-none">
    <div class="from-primary/8 to-info/8 pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-r via-transparent" />

    <div class="relative">
      <div class="mb-3 flex min-w-0 items-start gap-3">
        <div class="relative mt-0.5 shrink-0">
          <div class="bg-default/80 ring-default flex size-9 items-center justify-center rounded-md ring-1">
            <UIcon name="i-material-symbols:computer-outline-rounded" class="text-highlighted size-5" />
          </div>
          <UTooltip arrow :text="machineOnlineGet(props.machine) ? t('components.sentinel.scenes.card.machine.online') : t('components.sentinel.scenes.card.machine.offline')" :content="{ side: 'top' }">
            <span :class="['ring-default absolute -right-0.5 -bottom-0.5 block size-3 rounded-full ring-2', machineOnlineGet(props.machine) ? 'bg-success' : 'bg-neutral-400']" />
          </UTooltip>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex min-w-0 items-center gap-2">
            <h3 class="text-highlighted min-w-0 flex-1 truncate text-[15px] leading-6 font-medium">{{ props.machine.machineName || t('components.sentinel.scenes.card.machine.unnamed') }}</h3>
            <UBadge :color="isLocalMachine(props.machine.machineCode) ? 'primary' : 'warning'" variant="soft" size="sm" class="shrink-0 self-center">
              {{ isLocalMachine(props.machine.machineCode) ? t('components.sentinel.scenes.card.machine.local') : t('components.sentinel.scenes.card.machine.remote') }}
            </UBadge>
            <slot name="header-actions" :machine="props.machine" />
          </div>

          <div class="text-muted mt-1 flex items-center gap-1.5 text-[11px] leading-4">
            <UIcon :name="machineOnlineGet(props.machine) ? 'i-lucide:wifi' : 'i-lucide:wifi-off'" class="size-3.5" />
            <span>{{ machineOnlineGet(props.machine) ? t('components.sentinel.scenes.card.machine.online') : t('components.sentinel.scenes.card.machine.offline') }}</span>
          </div>
        </div>
      </div>

      <ul class="space-y-1.5 text-[13px]">
        <li class="bg-muted/35 flex items-start gap-2 rounded-md px-2.5 py-2">
          <div class="text-muted flex w-24 shrink-0 items-center gap-1.5 text-xs leading-5">
            <UIcon name="i-ic:outline-computer" class="text-dimmed size-3.5" />
            <span>{{ t('components.sentinel.scenes.card.fields.machineCode') }}</span>
          </div>
          <span class="min-w-0 flex-1 leading-5 break-all">{{ props.machine.machineCode || '-' }}</span>
          <UTooltip v-if="String(props.machine.machineCode || '').trim()" arrow :text="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" :content="{ side: 'right' }">
            <UButton :color="stateCodeCopied ? 'success' : 'neutral'" variant="link" size="xs" :icon="stateCodeCopied ? 'i-lucide-copy-check' : 'i-lucide-copy'" :aria-label="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" @click.stop="handleMachineCodeCopy" />
          </UTooltip>
        </li>
        <li class="bg-muted/35 flex items-start gap-2 rounded-md px-2.5 py-2">
          <div class="text-muted flex w-24 shrink-0 items-center gap-1.5 text-xs leading-5">
            <UIcon name="i-lucide:sticky-note" class="text-dimmed size-3.5" />
            <span>{{ t('components.sentinel.scenes.card.fields.machineRemark') }}</span>
          </div>
          <slot name="machine-remark-content" :machine="props.machine">
            <span class="min-w-0 flex-1 leading-5 break-all">{{ props.machine.machineRemark || '-' }}</span>
          </slot>
          <slot name="machine-remark-actions" :machine="props.machine" />
        </li>
        <li class="bg-muted/35 flex items-start gap-2 rounded-md px-2.5 py-2">
          <div class="text-muted flex w-24 shrink-0 items-center gap-1.5 text-xs leading-5">
            <UIcon name="i-lucide:clock-3" class="text-dimmed size-3.5" />
            <span>{{ t('components.sentinel.scenes.card.fields.lastSeen') }}</span>
          </div>
          <span v-if="String(props.machine.machineLastSeenAt || props.machine.lastSeenAt || '').trim()" class="min-w-0 flex-1 leading-5">
            <Datetime :datetime="String(props.machine.machineLastSeenAt || props.machine.lastSeenAt || '').trim()" />
          </span>
          <span v-else class="min-w-0 flex-1 leading-5 break-all">--</span>
        </li>
      </ul>

      <div v-if="$slots.body" class="border-default mt-3 border-t pt-3">
        <slot name="body" :machine="props.machine" />
      </div>

      <div v-if="$slots.footer" class="border-default mt-3 flex flex-wrap items-center justify-between gap-2.5 border-t pt-3">
        <slot name="footer" :machine="props.machine" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

import type { IPageSettingsUnattendedMachineCardInfo } from '@@/shared/types/pages/settings/unattended/index.types';

/**
 * 接口：机器基础卡片 Props
 */
interface ISettingsUnattendedMachineCardBaseProps {
  /**
   * 机器基础信息
   */
  machine: IPageSettingsUnattendedMachineCardInfo;

  /**
   * 本机机器码
   */
  localMachineCode: string;
}

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
 * Props：组件属性
 */
const props = defineProps<ISettingsUnattendedMachineCardBaseProps>();

/**
 * 状态：机器码复制成功态
 */
const stateCodeCopied = ref(false);

/**
 * 变量：复制状态重置定时器
 */
let timeoutCopied: ReturnType<typeof setTimeout> | undefined;

/**
 * 函数：是否本机
 * @param {string} machineCode 机器码
 * @returns {boolean} 是否本机
 */
const isLocalMachine = (machineCode: string): boolean => String(machineCode || '').trim() === String(props.localMachineCode || '').trim();

/**
 * 函数：获取机器在线状态
 * @param {IPageSettingsUnattendedMachineCardInfo} machine 机器信息
 * @returns {boolean} 是否在线
 */
const machineOnlineGet = (machine: IPageSettingsUnattendedMachineCardInfo): boolean => {
  if (typeof machine?.online === 'boolean') {
    return machine.online;
  }

  return isLocalMachine(String(machine?.machineCode || ''));
};

/**
 * 函数：复制机器码
 */
const handleMachineCodeCopy = async (): Promise<void> => {
  const value = String(props.machine.machineCode || '').trim();
  if (!value) {
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

  stateCodeCopied.value = true;
  if (timeoutCopied) {
    clearTimeout(timeoutCopied);
  }
  timeoutCopied = setTimeout(() => {
    stateCodeCopied.value = false;
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
</script>
