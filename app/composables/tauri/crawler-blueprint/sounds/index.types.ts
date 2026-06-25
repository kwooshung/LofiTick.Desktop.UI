/**
 * 爬虫蓝图提示音 base64 映射。
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
