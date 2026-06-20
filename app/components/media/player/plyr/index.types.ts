/**
 * 类型：媒体播放器 Plyr i18n 字典
 */
export type TMediaPlyrI18nDict = Record<string, string | Record<string, string>>;

/**
 * 类型：Plyr 构造器
 */
export type TPlyrCtor = (typeof import('plyr'))['default'];

/**
 * 类型：媒体播放器 Plyr 支持的提供者
 * - html5 HTML5
 * - youtube 油管
 * - vimeo 维米欧
 */
export type TMediaPlyrSourceProvider = 'html5' | 'youtube' | 'vimeo';

/**
 * 接口：媒体播放器 Plyr 支持的提供者
 */
export interface IMediaPlyrSource {
  /**
   * 媒体源 URL 地址
   * - 绝对路径 URL 地址
   * - 相对路径 URL 地址
   * - EmbedId（仅限 youtube、vimeo）
   */
  src: string;

  /**
   * 媒体类型
   * - video/mp4 MP4 视频
   * - video/webm WebM 视频
   * - video/ogg Ogg 视频
   * - audio/mpeg MPEG 音频
   * - audio/ogg Ogg 音频
   * - audio/wav WAV 音频
   * - ...
   */
  type?: string;

  /**
   * 提供者
   * - html5 HTML5
   * - youtube 油管
   * - vimeo 维米欧
   */
  provider?: TMediaPlyrSourceProvider;

  /**
   * 大小：清晰度
   * - 480 SD
   * - 576 HD
   * - 720 HD
   * - 1440 QHD
   * - 1080 2K
   * - 2160 4K
   * - 4320 8K
   * - ... 其他任何数字均可
   */
  size?: number;
}

/**
 * 类型：媒体播放器 Plyr 支持的字幕轨道种类
 * - subtitles 字幕
 * - captions 标题
 * - descriptions 描述
 * - chapters 章节
 * - metadata 元数据
 */
export type TMediaPlyrTrackKind = 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';

/**
 * 类型：媒体播放器 Plyr Source 类型（用于 player.source）
 */
export type TMediaPlyrPlayerSourceType = 'video' | 'audio';

/**
 * 接口：媒体播放器 Plyr Track（用于 player.source）
 */
export interface IMediaPlyrPlayerTrack {
  /**
   * 媒体播放器 Plyr 支持的字幕轨道种类
   * - subtitles 字幕
   * - captions 标题
   * - descriptions 描述
   * - chapters 章节
   * - metadata 元数据
   */
  kind: TMediaPlyrTrackKind;

  /**
   * 轨道标签：如 English、中文、日本語 等
   */
  label: string;

  /**
   * 字幕轨道文本数据的语言
   * - 必须是一个有效的 BCP 47 语言标签
   * - 注意：此字段为 Plyr 的原生字段名（srclang）
   */
  srclang?: string;

  /**
   * 字幕轨道的 URL 地址
   */
  src: string;

  /**
   * 默认
   */
  default?: boolean;
}

/**
 * 接口：媒体播放器 Plyr Source（用于 player.source）
 */
export interface IMediaPlyrPlayerSource {
  /**
   * 媒体类型
   */
  type: TMediaPlyrPlayerSourceType;

  /**
   * 封面
   */
  poster?: string;

  /**
   * 媒体源列表
   */
  sources: IMediaPlyrSource[];

  /**
   * 字幕轨道列表
   */
  tracks?: IMediaPlyrPlayerTrack[];
}

/**
 * 接口：媒体播放器 Plyr 字幕轨道
 */
export interface IMediaPlyrTrack {
  /**
   * 媒体播放器 Plyr 支持的字幕轨道种类
   * - subtitles 字幕
   * - captions 标题
   * - descriptions 描述
   * - chapters 章节
   * - metadata 元数据
   */
  kind: TMediaPlyrTrackKind;

