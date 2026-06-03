import type {
  ISettingsHotsearch,
  ISettingsHotsearchLocal,
  ISettingsHotsearchPlatformItem,
  ISettingsHotsearchPodcastGenerateOwner,
  ISettingsHotsearchPodcastHeadMusicRemotePaths,
  ISettingsHotsearchPodcastTemplateItem,
  THotsearchPlatformType,
  THotsearchPodcastHeadMusicKind,
  THotsearchPodcastSegmentType,
  THotsearchPodcastTemplateSegmentType,
  THotsearchPodcastTemplateType,
  THotsearchPodcastVoiceKey
} from '@@/shared/types/pages/settings/hotsearch/index.types';
import { generateIdBase36 } from '../generateId';

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
 * 常量：热搜播客固定开头音乐类型。
 */
export const HOTSEARCH_PODCAST_HEAD_MUSIC_KINDS: THotsearchPodcastHeadMusicKind[] = ['normal', 'vip'];

/**
 * 常量：热搜播客开头音乐使用的 UpYun 存储桶。
 */
export const HOTSEARCH_PODCAST_HEAD_MUSIC_UPYUN_BUCKET = 'files';

/**
 * 常量：热搜播客开头音乐远端目录根路径。
 */
const HOTSEARCH_PODCAST_HEAD_MUSIC_REMOTE_ROOT = '/media/podcast/hotsearch/start';

/**
 * 常量：热搜播客音色固定列表。
 */
const HOTSEARCH_PODCAST_VOICE_KEYS: THotsearchPodcastVoiceKey[] = ['M', 'F', 'R'];
const HOTSEARCH_PODCAST_TEMPLATE_TYPES: THotsearchPodcastTemplateType[] = ['opening', 'closing'];
const HOTSEARCH_PODCAST_SEGMENT_TYPES: THotsearchPodcastSegmentType[] = ['normal', 'morningOnly', 'eveningOnly', 'adContent', 'adPlaceholder'];
const HOTSEARCH_PODCAST_AI_RULES_SYSTEM_LINE_PREFIX = '开头和结尾不需要你来模拟和输出，因为我有现成';
const HOTSEARCH_PODCAST_VARIABLE_KEYS = [
  'speakerName',
  'otherSpeakerName',
  'maleSpeakerName',
  'femaleSpeakerName',
  'maleOtherSpeakerName',
  'femaleOtherSpeakerName',
  'programName',
  'morningProgramName',
  'eveningProgramName',
  'vipMorningProgramName',
  'vipEveningProgramName',
  'greeting',
  'solarDateTime',
  'solarDate',
  'lunarDateTime',
  'lunarDate',
  'weekday',
  'solarTime',
  'editionLabel'
] as const;

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
 * 函数：列出热搜播客音色选项。
 * @returns {{ value: THotsearchPodcastVoiceKey; key: string }[]} 音色选项。
 */
export const hotsearchPodcastVoiceOptionsGet = (): Array<{ value: THotsearchPodcastVoiceKey; key: string }> =>
  HOTSEARCH_PODCAST_VOICE_KEYS.map((value) => ({
    value,
    key: `pages.settings.hotsearch.options.podcastVoice.${value}`
  }));

/**
 * 函数：列出热搜播客模板类型选项。
 * @returns {{ value: THotsearchPodcastTemplateType; key: string }[]} 模板类型选项。
 */
export const hotsearchPodcastTemplateOptionsGet = (): Array<{ value: THotsearchPodcastTemplateType; key: string }> =>
  HOTSEARCH_PODCAST_TEMPLATE_TYPES.map((value) => ({
    value,
    key: `pages.settings.hotsearch.options.podcastTemplate.${value}`
  }));

/**
 * 函数：列出热搜播客文案类型选项。
 * @param {'body' | 'template' | 'advertisement'} editorMode 开发者指定的编辑模式。
 * @returns {{ value: THotsearchPodcastSegmentType; key: string }[]} 文案类型选项。
 */
export const hotsearchPodcastSegmentOptionsGet = (editorMode: 'body' | 'template' | 'advertisement'): Array<{ value: THotsearchPodcastSegmentType; key: string }> =>
  HOTSEARCH_PODCAST_SEGMENT_TYPES.filter((value) => {
    if (editorMode === 'body') {
      return value === 'normal' || value === 'morningOnly' || value === 'eveningOnly';
    }

    if (editorMode === 'template') {
      return value === 'normal' || value === 'morningOnly' || value === 'eveningOnly' || value === 'adPlaceholder';
    }

    return false;
  }).map((value) => ({
    value,
    key: `pages.settings.hotsearch.options.podcastSegment.${value}`
  }));

