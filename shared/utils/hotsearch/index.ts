import type { ISettingsHotsearch, ISettingsHotsearchPlatformItem, THotsearchPlatformType } from '@@/shared/types/pages/settings/hotsearch/index.types';

/**
 * 常量：热搜官网用量地址。
 */
export const HOTSEARCH_USAGE_URL = 'https://uapis.cn/console/usage';

/**
 * 常量：热搜平台固定列表。
 */
const HOTSEARCH_PLATFORM_BASE_LIST: Array<{ id: number; type: THotsearchPlatformType }> = [
  { id: 1, type: 'baidu' },
  { id: 2, type: 'sina' },
  { id: 3, type: 'sina-news' },
  { id: 4, type: 'weibo' },
  { id: 5, type: 'toutiao' },
  { id: 6, type: 'qq-news' },
  { id: 7, type: 'thepaper' },
  { id: 8, type: 'netease-news' },
  { id: 9, type: 'huxiu' },
  { id: 10, type: 'hupu' },
  { id: 11, type: 'zhihu' },
  { id: 12, type: 'zhihu-daily' },
  { id: 13, type: 'ifanr' },
  { id: 14, type: 'sspai' },
  { id: 15, type: 'guokr' },
  { id: 16, type: '36kr' },
  { id: 17, type: 'douban-group' },
  { id: 19, type: 'helloGitHub' },
  { id: 18, type: 'v2ex' },
  { id: 20, type: 'history' }
];

/**
 * 函数：列出热搜平台项。
 * @returns {ISettingsHotsearchPlatformItem[]} 平台项列表。
 */
export const hotsearchPlatformsList = (): ISettingsHotsearchPlatformItem[] =>
  HOTSEARCH_PLATFORM_BASE_LIST.map((item) => ({
    ...item,
    key: `components.hotsearch.platform.${item.type}`
  }));

/**
 * 函数：创建默认热搜设置。
 * @returns {ISettingsHotsearch} 默认设置。
 */
export const hotsearchSettingsDefaultCreate = (): ISettingsHotsearch => ({
  enabled: false,
  podcastEnabled: false,
  monthlyBudget: 3500,
  platformIds: hotsearchPlatformsList().map((item) => item.id),
  morningStartAt: '06:00',
  eveningStartAt: '18:00',
  platformIntervalMinutes: 2,
  podcastBufferMinutes: 20,
  retryMaxAttempts: 1,
  retryDelayMinutes: 10
});

/**
 * 函数：归一化热搜时间。
 * @param {unknown} input 输入值。
 * @param {string} fallback 默认值。
 * @returns {string} 归一化后的时间。
 */
