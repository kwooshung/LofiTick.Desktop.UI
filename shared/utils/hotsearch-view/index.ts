import { getLocalTimeZone } from '@internationalized/date';

import type { IHotsearchArchiveDateSummary, IHotsearchDataRow, IHotsearchMediaPlatformOption, IHotsearchPodcastMediaAsset, IHotsearchPodcastSentence, IHotsearchPodcastViewModel, THotsearchMediaPlatformKey, THotsearchPlatformType, THotsearchPodcastVariantKey } from '@@/shared/types/index.types';
import { hotsearchPlatformsList } from '@@/shared/utils/hotsearch';

const HOTSEARCH_SAMPLE_TOPICS = [
  'AI 终端新品发布会热度持续走高',
  '城市暴雨预警引发全国关注',
  '国产游戏新版本上线冲上榜首',
  '新能源车价格战再度升级',
  '演唱会开票秒空带动社交讨论',
  '新一代芯片跑分曝光引发围观',
  '平台主播直播切片话题发酵',
  '毕业季就业数据成为焦点',
  '跨境旅游签证政策更新',
  '热门电视剧大结局登顶讨论区',
  '体育赛事绝杀片段刷屏',
  '品牌联名周边售罄带热搜索',
  '手机影像对比话题霸榜',
  '城市音乐节阵容公布后热度飙升'
];

const HOTSEARCH_SAMPLE_WAVEFORM_PRIMARY =
  'M0 7L1 7L2 8L3 9L4 9L5 7L6 10L7 9L8 11L9 10L10 11L11 12L12 13L13 12L14 13L15 12L16 10L17 10L18 6L19 10L20 11L21 8L22 9L23 11L24 11L25 13L26 13L27 13L28 14L29 13L30 13L31 14L32 14L33 14L34 14L35 15L36 14L37 1L38 2L39 15L40 15L41 1L42 3L43 1L44 4L45 8L46 6L47 3L48 1L49 6L50 7L51 1L52 5L53 2L54 9L55 11L56 8L57 9L58 8L59 1L60 7L61 1L62 4L63 1L64 1L65 3L66 5L67 8L68 6L69 1L70 7L71 1L72 1L73 6L74 1L75 5L76 1L77 6L78 7L79 1L80 2L81 1L82 1L83 6L84 1L85 5L86 6L87 6L88 4L89 1L90 6L91 5L92 1L93 9L94 9L95 1L96 8L97 8L98 7L99 8L100 1L101 8L102 1L103 4L104 3L105 1L106 2L107 5L108 6L109 7L110 1L111 9L112 4L113 1L114 7L115 1L116 1L117 4L118 1L119 2L120 1L121 8L122 1L123 1L124 2L125 1L126 3L127 7L128 6L129 7L130 1L131 1L132 8L133 1L134 8L135 9L136 1L137 3L138 2L139 4L140 1L141 1L142 1L143 1L144 1L145 3L146 1L147 7L148 6L149 7L150 8L151 1L152 8L153 3L154 1L155 6L156 1L157 9L158 1L159 1L160 3L161 1L162 5L163 1L164 1L165 2L166 3L167 7L168 8L169 6L170 7L171 8L172 1L173 6L174 1L175 8L176 6L177 1L178 2L179 4L180 3L181 3L182 1L183 2L184 1L185 1L186 3L187 1L188 3L189 3L190 3L191 7L192 1L193 8L194 3L195 1L196 8L197 1L198 9L199 8L200 2L201 5L202 1L203 8L204 1L205 1L206 2L207 3L208 1L209 7L210 6L211 5L212 3L213 1L214 9L215 1L216 5L217 8L218 1L219 10L220 4L221 2L222 1L223 1L224 1L225 1L226 1L227 2L228 1L229 6L230 6L231 8L232 6L233 1L234 8L235 5L236 1L237 9L238 1L239 10L240 8L241 1L242 7L243 1L244 2L245 1L246 1L247 1L248 1L249 1L250 5L251 2L252 4L253 4L254 1L255 9L256 1L257 3L258 6L259 1L260 10L261 9L262 1L263 7L264 1L265 4L266 2L267 1L268 2L269 1L270 5L271 7L272 8L273 7L274 1L275 7L276 7L277 1L278 10L279 8L280 10L281 5L282 2L283 4L284 3L285 1L286 5L287 1L288 3L289 2L290 3L291 7L292 5L293 5L294 3L295 1L296 7L297 1L298 1L299 8L300 1L301 8L302 8L303 7L304 5L305 1L306 6L307 2L308 1L309 2L310 1L311 8L312 4L313 6L314 5L315 3L316 7L317 9L318 1L319 9L320 9L321 1L322 6L323 5L324 7L325 6L326 1L327 1L328 1L329 4L330 3L331 2L332 5L333 7L334 5L335 6L336 1L337 8L338 8L339 4L340 5L341 1L342 5L343 5L344 5L345 5L346 5L347 6L348 4L349 6L350 5L351 5L352 6L353 7L354 9L355 8L356 8L357 10L358 11L359 9L360 10L361 8L362 7L363 3L364 5L365 8L366 4L367 7L368 6L369 8L370 25Z';

