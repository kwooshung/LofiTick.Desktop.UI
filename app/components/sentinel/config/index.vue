<template>
  <UFormField :label="t('components.sentinel.config.labels.heartbeatInterval')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge variant="soft">{{ t('components.sentinel.config.badges.heartbeat') }}</UBadge
          >：{{ t('components.sentinel.config.desc.heartbeatIntervalAfterHeartbeat') }}
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.heartbeatInterval" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.interval') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber :id="ids.heartbeatInterval" v-model="stateConfig.heartbeatInterval" orientation="vertical" :min="0" :max="60000" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </div>
      <label :for="ids.heartbeatInterval" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.milliseconds') }}</label>
    </div>
  </UFormField>

  <UFormField :label="t('components.sentinel.config.labels.heartbeatTimeoutCount')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge variant="soft">{{ t('components.sentinel.config.badges.heartbeat') }}</UBadge
          >：{{ t('components.sentinel.config.desc.crashCountPrefix') }}{{ t('components.sentinel.config.desc.crashCountMiddle') }}
          <UBadge color="error" variant="soft">{{ t('components.sentinel.config.badges.crash') }}</UBadge>
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.heartbeatTimeoutCount" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.count') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber :id="ids.heartbeatTimeoutCount" v-model="stateConfig.heartbeatTimeoutCount" orientation="vertical" :min="0" :max="10" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </div>
      <label :for="ids.heartbeatTimeoutCount" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.times') }}</label>
    </div>
  </UFormField>

  <UFormField :label="t('components.sentinel.config.labels.restartDelay')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge color="error" variant="soft">{{ t('components.sentinel.config.badges.crash') }}</UBadge
          >：<UBadge color="secondary" variant="soft">{{ t('components.sentinel.config.badges.wait') }}</UBadge>
          {{ t('components.sentinel.config.desc.restartDelaySuffix') }}
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.restartDelay" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.delay') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber :id="ids.restartDelay" v-model="stateConfig.restartDelay" orientation="vertical" :min="0" :max="10000" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </div>
      <label :for="ids.restartDelay" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.milliseconds') }}</label>
    </div>
  </UFormField>

  <UFormField :label="t('components.sentinel.config.labels.restartMaxAttempts')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge variant="soft">{{ t('components.sentinel.config.badges.consecutiveRestart') }}</UBadge
          >：<UBadge color="error" variant="soft">{{ t('components.sentinel.config.badges.crash') }}</UBadge> {{ t('components.sentinel.config.desc.restartEpisodeAfterCrash') }} <UBadge variant="soft">{{ t('components.sentinel.config.badges.restartDelay') }}</UBadge>
          {{ t('components.sentinel.config.desc.restartEpisodeAfterDelay') }} <UBadge color="secondary" variant="soft">{{ t('components.sentinel.config.badges.maxRestart') }}</UBadge> {{ t('components.sentinel.config.desc.restartEpisodeAfterMax') }}
          <UBadge variant="soft">{{ t('components.sentinel.config.badges.restartCooldown') }}</UBadge>
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.restartMaxAttempts" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.count') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber :id="ids.restartMaxAttempts" v-model="stateConfig.restartMaxAttempts" orientation="vertical" :min="0" :max="10" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </div>
      <label :for="ids.restartMaxAttempts" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.times') }}</label>
    </div>
  </UFormField>

  <UFormField :label="t('components.sentinel.config.labels.restartCooldown')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge variant="soft">{{ t('components.sentinel.config.badges.restartCooldown') }}</UBadge
          >：{{ t('components.sentinel.config.desc.restartCooldownPrefix') }} <UBadge variant="soft">{{ t('components.sentinel.config.badges.consecutiveRestart') }}</UBadge> {{ t('components.sentinel.config.desc.restartCooldownMiddle') }}
          <UBadge color="secondary" variant="soft">{{ t('components.sentinel.config.badges.maxRestart') }}</UBadge> {{ t('components.sentinel.config.desc.restartCooldownSuffixBeforeNext') }} <UBadge variant="soft">{{ t('components.sentinel.config.badges.consecutiveRestart') }}</UBadge>
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.restartCooldown" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.cooldown') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber :id="ids.restartCooldown" v-model="stateConfig.restartCooldown" orientation="vertical" :min="0" :max="3600000" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </div>
      <label :for="ids.restartCooldown" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.milliseconds') }}</label>
    </div>
  </UFormField>

  <UFormField :label="t('components.sentinel.config.labels.restartBurstWindow')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge color="error" variant="soft">{{ t('components.sentinel.config.badges.restartBurst') }}</UBadge
          >：<UBadge variant="soft">{{ t('components.sentinel.config.badges.consecutiveRestart') }}</UBadge>
          {{ t('components.sentinel.config.desc.restartBurstWindowAfterConsecutive') }}
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.restartBurstWindow" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.consecutive') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber :id="ids.restartBurstWindow" v-model="stateConfig.restartBurstWindow" orientation="vertical" :min="RESTART_BURST_WINDOW_MIN" :max="RESTART_BURST_WINDOW_MAX" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </div>
      <label :for="ids.restartBurstWindow" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.times') }}</label>
    </div>
  </UFormField>

  <UFormField :label="t('components.sentinel.config.labels.restartBurstMaxAttempts')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge color="error" variant="soft">{{ t('components.sentinel.config.badges.restartBurst') }}</UBadge
          >：{{ t('components.sentinel.config.desc.maxBurstAfterBurst') }}
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.restartBurstMaxAttempts" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.burst') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber :id="ids.restartBurstMaxAttempts" v-model="stateConfig.restartBurstMaxAttempts" orientation="vertical" :min="0" :max="10" variant="none" :increment="{ color: 'neutral', variant: 'soft' }" :decrement="{ color: 'neutral', variant: 'soft' }" />
      </div>
      <label :for="ids.restartBurstMaxAttempts" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.times') }}</label>
    </div>
  </UFormField>

  <UFormField :label="t('components.sentinel.config.labels.restartBurstCooldown')" :ui="{ labelWrapper: 'min-w-0 flex-1', container: 'shrink-0', label: 'text-base text-highlighted mb-1', description: 'text-muted break-words' }" class="flex items-center justify-between gap-2 not-last:pb-4">
    <template #description>
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap items-center gap-1">
          <UBadge color="error" variant="soft">{{ t('components.sentinel.config.badges.restartBurst') }}</UBadge
          >：{{ t('components.sentinel.config.desc.burstCooldownAfterBurst') }} <UBadge color="secondary" variant="soft">{{ t('components.sentinel.config.badges.wait') }}</UBadge> {{ t('components.sentinel.config.desc.burstCooldownAfterWait') }}
        </div>
      </div>
    </template>
    <div class="inline-flex shrink-0 items-center self-center">
      <label :for="ids.restartBurstCooldown" class="bg-elevated/50 border-accented text-muted flex rounded-l-sm border border-r-0 px-2 py-1.5">{{ t('components.sentinel.config.units.cooldown') }}</label>
      <div class="border-accented focus-within:border-primary relative h-fit w-36 border transition-colors duration-300">
        <UInputNumber
          :id="ids.restartBurstCooldown"
          v-model="stateConfig.restartBurstCooldown"
          orientation="vertical"
          :min="RESTART_BURST_COOLDOWN_MIN"
          :max="RESTART_BURST_COOLDOWN_MAX"
          variant="none"
          :increment="{ color: 'neutral', variant: 'soft' }"
          :decrement="{ color: 'neutral', variant: 'soft' }"
        />
      </div>
      <label :for="ids.restartBurstCooldown" class="bg-elevated/50 border-accented text-muted flex rounded-r-sm border border-l-0 px-2 py-1.5">{{ t('components.sentinel.config.units.milliseconds') }}</label>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
