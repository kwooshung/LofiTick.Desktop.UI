<template>
  <div v-if="computedMachines.length > 0" class="flex flex-wrap gap-3">
    <div v-for="machine in computedMachines" :key="machine.machineCode" class="max-w-98 min-w-80 flex-[1_1_20.5rem]">
      <SettingsUnattendedMachineCardBase :machine="machine" :local-machine-code="props.localMachineCode">
        <template #body>
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-elevated/58 rounded-md px-2.5 py-2 text-center">
              <div class="text-muted flex items-center justify-center gap-1 text-[11px] leading-4">
                <UIcon name="i-lucide:file-text" class="size-3.5" />
                <span>{{ t('components.sentinel.scenes.card.stats.logs') }}</span>
              </div>
              <div class="text-highlighted mt-1 text-center text-lg leading-6 font-semibold">{{ machine.logs.length }}</div>
            </div>
            <div class="bg-elevated/58 rounded-md px-2.5 py-2 text-center">
              <div class="text-muted flex items-center justify-center gap-1 text-[11px] leading-4">
                <UIcon name="i-lucide:monitor-dot" class="size-3.5" />
                <span>{{ t('components.sentinel.scenes.card.stats.machineLogs') }}</span>
              </div>
              <div class="mt-1 text-center text-lg leading-6 font-semibold text-cyan-500">{{ machineLogsCountGet(machine) }}</div>
            </div>
            <div class="bg-elevated/58 rounded-md px-2.5 py-2 text-center">
              <div class="text-muted flex items-center justify-center gap-1 text-[11px] leading-4">
                <UIcon name="i-lucide:layout-grid" class="size-3.5" />
                <span>{{ t('components.sentinel.scenes.card.stats.sceneLogs') }}</span>
              </div>
              <div class="mt-1 text-center text-lg leading-6 font-semibold text-violet-500">{{ sceneLogsCountGet(machine) }}</div>
            </div>
          </div>

          <div class="mt-3 space-y-1.5">
            <template v-if="previewLogsGet(machine).length > 0">
              <article v-for="item in previewLogsGet(machine)" :key="item.id" class="bg-muted/35 rounded-md px-2.5 py-2 text-sm">
                <div class="flex items-center gap-2">
                  <UBadge :color="levelColorGet(item.level)" variant="soft" size="xs">{{ item.level || '-' }}</UBadge>
                  <UBadge color="neutral" variant="outline" size="xs">{{ item.scope || '-' }}</UBadge>
                  <span class="text-muted ml-auto text-[11px]"><Datetime :datetime="String(item.ts || '').trim()" /></span>
                </div>
                <div class="text-highlighted mt-1.5 line-clamp-2 leading-5 wrap-break-word">{{ previewLogMessageGet(item) }}</div>
              </article>
            </template>
            <template v-else>
              <UEmpty
                icon="i-lucide:file-text"
                :title="t('components.sentinel.scenes.card.empty.logs.title')"
                :description="t('components.sentinel.scenes.card.empty.logs.description')"
                variant="naked"
                size="xs"
                :ui="{ root: 'p-0 items-start justify-start', header: 'items-start text-left max-w-none', body: 'items-start max-w-none' }"
              />
            </template>
          </div>
        </template>

        <template #footer>
          <div class="flex w-full items-center justify-end gap-2">
            <UButton icon="i-mdi:network-outline" color="primary" size="sm" variant="outline" @click.stop="handleMachineNetworkOpen(machine.machineCode)">{{ t('components.sentinel.scenes.card.actions.network') }}</UButton>
            <UButton icon="i-lucide:file-text" color="primary" size="sm" variant="soft" @click.stop="handleMachineLogsOpen(machine.machineCode)">{{ t('components.sentinel.scenes.card.actions.logs') }}</UButton>
          </div>
        </template>
      </SettingsUnattendedMachineCardBase>
    </div>
  </div>

  <div v-else class="ring-default ring-dashed rounded-md px-4 py-5 ring-1">
    <UEmpty icon="i-lucide:file-text" :title="t('components.sentinel.scenes.card.empty.logs.title')" :description="t('components.sentinel.scenes.card.empty.logs.description')" variant="naked" size="sm" :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }" />
  </div>

  <SettingsUnattendedMachineNetworkDialog v-model:open="stateNetworkOpen" :machine="computedActiveMachine" />
  <SettingsUnattendedMachineLogsDialog v-model:open="stateLogsOpen" :machine="computedActiveMachine" />
</template>

<script setup lang="ts">
/**
 * 接口：哨兵日志卡片 Props
 */
