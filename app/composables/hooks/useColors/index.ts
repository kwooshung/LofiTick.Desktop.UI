import { uniq } from 'es-toolkit/array';
import colors from 'tailwindcss/colors';

/**
 * 常量：默认色阶列表
 */
const COLOR_SHADES_DEFAULT: TColorShades[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * 常量：允许生成的不带色阶颜色
 */
const COLOR_NAMES_PLAIN_ALLOWED: string[] = ['black', 'white'];

/**
 * 常量：补齐的 tailwind 官方颜色名称列表
 */
const COLOR_NAMES_TAILWIND_OFFICIAL_EXTRA: string[] = ['old-neutral'];

/**
 * 常量：tailwind 官方颜色名称列表
 */
const COLOR_NAMES_TAILWIND_OFFICIAL: string[] = uniq([...Object.keys(colors), ...COLOR_NAMES_TAILWIND_OFFICIAL_EXTRA]);

/**
 * 常量：tailwind 官方颜色名称集合
 */
const COLOR_NAME_SET_TAILWIND_OFFICIAL = new Set<string>(COLOR_NAMES_TAILWIND_OFFICIAL);

/**
 * 常量：空的颜色解析结果
 */
const COLORS_RESOLVED_EMPTY: TUseColorsResolvedColors = {
  shadedNames: [],
  plainNames: [],
  shades: []
};

/**
 * 函数：规范化颜色名称列表
 * - 去除空白、转小写、去重
 * @param {string | string[]} newColor 新颜色名称或名称列表
 * @return {string[]} 规范化后的颜色名称列表
 */
const normalizeColorNames = (newColor: string | string[]): string[] => {
  /**
   * 常量：原始颜色名称列表
   */
  const colorNames = Array.isArray(newColor) ? newColor : [newColor];

  /**
   * 常量：去重后的颜色名称集合
   */
  const colorNameSet = new Set<string>();

  /**
   * 常量：最终颜色名称列表
   */
  const resolvedColorNames: string[] = [];

  colorNames.forEach((colorName) => {
    const resolvedColorName = colorName.trim().toLowerCase();

    // 空值直接忽略
    if (!resolvedColorName) {
      return;
    }

    // 去重
    if (colorNameSet.has(resolvedColorName)) {
      return;
    }

    colorNameSet.add(resolvedColorName);
    resolvedColorNames.push(resolvedColorName);
  });

  return resolvedColorNames;
};

/**
 * 函数：数字数组去重并升序排序
 * @template T 数字类型
 * @param {T[]} list 原始数字数组
 * @return {T[]} 去重且升序后的数字数组
 */
const numberArrayUniqueSortAsc = <T extends number>(list: T[]): T[] => {
  /**
   * 常量：去重后的数组
   */
  const uniqueList = uniq(list);

  return uniqueList.sort((a, b) => a - b);
};

/**
 * 函数：规范化色阶入参
 * - 支持传入单个色阶或色阶数组
 * @param {TUseColorsShadesInput} shades 色阶入参
 * @return {TColorShades[]} 规范化后的色阶数组
 */
const normalizeColorShades = (shades: TUseColorsShadesInput): TColorShades[] => {
  // 已经是数组则直接返回
  if (Array.isArray(shades)) {
    return numberArrayUniqueSortAsc(shades);
  }

  return [shades];
};

/**
 * 函数：生成颜色数组
 * @param {string | string[]} newColor 新颜色名称或名称列表
 * @param {TColorShades[]} shades 模式下的色阶列表
 * @return {TUseColorsResolvedColors} 颜色解析结果
 */
const generateColorArray = (newColor: string | string[], shades: TColorShades[]): TUseColorsResolvedColors => {
  /**
   * 常量：最终色阶列表
   */
  const resolvedShades = shades.length > 0 ? shades : COLOR_SHADES_DEFAULT;

  /**
   * 常量：用户指定的颜色名称列表
   */
  const resolvedNewColors = normalizeColorNames(newColor);

  /**
   * 常量：最终参与解析的颜色名称列表
   * - 始终包含 tailwind 官方颜色
   * - 合并自定义颜色（不要求存在于 tailwindcss/colors）
   */
  const resolvedNames = uniq([...COLOR_NAMES_TAILWIND_OFFICIAL, ...resolvedNewColors]);

  /**
   * 常量：带色阶的颜色名称列表
   */
  const shadedNames: string[] = [];

  /**
   * 常量：不带色阶的颜色名称列表
   */
  const plainNames: string[] = [];

  resolvedNames.forEach((colorName) => {
    // 补齐的官方颜色：默认按"带色阶颜色"处理
    if (COLOR_NAMES_TAILWIND_OFFICIAL_EXTRA.includes(colorName)) {
      shadedNames.push(colorName);
      return;
    }

    // 自定义扩展颜色：默认按"带色阶颜色"处理
    if (!COLOR_NAME_SET_TAILWIND_OFFICIAL.has(colorName)) {
      shadedNames.push(colorName);

      return;
    }

    const colorValue = (colors as TTailwindColorsMap)[colorName];

    if (typeof colorValue === 'object' && colorValue !== null) {
      shadedNames.push(colorName);

      return;
    }

    if (COLOR_NAMES_PLAIN_ALLOWED.includes(colorName)) {
      plainNames.push(colorName);
    }
  });

  return {
    shadedNames,
    plainNames,
    shades: resolvedShades
  };
};

/**
 * Hook：按需求获取颜色列表
 * @param {TUseColorsPrefix} prefix 颜色前缀，背景色使用 'bg'，文字色使用 'text'
 * @param {string | string[]} [newColors = []] 新颜色名称或名称列表
 * @param {TUseColorsShadesInput} [shades = []] 模式下的色阶列表
 * @param {TUseColorsShadesInput} [darkShades = []] 深色模式下的色阶列表
 * @return {TUseColorsResult} 颜色解析结果
 */
export const useColors = (prefix: TUseColorsPrefix, newColors: string | string[] = [], shades: TUseColorsShadesInput = [], darkShades: TUseColorsShadesInput = []): TUseColorsResult => {
  /**
   * 常量：亮色调
   */
  const lightColors = generateColorArray(newColors, normalizeColorShades(shades));

  /**
   * 常量：暗色调色阶列表
   */
  const resolvedDarkShades = normalizeColorShades(darkShades);

  /**
   * 常量：暗色调
   */
  const darkColors = resolvedDarkShades.length > 0 ? generateColorArray(newColors, resolvedDarkShades) : COLORS_RESOLVED_EMPTY;

  /**
   * 常量：最终颜色类名称数组
   */
  const colorClasses: string[] = [];

  /**
   * 常量：亮色调颜色名称列表
   */
  const lightNames: string[] = [...lightColors.shadedNames, ...lightColors.plainNames];

  /**
   * 常量：暗色调颜色名称列表
   */
  const darkNames: string[] = [...darkColors.shadedNames, ...darkColors.plainNames];

  /**
   * 常量：亮色 + 暗色颜色名称列表
   */
  const allNames: string[] = [...lightNames, ...darkNames];

  /**
   * 常量：亮色 + 暗色色阶列表
   */
  const allShades: TColorShades[] = [...lightColors.shades, ...darkColors.shades];

  lightColors.shadedNames.forEach((color) => {
    // 自定义扩展颜色：强制使用完整默认色阶（无关 shades 设置）
    const resolvedLightShadesByColor = COLOR_NAME_SET_TAILWIND_OFFICIAL.has(color) ? lightColors.shades : COLOR_SHADES_DEFAULT;

    resolvedLightShadesByColor.forEach((shade) => {
      colorClasses.push(`${prefix}-${color}-${shade}`);
    });
  });

  lightColors.plainNames.forEach((color) => {
    colorClasses.push(`${prefix}-${color}`);
  });

  // 生成暗色调颜色类名称
  if (darkColors.shadedNames.length > 0) {
    darkColors.shadedNames.forEach((color) => {
      // 自定义扩展颜色：强制使用完整默认色阶（无关 darkShades 设置）
      const resolvedDarkShadesByColor = COLOR_NAME_SET_TAILWIND_OFFICIAL.has(color) ? darkColors.shades : COLOR_SHADES_DEFAULT;

      resolvedDarkShadesByColor.forEach((shade) => {
        colorClasses.push(`dark:${prefix}-${color}-${shade}`);
      });
    });
  }

  if (darkColors.plainNames.length > 0) {
    darkColors.plainNames.forEach((color) => {
      colorClasses.push(`dark:${prefix}-${color}`);
    });
  }

  /**
   * 常量：去重后的颜色名称集合
   */
  const resolvedLightNames = uniq(lightNames);
  const resolvedDarkNames = uniq(darkNames);
  const resolvedAllNames = uniq(allNames);

  /**
   * 常量：去重后的色阶集合
   */
  const resolvedLightShades = numberArrayUniqueSortAsc(lightColors.shades);
  const resolvedDarkShadesFinal = numberArrayUniqueSortAsc(darkColors.shades);
  const resolvedAllShades = numberArrayUniqueSortAsc(allShades);

  /**
   * 常量：去重后的 class 名称列表
   */
  const resolvedClassNames = uniq(colorClasses);

  return {
    names: {
      light: resolvedLightNames,
      dark: resolvedDarkNames,
      all: resolvedAllNames
    },
    shades: {
      light: resolvedLightShades,
      dark: resolvedDarkShadesFinal,
      all: resolvedAllShades
    },
    classNames: resolvedClassNames
  };
};
