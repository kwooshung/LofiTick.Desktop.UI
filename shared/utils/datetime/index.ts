/**
 * 一个“面向实用”的 DateTime 类，借鉴 C# DateTime 常用方法与属性，底层使用 dayjs
 *
 * 使用示例：
 *   const now = DateTime.now();
 *   const utc = DateTime.utcNow();
 */
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);

/**
 * 常量：数据库日期时间格式字符串
 */
const DB_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 枚举：日期时间种类（Kind）
 */
export enum EDateTimeKind {
  /**
   * 未指定（不含时区信息）
   */
  Unspecified = 'Unspecified',

  /**
   * UTC 时间
   */
  Utc = 'Utc',

  /**
   * 本地时间
   */
  Local = 'Local'
}

/**
 * DateTime：轻量封装 dayjs，提供 C# 风格常用方法
 *
 * 设计要点：
 * - 内部以 dayjs 实例保存瞬时点（value），并保留 Kind 用于语义
 * - toSQL / toSQLMs 返回 UTC 字面字符串，适合写入 MySQL DATETIME
 * - Parse/TryParse 对常见格式友好（若字符串含时区或 'T'，按文本解析；否则按 DB_DATETIME_FORMAT 当作 UTC 字面）
 */
export class DateTime {
  /**
   * 私有属性：dayjs 实例 & Kind
   */
  private _d: Dayjs;

  /**
   * 私有属性：日期时间种类（Kind）
   */
  private _kind: EDateTimeKind;

  /**
   * 构造函数：私有，使用静态工厂方法创建实例
   */
  private constructor(d: Dayjs, kind: EDateTimeKind) {
    /**
     * 赋值
     */
    this._d = d;

    /**
     * 赋值 Kind
     */
    this._kind = kind;
  }

  /**
   * 静态函数：当前本地时间（Kind = Local）
   */
  static now = (): DateTime => new DateTime(dayjs(), EDateTimeKind.Local);

  /**
   * 静态函数：当前 UTC 时间（Kind = Utc）
   */
  static utcNow = (): DateTime => new DateTime(dayjs().utc(), EDateTimeKind.Utc);

  /**
   * 静态函数：返回 today（本地），时间为 00:00:00
   */
  static today = (): DateTime => new DateTime(dayjs().startOf('day'), EDateTimeKind.Local);

  /**
   * 静态函数：返回 UTC today，时间为 00:00:00
   */
  static utcToday = (): DateTime => new DateTime(dayjs().utc().startOf('day'), EDateTimeKind.Utc);

  /**
   * 静态函数：从 JS Date 创建，可指定 Kind（默认 Unspecified）
   * @param {Date} date JS Date 实例
   * @param {EDateTimeKind} kind 日期时间种类
   * @returns {DateTime} DateTime 实例
   */
  static fromJSDate = (date: Date, kind: EDateTimeKind = EDateTimeKind.Unspecified): DateTime => new DateTime(dayjs(date), kind);

  /**
   * 静态函数：从 unix 秒时间戳创建
   * @param {number} seconds 自 1970-01-01T00:00:00Z 起的秒数
   * @param {EDateTimeKind} kind 日期时间种类
   * @returns {DateTime} DateTime 实例
   */
  static fromUnixSeconds = (seconds: number, kind: EDateTimeKind = EDateTimeKind.Unspecified): DateTime => new DateTime(dayjs.unix(seconds), kind);

  /**
   * 静态函数：从 unix 毫秒时间戳创建
   * @param {number} ms 自 1970-01-01T00:00:00Z 起的毫秒数
   * @param {EDateTimeKind} kind 日期时间种类
   * @returns {DateTime} DateTime 实例
   */
  static fromUnixMilliseconds = (ms: number, kind: EDateTimeKind = EDateTimeKind.Unspecified): DateTime => new DateTime(dayjs(ms), kind);