/**
 * 函数：列出热搜播客变量。
 * @returns {{ token: string; key: string }[]} 变量列表。
 */
export const hotsearchPodcastVariableOptionsGet = (): Array<{ token: string; key: string }> =>
  HOTSEARCH_PODCAST_VARIABLE_KEYS.map((key) => ({
    token: `[${key}]`,
    key: `pages.settings.hotsearch.variables.${key}`,
    descriptionKey: `pages.settings.hotsearch.variableDescriptions.${key}`
  }));

/**
 * 函数：创建默认热搜播客模板片段。
 * @returns {ISettingsHotsearchPodcastTemplateItem} 默认片段。
 */
export const hotsearchPodcastTemplateItemDefaultCreate = (templateType: THotsearchPodcastTemplateType = 'opening'): ISettingsHotsearchPodcastTemplateItem => ({
  voiceKey: 'R',
  content: '',
  segmentType: 'normal',
  templateType
});

/**
 * 函数：判断片段是否为广告占位模板。
 * @param {Pick<ISettingsHotsearchPodcastTemplateItem, 'segmentType'>} item 当前片段。
 * @returns {boolean} 是否为广告占位模板。
 */
export const hotsearchPodcastAdPlaceholderIs = (item: Pick<ISettingsHotsearchPodcastTemplateItem, 'segmentType'>): boolean => item.segmentType === 'adPlaceholder';

/**
 * 函数：构建热搜 AI 规则固定尾注。
 * @param {unknown} maleSpeakerName 男生播报者姓名。
 * @param {unknown} femaleSpeakerName 女生播报者姓名。
 * @returns {string} 固定尾注。
 */
export const hotsearchPodcastAiRulesSystemLineBuild = (maleSpeakerName: unknown, femaleSpeakerName: unknown): string => {
  const defaults = hotsearchSettingsDefaultCreate();
  const maleName = hotsearchPodcastSpeakerNameNormalize(maleSpeakerName, defaults.podcastMaleSpeakerName);
  const femaleName = hotsearchPodcastSpeakerNameNormalize(femaleSpeakerName, defaults.podcastFemaleSpeakerName);

  return `开头和结尾不需要你来模拟和输出，因为我有现成儿的。男生叫${maleName}，女生叫${femaleName}。`;
};

/**
 * 函数：提取热搜 AI 规则可编辑正文。
 * @param {unknown} input 输入值。
 * @returns {string} 去除固定尾注后的正文。
 */
export const hotsearchPodcastAiRulesMarkdownEditableExtract = (input: unknown): string => {
  const normalized = hotsearchPodcastTextNormalize(input, '', 20000);

  if (!normalized) {
    return '';
  }

  const lines = normalized.split('\n');

  while (lines.length > 0 && !lines.at(-1)?.trim()) {
    lines.pop();
  }

  while (lines.length > 0) {
    const lastLine = lines.at(-1)?.trim() || '';

    if (!lastLine.startsWith(HOTSEARCH_PODCAST_AI_RULES_SYSTEM_LINE_PREFIX)) {
      break;
    }

    lines.pop();

    while (lines.length > 0 && !lines.at(-1)?.trim()) {
      lines.pop();
    }
  }

  return lines.join('\n').trim();
};

/**
 * 函数：组合热搜 AI 规则完整内容。
 * @param {unknown} input 输入正文或已有完整值。
 * @param {unknown} maleSpeakerName 男生播报者姓名。
 * @param {unknown} femaleSpeakerName 女生播报者姓名。
 * @returns {string} 最终完整 Markdown。
 */
export const hotsearchPodcastAiRulesMarkdownCompose = (input: unknown, maleSpeakerName: unknown, femaleSpeakerName: unknown): string => {
  const editable = hotsearchPodcastAiRulesMarkdownEditableExtract(input);
  const systemLine = hotsearchPodcastAiRulesSystemLineBuild(maleSpeakerName, femaleSpeakerName);

  if (!editable) {
    return systemLine;
  }

  return `${editable}\n\n${systemLine}`;
};

/**
 * 函数：创建默认热搜设置。
 * @returns {ISettingsHotsearch} 默认设置。
 */
