/**
 * 接口：爬虫任务执行请求参数。
 */
export interface ICrawlerTaskExecuteRequestPayload {
  /**
   * 属性：Pixabay 目标地址。
   */
  url: string;

  /**
   * 属性：爬虫类型。
   */
  type: string;

  /**
   * 属性：搜索关键词。
   */
  keyword: string;

  /**
   * 属性：页码。
   */
  page: number;
}

/**
 * 接口：爬虫任务执行请求。
 */
export interface ICrawlerTaskExecuteRequest {
  /**
   * 属性：任务类型。
   */
  task: string;

  /**
   * 属性：请求标识。
   */
  requestId?: string;

  /**
   * 属性：任务参数。
   */
  payload: ICrawlerTaskExecuteRequestPayload;
}

/**
 * 接口：爬虫任务受理结果。
 */
export interface ICrawlerTaskExecuteAccepted {
  /**
   * 属性：本地任务标识。
   */
  taskId: string;

  /**
   * 属性：请求标识。
   */
  requestId: string;

  /**
   * 属性：任务类型。
   */
  task: string;

  /**
   * 属性：受理时间戳（单位：毫秒）。
   */
  acceptedAtMs: number;
}

/**
 * 接口：爬虫 WebView 状态。
 */
export interface ICrawlerTaskWebviewState {
  /**
   * 属性：当前任务对应的 WebView 任务 ID。
   */
  taskId: string;

  /**
   * 属性：当前任务对应的 WebView 是否可见。
   */
  visible: boolean;
}