  /**
   * 静态函数：Parse 智能解析字符串：
   * - 如果包含 'T' 或 'Z' 或 带偏移 (+/-hh:mm)，按文本解析（ISO / 带时区）
   * - 否则按 DB_DATETIME_FORMAT 解析并当作 UTC 字面（Kind = Utc）
   * @param {string} text 日期时间字符串
   * @returns {DateTime} DateTime 实例
   */
  static parse(text: string): DateTime {
    if (!text) {
      throw new Error('Invalid date string');
    }
    /**
     * 常量：looksIsoOrHasTz。
     */
    const looksIsoOrHasTz = /[Tt]|[zZ]|[+-]\d{2}:\d{2}$/.test(text);
    if (looksIsoOrHasTz) {
      /**
       * 常量：d。
       */
      const d = dayjs(text);
      /**
       * 函数：isUtcLike。
       */
      const isUtcLike = /[zZ]$|[+-]\d{2}:\d{2}$/.test(text);
      // 若含 Z 或显式偏移，标记为 Utc，否则 Unspecified
      return new DateTime(dayjs(text).utc ? dayjs(text).utc() : d, isUtcLike ? EDateTimeKind.Utc : EDateTimeKind.Unspecified);
    } else {
      // 无时区信息，视为 UTC 字面
      return new DateTime(dayjs.utc(text, DB_DATETIME_FORMAT), EDateTimeKind.Utc);
    }
  }

  /** 静态函数：TryParse：解析失败返回 null（更接近 TryParse 语义）
   * @param {string} text 日期时间字符串
   * @returns {DateTime | null} DateTime 实例或 null
   */
  static tryParse(text?: string): DateTime | null {
    if (!text) {
      return null;
    }
    try {
      /**
       * 常量：dt。
       */
      const dt = DateTime.parse(text);
      if (!dt.isValid()) {
        return null;
      }
      return dt;
    } catch {
      return null;
    }
  }

  /**
   * 静态函数：parseExact：按指定格式解析（format 使用 dayjs 的格式）
   * - assumeUtcIfNoTz：如果没有时区信息，是否按 UTC 解析
   * @param {string} text 日期时间字符串
   * @param {string} format 日期时间格式字符串（dayjs 格式）
   * @param {boolean} assumeUtcIfNoTz 如果没有时区信息，是否按 UTC 解析
   * @returns {DateTime} DateTime 实例
   */
  static parseExact(text: string, format: string, assumeUtcIfNoTz: boolean = true): DateTime {
    if (!text) {
      throw new Error('Invalid date string');
    }

    /**
     * 函数：hasTz。
     */
    const hasTz = /[zZ]|[+-]\d{2}:\d{2}$/.test(text) || text.includes('T');

    if (hasTz) {
      return new DateTime(dayjs(text, format), EDateTimeKind.Unspecified);
    }
    if (assumeUtcIfNoTz) {
      return new DateTime(dayjs.utc(text, format), EDateTimeKind.Utc);
    }

    return new DateTime(dayjs(text, format), EDateTimeKind.Unspecified);
  }

  /**
   * 属性：获取 Kind
   * @returns {EDateTimeKind} 日期时间种类
   */
  get kind(): EDateTimeKind {
    return this._kind;
  }

  /**
   * 函数：是否有效日期时间
   * @returns {boolean} 是否有效
   */
  isValid(): boolean {
    return this._d.isValid();
  }

  /**
   * 函数：转换为 JS Date
   * @returns {Date} JS Date 实例
   */
  toJSDate(): Date {
    return this._d.toDate();
  }

  /**
   * 函数：转换为 unix 毫秒时间戳
   * @returns {number} 自 1970-01-01T00:00:00Z 起的毫秒数
   */
  toUnixMs(): number {
    return this._d.valueOf();
  }

  /**
   * 函数：转换为 unix 秒时间戳
   * @returns {number} 自 1970-01-01T00:00:00Z 起的秒数
   */
  toUnixSeconds(): number {
    return Math.floor(this._d.valueOf() / 1000);
  }

  /**
   * 函数：获取 Dayjs 实例
   * @returns {Dayjs} Dayjs 实例
   */
  toDayjs(): Dayjs {
    return this._d;
  }

  /**
   * 函数：获取完整年份
   * @returns {number} 年份
   */
  year(): number {
    return this._d.year();
  }

  /**
   * 函数：获取月份（1-12）
   * @returns {number} 月份
   */
  month(): number {
    return this._d.month() + 1;
  }

  /**
   * 函数：获取月份中的第几天（1-31）
   * @returns {number} 月份中的第几天
   */
  day(): number {
    return this._d.date();
  }

  /**
   * 函数：获取小时（0-23）
   * @returns {number} 小时
   */
  hour(): number {
    return this._d.hour();
  }

