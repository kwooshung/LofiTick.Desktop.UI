/**
 * 接口：Tauri 直连 API 请求输入。
 * 描述：对应 Desktop 壳侧 `api_client_request` 命令的 input 参数。
 */
export interface IApiClientRequestInput {
  /**
   * HTTP 方法（建议大写）。
   */
  method: string;

  /**
   * 后端 path（必须以 / 开头，且需命中壳侧白名单）。
   */
  path: string;

  /**
   * Query 参数（可选）。
   */
  query?: Record<string, unknown>;

  /**
   * Body 参数（可选）。
   */
  body?: Record<string, unknown>;

  /**
   * 业务参数 datas（可选）。
   */
  datas?: Record<string, unknown>;
}

/**
 * 接口：Tauri 直连 API 请求输出。
 * 描述：对应 Desktop 壳侧 `api_client_request` 命令的返回值。
 */
export interface IApiClientRequestOutput {
  /**
   * HTTP 状态码。
   */
  http: number;

  /**
   * 后端响应 JSON。
   */
  json: unknown;
}
