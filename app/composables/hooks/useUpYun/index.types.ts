/**
 * UpYun provider options separator.
 * 三种合法的 UpYun 间隔标识符，需与控制台配置一致
 * - '!' 感叹号（默认）
 * - '-' 中划线
 * - '_' 下划线
 */
export type TUpYunSeparator = '!' | '-' | '_';

/**
 * 输出格式类型
 * - 'jpg' JPG 图片
 * - 'png' PNG 图片
 * - 'webp' WebP 图片（含动态 WebP）
 */
export type TUpYunFormat = 'jpg' | 'png' | 'webp';

/**
 * 九宫格方位类型（gravity/align）详见文档方位说明
 * - 'northwest' 西北
 * - 'north' 正北
 * - 'northeast' 东北
 * - 'west' 正西
 * - 'center' 居中
 * - 'east' 正东
 * - 'southwest' 西南
 * - 'south' 正南
 * - 'southeast' 东南
 */
export type TUpYunGravity = 'northwest' | 'north' | 'northeast' | 'west' | 'center' | 'east' | 'southwest' | 'south' | 'southeast';

/**
 * 翻转方向类型
 * - 'left,right' 从左向右
 * - 'top,down' 从上向下
 */
export type TUpYunFlip = 'left,right' | 'top,down';

/**
 * 主题色输出进制类型
 */
export type TUpYunExformat = 'dec' | 'hex';

/**
 * 静态图渐变方向类型
 */
export type TUpYunGradientOrientation = 'top,down' | 'bottom,up' | 'left,right' | 'right,left';

/**
 * 字体类型（文字水印）
 */
export type TUpYunFont = 'simsun' | 'simhei' | 'simkai' | 'simli' | 'simyou' | 'simfang' | 'sc' | 'tc' | 'arial' | 'georgia' | 'helvetica' | 'roman';

/**
 * 尺寸字符串：宽x高，例如 '300x200'
 */
export type TUpYunWH = `${number}x${number}`;

/**
 * 裁剪/画布：宽x高aXaY，例如 '300x200a80a60'
 */
export type TUpYunWxHxAxAy = `${number}x${number}a${number}a${number}`;

/**
 * 高斯模糊：半径x标准差，例如 '5x2'
 */
export type TUpYunRadiusXSigma = `${number}x${number}`;

/**
 * 渐变起止位置：起点,终点 像素，例如 '10,100'
 */
export type TUpYunStartEndPos = `${number},${number}`;

/**
 * 偏移：XxY，例如 '20x20'
 */
export type TUpYunXxYMargin = `${number}x${number}`;

/**
 * 画布矩形：宽x高aXaY，例如 '600x400a50a20'
 */
export type TUpYunCanvasRect = `${number}x${number}a${number}a${number}`;

/**
 * UpYun 构建器实例接口
 * - 方法以分组前缀命名（size/crop/wm/tf/border/canvas/info/out/color/grad/core）
 * - 注释基于 UpYun 文档（https://docs.upyun.com/cloud/image/）
 */
