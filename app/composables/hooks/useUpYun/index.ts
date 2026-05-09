/**
 * UpYun 可链式构建器（Composable）
 * - 依据 UpYun 文档生成路径段，支持严格顺序与默认值
 * - 适用于在组件或业务逻辑中手工构建处理规则
 * - 参考：https://docs.upyun.com/cloud/image/
 */
import { cleanDoubleSlashes, joinURL, normalizeURL } from 'ufo';

/**
 * 根据 UpYun 规则对 Base64 文本进行标准化：将 '/' 替换为 '|'
 * @param {string} input Base64 文本
 * @returns {string} 处理后的 Base64 文本
 */
const normalizeBase64ForUpYun = (input: string): string => input.split('/').join('|');

/**
 * 将键值对映射到 UpYun 参数片段
 * - 严格处理布尔型参数：根据 true/false 输出对应值
 * - 支持 'meta/iptc'、'meta/all'、'ignore-error' 原生键，同时兼容别名如 metaIptc、metaAll、ignoreError
 * - 支持 watermark/url 与 watermark/text 的 Base64 规范化
 * @param {string} key 修饰符键名（可能含 '/' 或 '-'）
 * @param {unknown} value 键值
 * @returns {string} 形如 '/fw/300' 的路径片段，返回空串表示忽略
 */
const buildUpyunPath = (key: string, value: unknown): string => {
  const vStr = String(value);

  const boolSeg = (name: string, v: unknown): string => {
    if (typeof v === 'boolean') {
      return `/${name}/${v ? 'true' : 'false'}`;
    }
    if (v === undefined || v === null) {
      return '';
    }
    if (v === 1 || v === '1' || v === 'true') {
      return `/${name}/true`;
    }
    if (v === 0 || v === '0' || v === 'false') {
      return `/${name}/false`;
    }
    return '';
  };

  const k = key
    .replace(/^metaIptc$/i, 'meta/iptc')
    .replace(/^metaAll$/i, 'meta/all')
    .replace(/^ignoreError$/i, 'ignore-error')
    .replace(/^watermarkUrl$/i, 'watermark/url')
    .replace(/^watermarkText$/i, 'watermark/text')
    .replace(/^watermarkUrlAlign$/i, 'watermark/align')
    .replace(/^watermarkTextAlign$/i, 'watermark/align')
    .replace(/^watermarkUrlMargin$/i, 'watermark/margin')
    .replace(/^watermarkTextMargin$/i, 'watermark/margin')
    .replace(/^watermarkUrlOpacity$/i, 'watermark/opacity')
    .replace(/^watermarkTextOpacity$/i, 'watermark/opacity')
    .replace(/^watermarkUrlPercent$/i, 'watermark/percent')
    .replace(/^watermarkUrlRepeat$/i, 'watermark/repeat')
    .replace(/^watermarkUrlAnimate$/i, 'watermark/animate')
    .replace(/^watermarkTextSize$/i, 'watermark/size')
    .replace(/^watermarkTextFont$/i, 'watermark/font')
    .replace(/^watermarkTextColor$/i, 'watermark/color')
    .replace(/^watermarkTextBorder$/i, 'watermark/border');

  switch (k) {
    // 缩小&放大
    case 'fw':
    case 'fh':
    case 'max':
    case 'min':
    case 'fwfh':
    case 'fwfh2':
    case 'both':
    case 'sq':
    case 'scale':
    case 'wscale':
    case 'hscale':
    case 'fxfn':
    case 'fxfn2':
    case 'fp':
      return `/${k}/${vStr}`;
    case 'force':
      return boolSeg('force', value);

    // 裁剪
    case 'crop':
    case 'clip':
      return `/${k}/${vStr}`;
    case 'gravity':
      // 需位于 crop/clip 之后
      return `/${k}/${vStr}`;
    case 'roundrect':
      return `/roundrect/${vStr}`;

    // 水印：图片
    case 'watermark/url': {
      if (typeof value !== 'string') {
        return '';
      }
      const norm = normalizeBase64ForUpYun(value);
      return `/watermark/url/${encodeURIComponent(norm)}`;
    }
    case 'watermark/align':
      return `/align/${vStr}`;
    case 'watermark/margin':
      return `/margin/${vStr}`;
    case 'watermark/opacity':
      return `/opacity/${vStr}`;
    case 'watermark/percent':
      return `/percent/${vStr}`;
    case 'watermark/repeat':
      return boolSeg('repeat', value);
    case 'watermark/animate':
      return boolSeg('animate', value);

    // 水印：文字
    case 'watermark/text': {
      if (typeof value !== 'string') {
        return '';
      }
      const norm = normalizeBase64ForUpYun(value);
      return `/watermark/text/${encodeURIComponent(norm)}`;
    }
    case 'watermark/size':
      return `/size/${vStr}`;
    case 'watermark/font':
      return `/font/${vStr}`;
    case 'watermark/color':
      return `/color/${vStr}`;
    case 'watermark/border':
      return `/border/${vStr}`;

    // 旋转 & 翻转 & 锐化 & 高斯模糊
    case 'rotate': {
      if (vStr === 'auto') {
        return '/rotate/auto';
      }
      const n = +vStr;
      if (isFinite(n) && n > 0 && n <= 360) {
        return `/rotate/${n}`;
      }
      return '';
    }
    case 'flip':
      return `/flip/${vStr}`;
    case 'unsharp':
      return boolSeg('unsharp', value);
    case 'gaussblur':
      return `/gaussblur/${vStr}`;

    // 边框
    case 'border':
      return `/border/${vStr}`;
    case 'brdcolor':
      return `/brdcolor/${vStr}`;

    // 画布
    case 'canvas':
      return `/canvas/${vStr}`;
    case 'cvscolor':
      return `/cvscolor/${vStr}`;

    // 属性获取
    case 'info':
      return value ? '/info' : '';
    case 'meta':
      return value ? '/meta' : '';
    case 'meta/iptc':
      return value ? '/meta/iptc' : '';
    case 'meta/all':
      return value ? '/meta/all' : '';

    // 结果输出
    case 'format':
      return `/format/${vStr}`;
    case 'lossless':
      return boolSeg('lossless', value);
    case 'quality':
      return `/quality/${vStr}`;
    case 'compress':
      return boolSeg('compress', value);
    case 'coalesce':
      return boolSeg('coalesce', value);
    case 'progressive':
      return boolSeg('progressive', value);
    case 'noicc':
      return boolSeg('noicc', value);
    case 'strip':
      return boolSeg('strip', value);
    case 'gifto':
      return boolSeg('gifto', value);
    case 'exifswitch':
      return boolSeg('exifswitch', value);
    case 'ignore-error':
      return boolSeg('ignore-error', value);

    // 主题色提取
    case 'excolor':
      return `/excolor/${vStr}`;
    case 'exformat':
      return `/exformat/${vStr}`;

    // 静态图渐变
    case 'gdori':
      return `/gdori/${vStr}`;
    case 'gdpos':
      return `/gdpos/${vStr}`;
    case 'gdstartcolor':
      return `/gdstartcolor/${vStr}`;
    case 'gdstopcolor':
      return `/gdstopcolor/${vStr}`;

    default:
      return '';
  }
};