const HOTSEARCH_SAMPLE_WAVEFORM_SECONDARY =
  'M0 14L1 13L2 14L3 3L4 2L5 3L6 5L7 3L8 3L9 5L10 6L11 6L12 6L13 6L14 6L15 7L16 5L17 3L18 5L19 2L20 4L21 6L22 5L23 6L24 7L25 6L26 10L27 9L28 11L29 1L30 3L31 2L32 3L33 4L34 5L35 4L36 8L37 8L38 6L39 8L40 10L41 12L42 14L43 14L44 15L45 10L46 2L47 4L48 5L49 6L50 7L51 8L52 12L53 13L54 11L55 7L56 10L57 10L58 11L59 14L60 15L61 15L62 15L63 3L64 4L65 5L66 5L67 5L68 6L69 9L70 10L71 10L72 7L73 9L74 10L75 12L76 12L77 9L78 12L79 10L80 3L81 4L82 4L83 6L84 6L85 8L86 12L87 13L88 10L89 6L90 8L91 8L92 9L93 8L94 7L95 8L96 7L97 4L98 6L99 4L100 7L101 7L102 10L103 14L104 15L105 12L106 8L107 10L108 11L109 12L110 13L111 15L112 16L113 8L114 2L115 3L116 4L117 5L118 6L119 7L120 11L121 11L122 11L123 8L124 9L125 10L126 11L127 14L128 15L129 16L130 16L131 3L132 6L133 5L134 6L135 5L136 8L137 11L138 12L139 11L140 8L141 7L142 9L143 11L144 14L145 15L146 16L147 9L148 2L149 3L150 4L151 5L152 5L153 8L154 11L155 12L156 12L157 10L158 7L159 11L160 12L161 14L162 16L163 16L164 16L165 4L166 5L167 4L168 7L169 6L170 5L171 9L172 9L173 9L174 9L175 5L176 9L177 9L178 12L179 13L180 12L181 11L182 2L183 4L184 4L185 5L186 6L187 6L188 8L189 9L190 10L191 7L192 8L193 10L194 11L195 12L196 12L197 13L198 14L199 5L200 5L201 4L202 7L203 5L204 5L205 8L206 8L207 9L208 7L209 8L210 10L211 10L212 13L213 7L214 8L215 7L216 2L217 3L218 4L219 6L220 7L221 7L222 13L223 15L224 15L225 10L226 8L227 8L228 9L229 10L230 9L231 10L232 10L233 3L234 4L235 6L236 6L237 7L238 6L239 11L240 11L241 11L242 8L243 6L244 10L245 11L246 13L247 13L248 13L249 13L250 2L251 3L252 4L253 5L254 6L255 6L256 8L257 13L258 13L259 7L260 6L261 8L262 9L263 13L264 14L265 14L266 14L267 4L268 4L269 7L270 7L271 8L272 9L273 11L274 12L275 11L276 9L277 8L278 9L279 10L280 14L281 12L282 10L283 11L284 5L285 6L286 7L287 8L288 9L289 9L290 11L291 15L292 16L293 12L294 9L295 11L296 11L297 11L298 11L299 11L300 12L301 12L302 9L303 10L304 10L305 11L306 11L307 11L308 13L309 13L310 12L311 12L312 12L313 13L314 14L315 15L316 15L317 15L318 12L319 10L320 10L321 11L322 11L323 11L324 11L325 12L326 13L327 13L328 13L329 13L330 13L331 14L332 16L333 16L334 16L335 16L336 13L337 13L338 13L339 14L340 14L341 14L342 15L343 15L344 14L345 14L346 14L347 15L348 15L349 15L350 15L351 15L352 15L353 14L354 14L355 15L356 15L357 15L358 15L359 16L360 16L361 16L362 15L363 16L364 16L365 16L366 16L367 16L368 16L369 16L370 16Z';