const hotsearchTimeNormalize = (input: unknown, fallback: string): string => {
  const value = String(input ?? '').trim();
  if (/^\d{2}:\d{2}$/.test(value)) {
    const [hourText, minuteText] = value.split(':');
    const hour = Number(hourText);
    const minute = Number(minuteText);
    if (Number.isInteger(hour) && Number.isInteger(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
  }

  return fallback;
};

/**
 * 函数：归一化整数。
 * @param {unknown} input 输入值。
 * @param {number} fallback 默认值。
 * @param {number} min 最小值。
 * @param {number} max 最大值。
 * @returns {number} 归一化结果。
 */
const hotsearchIntegerNormalize = (input: unknown, fallback: number, min: number, max: number): number => {
  const value = Math.trunc(typeof input === 'number' ? input : Number(input));
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
};

/**
 * 函数：归一化平台 ID 列表。
 * @param {unknown} input 输入值。
 * @returns {number[]} 平台 ID 列表。
 */
const hotsearchPlatformIdsNormalize = (input: unknown): number[] => {
  const platformIds = new Set(hotsearchPlatformsList().map((item) => item.id));
  if (!Array.isArray(input)) {
    return hotsearchSettingsDefaultCreate().platformIds;
  }

  const normalized = input
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && platformIds.has(item))
    .map((item) => Number(item));

  return Array.from(new Set(normalized));
};

/**
 * 函数：归一化热搜设置。
 * @param {unknown} input 输入值。
 * @returns {ISettingsHotsearch} 归一化后的设置。
 */
export const hotsearchSettingsNormalize = (input: unknown): ISettingsHotsearch => {
  const defaults = hotsearchSettingsDefaultCreate();
  const source = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {};

  return {
    enabled: Boolean(source.enabled),
    podcastEnabled: Boolean(source.podcastEnabled),
    monthlyBudget: hotsearchIntegerNormalize(source.monthlyBudget, defaults.monthlyBudget, 1, 999999),
    platformIds: hotsearchPlatformIdsNormalize(source.platformIds),
    morningStartAt: hotsearchTimeNormalize(source.morningStartAt, defaults.morningStartAt),
    eveningStartAt: hotsearchTimeNormalize(source.eveningStartAt, defaults.eveningStartAt),
    platformIntervalMinutes: hotsearchIntegerNormalize(source.platformIntervalMinutes, defaults.platformIntervalMinutes, 1, 120),
    podcastBufferMinutes: hotsearchIntegerNormalize(source.podcastBufferMinutes, defaults.podcastBufferMinutes, 0, 240),
    retryMaxAttempts: hotsearchIntegerNormalize(source.retryMaxAttempts, defaults.retryMaxAttempts, 0, 10),
    retryDelayMinutes: hotsearchIntegerNormalize(source.retryDelayMinutes, defaults.retryDelayMinutes, 1, 240)
  };
};

/**
 * 函数：计算窗口耗时分钟数。
 * @param {number} platformCount 平台数量。
 * @param {number} intervalMinutes 平台间隔分钟数。
 * @returns {number} 预计窗口耗时。
 */
export const hotsearchWindowDurationMinutesGet = (platformCount: number, intervalMinutes: number): number => {
  const count = Math.max(0, Math.trunc(platformCount));
  const interval = Math.max(1, Math.trunc(intervalMinutes));
  return count <= 1 ? 0 : (count - 1) * interval;
};

/**
 * 函数：在 HH:mm 时间上增加分钟。
 * @param {string} time 时间字符串。
 * @param {number} minutes 追加分钟数。
 * @returns {string} 结果时间。
 */
export const hotsearchTimeAddMinutes = (time: string, minutes: number): string => {
  const normalized = hotsearchTimeNormalize(time, '00:00');
  const [hourText, minuteText] = normalized.split(':');
  const baseMinutes = Number(hourText) * 60 + Number(minuteText);
  const nextMinutes = (((baseMinutes + Math.max(0, Math.trunc(minutes))) % (24 * 60)) + 24 * 60) % (24 * 60);
  const nextHour = Math.floor(nextMinutes / 60);
  const nextMinute = nextMinutes % 60;
  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
};

/**
 * 函数：计算建议播客时间。
 * @param {ISettingsHotsearch} settings 热搜设置。
 * @param {string} startAt 窗口开始时间。
 * @returns {string} 建议播客时间。
 */
export const hotsearchSuggestedPodcastTimeGet = (settings: ISettingsHotsearch, startAt: string): string => {
  const duration = hotsearchWindowDurationMinutesGet(settings.platformIds.length, settings.platformIntervalMinutes);
  return hotsearchTimeAddMinutes(startAt, duration + settings.podcastBufferMinutes);
};

/**
 * 函数：计算预计月度积分消耗。
 * @param {number} platformCount 平台数量。
 * @param {number} windowsPerDay 每日窗口数。
 * @param {number} daysInMonth 当月天数。
 * @returns {number} 预计积分消耗。
 */
export const hotsearchEstimatedMonthPointsGet = (platformCount: number, windowsPerDay: number, daysInMonth: number): number => {
  const count = Math.max(0, Math.trunc(platformCount));
  const windows = Math.max(0, Math.trunc(windowsPerDay));
  const days = Math.max(1, Math.trunc(daysInMonth));
  return count * windows * days;
};
