<template>
  <UModal v-model:open="stateOpen" :title="t('components.sentinel.scenes.card.fields.logs')" :ui="{ content: 'z-50 max-w-5xl', title: 'w-full font-normal', body: 'max-h-[70vh] overflow-y-auto pr-1' }">
    <template #title>
      <template v-if="props.machine">
        <div class="min-w-0">
          <div class="text-highlighted text-lg font-medium">{{ props.machine.machineName || t('components.sentinel.scenes.card.machine.unnamed') }}</div>
          <div class="text-muted mt-1 text-xs break-all">{{ props.machine.machineCode || '-' }}</div>
        </div>
      </template>
      <template v-else>
        <div class="text-lg font-medium">{{ t('components.sentinel.scenes.card.fields.logs') }}</div>
      </template>
    </template>
    <template #body>
      <div v-if="props.machine" class="space-y-4">
        <div ref="refListTop" />
        <template v-if="computedLogs.length > 0">
          <article v-for="item in computedPagedLogs" :key="item.id" class="bg-elevated/40 ring-default space-y-3 rounded-md p-4 ring-1">
            <div class="flex flex-wrap items-center gap-2">
              <UBadge :color="levelColorGet(item.level)" variant="soft">{{ item.level || '-' }}</UBadge>
              <UBadge color="neutral" variant="outline">{{ item.scope || '-' }}</UBadge>
              <UBadge v-if="String(item.sceneName || '').trim()" color="info" variant="outline">{{ item.sceneName }}</UBadge>
              <span class="text-muted ml-auto text-xs"><Datetime :datetime="String(item.ts || '').trim()" /></span>
            </div>
            <div class="space-y-2">
              <template v-if="structuredLogMessageGet(item)">
                <div class="text-highlighted text-[13px] leading-6 tracking-[0.01em] wrap-break-word">
                  {{ structuredLogMessageGet(item)?.summary }}
                </div>
                <div v-if="structuredLogMessageGet(item)?.topLevelEntries.length" class="flex flex-wrap gap-1.5">
                  <span v-for="entry in structuredLogMessageGet(item)?.topLevelEntries" :key="`${item.id}-top-${entry.key}-${entry.value}`" class="bg-default/22 text-muted inline-flex items-center rounded px-2 py-1 text-xs">
                    <span class="text-dimmed">{{ entry.label }}:</span>
                    <span class="text-highlighted ml-1">{{ entry.value }}</span>
                  </span>
                </div>
                <div v-if="structuredLogMessageGet(item)?.recoveryEntries.length" class="bg-default/18 rounded-md px-3 py-2">
                  <div class="text-dimmed text-[11px] leading-4">{{ t('components.sentinel.scenes.card.logsMeta.recoveryTitle') }}</div>
                  <div class="mt-1 grid gap-x-3 gap-y-1.5 sm:grid-cols-2">
                    <div v-for="entry in structuredLogMessageGet(item)?.recoveryEntries" :key="`${item.id}-recovery-${entry.key}-${entry.value}`" class="flex items-start gap-1.5 text-xs leading-5">
                      <span class="text-dimmed shrink-0">{{ entry.label }}</span>
                      <span class="text-highlighted min-w-0 break-all">{{ entry.value }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="text-highlighted text-[13px] leading-6 tracking-[0.01em] wrap-break-word whitespace-pre-wrap">
                <template v-for="(segment, index) in logMessageSegmentsGet(logMessageTextLocalizedGet(item.message))" :key="`${item.id}-message-${index}-${segment.value}`">
                  <Datetime v-if="segment.type === 'datetime'" :datetime="segment.value" />
                  <span v-else>{{ segment.value }}</span>
                </template>
              </div>
            </div>
            <div class="text-muted flex flex-wrap items-center gap-2 text-xs break-all">
              <template v-for="(value, index) in logMetaValuesGet(item)" :key="`${item.id}-${index}-${value}`">
                <span v-if="index > 0">/</span>
                <Datetime v-if="isoDatetimeLikeGet(value)" :datetime="value" />
                <span v-else>{{ value }}</span>
              </template>
            </div>
          </article>

          <div v-if="computedLogs.length > LOGS_PAGE_SIZE" class="border-default flex items-center justify-end border-t pt-3">
            <UPagination v-model:page="statePage" show-edges :items-per-page="LOGS_PAGE_SIZE" :total="computedLogs.length" />
          </div>
        </template>
        <template v-else>
          <UEmpty icon="i-lucide:file-text" :title="t('components.sentinel.scenes.card.empty.logs.title')" :description="t('components.sentinel.scenes.card.empty.logs.description')" variant="naked" size="sm" :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }" />
        </template>
      </div>
      <div v-else class="py-6">
        <UEmpty icon="i-lucide:file-text" :title="t('components.sentinel.scenes.card.empty.data.title')" :description="t('components.sentinel.scenes.card.empty.data.description')" variant="naked" size="sm" :ui="{ root: 'p-0', header: 'max-w-none', body: 'max-w-none' }" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {
  IPageSettingsUnattendedSentinelLogsMachineCard,
  IPageSettingsUnattendedStructuredLogEntry,
  IPageSettingsUnattendedStructuredLogMessage,
  TPageSettingsUnattendedLogMessageSegment
} from '@@/shared/types/pages/settings/unattended/index.types';

