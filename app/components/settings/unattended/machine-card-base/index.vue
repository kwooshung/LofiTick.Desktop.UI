<template>
  <div
    class="bg-default/72 ring-default/40 relative isolate overflow-hidden rounded-lg px-4 py-4 shadow-xs ring-1 shadow-black/5 select-none before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-18 before:bg-linear-to-br before:from-sky-300/24 before:via-cyan-200/16 before:to-transparent before:content-[''] dark:before:from-sky-500/14 dark:before:via-cyan-400/8"
  >
    <div class="relative">
      <div class="mb-7 min-w-0 rounded-md bg-white/34 px-3.5 py-2.75 shadow-sm ring-1 shadow-sky-950/6 ring-sky-300/22 backdrop-blur-lg dark:bg-slate-900/28 dark:shadow-black/8 dark:ring-white/8">
        <div class="flex min-w-0 items-center gap-2">
          <h3 class="text-highlighted min-w-0 flex-1 truncate text-[15px] leading-6 font-medium">{{ machine.machineName || t('components.sentinel.scenes.card.machine.unnamed') }}</h3>
          <UBadge :color="isLocalMachine(machine.machineCode) ? 'primary' : 'warning'" variant="soft" size="sm" class="shrink-0 self-center">
            {{ isLocalMachine(machine.machineCode) ? t('components.sentinel.scenes.card.machine.local') : t('components.sentinel.scenes.card.machine.remote') }}
          </UBadge>
          <slot name="header-actions" :machine="machine" />
        </div>

        <div class="text-muted mt-0.5 flex items-center gap-1.5 text-[11px] leading-4">
          <UIcon :name="machineOnlineGet(machine) ? 'i-lucide:wifi' : 'i-lucide:wifi-off'" :class="['size-3.5', machineOnlineGet(machine) ? 'text-success' : 'text-neutral-400']" />
          <span>{{ machineOnlineGet(machine) ? t('components.sentinel.scenes.card.machine.online') : t('components.sentinel.scenes.card.machine.offline') }}</span>
        </div>
      </div>

      <ul class="text-[13px]">
        <li class="bg-default/22 py-1.15 mb-2 flex items-center gap-2 rounded-md px-2.5">
          <div class="text-muted flex w-24 shrink-0 items-center gap-1.5 text-xs leading-4.5">
            <UIcon name="i-ic:outline-computer" class="text-dimmed size-3.5" />
            <span>{{ t('components.sentinel.scenes.card.fields.machineCode') }}</span>
          </div>
          <span class="min-w-0 flex-1 self-center leading-4.5 break-all">{{ machine.machineCode || '-' }}</span>
          <UTooltip v-if="String(machine.machineCode || '').trim()" :text="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" :content="{ side: 'right' }">
            <UButton :color="stateCodeCopied ? 'success' : 'neutral'" variant="link" size="xs" :icon="stateCodeCopied ? 'i-lucide-copy-check' : 'i-lucide-copy'" :aria-label="t('components.sentinel.scenes.card.tooltips.copyToClipboard')" @click.stop="handleMachineCodeCopy" />
          </UTooltip>
        </li>
        <li class="bg-default/22 py-1.15 mb-2 flex items-center gap-2 rounded-md px-2.5">
          <div class="text-muted flex w-24 shrink-0 items-center gap-1.5 text-xs leading-4.5">
            <UIcon name="i-lucide:sticky-note" class="text-dimmed size-3.5" />
            <span>{{ t('components.sentinel.scenes.card.fields.machineRemark') }}</span>
          </div>
          <slot name="machine-remark-content" :machine="machine">
            <span class="min-w-0 flex-1 self-center leading-4.5 break-all">{{ machine.machineRemark || '-' }}</span>
          </slot>
          <slot name="machine-remark-actions" :machine="machine" />
        </li>
        <li class="bg-default/22 py-1.15 flex items-center gap-2 rounded-md px-2.5">
          <div class="text-muted flex w-24 shrink-0 items-center gap-1.5 text-xs leading-4.5">
            <UIcon name="i-lucide:clock-3" class="text-dimmed size-3.5" />
            <span>{{ t('components.sentinel.scenes.card.fields.lastSeen') }}</span>
          </div>
          <span v-if="String(machine.machineLastSeenAt || machine.lastSeenAt || '').trim()" class="min-w-0 flex-1 self-center leading-4.5">
            <Datetime :datetime="String(machine.machineLastSeenAt || machine.lastSeenAt || '').trim()" />
          </span>
          <span v-else class="min-w-0 flex-1 self-center leading-4.5 break-all">--</span>
        </li>
      </ul>

      <div v-if="$slots.body" class="mt-8">
        <slot name="body" :machine="machine" />
      </div>

      <div v-if="$slots.footer" class="border-default/45 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3.5">
        <slot name="footer" :machine="machine" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import type { ISettingsUnattendedMachineCardBaseProps } from '@/components/settings/unattended/machine-card-base/index.types';

/**
 * Hook：i18n
 */
/**
 * Hook：国际化工具。
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
const { machine, localMachineCode } = defineProps<ISettingsUnattendedMachineCardBaseProps>();

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
const isLocalMachine = (machineCode: string): boolean => String(machineCode || '').trim() === String(localMachineCode || '').trim();

/**
 * 函数：获取机器在线状态
 * @param {IPageSettingsUnattendedMachineCardInfo} machine 机器信息
 * @returns {boolean} 是否在线
 */
const machineOnlineGet = (currentMachine: IPageSettingsUnattendedMachineCardInfo): boolean => {
  if (typeof currentMachine?.online === 'boolean') {
    return currentMachine.online;
  }

  return isLocalMachine(String(currentMachine?.machineCode || ''));
};

/**
 * 函数：复制机器码
 */
const handleMachineCodeCopy = async (): Promise<void> => {
  const value = String(machine.machineCode || '').trim();
  if (!value) {
    return;
  }

  try {
    await copy(value);
  } catch {
    return;
  }

  toast.add({
    description: h('span', { class: 'break-all' }, [h('span', { class: 'text-muted' }, t('components.sentinel.scenes.card.toast.copiedPrefix')), h('span', { class: 'text-highlighted' }, value)]),
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
