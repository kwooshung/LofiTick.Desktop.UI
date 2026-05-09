/**
 * 接口：音频波形组件（SVG）Seek 事件 Payload
 */
export interface IMediaAudioWavesSeekPayload {
  /**
   * Seek 百分比
   * - 范围：0~1
   */
  percent: number;

  /**
   * Seek 时间（秒）
   * - 仅当传入 duration 时提供
   */
  time?: number;
}

/**
 * 接口：音频波形组件（SVG）事件
 */
export interface IMediaAudioWavesEmits {
  /**
   * 事件：Seek
   * @param {IMediaAudioWavesSeekPayload} payload payload
   */
  seek: [payload: IMediaAudioWavesSeekPayload];
}

/**
 * 接口：音频波形组件（SVG）Props
 */
export interface IMediaAudioWavesProps {
  /**
   * 波形路径（SVG path 的 d 属性）
   * - 用途：作为 clipPath 的几何形状，用于将填充裁剪为波形轮廓
   * - 约束：必须是合法的 SVG PathData（不包含 <path> 标签本身）
   */
  waveformPath: string;

  /**
   * 高度（px）
   * - 用途：控制组件在布局中的显示高度
   * - 默认：40
   */
  height?: number;

  /**
   * viewBox 宽度
   * - 用途：定义波形绘制坐标系的宽度（所有进度位置都会映射到该坐标系）
   * - 默认：370
   */
  viewBoxWidth?: number;

  /**
   * viewBox 高度
   * - 用途：定义波形绘制坐标系的高度
   * - 默认：32
   */
  viewBoxHeight?: number;

  /**
   * 播放进度（Playhead 位置，百分比）
   * - 用途：驱动“已播放填充”与“播放位置指示线（Playhead）”
   * - 注意：该值应由播放器作为“真相源”提供（例如 Plyr/HTMLAudioElement 的 currentTime/duration）
   * - 注意：组件不会修改该值；用户交互会通过 seek 事件“请求跳转”，播放器完成跳转后应再回传新的 progress
   * - 范围：0~1（超出会被内部 clamp）
   * - 默认：0
   */
  progress?: number;

  /**
   * 时长（秒）
   * - 用途：在触发 seek 事件时，将 percent 转换为 time（秒）并一并透出
   */
  duration?: number;
}
