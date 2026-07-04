<template>
  <div class="flex flex-wrap gap-3">
    <div v-for="machine in computedMachines" :key="machine.machineCode" class="max-w-98 min-w-80 flex-[1_1_20.5rem]">
      <SettingsUnattendedMachineCardBase :machine="machine" :local-machine-code="localMachineCode">
        <template #machine-remark-content>
          <template v-if="remarkEditingGet(machine.machineCode)">
            <div :ref="remarkInputWrapRef(machine.machineCode)" class="min-w-0 flex-1">
              <UInput :model-value="remarkDraftGet(machine.machineCode)" size="sm" class="w-full" @update:model-value="(value) => handleRemarkDraftUpdate(machine.machineCode, value)" @keydown.enter.prevent="handleRemarkSave(machine)" @keydown.esc.prevent="handleRemarkEditCancel(machine)" />
            </div>
          </template>
          <template v-else>
            <span class="min-w-0 flex-1 break-all">{{ machine.machineRemark || '-' }}</span>
          </template>
        </template>

        <template #machine-remark-actions>
          <template v-if="remarkEditingGet(machine.machineCode)">
            <UTooltip :text="t('components.sentinel.scenes.card.tooltips.saveRemark')" :content="{ side: 'right' }">
              <UButton color="neutral" variant="link" size="sm" icon="i-lucide:save" :ui="{ leadingIcon: 'text-muted' }" :aria-label="t('components.sentinel.scenes.card.tooltips.saveRemark')" @click.stop="handleRemarkSave(machine)" />
            </UTooltip>
          </template>
          <template v-else>
            <UTooltip :text="t('components.sentinel.scenes.card.tooltips.editRemark')" :content="{ side: 'right' }">
              <UButton color="neutral" variant="link" size="sm" icon="i-lucide:pencil" :ui="{ leadingIcon: 'text-muted' }" :aria-label="t('components.sentinel.scenes.card.tooltips.editRemark')" @click.stop="handleRemarkEditStart(machine)" />
            </UTooltip>
          </template>
        </template>

        <template #body>
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-elevated/58 rounded-md px-2.5 py-2 text-center">
              <div class="text-muted flex items-center justify-center gap-1 text-[11px] leading-4">
                <UIcon name="i-lucide:layout-grid" class="size-3.5" />
                <span>{{ t('components.sentinel.scenes.card.stats.scenes') }}</span>
              </div>
              <div class="text-highlighted mt-1 text-center text-lg leading-6 font-semibold">{{ scenesCountTotalGet(machine) }}</div>
            </div>
            <div class="bg-elevated/58 rounded-md px-2.5 py-2 text-center">
              <div class="text-muted flex items-center justify-center gap-1 text-[11px] leading-4">
                <UIcon name="i-lucide:circle-check" class="size-3.5" />
                <span>{{ t('components.sentinel.scenes.card.stats.enabled') }}</span>
              </div>
              <div class="mt-1 text-center text-lg leading-6 font-semibold text-emerald-500">{{ scenesCountEnabledGet(machine) }}</div>
            </div>
            <div class="bg-elevated/58 rounded-md px-2.5 py-2 text-center">
              <div class="text-muted flex items-center justify-center gap-1 text-[11px] leading-4">
                <UIcon name="i-lucide:circle-x" class="size-3.5" />
                <span>{{ t('components.sentinel.scenes.card.stats.disabled') }}</span>
              </div>
              <div class="mt-1 text-center text-lg leading-6 font-semibold text-amber-500">{{ scenesCountDisabledGet(machine) }}</div>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex items-center gap-2">
            <UPopover v-if="!isLocalMachine(machine.machineCode)" arrow :content="{ side: 'top', align: 'start', sideOffset: 8 }" :ui="{ content: 'no-drag p-3 w-56 z-51' }">
              <UButton color="error" variant="soft" icon="i-lucide:trash-2" :ui="{ leadingIcon: 'text-muted' }" size="sm">{{ t('components.sentinel.scenes.card.actions.deleteMachine') }}</UButton>
              <template #content="{ close }">
                <div class="flex flex-col gap-2">
                  <div class="text-highlighted text-sm font-medium">{{ t('components.sentinel.scenes.card.dialogs.deleteMachineTitle') }}</div>
                  <div class="text-muted text-xs break-all">{{ machine.machineName || machine.machineCode || '-' }}</div>
                  <div class="flex items-center justify-end gap-2 pt-1">
                    <UButton color="neutral" variant="outline" size="xs" icon="i-lucide:x" :ui="{ leadingIcon: 'text-muted' }" @click="() => close?.()">{{ t('common.actions.cancel') }}</UButton>
                    <UButton color="error" variant="solid" size="xs" icon="i-lucide:check" :ui="{ leadingIcon: 'text-white' }" @click="() => handleMachineDeleteConfirm(machine, close)">{{ t('common.actions.confirm') }}</UButton>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
          <div class="flex items-center gap-2">
            <UButton v-if="isLocalMachine(machine.machineCode)" icon="i-lucide:plus" color="primary" size="sm" variant="soft" @click.stop="emit('add')">{{ t('components.sentinel.scenes.card.actions.addScene') }}</UButton>
            <UButton icon="i-lucide:file-text" color="primary" size="sm" :variant="machineLogsExists(machine.machineCode) ? 'soft' : 'outline'" :disabled="!machineLogsExists(machine.machineCode)" @click.stop="handleMachineLogsOpen(machine.machineCode)">{{
              t('components.sentinel.scenes.card.actions.logs')
            }}</UButton>
            <UButton icon="i-lucide:network" color="primary" size="sm" variant="outline" @click.stop="handleMachineNetworkOpen(machine.machineCode)">{{ t('components.sentinel.scenes.card.actions.network') }}</UButton>
            <UButton icon="i-lucide:info" color="primary" size="sm" variant="outline" @click.stop="handleMachineOpen(machine.machineCode)">{{ t('components.sentinel.scenes.card.actions.details') }}</UButton>
          </div>
        </template>
      </SettingsUnattendedMachineCardBase>
    </div>
  </div>

  <UModal v-model:open="stateOpen" :title="computedDialogTitle" :ui="{ content: 'z-50 max-w-5xl', title: 'w-full font-normal' }">
    <template #title>
      <div class="min-w-0">
        <div class="text-highlighted text-lg font-medium">{{ computedDialogTitle }}</div>
        <div v-if="computedActiveMachine" class="text-muted mt-1 text-xs break-all">{{ computedActiveMachine.machineCode || '-' }}</div>
      </div>
    </template>
    <template #body>
      <div v-if="computedActiveMachine">
        <SettingsUnattendedScenesMachineDetails :machine="computedActiveMachine" :local-machine-code="localMachineCode" @add="emit('add')" @toggle-enabled="(payload) => emit('toggle-enabled', payload)" @edit="(id) => emit('edit', id)" @delete="(id) => emit('delete', id)" />
      </div>
      <div v-else class="py-6">
        <UEmpty icon="i-lucide:file" :title="t('components.sentinel.scenes.card.empty.data.title')" :description="t('components.sentinel.scenes.card.empty.data.description')" variant="naked" size="sm" :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }" />
      </div>
    </template>
  </UModal>

  <SettingsUnattendedMachineNetworkDialog v-model:open="stateNetworkOpen" :machine="computedActiveMachine" />
  <SettingsUnattendedMachineLogsDialog v-model:open="stateLogsOpen" :machine="computedActiveLogsMachine" />