export interface IUpYunBuilder {
  /**
   * 限定宽度，高度自适应
   * - 参数：/fw/\<width\>
   * @param {number} w 宽度
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeWidth(w: number): IUpYunBuilder;

  /**
   * 限定高度，宽度自适应
   * - 参数：/fh/\<height\>
   * @param {number} h 高度
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeHeight(h: number): IUpYunBuilder;

  /**
   * 限定最长边，短边自适应
   * - 参数：/max/\<max\>
   * @param {number} v 最长边
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeMaxEdge(v: number): IUpYunBuilder;

  /**
   * 限定最短边，长边自适应
   * - 参数：/min/\<min\>
   * @param {number} v 最短边
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeMinEdge(v: number): IUpYunBuilder;

  /**
   * 限定宽或高，不足不缩放
   * - 参数：/fwfh/\<w\>x\<h\>
   * @param {number} w 宽
   * @param {number} h 高
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeFitWithin(w: number, h: number): IUpYunBuilder;

  /**
   * 限定宽最小与高最小，不足不缩放
   * - 参数：/fwfh2/\<w\>x\<h\>
   * @param {number} w 宽
   * @param {number} h 高
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeMinDimensions(w: number, h: number): IUpYunBuilder;

  /**
   * 固定宽高，不足时居中裁剪再缩放
   * - 参数：/both/\<w\>x\<h\>
   * @param {number} w 宽
   * @param {number} h 高
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeCover(w: number, h: number): IUpYunBuilder;

  /**
   * 缩放成正方形，宽高相等
   * - 参数：/sq/\<w\>
   * @param {number} w 边长
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeSquare(w: number): IUpYunBuilder;

  /**
   * 宽高等比缩放（百分比）
   * - 参数：/scale/\<scale>（1-1000\）
   * @param {number} v 比例
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeScalePercent(v: number): IUpYunBuilder;

  /**
   * 宽度按比例缩放，高度不变
   * - 参数：/wscale/\<wscale>（1-1000\）
   * @param {number} v 比例
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeScaleWidthPercent(v: number): IUpYunBuilder;

  /**
   * 高度按比例缩放，宽度不变
   * - 参数：/hscale/\<hscale>（1-1000\）
   * @param {number} v 比例
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeScaleHeightPercent(v: number): IUpYunBuilder;

  /**
   * 按长边x短边限定（等比缩放，不裁剪）
   * - 参数：/fxfn/\<max\>x\<min\>
   * @param {number} max 长边
   * @param {number} min 短边
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeByLongShort(max: number, min: number): IUpYunBuilder;

  /**
   * 限定长边最小与短边最小（等比缩放，不裁剪）
   * - 参数：/fxfn2/\<max\>x\<min\>
   * @param {number} max 长边最小
   * @param {number} min 短边最小
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeMinByLongShort(max: number, min: number): IUpYunBuilder;

  /**
   * 宽高像素积约束（等比缩放，接近给定值）
   * - 参数：/fp/\<integer>（1-25000000\）
   * @param {number} area 目标像素积
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizePixelArea(area: number): IUpYunBuilder;

  /**
   * 允许放大（默认 false）
   * - 参数：/force/\<boolean\>
   * @param {boolean} on 是否允许放大
   * @returns {IUpYunBuilder} 构建器实例
   */
  sizeAllowEnlarge(on?: boolean): IUpYunBuilder;

  /**
   * 缩放前裁剪
   * - 参数：/crop/\<w\>x\<h>a<x>a<y\>
   * @param {number} w 宽
   * @param {number} h 高
   * @param {number} ax X 偏移（a/s 逻辑见文档）
   * @param {number} ay Y 偏移（a/s 逻辑见文档）
   * @returns {IUpYunBuilder} 构建器实例
   */
  cropBefore(w: number, h: number, ax: number, ay: number): IUpYunBuilder;

  /**
   * 缩放后裁剪
   * - 参数：/clip/\<w\>x\<h>a<x>a<y\>
   * @param {number} w 宽
   * @param {number} h 高
   * @param {number} ax X 偏移
   * @param {number} ay Y 偏移
   * @returns {IUpYunBuilder} 构建器实例
   */
  cropAfter(w: number, h: number, ax: number, ay: number): IUpYunBuilder;

  /**
   * 裁剪起始方位（需在 crop/clip 后）
   * - 参数：/gravity/\<gravity\>
   * @param {TUpYunGravity} pos 方位（默认 northwest）
   * @returns {IUpYunBuilder} 构建器实例
   */
  cropGravity(pos?: TUpYunGravity): IUpYunBuilder;

  /**
   * 圆角裁剪半径
   * - 参数：/roundrect/\<roundrect\>
   * @param {number} r 半径（默认 10）
   * @returns {IUpYunBuilder} 构建器实例
   */
  cropRoundRect(r?: number): IUpYunBuilder;

  /**
   * 图片水印（图片 URL 需 Base64，且将 '/' 替换为 '|'）
   * - 参数顺序：url -> align -> margin -> opacity -> percent -> repeat -> animate
   * - 参数：/watermark/url/\<Base64(url)\>
   * @param {string} base64Url Base64(URL)，'/' 已替换为 '|'
   * @param {{align?:TUpYunGravity; margin?:TUpYunXxYMargin; opacity?:number; percent?:number; repeat?:boolean; animate?:boolean}} opts 选项
   * @returns {IUpYunBuilder} 构建器实例
   */
  wmImage(
    base64Url: string,
    opts?: {
      align?: TUpYunGravity;
      margin?: TUpYunXxYMargin;
      opacity?: number;
      percent?: number;
      repeat?: boolean;
      animate?: boolean;
    }
  ): IUpYunBuilder;