export const hotsearchSettingsDefaultCreate = (): ISettingsHotsearch => ({
  enabled: false,
  podcastEnabled: false,
  podcastMaleSpeakerName: '男声主播',
  podcastFemaleSpeakerName: '女声主播',
  podcastMorningProgramName: '洛菲热点早报',
  podcastEveningProgramName: '洛菲热点晚报',
  podcastVipMorningProgramName: '洛菲热点早报 尊享版',
  podcastVipEveningProgramName: '洛菲热点晚报 尊享版',
  podcastAiRulesMarkdown: '',
  podcastTemplateItems: [],
  podcastHeadMusicRemotePaths: {
    normal: '',
    vip: ''
  },
  monthlyBudget: 3500,
  platformIds: hotsearchPlatformsList().map((item) => item.id),
  morningStartAt: '06:00',
  eveningStartAt: '18:00',
  platformIntervalSeconds: 360,
  scheduleJitterSeconds: 1800,
  podcastBufferSeconds: 1200,
  retryMaxAttempts: 1,
  retryDelaySeconds: 600
});

/**
 * 函数：创建默认热搜本地设置。
 * @returns {ISettingsHotsearchLocal} 默认本地设置。
 */
export const hotsearchLocalSettingsDefaultCreate = (): ISettingsHotsearchLocal => ({
  ...hotsearchSettingsDefaultCreate(),
  podcastGenerateEnabled: false
});

/**
 * 函数：构建热搜播客开头音乐远端目录。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型。
 * @returns {string} UpYun 目录路径。
 */
export const hotsearchPodcastHeadMusicRemoteDirectoryGet = (kind: THotsearchPodcastHeadMusicKind): string => `${HOTSEARCH_PODCAST_HEAD_MUSIC_REMOTE_ROOT}/${kind}`;

/**
 * 函数：构建热搜播客开头音乐新的远端对象路径。
 * @param {THotsearchPodcastHeadMusicKind} kind 音乐类型。
 * @returns {string} UpYun 对象路径。
 */
export const hotsearchPodcastHeadMusicRemotePathCreate = (kind: THotsearchPodcastHeadMusicKind): string => {
  return `${hotsearchPodcastHeadMusicRemoteDirectoryGet(kind)}/${generateIdBase36(24)}.mp3`;
};

/**
 * 函数：提取热搜共享设置。
 * @param {ISettingsHotsearch | ISettingsHotsearchLocal} input 输入值。
 * @returns {ISettingsHotsearch} 共享设置。
 */
export const hotsearchSharedSettingsExtract = (input: ISettingsHotsearch | ISettingsHotsearchLocal): ISettingsHotsearch => {
  const normalized = hotsearchSettingsNormalize(input);

  return {
    enabled: normalized.enabled,
    podcastEnabled: normalized.podcastEnabled,
    podcastMaleSpeakerName: normalized.podcastMaleSpeakerName,
    podcastFemaleSpeakerName: normalized.podcastFemaleSpeakerName,
    podcastMorningProgramName: normalized.podcastMorningProgramName,
    podcastEveningProgramName: normalized.podcastEveningProgramName,
    podcastVipMorningProgramName: normalized.podcastVipMorningProgramName,
    podcastVipEveningProgramName: normalized.podcastVipEveningProgramName,
    podcastAiRulesMarkdown: normalized.podcastAiRulesMarkdown,
    podcastTemplateItems: normalized.podcastTemplateItems,
    podcastHeadMusicRemotePaths: normalized.podcastHeadMusicRemotePaths,
    monthlyBudget: normalized.monthlyBudget,
    platformIds: normalized.platformIds,
    morningStartAt: normalized.morningStartAt,
    eveningStartAt: normalized.eveningStartAt,
    platformIntervalSeconds: normalized.platformIntervalSeconds,
    scheduleJitterSeconds: normalized.scheduleJitterSeconds,
    podcastBufferSeconds: normalized.podcastBufferSeconds,
    retryMaxAttempts: normalized.retryMaxAttempts,
    retryDelaySeconds: normalized.retryDelaySeconds
  };
};

/**
 * 函数：归一化热搜播客音色。
 * @param {unknown} input 输入值。
 * @param {THotsearchPodcastVoiceKey} fallback 默认值。
 * @returns {THotsearchPodcastVoiceKey} 归一化后的音色。
 */
const hotsearchPodcastVoiceKeyNormalize = (input: unknown, fallback: THotsearchPodcastVoiceKey): THotsearchPodcastVoiceKey => {
  const rawValue = String(input ?? '').trim();

  switch (rawValue) {
    case 'M':
    case 'm':
      return 'M';
    case 'F':
    case 'f':
      return 'F';
    case 'R':
    case 'r':
    case 'D':
    case 'd':
      return 'R';
    default:
      return fallback;
  }
};