const HOTSEARCH_PODCAST_AUDIO_SAMPLES = [
  {
    src: 'https://cdn.pixabay.com/audio/2026/01/25/audio_1dd7f3126d.mp3',
    durationSeconds: 100,
    waveformPath: HOTSEARCH_SAMPLE_WAVEFORM_PRIMARY
  },
  {
    src: 'https://cdn.pixabay.com/audio/2026/02/20/audio_2b2627eddc.mp3',
    durationSeconds: 9,
    waveformPath: HOTSEARCH_SAMPLE_WAVEFORM_SECONDARY
  }
] as const;

const HOTSEARCH_PODCAST_VIDEO_URL = 'https://cdn.pixabay.com/video/2023/09/20/181376-866506956.mp4';
const HOTSEARCH_PODCAST_POSTER_URL = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80';

const HOTSEARCH_MEDIA_PLATFORM_OPTIONS: IHotsearchMediaPlatformOption[] = [
  { key: 'general', labelKey: 'pages.hotsearch.mediaPlatforms.general', category: 'general' },
  { key: 'bilibili', labelKey: 'pages.hotsearch.mediaPlatforms.bilibili', category: 'video' },
  { key: 'toutiao', labelKey: 'pages.hotsearch.mediaPlatforms.toutiao', category: 'video' },
  { key: 'ixigua', labelKey: 'pages.hotsearch.mediaPlatforms.ixigua', category: 'video' },
  { key: 'douyin', labelKey: 'pages.hotsearch.mediaPlatforms.douyin', category: 'video' },
  { key: 'xiaohongshu', labelKey: 'pages.hotsearch.mediaPlatforms.xiaohongshu', category: 'community' },
  { key: 'kuaishou', labelKey: 'pages.hotsearch.mediaPlatforms.kuaishou', category: 'video' },
  { key: 'weibo', labelKey: 'pages.hotsearch.mediaPlatforms.weibo', category: 'community' },
  { key: 'shengbo', labelKey: 'pages.hotsearch.mediaPlatforms.shengbo', category: 'audio' },
  { key: 'youtube', labelKey: 'pages.hotsearch.mediaPlatforms.youtube', category: 'video' },
  { key: 'ximalaya', labelKey: 'pages.hotsearch.mediaPlatforms.ximalaya', category: 'audio' },
  { key: 'qingtingfm', labelKey: 'pages.hotsearch.mediaPlatforms.qingtingfm', category: 'audio' },
  { key: 'wangyi-podcast', labelKey: 'pages.hotsearch.mediaPlatforms.wangyiPodcast', category: 'audio' },
  { key: 'pipixia', labelKey: 'pages.hotsearch.mediaPlatforms.pipixia', category: 'community' },
  { key: 'pipigaoxiao', labelKey: 'pages.hotsearch.mediaPlatforms.pipigaoxiao', category: 'community' }
];

const HOTSEARCH_PODCAST_VARIANT_OPTIONS: Array<{ key: THotsearchPodcastVariantKey; labelKey: string; descriptionKey: string }> = [
  {
    key: 'morning-short',
    labelKey: 'pages.hotsearch.podcast.variants.morningShort.title',
    descriptionKey: 'pages.hotsearch.podcast.variants.morningShort.description'
  },
  {
    key: 'morning-long',
    labelKey: 'pages.hotsearch.podcast.variants.morningLong.title',
    descriptionKey: 'pages.hotsearch.podcast.variants.morningLong.description'
  },
  {
    key: 'evening-short',
    labelKey: 'pages.hotsearch.podcast.variants.eveningShort.title',
    descriptionKey: 'pages.hotsearch.podcast.variants.eveningShort.description'
  },
  {
    key: 'evening-long',
    labelKey: 'pages.hotsearch.podcast.variants.eveningLong.title',
    descriptionKey: 'pages.hotsearch.podcast.variants.eveningLong.description'
  }
];

/**
 * 函数：从路由查询值中取字符串。
 *
 * # Arguments
 *
 * * `value` - 路由查询值。
 *
 * # Returns
 *
 * 返回归一化后的字符串；不存在时返回空字符串。
 */
export const hotsearchQueryStringGet = (value: string | null | Array<string | null> | undefined): string => {
  if (Array.isArray(value)) {
    return String(value[0] ?? '').trim();
  }

  return String(value ?? '').trim();
};

