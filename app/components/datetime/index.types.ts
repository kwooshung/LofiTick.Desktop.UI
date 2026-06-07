/**
 * 接口：Datetime 组件 Props
 */
export interface IDatetimeProps {
  /**
   * 属性：本地化语言区域
   * - 默认根据 i18n 语言自动设置
   * - 'zh-CN'、'en-US'、'ja-JP' 等
   */
  locale?: string;

  /**
   * 属性：时间值
   * - 必填，支持 string | number | Date
   * - "2026-01-05T12:00:00Z"、1640995200000、new Date()
   */
  datetime?: string | number | Date;

  /**
   * 属性：兼容旧调用的时间值别名。
   * - 仅用于兼容历史上误传的 value 字段
   * - 新代码应统一使用 datetime
   */
  value?: string | number | Date;

  /**
   * 属性：区域匹配算法
   * - 'best fit'：浏览器默认，更智能的匹配
   * - 'lookup'：严格按语言标签查找
   */
  localeMatcher?: 'best fit' | 'lookup';

  /**
   * 属性：星期显示格式
   * - 'long'：星期一
   * - 'short'：周一
   * - 'narrow'：一
   */
  weekday?: 'long' | 'short' | 'narrow';

  /**
   * 属性：纪元显示格式（公元前/公元后）
   * - 'long'：公元
   * - 'short'：公元
   * - 'narrow'：公元
   */
  era?: 'long' | 'short' | 'narrow';

  /**
   * 属性：年份显示格式
   * - 'numeric'：2026
   * - '2-digit'：26
   */
  year?: 'numeric' | '2-digit';

  /**
   * 属性：月份显示格式
   * - 'numeric'：1
   * - '2-digit'：01
   * - 'long'：一月
   * - 'short'：1月
   * - 'narrow'：1
   */
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';

  /**
   * 属性：日期显示格式
   * - 'numeric'：5
   * - '2-digit'：05
   */
  day?: 'numeric' | '2-digit';

  /**
   * 属性：小时显示格式
   * - 'numeric'：13
   * - '2-digit'：13
   */
  hour?: 'numeric' | '2-digit';

  /**
   * 属性：分钟显示格式
   * - 'numeric'：8
   * - '2-digit'：08
   */
  minute?: 'numeric' | '2-digit';

  /**
   * 属性：秒显示格式
   * - 'numeric'：0
   * - '2-digit'：00
   */
  second?: 'numeric' | '2-digit';

  /**
   * 属性：时区名称显示格式
   * - 'short'：GMT+8
   * - 'long'：中国标准时间
   * - 'shortOffset'：GMT+8
   * - 'longOffset'：GMT+08:00
   * - 'shortGeneric'：中国时间
   * - 'longGeneric'：中国标准时间
   */
  timeZoneName?: 'short' | 'long' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric';

  /**
   * 属性：格式匹配算法（较少使用）
   * - 'best fit'：默认
   * - 'basic'：基础匹配
   */
  formatMatcher?: 'best fit' | 'basic';

  /**
   * 属性：是否使用 12 小时制
   * - true：显示 AM/PM
   * - false：使用 24 小时制（默认）
   */
  hour12?: boolean;

  /**
   * 属性：强制指定时区
   * - 'Asia/Shanghai'、'America/New_York'、'UTC'
   */
  timeZone?: string;

  /**
   * 属性：日历系统
   * - 'gregory'（公历，默认）、'chinese'、'japanese'、'islamic' 等
   */
  calendar?: string;

  /**
   * 属性：上午/下午/夜晚等时段描述
   * - 'narrow'：凌晨
   * - 'short'：上午
   * - 'long'：上午
   */
  dayPeriod?: 'narrow' | 'short' | 'long';

  /**
   * 属性：数字系统
   * - 'latn'（阿拉伯数字，默认）、'hanidec'（中文数字）、'arab' 等
   */
  numberingSystem?: string;

  /**
   * 属性：日期整体预设风格（会覆盖 year/month/day/weekday）
   * - 'full'：2026年1月5日星期一
   * - 'long'：2026年1月5日
   * - 'medium'：2026/1/5
   * - 'short'：26/1/5
   */
  dateStyle?: 'full' | 'long' | 'medium' | 'short';

  /**
   * 属性：时间整体预设风格（会覆盖 hour/minute/second）
   * - 'full'：下午1时8分0秒 中国标准时间
   * - 'long'：13:08:00 中国标准时间
   * - 'medium'：13:08
   * - 'short'：下午1:08
   */
  timeStyle?: 'full' | 'long' | 'medium' | 'short';

  /**
   * 属性：小时循环制式
   * - 'h11'：0-11（美式12小时）
   * - 'h12'：1-12（美式12小时）
   * - 'h23'：0-23
   * - 'h24'：1-24
   */
  hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';

  /**
   * 属性：是否启用相对时间显示
   * - true：显示“3 小时前”、“明天”等
   * - false：显示绝对时间（默认）
   */
  relative?: boolean;

  /**
   * 属性：相对时间数字显示方式
   * - 'always'：永远显示数字（如“1 小时前”）
   * - 'auto'：仅在大于 1 时显示数字（如“1小时前”，但“刚刚”不显示 1）
   */
  numeric?: 'always' | 'auto';

  /**
   * 属性：相对时间文字风格
   * - 'long'：1 小时前
   * - 'short'：1 小时前
   * - 'narrow'：1小时前
   */
  relativeStyle?: 'long' | 'short' | 'narrow';

  /**
   * 属性：是否显示 title 属性（鼠标悬停显示完整时间）
   * - true：自动生成完整时间作为 title
   * - false：不显示 title
   * - string：自定义 title 内容
   */
  title?: boolean | string;

  /**
   * 属性：相对时间关闭阈值（秒），默认 7 天
   * - 86400 表示 1 天后强制显示绝对时间
   */
  noRelativeAfter?: number;

  /**
   * 属性：tooltip 的前缀内容
   * - 仅在 relative 为 true 且 显示相对时间 时生效
   * - 例如：prefix="创建于 "，则 tooltip 显示为“创建于 2026年1月5日星期一 13:08:00”
   */
  tooltipPrefix?: string;
}
