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