  /**
    轨道标签：如 English、中文、日本語 等
   */
  label: string;

  /**
  * 字幕轨道文本数据的语言
  * - 必须是一个有效的 BCP 47 语言标签
    - 如果 kind 属性设置为 subtitles，则必须定义 srcLang
   */
  srcLang?: string;

  /**
   * 字幕轨道的 URL 地址
   */
  src: string;

  /**
   * 默认
   */
  default?: boolean;
}

/**
 * 类型：媒体播放器 Plyr 控制选项
 * - play-large 大播放按钮
 * - restart 重播按钮
 * - rewind 快退按钮
 * - play 播放/暂停按钮
 * - fast-forward 快进按钮
 * - progress 进度条
 * - current-time 当前时间显示
 * - duration 总时长显示
 * - mute 静音按钮
 * - volume 音量控制
 * - captions 字幕按钮
 * - settings 设置按钮
 * - pip 画中画按钮
 * - airplay 空中播放按钮
 * - download 下载按钮
 * - fullscreen 全屏按钮
 */
export type TMediaPlyrConfigControls = 'play-large' | 'restart' | 'rewind' | 'play' | 'fast-forward' | 'progress' | 'current-time' | 'duration' | 'mute' | 'volume' | 'captions' | 'settings' | 'pip' | 'airplay' | 'download' | 'fullscreen';

/**
 * 类型：媒体播放器 Plyr controls 配置值
 * - string：自定义控件 HTML 字符串
 * - TMediaPlyrConfigControls[]：控件列表
 * - Element：控件容器元素
 * - Function：自定义控件渲染函数
 */
export type TMediaPlyrConfigControlsValue = string | TMediaPlyrConfigControls[] | Element | ((id: string, seektime: number, title: string) => unknown);

/**
 * 类型：媒体播放器 Plyr 设置选项
 * - captions 字幕
 * - quality 清晰度
 * - speed 速度
 * - loop 循环
 */
export type TMediaPlyrConfigSettings = 'captions' | 'quality' | 'speed' | 'loop';

/**
 * 接口：键盘选项
 */
export interface IMediaPlyrConfigKeyboardOptions {
  /**
   * 是否聚焦或全局启用键盘快捷键
   */
  focused?: boolean;

  /**
   * 是否全局启用键盘快捷键
   */
  global?: boolean;
}

/**
 * 接口：Plyr 实例 config 最小结构（仅用于类型安全读取）
 */
export interface IMediaPlyrInstanceConfigMinimum {
  /**
   * 只允许一个播放器同时播放
   */
  autopause?: boolean;
}

/**
 * 接口：媒体播放器 Plyr 工具提示选项
 */
export interface IMediaPlyrConfigTooltipOptions {
  /**
   * 显示控件标签作为悬停和聚焦时的工具提示（默认情况下，标签仅供屏幕阅读器使用）
   */
  controls?: boolean;

  /**
   * 显示一个搜索工具提示，以指示单击时媒体将搜索到的位置
   */
  seek?: boolean;
}

/**
 * 枚举：YouTube 播放状态
 */
export enum EMediaPlyrYoutubeState {
  /**
   * 未开始播放
   */
  UNSTARTED = -1,

  /**
   * 结束
   */
  ENDED = 0,

  /**
   * 播放中
   */
  PLAYING = 1,

  /**
   * 暂停中
   */
  PAUSED = 2,

  /**
   * 缓冲中
   */
  BUFFERING = 3,

  /**
   * 视频已排队
   */
  CUED = 5
}

/**
 * 接口：媒体播放器 Plyr 事件 detail
 */
export interface IMediaPlyrEventDetail {
  /**
   * Plyr 实例
   */
  readonly plyr: Plyr;
}

/**
 * 接口：媒体播放器 Plyr 播放状态变更事件 detail
 */
export interface IMediaPlyrChangeEventDetail {
  /**
   * Plyr 实例
   */
  readonly plyr: Plyr;