  /**
   * 函数：获取分钟（0-59）
   * @returns {number} 分钟
   */
  minute(): number {
    return this._d.minute();
  }

  /**
   * 函数：获取秒数（0-59）
   * @returns {number} 秒数
   */
  second(): number {
    return this._d.second();
  }

  /**
   * 函数：获取毫秒数（0-999）
   * @returns {number} 毫秒数
   */
  millisecond(): number {
    return this._d.millisecond();
  }

  /**
   * 函数：获取星期几（0 = 星期日 .. 6 = 星期六）
   * @returns {number} 星期几
   */
  dayOfWeek(): number {
    return this._d.day();
  }

  /**
   * 函数：增加年份
   * @param {number} n 增加的年份数
   * @returns {DateTime} 新的 DateTime 实例
   */
  addYears(n: number): DateTime {
    return new DateTime(this._d.add(n, 'year'), this._kind);
  }

  /**
   * 函数：增加月份
   * @param {number} n 增加的月份数
   * @returns {DateTime} 新的 DateTime 实例
   */
  addMonths(n: number): DateTime {
    return new DateTime(this._d.add(n, 'month'), this._kind);
  }

  /**
   * 函数：增加天数
   * @param {number} n 增加的天数
   * @returns {DateTime} 新的 DateTime 实例
   */
  addDays(n: number): DateTime {
    return new DateTime(this._d.add(n, 'day'), this._kind);
  }

  /**
   * 函数：增加小时
   * @param {number} n 增加的小时数
   * @returns {DateTime} 新的 DateTime 实例
   */
  addHours(n: number): DateTime {
    return new DateTime(this._d.add(n, 'hour'), this._kind);
  }

  /**
   * 函数：增加分钟
   * @param {number} n 增加的分钟数
   * @returns {DateTime} 新的 DateTime 实例
   */
  addMinutes(n: number): DateTime {
    return new DateTime(this._d.add(n, 'minute'), this._kind);
  }

  /**
   * 函数：增加秒数
   * @param {number} n 增加的秒数
   * @returns {DateTime} 新的 DateTime 实例
   */
  addSeconds(n: number): DateTime {
    return new DateTime(this._d.add(n, 'second'), this._kind);
  }

  /**
   * 函数：增加毫秒数
   * @param {number} n 增加的毫秒数
   * @returns {DateTime} 新的 DateTime 实例
   */
  addMilliseconds(n: number): DateTime {
    return new DateTime(this._d.add(n, 'millisecond'), this._kind);
  }

  /**
   * 函数：相减，返回毫秒差值（this - other）
   * @param {DateTime} other 另一个 DateTime 实例
   * @returns {number} 毫秒差值
   */
  subtract(other: DateTime): number {
    return this._d.valueOf() - other._d.valueOf();
  }

  /**
   * 函数：相减，返回指定单位的差值（this - other）
   * @param {DateTime} other 另一个 DateTime 实例
   * @param {dayjs.OpUnitType} unit 差值单位（默认 millisecond）
   * @returns {number} 指定单位的差值
   */
  diff(other: DateTime, unit: dayjs.OpUnitType = 'millisecond'): number {
    return this._d.diff(other._d, unit);
  }

  /**
   * 函数：比较是否相等
   * @param {DateTime} other 另一个 DateTime 实例
   * @returns {boolean} 是否相等
   */
  equals(other: DateTime): boolean {
    return this._d.valueOf() === other._d.valueOf();
  }

  /**
   * 函数：强制设置 Kind（不改变瞬时点）
   * @param {EDateTimeKind} kind 目标 Kind
   * @returns {DateTime} 新的 DateTime 实例
   */
  toKind(kind: EDateTimeKind): DateTime {
    return new DateTime(this._d, kind);
  }

  /**
   * 函数：toISOString（返回标准 ISO UTC 字符串）
   * @returns {string} ISO 字符串
   */
  toISOString(): string {
    return this._d.toISOString ? this._d.toISOString() : this.toJSDate().toISOString();
  }

  /**
   * 函数：克隆当前实例
   * @returns {DateTime} 新的 DateTime 实例
   */
  clone(): DateTime {
    return new DateTime(this._d.clone(), this._kind);
  }

  /**
   * 函数：转换为字符串
   * @returns {string} 字符串表示
   */
  toString(): string {
    return this._d.toString();
  }
}