/**
 * UpYun 构建器实现
 */
class UpYunBuilder implements IUpYunBuilder {
  private _ops: [string, unknown][] = [];
  private _sep: TUpYunSeparator = '!';
  private _baseURL = '';

  private push(key: string, value: unknown): this {
    this._ops.push([key, value]);
    return this;
  }

  private pushBool(key: string, on?: boolean): this {
    const v = on === undefined ? true : on;
    return this.push(key, v);
  }

  // ========== size ==========
  sizeWidth(w: number): IUpYunBuilder {
    return this.push('fw', w);
  }
  sizeHeight(h: number): IUpYunBuilder {
    return this.push('fh', h);
  }
  sizeMaxEdge(v: number): IUpYunBuilder {
    return this.push('max', v);
  }
  sizeMinEdge(v: number): IUpYunBuilder {
    return this.push('min', v);
  }
  sizeFitWithin(w: number, h: number): IUpYunBuilder {
    return this.push('fwfh', `${w}x${h}`);
  }
  sizeMinDimensions(w: number, h: number): IUpYunBuilder {
    return this.push('fwfh2', `${w}x${h}`);
  }
  sizeCover(w: number, h: number): IUpYunBuilder {
    return this.push('both', `${w}x${h}`);
  }
  sizeSquare(w: number): IUpYunBuilder {
    return this.push('sq', w);
  }
  sizeScalePercent(v: number): IUpYunBuilder {
    return this.push('scale', v);
  }
  sizeScaleWidthPercent(v: number): IUpYunBuilder {
    return this.push('wscale', v);
  }
  sizeScaleHeightPercent(v: number): IUpYunBuilder {
    return this.push('hscale', v);
  }
  sizeByLongShort(max: number, min: number): IUpYunBuilder {
    return this.push('fxfn', `${max}x${min}`);
  }
  sizeMinByLongShort(max: number, min: number): IUpYunBuilder {
    return this.push('fxfn2', `${max}x${min}`);
  }
  sizePixelArea(area: number): IUpYunBuilder {
    return this.push('fp', area);
  }
  sizeAllowEnlarge(on: boolean = false): IUpYunBuilder {
    return this.push('force', on);
  }