/**
 * 接口：机器日志弹窗 Props
 */
interface ISettingsUnattendedMachineLogsDialogProps {
  /**
   * 当前机器日志信息
   */
  machine: IPageSettingsUnattendedSentinelLogsMachineCard | null;
}

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
const props = defineProps<ISettingsUnattendedMachineLogsDialogProps>();

/**
 * 常量：日志弹窗每页条数
 */
const LOGS_PAGE_SIZE = 12;

/**
 * 状态：日志弹窗当前页
 */
const statePage = ref(1);

/**
 * 引用：日志列表顶部锚点
 */
const refListTop = ref<HTMLElement | null>(null);

/**
 * 计算属性：当前机器日志列表
 */
const computedLogs = computed(() => (Array.isArray(props.machine?.logs) ? props.machine.logs : []));

/**
 * 计算属性：当前页日志列表
 */
const computedPagedLogs = computed(() => {
  const start = (Math.max(statePage.value, 1) - 1) * LOGS_PAGE_SIZE;
  return computedLogs.value.slice(start, start + LOGS_PAGE_SIZE);
});

/**
 * 监听：切换机器或重新打开弹窗时回到第一页
 */
watch(
  () => [stateOpen.value, props.machine?.machineCode, computedLogs.value.length],
  () => {
    statePage.value = 1;
  }
);

/**
 * 监听：分页切换后回到日志顶部
 */
watch(statePage, async () => {
  await nextTick();
  refListTop.value?.scrollIntoView({ block: 'start', behavior: 'smooth' });
});

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

/**
 * 函数：判断字符串是否为 ISO 日期时间
 * @param {string} value 待判断的字符串
 * @returns {boolean} 是否为 ISO 日期时间
 */