  /**
   * 文字水印（文字需 Base64，且将 '/' 替换为 '|'）
   * - 参数顺序：text -> align -> margin -> opacity -> percent -> repeat -> animate -> size -> font -> color -> border
   * - 参数：/watermark/text/\<Base64(text)\>
   * @param {string} base64Text Base64(文本)，'/' 已替换为 '|'
   * @param {{align?:TUpYunGravity;margin?:TUpYunXxYMargin;opacity?:number;percent?:number;repeat?:boolean;animate?:boolean;size?:number;font?:TUpYunFont;color?:string;border?:string}} opts 选项
   * @returns {IUpYunBuilder} 构建器实例
   */
  wmText(
    base64Text: string,
    opts?: {
      align?: TUpYunGravity;
      margin?: TUpYunXxYMargin;
      opacity?: number;
      percent?: number;
      repeat?: boolean;
      animate?: boolean;
      size?: number;
      font?: TUpYunFont;
      color?: string;
      border?: string;
    }
  ): IUpYunBuilder;

  /**
   * 旋转
   * - 参数：/rotate/\<auto|angle\>
   * @param {'auto'|number} v auto 或 1-360
   * @returns {IUpYunBuilder} 构建器实例
   */
  tfRotate(v: 'auto' | number): IUpYunBuilder;

  /**
   * 翻转
   * - 参数：/flip/\<left,right|top,down\>
   * @param {TUpYunFlip} v 翻转方向
   * @returns {IUpYunBuilder} 构建器实例
   */
  tfFlip(v: TUpYunFlip): IUpYunBuilder;

  /**
   * 锐化（默认 false）
   * - 参数：/unsharp/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  tfSharpen(on?: boolean): IUpYunBuilder;

  /**
   * 高斯模糊
   * - 参数：/gaussblur/\<radius\>x\<sigma\>
   * @param {number} radius 半径（0-50）
   * @param {number} sigma 标准差（>0）
   * @returns {IUpYunBuilder} 构建器实例
   */
  tfGaussBlur(radius: number, sigma: number): IUpYunBuilder;

  /**
   * 边框尺寸
   * - 参数：/border/\<w\>x\<h\>
   * @param {number} w 左右边框宽度
   * @param {number} h 上下边框宽度
   * @returns {IUpYunBuilder} 构建器实例
   */
  borderSize(w: number, h: number): IUpYunBuilder;

  /**
   * 边框颜色与透明度（默认 FFFFFF00）
   * - 参数：/brdcolor/\<RRGGBBAA\>
   * @param {string} v RRGGBBAA
   * @returns {IUpYunBuilder} 构建器实例
   */
  borderColor(v?: string): IUpYunBuilder;

  /**
   * 画布尺寸
   * - 参数：/canvas/\<w\>x\<h>a<x>a<y\>
   * @param {number} w 画布宽
   * @param {number} h 画布高
   * @param {number} ax 图左上角 X
   * @param {number} ay 图左上角 Y
   * @returns {IUpYunBuilder} 构建器实例
   */
  canvasRect(w: number, h: number, ax: number, ay: number): IUpYunBuilder;

  /**
   * 画布颜色与透明度（默认 FFFFFF00）
   * - 参数：/cvscolor/\<RRGGBBAA\>
   * @param {string} v RRGGBBAA
   * @returns {IUpYunBuilder} 构建器实例
   */
  canvasColor(v?: string): IUpYunBuilder;

  /**
   * 获取基本信息
   * - 参数：/info
   * @param {boolean} on 是否获取
   * @returns {IUpYunBuilder} 构建器实例
   */
  infoBasic(on?: boolean): IUpYunBuilder;

  /**
   * 获取 EXIF + 基本信息
   * - 参数：/meta
   * @param {boolean} on 是否获取
   * @returns {IUpYunBuilder} 构建器实例
   */
  infoMeta(on?: boolean): IUpYunBuilder;

  /**
   * 获取 IPTC + 基本信息
   * - 参数：/meta/iptc
   * @param {boolean} on 是否获取
   * @returns {IUpYunBuilder} 构建器实例
   */
  infoMetaIptc(on?: boolean): IUpYunBuilder;

  /**
   * 获取所有信息（EXIF+IPTC+基本信息）
   * - 参数：/meta/all
   * @param {boolean} on 是否获取
   * @returns {IUpYunBuilder} 构建器实例
   */
  infoMetaAll(on?: boolean): IUpYunBuilder;

  /**
   * 输出格式
   * - 参数：/format/\<format\>
   * @param {TUpYunFormat} fmt jpg|png|webp
   * @returns {IUpYunBuilder} 构建器实例
   */
  outFormat(fmt: TUpYunFormat): IUpYunBuilder;

  /**
   * 压缩质量
   * - 参数：/quality/\<1-99\>
   * @param {number} q 质量（常用 75）
   * @returns {IUpYunBuilder} 构建器实例
   */
  outQuality(q: number): IUpYunBuilder;