  /**
   * YouTube 播放状态代码
   */
  readonly code: EMediaPlyrYoutubeState;
}

/**
 * 接口：YouTube 播放状态
 */
export interface IMediaPlyrEvent extends CustomEvent {
  readonly detail: IMediaPlyrEventDetail;
}

/**
 * 接口：YouTube 播放状态变更事件
 */
export interface IMediaPlyrChangeEvent extends CustomEvent {
  readonly detail: IMediaPlyrChangeEventDetail;
}

/**
 * 接口：媒体播放器 Plyr 字幕选项
 */
export interface IMediaPlyrConfigCaptionOptions {
  /**
   * 是否默认启用字幕
   */
  active?: boolean;

  /**
   * 默认字幕语言
   * - auto 表示使用浏览器语言
   */
  language?: string;

  /**
   * 监听 track 变化并更新菜单
   */
  update?: boolean;
}

/**
 * 类型：媒体播放器 Plyr 全屏回退模式
 * - force 强制启用回退方案
 */
export type TMediaPlyrConfigFullScreenFallback = boolean | 'force';

/**
 * 接口：媒体播放器 Plyr 全屏选项
 */
export interface IMediaPlyrConfigFullScreenOptions {
  /**
   * 是否启用全屏
   */
  enabled?: boolean;

  /**
   * 是否允许回退到全窗口/视口方案
   */
  fallback?: TMediaPlyrConfigFullScreenFallback;

  /**
   * iOS 是否使用原生全屏
   */
  iosNative?: boolean;

  /**
   * 指定进入全屏时的容器选择器
   */
  container?: string;
}

/**
 * 接口：媒体播放器 Plyr 本地存储选项
 */
export interface IMediaPlyrConfigStorageOptions {
  /**
   * 是否启用本地存储
   */
  enabled?: boolean;

  /**
   * 存储 key
   */
  key?: string;
}

/**
 * 接口：媒体播放器 Plyr 播放速度选项
 */
export interface IMediaPlyrConfigSpeedOptions {
  /**
   * 默认播放速度
   */
  selected: number;

  /**
   * 可选的播放速度列表
   */
  options: number[];
}

/**
 * 接口：媒体播放器 Plyr 清晰度选项
 */
export interface IMediaPlyrConfigQualityOptions {
  /**
   * 默认清晰度
   */
  default: number;

  /**
   * 是否强制清晰度（禁用自动）
   */
  forced?: boolean;

  /**
   * 清晰度变更回调
   */
  onChange?: (quality: number) => void;

  /**
   * 可选清晰度列表
   */
  options: number[];
}

/**
 * 接口：媒体播放器 Plyr 循环选项
 */
export interface IMediaPlyrConfigLoopOptions {
  /**
   * 是否循环播放
   */
  active: boolean;
}

/**
 * 接口：媒体播放器 Plyr 广告选项（vi.ai）
 */
export interface IMediaPlyrConfigAdOptions {
  /**
   * 是否启用广告
   */
  enabled: boolean;

  /**
   * 发布者 ID
   */
  publisherId?: string;

  /**
   * 广告 Tag URL
   */
  tagUrl?: string;
}

/**
 * 接口：媒体播放器 Plyr 预览缩略图选项
 */
export interface IMediaPlyrConfigPreviewThumbnailsOptions {
  /**
   * 是否启用预览缩略图
   */
  enabled?: boolean;

  /**
   * 预览缩略图资源地址
   */
  src?: string | string[];

  /**
   * 是否携带凭证请求资源
   */
  withCredentials?: boolean;
}

/**
 * 接口：媒体播放器 Plyr 媒体元数据封面图
 */
export interface IMediaPlyrConfigMediaMetadataArtwork {
  /**
   * 图片地址
   */
  src: string;

  /**
   * 图片尺寸描述
   */
  sizes?: string;

