/**
 * 接口：HTTP 请求表单键值对。
 */
export interface IHttpRequestFormPair {
  /**
   * 属性：行 ID。
   */
  id: string;

  /**
   * 属性：键。
   */
  key: string;

  /**
   * 属性：值。
   */
  value: string;
}

/**
 * 接口：HTTP 请求通用键值对。
 */
export interface IHttpRequestKeyValuePair {
  /**
   * 属性：行 ID。
   */
  id: string;

  /**
   * 属性：键。
   */
  key: string;

  /**
   * 属性：值。
   */
  value: string;
}