  /**
   * WebP 无损（默认 false）
   * - 参数：/lossless/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  outLossless(on?: boolean): IUpYunBuilder;

  /**
   * JPG/PNG 压缩优化（默认 false）
   * - 参数：/compress/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  outCompress(on?: boolean): IUpYunBuilder;

  /**
   * GIF 共同部分填充（默认 true）
   * - 参数：/coalesce/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  outCoalesce(on?: boolean): IUpYunBuilder;

  /**
   * JPG 渐进式
   * - 参数：/progressive/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  outProgressive(on?: boolean): IUpYunBuilder;

  /**
   * 清除 ICC（默认 false）
   * - 参数：/noicc/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  outNoIcc(on?: boolean): IUpYunBuilder;

  /**
   * 去除元信息（默认 false）
   * - 参数：/strip/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  outStrip(on?: boolean): IUpYunBuilder;

  /**
   * GIF 转单帧（默认 false）
   * - 参数：/gifto/\<boolean\>
   * @param {boolean} on 是否启用
   * @returns {IUpYunBuilder} 构建器实例
   */
  outGifToSingle(on?: boolean): IUpYunBuilder;

  /**
   * 保留 EXIF（默认 false）
   * - 参数：/exifswitch/\<boolean\>
   * @param {boolean} on 是否保留
   * @returns {IUpYunBuilder} 构建器实例
   */
  outExifKeep(on?: boolean): IUpYunBuilder;

  /**
   * 忽略错误返回原图（默认 false）
   * - 参数：/ignore-error/\<boolean\>
   * @param {boolean} on 是否启用（仅对 405/409/503 有效）
   * @returns {IUpYunBuilder} 构建器实例
   */
  outIgnoreError(on?: boolean): IUpYunBuilder;

  /**
   * 主题色数量
   * - 参数：/excolor/\<1-4096\>
   * @param {number} n 数量
   * @returns {IUpYunBuilder} 构建器实例
   */
  colorExtract(n: number): IUpYunBuilder;

  /**
   * 主题色进制（默认 dec）
   * - 参数：/exformat/\<dec|hex\>
   * @param {TUpYunExformat} v 进制
   * @returns {IUpYunBuilder} 构建器实例
   */
  colorFormat(v?: TUpYunExformat): IUpYunBuilder;

  /**
   * 渐变方向
   * - 参数：/gdori/\<orientation\>
   * @param {TUpYunGradientOrientation} v 方向
   * @returns {IUpYunBuilder} 构建器实例
   */
  gradOrientation(v: TUpYunGradientOrientation): IUpYunBuilder;

  /**
   * 渐变起止像素位置
   * - 参数：/gdpos/\<start,end\>
   * @param {number} start 起点
   * @param {number} end 终点
   * @returns {IUpYunBuilder} 构建器实例
   */
  gradPositions(start: number, end: number): IUpYunBuilder;

  /**
   * 渐变起始颜色
   * - 参数：/gdstartcolor/\<RRGGBBAA\>
   * @param {string} v 颜色
   * @returns {IUpYunBuilder} 构建器实例
   */
  gradStartColor(v: string): IUpYunBuilder;

  /**
   * 渐变结束颜色
   * - 参数：/gdstopcolor/\<RRGGBBAA\>
   * @param {string} v 颜色
   * @returns {IUpYunBuilder} 构建器实例
   */
  gradStopColor(v: string): IUpYunBuilder;

  /**
   * 设置分隔符（默认 '!'）
   * - 无 URL 片段
   * @param {TUpYunSeparator} sep 分隔符
   * @returns {IUpYunBuilder} 构建器实例
   */
  separator(sep: TUpYunSeparator): IUpYunBuilder;

  /**
   * 设置基础 URL（默认取 Store files）
   * - 无 URL 片段
   * @param {string} url 基础 URL
   * @returns {IUpYunBuilder} 构建器实例
   */
  baseURL(url: string): IUpYunBuilder;

  /**
   * 通用键值（含连字符与斜杠）
   * - 按原样映射
   * @param {string} key 键
   * @param {unknown} value 值
   * @returns {IUpYunBuilder} 构建器实例
   */
  set(key: string, value: unknown): IUpYunBuilder;

  /**
   * 获取片段数组
   * @returns {string[]} 片段数组
   */
  segments(): string[];

  /**
   * 获取完整路径（仅片段部分）
   * @returns {string} 规则片段
   */
  toString(): string;

  /**
   * 根据 src 与 baseURL 构造最终 URL
   * @param {string} src 图片路径
   * @returns {{url:string}} 构造结果
   */
  build(src: string): { url: string };

  /**
   * 重置所有已设置的操作
   * @returns {IUpYunBuilder} 构建器实例
   */
  reset(): IUpYunBuilder;
}