/**
 * 函数：获取热搜查询应附带的本地时区。
 *
 * # Returns
 *
 * 返回当前设备的 IANA 时区名称。
 */
export const hotsearchLocalTimezoneGet = (): string => getLocalTimeZone();

/**
 * 函数：获取热搜日期归档摘要列表。
 *
 * # Returns
 *
 * 返回最近归档日期摘要。
 */
export const hotsearchArchiveDateSummariesGet = (): IHotsearchArchiveDateSummary[] => {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${date.getFullYear()}-${month}-${day}`;
    const totalCount = 32 - index;
    const newCount = Math.max(3, 12 - index);
    const podcastCount = Math.max(2, 8 - Math.trunc(index / 2));

    return {
      date: dateKey,
      totalCount,
      newCount,
      podcastCount,
      platformCount: 20,
      mediaReady: index < 5,
      updatedAt: `${dateKey} ${index % 2 === 0 ? '20:20' : '08:40'}`
    };
  });
};

/**
 * 函数：格式化热搜日期标签。
 *
 * # Arguments
 *
 * * `date` - 日期字符串。
 *
 * # Returns
 *
 * 返回用于列表展示的日期标签。
 */
export const hotsearchDateLabelGet = (date: string): string => {
  const value = String(date ?? '').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return value.slice(5).replace('-', ' / ');
};

/**
 * 函数：获取热搜数据表格行。
 *
 * # Arguments
 *
 * * `date` - 日期。
 *
 * # Returns
 *
 * 返回指定日期的热搜展示行。
 */
export const hotsearchDataRowsGet = (date: string): IHotsearchDataRow[] => {
  const platforms = hotsearchPlatformsList();

  return Array.from({ length: 28 }, (_, index) => {
    const platform = platforms[index % platforms.length] ?? platforms[0];
    const rank = index + 1;
    const topic = HOTSEARCH_SAMPLE_TOPICS[index % HOTSEARCH_SAMPLE_TOPICS.length] ?? HOTSEARCH_SAMPLE_TOPICS[0] ?? '热搜话题';
    const categoryKeys = ['pages.hotsearch.categories.tech', 'pages.hotsearch.categories.social', 'pages.hotsearch.categories.business', 'pages.hotsearch.categories.entertainment'];

    if (!platform) {
      throw new Error('hotsearch platform mock data is empty');
    }

    return {
      id: Number(`${date.replace(/-/g, '')}${String(rank).padStart(2, '0')}`),
      date,
      rank,
      title: topic,
      summary: `${topic}，数据编辑台会在这里展示榜单摘要、扩展说明和平台差异。`,
      url: `https://example.com/hotsearch/${platform.type}/${rank}`,
      categoryKey: categoryKeys[index % categoryKeys.length] ?? 'pages.hotsearch.categories.tech',
      platform: platform.id,
      platformType: platform.type as THotsearchPlatformType,
      popularity: 98_000 - index * 1_350,
      isPodcast: index % 3 !== 1,
      isNew: index < 8,
      publishedAt: `${date} ${String(8 + (index % 12)).padStart(2, '0')}:${index % 2 === 0 ? '15' : '45'}`
    };
  });
};

/**
 * 函数：获取可选自媒体平台。
 *
 * # Returns
 *
 * 返回自媒体平台选项列表。
 */
export const hotsearchMediaPlatformOptionsGet = (): IHotsearchMediaPlatformOption[] => {
  return HOTSEARCH_MEDIA_PLATFORM_OPTIONS;
};

/**
 * 函数：获取播客变体选项。
 *
 * # Returns
 *
 * 返回播客变体选项。
 */
export const hotsearchPodcastVariantOptionsGet = (): Array<{ key: THotsearchPodcastVariantKey; labelKey: string; descriptionKey: string }> => {
  return HOTSEARCH_PODCAST_VARIANT_OPTIONS;
};

/**
 * 函数：获取播客变体支持的平台集合。
 *
 * # Arguments
 *
 * * `variant` - 播客变体。
 *
 * # Returns
 *
 * 返回支持的平台键集合。
 */