  // ========== crop ==========
  cropBefore(w: number, h: number, ax: number, ay: number): IUpYunBuilder {
    return this.push('crop', `${w}x${h}a${ax}a${ay}`);
  }
  cropAfter(w: number, h: number, ax: number, ay: number): IUpYunBuilder {
    return this.push('clip', `${w}x${h}a${ax}a${ay}`);
  }
  cropGravity(pos: TUpYunGravity = 'northwest'): IUpYunBuilder {
    return this.push('gravity', pos);
  }
  cropRoundRect(r: number = 10): IUpYunBuilder {
    return this.push('roundrect', r);
  }

  // ========== watermark ==========
  wmImage(base64Url: string, opts?: { align?: TUpYunGravity; margin?: TUpYunXxYMargin; opacity?: number; percent?: number; repeat?: boolean; animate?: boolean }): IUpYunBuilder {
    this.push('watermark/url', base64Url);
    const align = opts?.align ?? 'northwest';
    const margin = opts?.margin ?? '20x20';
    const opacity = opts?.opacity ?? 100;
    const percent = opts?.percent ?? 0;
    const repeat = opts?.repeat ?? false;
    const animate = opts?.animate ?? false;
    this.push('watermark/align', align).push('watermark/margin', margin).push('watermark/opacity', opacity).push('watermark/percent', percent).push('watermark/repeat', repeat).push('watermark/animate', animate);
    return this;
  }

  wmText(base64Text: string, opts?: { align?: TUpYunGravity; margin?: TUpYunXxYMargin; opacity?: number; percent?: number; repeat?: boolean; animate?: boolean; size?: number; font?: TUpYunFont; color?: string; border?: string }): IUpYunBuilder {
    this.push('watermark/text', base64Text);
    const align = opts?.align ?? 'northwest';
    const margin = opts?.margin ?? '20x20';
    const opacity = opts?.opacity ?? 100;
    const percent = opts?.percent ?? 0;
    const repeat = opts?.repeat ?? false;
    const animate = opts?.animate ?? false;
    const size = opts?.size ?? 32;
    const font = opts?.font ?? 'simsun';
    const color = opts?.color ?? '000000';
    const border = opts?.border ?? 'FFFFFFFF';
    this.push('watermark/align', align)
      .push('watermark/margin', margin)
      .push('watermark/opacity', opacity)
      .push('watermark/percent', percent)
      .push('watermark/repeat', repeat)
      .push('watermark/animate', animate)
      .push('watermark/size', size)
      .push('watermark/font', font)
      .push('watermark/color', color)
      .push('watermark/border', border);
    return this;
  }

  // ========== transform ==========
  tfRotate(v: 'auto' | number): IUpYunBuilder {
    return this.push('rotate', v);
  }
  tfFlip(v: TUpYunFlip): IUpYunBuilder {
    return this.push('flip', v);
  }
  tfSharpen(on: boolean = false): IUpYunBuilder {
    return this.push('unsharp', on);
  }
  tfGaussBlur(radius: number, sigma: number): IUpYunBuilder {
    return this.push('gaussblur', `${radius}x${sigma}`);
  }

  // ========== border ==========
  borderSize(w: number, h: number): IUpYunBuilder {
    return this.push('border', `${w}x${h}`);
  }
  borderColor(v: string = 'FFFFFF00'): IUpYunBuilder {
    return this.push('brdcolor', v);
  }

  // ========== canvas ==========
  canvasRect(w: number, h: number, ax: number, ay: number): IUpYunBuilder {
    return this.push('canvas', `${w}x${h}a${ax}a${ay}`);
  }
  canvasColor(v: string = 'FFFFFF00'): IUpYunBuilder {
    return this.push('cvscolor', v);
  }

  // ========== info ==========
  infoBasic(on?: boolean): IUpYunBuilder {
    return this.pushBool('info', on);
  }
  infoMeta(on?: boolean): IUpYunBuilder {
    return this.pushBool('meta', on);
  }
  infoMetaIptc(on?: boolean): IUpYunBuilder {
    return this.pushBool('meta/iptc', on);
  }
  infoMetaAll(on?: boolean): IUpYunBuilder {
    return this.pushBool('meta/all', on);
  }

