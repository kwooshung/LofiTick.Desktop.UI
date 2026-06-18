/**
 * 函数：检测是否包含中文字符（基础范围）
 * @param {string} text 输入字符串
 * @returns {boolean} 包含返回 true，否则 false
 */
export const isChinese = (text: string): boolean => /[\u4e00-\u9fa5]/.test(text);

/**
 * 函数：检测是否包含中文字符（基础范围）
 * - 判断文本是否"主要为中文"（汉字占比 ≥ 90%）
 * - 计算时排除 emoji、标点、空格、数字、字母等干扰字符
 * - 但返回的原文保持完全不变
 * @param {string} text 原文
 * @param {number} [ratio = 0.9] 汉字占比阈值，默认 0.9（90%）
 * @returns {boolean} 是否视为中文（不需要翻译）
 */
export const isPrimarilyChinese = (text: string, ratio = 0.9): boolean => {
  if (!text) {
    return false;
  }

  // 第一步：过滤出用于判断的"纯文本字符"
  // 移除：emoji、标点、空格、数字、字母、常见符号
  const cleanText = text.replace(/[\p{Emoji_Presentation}\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Component}]|[\p{Punctuation}\p{Symbol}]|\s|\d|[a-zA-Z]/gu, '');

  if (cleanText.length === 0) {
    // 清理后为空（纯符号/emoji/英文），肯定不是中文
    return false;
  }

  // 第二步：统计汉字数量（CJK Unified Ideographs + 扩展区）
  const chineseChars = cleanText.match(/[\u4e00-\u9fff]/g) || [];

  // 第三步：汉字占比 ≥ 90%
  const _ratio = chineseChars.length / cleanText.length;
  return _ratio >= ratio;
};

/**
 * 计算字符串长度，英文/其他计 1，汉字按指定权重计（默认每个汉字计 2）
 * @param {string} str 输入字符串
 * @param {number} chineseWeight 汉字权重，默认 2（每个汉字计 2 个字符）
 * @returns {number} 自定义长度
 */
export const chineseCount = (str: string, chineseWeight: number = 2): number => {
  if (typeof str !== 'string') {
    return 0;
  }

  // 计算字符串中汉字的数量
  const chineseMatches = str.match(/[\u4e00-\u9fff]/g) || [];

  // 计算汉字数量
  const chineseCount = chineseMatches.length;

  // 返回总长度：非汉字按 1 计，汉字按指定权重计，之所以 chineseWeight - 1 是因为汉字已经被计入总长度中一次
  return str.length + chineseCount * (chineseWeight - 1);
};

/**
 * 函数：将常见英文标点替换为中文全角标点（不处理引号成对逻辑）
 * - , -> ，
 * - . -> 。
 * - ? -> ？
 * - ! -> ！
 * - ; -> ；
 * - : -> ：
 * - ( ) -> （ ）
 * @param {string} text 输入字符串
 * @returns {string} 替换后的字符串
 */
export const toChinesePunctuation = (text: string): string => {
  if (!text) {
    return text;
  }

  return text.replace(/,/g, '，').replace(/\./g, '。').replace(/\?/g, '？').replace(/!/g, '！').replace(/;/g, '；').replace(/:/g, '：').replace(/\(/g, '（').replace(/\)/g, '）');
};

/**
 * 函数：确保中文句子末尾有中文标点（默认追加全角句号）
 * - 若末尾为英文标点，统一替换为中文标点
 * - 若末尾无标点，则追加 "。"
 * @param {string} text 输入字符串
 * @returns {string} 处理后的字符串
 */
export const ensureChineseSentence = (text: string): string => {
  if (!text) {
    return text;
  }

  /**
   * 常量：t。
   */
  let t = text.trim();

  // 先整体替换为中文标点
  t = toChinesePunctuation(t);

  // 若末尾包含常见中文句末标点，保持；否则追加
  const end = t.slice(-1);
  /**
   * 函数：isEndPunct。
   */
  const isEndPunct = /[。！？；…]$/.test(end);
  if (isEndPunct) {
    return t;
  }

  // 若末尾是英文句末标点，替换为中文
  if (/[.!?;]$/.test(end)) {
    return t.slice(0, -1) + (end === '.' ? '。' : end === '?' ? '？' : end === '!' ? '！' : end === ';' ? '；' : end);
  }

  // 无标点 → 追加中文句号
  return `${t}。`;
};

/**
 * 函数：规范中文文本为一行，并将空格折叠为中文逗号（非句末）
 * 步骤：
 * 1. 去除换行 → 单行（替换为空格再折叠）
 * 2. 统一中文标点（英文标点替换为中文）
 * 3. 将所有空格替换为"，"并压缩连续逗号
 * 4. 清理句末的逗号，避免以"，"结尾
 * 5. 确保句末中文标点（默认追加"。"）
 */
export const normalizeChineseText = (text: string): string => {
  if (!text) {
    return text;
  }

  // 去换行 → 空格
  let t = text.replace(/\r?\n+/g, ' ').trim();

  // 合并多空格为一个
  t = t.replace(/\s+/g, ' ');

  // 统一中文标点
  t = toChinesePunctuation(t);

  // 空格替换为中文逗号，并压缩连续逗号
  t = t.replace(/ /g, '，').replace(/，{2,}/g, '，');

  // 避免"，。"、"，！"等组合，保留句末标点
  t = t.replace(/，([。！？；、])/g, '$1');

  // 删除句末逗号
  t = t.replace(/，$/, '');

  // 确保句末中文标点
  t = ensureChineseSentence(t);

  return t;
};