interface ISettingsUnattendedSentinelLogsCardsProps {
  /**
   * 机器日志列表
   */
  machines: IPageSettingsUnattendedSentinelLogsMachineCard[];

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
 * Props：组件属性
 */
const props = defineProps<ISettingsUnattendedSentinelLogsCardsProps>();

/**
 * 状态：网卡弹窗是否打开
 */
const stateNetworkOpen = ref(false);

/**
 * 状态：日志弹窗是否打开
 */
const stateLogsOpen = ref(false);

/**
 * 状态：当前选择的机器码
 */
const stateActiveMachineCode = ref<string>('');

/**
 * 计算属性：机器列表
 */
const computedMachines = computed(() => {
  const machines = Array.isArray(props.machines) ? [...props.machines] : [];

  return machines.sort((left, right) => {
    const leftCode = String(left?.machineCode || '').trim();
    const rightCode = String(right?.machineCode || '').trim();
    const localCode = String(props.localMachineCode || '').trim();

    const leftIsLocal = leftCode !== '' && leftCode === localCode;
    const rightIsLocal = rightCode !== '' && rightCode === localCode;

    if (leftIsLocal !== rightIsLocal) {
      return leftIsLocal ? -1 : 1;
    }

    const leftLabel = String(left?.machineName || '').trim() || leftCode;
    const rightLabel = String(right?.machineName || '').trim() || rightCode;

    return leftLabel.localeCompare(rightLabel, 'zh-CN');
  });
});

/**
 * 计算属性：当前激活机器
 */
const computedActiveMachine = computed(() => {
  const code = String(stateActiveMachineCode.value || '').trim();
  if (!code) {
    return null;
  }

  return computedMachines.value.find((item) => String(item.machineCode || '').trim() === code) ?? null;
});

/**
 * 函数：打开网卡弹窗
 * @param {string} machineCode 机器码
 */
const handleMachineNetworkOpen = (machineCode: string): void => {
  stateActiveMachineCode.value = String(machineCode || '').trim();
  stateNetworkOpen.value = true;
};

/**
 * 函数：打开日志弹窗
 * @param {string} machineCode 机器码
 */
const handleMachineLogsOpen = (machineCode: string): void => {
  stateActiveMachineCode.value = String(machineCode || '').trim();
  stateLogsOpen.value = true;
};

/**
 * 函数：获取日志预览列表
 * @param {IPageSettingsUnattendedSentinelLogsMachineCard} machine 机器日志信息
 * @returns {IPageSettingsUnattendedSentinelLogItem[]} 预览列表
 */
const previewLogsGet = (machine: IPageSettingsUnattendedSentinelLogsMachineCard): IPageSettingsUnattendedSentinelLogItem[] => machine.logs.slice(0, 3);

/**
 * 函数：获取预览日志文案
 * @param {IPageSettingsUnattendedSentinelLogItem} item 日志项
 * @returns {string} 预览文本
 */
const previewLogMessageGet = (item: IPageSettingsUnattendedSentinelLogItem): string => {
  const safeMessage = String(item.message || '').trim();
  if (!safeMessage) {
    return '-';
  }

  if (safeMessage.startsWith('components.sentinel.scenes.card.logsMeta.')) {
    const translated = String(t(safeMessage) || '');
    return translated && translated !== safeMessage ? translated : safeMessage;
  }

  return safeMessage;
};

/**
 * 函数：统计机器级日志数量
 * @param {IPageSettingsUnattendedSentinelLogsMachineCard} machine 机器日志信息
 * @returns {number} 数量
 */
const machineLogsCountGet = (machine: IPageSettingsUnattendedSentinelLogsMachineCard): number => machine.logs.filter((item) => String(item.scope || '').trim() === 'machine').length;

/**
 * 函数：统计场景级日志数量
 * @param {IPageSettingsUnattendedSentinelLogsMachineCard} machine 机器日志信息
 * @returns {number} 数量
 */
const sceneLogsCountGet = (machine: IPageSettingsUnattendedSentinelLogsMachineCard): number => machine.logs.filter((item) => String(item.scope || '').trim() === 'scene').length;

/**
 * 函数：日志级别映射为徽标颜色
 * @param {string} level 日志级别
 * @returns {'error' | 'warning' | 'success' | 'primary' | 'neutral'} 颜色
 */
const levelColorGet = (level: string): 'error' | 'warning' | 'success' | 'primary' | 'neutral' => {
  const safeLevel = String(level || '')
    .trim()
    .toLowerCase();
  if (safeLevel === 'error') {
    return 'error';
  }
  if (safeLevel === 'warn' || safeLevel === 'warning') {
    return 'warning';
  }
  if (safeLevel === 'success') {
    return 'success';
  }
  if (safeLevel === 'info') {
    return 'primary';
  }

  return 'neutral';
};
</script>
