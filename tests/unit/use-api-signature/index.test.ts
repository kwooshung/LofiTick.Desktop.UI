import { describe, expect, it } from 'vitest';

import { useApiSignatureTestUtils } from '../../../../app/composables/hooks/useApi/index';

describe('useApi signature canonical rules', () => {
  it('normalizes lowercase pagesize to pageSize', () => {
    expect(useApiSignatureTestUtils.normalizeSignatureKey('pagesize')).toBe('pageSize');
    expect(useApiSignatureTestUtils.normalizeSignatureKey('page_size')).toBe('pageSize');
  });

  it('strips nested prefixes for signature path', () => {
    expect(useApiSignatureTestUtils.toBackendPathForSignature('/desktop')).toBe('/');
    expect(useApiSignatureTestUtils.toBackendPathForSignature('/desktop/settings/unattended/scenes')).toBe('/settings/unattended/scenes');
    expect(useApiSignatureTestUtils.toBackendPathForSignature('/crons/jobs/run')).toBe('/jobs/run');
    expect(useApiSignatureTestUtils.toBackendPathForSignature('/live/ping')).toBe('/ping');
  });

  it('parses query string inputs into signature params object', () => {
    const params = new URLSearchParams('title=%E8%AF%97&pagesize=5&author_ids=1&author_ids=2');

    expect(useApiSignatureTestUtils.toParamsObjectForSignature(params)).toEqual({
      title: '诗',
      pagesize: '5',
      author_ids: ['1', '2']
    });
  });

  it('canonicalizes page and pageSize values like backend request params', () => {
    expect(
      useApiSignatureTestUtils.canonicalizeParams({
        pagesize: '500',
        page: '0',
        title: '  春晓  '
      })
    ).toEqual({
      pageSize: '100',
      page: '1',
      title: '春晓'
    });
  });

  it('matches backend null and array serialization rules', () => {
    expect(useApiSignatureTestUtils.toSignatureJsStringOrNull({ key: 'title', value: null })).toBeNull();
    expect(useApiSignatureTestUtils.toSignatureJsStringOrNull({ key: 'tags', value: ['1', '02', null, { id: 1 }, true] })).toBe('1,02,null,[object Object],true');
    expect(useApiSignatureTestUtils.toSignatureJsStringOrNull({ key: 'enabled', value: ' yes ' })).toBe('true');
  });
});