  /**
   * MIME 类型
   */
  type: string;
}

/**
 * 接口：媒体播放器 Plyr 媒体元数据选项
 */
export interface IMediaPlyrConfigMediaMetadataOptions {
  /**
   * 标题
   */
  title?: string;

  /**
   * 艺术家
   */
  artist?: string;

  /**
   * 专辑
   */
  album?: string;

  /**
   * 封面图列表
   */
  artwork?: IMediaPlyrConfigMediaMetadataArtwork[];
}

/**
 * 接口：媒体播放器 Plyr 标记点
 */
export interface IMediaPlyrConfigMarkersPoint {
  /**
   * 时间点（秒）
   */
  time: number;

  /**
   * 标签文案
   */
  label: string;
}

/**
 * 接口：媒体播放器 Plyr 标记点选项
 */
export interface IMediaPlyrConfigMarkersOptions {
  /**
   * 是否启用标记点
   */
  enabled: boolean;

  /**
   * 标记点列表
   */
  points: IMediaPlyrConfigMarkersPoint[];
}

/**
 * 接口：媒体播放器 Plyr 配置信息
 */
export interface IMediaPlyrConfig {
  /**
   * 是否启用 Plyr
   */
  enabled?: boolean;

  /**
   * 是否在控制台显示调试信息
   */
  debug?: boolean;

  /**
   * 显示的控件
    - 仅当传入非空数组时才会尊重用户配置
  * - 传入 [] 默认仍会使用默认控件
    - 当 hideControls=true 且 controls=[] 时，表示不显示任何控件
   * 默认值为 ['play-large', 'play', 'current-time', 'progress', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
   */
  controls?: TMediaPlyrConfigControlsValue;

  /**
   * 类型：媒体播放器 Plyr 设置选项
   * - captions 字幕
   * - quality 清晰度
   * - speed 速度
   * - loop 循环
   * 默认：['captions', 'quality', 'speed', 'loop']
   */
  settings?: TMediaPlyrConfigSettings[];

  /**
   * 加载作为 iconUrl 选项指定的 SVG 精灵（如果是 URL）如果为 false，则假定您正在自己处理精灵加载
   * 默认值为 true
   */
  loadSprite?: boolean;

  /**
   * 图标的 URL 地址
   * 默认：https://cdn.plyr.io/3.8.4/plyr.svg
   */
  iconUrl?: string;

  /**
   * 指定默认控件中使用的图标的 id 前缀（例如 plyr-play 的前缀是 plyr）
   * 这是为了防止如果您使用自己的 SVG 精灵但使用默认控件时发生冲突
   * 大多数人可以忽略此选项
   * 默认：plyr
   */
  iconPrefix?: string;

  /**
   * 指定一个 URL 或路径到一个空白视频文件，用于正确取消网络请求
   * 默认：https://cdn.plyr.io/static/blank.mp4
   */
  blankVideo?: string;

  /**
   * 加载时自动播放媒体通常不建议这样做，因为用户体验原因在某些浏览器中，默认情况下也会禁用此功能
   * 如果 <video> 或 <audio> 元素上存在 autoplay 属性，则会自动将其设置为 true
   * 默认：false
   */
  autoplay?: boolean;

  /**
   * 只允许一个播放器同时播放
   * 默认：true
   */
  autopause?: boolean;

  /**
   * 快进或快退时，用户每次跳转的时间，单位为秒
   * 默认：10 秒
   */
  seekTime?: number;

  /**
   * 是否在用户交互导致 seek 后自动播放
   * - 仅对“用户交互触发的 seek”生效（例如点击/拖拽进度条）
   * - 对组件内部的初始化/同步 source 等程序性 seek 不生效
   * 默认：true
   */
  seekToPlay?: boolean;

  /**
   * 一个介于 0 和 1 之间的数字，表示播放器的初始音量
   * 默认：1
   */
  volume?: number;