const isoDatetimeLikeGet = (value: string): boolean => {
  const safeValue = String(value || '').trim();
  if (!safeValue) {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(safeValue);
};

/**
 * 函数：拆分日志消息中的时间片段
 * @param {string} message 日志消息
 * @returns {TPageSettingsUnattendedLogMessageSegment[]} 切片列表
 */
const logMessageSegmentsGet = (message: string): TPageSettingsUnattendedLogMessageSegment[] => {
  const safeMessage = String(message || '');
  if (!safeMessage) {
    return [{ type: 'text', value: '-' }];
  }

  const matcher = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/g;
  const segments: TPageSettingsUnattendedLogMessageSegment[] = [];
  let cursor = 0;

  for (const match of safeMessage.matchAll(matcher)) {
    const index = typeof match.index === 'number' ? match.index : -1;
    const value = String(match[0] || '');
    if (index < 0 || !value) {
      continue;
    }

    if (index > cursor) {
      segments.push({ type: 'text', value: safeMessage.slice(cursor, index) });
    }

    segments.push({ type: 'datetime', value });
    cursor = index + value.length;
  }

  if (cursor < safeMessage.length) {
    segments.push({ type: 'text', value: safeMessage.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', value: safeMessage }];
};

/**
 * 函数：提取键值对片段
 * @param {string} text 原始文本
 * @returns {{ key: string; value: string }[]} 键值对列表
 */
const keyValuePairsGet = (text: string): { key: string; value: string }[] => {
  const safeText = String(text || '').trim();
  if (!safeText) {
    return [];
  }

  const matches = Array.from(safeText.matchAll(/([^\s=]+)=/g));
  if (matches.length === 0) {
    return [];
  }

  return matches
    .map((match, index) => {
      const key = String(match[1] || '').trim();
      const start = (match.index ?? 0) + match[0].length;
      const end = index + 1 < matches.length ? (matches[index + 1].index ?? safeText.length) : safeText.length;
      const value = safeText.slice(start, end).trim();

      return { key, value };
    })
    .filter((item) => item.key && item.value);
};

/**
 * 函数：读取日志语言包文本
 * @param {string} key i18n key
 * @param {string} fallback 缺省文本
 * @returns {string} 文本
 */
const logLocaleTextGet = (key: string, fallback: string): string => {
  const translated = String(t(key) || '');
  return translated && translated !== key ? translated : fallback;
};

/**
 * 函数：判断日志值是否为语言 key
 * @param {string} value 待判断值
 * @returns {boolean} 是否为语言 key
 */
const logKeyLikeGet = (value: string): boolean => String(value || '').startsWith('components.sentinel.scenes.card.logsMeta.');

/**
 * 函数：日志摘要翻译 key
 * @param {string} summary 原始摘要
 * @returns {string | null} i18n key
 */
const logSummaryKeyGet = (summary: string): string | null => {
  const safeSummary = String(summary || '').trim();
  const map: Record<string, string> = {
    哨兵状态已切换为在线: 'components.sentinel.scenes.card.logsMeta.summaries.sentinelStatusOnline',
    哨兵状态已切换为离线: 'components.sentinel.scenes.card.logsMeta.summaries.sentinelStatusOffline',
    哨兵状态已切换为错误: 'components.sentinel.scenes.card.logsMeta.summaries.sentinelStatusError',
    哨兵状态已切换为空闲: 'components.sentinel.scenes.card.logsMeta.summaries.sentinelStatusIdle',
    检测到新的正常心跳: 'components.sentinel.scenes.card.logsMeta.summaries.heartbeatDetected',
    哨兵已完成本轮恢复状态评估: 'components.sentinel.scenes.card.logsMeta.summaries.recoveryEvaluated',
    '哨兵本轮不重启，继续等待下一次判定': 'components.sentinel.scenes.card.logsMeta.summaries.waitForRetry',
    哨兵已清理恢复状态: 'components.sentinel.scenes.card.logsMeta.summaries.recoveryCleared',
    哨兵已进入重启步骤并尝试拉起场景应用: 'components.sentinel.scenes.card.logsMeta.summaries.restartEntered'
  };

  return map[safeSummary] || null;
};

/**
 * 函数：日志正文翻译 key
 * @param {string} message 原始正文
 * @returns {string | null} i18n key
 */
const logMessageKeyGet = (message: string): string | null => {
  const safeMessage = String(message || '').trim();
  const map: Record<string, string> = {
    关闭前查询场景应用运行中进程失败: 'components.sentinel.scenes.card.logsMeta.messages.failedQueryRunningProcessBeforeShutdown',
    未发现需要关闭的场景应用运行中进程: 'components.sentinel.scenes.card.logsMeta.messages.noRunningProcessToShutdown',
    '检测到场景应用仍在运行，准备主动关闭': 'components.sentinel.scenes.card.logsMeta.messages.detectedRunningProcessToShutdown',
    场景应用旧进程已成功关闭: 'components.sentinel.scenes.card.logsMeta.messages.oldProcessStopped',
    '普通权限关闭旧进程失败，准备申请提权后执行关闭': 'components.sentinel.scenes.card.logsMeta.messages.normalShutdownFailedNeedElevation',
    已申请提权关闭场景应用旧进程: 'components.sentinel.scenes.card.logsMeta.messages.elevationShutdownSubmitted',
    申请提权关闭旧进程失败: 'components.sentinel.scenes.card.logsMeta.messages.elevationShutdownFailed',
    '跳过场景应用重启，因为可执行文件路径不存在': 'components.sentinel.scenes.card.logsMeta.messages.skipRestartBecauseExecMissing',
    重启前查询场景应用运行中进程失败: 'components.sentinel.scenes.card.logsMeta.messages.failedQueryRunningProcessBeforeRestart',
    '检测到场景应用旧进程仍在运行，准备先关闭再重启': 'components.sentinel.scenes.card.logsMeta.messages.detectedRunningProcessBeforeRestart',
    '场景应用旧进程已成功关闭，准备进入重新启动步骤': 'components.sentinel.scenes.card.logsMeta.messages.oldProcessStoppedBeforeRestart',
    '普通权限关闭旧进程失败，准备申请提权后执行先杀后启': 'components.sentinel.scenes.card.logsMeta.messages.normalKillThenRestartNeedElevation',
    已申请提权执行先杀旧进程再重启场景应用: 'components.sentinel.scenes.card.logsMeta.messages.elevationKillThenRestartSubmitted',
    申请提权先杀后启失败: 'components.sentinel.scenes.card.logsMeta.messages.elevationKillThenRestartFailed',
    准备启动场景应用新进程: 'components.sentinel.scenes.card.logsMeta.messages.preparingStartNewProcess',
    场景应用新进程已成功启动: 'components.sentinel.scenes.card.logsMeta.messages.newProcessStarted',
    '普通启动失败，已申请提权重新启动场景应用': 'components.sentinel.scenes.card.logsMeta.messages.normalStartFailedNeedElevation',
    '普通启动失败后，申请提权启动也失败了': 'components.sentinel.scenes.card.logsMeta.messages.normalStartFailedAndElevationFailed',
    场景应用新进程启动失败: 'components.sentinel.scenes.card.logsMeta.messages.newProcessStartFailed'
  };

  return map[safeMessage] || null;
};

/**
 * 函数：本地化日志正文
 * @param {string} message 原始正文
 * @returns {string} 本地化后的正文
 */
const logMessageTextLocalizedGet = (message: string): string => {
  const safeMessage = String(message || '').trim();
  if (!safeMessage) {
    return '-';
  }

  if (logKeyLikeGet(safeMessage)) {
    return logLocaleTextGet(safeMessage, safeMessage);
  }

  const key = logMessageKeyGet(safeMessage);
  return key ? logLocaleTextGet(key, safeMessage) : safeMessage;
};

/**
 * 函数：格式化结构化字段标签
 * @param {string} key 字段名
 * @returns {string} 标签文本
 */
const logEntryLabelGet = (key: string): string => {
  const safeKey = String(key || '').trim();
  const labelMap: Record<string, string> = {
    reason: 'components.sentinel.scenes.card.logsMeta.labels.reason',
    message: 'components.sentinel.scenes.card.logsMeta.labels.message',
    last_seen_at: 'components.sentinel.scenes.card.logsMeta.labels.lastSeenAt',
    recovery: 'components.sentinel.scenes.card.logsMeta.labels.recoveryState',
    恢复状态: 'components.sentinel.scenes.card.logsMeta.labels.recoveryState',
    连续丢心跳次数: 'components.sentinel.scenes.card.logsMeta.labels.consecutiveMissedHeartbeats',
    当前重启次数: 'components.sentinel.scenes.card.logsMeta.labels.currentRestartCount',
    当前周期数: 'components.sentinel.scenes.card.logsMeta.labels.currentCycleCount',
    当前爆发次数: 'components.sentinel.scenes.card.logsMeta.labels.currentBurstCount',
    已停止: 'components.sentinel.scenes.card.logsMeta.labels.stopped',
    下次允许重试时间: 'components.sentinel.scenes.card.logsMeta.labels.nextRetryAt',
    本轮离线起点: 'components.sentinel.scenes.card.logsMeta.labels.offlineSince'
  };

  return labelMap[safeKey] ? logLocaleTextGet(labelMap[safeKey], safeKey) : safeKey;
};

/**
 * 函数：本地化日志已知值
 * @param {string} value 原始值
 * @returns {string} 本地化后的值
 */
const logKnownValueLocalizedGet = (value: string): string => {
  const safeValue = String(value || '').trim();
  if (!safeValue || safeValue === '-') {
    return safeValue || '-';
  }

  if (logKeyLikeGet(safeValue)) {
    return logLocaleTextGet(safeValue, safeValue);
  }

  const keyMap: Record<string, string> = {
    online: 'components.sentinel.scenes.card.logsMeta.values.online',
    offline: 'components.sentinel.scenes.card.logsMeta.values.offline',
    error: 'components.sentinel.scenes.card.logsMeta.values.error',
    idle: 'components.sentinel.scenes.card.logsMeta.values.idle',
    closing: 'components.sentinel.scenes.card.logsMeta.values.closing',
    pending: 'components.sentinel.scenes.card.logsMeta.values.pending',
    cooldown: 'components.sentinel.scenes.card.logsMeta.values.cooldown',
    stopped: 'components.sentinel.scenes.card.logsMeta.values.stopped',
    true: 'components.sentinel.scenes.card.logsMeta.values.yes',
    false: 'components.sentinel.scenes.card.logsMeta.values.no',
    在线: 'components.sentinel.scenes.card.logsMeta.values.online',
    离线: 'components.sentinel.scenes.card.logsMeta.values.offline',
    错误: 'components.sentinel.scenes.card.logsMeta.values.error',
    空闲: 'components.sentinel.scenes.card.logsMeta.values.idle',
    状态切换: 'components.sentinel.scenes.card.logsMeta.values.stateChanged',
    检测到新心跳: 'components.sentinel.scenes.card.logsMeta.values.heartbeatDetected',
    恢复评估: 'components.sentinel.scenes.card.logsMeta.values.recoveryEvaluation',
    等待: 'components.sentinel.scenes.card.logsMeta.values.waiting',
    清理: 'components.sentinel.scenes.card.logsMeta.values.cleanup',
    重启: 'components.sentinel.scenes.card.logsMeta.values.restart',
    关闭: 'components.sentinel.scenes.card.logsMeta.values.shutdown',
    提权: 'components.sentinel.scenes.card.logsMeta.values.elevation',
    查询运行中进程: 'components.sentinel.scenes.card.logsMeta.values.queryRunningProcess',
    关闭旧进程: 'components.sentinel.scenes.card.logsMeta.values.closeOldProcess',
    '普通关闭旧进程失败，准备申请提权': 'components.sentinel.scenes.card.logsMeta.values.requestElevationCloseOldProcess',
    申请提权关闭旧进程: 'components.sentinel.scenes.card.logsMeta.values.requestElevationCloseOldProcess',
    申请提权先杀后启: 'components.sentinel.scenes.card.logsMeta.values.requestElevationKillThenRestart',
    检查可执行文件路径: 'components.sentinel.scenes.card.logsMeta.values.checkExecPath',
    启动新进程: 'components.sentinel.scenes.card.logsMeta.values.startNewProcess',
    '普通启动失败，申请提权启动': 'components.sentinel.scenes.card.logsMeta.values.requestElevationStart',
    执行场景应用重启: 'components.sentinel.scenes.card.logsMeta.values.executeSceneRestart'
  };

  const key = keyMap[safeValue];
  return key ? logLocaleTextGet(key, safeValue) : safeValue;
};

/**
 * 函数：本地化 reason 值
 * @param {string} value 原始 reason
 * @returns {string} 本地化后的 reason
 */
const logReasonLocalizedGet = (value: string): string => {
  const safeValue = String(value || '').trim();
  if (logKeyLikeGet(safeValue)) {
    return logLocaleTextGet(safeValue, safeValue);
  }

  const reasonMap: Record<string, string> = {
    'unattended-disabled': 'components.sentinel.scenes.card.logsMeta.reasons.unattendedDisabled',
    'machine-code-missing': 'components.sentinel.scenes.card.logsMeta.reasons.machineCodeMissing',
    'no-enabled-scenes': 'components.sentinel.scenes.card.logsMeta.reasons.noEnabledScenes',
    'settings-unavailable': 'components.sentinel.scenes.card.logsMeta.reasons.settingsUnavailable',
    'remote-fetch-failed': 'components.sentinel.scenes.card.logsMeta.reasons.remoteFetchFailed',
    'heartbeat-missing': 'components.sentinel.scenes.card.logsMeta.reasons.heartbeatMissing',
    'heartbeat-timeout': 'components.sentinel.scenes.card.logsMeta.reasons.heartbeatTimeout',
    'last-seen-invalid': 'components.sentinel.scenes.card.logsMeta.reasons.lastSeenInvalid'
  };

  return reasonMap[safeValue] ? logLocaleTextGet(reasonMap[safeValue], safeValue) : safeValue;
};

/**
 * 函数：按字段本地化结构化日志值
 * @param {string} key 字段名
 * @param {string} value 字段值
 * @returns {string} 本地化后的值
 */
const logEntryValueLocalizedGet = (key: string, value: string): string => {
  const safeKey = String(key || '').trim();
  const safeValue = String(value || '').trim();
  if (!safeValue || safeValue === '-' || isoDatetimeLikeGet(safeValue)) {
    return safeValue || '-';
  }

  if (safeKey === 'reason') {
    return logReasonLocalizedGet(safeValue);
  }

  return logKnownValueLocalizedGet(safeValue);
};

/**
 * 函数：结构化日志消息
 * @param {IPageSettingsUnattendedSentinelLogsMachineCard['logs'][number]} item 日志项
 * @returns {IPageSettingsUnattendedStructuredLogMessage | null} 结构化结果
 */
const structuredLogMessageGet = (item: IPageSettingsUnattendedSentinelLogsMachineCard['logs'][number]): IPageSettingsUnattendedStructuredLogMessage | null => {
  const safeMessage = String(item.message || '').trim();
  const safeArgs = item.messageArgs ?? {};

  if (logKeyLikeGet(safeMessage) && Object.keys(safeArgs).length > 0) {
    const topLevelEntries: IPageSettingsUnattendedStructuredLogEntry[] = [];
    const recoveryEntries: IPageSettingsUnattendedStructuredLogEntry[] = [];

    if (safeArgs.reason) {
      topLevelEntries.push({ key: 'reason', label: logEntryLabelGet('reason'), value: logEntryValueLocalizedGet('reason', safeArgs.reason) });
    }
    if (safeArgs.messageText) {
      topLevelEntries.push({ key: 'messageText', label: logEntryLabelGet('message'), value: safeArgs.messageText });
    }
    if (safeArgs.lastSeenAt) {
      topLevelEntries.push({ key: 'lastSeenAt', label: logEntryLabelGet('last_seen_at'), value: safeArgs.lastSeenAt });
    }

    const recoveryKeyMap: Array<[string, string]> = [
      ['recoveryState', '恢复状态'],
      ['consecutiveMissedHeartbeats', '连续丢心跳次数'],
      ['currentRestartCount', '当前重启次数'],
      ['currentCycleCount', '当前周期数'],
      ['currentBurstCount', '当前爆发次数'],
      ['stopped', '已停止'],
      ['nextRetryAt', '下次允许重试时间'],
      ['offlineSince', '本轮离线起点']
    ];

    for (const [fieldKey, labelKey] of recoveryKeyMap) {
      const fieldValue = safeArgs[fieldKey];
      if (!fieldValue) {
        continue;
      }

      recoveryEntries.push({
        key: fieldKey,
        label: logEntryLabelGet(labelKey),
        value: logEntryValueLocalizedGet(fieldKey, fieldValue)
      });
    }

    return {
      summary: logLocaleTextGet(safeMessage, safeMessage),
      topLevelEntries,
      recoveryEntries
    };
  }

  if (!safeMessage.includes(' reason=') && !safeMessage.includes(' recovery=')) {
    return null;
  }

  const firstPairIndex = safeMessage.search(/\s(?:reason|message|recovery)=/);
  if (firstPairIndex < 0) {
    return null;
  }

  const summary = safeMessage.slice(0, firstPairIndex).trim();
  const detailText = safeMessage.slice(firstPairIndex).trim();
  const pairs = keyValuePairsGet(detailText);
  if (!summary || pairs.length === 0) {
    return null;
  }

  const topLevelEntries: IPageSettingsUnattendedStructuredLogEntry[] = [];
  const recoveryEntries: IPageSettingsUnattendedStructuredLogEntry[] = [];

  for (const pair of pairs) {
    if (pair.key === 'recovery') {
      const nestedPairs = keyValuePairsGet(pair.value);
      if (nestedPairs.length > 0) {
        recoveryEntries.push(
          ...nestedPairs.map((entry) => ({
            key: entry.key,
            label: logEntryLabelGet(entry.key),
            value: logEntryValueLocalizedGet(entry.key, entry.value)
          }))
        );
        continue;
      }
    }

    topLevelEntries.push({
      key: pair.key,
      label: logEntryLabelGet(pair.key),
      value: logEntryValueLocalizedGet(pair.key, pair.value)
    });
  }

  return {
    summary: (() => {
      const key = logSummaryKeyGet(summary);
      return key ? logLocaleTextGet(key, summary) : summary;
    })(),
    topLevelEntries,
    recoveryEntries
  };
};

/**
 * 函数：获取日志底部元信息列表
 * @param {IPageSettingsUnattendedSentinelLogsMachineCard['logs'][number]} item 日志项
 * @returns {string[]} 元信息列表
 */
const logMetaValuesGet = (item: IPageSettingsUnattendedSentinelLogsMachineCard['logs'][number]): string[] => {
  const stage = logMetaValueLocalizedGet(item.stage);
  const step = logMetaValueLocalizedGet(item.step);
  const state = logMetaStateLocalizedGet(item.state);
  const values = [stage, step];

  if (state && state !== '-' && state !== stage && state !== step) {
    values.push(state);
  }

  return values.filter((value) => String(value || '').trim()) as string[];
};

/**
 * 函数：是否中文语言环境
 * @returns {boolean} 是否中文
 */
const logMetaValueLocalizedGet = (value: string): string => {
  const safeValue = String(value || '').trim();
  if (!safeValue) {
    return '-';
  }

  if (logKeyLikeGet(safeValue)) {
    return logLocaleTextGet(safeValue, safeValue);
  }

  return logKnownValueLocalizedGet(safeValue);
};

/**
 * 函数：本地化日志状态值
 * @param {string} value 原始状态值
 * @returns {string} 本地化后的状态
 */
const logMetaStateLocalizedGet = (value: string): string => {
  const safeValue = String(value || '')
    .trim()
    .toLowerCase();
  if (!safeValue) {
    return '-';
  }

  return logKnownValueLocalizedGet(safeValue);
};
</script>
