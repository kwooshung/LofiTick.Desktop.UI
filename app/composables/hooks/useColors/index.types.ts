/**
 * 类型：颜色色阶
 * - 与 tailwind 默认色阶保持一致
 */
export type TColorShades = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * 类型：useColors 色阶入参
 * - 支持传入单个色阶或色阶数组
 */
export type TUseColorsShadesInput = TColorShades | TColorShades[];

/**
 * 类型：颜色前缀
 * - 背景色使用 "bg"，文字色使用 "text"
 */
export type TUseColorsPrefix = 'bg' | 'text';

/**
 * 类型：Tailwind 颜色对象映射
 * - 用于按 key 安全读取 colors 的值
 */
export type TTailwindColorsMap = Record<string, unknown>;

/**
 * 类型：颜色解析结果
 */
export type TUseColorsResolvedColors = {
  /**
   * 带色阶的颜色名称列表
   */
  shadedNames: string[];

  /**
   * 不带色阶的颜色名称列表
   * - 仅允许生成 black / white
   */
  plainNames: string[];

  /**
   * 色阶列表
   */
  shades: TColorShades[];
};

/**
 * 类型：颜色名称集合
 */
export type TUseColorsNames = {
  /**
   * 亮色模式下的颜色名称列表
   */
  light: string[];

  /**
   * 暗色模式下的颜色名称列表
   */
  dark: string[];

  /**
   * 亮色 + 暗色的颜色名称列表
   */
  all: string[];
};

/**
 * 类型：色阶集合
 */
export type TUseColorsShades = {
  /**
   * 亮色模式下的色阶列表
   */
  light: TColorShades[];

  /**
   * 暗色模式下的色阶列表
   */
  dark: TColorShades[];

  /**
   * 亮色 + 暗色的色阶列表
   */
  all: TColorShades[];
};

/**
 * 类型：useColors 返回结果
 */
export type TUseColorsResult = {
  /**
   * 颜色名称集合
   */
  names: TUseColorsNames;

  /**
   * 色阶集合
   */
  shades: TUseColorsShades;

  /**
   * 颜色 class 名称列表
   */
  classNames: string[];
};