</template>

<script setup lang="ts">
import type { ISettingsUnattendedScenesCardsProps } from '@/components/settings/unattended/scenes-cards/index.types';
/**
 * Hook：i18n
 */
/**
 * Hook：国际化工具。
 */
const { t } = useI18n();

/**
 * Props：组件输入
 */
const { localMachineCode, logsMachines, machines } = defineProps<ISettingsUnattendedScenesCardsProps>();

/**
 * 事件：组件事件
 */
const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'toggle-enabled', payload: IPageSettingsUnattendedScenesToggleEnabledPayload): void;
  (e: 'update-machine-remark', payload: IPageSettingsUnattendedScenesUpdateMachineRemarkPayload): void;
  (e: 'delete-machine', payload: IPageSettingsUnattendedScenesDeleteMachinePayload): void;
  (e: 'edit' | 'delete', id: string): void;
}>();

/**
 * 状态：Slideover 是否打开
 */
const stateOpen = ref(false);

/**
 * 状态：网卡弹窗是否打开
 */
const stateNetworkOpen = ref(false);

/**
 * 状态：日志弹窗是否打开
 */
const stateLogsOpen = ref(false);

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
 * 计算属性：机器列表
 */
const computedMachines = computed(() => {
  /**
   * 常量：machineList。
   */
  const machineList = Array.isArray(machines) ? [...machines] : [];

  return machineList.sort((left, right) => {
    /**
     * 常量：leftCode。
     */
    const leftCode = String(left?.machineCode || '').trim();
    /**
     * 常量：rightCode。
     */
    const rightCode = String(right?.machineCode || '').trim();
    /**
     * 常量：localCode。
     */
    const localCode = String(localMachineCode || '').trim();

    /**
     * 常量：leftIsLocal。
     */
    const leftIsLocal = leftCode !== '' && leftCode === localCode;
    /**
     * 常量：rightIsLocal。
     */
    const rightIsLocal = rightCode !== '' && rightCode === localCode;

    if (leftIsLocal !== rightIsLocal) {
      return leftIsLocal ? -1 : 1;
    }

    /**
     * 常量：leftLabel。
     */
    const leftLabel = String(left?.machineName || '').trim() || leftCode;
    /**
     * 常量：rightLabel。
     */
    const rightLabel = String(right?.machineName || '').trim() || rightCode;

    return leftLabel.localeCompare(rightLabel, 'zh-CN');
  });
});