  /**
   * 是否静音播放如果 <video> 或 <audio> 元素上存在 muted 属性，则会自动将其设置为 true
   * 默认：false
   */
  muted?: boolean;

  /**
   * 点击（或轻触）视频容器将切换播放/暂停状态
   * 默认：true
   */
  clickToPlay?: boolean;

  /**
   * 禁止在视频上右键单击菜单以帮助作为防止内容下载的非常原始的混淆
   * 默认：true
   */
  disableContextMenu?: boolean;

  /**
   * 自动隐藏视频控件在没有鼠标或焦点移动 2s 后，在控制元素模糊（标签退出），在播放开始或进入全屏
   * 只要移动鼠标、聚焦控件元素或暂停播放，控件就会立即重新出现
   * 注意：当 hideControls=true 且 controls=[] 时，表示不显示任何控件
   * 默认：true
   */
  hideControls?: boolean;

  /**
   * 回放完成后，将回放重新设置为开始
   * 默认：false
   */
  resetOnEnd?: boolean;

  /**
   * 键盘快捷键选项
   * - focused: 是否聚焦或全局启用键盘快捷键
   * - global: 是否全局启用键盘快捷键
   * 默认：{ focused: true, global: false }
   */
  keyboard?: IMediaPlyrConfigKeyboardOptions;

  /**
   * 媒体播放器 Plyr 工具提示选项
   * - controls: 显示控件标签作为悬停和聚焦时的工具提示（默认情况下，标签仅供屏幕阅读器使用）
   * - seek: 显示一个搜索工具提示，以指示单击时媒体将搜索到的位置
   * 默认：{ controls: false, seek: true }
   */
  tooltips?: IMediaPlyrConfigTooltipOptions;

  /**
   * 为媒体指定自定义时长
   * 如果未定义且无法从媒体中检索到持续时间，则使用此值
   */
  duration?: number;

  /**
   * 在当前时间显示中显示元数据加载事件（启动时）上媒体的持续时间
   * 只有当 preload 属性未设置为none（或根本未设置）并且您选择不显示持续时间（请参阅controls选项）时，这才会起作用
   * 默认：true
   */
  displayDuration?: boolean;

  /**
   * 将当前时间显示为倒计时而不是增量计数器
   * 默认：true
   */
  invertTime?: boolean;

  /**
   * 允许用户点击来切换以上
   * 默认：true
   */
  toggleInvert?: boolean;

  /**
  * 允许在默认处理程序之前将事件监听器绑定到控件
    - 有关可用监听器，请参见 Plyr 的 defaults.js
    - 如果您的处理程序对事件调用了 preventDefault()，则默认处理程序将不会触发
   */
  listeners?: { [key: string]: (event: IMediaPlyrEvent) => void };

  /**
   * 字幕选项
   * - active: 是否默认启用字幕
   * - language: 默认字幕语言，auto 表示使用浏览器语言
   * - update: 监听 track 变化并更新菜单
   */
  captions?: IMediaPlyrConfigCaptionOptions;

  /**
   * 全屏选项
   * - enabled: 是否启用全屏
   * - fallback: 是否允许回退到全窗口/视口方案
   * - iosNative: iOS 是否使用原生全屏
   */
  fullscreen?: IMediaPlyrConfigFullScreenOptions;

  /**
   * The aspect ratio you want to use for embedded players.
   */
  ratio?: string;

  /**
   * 本地存储选项
   * - enabled: 是否启用本地存储
   * - key: 存储 key
   */
  storage?: IMediaPlyrConfigStorageOptions;

  /**
   * 播放速度选项
   * - selected: 默认速度
   * - options: UI 中展示的速度列表
   */
  speed?: IMediaPlyrConfigSpeedOptions;

  /**
   * 清晰度选项（目前仅 YouTube 支持）
   * - default: 默认清晰度
   * - options: UI 中展示的清晰度列表
   */
  quality?: IMediaPlyrConfigQualityOptions;