  // ========== output ==========
  outFormat(fmt: TUpYunFormat): IUpYunBuilder {
    return this.push('format', fmt);
  }
  outQuality(q: number): IUpYunBuilder {
    return this.push('quality', q);
  }
  outLossless(on: boolean = false): IUpYunBuilder {
    return this.push('lossless', on);
  }
  outCompress(on: boolean = false): IUpYunBuilder {
    return this.push('compress', on);
  }
  outCoalesce(on: boolean = true): IUpYunBuilder {
    return this.push('coalesce', on);
  }
  outProgressive(on: boolean = false): IUpYunBuilder {
    return this.push('progressive', on);
  }
  outNoIcc(on: boolean = false): IUpYunBuilder {
    return this.push('noicc', on);
  }
  outStrip(on: boolean = false): IUpYunBuilder {
    return this.push('strip', on);
  }
  outGifToSingle(on: boolean = false): IUpYunBuilder {
    return this.push('gifto', on);
  }
  outExifKeep(on: boolean = false): IUpYunBuilder {
    return this.push('exifswitch', on);
  }
  outIgnoreError(on: boolean = false): IUpYunBuilder {
    return this.push('ignore-error', on);
  }

  // ========== colors ==========
  colorExtract(n: number): IUpYunBuilder {
    return this.push('excolor', n);
  }
  colorFormat(v: TUpYunExformat = 'dec'): IUpYunBuilder {
    return this.push('exformat', v);
  }

  // ========== gradient ==========
  gradOrientation(v: TUpYunGradientOrientation): IUpYunBuilder {
    return this.push('gdori', v);
  }
  gradPositions(start: number, end: number): IUpYunBuilder {
    return this.push('gdpos', `${start},${end}`);
  }
  gradStartColor(v: string): IUpYunBuilder {
    return this.push('gdstartcolor', v);
  }
  gradStopColor(v: string): IUpYunBuilder {
    return this.push('gdstopcolor', v);
  }

  // ========== core ==========
  separator(sep: TUpYunSeparator): IUpYunBuilder {
    this._sep = sep;
    return this;
  }
  baseURL(url: string): IUpYunBuilder {
    this._baseURL = url || '';
    return this;
  }
  set(key: string, value: unknown): IUpYunBuilder {
    return this.push(key, value);
  }
  segments(): string[] {
    const out: string[] = [];
    // gravity 需要位于 crop/clip 后
    let gravitySeg: string | undefined;
    let hasCropOrClip = false;

    for (const [k, v] of this._ops) {
      if (k === 'gravity') {
        gravitySeg = buildUpyunPath('gravity', v);
        continue;
      }
      const seg = buildUpyunPath(k, v);
      if (seg) {
        out.push(seg);
        if (k === 'crop' || k === 'clip') {
          hasCropOrClip = true;
        }
      }
    }
    if (gravitySeg && hasCropOrClip) {
      out.push(gravitySeg);
    }
    return out;
  }
  toString(): string {
    return this.segments().join('');
  }
  build(src: string): { url: string } {
    const path = src.startsWith('/') ? src : `/${src}`;
    const segs = this.toString();
    const resource = segs ? `${path}${this._sep}${segs}` : path;
    return { url: normalizeURL(joinURL(this._baseURL || '', cleanDoubleSlashes(resource))) };
  }
  reset(): IUpYunBuilder {
    this._ops = [];
    this._sep = '!';
    this._baseURL = '';
    return this;
  }
}

/**
 * 创建 UpYun 构建器实例
 * - 默认 baseURL：优先使用 options.baseURL，否则读取 Store `cdnDomains.states.files`（已初始化后）
 * - 默认分隔符：'!'
 */
export const createUpYunBuilder = (options?: { baseURL?: string; separator?: TUpYunSeparator }): IUpYunBuilder => {
  const b = new UpYunBuilder();

  if (options?.separator) {
    b.separator(options.separator);
  }

  const store = useStoreCdnDomains();
  const storeFiles = store.states.files || '';
  const base = options?.baseURL || storeFiles;
  if (base) {
    b.baseURL(base);
  }

  return b;
};

/**
 * Hook：又拍云
 */
export const useUpYun = (options?: { baseURL?: string; separator?: TUpYunSeparator }): IUpYunBuilder => createUpYunBuilder(options);
