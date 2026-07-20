/**
 * 类型：Pixabay 爬取地址键。
 */
export type TPixabayCrawlerType = 'photos' | 'illustrations' | 'vectors' | 'videos' | 'gifs' | '3d-models' | 'music' | 'sound-effects';

/**
 * 接口：Pixabay 爬取地址选项。
 */
export interface IPixabayCrawlerOption {
  /**
   * 属性：选项标题。
   */
  label: string;

  /**
   * 属性：选项值。
   */
  value: TPixabayCrawlerType;

  /**
   * 属性：对应网址模板。
   */
  url: string;

  /**
   * 属性：是否禁用。
   */
  disabled?: boolean;
}

/**
 * 接口：Pixabay 爬取缓存项。
 */
export interface IPixabayCrawlerCacheItem {
  /**
   * 属性：搜索关键词。
   */
  keyword: string;

  /**
   * 属性：最小时长（单位：秒）。
   */
  minDurationSeconds: number;

  /**
   * 属性：页码。
   */
  page: number;
}

/**
 * 接口：Pixabay 爬取缓存存储。
 */
export interface IPixabayCrawlerCacheStore {
  /**
   * 属性：按地址键分桶的缓存。
   */
  items: Partial<Record<TPixabayCrawlerType, IPixabayCrawlerCacheItem>>;
}

/**
 * 接口：Pixabay 任务组件属性。
 */
export interface ICrawlersTaskPixabayProps {
  /**
   * 属性：任务执行弹窗是否打开。
   */
  dialogOpen: boolean;

  /**
   * 属性：当前任务是否正在执行。
   */
  taskExecuting: boolean;

  /**
   * 属性：当前 Pixabay 爬虫浏览器会话任务 ID。
   */
  browserSessionTaskId: string;
}

/**
 * 类型：Pixabay 任务组件事件。
 */
export interface ICrawlersTaskPixabayEmits {
  /**
   * 事件：更新任务执行弹窗打开状态。
   * @param {boolean} value 是否打开
   */
  (event: 'update:dialogOpen' | 'update:taskExecuting', value: boolean): void;

  /**
   * 事件：更新当前 Pixabay 爬虫浏览器会话任务 ID。
   * @param {string} value 任务 ID
   */
  (event: 'update:browserSessionTaskId', value: string): void;
}

/**
 * 接口：Pixabay 任务失败上下文。
 */
export interface ICrawlersTaskPixabayFailureContext {
  /**
   * 属性：失败步骤。
   */
  step: string;

  /**
   * 属性：失败原因。
   */
  error: string;
}

/**
 * 接口：Pixabay 任务暴露方法。
 */
export interface ICrawlersTaskPixabayExposed {
  /**
   * 函数：同步失败上下文并打开失败弹窗。
   * @param {ICrawlersTaskPixabayFailureContext} context 失败上下文。
   * @returns {void} 无返回值。
   */
  openFailure(context: ICrawlersTaskPixabayFailureContext): void;

  /**
   * 函数：继续等待失败步骤。
   * @returns {Promise<void>} 无返回值。
   */
  continueFailure(): Promise<void>;

  /**
   * 函数：终止失败任务。
   * @returns {Promise<void>} 无返回值。
   */
  stopFailure(): Promise<void>;
}
