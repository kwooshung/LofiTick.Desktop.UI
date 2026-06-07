import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { en } from '@@/i18n/locales/en';
import { ja } from '@@/i18n/locales/ja';
import { zhCn } from '@@/i18n/locales/zh-cn';
import { zhTw } from '@@/i18n/locales/zh-tw';
import { createLogger } from '@@/scripts/common/console';

/**
 * 常量：需要扫描的源码目录。
 */
const SCAN_DIRECTORIES = ['app', 'shared', 'server', 'i18n', 'configs'] as const;

/**
 * 常量：需要纳入扫描的文件扩展名。
 */
const SCAN_EXTENSIONS = new Set(['.vue', '.ts', '.js', '.mts', '.mjs']);

/**
 * 常量：需要跳过的目录。
 */
const SKIP_DIRECTORIES = new Set(['node_modules', '.nuxt', '.output', 'dist', '.git']);

/**
 * 常量：已知的动态前缀。
 * 描述：这些 key 会通过模板字符串、日志消息映射等方式动态拼接，不能按普通静态文本误判为未使用。
 */
const KNOWN_DYNAMIC_PREFIXES = ['components.hotsearch.platform.', 'components.quotes.search.types.', 'components.sentinel.scenes.card.logsMeta.'] as const;

/**
 * 常量：普通精确 key 调用匹配。
 */
