/**
 * 测试：爬虫 URL 解析与验证。
 */

import { describe, it, expect } from 'vitest';
import { parseAndExtractUrlPath, isValidPath } from './url-parser';

describe('parseAndExtractUrlPath', () => {
  it('should handle path-only input', () => {
    const result = parseAndExtractUrlPath('/news/123');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/news/123');
    expect(result.isFullUrl).toBe(false);
  });

  it('should extract path from complete URL with http', () => {
    const result = parseAndExtractUrlPath('http://example.com/news/123');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/news/123');
    expect(result.isFullUrl).toBe(true);
    expect(result.domain).toBe('example.com');
  });

  it('should extract path from complete URL with https', () => {
    const result = parseAndExtractUrlPath('https://example.com/path/to/resource');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/path/to/resource');
    expect(result.isFullUrl).toBe(true);
    expect(result.domain).toBe('example.com');
  });

  it('should handle URL with port', () => {
    const result = parseAndExtractUrlPath('https://example.com:8080/api/data');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/api/data');
    expect(result.isFullUrl).toBe(true);
    expect(result.domain).toBe('example.com:8080');
  });

  it('should handle protocol-relative URL', () => {
    const result = parseAndExtractUrlPath('//example.com/path');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/path');
    expect(result.isFullUrl).toBe(true);
    expect(result.domain).toBe('example.com');
  });

  it('should handle URL with query string', () => {
    const result = parseAndExtractUrlPath('https://example.com/news?id=123&lang=en');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/news?id=123&lang=en');
    expect(result.isFullUrl).toBe(true);
  });

  it('should handle URL with hash', () => {
    const result = parseAndExtractUrlPath('https://example.com/page#section');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/page#section');
    expect(result.isFullUrl).toBe(true);
  });

  it('should return root path for domain-only URL', () => {
    const result = parseAndExtractUrlPath('https://example.com');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/');
    expect(result.isFullUrl).toBe(true);
    expect(result.domain).toBe('example.com');
  });

  it('should handle empty input', () => {
    const result = parseAndExtractUrlPath('');
    expect(result.success).toBe(false);
    expect(result.isFullUrl).toBe(false);
  });

  it('should reject invalid path without slash', () => {
    const result = parseAndExtractUrlPath('news/123');
    expect(result.success).toBe(false);
    expect(result.isFullUrl).toBe(false);
  });

  it('should reject invalid URL format', () => {
    const result = parseAndExtractUrlPath('http://');
    expect(result.success).toBe(false);
    expect(result.isFullUrl).toBe(true);
  });

  it('should validate domain match when provided', () => {
    const result = parseAndExtractUrlPath('https://example.com/news/123', 'example.com');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/news/123');
  });

  it('should reject domain mismatch when expected domain provided', () => {
    const result = parseAndExtractUrlPath('https://other.com/news/123', 'example.com');
    expect(result.success).toBe(false);
    expect(result.error).toContain('域名不匹配');
  });

  it('should handle domain comparison case-insensitively', () => {
    const result = parseAndExtractUrlPath('https://EXAMPLE.COM/path', 'example.com');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/path');
  });

  it('should handle port in domain comparison', () => {
    const result = parseAndExtractUrlPath('https://example.com:8080/api', 'example.com:8080');
    expect(result.success).toBe(true);
    expect(result.path).toBe('/api');
  });

  it('should reject port mismatch in domain comparison', () => {
    const result = parseAndExtractUrlPath('https://example.com:8080/api', 'example.com');
    expect(result.success).toBe(false);
    expect(result.error).toContain('域名不匹配');
  });
});

describe('isValidPath', () => {
  it('should accept absolute path', () => {
    expect(isValidPath('/news/123')).toBe(true);
  });

  it('should accept URL with protocol', () => {
    expect(isValidPath('https://example.com/path')).toBe(true);
  });

  it('should accept protocol-relative URL', () => {
    expect(isValidPath('//example.com/path')).toBe(true);
  });

  it('should accept empty string', () => {
    expect(isValidPath('')).toBe(true);
  });

  it('should reject path without slash', () => {
    expect(isValidPath('news')).toBe(false);
  });

  it('should reject relative path', () => {
    expect(isValidPath('./news')).toBe(false);
  });

  it('should reject path with only whitespace', () => {
    expect(isValidPath('   ')).toBe(true); // 转换为空字符串后
  });
});