import type { ISentinelConfig, ISentinelConfigAnalysis, ISentinelConfigEmits, ISentinelConfigExpose, ISentinelConfigOverrides } from '@/components/sentinel/config/index.types';

/**
 * 事件
 */
const emit = defineEmits<ISentinelConfigEmits>();

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * 常量：哨兵通用配置默认值
 */
const DEFAULTS: Readonly<ISentinelConfig> = {
  heartbeatInterval: 5000,
  heartbeatTimeoutCount: 3,
  restartDelay: 3000,
  restartCooldown: 60000,
  restartMaxAttempts: 5,
  restartBurstWindow: 3,
  restartBurstCooldown: 60000,
  restartBurstMaxAttempts: 3
} as const;

/**
 * 状态：当前配置
 */
const stateConfig = reactive<ISentinelConfig>({
  heartbeatInterval: DEFAULTS.heartbeatInterval,
  heartbeatTimeoutCount: DEFAULTS.heartbeatTimeoutCount,
  restartDelay: DEFAULTS.restartDelay,
  restartCooldown: DEFAULTS.restartCooldown,
  restartMaxAttempts: DEFAULTS.restartMaxAttempts,
  restartBurstWindow: DEFAULTS.restartBurstWindow,
  restartBurstCooldown: DEFAULTS.restartBurstCooldown,
  restartBurstMaxAttempts: DEFAULTS.restartBurstMaxAttempts
});

