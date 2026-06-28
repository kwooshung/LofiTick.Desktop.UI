/**
 * 工具：爬虫 URL 解析与验证。
 *
 * 用于处理爬虫节点中完整 URL 与路径的转换和验证。
 */

/**
 * 接口：URL 解析结果。
 */
export interface IUrlParseResult {
  /**
   * 属性：是否成功。
   */
  success: boolean;

  /**
   * 属性：提取出的路径（仅包含路径部分，不含域名）。
   */
  path?: string;

  /**
   * 属性：错误信息（仅当 success=false 时有效）。
   */
  error?: string;

  /**
   * 属性：原始输入的 URL 或路径。
   */
  input: string;

  /**
   * 属性：是否为完整 URL（包含协议和域名）。
   */
  isFullUrl: boolean;

  /**
   * 属性：提取的域名（仅当是完整 URL 时有效）。
   */
  domain?: string;
}

/**
 * 函数：从完整 URL 或路径字符串中提取路径部分。
 *
 * 支持以下输入格式：
 * - `/path/to/resource` → `/path/to/resource`
 * - `https://example.com/path/to/resource` → `/path/to/resource`
 * - `http://example.com:8080/path/to/resource` → `/path/to/resource`
 * - `//example.com/path` → `/path`
 *
 * @param {string} input 用户输入的 URL 或路径。
 * @param {string} [expectedDomain] 期望的域名（不包括协议）。如提供，会验证输入的域名是否匹配。
 * @returns {IUrlParseResult} 解析结果。
 */
export const parseAndExtractUrlPath = (input: string, expectedDomain?: string): IUrlParseResult => {
  const trimmed = String(input ?? '').trim();

  // 处理空输入
  if (trimmed === '') {
    return {
      success: false,
      error: '路径不能为空',
      input: trimmed,
      isFullUrl: false
    };
  }

  // 检测是否为完整 URL（含协议或 //）
  const isFullUrlMatch = /^(https?:)?\/\//.test(trimmed);

  // 情形 1: 完整 URL，需要提取路径
  if (isFullUrlMatch) {
    try {
      // 补全协议以便 URL 构造
      const urlStr = /^https?:\/\//.test(trimmed) ? trimmed : `https:${trimmed}`;
      const url = new URL(urlStr);
      const domain = url.hostname + (url.port ? `:${url.port}` : '');
      const path = url.pathname + url.search + url.hash;

      // 如果指定了期望的域名，验证匹配
      if (expectedDomain) {
        const expectedNorm = expectedDomain.toLowerCase().trim();
        const actualNorm = domain.toLowerCase();

        if (expectedNorm !== actualNorm) {
          return {
            success: false,
            error: `域名不匹配：期望 "${expectedDomain}"\n，实际 "${domain}"`,
            input: trimmed,
            isFullUrl: true,
            domain
          };
        }
      }

      return {
        success: true,
        path: path || '/',
        input: trimmed,
        isFullUrl: true,
        domain
      };
    } catch (err) {
      return {
        success: false,
        error: `URL 格式无效：${String(err)}`,
        input: trimmed,
        isFullUrl: true
      };
    }
  }

  // 情形 2: 仅为路径（相对路径或绝对路径）
  if (trimmed.startsWith('/')) {
    return {
      success: true,
      path: trimmed,
      input: trimmed,
      isFullUrl: false
    };
  }

  // 情形 3: 既不是完整 URL 也不是路径，报错
  return {
    success: false,
    error: '路径应以 "/" 开头，或为完整 URL',
    input: trimmed,
    isFullUrl: false
  };
};

/**
 * 函数：检验路径合法性（仅检验格式，不解析域名）。
 *
 * @param {string} input 路径字符串。
 * @returns {boolean} 是否合法。
 */
export const isValidPath = (input: string): boolean => {
  const trimmed = String(input ?? '').trim();
  return trimmed === '' || trimmed.startsWith('/') || /^https?:\/\//.test(trimmed) || /^\/\//.test(trimmed);
};
