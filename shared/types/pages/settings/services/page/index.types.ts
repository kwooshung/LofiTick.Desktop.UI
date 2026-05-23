/**
 * 接口：豆包语音服务凭证。
 */
export interface ISettingsServiceVolcSpeech {
  /**
   * 豆包语音 App ID。
   */
  appId: string;

  /**
   * 豆包语音 Access Token。
   */
  accessToken: string;

  /**
   * 豆包语音 Resource ID。
   */
  resourceId: string;
}

/**
 * 接口：桌面端服务凭证设置。
 */
export interface ISettingsServices {
  /**
   * 豆包语音默认凭证。
   */
  volcSpeech: ISettingsServiceVolcSpeech;
}
