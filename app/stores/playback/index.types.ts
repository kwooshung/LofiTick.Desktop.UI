/**
 * 接口：播放设置接口
 */
export interface IStoresPlayback {
  /**
   * 淡入淡出时长（毫秒）
   */
  fade: {
    /**
     * 淡入时间（毫秒）
     */
    start: number;

    /**
     * 淡出时间（毫秒）
     */
    end: number;
  };

  /**
   * 是否启用音频标准化（目标 -14 LUFS）
   */
  lufs: number;
}