const hotsearchPodcastSupportedPlatformsGet = (variant: THotsearchPodcastVariantKey): THotsearchMediaPlatformKey[] => {
  switch (variant) {
    case 'morning-short':
      return ['general', 'bilibili', 'douyin', 'xiaohongshu', 'weibo', 'shengbo', 'ximalaya'];
    case 'morning-long':
      return ['general', 'bilibili', 'youtube', 'ximalaya', 'qingtingfm', 'wangyi-podcast'];
    case 'evening-short':
      return ['general', 'bilibili', 'toutiao', 'ixigua', 'weibo', 'shengbo'];
    case 'evening-long':
      return ['general', 'youtube', 'ximalaya', 'qingtingfm', 'wangyi-podcast', 'pipixia', 'pipigaoxiao'];
    default:
      return ['general'];
  }
};

/**
 * 函数：获取播客页面视图模型。
 *
 * # Arguments
 *
 * * `date` - 日期。
 * * `variant` - 播客变体。
 * * `mediaPlatformKey` - 当前平台筛选。
 *
 * # Returns
 *
 * 返回播客页展示所需的聚合模型。
 */
export const hotsearchPodcastViewGet = (date: string, variant: THotsearchPodcastVariantKey, mediaPlatformKey?: string): IHotsearchPodcastViewModel => {
  const supportedPlatforms = hotsearchPodcastSupportedPlatformsGet(variant);
  const selectedPlatformKey = supportedPlatforms.includes(mediaPlatformKey as THotsearchMediaPlatformKey) ? (mediaPlatformKey as THotsearchMediaPlatformKey) : 'general';
  const availablePlatforms = HOTSEARCH_MEDIA_PLATFORM_OPTIONS.map((item) => ({
    ...item,
    disabled: !supportedPlatforms.includes(item.key)
  }));
  const speakers = variant.startsWith('morning') ? ['男声主播', '女声主播'] : ['女声主播', '男声主播'];
  const prefix = variant.startsWith('morning') ? '早报' : '晚报';
  const lengthLabel = variant.endsWith('short') ? '短篇' : '长篇';
  const sentences: IHotsearchPodcastSentence[] = Array.from({ length: variant.endsWith('short') ? 5 : 8 }, (_, index) => {
    const sample = HOTSEARCH_PODCAST_AUDIO_SAMPLES[index % HOTSEARCH_PODCAST_AUDIO_SAMPLES.length] ?? HOTSEARCH_PODCAST_AUDIO_SAMPLES[0];

    return {
      id: `${variant}-${index + 1}`,
      speakerName: speakers[index % speakers.length] ?? '男声主播',
      text: `${prefix}${lengthLabel}第 ${index + 1} 句脚本，当前平台为 ${selectedPlatformKey === 'general' ? '通用版本' : selectedPlatformKey}，这里会替换成真实播报文案与广告片段。`,
      durationLabel: `${sample.durationSeconds}s`,
      audioUrl: sample.src,
      waveformPath: sample.waveformPath
    };
  });
  const assets: IHotsearchPodcastMediaAsset[] = [
    {
      id: `${variant}-${selectedPlatformKey}-audio-master`,
      title: `${prefix}${lengthLabel}完整音频`,
      description: `${date} · ${selectedPlatformKey === 'general' ? '通用版本' : selectedPlatformKey}`,
      kind: 'audio',
      waveformPath: HOTSEARCH_SAMPLE_WAVEFORM_PRIMARY,
      sources: [
        {
          src: HOTSEARCH_PODCAST_AUDIO_SAMPLES[0].src,
          type: 'audio/mpeg',
          size: 10
        }
      ]
    }
  ];

  if (selectedPlatformKey === 'general' || ['bilibili', 'youtube', 'toutiao', 'ixigua', 'douyin', 'kuaishou'].includes(selectedPlatformKey)) {
    assets.unshift({
      id: `${variant}-${selectedPlatformKey}-video-master`,
      title: `${prefix}${lengthLabel}完整视频`,
      description: `${date} · ${selectedPlatformKey === 'general' ? '主版本' : '平台广告版本'}`,
      kind: 'video',
      poster: HOTSEARCH_PODCAST_POSTER_URL,
      sources: [
        {
          src: HOTSEARCH_PODCAST_VIDEO_URL,
          type: 'video/mp4',
          size: 720
        }
      ]
    });
  }

  return {
    date,
    variant,
    title: `${prefix}${lengthLabel}`,
    description: `${date} 的 ${prefix}${lengthLabel} 脚本、逐句音频与完整媒体文件预览。`,
    selectedPlatformKey,
    availablePlatforms,
    sentences,
    assets
  };
};