/**
 * 常量：输入框 id 集合（避免重复）
 */
const ids = {
  heartbeatInterval: 'sentinelHeartbeatInterval',
  heartbeatTimeoutCount: 'sentinelHeartbeatTimeoutCount',
  restartDelay: 'sentinelRestartDelay',
  restartCooldown: 'sentinelRestartCooldown',
  restartMaxAttempts: 'sentinelRestartMaxAttempts',
  restartBurstWindow: 'sentinelRestartBurstWindow',
  restartBurstCooldown: 'sentinelRestartBurstCooldown',
  restartBurstMaxAttempts: 'sentinelRestartBurstMaxAttempts'
} as const;

/**
 * 常量：重启爆发静态边界（次数）
 */
const RESTART_BURST_WINDOW_MIN = 0;
/**
 * 常量：RESTART_BURST_WINDOW_MAX。
 */
const RESTART_BURST_WINDOW_MAX = 10;

/**
 * 常量：爆发冷却静态边界（毫秒）
 */
const RESTART_BURST_COOLDOWN_MIN = 0;
/**
 * 常量：RESTART_BURST_COOLDOWN_MAX。
 */
const RESTART_BURST_COOLDOWN_MAX = 3600000;

/**
 * 监听：爆发冷却相关边界变化 -> 自动收紧当前值
 */
watch(
  () => stateConfig.restartBurstCooldown,
  (current) => {
    /**
     * 变量：爆发冷却当前值（安全值）
     */
    const safeCurrent = Number.isFinite(current) ? Math.trunc(current) : RESTART_BURST_COOLDOWN_MIN;

    // 越界则自动收紧到 min/max
    if (safeCurrent < RESTART_BURST_COOLDOWN_MIN) {
      stateConfig.restartBurstCooldown = RESTART_BURST_COOLDOWN_MIN;
      return;
    }
    if (safeCurrent > RESTART_BURST_COOLDOWN_MAX) {
      stateConfig.restartBurstCooldown = RESTART_BURST_COOLDOWN_MAX;
    }
  },
  { immediate: true }
);

/**
 * 函数：把毫秒转换为 HH:mm:ss
 * 描述：小时使用累计小时（可超过 24）。负数将按 0 处理。
 * @param {number} ms 毫秒
 * @return {string} 格式化时长
 */
const durationHmsGet = (ms: number): string => {
  /**
   * 变量：安全毫秒数
   */
  const safeMs = Number.isFinite(ms) ? Math.max(0, Math.trunc(ms)) : 0;

  /**
   * 变量：总秒数
   */
  const totalSeconds = Math.floor(safeMs / 1000);

  /**
   * 变量：小时
   */
  const hours = Math.floor(totalSeconds / 3600);

  /**
   * 变量：分钟
   */
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  /**
   * 变量：秒
   */
  const seconds = totalSeconds % 60;

  /**
   * 常量：pad2。
   */
  const pad2 = (n: number): string => String(n).padStart(2, '0');
  return `${String(hours).padStart(2, '0')}:${pad2(minutes)}:${pad2(seconds)}`;
};