/**
 * 函数：归一化热搜播客文案。
 * @param {unknown} input 输入值。
 * @param {string} fallback 默认值。
 * @param {number} maxLength 最大长度。
 * @returns {string} 归一化后的文案。
 */
const hotsearchPodcastTextNormalize = (input: unknown, fallback: string, maxLength: number): string => {
  const value = String(input ?? '')
    .replace(/\r\n?/g, '\n')
    .trim();

  if (!value) {
    return fallback;
  }

  return value.slice(0, maxLength);
};

/**
 * 函数：归一化热搜播报者姓名。
 * @param {unknown} input 输入值。
 * @param {string} fallback 默认值。
 * @returns {string} 归一化后的姓名。
 */
const hotsearchPodcastSpeakerNameNormalize = (input: unknown, fallback: string): string => {
  return hotsearchPodcastTextNormalize(input, fallback, 40) || fallback;
};

/**
 * 函数：归一化热搜播客模板类型。
 * @param {unknown} input 输入值。
 * @param {THotsearchPodcastTemplateType} fallback 默认值。
 * @returns {THotsearchPodcastTemplateType} 归一化后的模板类型。
 */
const hotsearchPodcastTemplateTypeNormalize = (input: unknown, fallback: THotsearchPodcastTemplateType): THotsearchPodcastTemplateType => {
  const rawValue = String(input ?? '').trim();

  switch (rawValue) {
    case 'closing':
      return 'closing';
    case 'opening':
    case 'normal':
    case 'adContent':
    case 'adPlaceholder':
      return 'opening';
    default:
      return fallback;
  }
};

/**
 * 函数：归一化热搜播客文案类型。
 * @param {unknown} input 输入值。
 * @returns {THotsearchPodcastTemplateSegmentType} 归一化后的文案类型。
 */
const hotsearchPodcastTemplateSegmentTypeNormalize = (input: unknown): THotsearchPodcastTemplateSegmentType => {
  const rawValue = String(input ?? '').trim();

  switch (rawValue) {
    case 'morningOnly':
    case 'morning_only':
      return 'morningOnly';
    case 'eveningOnly':
    case 'evening_only':
      return 'eveningOnly';
    case 'adPlaceholder':
    case 'ad_placeholder':
    case 'adContent':
    case 'ad_content':
    case 'adClosing':
    case 'ad_closing':
    case 'adOpening':
    case 'ad_opening':
      return 'adPlaceholder';
    default:
      return 'normal';
  }
};

/**
 * 函数：归一化热搜节目名称。
 * @param {unknown} input 输入值。
 * @param {string} fallback 默认值。
 * @returns {string} 归一化后的节目名称。
 */
const hotsearchPodcastProgramNameNormalize = (input: unknown, fallback: string): string => {
  return hotsearchPodcastTextNormalize(input, fallback, 80) || fallback;
};

/**
 * 函数：归一化热搜播客开头音乐远端对象路径。
 * @param {unknown} input 输入值。
 * @returns {string} 归一化后的对象路径。
 */
const hotsearchPodcastHeadMusicRemotePathNormalize = (input: unknown): string => {
  return String(input ?? '')
    .trim()
    .slice(0, 512);
};

/**
 * 函数：归一化热搜播客开头音乐远端对象路径集合。
 * @param {unknown} input 输入值。
 * @returns {ISettingsHotsearchPodcastHeadMusicRemotePaths} 归一化后的对象路径集合。
 */
const hotsearchPodcastHeadMusicRemotePathsNormalize = (input: unknown): ISettingsHotsearchPodcastHeadMusicRemotePaths => {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {};

  return {
    normal: hotsearchPodcastHeadMusicRemotePathNormalize(source.normal),
    vip: hotsearchPodcastHeadMusicRemotePathNormalize(source.vip)
  };
};

/**
 * 函数：归一化热搜播客模板片段。
 * @param {unknown} input 输入值。
 * @returns {ISettingsHotsearchPodcastTemplateItem[]} 归一化后的模板列表。
 */
