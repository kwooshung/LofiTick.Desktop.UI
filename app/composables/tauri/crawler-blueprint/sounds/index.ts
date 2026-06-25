/**
 * 爬虫蓝图提示音资源。
 *
 * 这里集中承载 base64 音频字符串，便于后续直接替换成你的音频素材。
 *
 * # Returns
 *
 * 返回提示音资源映射与 data URL 构造函数。
 */
export interface ICrawlerBlueprintSoundBase64Map {
  /**
   * 信息提示音 base64。
   */
  info: string;
  /**
   * 成功提示音 base64。
   */
  success: string;
  /**
   * 警告提示音 base64。
   */
  warning: string;
  /**
   * 错误提示音 base64。
   */
  error: string;
}

/**
 * 常量：爬虫蓝图提示音 base64 资源。
 *
 * 直接把你的 base64 音频字符串填到对应字段即可。
 */
export const CRAWLER_BLUEPRINT_SOUND_BASE64_MAP: ICrawlerBlueprintSoundBase64Map = {
  info: '',
  success: '',
  warning: '',
  error: ''
};

/**
 * 常量：爬虫蓝图提示音 MIME 类型。
 */
export const CRAWLER_BLUEPRINT_SOUND_MIME_TYPE = 'audio/mpeg';

/**
 * 函数：将 base64 音频转换为 data URL。
 *
 * 该函数允许你把纯 base64 字符串直接喂给浏览器音频能力。
 *
 * # Arguments
 *
 * * `base64` - 音频 base64 字符串。
 * * `mimeType` - 音频 MIME 类型，默认 `audio/mpeg`。
 *
 * # Returns
 *
 * 返回可直接播放的 data URL；当 base64 为空时返回空串。
 */
export const buildCrawlerBlueprintSoundDataUrl = (base64: string, mimeType = CRAWLER_BLUEPRINT_SOUND_MIME_TYPE): string => {
  const normalizedBase64 = base64.trim();

  if (!normalizedBase64) {
    return '';
  }

  return `data:${mimeType};base64,${normalizedBase64}`;
};