const EXACT_KEY_REGEX = /\b(?:t|te|\$t|\$te)\(\s*["'`]([^"'`]+)["'`]/g;

/**
 * 常量：tm 子树调用匹配。
 */
const TREE_KEY_REGEX = /\b(?:tm|\$tm)\(\s*["'`]([^"'`]+)["'`]/g;

/**
 * 常量：模板字符串前缀调用匹配。
 */
const TEMPLATE_PREFIX_REGEX = /\b(?:t|te|\$t|\$te)\(\s*`([^`$]+)\$\{/g;

/**
 * 常量：i18nKey 属性匹配。
 */
const I18N_KEY_REGEX = /\bi18nKey\s*:\s*["'`]([^"'`]+)["'`]/g;

/**
 * 常量：带本地兜底的可选 key 匹配。
 * 描述：`te('key') ? t('key') : 'fallback'` 这类写法本身已经提供了本地兜底，不应再作为缺失阻塞项。
 */
const OPTIONAL_FALLBACK_KEY_REGEX = /\b(?:te|\$te)\(\s*["'`]([^"'`]+)["'`]\s*\)\s*\?\s*(?:t|\$t)\(\s*["'`][^"'`]+["'`][^)]*\)\s*:/g;

/**
 * 函数：转义正则特殊字符。
 * @param {string} value 原始文本。
 * @returns {string} 可安全放入正则的文本。
 */
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 常量：已知动态前缀下的字面量 key 匹配。
 */
const KNOWN_DYNAMIC_LITERAL_REGEX = new RegExp(String.raw`['"\`](${KNOWN_DYNAMIC_PREFIXES.map((item) => escapeRegex(item)).join('|')})[^'"\`]*['"\`]`, 'g');

/**
 * 类型：审计结果。
 */
interface II18nAuditResult {
  /**
   * 缺失于简中的 key。
   */
  missingInZhCn: string[];

  /**
   * 简中里未命中的 key。
   */
  unusedInZhCn: string[];

  /**
   * 英文缺失的 key。
   */
  missingInEn: string[];

  /**
   * 日文缺失的 key。
   */
  missingInJa: string[];

  /**
   * 繁中缺失的 key。
   */
  missingInZhTw: string[];

  /**
   * 英文多出的 key。
   */
  extraInEn: string[];

  /**
   * 日文多出的 key。
   */
  extraInJa: string[];

  /**
   * 繁中多出的 key。
   */
  extraInZhTw: string[];
}

/**
 * 类型：使用痕迹索引。
 */
interface II18nUsageIndex {
  /**
   * 精确命中的 key。
   */
  exact: Map<string, Set<string>>;

  /**
   * 带本地兜底的可选 key。
   */
  optional: Set<string>;

  /**
   * 子树前缀命中的 key。
   */
  tree: Map<string, Set<string>>;
}

/**
 * 常量：日志工具。
 */
const logger = createLogger('[i18n-audit]');

/**
 * 函数：归一化文案 key。
 * @param {string} value 原始文本。
 * @returns {string} 归一化后的 key。
 */
const normalizeKey = (value: string): string => value.trim();

/**
 * 函数：判断 key 是否符合 i18n 文案路径格式。
 * @param {string} value 原始文本。
 * @returns {boolean} 是否为文案 key。
 */
const isI18nKeyLike = (value: string): boolean => {
  return !value.includes('${') && /^[a-z]+[\w.-]*$/i.test(value);
};

/**
 * 函数：将路径转为项目相对路径。
 * @param {string} filePath 文件绝对路径。
 * @returns {string} 相对路径。
 */
const toRelativePath = (filePath: string): string => {
  return path.relative(process.cwd(), filePath).replaceAll('\\', '/');
};

/**
 * 函数：递归收集目录内源码文件。
 * @param {string} directory 目录绝对路径。
 * @param {string[]} results 收集结果。
 * @returns {string[]} 文件列表。
 */
const collectSourceFiles = (directory: string, results: string[] = []): string[] => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (SKIP_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, results);
      continue;
    }

    if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }

  return results;
};

/**
 * 函数：扁平化 locale 对象。
 * @param {unknown} value 当前值。
 * @param {string} prefix 当前前缀。
 * @param {string[]} results 收集结果。
 * @returns {string[]} 扁平 key 列表。
 */
const flattenLocaleKeys = (value: unknown, prefix = '', results: string[] = []): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    if (prefix) {
      results.push(normalizeKey(prefix));
    }
    return results;
  }

  for (const [key, nextValue] of Object.entries(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (nextValue && typeof nextValue === 'object' && !Array.isArray(nextValue)) {
      flattenLocaleKeys(nextValue, nextPrefix, results);
      continue;
    }

    results.push(normalizeKey(nextPrefix));
  }

  return results;
};

/**
 * 函数：向使用索引写入一条记录。
 * @param {Map<string, Set<string>>} target 目标索引。
 * @param {string} key 文案 key 或前缀。
 * @param {string} file 文件相对路径。
 * @returns {void} 无返回值。
 */
const usageRecordAdd = (target: Map<string, Set<string>>, key: string, file: string): void => {
  const normalizedKey = normalizeKey(key);
  const next = target.get(normalizedKey) ?? new Set<string>();
  next.add(file);
  target.set(normalizedKey, next);
};

/**
 * 函数：扫描源码里的文案使用情况。
 * @returns {II18nUsageIndex} 使用索引。
 */
const scanI18nUsages = (): II18nUsageIndex => {
  const usageIndex: II18nUsageIndex = {
    exact: new Map<string, Set<string>>(),
    optional: new Set<string>(),
    tree: new Map<string, Set<string>>()
  };

  for (const directory of SCAN_DIRECTORIES) {
    const fullDirectory = path.join(process.cwd(), directory);
    const files = collectSourceFiles(fullDirectory);

    for (const file of files) {
      const relativePath = toRelativePath(file);
      const source = readFileSync(file, 'utf8');

      for (const match of source.matchAll(EXACT_KEY_REGEX)) {
        const key = normalizeKey(String(match[1] || ''));
        if (isI18nKeyLike(key)) {
          usageRecordAdd(usageIndex.exact, key, relativePath);
        }
      }

      for (const match of source.matchAll(TREE_KEY_REGEX)) {
        const key = normalizeKey(String(match[1] || ''));
        if (isI18nKeyLike(key)) {
          usageRecordAdd(usageIndex.tree, key, relativePath);
        }
      }

      for (const match of source.matchAll(TEMPLATE_PREFIX_REGEX)) {
        const prefix = normalizeKey(String(match[1] || ''));
        if (prefix !== '') {
          usageRecordAdd(usageIndex.tree, prefix, relativePath);
        }
      }

      for (const match of source.matchAll(I18N_KEY_REGEX)) {
        const key = normalizeKey(String(match[1] || ''));
        if (isI18nKeyLike(key)) {
          usageRecordAdd(usageIndex.exact, key, relativePath);
        }
      }

      for (const match of source.matchAll(OPTIONAL_FALLBACK_KEY_REGEX)) {
        const key = normalizeKey(String(match[1] || ''));
        if (isI18nKeyLike(key)) {
          usageIndex.optional.add(key);
        }
      }

      for (const match of source.matchAll(KNOWN_DYNAMIC_LITERAL_REGEX)) {
        const key = normalizeKey(String(match[1] || ''));
        if (isI18nKeyLike(key)) {
          usageRecordAdd(usageIndex.tree, key, relativePath);
        }
      }
    }
  }

  return usageIndex;
};

/**
 * 函数：判断 locale key 是否已在项目中使用。
 * @param {string} key 完整 key。
 * @param {II18nUsageIndex} usageIndex 使用索引。
 * @returns {boolean} 是否已使用。
 */
const localeKeyUsedGet = (key: string, usageIndex: II18nUsageIndex): boolean => {
  if (usageIndex.exact.has(key)) {
    return true;
  }

  for (const prefix of usageIndex.tree.keys()) {
    if (key === prefix || key.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

/**
 * 函数：判断某个使用根节点是否被 locale 覆盖。
 * @param {string} key 使用到的 key 或子树前缀。
 * @param {Set<string>} localeKeySet locale key 集合。
 * @param {string[]} localeKeys locale key 列表。
 * @returns {boolean} 是否已被 locale 覆盖。
 */
const localeCoverageGet = (key: string, localeKeySet: Set<string>, localeKeys: string[]): boolean => {
  return localeKeySet.has(key) || localeKeys.some((localeKey) => localeKey.startsWith(key));
};

/**
 * 函数：构建 i18n 审计结果。
 * @returns {II18nAuditResult} 审计结果。
 */
const buildAuditResult = (): II18nAuditResult => {
  const usageIndex = scanI18nUsages();
  const zhCnKeys = flattenLocaleKeys(zhCn).sort();
  const zhCnKeySet = new Set(zhCnKeys);
  const enKeys = new Set(flattenLocaleKeys(en));
  const jaKeys = new Set(flattenLocaleKeys(ja));
  const zhTwKeys = new Set(flattenLocaleKeys(zhTw));

  const missingExactInZhCn = [...usageIndex.exact.keys()].filter((key) => !zhCnKeySet.has(key) && !usageIndex.optional.has(key)).sort();

  const missingTreeInZhCn = [...usageIndex.tree.keys()].filter((key) => !localeCoverageGet(key, zhCnKeySet, zhCnKeys)).sort();

  return {
    missingInZhCn: [...new Set([...missingExactInZhCn, ...missingTreeInZhCn])],
    unusedInZhCn: zhCnKeys.filter((key) => !localeKeyUsedGet(key, usageIndex)),
    missingInEn: zhCnKeys.filter((key) => !enKeys.has(key)),
    missingInJa: zhCnKeys.filter((key) => !jaKeys.has(key)),
    missingInZhTw: zhCnKeys.filter((key) => !zhTwKeys.has(key)),
    extraInEn: [...enKeys].filter((key) => !zhCnKeys.includes(key)).sort(),
    extraInJa: [...jaKeys].filter((key) => !zhCnKeys.includes(key)).sort(),
    extraInZhTw: [...zhTwKeys].filter((key) => !zhCnKeys.includes(key)).sort()
  };
};

/**
 * 函数：输出审计分组。
 * @param {string} title 标题。
 * @param {string[]} values 数据。
 * @returns {void} 无返回值。
 */
const printSection = (title: string, values: string[]): void => {
  logger.info(`${title}: ${values.length}`);

  for (const value of values.slice(0, 80)) {
    console.log(`- ${value}`);
  }

  if (values.length > 80) {
    console.log(`- ... and ${values.length - 80} more`);
  }
};

/**
 * 函数：执行审计。
 * @returns {void} 无返回值。
 */
const main = (): void => {
  const result = buildAuditResult();

  printSection('Missing in zh-cn', result.missingInZhCn);
  printSection('Unused in zh-cn', result.unusedInZhCn);
  printSection('Missing in en', result.missingInEn);
  printSection('Missing in ja', result.missingInJa);
  printSection('Missing in zh-tw', result.missingInZhTw);
  printSection('Extra in en', result.extraInEn);
  printSection('Extra in ja', result.extraInJa);
  printSection('Extra in zh-tw', result.extraInZhTw);

  const hasBlockingIssue = result.missingInZhCn.length > 0 || result.missingInEn.length > 0 || result.missingInJa.length > 0 || result.missingInZhTw.length > 0 || result.extraInEn.length > 0 || result.extraInJa.length > 0 || result.extraInZhTw.length > 0;

  if (hasBlockingIssue) {
    process.exitCode = 1;
    logger.warn('i18n 审计发现需要处理的缺失或多余 key。');
    return;
  }

  logger.ok('i18n 审计通过。');
};

main();