/**
 * 计算属性：机器日志映射
 */
const computedLogsMachineMap = computed(() => {
  return new Map((Array.isArray(logsMachines) ? logsMachines : []).map((machine) => [String(machine.machineCode || '').trim(), machine] satisfies [string, IPageSettingsUnattendedSentinelLogsMachineCard]));
});

/**
 * 计算属性：当前激活机器
 */
const computedActiveMachine = computed(() => {
  /**
   * 常量：code。
   */
  const code = String(stateActiveMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return computedMachines.value.find((item) => String(item.machineCode || '').trim() === code) ?? null;
});

/**
 * 计算属性：当前激活日志机器
 */
const computedActiveLogsMachine = computed(() => {
  /**
   * 常量：code。
   */
  const code = String(stateActiveMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return computedLogsMachineMap.value.get(code) ?? null;
});

/**
 * 计算属性：当前正在编辑备注的机器
 */
const computedActiveRemarkEditingMachine = computed(() => {
  /**
   * 常量：code。
   */
  const code = String(stateActiveRemarkEditingMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return computedMachines.value.find((item) => String(item.machineCode || '').trim() === code) ?? null;
});

/**
 * 计算属性：当前正在编辑备注的容器
 */
const computedActiveRemarkEditingWrap = computed(() => {
  /**
   * 常量：code。
   */
  const code = String(stateActiveRemarkEditingMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return stateRemarkInputWrapByMachineCode.value[code] ?? null;
});

/**
 * 计算属性：Slideover 标题
 */
const computedDialogTitle = computed(() => {
  /**
   * 常量：machine。
   */
  const machine = computedActiveMachine.value;
  if (!machine) {
    return t('components.sentinel.scenes.card.dialogs.guardTitle');
  }

  /**
   * 常量：name。
   */
  const name = String(machine.machineName || '').trim() || t('components.sentinel.scenes.card.machine.unnamed');
  /**
   * 常量：code。
   */
  const code = String(machine.machineCode || '').trim();
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
  /**
   * 常量：code。
   */
  const code = String(machineCode || '').trim();
  return code ? String(stateRemarkDraftByMachineCode.value[code] ?? '') : '';
};

/**
 * 函数：记录备注输入框容器引用
 * @param {string} machineCode 机器码
 * @returns {(el: unknown) => void} ref 回调
 */
const remarkInputWrapRef = (machineCode: string) => {
  return (el: unknown): void => {
    /**
     * 常量：code。
     */
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
  /**
   * 常量：code。
   */
  const code = String(machineCode || '').trim();
  if (!code) {
    return null;
  }

  /**
   * 常量：wrap。
   */
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
const isLocalMachine = (machineCode: string): boolean => String(machineCode || '').trim() === String(localMachineCode || '').trim();

/**
 * 函数：打开指定机器详情
 * @param {string} machineCode 机器码
 */
const handleMachineOpen = (machineCode: string): void => {
  stateActiveMachineCode.value = String(machineCode || '').trim();
  stateOpen.value = true;
};

/**
 * 函数：打开指定机器网卡弹窗
 * @param {string} machineCode 机器码
 */
const handleMachineNetworkOpen = (machineCode: string): void => {
  stateActiveMachineCode.value = String(machineCode || '').trim();
  stateNetworkOpen.value = true;
};

/**
 * 函数：打开指定机器日志弹窗
 * @param {string} machineCode 机器码
 */
const handleMachineLogsOpen = (machineCode: string): void => {
  stateActiveMachineCode.value = String(machineCode || '').trim();
  stateLogsOpen.value = true;
};

/**
 * 函数：开始编辑机器备注
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 */
const handleRemarkEditStart = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): void => {
  /**
   * 常量：code。
   */
  const code = String(machine?.machineCode || '').trim();
  if (!code) {
    return;
  }

  stateRemarkEditingByMachineCode.value = { [code]: true };
  stateRemarkDraftByMachineCode.value[code] = String(machine?.machineRemark || '');
  stateActiveRemarkEditingMachineCode.value = code;

  nextTick(() => {
    /**
     * 常量：input。
     */
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
  /**
   * 常量：code。
   */
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
  /**
   * 常量：code。
   */
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
  /**
   * 常量：machineCode。
   */
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
  /**
   * 常量：machine。
   */
  const machine = computedActiveRemarkEditingMachine.value;
  if (!machine) {
    return;
  }

  handleRemarkEditCancel(machine);
});

/**
 * 函数：统计场景总数
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {number} 数量
 */
const scenesCountTotalGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): number => (Array.isArray(machine.items) ? machine.items.length : 0);

/**
 * 函数：统计启用场景数量
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {number} 数量
 */
const scenesCountEnabledGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): number => (Array.isArray(machine.items) ? machine.items.filter((item) => Boolean(item?.enabled)).length : 0);

/**
 * 函数：统计未启用场景数量
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @returns {number} 数量
 */
const scenesCountDisabledGet = (machine: IPageSettingsUnattendedScenesMachineRedisConfig): number => Math.max(0, scenesCountTotalGet(machine) - scenesCountEnabledGet(machine));

/**
 * 函数：当前机器是否存在日志
 * @param {string} machineCode 机器码
 * @returns {boolean} 是否有日志
 */
const machineLogsExists = (machineCode: string): boolean => {
  /**
   * 常量：code。
   */
  const code = String(machineCode || '').trim();
  if (!code) {
    return false;
  }

  return (computedLogsMachineMap.value.get(code)?.logs.length ?? 0) > 0;
};

/**
 * 函数：确认删除主机
 * @param {IPageSettingsUnattendedScenesMachineRedisConfig} machine 机器配置
 * @param {(() => void) | undefined} close 关闭函数
 */
const handleMachineDeleteConfirm = (machine: IPageSettingsUnattendedScenesMachineRedisConfig, close?: () => void): void => {
  emit('delete-machine', {
    machineName: String(machine.machineName || '').trim(),
    machineCode: String(machine.machineCode || '').trim()
  });
  close?.();
};
</script>