/**
 * 函数：合并默认值与覆盖值
 * @param {ISentinelConfigOverrides} overrides 覆盖值
 * @return {ISentinelConfig} 合并后的配置
 */
const configMerge = (overrides: ISentinelConfigOverrides): ISentinelConfig => {
  /**
   * 变量：合并结果
   */
  const merged: ISentinelConfig = {
    heartbeatInterval: overrides.heartbeatInterval ?? DEFAULTS.heartbeatInterval,
    heartbeatTimeoutCount: overrides.heartbeatTimeoutCount ?? DEFAULTS.heartbeatTimeoutCount,
    restartDelay: overrides.restartDelay ?? DEFAULTS.restartDelay,
    restartCooldown: overrides.restartCooldown ?? DEFAULTS.restartCooldown,
    restartMaxAttempts: overrides.restartMaxAttempts ?? DEFAULTS.restartMaxAttempts,
    restartBurstWindow: overrides.restartBurstWindow ?? DEFAULTS.restartBurstWindow,
    restartBurstCooldown: overrides.restartBurstCooldown ?? DEFAULTS.restartBurstCooldown,
    restartBurstMaxAttempts: overrides.restartBurstMaxAttempts ?? DEFAULTS.restartBurstMaxAttempts
  };

  return merged;
};

/**
 * 函数：获取当前生效配置
 * @return {ISentinelConfig} 当前配置
 */
const configGet = (): ISentinelConfig => {
  return {
    heartbeatInterval: stateConfig.heartbeatInterval,
    heartbeatTimeoutCount: stateConfig.heartbeatTimeoutCount,
    restartDelay: stateConfig.restartDelay,
    restartCooldown: stateConfig.restartCooldown,
    restartMaxAttempts: stateConfig.restartMaxAttempts,
    restartBurstWindow: stateConfig.restartBurstWindow,
    restartBurstCooldown: stateConfig.restartBurstCooldown,
    restartBurstMaxAttempts: stateConfig.restartBurstMaxAttempts
  };
};

/**
 * 函数：设置覆盖值（缺失字段回退默认值）
 * @param {ISentinelConfigOverrides} overrides 覆盖值
 */
const overridesSet = (overrides: ISentinelConfigOverrides): void => {
  /**
   * 函数：merged。
   */
  const merged = configMerge(overrides);

  Object.assign(stateConfig, merged);
};

/**
 * 函数：重置为默认值
 */
const resetToDefaults = (): void => {
  overridesSet({});
};

/**
 * 函数：重置为（默认值 + 覆盖值）
 * @param {ISentinelConfigOverrides} overrides 覆盖值
 */
const resetToOverrides = (overrides: ISentinelConfigOverrides): void => {
  overridesSet(overrides);
};

/**
 * 计算属性：配置分析结果
 */