const hotsearchPodcastTemplateItemsNormalize = (input: unknown): ISettingsHotsearchPodcastTemplateItem[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map((item) => {
    const source = item && typeof item === 'object' && !Array.isArray(item) ? (item as Record<string, unknown>) : {};
    const segmentType = hotsearchPodcastTemplateSegmentTypeNormalize(source.segmentType ?? source.segment_type);
    const isAdPlaceholder = segmentType === 'adPlaceholder';

    return {
      voiceKey: isAdPlaceholder ? 'R' : hotsearchPodcastVoiceKeyNormalize(source.voiceKey, 'R'),
      content: isAdPlaceholder ? '' : hotsearchPodcastTextNormalize(source.content, '', 2000),
      segmentType,
      templateType: hotsearchPodcastTemplateTypeNormalize(source.templateType ?? source.segmentType, 'opening')
    } satisfies ISettingsHotsearchPodcastTemplateItem;
  });
};

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
  const legacyPlatformIntervalMinutes = hotsearchIntegerNormalize(source.platformIntervalMinutes, defaults.platformIntervalSeconds / 60, 1, 120);
  const legacyPodcastBufferMinutes = hotsearchIntegerNormalize(source.podcastBufferMinutes, Math.trunc(defaults.podcastBufferSeconds / 60), 0, 240);
  const legacyRetryDelayMinutes = hotsearchIntegerNormalize(source.retryDelayMinutes, Math.trunc(defaults.retryDelaySeconds / 60), 1, 240);
  const podcastTemplateItems = hotsearchPodcastTemplateItemsNormalize(source.podcastTemplateItems);
  const podcastMaleSpeakerName = hotsearchPodcastSpeakerNameNormalize(source.podcastMaleSpeakerName, defaults.podcastMaleSpeakerName);
  const podcastFemaleSpeakerName = hotsearchPodcastSpeakerNameNormalize(source.podcastFemaleSpeakerName, defaults.podcastFemaleSpeakerName);

  return {
    enabled: Boolean(source.enabled),
    podcastEnabled: Boolean(source.podcastEnabled),
    podcastMaleSpeakerName,
    podcastFemaleSpeakerName,
    podcastMorningProgramName: hotsearchPodcastProgramNameNormalize(source.podcastMorningProgramName, defaults.podcastMorningProgramName),
    podcastEveningProgramName: hotsearchPodcastProgramNameNormalize(source.podcastEveningProgramName, defaults.podcastEveningProgramName),
    podcastVipMorningProgramName: hotsearchPodcastProgramNameNormalize(source.podcastVipMorningProgramName, defaults.podcastVipMorningProgramName),
    podcastVipEveningProgramName: hotsearchPodcastProgramNameNormalize(source.podcastVipEveningProgramName, defaults.podcastVipEveningProgramName),
    podcastAiRulesMarkdown: hotsearchPodcastAiRulesMarkdownCompose(source.podcastAiRulesMarkdown, podcastMaleSpeakerName, podcastFemaleSpeakerName),
    podcastTemplateItems,
    podcastHeadMusicRemotePaths: hotsearchPodcastHeadMusicRemotePathsNormalize(source.podcastHeadMusicRemotePaths),
    monthlyBudget: hotsearchIntegerNormalize(source.monthlyBudget, defaults.monthlyBudget, 1, 999999),
    platformIds: hotsearchPlatformIdsNormalize(source.platformIds),
    morningStartAt: hotsearchTimeNormalize(source.morningStartAt, defaults.morningStartAt),
    eveningStartAt: hotsearchTimeNormalize(source.eveningStartAt, defaults.eveningStartAt),
    platformIntervalSeconds: hotsearchIntegerNormalize(source.platformIntervalSeconds, legacyPlatformIntervalMinutes * 60, 1, 7200),
    scheduleJitterSeconds: hotsearchIntegerNormalize(source.scheduleJitterSeconds, defaults.scheduleJitterSeconds, 0, 43200),
    podcastBufferSeconds: hotsearchIntegerNormalize(source.podcastBufferSeconds, legacyPodcastBufferMinutes * 60, 0, 14400),
    retryMaxAttempts: hotsearchIntegerNormalize(source.retryMaxAttempts, defaults.retryMaxAttempts, 0, 10),
    retryDelaySeconds: hotsearchIntegerNormalize(source.retryDelaySeconds, legacyRetryDelayMinutes * 60, 1, 14400)
  };
};

/**
 * 函数：归一化热搜本地设置。
 * @param {unknown} input 输入值。
 * @returns {ISettingsHotsearchLocal} 归一化后的本地设置。
 */