  /**
   * 循环选项
   * - active: 是否循环播放
   */
  loop?: IMediaPlyrConfigLoopOptions;

  /**
   * 广告选项（vi.ai）
   * - enabled: 是否启用广告
   * - publisherId: 发布者 ID
   */
  ads?: IMediaPlyrConfigAdOptions;

  /**
   * Vimeo Player Options.
   */
  vimeo?: object;

  /**
   * Youtube Player Options.
   */
  youtube?: object;

  /**
   * 预览缩略图选项
   */
  previewThumbnails?: IMediaPlyrConfigPreviewThumbnailsOptions;

  /**
   * 媒体元数据选项
   */
  mediaMetadata?: IMediaPlyrConfigMediaMetadataOptions;

  /**
   * 标记点选项
   */
  markers?: IMediaPlyrConfigMarkersOptions;
}

/**
 * 接口：媒体播放器 Plyr 注入后的配置（组件内部使用）
 */
export interface IMediaPlyrConfigInjected extends IMediaPlyrConfig {
  /**
   * 国际化文案
   * - 由组件根据系统 i18n 强制注入
   */
  i18n: TMediaPlyrI18nDict;
}

/**
 * 接口：媒体播放器 Plyr 组件属性
 */
export interface IMediaPlyrProps {
  /**
   * id：唯一标识符，默认随机生成
   */
  id?: string;

  /**
   * 类型
   * - auto 自动检测
   * - video 视频
   * - audio 音频
   * - youtube 油管
   * - vimeo 维米欧
   */
  type?: 'auto' | 'video' | 'audio' | 'youtube' | 'vimeo';

  /**
   * 媒体源
   * - 字符串：单一媒体源 URL
   * - IMediaPlyrSource：单一媒体源对象
   * - IMediaPlyrSource[]：多媒体源对象数组
   */
  sources: string | IMediaPlyrSource | IMediaPlyrSource[];

  /**
   * 字幕轨道
   * - 字符串：单一字幕轨道 URL
   * - TMediaPlyrTrackKind：单一字幕轨道种类
   * - TMediaPlyrTrackKind[]：多字幕轨道种类数组
   */
  tracks?: string | TMediaPlyrTrackKind | TMediaPlyrTrackKind[];

  /**
   * 封面图片 URL
   */
  poster?: string;

  /**
   * 播放器选项配置项
   * @see {@link https://github.com/sampotts/plyr#options}  媒体播放器 Plyr 选项配置项文档
   */
  options?: IMediaPlyrConfig;

  /**
   * 音频波形路径（SVG path 的 d 属性）
   * - 用途：在音频模式下用波形覆盖 Plyr 原生 progress 的视觉层
   * - 注意：Plyr 原生的 seek input/tooltip 仍保留，仅替换视觉
   */
  waveformPath?: string;

  /**
   * 音频波形高度（px）
   * - 用途：控制波形进度条的整体高度（波形主体可能内部只占一部分高度）
   * - 默认：不传则使用波形组件自身默认值
   */
  waveformHeight?: number;

  /**
   * 音频波形 viewBox 宽度
   * - 用途：与后端生成的 waveformPath 坐标系保持一致
   * - 默认：不传则使用波形组件自身默认值
   */
  waveformViewBoxWidth?: number;

  /**
   * 音频波形 viewBox 高度
   * - 用途：与后端生成的 waveformPath 坐标系保持一致
   * - 默认：不传则使用波形组件自身默认值
   */
  waveformViewBoxHeight?: number;
}

/**
 * 接口：媒体源 URL Provider 识别规则。
 */
export interface IMediaPlyrSourceUrlProviderRule {
  /**
   * 属性：提供者。
   */
  provider: Exclude<TMediaPlyrSourceProvider, 'html5'>;

  /**
   * 属性：匹配函数。
   */
  match: (url: URL) => boolean;
}