const computedAnalysis = computed<ISentinelConfigAnalysis>(() => {
  /**
   * 变量：判定崩溃耗时（ms）
   */
  const heartbeatInterval = Number.isFinite(stateConfig.heartbeatInterval) ? Math.max(0, Math.trunc(stateConfig.heartbeatInterval)) : 0;
  /**
   * 常量：heartbeatTimeoutCount。
   */
  const heartbeatTimeoutCount = Number.isFinite(stateConfig.heartbeatTimeoutCount) ? Math.max(0, Math.trunc(stateConfig.heartbeatTimeoutCount)) : 0;
  /**
   * 常量：crashDecisionMs。
   */
  const crashDecisionMs = heartbeatInterval * heartbeatTimeoutCount;

  /**
   * 变量：重启延时（安全整数，ms）
   */
  const restartDelay = Number.isFinite(stateConfig.restartDelay) ? Math.max(0, Math.trunc(stateConfig.restartDelay)) : 0;

  /**
   * 变量：最大重启次数（安全整数）
   */
  const restartMaxAttempts = Number.isFinite(stateConfig.restartMaxAttempts) ? Math.max(0, Math.trunc(stateConfig.restartMaxAttempts)) : 0;

  /**
   * 变量：重启冷却（安全整数，ms）
   */
  const restartCooldown = Number.isFinite(stateConfig.restartCooldown) ? Math.max(0, Math.trunc(stateConfig.restartCooldown)) : 0;

  /**
   * 变量：爆发阈值（安全整数）
   */
  const restartBurstWindow = Number.isFinite(stateConfig.restartBurstWindow) ? Math.max(0, Math.trunc(stateConfig.restartBurstWindow)) : 0;

  /**
   * 变量：爆发冷却（安全整数，ms）
   */
  const restartBurstCooldown = Number.isFinite(stateConfig.restartBurstCooldown) ? Math.max(0, Math.trunc(stateConfig.restartBurstCooldown)) : 0;

  /**
   * 变量：最大爆发次数（安全整数）
   */
  const restartBurstMaxAttempts = Number.isFinite(stateConfig.restartBurstMaxAttempts) ? Math.max(0, Math.trunc(stateConfig.restartBurstMaxAttempts)) : 0;

  /**
   * 变量：单次重启尝试最坏耗时（ms）
   * 描述：包含一次“判定崩溃耗时”与一次“重启延时”，用于推演连续失败的最坏情况。
   */
  const restartAttemptWorstMs = crashDecisionMs + restartDelay;

  /**
   * 变量：一次连续重启最坏耗时（ms）
   * 描述：按“每次重启尝试都会再次进入判定崩溃流程”的最坏情况推演。
   */
  const restartEpisodeWorstMs = restartAttemptWorstMs * restartMaxAttempts;

  /**
   * 变量：一次连续重启 + 冷却 最坏耗时（ms）
   */
  const restartEpisodeWithCooldownWorstMs = restartEpisodeWorstMs + (restartMaxAttempts > 0 ? restartCooldown : 0);

  /**
   * 变量：一次爆发最坏耗时（ms）
   * 描述：按“完整一轮连续重启（达到最大重启后进入重启冷却）算 1 次失败”计数；累计到爆发阈值即视为发生 1 次爆发。
   */
  const burstWorstMs = restartBurstWindow > 0 && restartEpisodeWithCooldownWorstMs > 0 ? restartEpisodeWithCooldownWorstMs * restartBurstWindow : 0;

  /**
   * 变量：最坏总耗时（ms）
   * 描述：从开始丢心跳到触发 1 次爆发，并在此基础上叠加剩余爆发次数的爆发冷却。
   * 说明：该估算仅基于当前配置参数与“每次重启立即失败”的假设，不包含进程退出/启动耗时。
   */
  const worstTotalMs = burstWorstMs > 0 && restartBurstMaxAttempts > 0 ? burstWorstMs + restartBurstCooldown * Math.max(0, restartBurstMaxAttempts - 1) : 0;

  return {
    crashDecisionDuration: durationHmsGet(crashDecisionMs),
    restartDelayDuration: durationHmsGet(restartDelay),
    restartCooldownDuration: durationHmsGet(restartCooldown),
    restartEpisodeWorstDuration: durationHmsGet(restartEpisodeWorstMs),
    restartEpisodeWithCooldownWorstDuration: durationHmsGet(restartEpisodeWithCooldownWorstMs),
    burstWorstDuration: durationHmsGet(burstWorstMs),
    burstCooldownDuration: durationHmsGet(restartBurstCooldown),
    worstTotalDuration: durationHmsGet(worstTotalMs)
  };
});

/**
 * 函数：获取配置分析结果
 * @return {ISentinelConfigAnalysis} 分析结果
 */
const analysisGet = (): ISentinelConfigAnalysis => computedAnalysis.value;

/**
 * 监听：配置分析结果变化 -> 触发事件
 */
watch(
  computedAnalysis,
  (analysis) => {
    emit('analysis-change', analysis);
  },
  {
    immediate: true,
    deep: true
  }
);

/**
 * 暴露接口
 */
defineExpose<ISentinelConfigExpose>({
  configGet,
  analysisGet,
  overridesSet,
  resetToDefaults,
  resetToOverrides
});
</script>