export const hotsearchLocalSettingsNormalize = (input: unknown): ISettingsHotsearchLocal => {
  const defaults = hotsearchLocalSettingsDefaultCreate();
  const shared = hotsearchSettingsNormalize(input);
  const source = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {};

  return {
    ...shared,
    podcastGenerateEnabled: Boolean(source.podcastGenerateEnabled ?? defaults.podcastGenerateEnabled)
  };
};

/**
 * 函数：归一化热搜播客生成占用信息。
 * @param {unknown} input 输入值。
 * @returns {ISettingsHotsearchPodcastGenerateOwner | null} 归一化后的占用信息。
 */
export const hotsearchPodcastGenerateOwnerNormalize = (input: unknown): ISettingsHotsearchPodcastGenerateOwner | null => {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : null;

  if (!source) {
    return null;
  }

  const machineCode = String(source.machineCode ?? '').trim();
  const machineName = String(source.machineName ?? '').trim();
  const enabledAt = String(source.enabledAt ?? '').trim();
  const updatedAt = String(source.updatedAt ?? '').trim();

  if (machineCode === '' || machineName === '') {
    return null;
  }

  return {
    machineCode,
    machineName,
    enabledAt,
    updatedAt
  };
};

/**
 * 函数：计算窗口耗时秒数。
 * @param {number} platformCount 平台数量。
 * @param {number} intervalSeconds 平台抓取间隔秒数。
 * @returns {number} 预计窗口耗时。
 */
export const hotsearchWindowDurationSecondsGet = (platformCount: number, intervalSeconds: number): number => {
  const count = Math.max(0, Math.trunc(platformCount));
  const interval = Math.max(1, Math.trunc(intervalSeconds));
  return count <= 0 ? 0 : count * interval;
};

/**
 * 函数：计算窗口耗时分钟数。
 * @param {number} platformCount 平台数量。
 * @param {number} intervalSeconds 平台间隔秒数。
 * @returns {number} 预计窗口耗时。
 */
export const hotsearchWindowDurationMinutesGet = (platformCount: number, intervalSeconds: number): number => {
  return Math.ceil(hotsearchWindowDurationSecondsGet(platformCount, intervalSeconds) / 60);
};

/**
 * 函数：在 HH:mm 时间上增加秒数。
 * @param {string} time 时间字符串。
 * @param {number} seconds 追加秒数。
 * @returns {string} 结果时间。
 */
export const hotsearchTimeAddSeconds = (time: string, seconds: number): string => {
  const normalized = hotsearchTimeNormalize(time, '00:00');
  const [hourText, minuteText] = normalized.split(':');
  const baseSeconds = Number(hourText) * 3600 + Number(minuteText) * 60;
  const nextSeconds = (((baseSeconds + Math.max(0, Math.trunc(seconds))) % 86400) + 86400) % 86400;
  const nextHour = Math.floor(nextSeconds / 3600);
  const nextMinute = Math.floor((nextSeconds % 3600) / 60);
  const nextSecond = nextSeconds % 60;

  if (nextSecond === 0) {
    return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
  }

  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}:${String(nextSecond).padStart(2, '0')}`;
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
  const durationSeconds = hotsearchWindowDurationSecondsGet(settings.platformIds.length, settings.platformIntervalSeconds);
  return hotsearchTimeAddSeconds(startAt, durationSeconds + settings.podcastBufferSeconds);
};

/**
 * 函数：计算预计每日积分消耗。
 * @param {number} platformCount 平台数量。
 * @param {number} intervalSeconds 平台抓取间隔秒数。
 * @returns {number} 预计积分消耗。
 */
export const hotsearchEstimatedDayPointsGet = (platformCount: number, intervalSeconds: number): number => {
  const count = Math.max(0, Math.trunc(platformCount));
  const windowDurationSeconds = hotsearchWindowDurationSecondsGet(platformCount, intervalSeconds);

  if (count <= 0 || windowDurationSeconds <= 0) {
    return 0;
  }

  const fullRoundsPerDay = Math.max(1, Math.floor(86400 / windowDurationSeconds));
  return fullRoundsPerDay * count;
};

/**
 * 函数：计算预计月度积分消耗。
 * @param {number} platformCount 平台数量。
 * @param {number} intervalSeconds 平台抓取间隔秒数。
 * @param {number} daysInMonth 当月天数。
 * @returns {number} 预计积分消耗。
 */
export const hotsearchEstimatedMonthPointsGet = (platformCount: number, intervalSeconds: number, daysInMonth: number): number => {
  const days = Math.max(1, Math.trunc(daysInMonth));
  return hotsearchEstimatedDayPointsGet(platformCount, intervalSeconds) * days;
};
